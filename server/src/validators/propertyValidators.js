import { body } from "express-validator";

const propertyFields = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("price").trim().notEmpty().withMessage("Price is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("type")
    .isIn(["Buy", "Rent", "Lease"])
    .withMessage("Type must be Buy, Rent, or Lease"),
  body("propertyType").trim().notEmpty().withMessage("Property type is required"),
  body("bedrooms")
    .isInt({ min: 0 })
    .withMessage("Bedrooms must be a non-negative integer"),
  body("bathrooms")
    .isInt({ min: 0 })
    .withMessage("Bathrooms must be a non-negative integer"),
  body("area").trim().notEmpty().withMessage("Area is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("highlights").custom((value) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "string") {
      const t = value.trim();
      if (!t) return false;
      try {
        const parsed = JSON.parse(t);
        return Array.isArray(parsed) && parsed.length > 0;
      } catch {
        return t.split("\n").map((s) => s.trim()).filter(Boolean).length > 0;
      }
    }
    return false;
  }).withMessage("At least one highlight is required"),
  body("image")
    .custom((value, { req }) => {
      if (req.file) return true;
      if (typeof value === "string" && value.trim().length > 0) return true;
      throw new Error("Image is required");
    }),
  body("featured").optional().isBoolean().withMessage("Featured must be boolean"),
];

export const createPropertyRules = propertyFields;

export const updatePropertyRules = [
  body("title").optional().trim().notEmpty(),
  body("price").optional().trim().notEmpty(),
  body("location").optional().trim().notEmpty(),
  body("type")
    .optional()
    .isIn(["Buy", "Rent", "Lease"]),
  body("propertyType").optional().trim().notEmpty(),
  body("bedrooms").optional().isInt({ min: 0 }),
  body("bathrooms").optional().isInt({ min: 0 }),
  body("area").optional().trim().notEmpty(),
  body("image").optional().trim().notEmpty(),
  body("description").optional().trim().notEmpty(),
  body("highlights")
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) return true;
      if (typeof value === "string") return true;
      return false;
    }),
  body("featured").optional().isBoolean(),
];
