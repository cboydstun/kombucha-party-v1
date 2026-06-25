import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

const CLIENT_DIST = path.join(__dirname, "client", "dist");

app.use(express.json());
app.use(express.static(CLIENT_DIST));

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.MY_SECRET_TOKEN}`) {
    return res.status(401).send("Unauthorized");
  }
  next();
};

const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));

app.get("/api/v1/health", (req, res) => {
  res.send("Alive out here!");
});

app.get("/api/v1/howdy", (req, res) => {
  const name = req.query.name;
  if (!name) {
    return res.status(400).send("Name query parameter is required");
  }
  res.send(`Howdy, ${name}!`);
});

app.get("/api/v1/blogs", (req, res) => {
  try {
    res.json(db.blogs);
  } catch (error) {
    res.status(500).send("Error retrieving blog posts");
  }
});

app.get("/api/v1/blogs/:id", (req, res) => {
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
});

app.post("/api/v1/blogs", authMiddleware, async (req, res) => {
  try {
    const newBlog = req.body;
    newBlog.id = db.blogs.length + 1;
    db.blogs.push(newBlog);
    fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).send("Error creating blog post");
  }
});

app.put("/api/v1/blogs/:id", authMiddleware, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const index = db.blogs.findIndex((b) => b.id === id);
    if (index === -1) {
      return res.status(404).send("Blog not found");
    }
    db.blogs[index] = req.body;
    fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
    res.json(db.blogs[index]);
  } catch (error) {
    res.status(500).send("Error updating blog post");
  }
});

app.patch("/api/v1/blogs/:id", authMiddleware, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const blog = db.blogs.find((b) => b.id === id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    Object.assign(blog, req.body);
    fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
    res.json(blog);
  } catch (error) {
    res.status(500).send("Error updating blog post");
  }
});

app.delete("/api/v1/blogs/:id", authMiddleware, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const index = db.blogs.findIndex((b) => b.id === id);
    if (index === -1) {
      return res.status(404).send("Blog not found");
    }
    db.blogs.splice(index, 1);
    fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Error deleting blog post");
  }
});

app.delete("/api/v1/blogs", authMiddleware, (req, res) => {
  try {
    db.blogs = [];
    fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Error deleting all blog posts");
  }
});

// SPA fallback
app.use((req, res) => {
  res.sendFile(path.join(CLIENT_DIST, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`);
});
