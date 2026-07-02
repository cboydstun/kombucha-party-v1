import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// POST - /api/v1/auth/register - Registration route - PUBLIC
router.post("/register", registerUser);

// POST - /api/v1/auth/login - Login route - PUBLIC
router.post("/login", loginUser);

export default router;
