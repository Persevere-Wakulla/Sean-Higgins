import { model, Schema } from "mongoose";
import { getModel } from "../database";

const subscriberExecutedTradeSchema = new Schema(
  {
    subscriber: {
        type: Schema.Types.ObjectId,
        ref: 'subscriber'
    },
    symbol: String,
    tradeBatchId: String,
    dateExecuted: Date,
    shares: Number,
    price: Number,
    isLiquidation: Boolean,
    tradeType: String,
    ticker: {
        type: Schema.Types.ObjectId,
        ref: 'ticker'
    },
    action: String
  }
);

export default async function getSubscriberExecutedTradeModel(){
  return getModel('subscriberExecutedTrade', subscriberExecutedTradeSchema);
}

