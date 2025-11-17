// middleware/errorHandler.ts
import { NextFunction, Request, Response } from "express";
import { app } from "../app";
import {
  BadRequestError,
  HttpError,
  UnauthorizedError,
  ValidationError,
} from "../utils/ErrorHandler";

// 1. Convert common errors to HttpError
export const convertErrors = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // MongoDB: Invalid ID
  if (err.name === "CastError" && "path" in err) {
    const castErr = err as any;
    return next(
      new BadRequestError(`Invalid ${castErr.path}: ${castErr.value}`)
    );
  }

  // MongoDB: Duplicate key
  if ("code" in err && (err as any).code === 11000) {
    const dupErr = err as any;
    const field = Object.keys(dupErr.keyValue)[0];
    const value = dupErr.keyValue[field];
    return next(new BadRequestError(`${field} '${value}' is already taken`));
  }

  // JWT: Invalid token
  if (err.name === "JsonWebTokenError") {
    return next(new UnauthorizedError("Invalid token. Please log in again."));
  }

  // JWT: Expired token
  if (err.name === "TokenExpiredError") {
    return next(new UnauthorizedError("Token expired. Please log in again."));
  }

  // If not converted, pass through
  next(err);
};

// 2. Final error handler (only deals with HttpError or fallback)
export const handleHttpError = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // LOG FULL ERROR (server-side only)
  console.error("[ERROR]", {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.ip,
    statusCode,
    message,
    stack: err.stack,
    cause: (err as any).cause,
    userId: (req as any).user?.id,
  });

  // SEND CLEAN RESPONSE
  const response: any = {
    success: false,
    error: message,
  };

  if (err instanceof ValidationError) {
    response.errors = err.errors;
  } else if ("errors" in err) {
    response.errors = (err as any).errors;
  }

  res.status(statusCode).json(response);
};
