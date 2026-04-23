import { validationResult } from "express-validator";
import { Project } from "../models/Project.js";
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

function normalizeHighlights(raw) {
  if (raw == null) return raw;
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      // ignore
    }
    return trimmed
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return raw;
}

function normalizeProjectPayload(req) {
  const payload = { ...req.body };

  const uploadedImages = (req.files?.images || []).map((f) => f.path);
  const uploadedVideo = req.files?.video?.[0]?.path || null;

  const existingImages = parseJsonArray(payload.existingImages) || null;
  const bodyImages = parseJsonArray(payload.images) || null;
  const legacyImage = typeof payload.image === "string" ? payload.image.trim() : "";
  const legacyVideo = typeof payload.video === "string" ? payload.video.trim() : "";

  let images = [];
  if (existingImages) images = existingImages;
  else if (bodyImages) images = bodyImages;
  else if (legacyImage) images = [legacyImage];

  images = [...images, ...uploadedImages].map(String).filter(Boolean);
  images = Array.from(new Set(images));
  payload.images = images;

  if (uploadedVideo) payload.video = uploadedVideo;
  else if (legacyVideo) payload.video = legacyVideo;
  else if (payload.existingVideo) payload.video = String(payload.existingVideo);

  delete payload.image;
  delete payload.existingImages;
  delete payload.existingVideo;

  if (payload.highlights != null) {
    payload.highlights = normalizeHighlights(payload.highlights);
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

export async function createProject(req, res) {
  if (!handleValidation(req, res)) return;
  try {
    const doc = await Project.create(normalizeProjectPayload(req));
    res.status(201).json(toClientDoc(doc));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create project" });
  }
}

export async function getProjects(_req, res) {
  try {
    const list = await Project.find().sort({ createdAt: -1 }).exec();
    res.json(toClientList(list));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
}

export async function getProjectById(req, res) {
  try {
    const doc = await Project.findById(req.params.id).exec();
    if (!doc) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(toClientDoc(doc));
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid project id" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to fetch project" });
  }
}

export async function updateProject(req, res) {
  if (!handleValidation(req, res)) return;
  try {
    const existing = await Project.findById(req.params.id).exec();
    if (!existing) {
      return res.status(404).json({ message: "Project not found" });
    }

    const normalized = normalizeProjectPayload(req);

    if (!normalized.images || normalized.images.length === 0) {
      normalized.images = Array.isArray(existing.images)
        ? existing.images
        : existing.image
          ? [existing.image]
          : [];
    }
    if (normalized.video == null || normalized.video === "") {
      normalized.video = existing.video || undefined;
    }

    const doc = await Project.findByIdAndUpdate(req.params.id, normalized, {
      new: true,
      runValidators: true,
    }).exec();
    if (!doc) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(toClientDoc(doc));
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid project id" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to update project" });
  }
}

export async function deleteProject(req, res) {
  try {
    const doc = await Project.findByIdAndDelete(req.params.id).exec();
    if (!doc) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted", id: req.params.id });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid project id" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to delete project" });
  }
}
