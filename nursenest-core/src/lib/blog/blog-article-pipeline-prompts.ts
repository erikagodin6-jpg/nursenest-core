import type { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import { formatLessonRowsForBodyPrompt } from "@/lib/blog/blog-internal-lesson-links";
import { countryEditorialContext, pathwayEditorialContext } from "@/lib/blog/blog-article-pathway-context";
import { isLongFormPathophysiologyProfile } from "@/lib/blog/blog-longform-nursing-contract";

const ANTI_FILLER = `Quality bar (non-negotiable):
- No generic filler ("in today's world", "it is important to note", "mastering this will unlock success", vague motivation).
- Every major section must include concrete nursing content: assessment findings, nursing actions, rationales tied to patient safety, or exam-style decision rules.
- Prefer specific cues (vitals, labs, behaviors) and "if you see X, think Y" patterns over abstract advice.
- Do not invent pass rates, facility policies, or statistics. If uncertain, stay descriptive and conservative.`;

const PEOPLE_FIRST_SEO = `People-first SEO (non-negotiable):
- Write for nurses and students preparing for licensure exams — clarity and usefulness first; do not optimize wording purely to game rankings.
- Never promise or imply guaranteed search rankings, "#1 on Google", or similar claims. Avoid manipulative patterns (keyword stuffing, hidden text, doorway-style repetition).
- Titles and meta copy should sound trustworthy and specific to the clinical topic, not like generic SEO spam.`;

const LONGFORM_PATHOPHYSIOLOGY_PLAN_ADDENDUM = `## Long-form pathophysiology / disease-process mode (this article)
When this mode applies, the JSON must satisfy a **stricter editorial contract** (server-validated):
- **outline**: **10–14** H2 sections; each H2 must be topic-specific and map to a **distinct** teaching job (no copy-pasted section bodies later). Cover this arc (titles may vary; every bullet must appear as its own H2 with unique bullets/paragraphs planned):
  1) Plain-language summary / orientation for learners
  2) Pathophysiology mechanism (stepwise causal chain for **this** disease)
  3) Key signs and symptoms (each tied back to mechanism, not generic lists)
  4) Assessment priorities (focused nursing assessment, red-flag vitals/inspection cues)
  5) Diagnostics and labs (what is ordered, why, how to interpret trends — no fabricated numeric cutoffs)
  6) Nursing interventions (priorities, monitoring, safety, delegation boundaries)
  7) Medications and treatment considerations (classes, monitoring, education — no invented dosing)
  8) Patient teaching (home care, adherence, foot/skin care when relevant, when to call the care team)
  9) NCLEX / REx-PN exam traps (distractors, prioritization, "best next action" patterns)
  10) Escalation red flags (when to escalate, emergency vs clinic urgency)
  11) Mini case application (short vignette + questions that reference **this** topic only)
  12) Key takeaways (may mirror keyTakeaways JSON but still unique prose in HTML)
- **faqs**: **at least 4** items; answers must connect mechanism → bedside decision or common exam trap. Do **not** reuse generic FAQ text across unrelated diseases; vary question stems and traps.
- **suggestedInternalLessons** + **internalAnchorOpportunities** + **recommendedInternalLinks** together must provide **≥5** study destinations. Include a mix when relevant: pathway lessons, /questions, /practice-exams, flashcards hub, adaptive/CAT practice hints (marketing paths only — never /app/ or /api/).
- **recommendedInternalLinks**: array of { "targetType", "suggestedPath", "anchorText", optional "reason", optional "needsReview" (true when path is best-effort) }. targetType examples: lesson, flashcards_hub, question_bank, practice_exams, adaptive_cat, blog, topic_hub. Use **needsReview: true** when the path is plausible but not certain.
- **sourceCandidates**: **≥3** rows — each { "title", optional "url", optional "sourceType", optional "notes" }. **Never invent URLs, DOIs, journal volumes, or author lists.** If unsure, omit "url" and explain in "notes". These feed editorial verification only; they are **not** published as APA 7 until verified in CMS.
- **primaryKeyword** (required): one natural long-tail phrase; must also read naturally in **metaTitle**, **metaDescription**, **h1**, intro context, and at least one **outline** H2 (paraphrases welcome — no stuffing).
- **secondaryKeywordPhrases** (required): **≥3** strings (aim 3–8) — semantic variants / subtopics; no duplicate of primaryKeyword alone.
- **breadcrumbs** (required): **≥4** entries, exact opening pattern: [ { "label": "Home", "href": "/" }, { "label": "Blog", "href": "/blog" }, { "label": "<category hub such as Med-Surg / Cardiovascular / Fundamentals>", "href": "<real hub path under /blog or pathway marketing path>" }, { "label": "<short article label>", "href": "/blog/<recommendedSlug>" } ]. Root-relative only; never /app/ or /api/ or external URLs.
- **articleSummary** (optional but recommended): **≥80** characters answering the query in plain language for editors (if omitted, **suggestedExcerpt** must still be **≥80** chars and query-focused).
- **searchIntent**: short label (e.g. informational / exam-prep / mechanism-deep-dive).
- **twitterCardTitle** / **twitterCardDescription** (optional): concise Twitter card; omit to fall back to OG/meta.
- **schemaOpportunities** (required): include entries with **type** "BlogPosting", "BreadcrumbList", and "FAQPage" (each with a one-sentence rationale). No fake ratings, authors, or institutions.
- **schemaNotes** (optional): { "article": {}, "breadcrumb": {}, "faq": {} } — JSON-serializable hints for engineering (use neutral NurseNest brand voice; do not invent a physician byline).
- **needsReviewFlags** (required): include **"apa_source_review_required"** whenever the model is not attaching admin-verified sources (normal for first draft).
- **editorialNotes** (optional): short strings for editors (e.g. Canada-specific scope, exam track nuance).
- **apaSourceStubs**: brainstorming only — **never** present stubs as verified APA 7. Do **not** output a "referencesApa7" key; published APA lines come only from admin-verified sources in the CMS.
- **imagePlacements** (required): **≥1** row; each **promptIdea** must be a **detailed** phrase (**≥20 characters**); include **section** and **altIdea**. Never null, undefined, empty strings, or placeholder text — if no image is needed, still return one safe generic educational row. Example shape (use your own topic-specific copy; lengths must satisfy the rules above):
  {
    "imagePlacements": [
      {
        "promptIdea": "clinical nursing education illustration showing patient assessment and care planning",
        "section": "Article overview",
        "altIdea": "Clinical nursing education illustration supporting article content"
      }
    ]
  }
- **Country CA**: when the brief targets Canada, foreground Canadian regulatory / practice context **where it genuinely changes** nursing implications; keep physiology universal unless evidence-based localization applies.`;

export function buildStructuredPlanSystemPrompt(ctx?: { template: BlogPostTemplate; intent: BlogPostIntent }): string {
  const longform =
    ctx && isLongFormPathophysiologyProfile(ctx) ? `\n\n${LONGFORM_PATHOPHYSIOLOGY_PLAN_ADDENDUM}` : "";
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
- outline: array of { "h2", optional "h3"[], optional "bullets"[] } — typically 4-7 sections (see pathophysiology addendum for **6–10** when that mode applies); H2s must be topic-specific (not "Introduction" only)
- suggestedInternalLessons: { "label", "suggestedPath", optional "rationale", optional "linkKind" ("lesson"|"lessons_hub"|"question_bank"|"topic_cluster"|"practice_exams"|"practice_programmatic"|"flashcards_hub"|"adaptive_cat"|"study_plan"|"general") }[] — root-relative paths: pathway lessons + /questions hubs, /practice-exams, programmatic practice landings from the brief; match country (/us/ vs /canada/); no /app/ or /api/
- faqs: { "q", "a" }[] — 4-7 items; answers must teach a concrete exam-relevant point
- breadcrumbs: { "label", "href" }[] — **exact pattern** for NurseNest marketing: [ { "label": "Home", "href": "/" }, { "label": "Blog", "href": "/blog" }, optional middle crumbs with root-relative hrefs only if they are real site paths, then { "label": "<article H1 or shorter>", "href": "/blog/<recommendedSlug>" } ]. Never use /app/, /api/, or external URLs. Last href must be /blog/<recommendedSlug>.
- imagePlacements: **REQUIRED** non-empty array (minimum **1** object). **Never** omit this key, return null, or use []. Each object MUST include:
  - **promptIdea**: string, **≥20 characters**, vivid and specific (what to illustrate — e.g. "nurse assessing patient with heart failure in hospital setting"). Never "", null, undefined, or a vague one-word token. If unsure, use: "clinical nursing education illustration showing patient assessment and care planning"
  - **section**: string (which article section this supports; ≥2 chars preferred)
  - **altIdea**: string (accessibility description; ≥5 chars)
  - optional **slotKey** (e.g. hero, inline_1), optional **role** ("hero"|"inline"), optional **captionIdea**
  Target one **hero** + 1–3 optional **inline** ideas; clinically relevant, NurseNest brand (professional nursing education, dignified, inclusive; no gore, no identifiable patients, no real institutional logos). If unsure, still output one valid row using a generic but concrete medical illustration prompt (never empty).
- apaSourceStubs: objects with optional authors[], year, title, source, publisher, url, doi, authority (regulator|guideline_body|peer_reviewed|academic_hospital|association|general_web|low_authority) — **brainstorming only**; these are NOT published as bibliography and must NOT be treated as verified. Never fabricate DOIs, URLs, journal names, or volume/issue/page numbers. Use placeholders only where clearly marked as uncertain.
- keyTakeaways: 3-5 bullets with specific clinical or test-taking substance
- optional featuredSnippetHint: <=300 chars
- optional schemaOpportunities: array of { "type", "rationale" } — suggest 1-4 JSON-LD types that could apply **if** metadata is validated (BlogPosting is default on public pages; add FAQPage only when FAQs are substantive; BreadcrumbList when crumb trail is stable; HowTo only if steps are explicit and safe). Rationale must be one sentence — no fabricated review scores or ratings.
- internalAnchorOpportunities: { "phrase", "suggestedAnchorText", "targetSuggestedPath", optional "rationale" }[] — 4-12 editorial suggestions for **future** in-body links. "phrase" is a short literal readers would see in prose; "targetSuggestedPath" must be a real NurseNest marketing path (e.g. /blog/..., /us/rn/.../lessons/..., /questions, /practice-exams) — never /app/ or /api/. Prefer destinations already listed or strongly implied by suggestedInternalLessons.

Optional keys (include when data is real or honestly uncertain — never fabricate citations):
- primaryKeyword, secondaryKeywordPhrases[], searchIntent, twitterCardTitle, twitterCardDescription
- recommendedInternalLinks[], sourceCandidates[], needsReviewFlags[], schemaNotes

${ANTI_FILLER}

${PEOPLE_FIRST_SEO}
Do not invent statistics or pass rates.${longform}`;
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

High-intent SEO contract: Titles and H1 options must stay **specific** to nursing exam decisions (prioritization, assessment, interventions, labs, meds, delegation). Do not drift into generic "Understanding…", "Overview of…", or "Guide to…" framing — mirror the query style of the topic line (questions, vs comparisons, nurse-first actions, labs explained for nurses).

${pathwayEditorialContext(params.exam)}

${countryEditorialContext(params.country)}

Article template: ${params.template}
Intent: ${params.intent}
Funnel stage: ${params.funnelStage}
Tone: ${params.tone}
${params.keywords ? `Keyword targets: ${params.keywords}` : ""}
${params.targetKeyword ? `Primary target keyword: ${params.targetKeyword}` : ""}
${params.keywordCluster ? `Keyword cluster: ${params.keywordCluster}` : ""}
${
  isLongFormPathophysiologyProfile({ template: params.template, intent: params.intent })
    ? "\nThis run is **long-form pathophysiology / disease-process mode**: the plan JSON and final HTML must satisfy the stricter server contract (deep mechanisms, nursing implications, ≥4 FAQs, rich internal linking, no fake APA)."
    : ""
}`;
}

export type BlogArticleBodyPromptContext = {
  template: BlogPostTemplate;
  intent: BlogPostIntent;
  /** Default true: include a dedicated Clinical pearls H2 in standard (non–long-form) articles. */
  includeClinicalPearls?: boolean;
  /** Default true: render FAQs as an H2 in HTML for standard articles (long-form pathophysiology always omits FAQ H2 in body). */
  includeFaqsInBody?: boolean;
};

export function buildArticleBodySystemPrompt(ctx?: BlogArticleBodyPromptContext): string {
  const pathophysiologyLongForm = Boolean(ctx && isLongFormPathophysiologyProfile(ctx));
  const includePearls = ctx?.includeClinicalPearls !== false;
  const includeFaqsInBody = ctx?.includeFaqsInBody !== false;
  const longformBody = pathophysiologyLongForm
    ? `
## Pathophysiology long-form body rules (this article)
- Mirror the **outline H2 order** as <h2> sections (do not skip a planned section).
- Target **~120–250 unique words per major H2** of substantive teaching; **never** reuse the same <p> paragraph under different H2 headings (automated quality review rejects duplicate blocks).
- In each major section: **mechanism → clinical picture → nursing action / monitoring** (at least one paragraph chain) with **topic-specific** facts (labs, exam findings, foot care, glucose patterns, etc. as appropriate).
- Use **plain English first**, then precise terms; define abbreviations on first use.
- **Safety / uncertainty**: use measured language ("often", "may", "typically") — no false certainty; no fabricated trial results or statistics.
- Include <h2>Why it matters in nursing practice</h2> **or** an equivalently titled block that is clearly nursing-priority content (if not already an H2 title from the outline, add this H2 once).
- Vary sentence openings; avoid boilerplate openers ("In today's fast-paced healthcare…", "In conclusion…").
- Include <h2>Key takeaways</h2> with a bullet list (unique prose; must not repeat paragraphs from other H2 sections).
- **Do not** embed <h2>FAQs</h2>, <h2>Frequently asked questions</h2>, or <h2>References</h2> in HTML — FAQs live in structured JSON and references render from verified APA lines; duplicating them fails quality review.
- Use **APA-style parenthetical in-text citations** (Organization or lead author, Year) in mechanistic and clinical sections — aim for several across the article.
- **Paywall-safe lesson language** only (never promise a free full lesson). When linking study paths, include once: "Want more practice? NurseNest members can review the related lesson, flashcards, and rationale-based questions."`
    : "";
  const faqBodyRule = pathophysiologyLongForm
    ? `- Do **not** put FAQ or References headings in the HTML body (see pathophysiology rules above).`
    : includeFaqsInBody
      ? `- Include <h2>Key takeaways</h2> (bullet list) and <h2>FAQs</h2> using the supplied FAQ items (you may tighten wording slightly).`
      : `- Include <h2>Key takeaways</h2> (bullet list). Do **not** render <h2>FAQs</h2> in the HTML body (FAQs are stored separately for this run).`;
  const pearlRule = includePearls
    ? `- Include a short <h2>Clinical pearls</h2> section with concrete exam-day pattern recognition cues.`
    : `- Do **not** add a dedicated <h2>Clinical pearls</h2> heading; you may still weave 1–2 pearl bullets inside other sections.`;
  return `You write long-form, SEO-aware HTML for NurseNest nursing licensure exam prep.
Output valid HTML only: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <table>, <thead>, <tbody>, <tr>, <th>, <td>. No markdown. No <h1>.

${ANTI_FILLER}

${PEOPLE_FIRST_SEO}

Rules:
- Do **not** output <img> tags or empty image placeholders. Inline visuals are attached later in the CMS; prose may reference concepts only.
- Follow the outline order; expand each H2 with substantive paragraphs and, where useful, bullets.
- For comparison topics (X vs Y, differential diagnosis, syndrome contrasts), include at least one concise comparison table.
${pearlRule}
- Include a short <h2>NCLEX-style tips</h2> section with test-taking heuristics tied to this topic.
${faqBodyRule}
- Include <h2>Related study paths</h2> — one short paragraph weaving in the internal paths as plain text (lessons, question bank hub, flashcards hub, practice exams directory — never raw /app/ URLs).
- Use **APA-style parenthetical in-text citations** for substantive clinical claims, e.g. (Centers for Disease Control and Prevention, 2024) or (National Council of State Boards of Nursing, 2023) — organization or lead author + comma + year inside parentheses. Include **several** across the article; prefer names that can align with CDC, WHO, NIH/MedlinePlus, NCBI/StatPearls, or major nursing associations.
- **Paywall-safe lesson language**: never imply the full lesson is free. Prefer: "Review the full lesson inside NurseNest", "Members can continue with the related lesson", or "Related NurseNest lesson: …". Do not promise unrestricted access to paid pathways.
- Add **one short paragraph** near the middle or end that includes this member CTA (you may split into two sentences; keep the meaning): "Want more practice? NurseNest members can review the related lesson, flashcards, and rationale-based questions."
- Educational exam-prep framing only — no directive treatment orders for real patients.
- No fabricated statistics or pass-rate claims.
- Do **not** cite specific journals, studies, DOIs, or URLs in the prose unless they will appear in the admin-verified reference list supplied separately to the CMS. Prefer generic phrasing ("clinical practice resources", "accrediting bodies") when no verified source is attached.${longformBody}`;
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
Minimum body length: **≥1200 words** of substantive teaching after stripping HTML (FAQ HTML and reference blocks still count toward teaching depth, but do not pad with empty paragraphs). If you run short, expand mechanism and nursing implication paragraphs — not repetition of headings.
${
  isLongFormPathophysiologyProfile({ template: params.template, intent: params.intent })
    ? "\n**Pathophysiology long-form:** keep FAQs **only** in the JSON block above — do **not** render <h2>FAQs</h2> or <h2>References</h2> in the HTML. Each planned H2 must contain **new** clinical detail; do not paste the same paragraph under multiple headings."
    : ""
}

OUTLINE:
${JSON.stringify(params.plan.outline, null, 2)}

FAQs:
${JSON.stringify(params.plan.faqs, null, 2)}

Key takeaways to reflect:
${JSON.stringify(params.plan.keyTakeaways, null, 2)}

Internal paths to mention (non-removed, effective URLs only):
${formatLessonRowsForBodyPrompt(params.plan.suggestedInternalLessons) || "(none)"}

Recommended internal links (weave naturally; mark needsReview paths as tentative in prose if needed):
${JSON.stringify(params.plan.recommendedInternalLinks ?? [], null, 2)}`;
}
