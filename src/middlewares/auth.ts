import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "./catchAsyncErrors.js";
import { UnauthorizedError } from "../utils/ErrorHandler.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ENV } from "../utils/env.js";
import { redis } from "../utils/redis.js";

export const requiredUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // const access_token = req.headers.authorization;
    const access_token = req.cookies.access_token;
    if (!access_token) {
      return next(
        new UnauthorizedError("Please login to access this recourse")
      );
    }
    const decoded = jwt.verify(access_token, ENV.ACCESS_TOKEN) as JwtPayload;
    if (!decoded) {
      return next(new UnauthorizedError("Access token is not valid"));
    }

    const userJson = await redis.get(decoded.id);
    if (!userJson) {
      return next(new UnauthorizedError("user not found"));
    }

    req.user = JSON.parse(userJson);
    next();
  }
);
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!req.user) {
      return next(
        new UnauthorizedError("Please login to access this resource", 401)
      );
    }

    if (!userRole || !allowedRoles.includes(userRole)) {
      return next(
        new UnauthorizedError(
          `Access denied. Role '${
            userRole || "unknown"
          }' is not allowed. Required: ${allowedRoles.join(", ")}`,
          403
        )
      );
    }

    next();
  };
};
