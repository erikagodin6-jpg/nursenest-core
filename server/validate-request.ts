import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { ZodTypeAny } from "zod";

/** Parse and replace req.body with validated (stripped) data; 400 on failure. */
export function validateBody<S extends ZodTypeAny>(schema: S): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid request body",
        code: "validation_error",
        details: parsed.error.flatten(),
      });
    }
    req.body = parsed.data;
    next();
  };
}

/** Validate query string; merges parsed values onto req.query (typed loosely by Express). */
export function validateQuery<S extends ZodTypeAny>(schema: S): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid query parameters",
        code: "validation_error",
        details: parsed.error.flatten(),
      });
    }
    Object.assign(req.query, parsed.data);
    next();
  };
}
