/**
 * Section-isolated blog body generation for long-form pathophysiology posts.
 * Each outline H2 is generated in a separate completion with forbidden-reuse memory
 * and in-flight similarity checks vs prior sections.
 */

import type { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import { countryEditorialContext, pathwayEditorialContext } from "@/lib/blog/blog-article-pathway-context";
import { blogBodyHtmlWhenAiReturnedEmpty } from "@/lib/blog/blog-article-bounds";
import {
  extractParagraphTextsFromBlogHtml,
  maxJaccardOfNewSectionVsPriorSections,
  validateBlogTitleForBodyGeneration,
} from "@/lib/blog/blog-content-quality-gate";
import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import { formatLessonRowsForBodyPrompt } from "@/lib/blog/blog-internal-lesson-links";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Regenerate section when overlap with any prior section exceeds this (stricter than post-hoc gate ~0.52). */
const SECTION_JACCARD_REGENERATE_THRESHOLD = 0.45;
const MAX_REGENERATIONS_PER_SECTION = 2;

const SECTION_ISOLATED_SYSTEM = `You write ONE section of HTML for NurseNest nursing licensure exam prep.

Output rules:
- Output **only** valid HTML for this single section. Allowed tags: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <table>, <thead>, <tbody>, <tr>, <th>, <td>. No markdown. No <h1>. No <img>.
- Your output **must** begin with exactly the provided <h2> opening line (verbatim heading text).
- Teach **clinical** content for this heading only. Do not reuse phrasing from other sections (supplied forbidden list).
- Use **unique** examples and clinical details. Do not include meta commentary about studying, exams, or "this section".
- Do not write <h2>FAQs</h2>, <h2>References</h2>, or duplicate structured FAQ content.
- No fabricated statistics, trial results, or journal citations.
- Educational exam-prep framing only — no directive treatment orders for real patients.`;

/** Escape text for safe inclusion inside `<h2>…</h2>` in prompts and emitted HTML. */
function escapeForH2Content(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function isAudienceSplinterHeading(h2: string): boolean {
  const h = h2.toLowerCase();
  if (/\b(pathophys|mechanism|assessment|diagnostic|intervention|medication|teaching|trap|escalat|case|symptom|lab|priorit|comparison|overview|summary|takeaway|related study|clinical pearl|nclex)\b/.test(h))
    return false;
  return /\b(for\s+)?(rn|rpn|pn|lvn|lpn|np|fnp|aprn|allied|new\s*grad|student\s+nurse|pre[\s-]*nursing)\b/i.test(h2);
}

function clinicalObjectiveForSection(h2: string, topic: string): string {
  const h = h2.toLowerCase();
  if (/\bpathophys|mechanism|disease process|why it happens\b/.test(h)) {
    return `Explain **stepwise pathophysiology** for **${topic}**: build a causal chain (e.g. sustained hyperglycemia → polyol/sorbitol pathway stress → microvascular injury → nerve ischemia and dysfunction when relevant to this disease). Use measured language; no invented numeric thresholds.`;
  }
  if (/\bassessment|nursing assessment|physical assessment\b/.test(h)) {
    return `Focus on **concrete assessment findings** for **${topic}** (e.g. vibration sense, monofilament testing, stocking-glove sensory loss patterns, foot inspection cues, gait/balance red flags as applicable). Tie findings to why they matter for safety.`;
  }
  if (/\bintervention|nursing care|management|monitoring\b/.test(h)) {
    return `Describe **specific nursing actions** for **${topic}**: scheduled foot checks, glycemic monitoring education, skin integrity, pain reporting, medication-class teaching (e.g. gabapentin/pregabalin awareness: sedation, renal dosing considerations in general terms only — no dosing orders), escalation triggers.`;
  }
  if (/\bdiagnostic|labs|imaging\b/.test(h)) {
    return `Cover **what clinicians order and how nurses interpret trends** for **${topic}** — test names, why they matter, and monitoring implications. No fabricated reference ranges.`;
  }
  if (/\bmedication|pharmac|drug\b/.test(h)) {
    return `Summarize **medication classes and nursing monitoring** for **${topic}** (adverse effects to watch, education points, when to involve provider). No invented doses.`;
  }
  if (/\bteaching|education|home care|discharge\b/.test(h)) {
    return `Patient and family teaching for **${topic}**: self-monitoring, adherence, when to seek care — concrete behaviors, not generic encouragement.`;
  }
  if (/\btrap|nclex|rex|exam|prioritization|distractor\b/.test(h)) {
    return `Exam-style **decision rules and traps** specific to **${topic}** — prioritization cues and common wrong answers without meta "study tips" filler.`;
  }
  if (/\bred flag|escalat|emergency|urgent\b/.test(h)) {
    return `**Escalation and red-flag** criteria for **${topic}** — what changes require urgent escalation vs routine reporting.`;
  }
  if (/\bcase|vignette|application\b/.test(h)) {
    return `A **short clinical vignette** plus 2–4 questions that apply **${topic}** only — no unrelated diseases.`;
  }
  if (/\bkey takeaway|takeaway\b/.test(h)) {
    return `Bullet **key takeaways** as new prose; bullets must not repeat sentences from earlier sections.`;
  }
  if (/\brelated study|study path|internal link\b/.test(h)) {
    return `One short paragraph weaving **internal study paths** from the supplied list (marketing paths only). No raw /app/ URLs.`;
  }
  if (/\bclinical pearl|pearls\b/.test(h)) {
    return `**Clinical pearls**: 3–6 tight bullets with bedside pattern recognition for **${topic}**.`;
  }
  return `Teach **${topic}** under this heading with **new** clinical detail not covered elsewhere in the article. Avoid generic connectors ("this section connects…").`;
}

function buildForbiddenReuseBlock(lines: string[]): string {
  if (!lines.length) return "(none yet — still avoid generic boilerplate.)";
  return lines
    .slice(-24)
    .map((line, i) => `${i + 1}. ${line}`)
    .join("\n");
}

function collectMemoryLinesFromSection(html: string): string[] {
  const paras = extractParagraphTextsFromBlogHtml(html);
  const out: string[] = [];
  for (const p of paras.slice(0, 4)) {
    const s = p.slice(0, 280).trim();
    if (s.length >= 50) out.push(s);
  }
  return out;
}

function buildSectionUserPrompt(input: {
  plan: BlogControlPanelPlan;
  topic: string;
  exam: string;
  country: "US" | "CA" | "unspecified";
  template: BlogPostTemplate;
  intent: BlogPostIntent;
  funnelStage: BlogFunnelStage;
  tone: "professional" | "supportive" | "direct";
  keywords?: string;
  pageH1: string;
  sectionIndex: number;
  sectionTotal: number;
  h2: string;
  h3?: string[];
  outlineBullets?: string[];
  forbiddenReuseLines: string[];
  audienceBulletMode: boolean;
}): string {
  const objective = clinicalObjectiveForSection(input.h2, input.topic);
  const h3Block =
    input.h3 && input.h3.length
      ? `Optional <h3> subheads (use only if helpful; may reorder):\n${JSON.stringify(input.h3, null, 2)}`
      : "";
  const bulletBlock =
    input.outlineBullets && input.outlineBullets.length
      ? `Planner bullets for this section (expand into unique prose; do not paste verbatim if awkward):\n${JSON.stringify(input.outlineBullets, null, 2)}`
      : "";

  const audienceBlock = input.audienceBulletMode
    ? `
**AUDIENCE / TRACK SECTION (narrow scope):**
- After the required <h2>, output **only** a <ul> with **3–5** <li> items.
- Each <li> must be **≤ 35 words**, concrete, and **different** from other roles' typical bullets.
- **No** long introductory <p> paragraphs in this section.`
    : `
**DEPTH:**
- Target **~140–240 words** of substantive teaching in <p> blocks (plus lists/tables if useful).
- Include mechanism → bedside → nursing action where the heading allows.`;

  return `${pathwayEditorialContext(input.exam)}

${countryEditorialContext(input.country)}

**Article context (do not output as <h1>):** ${input.pageH1}
**Core topic:** ${input.topic}
**Section ${input.sectionIndex + 1} of ${input.sectionTotal}** — generate **only** this block.

**Required first line of your output (verbatim):**
<h2>${escapeForH2Content(input.h2)}</h2>

Template: ${input.template} · Intent: ${input.intent} · Funnel: ${input.funnelStage} · Tone: ${input.tone}
${input.keywords ? `Keywords: ${input.keywords}` : ""}

## Section objective
${objective}
${audienceBlock}

${h3Block}

${bulletBlock}

## Do NOT repeat or paraphrase the following (from earlier sections)
${buildForbiddenReuseBlock(input.forbiddenReuseLines)}

## Internal paths (mention only where natural; marketing paths)
${formatLessonRowsForBodyPrompt(input.plan.suggestedInternalLessons) || "(none)"}

Recommended internal links:
${JSON.stringify(input.plan.recommendedInternalLinks ?? [], null, 2)}

## Hard constraints
- Do not reuse phrasing from other sections.
- Use unique examples and clinical details.
- Do not include meta commentary about studying or exams.
- Do not output any other <h2> besides the required opening line.`;
}

export type FetchControlPanelBodyHtmlParams = {
  plan: BlogControlPanelPlan;
  topic: string;
  exam: string;
  country: "US" | "CA" | "unspecified";
  template: BlogPostTemplate;
  intent: BlogPostIntent;
  funnelStage: BlogFunnelStage;
  tone: "professional" | "supportive" | "direct";
  keywords?: string;
  selectedTitle?: string;
  openAiUser?: string;
  /**
   * When set (e.g. pipeline body repair), merged into the section system prompt so the model
   * addresses validation failures while still following isolation rules.
   */
  sectionGenerationRepairNote?: string;
};

/**
 * Generate long-form HTML by isolated section completions (pathophysiology profile only; caller should gate).
 */
export async function fetchControlPanelBodyHtmlSectionIsolated(params: FetchControlPanelBodyHtmlParams): Promise<string> {
  const pageH1 = (params.selectedTitle?.trim() || params.plan.h1 || params.plan.titleOptions[0] || params.topic).trim();
  const titleGate = validateBlogTitleForBodyGeneration(pageH1);
  if (!titleGate.ok) {
    throw new Error(`blog_title_not_ready:${titleGate.reason}`);
  }

  const outline = params.plan.outline.filter((row) => row.h2?.trim());
  if (outline.length < 2) {
    throw new Error("Section-isolated generation requires at least two outline headings");
  }

  const systemPrompt = params.sectionGenerationRepairNote?.trim()
    ? `${SECTION_ISOLATED_SYSTEM}\n\n## Revision priority (from automated checks)\n${params.sectionGenerationRepairNote.trim().slice(0, 6000)}`
    : SECTION_ISOLATED_SYSTEM;

  const forbiddenReuseLines: string[] = [];
  const parts: string[] = [];
  let accumulated = "";

  for (let i = 0; i < outline.length; i++) {
    const row = outline[i]!;
    const h2 = row.h2.trim();
    const audienceBulletMode = isAudienceSplinterHeading(h2);
    let chosenHtml = "";
    let finalSimilarity = 0;
    let didRegenerate = false;

    for (let attempt = 0; attempt <= MAX_REGENERATIONS_PER_SECTION; attempt++) {
      const regenHint =
        attempt > 0
          ? `\n\n**REGENERATION:** Your prior prose overlapped earlier sections. Rewrite with **different** sentence stems, examples, and mechanism wording. Keep the same required <h2> line first.`
          : "";

      const user = `${buildSectionUserPrompt({
        plan: params.plan,
        topic: params.topic,
        exam: params.exam,
        country: params.country,
        template: params.template,
        intent: params.intent,
        funnelStage: params.funnelStage,
        tone: params.tone,
        keywords: params.keywords,
        pageH1,
        sectionIndex: i,
        sectionTotal: outline.length,
        h2,
        h3: row.h3,
        outlineBullets: row.bullets,
        forbiddenReuseLines,
        audienceBulletMode,
      })}${regenHint}`;

      const response = await openAiChatCompletion({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: user },
        ],
        temperature: 0.38,
        maxTokens: 3072,
        user: params.openAiUser ? `${params.openAiUser}-s${i}-a${attempt}` : undefined,
      });

      let html = response.content.trim();
      const visible = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      if (!html.length || !visible.length) {
        html = blogBodyHtmlWhenAiReturnedEmpty();
      }

      const mustOpen = `<h2>${escapeForH2Content(h2)}</h2>`;
      const rest = html.replace(/^\s*<h2\b[^>]*>[\s\S]*?<\/h2>\s*/i, "").trim();
      html = `${mustOpen}\n${rest}`;

      const similarity = maxJaccardOfNewSectionVsPriorSections(html, accumulated);
      finalSimilarity = similarity;
      const over = similarity > SECTION_JACCARD_REGENERATE_THRESHOLD;
      if (attempt > 0) didRegenerate = true;

      if (!over || attempt === MAX_REGENERATIONS_PER_SECTION) {
        chosenHtml = html;
        if (over && attempt === MAX_REGENERATIONS_PER_SECTION) {
          safeServerLog("blog_body", "[SECTION_GENERATION]", {
            section_index: String(i),
            h2: h2.slice(0, 96),
            note: "similarity_still_high_after_max_regen",
            SIMILARITY_SCORE: similarity.toFixed(4),
            REGENERATED: "true",
          });
        }
        break;
      }
    }

    safeServerLog("blog_body", "[SECTION_GENERATION]", {
      section_index: String(i),
      h2: h2.slice(0, 96),
      SIMILARITY_SCORE: finalSimilarity.toFixed(4),
      REGENERATED: String(didRegenerate),
    });

    parts.push(chosenHtml.trim());
    accumulated = parts.join("\n\n");
    forbiddenReuseLines.push(...collectMemoryLinesFromSection(chosenHtml));
  }

  const bodyHtml = parts.join("\n\n").trim();
  const visible = bodyHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!bodyHtml.length || !visible.length) {
    return blogBodyHtmlWhenAiReturnedEmpty();
  }
  if (bodyHtml.length < 1800) {
    throw new Error("Model returned too little HTML for the article body (section-isolated path)");
  }
  return bodyHtml;
}
