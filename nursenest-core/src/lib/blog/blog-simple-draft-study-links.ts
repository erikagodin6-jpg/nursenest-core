/**
 * Second-pass AI for `/api/admin/blog/generate-ai` (simple generator): study-product internal links + verification.
 */

import { z } from "zod";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import { blogLessonLinkRowSchema } from "@/lib/blog/blog-control-panel-schema";
import type { BlogLessonLinkRow } from "@/lib/blog/blog-control-panel-schema";
import { annotateBlogInternalLinkRowsWithVerification } from "@/lib/blog/blog-internal-link-verify";
import {
  effectiveLessonHref,
  getBlogInternalLinkPathHintsForPrompt,
  lessonRowsToRelatedPaths,
  normalizePlanSuggestedLessonRows,
} from "@/lib/blog/blog-internal-lesson-links";
import { marketingStudyHubsForBlogExam } from "@/lib/blog/blog-study-cta";

const responseSchema = z.object({
  suggestedInternalLessons: z.array(blogLessonLinkRowSchema).max(14).default([]),
});

function extractJsonObject(raw: string): unknown {
  let t = raw.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(t);
  if (fence) t = fence[1].trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start >= 0 && end > start) t = t.slice(start, end + 1);
  return JSON.parse(t) as unknown;
}

function escapeHtmlText(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Appendix block with only verified root-relative links (plus canonical hubs).
 */
export function buildSimpleDraftStudyAppendixHtml(rows: BlogLessonLinkRow[], exam: string, country: "US" | "CA" | "unspecified"): string {
  const hubs = marketingStudyHubsForBlogExam(exam, country);
  const lis: string[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    const href = effectiveLessonHref(row);
    if (!href || seen.has(href)) continue;
    seen.add(href);
    lis.push(`<li><a href="${escapeHtmlText(href)}">${escapeHtmlText(row.label.trim())}</a></li>`);
  }
  if (!seen.has(hubs.lessonsHub)) {
    lis.push(`<li><a href="${hubs.lessonsHub}">Structured lessons for this exam track</a></li>`);
    seen.add(hubs.lessonsHub);
  }
  if (!seen.has(hubs.questionBankHub)) {
    lis.push(`<li><a href="${hubs.questionBankHub}">Question bank hub (same pathway scope)</a></li>`);
    seen.add(hubs.questionBankHub);
  }
  if (!seen.has(hubs.practiceExamsHub)) {
    lis.push(`<li><a href="${hubs.practiceExamsHub}">CAT-style practice exams directory</a></li>`);
    seen.add(hubs.practiceExamsHub);
  }
  if (hubs.practiceProgrammatic && !seen.has(hubs.practiceProgrammatic)) {
    lis.push(`<li><a href="${hubs.practiceProgrammatic}">Focused practice test landing for this track</a></li>`);
  }

  if (lis.length === 0) return "";
  return `<h2>Study next in NurseNest</h2><ul>${lis.join("")}</ul>`;
}

export async function fetchSimpleDraftStudyLinks(params: {
  topic: string;
  exam: string;
  country: "US" | "CA" | "unspecified";
  targetKeyword?: string;
  keywords?: string;
  bodyPreview: string;
}): Promise<{ rows: BlogLessonLinkRow[]; relatedPaths: string[]; appendixHtml: string }> {
  const hints = getBlogInternalLinkPathHintsForPrompt(params.exam, params.country);
  const user = `You help NurseNest blog posts point readers to real study products (lessons, question banks, practice exams).

Topic: ${params.topic}
Exam focus label: ${params.exam}
${params.targetKeyword ? `Primary keyword: ${params.targetKeyword}` : ""}
${params.keywords ? `Keyword list: ${params.keywords}` : ""}

Article excerpt (for context only):
${params.bodyPreview.slice(0, 2800)}

${hints}

Return a single JSON object only:
{ "suggestedInternalLessons": [ { "label": string, "suggestedPath": string, "rationale"?: string, "linkKind"?: "lesson"|"lessons_hub"|"question_bank"|"topic_cluster"|"practice_exams"|"practice_programmatic"|"flashcards_hub"|"adaptive_cat"|"study_plan"|"general" } ] }

Hard rules:
- Every suggestedPath must be root-relative, allowed on the public marketing site, and must match the pathway patterns in the hints.
- Prefer the exam's own lessons hub, question bank hub, /practice-exams, and 0–4 lesson detail URLs only when you are confident the slug pattern is realistic.
- Never output /app/*, /api/*, or external URLs.`;

  const res = await openAiChatCompletion({
    messages: [
      {
        role: "system",
        content:
          "You output JSON only for NurseNest internal study links. No markdown. Paths must be root-relative and safe for public marketing pages.",
      },
      { role: "user", content: user },
    ],
    temperature: 0.35,
    maxTokens: 1800,
  });

  let parsedJson: unknown;
  try {
    parsedJson = extractJsonObject(res.content);
  } catch {
    return {
      rows: [],
      relatedPaths: [],
      appendixHtml: buildSimpleDraftStudyAppendixHtml([], params.exam, params.country),
    };
  }

  const parsed = responseSchema.safeParse(parsedJson);
  if (!parsed.success) {
    return {
      rows: [],
      relatedPaths: [],
      appendixHtml: buildSimpleDraftStudyAppendixHtml([], params.exam, params.country),
    };
  }

  let rows = normalizePlanSuggestedLessonRows(parsed.data.suggestedInternalLessons);
  rows = await annotateBlogInternalLinkRowsWithVerification(rows, params.country);
  const relatedPaths = lessonRowsToRelatedPaths(rows, params.country);
  const appendixHtml = buildSimpleDraftStudyAppendixHtml(rows, params.exam, params.country);

  return { rows, relatedPaths, appendixHtml };
}
