import { RT_ENCYCLOPEDIA_ENTRIES } from "./respiratory-therapy-encyclopedia-data";
import { RT_ENCYCLOPEDIA_SUPPLEMENTARY } from "./respiratory-therapy-encyclopedia-supplementary";
import { RT_ENCYCLOPEDIA_EXTRA } from "./respiratory-therapy-encyclopedia-extra";
import { RT_ENCYCLOPEDIA_FINAL } from "./respiratory-therapy-encyclopedia-final";
import { RT_ENCYCLOPEDIA_BATCH5 } from "./respiratory-therapy-encyclopedia-batch5";

const PROFESSION = "respiratory-therapy";
const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;
const BATCH_SIZE = 200;
const ADMIN_USERNAME = "NurseNest";
const ADMIN_PASSWORD = "system-no-login";

async function seed() {
  const allRaw = [
    ...RT_ENCYCLOPEDIA_ENTRIES,
    ...RT_ENCYCLOPEDIA_SUPPLEMENTARY,
    ...RT_ENCYCLOPEDIA_EXTRA,
    ...RT_ENCYCLOPEDIA_FINAL,
    ...RT_ENCYCLOPEDIA_BATCH5,
  ];

  const slugMap = new Map<string, typeof allRaw[0]>();
  for (const e of allRaw) {
    slugMap.set(e.slug, e);
  }
  const unique = Array.from(slugMap.values());

  console.log(`Total raw entries: ${allRaw.length}`);
  console.log(`Unique entries (after dedup): ${unique.length}`);

  const formatted = unique.map((e) => ({
    profession: PROFESSION,
    slug: e.slug,
    title: e.title,
    category: e.category,
    status: "published",
    seoTitle: e.seoTitle,
    seoDescription: e.seoDescription,
    seoKeywords: e.seoKeywords,
    overview: e.overview,
    mechanismPhysiology: e.mechanismPhysiology,
    clinicalRelevance: e.clinicalRelevance,
    signsSymptoms: e.signsSymptoms,
    assessment: e.assessment,
    management: e.management,
    complications: e.complications,
    clinicalPearls: e.clinicalPearls,
    examPitfalls: e.examPitfalls,
    faqJson: e.faqJson,
    relatedLessonIds: e.relatedLessonIds,
    relatedQuestionIds: e.relatedQuestionIds,
  }));

  for (let i = 0; i < formatted.length; i += BATCH_SIZE) {
    const batch = formatted.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(formatted.length / BATCH_SIZE);
    console.log(`\nSending batch ${batchNum}/${totalBatches} (${batch.length} entries)...`);

    const res = await fetch(`${BASE_URL}/api/admin/encyclopedia/bulk-import`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-username": ADMIN_USERNAME,
        "x-password": ADMIN_PASSWORD,
      },
      body: JSON.stringify({ entries: batch }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`Batch ${batchNum} failed (${res.status}): ${text}`);
      process.exit(1);
    }

    const result = await res.json();
    console.log(`Batch ${batchNum} result: imported=${result.imported}, errors=${result.errors?.length || 0}, total=${result.total}`);
    if (result.errors?.length > 0) {
      result.errors.forEach((err: string) => console.warn(`  Warning: ${err}`));
    }
  }

  console.log("\n--- Verifying ---");
  const statsRes = await fetch(`${BASE_URL}/api/admin/encyclopedia/stats`, {
    headers: { "x-username": ADMIN_USERNAME, "x-password": ADMIN_PASSWORD },
  });
  if (statsRes.ok) {
    const stats = await statsRes.json();
    console.log("Encyclopedia stats:", JSON.stringify(stats, null, 2));
  }

  console.log("\nSeed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
