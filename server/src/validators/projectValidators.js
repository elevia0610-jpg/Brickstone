import { body } from "express-validator";

export const createProjectRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("status")
    .isIn(["Ongoing", "Completed"])
    .withMessage("Status must be Ongoing or Completed"),
  body("type").trim().notEmpty().withMessage("Type is required"),
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
  body("image").custom((value, { req }) => {
    if (req.file) return true;
    if (typeof value === "string" && value.trim().length > 0) return true;
    throw new Error("Image is required");
  }),
];

export const updateProjectRules = [
  body("title").optional().trim().notEmpty(),
  body("location").optional().trim().notEmpty(),
  body("status").optional().isIn(["Ongoing", "Completed"]),
  body("type").optional().trim().notEmpty(),
  body("description").optional().trim().notEmpty(),
  body("highlights")
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) return true;
      if (typeof value === "string") return true;
      return false;
    }),
  body("image").optional().trim().notEmpty(),
];
