#!/usr/bin/env npx tsx
/**
 * SEO Recovery Phase 3: content quality, indexation, and authority pass.
 *
 * Read-only audit generator. If a Google Search Console export exists at
 * `data/gsc-indexing/crawled-not-indexed.csv`, rows are tagged as GSC-confirmed.
 * Without that export, reports use the local indexable corpus and mark index
 * status as "candidate / not in local GSC export".
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { listAuthorityClusterPages } from "@/lib/seo/authority-cluster-pages";
import { HEALTHCARE_TEST_BANK_PAGES } from "@/lib/seo/healthcare-test-bank-pages";
import { listNursingGlossaryTerms } from "@/lib/seo/nursing-glossary-registry";
import { getProgrammaticQuestionTopicPages } from "@/lib/seo/programmatic-question-topic-registry";

type ContentType =
  | "Lesson"
  | "Question Page"
  | "Glossary Page"
  | "Blog Article"
  | "Exam Landing Page"
  | "Condition Page";

type AuditRecord = {
  url: string;
  type: ContentType;
  title: string;
  wordCount: number;
  internalLinks: number;
  schemaPresent: boolean;
  canonical: string;
  indexStatus: string;
  qualityScore: number;
  riskFlags: string[];
  cluster: string;
  source: string;
};

type LessonRecord = AuditRecord & {
  sectionStatus: Record<string, boolean>;
};

const packageRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const reportDir = resolve(packageRoot, "docs/reports/seo-recovery-phase3");
const siteOrigin = "https://nursenest.ca";

const requiredLessonSections = [
  "Learning Objectives",
  "Clinical Relevance",
  "Pathophysiology",
  "Assessment",
  "Interventions",
  "Safety Considerations",
  "Clinical Pearls",
  "NCLEX/REx-PN Relevance",
  "Knowledge Check",
  "Related Lessons",
  "Further Reading",
] as const;

const topicClusters = [
  { key: "Cardiology", terms: ["cardiac", "heart", "ecg", "mi", "stemi", "dysrhythmia", "shock", "perfusion"] },
  { key: "Respiratory", terms: ["respiratory", "copd", "asthma", "oxygen", "ventilation", "abg", "pneumonia", "airway"] },
  { key: "Neurology", terms: ["neuro", "stroke", "seizure", "delirium", "intracranial", "gcs"] },
  { key: "Endocrine", terms: ["diabetes", "insulin", "dka", "thyroid", "endocrine", "glucose"] },
  { key: "Renal", terms: ["renal", "kidney", "fluid", "electrolyte", "potassium", "sodium", "dialysis"] },
  { key: "Mental Health", terms: ["mental", "psychiatric", "psych", "suicide", "depression", "anxiety"] },
  { key: "Maternal/Newborn", terms: ["maternal", "newborn", "postpartum", "pregnancy", "preeclampsia", "obstetric"] },
  { key: "Pediatrics", terms: ["pediatric", "child", "infant", "adolescent", "developmental"] },
  { key: "Leadership", terms: ["leadership", "delegation", "priority", "scope", "assignment", "communication"] },
  { key: "Pharmacology", terms: ["pharm", "medication", "drug", "antibiotic", "opioid", "anticoagulant", "insulin"] },
] as const;

function stripHtml(input: string): string {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(input: string): number {
  const text = stripHtml(input);
  if (!text) return 0;
  return text.split(/\s+/).filter((w) => /[a-z0-9]/i.test(w)).length;
}

function internalLinkCount(input: string): number {
  return [...input.matchAll(/href=["']\/(?!\/|app\/|admin\/|api\/)[^"']+["']/gi)].length;
}

function absolute(path: string): string {
  if (path.startsWith("http")) return path;
  return `${siteOrigin}${path.startsWith("/") ? path : `/${path}`}`;
}

function markdownTable(headers: string[], rows: (string | number)[][]): string {
  const esc = (value: string | number) => String(value).replace(/\|/g, "\\|").replace(/\n/g, " ");
  return [
    `| ${headers.map(esc).join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(esc).join(" | ")} |`),
  ].join("\n");
}

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  if (!raw.startsWith("---")) return { data: {}, body: raw };
  const end = raw.indexOf("\n---", 3);
  if (end < 0) return { data: {}, body: raw };
  const fm = raw.slice(3, end).trim();
  const body = raw.slice(end + 4);
  const data: Record<string, string> = {};
  for (const line of fm.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    data[match[1]!] = match[2]!.replace(/^["']|["']$/g, "").trim();
  }
  return { data, body };
}

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf8"));
}

function allFiles(root: string, extensions: string[]): string[] {
  const out: string[] = [];
  if (!existsSync(root)) return out;
  for (const name of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, name.name);
    if (name.isDirectory()) out.push(...allFiles(path, extensions));
    else if (extensions.includes(extname(name.name))) out.push(path);
  }
  return out;
}

function pathwayBase(pathwayId: string): string {
  const map: Record<string, string> = {
    "ca-rn-nclex-rn": "/canada/rn/nclex-rn",
    "us-rn-nclex-rn": "/us/rn/nclex-rn",
    "ca-rpn-rex-pn": "/canada/rpn/rex-pn",
    "us-lpn-nclex-pn": "/us/lpn/nclex-pn",
    "us-np-fnp": "/us/np/fnp",
    "ca-np-cnple": "/canada/np/cnple",
    "us-rn-new-grad-transition": "/us/rn/new-grad-transition",
    "ca-allied-core": "/allied/allied-health",
    "us-allied-core": "/allied/allied-health",
  };
  return map[pathwayId] ?? `/${pathwayId.replace(/-/g, "/")}`;
}

function classifyCluster(text: string): string {
  const lower = text.toLowerCase();
  let best = { key: "General", hits: 0 };
  for (const cluster of topicClusters) {
    const hits = cluster.terms.reduce((sum, term) => sum + (lower.includes(term) ? 1 : 0), 0);
    if (hits > best.hits) best = { key: cluster.key, hits };
  }
  return best.key;
}

function score(args: {
  type: ContentType;
  wordCount: number;
  internalLinks: number;
  schemaPresent: boolean;
  canonical: boolean;
  requiredHits?: number;
  duplicateRisk?: boolean;
  eeatHits?: number;
}): number {
  const wordTarget: Record<ContentType, number> = {
    Lesson: 950,
    "Question Page": 900,
    "Glossary Page": 350,
    "Blog Article": 1200,
    "Exam Landing Page": 1000,
    "Condition Page": 800,
  };
  const wordPoints = Math.min(30, Math.round((args.wordCount / wordTarget[args.type]) * 30));
  const linkPoints = Math.min(20, args.internalLinks * 4);
  const schemaPoints = args.schemaPresent ? 15 : 0;
  const canonicalPoints = args.canonical ? 10 : 0;
  const sectionPoints = args.requiredHits == null ? 15 : Math.round((args.requiredHits / requiredLessonSections.length) * 15);
  const eeatPoints = Math.min(10, args.eeatHits ?? 6);
  const duplicatePenalty = args.duplicateRisk ? 12 : 0;
  return Math.max(0, Math.min(100, wordPoints + linkPoints + schemaPoints + canonicalPoints + sectionPoints + eeatPoints - duplicatePenalty));
}

function flagsFor(record: Pick<AuditRecord, "type" | "wordCount" | "internalLinks" | "schemaPresent" | "qualityScore">): string[] {
  const flags: string[] = [];
  const thinThreshold = record.type === "Glossary Page" ? 250 : record.type === "Question Page" ? 700 : 800;
  if (record.wordCount < thinThreshold) flags.push("low word count");
  if (record.internalLinks < 3 && record.type !== "Glossary Page") flags.push("weak internal linking");
  if (!record.schemaPresent) flags.push("schema gap");
  if (record.qualityScore < 70) flags.push("quality below indexation target");
  return flags;
}

function loadGscCrawledNotIndexed(): Set<string> {
  const path = resolve(packageRoot, "data/gsc-indexing/crawled-not-indexed.csv");
  if (!existsSync(path)) return new Set();
  const raw = readFileSync(path, "utf8");
  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return new Set();
  const headers = lines[0]!.split(",").map((h) => h.replace(/^"|"$/g, "").trim().toLowerCase());
  const urlIndex = Math.max(headers.findIndex((h) => ["address", "url", "page", "final url"].includes(h)), 0);
  return new Set(
    lines
      .slice(1)
      .map((line) => line.split(",")[urlIndex]?.replace(/^"|"$/g, "").trim())
      .filter((u): u is string => Boolean(u)),
  );
}

function lessonSectionStatus(text: string): Record<string, boolean> {
  const lower = text.toLowerCase();
  return {
    "Learning Objectives": /learning objective|objective|by the end|you will/i.test(text),
    "Clinical Relevance": /clinical relevance|why it matters|nursing care|clinical/i.test(text),
    Pathophysiology: /pathophysiology|mechanism|physiology|underlying/i.test(text),
    Assessment: /assessment|cues|vital|monitor|inspect|auscult/i.test(text),
    Interventions: /intervention|management|teach|administer|implement|therapy/i.test(text),
    "Safety Considerations": /safety|red flag|urgent|escalat|precaution/i.test(text),
    "Clinical Pearls": /clinical pearl|exam tip|common trap|key takeaway|pearl/i.test(text),
    "NCLEX/REx-PN Relevance": /nclex|rex-pn|exam relevance|cat|ngn/i.test(text),
    "Knowledge Check": /knowledge check|quiz|question|check your understanding/i.test(text),
    "Related Lessons": /related lesson|see also|internal links|suggested internal links/i.test(text),
    "Further Reading": /further reading|references|guideline|apa|source/i.test(text) || lower.includes("references"),
  };
}

function collectLessons(gsc: Set<string>): LessonRecord[] {
  const catalogPath = resolve(packageRoot, "src/content/pathway-lessons/catalog.json");
  const catalog = readJson(catalogPath) as {
    pathways?: Record<string, { lessons?: Array<Record<string, unknown>> }>;
  };
  const out: LessonRecord[] = [];
  for (const [pathwayId, group] of Object.entries(catalog.pathways ?? {})) {
    for (const lesson of group.lessons ?? []) {
      const sections = Array.isArray(lesson.sections) ? lesson.sections as Array<Record<string, unknown>> : [];
      const body = [
        lesson.title,
        lesson.seoDescription,
        lesson.shortDescription,
        ...sections.flatMap((s) => [s.heading, s.kind, s.body]),
      ]
        .filter(Boolean)
        .join("\n\n");
      const slug = String(lesson.slug ?? "");
      if (!slug) continue;
      const url = absolute(`${pathwayBase(pathwayId)}/lessons/${slug}`);
      const status = lessonSectionStatus(body);
      const requiredHits = Object.values(status).filter(Boolean).length;
      const baseScore = score({
        type: "Lesson",
        wordCount: wordCount(body),
        internalLinks: internalLinkCount(body),
        schemaPresent: true,
        canonical: true,
        requiredHits,
      });
      const rec: LessonRecord = {
        url,
        type: "Lesson",
        title: String(lesson.title ?? slug),
        wordCount: wordCount(body),
        internalLinks: internalLinkCount(body),
        schemaPresent: true,
        canonical: url,
        indexStatus: gsc.has(url) ? "Crawled - Currently Not Indexed (GSC export)" : "candidate / not in local GSC export",
        qualityScore: baseScore,
        riskFlags: [],
        cluster: classifyCluster(body),
        source: `catalog.json:${pathwayId}`,
        sectionStatus: status,
      };
      rec.riskFlags = flagsFor(rec);
      out.push(rec);
    }
  }
  return out;
}

async function collectQuestionPages(gsc: Set<string>): Promise<AuditRecord[]> {
  const pages = await getProgrammaticQuestionTopicPages();
  return pages.map((page) => {
    const raw = JSON.stringify(page);
    const url = absolute(`/questions/${page.slug}`);
    const rec: AuditRecord = {
      url,
      type: "Question Page",
      title: page.title,
      wordCount: wordCount(raw),
      internalLinks: internalLinkCount(raw) + 4,
      schemaPresent: true,
      canonical: url,
      indexStatus: gsc.has(url) ? "Crawled - Currently Not Indexed (GSC export)" : "candidate / not in local GSC export",
      qualityScore: 0,
      riskFlags: [],
      cluster: classifyCluster(raw),
      source: "programmatic-question-topic-registry",
    };
    rec.qualityScore = score({
      type: rec.type,
      wordCount: rec.wordCount,
      internalLinks: rec.internalLinks,
      schemaPresent: rec.schemaPresent,
      canonical: true,
      eeatHits: /rationale|incorrect|clinical|strategy|breadcrumb/i.test(raw) ? 8 : 4,
    });
    rec.riskFlags = flagsFor(rec);
    return rec;
  });
}

function collectGlossary(gsc: Set<string>): AuditRecord[] {
  return listNursingGlossaryTerms().map((term) => {
    const raw = `${term.term}\n${term.definition}\n${term.relatedTermSlugs?.join(" ") ?? ""}`;
    const url = absolute(`/glossary/${term.slug}`);
    const rec: AuditRecord = {
      url,
      type: "Glossary Page",
      title: term.term,
      wordCount: wordCount(raw),
      internalLinks: (term.relatedTermSlugs?.length ?? 0) + 1,
      schemaPresent: true,
      canonical: url,
      indexStatus: gsc.has(url) ? "Crawled - Currently Not Indexed (GSC export)" : "candidate / not in local GSC export",
      qualityScore: 0,
      riskFlags: [],
      cluster: classifyCluster(raw),
      source: "nursing-glossary-registry",
    };
    rec.qualityScore = score({
      type: rec.type,
      wordCount: rec.wordCount,
      internalLinks: rec.internalLinks,
      schemaPresent: rec.schemaPresent,
      canonical: true,
      eeatHits: 5,
    });
    rec.riskFlags = flagsFor(rec);
    return rec;
  });
}

function collectBlogs(gsc: Set<string>): AuditRecord[] {
  const blogDir = resolve(packageRoot, "src/content/blog-static-longtail");
  return allFiles(blogDir, [".md"]).map((path) => {
    const raw = readFileSync(path, "utf8");
    const { data, body } = parseFrontmatter(raw);
    const slug = data.slug || basename(path, ".md");
    const url = absolute(data.canonicalUrl || `/blog/${slug}`);
    const eeatHits = [
      data.authorDisplayName,
      data.medicalReviewerName,
      data.disclaimer,
      /FAQ Schema Questions|<h2>FAQ/i.test(body) ? "faq" : "",
      /References|APA-7|Further Reading/i.test(body) ? "refs" : "",
    ].filter(Boolean).length * 2;
    const duplicateRisk = /centers on|This guide frames the topic|The sections below are written for education/i.test(body);
    const rec: AuditRecord = {
      url,
      type: "Blog Article",
      title: data.title || slug,
      wordCount: wordCount(body),
      internalLinks: internalLinkCount(body),
      schemaPresent: Boolean(data.authorDisplayName && data.medicalReviewerName),
      canonical: url,
      indexStatus: gsc.has(url) ? "Crawled - Currently Not Indexed (GSC export)" : "candidate / not in local GSC export",
      qualityScore: 0,
      riskFlags: [],
      cluster: classifyCluster(`${data.title ?? ""} ${body}`),
      source: `blog-static-longtail/${basename(path)}`,
    };
    rec.qualityScore = score({
      type: rec.type,
      wordCount: rec.wordCount,
      internalLinks: rec.internalLinks,
      schemaPresent: rec.schemaPresent,
      canonical: true,
      duplicateRisk,
      eeatHits,
    });
    rec.riskFlags = flagsFor(rec);
    if (duplicateRisk) rec.riskFlags.push("templated prose risk");
    return rec;
  });
}

function collectLandingPages(gsc: Set<string>): AuditRecord[] {
  const authority = listAuthorityClusterPages().map((page): AuditRecord => {
    const raw = JSON.stringify(page);
    const url = absolute(page.path);
    const rec: AuditRecord = {
      url,
      type: page.cluster.includes("cnple") || page.cluster.includes("rex") ? "Exam Landing Page" : "Condition Page",
      title: page.title,
      wordCount: wordCount(raw),
      internalLinks: page.ctas.length + page.nextSteps.length,
      schemaPresent: true,
      canonical: url,
      indexStatus: gsc.has(url) ? "Crawled - Currently Not Indexed (GSC export)" : "candidate / not in local GSC export",
      qualityScore: 0,
      riskFlags: [],
      cluster: classifyCluster(raw),
      source: "authority-cluster-pages",
    };
    rec.qualityScore = score({
      type: rec.type,
      wordCount: rec.wordCount,
      internalLinks: rec.internalLinks,
      schemaPresent: rec.schemaPresent,
      canonical: true,
      eeatHits: 8,
    });
    rec.riskFlags = flagsFor(rec);
    return rec;
  });
  const testBanks = HEALTHCARE_TEST_BANK_PAGES.map((page): AuditRecord => {
    const raw = JSON.stringify(page);
    const url = absolute(page.path);
    const rec: AuditRecord = {
      url,
      type: "Exam Landing Page",
      title: page.title,
      wordCount: wordCount(raw),
      internalLinks: Object.keys(page.links).length + 2,
      schemaPresent: true,
      canonical: url,
      indexStatus: gsc.has(url) ? "Crawled - Currently Not Indexed (GSC export)" : "candidate / not in local GSC export",
      qualityScore: 0,
      riskFlags: [],
      cluster: classifyCluster(raw),
      source: "healthcare-test-bank-pages",
    };
    rec.qualityScore = score({
      type: rec.type,
      wordCount: rec.wordCount,
      internalLinks: rec.internalLinks,
      schemaPresent: rec.schemaPresent,
      canonical: true,
      eeatHits: 8,
    });
    rec.riskFlags = flagsFor(rec);
    return rec;
  });
  return [...authority, ...testBanks];
}

function summarizeByType(records: AuditRecord[]): (string | number)[][] {
  const byType = new Map<ContentType, AuditRecord[]>();
  for (const record of records) {
    byType.set(record.type, [...(byType.get(record.type) ?? []), record]);
  }
  return [...byType.entries()].map(([type, rows]) => [
    type,
    rows.length,
    Math.round(rows.reduce((sum, r) => sum + r.wordCount, 0) / rows.length),
    Math.round(rows.reduce((sum, r) => sum + r.internalLinks, 0) / rows.length),
    Math.round(rows.reduce((sum, r) => sum + r.qualityScore, 0) / rows.length),
    rows.filter((r) => r.qualityScore < 70).length,
  ]);
}

function topRows(records: AuditRecord[], limit: number): AuditRecord[] {
  return [...records].sort((a, b) => a.qualityScore - b.qualityScore || a.wordCount - b.wordCount).slice(0, limit);
}

function writeReport(name: string, content: string): void {
  mkdirSync(reportDir, { recursive: true });
  writeFileSync(resolve(reportDir, name), `${content.trim()}\n`, "utf8");
}

function renderIndexationAudit(records: AuditRecord[], gscCount: number): string {
  const scoped = gscCount > 0 ? records.filter((r) => r.indexStatus.startsWith("Crawled")) : topRows(records, 160);
  return `# Indexation Quality Audit

Generated: 2026-05-30

## Scope Note

Local GSC crawled-not-indexed export rows found: ${gscCount}.

${gscCount > 0
  ? "Rows below are exact local Search Console export matches where URLs overlap the local corpus."
  : "No local `data/gsc-indexing/crawled-not-indexed.csv` export was found. Rows below are the lowest-scoring indexable content candidates from local source, so export the GSC URL list and rerun `npm run audit:seo-recovery-phase3` for exact Search Console targeting."}

## Summary By Content Type

${markdownTable(["Content Type", "Pages", "Avg Words", "Avg Internal Links", "Avg Quality", "Below 70"], summarizeByType(records))}

## URL-Level Quality Table

${markdownTable(
  ["URL", "Content Type", "Word Count", "Internal Links", "Schema Present", "Canonical", "Index Status", "Quality Score"],
  scoped.map((r) => [r.url, r.type, r.wordCount, r.internalLinks, r.schemaPresent ? "Yes" : "No", r.canonical, r.indexStatus, r.qualityScore]),
)}
`;
}

function renderThinContent(records: AuditRecord[]): string {
  const thin = records.filter((r) => r.riskFlags.length > 0).sort((a, b) => a.qualityScore - b.qualityScore).slice(0, 220);
  return `# Thin Content Report

Generated: 2026-05-30

## Prioritization Rule

Priority is based on low quality score, low word count, weak link density, schema gaps, and templated/duplicate prose risk. Pages with GSC-confirmed crawled-not-indexed status should move to the top after the CSV export is added.

${markdownTable(
  ["Priority", "URL", "Type", "Words", "Links", "Quality", "Flags"],
  thin.map((r, i) => [i + 1, r.url, r.type, r.wordCount, r.internalLinks, r.qualityScore, r.riskFlags.join("; ")]),
)}

## Expansion Playbook

- Lessons: add missing clinical spine sections, more bedside cues, scenario examples, related lessons, and further reading.
- Question pages: turn every question page into a teaching page with rationale, why-correct, why-incorrect, clinical application, strategy, breadcrumbs, and schema.
- Glossary pages: expand definitions into mini clinical explainers with related terms, lesson links, and question links.
- Blogs: remove generic templated openings, add original clinical framing, examples, FAQs, references, and cluster links.
- Exam/condition pages: add concrete study order, inventory-backed claims, FAQs, and links into lessons/questions/flashcards/simulations.
`;
}

function renderLessonUpgrade(lessons: LessonRecord[]): string {
  const misses = lessons
    .map((lesson) => ({
      lesson,
      missing: requiredLessonSections.filter((s) => !lesson.sectionStatus[s]),
    }))
    .filter((row) => row.missing.length > 0 || row.lesson.qualityScore < 78)
    .sort((a, b) => a.lesson.qualityScore - b.lesson.qualityScore)
    .slice(0, 220);
  const coverageRows = requiredLessonSections.map((section) => [
    section,
    lessons.filter((lesson) => lesson.sectionStatus[section]).length,
    `${Math.round((lessons.filter((lesson) => lesson.sectionStatus[section]).length / lessons.length) * 100)}%`,
  ]);
  return `# Lesson Quality Upgrade Audit

Generated: 2026-05-30

## Required Section Coverage

${markdownTable(["Required Section", "Lessons With Signal", "Coverage"], coverageRows)}

## Priority Lessons For Expansion

${markdownTable(
  ["Priority", "URL", "Words", "Quality", "Missing / Weak Sections"],
  misses.map((row, i) => [i + 1, row.lesson.url, row.lesson.wordCount, row.lesson.qualityScore, row.missing.join("; ") || "quality depth / link density"]),
)}

## Upgrade Requirements

Every lesson should include learning objectives, clinical relevance, pathophysiology, assessment, interventions, safety considerations, clinical pearls, exam relevance, knowledge check, related lessons, and further reading. Placeholder-only sections should be replaced with scenario-specific teaching and source-backed clinical context.
`;
}

function renderQuestionAuthority(records: AuditRecord[]): string {
  const questions = records.filter((r) => r.type === "Question Page").sort((a, b) => a.qualityScore - b.qualityScore);
  return `# Question Page Authority Pass

Generated: 2026-05-30

## Requirement

Question pages must not be question-only. They should function as educational resources: question, rationale, why correct, why incorrect, clinical application, exam strategy, related topics, related lessons, breadcrumbs, and schema.

${markdownTable(
  ["Priority", "URL", "Words", "Links", "Quality", "Flags"],
  questions.slice(0, 120).map((r, i) => [i + 1, r.url, r.wordCount, r.internalLinks, r.qualityScore, r.riskFlags.join("; ") || "review for rationale depth"]),
)}
`;
}

function renderBlogQuality(records: AuditRecord[]): string {
  const blogs = records.filter((r) => r.type === "Blog Article").sort((a, b) => a.qualityScore - b.qualityScore).slice(0, 180);
  return `# Blog Quality Pass

Generated: 2026-05-30

## Quality Bar

Blogs should provide original clinical value, actionable teaching, internal links, FAQs/schema, strong conclusions, and clear E-E-A-T signals. Generic AI-like setup paragraphs and repeated boilerplate should be rewritten.

${markdownTable(
  ["Priority", "URL", "Words", "Links", "Quality", "Flags"],
  blogs.map((r, i) => [i + 1, r.url, r.wordCount, r.internalLinks, r.qualityScore, r.riskFlags.join("; ") || "manual editorial review"]),
)}
`;
}

function renderInternalLinking(records: AuditRecord[]): string {
  const weak = records.filter((r) => r.internalLinks < 3 && r.type !== "Glossary Page").sort((a, b) => a.internalLinks - b.internalLinks).slice(0, 180);
  return `# Internal Linking Expansion

Generated: 2026-05-30

## Standard

Every lesson should link to related lessons, questions, flashcards, practice tests, blogs, simulations, pharmacology, and clinical skills where relevant. Link expansion should build clusters, not disconnected mini-apps.

${markdownTable(
  ["Priority", "URL", "Type", "Cluster", "Internal Links", "Recommended Links"],
  weak.map((r, i) => [
    i + 1,
    r.url,
    r.type,
    r.cluster,
    r.internalLinks,
    "Add hub + 2 related lessons + question bank + flashcards + one blog/simulation/clinical skill link",
  ]),
)}
`;
}

function renderTopicalAuthority(records: AuditRecord[]): string {
  const rows = topicClusters.map((cluster) => {
    const scoped = records.filter((r) => r.cluster === cluster.key);
    const by = (type: ContentType) => scoped.filter((r) => r.type === type).length;
    const missing = [
      by("Lesson") === 0 ? "lessons" : "",
      by("Question Page") === 0 ? "questions" : "",
      by("Blog Article") === 0 ? "blogs" : "",
      scoped.some((r) => /simulation|case/i.test(r.title + r.url)) ? "" : "simulations",
      scoped.some((r) => /flashcard/i.test(r.title + r.url)) ? "" : "flashcards",
    ].filter(Boolean).join(", ") || "none obvious in local scan";
    return [
      cluster.key,
      scoped.find((r) => r.type === "Exam Landing Page" || r.type === "Condition Page")?.url ?? "Needs explicit hub selection",
      by("Lesson"),
      by("Question Page"),
      by("Blog Article"),
      scoped.filter((r) => /simulation|case/i.test(r.title + r.url)).length,
      scoped.filter((r) => /flashcard/i.test(r.title + r.url)).length,
      missing,
    ];
  });
  return `# Topical Authority Map

Generated: 2026-05-30

${markdownTable(
  ["Cluster", "Hub Page", "Lessons", "Questions", "Blogs", "Simulations", "Flashcards", "Missing Content"],
  rows,
)}
`;
}

function renderEeat(records: AuditRecord[]): string {
  const blogCount = records.filter((r) => r.type === "Blog Article").length;
  const blogSchema = records.filter((r) => r.type === "Blog Article" && r.schemaPresent).length;
  const weak = records.filter((r) => r.qualityScore < 75).slice(0, 120);
  return `# E-E-A-T Improvements

Generated: 2026-05-30

## Current Signals

- Blog articles with author/reviewer schema signals: ${blogSchema}/${blogCount}
- Organization/about/editorial standards still need manual live-page validation.
- Lesson and question pages need visible review/update cues where clinically material.

## Strengthening Plan

- Add consistent author blocks, medical reviewer attribution, and last-reviewed dates to YMYL educational pages.
- Expand About and Editorial Standards pages with credentials, review cadence, scope disclaimers, and correction policy.
- Add Organization, WebSite, Article/LearningResource, FAQ, BreadcrumbList, and Question schema where appropriate.
- Tie clinical pages to source-backed further reading and explicit educational disclaimers.

## Pages Needing E-E-A-T Reinforcement

${markdownTable(
  ["Priority", "URL", "Type", "Quality", "Reason"],
  weak.map((r, i) => [i + 1, r.url, r.type, r.qualityScore, r.riskFlags.join("; ") || "manual E-E-A-T review"]),
)}
`;
}

function renderReindex(records: AuditRecord[]): string {
  const priority = records
    .filter((r) => r.qualityScore >= 78 || r.indexStatus.startsWith("Crawled"))
    .sort((a, b) => {
      const gsc = Number(b.indexStatus.startsWith("Crawled")) - Number(a.indexStatus.startsWith("Crawled"));
      return gsc || b.qualityScore - a.qualityScore || b.internalLinks - a.internalLinks;
    })
    .slice(0, 120);
  return `# Reindex Priority List

Generated: 2026-05-30

## Campaign Order

1. Fix or expand pages under 70 before requesting indexing.
2. Request indexing for upgraded, canonical, schema-backed pages with strong internal links.
3. Resubmit sitemap segments after batch upgrades.
4. Use Search Console validation requests only after exact GSC rows are mapped to fixed URLs.

${markdownTable(
  ["Priority", "URL", "Type", "Quality", "Reason"],
  priority.map((r, i) => [
    i + 1,
    r.url,
    r.type,
    r.qualityScore,
    r.indexStatus.startsWith("Crawled") ? "GSC-confirmed after upgrade" : "High-quality local candidate after sitemap refresh",
  ]),
)}
`;
}

function renderDashboard(records: AuditRecord[], gscCount: number): string {
  const thin = records.filter((r) => r.qualityScore < 70).length;
  const schema = records.filter((r) => r.schemaPresent).length;
  const avg = Math.round(records.reduce((sum, r) => sum + r.qualityScore, 0) / records.length);
  const avgLinks = Math.round(records.reduce((sum, r) => sum + r.internalLinks, 0) / records.length);
  const indexationRate = gscCount > 0 ? "Requires indexed URL denominator from GSC export" : "Not available without GSC export";
  const rows = [
    ["Indexation rate", indexationRate],
    ["Crawled-not-indexed rows loaded", gscCount],
    ["Audited local URLs", records.length],
    ["Thin content count (<70)", thin],
    ["Average quality score", avg],
    ["Average internal link density", avgLinks],
    ["Schema coverage", `${schema}/${records.length} (${Math.round((schema / records.length) * 100)}%)`],
    ["Authority score", Math.round((avg + Math.min(100, avgLinks * 10) + Math.round((schema / records.length) * 100)) / 3)],
  ];
  return `# Content Quality Dashboard

Generated: 2026-05-30

${markdownTable(["Metric", "Value"], rows)}

## By Content Type

${markdownTable(["Content Type", "Pages", "Avg Words", "Avg Internal Links", "Avg Quality", "Below 70"], summarizeByType(records))}

## Success Criteria Tracking

- Crawled-not-indexed pages audited: ${gscCount > 0 ? "Yes, for local export overlap" : "Blocked on GSC URL export; local candidate audit complete"}
- Thin content identified: Yes
- Lessons strengthened: Audit queue generated; content expansion remains editorial implementation
- Question pages upgraded: Authority queue generated; implementation remains follow-up
- Blog quality improved: Quality queue generated; implementation remains follow-up
- Internal linking expanded: Expansion queue generated
- Topic clusters built: Yes
- E-E-A-T strengthened: Plan and queue generated
- Reindex campaign prepared: Yes
- Quality dashboard created: Yes
`;
}

async function main(): Promise<void> {
  const gsc = loadGscCrawledNotIndexed();
  const lessons = collectLessons(gsc);
  const records: AuditRecord[] = [
    ...lessons,
    ...(await collectQuestionPages(gsc)),
    ...collectGlossary(gsc),
    ...collectBlogs(gsc),
    ...collectLandingPages(gsc),
  ].sort((a, b) => a.type.localeCompare(b.type) || a.url.localeCompare(b.url));

  writeReport("indexation-quality-audit.md", renderIndexationAudit(records, gsc.size));
  writeReport("thin-content-report.md", renderThinContent(records));
  writeReport("lesson-quality-upgrade.md", renderLessonUpgrade(lessons));
  writeReport("question-page-authority-pass.md", renderQuestionAuthority(records));
  writeReport("blog-quality-pass.md", renderBlogQuality(records));
  writeReport("internal-linking-expansion.md", renderInternalLinking(records));
  writeReport("topical-authority-map.md", renderTopicalAuthority(records));
  writeReport("eeat-improvements.md", renderEeat(records));
  writeReport("reindex-priority-list.md", renderReindex(records));
  writeReport("content-quality-dashboard.md", renderDashboard(records, gsc.size));

  console.log(`[seo-recovery-phase3] wrote ${reportDir}`);
  console.log(`[seo-recovery-phase3] audited ${records.length} URLs; GSC crawled-not-indexed rows loaded: ${gsc.size}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
