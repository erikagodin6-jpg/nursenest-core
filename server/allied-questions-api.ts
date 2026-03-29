import type { Express, Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { createRateLimiter, abuseEscalationMiddleware, botDetectionMiddleware } from "./abuse-protection";
import { importClientDataAbsolute } from "./client-data-import";
import { pool } from "./storage";

const __dirnameAlliedApi =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

/** Avoid string-literal paths under client/ so server `tsc` does not trace career-question modules. */
function alliedCareerQuestionModule(stem: string): string {
  return ["..", "client", "src", "data", "career-questions", stem].join("/");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface ProfessionConfig {
  key: string;
  label: string;
  examNames: string;
  importPath: string;
  exportName: string;
  additionalImports?: { importPath: string; exportName: string }[];
}

const PROFESSIONS: ProfessionConfig[] = [
  {
    key: "rrt",
    label: "Respiratory Therapy",
    examNames: "NBRC TMC/CSE, CSRT",
    importPath: alliedCareerQuestionModule("rrt-questions"),
    exportName: "rrtQuestions",
    additionalImports: [
      { importPath: alliedCareerQuestionModule("rrt-questions-batch1"), exportName: "rrtQuestionsBatch1" },
      { importPath: alliedCareerQuestionModule("rrt-questions-batch2"), exportName: "rrtQuestionsBatch2" },
      { importPath: alliedCareerQuestionModule("rrt-questions-batch3"), exportName: "rrtQuestionsBatch3" },
    ],
  },
  {
    key: "mlt",
    label: "Medical Laboratory Technology",
    examNames: "ASCP BOC, CSMLS CMLTO",
    importPath: alliedCareerQuestionModule("mlt-questions"),
    exportName: "mltQuestions",
    additionalImports: [
      { importPath: alliedCareerQuestionModule("mlt-questions-batch2"), exportName: "mltQuestionsBatch2" },
      { importPath: alliedCareerQuestionModule("mlt-questions-expansion"), exportName: "mltQuestionsExpansion" },
    ],
  },
  {
    key: "imaging",
    label: "Medical Imaging",
    examNames: "ARRT, CAMRT",
    importPath: alliedCareerQuestionModule("imaging-questions"),
    exportName: "imagingQuestions",
    additionalImports: [
      { importPath: alliedCareerQuestionModule("imaging-questions-expansion"), exportName: "imagingQuestionsExpansion" },
      { importPath: alliedCareerQuestionModule("imaging-questions-expansion-2"), exportName: "imagingQuestionsExpansion2" },
    ],
  },
  {
    key: "occupationalTherapy",
    label: "Occupational Therapy Assistant",
    examNames: "NBCOT COTA",
    importPath: alliedCareerQuestionModule("ota-questions"),
    exportName: "otaQuestions",
    additionalImports: [
      { importPath: alliedCareerQuestionModule("ota-questions-expansion"), exportName: "otaQuestionsExpansion" },
    ],
  },
  {
    key: "physicalTherapy",
    label: "Physical Therapy Assistant",
    examNames: "NPTE-PTA, FSBPT",
    importPath: alliedCareerQuestionModule("pta-questions"),
    exportName: "ptaQuestions",
    additionalImports: [
      { importPath: alliedCareerQuestionModule("pta-questions-expansion"), exportName: "ptaQuestionsExpansion" },
    ],
  },
  {
    key: "surgicalTechnologist",
    label: "Surgical Technologist",
    examNames: "CST, NBSTSA",
    importPath: alliedCareerQuestionModule("surgical-technologist-questions"),
    exportName: "surgicalTechnologistQuestions",
    additionalImports: [
      { importPath: alliedCareerQuestionModule("surgical-technologist-questions-2"), exportName: "surgicalTechnologistQuestionsPart2" },
      { importPath: alliedCareerQuestionModule("surgical-technologist-questions-3"), exportName: "surgicalTechnologistQuestionsPart3" },
      { importPath: alliedCareerQuestionModule("surgical-technologist-questions-4"), exportName: "surgicalTechnologistQuestionsPart4" },
      { importPath: alliedCareerQuestionModule("surgical-technologist-questions-5"), exportName: "surgicalTechnologistQuestionsPart5" },
      { importPath: alliedCareerQuestionModule("surgical-technologist-questions-6"), exportName: "surgicalTechnologistQuestionsPart6" },
      { importPath: alliedCareerQuestionModule("surgical-technologist-questions-7"), exportName: "surgicalTechnologistQuestionsPart7" },
    ],
  },
  {
    key: "healthInfoMgmt",
    label: "Health Information Management",
    examNames: "RHIT, RHIA, AHIMA",
    importPath: alliedCareerQuestionModule("him-questions"),
    exportName: "himQuestions",
    additionalImports: [
      { importPath: alliedCareerQuestionModule("him-questions-batch2"), exportName: "himQuestionsBatch2" },
    ],
  },
  {
    key: "diagnosticSonography",
    label: "Diagnostic Sonography",
    examNames: "ARDMS SPI, RDMS",
    importPath: alliedCareerQuestionModule("sonography-questions"),
    exportName: "sonographyQuestions",
    additionalImports: [
      { importPath: alliedCareerQuestionModule("sonography-questions-batch2"), exportName: "sonographyQuestionsBatch2" },
    ],
  },
  {
    key: "cardiacSonographer",
    label: "Cardiac Sonography",
    examNames: "ARDMS RDCS, CCI RCS",
    importPath: alliedCareerQuestionModule("cardiac-sonographer-questions"),
    exportName: "cardiacSonographerQuestions",
    additionalImports: [
      { importPath: alliedCareerQuestionModule("cardiac-sonographer-questions-batch2"), exportName: "cardiacSonographerQuestionsBatch2" },
    ],
  },
  {
    key: "paramedic",
    label: "Paramedic",
    examNames: "NREMT Paramedic",
    importPath: alliedCareerQuestionModule("paramedic-questions"),
    exportName: "paramedicQuestions",
    additionalImports: [
      { importPath: alliedCareerQuestionModule("paramedic-questions-expansion"), exportName: "paramedicQuestionsExpansion" },
    ],
  },
  {
    key: "pharmacyTech",
    label: "Pharmacy Technician",
    examNames: "PTCB CPHT, ExCPT",
    importPath: alliedCareerQuestionModule("pharmacy-tech-questions"),
    exportName: "pharmacyTechQuestions",
    additionalImports: [
      { importPath: alliedCareerQuestionModule("pharmacy-tech-questions-batch2"), exportName: "pharmacyTechQuestionsBatch2" },
      { importPath: alliedCareerQuestionModule("pharmacy-tech-questions-batch3"), exportName: "pharmacyTechQuestionsBatch3" },
      { importPath: alliedCareerQuestionModule("pharmacy-tech-questions-batch4"), exportName: "pharmacyTechQuestionsBatch4" },
      { importPath: alliedCareerQuestionModule("pharmacy-tech-questions-extended"), exportName: "pharmacyTechQuestionsExtended" },
      { importPath: alliedCareerQuestionModule("pharmacy-tech-questions-pebc"), exportName: "pharmacyTechQuestionsPEBC" },
      { importPath: alliedCareerQuestionModule("pharmacy-tech-questions-expansion"), exportName: "pharmacyTechQuestionsExpansion" },
    ],
  },
];

interface BatchRef {
  importPath: string;
  exportName: string;
}

interface CacheEntry {
  batches: BatchRef[];
  totalCount: number;
  questions: any[];
  accessedAt: number;
  createdAt: number;
}

const batchCache: Record<string, CacheEntry> = {};
const MAX_CACHE_ENTRIES = parseInt(process.env.ALLIED_CACHE_MAX || "0") || 6;
const CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_TOTAL_CACHED_QUESTIONS = 5000;

let cacheHits = 0;
let cacheMisses = 0;
let cacheEvictions = 0;

function getTotalCachedQuestionCount(): number {
  let total = 0;
  for (const key of Object.keys(batchCache)) {
    total += batchCache[key].totalCount;
  }
  return total;
}

function evictCacheEntry(key: string, reason: string): void {
  const entry = batchCache[key];
  const count = entry?.totalCount || 0;
  delete batchCache[key];
  cacheEvictions++;
  console.log(`[AlliedCache] Evicted (${reason}): ${key} (${count} questions)`);
}

export function clearAlliedQuestionsCache(): void {
  const count = Object.keys(batchCache).length;
  for (const key of Object.keys(batchCache)) {
    delete batchCache[key];
  }
  if (count > 0) {
    cacheEvictions += count;
    console.log(`[AlliedCache] Cleared all ${count} cache entries`);
  }
}

function evictExpiredCacheEntries(): void {
  const now = Date.now();
  for (const key of Object.keys(batchCache)) {
    if (now - batchCache[key].createdAt > CACHE_TTL_MS) {
      evictCacheEntry(key, "expired");
    }
  }
}

function evictLRUEntry(excludeKey?: string): string | null {
  const keys = Object.keys(batchCache).filter(k => k !== excludeKey);
  if (keys.length === 0) return null;
  const sorted = keys.sort((a, b) => batchCache[a].accessedAt - batchCache[b].accessedAt);
  const lruKey = sorted[0];
  evictCacheEntry(lruKey, "LRU");
  return lruKey;
}

function evictLRUQuestionCache(excludeKey?: string): void {
  evictExpiredCacheEntries();
  const keys = Object.keys(batchCache);
  if (keys.length < MAX_CACHE_ENTRIES) return;
  const sorted = keys.filter(k => k !== excludeKey).sort((a, b) => batchCache[a].accessedAt - batchCache[b].accessedAt);
  const toRemove = sorted.slice(0, keys.length - MAX_CACHE_ENTRIES + 1);
  for (const key of toRemove) {
    evictCacheEntry(key, "capacity");
  }
}

function enforceQuestionCountCap(currentKey?: string): void {
  while (getTotalCachedQuestionCount() > MAX_TOTAL_CACHED_QUESTIONS) {
    const keysExcludingCurrent = Object.keys(batchCache).filter(k => k !== currentKey);
    if (keysExcludingCurrent.length > 0) {
      if (!evictLRUEntry(currentKey)) break;
    } else {
      if (currentKey && batchCache[currentKey]) {
        console.warn(`[AlliedCache] Single profession '${currentKey}' (${batchCache[currentKey].totalCount} questions) exceeds cap of ${MAX_TOTAL_CACHED_QUESTIONS}; evicting to stay within bounds`);
        evictCacheEntry(currentKey, "exceeds-cap-alone");
      }
      break;
    }
  }
}

export function pruneAlliedCachesUnderPressure(): void {
  const keys = Object.keys(batchCache);
  const half = Math.ceil(keys.length / 2);
  const sorted = keys.sort((a, b) => batchCache[a].accessedAt - batchCache[b].accessedAt);
  for (let i = 0; i < half; i++) {
    evictCacheEntry(sorted[i], "pressure");
  }
}

function stemFromCareerQuestionImportPath(importPath: string): string {
  // importPath like "../client/src/data/career-questions/rrt-questions-batch2"
  const last = importPath.split("/").pop() || importPath;
  return last.trim();
}

function careerQuestionJsonPath(stem: string): string {
  return path.resolve(process.cwd(), "data", "career-questions", `${stem}.json`);
}

async function assembleBatchesFromJson(batches: BatchRef[]): Promise<any[] | null> {
  const result: any[] = [];

  for (const batch of batches) {
    const stem = stemFromCareerQuestionImportPath(batch.importPath);
    const jsonPath = careerQuestionJsonPath(stem);
    if (!existsSync(jsonPath)) return null;
    const raw = await readFile(jsonPath, "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    result.push(...parsed);
  }

  return result;
}

async function assembleBatchesFromDb(careerType: string): Promise<any[]> {
  const result = await pool.query(
    `SELECT
       blueprint_id AS id,
       stem,
       options,
       correct_answer AS "correctIndex",
       rationale_long AS rationale,
       difficulty,
       blueprint_category AS category,
       subtopic AS topic
     FROM allied_questions
     WHERE career_type = $1
     ORDER BY blueprint_id`,
    [careerType],
  );

  return result.rows.map((r: any) => ({
    id: r.id,
    stem: r.stem,
    options: Array.isArray(r.options) ? r.options : JSON.parse(r.options || "[]"),
    correctIndex: r.correctIndex,
    rationale: r.rationale,
    difficulty: r.difficulty,
    category: r.category,
    topic: r.topic,
  }));
}

async function assembleBatchesFromTs(batches: BatchRef[]): Promise<any[]> {
  const result: any[] = [];
  for (const batch of batches) {
    const abs = path.resolve(__dirnameAlliedApi, batch.importPath);
    const mod = await importClientDataAbsolute(abs);
    const arr = mod[batch.exportName] as any[];
    result.push(...arr);
  }
  return result;
}

async function loadQuestions(profession: ProfessionConfig): Promise<any[]> {
  const cached = batchCache[profession.key];
  if (cached) {
    if (Date.now() - cached.createdAt > CACHE_TTL_MS) {
      evictCacheEntry(profession.key, "TTL");
    } else {
      cached.accessedAt = Date.now();
      cacheHits++;
      const questions = cached.questions;
      console.log(`[AlliedCache] HIT: ${profession.key} | assembled=${questions.length} | cacheSize=${Object.keys(batchCache).length} | totalCachedCount=${getTotalCachedQuestionCount()} | hits=${cacheHits} misses=${cacheMisses} evictions=${cacheEvictions}`);
      return questions;
    }
  }

  cacheMisses++;
  evictLRUQuestionCache(profession.key);

  const batches: BatchRef[] = [{ importPath: profession.importPath, exportName: profession.exportName }];
  if (profession.additionalImports) {
    for (const extra of profession.additionalImports) {
      batches.push({ importPath: extra.importPath, exportName: extra.exportName });
    }
  }

  let questions: any[] = [];
  try {
    const jsonQuestions = await assembleBatchesFromJson(batches);
    if (jsonQuestions && jsonQuestions.length > 0) {
      questions = jsonQuestions;
    }
  } catch {}

  if (questions.length === 0) {
    try {
      questions = await assembleBatchesFromDb(profession.key);
    } catch {}
  }

  if (questions.length === 0) {
    // Temporary fallback for local dev or during JSON/DB migration.
    questions = await assembleBatchesFromTs(batches);
  }

  if (!Array.isArray(questions)) questions = [];

  batchCache[profession.key] = {
    batches,
    totalCount: questions.length,
    questions,
    accessedAt: Date.now(),
    createdAt: Date.now(),
  };
  enforceQuestionCountCap(profession.key);

  console.log(`[AlliedCache] MISS: ${profession.key} | assembled=${questions.length} | cacheSize=${Object.keys(batchCache).length} | totalCachedCount=${getTotalCachedQuestionCount()} | hits=${cacheHits} misses=${cacheMisses} evictions=${cacheEvictions}`);
  return questions;
}

interface TopicGroup {
  topicSlug: string;
  topic: string;
  category: string;
  questionCount: number;
  difficulties: number[];
}

const CACHE_SWEEP_INTERVAL_MS = 5 * 60 * 1000;
let cacheSweepTimer: ReturnType<typeof setInterval> | null = null;

function startCacheSweep(): void {
  if (cacheSweepTimer) return;
  cacheSweepTimer = setInterval(() => {
    evictExpiredCacheEntries();
    enforceQuestionCountCap();
  }, CACHE_SWEEP_INTERVAL_MS);
  if (cacheSweepTimer.unref) cacheSweepTimer.unref();
}

export function stopCacheSweep(): void {
  if (cacheSweepTimer) {
    clearInterval(cacheSweepTimer);
    cacheSweepTimer = null;
  }
}

export function registerAlliedQuestionsRoutes(app: Express) {
  startCacheSweep();
  const contentBrowseLimiter = createRateLimiter("content_browse");

  for (const profession of PROFESSIONS) {
    app.get(`/api/${profession.key}/question-topics`, abuseEscalationMiddleware, botDetectionMiddleware, contentBrowseLimiter, async (_req: Request, res: Response) => {
      try {
        const page = Math.max(1, parseInt(_req.query.page as string) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(_req.query.limit as string) || 50));
        const categoryFilter = (_req.query.category as string) || "";

        const questions = await loadQuestions(profession);
        const topicMap = new Map<string, TopicGroup>();

        for (const q of questions) {
          const slug = slugify(q.topic);
          if (!topicMap.has(slug)) {
            topicMap.set(slug, {
              topicSlug: slug,
              topic: q.topic,
              category: q.category,
              questionCount: 0,
              difficulties: [],
            });
          }
          const group = topicMap.get(slug)!;
          group.questionCount++;
          if (!group.difficulties.includes(q.difficulty)) {
            group.difficulties.push(q.difficulty);
          }
        }

        let topics = Array.from(topicMap.values())
          .sort((a, b) => b.questionCount - a.questionCount || a.topic.localeCompare(b.topic));

        if (categoryFilter) {
          topics = topics.filter(t => slugify(t.category) === categoryFilter);
        }

        const totalTopics = topics.length;
        const offset = (page - 1) * limit;
        const paginatedTopics = topics.slice(offset, offset + limit);

        const categories = new Map<string, { category: string; categorySlug: string; topicCount: number; questionCount: number }>();
        for (const t of Array.from(topicMap.values())) {
          const catSlug = slugify(t.category);
          if (!categories.has(catSlug)) {
            categories.set(catSlug, { category: t.category, categorySlug: catSlug, topicCount: 0, questionCount: 0 });
          }
          const cat = categories.get(catSlug)!;
          cat.topicCount++;
          cat.questionCount += t.questionCount;
        }

        res.json({
          topics: paginatedTopics,
          categories: Array.from(categories.values()).sort((a, b) => b.questionCount - a.questionCount),
          totalQuestions: questions.length,
          totalTopics,
          page,
          limit,
          totalPages: Math.ceil(totalTopics / limit),
        });
      } catch (e: any) {
        res.status(500).json({ error: e.message });
      }
    });

    app.get(`/api/${profession.key}/question-topics/:topicSlug`, async (req: Request, res: Response) => {
      try {
        const { topicSlug } = req.params;
        const questions = await loadQuestions(profession);

        const topicQuestions = questions.filter(q => slugify(q.topic) === topicSlug);
        if (topicQuestions.length === 0) {
          return res.status(404).json({ error: "Topic not found" });
        }

        const topic = topicQuestions[0].topic;
        const category = topicQuestions[0].category;

        const sampleQuestions = topicQuestions.slice(0, 10).map(q => ({
          id: q.id,
          stem: q.stem,
          options: q.options,
          correctIndex: q.correctIndex,
          rationale: q.rationale,
          difficulty: q.difficulty,
        }));

        const relatedTopics = questions
          .filter(q => q.category === category && slugify(q.topic) !== topicSlug)
          .reduce((acc: Map<string, { topicSlug: string; topic: string; questionCount: number }>, q) => {
            const slug = slugify(q.topic);
            if (!acc.has(slug)) {
              acc.set(slug, { topicSlug: slug, topic: q.topic, questionCount: 0 });
            }
            acc.get(slug)!.questionCount++;
            return acc;
          }, new Map());

        res.json({
          topicSlug,
          topic,
          category,
          categorySlug: slugify(category),
          totalQuestions: topicQuestions.length,
          sampleQuestions,
          relatedTopics: Array.from(relatedTopics.values()).slice(0, 8),
          difficulties: Array.from(new Set(topicQuestions.map(q => q.difficulty))).sort(),
          profession: profession.key,
          professionLabel: profession.label,
          examNames: profession.examNames,
        });
      } catch (e: any) {
        res.status(500).json({ error: e.message });
      }
    });
  }
}

export async function getAlliedQuestionTopicSlugs(): Promise<{ profession: string; slugs: string[] }[]> {
  const results: { profession: string; slugs: string[] }[] = [];
  for (const profession of PROFESSIONS) {
    const cached = batchCache[profession.key];
    if (cached) {
      try {
        const slugSet = new Set<string>();
        for (const q of cached.questions) {
          slugSet.add(slugify(q.topic));
        }
        results.push({ profession: profession.key, slugs: Array.from(slugSet) });
      } catch (e) {
        console.error(`[AlliedCache] Failed to assemble batches for topic slugs: ${profession.key}`, e);
      }
    }
  }
  return results;
}

export async function getAlliedQuestionTopicSlugsAsync(): Promise<{ profession: string; slugs: string[] }[]> {
  const results: { profession: string; slugs: string[] }[] = [];
  for (const profession of PROFESSIONS) {
    try {
      const questions = await loadQuestions(profession);
      const slugSet = new Set<string>();
      for (const q of questions) {
        slugSet.add(slugify(q.topic));
      }
      results.push({ profession: profession.key, slugs: Array.from(slugSet) });
    } catch {}
  }
  return results;
}
