import type { Express } from "express";
import { storage } from "./storage";
import { requireAdmin } from "./admin-auth";
import {
  insertImagingArtifactImageSchema,
  insertImagingComparisonSetSchema,
  insertImagingAnatomyImageSchema,
  insertImagingPhysicsVisualSchema,
  insertImagingImageBriefSchema,
  insertImagingPositioningEntrySchema,
} from "@shared/schema";
let _seedCache: any = null;
async function getImagingSeedData() {
  if (!_seedCache) {
    _seedCache = await import("./seed-data/imaging-library-seed");
  }
  return _seedCache;
}

export function registerImagingLibraryRoutes(app: Express) {
  app.get("/api/imaging/positioning-entries", async (req, res) => {
    try {
      const { country, bodyRegion, status } = req.query;
      const filters: any = {};
      if (country) filters.country = String(country);
      if (bodyRegion) filters.bodyRegion = String(bodyRegion);
      if (status) filters.status = String(status);
      const items = await storage.getAllImagingPositioningEntries(filters);
      res.json(items);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get("/api/imaging/positioning-entries/:id", async (req, res) => {
    try {
      const item = await storage.getImagingPositioningEntry(req.params.id);
      if (!item) return res.status(404).json({ error: "Not found" });
      res.json(item);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/imaging/positioning-entries", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const parsed = insertImagingPositioningEntrySchema.parse(req.body);
      const item = await storage.createImagingPositioningEntry(parsed);
      res.status(201).json(item);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.patch("/api/imaging/positioning-entries/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const parsed = insertImagingPositioningEntrySchema.partial().parse(req.body);
      const item = await storage.updateImagingPositioningEntry(req.params.id, parsed);
      res.json(item);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.delete("/api/imaging/positioning-entries/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      await storage.deleteImagingPositioningEntry(req.params.id);
      res.json({ ok: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/imaging/seed-library", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const results: Record<string, number> = { positioning: 0, artifacts: 0, comparisons: 0, anatomy: 0 };

      const seedData = await getImagingSeedData();

      const existingPositioning = await storage.getAllImagingPositioningEntries();
      const existingProjectionNames = new Set(existingPositioning.map((e: any) => e.projectionName));
      for (const seed of seedData.positioningSeeds) {
        if (!existingProjectionNames.has(seed.projectionName)) {
          await storage.createImagingPositioningEntry(seed as any);
          results.positioning++;
        }
      }

      const existingArtifacts = await storage.getAllImagingArtifactImages();
      const existingArtifactNames = new Set(existingArtifacts.map((e: any) => e.artifactName));
      for (const seed of seedData.artifactSeeds) {
        if (!existingArtifactNames.has(seed.artifactName)) {
          await storage.createImagingArtifactImage(seed as any);
          results.artifacts++;
        }
      }

      const existingComparisons = await storage.getAllImagingComparisonSets();
      const existingComparisonTitles = new Set(existingComparisons.map((e: any) => e.title));
      for (const seed of seedData.comparisonSeeds) {
        if (!existingComparisonTitles.has(seed.title)) {
          await storage.createImagingComparisonSet(seed as any);
          results.comparisons++;
        }
      }

      const existingAnatomy = await storage.getAllImagingAnatomyImages();
      const existingAnatomyTitles = new Set(existingAnatomy.map((e: any) => e.title));
      for (const seed of seedData.anatomySeeds) {
        if (!existingAnatomyTitles.has(seed.title)) {
          await storage.createImagingAnatomyImage(seed as any);
          results.anatomy++;
        }
      }

      res.json({ ok: true, seeded: results });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get("/api/imaging/artifact-images", async (req, res) => {
    try {
      const { artifactType, status } = req.query;
      const filters: any = {};
      if (artifactType) filters.artifactType = String(artifactType);
      if (status) filters.status = String(status);
      const items = await storage.getAllImagingArtifactImages(filters);
      res.json(items);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get("/api/imaging/artifact-images/:id", async (req, res) => {
    try {
      const item = await storage.getImagingArtifactImage(req.params.id);
      if (!item) return res.status(404).json({ error: "Not found" });
      res.json(item);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/imaging/artifact-images", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const parsed = insertImagingArtifactImageSchema.parse(req.body);
      const item = await storage.createImagingArtifactImage(parsed);
      res.status(201).json(item);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.patch("/api/imaging/artifact-images/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const parsed = insertImagingArtifactImageSchema.partial().parse(req.body);
      const item = await storage.updateImagingArtifactImage(req.params.id, parsed);
      res.json(item);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.delete("/api/imaging/artifact-images/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      await storage.deleteImagingArtifactImage(req.params.id);
      res.json({ ok: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get("/api/imaging/comparison-sets", async (req, res) => {
    try {
      const { comparisonType, status } = req.query;
      const filters: any = {};
      if (comparisonType) filters.comparisonType = String(comparisonType);
      if (status) filters.status = String(status);
      const items = await storage.getAllImagingComparisonSets(filters);
      res.json(items);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get("/api/imaging/comparison-sets/:id", async (req, res) => {
    try {
      const item = await storage.getImagingComparisonSet(req.params.id);
      if (!item) return res.status(404).json({ error: "Not found" });
      res.json(item);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/imaging/comparison-sets", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const parsed = insertImagingComparisonSetSchema.parse(req.body);
      const item = await storage.createImagingComparisonSet(parsed);
      res.status(201).json(item);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.patch("/api/imaging/comparison-sets/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const parsed = insertImagingComparisonSetSchema.partial().parse(req.body);
      const item = await storage.updateImagingComparisonSet(req.params.id, parsed);
      res.json(item);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.delete("/api/imaging/comparison-sets/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      await storage.deleteImagingComparisonSet(req.params.id);
      res.json({ ok: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get("/api/imaging/anatomy-images", async (req, res) => {
    try {
      const { bodyRegion, status } = req.query;
      const filters: any = {};
      if (bodyRegion) filters.bodyRegion = String(bodyRegion);
      if (status) filters.status = String(status);
      const items = await storage.getAllImagingAnatomyImages(filters);
      res.json(items);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get("/api/imaging/anatomy-images/:id", async (req, res) => {
    try {
      const item = await storage.getImagingAnatomyImage(req.params.id);
      if (!item) return res.status(404).json({ error: "Not found" });
      res.json(item);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/imaging/anatomy-images", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const parsed = insertImagingAnatomyImageSchema.parse(req.body);
      const item = await storage.createImagingAnatomyImage(parsed);
      res.status(201).json(item);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.patch("/api/imaging/anatomy-images/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const parsed = insertImagingAnatomyImageSchema.partial().parse(req.body);
      const item = await storage.updateImagingAnatomyImage(req.params.id, parsed);
      res.json(item);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.delete("/api/imaging/anatomy-images/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      await storage.deleteImagingAnatomyImage(req.params.id);
      res.json({ ok: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get("/api/imaging/physics-visuals", async (req, res) => {
    try {
      const { category, status } = req.query;
      const filters: any = {};
      if (category) filters.category = String(category);
      if (status) filters.status = String(status);
      const items = await storage.getAllImagingPhysicsVisuals(filters);
      res.json(items);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get("/api/imaging/physics-visuals/:id", async (req, res) => {
    try {
      const item = await storage.getImagingPhysicsVisual(req.params.id);
      if (!item) return res.status(404).json({ error: "Not found" });
      res.json(item);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/imaging/physics-visuals", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const parsed = insertImagingPhysicsVisualSchema.parse(req.body);
      const item = await storage.createImagingPhysicsVisual(parsed);
      res.status(201).json(item);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.patch("/api/imaging/physics-visuals/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const parsed = insertImagingPhysicsVisualSchema.partial().parse(req.body);
      const item = await storage.updateImagingPhysicsVisual(req.params.id, parsed);
      res.json(item);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.delete("/api/imaging/physics-visuals/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      await storage.deleteImagingPhysicsVisual(req.params.id);
      res.json({ ok: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get("/api/imaging/image-briefs", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { status, targetCategory, priority } = req.query;
      const filters: any = {};
      if (status) filters.status = String(status);
      if (targetCategory) filters.targetCategory = String(targetCategory);
      if (priority) filters.priority = String(priority);
      const items = await storage.getAllImagingImageBriefs(filters);
      res.json(items);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get("/api/imaging/image-briefs/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const item = await storage.getImagingImageBrief(req.params.id);
      if (!item) return res.status(404).json({ error: "Not found" });
      res.json(item);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/imaging/image-briefs", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const parsed = insertImagingImageBriefSchema.parse(req.body);
      const item = await storage.createImagingImageBrief(parsed);
      res.status(201).json(item);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.patch("/api/imaging/image-briefs/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const parsed = insertImagingImageBriefSchema.partial().parse(req.body);
      const item = await storage.updateImagingImageBrief(req.params.id, parsed);
      res.json(item);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.delete("/api/imaging/image-briefs/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      await storage.deleteImagingImageBrief(req.params.id);
      res.json({ ok: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get("/api/imaging/library-stats", async (req, res) => {
    try {
      const [assets, artifacts, comparisons, anatomy, visuals, briefs, positioning] = await Promise.all([
        storage.getAllImageAssets(),
        storage.getAllImagingArtifactImages(),
        storage.getAllImagingComparisonSets(),
        storage.getAllImagingAnatomyImages(),
        storage.getAllImagingPhysicsVisuals(),
        storage.getAllImagingImageBriefs(),
        storage.getAllImagingPositioningEntries(),
      ]);
      res.json({
        imageAssets: assets.length,
        artifactImages: artifacts.length,
        comparisonSets: comparisons.length,
        anatomyImages: anatomy.length,
        physicsVisuals: visuals.length,
        imageBriefs: briefs.length,
        positioningEntries: positioning.length,
        totalAssets: assets.length + artifacts.length + comparisons.length + anatomy.length + visuals.length + positioning.length,
      });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
}
