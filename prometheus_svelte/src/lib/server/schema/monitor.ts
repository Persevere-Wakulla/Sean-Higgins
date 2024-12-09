import { model, Schema } from "mongoose";
import { connectDB, getModel } from "../database";
const monitorSchema = new Schema(
  {
    symbol: String
  }, {
    collection: 'monitor'
  }
);


export default async function getMonitorModel(){
  return getModel('monitor', monitorSchema);
}
