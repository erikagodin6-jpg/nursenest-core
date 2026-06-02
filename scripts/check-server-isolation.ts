#!/usr/bin/env npx tsx
/**
 * Ensures `tsc -p tsconfig.server.json` does not include any file under client/src/
 * (server/client TypeScript isolation).
 *
 * Also scans all server/*.ts (recursive) for static import specifiers pointing at client/src (graph leak risk).
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SERVER_DIR = path.join(ROOT, "server");

/** Static ESM imports only — `import()` string literals are allowed for opaque runtime loaders (e.g. seeds). */
const STATIC_IMPORT_RE =
  /import\s+(?:type\s+)?[\s\S]*?\s+from\s+["']([^"']+)["']/g;

function normalizeSlashes(p: string): string {
  return p.replace(/\\/g, "/");
}

function isClientSrcSpecifier(spec: string): boolean {
  const n = normalizeSlashes(spec.trim());
  return n.includes("client/src/") || n.endsWith("client/src") || /client\/src\//.test(n);
}

function tscClientSrcFiles(): string[] {
  let out: string;
  try {
    out = execSync("npx tsc --listFilesOnly -p tsconfig.server.json", {
      cwd: ROOT,
      encoding: "utf-8",
      maxBuffer: 64 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (e: unknown) {
    const err = e as { stderr?: Buffer; message?: string };
    const msg = err.stderr?.toString() || err.message || String(e);
    console.error("check-server-isolation: tsc --listFilesOnly failed:\n", msg);
    process.exit(1);
  }

  return out
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => normalizeSlashes(l).includes("/client/src/"));
}

function walkTsFiles(dir: string, base = ""): string[] {
  const acc: string[] = [];
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, ent.name);
    if (ent.isDirectory()) {
      acc.push(...walkTsFiles(path.join(dir, ent.name), rel));
    } else if (ent.isFile() && ent.name.endsWith(".ts")) {
      acc.push(rel);
    }
  }
  return acc;
}

function staticImportViolations(): { file: string; spec: string }[] {
  const violations: { file: string; spec: string }[] = [];
  for (const rel of walkTsFiles(SERVER_DIR)) {
    const full = path.join(SERVER_DIR, rel);
    let content: string;
    try {
      content = fs.readFileSync(full, "utf-8");
    } catch {
      continue;
    }

    let m: RegExpExecArray | null;
    STATIC_IMPORT_RE.lastIndex = 0;
    while ((m = STATIC_IMPORT_RE.exec(content))) {
      const spec = m[1];
      if (!spec.startsWith(".") && !spec.startsWith("/") && !spec.startsWith("@/")) continue;
      if (isClientSrcSpecifier(spec)) violations.push({ file: `server/${rel}`, spec });
    }
  }
  return violations;
}

function main() {
  const fromTsc = tscClientSrcFiles();
  if (fromTsc.length > 0) {
    console.error("check-server-isolation: tsc server program includes client/src files:\n");
    for (const f of fromTsc.slice(0, 50)) console.error(" ", f);
    if (fromTsc.length > 50) console.error(`  ... and ${fromTsc.length - 50} more`);
    process.exit(1);
  }

  const staticHits = staticImportViolations();
  if (staticHits.length > 0) {
    console.error("check-server-isolation: static import specifiers referencing client/src:\n");
    for (const v of staticHits) console.error(`  ${v.file}\n    → ${v.spec}\n`);
    process.exit(1);
  }

  console.log("OK: server TS graph excludes client/src; no static client/src imports under server/.");
  process.exit(0);
}

main();
