import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    /** Correlation id (from X-Request-Id or generated). */
    requestId?: string;
    /** Set by entitlement middleware on some routes; used for access logs when present. */
    authUser?: { id?: string; tier?: string; [key: string]: unknown };
  }
}
