// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(`[${req.method}] ${req.originalUrl} -> ${err.message}`);

  // ✅ Determine proper status code
  const status = err.statusCode || 500;

  // ✅ Send uniform error response
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};
