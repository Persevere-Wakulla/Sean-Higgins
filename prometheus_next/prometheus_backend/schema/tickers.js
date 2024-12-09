import { model, Schema } from "mongoose";

const tickersSchema = new Schema(
  {
    symbol: String,
    name: String,
    industry: String,
    sector: String,
    lastsale: String
  }
);

const tickersModel = new model('tickers', tickersSchema)

export default tickersModel;
