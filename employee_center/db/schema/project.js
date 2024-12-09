import { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    projectId: { type: Number, unique: true, required: true },
    name: { type: String, required: true },
  },
  {
    collection: "project",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export default projectSchema;
