import { model, Schema } from "mongoose";
import { getModel } from "../database";

const tickersSchema = new Schema(
  {
    symbol: String,
    name: String,
    industry: String,
    sector: String,
    lastsale: String
  }
);

export default async function getTickersModel(){
  return getModel('tickers', tickersSchema);
}
