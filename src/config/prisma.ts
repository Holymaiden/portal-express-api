import { Prisma, PrismaClient } from "@prisma/client";
import config from "./config";
import logger from "../utils/logger.utils";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClient: PrismaClient = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
});

type PrismaEvent = Prisma.QueryEvent | Prisma.LogEvent;

prismaClient.$on("query", (e: PrismaEvent) => {
  if ("params" in e) logger.info([e.query, e.params, e.duration + "ms"]);
});

if (config.NODE_ENV !== "production") globalThis.prisma = prismaClient;

export default prismaClient;
