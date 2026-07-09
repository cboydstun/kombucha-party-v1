import express from "express";
import { getBlogs, getBlogById } from "../controllers/blogController.js";

const router = express.Router();

// Reads only. Blog writes live under /api/v1/admin/blogs, behind requireAdmin.
router.get("/", getBlogs);
router.get("/:id", getBlogById);

export default router;
