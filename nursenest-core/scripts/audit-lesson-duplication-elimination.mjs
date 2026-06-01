#!/usr/bin/env node
/**
 * Read-only lesson duplication audit.
 *
 * Scans bundled lesson catalogs plus live PathwayLesson rows when DATABASE_URL
 * is available. Produces a Markdown report and CSV with every finding.
 */
import fs from "node:fs/promises";
import fssync from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const repoRoot = process.cwd();
const reportPath = path.join(repoRoot, "lesson-duplication-audit.md");
const reportsDir = path.join(repoRoot, "reports");
const csvPath = path.join(reportsDir, "lesson-duplication-audit-findings.csv");
const jsonPath = path.join(reportsDir, "lesson-duplication-audit.json");

const GENERIC_PATTERNS = [
  "requires early recognition",
  "careful trend assessment",
  "rapid prioritization",
  "connect pathophysiology to bedside findings",
  "monitor for deterioration",
  "use clinical judgment",
  "focus on ABCs",
  "clinical judgment",
  "prioritize airway breathing circulation",
  "communicate with the provider",
  "escalate care",
];

const STUDY_ACTION_COMPONENTS = [
  "ContinueLearningSection",
  "PathwayLessonActions",
  "PathwayLessonRemediationChain",
  "PathwayLessonDetailDeferred",
  "AutomaticRelatedContentForPublic",
  "MarketingStudyCrossLinks",
  "PathwayLessonTopicSiblingsStrip",
  "data-nn-premium-lessons-linked-learning",
];

function normalizeText(value) {
  return String(value ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/[^a-z0-9]+/gi, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(value) {
  return normalizeText(value).split(" ").filter(Boolean).length;
}

function csvEscape(value) {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function compact(value, max = 120) {
  const s = String(value ?? "").replace(/\s+/g, " ").trim();
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

async function walkFiles(dir, predicate, out = []) {
  if (!fssync.existsSync(dir)) return out;
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walkFiles(full, predicate, out);
    else if (entry.isFile() && predicate(full)) out.push(full);
  }
  return out;
}

function readObjectText(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(readObjectText).filter(Boolean).join("\n\n");
  if (value && typeof value === "object") {
    return ["body", "text", "content", "markdown", "html", "rationale", "summary"]
      .map((key) => readObjectText(value[key]))
      .filter(Boolean)
      .join("\n\n");
  }
  return "";
}

function extractSections(lesson) {
  const candidates = [lesson.sections, lesson.content, lesson.contentBlocks, lesson.blocks].filter(Array.isArray);
  const sections = candidates[0] ?? [];
  return sections.map((section, index) => ({
    index,
    heading: String(section?.heading ?? section?.title ?? section?.sectionTitle ?? section?.kind ?? `Section ${index + 1}`),
    kind: String(section?.kind ?? ""),
    body: readObjectText(section),
  }));
}

function isLessonLike(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const hasIdentity = typeof value.slug === "string" && typeof value.title === "string";
  const hasLessonSections = [value.sections, value.content, value.contentBlocks, value.blocks].some(Array.isArray);
  return hasIdentity && hasLessonSections;
}

function visitLessons(root, source, visitor) {
  const seen = new WeakSet();
  function walk(value, location, pathwayId = "") {
    if (!value || typeof value !== "object") return;
    if (seen.has(value)) return;
    seen.add(value);

    if (isLessonLike(value)) {
      visitor(value, source, location, pathwayId || String(value.pathwayId ?? value.pathway ?? ""));
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => walk(item, `${location}[${index}]`, pathwayId));
      return;
    }

    if (value.pathways && typeof value.pathways === "object") {
      for (const [id, raw] of Object.entries(value.pathways)) {
        if (Array.isArray(raw)) raw.forEach((item, index) => walk(item, `${location}.pathways.${id}[${index}]`, id));
        else walk(raw?.lessons ?? raw, `${location}.pathways.${id}.lessons`, id);
      }
    }

    for (const [key, child] of Object.entries(value)) {
      if (key === "sections" || key === "content" || key === "contentBlocks" || key === "blocks" || key === "pathways") continue;
      walk(child, `${location}.${key}`, pathwayId);
    }
  }
  walk(root, "$root");
}

async function loadLocalLessons() {
  const files = [
    ...(await walkFiles(path.join(repoRoot, "src", "content", "pathway-lessons"), (file) => file.endsWith(".json"))),
    path.join(repoRoot, "src", "content", "lessons", "lesson-library.json"),
  ].filter((file, index, arr) => fssync.existsSync(file) && arr.indexOf(file) === index);

  const lessons = [];
  for (const file of files) {
    try {
      const root = JSON.parse(await fs.readFile(file, "utf8"));
      visitLessons(root, path.relative(repoRoot, file), (lesson, source, location, pathwayId) => {
        lessons.push({
          id: `${source}:${pathwayId}:${lesson.slug}`,
          source,
          location,
          pathwayId,
          slug: String(lesson.slug),
          title: String(lesson.title),
          topic: String(lesson.topic ?? ""),
          bodySystem: String(lesson.bodySystem ?? ""),
          sections: extractSections(lesson),
        });
      });
    } catch {
      // Ignore malformed non-lesson manifests; this audit reports parseable lesson records.
    }
  }
  return lessons;
}

async function loadDbLessons() {
  if (!process.env.DATABASE_URL) return { lessons: [], error: "DATABASE_URL not set" };
  try {
    const mod = await import("@prisma/client");
    const prisma = new mod.PrismaClient();
    try {
      const rows = await prisma.pathwayLesson.findMany({
        where: { status: "PUBLISHED", deprecatedAt: null },
        orderBy: [{ pathwayId: "asc" }, { sortOrder: "asc" }],
        select: {
          id: true,
          pathwayId: true,
          slug: true,
          title: true,
          topic: true,
          bodySystem: true,
          sections: true,
          updatedAt: true,
        },
      });
      return {
        lessons: rows.map((row) => ({
          id: `db:${row.id}`,
          source: "database:pathway_lessons",
          location: `pathway_lessons.${row.id}`,
          pathwayId: row.pathwayId,
          slug: row.slug,
          title: row.title,
          topic: row.topic,
          bodySystem: row.bodySystem,
          sections: extractSections({ sections: Array.isArray(row.sections) ? row.sections : [] }),
          updatedAt: row.updatedAt?.toISOString?.() ?? null,
        })),
        error: null,
      };
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    return { lessons: [], error: error instanceof Error ? error.message : String(error) };
  }
}

function splitParagraphs(text) {
  return String(text ?? "")
    .replace(/\r/g, "")
    .split(/\n{2,}|(?<=\.)\s+(?=[A-Z])/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => wordCount(p) >= 12);
}

function sectionText(lesson) {
  return lesson.sections.map((section) => `${section.heading}\n${section.body}`).join("\n\n");
}

function buildParagraphIndex(lessons) {
  const index = new Map();
  for (const lesson of lessons) {
    for (const section of lesson.sections) {
      for (const paragraph of splitParagraphs(section.body)) {
        const key = normalizeText(paragraph);
        if (wordCount(key) < 12) continue;
        const list = index.get(key) ?? [];
        list.push({ lesson, section, paragraph });
        index.set(key, list);
      }
    }
  }
  return index;
}

function auditLessons(lessons) {
  const paragraphIndex = buildParagraphIndex(lessons);
  const repeatedParagraphs = new Map([...paragraphIndex.entries()].filter(([, hits]) => hits.length > 1));
  const findings = [];
  const lessonMetrics = [];

  for (const lesson of lessons) {
    const fullText = sectionText(lesson);
    const totalWords = Math.max(1, wordCount(fullText));
    let duplicateWords = 0;
    const seenParagraphs = new Set();

    const titleNorm = normalizeText(lesson.title);
    const headingCounts = new Map();
    for (const section of lesson.sections) {
      const headingNorm = normalizeText(section.heading);
      headingCounts.set(headingNorm, (headingCounts.get(headingNorm) ?? 0) + 1);

      if (headingNorm && headingNorm === titleNorm) {
        findings.push({
          type: "duplicate_title_as_section_heading",
          component: "Lesson section renderer",
          location: `${lesson.source} :: ${lesson.pathwayId}/${lesson.slug} :: section ${section.index + 1}`,
          duplicateOf: `Lesson title "${lesson.title}"`,
          recommendation: "Remove the section heading or replace it with a disease-specific section heading.",
          severity: "high",
          lesson,
          snippet: section.heading,
        });
      }

      const bodyNorm = normalizeText(section.body);
      if (headingNorm && bodyNorm.startsWith(headingNorm)) {
        findings.push({
          type: "section_heading_repeated_in_body",
          component: "PathwayLessonSectionContent",
          location: `${lesson.source} :: ${lesson.pathwayId}/${lesson.slug} :: ${section.heading}`,
          duplicateOf: `Section heading "${section.heading}"`,
          recommendation: "Strip the repeated heading from the body before render or clean the source content.",
          severity: "medium",
          lesson,
          snippet: compact(section.body),
        });
      }

      if (titleNorm && bodyNorm.startsWith(titleNorm)) {
        findings.push({
          type: "lesson_title_repeated_in_body",
          component: "PathwayLessonSectionContent",
          location: `${lesson.source} :: ${lesson.pathwayId}/${lesson.slug} :: ${section.heading}`,
          duplicateOf: `Lesson title "${lesson.title}"`,
          recommendation: "Remove the repeated lesson title from section body text.",
          severity: "medium",
          lesson,
          snippet: compact(section.body),
        });
      }

      for (const paragraph of splitParagraphs(section.body)) {
        const key = normalizeText(paragraph);
        if (seenParagraphs.has(key)) {
          duplicateWords += wordCount(paragraph);
          findings.push({
            type: "repeated_paragraph_within_lesson",
            component: "Lesson content source",
            location: `${lesson.source} :: ${lesson.pathwayId}/${lesson.slug} :: ${section.heading}`,
            duplicateOf: "Earlier paragraph in the same lesson",
            recommendation: "Delete the repeated paragraph or replace it with disease-specific clinical detail.",
            severity: "high",
            lesson,
            snippet: compact(paragraph),
          });
        }
        seenParagraphs.add(key);

        const crossHits = repeatedParagraphs.get(key) ?? [];
        if (crossHits.length > 1) {
          duplicateWords += wordCount(paragraph);
        }
      }
    }

    for (const [headingNorm, count] of headingCounts.entries()) {
      if (headingNorm && count > 1) {
        findings.push({
          type: "duplicate_section_heading",
          component: "Lesson section renderer",
          location: `${lesson.source} :: ${lesson.pathwayId}/${lesson.slug}`,
          duplicateOf: `Same heading rendered ${count} times`,
          recommendation: "Keep one section title; merge or rename duplicate sections.",
          severity: "high",
          lesson,
          snippet: headingNorm,
        });
      }
    }

    for (const phrase of GENERIC_PATTERNS) {
      const matches = fullText.toLowerCase().split(phrase).length - 1;
      if (matches > 1) {
        findings.push({
          type: "repeated_generic_nursing_advice",
          component: "Lesson content source",
          location: `${lesson.source} :: ${lesson.pathwayId}/${lesson.slug}`,
          duplicateOf: `Generic phrase repeated ${matches} times`,
          recommendation: "Replace repeated generic advice with disease-specific assessment, diagnostics, complications, or NCLEX traps.",
          severity: "medium",
          lesson,
          snippet: phrase,
        });
      }
    }

    const duplicatePct = Math.min(100, Math.round((duplicateWords / totalWords) * 100));
    lessonMetrics.push({
      source: lesson.source,
      pathwayId: lesson.pathwayId,
      slug: lesson.slug,
      title: lesson.title,
      wordCount: totalWords,
      duplicatePct,
      uniquePct: 100 - duplicatePct,
      findingCount: findings.filter((f) => f.lesson.id === lesson.id).length,
    });
  }

  for (const [key, hits] of repeatedParagraphs) {
    if (hits.length < 2) continue;
    const sample = hits[0];
    const locations = hits.slice(0, 6).map((hit) => `${hit.lesson.pathwayId}/${hit.lesson.slug} (${hit.section.heading})`).join("; ");
    findings.push({
      type: "paragraph_reused_across_lessons",
      component: "Lesson content source",
      location: locations,
      duplicateOf: `Same paragraph appears in ${hits.length} lesson sections`,
      recommendation: "Keep only if intentionally shared; otherwise rewrite with pathway/topic-specific clinical detail.",
      severity: hits.length >= 5 ? "high" : "medium",
      lesson: sample.lesson,
      snippet: compact(sample.paragraph),
    });
  }

  return { findings, lessonMetrics };
}

async function auditStaticLessonPage() {
  const page = "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx";
  const full = path.join(repoRoot, page);
  if (!fssync.existsSync(full)) return [];
  const text = await fs.readFile(full, "utf8");
  const lines = text.split("\n");
  const locations = [];
  for (const token of STUDY_ACTION_COMPONENTS) {
    lines.forEach((line, index) => {
      if (line.includes(token)) locations.push({ token, line: index + 1, text: line.trim() });
    });
  }
  const findings = [];
  const relatedTokens = locations.filter((item) =>
    [
      "ContinueLearningSection",
      "PathwayLessonActions",
      "PathwayLessonRemediationChain",
      "PathwayLessonDetailDeferred",
      "AutomaticRelatedContentForPublic",
      "MarketingStudyCrossLinks",
      "PathwayLessonTopicSiblingsStrip",
      "data-nn-premium-lessons-linked-learning",
    ].includes(item.token),
  );
  if (relatedTokens.length > 3) {
    findings.push({
      type: "duplicate_related_or_study_blocks",
      component: "Marketing pathway lesson detail page",
      location: relatedTokens.map((item) => `${page}:${item.line} ${item.token}`).join(" | "),
      duplicateOf: "Continue/related/study action surfaces appear in several separate blocks",
      recommendation: "Consolidate into one Continue Your Learning section containing related lessons, flashcards, practice questions, CAT, and article links.",
      severity: "high",
      lesson: { source: page, pathwayId: "all", slug: "lesson-detail-template", title: "Lesson detail template" },
      snippet: relatedTokens.map((item) => item.token).join(", "),
    });
  }
  return findings;
}

function summarizeBy(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
}

function publicFinding(finding) {
  return {
    type: finding.type,
    severity: finding.severity,
    component: finding.component,
    location: finding.location,
    duplicateOf: finding.duplicateOf,
    recommendation: finding.recommendation,
    snippet: finding.snippet,
    lesson: finding.lesson
      ? {
          source: finding.lesson.source,
          pathwayId: finding.lesson.pathwayId,
          slug: finding.lesson.slug,
          title: finding.lesson.title,
        }
      : null,
  };
}

async function main() {
  await fs.mkdir(reportsDir, { recursive: true });
  const localLessons = await loadLocalLessons();
  const db = await loadDbLessons();
  const byId = new Map();
  for (const lesson of [...localLessons, ...db.lessons]) {
    const key = `${lesson.source}:${lesson.pathwayId}:${lesson.slug}`;
    if (!byId.has(key)) byId.set(key, lesson);
  }
  const lessons = [...byId.values()];
  const { findings: contentFindings, lessonMetrics } = auditLessons(lessons);
  const staticFindings = await auditStaticLessonPage();
  const findings = [...staticFindings, ...contentFindings].sort((a, b) => {
    const severityScore = { high: 3, medium: 2, low: 1 };
    return (severityScore[b.severity] ?? 0) - (severityScore[a.severity] ?? 0) || a.type.localeCompare(b.type);
  });

  const csvRows = [
    ["Type", "Severity", "Component", "Location", "Duplicate Of", "Recommendation", "Snippet"].join(","),
    ...findings.map((f) =>
      [f.type, f.severity, f.component, f.location, f.duplicateOf, f.recommendation, f.snippet].map(csvEscape).join(","),
    ),
  ];
  await fs.writeFile(csvPath, `${csvRows.join("\n")}\n`, "utf8");
  await fs.writeFile(
    jsonPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        lessonsScanned: lessons.length,
        dbError: db.error,
        findings: findings.map(publicFinding),
        lessonMetrics,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  const worstLessons = [...lessonMetrics]
    .filter((m) => m.findingCount > 0 || m.duplicatePct > 0)
    .sort((a, b) => b.findingCount - a.findingCount || b.duplicatePct - a.duplicatePct)
    .slice(0, 80);
  const typeSummary = summarizeBy(findings, (f) => f.type);
  const sourceSummary = summarizeBy(lessonMetrics, (m) => m.source).slice(0, 30);

  const md = [
    "# Lesson Duplication Audit",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Scope",
    "",
    `- Local bundled lessons scanned: ${localLessons.length}`,
    `- Database published pathway lessons scanned: ${db.lessons.length}${db.error ? ` (${db.error})` : ""}`,
    `- Total lesson records scanned: ${lessons.length}`,
    `- Total duplicate findings: ${findings.length}`,
    `- Full finding export: \`${path.relative(repoRoot, csvPath)}\``,
    `- Machine-readable metrics: \`${path.relative(repoRoot, jsonPath)}\``,
    "",
    "## Executive Findings",
    "",
    findings.length === 0
      ? "- No duplicate title, section, paragraph, study-action, or related-content patterns were detected by this audit."
      : "- Lesson duplication is concentrated in two areas: repeated lesson text inside source/catalog content and multiple related/study-action surfaces on the lesson detail template.",
    "- The current lesson detail template has a consolidation risk: Continue Your Learning, topic siblings, lesson actions, remediation, deferred related practice, automatic related content, SEO cross-links, and marketing study cross-links can all appear after the lesson body.",
    "- Content duplication should be fixed at source, not hidden in rendering, so section headings and disease-specific content remain intentional.",
    "",
    "## Findings By Type",
    "",
    "| Duplicate pattern | Count |",
    "| --- | ---: |",
    ...typeSummary.map(([type, count]) => `| ${type} | ${count} |`),
    "",
    "## Component-Level Duplicates",
    "",
    "| Component | Location | Duplicate Of | Recommendation |",
    "| --- | --- | --- | --- |",
    ...findings
      .filter((f) => f.type.includes("study") || f.type.includes("related") || f.type.includes("title") || f.type.includes("heading"))
      .slice(0, 80)
      .map((f) => `| ${f.component} | ${compact(f.location, 180).replace(/\|/g, "\\|")} | ${compact(f.duplicateOf, 120).replace(/\|/g, "\\|")} | ${compact(f.recommendation, 160).replace(/\|/g, "\\|")} |`),
    "",
    "## Worst Lesson Duplication Metrics",
    "",
    "| Source | Pathway | Slug | Words | Unique % | Duplicate % | Findings |",
    "| --- | --- | --- | ---: | ---: | ---: | ---: |",
    ...worstLessons.map((m) => `| ${m.source.replace(/\|/g, "\\|")} | ${m.pathwayId || "—"} | \`${m.slug}\` | ${m.wordCount} | ${m.uniquePct}% | ${m.duplicatePct}% | ${m.findingCount} |`),
    "",
    "## Source Coverage",
    "",
    "| Source | Lesson records |",
    "| --- | ---: |",
    ...sourceSummary.map(([source, count]) => `| ${String(source).replace(/\|/g, "\\|")} | ${count} |`),
    "",
    "## Recommendations",
    "",
    "1. Consolidate bottom-of-lesson related/study surfaces into one `Continue Your Learning` area.",
    "2. Ensure section renderers strip body-leading duplicate headings before display, then repair the source records.",
    "3. Merge duplicate same-heading sections in source catalogs and DB rows rather than hiding one in CSS.",
    "4. Rewrite repeated paragraphs with disease-specific physiology, assessment, diagnostics, interventions, complications, pharmacology, and NCLEX traps.",
    "5. Keep one lesson title, one metadata area, and one specialty/category display in each lesson template.",
    "",
    "## Full Findings",
    "",
    "The CSV export contains every duplicate found. The sample below shows the first 150 highest-severity findings.",
    "",
    "| Type | Severity | Component | Location | Duplicate Of | Recommendation |",
    "| --- | --- | --- | --- | --- | --- |",
    ...findings
      .slice(0, 150)
      .map((f) => `| ${f.type} | ${f.severity} | ${f.component} | ${compact(f.location, 140).replace(/\|/g, "\\|")} | ${compact(f.duplicateOf, 100).replace(/\|/g, "\\|")} | ${compact(f.recommendation, 140).replace(/\|/g, "\\|")} |`),
    "",
  ].join("\n");

  await fs.writeFile(reportPath, md, "utf8");
  console.log(`Wrote ${path.relative(repoRoot, reportPath)}`);
  console.log(`Wrote ${path.relative(repoRoot, csvPath)}`);
  console.log(`Findings: ${findings.length}; lessons scanned: ${lessons.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
