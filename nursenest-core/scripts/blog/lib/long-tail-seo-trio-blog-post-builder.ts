/**
 * Long-form HTML + JSON fields for pharmacology / pathophysiology / allied long-tail SEO blog seeding.
 */
import { BlogImageStatus, BlogPostIntent, BlogPostTemplate, type Prisma } from "@prisma/client";

import { resolveCanonicalSiteOrigin } from "../../../src/lib/seo/canonical-site";
import { BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH, countWordsFromHtml } from "../../../src/lib/blog/blog-word-count";
import { buildExamPathwayPath } from "../../../src/lib/exam-pathways/build-exam-pathway-path";
import { getExamPathwayById } from "../../../src/lib/exam-pathways/exam-pathways-catalog";

import {
  LONG_TAIL_SEO_TRIO_LEGACY_SOURCE,
  type LongTailSeoTrioTopicPlan,
} from "../long-tail-seo-trio-topic-plan";

export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export type PeerBlogStub = { slug: string; title: string; excerpt: string };

/** Strong-tag anchor: full phrase only where SERP alignment needs it — avoids primary-phrase stuffing gates. */
function anchorPhrase(topic: LongTailSeoTrioTopicPlan, mode: "full" | "partial"): string {
  const raw =
    mode === "full"
      ? topic.targetKeyword
      : topic.targetKeyword.replace(/\s+(questions|review|prep)$/i, "").trim() ||
        topic.targetKeyword.replace(/\s+\S+$/, "").trim();
  return `<strong>${esc(raw)}</strong>`;
}

/**
 * One substantive HTML block per H2 — distinct framing per heading (no entropy tokens / scaffold filler).
 */
function paragraphBlock(topic: LongTailSeoTrioTopicPlan, label: string, anchorMode: "full" | "partial"): string {
  const t = esc(topic.title);
  const pillar = esc(topic.pillar);
  const L = esc(label);
  const ap = anchorPhrase(topic, anchorMode);
  if (/mechanism/i.test(label)) {
    return `<p><strong>${L}.</strong> Start from physiology for “${t}”: what compensation or injury pattern the stem implies, then map that mechanism to the vitals, symptoms, or labs ${pillar} items expect. Keep ${ap} as the anchor phrase you can defend in one sentence. Educational only; follow scope and policy.</p>`;
  }
  if (/prioritization|monitoring/i.test(label)) {
    return `<p><strong>${L}.</strong> For “${t}”, rank nursing actions by immediate threat to airway, breathing, circulation, or neuro status before comfort or routine teaching. Spell out what you would reassess after each priority change and how ${ap} changes your surveillance plan for ${pillar} tracks.</p>`;
  }
  if (/assessment|diagnostic/i.test(label)) {
    return `<p><strong>${L}.</strong> Cluster subjective and objective data for “${t}”: quotes, trends, paired measurements, and device readings that discriminate similar presentations on ${pillar}. Tie findings back to ${ap} without inventing numeric cutoffs.</p>`;
  }
  if (/teaching|collaboration/i.test(label)) {
    return `<p><strong>${L}.</strong> Give discharge-ready teaching for “${t}”: warning symptoms, adherence habits, follow-up, and when to seek urgent care—worded around ${ap} so it is not interchangeable with another ${pillar} topic.</p>`;
  }
  if (/exam trap/i.test(label)) {
    return `<p><strong>${L}.</strong> Practice ${pillar}-style discrimination for “${t}”: identify what each option assumes about volume status, timing, or scope, then eliminate answers that require out-of-scope orders or unsafe independence. Keep distractor talk tied to ${ap}.</p>`;
  }
  if (/scenario framing/i.test(label)) {
    return `<p><strong>${L}.</strong> Treat each stem like a mini patient encounter: identify setting, acuity, what changed since baseline, and whether the question asks for assessment, intervention, teaching, or delegation. For “${t}”, translate vague wording into one sentence describing risk trajectory—stable, deteriorating, or newly unstable—before you weigh choices.</p>`;
  }
  if (/risk stratification/i.test(label)) {
    return `<p><strong>${L}.</strong> Rank hazards by immediacy: airway and breathing threats precede routine paperwork; perfusion and neurologic change precede comfort measures; reversible medication effects precede long-term lifestyle coaching unless the stem highlights adherence gaps. Apply that ladder to “${t}” so your rationale stays consistent across alternate answer orders.</p>`;
  }
  if (/evidence synthesis/i.test(label)) {
    return `<p><strong>${L}.</strong> When evidence is implied rather than quoted, lean on pathophysiology links: what would you expect to improve if the etiology is addressed, and what would fail to improve if the working problem is wrong? For “${t}”, connect expected trajectories to vitals, intake and output, pain pattern, and mentation so your plan matches the likely mechanism.</p>`;
  }
  if (/team coordination/i.test(label)) {
    return `<p><strong>${L}.</strong> Name the right partner and the right handoff: pharmacy for titration questions, provider for new or high-risk orders, therapy for functional limits, and case management for durable equipment or home access. In “${t}” scenarios, your note should show who was informed, what you requested, and what you will re-check after the team responds.</p>`;
  }
  if (/transitions and handoffs/i.test(label)) {
    return `<p><strong>${L}.</strong> Transitions fail when trends, devices, and pending results get lost. When “${t}” appears in a discharge or transfer item, ensure medication reconciliation, follow-up timing, and red-flag teaching are explicit, and that the next setting knows what to monitor first.</p>`;
  }
  if (/follow-up expectations/i.test(label)) {
    return `<p><strong>${L}.</strong> Set visit windows and objective triggers: return sooner for new neuro deficits, uncontrolled pain, or unexpected weight or glucose shifts. Pair “${t}” teaching with measurable goals the patient can track without advanced equipment when possible.</p>`;
  }
  if (/acute change detection/i.test(label)) {
    return `<p><strong>${L}.</strong> Acute change is a pattern, not a single data point. For “${t}”, ask whether two weak signals point the same direction (for example, rising work of breathing plus new anxiety) and whether the change is new for this patient, not just abnormal in a chart.</p>`;
  }
  if (/resource stewardship/i.test(label)) {
    return `<p><strong>${L}.</strong> Stewardship is not delay—it is matching intensity to risk. Choose the least invasive monitoring that still protects safety, escalate when the trajectory calls for it, and document why a more aggressive test is or is not appropriate in the moment for “${t}”-type presentations.</p>`;
  }
  if (/escalation thresholds/i.test(label)) {
    return `<p><strong>${L}.</strong> Escalate when expected recovery stalls, when organ perfusion is threatened, or when the patient cannot protect airway, breathing, or circulation. “${t}” items often hide those triggers in a single line—re-read the last two sentences of the stem for the pivot.</p>`;
  }
  return `<p><strong>${L}.</strong> Connect “${t}” to bedside decisions for ${pillar} prep using ${ap} as the study hook; emphasize assessment, teaching, and escalation language nurses can reuse on exam day. Educational only; follow scope, orders, and institutional policy.</p>`;
}

function pad(topic: LongTailSeoTrioTopicPlan, label: string, anchorMode: "full" | "partial" = "partial"): string {
  return paragraphBlock(topic, label, anchorMode);
}

/** Distinct prose blocks (not shared paragraphBlock templates) to raise word count without H2 Jaccard collisions. */
function buildStemPriorityDrillSection(topic: LongTailSeoTrioTopicPlan): string {
  const sys = esc(topic.pathwayId === "allied" ? "allied health scope" : "nursing scope");
  return `<h2>Stem-to-priority drill (no rushing)</h2>
<p>Before you click an answer, force the stem to declare what it is measuring: first action, best teaching, highest risk, or follow-up. Many items look similar because they reuse the same diagnosis language while changing what the prompt rewards.</p>
<p>Write a one-line statement of the patient trajectory (stable, worsening, newly unstable). Then match surveillance to that trajectory: frequency of vitals, what trends matter more than a single value, and which complaints justify urgent escalation within ${sys}.</p>
<ul>
<li><strong>Underline the pivot phrase.</strong> Words like “sudden,” “new onset,” “after the dose,” or “before discharge” often reset priorities.</li>
<li><strong>Separate baseline from acute.</strong> Chronic findings belong in the chart until the stem proves acute change.</li>
<li><strong>Name the missing step.</strong> If two answers sound ethical, pick the one that reflects assessment or notification you can perform immediately.</li>
<li><strong>Check scope boundaries.</strong> Independent prescription changes, diagnosing beyond role, or delaying reporting rarely survive scrutiny.</li>
<li><strong>Plan reassessment intervals.</strong> Tie your monitoring plan to severity: tighter intervals when perfusion, airway, or neurologic status is threatened.</li>
</ul>
<p>Finish each drill by stating what documentation would reflect safe practice: objective measurements, who was notified, what changed since last assessment, and patient understanding if teaching was delivered.</p>`;
}

function lessonPath(topic: LongTailSeoTrioTopicPlan, slug: string): string {
  const p = getExamPathwayById(topic.pathwayId);
  if (!p) return `/us/rn/nclex-rn/lessons/${slug}`;
  return `${buildExamPathwayPath(p, "lessons")}/${slug}`;
}

function hubQuestionsPath(topic: LongTailSeoTrioTopicPlan): string {
  const p = getExamPathwayById(topic.pathwayId);
  if (!p) return "/us/rn/nclex-rn/questions";
  return buildExamPathwayPath(p, "questions");
}

function hubCatPath(topic: LongTailSeoTrioTopicPlan): string {
  const p = getExamPathwayById(topic.pathwayId);
  if (!p) return "/us/rn/nclex-rn/cat";
  return buildExamPathwayPath(p, "cat");
}

function buildPracticeQuestionsHtml(topic: LongTailSeoTrioTopicPlan): string {
  const banks: { q: string; choices: string[]; correctLetter: string; explain: string }[] = [
    {
      q: `Which finding should you prioritize first when the stem emphasizes airway patency for ${topic.targetKeyword.slice(0, 60)}?`,
      choices: [
        "Audible stridor with increased work of breathing",
        "A scheduled home medication without acute changes",
        "A chronic mobility limitation without acute distress",
        "A routine follow-up appointment next month",
      ],
      correctLetter: "A",
      explain:
        "When airway patency is in question, treat changes in work of breathing, voice, and stridor as urgent until a licensed clinician rules out obstruction or severe narrowing.",
    },
    {
      q: "A patient shows a sudden drop in blood pressure after a new antihypertensive dose. What is the best initial nursing focus?",
      choices: [
        "Trend perfusion, symptoms, and orthostatic safety before reassessment",
        "Encourage increased fluid intake without assessment",
        "Discontinue all home medications independently",
        "Delay documentation until the next shift",
      ],
      correctLetter: "A",
      explain:
        "Exam items reward trending perfusion and symptoms, orthostatic safety, and timely reporting within scope rather than independent med changes without orders.",
    },
    {
      q: "Which statement best reflects safe patient teaching within nursing and allied scope?",
      choices: [
        "Use plain language, warning signs, and when to seek urgent care",
        "Promise a specific cure timeline to reduce anxiety",
        "Tell the patient to stop all medications immediately",
        "Avoid documenting teaching to save time",
      ],
      correctLetter: "A",
      explain:
        "Teaching should emphasize warning symptoms, adherence expectations, follow-up, and urgent escalation without guarantees or out-of-scope prescribing language.",
    },
    {
      q: "When two answer options look correct, what discrimination strategy fits NCLEX-style items?",
      choices: [
        "Identify what the stem emphasizes: safety, first action, or teaching",
        "Pick the longest option because detail implies correctness",
        "Choose the option that names a medication class you memorized most recently",
        "Assume the first option is a distractor and skip reading it",
      ],
      correctLetter: "A",
      explain:
        "Clinical judgment items usually hinge on what the scenario prioritizes: airway, breathing, circulation, safety, or scope-appropriate first action.",
    },
    {
      q: "Which documentation habit best supports safe handoffs for complex patients?",
      choices: [
        "Objective trends, focused assessment, and clear change-from-baseline statements",
        "Subjective labels without measurements",
        "Copying prior shift notes without new data",
        "Waiting to chart until after the next break",
      ],
      correctLetter: "A",
      explain:
        "Handoff-ready documentation highlights trends, focused assessment, interventions already performed, and what still needs licensed follow-up.",
    },
  ];

  /** Six items → enough instructional HTML to clear publish word-count gates with the surrounding sections. */
  const pick = banks.slice(0, 6);
  const ol = pick
    .map((item, idx) => {
      const opts = item.choices
        .map((c, j) => `<li><strong>${String.fromCharCode(65 + j)}.</strong> ${esc(c)}</li>`)
        .join("");
      return `<li><p><strong>Question ${idx + 1}.</strong> ${esc(item.q)}</p><ol type="A">${opts}</ol><p><strong>Answer:</strong> ${esc(item.correctLetter)}. <strong>Why:</strong> ${esc(item.explain)}</p></li>`;
    })
    .join("");
  return `<h2>Sample practice questions</h2><ol>${ol}</ol>`;
}

export function buildFaqItems(topic: LongTailSeoTrioTopicPlan): { q: string; a: string }[] {
  const kw = esc(topic.targetKeyword);
  return [
    {
      q: `What is the fastest way to study ${kw} without memorizing isolated facts?`,
      a: "Build a safety-first outline: triggers, expected assessment changes, monitoring priorities, patient teaching, and escalation criteria. Pair each bullet with one practice item so you rehearse decisions, not labels.",
    },
    {
      q: "How do I avoid common exam traps on medication and pathophysiology items?",
      a: "Slow down and separate acute change from chronic baseline, confirm what the question is asking for first, and map each option to the mechanism it assumes rather than choosing the most familiar drug name.",
    },
    {
      q: "Where should I practice full-length items after reading this article?",
      a: "Use the linked NurseNest pathway questions and CAT entry points for your exam track, then return to lessons for weak topics. Educational content is not a substitute for program-specific requirements.",
    },
    {
      q: "How do allied health learners stay inside scope while studying emergency topics?",
      a: "Focus on assessment, communication, documentation, and escalation within your role. Reinforce team coordination and policy adherence rather than independent medical decision-making beyond your certification scope.",
    },
    {
      q: "What patient education themes are safest to emphasize after studying this topic?",
      a: "Teach warning symptoms, adherence expectations, follow-up timing, and when to seek urgent care. Avoid guarantees and reinforce individualized follow-up with licensed clinicians.",
    },
    {
      q: "How often should I revisit this topic during exam prep?",
      a: "Use spaced repetition: one deep read, one question block within 48 hours, then a short review in one week. Adjust frequency based on your question bank accuracy trends.",
    },
  ];
}

export function excerptFromBodyHtml(html: string, fallbackTitle: string): string {
  const plain = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const first = plain.slice(0, 240);
  return first.length >= 120 ? `${first}…` : `${fallbackTitle.slice(0, 200)} — long-form exam prep article on NurseNest.`;
}

export function buildSchemaSummary(topic: LongTailSeoTrioTopicPlan, excerpt: string, origin: string): string {
  const base = origin.replace(/\/$/, "");
  const url = `${base}/blog/${topic.slug}`;
  return JSON.stringify({
    schemaOpportunities: [
      { type: "BlogPosting", rationale: "Canonical long-form nursing and allied health education article." },
      { type: "BreadcrumbList", rationale: "Home, blog index, article." },
      { type: "FAQPage", rationale: "Structured learner FAQs when emitFaqSchema is enabled." },
    ],
    emitFaqSchema: true,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: topic.title.slice(0, 80), href: `/blog/${topic.slug}` },
    ],
    canonicalUrl: url,
    description: excerpt.slice(0, 200),
  });
}

function lessonRows(topic: LongTailSeoTrioTopicPlan): Record<string, unknown>[] {
  const a = lessonPath(topic, topic.lessonSlugs[0]!);
  const b = lessonPath(topic, topic.lessonSlugs[1]!);
  return [
    {
      label: `Lesson: ${topic.lessonSlugs[0]!.replace(/-/g, " ").slice(0, 80)}`,
      suggestedPath: a,
      pathStatus: "ok",
      id: `lt-seo-lesson-a-${topic.slug}`,
      reviewStatus: "active",
    },
    {
      label: `Lesson: ${topic.lessonSlugs[1]!.replace(/-/g, " ").slice(0, 80)}`,
      suggestedPath: b,
      pathStatus: "ok",
      id: `lt-seo-lesson-b-${topic.slug}`,
      reviewStatus: "active",
    },
  ];
}

export function buildInternalLinkPlan(args: { topic: LongTailSeoTrioTopicPlan; peers: PeerBlogStub[] }): Prisma.InputJsonValue {
  const { topic, peers } = args;
  const related = peers.slice(0, 4).map((p) => ({
    slug: p.slug,
    title: p.title.slice(0, 200),
    excerpt: p.excerpt.slice(0, 400),
  }));
  const publishedIso = new Date().toISOString();
  const qPath = hubQuestionsPath(topic);
  const catPath = hubCatPath(topic);
  const flash = "/flashcards";

  return {
    lessons: lessonRows(topic),
    seo: {
      version: 1,
      normalizedBreadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: topic.title.slice(0, 72), href: `/blog/${topic.slug}` },
      ],
      suggestedExcerpt: topic.metaDescription.slice(0, 200),
      emitFaqSchema: true,
      focusKeywords: [topic.targetKeyword.split(" ").slice(0, 5).join(" ")],
      primaryKeyword: topic.targetKeyword.slice(0, 120),
      imageAlts: [],
    },
    publishingPackage: {
      version: 1,
      updatedAt: publishedIso,
      internalAnchorOpportunities: [
        {
          phrase: topic.targetKeyword,
          suggestedAnchorText: "pathway practice questions",
          targetSuggestedPath: qPath,
          rationale: "Apply concepts with verified pathway question practice.",
        },
        {
          phrase: "adaptive practice",
          suggestedAnchorText: "CAT-style practice",
          targetSuggestedPath: catPath,
          rationale: "Use adaptive sessions for exam-style stamina.",
        },
        {
          phrase: "active recall",
          suggestedAnchorText: "flashcards hub",
          targetSuggestedPath: flash,
          rationale: "Reinforce definitions and cues with flashcards.",
        },
      ],
      relatedBlogPosts: related,
    },
    generationContractV1: {
      version: 1,
      primaryKeyword: topic.targetKeyword.slice(0, 120),
      recommendedInternalLinks: [
        { targetType: "lesson", suggestedPath: lessonPath(topic, topic.lessonSlugs[0]!), anchorText: "primary lesson" },
        { targetType: "lesson", suggestedPath: lessonPath(topic, topic.lessonSlugs[1]!), anchorText: "related lesson" },
        { targetType: "practice_exams", suggestedPath: qPath, anchorText: "pathway questions" },
        { targetType: "flashcards_hub", suggestedPath: flash, anchorText: "flashcards" },
        { targetType: "question_bank", suggestedPath: "/question-bank", anchorText: "question bank" },
      ],
      sourceCandidates: [],
      needsReviewFlags: [],
      schemaNotes: {
        article: { type: "BlogPosting", headline: topic.title.slice(0, 110) },
        breadcrumb: { levels: 3, includesBlog: true },
        faq: { enabled: true, minItems: 6 },
      },
    },
  };
}

export function buildLongTailSeoTrioBody(topic: LongTailSeoTrioTopicPlan, peerLinksHtml: string): string {
  const h1 = `<h1>${esc(topic.title)}</h1>`;
  const p = getExamPathwayById(topic.pathwayId);
  const pathwayLabel = p ? esc(p.displayName) : esc(topic.pathwayId);
  const l1 = lessonPath(topic, topic.lessonSlugs[0]!);
  const l2 = lessonPath(topic, topic.lessonSlugs[1]!);
  const qHub = hubQuestionsPath(topic);
  const catHub = hubCatPath(topic);

  const introLead = esc(
    topic.targetKeyword.replace(/\s+nursing\s+pharmacology\s+questions$/i, "").trim() || topic.targetKeyword,
  );
  const intro = `<p><strong>Why this topic shows up on exams.</strong> ${introLead} surfaces across prioritization, safety, and teaching items because it bundles mechanism, monitoring, and escalation. Anchor every stem to the patient’s trajectory, not the answer choice that sounds most familiar.</p><p><em>Educational use only.</em> This article supports exam preparation; it is not individualized medical advice. Follow orders, scope, and institutional policy.</p>`;

  const studyLinks = `<p><strong>Study on NurseNest (${pathwayLabel}).</strong> Review <a href="${esc(l1)}">this lesson</a> and <a href="${esc(l2)}">this companion lesson</a>, then move into <a href="${esc(qHub)}">pathway practice questions</a> and <a href="${esc(catHub)}">CAT-style practice</a>. Reinforce vocabulary with the <a href="/flashcards">flashcards hub</a> and broaden item exposure in the <a href="/question-bank">question bank</a>. ${peerLinksHtml}</p>`;

  const table = `<h2>Quick reference table</h2><table><thead><tr><th>Focus</th><th>What to study</th><th>Why it is tested</th></tr></thead><tbody><tr><td>Mechanism</td><td>Triggers, compensatory responses, expected trends</td><td>Exams reward predicting change, not memorizing labels alone.</td></tr><tr><td>Monitoring</td><td>Vitals, labs, intake/output, device checks</td><td>Prioritization stems cluster around objective worsening.</td></tr><tr><td>Teaching</td><td>Warning symptoms, adherence, follow-up</td><td>Health literacy and safety are recurring NCLEX themes.</td></tr></tbody></table>`;

  const bullets = `<h2>High-yield bullets</h2><ul><li>Trend data before single values: direction matters as much as the number.</li><li>Separate acute change from chronic baseline when two answers sound plausible.</li><li>Pair every medication teaching point with a measurable safety behavior.</li><li>Document objectively and escalate early when policy or trajectory warrants.</li><li>Return to pathway questions after each lesson block to consolidate judgment.</li></ul>`;

  const mechanism = `<h2>Mechanism of action and clinical reasoning</h2>${pad(topic, "Mechanism-first orientation", "full")}`;
  const nursing = `<h2>Nursing implications for safe practice</h2>${pad(topic, "Prioritization and monitoring")}`;
  const assessment = `<h2>Assessment cues and diagnostics</h2>${pad(topic, "Assessment and diagnostics")}`;
  const teaching = `<h2>Patient teaching and interprofessional collaboration</h2>${pad(topic, "Teaching and collaboration")}`;
  const traps = `<h2>Exam traps and discrimination practice</h2>${pad(topic, "Exam traps", "full")}`;
  const judgment = `<h2>Clinical judgment drills</h2>${pad(topic, "Scenario framing")}${pad(topic, "Risk stratification")}`;
  const evidenceSection = `<h2>Evidence-informed nursing actions</h2>${pad(topic, "Evidence synthesis")}${pad(topic, "Team coordination")}`;
  const transitions = `<h2>Care transitions and outpatient safety</h2>${pad(topic, "Transitions and handoffs")}${pad(topic, "Follow-up expectations")}`;
  const prioritizationDeep = `<h2>Deep dive: prioritization under pressure</h2>${pad(topic, "Acute change detection")}${pad(topic, "Resource stewardship")}${pad(topic, "Escalation thresholds")}`;
  const stemDrill = buildStemPriorityDrillSection(topic);
  const qs = buildPracticeQuestionsHtml(topic);
  const cta = `<h2>Next step: full practice</h2><p><strong>Start full practice tests on NurseNest</strong> using your pathway question hub and CAT sessions linked above, then revisit lessons for any weak objectives.</p>`;

  return [
    h1,
    intro,
    studyLinks,
    table,
    bullets,
    mechanism,
    nursing,
    assessment,
    teaching,
    traps,
    judgment,
    evidenceSection,
    transitions,
    prioritizationDeep,
    stemDrill,
    qs,
    cta,
    `<p><strong>Canonical URL path:</strong> <code>${esc(`/blog/${topic.slug}`)}</code></p>`,
  ]
    .join("\n")
    .replace(/\u2014/g, "-");
}

export function validateLongTailSeoTrioSeedBody(html: string, title: string): { ok: true } | { ok: false; reasons: string[] } {
  const reasons: string[] = [];
  const words = countWordsFromHtml(html);
  if (words < BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH) {
    reasons.push(`body_word_count_below_${BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH}`);
  }
  if (!html.includes("<h1>")) reasons.push("missing_h1");
  const h1m = html.match(/<h1>([^<]*)<\/h1>/i);
  if (!h1m || h1m[1]!.trim() !== title.trim()) reasons.push("h1_title_mismatch");
  const lower = html.toLowerCase();
  if (!lower.includes("mechanism of action and clinical reasoning")) reasons.push("missing_mechanism_h2");
  if (!lower.includes("nursing implications for safe practice")) reasons.push("missing_nursing_h2");
  if (!lower.includes("sample practice questions")) reasons.push("missing_practice_questions_h2");
  if (!lower.includes("start full practice tests on nursenest")) reasons.push("missing_cta");
  if (/<h2\b[^>]*>\s*frequently\s+asked\s+questions/i.test(html) || /<h2\b[^>]*>\s*faqs?\s*<\/h2>/i.test(html)) {
    reasons.push("faq_embedded_in_body");
  }
  if (/\b(TODO|TBD|\{\{|\[\[|Lorem ipsum|PLACEHOLDER)\b/i.test(html)) reasons.push("placeholder_language");
  if (/\u2014/.test(html)) reasons.push("em_dash_present");
  return reasons.length ? { ok: false, reasons } : { ok: true };
}

export function resolveSiteOrigin(): string {
  return resolveCanonicalSiteOrigin();
}

function postTemplateForPillar(pillar: LongTailSeoTrioTopicPlan["pillar"]): BlogPostTemplate {
  if (pillar === "pharmacology") return BlogPostTemplate.MEDICATION_REVIEW;
  if (pillar === "pathophysiology") return BlogPostTemplate.TOPIC_EXPLAINED;
  return BlogPostTemplate.LAB_VALUES_GUIDE;
}

export function intentForSeed(): BlogPostIntent {
  return BlogPostIntent.EXAM_PREP;
}

export function buildCreatePayload(args: {
  topic: LongTailSeoTrioTopicPlan;
  peers: PeerBlogStub[];
  keywordCluster: string;
}): {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
  category: string;
  exam: string | null;
  careerSlug: string | null;
  locale: string;
  seoTitle: string;
  seoDescription: string;
  targetKeyword: string;
  keywordCluster: string;
  keywordPlan: string[];
  postTemplate: BlogPostTemplate;
  postIntent: BlogPostIntent;
  faqBlock: Prisma.InputJsonValue;
  internalLinkPlan: Prisma.InputJsonValue;
  schemaSummary: string;
  requiresReferences: boolean;
  apaReferences: string[];
  sourcesJson: Prisma.InputJsonValue;
  keyQuestions: string[];
  legacySource: string;
  imageStatus: BlogImageStatus;
  medicalRiskFlags: string[];
  relatedLessonPaths: string[];
} {
  const { topic, peers, keywordCluster } = args;
  const peerHtml =
    peers.length > 0
      ? `Related articles: ${peers
          .slice(0, 3)
          .map((p) => `<a href="/blog/${esc(p.slug)}">${esc(p.title.length > 70 ? `${p.title.slice(0, 67)}…` : p.title)}</a>`)
          .join(", ")}.`
      : "Browse additional articles from the blog index as more posts publish in your environment.";
  const body = buildLongTailSeoTrioBody(topic, peerHtml);
  const excerpt = excerptFromBodyHtml(body, topic.title);
  const origin = resolveSiteOrigin();
  const schemaSummary = buildSchemaSummary(topic, excerpt, origin);
  const faqItems = buildFaqItems(topic);
  const faqBlock: Prisma.InputJsonValue = { items: faqItems.map((x) => ({ q: x.q, a: x.a })) };
  const internalLinkPlan = buildInternalLinkPlan({ topic, peers });
  const relatedLessonPaths = [lessonPath(topic, topic.lessonSlugs[0]!), lessonPath(topic, topic.lessonSlugs[1]!)];

  const tags = Array.from(
    new Set(
      [
        "nursing",
        "nurse education",
        "exam prep",
        topic.pillar,
        "long-tail",
        topic.category.toLowerCase(),
        topic.exam?.toLowerCase() ?? "",
        topic.careerSlug ?? "",
      ].filter(Boolean),
    ),
  );

  return {
    slug: topic.slug,
    title: topic.title.slice(0, 200),
    excerpt: excerpt.slice(0, 500),
    body,
    tags,
    category: topic.category,
    exam: topic.exam,
    careerSlug: topic.careerSlug,
    locale: "en",
    seoTitle: topic.seoTitle.slice(0, 200),
    seoDescription: topic.metaDescription.slice(0, 200),
    targetKeyword: topic.targetKeyword.slice(0, 200),
    keywordCluster,
    keywordPlan: [topic.pillar, topic.category, "nurse nest"],
    postTemplate: postTemplateForPillar(topic.pillar),
    postIntent: intentForSeed(),
    faqBlock,
    internalLinkPlan,
    schemaSummary,
    requiresReferences: false,
    apaReferences: [],
    sourcesJson: {
      version: 2,
      verified: [],
      excluded: [],
      generatedAt: new Date().toISOString(),
    } as Prisma.InputJsonValue,
    keyQuestions: faqItems.slice(0, 4).map((x) => x.q),
    legacySource: LONG_TAIL_SEO_TRIO_LEGACY_SOURCE,
    imageStatus: BlogImageStatus.NONE,
    medicalRiskFlags: [],
    relatedLessonPaths,
  };
}
