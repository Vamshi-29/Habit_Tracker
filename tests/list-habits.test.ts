import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import Database from "better-sqlite3";
import { createApp } from "../src/app.js";

describe("GET /habits", () => {
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

  it("returns an empty list when there are no habits", async () => {
    const app = createApp(db);
    const res = await request(app).get("/habits").expect(200);
    expect(res.body).toEqual({ habits: [] });
  });

  it("returns all habits ordered by id", async () => {
    db.prepare("INSERT INTO habits (title) VALUES (?)").run("First");
    db.prepare("INSERT INTO habits (title) VALUES (?)").run("Second");
    const app = createApp(db);
    const res = await request(app).get("/habits").expect(200);
    expect(res.body).toEqual({
      habits: [
        { id: "1", title: "First" },
        { id: "2", title: "Second" },
      ],
    });
  });
});
