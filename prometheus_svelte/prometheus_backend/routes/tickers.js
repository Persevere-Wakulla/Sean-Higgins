import express from "express";
import tickersModel from "../schema/tickers.js";
import historyModel from "../schema/history.js";
import monitorModel from "../schema/monitor.js";
import http from "node:http";

const tickersRouter = express.Router();

const pauseTime = new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, 5000);
});

export const getPrevDayCloses = async () => {
  const tickers = await tickersModel.find().select("symbol").lean();

  const symbols = tickers.map((x) => x.symbol).filter((x) => !x.includes("^") && !x.includes("/"));
  // const tickers = await monitorModel.find().lean();
  // const symbols = tickers.map(x => x.symbol);
  try {
    for (let index = 0; index < symbols.length; index++) {
      const pauseTime = new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
      const symbol = symbols[index];
      console.dir(symbol);
      await retrieveStockerTickerData(symbol);
      await pauseTime;
    }
  } catch (err) {
    console.dir(err);
  }
};

const retrieveStockerTickerData = async (symbol) => {
  const res = await fetch(`http://192.168.1.45:3000/stocks/${symbol}`);
  const body = await res.text();
  if (!body.includes("Unknown symbol")) {
    const json = JSON.parse(
      body.slice(0, body.lastIndexOf('"')).replace('"', "").replaceAll("\\", "")
    );
    const existing = await historyModel.findOne({
      symbol: symbol,
      date: json.latestTime,
    });
    if (!existing) {
      const historyInsert = new historyModel({
        ...json,
        date: json.latestTime,
      });
      await historyInsert.save();
    }
  }else{
    console.log('something failed')
  }
};

tickersRouter.get("/", async (req, res, next) => {
  await getPrevDayCloses();
  // const getData = [
  //   "NFLX",
  //   "MBLY",
  //   "SNAP",
  //   "ARKF",
  //   "ARKG",
  //   "COIN",
  //   "SNOW",
  //   "MTAL",
  //   "WKHS",
  //   "SOFI",
  //   "RKT",
  //   "NKLA",
  //   "NU",
  //   "SGML",
  //   "JACK",
  //   "EBAY",
  //   "SHOP",
  //   "SPY",
  //   "QQQ",
  //   "HON",
  //   "BYND",
  //   "HOOD",
  //   "MMM",
  //   "XRPUSD",
  //   "SOLUSD",
  //   "BA",
  //   "RDDT",
  //   "COIN",
  //   "BITF",
  //   "BTCUSD",
  //   "ETHUSD",
  //   "MARA",
  //   "ARKK",
  //   "NIO",
  //   "NYCB",
  //   "JMIA",
  //   "PTON",
  //   "NVDA",
  //   "AAPL",
  //   "LAC",
  //   "MSFT",
  //   "NNDM",
  //   "PLTR",
  //   "BLDE",
  //   "BK",
  //   "KO",
  //   "DAL",
  //   "GS",
  //   "M",
  //   "RIOT",
  //   "LUV",
  //   "MCC",
  //   "UAL",
  //   "USB",
  //   "WFC",
  //   "TSLA",
  //   "INTC",
  //   "AMD",
  //   "CHWY",
  //   "GME",
  //   "WBA",
  //   "AMC"
  // ];
  // const tickers = await tickersModel.find().select('symbol').lean()
  // const symbols = tickers.map(x => x.symbol)
  // symbols.filter(x => !x.includes('^')).forEach((x) => {
  //   setTimeout(() => {
  //     try {
  //       http.get(`http://192.168.1.45:3000/stocks/${x}`, (res) => {
  //         res.on("data", async (d) => {
  //           const decoder = new TextDecoder("utf-8");

  //           const result = decoder.decode(d);
  //           const json = JSON.parse(
  //             result
  //               .slice(0, result.lastIndexOf('"'))
  //               .replace('"', "")
  //               .replaceAll("\\", "")
  //           );
  //           const existing = await historyModel.findOne({
  //             symbol: json.symbol,
  //             date: json.latestTime,
  //           })
  //           if (!existing) {
  //             const historyInsert = new historyModel({
  //               ...json,
  //               date: json.latestTime
  //             });
  //             await historyInsert.save();
  //           }
  //         });
  //       });
  //     } catch (err) {
  //       console.dir(err);
  //     }
  //   }, 150);
  // });
  res.send({
    message: "Updated with previous days close",
  });
});

export default tickersRouter;
