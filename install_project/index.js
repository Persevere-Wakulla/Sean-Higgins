import { intro, cancel, text, isCancel } from "@clack/prompts";
import PackageDownload from "./packageDownload.js";

const main = async () => {
  intro(`NPM package downloader - bypassing that pesky registry`);
  const packageInput = await text({
    message: "What package would you like to download",
    placeholder: "npm package name",
    validate(value) {
      if (value.length === 0) return "Package name is required";
    },
  });
  if (isCancel(packageInput)) {
    cancel("Operation cancelled");
    process.exit(0);
  }
  let pkgBuilder = new PackageDownload("");
  let initalPath = await pkgBuilder.createFolder(packageInput);
  pkgBuilder.baseUrl = initalPath;
  
  console.log('Processing Downloads')
  await pkgBuilder.download(packageInput, initalPath);
};

await main();



// import csvToJson from 'convert-csv-to-json';

// let fileInputName = 'me.csv'; 
// let fileOutputName = 'me.json';

// csvToJson.generateJsonFileFromCsv(fileInputName,fileOutputName);
