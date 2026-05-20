import type { Express, ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError, isHttpError } from "./http-error";

const isProduction =
  process.env.NODE_ENV === "production" || process.env.REPLIT_DEPLOYMENT === "1";

function getUserIdForLog(req: Request): string | undefined {
  const auth = (req as Request & { authUser?: { id?: string } }).authUser;
  if (auth?.id) return String(auth.id);
  const legacy = (req as Request & { user?: { id?: string } }).user;
  if (legacy?.id) return String(legacy.id);
  return undefined;
}

function logError(err: unknown, req: Request, status: number, message: string): void {
  const payload = {
    level: "error" as const,
    msg: message,
    status,
    method: req.method,
    path: req.originalUrl || req.path,
    requestId: req.requestId,
    userId: getUserIdForLog(req),
    errorName: err instanceof Error ? err.name : typeof err,
    errorMessage: err instanceof Error ? err.message : String(err),
  };
  if (!isProduction && err instanceof Error && err.stack) {
    console.error(JSON.stringify(payload), "\n", err.stack);
  } else {
    console.error(JSON.stringify(payload));
  }
}

/**
 * Must be registered after all routes and after optional 404 handler.
 */
export function createGlobalErrorHandler(): ErrorRequestHandler {
  return (err: unknown, req: Request, res: Response, _next: NextFunction) => {
    if (res.headersSent) {
      return;
    }

    let status = 500;
    let message = "Internal server error";
    let code: string | undefined;

    if (isHttpError(err)) {
      status = err.statusCode;
      message = err.message;
      code = err.code;
    } else if (err instanceof ZodError) {
      status = 400;
      message = "Validation failed";
      code = "validation_error";
    }

    logError(err, req, status, message);

    const body: Record<string, unknown> = { error: message };
    if (code) {
      body.code = code;
    }
    // Dev-only diagnostics; never attach raw Error.message for unknown 500s in production.
    if (!isProduction && err instanceof Error && err.message) {
      if (isHttpError(err) || err instanceof ZodError) {
        if (message !== err.message) body.detail = err.message;
      } else {
        body.detail = err.message;
      }
    }

    try {
      res.status(status).json(body);
    } catch (sendErr) {
      const msg = sendErr instanceof Error ? sendErr.message : String(sendErr);
      console.error(
        JSON.stringify({
          level: "error" as const,
          msg: "global_error_handler_send_failed",
          method: req.method,
          path: req.originalUrl || req.path,
          requestId: req.requestId,
          errorMessage: msg,
        }),
      );
      if (!res.headersSent) {
        try {
          res.status(500).type("json").send(JSON.stringify({ error: "Internal server error" }));
        } catch {
          /* ignore — response stream may be closed */
        }
      }
    }
  };
}

export function installGlobalErrorHandler(app: Express): void {
  app.use(createGlobalErrorHandler());
}

/**
 * JSON 404 for unmatched API paths (after all routers).
 */
export function installApiNotFoundHandler(app: Express): void {
  app.use((req: Request, res: Response) => {
    if (res.headersSent) {
      return;
    }
    res.status(404).json({ error: "Not found" });
  });
}
