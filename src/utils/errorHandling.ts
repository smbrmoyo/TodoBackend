import { Request, Response, NextFunction } from "express";
import { HttpError } from "../types/models";

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  const message = error.message || "An unexpected error occurred";

  res.status(statusCode).json({
    message,
  });
}
