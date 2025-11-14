// utils/errors.ts
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

// === HTTP Status Errors ===
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

// === Validation with details ===
export class ValidationError extends BadRequestError {
  constructor(public errors: string[], cause?: unknown) {
    super("Validation failed", cause);
    this.name = "ValidationError";
  }
}

// === LMS-Specific ===


export class AlreadyEnrolledError extends ConflictError {
  constructor(courseId: string) {
    super(`Already enrolled in course ${courseId}`);
  }
}
