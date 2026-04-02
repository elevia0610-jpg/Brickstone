import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProjects,
  getProjectById,
  updateProject,
} from "../controllers/projectController.js";
import { requireAuth } from "../middleware/auth.js";
import {
  createProjectRules,
  updateProjectRules,
} from "../validators/projectValidators.js";

const router = Router();

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", requireAuth, createProjectRules, createProject);
router.put("/:id", requireAuth, updateProjectRules, updateProject);
router.delete("/:id", requireAuth, deleteProject);

export default router;
