/**
 * NurseNest Exam Blueprint Schema — machine-readable, authoritative definition.
 *
 * Covers all six NurseNest program tracks:
 *   RN  · RPN/LPN  · NP  · Allied Health  · Pre-nursing  · New Grad
 *
 * Supports both:
 *   • Nursing licensure prep  (NCLEX-RN, NCLEX-PN, REx-PN, AANP/ANCC, CNPLE)
 *   • Allied health career-specific prep  (RT, PT, OT, MLT, Paramedic, etc.)
 *
 * Hierarchy: program > domain > subdomain > topic
 *
 * Usage:
 *   import { EXAM_BLUEPRINT_JSON_SCHEMA, type BlueprintDocument } from "@/lib/content/exam-blueprint-schema";
 *
 * Validation helpers are pure functions — none throw; all return result objects.
 *
 * Schema ID: https://nursenest.io/schemas/exam-blueprint/v1
 */

// ─── Program / Exam Enums ─────────────────────────────────────────────────────

/**
 * The six NurseNest program tracks.
 * Used in blueprint `program` fields and as route / content-generation discriminants.
 */
export type BlueprintProgram =
  | "rn"           // Registered Nurse licensure prep (NCLEX-RN / Canadian RN)
  | "rpn"          // Registered Practical Nurse — Canada (REx-PN)
  | "lpn"          // Licensed Practical Nurse — US (NCLEX-PN)
  | "np"           // Nurse Practitioner (AANP-FNP / ANCC / CNPLE-NP)
  | "allied"       // Allied Health career-specific (RT, PT, OT, MLT, paramedic…)
  | "pre-nursing"  // Pre-nursing foundations (A&P, dosage math, terminology…)
  | "new-grad";    // New-graduate transition to practice

/** Country applicability for a blueprint topic or document. */
export type BlueprintCountry = "us" | "ca" | "both";

/**
 * Exam codes recognised by the blueprint system.
 * Allied exams are referenced by a career-specific code (e.g. "NBRC-TMC").
 */
export type BlueprintExamCode =
  // RN
  | "NCLEX-RN"
  | "Canadian-RN"
  // PN / RPN
  | "NCLEX-PN"
  | "REx-PN"
  // NP
  | "AANP-FNP"
  | "ANCC-FNP"
  | "ANCC-AGPCNP"
  | "ANCC-PMHNP"
  | "CNPLE-NP"
  // Allied (non-exhaustive; extend per career)
  | "NBRC-TMC"     // Respiratory Therapy — Therapist Multiple Choice
  | "NPTE-PT"      // Physical Therapy
  | "NBCOT-OT"     // Occupational Therapy
  | "ASCP-MLT"     // Medical Lab Tech
  | "NREMT-EMT"    // EMT National Registry
  | "NREMT-P"      // Paramedic National Registry
  // Pre-nursing / New Grad — no single licensure exam; blank or custom
  | string;        // catch-all for any future or allied exam code

// ─── Difficulty Mix ───────────────────────────────────────────────────────────

/**
 * Difficulty distribution as integer percentages (must sum to 100).
 *
 * - Entry-level programs (pre-nursing, new-grad, RN, LPN/RPN):
 *     { easy, moderate, hard }
 * - Advanced programs (NP):
 *     { medium, hard, expert }
 * - Allied programs:
 *     { easy, moderate, hard }
 *
 * Whichever keys are present are validated; absent keys default to 0.
 */
export type BlueprintDifficultyMix = {
  // Entry-level / allied
  easy?: number;
  moderate?: number;
  hard?: number;
  // Advanced practice (NP)
  medium?: number;
  expert?: number;
};

// ─── Content Complexity ───────────────────────────────────────────────────────

/** Overall clinical / academic depth of a topic. */
export type BlueprintComplexity =
  | "foundational"   // Pre-nursing: A&P, med-term, dosage math
  | "entry-level"    // RN / LPN / RPN: supervised clinical scope
  | "advanced"       // NP / specialized allied: autonomous clinical decision-making
  | "expert";        // Multi-system, high-stakes, prescribing, ethics-laden

// ─── Topic Status ─────────────────────────────────────────────────────────────

export type BlueprintTopicStatus = "planned" | "in_progress" | "published" | "archived";

// ─── Body Systems ─────────────────────────────────────────────────────────────

/**
 * Canonical body-system values aligned with CAT inference maps (`cat-inference-maps.ts`).
 * Use these exact strings for cross-surface consistency.
 */
export type BlueprintBodySystem =
  | "cardiovascular"
  | "respiratory"
  | "neurological"
  | "musculoskeletal"
  | "gastrointestinal"
  | "endocrine"
  | "genitourinary"
  | "reproductive-health"
  | "dermatology"
  | "behavioral-health"
  | "infectious-disease"
  | "hematology-oncology"
  | "pharmacology"
  | "multisystem"
  | "general"
  | string; // allow career-specific systems (e.g. "respiratory-therapy")

// ─── Question Type Keys ───────────────────────────────────────────────────────

/** Recognised question format codes across all programs. */
export type BlueprintQuestionType =
  | "MCQ"        // Multiple-choice single best answer
  | "SATA"       // Select all that apply
  | "Priority"   // Prioritization / ordered response
  | "Exhibit"    // Exhibit / chart-based
  | "Fill-in"    // Fill-in-the-blank calculation
  | "Drag-drop"  // Drag-and-drop
  | "Hot-spot"   // Hot-spot / highlight
  | "Bowtie"     // Bowtie (NGN)
  | "Matrix"     // Matrix / grid (NGN)
  | "Trend"      // Trend (NGN extended)
  | "Case-study" // Allied / NP extended case
  | string;      // future formats

// ─── Core Topic Entry ─────────────────────────────────────────────────────────

/**
 * A single topic unit in an exam blueprint.
 * One topic → N lessons + M questions.
 *
 * All fields are validated by {@link validateBlueprintTopic}.
 */
export interface BlueprintTopic {
  /** Human-readable topic name (title-cased). */
  topic: string;

  /** URL-safe slug: lowercase letters, digits, hyphens only. */
  topicSlug: string;

  /**
   * One or more program tracks this topic applies to.
   * Use an array when a topic is shared across tracks (e.g. RN + New Grad).
   */
  program: BlueprintProgram | BlueprintProgram[];

  /** Country applicability. */
  country: BlueprintCountry;

  /**
   * One or more target exam codes.
   * Empty array (`[]`) is allowed for pre-nursing or transition topics.
   */
  exam: BlueprintExamCode[];

  /** Top-level content domain (e.g. "Adult Health / Med-Surg"). */
  domain: string;

  /** Subdomain within the domain (e.g. "Cardiovascular Disorders"). */
  subdomain: string;

  /**
   * Canonical body system.
   * Must match a value in {@link BlueprintBodySystem} or a career-specific system.
   */
  bodySystem: BlueprintBodySystem;

  /**
   * Exam frequency / priority weight (1–5).
   * 1 = Supplemental  →  5 = Critical (always tested, highest frequency)
   */
  priorityWeight: 1 | 2 | 3 | 4 | 5;

  /**
   * Target number of lessons to author for this topic.
   * Inclusive minimum for batch planning.
   */
  lessonTargetCount: number;

  /**
   * Target number of practice questions for this topic.
   * Inclusive minimum for question-bank audits.
   */
  questionTargetCount: number;

  /**
   * Integer percentages summing to 100 across all provided keys.
   * Use { easy, moderate, hard } for entry-level programs;
   * use { medium, hard, expert } for NP / advanced programs.
   */
  difficultyMix: BlueprintDifficultyMix;

  /** Searchable string tags for filtering, audit queries, and generation prompts. */
  tags: string[];

  // ── Optional extended fields ──────────────────────────────────────────────

  /** Clinical / academic complexity level. */
  complexity?: BlueprintComplexity;

  /** Recommended question format types for this topic. */
  recommendedQuestionTypes?: BlueprintQuestionType[];

  /** Population focus tags (e.g. "pediatric", "older-adult", "LGBTQ+"). */
  populationTags?: string[];

  /**
   * Cross-cutting content domain for catalog grouping.
   * e.g. "disease", "medication", "safety", "case_study"
   */
  contentDomain?: string;

  /** Authoring / generation pipeline status. */
  status?: BlueprintTopicStatus;

  /** Recommended sequence order within the subdomain (ascending). */
  sequenceOrder?: number;

  /** Free-text authoring notes — NOT rendered to learners. */
  generationNotes?: string;

  /**
   * Country-specific applicability override.
   * Use when a sub-field differs by jurisdiction (e.g. "canada-only", "us-only").
   */
  countryApplicability?: BlueprintCountry | "canada-only" | "us-only";
}

// ─── Blueprint Document ───────────────────────────────────────────────────────

/**
 * Top-level blueprint document.
 *
 * One document per program (or per exam) is the recommended pattern.
 * The `program` array declares which tracks this document covers.
 *
 * Load with {@link loadBlueprintDocument} — see also:
 * {@link validateBlueprintDocument}, {@link assertBlueprintDocumentValid}.
 */
export interface BlueprintDocument {
  /** JSON Schema reference. Must equal the canonical ID. */
  $schema?: string;

  /** Semver-aligned integer. Currently `1`. */
  version: 1;

  /** Human-readable label (e.g. "RN Entry-Level Content Blueprint"). */
  label: string;

  /** Full description for tooling and documentation. */
  description: string;

  /** ISO date the document was generated or last reviewed (YYYY-MM-DD). */
  generatedDate: string;

  /**
   * Program tracks covered by this document.
   * Drives validation rules (e.g. allowed difficulty keys).
   */
  program: BlueprintProgram[];

  /** Target exams covered by this document. */
  targetExams: BlueprintExamCode[];

  /**
   * Human-readable explanation of the 1–5 `priorityWeight` scale.
   * Values 1–5 must all be present.
   */
  priorityWeightKey: Record<"1" | "2" | "3" | "4" | "5", string>;

  /**
   * Human-readable explanation of difficulty levels used in `difficultyMix`.
   * Keys must match those used in topics (e.g. { easy, moderate, hard } or { medium, hard, expert }).
   */
  difficultyScale: Record<string, string>;

  /**
   * Human-readable explanation of question type codes used in `recommendedQuestionTypes`.
   * Keys are {@link BlueprintQuestionType} values.
   */
  questionTypeKey?: Record<string, string>;

  /** Ordered array of topic entries. */
  topics: BlueprintTopic[];
}

// ─── Validation ───────────────────────────────────────────────────────────────

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface BlueprintTopicValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface BlueprintDocumentValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  totalTopics: number;
  programCoverage: Partial<Record<BlueprintProgram, number>>;
  duplicateSlugs: string[];
  invalidSlugTopics: string[];
}

/** Validate a single topic entry. Returns errors/warnings — does not throw. */
export function validateBlueprintTopic(
  topic: BlueprintTopic,
  index: number
): BlueprintTopicValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const id = topic.topicSlug || `topic[${index}]`;

  // Required string fields
  for (const field of ["topic", "topicSlug", "domain", "subdomain", "bodySystem"] as const) {
    if (!topic[field] || typeof topic[field] !== "string" || !topic[field].trim()) {
      errors.push(`"${id}": missing or empty required field "${field}"`);
    }
  }

  // Slug format
  if (topic.topicSlug && !SLUG_PATTERN.test(topic.topicSlug)) {
    errors.push(
      `"${id}": topicSlug must match /^[a-z0-9]+(?:-[a-z0-9]+)*$/. Got: "${topic.topicSlug}"`
    );
  }

  // program
  const programs = Array.isArray(topic.program) ? topic.program : [topic.program];
  if (!programs.length) {
    errors.push(`"${id}": program must be a non-empty string or array`);
  }

  // country
  if (!["us", "ca", "both"].includes(topic.country)) {
    errors.push(`"${id}": country must be "us" | "ca" | "both". Got: "${topic.country}"`);
  }

  // exam — empty array is valid for pre-nursing / new-grad
  if (!Array.isArray(topic.exam)) {
    errors.push(`"${id}": exam must be an array (use [] for no exam)`);
  }

  // priorityWeight
  if (![1, 2, 3, 4, 5].includes(topic.priorityWeight)) {
    errors.push(`"${id}": priorityWeight must be 1–5. Got: ${topic.priorityWeight}`);
  }

  // lessonTargetCount
  if (typeof topic.lessonTargetCount !== "number" || topic.lessonTargetCount < 1) {
    errors.push(`"${id}": lessonTargetCount must be a positive integer`);
  }

  // questionTargetCount
  if (typeof topic.questionTargetCount !== "number" || topic.questionTargetCount < 1) {
    errors.push(`"${id}": questionTargetCount must be a positive integer`);
  }

  // difficultyMix — percentages must sum to 100
  if (!topic.difficultyMix || typeof topic.difficultyMix !== "object") {
    errors.push(`"${id}": difficultyMix must be an object`);
  } else {
    const keys = Object.keys(topic.difficultyMix) as Array<keyof BlueprintDifficultyMix>;
    if (keys.length === 0) {
      errors.push(`"${id}": difficultyMix must have at least one key`);
    } else {
      const sum = keys.reduce(
        (acc, k) => acc + (topic.difficultyMix[k] ?? 0),
        0
      );
      if (sum !== 100) {
        errors.push(
          `"${id}": difficultyMix percentages must sum to 100 (got ${sum})`
        );
      }
      // Validate NP-only keys are not mixed with entry-level keys
      const entryKeys = keys.filter((k) => ["easy", "moderate", "hard"].includes(k));
      const advancedKeys = keys.filter((k) => ["medium", "expert"].includes(k));
      if (entryKeys.length > 0 && advancedKeys.length > 0) {
        warnings.push(
          `"${id}": difficultyMix mixes entry-level keys (easy/moderate/hard) ` +
          `with advanced keys (medium/expert). Ensure intentional.`
        );
      }
    }
  }

  // tags
  if (!Array.isArray(topic.tags) || topic.tags.length === 0) {
    warnings.push(`"${id}": tags array is empty — add at least 2 searchable tags`);
  }

  return { valid: errors.length === 0, errors, warnings };
}

/** Full document validation. Returns a result object — does not throw. */
export function validateBlueprintDocument(
  doc: BlueprintDocument
): BlueprintDocumentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (doc.version !== 1) {
    errors.push(`version must be 1 (got ${doc.version})`);
  }
  if (!doc.label?.trim()) errors.push("label is required");
  if (!doc.description?.trim()) errors.push("description is required");
  if (!doc.generatedDate?.trim()) errors.push("generatedDate is required");
  if (!Array.isArray(doc.program) || doc.program.length === 0) {
    errors.push("program must be a non-empty array");
  }
  if (!Array.isArray(doc.topics)) {
    errors.push("topics must be an array");
    return {
      valid: false,
      errors,
      warnings,
      totalTopics: 0,
      programCoverage: {},
      duplicateSlugs: [],
      invalidSlugTopics: [],
    };
  }

  const programCoverage: Partial<Record<BlueprintProgram, number>> = {};
  const slugsSeen = new Map<string, number>();
  const invalidSlugTopics: string[] = [];

  for (let i = 0; i < doc.topics.length; i++) {
    const topic = doc.topics[i];
    const result = validateBlueprintTopic(topic, i);
    errors.push(...result.errors);
    warnings.push(...result.warnings);

    // Slug tracking
    const slug = topic.topicSlug;
    if (slug) {
      slugsSeen.set(slug, (slugsSeen.get(slug) ?? 0) + 1);
      if (!SLUG_PATTERN.test(slug)) invalidSlugTopics.push(slug);
    }

    // Program coverage
    const programs = Array.isArray(topic.program) ? topic.program : [topic.program];
    for (const p of programs) {
      programCoverage[p] = (programCoverage[p] ?? 0) + 1;
    }
  }

  const duplicateSlugs = [...slugsSeen.entries()]
    .filter(([, count]) => count > 1)
    .map(([slug]) => slug);

  if (duplicateSlugs.length > 0) {
    errors.push(`Duplicate topicSlugs: ${duplicateSlugs.join(", ")}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    totalTopics: doc.topics.length,
    programCoverage,
    duplicateSlugs,
    invalidSlugTopics,
  };
}

/** Validate and throw on error. Use in generation scripts where a bad blueprint must hard-fail. */
export function assertBlueprintDocumentValid(doc: BlueprintDocument): void {
  const result = validateBlueprintDocument(doc);
  if (!result.valid) {
    throw new Error(
      `[exam-blueprint-schema] Validation failed:\n` +
        result.errors.map((e) => `  • ${e}`).join("\n")
    );
  }
}

// ─── Query helpers ────────────────────────────────────────────────────────────

/** Return all topics for a specific program track, preserving document order. */
export function getTopicsForProgram(
  doc: BlueprintDocument,
  program: BlueprintProgram
): BlueprintTopic[] {
  return doc.topics.filter((t) => {
    const programs = Array.isArray(t.program) ? t.program : [t.program];
    return programs.includes(program);
  });
}

/** Return all topics in a domain, sorted by sequenceOrder then insertion order. */
export function getTopicsForDomain(
  doc: BlueprintDocument,
  domain: string
): BlueprintTopic[] {
  return doc.topics
    .filter((t) => t.domain === domain)
    .sort((a, b) => (a.sequenceOrder ?? Infinity) - (b.sequenceOrder ?? Infinity));
}

/** Look up a single topic by slug. Returns undefined when not found. */
export function getTopicBySlug(
  doc: BlueprintDocument,
  slug: string
): BlueprintTopic | undefined {
  return doc.topics.find((t) => t.topicSlug === slug);
}

/** Aggregate topic counts per domain. */
export function domainTopicCounts(doc: BlueprintDocument): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const t of doc.topics) {
    counts[t.domain] = (counts[t.domain] ?? 0) + 1;
  }
  return counts;
}

/** Project total lesson and question targets across all topics. */
export function projectContentTotals(doc: BlueprintDocument): {
  totalLessons: number;
  totalQuestions: number;
} {
  return doc.topics.reduce(
    (acc, t) => ({
      totalLessons: acc.totalLessons + (t.lessonTargetCount ?? 0),
      totalQuestions: acc.totalQuestions + (t.questionTargetCount ?? 0),
    }),
    { totalLessons: 0, totalQuestions: 0 }
  );
}

/** Filter topics by priorityWeight (inclusive min). */
export function getHighPriorityTopics(
  doc: BlueprintDocument,
  minWeight: 1 | 2 | 3 | 4 | 5 = 4
): BlueprintTopic[] {
  return doc.topics.filter((t) => t.priorityWeight >= minWeight);
}

/** Filter topics by country applicability. */
export function getTopicsForCountry(
  doc: BlueprintDocument,
  country: "us" | "ca"
): BlueprintTopic[] {
  return doc.topics.filter(
    (t) => t.country === "both" || t.country === country
  );
}

// ─── JSON Schema (draft-07) ───────────────────────────────────────────────────

/**
 * Machine-readable JSON Schema for blueprint documents.
 *
 * Embed in tooling, AI generation prompts, or CMS validators.
 *
 * Schema ID: https://nursenest.io/schemas/exam-blueprint/v1
 */
export const EXAM_BLUEPRINT_JSON_SCHEMA = {
  $schema: "https://json-schema.org/draft-07/schema#",
  $id: "https://nursenest.io/schemas/exam-blueprint/v1",
  title: "NurseNest Exam Blueprint",
  description:
    "Machine-readable blueprint schema for NurseNest content generation. " +
    "Covers RN, RPN/LPN, NP, Allied Health, Pre-nursing, and New Grad programs. " +
    "Hierarchy: program > domain > subdomain > topic.",
  type: "object",
  required: ["version", "label", "description", "generatedDate", "program", "targetExams", "priorityWeightKey", "difficultyScale", "topics"],
  additionalProperties: false,
  properties: {
    $schema: { type: "string" },
    version: { type: "integer", enum: [1], description: "Schema version. Must be 1." },
    label: { type: "string", minLength: 1, description: "Human-readable document label." },
    description: { type: "string", minLength: 1 },
    generatedDate: {
      type: "string",
      pattern: "^\\d{4}-\\d{2}-\\d{2}$",
      description: "ISO date the document was generated or last reviewed (YYYY-MM-DD).",
    },
    program: {
      type: "array",
      minItems: 1,
      items: {
        type: "string",
        enum: ["rn", "rpn", "lpn", "np", "allied", "pre-nursing", "new-grad"],
      },
      description: "Program tracks covered by this document.",
    },
    targetExams: {
      type: "array",
      items: { type: "string" },
      description: "Target exam codes (e.g. NCLEX-RN, REx-PN, AANP-FNP).",
    },
    priorityWeightKey: {
      type: "object",
      required: ["1", "2", "3", "4", "5"],
      properties: {
        "1": { type: "string" },
        "2": { type: "string" },
        "3": { type: "string" },
        "4": { type: "string" },
        "5": { type: "string" },
      },
      additionalProperties: false,
      description: "Human-readable explanation of the 1–5 priorityWeight scale.",
    },
    difficultyScale: {
      type: "object",
      minProperties: 2,
      additionalProperties: { type: "string" },
      description:
        "Human-readable explanation of difficulty levels. " +
        "Entry-level: easy/moderate/hard. Advanced (NP): medium/hard/expert.",
    },
    questionTypeKey: {
      type: "object",
      additionalProperties: { type: "string" },
      description: "Human-readable explanation of question type codes.",
    },
    topics: {
      type: "array",
      minItems: 1,
      items: { $ref: "#/definitions/BlueprintTopic" },
    },
  },
  definitions: {
    BlueprintTopic: {
      type: "object",
      title: "BlueprintTopic",
      description:
        "A single topic unit: one content node in the hierarchy. " +
        "Maps to N lessons + M questions for batch generation.",
      required: [
        "topic",
        "topicSlug",
        "program",
        "country",
        "exam",
        "domain",
        "subdomain",
        "bodySystem",
        "priorityWeight",
        "lessonTargetCount",
        "questionTargetCount",
        "difficultyMix",
        "tags",
      ],
      additionalProperties: false,
      properties: {
        topic: {
          type: "string",
          minLength: 1,
          description: "Human-readable topic name (title-cased).",
        },
        topicSlug: {
          type: "string",
          pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
          description: "URL-safe slug: lowercase letters, digits, hyphens only.",
        },
        program: {
          oneOf: [
            {
              type: "string",
              enum: ["rn", "rpn", "lpn", "np", "allied", "pre-nursing", "new-grad"],
            },
            {
              type: "array",
              minItems: 1,
              items: {
                type: "string",
                enum: ["rn", "rpn", "lpn", "np", "allied", "pre-nursing", "new-grad"],
              },
            },
          ],
          description: "Program track(s) this topic applies to.",
        },
        country: {
          type: "string",
          enum: ["us", "ca", "both"],
          description: "Country applicability.",
        },
        exam: {
          type: "array",
          items: { type: "string" },
          description:
            "Target exam code(s). Use [] for pre-nursing or new-grad topics with no single licensure exam.",
        },
        domain: {
          type: "string",
          minLength: 1,
          description: "Top-level content domain (e.g. 'Adult Health / Med-Surg').",
        },
        subdomain: {
          type: "string",
          minLength: 1,
          description: "Subdomain within the domain (e.g. 'Cardiovascular Disorders').",
        },
        bodySystem: {
          type: "string",
          minLength: 1,
          description:
            "Canonical body system. Align with cat-inference-maps.ts BODY_SYSTEM_ALIASES.",
        },
        priorityWeight: {
          type: "integer",
          minimum: 1,
          maximum: 5,
          description:
            "Exam frequency / priority weight. " +
            "1=Supplemental, 2=Low, 3=Moderate, 4=High, 5=Critical.",
        },
        lessonTargetCount: {
          type: "integer",
          minimum: 1,
          description: "Target number of lessons to author for this topic.",
        },
        questionTargetCount: {
          type: "integer",
          minimum: 1,
          description: "Target number of practice questions for this topic.",
        },
        difficultyMix: {
          type: "object",
          description:
            "Integer percentages summing to 100. " +
            "Entry-level: { easy, moderate, hard }. " +
            "Advanced/NP: { medium, hard, expert }.",
          additionalProperties: {
            type: "integer",
            minimum: 0,
            maximum: 100,
          },
          minProperties: 2,
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description:
            "Searchable string tags for filtering, audit queries, and generation prompts.",
        },
        complexity: {
          type: "string",
          enum: ["foundational", "entry-level", "advanced", "expert"],
          description: "Clinical / academic complexity level.",
        },
        recommendedQuestionTypes: {
          type: "array",
          items: { type: "string" },
          description: "Recommended question format codes for this topic.",
        },
        populationTags: {
          type: "array",
          items: { type: "string" },
          description: "Population focus tags (e.g. 'pediatric', 'older-adult', 'LGBTQ+').",
        },
        contentDomain: {
          type: "string",
          description:
            "Cross-cutting content domain for catalog grouping (e.g. 'disease', 'medication', 'safety').",
        },
        status: {
          type: "string",
          enum: ["planned", "in_progress", "published", "archived"],
          description: "Authoring / generation pipeline status.",
        },
        sequenceOrder: {
          type: "integer",
          minimum: 1,
          description: "Recommended sequence order within the subdomain (ascending).",
        },
        generationNotes: {
          type: "string",
          description: "Free-text authoring notes — NOT rendered to learners.",
        },
        countryApplicability: {
          type: "string",
          enum: ["us", "ca", "both", "canada-only", "us-only"],
          description:
            "Country-specific applicability override for sub-field jurisdictional nuance.",
        },
      },
    },
  },
} as const;
