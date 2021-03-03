import request from "supertest";
import { getConnection } from "typeorm";
import { app } from "../app";

import createConnection from '../database';

describe("Users", () => {
  beforeAll(async () => {
    const conn = await createConnection();
    await conn.runMigrations();
  });

  afterAll(async () => {
    const conn = getConnection();
    await conn.dropDatabase();
    await conn.close;
  });

  it("Should be able to create a new user", async () => {
    const res = await request(app).post("/users")
      .send({
        email: "user@example.com",
        name: "User Example"
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  })

  it("Shouldn't be able to repeat email", async () => {
    const res = await request(app).post("/users")
      .send({
        email: "user@example.com",
        name: "User Example"
      });

    expect(res.status).toBe(400);
  })

  it("Should has one item", async () => {
    const res = await request(app).get("/users")

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  })
});