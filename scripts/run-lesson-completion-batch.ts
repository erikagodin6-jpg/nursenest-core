import "../src/lib/db/env-bootstrap";

import { runLessonCompletionBatch } from "../src/lib/lessons/lesson-batch-completion";

function arg(name: string): string | undefined {
  const idx = process.argv.findIndex((x) => x === `--${name}`);
  if (idx < 0) return undefined;
  return process.argv[idx + 1];
}

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

async function main() {
  const pathwayId = arg("pathwayId") ?? "us-rn-nclex-rn";
  const batchSize = Number(arg("batchSize") ?? "20");
  const offset = Number(arg("offset") ?? "0");
  const write = hasFlag("write");
  const mode = (arg("mode") as "complete" | "refine" | undefined) ?? "complete";
  const onlyCompleted = hasFlag("onlyCompleted");
  const onlyNotComplete = hasFlag("onlyNotComplete");
  const focusArea = arg("focusArea") as
    | "cardiovascular"
    | "respiratory"
    | "neurological"
    | "endocrine"
    | "renal"
    | "gi"
    | "hematology"
    | "pharmacology"
    | "maternity"
    | "pediatrics"
    | "mental_health"
    | "prioritization_safety"
    | undefined;

  const report = await runLessonCompletionBatch({
    pathwayId,
    batchSize,
    offset,
    write,
    mode,
    onlyCompleted,
    onlyNotComplete,
    focusArea,
  });

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
