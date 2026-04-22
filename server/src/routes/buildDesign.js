import express from "express";
import { submitBuildDesign } from "../controllers/buildDesignController.js";

const router = express.Router();

router.post("/", submitBuildDesign);

export default router;