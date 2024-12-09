import { Schema } from "mongoose";

const daySchema = new Schema({
  date: String,
  start: String,
  end: String,
  break: String,
  total: Number,
  chargeCode: String,
  id: String,
});

const timesheetSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    timesheetId: { type: Number, required: true },
    employeeId: { type: Number, required: true },
    routedTo: { type: Number, required: true },
    status: { type: String, required: true },
    weekId: { type: String, required: true },
    days: Array,
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    collection: "timesheet",
  }
);

export default timesheetSchema;
