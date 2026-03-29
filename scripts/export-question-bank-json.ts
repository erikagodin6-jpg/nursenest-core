import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { importClientDataAbsolute } from "../server/client-data-import";

function careerQuestionJsonOutputPath(stem: string): string {
  return path.resolve(process.cwd(), "data", "career-questions", `${stem}.json`);
}

function careerQuestionModulePath(stem: string): string {
  return path.resolve(process.cwd(), "client", "src", "data", "career-questions", stem);
}

async function loadOnlyQuestionArrayFromModule(mod: any, context: string): Promise<any[]> {
  const arrays: Array<{ key: string; arr: any[] }> = [];
  for (const [key, value] of Object.entries(mod || {})) {
    if (!Array.isArray(value)) continue;
    arrays.push({ key, arr: value });
  }

  // Prefer arrays with typical question fields.
  const scored = arrays
    .map(({ key, arr }) => {
      const first = arr[0] as any | undefined;
      const hasId = Boolean(first && typeof first.id === "string");
      const hasTopic = Boolean(first && typeof first.topic === "string");
      const hasStem = Boolean(first && typeof first.stem === "string");
      const score = (hasId ? 3 : 0) + (hasTopic ? 3 : 0) + (hasStem ? 1 : 0) + Math.min(arr.length, 1000) / 1000;
      return { key, arr, score };
    })
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    throw new Error(`[question-bank-export] No array exports found (${context})`);
  }

  return scored[0].arr;
}

const STEMS_TO_EXPORT: string[] = [
  // Paramedic
  "paramedic-questions",
  "paramedic-questions-expansion",
  "paramedic-questions-batch2",
  "paramedic-questions-batch3",
  "paramedic-questions-batch4",
  "paramedic-questions-batch5",
  "paramedic-questions-batch6",

  // RRT
  "rrt-questions",
  "rrt-questions-batch1",
  "rrt-questions-batch2",
  "rrt-questions-batch3",
  "rrt-questions-batch4",
  "rrt-questions-batch5",
  "rrt-questions-batch6",
  "rrt-questions-batch7",
  "rrt-questions-batch8",

  // MLT
  "mlt-questions",
  "mlt-questions-batch2",
  "mlt-questions-expansion",
  "mlt-questions-batch3",
  "mlt-questions-batch4",
  "mlt-questions-batch5",
  "mlt-questions-batch6",
  "mlt-questions-batch7",

  // Imaging
  "imaging-questions",
  "imaging-questions-expansion",
  "imaging-questions-expansion-2",
  "imaging-questions-batch2",
  "imaging-questions-batch3",
  "imaging-questions-batch4",
  "imaging-questions-batch5",
  "imaging-questions-batch6",

  // OT/OTA
  "ota-questions",
  "ota-questions-expansion",
  "ota-questions-batch2",
  "ota-questions-batch3",
  "ota-questions-batch4",
  "ota-questions-batch5",
  "ota-questions-batch6",
  "ota-questions-batch7",
  "ota-questions-batch8",
  "ota-questions-batch9",
  "ota-questions-batch10",
  "ota-questions-batch11",
  "ota-questions-batch12",
  "ota-questions-batch13",
  "ota-questions-batch14",
  "ota-questions-batch15",

  // PTA
  "pta-questions",
  "pta-questions-expansion",
  "pta-questions-batch1",
  "pta-questions-batch2",
  "pta-questions-batch3",
  "pta-questions-batch4",
  "pta-questions-batch5",
  "pta-questions-batch6",
  "pta-questions-batch7",
  "pta-questions-batch8",
  "pta-questions-batch9",
  "pta-questions-batch10",
  "pta-questions-batch11",
  "pta-questions-batch12",
  "pta-questions-batch13",
  "pta-questions-batch14",
  "pta-questions-batch15",
  "pta-questions-batch16",
  "pta-questions-batch17",
  "pta-questions-batch18",
  "pta-questions-batch19",
  "pta-questions-batch20",
  "pta-questions-batch21",
  "pta-questions-batch22",
  "pta-questions-batch23",
  "pta-questions-batch24",
  "pta-questions-batch25",
  "pta-questions-batch26",
  "pta-questions-batch27",
  "pta-questions-batch28",
  "pta-questions-batch29",
  "pta-questions-batch30",
  "pta-questions-batch31",
  "pta-questions-batch32",
  "pta-questions-batch33",
  "pta-questions-batch34",
  "pta-questions-batch35",

  // Surgical tech
  "surgical-technologist-questions",
  "surgical-technologist-questions-2",
  "surgical-technologist-questions-3",
  "surgical-technologist-questions-4",
  "surgical-technologist-questions-5",
  "surgical-technologist-questions-6",
  "surgical-technologist-questions-7",
  "surgical-technologist-questions-8",
  "surgical-technologist-questions-9",
  "surgical-technologist-questions-10",
  "surgical-technologist-questions-11",

  // HIM
  "him-questions",
  "him-questions-batch2",
  "him-questions-batch3",
  "him-questions-batch4",
  "him-questions-batch5",
  "him-questions-batch6",
  "him-questions-batch7",

  // Sonography
  "sonography-questions",
  "sonography-questions-batch2",
  "sonography-questions-batch3",
  "sonography-questions-batch4",
  "sonography-questions-batch5",
  "sonography-questions-batch6",
  "sonography-questions-batch7",

  // Cardiac sonographer
  "cardiac-sonographer-questions",
  "cardiac-sonographer-questions-batch2",
  "cardiac-sonographer-questions-batch3",
  "cardiac-sonographer-questions-batch4",
  "cardiac-sonographer-questions-batch5",
  "cardiac-sonographer-questions-batch6",
  "cardiac-sonographer-questions-batch7",

  // Psychotherapist
  "psychotherapist-questions",
  "psychotherapist-questions-batch2",
  "psychotherapist-questions-batch3",
  "psychotherapist-questions-batch4",

  // Addictions counsellor
  "addictions-counsellor-questions",
  "addictions-counsellor-questions-batch2",
  "addictions-counsellor-questions-batch3",
  "addictions-counsellor-questions-batch4",

  // Pharmacy tech
  "pharmacy-tech-questions",
  "pharmacy-tech-questions-batch2",
  "pharmacy-tech-questions-batch3",
  "pharmacy-tech-questions-batch4",
  "pharmacy-tech-questions-batch5",
  "pharmacy-tech-questions-batch6",
  "pharmacy-tech-questions-batch7",
  "pharmacy-tech-questions-batch8",
  "pharmacy-tech-questions-batch9",
  "pharmacy-tech-questions-extended",
  "pharmacy-tech-questions-pebc",
  "pharmacy-tech-questions-expansion",

  // Social worker
  "social-worker-questions",
  "social-worker-questions-batch2",
  "social-worker-questions-batch3",
  "social-worker-questions-batch4",
  "social-worker-questions-batch5",
  "social-worker-questions-batch6",
  "social-worker-questions-batch7",
  "social-worker-questions-batch8",
  "social-worker-questions-batch9",
  "social-worker-questions-batch10",
  "social-worker-questions-batch11",
  "social-worker-questions-batch12",
  "social-worker-questions-batch13",
  "social-worker-questions-batch14",
  "social-worker-questions-batch15",
  "social-worker-questions-batch16",
  "social-worker-questions-batch17",
  "social-worker-questions-batch18",
  "social-worker-questions-batch19",
  "social-worker-questions-batch20",
  "social-worker-questions-batch21",
  "social-worker-questions-batch22",
  "social-worker-questions-batch23",
  "social-worker-questions-batch24",
  "social-worker-questions-batch25",
  "social-worker-questions-batch26",
  "social-worker-questions-batch27",
];

async function run() {
  const outDir = path.resolve(process.cwd(), "data/career-questions");
  await mkdir(outDir, { recursive: true });

  for (const stem of STEMS_TO_EXPORT) {
    const jsonPath = careerQuestionJsonOutputPath(stem);
    const modulePath = careerQuestionModulePath(stem);
    const mod = await importClientDataAbsolute(modulePath);
    const payload = await loadOnlyQuestionArrayFromModule(mod, `stem=${stem}`);
    if (!Array.isArray(payload)) throw new Error(`[question-bank-export] Expected array for stem=${stem}`);
    await writeFile(jsonPath, JSON.stringify(payload));
    console.log(`[question-bank-export] wrote ${path.basename(jsonPath)} (${payload.length} records)`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

