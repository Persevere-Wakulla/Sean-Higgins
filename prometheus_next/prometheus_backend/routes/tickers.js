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

export const getCryptoCloses = async () => {
  const tickers = await tickersModel.find().select("symbol").lean();

  const cryptos = tickers.filter(x => x.symbol.endsWith('USD')).map((x) => x.symbol);

  try {
    for (let index = 0; index < cryptos.length; index++) {
      const pauseTime = new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
      const crypto = cryptos[index];
      console.dir(crypto);
      await retrieveStockerTickerData(crypto.symbol);
      await pauseTime;
    }
  } catch (err) {
    console.dir(err);
  }
}

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

export const retrieveStockerTickerData = async (symbol) => {
  const res = await fetch(`http://192.168.1.45:3000/stocks/${symbol}`);
  const body = await res.text();
  if (!body.includes("Unknown symbol")) {
    try{
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
    }
    catch(err){
      console.dir(err);
    }
  }else{
    console.log('something failed')
  }
};

tickersRouter.get("/", async (req, res, next) => {
  await getPrevDayCloses();
  res.send({
    message: "Updated with previous days close",
  });
});

tickersRouter.get("/:symbol", async (req, res, next) => {
  await retrieveStockerTickerData(req.params.symbol.toUpperCase())
  res.send({
    message: `Updated data for ${req.params.symbol}`
  })
})

export default tickersRouter;
