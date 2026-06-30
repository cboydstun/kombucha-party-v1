import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

import connectDB from "./data/database.js";

import healthRouter from "./routes/healthRoutes.js";
import blogRouter from "./routes/blogRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

await connectDB();

const CLIENT_DIST = path.join(__dirname, "client", "dist");

app.use(express.json());
app.use(express.static(CLIENT_DIST));

app.use("/api/v1/", healthRouter);
app.use("/api/v1/blogs", blogRouter);

// SPA fallback
app.use((req, res) => {
  res.sendFile(path.join(CLIENT_DIST, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`);
});
