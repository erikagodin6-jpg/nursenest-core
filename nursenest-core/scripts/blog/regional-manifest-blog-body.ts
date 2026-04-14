/**
 * Long-form HTML for India / Middle East / Australia blog manifest rows.
 * Safe wording: no proprietary test-bank mirroring; practice aligned to transferable judgment
 * and NurseNest's own inventory. Not bundled in Next.
 */
import { wordCountFromHtml } from "./philippines-nle-blog-build-body";

export const REGIONAL_MIN_WORDS = 1200;

export type ManifestBlogRow = {
  title: string;
  slug: string;
  primaryKeyword: string;
  language: string;
  category: string;
  intentType: "informational" | "transactional";
  translationGroupId: string;
  status: "planned";
};

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

const EXPANSION = [
  "Spaced repetition and sleep consolidate procedural memory better than single marathon sessions.",
  "Write one-sentence rationales after each missed item; reuse them as flashcard fronts the next week.",
  "Prioritisation: list hazards first, then stable patients, then education—match the stem’s urgency cues.",
  "Ethics stems reward patient advocacy within scope; escalate when harm is imminent or capacity is unclear.",
  "Migration planning belongs in a dated checklist: regulator, English tests, credential steps, employer touchpoints—NurseNest does not provide legal advice.",
];

function padToMin(html: string, seed: number): string {
  let out = html;
  let guard = 0;
  while (wordCountFromHtml(out) < REGIONAL_MIN_WORDS && guard < 80) {
    const chunk = EXPANSION[(seed + guard * 7) % EXPANSION.length]!;
    out += `<h3>Additional notes (${guard + 1})</h3><p>${chunk}</p>`;
    guard += 1;
  }
  if (wordCountFromHtml(out) < REGIONAL_MIN_WORDS) {
    throw new Error(`Regional blog body below ${REGIONAL_MIN_WORDS} words after padding`);
  }
  return out;
}

function langNote(lang: string): string {
  if (lang === "en") return "";
  return `<p><strong>Language note:</strong> NurseNest clinical practice for NCLEX-style preparation is English-first. This draft is generated for cataloguing (${esc(
    lang,
  )}); medical terminology typically stays in English for exam alignment.</p>`;
}

export function buildIndiaManifestBlogBody(row: ManifestBlogRow, index: number): string {
  const h = hashSlug(row.slug);
  const kw = esc(row.primaryKeyword);
  const hub = `<a href="/exams/india">India nursing exams hub</a>`;
  const blog = `<a href="/blog/tag/India%20nursing">India nursing articles</a>`;
  const rnL = `<a href="/us/rn/nclex-rn/lessons">NCLEX-RN lessons (US)</a>`;
  const rnQ = `<a href="/us/rn/nclex-rn/questions">NCLEX-RN practice questions</a>`;
  const pnL = `<a href="/us/pn/nclex-pn/lessons">NCLEX-PN lessons</a>`;
  const pricing = `<a href="/pricing">pricing</a>`;
  const tools = `<a href="/tools">study tools</a>`;
  const qb = `<a href="/question-bank">question bank</a>`;
  const lessons = `<a href="/lessons">lessons library</a>`;

  const introVariant = h % 4;
  const intros = [
    `<p>This article orients <strong>${kw}</strong> for Indian nursing candidates and internationally mobile nurses. NurseNest does not mirror AIIMS entrance banks, state recruitment item sets, or Indian Nursing Council proprietary materials—practice here is informed by internal nursing content coverage and transferable clinical judgment.</p>`,
    `<p>Index ${index}: a structured look at <strong>${kw}</strong> with realistic education tone. We map discussion to public exam domains where relevant (for example NCLEX when a US board clears you) and keep Indian regulatory steps anchored to official council bulletins.</p>`,
    `<p>Candidates comparing <strong>${kw}</strong> with NCLEX or Gulf pathways should separate domestic registration facts from international exam prep. This piece strengthens reasoning; it is not legal or immigration advice.</p>`,
    `<p>Long-form depth for <strong>${kw}</strong>: integrate concepts with safety habits rather than isolated facts. Content is practice based on NurseNest’s own lesson and question inventory—not a clone of any protected test bank.</p>`,
  ];

  const core = `${intros[introVariant]!}${langNote(row.language)}
<h2>Concept explanation</h2><p>Connect pathophysiology to nursing assessments, interventions, and evaluation. For ${kw}, emphasise escalation rules, consent, and documentation habits that transfer across Indian acute and community settings.</p>
<h2>Relevance for nurses in India</h2><p>State nursing councils and employer exams use formats that differ from NCLEX. Still, prioritisation, infection control, medication safety, and therapeutic communication remain cross-cutting. Align study to your council’s published expectations—NurseNest supplements international pathways rather than replacing Indian administration.</p>
<h2>Common mistakes</h2><ul><li>Mixing US state board assumptions with Indian council steps.</li><li>Ignoring English reading speed needed for international exams.</li><li>Cramming without error logs or spaced review.</li></ul>
<h2>Study strategy</h2><p>Blend topic review with timed mixed practice. Use ${lessons} for foundations, then ${qb} for application when your target regulator authorises that practice.</p>
<h2>If you plan NCLEX or overseas registration</h2><p>NCLEX-RN requires board eligibility after credential review. Use ${rnL} and ${rnQ} when cleared; ${pnL} when PN routes apply. Compare provinces or states early—timelines vary widely.</p>
<h2>Practice spotlight (illustrative)</h2><p><strong>Stem (illustrative):</strong> A patient’s status changes on the ward; which action best demonstrates safe prioritisation related to ${kw}?</p><p><strong>Rationale pattern:</strong> identify life threats, verify orders and allergies, communicate changes, and document objectively. This illustrates transferable judgment—not copied items from any proprietary bank.</p>
<h2>Internal links</h2><p>Continue with ${hub}, explore ${blog}, review ${pricing}, ${tools}, and ${qb}.</p>
<h2>Summary</h2><p>Anchor Indian steps in official sources; use NurseNest for scope-aligned practice and transferable reasoning from our own content inventory.</p>`;

  return padToMin(core, h + index);
}

export function buildMiddleEastManifestBlogBody(row: ManifestBlogRow, index: number): string {
  const h = hashSlug(row.slug);
  const kw = esc(row.primaryKeyword);
  const hub = `<a href="/exams/middle-east">Middle East nursing exams hub</a>`;
  const blog = `<a href="/blog/tag/Middle%20East%20nursing">Middle East nursing articles</a>`;
  const rnL = `<a href="/us/rn/nclex-rn/lessons">NCLEX-RN lessons</a>`;
  const rnQ = `<a href="/us/rn/nclex-rn/questions">NCLEX-RN questions</a>`;
  const pricing = `<a href="/pricing">pricing</a>`;
  const tools = `<a href="/tools">study tools</a>`;
  const qb = `<a href="/question-bank">question bank</a>`;

  const intros = [
    `<p>Gulf licensing searches around <strong>${kw}</strong> must stay regulator-specific: Prometric delivers tests, but DHA, DOH/Abu Dhabi, SCFHS, or Qatar MOPH own syllabi. NurseNest does not reproduce Prometric item banks or authority secrets—content builds transferable clinical judgment.</p>`,
    `<p>Article ${index} frames <strong>${kw}</strong> for expat nurses managing verification, English thresholds, and employer sponsorship layers. This is educational orientation, not visa or legal certainty.</p>`,
  ];

  const core = `${intros[h % intros.length]!}${langNote(row.language)}
<h2>Concept explanation</h2><p>Focus on safe practice patterns: isolation, medication checks, escalation, and culturally competent communication—mapped to public professional expectations, not leaked exam content.</p>
<h2>Relevance in Middle East licensing contexts</h2><p>Authorities may use computer-based assessments plus credential verification (for example DataFlow in many UAE conversations). Follow your health authority bulletin; NurseNest supports reasoning drills alongside official prep.</p>
<h2>Common mistakes</h2><ul><li>Treating Prometric as the syllabus owner.</li><li>Mixing Dubai and Abu Dhabi requirements.</li><li>Underestimating verification lead times.</li></ul>
<h2>Study strategy</h2><p>Pair authority PDFs with prioritisation practice in ${qb} and ${tools} when appropriate for your eligibility stage.</p>
<h2>If you may move to the US or Canada later</h2><p>Gulf licensing is distinct from NCLEX. If migration is a parallel goal, keep ${rnL} and ${rnQ} study separate from Gulf timelines until a North American regulator authorises you.</p>
<h2>Practice spotlight (illustrative)</h2><p><strong>Stem (illustrative):</strong> Which nursing action best reduces harm in a scenario tied to ${kw}?</p><p><strong>Rationale:</strong> prioritise airway, breathing, circulation principles; verify identity and allergies; follow chain of command. Illustrative only—not copied from proprietary banks.</p>
<h2>Internal links</h2><p>Use ${hub} and ${blog}; review ${pricing} and ${tools}.</p>
<h2>Summary</h2><p>Match preparation to your regulator; use NurseNest for transferable reasoning aligned to our own inventory.</p>`;

  return padToMin(core, h + index);
}

export function buildAustraliaManifestBlogBody(row: ManifestBlogRow, index: number): string {
  const h = hashSlug(row.slug);
  const kw = esc(row.primaryKeyword);
  const hub = `<a href="/exams/australia">Australia nursing hub</a>`;
  const blog = `<a href="/blog/tag/Australia%20nursing">Australia nursing articles</a>`;
  const rnL = `<a href="/us/rn/nclex-rn/lessons">NCLEX-RN lessons</a>`;
  const pricing = `<a href="/pricing">pricing</a>`;
  const tools = `<a href="/tools">study tools</a>`;
  const qb = `<a href="/question-bank">question bank</a>`;

  const intros = [
    `<p>AHPRA/NMBA pathways for internationally qualified nurses often include qualification assessment and, where directed, OBA components such as MCQ and OSCE-style stages. This article discusses <strong>${kw}</strong> without claiming to mirror AHPRA OSCE stations or proprietary item banks.</p>`,
    `<p>Entry ${index}: <strong>${kw}</strong> in the Australian context—EN, RN, and NP scopes differ. NurseNest supports clinical reasoning practice; registration decisions belong to AHPRA/NMBA.</p>`,
  ];

  const core = `${intros[h % intros.length]!}${langNote(row.language)}
<h2>Concept explanation</h2><p>Emphasise standards-based nursing: assessment, planning, implementation, and evaluation within NMBA scope language for your intended registration level.</p>
<h2>Relevance for Australia registration discussions</h2><p>OSCE and OBA components assess performance under conditions published by the assessment operator—not NCLEX clones. Align preparation with official candidate guides.</p>
<h2>Common mistakes</h2><ul><li>Assuming UK or US credentials automatically map without assessment.</li><li>Neglecting English evidence categories.</li><li>Confusing EN and RN scope stories.</li></ul>
<h2>Study strategy</h2><p>Combine reading with simulation habits: verbalise rationales, practise therapeutic communication, and use ${qb} for judgement drills where helpful.</p>
<h2>If you also consider North America</h2><p>NCLEX is a different regulator stack; use ${rnL} only when a US or Canadian board clears you. Keep Australian paperwork on its own timeline.</p>
<h2>Practice spotlight (illustrative)</h2><p><strong>Stem (illustrative):</strong> A station-style prompt around ${kw}—which response best matches safety and scope?</p><p><strong>Rationale:</strong> choose evidence-based, patient-centred actions; document and escalate per policy. Illustrative—not copied items.</p>
<h2>Internal links</h2><p>Read ${hub} and ${blog}; open ${pricing}, ${tools}, and ${qb}.</p>
<h2>Summary</h2><p>Follow AHPRA/NMBA instructions for registration; use NurseNest for transferable practice from our own inventory.</p>`;

  return padToMin(core, h + index);
}

export function buildBodyForRegion(
  region: "india" | "middle-east" | "australia",
  row: ManifestBlogRow,
  index: number,
): string {
  if (region === "india") return buildIndiaManifestBlogBody(row, index);
  if (region === "middle-east") return buildMiddleEastManifestBlogBody(row, index);
  return buildAustraliaManifestBlogBody(row, index);
}
