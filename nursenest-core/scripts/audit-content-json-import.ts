#!/usr/bin/env npx tsx
/**
 * Read-only: classify JSON content files and map to Prisma targets (no DB writes).
 *
 * Run from nursenest-core/:
 *   npx tsx scripts/audit-content-json-import.ts
 *   npx tsx scripts/audit-content-json-import.ts --extra=/abs/path/ai_cache.json,/abs/path/allied_questions.json
 */
import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function monorepoRoot(): string {
  return path.resolve(__dirname, "../..");
}

function parseExtra(): string[] {
  const hit = process.argv.find((a) => a.startsWith("--extra="));
  if (!hit) return [];
  return hit
    .slice("--extra=".length)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

type Classification =
  | "exam_questions_shape"
  | "ai_cache_rows"
  | "allied_questions"
  | "allied_flashcards"
  | "allied_blueprints"
  | "career_questions_batch"
  | "blog_legacy_export"
  | "pathway_lesson_catalog"
  | "monolith_mcq_options_abcd"
  | "monolith_flashcard_front_back"
  | "unknown_array_objects"
  | "unknown_non_array"
  | "missing_file";

type FileReport = {
  path: string;
  exists: boolean;
  bytes?: number;
  classification: Classification;
  prismaTarget: string;
  recordCount: number | null;
  sampleKeys: string[];
  notes: string[];
};

function firstObjectKeys(row: unknown): string[] {
  if (!row || typeof row !== "object") return [];
  return Object.keys(row as object).slice(0, 24);
}

function classifyParsed(filePath: string, data: unknown): Omit<FileReport, "path" | "exists" | "bytes"> {
  const notes: string[] = [];
  const base = path.basename(filePath).toLowerCase();

  if (data === null || data === undefined) {
    return {
      classification: "unknown_non_array",
      prismaTarget: "(none)",
      recordCount: null,
      sampleKeys: [],
      notes: ["null root"],
    };
  }

  if (Array.isArray(data)) {
    const n = data.length;
    if (n === 0) {
      return {
        classification: "unknown_array_objects",
        prismaTarget: base.includes("blog") ? "BlogPost (import:blog — empty file)" : "manual review",
        recordCount: 0,
        sampleKeys: [],
        notes: ["Empty JSON array"],
      };
    }
    const row0 = data[0];
    const keys = firstObjectKeys(row0);

    if (base.includes("ai_cache") || keys.includes("cacheKey")) {
      return {
        classification: "ai_cache_rows",
        prismaTarget: "exam_questions + Flashcard (via import:nursing-ai-cache)",
        recordCount: n,
        sampleKeys: keys,
        notes: ["Use npm run import:audit-nursing then import:nursing-ai-cache --apply"],
      };
    }

    if (
      keys.includes("career_type") &&
      keys.includes("blueprint_category") &&
      (keys.includes("rationale_long") || keys.includes("rationaleLong"))
    ) {
      return {
        classification: "allied_questions",
        prismaTarget: "exam_questions (via import-allied-json-to-prisma.ts --questions=)",
        recordCount: n,
        sampleKeys: keys,
        notes: [],
      };
    }

    if (keys.includes("career_type") && keys.includes("front") && keys.includes("back") && keys.includes("card_type")) {
      return {
        classification: "allied_flashcards",
        prismaTarget: "Flashcard + Category (via import-allied-json-to-prisma.ts --flashcards=)",
        recordCount: n,
        sampleKeys: keys,
        notes: [],
      };
    }

    if (
      row0 &&
      typeof row0 === "object" &&
      "domains" in (row0 as object) &&
      ("difficulty_distribution" in (row0 as object) || "difficultyDistribution" in (row0 as object))
    ) {
      return {
        classification: "allied_blueprints",
        prismaTarget: "NO Prisma model — snapshot / future migration",
        recordCount: n,
        sampleKeys: keys,
        notes: ["Persist only with new table or JSON column; --blueprints-out on allied script"],
      };
    }

    if (
      keys.includes("stem") &&
      keys.includes("options") &&
      (keys.includes("correctIndex") || keys.includes("correct_index")) &&
      (keys.includes("category") || keys.includes("topic"))
    ) {
      return {
        classification: "career_questions_batch",
        prismaTarget: "exam_questions (via import:career-questions --dir=)",
        recordCount: n,
        sampleKeys: keys,
        notes: ["career_type inferred from filename"],
      };
    }

    if (
      keys.includes("tier") &&
      keys.includes("exam") &&
      (keys.includes("stem_hash") || keys.includes("stemHash")) &&
      keys.includes("stem")
    ) {
      return {
        classification: "exam_questions_shape",
        prismaTarget: "exam_questions (needs mapper script — not identical to Prisma create shape)",
        recordCount: n,
        sampleKeys: keys,
        notes: ["correct_answer may be numeric indices; normalize before Prisma create"],
      };
    }

    if (keys.includes("question") && keys.includes("optionA") && keys.includes("correctAnswer")) {
      return {
        classification: "monolith_mcq_options_abcd",
        prismaTarget: "exam_questions (custom mapper required)",
        recordCount: n,
        sampleKeys: keys,
        notes: ["e.g. server/data/seed/imaging-questions.json"],
      };
    }

    if (keys.includes("front") && keys.includes("back") && keys.includes("category") && !keys.includes("career_type")) {
      return {
        classification: "monolith_flashcard_front_back",
        prismaTarget: "Flashcard + Category (custom mapper required)",
        recordCount: n,
        sampleKeys: keys,
        notes: ["e.g. server/data/seed/flashcards.json — no deck linkage"],
      };
    }

    if (keys.includes("slug") && keys.includes("title") && (keys.includes("body") || keys.includes("content"))) {
      return {
        classification: "blog_legacy_export",
        prismaTarget: "BlogPost (import:blog)",
        recordCount: n,
        sampleKeys: keys,
        notes: [],
      };
    }

    return {
      classification: "unknown_array_objects",
      prismaTarget: "manual review",
      recordCount: n,
      sampleKeys: keys,
      notes: [],
    };
  }

  if (typeof data === "object" && data !== null && "pathways" in data && "version" in data) {
    let lessonCount = 0;
    const pathways = (data as { pathways: Record<string, { lessons?: unknown[] }> }).pathways;
    for (const b of Object.values(pathways)) {
      lessonCount += Array.isArray(b.lessons) ? b.lessons.length : 0;
    }
    return {
      classification: "pathway_lesson_catalog",
      prismaTarget: "PathwayLesson (npm run db:seed-pathway-lessons)",
      recordCount: lessonCount,
      sampleKeys: Object.keys(data as object),
      notes: [`${Object.keys(pathways).length} pathways in catalog`],
    };
  }

  return {
    classification: "unknown_non_array",
    prismaTarget: "manual review",
    recordCount: null,
    sampleKeys: Object.keys(data as object).slice(0, 20),
    notes: [],
  };
}

function auditOne(absPath: string): FileReport {
  if (!fs.existsSync(absPath)) {
    return {
      path: absPath,
      exists: false,
      classification: "missing_file",
      prismaTarget: "(n/a)",
      recordCount: null,
      sampleKeys: [],
      notes: ["Place file or pass correct path"],
    };
  }
  const st = fs.statSync(absPath);
  const raw = fs.readFileSync(absPath, "utf8");
  let data: unknown;
  try {
    data = JSON.parse(raw) as unknown;
  } catch {
    return {
      path: absPath,
      exists: true,
      bytes: st.size,
      classification: "unknown_non_array",
      prismaTarget: "(invalid JSON)",
      recordCount: null,
      sampleKeys: [],
      notes: ["JSON.parse failed"],
    };
  }
  const rest = classifyParsed(absPath, data);
  return { path: absPath, exists: true, bytes: st.size, ...rest };
}

function defaultCandidatePaths(): string[] {
  const root = monorepoRoot();
  const nc = path.join(root, "nursenest-core");
  return [
    path.join(root, "data", "replit-exports", "ai_cache.json"),
    path.join(nc, "data", "replit-exports", "ai_cache.json"),
    path.join(root, "data", "replit-exports", "allied_questions.json"),
    path.join(root, "data", "replit-exports", "allied_flashcards.json"),
    path.join(root, "data", "replit-exports", "allied_blueprints.json"),
    path.join(nc, "content", "blog-legacy-export.json"),
    path.join(nc, "src", "content", "pathway-lessons", "catalog.json"),
    path.join(root, "server", "seed-data", "exam-questions.json"),
    path.join(root, "data", "career-questions", "rrt-questions.json"),
    path.join(root, "server", "data", "seed", "imaging-questions.json"),
    path.join(root, "server", "data", "seed", "flashcards.json"),
  ];
}

async function main() {
  const extra = parseExtra();
  const paths = [...new Set([...defaultCandidatePaths(), ...extra.map((p) => path.resolve(p))])];
  const reports = paths.map(auditOne);

  const summary = {
    auditedAt: new Date().toISOString(),
    monorepoRoot: monorepoRoot(),
    files: reports,
    commands: {
      auditNursingAiCache: "npm run import:audit-nursing -- --file=PATH/ai_cache.json",
      importNursingAiCacheDry: "npm run import:nursing-ai-cache -- --file=PATH/ai_cache.json",
      importNursingAiCacheApply: "npm run import:nursing-ai-cache -- --file=PATH/ai_cache.json --apply",
      alliedJsonDry: "npx tsx scripts/import-allied-json-to-prisma.ts --questions=Q --flashcards=F --blueprints=B",
      alliedJsonApply: "npx tsx scripts/import-allied-json-to-prisma.ts --apply --questions=Q --flashcards=F",
      replitQuestionsDry: "npm run import:replit-questions -- --dry-run --dir=data/replit-exports",
      replitQuestionsApply: "npm run import:replit-questions -- --dir=data/replit-exports",
      careerQuestionsDry: "npm run import:career-questions -- --dry-run",
      careerQuestionsApply: "npm run import:career-questions -- --apply",
      pathwayLessons: "npm run db:seed-pathway-lessons",
      blog: "npm run import:blog",
    },
  };

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
