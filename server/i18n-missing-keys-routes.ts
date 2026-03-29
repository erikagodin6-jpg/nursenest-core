import type { Express, Request, Response } from "express";
import { requireAdmin } from "./admin-auth";
import rateLimit from "express-rate-limit";
import { BoundedMap } from "./bounded-map";

interface MissingKeyEntry {
  language: string;
  key: string;
  reportedAt: number;
  count: number;
}

const MAX_STORE_SIZE = 500;
const missingKeysStore = new BoundedMap<string, MissingKeyEntry>(MAX_STORE_SIZE);

const missingKeysPostLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many missing key reports, please try again later" },
});

export function registerI18nMissingKeysRoutes(app: Express) {
  app.post("/api/i18n/missing-keys", missingKeysPostLimiter, (req: Request, res: Response) => {
    const { keys } = req.body;

    if (!Array.isArray(keys) || keys.length === 0) {
      return res.status(400).json({ error: "Expected { keys: [{ language, key }] }" });
    }

    if (keys.length > 100) {
      return res.status(400).json({ error: "Maximum 100 keys per batch" });
    }

    let added = 0;
    let updated = 0;

    for (const entry of keys) {
      if (!entry || typeof entry.language !== "string" || typeof entry.key !== "string") {
        continue;
      }

      const lang = entry.language.slice(0, 10);
      const key = entry.key.slice(0, 200);
      const storeKey = `${lang}:${key}`;

      const existing = missingKeysStore.get(storeKey);
      if (existing) {
        existing.count++;
        existing.reportedAt = Date.now();
        updated++;
      } else {
        missingKeysStore.set(storeKey, {
          language: lang,
          key,
          reportedAt: Date.now(),
          count: 1,
        });
        added++;
      }
    }

    res.json({ accepted: added + updated, added, updated });
  });

  app.get("/api/i18n/missing-keys", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const lang = req.query.language as string | undefined;

    const entries: MissingKeyEntry[] = [];
    for (const entry of missingKeysStore.values()) {
      if (!lang || entry.language === lang) {
        entries.push(entry);
      }
    }

    entries.sort((a, b) => b.count - a.count);

    const grouped: Record<string, { key: string; count: number; lastReported: number }[]> = {};
    for (const entry of entries) {
      if (!grouped[entry.language]) grouped[entry.language] = [];
      grouped[entry.language].push({
        key: entry.key,
        count: entry.count,
        lastReported: entry.reportedAt,
      });
    }

    res.json({
      totalKeys: entries.length,
      languages: grouped,
    });
  });

  app.delete("/api/i18n/missing-keys", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const lang = req.query.language as string | undefined;

    if (lang) {
      for (const [k, v] of missingKeysStore) {
        if (v.language === lang) missingKeysStore.delete(k);
      }
    } else {
      missingKeysStore.clear();
    }

    res.json({ cleared: true });
  });
}
