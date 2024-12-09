import { join } from "node:path";
import { existsSync } from "node:fs";
import https from "node:https";
import { writeFile } from "node:fs/promises";
import { makeDirectory } from "make-dir";

const BASE_URL = "https://cdn.jsdelivr.net";

let baseUrlTemporary = BASE_URL;

let mainPackages = [];
let downloadCount = 0;

export default class PackageDownload {
  baseUrl;
  visitedUrls;
  isInitial;
  base_npm_dir;
  isDeeplyNested;
  base_dir;
  runCount;
  pkgName;
  constructor(baseUrl, base_dir = "./new_node_modules") {
    this.baseUrl = baseUrl;
    this.visitedUrls = [];
    this.isInitial = true;
    this.isDeeplyNested = false;
    this.base_dir = base_dir;
    this.pkgName = "";
  }

  checkPathAndNesting = (path) => {
    if (path.includes("/")) this.isDeeplyNested = true;
    if (path.split("@").length > 0 && !path.startsWith("@")) {
      path = path.split("@")[0];
    }
    if (this.isDeeplyNested && path.includes("@")) {
      path = path
        .split("@")
        .filter((x, i) => i < 2)
        .join("@");
    }
    return path;
  };

  checkIfExists = (path) => existsSync(path);

  createFolder = async (path) => {
    if (this.isInitial) {
      this.pkgName = path;
      path = this.checkPathAndNesting(path);
      if (!this.checkIfExists(join(this.base_dir, path))) {
        const folder = await makeDirectory(join(this.base_dir, path));
        this.base_npm_dir = folder;
        this.isInitial = false;
        return this.base_npm_dir;
      }
      this.base_npm_dir = join(this.base_dir, path);
      this.isInitial = false;
      return this.base_npm_dir;
    }

    let newPath = join(this.base_npm_dir, ...path);

    if (!existsSync(newPath)) {
      try {
        newPath = await makeDirectory(newPath);
        return newPath;
      } catch (err) {
        console.dir(err);
      }
    }
    return newPath;
  };

  findDataOrLinks = async (result, prompt) => {
    let file = [];
    let urlLinks = [];
    const regex = /href/g;

    if (!prompt.endsWith("/")) {
      file.push(result);
    } else {
      const found = [...result.matchAll(regex)];

      if (found.length > 0) {
        let newTest = /^\/npm/;
        found.map((x) => {
          const substring = x.input.substring(
            x.index + 6,
            x.input.indexOf('"', x.index + 7)
          );
          let result = substring.match(newTest);
          if (result) {
            substring.length < 200 && substring.length > 8
              ? urlLinks.push(substring)
              : "";
          }
        });
      }
    }
    return {
      urlLinks,
      file,
    };
  };
  download = async (prompt, pathOfFolder = null) => {
    mainPackages.push(prompt);
    const execute = async (prompt, pathOfFolder = null) => {
      let rawData = "";
      baseUrlTemporary = BASE_URL;

      if (!prompt.includes("/npm")) {
        baseUrlTemporary += "/npm/";
        prompt += "/";
      } else {
        baseUrlTemporary = BASE_URL;
      }

      const req = await https
        .get(baseUrlTemporary + prompt, async (res) => {
          res.on("data", async (d) => {
            const decoder = new TextDecoder("utf-8");
            const result = decoder.decode(d);
            rawData += result;
          });
          res.on("end", async (d) => {
            const { file, urlLinks } = await this.findDataOrLinks(
              rawData,
              prompt
            );
            if (file !== undefined && file.length > 0) {
              this.visitedUrls.push(prompt);
              let split = prompt.split("/");
              let indexOfBase = split.findIndex((x) =>
                this.isDeeplyNested
                  ? x.includes(this.pkgName.split("/")[1])
                  : x.includes(this.pkgName)
              );
              let fileName = split.filter(
                (item, index, arr) => index > indexOfBase
              );
              let folderName = split.filter(
                (item, index, arr) =>
                  index > indexOfBase && index < arr.length - 1
              );

              await this.createFolder(folderName);

              let filePath = prompt.split("/");
              if (filePath[filePath.length - 1] !== "") {
                try {
                  await writeFile(
                    join(this.baseUrl, ...fileName),
                    file.join("")
                  );
                } catch (err) {
                  console.log("got into err");
                  console.dir(err);
                }
                if (filePath[filePath.length - 1] === "package.json") {
                  try {
                    let pkg = JSON.parse(file.join(""));
                    if (
                      pkg &&
                      pkg !== undefined &&
                      pkg.hasOwnProperty("dependencies")
                    ) {
                      let pkgArray = Object.entries(pkg.dependencies).map(
                        ([p, v]) => {
                          v = v.replace(/[\*\^\~]/, "");
                          v = v.split(" ")[0];
                          if (v === "") {
                            return p;
                          }
                          return `${p}@${v}`;
                        }
                      );
                      downloadCount += pkgArray.length;
                      while (pkgArray.length) {
                        let depPkgBuilder = new PackageDownload("");
                        this.visitedUrls.push(pkgArray[0]);

                        let newPath = this.checkPathAndNesting(pkgArray[0]);
                        if (this.checkIfExists(join(this.base_dir, newPath))) {
                          pkgArray.shift();
                          downloadCount--;
                          continue;
                        }
                        let depInitialPath = await depPkgBuilder.createFolder(
                          pkgArray[0]
                        );
                        depPkgBuilder.baseUrl = depInitialPath;

                        await depPkgBuilder.download(
                          pkgArray[0],
                          depInitialPath
                        );
                        downloadCount--;
                        pkgArray.shift();
                      }
                    }
                  } catch (err) {
                    return;
                  }
                }
                return;
              }
              return;
            }
            if (urlLinks !== undefined && !!urlLinks.length) {

              let sorted = urlLinks.filter(x => {
                const beginning = x.slice(0, x.lastIndexOf('@'))
                const ending = x.slice(x.lastIndexOf('@'));
                return !(ending.length <= 7 && beginning.endsWith(this.pkgName));
              }).sort((a) => (a.endsWith("/") ? 1 : -1));
              downloadCount += sorted.length;
              while (sorted.length) {
                if (!this.visitedUrls.includes(sorted[0])) {
                  this.visitedUrls.push(sorted[0]);
                  await execute(sorted[0], pathOfFolder);
                }
                sorted.shift();
                downloadCount--;
              }
              return;
            } else {
              return;
            }
          });
        })
        .on("error", (e) => {
          console.error(e);
        });
    };
    execute(prompt, pathOfFolder);
  };
}
