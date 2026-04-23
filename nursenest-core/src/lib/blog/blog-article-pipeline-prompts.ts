import type { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import { formatLessonRowsForBodyPrompt } from "@/lib/blog/blog-internal-lesson-links";
import { countryEditorialContext, pathwayEditorialContext } from "@/lib/blog/blog-article-pathway-context";

const ANTI_FILLER = `Quality bar (non-negotiable):
- No generic filler ("in today's world", "it is important to note", "mastering this will unlock success", vague motivation).
- Every major section must include concrete nursing content: assessment findings, nursing actions, rationales tied to patient safety, or exam-style decision rules.
- Prefer specific cues (vitals, labs, behaviors) and "if you see X, think Y" patterns over abstract advice.
- Do not invent pass rates, facility policies, or statistics. If uncertain, stay descriptive and conservative.`;

const PEOPLE_FIRST_SEO = `People-first SEO (non-negotiable):
- Write for nurses and students preparing for licensure exams — clarity and usefulness first; do not optimize wording purely to game rankings.
- Never promise or imply guaranteed search rankings, "#1 on Google", or similar claims. Avoid manipulative patterns (keyword stuffing, hidden text, doorway-style repetition).
- Titles and meta copy should sound trustworthy and specific to the clinical topic, not like generic SEO spam.`;

export function buildStructuredPlanSystemPrompt(): string {
  return `You are a senior clinical-education editor for NurseNest (nursing licensure exam prep).
Return a single JSON object only (no markdown fences, no commentary).

Required keys (exact names):
- titleOptions: string[] (3-5 titles; at least two must name the exam track or audience, e.g. NCLEX, REx-PN, FNP where applicable)
- h1: string — the on-page main headline (clear, human, may be slightly shorter than SEO title; not keyword-stuffed)
- recommendedSlug: kebab-case, 3-80 chars
- metaTitle: <=60 chars; must include a specific clinical or exam angle from this topic (not "Nursing tips" / "Everything you need" style platitudes)
- metaDescription: 120-155 chars; must restate a concrete promise from the outline (skills, decisions, or errors addressed) and the exam audience when known
- suggestedExcerpt: 140-220 chars; standalone blurb for blog cards / social — no "click here", no duplicate of metaDescription verbatim; name the topic + payoff
- optional openGraphTitle: <=60 chars if you need a punchier share title than metaTitle (else omit)
- optional openGraphDescription: <=110 chars for social preview (else omit)
- optional canonicalPath: only use "/blog/{recommendedSlug}" when it matches recommendedSlug exactly; otherwise omit (site defaults canonical to the live slug)
- optional seoFocusKeywords: string[] (3-8) — include exam + 2-4 clinical nouns from the article (no vague words like "guide", "ultimate", "complete" alone)
- outline: array of { "h2", optional "h3"[], optional "bullets"[] } — 4-7 sections; H2s must be topic-specific (not "Introduction" only)
- suggestedInternalLessons: { "label", "suggestedPath", optional "rationale", optional "linkKind" ("lesson"|"lessons_hub"|"question_bank"|"topic_cluster"|"practice_exams"|"practice_programmatic"|"general") }[] — root-relative paths: pathway lessons + /questions hubs, /practice-exams, programmatic practice landings from the brief; match country (/us/ vs /canada/); no /app/ or /api/
- faqs: { "q", "a" }[] — 4-7 items; answers must teach a concrete exam-relevant point
- breadcrumbs: { "label", "href" }[] — **exact pattern** for NurseNest marketing: [ { "label": "Home", "href": "/" }, { "label": "Blog", "href": "/blog" }, optional middle crumbs with root-relative hrefs only if they are real site paths, then { "label": "<article H1 or shorter>", "href": "/blog/<recommendedSlug>" } ]. Never use /app/, /api/, or external URLs. Last href must be /blog/<recommendedSlug>.
- imagePlacements: { optional "slotKey" (e.g. hero, inline_1), optional "role" (hero|inline), "section", "promptIdea", "altIdea", optional "captionIdea" }[] — one hero + 1-3 optional inline; clinically relevant, NurseNest brand (professional nursing education, dignified, inclusive; no gore, no identifiable patients, no real institutional logos)
- apaSourceStubs: objects with optional authors[], year, title, source, publisher, url, doi, authority (regulator|guideline_body|peer_reviewed|academic_hospital|association|general_web|low_authority) — **brainstorming only**; these are NOT published as bibliography and must NOT be treated as verified. Never fabricate DOIs, URLs, journal names, or volume/issue/page numbers. Use placeholders only where clearly marked as uncertain.
- keyTakeaways: 3-5 bullets with specific clinical or test-taking substance
- optional featuredSnippetHint: <=300 chars
- optional schemaOpportunities: array of { "type", "rationale" } — suggest 1-4 JSON-LD types that could apply **if** metadata is validated (BlogPosting is default on public pages; add FAQPage only when FAQs are substantive; BreadcrumbList when crumb trail is stable; HowTo only if steps are explicit and safe). Rationale must be one sentence — no fabricated review scores or ratings.
- internalAnchorOpportunities: { "phrase", "suggestedAnchorText", "targetSuggestedPath", optional "rationale" }[] — 4-12 editorial suggestions for **future** in-body links. "phrase" is a short literal readers would see in prose; "targetSuggestedPath" must be a real NurseNest marketing path (e.g. /blog/..., /us/rn/.../lessons/..., /questions, /practice-exams) — never /app/ or /api/. Prefer destinations already listed or strongly implied by suggestedInternalLessons.

${ANTI_FILLER}

${PEOPLE_FIRST_SEO}
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
Output valid HTML only: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <table>, <thead>, <tbody>, <tr>, <th>, <td>. No markdown. No <h1>.

${ANTI_FILLER}

${PEOPLE_FIRST_SEO}

Rules:
- Do **not** output <img> tags or empty image placeholders. Inline visuals are attached later in the CMS; prose may reference concepts only.
- Follow the outline order; expand each H2 with substantive paragraphs and, where useful, bullets.
- For comparison topics (X vs Y, differential diagnosis, syndrome contrasts), include at least one concise comparison table.
- Include a short "Clinical pearls" section with concrete exam-day pattern recognition cues.
- Include a short "NCLEX-style tips" section with test-taking heuristics tied to this topic.
- Include <h2>Key takeaways</h2> (bullet list) and <h2>FAQs</h2> using the supplied FAQ items (you may tighten wording slightly).
- Include <h2>Related study paths</h2> — one short paragraph weaving in the internal paths as plain text (lessons, question bank hub, flashcards hub, practice exams directory — never raw /app/ URLs).
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
Minimum body length: 1200 words after stripping HTML tags.

OUTLINE:
${JSON.stringify(params.plan.outline, null, 2)}

FAQs:
${JSON.stringify(params.plan.faqs, null, 2)}

Key takeaways to reflect:
${JSON.stringify(params.plan.keyTakeaways, null, 2)}

Internal paths to mention (non-removed, effective URLs only):
${formatLessonRowsForBodyPrompt(params.plan.suggestedInternalLessons) || "(none)"}`;
}
