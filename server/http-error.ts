/**
 * Operational HTTP errors with stable status codes for API responses.
 */
export class HttpError extends Error {
  readonly statusCode: number;
  readonly code?: string;

  constructor(statusCode: number, message: string, code?: string) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function isHttpError(e: unknown): e is HttpError {
  return e instanceof HttpError;
}
