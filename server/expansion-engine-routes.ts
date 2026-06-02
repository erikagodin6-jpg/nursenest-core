import type { Express } from "express";
import { requireAdmin } from "./admin-auth";
import { runExpansionForTier, runFullExpansion, getExpansionStatus, runCriticalCareSubspecialty, runFullCriticalCareExpansion, getCriticalCareExpansionStatus, runProceduralSurgicalSubspecialty, runFullProceduralSurgicalExpansion, getProceduralSurgicalExpansionStatus, checkAutoGenerationTriggers, runAutoTriggeredExpansions } from "./qbank-expansion-engine";
import { runRNBatch2Expansion, runRNBatch2Category, getBatch2Categories, getRNBatch2Status } from "./rn-batch2-expansion-engine";

const activeExpansions = new Map<string, { status: string; summary?: any; error?: string }>();

export function registerExpansionEngineRoutes(app: Express) {
  app.post("/api/admin/expansion-engine/start", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { tier, targetCount } = req.body;
      const validTiers = ["rpn", "rn", "np"];

      if (!tier || !validTiers.includes(tier)) {
        return res.status(400).json({ error: `Invalid tier. Must be one of: ${validTiers.join(", ")}` });
      }

      const count = targetCount ? parseInt(targetCount) : undefined;
      if (count !== undefined && (isNaN(count) || count < 1 || count > 5000)) {
        return res.status(400).json({ error: "targetCount must be between 1 and 5000" });
      }

      const key = `expansion-${tier}`;
      if (activeExpansions.has(key) && activeExpansions.get(key)?.status === "running") {
        return res.status(409).json({ error: `Expansion for ${tier} is already running` });
      }

      activeExpansions.set(key, { status: "running" });
      res.json({ ok: true, message: `Started ${tier.toUpperCase()} expansion for ${count || "default"} questions`, key });

      runExpansionForTier(tier, count, (progress) => {
        console.log(`[Expansion Route] Progress: batch ${progress.batchNumber}, ${progress.questionsGenerated} questions`);
      }).then((summary) => {
        activeExpansions.set(key, { status: "complete", summary });
      }).catch((err) => {
        console.error(`[Expansion Route] Error:`, err);
        activeExpansions.set(key, { status: "failed", error: err.message });
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/expansion-engine/start-full", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      if (activeExpansions.has("expansion-full") && activeExpansions.get("expansion-full")?.status === "running") {
        return res.status(409).json({ error: "Full expansion is already running" });
      }

      activeExpansions.set("expansion-full", { status: "running" });
      res.json({ ok: true, message: "Started full 8,000-question expansion across all tiers (rpn=2000, rn=4000, np=2000)" });

      runFullExpansion((progress) => {
        console.log(`[Expansion Full] Progress: batch ${progress.batchNumber} (${progress.tier}), ${progress.questionsGenerated} questions`);
      }).then((result) => {
        activeExpansions.set("expansion-full", { status: "complete", summary: result });
      }).catch((err) => {
        console.error(`[Expansion Full] Error:`, err);
        activeExpansions.set("expansion-full", { status: "failed", error: err.message });
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/expansion-engine/status", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const dbStatus = await getExpansionStatus();
      const runningJobs: Record<string, any> = {};

      activeExpansions.forEach((val, key) => {
        runningJobs[key] = val;
      });

      res.json({
        ...dbStatus,
        activeJobs: runningJobs,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/expansion-engine/summary/:tier", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { tier } = req.params;
      const key = `expansion-${tier}`;
      const job = activeExpansions.get(key);

      if (!job) {
        return res.status(404).json({ error: `No expansion found for tier ${tier}` });
      }

      res.json(job);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/expansion-engine/critical-care/start", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { subspecialty, targetCount } = req.body;
      const validSubspecialties = ["ICU Nursing", "Cardiac ICU", "Neuro ICU", "Trauma ICU", "PICU", "NICU"];

      if (!subspecialty || !validSubspecialties.includes(subspecialty)) {
        return res.status(400).json({ error: `Invalid subspecialty. Must be one of: ${validSubspecialties.join(", ")}` });
      }

      const count = targetCount ? parseInt(targetCount) : 500;
      if (isNaN(count) || count < 1 || count > 5000) {
        return res.status(400).json({ error: "targetCount must be between 1 and 5000" });
      }

      const key = `critical-care-${subspecialty.toLowerCase().replace(/\s+/g, "-")}`;
      if (activeExpansions.has(key) && activeExpansions.get(key)?.status === "running") {
        return res.status(409).json({ error: `Critical Care expansion for ${subspecialty} is already running` });
      }

      activeExpansions.set(key, { status: "running" });
      res.json({ ok: true, message: `Started Critical Care ${subspecialty} expansion for ${count} questions`, key });

      runCriticalCareSubspecialty(subspecialty, count, (progress) => {
        console.log(`[CriticalCare Route] Progress: batch ${progress.batchNumber}, ${progress.questionsGenerated} questions`);
      }).then((summary) => {
        activeExpansions.set(key, { status: "complete", summary });
      }).catch((err) => {
        console.error(`[CriticalCare Route] Error:`, err);
        activeExpansions.set(key, { status: "failed", error: err.message });
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/expansion-engine/critical-care/start-full", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      if (activeExpansions.has("critical-care-full") && activeExpansions.get("critical-care-full")?.status === "running") {
        return res.status(409).json({ error: "Full Critical Care expansion is already running" });
      }

      activeExpansions.set("critical-care-full", { status: "running" });
      res.json({ ok: true, message: "Started full 3,000-question Critical Care expansion across 6 subspecialties (500 each: ICU Nursing, Cardiac ICU, Neuro ICU, Trauma ICU, PICU, NICU)" });

      runFullCriticalCareExpansion((progress) => {
        console.log(`[CriticalCare Full] Progress: batch ${progress.batchNumber} (${progress.tier}), ${progress.questionsGenerated} questions`);
      }).then((result) => {
        activeExpansions.set("critical-care-full", { status: "complete", summary: result });
      }).catch((err) => {
        console.error(`[CriticalCare Full] Error:`, err);
        activeExpansions.set("critical-care-full", { status: "failed", error: err.message });
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/expansion-engine/critical-care/status", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const dbStatus = await getCriticalCareExpansionStatus();
      const runningJobs: Record<string, any> = {};

      activeExpansions.forEach((val, key) => {
        if (key.startsWith("critical-care")) {
          runningJobs[key] = val;
        }
      });

      res.json({
        ...dbStatus,
        activeJobs: runningJobs,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/expansion-engine/procedural-surgical/start", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { subspecialty, targetCount } = req.body;
      const validSubspecialties = ["Perioperative Nursing", "Operating Room Nursing", "PACU Nursing", "Cath Lab Nursing", "Interventional Radiology Nursing", "Endoscopy Nursing"];

      if (!subspecialty || !validSubspecialties.includes(subspecialty)) {
        return res.status(400).json({ error: `Invalid subspecialty. Must be one of: ${validSubspecialties.join(", ")}` });
      }

      const count = targetCount ? parseInt(targetCount) : 500;
      if (isNaN(count) || count < 1 || count > 5000) {
        return res.status(400).json({ error: "targetCount must be between 1 and 5000" });
      }

      const key = `procedural-surgical-${subspecialty.toLowerCase().replace(/\s+/g, "-")}`;
      if (activeExpansions.has(key) && activeExpansions.get(key)?.status === "running") {
        return res.status(409).json({ error: `Procedural/Surgical expansion for ${subspecialty} is already running` });
      }

      activeExpansions.set(key, { status: "running" });
      res.json({ ok: true, message: `Started Procedural/Surgical ${subspecialty} expansion for ${count} questions`, key });

      runProceduralSurgicalSubspecialty(subspecialty, count, (progress) => {
        console.log(`[ProceduralSurgical Route] Progress: batch ${progress.batchNumber}, ${progress.questionsGenerated} questions`);
      }).then((summary) => {
        activeExpansions.set(key, { status: "complete", summary });
      }).catch((err) => {
        console.error(`[ProceduralSurgical Route] Error:`, err);
        activeExpansions.set(key, { status: "failed", error: err.message });
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/expansion-engine/procedural-surgical/start-full", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      if (activeExpansions.has("procedural-surgical-full") && activeExpansions.get("procedural-surgical-full")?.status === "running") {
        return res.status(409).json({ error: "Full Procedural/Surgical expansion is already running" });
      }

      activeExpansions.set("procedural-surgical-full", { status: "running" });
      res.json({ ok: true, message: "Started full 3,000-question Procedural/Surgical expansion across 6 subspecialties (500 each: Perioperative Nursing, Operating Room Nursing, PACU Nursing, Cath Lab Nursing, Interventional Radiology Nursing, Endoscopy Nursing)" });

      runFullProceduralSurgicalExpansion((progress) => {
        console.log(`[ProceduralSurgical Full] Progress: batch ${progress.batchNumber} (${progress.tier}), ${progress.questionsGenerated} questions`);
      }).then((result) => {
        activeExpansions.set("procedural-surgical-full", { status: "complete", summary: result });
      }).catch((err) => {
        console.error(`[ProceduralSurgical Full] Error:`, err);
        activeExpansions.set("procedural-surgical-full", { status: "failed", error: err.message });
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/expansion-engine/procedural-surgical/status", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const dbStatus = await getProceduralSurgicalExpansionStatus();
      const runningJobs: Record<string, any> = {};

      activeExpansions.forEach((val, key) => {
        if (key.startsWith("procedural-surgical")) {
          runningJobs[key] = val;
        }
      });

      res.json({
        ...dbStatus,
        activeJobs: runningJobs,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/expansion-engine/auto-trigger-check", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const result = await checkAutoGenerationTriggers();
      res.json({
        ok: true,
        tiersBelow50Percent: result.triggered.length,
        deficits: result.deficits,
        triggered: result.triggered,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/expansion-engine/auto-trigger-run", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      if (activeExpansions.has("auto-trigger") && activeExpansions.get("auto-trigger")?.status === "running") {
        return res.status(409).json({ error: "Auto-triggered expansion is already running" });
      }

      const check = await checkAutoGenerationTriggers();
      if (check.triggered.length === 0) {
        return res.json({ ok: true, message: "All tiers are above the 50% threshold. No expansion needed.", deficits: [] });
      }

      activeExpansions.set("auto-trigger", { status: "running" });
      res.json({
        ok: true,
        message: `Auto-triggering expansion for ${check.triggered.length} tier(s): ${check.triggered.join(", ")}`,
        deficits: check.deficits,
      });

      runAutoTriggeredExpansions((info) => {
        console.log(`[Auto-Trigger] ${info.tier}: ${info.status}`);
      }).then((result) => {
        activeExpansions.set("auto-trigger", { status: "complete", summary: result });
      }).catch((err) => {
        console.error("[Auto-Trigger] Error:", err);
        activeExpansions.set("auto-trigger", { status: "failed", error: err.message });
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/expansion-engine/rn-batch2/start", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      if (activeExpansions.has("rn-batch2-full") && activeExpansions.get("rn-batch2-full")?.status === "running") {
        return res.status(409).json({ error: "RN Batch 2 expansion is already running" });
      }

      activeExpansions.set("rn-batch2-full", { status: "running" });
      res.json({
        ok: true,
        message: "Started RN Batch 2 expansion: 510 questions across 7 categories (Maternal/Newborn, Pediatrics, Mental Health, Leadership/Delegation, Critical Care, Community Health, Emergency Nursing)",
        categories: getBatch2Categories(),
      });

      runRNBatch2Expansion((progress) => {
        console.log(`[RN-Batch2 Route] Progress: batch ${progress.batchNumber} (${progress.category}), ${progress.questionsGenerated} questions`);
      }).then((summary) => {
        activeExpansions.set("rn-batch2-full", { status: "complete", summary });
      }).catch((err) => {
        console.error(`[RN-Batch2 Route] Error:`, err);
        activeExpansions.set("rn-batch2-full", { status: "failed", error: err.message });
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/expansion-engine/rn-batch2/start-category", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { category, targetCount } = req.body;
      const validCategories = getBatch2Categories().map(c => c.name);

      if (!category || !validCategories.includes(category)) {
        return res.status(400).json({ error: `Invalid category. Must be one of: ${validCategories.join(", ")}` });
      }

      const count = targetCount ? parseInt(targetCount) : undefined;
      if (count !== undefined && (isNaN(count) || count < 1 || count > 500)) {
        return res.status(400).json({ error: "targetCount must be between 1 and 500" });
      }

      const key = `rn-batch2-${category.toLowerCase().replace(/[\s/]+/g, "-")}`;
      if (activeExpansions.has(key) && activeExpansions.get(key)?.status === "running") {
        return res.status(409).json({ error: `RN Batch 2 expansion for ${category} is already running` });
      }

      activeExpansions.set(key, { status: "running" });
      res.json({ ok: true, message: `Started RN Batch 2 ${category} expansion for ${count || "default"} questions`, key });

      runRNBatch2Category(category, count, (progress) => {
        console.log(`[RN-Batch2 Route] Progress: batch ${progress.batchNumber} (${progress.category}), ${progress.questionsGenerated} questions`);
      }).then((summary) => {
        activeExpansions.set(key, { status: "complete", summary });
      }).catch((err) => {
        console.error(`[RN-Batch2 Route] Error:`, err);
        activeExpansions.set(key, { status: "failed", error: err.message });
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/expansion-engine/rn-batch2/status", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const dbStatus = await getRNBatch2Status();
      const runningJobs: Record<string, any> = {};

      activeExpansions.forEach((val, key) => {
        if (key.startsWith("rn-batch2")) {
          runningJobs[key] = val;
        }
      });

      res.json({
        ...dbStatus,
        categories: getBatch2Categories(),
        activeJobs: runningJobs,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/expansion-engine/massive-expansion", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const key = "massive-nursing-expansion";
    if (activeExpansions.has(key) && activeExpansions.get(key)?.status === "running") {
      return res.status(409).json({ error: "Massive expansion is already running" });
    }

    activeExpansions.set(key, { status: "running" });
    res.json({ status: "started", message: "Massive nursing question bank expansion started" });

    try {
      const { runNursingQuestionExpansion } = await import("./nursing-question-seeder");
      const result = await runNursingQuestionExpansion();
      activeExpansions.set(key, { status: "complete", summary: result });
    } catch (e: any) {
      activeExpansions.set(key, { status: "failed", error: e.message });
      console.error("[MassiveExpansion] Failed:", e.message);
    }
  });

  app.get("/api/admin/expansion-engine/massive-expansion/status", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const key = "massive-nursing-expansion";
    const status = activeExpansions.get(key) || { status: "not_started" };
    res.json(status);
  });
}
