import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { ALLIED_MASTERY_MODULES } from "../src/lib/allied/allied-mastery-modules";
import {
  createDraftScaffoldForModule,
  evaluateAlliedMasteryScaffold,
  mergeScaffoldWithoutOverwrite,
  type AlliedMasteryModuleScaffold,
  type AlliedMasteryScaffoldMap,
} from "../src/lib/allied/allied-mastery-module-scaffolding";

export const ALLIED_MASTERY_SCAFFOLDS_PATH = "src/content/allied-mastery/generated-scaffolds.json";

export type AlliedMasteryScaffoldGenerationResult = {
  path: string;
  generatedAt: string;
  modulesChecked: number;
  modulesGenerated: number;
  modulesCompleted: number;
  generatedModuleIds: string[];
  incompleteBefore: Array<{ moduleId: string; missing: string[] }>;
  incompleteAfter: Array<{ moduleId: string; missing: string[] }>;
};

function readExistingScaffolds(path = ALLIED_MASTERY_SCAFFOLDS_PATH): AlliedMasteryScaffoldMap {
  if (!existsSync(path)) return {};
  const raw = readFileSync(path, "utf8").trim();
  if (!raw) return {};
  return JSON.parse(raw) as AlliedMasteryScaffoldMap;
}

export async function ensureAlliedMasteryScaffolds(path = ALLIED_MASTERY_SCAFFOLDS_PATH): Promise<AlliedMasteryScaffoldGenerationResult> {
  const existing = readExistingScaffolds(path);
  const next: AlliedMasteryScaffoldMap = { ...existing };
  const generatedModuleIds: string[] = [];
  const incompleteBefore: AlliedMasteryScaffoldGenerationResult["incompleteBefore"] = [];

  for (const module of ALLIED_MASTERY_MODULES) {
    const current = next[module.id];
    const before = evaluateAlliedMasteryScaffold(current, module);
    if (before.status === "complete") continue;

    incompleteBefore.push({ moduleId: module.id, missing: before.missing });
    const generated = createDraftScaffoldForModule(module);
    const merged = mergeScaffoldWithoutOverwrite(current, generated);
    next[module.id] = merged;
    generatedModuleIds.push(module.id);
  }

  const incompleteAfter: AlliedMasteryScaffoldGenerationResult["incompleteAfter"] = [];
  let modulesCompleted = 0;
  for (const module of ALLIED_MASTERY_MODULES) {
    const after = evaluateAlliedMasteryScaffold(next[module.id], module);
    if (after.status === "complete") {
      modulesCompleted += 1;
    } else {
      incompleteAfter.push({ moduleId: module.id, missing: after.missing });
    }
  }

  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(sortScaffolds(next), null, 2)}\n`);

  return {
    path,
    generatedAt: new Date().toISOString(),
    modulesChecked: ALLIED_MASTERY_MODULES.length,
    modulesGenerated: generatedModuleIds.length,
    modulesCompleted,
    generatedModuleIds,
    incompleteBefore,
    incompleteAfter,
  };
}

function sortScaffolds(scaffolds: AlliedMasteryScaffoldMap): AlliedMasteryScaffoldMap {
  return Object.fromEntries(
    Object.entries(scaffolds).sort(([a], [b]) => a.localeCompare(b)),
  ) as Record<string, AlliedMasteryModuleScaffold>;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  ensureAlliedMasteryScaffolds().then((result) => {
    console.log(JSON.stringify(result, null, 2));
    if (result.incompleteAfter.length > 0) process.exitCode = 1;
  }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
