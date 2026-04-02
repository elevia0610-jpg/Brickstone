import { body } from "express-validator";

export const createProjectRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("status")
    .isIn(["Ongoing", "Completed"])
    .withMessage("Status must be Ongoing or Completed"),
  body("type").trim().notEmpty().withMessage("Type is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("highlights")
    .isArray({ min: 1 })
    .withMessage("At least one highlight is required"),
  body("highlights.*").optional().trim().notEmpty(),
  body("image").trim().notEmpty().withMessage("Image URL is required"),
];

export const updateProjectRules = [
  body("title").optional().trim().notEmpty(),
  body("location").optional().trim().notEmpty(),
  body("status").optional().isIn(["Ongoing", "Completed"]),
  body("type").optional().trim().notEmpty(),
  body("description").optional().trim().notEmpty(),
  body("highlights").optional().isArray(),
  body("highlights.*").optional().trim().notEmpty(),
  body("image").optional().trim().notEmpty(),
];
