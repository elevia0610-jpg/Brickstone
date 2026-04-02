import { Router } from "express";
import {
  createProperty,
  deleteProperty,
  getProperties,
  getPropertyById,
  updateProperty,
} from "../controllers/propertyController.js";
import { requireAuth } from "../middleware/auth.js";
import {
  createPropertyRules,
  updatePropertyRules,
} from "../validators/propertyValidators.js";

const router = Router();

router.get("/", getProperties);
router.get("/:id", getPropertyById);
router.post("/", requireAuth, createPropertyRules, createProperty);
router.put("/:id", requireAuth, updatePropertyRules, updateProperty);
router.delete("/:id", requireAuth, deleteProperty);

export default router;
