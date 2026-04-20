import path from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.js";
import { initDb } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath =
  process.env.DATABASE_PATH ??
  path.join(__dirname, "..", "data", "habits.db");

const db = initDb(dbPath);
const app = createApp(db);
const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Habit tracker API listening on port ${port}`);
});
