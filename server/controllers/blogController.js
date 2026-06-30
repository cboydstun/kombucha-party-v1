import { db, saveDb } from "../data/database.js";

export const getBlogs = (req, res) => {
  try {
    res.json(db.blogs);
  } catch (error) {
    res.status(500).send("Error retrieving blog posts");
  }
};

export const createBlog = (req, res) => {
  try {
    const newBlog = req.body;
    db.blogs.push(newBlog);
    saveDb();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).send("Error creating blog post");
  }
};

export const updateBlog = (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const index = db.blogs.findIndex((b) => b.id === id);
    if (index === -1) {
      return res.status(404).send("Blog not found");
    }
    db.blogs[index] = req.body;
    saveDb();
    res.json(db.blogs[index]);
  } catch (error) {
    res.status(500).send("Error updating blog post");
  }
};

export const patchBlog = (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const blog = db.blogs.find((b) => b.id === id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    Object.assign(blog, req.body);
    saveDb();
    res.json(blog);
  } catch (error) {
    res.status(500).send("Error updating blog post");
  }
};

export const getBlogById = (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const blog = db.blogs.find((b) => b.id === id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    res.json(blog);
  } catch (error) {
    res.status(500).send("Error retrieving blog post");
  }
};

export const deleteBlog = (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const index = db.blogs.findIndex((b) => b.id === id);
    if (index === -1) {
      return res.status(404).send("Blog not found");
    }
    db.blogs.splice(index, 1);
    saveDb();
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Error deleting blog post");
  }
};

export const deleteAllBlogs = (req, res) => {
  try {
    db.blogs = [];
    saveDb();
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Error deleting all blog posts");
  }
};
