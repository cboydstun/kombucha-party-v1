import Blog from "../models/Blog.js";

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).send("Error retrieving blog posts");
  }
};

export const createBlog = async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).send("Error creating blog post");
  }
};

export const updateBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedBlog) {
      return res.status(404).send("Blog not found");
    }
    res.json(updatedBlog);
  } catch (error) {
    res.status(500).send("Error updating blog post");
  }
};

export const patchBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedBlog) {
      return res.status(404).send("Blog not found");
    }
    res.json(updatedBlog);
  } catch (error) {
    res.status(500).send("Error updating blog post");
  }
};

export const getBlogById = async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    res.json(blog);
  } catch (error) {
    res.status(500).send("Error retrieving blog post");
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).send("Blog not found");
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Error deleting blog post");
  }
};

export const deleteAllBlogs = async (req, res) => {
  try {
    await Blog.deleteMany({});
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Error deleting all blog posts");
  }
};
