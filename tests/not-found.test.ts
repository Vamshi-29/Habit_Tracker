import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import Database from "better-sqlite3";
import { createApp } from "../src/app.js";

describe("404", () => {
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

  it("returns JSON for unknown paths", async () => {
    const app = createApp(db);
    const res = await request(app).get("/nope").expect(404);
    expect(res.body).toEqual({ error: "Not found" });
  });
});
