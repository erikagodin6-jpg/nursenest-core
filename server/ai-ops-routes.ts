import type { Express, Request, Response, NextFunction } from "express";
import { requireAdmin } from "./admin-auth";
import { emitStructuredLog } from "./log-sink";
import { routeParamString } from "./route-params";
import { z } from "zod";
import {
  loadProviders,
  getProviders,
  addProvider,
  updateProvider,
  deleteProvider,
  getKillSwitch,
  setKillSwitch,
  getRouterStatus,
  getRequestLogs,
  getCostSummary,
  setBudgetLimits,
} from "./ai-provider-router";

const providerCreateSchema = z.object({
  name: z.string().min(1).max(100),
  providerType: z.enum(["openai", "ollama", "vllm", "lmstudio", "anthropic"]),
  endpointUrl: z.string().url(),
  apiKey: z.string().optional(),
  models: z.array(z.string()).default([]),
  costPerInputToken: z.number().min(0).default(0),
  costPerOutputToken: z.number().min(0).default(0),
  maxConcurrency: z.number().int().min(1).max(100).default(5),
  rateLimit: z.number().int().min(1).max(10000).default(60),
  healthEndpoint: z.string().url().nullable().optional(),
  priority: z.number().int().min(1).max(1000).default(100),
  enabled: z.boolean().default(true),
  taskTypes: z.array(z.string()).default([]),
});

const providerUpdateSchema = providerCreateSchema.partial();

const budgetLimitsSchema = z.object({
  dailyLimit: z.number().min(0).optional(),
  monthlyLimit: z.number().min(0).optional(),
});

const MAX_REQUEST_LOG_LIMIT = 200;
const DEFAULT_REQUEST_LOG_LIMIT = 100;

function parsePositiveInt(value: unknown, fallback: number, max?: number): number {
  const scalar = Array.isArray(value) ? value[0] : value;
  const parsed = parseInt(String(scalar), 10);

  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }

  if (typeof max === "number") {
    return Math.min(parsed, max);
  }

  return parsed;
}

function sanitizeProvider(provider: any) {
  return {
    id: provider.id,
    name: provider.name,
    providerType: provider.providerType,
    endpointUrl: provider.endpointUrl,
    models: provider.models,
    costPerInputToken: provider.costPerInputToken,
    costPerOutputToken: provider.costPerOutputToken,
    maxConcurrency: provider.maxConcurrency,
    rateLimit: provider.rateLimit,
    healthEndpoint: provider.healthEndpoint,
    priority: provider.priority,
    enabled: provider.enabled,
    isHealthy: provider.isHealthy,
    lastHealthCheck: provider.lastHealthCheck,
    consecutiveFailures: provider.consecutiveFailures,
    taskTypes: provider.taskTypes,
  };
}

function handleRouteError(route: string, err: unknown, res: Response) {
  const message =
    err instanceof Error ? err.message : "Internal server error";

  emitStructuredLog(
    {
      level: "error",
      type: "ai_ops_route_failure",
      route,
      message: message || "Internal server error",
    },
    "error",
  );
  console.error(`AI Ops route error [${route}]`, err);

  res.status(500).json({
    error: message || "Internal server error",
    code: "AI_OPS_INTERNAL_ERROR",
  });
}

async function requireAdminOrReturn(req: Request, res: Response) {
  const admin = await requireAdmin(req, res);
  if (!admin) return null;
  return admin;
}

function withAdmin(
  handler: (req: Request, res: Response, next?: NextFunction) => Promise<unknown>
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const admin = await requireAdminOrReturn(req, res);
    if (!admin) return;

    await handler(req, res, next);
  };
}

export function setupAiOpsRoutes(app: Express): void {
  app.get(
    "/api/admin/ai-ops/status",
    withAdmin(async (req, res) => {
      try {
        const status = getRouterStatus();
        const providers = getProviders();

        res.json({
          ...status,
          providers: providers.map(sanitizeProvider),
        });
      } catch (err) {
        handleRouteError("GET /api/admin/ai-ops/status", err, res);
      }
    })
  );

  app.get(
    "/api/admin/ai-ops/providers",
    withAdmin(async (req, res) => {
      try {
        const providers = getProviders();
        res.json(providers.map(sanitizeProvider));
      } catch (err) {
        handleRouteError("GET /api/admin/ai-ops/providers", err, res);
      }
    })
  );

  app.post(
    "/api/admin/ai-ops/providers",
    withAdmin(async (req, res) => {
      try {
        const parsed = providerCreateSchema.safeParse(req.body);

        if (!parsed.success) {
          return res.status(400).json({
            error: "Validation failed",
            details: parsed.error.flatten().fieldErrors,
          });
        }

        const provider = await addProvider(parsed.data);
        res.status(201).json(provider);
      } catch (err) {
        handleRouteError("POST /api/admin/ai-ops/providers", err, res);
      }
    })
  );

  app.put(
    "/api/admin/ai-ops/providers/:id",
    withAdmin(async (req, res) => {
      try {
        const parsed = providerUpdateSchema.safeParse(req.body);

        if (!parsed.success) {
          return res.status(400).json({
            error: "Validation failed",
            details: parsed.error.flatten().fieldErrors,
          });
        }

        const updated = await updateProvider(routeParamString(req.params.id), parsed.data);

        if (!updated) {
          return res.status(404).json({ error: "Provider not found" });
        }

        res.json(updated);
      } catch (err) {
        handleRouteError("PUT /api/admin/ai-ops/providers/:id", err, res);
      }
    })
  );

  app.delete(
    "/api/admin/ai-ops/providers/:id",
    withAdmin(async (req, res) => {
      try {
        const deleted = await deleteProvider(routeParamString(req.params.id));

        if (!deleted) {
          return res.status(404).json({ error: "Provider not found" });
        }

        res.json({ success: true });
      } catch (err) {
        handleRouteError("DELETE /api/admin/ai-ops/providers/:id", err, res);
      }
    })
  );

  app.post(
    "/api/admin/ai-ops/kill-switch",
    withAdmin(async (req, res) => {
      try {
        const enabledSchema = z.object({
          enabled: z.boolean(),
        });

        const parsed = enabledSchema.safeParse(req.body);

        if (!parsed.success) {
          return res.status(400).json({
            error: "Validation failed",
            details: parsed.error.flatten().fieldErrors,
          });
        }

        setKillSwitch(parsed.data.enabled);

        res.json({
          killSwitch: getKillSwitch(),
        });
      } catch (err) {
        handleRouteError("POST /api/admin/ai-ops/kill-switch", err, res);
      }
    })
  );

  app.get(
    "/api/admin/ai-ops/cost-summary",
    withAdmin(async (req, res) => {
      try {
        const summary = await getCostSummary();
        res.json(summary);
      } catch (err) {
        handleRouteError("GET /api/admin/ai-ops/cost-summary", err, res);
      }
    })
  );

  app.get(
    "/api/admin/ai-ops/request-logs",
    withAdmin(async (req, res) => {
      try {
        const limit = parsePositiveInt(
          req.query.limit,
          DEFAULT_REQUEST_LOG_LIMIT,
          MAX_REQUEST_LOG_LIMIT
        );

        const providerId =
          typeof req.query.providerId === "string" ? req.query.providerId : undefined;

        const taskType =
          typeof req.query.taskType === "string" ? req.query.taskType : undefined;

        const since =
          typeof req.query.since === "string" ? req.query.since : undefined;

        const logs = await getRequestLogs({
          limit,
          providerId,
          taskType,
          since,
        });

        res.json(logs);
      } catch (err) {
        handleRouteError("GET /api/admin/ai-ops/request-logs", err, res);
      }
    })
  );

  app.post(
    "/api/admin/ai-ops/providers/:id/toggle",
    withAdmin(async (req, res) => {
      try {
        const providers = getProviders();
        const id = routeParamString(req.params.id);
        const provider = providers.find((p) => p.id === id);

        if (!provider) {
          return res.status(404).json({ error: "Provider not found" });
        }

        const updated = await updateProvider(id, {
          enabled: !provider.enabled,
        });

        if (!updated) {
          return res.status(404).json({ error: "Provider not found" });
        }

        res.json(updated);
      } catch (err) {
        handleRouteError("POST /api/admin/ai-ops/providers/:id/toggle", err, res);
      }
    })
  );

  app.post(
    "/api/admin/ai-ops/reload-providers",
    withAdmin(async (req, res) => {
      try {
        await loadProviders();

        res.json({
          success: true,
          providerCount: getProviders().length,
        });
      } catch (err) {
        handleRouteError("POST /api/admin/ai-ops/reload-providers", err, res);
      }
    })
  );

  app.post(
    "/api/admin/ai-ops/budget-limits",
    withAdmin(async (req, res) => {
      try {
        const parsed = budgetLimitsSchema.safeParse(req.body);

        if (!parsed.success) {
          return res.status(400).json({
            error: "Validation failed",
            details: parsed.error.flatten().fieldErrors,
          });
        }

        setBudgetLimits(parsed.data.dailyLimit, parsed.data.monthlyLimit);

        const status = getRouterStatus();

        res.json({
          dailyBudgetLimit: status.dailyBudgetLimit,
          monthlyBudgetLimit: status.monthlyBudgetLimit,
        });
      } catch (err) {
        handleRouteError("POST /api/admin/ai-ops/budget-limits", err, res);
      }
    })
  );
}