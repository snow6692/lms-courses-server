import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../utils/ErrorHandler";
import type { ZodType } from "zod";

export const validate =
  (schema: ZodType, location: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[location]);

    if (!result.success) {
      const errors = result.error.issues.map((i) => i.message);
      return next(new ValidationError(errors));
    }

    req[location] = result.data;
    next();
  };
