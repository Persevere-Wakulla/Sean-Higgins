import { Schema } from "mongoose";
import { getModel } from "../database";

const subscriberTradeOrderSchema = new Schema(
  {
    subscriber: {
        type: Schema.Types.ObjectId,
        ref: 'subscriber'
    },
    symbol: String,
    tradeOrderId: String,
    datePlaced: Date,
    goodTillDate: Date,
    goodTillType: Number,
    expired: Boolean,
    shares: Number,
    price: Number,
    executed: Boolean,
    tradeType: String,
    action: String,
    ticker: {
        type: Schema.Types.ObjectId,
        ref: 'tickers'
    },
  }
);

export default async function getSubscriberTradeOrderModel(){
  return getModel('subscriberTradeOrder', subscriberTradeOrderSchema);
}

