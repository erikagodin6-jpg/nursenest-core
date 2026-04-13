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
  const write = hasFlag("write");

  const report = await runLessonCompletionBatch({
    pathwayId,
    batchSize,
    write,
  });

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
