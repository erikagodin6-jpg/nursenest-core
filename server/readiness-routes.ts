import type { Express } from "express";
import { resolveAuthUser } from "./admin-auth";
import { checkEntitlement } from "./entitlements";
import {
  calculateEnhancedReadiness,
  calculatePassProbability,
  calculatePercentileRank,
  detectWeakTopics,
  generateRecommendations,
  createReadinessSnapshot,
  getReadinessHistory,
  getAdminReadinessAnalytics,
  recomputeBenchmarkProfiles,
  ensureReadinessTables,
  ACTIVE_BUILD_PRIORITY,
  CONTENT_EXPANSION_ROADMAP,
} from "./readiness-engine";

export function registerReadinessRoutes(app: Express) {
  ensureReadinessTables().catch(err => console.error("Readiness tables init error:", err));

  app.get("/api/readiness/:userId", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { userId } = req.params;
      if (user.id !== userId && user.tier !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }

      const readiness = await calculateEnhancedReadiness(userId);
      const isPremium = checkEntitlement(user, "pass_probability_model");

      if (!isPremium) {
        return res.json({
          readinessScore: readiness.readinessScore,
          readinessTier: readiness.readinessTier,
          tierLabel: readiness.tierLabel,
          upgradeRequired: true,
          message: "Upgrade to premium for full readiness analysis including pass probability, benchmarks, and recommendations.",
        });
      }

      const [benchmarks, weakTopics, recommendations] = await Promise.all([
        calculatePercentileRank(userId),
        detectWeakTopics(userId),
        generateRecommendations(userId),
      ]);

      res.json({
        readinessScore: readiness.readinessScore,
        readinessTier: readiness.readinessTier,
        tierLabel: readiness.tierLabel,
        passProbability: readiness.passProbability,
        passProbabilityMessage: readiness.passProbabilityMessage,
        factors: readiness.factors,
        examType: readiness.examType,
        benchmarks,
        weakTopics,
        recommendations,
        upgradeRequired: false,
      });
    } catch (e: any) {
      console.error("Readiness error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/readiness/:userId/history", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { userId } = req.params;
      if (user.id !== userId && user.tier !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }

      const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 52, 1), 104);
      const history = await getReadinessHistory(userId, limit);
      res.json({ history, total: history.length });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/readiness/:userId/benchmarks", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { userId } = req.params;
      if (user.id !== userId && user.tier !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }

      const isPremium = checkEntitlement(user, "pass_probability_model");
      if (!isPremium) {
        return res.status(403).json({
          error: "Premium feature - upgrade required",
          upgradeRequired: true,
          feature: "pass_probability_model",
        });
      }

      const benchmarks = await calculatePercentileRank(userId);
      res.json(benchmarks);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/readiness/:userId/recommendations", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { userId } = req.params;
      if (user.id !== userId && user.tier !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }

      const isPremium = checkEntitlement(user, "intelligent_recommendations");
      if (!isPremium) {
        return res.status(403).json({
          error: "Premium feature - upgrade required",
          upgradeRequired: true,
          feature: "intelligent_recommendations",
        });
      }

      const recommendations = await generateRecommendations(userId);
      res.json({ recommendations });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/readiness/snapshot", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const targetUserId = req.body.userId || user.id;

      if (targetUserId !== user.id && user.tier !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }

      const snapshot = await createReadinessSnapshot(targetUserId);
      res.json({ success: true, snapshot });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/readiness/analytics", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user || user.tier !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }

      const analytics = await getAdminReadinessAnalytics();
      res.json(analytics);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/readiness/config", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user || user.tier !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }

      res.json({
        activeBuildPriority: ACTIVE_BUILD_PRIORITY,
        contentExpansionRoadmap: CONTENT_EXPANSION_ROADMAP,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/readiness/recompute-benchmarks", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user || user.tier !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }

      const results = await recomputeBenchmarkProfiles();
      res.json({ success: true, benchmarks: results });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
