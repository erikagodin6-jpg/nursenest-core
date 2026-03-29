import type { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Wraps an async route handler so rejections and thrown errors reach Express error middleware via next(err).
 * Use for handlers that are not already fully try/catch wrapped.
 */
export function asyncHandler<P = Request>(
  fn: (req: P, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    void Promise.resolve(fn(req as P, res, next)).catch(next);
  };
}
