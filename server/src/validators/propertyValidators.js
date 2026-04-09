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
  body("featured").optional().isBoolean(),
];
