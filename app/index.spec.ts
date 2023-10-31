import request from "supertest";
import * as redis from "redis";
import { RedisClient, createApp } from "./app";

let app: Express.Application;
let client: RedisClient;

// const REDIS_URL = "redis://default:test_env@localhost:6380";

beforeAll(async () => {
  client = redis.createClient({
    url: process.env.TEST_REDIS_URL,
  });
  await client.connect();
  app = createApp(client);
});

beforeEach(async () => {
  await client.flushDb();
});

afterAll(async () => {
  await client.flushDb();
  await client.quit();
});

describe("POST /messages", () => {
  it("response with success message", async () => {
    const res = await request(app)
      .post("/messages")
      .send({ messages: "testing with redis" });

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Message add in list!");
  });
});

describe("GET /messages", () => {
  it("response with success message", async () => {
    const res = await request(app).get("/messages");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});
