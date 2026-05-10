/**
 * One-off generator: writes `reports/longtail-patho-pharm-topic-inventory.md`
 * from deterministic catalog + verified in-repo routes.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildLongTailTopicCatalog } from "../blog/lib/patho-pharm-longtail-topic-catalog";
import { slugify } from "../blog/lib/patho-pharm-longtail-content";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..", "..");

const VERIFIED_INTERNAL_PATHS = [
  "/app/lessons",
  "/app/labs",
  "/blog",
  "/blog/rn",
  "/us/rn/nclex-rn/lessons",
  "/us/rn/nclex-rn/lessons/us-rn-pulmonary-embolism",
  "/us/rn/nclex-rn/lessons/respiratory-assessment-ngn",
  "/us/rn/nclex-rn/lessons/us-rn-prioritization-abcs",
] as const;

type LessonRow = { slug: string; topic?: string; bodySystem?: string };
function loadLessonSlugs(): string[] {
  const p = join(appRoot, "src", "content", "lessons", "lesson-library.json");
  const j = JSON.parse(readFileSync(p, "utf8")) as { lessons?: LessonRow[] };
  return (j.lessons ?? []).map((l) => l.slug).filter(Boolean);
}

function examTierForTopic(i: number, pharm: boolean): string {
  const tiers = ["NCLEX-RN (Pro+)", "NCLEX-RN (Core)", "NCLEX-PN (Core)", "Clinical readiness (Team)"];
  const base = tiers[i % tiers.length]!;
  return pharm ? `${base} + Pharm` : base;
}

function priorityFor(i: number): "P0" | "P1" | "P2" {
  if (i < 40) return "P0";
  if (i < 120) return "P1";
  return "P2";
}

function seoAngle(pharm: boolean, bodySystem: string): string {
  if (pharm) {
    return `Long-tail why-drug-effect + monitoring; link labs/lessons; FAQ schema (${bodySystem}).`;
  }
  return `Mechanism + assessment for ${bodySystem}; why-does queries; lesson hub pairing.`;
}

function learnerIntent(pharm: boolean): string {
  return pharm
    ? "Safe meds: effect to mechanism, monitoring, escalation."
    : "Pathophys steps for exams and bedside reasoning.";
}

function linkedRoute(i: number, lessonSlugs: string[]): string {
  const cycle = VERIFIED_INTERNAL_PATHS[i % VERIFIED_INTERNAL_PATHS.length]!;
  if (cycle.startsWith("/us/") && cycle.endsWith("/lessons") && !cycle.includes("lessons/")) {
    return `/us/rn/nclex-rn/lessons/${lessonSlugs[i % lessonSlugs.length]}`;
  }
  if (cycle.includes("/lessons/")) return cycle;
  return cycle;
}

const topics = buildLongTailTopicCatalog(300);
const lessonSlugs = loadLessonSlugs();
if (lessonSlugs.length === 0) throw new Error("lesson slugs missing");

const slugSeen = new Map<string, number>();
const rows: { idx: number; title: string; slug: string; rest: string }[] = [];

for (let i = 0; i < topics.length; i++) {
  const t = topics[i]!;
  let slug = slugify(t.title);
  const dup = slugSeen.get(slug) ?? 0;
  slugSeen.set(slug, dup + 1);
  if (dup > 0) slug = `${slug}-${dup + 1}`;
  const tags = [t.bodySystem, t.pharm ? "pharmacology" : "pathophysiology", t.conditionOrDrug.slice(0, 40)].join("; ");
  const exam = examTierForTopic(i, t.pharm);
  const link = linkedRoute(i, lessonSlugs);
  const intent = learnerIntent(t.pharm);
  const seo = seoAngle(t.pharm, t.bodySystem);
  const pri = priorityFor(i);
  rows.push({
    idx: i + 1,
    title: t.title.replace(/\|/g, "/"),
    slug,
    rest: `| ${exam} | ${tags.replace(/\|/g, "/")} | ${intent.replace(/\|/g, "/")} | \`${link}\` | ${seo.replace(/\|/g, "/")} | ${pri} |`,
  });
}

const allSlugs = rows.map((r) => r.slug);
const uniq = new Set(allSlugs);
if (uniq.size !== 300) throw new Error(`slug uniqueness failed: ${uniq.size}`);

const dupCheck = allSlugs.slice().sort().filter((s, i, a) => i > 0 && s === a[i - 1]);
const uniqd = dupCheck.join("\n") || "(empty)";

const header =
  "# Long-tail pathophysiology & pharmacology topic inventory\n\n" +
  "Generated: " +
  new Date().toISOString() +
  " | Catalog: `scripts/blog/lib/patho-pharm-longtail-topic-catalog.ts` (`buildLongTailTopicCatalog(300)`) | Slug: `slugify` in `scripts/blog/lib/patho-pharm-longtail-content.ts`.\n\n" +
  "## Truthpack / route verification\n\n" +
  "Truthpack files `.vibecheck/truthpack/ui-pages.json` and `routes.json` are **absent** in this clone. Linked routes use only paths verified against app source + E2E:\n\n" +
  "- `src/app/(student)/app/(learner)/lessons/page.tsx`, `labs/page.tsx`\n" +
  "- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/page.tsx`\n" +
  "- `src/content/lessons/lesson-library.json` (lesson slugs)\n" +
  "- `src/app/(marketing)/(default)/blog/**/page.tsx`\n" +
  "- `tests/e2e/lessons/lesson-detail-premium-smoke.spec.ts`, `tests/e2e/public/lesson-hub-performance.spec.ts`\n\n" +
  "## Slug uniqueness\n\n" +
  "| Check | Value |\n| --- | --- |\n" +
  "| Rows | " +
  String(rows.length) +
  " |\n" +
  "| Unique slugs | " +
  String(uniq.size) +
  " |\n" +
  "| Post-disambiguation duplicates | " +
  (dupCheck.length ? dupCheck.join(", ") : "none") +
  " |\n\n" +
  "## sort | uniq -d (slugs)\n\n```text\n" +
  uniqd +
  "\n```\n\n" +
  "## Topics\n\n" +
  "| # | Title | Slug | Exam / tier fit | Category / tags | Learner intent | Linked route | SEO angle | Priority |\n" +
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n";

const body = rows.map((r) => `| ${r.idx} | ${r.title} | \`${r.slug}\` ${r.rest}`).join("\n");
writeFileSync(join(appRoot, "reports", "longtail-patho-pharm-topic-inventory.md"), header + body + "\n", "utf8");
console.log("OK", allSlugs.length, uniq.size);
