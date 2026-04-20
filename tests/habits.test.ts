import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import Database from "better-sqlite3";
import { createApp } from "../src/app.js";

describe("POST /habits", () => {
  let db: Database.Database;

  beforeEach(() => {
    db = new Database(":memory:");
    db.exec(`
      CREATE TABLE habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL
      )
    `);
  });

  it("creates a habit and returns success payload", async () => {
    const app = createApp(db);
    const res = await request(app)
      .post("/habits")
      .send({ title: "Drink Water" })
      .expect(201);

    expect(res.body).toEqual({
      message: "Habit created successfully",
      habit: {
        id: "1",
        title: "Drink Water",
      },
    });

    const row = db
      .prepare("SELECT id, title FROM habits WHERE id = ?")
      .get(1) as { id: number; title: string };
    expect(row.title).toBe("Drink Water");
  });

  it("persists trimmed title", async () => {
    const app = createApp(db);
    await request(app)
      .post("/habits")
      .send({ title: "  Morning Run  " })
      .expect(201);

    const row = db.prepare("SELECT title FROM habits LIMIT 1").get() as {
      title: string;
    };
    expect(row.title).toBe("Morning Run");
  });

  it("rejects empty string title with 400", async () => {
    const app = createApp(db);
    const res = await request(app)
      .post("/habits")
      .send({ title: "" })
      .expect(400);

    expect(res.body).toEqual({ error: "Title is required" });
    const count = db.prepare("SELECT COUNT(*) AS c FROM habits").get() as {
      c: number;
    };
    expect(count.c).toBe(0);
  });

  it("rejects whitespace-only title with 400", async () => {
    const app = createApp(db);
    const res = await request(app)
      .post("/habits")
      .send({ title: "   \t  " })
      .expect(400);

    expect(res.body).toEqual({ error: "Title is required" });
  });

  it("rejects missing title with 400", async () => {
    const app = createApp(db);
    const res = await request(app).post("/habits").send({}).expect(400);

    expect(res.body).toEqual({ error: "Title is required" });
  });

  it("rejects non-string title with 400", async () => {
    const app = createApp(db);
    const res = await request(app)
      .post("/habits")
      .send({ title: 123 })
      .expect(400);

    expect(res.body).toEqual({ error: "Title is required" });
  });
});
