import express from "express";
import { getStats, getTopProducts } from "../controllers/adminController.js";
import {
  listAllBlogs,
  createBlog,
  updateBlog,
  patchBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

router.use(authMiddleware, requireAdmin);

router.get("/stats", getStats);
router.get("/stats/top-products", getTopProducts);

router.get("/blogs", listAllBlogs);
router.post("/blogs", createBlog);
router.put("/blogs/:id", updateBlog);
router.patch("/blogs/:id", patchBlog);
router.delete("/blogs/:id", deleteBlog);

export default router;
