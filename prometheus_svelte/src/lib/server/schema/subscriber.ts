import { model, Schema } from "mongoose";
import { connectDB, getModel } from "../database";

const subscriberSchema = new Schema(
  {
    email: String,
    username: String,
    subscriberInfo: {
      fName: String,
      lName: String
    },
    password: String,
    watching: Array,
    stocksOwned: Array,
    liquidCash: Number
  }
);

export default async function getSubscriberModel(){
  return getModel('subscriber', subscriberSchema);
}
