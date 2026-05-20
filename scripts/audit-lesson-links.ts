/**
 * Validates **exam-pathway** marketing URLs that include `/lessons` against
 * `resolveExamPathwayFromMarketingHubSegment` (same resolver as lesson hub pages).
 *
 * The generic `audit:internal-links` script only checks App Router shape; it accepts
 * invalid hub segments (for example `pn` instead of `lpn` for US NCLEX-PN) because routes
 * are dynamic, but those URLs 404 at runtime.
 *
 * Run: `npm run audit:lesson-links`
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { extractInternalRefsFromSource } from "./audit-internal-links";
import {
  buildExamPathwayPath,
  listPublicExamPathways,
  resolveExamPathwayFromMarketingHubSegment,
} from "../src/lib/exam-pathways/exam-product-registry";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const IGNORE_DIRS = new Set([
  "node_modules",
  ".next",
  "dist",
  ".git",
  "coverage",
  "__tests__",
  "e2e",
]);

const SCAN_EXTENSIONS = new Set([".tsx", ".ts", ".jsx", ".js", ".mjs", ".cjs", ".json"]);

/** `/us|canada/{role}/{exam}/lessons` plus optional `/…` (detail, topics, trailing slash). */
export const PATHWAY_LESSONS_URL_RE =
  /^\/(us|canada)\/([^/]+)\/([^/]+)\/lessons(\/.*)?$/i;

function stripQueryHash(href: string): string {
  let s = href.split("#")[0] ?? href;
  s = s.split("?")[0] ?? s;
  return s;
}

/**
 * Returns true when the pathname is a US/Canada exam hub lessons URL and the
 * country / role / exam segments resolve to a known pathway (including NP SEO aliases).
 */
export function isResolvableExamPathwayLessonsPath(pathname: string): boolean {
  const pathOnly = stripQueryHash(pathname.trim());
  const p = pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;
  const m = p.match(PATHWAY_LESSONS_URL_RE);
  if (!m) return false;
  const country = m[1]!;
  const role = m[2]!;
  const exam = m[3]!;
  return Boolean(resolveExamPathwayFromMarketingHubSegment(country, role, exam));
}

export type LessonLinkAuditFailure = { file: string; line: number; path: string; kind: string };

function shouldScanFile(filePath: string): boolean {
  const ext = path.extname(filePath);
  if (!SCAN_EXTENSIONS.has(ext)) return false;
  if (filePath.includes(`${path.sep}node_modules${path.sep}`)) return false;
  if (filePath.includes(".next")) return false;
  const base = path.basename(filePath);
  if (base.endsWith(".test.ts") || base.endsWith(".test.tsx") || base.endsWith(".spec.ts")) return false;
  if (base === "audit-internal-links.test.ts" || base === "audit-lesson-links.test.ts") return false;
  return true;
}

function walkFiles(dir: string, out: string[]): void {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (IGNORE_DIRS.has(e.name)) continue;
      walkFiles(full, out);
    } else if (e.isFile()) {
      out.push(full);
    }
  }
}

function collectSourceFiles(dir: string, out: string[]): void {
  const raw: string[] = [];
  walkFiles(dir, raw);
  for (const f of raw) {
    if (shouldScanFile(f)) out.push(f);
  }
}

/** Extract quoted pathway /lessons URLs that `extractInternalRefsFromSource` may miss (e.g. JSON, prompts). */
function extractPathwayLessonsLiteralsFromLine(line: string): string[] {
  const out: string[] = [];
  const re = /["'`](\/(?:us|canada)\/[^"'`\s]+\/lessons[^"'`\s]*)["'`]/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    const raw = m[1]!;
    if (!raw.includes("/lessons")) continue;
    out.push(stripQueryHash(raw));
  }
  return out;
}

export function collectPathwayLessonLinkFailures(): { failures: LessonLinkAuditFailure[]; filesScanned: number } {
  const failures: LessonLinkAuditFailure[] = [];
  const scanRoots = [
    path.join(ROOT, "src"),
    path.join(ROOT, "scripts"),
    path.join(ROOT, "data"),
  ];
  const allFiles: string[] = [];
  for (const r of scanRoots) {
    if (fs.existsSync(r)) collectSourceFiles(r, allFiles);
  }

  const seen = new Set<string>();

  const check = (file: string, lineNum: number, raw: string, kind: string) => {
    if (!raw.startsWith("/")) return;
    const pathOnly = stripQueryHash(raw);
    if (!PATHWAY_LESSONS_URL_RE.test(pathOnly)) return;
    if (isResolvableExamPathwayLessonsPath(pathOnly)) return;
    const key = `${file}:${lineNum}:${pathOnly}:${kind}`;
    if (seen.has(key)) return;
    seen.add(key);
    failures.push({ file, line: lineNum, path: pathOnly, kind });
  };

  for (const abs of allFiles) {
    let content: string;
    try {
      content = fs.readFileSync(abs, "utf8");
    } catch {
      continue;
    }
    const rel = path.relative(ROOT, abs);
    const lines = content.split(/\r?\n/);

    const refs = extractInternalRefsFromSource(content, rel);
    for (const ref of refs) {
      check(ref.file, ref.line, ref.raw, ref.kind);
    }

    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      for (const lit of extractPathwayLessonsLiteralsFromLine(line)) {
        check(rel, lineNum, lit, "literal-scan");
      }
    });
  }

  return { failures, filesScanned: allFiles.length };
}

function printRouteInventory(): void {
  const pathways = listPublicExamPathways();
  console.log("Canonical public pathway lesson hubs (from exam-product-registry + buildExamPathwayPath):\n");
  for (const p of pathways) {
    console.log(`  ${buildExamPathwayPath(p, "lessons")}  (${p.id})`);
  }
  console.log("");
}

function main(): void {
  const { failures, filesScanned } = collectPathwayLessonLinkFailures();

  console.log("Lesson pathway link audit (exam hub /us|canada/.../lessons)\n");
  printRouteInventory();
  console.log(`Files scanned: ${filesScanned}\n`);

  if (failures.length === 0) {
    console.log("OK: no unresolvable exam-pathway /lessons URLs found in scanned sources.\n");
    process.exit(0);
  }

  console.log(`FAILED: ${failures.length} unresolvable exam-pathway /lessons URL(s)\n`);
  for (const f of failures) {
    console.log(`  ${f.file}:${f.line}`);
    console.log(`    path: ${f.path}`);
    console.log(`    kind: ${f.kind}`);
    console.log("");
  }
  process.exit(1);
}

if (path.resolve(process.argv[1] ?? "") === path.resolve(__filename)) {
  main();
}
