import { validationResult } from "express-validator";
import { Project } from "../models/Project.js";
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

export async function createProject(req, res) {
  if (!handleValidation(req, res)) return;
  try {
    const doc = await Project.create(req.body);
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
    const doc = await Project.findByIdAndUpdate(req.params.id, req.body, {
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
