#!/usr/bin/env npx tsx
import { promises as fs } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const repoRoot = process.cwd();
const reportDir = path.join(repoRoot, "docs", "reports");
const dataDir = path.join(repoRoot, "reports", "content-quality");

type Finding = {
  assetType: string;
  id: string;
  pathway: string;
  title: string;
  grade: string;
  revisionRequired: "yes" | "no";
  clinicalAccuracy: number;
  examRelevance: number;
  educationalValue: number;
  difficultyCalibration: number;
  writingQuality: number;
  uniqueness: number;
  flags: string[];
};

type SurfaceSummary = {
  count: number;
  gradeCounts: Record<string, number>;
  revisionRequired: number;
  placeholder: number;
  generic: number;
  duplicate: number;
  missingReferences: number;
  weakEvidence: number;
  weakDistractors: number;
  ambiguousOrMissingAnswer: number;
  answerKeyRisk: number;
  averageScores: {
    contentQuality: number;
    clinicalAccuracy: number;
    duplication: number;
    examReadiness: number;
  };
};

const targetPathways = [
  "RN",
  "RPN",
  "PN",
  "NP",
  "Respiratory Therapy",
  "Paramedic",
  "Medical Laboratory Technology",
  "Physiotherapy",
  "Occupational Therapy",
  "PSW",
  "Social Work",
  "Psychotherapy",
];

const placeholderPatterns = [
  /\blorem ipsum\b/i,
  /\bplaceholder\b/i,
  /\btodo\b/i,
  /\btbd\b/i,
  /\bcoming soon\b/i,
  /\bcontent goes here\b/i,
  /\bgenerated content\b/i,
  /\bAI-generated\b/i,
  /\binsert\b.{0,20}\bhere\b/i,
  /\bexample content\b/i,
];

const genericPatterns = [
  /\bchoose the best answer\b/i,
  /\bthis is important for nurses\b/i,
  /\bremember to study this topic\b/i,
  /\bprevent harm before polish\b/i,
  /\blower-priority information\b/i,
  /\bthe correct answer is correct because\b/i,
  /\bthis option is incorrect because it is not the best answer\b/i,
];

const evidenceWords = [
  "guideline",
  "evidence",
  "reference",
  "source",
  "apa",
  "citation",
  "standard",
  "protocol",
  "best practice",
  "reviewed",
];

const professionMatchers: Array<[string, RegExp]> = [
  ["Respiratory Therapy", /\b(respiratory|rrt|tmc|crt|ventilator|airway|oxygen|abg)\b/i],
  ["Paramedic", /\b(paramedic|ems|prehospital|ambulance|trauma|ACLS|BLS)\b/i],
  ["Medical Laboratory Technology", /\b(mlt|laboratory|lab tech|hematology|microbiology|phlebotomy)\b/i],
  ["Physiotherapy", /\b(physiotherapy|physical therapy|rehab|mobility|gait)\b/i],
  ["Occupational Therapy", /\b(occupational therapy|activities of daily living|ADL|adaptive equipment)\b/i],
  ["PSW", /\b(psw|personal support worker|long-term care|resident care)\b/i],
  ["Social Work", /\b(social work|case management|counseling|community resources)\b/i],
  ["Psychotherapy", /\b(psychotherapy|therapeutic communication|CBT|counselling|mental health)\b/i],
];

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function words(text: string): number {
  return (text.replace(/<[^>]*>/g, " ").match(/[A-Za-z0-9']+/g) ?? []).length;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function hasAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function evidenceSignal(text: string): boolean {
  const normalized = text.toLowerCase();
  return evidenceWords.some((word) => normalized.includes(word));
}

function gradeFor(score: number): string {
  if (score >= 95) return "A+";
  if (score >= 85) return "A";
  if (score >= 72) return "B";
  if (score >= 55) return "C";
  return "D";
}

function pathwayFromQuestion(row: { exam: string; tier: string; careerType: string | null; topic: string | null; bodySystem: string | null }): string {
  const bundle = `${row.exam} ${row.tier} ${row.careerType ?? ""} ${row.topic ?? ""} ${row.bodySystem ?? ""}`;
  if (/\bREx-PN\b/i.test(bundle)) return "RPN";
  if (/\bNCLEX-PN\b|\blvn\b|\blpn\b/i.test(bundle)) return "PN";
  if (/\bNP\b|\bFNP\b|\bCNPLE\b|\bAGNP\b/i.test(bundle)) return "NP";
  if (/\bNCLEX-RN\b|\brn\b/i.test(bundle)) return "RN";
  for (const [label, re] of professionMatchers) {
    if (re.test(bundle)) return label;
  }
  if (/\ballied\b/i.test(bundle)) return "Allied Unclassified";
  return "Unclassified";
}

function pathwayFromText(text: string, fallback = "Unclassified"): string {
  if (/\bREx-PN\b|\brpn\b/i.test(text)) return "RPN";
  if (/\bNCLEX-PN\b|\blpn\b|\blvn\b|\bpn\b/i.test(text)) return "PN";
  if (/\bNP\b|\bFNP\b|\bCNPLE\b|\bAGNP\b/i.test(text)) return "NP";
  if (/\bNCLEX-RN\b|\brn\b/i.test(text)) return "RN";
  for (const [label, re] of professionMatchers) {
    if (re.test(text)) return label;
  }
  return fallback;
}

function scoreFinding(input: {
  assetType: string;
  id: string;
  pathway: string;
  title: string;
  text: string;
  wordCount: number;
  duplicate: boolean;
  hasReferences: boolean;
  hasExamMetadata: boolean;
  hasDifficulty: boolean;
  hasTeaching: boolean;
  hasDistractorTeaching?: boolean;
  hasCorrectAnswer?: boolean;
  answerKeyRisk?: boolean;
  outdated?: boolean;
  extraFlags?: string[];
}): Finding {
  const flags = new Set<string>(input.extraFlags ?? []);
  const placeholder = hasAny(input.text, placeholderPatterns);
  const generic = hasAny(input.text, genericPatterns);
  if (placeholder) flags.add("placeholder_or_stub_signal");
  if (generic) flags.add("generic_or_filler_language");
  if (input.duplicate) flags.add("exact_or_near_duplicate_text");
  if (!input.hasReferences) flags.add("missing_reference_signal");
  if (!evidenceSignal(input.text)) flags.add("weak_evidence_signal");
  if (!input.hasExamMetadata) flags.add("missing_exam_or_topic_mapping");
  if (!input.hasDifficulty) flags.add("missing_difficulty_or_calibration_signal");
  if (!input.hasTeaching) flags.add("weak_teaching_explanation");
  if (input.hasDistractorTeaching === false) flags.add("weak_or_missing_distractor_teaching");
  if (input.hasCorrectAnswer === false) flags.add("ambiguous_or_missing_correct_answer");
  if (input.answerKeyRisk) flags.add("answer_key_consistency_risk");
  if (input.outdated) flags.add("outdated_or_review_due");
  if (input.wordCount < 80) flags.add("thin_content");

  const clinicalAccuracy = clamp(
    100 -
      (placeholder ? 35 : 0) -
      (!input.hasReferences ? 18 : 0) -
      (!evidenceSignal(input.text) ? 10 : 0) -
      (input.answerKeyRisk ? 30 : 0) -
      (input.outdated ? 10 : 0),
  );
  const examRelevance = clamp(100 - (!input.hasExamMetadata ? 35 : 0) - (generic ? 15 : 0) - (input.wordCount < 80 ? 10 : 0));
  const educationalValue = clamp(100 - (!input.hasTeaching ? 30 : 0) - (input.hasDistractorTeaching === false ? 20 : 0) - (generic ? 20 : 0) - (input.wordCount < 80 ? 15 : 0));
  const difficultyCalibration = clamp(100 - (!input.hasDifficulty ? 35 : 0) - (input.hasCorrectAnswer === false ? 20 : 0));
  const writingQuality = clamp(100 - (placeholder ? 40 : 0) - (generic ? 25 : 0) - (input.wordCount < 80 ? 20 : 0));
  const uniqueness = clamp(100 - (input.duplicate ? 55 : 0));
  const contentQuality = (clinicalAccuracy + examRelevance + educationalValue + difficultyCalibration + writingQuality + uniqueness) / 6;
  const grade = gradeFor(contentQuality);

  return {
    assetType: input.assetType,
    id: input.id,
    pathway: input.pathway,
    title: input.title,
    grade,
    revisionRequired: grade === "A+" || grade === "A" || grade === "B" ? "no" : "yes",
    clinicalAccuracy,
    examRelevance,
    educationalValue,
    difficultyCalibration,
    writingQuality,
    uniqueness,
    flags: [...flags].sort(),
  };
}

function summarize(rows: Finding[]): SurfaceSummary {
  const count = rows.length;
  const gradeCounts: Record<string, number> = { "A+": 0, A: 0, B: 0, C: 0, D: 0 };
  for (const row of rows) gradeCounts[row.grade] = (gradeCounts[row.grade] ?? 0) + 1;
  const flagCount = (flag: string) => rows.filter((row) => row.flags.includes(flag)).length;
  const avg = (selector: (row: Finding) => number) => (count ? rows.reduce((sum, row) => sum + selector(row), 0) / count : 0);
  return {
    count,
    gradeCounts,
    revisionRequired: rows.filter((row) => row.revisionRequired === "yes").length,
    placeholder: flagCount("placeholder_or_stub_signal"),
    generic: flagCount("generic_or_filler_language"),
    duplicate: flagCount("exact_or_near_duplicate_text"),
    missingReferences: flagCount("missing_reference_signal"),
    weakEvidence: flagCount("weak_evidence_signal"),
    weakDistractors: flagCount("weak_or_missing_distractor_teaching"),
    ambiguousOrMissingAnswer: flagCount("ambiguous_or_missing_correct_answer"),
    answerKeyRisk: flagCount("answer_key_consistency_risk"),
    averageScores: {
      contentQuality: Number(avg((row) => (row.clinicalAccuracy + row.examRelevance + row.educationalValue + row.difficultyCalibration + row.writingQuality + row.uniqueness) / 6).toFixed(1)),
      clinicalAccuracy: Number(avg((row) => row.clinicalAccuracy).toFixed(1)),
      duplication: Number(avg((row) => row.uniqueness).toFixed(1)),
      examReadiness: Number(avg((row) => (row.examRelevance + row.educationalValue + row.difficultyCalibration) / 3).toFixed(1)),
    },
  };
}

function csvEscape(value: string | number): string {
  const raw = String(value);
  if (!/[",\n]/.test(raw)) return raw;
  return `"${raw.replace(/"/g, '""')}"`;
}

async function main(): Promise<void> {
  await fs.mkdir(reportDir, { recursive: true });
  await fs.mkdir(dataDir, { recursive: true });

  const questionRows = await prisma.examQuestion.findMany({
    where: { status: { equals: "published", mode: "insensitive" } },
    select: {
      id: true,
      exam: true,
      tier: true,
      careerType: true,
      questionType: true,
      questionFormat: true,
      stem: true,
      options: true,
      correctAnswer: true,
      rationale: true,
      difficulty: true,
      bodySystem: true,
      topic: true,
      distractorRationales: true,
      incorrectAnswerRationale: true,
      clinicalReasoning: true,
      examStrategy: true,
      clinicalTrap: true,
      keyTakeaway: true,
      referenceSource: true,
      qualityScore: true,
      cognitiveLevel: true,
      clinicalPearl: true,
    },
  });

  const questionHashCounts = new Map<string, number>();
  for (const row of questionRows) {
    const key = normalize(row.stem).slice(0, 220);
    questionHashCounts.set(key, (questionHashCounts.get(key) ?? 0) + 1);
  }

  const questions = questionRows.map((row) => {
    const options = Array.isArray(row.options) ? row.options : [];
    const hasDistractorTeaching =
      (Array.isArray(row.distractorRationales) && row.distractorRationales.length >= Math.max(1, options.length - 1)) ||
      (Array.isArray(row.incorrectAnswerRationale) && row.incorrectAnswerRationale.length >= Math.max(1, options.length - 1));
    const correctAnswer = row.correctAnswer;
    const hasCorrectAnswer =
      correctAnswer != null &&
      !(Array.isArray(correctAnswer) && correctAnswer.length === 0) &&
      !(typeof correctAnswer === "string" && correctAnswer.trim().length === 0);
    const answerKeyRisk = !hasCorrectAnswer || (options.length > 0 && typeof correctAnswer === "string" && !JSON.stringify(options).includes(correctAnswer));
    const text = [row.stem, row.rationale, row.clinicalReasoning, row.examStrategy, row.clinicalTrap, row.keyTakeaway, row.clinicalPearl].filter(Boolean).join("\n");
    return scoreFinding({
      assetType: "question",
      id: row.id,
      pathway: pathwayFromQuestion(row),
      title: row.topic ?? row.bodySystem ?? row.exam,
      text,
      wordCount: words(text),
      duplicate: (questionHashCounts.get(normalize(row.stem).slice(0, 220)) ?? 0) > 1,
      hasReferences: Boolean(row.referenceSource?.trim()),
      hasExamMetadata: Boolean(row.exam && row.tier && (row.topic || row.bodySystem)),
      hasDifficulty: typeof row.difficulty === "number" && row.difficulty >= 1 && row.difficulty <= 5 && Boolean(row.cognitiveLevel),
      hasTeaching: Boolean((row.rationale && row.rationale.length >= 180) || row.clinicalReasoning || row.keyTakeaway),
      hasDistractorTeaching,
      hasCorrectAnswer,
      answerKeyRisk,
      extraFlags: row.qualityScore != null && row.qualityScore < 80 ? ["low_quality_score"] : [],
    });
  });

  const flashcardRows = await prisma.flashcard.findMany({
    where: { status: "PUBLISHED" },
    select: {
      id: true,
      front: true,
      back: true,
      country: true,
      tier: true,
      examFamily: true,
      questionStem: true,
      answerOptions: true,
      correctAnswer: true,
      rationaleCorrect: true,
      rationaleIncorrect: true,
      updatedAt: true,
    },
  });
  const flashcardHashCounts = new Map<string, number>();
  for (const row of flashcardRows) {
    const key = normalize(`${row.front} ${row.back}`).slice(0, 220);
    flashcardHashCounts.set(key, (flashcardHashCounts.get(key) ?? 0) + 1);
  }
  const flashcards = flashcardRows.map((row) => {
    const text = [row.front, row.back, row.questionStem, row.rationaleCorrect, JSON.stringify(row.rationaleIncorrect ?? "")].filter(Boolean).join("\n");
    const pathway = pathwayFromText(`${row.examFamily} ${row.tier} ${text}`, String(row.tier));
    const hasExamItem = Boolean(row.questionStem || row.answerOptions || row.correctAnswer);
    return scoreFinding({
      assetType: "flashcard",
      id: row.id,
      pathway,
      title: row.front.slice(0, 90),
      text,
      wordCount: words(text),
      duplicate: (flashcardHashCounts.get(normalize(`${row.front} ${row.back}`).slice(0, 220)) ?? 0) > 1,
      hasReferences: evidenceSignal(text),
      hasExamMetadata: Boolean(row.country && row.tier && row.examFamily),
      hasDifficulty: hasExamItem ? Boolean(row.correctAnswer) : true,
      hasTeaching: words(row.back) >= 12 || Boolean(row.rationaleCorrect),
      hasDistractorTeaching: hasExamItem ? Array.isArray(row.rationaleIncorrect) && row.rationaleIncorrect.length > 0 : undefined,
      hasCorrectAnswer: hasExamItem ? Boolean(row.correctAnswer) : undefined,
    });
  });

  const lessonRows = await prisma.pathwayLesson.findMany({
    where: { status: "PUBLISHED" },
    select: {
      id: true,
      pathwayId: true,
      slug: true,
      title: true,
      topic: true,
      bodySystem: true,
      sections: true,
      structuralPublicComplete: true,
      updatedAt: true,
      alliedProfessionKey: true,
    },
  });
  const lessonHashCounts = new Map<string, number>();
  for (const row of lessonRows) {
    const text = JSON.stringify(row.sections ?? []);
    const key = normalize(`${row.title} ${text}`).slice(0, 220);
    lessonHashCounts.set(key, (lessonHashCounts.get(key) ?? 0) + 1);
  }
  const lessons = lessonRows.map((row) => {
    const text = [row.title, row.topic, row.bodySystem, JSON.stringify(row.sections ?? [])].join("\n");
    const pathway = row.alliedProfessionKey
      ? pathwayFromText(row.alliedProfessionKey, row.alliedProfessionKey)
      : pathwayFromText(row.pathwayId, row.pathwayId.includes("rpn") ? "RPN" : row.pathwayId.includes("pn") ? "PN" : row.pathwayId.includes("np") ? "NP" : "RN");
    return scoreFinding({
      assetType: "lesson",
      id: row.id,
      pathway,
      title: row.title,
      text,
      wordCount: words(text),
      duplicate: (lessonHashCounts.get(normalize(`${row.title} ${JSON.stringify(row.sections ?? [])}`).slice(0, 220)) ?? 0) > 1,
      hasReferences: evidenceSignal(text),
      hasExamMetadata: Boolean(row.pathwayId && row.topic && row.bodySystem),
      hasDifficulty: true,
      hasTeaching: row.structuralPublicComplete && words(text) >= 400,
      extraFlags: row.structuralPublicComplete ? [] : ["incomplete_lesson_structure"],
    });
  });

  const blogRows = await prisma.blogPost.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      body: true,
      postStatus: true,
      exam: true,
      careerSlug: true,
      category: true,
      tags: true,
      seoTitle: true,
      seoDescription: true,
      apaReferences: true,
      sourcesJson: true,
      requiresReferences: true,
      lastReviewedAt: true,
      reviewDueAt: true,
      updatedAt: true,
    },
  });
  const blogHashCounts = new Map<string, number>();
  for (const row of blogRows) {
    const key = normalize(`${row.title} ${row.body}`).slice(0, 220);
    blogHashCounts.set(key, (blogHashCounts.get(key) ?? 0) + 1);
  }
  const blogs = blogRows.map((row) => {
    const text = [row.title, row.excerpt, row.body, row.seoTitle, row.seoDescription, row.category, row.tags.join(" ")].filter(Boolean).join("\n");
    const references =
      row.apaReferences.length > 0 ||
      (Array.isArray(row.sourcesJson) && row.sourcesJson.length > 0) ||
      (row.sourcesJson != null && typeof row.sourcesJson === "object" && Object.keys(row.sourcesJson).length > 0);
    return scoreFinding({
      assetType: "blog_article",
      id: row.id,
      pathway: pathwayFromText(`${row.exam ?? ""} ${row.careerSlug ?? ""} ${row.category ?? ""} ${row.tags.join(" ")} ${row.title}`, row.careerSlug ?? row.exam ?? "Unclassified"),
      title: row.title,
      text,
      wordCount: words(row.body),
      duplicate: (blogHashCounts.get(normalize(`${row.title} ${row.body}`).slice(0, 220)) ?? 0) > 1,
      hasReferences: references || !row.requiresReferences,
      hasExamMetadata: Boolean(row.exam || row.careerSlug || row.category || row.tags.length),
      hasDifficulty: true,
      hasTeaching: words(row.body) >= 600 && Boolean(row.seoTitle && row.seoDescription),
      outdated: Boolean(row.reviewDueAt && row.reviewDueAt < new Date()),
      extraFlags: row.postStatus !== "PUBLISHED" ? [`not_published_${row.postStatus}`] : [],
    });
  });

  const localizedRows = await prisma.localizedBlogArticle.findMany({
    select: {
      id: true,
      locale: true,
      region: true,
      profession: true,
      exam: true,
      contentStatus: true,
      localizedTitle: true,
      localizedExcerpt: true,
      localizedBody: true,
      localizedMetaTitle: true,
      localizedMetaDescription: true,
      medicalReviewRequired: true,
      editorialReviewRequired: true,
      reviewFlags: true,
    },
  });
  const localizedBlogs = localizedRows.map((row) => {
    const text = [row.localizedTitle, row.localizedExcerpt, row.localizedBody, row.localizedMetaTitle, row.localizedMetaDescription].filter(Boolean).join("\n");
    return scoreFinding({
      assetType: "localized_blog_article",
      id: row.id,
      pathway: pathwayFromText(`${row.profession ?? ""} ${row.exam ?? ""} ${text}`, row.profession ?? row.exam ?? "Unclassified"),
      title: row.localizedTitle,
      text,
      wordCount: words(row.localizedBody),
      duplicate: false,
      hasReferences: !row.medicalReviewRequired || evidenceSignal(text),
      hasExamMetadata: Boolean(row.locale && row.region && (row.profession || row.exam)),
      hasDifficulty: true,
      hasTeaching: words(row.localizedBody) >= 500 && Boolean(row.localizedMetaTitle && row.localizedMetaDescription),
      extraFlags: row.contentStatus !== "PUBLISHED" ? [`not_published_${row.contentStatus}`] : row.reviewFlags,
    });
  });

  const contentItems = await prisma.contentItem.findMany({
    where: { type: { in: ["article", "blog", "guide", "lesson"] } },
    select: {
      id: true,
      title: true,
      slug: true,
      type: true,
      category: true,
      bodySystem: true,
      tier: true,
      status: true,
      summary: true,
      content: true,
      seoTitle: true,
      seoDescription: true,
      clinicalSafetyReview: true,
    },
  });
  const content = contentItems.map((row) => {
    const text = [row.title, row.summary, JSON.stringify(row.content ?? []), row.seoTitle, row.seoDescription].filter(Boolean).join("\n");
    return scoreFinding({
      assetType: `content_item_${row.type}`,
      id: row.id,
      pathway: pathwayFromText(`${row.tier ?? ""} ${row.category ?? ""} ${row.bodySystem ?? ""} ${text}`, row.tier ?? "Unclassified"),
      title: row.title,
      text,
      wordCount: words(text),
      duplicate: false,
      hasReferences: row.clinicalSafetyReview || evidenceSignal(text),
      hasExamMetadata: Boolean(row.category || row.bodySystem || row.tier),
      hasDifficulty: true,
      hasTeaching: words(text) >= 300,
      extraFlags: row.status !== "published" ? [`not_published_${row.status ?? "unknown"}`] : [],
    });
  });

  const caseRows = await prisma.masteryCaseScenario.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      scenario: true,
      rationale: true,
      modalityData: true,
      actionLayer: true,
      isPublic: true,
      adminPreviewOnly: true,
      module: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
  });
  const cases = caseRows.map((row) => {
    const text = [row.title, row.rationale, JSON.stringify(row.scenario ?? {}), JSON.stringify(row.modalityData ?? {}), JSON.stringify(row.actionLayer ?? {})]
      .filter(Boolean)
      .join("\n");
    return scoreFinding({
      assetType: "case_study",
      id: row.id,
      pathway: pathwayFromText(`${row.module.title} ${row.module.slug} ${text}`, "Clinical Reasoning"),
      title: row.title,
      text,
      wordCount: words(text),
      duplicate: false,
      hasReferences: evidenceSignal(text),
      hasExamMetadata: Boolean(row.module.title || row.module.slug),
      hasDifficulty: true,
      hasTeaching: words(text) >= 250 && Boolean(row.rationale),
      extraFlags: row.isPublic && !row.adminPreviewOnly ? [] : ["not_public_or_admin_preview"],
    });
  });

  const all = [...questions, ...flashcards, ...lessons, ...blogs, ...localizedBlogs, ...content, ...cases];
  const bySurface = {
    questions: summarize(questions),
    flashcards: summarize(flashcards),
    pathwayLessons: summarize(lessons),
    blogArticles: summarize(blogs),
    localizedBlogArticles: summarize(localizedBlogs),
    contentItems: summarize(content),
    caseStudies: summarize(cases),
    all: summarize(all),
  };

  const byPathway = Object.fromEntries(
    [...new Set([...targetPathways, ...all.map((row) => row.pathway)])].sort().map((pathway) => [pathway, summarize(all.filter((row) => row.pathway === pathway))]),
  );

  const findings = all.filter((row) => row.revisionRequired === "yes" || row.flags.length > 0);
  const csv = [
    ["assetType", "id", "pathway", "title", "grade", "revisionRequired", "clinicalAccuracy", "examRelevance", "educationalValue", "difficultyCalibration", "writingQuality", "uniqueness", "flags"].join(","),
    ...findings.map((row) =>
      [
        row.assetType,
        row.id,
        row.pathway,
        row.title,
        row.grade,
        row.revisionRequired,
        row.clinicalAccuracy,
        row.examRelevance,
        row.educationalValue,
        row.difficultyCalibration,
        row.writingQuality,
        row.uniqueness,
        row.flags.join(";"),
      ]
        .map(csvEscape)
        .join(","),
    ),
  ].join("\n");

  const jsonPath = path.join(dataDir, "comprehensive-educational-content-quality-audit.json");
  const csvPath = path.join(dataDir, "comprehensive-educational-content-quality-findings.csv");
  await fs.writeFile(jsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), bySurface, byPathway }, null, 2), "utf8");
  await fs.writeFile(csvPath, csv, "utf8");

  const surfaceRows = Object.entries(bySurface)
    .filter(([key]) => key !== "all")
    .map(
      ([surface, summary]) =>
        `| ${surface} | ${summary.count.toLocaleString()} | ${summary.revisionRequired.toLocaleString()} | ${summary.averageScores.contentQuality} | ${summary.averageScores.clinicalAccuracy} | ${summary.averageScores.duplication} | ${summary.averageScores.examReadiness} | ${summary.gradeCounts["A+"]} / ${summary.gradeCounts.A} / ${summary.gradeCounts.B} / ${summary.gradeCounts.C} / ${summary.gradeCounts.D} |`,
    )
    .join("\n");
  const pathwayRows = targetPathways
    .map((pathway) => {
      const summary = byPathway[pathway] ?? summarize([]);
      return `| ${pathway} | ${summary.count.toLocaleString()} | ${summary.revisionRequired.toLocaleString()} | ${summary.averageScores.contentQuality} | ${summary.averageScores.clinicalAccuracy} | ${summary.averageScores.duplication} | ${summary.averageScores.examReadiness} |`;
    })
    .join("\n");
  const topFlags = [
    ["Missing references", bySurface.all.missingReferences],
    ["Weak evidence signal", bySurface.all.weakEvidence],
    ["Weak distractor teaching", bySurface.all.weakDistractors],
    ["Duplicate / near-duplicate", bySurface.all.duplicate],
    ["Generic / filler language", bySurface.all.generic],
    ["Placeholder / stub signal", bySurface.all.placeholder],
    ["Ambiguous or missing answer", bySurface.all.ambiguousOrMissingAnswer],
    ["Answer-key consistency risk", bySurface.all.answerKeyRisk],
  ]
    .map(([label, count]) => `| ${label} | ${Number(count).toLocaleString()} |`)
    .join("\n");

  const md = `# Comprehensive Educational Content Quality Audit

Generated: ${new Date().toISOString()}

## Scope

This read-only audit scored database-backed questions, flashcards, pathway lessons, blog articles, localized blog articles, legacy content items, and mastery case study scenarios across the requested nursing and allied-health pathways.

Clinical accuracy, answer-key accuracy, and outdated-practice findings are heuristic risk signals. They identify records needing review; they are not a substitute for human clinical SME validation.

## Executive Scores

- Content Quality Score: ${bySurface.all.averageScores.contentQuality}/100
- Clinical Accuracy Score: ${bySurface.all.averageScores.clinicalAccuracy}/100
- Duplication Score: ${bySurface.all.averageScores.duplication}/100
- Exam Readiness Score: ${bySurface.all.averageScores.examReadiness}/100
- Total assets scored: ${bySurface.all.count.toLocaleString()}
- Assets requiring revision: ${bySurface.all.revisionRequired.toLocaleString()}

## Surface Summary

| Surface | Assets | Require Revision | Content Quality | Clinical Accuracy | Duplication | Exam Readiness | A+ / A / B / C / D |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
${surfaceRows}

## Requested Pathway Summary

| Pathway | Assets | Require Revision | Content Quality | Clinical Accuracy | Duplication | Exam Readiness |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
${pathwayRows}

## Primary Quality Risks

| Risk | Count |
| --- | ---: |
${topFlags}

## Interpretation

The largest quality gap is not raw content volume. It is educational depth: many published questions have valid stems and answers but lack per-distractor teaching, explicit clinical reasoning, exam strategy, or reference-backed rationale structure.

Flashcards are comparatively clean in the sampled DB-backed flashcard audit, but this consolidated heuristic audit still flags cards that lack explicit evidence signals or exam-style calibration metadata.

The strict lesson governance gate separately reports a full review backlog because it expects newer validator signals across catalog lessons. Treat that as a governance backlog, while the meaningful-content gate shows most core RN/RPN/PN/NP lessons contain substantive instructional material.

## Evidence Artifacts

- JSON summary: \`${path.relative(repoRoot, jsonPath)}\`
- CSV findings: \`${path.relative(repoRoot, csvPath)}\`
- Question inventory: \`reports/question-inventory-us-rn-nclex-rn.json\`
- Rationale quality audit: \`reports/content-quality/question-flashcard-rationale-audit.json\`
- Rationale markdown report: \`docs/question-flashcard-rationale-quality-audit.md\`
- Lesson governance dashboard: \`docs/reports/clinical-content-quality/content-quality-dashboard.md\`
- Meaningful lesson audit: \`reports/meaningful-clinical-content-audit.json\`

## Built-In Audit Notes

- The built-in blog audit commands currently fail before query execution because \`src/lib/db/blog-audit-env-load.ts\` resolves \`./env-bootstrap.ts.ts\` through a TSX data URL. This report used direct Prisma reads instead.
- Existing exam-bank audit scanned 72,828 published questions and found 22,840 shallow rationales, 67,193 without distractor teaching, and 72,828 with weak clinical reasoning signal under its enrichment rules.
- Existing rationale-like field audit scanned 514 source fields and found 2 critical records, 2 reused records, 432 needing review, and 82 high-quality fields.
- The DB-backed mastery case study table currently returned 0 rows, so case-study content appears to live inside lessons/questions/static source assets rather than as standalone published case scenario rows.

## Next Remediation Priorities

1. Add per-distractor rationales and clinical reasoning to high-traffic RN/RPN/PN/NP question banks.
2. Backfill reference sources and last-reviewed metadata for clinical and pharmacology content.
3. De-duplicate repeated stems, repeated flashcard fronts, and recycled clinical pearl language.
4. SME-review answer-key risk rows in the CSV before any automated rewriting.
5. Repair the built-in blog audit env-loader bug so blog governance can run in CI.
`;

  const mdPath = path.join(reportDir, "comprehensive-educational-content-quality-audit.md");
  await fs.writeFile(mdPath, md, "utf8");
  console.info(`[content-quality] Wrote ${mdPath}`);
  console.info(`[content-quality] Wrote ${jsonPath}`);
  console.info(`[content-quality] Wrote ${csvPath}`);
  console.info(`[content-quality] Total assets=${bySurface.all.count} revisionRequired=${bySurface.all.revisionRequired}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
