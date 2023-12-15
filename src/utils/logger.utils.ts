import config from "../config/config";
import { createLogger, format, transports } from "winston";

// Logger for controllers
const logger = createLogger({
  level: config.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
    format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} | [${level.toUpperCase()}] | ${message[0]} | ${
        message[1]
      } | ${typeof message[2] !== "undefined" ? message[2] : ""} | ${
        stack ? `\n${stack}` : ""
      }`;
    })
  ),
  transports: [
    new transports.Console({ level: "error" }),
    new transports.File({
      filename: "logs/service-error.log",
      level: "error",
    }),
    new transports.File({ filename: "logs/service.log" }),
  ],
});

export default logger;
