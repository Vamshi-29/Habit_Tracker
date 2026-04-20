import express, { type Express } from "express";
import type Database from "better-sqlite3";

export function createApp(db: Database.Database): Express {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.post("/habits", (req, res) => {
    const raw = req.body?.title;
    if (typeof raw !== "string" || raw.trim().length === 0) {
      return res.status(400).json({ error: "Title is required" });
    }
    const title = raw.trim();
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

  return app;
}
