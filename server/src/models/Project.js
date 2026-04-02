import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    status: {
      type: String,
      required: true,
      enum: ["Ongoing", "Completed"],
    },
    type: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    highlights: [{ type: String, trim: true }],
    image: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
