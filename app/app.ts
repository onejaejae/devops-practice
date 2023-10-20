import express from "express";
import { RedisClientType } from "redis";
const LIST_KEY = "messages";

export type RedisClient = RedisClientType<any, any, any>;

export const createApp = (client: RedisClient) => {
  const app = express();

  app.use(express.json());

  app.get("/", (req, res) => {
    res.status(200).send("hello from express!!!");
  });

  app.get("/messages", async (req, res) => {
    const messages = await client.lRange(LIST_KEY, 0, -1);
    res.status(200).send(messages);
  });

  app.post("/messages", async (req, res) => {
    const { messages } = req.body;
    await client.lPush(LIST_KEY, messages);
    res.status(200).send("Message add in list");
  });

  return app;
};
