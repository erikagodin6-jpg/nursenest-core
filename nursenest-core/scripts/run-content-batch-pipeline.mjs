#!/usr/bin/env node
/**
 * End-to-end NurseNest content batch pipeline for one program.
 * Usage: node scripts/run-content-batch-pipeline.mjs [programId]
 * Default program: us-rn-nclex-rn (NCLEX-RN, US)
 *
 * Steps:
 *   1. load blueprint
 *   2. generate (aggregate lessons + questions from materialized sources)
 *   3. validate (quality gate)
 *   4. deduplicate (stemHash for questions, slug for lessons)
 *   5. normalize (required fields, stable IDs, timestamps)
 *   6. link (cross-reference lessons ↔ questions by topicSlug)
 *   7. importReady (final import-format JSON)
 *   8. coverageAudit (domain × topic gap analysis)
 *
 * JSON only at each stage. No DB writes.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ─── canonical topic-slug mapping (inline for pure-JS pipeline) ───────────────
// Source of truth lives in src/lib/content/topic-slug-canonical-map.ts
// Keep these two in sync when adding new topic keys.
const QUESTION_KEY_TO_CANONICAL_SLUG = {
  // Respiratory
  "copd-respiratory": "copd",
  "abg-interpretation": "abg",
  "acid-base-advanced": "acid-base",
  // Cardiovascular
  "myocardial-infarction": "acute-coronary",
  // Renal / Fluids
  "sodium-imbalance": "sodium",
  "potassium-imbalance": "potassium",
  "fluid-balance": "fluids-electrolytes",
  // Endocrine
  "insulin-hypoglycemia": "diabetes-meds",
  // Pharmacology / Treatments
  "anticoagulants": "anticoagulation",
  "pain-management": "pain",
  "wound-care": "wounds",
  // Management / Safety
  "prioritization-abcs": "prioritization",
  // Catch-all bucket
  "general-nursing-clinical": "clinical-judgment",
};

/** Resolve any slug — question-bank key or already canonical — to canonical form. */
function canonicalTopicSlug(slug) {
  return QUESTION_KEY_TO_CANONICAL_SLUG[slug] ?? slug;
}

/** Extract canonical topicSlug from a question's tags array. */
function canonicalTopicSlugFromTags(tags, fallbackTopic) {
  const topicTag = (tags ?? []).find((t) => t.startsWith("topic:"));
  if (topicTag) return canonicalTopicSlug(topicTag.slice(6));
  if (fallbackTopic) {
    const slugified = fallbackTopic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return canonicalTopicSlug(slugified);
  }
  return "general";
}

/** Returns true if the canonical slug is the catch-all bucket. */
function isCatchAllTopic(canonicalSlug) {
  return canonicalSlug === "clinical-judgment";
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function loadJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), "utf8"));
}

function stemHash(stem) {
  return (
    "s" +
    crypto
      .createHash("md5")
      .update((stem ?? "").trim().toLowerCase())
      .digest("hex")
      .slice(0, 8)
  );
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const PIPELINE_VERSION = "2026-04-batch-v2";
const NOW = new Date().toISOString();

// ─── program config ────────────────────────────────────────────────────────────

const PROGRAM_CONFIG = {
  "us-rn-nclex-rn": {
    examCode: "NCLEX-RN",
    tier: "rn",
    region: "US",
    catalogKey: "usRn",
    examTagPrefix: "exam:NCLEX-RN",
    displayName: "US NCLEX-RN (Next Generation)",
  },
  "ca-rn-nclex-rn": {
    examCode: "NCLEX-RN",
    tier: "rn",
    region: "CA",
    catalogKey: "caRn",
    examTagPrefix: "exam:NCLEX-RN",
    displayName: "Canada NCLEX-RN",
  },
  "us-lpn-nclex-pn": {
    examCode: "NCLEX-PN",
    tier: "rpn",
    region: "US",
    catalogKey: "usPn",
    examTagPrefix: "exam:NCLEX-PN",
    displayName: "US NCLEX-PN (LPN)",
  },
  "ca-rpn-rex-pn": {
    examCode: "REX-PN",
    tier: "rpn",
    region: "CA",
    catalogKey: "caRpn",
    examTagPrefix: "exam:REX-PN",
    displayName: "Canada REx-PN",
  },
};

// ─── quality / validation rules ───────────────────────────────────────────────

const MIN_STEM_WORDS = 8;
const MIN_OPTIONS = 2;
const MIN_RATIONALE_WORDS = 10;
const MIN_LESSON_SECTIONS = 2;
const GENERIC_STEM_PATTERNS = [
  /^which (of the following|statement|option)/i,
  /^the nurse knows that/i,
  /^select all that apply\.?$/i,
  /^a nurse is$/i,
];

function isWeakStem(stem) {
  if (!stem || typeof stem !== "string") return true;
  const words = stem.trim().split(/\s+/);
  if (words.length < MIN_STEM_WORDS) return true;
  if (GENERIC_STEM_PATTERNS.some((p) => p.test(stem.trim()))) return true;
  return false;
}

function validateQuestion(q) {
  const issues = [];
  if (isWeakStem(q.stem)) issues.push("weak-stem");
  const opts = Array.isArray(q.options) ? q.options : [];
  if (opts.length < MIN_OPTIONS) issues.push("insufficient-options");
  const duplicateOpts =
    opts.length !== new Set(opts.map((o) => o.trim().toLowerCase())).size;
  if (duplicateOpts) issues.push("duplicate-options");
  if (!q.correctAnswer || (Array.isArray(q.correctAnswer) && q.correctAnswer.length === 0))
    issues.push("missing-correct-answer");
  const rationaleWords = (q.rationale ?? "").trim().split(/\s+/).filter(Boolean);
  if (rationaleWords.length < MIN_RATIONALE_WORDS) issues.push("thin-rationale");
  const hasQualityFlag = (q.tags ?? []).some((t) => t.startsWith("quality:"));
  if (hasQualityFlag) issues.push("quality-flag");
  return issues;
}

function validateLesson(lesson) {
  const issues = [];
  if (!lesson.slug) issues.push("missing-slug");
  if (!lesson.title) issues.push("missing-title");
  if (!lesson.topicSlug) issues.push("missing-topic-slug");
  const sections = Array.isArray(lesson.sections) ? lesson.sections : [];
  if (sections.length < MIN_LESSON_SECTIONS) issues.push("insufficient-sections");
  const emptySections = sections.filter(
    (s) => !s.body || s.body.trim().length < 20
  );
  if (emptySections.length > 0) issues.push(`empty-sections:${emptySections.length}`);
  return issues;
}

// ─── STEP 1: load blueprint ───────────────────────────────────────────────────

function step1_loadBlueprint(examCode) {
  const blueprints = loadJson("data/replit-exports/exam_blueprints.json");
  const bp = blueprints.find((b) => b.exam_code === examCode);
  if (!bp) throw new Error(`Blueprint not found for exam_code=${examCode}`);
  return {
    id: bp.id,
    examCode: bp.exam_code,
    examName: bp.exam_name,
    tier: bp.tier,
    region: bp.region,
    totalQuestions: bp.total_questions,
    passingStandard: bp.passing_standard,
    timeLimit: bp.time_limit,
    catEnabled: bp.cat_enabled,
    catMin: bp.cat_min_questions,
    catMax: bp.cat_max_questions,
    domains: bp.domains.map((d) => ({
      name: d.name,
      weight: d.weight,
      questionRange: d.questionRange,
    })),
    questionTypeWeights: bp.question_type_weights,
    active: bp.active,
    updatedAt: bp.updated_at,
  };
}

// ─── STEP 2: generate (aggregate) ─────────────────────────────────────────────

function step2_generate(programId, cfg) {
  // Questions from materialized batch
  const allQuestions = loadJson(
    "data/materialized/rn-pn-replit-batch-2026/questions.json"
  );
  const stats = loadJson(
    "data/materialized/rn-pn-replit-batch-2026/generation-stats.json"
  );

  // Filter to this program's tier and region
  const programQuestions = allQuestions.filter((q) => {
    if (q.tier !== cfg.tier) return false;
    if (cfg.region === "US" && q.countryCode && q.countryCode !== "US") return false;
    if (cfg.region === "CA" && q.countryCode && q.countryCode !== "CA") return false;
    return true;
  });

  // Lessons from materialized batch catalog-lessons
  const catalogLessons = loadJson(
    "data/materialized/rn-pn-replit-batch-2026/catalog-lessons.json"
  );
  const batchLessons = catalogLessons[cfg.catalogKey] ?? [];

  // Lessons from main catalog.json
  const mainCatalog = loadJson("src/content/pathway-lessons/catalog.json");
  const catalogPathwayLessons =
    mainCatalog.pathways?.[programId]?.lessons ?? [];

  // Merge: main catalog takes precedence (by slug), then batch fills gaps
  const seenSlugs = new Set(catalogPathwayLessons.map((l) => l.slug));
  const additionalBatchLessons = batchLessons.filter(
    (l) => !seenSlugs.has(l.slug)
  );
  const allLessons = [...catalogPathwayLessons, ...additionalBatchLessons];

  return {
    programId,
    examCode: cfg.examCode,
    region: cfg.region,
    tier: cfg.tier,
    pipelineVersion: PIPELINE_VERSION,
    generatedAt: NOW,
    sourceStats: {
      rawSourceRows: stats.rawRows,
      materialized: stats.emittedQuestions,
      skippedNotPublished: stats.skippedNotPublished,
      skippedInvalidMcq: stats.skippedInvalidMcq,
      skippedNonNursingTier: stats.skippedNonNursingTier,
      skippedStemDedupe: stats.skippedStemDedupe,
      skippedCanadaOnly: stats.skippedCanadaOnly,
    },
    questions: programQuestions,
    lessons: allLessons,
    counts: {
      questions: programQuestions.length,
      lessons: allLessons.length,
      lessonTopics: new Set(allLessons.map((l) => l.topicSlug).filter(Boolean))
        .size,
      questionTopics: new Set(
        programQuestions
          .flatMap((q) => (q.tags ?? []).filter((t) => t.startsWith("topic:")).map((t) => t.slice(6)))
      ).size,
    },
  };
}

// ─── STEP 3: validate ─────────────────────────────────────────────────────────

function step3_validate(generated) {
  const questionResults = generated.questions.map((q) => {
    const issues = validateQuestion(q);
    return { q, issues, valid: issues.length === 0 };
  });
  const lessonResults = generated.lessons.map((l) => {
    const issues = validateLesson(l);
    return { l, issues, valid: issues.length === 0 };
  });

  const validQuestions = questionResults.filter((r) => r.valid).map((r) => r.q);
  const invalidQuestions = questionResults.filter((r) => !r.valid);
  const validLessons = lessonResults.filter((r) => r.valid).map((r) => r.l);
  const invalidLessons = lessonResults.filter((r) => !r.valid);

  // Tally rejection reasons
  const questionRejections = {};
  for (const { issues } of invalidQuestions) {
    for (const issue of issues) {
      questionRejections[issue] = (questionRejections[issue] ?? 0) + 1;
    }
  }
  const lessonRejections = {};
  for (const { issues } of invalidLessons) {
    for (const issue of issues) {
      lessonRejections[issue] = (lessonRejections[issue] ?? 0) + 1;
    }
  }

  return {
    programId: generated.programId,
    validatedAt: NOW,
    rules: {
      minStemWords: MIN_STEM_WORDS,
      minOptions: MIN_OPTIONS,
      minRationaleWords: MIN_RATIONALE_WORDS,
      minLessonSections: MIN_LESSON_SECTIONS,
      rejectGenericStems: true,
      rejectQualityFlagged: true,
    },
    questions: {
      input: generated.questions.length,
      passed: validQuestions.length,
      rejected: invalidQuestions.length,
      rejectionReasons: questionRejections,
      items: validQuestions,
    },
    lessons: {
      input: generated.lessons.length,
      passed: validLessons.length,
      rejected: invalidLessons.length,
      rejectionReasons: lessonRejections,
      items: validLessons,
    },
  };
}

// ─── STEP 4: deduplicate ──────────────────────────────────────────────────────

function step4_deduplicate(validated) {
  // Questions: dedup by stemHash (first wins)
  const seenHashes = new Set();
  const dedupedQuestions = [];
  const dupQuestions = [];
  for (const q of validated.questions.items) {
    const hash = q.stemHash ?? stemHash(q.stem);
    if (seenHashes.has(hash)) {
      dupQuestions.push({ id: q.id, stemHash: hash });
    } else {
      seenHashes.add(hash);
      dedupedQuestions.push({ ...q, stemHash: hash });
    }
  }

  // Lessons: dedup by slug (first wins)
  const seenSlugs = new Set();
  const dedupedLessons = [];
  const dupLessons = [];
  for (const l of validated.lessons.items) {
    if (seenSlugs.has(l.slug)) {
      dupLessons.push({ slug: l.slug, title: l.title });
    } else {
      seenSlugs.add(l.slug);
      dedupedLessons.push(l);
    }
  }

  return {
    programId: validated.programId,
    dedupedAt: NOW,
    method: {
      questions: "stemHash(md5 of trim+lowercase stem)",
      lessons: "slug uniqueness",
    },
    questions: {
      beforeDedup: validated.questions.items.length,
      afterDedup: dedupedQuestions.length,
      duplicatesRemoved: dupQuestions.length,
      items: dedupedQuestions,
    },
    lessons: {
      beforeDedup: validated.lessons.items.length,
      afterDedup: dedupedLessons.length,
      duplicatesRemoved: dupLessons.length,
      items: dedupedLessons,
    },
  };
}

// ─── STEP 5: normalize ────────────────────────────────────────────────────────

function step5_normalize(deduped, blueprint, cfg) {
  const normalizedQuestions = deduped.questions.items.map((q) => {
    const tags = Array.isArray(q.tags) ? q.tags : [];
    // Use canonical mapping so question keys (copd-respiratory) resolve to lesson slugs (copd)
    const topicSlug = canonicalTopicSlugFromTags(tags, q.topic);
    const categoryTag = tags.find((t) => t.startsWith("category:"));
    const categorySlug = categoryTag ? categoryTag.slice(9) : null;

    return {
      id: q.id,
      stemHash: q.stemHash,
      stem: q.stem.trim(),
      options: Array.isArray(q.options) ? q.options.map((o) => o.trim()) : [],
      correctAnswer: Array.isArray(q.correctAnswer)
        ? q.correctAnswer
        : [q.correctAnswer].filter(Boolean),
      questionType: q.questionType ?? "multiple_choice",
      rationale: (q.rationale ?? "").trim(),
      tier: q.tier,
      examCode: cfg.examCode,
      region: cfg.region,
      topicSlug,
      categorySlug,
      bodySystem: q.bodySystem ?? null,
      difficulty: typeof q.difficulty === "number" ? q.difficulty : null,
      status: "published",
      pipelineVersion: PIPELINE_VERSION,
      normalizedAt: NOW,
    };
  });

  const normalizedLessons = deduped.lessons.items.map((l) => {
    return {
      slug: l.slug,
      title: (l.title ?? "").trim(),
      topic: l.topic ?? null,
      topicSlug: l.topicSlug ?? slugify(l.topic ?? l.slug),
      bodySystem: l.bodySystem ?? null,
      pathwayId: deduped.programId,
      locale: "en",
      previewSectionCount: l.previewSectionCount ?? 1,
      seoTitle: l.seoTitle ?? l.title,
      seoDescription: l.seoDescription ?? "",
      sections: (l.sections ?? []).map((s) => ({
        id: s.id,
        heading: s.heading,
        kind: s.kind,
        body: (s.body ?? "").trim(),
      })),
      status: "published",
      pipelineVersion: PIPELINE_VERSION,
      normalizedAt: NOW,
    };
  });

  return {
    programId: deduped.programId,
    examCode: cfg.examCode,
    normalizedAt: NOW,
    questions: {
      count: normalizedQuestions.length,
      items: normalizedQuestions,
    },
    lessons: {
      count: normalizedLessons.length,
      items: normalizedLessons,
    },
  };
}

// ─── STEP 6: link (cross-reference lessons ↔ questions) ─────────────────────

function step6_link(normalized) {
  // Build question index by topicSlug
  const questionsByTopic = new Map();
  for (const q of normalized.questions.items) {
    const slug = q.topicSlug;
    if (!questionsByTopic.has(slug)) questionsByTopic.set(slug, []);
    questionsByTopic.get(slug).push(q.id);
  }

  // Build lesson index by topicSlug
  const lessonsByTopic = new Map();
  for (const l of normalized.lessons.items) {
    const slug = l.topicSlug;
    if (!lessonsByTopic.has(slug)) lessonsByTopic.set(slug, []);
    lessonsByTopic.get(slug).push(l.slug);
  }

  // Enrich questions with related lesson slugs
  const linkedQuestions = normalized.questions.items.map((q) => ({
    ...q,
    relatedLessonSlugs: lessonsByTopic.get(q.topicSlug) ?? [],
  }));

  // Enrich lessons with question count and sample question IDs
  const linkedLessons = normalized.lessons.items.map((l) => {
    const qIds = questionsByTopic.get(l.topicSlug) ?? [];
    return {
      ...l,
      questionCount: qIds.length,
      sampleQuestionIds: qIds.slice(0, 5),
    };
  });

  // Topics present in questions but without a lesson
  const questionTopics = new Set(normalized.questions.items.map((q) => q.topicSlug));
  const lessonTopics = new Set(normalized.lessons.items.map((l) => l.topicSlug));
  const topicsWithoutLesson = [...questionTopics].filter((t) => !lessonTopics.has(t));
  const topicsWithoutQuestions = [...lessonTopics].filter((t) => !questionTopics.has(t));

  const catchAllQuestions = linkedQuestions.filter((q) => isCatchAllTopic(q.topicSlug));

  return {
    programId: normalized.programId,
    linkedAt: NOW,
    questions: {
      count: linkedQuestions.length,
      items: linkedQuestions,
    },
    lessons: {
      count: linkedLessons.length,
      items: linkedLessons,
    },
    linkingMetadata: {
      totalTopicSlugs: questionTopics.size,
      topicsWithLesson: [...questionTopics].filter((t) => lessonTopics.has(t)).length,
      topicsWithoutLesson,
      topicsWithoutQuestions,
      catchAllQuestionCount: catchAllQuestions.length,
      averageQuestionsPerTopic:
        linkedLessons.length > 0
          ? Math.round(
              linkedLessons.reduce((sum, l) => sum + l.questionCount, 0) /
                linkedLessons.length
            )
          : 0,
    },
  };
}

// ─── STEP 7: transform to import-ready JSON ───────────────────────────────────

function step7_importReady(linked, blueprint) {
  const importQuestions = linked.questions.items.map((q) => ({
    id: q.id,
    stem: q.stem,
    stemHash: q.stemHash,
    options: q.options,
    correctAnswer: q.correctAnswer,
    questionType: q.questionType,
    rationale: q.rationale,
    tier: q.tier,
    exam: q.examCode,
    region: q.region,
    topicSlug: q.topicSlug,
    categorySlug: q.categorySlug,
    bodySystem: q.bodySystem,
    difficulty: q.difficulty,
    status: q.status,
    relatedLessonSlugs: q.relatedLessonSlugs,
    importMeta: {
      pipelineVersion: q.pipelineVersion,
      importedAt: NOW,
      source: "replit-materialized-batch-2026",
    },
  }));

  const importLessons = linked.lessons.items.map((l) => ({
    slug: l.slug,
    pathwayId: l.pathwayId,
    locale: l.locale,
    title: l.title,
    topic: l.topic,
    topicSlug: l.topicSlug,
    bodySystem: l.bodySystem,
    previewSectionCount: l.previewSectionCount,
    seoTitle: l.seoTitle,
    seoDescription: l.seoDescription,
    sections: l.sections,
    status: l.status,
    questionCount: l.questionCount,
    sampleQuestionIds: l.sampleQuestionIds,
    importMeta: {
      pipelineVersion: l.pipelineVersion,
      importedAt: NOW,
      source: "catalog-json-and-materialized-batch",
    },
  }));

  return {
    programId: linked.programId,
    examCode: blueprint.examCode,
    examName: blueprint.examName,
    region: blueprint.region,
    transformedAt: NOW,
    pipelineVersion: PIPELINE_VERSION,
    questions: {
      count: importQuestions.length,
      items: importQuestions,
    },
    lessons: {
      count: importLessons.length,
      items: importLessons,
    },
    meta: {
      targetTotalQuestions: blueprint.totalQuestions,
      catEnabled: blueprint.catEnabled,
      catMin: blueprint.catMin,
      catMax: blueprint.catMax,
    },
  };
}

// ─── STEP 8: coverage audit ───────────────────────────────────────────────────

function step8_coverageAudit(importReady, blueprint) {
  const { questions, lessons } = importReady;

  // Question coverage by domain (map blueprint domains to topic patterns)
  // All topic slugs here are canonical (resolved via QUESTION_KEY_TO_CANONICAL_SLUG).
  const DOMAIN_TOPIC_MAP = {
    "Management of Care": [
      "delegation", "prioritization", "fundamentals-patient-safety",
      "emergency-triage-disaster", "clinical-judgment",
    ],
    "Safety and Infection Control": [
      "infection-control", "wounds", "fundamentals-patient-safety",
    ],
    "Health Promotion and Maintenance": [
      "health-promotion", "maternal-newborn-care", "pediatrics-care",
      "maternity", "pediatrics", "nutrition",
    ],
    "Psychosocial Integrity": [
      "mental-health-crisis", "mental-health",
    ],
    "Basic Care and Comfort": [
      "pain", "fluids-electrolytes", "fundamentals-patient-safety",
    ],
    "Pharmacological Therapies": [
      "anticoagulation", "antibiotics", "diabetes-meds", "pain",
      "pharmacology",
    ],
    "Reduction of Risk Potential": [
      "sepsis", "shock", "abg", "acid-base",
      "potassium", "sodium", "neurological-acute-care", "neurological",
    ],
    "Physiological Adaptation": [
      "heart-failure", "acute-coronary", "pulmonary-embolism", "angina",
      "dysrhythmias", "hypertension", "asthma", "ards", "pneumonia",
      "copd", "gastrointestinal-acute-care", "renal-genitourinary-care",
      "hematology-oncology-care", "musculoskeletal-care", "integumentary-burn-wound",
      "cardiovascular", "respiratory", "gastrointestinal", "renal-gu",
      "hematology", "musculoskeletal", "integumentary", "infectious",
    ],
  };

  // Build topic → question count map
  const topicCounts = {};
  for (const q of questions.items) {
    topicCounts[q.topicSlug] = (topicCounts[q.topicSlug] ?? 0) + 1;
  }

  // Build topic → lesson count map
  const topicLessonCounts = {};
  for (const l of lessons.items) {
    topicLessonCounts[l.topicSlug] = (topicLessonCounts[l.topicSlug] ?? 0) + 1;
  }

  const domainCoverage = blueprint.domains.map((domain) => {
    const mappedTopics = DOMAIN_TOPIC_MAP[domain.name] ?? [];
    const domainQuestionCount = mappedTopics.reduce(
      (sum, t) => sum + (topicCounts[t] ?? 0),
      0
    );
    const domainLessonCount = mappedTopics.reduce(
      (sum, t) => sum + (topicLessonCounts[t] ?? 0),
      0
    );
    const [min, max] = domain.questionRange;
    const target = Math.round((min + max) / 2);
    const coverage = domainQuestionCount / Math.max(target, 1);

    return {
      domain: domain.name,
      weight: domain.weight,
      questionTarget: { min, max, target },
      actual: {
        questions: domainQuestionCount,
        lessons: domainLessonCount,
      },
      coveragePct: Math.round(coverage * 100),
      status:
        domainQuestionCount >= max
          ? "strong"
          : domainQuestionCount >= min
          ? "acceptable"
          : domainQuestionCount >= Math.floor(min * 0.5)
          ? "thin"
          : "gap",
      mappedTopics,
    };
  });

  const totalQuestions = questions.count;
  const totalLessons = lessons.count;
  const strongDomains = domainCoverage.filter((d) => d.status === "strong").length;
  const acceptableDomains = domainCoverage.filter((d) => d.status === "acceptable").length;
  const thinDomains = domainCoverage.filter((d) => d.status === "thin").length;
  const gapDomains = domainCoverage.filter((d) => d.status === "gap").length;

  // Unmapped topics (topics with questions but not in any domain map)
  const mappedTopicSet = new Set(Object.values(DOMAIN_TOPIC_MAP).flat());
  const unmappedTopics = Object.entries(topicCounts)
    .filter(([t]) => !mappedTopicSet.has(t))
    .map(([t, count]) => ({ topicSlug: t, questionCount: count }))
    .sort((a, b) => b.questionCount - a.questionCount);

  const gaps = domainCoverage
    .filter((d) => d.status === "gap" || d.status === "thin")
    .map((d) => ({
      domain: d.domain,
      status: d.status,
      questionDeficit: Math.max(0, d.questionTarget.min - d.actual.questions),
      lessonDeficit: Math.max(0, 2 - d.actual.lessons),
    }));

  return {
    programId: importReady.programId,
    examCode: blueprint.examCode,
    auditedAt: NOW,
    totals: {
      questions: totalQuestions,
      lessons: totalLessons,
      domains: blueprint.domains.length,
      topicsWithQuestions: Object.keys(topicCounts).length,
      topicsWithLessons: Object.keys(topicLessonCounts).length,
    },
    domainSummary: {
      strong: strongDomains,
      acceptable: acceptableDomains,
      thin: thinDomains,
      gap: gapDomains,
    },
    domainCoverage,
    gaps,
    unmappedTopics,
    recommendations: [
      ...gaps.map(
        (g) =>
          `[${g.status.toUpperCase()}] ${g.domain}: add ~${g.questionDeficit} questions and ${g.lessonDeficit} lessons`
      ),
      unmappedTopics.length > 0
        ? `${unmappedTopics.length} topics unmapped to domains — consider assigning ${unmappedTopics.slice(0, 3).map((t) => t.topicSlug).join(", ")}`
        : null,
    ].filter(Boolean),
  };
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  const programId = process.argv[2] ?? "us-rn-nclex-rn";
  const cfg = PROGRAM_CONFIG[programId];
  if (!cfg) {
    const valid = Object.keys(PROGRAM_CONFIG).join(", ");
    throw new Error(`Unknown programId "${programId}". Valid: ${valid}`);
  }

  console.error(`[pipeline] Starting batch for program: ${programId} (${cfg.displayName})`);

  // 1. Blueprint
  console.error("[1/8] Loading blueprint...");
  const blueprint = step1_loadBlueprint(cfg.examCode);

  // 2. Generate
  console.error("[2/8] Aggregating generated content...");
  const generated = step2_generate(programId, cfg);

  // 3. Validate
  console.error("[3/8] Validating content...");
  const validated = step3_validate(generated);

  // 4. Deduplicate
  console.error("[4/8] Deduplicating...");
  const deduped = step4_deduplicate(validated);

  // 5. Normalize
  console.error("[5/8] Normalizing...");
  const normalized = step5_normalize(deduped, blueprint, cfg);

  // 6. Link
  console.error("[6/8] Adding linking metadata...");
  const linked = step6_link(normalized);

  // 7. Import-ready
  console.error("[7/8] Transforming to import-ready JSON...");
  const importReady = step7_importReady(linked, blueprint);

  // 8. Coverage audit
  console.error("[8/8] Producing coverage audit...");
  const coverageAudit = step8_coverageAudit(importReady, blueprint);

  // ─── Build summary (items are large; emit summaries for outer envelope) ──
  const summarize_generated = {
    programId: generated.programId,
    examCode: generated.examCode,
    region: generated.region,
    tier: generated.tier,
    pipelineVersion: generated.pipelineVersion,
    generatedAt: generated.generatedAt,
    sourceStats: generated.sourceStats,
    counts: generated.counts,
  };

  const summarize_validated = {
    programId: validated.programId,
    validatedAt: validated.validatedAt,
    rules: validated.rules,
    questions: {
      input: validated.questions.input,
      passed: validated.questions.passed,
      rejected: validated.questions.rejected,
      rejectionReasons: validated.questions.rejectionReasons,
    },
    lessons: {
      input: validated.lessons.input,
      passed: validated.lessons.passed,
      rejected: validated.lessons.rejected,
      rejectionReasons: validated.lessons.rejectionReasons,
    },
  };

  const summarize_deduped = {
    programId: deduped.programId,
    dedupedAt: deduped.dedupedAt,
    method: deduped.method,
    questions: {
      beforeDedup: deduped.questions.beforeDedup,
      afterDedup: deduped.questions.afterDedup,
      duplicatesRemoved: deduped.questions.duplicatesRemoved,
    },
    lessons: {
      beforeDedup: deduped.lessons.beforeDedup,
      afterDedup: deduped.lessons.afterDedup,
      duplicatesRemoved: deduped.lessons.duplicatesRemoved,
    },
  };

  const summarize_normalized = {
    programId: normalized.programId,
    examCode: normalized.examCode,
    normalizedAt: normalized.normalizedAt,
    questions: { count: normalized.questions.count },
    lessons: { count: normalized.lessons.count },
  };

  const summarize_linked = {
    programId: linked.programId,
    linkedAt: linked.linkedAt,
    questions: { count: linked.questions.count },
    lessons: { count: linked.lessons.count },
    linkingMetadata: linked.linkingMetadata,
  };

  const summarize_importReady = {
    programId: importReady.programId,
    examCode: importReady.examCode,
    examName: importReady.examName,
    region: importReady.region,
    transformedAt: importReady.transformedAt,
    pipelineVersion: importReady.pipelineVersion,
    questions: { count: importReady.questions.count },
    lessons: { count: importReady.lessons.count },
    meta: importReady.meta,
    sampleQuestion: importReady.questions.items[0] ?? null,
    sampleLesson: (() => {
      const l = importReady.lessons.items[0];
      if (!l) return null;
      return { ...l, sections: l.sections.slice(0, 1) };
    })(),
  };

  const result = {
    blueprint,
    generated: summarize_generated,
    validated: summarize_validated,
    deduped: summarize_deduped,
    normalized: summarize_normalized,
    linked: summarize_linked,
    importReady: summarize_importReady,
    coverageAudit,
  };

  console.error(
    `[pipeline] Done. questions=${importReady.questions.count} lessons=${importReady.lessons.count} domains=${coverageAudit.totals.domains}`
  );

  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

main().catch((e) => {
  console.error("[pipeline] FATAL:", e.message);
  process.exit(1);
});
