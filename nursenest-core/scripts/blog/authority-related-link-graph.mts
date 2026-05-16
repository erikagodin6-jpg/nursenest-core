import type { AuthorityLane, AuthorityLink, AuthorityTopic } from "./authority-publishing-types.mjs";

const CORE_HUB_LINKS: Record<AuthorityLane, AuthorityLink[]> = {
  ecg: [
    { label: "ECG interpretation hub", href: "/ecg-interpretation" },
    { label: "Advanced ECG nursing module", href: "/advanced-ecg-nursing" },
    { label: "ECG telemetry mastery", href: "/ecg-telemetry-mastery" },
  ],
  cnple: [
    { label: "CNPLE LOFT simulation", href: "/canada/np/cnple/simulation" },
    { label: "CNPLE practice questions", href: "/canada/np/cnple/questions" },
    { label: "CNPLE lessons", href: "/canada/np/cnple/lessons" },
  ],
  rexpn: [
    { label: "REx-PN practice questions", href: "/canada/rpn/rex-pn/questions" },
    { label: "REx-PN lessons", href: "/canada/rpn/rex-pn/lessons" },
  ],
  nclex: [
    { label: "NCLEX-RN questions", href: "/us/rn/nclex-rn/questions" },
    { label: "NCLEX-RN CAT exams", href: "/us/rn/nclex-rn/cat" },
    { label: "NCLEX-RN lessons", href: "/us/rn/nclex-rn/lessons" },
  ],
  rt: [
    { label: "Allied Health hub", href: "/allied-health" },
    { label: "RT lessons", href: "/us/allied-health/rt/lessons" },
    { label: "RT practice questions", href: "/us/allied-health/rt/questions" },
  ],
  pathophysiology: [
    { label: "NurseNest lessons", href: "/app/lessons" },
    { label: "Practice questions", href: "/app/questions" },
    { label: "Flashcards", href: "/app/flashcards" },
  ],
};

const ENTITY_CROSS_LINKS: { match: RegExp; links: AuthorityLink[] }[] = [
  {
    match: /hyperkalemia|peaked t|potassium|renal|kidney/i,
    links: [
      { label: "Hyperkalemia ECG changes", href: "/blog/hyperkalemia-ecg-changes-nursing-students" },
      { label: "ECG interpretation", href: "/ecg-interpretation" },
      { label: "Practice tests", href: "/app/practice-tests" },
    ],
  },
  {
    match: /abg|acidosis|alkalosis|ventilation|hypercapnia|oxygenation|ards|peep/i,
    links: [
      { label: "RT lessons", href: "/us/allied-health/rt/lessons" },
      { label: "ABG practice", href: "/app/practice-tests" },
      { label: "Allied Health hub", href: "/allied-health" },
    ],
  },
  {
    match: /cnple|prescribing|soap|diagnostic|primary care|preventive|women|pediatric|geriatric/i,
    links: [
      { label: "CNPLE simulation", href: "/canada/np/cnple/simulation" },
      { label: "CNPLE questions", href: "/canada/np/cnple/questions" },
      { label: "NP lessons", href: "/canada/np/cnple/lessons" },
    ],
  },
  {
    match: /mobitz|flutter|fibrillation|tachycardia|torsades|bundle|qt|st elevation|axis|pacemaker|telemetry/i,
    links: [
      { label: "ECG interpretation", href: "/ecg-interpretation" },
      { label: "Advanced ECG", href: "/advanced-ecg-nursing" },
      { label: "ECG telemetry mastery", href: "/ecg-telemetry-mastery" },
    ],
  },
  {
    match: /rex-pn|rpn|practical nursing/i,
    links: [
      { label: "REx-PN questions", href: "/canada/rpn/rex-pn/questions" },
      { label: "REx-PN lessons", href: "/canada/rpn/rex-pn/lessons" },
    ],
  },
  {
    match: /nclex|sata|delegation|prioritization|cat/i,
    links: [
      { label: "NCLEX-RN questions", href: "/us/rn/nclex-rn/questions" },
      { label: "CAT exams", href: "/us/rn/nclex-rn/cat" },
    ],
  },
];

function uniqLinks(links: AuthorityLink[]): AuthorityLink[] {
  const seen = new Set<string>();
  const out: AuthorityLink[] = [];
  for (const link of links) {
    const key = `${link.label}|${link.href}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(link);
  }
  return out;
}

export function resolveAuthorityRelatedLinks(topic: AuthorityTopic): AuthorityLink[] {
  const text = `${topic.title} ${topic.targetKeyword} ${topic.category} ${topic.tags.join(" ")}`;
  const links: AuthorityLink[] = [...CORE_HUB_LINKS[topic.lane], ...topic.internalLinks];
  for (const rule of ENTITY_CROSS_LINKS) {
    if (rule.match.test(text)) links.push(...rule.links);
  }
  return uniqLinks(links).slice(0, 10);
}

export function renderAuthorityRelatedLinksHtml(topic: AuthorityTopic): string {
  return resolveAuthorityRelatedLinks(topic)
    .map((link) => `<li><a href="${link.href}">${link.label}</a></li>`)
    .join("\n");
}
