import fs from "node:fs/promises";
import path from "node:path";
import { getInventoryKeys } from "@/lib/education-images/inventory";
import { getCatalogPathwayLessonsSync, listCatalogPathwayIdsWithLessonsSync, sortAndFilterLessonsForPathwayContext } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { LESSON_IMAGE_OVERRIDES } from "@/lib/content/lesson-image-overrides";
import { LESSON_IMAGE_MAP } from "@/lib/lessons/lesson-image-map";
import { resolveLessonImage } from "@/lib/content/resolve-lesson-image";

type Probe = { status: number | null; contentType: string | null; ok: boolean; error?: string };

const OUT = path.join(process.cwd(), "reports", "lesson-image-publication-audit.json");
const BASE = "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/";

async function probeUrl(url: string | null): Promise<Probe> {
  if (!url) return { status: null, contentType: null, ok: false };
  if (url.startsWith("/")) return { status: 200, contentType: "same-origin", ok: true };
  try {
    const res = await fetch(url, { method: "GET", redirect: "follow" });
    return {
      status: res.status,
      contentType: res.headers.get("content-type"),
      ok: res.ok && (res.headers.get("content-type") ?? "").startsWith("image/"),
    };
  } catch (error) {
    return {
      status: null,
      contentType: null,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function stableSample<T>(items: T[], count: number): T[] {
  const stride = Math.max(1, Math.floor(items.length / count));
  const out: T[] = [];
  for (let i = 0; i < items.length && out.length < count; i += stride) out.push(items[i]!);
  return out;
}

async function main() {
  const inventoryKeys = getInventoryKeys().map((key) => key.replace(/^\/+/, ""));
  const overrideKeys = [...new Set(Object.values(LESSON_IMAGE_OVERRIDES).map((key) => key.replace(/^\/+/, "")))];
  const mapKeys = [...new Set(LESSON_IMAGE_MAP.map((entry) => entry.objectKey.replace(/^\/+/, "")))];
  const mappedKeys = [...new Set([...overrideKeys, ...mapKeys])];

  const probeKeys = [...new Set([...inventoryKeys, ...mappedKeys])];
  const probed = await Promise.all(probeKeys.map(async (key) => ({ key, url: `${BASE}${key}`, ...(await probeUrl(`${BASE}${key}`)) })));

  const lessons = listCatalogPathwayIdsWithLessonsSync().flatMap((pathwayId) =>
    sortAndFilterLessonsForPathwayContext(pathwayId, getCatalogPathwayLessonsSync(pathwayId)).map((lesson) => ({
      pathwayId,
      lesson,
      resolution: resolveLessonImage({
        slug: lesson.slug,
        title: lesson.title,
        topicSlug: lesson.topicSlug,
        topic: lesson.topic,
        bodySystem: lesson.bodySystem,
      }),
    })),
  );
  const imageLessons = lessons.filter((row) => row.resolution.url);
  const sample = stableSample(imageLessons, 50);
  const sampleRows = await Promise.all(sample.map(async (row) => {
    const probe = await probeUrl(row.resolution.url);
    return {
      pathwayId: row.pathwayId,
      lessonSlug: row.lesson.slug,
      lessonTitle: row.lesson.title,
      imageExists: Boolean(row.resolution.url),
      mappingExists: Boolean(row.resolution.objectKey),
      rendererReceivesImageData: Boolean(row.resolution.url),
      appearsInUi: probe.ok,
      resolution: row.resolution,
      delivery: probe,
    };
  }));

  const brokenMappings = probed.filter((row) => !row.ok);
  const payload = {
    generatedAt: new Date().toISOString(),
    storage: {
      spacesPublicBase: BASE.replace(/\/$/, ""),
      inventoryImageCount: inventoryKeys.length,
      uniqueMappedObjectKeyCount: mappedKeys.length,
      totalKnownObjectKeyCount: probeKeys.length,
      publicOkCount: probed.filter((row) => row.ok).length,
      publicBrokenCount: brokenMappings.length,
    },
    registry: {
      overrideSlugCount: Object.keys(LESSON_IMAGE_OVERRIDES).length,
      overrideObjectKeyCount: overrideKeys.length,
      mapEntryCount: LESSON_IMAGE_MAP.length,
      mapObjectKeyCount: mapKeys.length,
      inventoryKeysMissingFromPublicDelivery: probed.filter((row) => inventoryKeys.includes(row.key) && !row.ok).map((row) => row.key),
      mappedKeysMissingFromInventory: mappedKeys.filter((key) => !inventoryKeys.includes(key)),
    },
    lessons: {
      totalRenderableLessons: lessons.length,
      totalLessonsWithResolvedImages: imageLessons.length,
      sampled: sampleRows.length,
      sampleAppearsInUiCount: sampleRows.filter((row) => row.appearsInUi).length,
      sampleFailures: sampleRows.filter((row) => !row.appearsInUi),
    },
    brokenMappings,
    sampleRows,
  };

  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(OUT, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(JSON.stringify({
    inventoryImageCount: payload.storage.inventoryImageCount,
    totalLessonsWithResolvedImages: payload.lessons.totalLessonsWithResolvedImages,
    sampled: payload.lessons.sampled,
    sampleAppearsInUiCount: payload.lessons.sampleAppearsInUiCount,
    publicBrokenCount: payload.storage.publicBrokenCount,
    report: path.relative(process.cwd(), OUT),
  }, null, 2));
}

await main();
