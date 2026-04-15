#!/usr/bin/env node
/**
 * Stream-validate a JSONL file of exam question import records (one JSON object per line).
 * Does not connect to the database.
 *
 * Usage: npm run content:validate-questions-jsonl -- path/to/file.jsonl
 */
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { resolve } from "node:path";

import { examQuestionImportRecordSchema } from "../../src/lib/content-pipeline/schemas/exam-question-import-record";
import { examQuestionImportDedupeKey } from "../../src/lib/content-pipeline/deduplication-strategy";

async function main() {
  const fileArg = process.argv[2];
  if (!fileArg) {
    console.error("Usage: content:validate-questions-jsonl <file.jsonl>");
    process.exit(2);
  }
  const filePath = fileArg.startsWith("/") ? fileArg : resolve(process.cwd(), fileArg);

  let lineNo = 0;
  let ok = 0;
  const dupCounts = new Map<string, number>();
  const errors: string[] = [];

  const rl = createInterface({
    input: createReadStream(filePath, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    lineNo += 1;
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    let obj: unknown;
    try {
      obj = JSON.parse(trimmed) as unknown;
    } catch (e) {
      errors.push(`Line ${lineNo}: invalid JSON — ${e instanceof Error ? e.message : String(e)}`);
      continue;
    }

    const parsed = examQuestionImportRecordSchema.safeParse(obj);
    if (!parsed.success) {
      errors.push(`Line ${lineNo}: schema — ${parsed.error.message}`);
      continue;
    }

    ok += 1;
    const row = parsed.data;
    if (!row.allowDuplicateStem) {
      const k = examQuestionImportDedupeKey({
        exam: row.exam,
        tier: row.tier,
        countryCode: row.countryCode,
        stem: row.stem,
      });
      dupCounts.set(k, (dupCounts.get(k) ?? 0) + 1);
    }
  }

  let dupWarn = 0;
  for (const [k, n] of dupCounts) {
    if (n > 1) {
      dupWarn += 1;
      console.warn(`[duplicate stem in file] ${k} — ${n} occurrences`);
    }
  }

  console.log(`Validated ${ok} records (${lineNo} lines read).`);
  if (dupWarn) console.warn(`Duplicate natural keys within file: ${dupWarn} (review before import).`);

  if (errors.length) {
    console.error("Validation failures:");
    for (const e of errors.slice(0, 50)) console.error(e);
    if (errors.length > 50) console.error(`… and ${errors.length - 50} more`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
