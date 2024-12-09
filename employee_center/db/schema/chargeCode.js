import { Schema } from "mongoose";

const chargeCodeSchema = new Schema(
  {
    chargeCodeId: { type: Number, index: true, unique: true, required: true },
    projectId: { type: Number, required: true },
    code: { type: String, required: true },
    descr: { type: String, required: true },
    hours: { type: Number, required: true },
    originalHours: { type: Number, required: true },
    additionalHours: { type: Number, required: true },
    rate: { type: Number, required: true },
  }, 
  {
    collection: "chargeCode",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export default chargeCodeSchema;
