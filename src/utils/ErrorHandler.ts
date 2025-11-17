import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code?: string,
    public cause?: unknown
  ) {
    super(message, { cause });
    Object.setPrototypeOf(this, HttpError.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    this.name = this.constructor.name;
  }
}
export class BadRequestError extends HttpError {
  constructor(message = "Bad Request", cause?: unknown) {
    super(message, 400, undefined, cause);
  }
}
export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized", cause?: unknown) {
    super(message, 401, undefined, cause);
  }
}
export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden", cause?: unknown) {
    super(message, 403, undefined, cause);
  }
}
export class NotFoundError extends HttpError {
  constructor(message = "Not Found", cause?: unknown) {
    super(message, 404, undefined, cause);
  }
}
export class ConflictError extends HttpError {
  constructor(message = "Conflict", cause?: unknown) {
    super(message, 409, undefined, cause);
  }
}
export class TooManyRequestsError extends HttpError {
  constructor(message = "Too Many Requests", cause?: unknown) {
    super(message, 429, undefined, cause);
  }
}
export class ValidationError extends BadRequestError {
  public errors: Record<string, string[]>;
  public formErrors: string[] = [];

  constructor(zodError: ZodError, cause?: unknown) {
    super("Validation failed", cause);

    const flattened = zodError.flatten();

    // الحقول اللي فيها أخطاء
    this.errors = flattened.fieldErrors;

    // الأخطاء العامة (من refine أو superRefine)
    this.formErrors = flattened.formErrors;

    // لو عايز تضيف _general للـ frontend
    if (this.formErrors.length > 0) {
      (this.errors as any)._general = this.formErrors;
    }

    this.name = "ValidationError";
  }
}
export class AlreadyEnrolledError extends ConflictError {
  constructor(courseId: string) {
    super(`Already enrolled in course ${courseId}`);
  }
}
