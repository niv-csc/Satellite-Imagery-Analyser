import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import multer from "multer";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Database setup
const db = new Database("satellite.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    original_name TEXT,
    analysis_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Multer setup
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

app.use(express.json());
app.use("/uploads", express.static(uploadDir));

// API Routes
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ 
    success: true, 
    fileUrl, 
    filename: req.file.filename,
    originalName: req.file.originalname 
  });
});

app.post("/api/save-analysis", (req, res) => {
  const { filename, originalName, analysis } = req.body;
  const stmt = db.prepare("INSERT INTO analyses (filename, original_name, analysis_json) VALUES (?, ?, ?)");
  const info = stmt.run(filename, originalName, JSON.stringify(analysis));
  res.json({ success: true, id: info.lastInsertRowid });
});

app.get("/api/history", (req, res) => {
  const stmt = db.prepare("SELECT * FROM analyses ORDER BY created_at DESC LIMIT 20");
  const rows = stmt.all();
  res.json({ 
    success: true, 
    data: rows.map(row => ({
      ...row,
      analysis: JSON.parse(row.analysis_json as string)
    }))
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
