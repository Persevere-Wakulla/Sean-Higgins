import { model, Schema } from "mongoose";
const monitorSchema = new Schema(
  {
    symbol: String
  }, {
    collection: 'monitor'
  }
);

const monitorModel = new model('monitor', monitorSchema)

export default monitorModel;
