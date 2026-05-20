#!/usr/bin/env npx tsx
/**
 * Fails fast if server/storage.ts was accidentally overwritten (e.g. pasted shell output).
 * Intended for CI and pre-commit style workflows.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE = path.resolve(__dirname, "../server/storage.ts");
const MIN_BYTES = 2_000;

function main() {
  if (!fs.existsSync(STORAGE)) {
    console.error(`check-storage-sanity: missing ${STORAGE}`);
    process.exit(1);
  }

  const st = fs.statSync(STORAGE);
  if (st.size < MIN_BYTES) {
    console.error(
      `check-storage-sanity: server/storage.ts is only ${st.size} bytes (expected >= ${MIN_BYTES}). ` +
        "It may have been replaced by mistake.",
    );
    process.exit(1);
  }

  const head = fs.readFileSync(STORAGE, "utf-8").slice(0, 400);
  const trimmed = head.trimStart();
  if (!trimmed.startsWith("import ")) {
    console.error(
      "check-storage-sanity: server/storage.ts does not start with an import statement. " +
        "Restore the real module from version control if this file was corrupted.",
    );
    process.exit(1);
  }

  if (/^npm\s+install\b/m.test(head) || /^yarn\s+/m.test(head) || /^pnpm\s+/m.test(head)) {
    console.error(
      "check-storage-sanity: server/storage.ts looks like package-manager output, not source code.",
    );
    process.exit(1);
  }

  console.log(`OK: server/storage.ts sanity (${st.size} bytes).`);
  process.exit(0);
}

main();
