import request from "supertest";
import { getConnection } from "typeorm";
import { app } from "../app";

import createConnection from '../database';

describe("Survey", () => {
  beforeAll(async () => {
    const conn = await createConnection();
    await conn.runMigrations();
  });

  afterAll(async () => {
    const conn = getConnection();
    await conn.dropDatabase();
    await conn.close;
  });

  it("Should be able to create a new survey", async () => {
    const res = await request(app).post("/surveys")
      .send({
        title: "Title Example",
        description: "Description Example"
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  })

  it("Should has one item", async () => {
    const res = await request(app).get("/surveys")

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  })
});