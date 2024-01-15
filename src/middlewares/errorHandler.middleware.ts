import { NextFunction, Request, Response } from "express";
import logger from "@/utils/logger.utils";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  logger.error(["errorHandler", err.message]);
  res.status(500).json({ message: err.message });
};
