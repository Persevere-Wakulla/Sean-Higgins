import {  Schema } from "mongoose";
import { connectDB, getModel } from "../database";

interface IHistory {
  symbol: string,
  date: string,
  latestVolume: number,
  previousClose: number,
  volume: number,
  low: number,
  high: number,
  latestPrice: number,
  close: number,
  open: number,
  changePercent: number,
  change: number,
}

const historySchema = new Schema<IHistory>(
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

export default async function getHistoryModel(){
  return getModel('history', historySchema);
}

