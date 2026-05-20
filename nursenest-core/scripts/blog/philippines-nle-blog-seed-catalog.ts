/**
 * 200 English blog seed definitions for Philippine NLE context, NCLEX bridge, and migration.
 * Bodies: `philippines-nle-blog-build-body.ts` (≥1200 words, varied structure). Used by
 * `import-philippines-nle-blog-seeds.mts` (Prisma). Not bundled in the Next app.
 */
import { buildPhilippinesBlogBody, MIN_WORDS, wordCountFromHtml } from "./philippines-nle-blog-build-body";
import type { PhilippinesBlogAngle, PhilippinesBlogSeedTopic } from "./philippines-nle-blog-seed-types";

export type { PhilippinesBlogAngle, PhilippinesBlogSeedTopic } from "./philippines-nle-blog-seed-types";
export { buildPhilippinesBlogBody, excerptFromBody, MIN_WORDS, wordCountFromHtml } from "./philippines-nle-blog-build-body";

const DOMAINS: string[] = [
  "Medical-surgical nursing",
  "Community health nursing",
  "Maternal and newborn nursing",
  "Child health nursing",
  "Mental health and psychiatric nursing",
  "Gerontology and chronic illness",
  "Infection prevention and isolation",
  "Pharmacology and safe medication practice",
  "Fluid, electrolyte, and acid-base balance",
  "Cardiovascular nursing",
  "Respiratory nursing",
  "Neurological nursing",
  "Gastrointestinal and nutrition nursing",
  "Renal and genitourinary nursing",
  "Endocrine and metabolic nursing",
  "Musculoskeletal and mobility nursing",
  "Hematologic and immunologic nursing",
  "Perioperative and procedural nursing",
  "Pain assessment and multimodal management",
  "Ethics, consent, and advocacy",
  "Leadership, delegation, and supervision",
  "Quality improvement and patient safety",
  "Nursing research and evidence appraisal",
  "Disaster and emergency nursing",
  "Occupational health and worker safety",
  "Palliative and end-of-life care",
  "School and adolescent health",
  "Public health surveillance and reporting",
  "Family-centered communication",
  "Cultural humility in Filipino nursing practice",
];

const KEYWORDS = [
  "Philippines nursing board exam",
  "NLE nursing",
  "NLE Philippines",
  "PRC nursing licensure exam",
  "Nurse Licensure Examination Philippines",
];

const ANGLES: PhilippinesBlogAngle[] = [
  "structure",
  "volume",
  "nclex",
  "us-migration",
  "ca-migration",
  "clinical",
  "language",
  "study-plan",
];

function titleFor(i: number, keyword: string, domain: string, angle: PhilippinesBlogAngle): string {
  const capKw = keyword.charAt(0).toUpperCase() + keyword.slice(1);
  const angleHint: Record<PhilippinesBlogAngle, string> = {
    structure: "blueprint-style preparation",
    volume: "cohort pressure and pacing",
    nclex: "bridge toward NCLEX-RN",
    "us-migration": "United States registration planning",
    "ca-migration": "Canada registration planning",
    clinical: "clinical reasoning drills",
    language: "English and Tagalog study workflows",
    "study-plan": "twelve-week study architecture",
  };
  const ah = angleHint[angle];
  const templates = [
    `${capKw} — ${domain}: ${ah} (series ${i})`,
    `${domain} deep-dive for ${keyword}: ${ah} [vol. ${i}]`,
    `NLE nursing context ${i}: ${keyword} meets ${domain} (${ah})`,
    `${capKw} field notes (${i}): ${domain} and ${ah}`,
    `${keyword} (${i}): ${domain} — ${ah} for Filipino candidates`,
    `${domain} — ${ah} — ${capKw} installment ${i}`,
  ];
  return templates[i % templates.length]!;
}

function buildTopics(): PhilippinesBlogSeedTopic[] {
  const out: PhilippinesBlogSeedTopic[] = [];
  for (let i = 1; i <= 200; i += 1) {
    const domain = DOMAINS[(i - 1) % DOMAINS.length]!;
    const keyword = KEYWORDS[(i - 1) % KEYWORDS.length]!;
    const angle = ANGLES[(i - 1) % ANGLES.length]!;
    out.push({
      slug: `philippines-nle-nursing-${String(i).padStart(3, "0")}`,
      title: titleFor(i, keyword, domain, angle),
      keyword,
      angle,
      domain,
      index: i,
    });
  }
  return out;
}

/** Exactly 200 topics for philippines-nle tag SEO coverage */
export const PHILIPPINES_NLE_BLOG_TOPICS: PhilippinesBlogSeedTopic[] = buildTopics();

/** Dev/test helper: verify every generated body meets minimum length */
export function assertPhilippinesBodiesMeetMinWords(): void {
  for (const t of PHILIPPINES_NLE_BLOG_TOPICS) {
    const w = wordCountFromHtml(buildPhilippinesBlogBody(t));
    if (w < MIN_WORDS) {
      throw new Error(`Below ${MIN_WORDS} words: ${t.slug} (${w})`);
    }
  }
}
