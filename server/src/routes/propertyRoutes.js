import { Router } from "express";
import {
  createProperty,
  deleteProperty,
  getProperties,
  getPropertyById,
  updateProperty,
} from "../controllers/propertyController.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadSingleImage } from "../middleware/upload.js";
import {
  createPropertyRules,
  updatePropertyRules,
} from "../validators/propertyValidators.js";

const router = Router();

router.get("/", getProperties);
router.get("/:id", getPropertyById);
router.post("/", requireAuth, uploadSingleImage, createPropertyRules, createProperty);
router.put("/:id", requireAuth, uploadSingleImage, updatePropertyRules, updateProperty);
router.delete("/:id", requireAuth, deleteProperty);

export default router;
