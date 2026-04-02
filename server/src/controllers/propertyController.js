import { validationResult } from "express-validator";
import { Property } from "../models/Property.js";
import { toClientDoc, toClientList } from "../utils/serialize.js";

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, msg: e.msg })),
    });
    return false;
  }
  return true;
}

export async function createProperty(req, res) {
  if (!handleValidation(req, res)) return;
  try {
    const doc = await Property.create(req.body);
    res.status(201).json(toClientDoc(doc));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create property" });
  }
}

export async function getProperties(_req, res) {
  try {
    const list = await Property.find().sort({ createdAt: -1 }).exec();
    res.json(toClientList(list));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
}

export async function getPropertyById(req, res) {
  try {
    const doc = await Property.findById(req.params.id).exec();
    if (!doc) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(toClientDoc(doc));
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid property id" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to fetch property" });
  }
}

export async function updateProperty(req, res) {
  if (!handleValidation(req, res)) return;
  try {
    const doc = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).exec();
    if (!doc) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(toClientDoc(doc));
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid property id" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to update property" });
  }
}

export async function deleteProperty(req, res) {
  try {
    const doc = await Property.findByIdAndDelete(req.params.id).exec();
    if (!doc) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json({ message: "Property deleted", id: req.params.id });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid property id" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to delete property" });
  }
}
