import { validationResult } from "express-validator";
import { Property } from "../models/Property.js";
import { toClientDoc, toClientList } from "../utils/serialize.js";

function parseJsonArray(value) {
  if (value == null) return null;
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return null;
  const t = value.trim();
  if (!t) return [];
  try {
    const parsed = JSON.parse(t);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return t
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }
}

function normalizePropertyPayload(req) {
  const payload = { ...req.body };
  const uploadedImages = (req.files?.images || []).map(
    (f) => f.path || f.secure_url || f.url
  );

  const uploadedVideo =
    req.files?.video?.[0]?.path ||
    req.files?.video?.[0]?.secure_url ||
    req.files?.video?.[0]?.url ||
    null;
  const existingImages = parseJsonArray(payload.existingImages) || null;
  const bodyImages = parseJsonArray(payload.images) || null;

  const legacyImage =
    typeof payload.image === "string" ? payload.image.trim() : "";

  let images = [];

  if (existingImages) images = existingImages;
  else if (bodyImages) images = bodyImages;
  else if (legacyImage) images = [legacyImage];

  images = [...images, ...uploadedImages]
    .map((img) => String(img))
    .filter(Boolean);

  images = Array.from(new Set(images)); 

  payload.images = images;

  let video = null;

  if (uploadedVideo) {
    video = uploadedVideo;
  }

  else if (
    typeof payload.existingVideo === "string" &&
    payload.existingVideo.trim()
  ) {
    video = payload.existingVideo.trim();
  }

  else if (typeof payload.video === "string" && payload.video.trim()) {
    video = payload.video.trim();
  }

  if (video) {
    payload.video = video;
  } else {
    delete payload.video; 
  }

  delete payload.image;
  delete payload.existingImages;
  delete payload.existingVideo;

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
  console.log("FILES:", req.files);
  console.log("BODY:", req.body);
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
    const normalized = normalizePropertyPayload(req);
    const doc = await Property.create(normalized);
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
    const existing = await Property.findById(req.params.id).exec();
    if (!existing) {
      return res.status(404).json({ message: "Property not found" });
    }

    const normalized = normalizePropertyPayload(req);

    // If client didn't send any images, keep existing images.
    if (!normalized.images || normalized.images.length === 0) {
      normalized.images = Array.isArray(existing.images)
        ? existing.images
        : existing.image
          ? [existing.image]
          : [];
    }
    // If client didn't send video and didn't upload one, keep existing video.
    if (normalized.video == null || normalized.video === "") {
      normalized.video = existing.video || undefined;
    }

    const doc = await Property.findByIdAndUpdate(req.params.id, normalized, {
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
