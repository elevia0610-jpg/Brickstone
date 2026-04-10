import { validationResult } from "express-validator";
import { Property } from "../models/Property.js";
import { toClientDoc, toClientList } from "../utils/serialize.js";

function normalizePropertyPayload(req) {
  const payload = { ...req.body };

  if (req.file?.path) {
    payload.image = req.file.path;
  }

  if (payload.bedrooms != null) payload.bedrooms = Number(payload.bedrooms);
  if (payload.bathrooms != null) payload.bathrooms = Number(payload.bathrooms);
  if (payload.highlights) {
    if (typeof payload.highlights === "string") {
      try {
        payload.highlights = JSON.parse(payload.highlights);
      } catch {
        payload.highlights = [payload.highlights];
      }
    }
  }
  if (payload.featured != null) {
    payload.featured =
      payload.featured === true ||
      payload.featured === "true" ||
      payload.featured === "1";
  }
  return payload;
}

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
    const doc = await Property.create(normalizePropertyPayload(req));
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
    const doc = await Property.findByIdAndUpdate(
      req.params.id,
      normalizePropertyPayload(req),
      {
      new: true,
      runValidators: true,
      }
    ).exec();
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
