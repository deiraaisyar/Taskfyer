import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./src/db/connect.js";
import cookieParser from "cookie-parser";
import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import errorHandler from "./src/helpers/errorhandler.js";

dotenv.config();

const port = process.env.PORT || 8000;

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Error handler middleware
app.use(errorHandler);

// Path absolute agar kompatibel dengan Vercel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routePath = path.join(__dirname, "src/routes");

// Cek apakah folder routes ada sebelum membacanya
if (!fs.existsSync(routePath)) {
  console.error("❌ ERROR: Folder 'src/routes' tidak ditemukan.");
  console.error("📂 Current Directory:", __dirname);
  console.error("📂 Expected Path:", routePath);
  process.exit(1);
}

// Load routes secara dinamis
const routeFiles = fs.readdirSync(routePath);

routeFiles.forEach((file) => {
  import(`file://${path.join(routePath, file)}`)
    .then((route) => {
      app.use("/api/v1", route.default);
    })
    .catch((err) => {
      console.error(`❌ Failed to load route file ${file}:`, err);
    });
});

const server = async () => {
  try {
    await connect();

    app.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

server();
