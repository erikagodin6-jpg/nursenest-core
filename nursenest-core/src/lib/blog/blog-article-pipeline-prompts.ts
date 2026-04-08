import type { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import { formatLessonRowsForBodyPrompt } from "@/lib/blog/blog-internal-lesson-links";
import { countryEditorialContext, pathwayEditorialContext } from "@/lib/blog/blog-article-pathway-context";

const ANTI_FILLER = `Quality bar (non-negotiable):
- No generic filler ("in today's world", "it is important to note", "mastering this will unlock success", vague motivation).
- Every major section must include concrete nursing content: assessment findings, nursing actions, rationales tied to patient safety, or exam-style decision rules.
- Prefer specific cues (vitals, labs, behaviors) and "if you see X, think Y" patterns over abstract advice.
- Do not invent pass rates, facility policies, or statistics. If uncertain, stay descriptive and conservative.`;

export function buildStructuredPlanSystemPrompt(): string {
  return `You are a senior clinical-education editor for NurseNest (nursing licensure exam prep).
Return a single JSON object only (no markdown fences, no commentary).

Required keys (exact names):
- titleOptions: string[] (3-5 titles; at least two must name the exam track or audience, e.g. NCLEX, REx-PN, FNP where applicable)
- h1: string — the on-page main headline (clear, human, may be slightly shorter than SEO title; not keyword-stuffed)
- recommendedSlug: kebab-case, 3-80 chars
- metaTitle: <=60 chars, primary intent near start
- metaDescription: 120-155 chars, specific benefit + audience
- outline: array of { "h2", optional "h3"[], optional "bullets"[] } — 4-7 sections; H2s must be topic-specific (not "Introduction" only)
- suggestedInternalLessons: { "label", "suggestedPath", optional "rationale", optional "linkKind" ("lesson"|"lessons_hub"|"question_bank"|"topic_cluster"|"general") }[] — root-relative paths like /us/rn/nclex-rn/lessons/..., /.../questions, or /blog/...; match pathway + country from the brief; no /app/ or /api/
- faqs: { "q", "a" }[] — 4-7 items; answers must teach a concrete exam-relevant point
- breadcrumbs: { "label", "href" }[] — logical trail from Home
- imagePlacements: { optional "slotKey" (e.g. hero, inline_1), optional "role" (hero|inline), "section", "promptIdea", "altIdea", optional "captionIdea" }[] — one hero + 1-3 optional inline; clinically relevant, NurseNest brand (professional nursing education, dignified, inclusive; no gore, no identifiable patients, no real institutional logos)
- apaSourceStubs: objects with optional authors[], year, title, source, publisher, url, doi, authority (regulator|guideline_body|peer_reviewed|academic_hospital|association|general_web|low_authority) — **brainstorming only**; these are NOT published as bibliography and must NOT be treated as verified. Never fabricate DOIs, URLs, journal names, or volume/issue/page numbers. Use placeholders only where clearly marked as uncertain.
- keyTakeaways: 3-5 bullets with specific clinical or test-taking substance
- optional featuredSnippetHint: <=300 chars

${ANTI_FILLER}
Do not invent statistics or pass rates.`;
}

export function buildStructuredPlanUserPrompt(params: {
  topic: string;
  exam: string;
  country: "US" | "CA" | "unspecified";
  template: BlogPostTemplate;
  intent: BlogPostIntent;
  funnelStage: BlogFunnelStage;
  tone: "professional" | "supportive" | "direct";
  keywords?: string;
  targetKeyword?: string;
  keywordCluster?: string;
}): string {
  return `Topic / focus: ${params.topic}

${pathwayEditorialContext(params.exam)}

${countryEditorialContext(params.country)}

Article template: ${params.template}
Intent: ${params.intent}
Funnel stage: ${params.funnelStage}
Tone: ${params.tone}
${params.keywords ? `Keyword targets: ${params.keywords}` : ""}
${params.targetKeyword ? `Primary target keyword: ${params.targetKeyword}` : ""}
${params.keywordCluster ? `Keyword cluster: ${params.keywordCluster}` : ""}`;
}

export function buildArticleBodySystemPrompt(): string {
  return `You write long-form, SEO-aware HTML for NurseNest nursing licensure exam prep.
Output valid HTML only: <h2>, <h3>, <p>, <ul>, <li>, <strong>. No markdown. No <h1>.

${ANTI_FILLER}

Rules:
- Do **not** output <img> tags or empty image placeholders. Inline visuals are attached later in the CMS; prose may reference concepts only.
- Follow the outline order; expand each H2 with substantive paragraphs and, where useful, bullets.
- Include <h2>Key takeaways</h2> (bullet list) and <h2>FAQs</h2> using the supplied FAQ items (you may tighten wording slightly).
- Include <h2>Related study paths</h2> — one short paragraph weaving in the internal paths as plain text.
- Educational exam-prep framing only — no directive treatment orders for real patients.
- No fabricated statistics or pass-rate claims.
- Do **not** cite specific journals, studies, DOIs, or URLs in the prose unless they will appear in the admin-verified reference list supplied separately to the CMS. Prefer generic phrasing ("clinical practice resources", "accrediting bodies") when no verified source is attached.`;
}

export function buildArticleBodyUserPrompt(params: {
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
}): string {
  return `${pathwayEditorialContext(params.exam)}

${countryEditorialContext(params.country)}

On-page H1 (do not output as <h1> in HTML; use only as thematic anchor): ${params.pageH1}
Core topic: ${params.topic}
Exam / track label: ${params.exam}
Template: ${params.template} · Intent: ${params.intent} · Funnel: ${params.funnelStage} · Tone: ${params.tone}
${params.keywords ? `Keywords: ${params.keywords}` : ""}

OUTLINE:
${JSON.stringify(params.plan.outline, null, 2)}

FAQs:
${JSON.stringify(params.plan.faqs, null, 2)}

Key takeaways to reflect:
${JSON.stringify(params.plan.keyTakeaways, null, 2)}

Internal paths to mention (non-removed, effective URLs only):
${formatLessonRowsForBodyPrompt(params.plan.suggestedInternalLessons) || "(none)"}`;
}
