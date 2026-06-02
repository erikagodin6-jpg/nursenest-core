import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import { randomUUID } from "crypto";
import { createServer } from "http";
import { asyncHandler } from "./async-handler";
import { HttpError } from "./http-error";
import { installApiNotFoundHandler, installGlobalErrorHandler } from "./global-error-handler";
import { createPublicApiRateLimiter } from "./api-rate-limit";
import { structuredRequestLogMiddleware } from "./structured-request-log";
import { validateCriticalStartupConfig } from "./startup-config";
import { emitStructuredLog, initOptionalLogSinks } from "./log-sink";

console.log("[STARTUP_VIS] server/index.ts: first line of module body (after static imports)");

const LOG_TIMEZONE = "America/Toronto";
const TZ_PARTS = new Intl.DateTimeFormat("sv-SE", {
  timeZone: LOG_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});
const TZ_OFFSET = new Intl.DateTimeFormat("en-US", {
  timeZone: LOG_TIMEZONE,
  timeZoneName: "longOffset",
});

function getTorontoIsoTimestamp(date = new Date()): string {
  const parts = TZ_PARTS.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "00";
  const tzName =
    TZ_OFFSET.formatToParts(date).find((part) => part.type === "timeZoneName")?.value ?? "GMT-00:00";
  const offset = tzName.replace("GMT", "");
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}${offset}`;
}

function installTimestampedConsole(): void {
  const marker = "__nursenestTimestampedConsole";
  if ((globalThis as Record<string, unknown>)[marker]) return;
  (globalThis as Record<string, unknown>)[marker] = true;

  const base = {
    log: console.log.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
  };

  const withTs = (...args: unknown[]) => {
    const toronto = getTorontoIsoTimestamp();
    const utc = new Date().toISOString();
    return [`[ts_local=${toronto} ts_utc=${utc}]`, ...args];
  };

  console.log = (...args: unknown[]) => base.log(...withTs(...args));
  console.info = (...args: unknown[]) => base.info(...withTs(...args));
  console.warn = (...args: unknown[]) => base.warn(...withTs(...args));
  console.error = (...args: unknown[]) => base.error(...withTs(...args));
}

if (!process.env.TZ || !process.env.TZ.trim()) {
  process.env.TZ = LOG_TIMEZONE;
}
installTimestampedConsole();

type DbModule = typeof import("./db");
let dbModulePromise: Promise<DbModule> | null = null;
function loadDbModule(): Promise<DbModule> {
  if (!dbModulePromise) dbModulePromise = import("./db");
  return dbModulePromise;
}

type StripeRuntime = {
  getStripeClient: typeof import("./stripeClient")["getStripeClient"];
  WebhookHandlers: typeof import("./webhookHandlers")["WebhookHandlers"];
  withWebhookIdempotency: typeof import("./webhook-idempotency")["withWebhookIdempotency"];
};
let stripeRuntimePromise: Promise<StripeRuntime> | null = null;
function loadStripeRuntime(): Promise<StripeRuntime> {
  if (!stripeRuntimePromise) {
    stripeRuntimePromise = Promise.all([
      import("./stripeClient"),
      import("./webhookHandlers"),
      import("./webhook-idempotency"),
    ]).then(([stripeClient, webhookHandlers, webhookIdempotency]) => ({
      getStripeClient: stripeClient.getStripeClient,
      WebhookHandlers: webhookHandlers.WebhookHandlers,
      withWebhookIdempotency: webhookIdempotency.withWebhookIdempotency,
    }));
  }
  return stripeRuntimePromise;
}

console.log("[STARTUP_VIS] server/index.ts: immediately BEFORE express() app creation");
const app = express();
app.set("trust proxy", 1);
type DbHealth = "connected" | "disconnected" | "unknown";
let dbHealth: DbHealth = "unknown";
let systemDegraded = false;

app.use((req: Request, res: Response, next: NextFunction) => {
  const headerId = req.headers["x-request-id"];
  req.requestId =
    typeof headerId === "string" && headerId.trim().length > 0
      ? headerId.trim()
      : randomUUID();
  res.setHeader("X-Request-Id", req.requestId);
  next();
});

/* -------------------------
   BASIC HEALTH ROUTES
------------------------- */

app.get("/healthz", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    db: dbHealth,
    degraded: systemDegraded,
  });
});

// Keep a lightweight root response for platform health checks.
app.get("/", (_req, res) => {
  res.status(200).type("text/plain").send("ok");
});

app.get("/readyz", async (_req, res) => {
  try {
    const mem = process.memoryUsage();
    const base = {
      status: "healthy" as const,
      rssMB: Math.round(mem.rss / 1024 / 1024),
    };

    const deep = String(process.env.READYZ_DEEP || "").toLowerCase() === "true";
    const configProbe = deep
      ? {
          adminJwtConfigured: Boolean(process.env.ADMIN_JWT_SECRET?.trim()),
          openAiIntegrationConfigured: Boolean(
            process.env.AI_INTEGRATIONS_OPENAI_API_KEY?.trim(),
          ),
        }
      : undefined;

    if (String(process.env.READYZ_CHECK_DB || "").toLowerCase() === "true") {
      const dbModule = await loadDbModule();
      const target = dbModule.isProductionLikeRuntime() ? "production" : "development";
      const db = await dbModule.testDatabaseConnection(target);
      if (!db.ok) {
        return res.status(503).json({
          status: "degraded",
          rssMB: base.rssMB,
          database: { ok: false, error: db.error },
          ...(configProbe ? { config: configProbe } : {}),
        });
      }
      return res.status(200).json({
        ...base,
        database: { ok: true, timeMs: db.timeMs },
        ...(configProbe ? { config: configProbe } : {}),
      });
    }

    res.status(200).json(configProbe ? { ...base, config: configProbe } : base);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    res.status(503).json({
      status: "unhealthy",
      error: msg,
    });
  }
});

/* -------------------------
   CORE MIDDLEWARE
------------------------- */

app.use(compression());
app.use(cookieParser());

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false }));

app.use(createPublicApiRateLimiter());

/* -------------------------
   SECURITY HEADERS
------------------------- */

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

/* -------------------------
   STRIPE WEBHOOK (SAFE VERSION)
------------------------- */

app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  asyncHandler(async (req, res) => {
    const { getStripeClient, WebhookHandlers, withWebhookIdempotency } =
      await loadStripeRuntime();
    const signature = req.headers["stripe-signature"];

    if (!signature || typeof signature !== "string") {
      throw new HttpError(400, "Missing signature");
    }

    if (!Buffer.isBuffer(req.body)) {
      emitStructuredLog(
        {
          level: "error",
          type: "webhook_invalid_body",
          provider: "stripe",
          route: "POST /api/stripe/webhook",
          requestId: req.requestId,
          msg: "Body is not buffer",
        },
        "error",
      );
      throw new HttpError(400, "Invalid body");
    }

    const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
    if (!secret) {
      emitStructuredLog(
        {
          level: "warn",
          type: "stripe_webhook_secret_unset",
          provider: "stripe",
          route: "POST /api/stripe/webhook",
          requestId: req.requestId,
          msg: "STRIPE_WEBHOOK_SECRET unset — idempotency skipped; align with stripe-replit-sync managed webhook",
        },
        "warn",
      );
      await WebhookHandlers.processWebhook(req.body, signature);
      return res.status(200).json({ received: true });
    }

    const stripe = await getStripeClient();
    let event: { id: string; type: string; livemode: boolean };
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, secret);
    } catch {
      throw new HttpError(400, "Invalid Stripe signature");
    }

    const outcome = await withWebhookIdempotency({
      eventId: event.id,
      eventType: event.type,
      source: "stripe",
      payloadSummary: { type: event.type, livemode: event.livemode },
      requestId: req.requestId,
      handler: () => WebhookHandlers.processWebhook(req.body, signature),
    });

    if (outcome.duplicate) {
      return res.status(200).json({ received: true, duplicate: true });
    }

    return res.status(200).json({ received: true });
  }),
);

/* -------------------------
   REQUEST LOGGING (STRUCTURED)
------------------------- */

app.use(structuredRequestLogMiddleware());

/* -------------------------
   BASIC TEST ROUTE
------------------------- */

app.get("/api/test", (_req, res) => {
  res.json({ ok: true });
});

/* -------------------------
   SERVER START
------------------------- */

console.log("[STARTUP_VIS] server/index.ts: immediately BEFORE createServer(app)");
const httpServer = createServer(app);

const deployBootT0 = Date.now();
const STARTUP_DIAGNOSTICS = String(process.env.STARTUP_DIAGNOSTICS || "").toLowerCase() === "1" || String(process.env.STARTUP_DIAGNOSTICS || "").toLowerCase() === "true";

function diagPhase(label: string): void {
  if (STARTUP_DIAGNOSTICS) {
    console.log(label);
  }
}

function resolveListenPort(): number {
  const raw = process.env.PORT || "8080";
  const n = parseInt(String(raw).trim(), 10);
  if (!Number.isFinite(n) || n < 1 || n > 65535) {
    throw new Error(`Invalid PORT env (must be 1–65535): ${JSON.stringify(raw)}`);
  }
  return n;
}

async function startServer() {
  try {
    console.log("[STARTUP_VIS] server/index.ts: immediately BEFORE resolveListenPort()");
    let port: number;
    try {
      port = resolveListenPort();
    } catch (e: unknown) {
      console.error("[STARTUP_VIS] server/index.ts: resolveListenPort() threw", e);
      throw e;
    }
    console.log("[STARTUP_VIS] server/index.ts: immediately AFTER resolveListenPort()", { port });
    console.log("STARTING WEB SERVER");
    console.log(`listening_port=${port} bind=0.0.0.0 (from PORT env when set)`);
    console.log(`LISTENING ON PORT ${port}`);
    console.log("HEALTH ENDPOINT READY");

    const nodeEnv = process.env.NODE_ENV || null;
    const hasDatabaseUrl = Boolean(process.env.DATABASE_URL?.trim());
    const hasProdDatabaseUrl = Boolean(process.env.PROD_DATABASE_URL?.trim());
    const allowProdFallback = process.env.ALLOW_PROD_FALLBACK_TO_DATABASE_URL || null;

    console.log(
      JSON.stringify({
        type: "nursenest_startup",
        nodeEnv,
        port,
        portFromEnv: process.env.PORT !== undefined && String(process.env.PORT).trim() !== "",
        hasDatabaseUrl,
        hasProdDatabaseUrl,
        allowProdFallbackToDatabaseUrl: allowProdFallback,
      }),
    );

    console.log("[STARTUP_VIS] server/index.ts: immediately BEFORE initOptionalLogSinks()");
    try {
      initOptionalLogSinks();
    } catch (e: unknown) {
      console.error("[STARTUP_VIS] server/index.ts: initOptionalLogSinks() threw", e);
      throw e;
    }
    console.log("[STARTUP_VIS] server/index.ts: immediately AFTER initOptionalLogSinks()");

    httpServer.once("error", (err: NodeJS.ErrnoException) => {
      console.error("[FATAL STARTUP] HTTP server error:", err?.message || err);
      process.exit(1);
    });

    diagPhase("PHASE 3: app.listen");
    console.log("[STARTUP_VIS] server/index.ts: immediately BEFORE httpServer.listen(...)", {
      port,
      bind: "0.0.0.0",
    });
    try {
      httpServer.listen(port, "0.0.0.0", async () => {
        console.log("[STARTUP_VIS] server/index.ts: first line INSIDE listen callback");
        console.log(`BOOT SUCCESS: HTTP server listening on 0.0.0.0:${port}`);
        console.log(`SERVER STARTED port=${port} bind=0.0.0.0`);
        console.log(`[deploy-timing] listen_ready_ms=${Date.now() - deployBootT0}`);
        diagPhase("PHASE 4: health endpoint ready");
        emitStructuredLog({
          level: "info",
          type: "server_listen",
          msg: "Server running",
          port,
        });

        diagPhase("PHASE 1: config validation");
        const startup = validateCriticalStartupConfig();
        if (!startup.ok) {
          systemDegraded = true;
          console.warn(
            "[startup] SYSTEM DEGRADED: critical config warnings (continuing to serve /health):\n  - " +
              startup.errors.join("\n  - "),
          );
        }
        const dbModule = await loadDbModule();
        dbModule.logStartupDatabaseResolution();
        diagPhase("PHASE 2: server initialization");

        // Route registration can trigger heavy module evaluation. Defer loading
        // until after listen so readiness can pass on lightweight health routes.
        void (async () => {
          try {
            const routesT0 = Date.now();
            const { registerRoutes } = await import("./routes");
            await registerRoutes(httpServer, app);
            console.log(`[deploy-timing] register_routes_ms=${Date.now() - routesT0}`);
            // 404 + global error handler MUST be registered after all routes.
            installApiNotFoundHandler(app);
            installGlobalErrorHandler(app);
          } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            console.error("[startup] route registration failed (continuing to listen):", msg);
            if (e instanceof Error && e.stack) console.error(e.stack);
          }
        })();

        // DB connectivity is allowed to fail; the service should still start listening
        // so DigitalOcean readiness can pass. We probe and log asynchronously.
        void (async () => {
          diagPhase("PHASE 5: optional DB probe");
          try {
            const dbProbe = await dbModule.testDatabaseConnection();
            if (dbProbe.ok) {
              dbHealth = "connected";
              console.log("DB CONNECTED");
              console.log(
                JSON.stringify({
                  type: "db_startup_probe",
                  ok: true,
                  target: dbProbe.target,
                  timeMs: dbProbe.timeMs,
                }),
              );
            } else {
              dbHealth = "disconnected";
              systemDegraded = true;
              console.error("DB FAILED");
              console.warn("SYSTEM DEGRADED");
              console.error(
                JSON.stringify({
                  type: "db_startup_probe",
                  ok: false,
                  target: dbProbe.target,
                  error: dbProbe.error,
                }),
              );
            }
          } catch (e: unknown) {
            dbHealth = "disconnected";
            systemDegraded = true;
            const msg = e instanceof Error ? e.message : String(e);
            console.error("DB FAILED");
            console.warn("SYSTEM DEGRADED");
            console.error("[db_startup_probe] unexpected error:", msg);
          }
        })();

        // Keep probing in the background so DB recovery is reflected without restarts.
        setInterval(async () => {
          try {
            const dbProbe = await dbModule.testDatabaseConnection();
            if (dbProbe.ok) {
              if (dbHealth !== "connected") {
                console.log("DB CONNECTED");
              }
              dbHealth = "connected";
            } else {
              if (dbHealth !== "disconnected") {
                console.error("DB FAILED");
                console.warn("SYSTEM DEGRADED");
              }
              dbHealth = "disconnected";
              systemDegraded = true;
            }
          } catch {
            if (dbHealth !== "disconnected") {
              console.error("DB FAILED");
              console.warn("SYSTEM DEGRADED");
            }
            dbHealth = "disconnected";
            systemDegraded = true;
          }
        }, 30000).unref();
      });
    } catch (e: unknown) {
      console.error("[STARTUP_VIS] server/index.ts: httpServer.listen(...) threw synchronously", e);
      throw e;
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("BOOT FAILED: web server did not start");
    console.error("[FATAL STARTUP]", msg);
    if (err instanceof Error && err.stack) {
      console.error(err.stack);
    }
    try {
      emitStructuredLog(
        {
          level: "error",
          type: "fatal_startup",
          msg,
        },
        "error",
      );
    } catch {
      /* optional sinks may not be initialized */
    }
    process.exit(1);
  }
}

console.log("[STARTUP_VIS] server/index.ts: immediately BEFORE startServer()");
void startServer();

/* -------------------------
   GRACEFUL SHUTDOWN
------------------------- */

function setupGracefulShutdown() {
  let shuttingDown = false;

  const shutdown = (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;

    emitStructuredLog({ level: "info", type: "shutdown_signal", msg: signal });

    httpServer.close(() => {
      emitStructuredLog({ level: "info", type: "shutdown_complete", msg: "server closed" });
      process.exit(0);
    });

    setTimeout(() => {
      emitStructuredLog({ level: "error", type: "shutdown_forced", msg: "forced exit after timeout" }, "error");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

setupGracefulShutdown();