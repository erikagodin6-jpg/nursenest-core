/**
 * Pathway- and country-aware internal lesson / hub links for AI blog workflow + public auto-linking.
 */

import { z } from "zod";
import { equivalentExamHubUrlAfterRegionToggle } from "@/lib/marketing/marketing-region-equivalent-hub";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { ALLIED, HUB, NP, PN, RN } from "@/lib/marketing/marketing-entry-routes";
import { blogLessonLinkRowSchema, lessonLinkStableId } from "@/lib/blog/blog-control-panel-schema";
import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import type { BlogLessonLinkRow } from "@/lib/blog/blog-control-panel-schema";

export type { BlogLessonLinkRow };

/** Root-relative marketing paths safe to inject from blog tooling (no app/API). */
export function isAllowedBlogInternalHref(href: string): boolean {
  const p = (href.trim().split("?")[0] ?? "").split("#")[0] ?? "";
  if (!p.startsWith("/") || p.startsWith("//")) return false;
  if (p.startsWith("/app/") || p.startsWith("/api/") || p.startsWith("/admin")) return false;
  if (p === "/lessons" || p === "/practice-exams" || p === "/blog" || p.startsWith("/blog/")) return true;
  if (p === "/flashcards" || p.startsWith("/flashcards/")) return true;
  if (p.startsWith("/tools/") || p === "/tools") return true;
  if (p.startsWith("/allied-health")) return true;
  if (p.startsWith("/pre-nursing")) return true;
  if (p.startsWith("/question-bank")) return true;
  if (p.startsWith("/us/") || p.startsWith("/canada/")) {
    return /^\/(us|canada)\/[a-z0-9][a-z0-9/_-]*$/i.test(p);
  }
  return false;
}

export function alignLessonPathForAudienceCountry(
  path: string,
  country: "US" | "CA" | "unspecified",
): string {
  if (country === "unspecified") return path;
  const want: MarketingRegionToggle = country === "US" ? "US" : "CA";
  return equivalentExamHubUrlAfterRegionToggle(path, want) ?? path;
}

export function effectiveLessonHref(row: BlogLessonLinkRow): string | null {
  if (row.reviewStatus === "removed") return null;
  const primary = (row.replacementPath ?? "").trim();
  if (primary && isAllowedBlogInternalHref(primary)) return primary;
  if (row.pathStatus === "not_found" || row.pathStatus === "invalid_allowlist") return null;
  const fallback = row.suggestedPath.trim();
  if (!fallback || !isAllowedBlogInternalHref(fallback)) return null;
  return fallback;
}

export function lessonRowsToRelatedPaths(
  rows: BlogLessonLinkRow[],
  country: "US" | "CA" | "unspecified",
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    const raw = effectiveLessonHref(row);
    if (!raw) continue;
    const aligned = alignLessonPathForAudienceCountry(raw, country);
    if (!isAllowedBlogInternalHref(aligned)) continue;
    if (seen.has(aligned)) continue;
    seen.add(aligned);
    out.push(aligned);
  }
  return out.slice(0, 24);
}

/** Normalize model/regeneration JSON rows before merging into {@link BlogControlPanelPlan}. */
export function normalizePlanSuggestedLessonRows(rows: z.infer<typeof blogLessonLinkRowSchema>[]): BlogLessonLinkRow[] {
  return rows.map((row, i) => ({
    ...row,
    id: row.id?.trim() || lessonLinkStableId(row, i),
    reviewStatus: row.reviewStatus ?? "active",
  }));
}

export function normalizeLessonRowsFromStorage(raw: unknown): BlogLessonLinkRow[] {
  if (!Array.isArray(raw)) return [];
  const out: BlogLessonLinkRow[] = [];
  raw.forEach((row, i) => {
    const parsed = blogLessonLinkRowSchema.safeParse(row);
    if (!parsed.success) return;
    const d = parsed.data;
    out.push({
      ...d,
      id: d.id?.trim() || lessonLinkStableId(d, i),
      reviewStatus: d.reviewStatus ?? "active",
    });
  });
  return out;
}

/**
 * Prompt appendix: canonical hubs for the selected admin exam + country so the model emits valid paths.
 */
export function getBlogInternalLinkPathHintsForPrompt(exam: string, country: "US" | "CA" | "unspecified"): string {
  const ca = country === "CA";
  const us = country === "US" || country === "unspecified";

  const lines: string[] = [
    "Prefer these pathway patterns (root-relative, start with /):",
    "- Lesson detail: /{us|canada}/{role}/{exam-code}/lessons/{lesson-slug}",
    "- Lessons hub: same prefix ending in /lessons",
    "- Question bank hub: same prefix ending in /questions",
  ];

  const add = (label: string, paths: string[]) => {
    lines.push(`${label}: ${paths.join(" · ")}`);
  };

  if (exam.includes("NCLEX-RN") || exam === "NCLEX-RN") {
    if (us) add("NCLEX-RN US", [RN.usLessons, RN.usQuestions]);
    if (ca) add("NCLEX-RN Canada", [RN.caLessons, RN.caQuestions]);
  } else if (exam.includes("NCLEX-PN") || exam === "NCLEX-PN") {
    if (us) add("NCLEX-PN US", [PN.usLessons, PN.usQuestions]);
  } else if (exam.includes("REx") || exam.includes("REx-PN")) {
    add("Canada PN", [PN.caHub, PN.caLessons, PN.caQuestions]);
  } else if (exam.includes("NP") || exam.includes("CNPLE")) {
    if (us) add("NP US (FNP example)", [NP.fnpLessons, NP.fnpQuestions]);
    if (ca) add("NP Canada (CNPLE)", [NP.caNpLessons, NP.caNpQuestions]);
  } else if (exam.toLowerCase().includes("allied")) {
    if (us) add("Allied US", [`${ALLIED.usHub}/lessons`, ALLIED.usQuestions]);
    if (ca) add("Allied Canada", [`${ALLIED.caHub}/lessons`, ALLIED.caQuestions]);
  }

  lines.push(
    `Public practice exam directory (CAT-style mocks marketing entry): ${HUB.practiceExams}`,
    `Question bank discovery hub: ${HUB.questionBank}`,
    `Flashcards hub: ${HUB.flashcards}`,
    "When recommending adaptive/CAT practice, link practice_exams or practice_programmatic kinds — never /app/exams in article HTML.",
  );

  if (country === "unspecified") {
    lines.push("Country unspecified: you may include both /us/... and /canada/... variants only when each is clearly justified; otherwise default to US hubs.");
  }

  lines.push(
    "Do not link to /app/*, /api/*, or external domains.",
    "Include a mix where relevant: 1–2 lesson detail URLs (only if confident path matches a real lesson slug pattern), lessons hub, question bank hub, flashcards hub, /practice-exams, and optional programmatic practice landing for the exam.",
    "linkKind: lesson | lessons_hub | question_bank | topic_cluster | practice_exams | practice_programmatic | flashcards_hub | adaptive_cat | study_plan | general",
    "Max 12 suggestions total.",
  );
  return lines.join("\n");
}

/** Lines for article body prompt: only non-removed rows; uses effective href when replacement is valid. */
export function formatLessonRowsForBodyPrompt(rows: BlogLessonLinkRow[]): string {
  const lines: string[] = [];
  for (const r of rows) {
    if (r.reviewStatus === "removed") continue;
    const href = effectiveLessonHref(r);
    if (!href) continue;
    lines.push(`${r.label}: ${href}`);
  }
  return lines.join("\n");
}
