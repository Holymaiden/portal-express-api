import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";

import config from "./config/config";
import compressFilter from "./utils/compressFilter.util";
import authLimiter from "./middlewares/authLimiter.middleware";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { xssMiddleware } from "./middlewares/xss.middleware";
import logger from "./middlewares/logger.middleware";
import {
  authRouter,
  userRouter,
  pegawaiRouter,
} from "./routes/v1/index.routes";

const app: Express = express();

// Helmet for security headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// secure from xss atacks
app.use(xssMiddleware());

app.use(cookieParser());

// Compress responses
app.use(compression({ filter: compressFilter }));

app.use(
  cors({
    // origin is given a array if we want to have multiple origins later
    origin: String(config.CORS.ORIGIN).split("|"),
    credentials: true,
  })
);

if (config.NODE_ENV === "production") {
  app.use("/api/v1/auth", authLimiter);
}

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/pegawai", pegawaiRouter);

app.use(errorHandler);

const server = app.listen(Number(config.SERVER.PORT), () => {
  logger.log(
    "info",
    `[server]: Server is running at http://localhost:${config.SERVER.PORT}`
  );
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received.");
  logger.info("Closing server.");
  server.close((err) => {
    logger.info("Server closed.");

    process.exit(err ? 1 : 0);
  });
});

export default app;
