import express, { type Express } from "express";
import type Database from "better-sqlite3";

const MAX_TITLE_LENGTH = 200;

export function createApp(db: Database.Database): Express {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.get("/habits", (_req, res) => {
    const rows = db
      .prepare(
        "SELECT id, title FROM habits ORDER BY id ASC",
      )
      .all() as { id: number; title: string }[];
    res.status(200).json({
      habits: rows.map((row) => ({
        id: String(row.id),
        title: row.title,
      })),
    });
  });

  app.post("/habits", (req, res) => {
    const raw = req.body?.title;
    if (typeof raw !== "string" || raw.trim().length === 0) {
      return res.status(400).json({ error: "Title is required" });
    }
    const title = raw.trim();
    if (title.length > MAX_TITLE_LENGTH) {
      return res.status(400).json({
        error: `Title must be at most ${MAX_TITLE_LENGTH} characters`,
      });
    }
    const stmt = db.prepare("INSERT INTO habits (title) VALUES (?)");
    const info = stmt.run(title);
    return res.status(201).json({
      message: "Habit created successfully",
      habit: {
        id: String(info.lastInsertRowid),
        title,
      },
    });
  });

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}
