import { model, Schema } from "mongoose";

const historySchema = new Schema(
  {
    symbol: String,
    date: String,
    latestVolume: Number,
    previousClose: Number,
    volume: Number,
    low: Number,
    high: Number,
    latestPrice: Number,
    close: Number,
    open: Number,
    changePercent: Number,
    change: Number,
  }
);

const historyModel = new model('history', historySchema)

export default historyModel;
