#!/usr/bin/env node
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const defaultRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const CONTENT_DIRECTORY_CONTRACTS = [
  {
    relPath: "nursenest-core/src/content/pathway-lessons/allied-professions",
    required: false,
    jsonOptional: true,
  },
  {
    relPath: "nursenest-core/src/content/pathway-lessons/generated-indexes",
    required: true,
    jsonOptional: true,
  },
];

function directoryJsonFiles(absPath) {
  return readdirSync(absPath)
    .filter((name) => name.endsWith(".json"))
    .sort();
}

export function verifyOptionalContentDirectories({ root = defaultRoot, logger = console } = {}) {
  const failures = [];
  const warnings = [];

  for (const contract of CONTENT_DIRECTORY_CONTRACTS) {
    const absPath = path.join(root, contract.relPath);
    const relPath = path.relative(root, absPath);

    if (!existsSync(absPath)) {
      const message = `${relPath} is missing`;
      if (contract.required) {
        failures.push(message);
      } else {
        warnings.push(`${message} (optional)`);
      }
      continue;
    }

    if (!statSync(absPath).isDirectory()) {
      failures.push(`${relPath} exists but is not a directory`);
      continue;
    }

    const jsonFiles = directoryJsonFiles(absPath);
    if (jsonFiles.length === 0 && contract.jsonOptional) {
      warnings.push(`${relPath} contains no JSON shards/indexes`);
    }
  }

  for (const warning of warnings) {
    logger.warn(`[verify:content-dirs] warning: ${warning}`);
  }

  return { failures, warnings };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { failures } = verifyOptionalContentDirectories();
  if (failures.length > 0) {
    for (const message of failures) {
      console.error(`[verify:content-dirs] FAIL: ${message}`);
    }
    process.exit(1);
  }
  console.log("[verify:content-dirs] PASS");
}
