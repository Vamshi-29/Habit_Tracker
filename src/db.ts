import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

export function initDb(databasePath: string): Database.Database {
  if (databasePath !== ":memory:") {
    const dir = path.dirname(databasePath);
    fs.mkdirSync(dir, { recursive: true });
  }
  const db = new Database(databasePath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL
    )
  `);
  return db;
}
