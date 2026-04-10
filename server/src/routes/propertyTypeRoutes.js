import { Router } from "express";
import {
  createPropertyType,
  getPropertyTypes,
  deletePropertyType,
} from "../controllers/propertyTypeController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", getPropertyTypes);

router.post("/", requireAuth, createPropertyType);

router.delete("/:id", requireAuth, deletePropertyType);

export default router;