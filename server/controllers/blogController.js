import Blog from "../models/Blog.js";

// Posts predating the status field have no status at all, so $ne rather than
// an equality check on "published" — otherwise they'd vanish from the site.
const PUBLIC_FILTER = { status: { $ne: "draft" } };

// Only these fields are writable from a request body. author is derived from
// the authenticated admin, never trusted from the client.
function writableFields({ title, content, image, status }) {
  return { title, content, image, status };
}

// Mongoose rejects bad input with ValidationError; a malformed :id yields a
// CastError. Both are the caller's fault, not ours.
function sendWriteError(res, error, fallback) {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ error: error.message });
  }
  res.status(500).send(fallback);
}

// GET /api/v1/blogs - PUBLIC
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find(PUBLIC_FILTER);
    res.json(blogs);
  } catch {
    res.status(500).send("Error retrieving blog posts");
  }
};

// GET /api/v1/blogs/:id - PUBLIC
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog || blog.status === "draft") {
      return res.status(404).send("Blog not found");
    }
    res.json(blog);
  } catch {
    res.status(500).send("Error retrieving blog post");
  }
};

// GET /api/v1/admin/blogs - ADMIN
export const listAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch {
    res.status(500).send("Error retrieving blog posts");
  }
};

// POST /api/v1/admin/blogs - ADMIN
export const createBlog = async (req, res) => {
  try {
    const newBlog = new Blog({
      ...writableFields(req.body),
      author: req.user.username,
    });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    sendWriteError(res, error, "Error creating blog post");
  }
};

// PUT /api/v1/admin/blogs/:id - ADMIN
export const updateBlog = async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      writableFields(req.body),
      { new: true, runValidators: true },
    );
    if (!updatedBlog) {
      return res.status(404).send("Blog not found");
    }
    res.json(updatedBlog);
  } catch (error) {
    sendWriteError(res, error, "Error updating blog post");
  }
};

// PATCH /api/v1/admin/blogs/:id - ADMIN
// Identical to PUT: findByIdAndUpdate drops undefined keys, so an omitted field
// is left alone either way.
export const patchBlog = updateBlog;

// DELETE /api/v1/admin/blogs/:id - ADMIN
export const deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).send("Blog not found");
    }
    res.status(204).send();
  } catch (error) {
    sendWriteError(res, error, "Error deleting blog post");
  }
};
