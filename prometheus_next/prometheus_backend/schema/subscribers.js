import { model, Schema } from "mongoose";

const subscribersSchema = new Schema(
  {
    username: String,
    password: String,
    
  }
);

const tickersModel = new model('tickers', tickersSchema)

export default tickersModel;
