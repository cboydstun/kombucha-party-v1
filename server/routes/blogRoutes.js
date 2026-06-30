import express from "express";
import { db, saveDb } from "../data/database.js";
import {
  getBlogs,
  createBlog,
  updateBlog,
  patchBlog,
  getBlogById,
  deleteBlog,
  deleteAllBlogs,
} from "../controllers/blogController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getBlogs);
router.post("/", authMiddleware, createBlog);
router.put("/:id", authMiddleware, updateBlog);
router.patch("/:id", authMiddleware, patchBlog);
router.get("/:id", getBlogById);
router.delete("/:id", authMiddleware, deleteBlog);
router.delete("/", authMiddleware, deleteAllBlogs);

export default router;
