import { Schema } from "mongoose";

const paycheckSchema = new Schema(
  {
    payCheckId: { type: Number, required: true, unique: true },
    employeeId: { type: Number, required: true },
    name: { type: String, required: true },
    week: { type: String, required: true },
    processedOn: { type: String, required: true },
    batchId: { type: String, required: true },
    totalPay: { type: Number, required: true },
    medicalCost: Number,
    basePay: { type: Number, required: true },
    taxes: { type: Number, required: true },
    socialSecurity: { type: Number, required: true },
    stockContribution: { type: Number, required: true },
    ssn: { type: String, required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    employeeAddress: Object,
  },
  {
    collection: "paycheck",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export default paycheckSchema;
