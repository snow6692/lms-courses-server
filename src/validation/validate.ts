// utils/validateData.ts
import z, { ZodType } from "zod";
import { HttpError, ValidationError } from "../utils/ErrorHandler";

export const validateData = <T>(schema: ZodType<T>, data: unknown): T => {
  console.log("validation starts");
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new ValidationError(result.error);
  }

  return result.data;
};
