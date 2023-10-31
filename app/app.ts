import express from "express";
import { RedisClientType } from "redis";
const LIST_KEY = "messages";

export type RedisClient = RedisClientType<any, any, any>;

export const createApp = (client: RedisClient) => {
  const app = express();

  app.use(express.json());

  app.get("/crash", () => {
    console.log("server crashing!");
    process.exit();
  });

  app.get("/", (_req, res) => {
    res.status(200).send("new version!");
  });

  const fibonacciFunc: any = (n: number) => {
    console.log(process.env.pm_id);
    if (n <= 1) return n;
    return fibonacciFunc(n - 1) + fibonacciFunc(n - 2);
  };

  app.get("/fibonacci/:n", (req, res) => {
    const n = parseInt(req.params.n, 10);
    const result = fibonacciFunc(n);
    res.send(`n: ${n} fibonacci result = ${result}`);
  });

  app.get("/messages", async (_req, res) => {
    const messages = await client.lRange(LIST_KEY, 0, -1);
    res.status(200).send(messages);
  });

  app.post("/messages", async (req, res) => {
    const { messages } = req.body;
    await client.lPush(LIST_KEY, messages);
    res.status(200).send("Message add in list!");
  });

  return app;
};
