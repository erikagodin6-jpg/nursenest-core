/**
 * One-shot editorial pass: normalize catalog `topic` to controlled categories and premiumize titles.
 * Run: npx tsx scripts/apply-nursing-catalog-taxonomy.mts (cwd: nursenest-core)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { normalizeLessonCategory, premiumizeLessonDisplayTitle } from "@/lib/lessons/lesson-taxonomy";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CORE = path.resolve(__dirname, "..");
const CATALOG = path.join(CORE, "src/content/pathway-lessons/catalog.json");

type Catalog = {
  version: number;
  pathways: Record<string, { lessons: Array<Record<string, unknown>> }>;
};

function patchSeoTitle(newTitle: string, oldSeo: unknown): string {
  const s = typeof oldSeo === "string" ? oldSeo : "";
  const idx = s.indexOf("| NurseNest");
  if (idx !== -1) return `${newTitle} | NurseNest`;
  if (s.startsWith("Integrated review:")) return newTitle;
  return s.length > 0 ? s : newTitle;
}

function main(): void {
  const raw = fs.readFileSync(CATALOG, "utf8");
  const data = JSON.parse(raw) as Catalog;
  let topics = 0;
  let titles = 0;
  let seos = 0;
  for (const [, bucket] of Object.entries(data.pathways ?? {})) {
    const lessons = bucket?.lessons;
    if (!Array.isArray(lessons)) continue;
    for (const row of lessons) {
      const t = typeof row.topic === "string" ? row.topic : "";
      const nextTopic = normalizeLessonCategory(t);
      if (nextTopic !== t) {
        row.topic = nextTopic;
        topics += 1;
      }
      const title = typeof row.title === "string" ? row.title : "";
      const slug = typeof row.slug === "string" ? row.slug : "";
      const nextTitle = premiumizeLessonDisplayTitle(title, slug);
      if (nextTitle !== title) {
        row.title = nextTitle;
        titles += 1;
        const seo = row.seoTitle;
        const nextSeo = patchSeoTitle(nextTitle, seo);
        if (typeof seo === "string" && nextSeo !== seo) {
          row.seoTitle = nextSeo;
          seos += 1;
        }
      }
    }
  }
  fs.writeFileSync(CATALOG, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Updated topics=${topics} titles=${titles} seoTitles=${seos} → ${CATALOG}`);
}

void main();
