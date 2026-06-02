/**
 * Long-form HTML generator for Philippines NLE blog seeds.
 * Safe wording: no proprietary bank mirroring; practice is aligned to public NCLEX domains
 * and NurseNest's own lesson/question inventory.
 */
import type { PhilippinesBlogAngle, PhilippinesBlogSeedTopic } from "./philippines-nle-blog-seed-types";

export const MIN_WORDS = 1200;

const PH_HUB = `<a href="/exams/philippines">Philippines nursing exam hub</a>`;
const BANK = `<a href="/question-bank">question bank</a>`;
const US_LESS = `<a href="/us/rn/nclex-rn/lessons">NCLEX-RN lessons (US)</a>`;
const US_Q = `<a href="/us/rn/nclex-rn/questions">NCLEX-RN practice questions (US)</a>`;
const PN_LESS = `<a href="/us/pn/nclex-pn/lessons">NCLEX-PN lessons (US)</a>`;
const CA_LESS = `<a href="/canada/rn/nclex-rn/lessons">NCLEX-RN lessons (Canada)</a>`;
const CA_Q = `<a href="/canada/rn/nclex-rn/questions">NCLEX-RN practice questions (Canada)</a>`;
const LESS = `<a href="/lessons">clinical lessons library</a>`;
const PRICING = `<a href="/pricing">pricing</a>`;
const TOOLS = `<a href="/tools">study tools</a>`;
const BLOG_TAG = `<a href="/blog/tag/philippines-nle">philippines-nle articles</a>`;

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return h;
}

const INTROS: ((topic: PhilippinesBlogSeedTopic) => string)[] = [
  (t) =>
    `<p>This article opens an exam-focused discussion of <strong>${esc(t.keyword)}</strong> with sustained attention to <strong>${esc(t.domain)}</strong>. It is educational orientation only: it does not replace Professional Regulation Commission communications, and it does not claim to mirror proprietary item banks.</p>`,
  (t) =>
    `<p>Candidates researching <strong>${esc(t.keyword)}</strong> alongside <strong>${esc(t.domain)}</strong> often need both Philippine licensure context and a realistic bridge toward NCLEX-aligned study habits. The index marker <em>${t.index}</em> helps editorial teams track series rotation without changing your study sequence.</p>`,
  (t) =>
    `<p>If your search intent pairs <strong>${esc(t.keyword)}</strong> with deeper work in <strong>${esc(t.domain)}</strong>, treat this guide as a structured study companion. NurseNest practice is built around transferable clinical judgment and content mapped to public NCLEX domains—not a reproduction of protected NLE materials.</p>`,
  (t) =>
    `<p>Series note ${t.index}: this installment keeps <strong>${esc(t.domain)}</strong> in focus while grounding the broader <strong>${esc(t.keyword)}</strong> theme. Anchor regulatory details in PRC sources; use NurseNest for NCLEX-oriented drills when a North American regulator authorises you to test.</p>`,
  (t) =>
    `<p>Long-form depth matters because <strong>${esc(t.keyword)}</strong> queries mix cohort anxiety, domain study needs (${esc(t.domain)}), and migration curiosity. The writing below separates those threads so you can plan without conflating Philippine administration with NCLEX eligibility.</p>`,
  (t) =>
    `<p>Readers approaching <strong>${esc(t.domain)}</strong> after classroom silos benefit from integrated review. This entry ties <strong>${esc(t.keyword)}</strong> to realistic practice habits and honest limits: we describe scope alignment, not secret test items.</p>`,
  (t) =>
    `<p>When timelines collide—school completion, board review, and early NCLEX curiosity—use article ${t.index} as a pacing anchor for <strong>${esc(t.domain)}</strong>. Verify every administrative requirement with official bulletins.</p>`,
  (t) =>
    `<p>This guide frames <strong>${esc(t.keyword)}</strong> through <strong>${esc(t.domain)}</strong> lenses for Filipino nursing candidates. Clinical terminology in NCLEX preparation remains English-first inside NurseNest; marketing locales may offer Tagalog entry points without implying full translation of every lesson.</p>`,
];

function conceptBlock(t: PhilippinesBlogSeedTopic): string {
  const d = esc(t.domain);
  return `<h2>Concept explanation: ${d}</h2><p>Start from mechanisms and nursing responsibilities, not memorised lists alone. For ${d}, connect assessment cues to interventions, then to evaluation and teaching. That structure matches how many licensure exams reward integration rather than isolated facts.</p><p>When you study pathophysiology, tie symptoms to the underlying process, then to the monitoring parameter that would change first if the patient deteriorated. That habit supports both Philippine program expectations and later NCLEX-style prioritisation.</p>`;
}

function nleRelevanceBlock(t: PhilippinesBlogSeedTopic): string {
  const k = esc(t.keyword);
  const d = esc(t.domain);
  return `<h2>Relevance to the Philippines nursing board exam (NLE)</h2><p>The national licensure examination validates entry-level competence under Philippine regulation. Items typically integrate ${d} with safety, ethics, and communication. Your program outcomes should map to those domains; spiral review keeps ${d} connected to pharmacology and leadership concepts.</p><p>NurseNest does not provide proprietary NLE clones. For PRC blueprint fidelity, rely on official materials. This article helps you study ${k} concepts in ways that also strengthen transferable reasoning.</p>`;
}

function mistakesBlock(t: PhilippinesBlogSeedTopic, h: number): string {
  const variants = [
    `<h2>Common mistakes candidates make</h2><ul><li>Treating every “implement” option as equal priority instead of sequencing by safety.</li><li>Ignoring allergy and lab cues that change medication choices.</li><li>Skipping teach-back when the stem tests discharge readiness.</li><li>Choosing social rapport when the patient needs escalation.</li></ul><p>Rotate error logs: for ${esc(t.domain)}, write the rule you violated in one sentence, then redo a similar item cold the next day.</p>`,
    `<h2>Common mistakes candidates make</h2><ul><li>Over-focusing on trivia while missing the central risk in the vignette.</li><li>Mixing US and Canadian regulatory assumptions in one plan.</li><li>Studying only in massed blocks without spaced recall.</li><li>Neglecting English reading speed for NCLEX stems.</li></ul><p>Variant ${h % 997}: tie each mistake to a corrective drill in ${BANK} once your board clears NCLEX practice.</p>`,
  ];
  return variants[h % variants.length]!;
}

function strategyBlock(t: PhilippinesBlogSeedTopic, h: number): string {
  return `<h2>Study strategy</h2><p>Blend ${esc(t.domain)} review with mixed practice and timed blocks. Schedule recovery sleep before heavy drill days. Use ${LESS} chapters to rebuild foundations, then ${BANK} sets for application. Strategy seed ${h % 2048}: alternate new content with mixed review so interleaving mirrors exam unpredictability.</p>`;
}

function migrationBlock(angle: PhilippinesBlogAngle, domain: string): string {
  const d = esc(domain);
  if (angle === "us-migration") {
    return `<h2>If you plan to work in the United States</h2><p>United States registration is state-specific and usually includes credential evaluation, possible CGFNS services where applicable, English tests, and NCLEX-RN. Clinical judgement in ${d} supports employer readiness, but visa and immigration steps require qualified advisers. NurseNest supports NCLEX-aligned knowledge practice—not legal certainty about immigration.</p>`;
  }
  if (angle === "ca-migration") {
    return `<h2>If you plan to work in Canada</h2><p>Canadian RN registration is provincial. Internationally educated nurses often complete NNAS and college-specific steps before or alongside NCLEX-RN. Map ${d} study to competency language your college publishes, and budget time for assessments beyond multiple-choice practice.</p>`;
  }
  if (angle === "nclex") {
    return `<h2>If you plan to work in Canada or the United States</h2><p>NCLEX-RN is used in both countries with different regulatory wrappers. Keep a province or state checklist separate from your ${d} study log so paperwork and clinical practice both advance.</p>`;
  }
  return "";
}

function practiceSpotlight(t: PhilippinesBlogSeedTopic, h: number): string {
  const d = esc(t.domain);
  const stems = [
    `You are prioritising multiple patients on a busy unit. Which principle best guides your first action when ${d} content is central to the scenario?`,
    `A family-centered vignette tests therapeutic communication around ${d}. Which response best balances empathy with clear professional boundaries?`,
    `During medication preparation for a complex ${d} case, which verification habit most directly reduces harm before administration?`,
  ];
  const stem = stems[h % stems.length]!;
  return `<h2>Practice spotlight (illustrative item)</h2><p><strong>Stem (illustrative):</strong> ${esc(stem)}</p><p><strong>Key reasoning moves:</strong> identify the highest-acuity risk first; verify identity, allergies, and relevant labs before medications; escalate through proper channels when instability is likely; choose teaching and follow-up that match the patient’s capacity and safety needs.</p><p><strong>Rationale:</strong> This pattern reflects prioritisation and safety habits used in many nursing exams. It is not copied from any proprietary NLE or NCLEX item bank—it illustrates how NurseNest content builds transferable clinical judgement from our own lesson and question inventory.</p>`;
}

function internalLinksBlock(): string {
  return `<h2>Internal links for next steps</h2><p>Browse ${PH_HUB}, practise in ${BANK}, open ${LESS}, review ${PRICING} and ${TOOLS}, and explore ${BLOG_TAG}. For NCLEX routes: ${US_LESS}, ${US_Q}, ${PN_LESS}, ${CA_LESS}, ${CA_Q}.</p>`;
}

function summaryBlock(t: PhilippinesBlogSeedTopic): string {
  return `<h2>Summary</h2><p>Anchor Philippine administration facts in PRC sources. Build ${esc(t.domain)} depth with integrated review and honest error logging. When NCLEX becomes relevant, shift toward CAT-style practice aligned to public exam domains using NurseNest’s own lesson and question inventory—without treating this platform as an NLE item clone.</p>`;
}

function angleBlock(angle: PhilippinesBlogAngle, kw: string, domain: string): string {
  const k = esc(kw);
  const d = esc(domain);
  const blocks: Record<PhilippinesBlogAngle, string> = {
    structure: `<h2>Structure and blueprint thinking</h2><p>This section emphasises how ${k} frames competence across ${d}. Treat the PRC bulletin as authoritative. NurseNest supplements NCLEX-aligned reasoning only after you separate Philippine administration steps from North American testing.</p>`,
    volume: `<h2>High-volume cohort realities</h2><p>${k} searches often reflect crowded testing seasons. Volume is systemic, not personal. Pair disciplined scheduling with recovery days while studying ${d}.</p>`,
    nclex: `<h2>Bridging toward NCLEX-RN responsibly</h2><p>After Philippine milestones, NCLEX-RN is regulator-led. Tie ${d} habits to prioritisation and safety under uncertainty using ${US_LESS} and ${US_Q} when eligible.</p>`,
    "us-migration": `<h2>United States pathway orientation</h2><p>State boards, credential evaluation, and NCLEX-RN layer on top of clinical foundations in ${d}. NurseNest supports knowledge practice, not visa advice.</p>`,
    "ca-migration": `<h2>Canada pathway orientation</h2><p>Provincial colleges, NNAS context, and NCLEX-RN interact with your ${d} preparation. Read college PDFs with dates; avoid mixing emirate or US assumptions.</p>`,
    clinical: `<h2>Clinical reasoning emphasis</h2><p>Deep ${d} work strengthens judgement for multiple regulators. Use case clusters with full rationales rather than passive reading.</p>`,
    language: `<h2>Language workflow</h2><p>English remains primary for NCLEX stems. Many candidates keep Tagalog notes for stories while reading rationales in English. Regional languages may support study groups without full product UI coverage.</p>`,
    "study-plan": `<h2>Twelve-week scaffolding</h2><p>Distribute ${d} review across weeks with visible milestones, mixed sets, and simulation days near the end of a cycle.</p>`,
  };
  return blocks[angle];
}

const EXPANSION_PARAGRAPHS: string[] = [
  "Spaced repetition beats cramming for long-term retention. After each block, log what slipped and schedule a redo after sleep.",
  "Prioritisation drills: list six patients, assign acuity, defend your first two actions aloud.",
  "Medication safety: verify allergies, labs that change risk, and teaching for adherence before selecting an option.",
  "Ethics stems often pit autonomy against safety—choose life-preserving escalation when harm is imminent.",
  "Migration planning belongs in a spreadsheet: regulator milestones, English tests, NCLEX readiness, employer touchpoints.",
  "English reading speed improves with daily rationale read-aloud sessions and timed stem practice.",
  "Community health answers should respect autonomy while coordinating public-health obligations when outbreaks appear.",
  "Mental health communication rewards reflection and boundaries; avoid collusion with unsafe content.",
];

export function wordCountFromHtml(html: string): number {
  const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!plain) return 0;
  return plain.split(/\s+/).length;
}

export function buildPhilippinesBlogBody(topic: PhilippinesBlogSeedTopic): string {
  const h = hashSlug(topic.slug);
  const introRaw = INTROS[h % INTROS.length]!(topic);
  /** Unique series marker reduces accidental duplicate openers across 200-topic rotation. */
  const intro = introRaw.replace(/^<p>/, `<p><em>Series ${topic.index}.</em> `);
  const order = h % 4;
  const parts: string[] = [intro];

  const push = (s: string) => {
    if (s) parts.push(s);
  };

  const a = angleBlock(topic.angle, topic.keyword, topic.domain);
  const b1 = conceptBlock(topic);
  const b2 = nleRelevanceBlock(topic);
  const b3 = mistakesBlock(topic, h);
  const b4 = strategyBlock(topic, h);
  const b5 = practiceSpotlight(topic, h);
  const b6 = migrationBlock(topic.angle, topic.domain);
  const b7 = internalLinksBlock();
  const b8 = summaryBlock(topic);

  const packA = [b2, b1, b3, b4, a, b6, b5, b7, b8];
  const packB = [b1, b2, b3, a, b4, b6, b5, b7, b8];
  const packC = [a, b2, b1, b4, b3, b6, b5, b7, b8];
  const packD = [b2, a, b1, b3, b4, b5, b6, b7, b8];
  const packs = [packA, packB, packC, packD];
  for (const p of packs[order]!) {
    push(p);
  }

  let html = parts.join("");

  let guard = 0;
  while (wordCountFromHtml(html) < MIN_WORDS && guard < 60) {
    const chunk = EXPANSION_PARAGRAPHS[(topic.index + guard * 3) % EXPANSION_PARAGRAPHS.length]!;
    html += `<h3>Additional study notes (${guard + 1})</h3><p>${chunk}</p>`;
    guard += 1;
  }

  if (wordCountFromHtml(html) < MIN_WORDS) {
    throw new Error(`Philippines blog body still below ${MIN_WORDS} words for slug ${topic.slug}`);
  }

  return html;
}

export function excerptFromBody(html: string): string {
  const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return plain.slice(0, 280) + (plain.length > 280 ? "…" : "");
}
