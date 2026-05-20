#!/usr/bin/env node
/**
 * Scan learner / marketing / admin app trees for forbidden legacy content-store imports.
 * Writes reports/content-orphan-audit.md and exits non-zero on violations (outside allowlists).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const coreRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reportsDir = path.join(coreRoot, "reports");
const reportMd = path.join(reportsDir, "content-orphan-audit.md");

const SCAN_DIRS = [
  path.join(coreRoot, "src", "app", "(student)", "app", "(learner)"),
  path.join(coreRoot, "src", "app", "(marketing)"),
  path.join(coreRoot, "src", "app", "(admin)", "admin"),
];

const EXT = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs"]);

const IGNORE_DIR_NAMES = new Set(["node_modules", ".next", "dist", "coverage"]);

/** Substrings — if file path contains any, file is allowlisted for orphan patterns. */
const PATH_ALLOWLIST = [
  `${path.sep}osce-legacy-fallback`,
  `${path.sep}legacy-osce-stations-runtime`,
  `${path.sep}legacy-public-content-merge`,
  `${path.sep}legacy-public-content-pipeline`,
  `${path.sep}legacy-pathway-lesson-apply`,
  `${path.sep}replit-import${path.sep}`,
  `${path.sep}migrate-`,
  `${path.sep}migrations${path.sep}`,
  `${path.sep}content-pipeline${path.sep}`,
  `${path.sep}content-source-of-truth${path.sep}`,
];

const RULES = [
  {
    id: "import_client_src_data",
    test: (line) => /from\s+["'][^"']*client\/src\/data/.test(line),
  },
  {
    id: "import_server_data",
    test: (line) => /from\s+["'][^"']*server\/data/.test(line),
  },
  {
    id: "import_legacyLessons_json",
    test: (line) => /legacyLessons\.json|legacy-lessons\.json/i.test(line) && /import|from\s+['"]/.test(line),
  },
  {
    id: "legacyLessons_named_import",
    test: (line) => /\bimport\s*\{[^}]*\blegacyLessons\b/.test(line),
  },
];

function isAllowlisted(filePath) {
  const n = filePath.split(path.sep).join(path.sep);
  return PATH_ALLOWLIST.some((p) => n.includes(p));
}

function walk(dir, out) {
  if (!fs.existsSync(dir)) return;
  let st;
  try {
    st = fs.statSync(dir);
  } catch {
    return;
  }
  if (!st.isDirectory()) return;
  const base = path.basename(dir);
  if (IGNORE_DIR_NAMES.has(base)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else if (ent.isFile()) {
      const ext = path.extname(ent.name);
      if (EXT.has(ext)) out.push(full);
    }
  }
}

function main() {
  const files = [];
  for (const d of SCAN_DIRS) walk(d, files);
  files.sort();

  /** @type {{ file: string; line: number; text: string; rule: string }[]} */
  const violations = [];

  for (const file of files) {
    if (isAllowlisted(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("*")) return;
      for (const r of RULES) {
        if (r.test(trimmed)) {
          violations.push({ file, line: i + 1, text: trimmed, rule: r.id });
        }
      }
    });
  }

  const stamp = new Date().toISOString();
  const linesOut = [
    "# Content orphan audit (generated)",
    "",
    `Generated: ${stamp} (\`npm run content:orphan:audit\`)`,
    "",
    "## Scope",
    "",
    ...SCAN_DIRS.map((d) => `- \`${path.relative(coreRoot, d)}\``),
    "",
    "## Results",
    "",
    violations.length === 0 ? "_No violations._" : "",
  ];

  if (violations.length > 0) {
    linesOut.push("", "| file | line | rule |", "|---|---:|---|");
    for (const v of violations) {
      const rel = path.relative(coreRoot, v.file).replace(/\|/g, "\\|");
      linesOut.push(`| ${rel} | ${v.line} | ${v.rule} |`);
      linesOut.push("", "```", v.text.slice(0, 500), "```", "");
    }
  }

  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(reportMd, linesOut.filter(Boolean).join("\n"), "utf8");

  if (violations.length > 0) {
    console.error(`[content:orphan:audit] FAIL — ${violations.length} violation(s). See ${path.relative(coreRoot, reportMd)}`);
    process.exit(1);
  }
  console.info(`[content:orphan:audit] ok (${files.length} files scanned)`);
}

main();
