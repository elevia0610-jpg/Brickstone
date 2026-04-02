import { Router } from "express";
import { body } from "express-validator";
import { login } from "../controllers/authController.js";

const router = Router();

router.post(
  "/login",
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

export default router;
