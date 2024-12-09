import { Schema } from "mongoose";

const medicalSchema = new Schema(
  {
    medicalId: { type: Number, unique: true, required: true },
    name: { type: String, required: true },
    hasDeductable: { type: Boolean, required: true },
    monthlyCost: { type: Number, required: true },
    spouseCost: {type: Number},
    dependentsCost: Number,
    copayments: {
        type: Object
    },
    deductibleAmount: {type: Number, default: 0},
    descr: String,
    benefitsDetails: String
  },
  {
    collection: "medical",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export default medicalSchema;
