import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";

import healthRouter from "./routes/healthRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/adminRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const CLIENT_DIST = path.join(__dirname, "..", "client", "dist");

app.use(helmet());
app.use(express.json());
app.use(express.static(CLIENT_DIST));

app.use("/api/v1/", healthRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);

// SPA fallback
app.use((req, res) => {
  res.sendFile(path.join(CLIENT_DIST, "index.html"));
});

export default app;
