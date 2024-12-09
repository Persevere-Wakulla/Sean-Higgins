import { model, Schema } from "mongoose";
import { getModel } from "../database";
const watchingSchema = new Schema(
  {
    userId: String,
    symbol: String,
    name: String,
    industry: String,
    sector: String,
    lastsale: String
  }
);

export default async function getWatchingModel(){
  return getModel('watching', watchingSchema);
}