import type { Express, Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { resolveAuthUser } from "./admin-auth";
import { importClientDataAbsolute } from "./client-data-import";

const __dirnameRrtPharm =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));
import { checkEntitlement } from "./entitlements";

interface PharmacologyTopicFull {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  icon: string;
  isFree: boolean;
  seo: { title: string; description: string; keywords: string };
  overview: string;
  highYieldFacts: string[];
  indications: string[];
  contraindications: string[];
  sideEffects: string[];
  clinicalReassessment: string[];
  examWritersFocus: string[];
  commonMistakes: string[];
  keyMedications: { name: string; dose: string; route: string; purpose: string }[];
  clinicalPearls: string[];
  quiz: { question: string; options: string[]; correctIndex: number; rationale: string }[];
}

function stripPremiumFields(topic: PharmacologyTopicFull) {
  return {
    slug: topic.slug,
    title: topic.title,
    shortTitle: topic.shortTitle,
    category: topic.category,
    icon: topic.icon,
    isFree: topic.isFree,
    seo: topic.seo,
    overview: topic.overview,
    highYieldFacts: topic.highYieldFacts,
    isPremiumLocked: true,
  };
}

export function registerRrtPharmacologyRoutes(app: Express) {
  app.get("/api/allied/rrt/pharmacology/topics", async (_req: Request, res: Response) => {
    try {
      const { RRT_PHARMACOLOGY_TOPICS } = await importClientDataAbsolute(
        path.resolve(__dirnameRrtPharm, "../client/src/data/lessons/rrt-pharmacology-topics"),
      );
      const previews = RRT_PHARMACOLOGY_TOPICS.map((t: PharmacologyTopicFull) => ({
        slug: t.slug,
        title: t.title,
        shortTitle: t.shortTitle,
        category: t.category,
        icon: t.icon,
        isFree: t.isFree,
        overview: t.overview.slice(0, 200),
      }));
      res.json(previews);
    } catch (err) {
      console.error("[RRT Pharmacology] Error loading topics list:", err);
      res.status(500).json({ error: "Failed to load topics" });
    }
  });

  app.get("/api/allied/rrt/pharmacology/topics/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const { RRT_PHARMACOLOGY_TOPICS } = await importClientDataAbsolute(
        path.resolve(__dirnameRrtPharm, "../client/src/data/lessons/rrt-pharmacology-topics"),
      );
      const topic = RRT_PHARMACOLOGY_TOPICS.find((t: PharmacologyTopicFull) => t.slug === slug);

      if (!topic) {
        return res.status(404).json({ error: "Topic not found" });
      }

      if (topic.isFree) {
        return res.json({ ...topic, isPremiumLocked: false });
      }

      const user = await resolveAuthUser(req as any);
      if (user && checkEntitlement(user, "rrt_pharmacology")) {
        return res.json({ ...topic, isPremiumLocked: false });
      }

      return res.json(stripPremiumFields(topic));
    } catch (err) {
      console.error("[RRT Pharmacology] Error loading topic:", err);
      res.status(500).json({ error: "Failed to load topic" });
    }
  });
}
