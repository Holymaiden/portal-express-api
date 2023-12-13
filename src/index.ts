import express, { Express, Response } from "express";
import config from "./config/config";

const app: Express = express();

app.get("/", (_, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(Number(config.SERVER.PORT), () => {
  console.log(
    `[server]: Server is running at http://localhost:${config.SERVER.PORT}`
  );
});
