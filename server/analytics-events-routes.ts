import type { Express } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { ANALYTICS_EVENT_NAMES } from "@shared/schema";
import { requireAdmin } from "./admin-auth";

const analyticsEventPayloadSchema = z.object({
  eventName: z.enum(ANALYTICS_EVENT_NAMES),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  platform: z.string().optional(),
  timestamp: z.string().datetime().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const batchPayloadSchema = z.union([
  analyticsEventPayloadSchema,
  z.array(analyticsEventPayloadSchema).max(50),
]);

export function registerAnalyticsEventsRoutes(app: Express) {
  const analyticsIngestLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: { error: "Too many analytics requests. Please slow down." },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: true, trustProxy: true },
  });

  app.post("/api/analytics/events", analyticsIngestLimiter, async (req, res) => {
    try {
      const parsed = batchPayloadSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid payload", details: parsed.error.issues });
        return;
      }

      const events = Array.isArray(parsed.data) ? parsed.data : [parsed.data];
      const ipAddress = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || null;
      const userAgent = req.headers["user-agent"] || null;

      const enrichedEvents = events.map((event) => ({
        ...event,
        timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
        metadata: event.metadata ?? {},
        ipAddress,
        userAgent,
      }));

      res.status(202).json({ accepted: enrichedEvents.length });

      setImmediate(async () => {
        try {
          if (enrichedEvents.length === 1) {
            await storage.createAnalyticsEvent(enrichedEvents[0]);
          } else {
            await storage.createAnalyticsEventsBatch(enrichedEvents);
          }
        } catch (storageError) {
          console.error("[analytics-events] Failed to store events:", storageError);
        }
      });
    } catch (error) {
      console.error("[analytics-events] Unexpected error:", error);
      res.status(202).json({ accepted: 0 });
    }
  });

  app.get("/api/admin/analytics/events", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const querySchema = z.object({
        eventName: z.string().optional(),
        userId: z.string().optional(),
        platform: z.string().optional(),
        dateFrom: z.string().datetime({ offset: true }).optional(),
        dateTo: z.string().datetime({ offset: true }).optional(),
        limit: z.coerce.number().int().min(1).max(1000).optional(),
        offset: z.coerce.number().int().min(0).optional(),
      });

      const parsed = querySchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid query parameters", details: parsed.error.issues });
        return;
      }

      const result = await storage.getAnalyticsEvents(parsed.data);
      res.json(result);
    } catch (error: any) {
      console.error("[analytics-events] Admin query error:", error);
      res.status(500).json({ error: error.message });
    }
  });
}
