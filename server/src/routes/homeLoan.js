import express from "express";
import { submitHomeLoan } from "../controllers/homeLoanController.js";

const router = express.Router();

router.post("/", submitHomeLoan);

export default router;