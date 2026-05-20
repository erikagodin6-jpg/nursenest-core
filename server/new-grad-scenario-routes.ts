import type { Express } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { requireAdmin, resolveAuthUser } from "./admin-auth";
import { importClientDataAbsolute } from "./client-data-import";

const __dirnameNewGrad =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));
import { ACTIVE_BUILD_PRIORITY, NEW_GRAD_CATEGORY_GROUPS } from "../shared/new-grad-categories";

let cachedQuestions: any[] | null = null;
let cachedSimulations: any[] | null = null;
let cachedMockTests: any[] | null = null;

async function loadScenarioQuestions(): Promise<any[]> {
  if (cachedQuestions !== null) return cachedQuestions;
  const mod = await importClientDataAbsolute(
    path.resolve(__dirnameNewGrad, "../client/src/data/newgrad/scenario-questions/index"),
  );
  const list = mod.allScenarioQuestions;
  cachedQuestions = Array.isArray(list) ? list : [];
  return cachedQuestions;
}

async function loadSimulations(): Promise<any[]> {
  if (cachedSimulations !== null) return cachedSimulations;
  const mod = await importClientDataAbsolute(
    path.resolve(__dirnameNewGrad, "../client/src/data/newgrad/interview-simulations"),
  );
  const list = mod.interviewSimulationSets;
  cachedSimulations = Array.isArray(list) ? list : [];
  return cachedSimulations;
}

async function loadMockTests(): Promise<any[]> {
  if (cachedMockTests !== null) return cachedMockTests;
  const mod = await importClientDataAbsolute(
    path.resolve(__dirnameNewGrad, "../client/src/data/newgrad/mock-interview-tests"),
  );
  const list = mod.mockInterviewTests;
  cachedMockTests = Array.isArray(list) ? list : [];
  return cachedMockTests;
}

export function registerNewGradScenarioRoutes(app: Express) {
  app.get("/api/new-grad/scenario-questions", async (req, res) => {
    try {
      const questions = await loadScenarioQuestions();
      const { categoryGroup, subcategory, difficulty, limit, offset, search } = req.query;

      let filtered = [...questions];

      if (categoryGroup && typeof categoryGroup === "string") {
        filtered = filtered.filter(q => q.categoryGroup === categoryGroup);
      }
      if (subcategory && typeof subcategory === "string") {
        filtered = filtered.filter(q => q.subcategory === subcategory);
      }
      if (difficulty && typeof difficulty === "string") {
        filtered = filtered.filter(q => q.difficulty === difficulty);
      }
      if (search && typeof search === "string") {
        const s = search.toLowerCase();
        filtered = filtered.filter(q =>
          q.question.toLowerCase().includes(s) ||
          q.scenarioPrompt.toLowerCase().includes(s) ||
          q.exampleAnswer.toLowerCase().includes(s)
        );
      }

      const total = filtered.length;
      const off = parseInt(offset as string) || 0;
      const lim = Math.min(parseInt(limit as string) || 50, 200);
      const paginated = filtered.slice(off, off + lim);

      res.json({ questions: paginated, total, offset: off, limit: lim });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/new-grad/scenario-questions/random/:count", async (req, res) => {
    try {
      const questions = await loadScenarioQuestions();
      const { categoryGroup, difficulty } = req.query;
      let pool = [...questions];

      if (categoryGroup && typeof categoryGroup === "string") {
        pool = pool.filter(q => q.categoryGroup === categoryGroup);
      }
      if (difficulty && typeof difficulty === "string") {
        pool = pool.filter(q => q.difficulty === difficulty);
      }

      const count = Math.min(parseInt(req.params.count) || 10, 100);
      const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, count);
      res.json({ questions: shuffled, total: pool.length, returned: shuffled.length });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/new-grad/scenario-questions/:id", async (req, res) => {
    try {
      const questions = await loadScenarioQuestions();
      const question = questions.find((q: any) => q.id === req.params.id);
      if (!question) return res.status(404).json({ error: "Question not found" });
      res.json(question);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/new-grad/interview-simulations", async (_req, res) => {
    try {
      const sims = await loadSimulations();
      const summary = sims.map((s: any) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        category: s.category,
        difficulty: s.difficulty,
        estimatedMinutes: s.estimatedMinutes,
        questionCount: s.questions.length,
      }));
      res.json({ simulations: summary, total: summary.length });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/new-grad/interview-simulations/:id", async (req, res) => {
    try {
      const sims = await loadSimulations();
      const sim = sims.find((s: any) => s.id === req.params.id);
      if (!sim) return res.status(404).json({ error: "Simulation not found" });
      res.json(sim);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/new-grad/mock-tests", async (_req, res) => {
    try {
      const tests = await loadMockTests();
      const summary = tests.map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        category: t.category,
        difficulty: t.difficulty,
        timeLimit: t.timeLimit,
        supportsRandomization: t.supportsRandomization,
        questionCount: t.questions.length,
      }));
      res.json({ tests: summary, total: summary.length });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/new-grad/mock-tests/:id", async (req, res) => {
    try {
      const tests = await loadMockTests();
      const test = tests.find((t: any) => t.id === req.params.id);
      if (!test) return res.status(404).json({ error: "Mock test not found" });

      const { randomize } = req.query;
      if (randomize === "true" && test.supportsRandomization) {
        const shuffled = [...test.questions].sort(() => Math.random() - 0.5);
        return res.json({ ...test, questions: shuffled });
      }
      res.json(test);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/new-grad/categories", async (_req, res) => {
    try {
      res.json({
        categoryGroups: NEW_GRAD_CATEGORY_GROUPS,
        activeBuildPriority: ACTIVE_BUILD_PRIORITY,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/new-grad/scenario-analytics", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const questions = await loadScenarioQuestions();
      const sims = await loadSimulations();
      const tests = await loadMockTests();

      const categoryBreakdown: Record<string, { total: number; subcategories: Record<string, number>; difficulties: Record<string, number> }> = {};
      for (const q of questions) {
        if (!categoryBreakdown[q.categoryGroup]) {
          categoryBreakdown[q.categoryGroup] = { total: 0, subcategories: {}, difficulties: {} };
        }
        categoryBreakdown[q.categoryGroup].total++;
        categoryBreakdown[q.categoryGroup].subcategories[q.subcategory] = (categoryBreakdown[q.categoryGroup].subcategories[q.subcategory] || 0) + 1;
        categoryBreakdown[q.categoryGroup].difficulties[q.difficulty] = (categoryBreakdown[q.categoryGroup].difficulties[q.difficulty] || 0) + 1;
      }

      const difficultyBreakdown: Record<string, number> = {};
      for (const q of questions) {
        difficultyBreakdown[q.difficulty] = (difficultyBreakdown[q.difficulty] || 0) + 1;
      }

      const formatBreakdown: Record<string, number> = {};
      for (const q of questions) {
        formatBreakdown[q.formatType] = (formatBreakdown[q.formatType] || 0) + 1;
      }

      const knownSubcategories = new Set<string>();
      for (const group of NEW_GRAD_CATEGORY_GROUPS) {
        for (const sub of group.subcategories) {
          knownSubcategories.add(sub.id);
        }
      }
      const uncategorizedQuestions = questions.filter(q => !knownSubcategories.has(q.subcategory));

      const simulationStats = sims.map((s: any) => ({
        id: s.id,
        title: s.title,
        questionCount: s.questions.length,
        difficulty: s.difficulty,
        category: s.category,
        estimatedMinutes: s.estimatedMinutes,
        starQuestions: s.questions.filter((q: any) => q.starBreakdown).length,
      }));

      const mockTestStats = tests.map((t: any) => ({
        id: t.id,
        title: t.title,
        questionCount: t.questions.length,
        difficulty: t.difficulty,
        timeLimit: t.timeLimit,
      }));

      res.json({
        totalQuestions: questions.length,
        categoryBreakdown,
        difficultyBreakdown,
        formatBreakdown,
        uncategorizedCount: uncategorizedQuestions.length,
        simulationSets: {
          total: sims.length,
          totalQuestions: sims.reduce((sum: number, s: any) => sum + s.questions.length, 0),
          sets: simulationStats,
        },
        mockTests: {
          total: tests.length,
          totalQuestions: tests.reduce((sum: number, t: any) => sum + t.questions.length, 0),
          tests: mockTestStats,
        },
        activeBuildPriority: ACTIVE_BUILD_PRIORITY,
        categoryGroups: NEW_GRAD_CATEGORY_GROUPS.length,
        buildStatus: {
          targetQuestions: 3000,
          currentQuestions: questions.length,
          percentComplete: Math.round((questions.length / 3000) * 100),
          simulationsTarget: 10,
          simulationsCurrent: sims.length,
          mockTestsTarget: 5,
          mockTestsCurrent: tests.length,
        },
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/new-grad/coverage-report", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const questions = await loadScenarioQuestions();

      const coverage: Record<string, Record<string, { count: number; difficulties: string[] }>> = {};
      for (const group of NEW_GRAD_CATEGORY_GROUPS) {
        coverage[group.id] = {};
        for (const sub of group.subcategories) {
          const matching = questions.filter(q => q.categoryGroup === group.id && q.subcategory === sub.id);
          coverage[group.id][sub.id] = {
            count: matching.length,
            difficulties: [...new Set(matching.map(q => q.difficulty))],
          };
        }
      }

      const gaps: Array<{ group: string; subcategory: string; count: number; missingDifficulties: string[] }> = [];
      const allDifficulties = ["beginner", "intermediate", "advanced"];
      for (const [groupId, subs] of Object.entries(coverage)) {
        for (const [subId, data] of Object.entries(subs)) {
          const missing = allDifficulties.filter(d => !data.difficulties.includes(d));
          if (data.count < 10 || missing.length > 0) {
            gaps.push({ group: groupId, subcategory: subId, count: data.count, missingDifficulties: missing });
          }
        }
      }

      res.json({ coverage, gaps, totalGaps: gaps.length });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
