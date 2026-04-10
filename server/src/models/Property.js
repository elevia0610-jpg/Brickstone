import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["Buy", "Rent", "Lease"],
    },
    propertyType: { type: String, required: true, trim: true },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    area: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    highlights: [{ type: String, trim: true }],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Property = mongoose.model("Property", propertySchema);
