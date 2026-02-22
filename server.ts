import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("candidates.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER,
    name TEXT NOT NULL,
    email TEXT,
    resume_text TEXT,
    score INTEGER,
    analysis TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get("/api/jobs", (req, res) => {
    const jobs = db.prepare("SELECT * FROM jobs ORDER BY created_at DESC").all();
    res.json(jobs);
  });

  app.post("/api/jobs", (req, res) => {
    const { title, description } = req.body;
    const info = db.prepare("INSERT INTO jobs (title, description) VALUES (?, ?)").run(title, description);
    res.json({ id: info.lastInsertRowid, title, description });
  });

  app.get("/api/candidates/:jobId", (req, res) => {
    const candidates = db.prepare("SELECT * FROM candidates WHERE job_id = ? ORDER BY score DESC").all(req.params.jobId);
    res.json(candidates);
  });

  app.post("/api/candidates", (req, res) => {
    const { job_id, name, email, resume_text, score, analysis } = req.body;
    const info = db.prepare(
      "INSERT INTO candidates (job_id, name, email, resume_text, score, analysis) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(job_id, name, email, resume_text, score, JSON.stringify(analysis));
    res.json({ id: info.lastInsertRowid });
  });

  app.patch("/api/candidates/:id", (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE candidates SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/candidates/:id", (req, res) => {
    db.prepare("DELETE FROM candidates WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
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
