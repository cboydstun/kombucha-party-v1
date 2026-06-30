import express from "express";
import { getHealth, getHowdy } from "../controllers/healthController.js";

const router = express.Router();

router.get("/health", getHealth);
router.get("/howdy", getHowdy);

export default router;
