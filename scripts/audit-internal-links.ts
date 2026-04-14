/**
 * Dead-link prevention: internal hrefs and navigation targets vs App Router pages + known rewrites.
 *
 * Run from nursenest-core/: `npm run audit:internal-links`
 *
 * @see docs/internal-link-audit.md
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { getAllProgrammaticSlugs } from "../src/lib/seo/programmatic-registry";
import { MARKETING_LOCALE_CODES } from "../src/lib/i18n/marketing-locale-policy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const APP_DIR = path.join(ROOT, "src", "app");

type SegToken =
  | { kind: "static"; value: string }
  | { kind: "dynamic" }
  | { kind: "catchAll" }
  | { kind: "optionalCatchAll" };

type RoutePattern = { tokens: SegToken[]; source: string };

const IGNORE_DIRS = new Set([
  "node_modules",
  ".next",
  "dist",
  ".git",
  "coverage",
  "__tests__",
  "e2e",
]);

const SCAN_EXTENSIONS = new Set([".tsx", ".ts", ".jsx", ".js", ".mjs", ".cjs"]);

/** Paths that are always treated as valid (framework, assets, monitoring). */
const GLOBAL_ALLOW_PREFIXES = [
  "/_next/",
  "/favicon.ico",
  "/api/",
  "/cdn-cgi/", // Cloudflare
] as const;

const GLOBAL_ALLOW_EXACT = new Set(["/favicon.ico", "/robots.txt", "/sitemap.xml", "/healthz", "/"]);

function parseFolderSegment(name: string): SegToken | null {
  if (name.startsWith("(") && name.endsWith(")")) return null;
  if (name === "page.tsx" || name === "layout.tsx" || name === "loading.tsx" || name === "error.tsx") return null;
  if (name === "route.ts" || name === "route.js") return null;
  if (name.startsWith("[[...") && name.endsWith("]]")) return { kind: "optionalCatchAll" };
  if (name.startsWith("[...") && name.endsWith("]")) return { kind: "catchAll" };
  if (name.startsWith("[") && name.endsWith("]")) return { kind: "dynamic" };
  return { kind: "static", value: name };
}

function pathToPattern(filePath: string, appRoot: string): RoutePattern | null {
  const rel = path.relative(appRoot, filePath);
  const dir = path.dirname(rel);
  if (dir === ".") return { tokens: [], source: filePath };
  const parts = dir.split(path.sep);
  const tokens: SegToken[] = [];
  for (const part of parts) {
    const t = parseFolderSegment(part);
    if (t) tokens.push(t);
  }
  return { tokens, source: filePath };
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

export function collectPagePatterns(): RoutePattern[] {
  const files: string[] = [];
  walkFiles(APP_DIR, files);
  const patterns: RoutePattern[] = [];
  for (const f of files) {
    if (f.endsWith(`${path.sep}page.tsx`) || f.endsWith(`${path.sep}page.jsx`)) {
      const p = pathToPattern(f, APP_DIR);
      if (p) patterns.push(p);
    }
  }
  return patterns;
}

export function collectApiPatterns(): RoutePattern[] {
  const files: string[] = [];
  walkFiles(APP_DIR, files);
  const patterns: RoutePattern[] = [];
  for (const f of files) {
    if (!f.includes(`${path.sep}api${path.sep}`)) continue;
    if (f.endsWith(`${path.sep}route.ts`) || f.endsWith(`${path.sep}route.js`)) {
      const p = pathToPattern(f, APP_DIR);
      if (p) patterns.push(p);
    }
  }
  return patterns;
}

function matchPattern(tokens: SegToken[], parts: string[], ti: number, pi: number): boolean {
  if (ti === tokens.length && pi === parts.length) return true;
  if (ti >= tokens.length || pi > parts.length) {
    if (ti === tokens.length && pi === parts.length) return true;
    return false;
  }
  const tok = tokens[ti]!;
  if (tok.kind === "static") {
    if (parts[pi] !== tok.value) return false;
    return matchPattern(tokens, parts, ti + 1, pi + 1);
  }
  if (tok.kind === "dynamic") {
    if (pi >= parts.length) return false;
    return matchPattern(tokens, parts, ti + 1, pi + 1);
  }
  if (tok.kind === "catchAll") {
    if (pi >= parts.length) return false;
    return matchPattern(tokens, parts, ti + 1, parts.length);
  }
  if (tok.kind === "optionalCatchAll") {
    return matchPattern(tokens, parts, ti + 1, parts.length);
  }
  return false;
}

function matchesAnyPattern(patterns: RoutePattern[], pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean);
  return patterns.some((p) => matchPattern(p.tokens, parts, 0, 0));
}

const PROGRAMMATIC_SLUGS = new Set(getAllProgrammaticSlugs());

/** Second segment allowed under /{locale}/ for non-programmatic marketing routes (static pages). */
const LOCALE_STATIC_SECONDS = new Set([
  "refund-policy",
  "contact",
  "disclaimer",
  "privacy",
  "acceptable-use",
  "faq",
  "terms",
  "for-institutions",
  "reset-password",
  "forgot-password",
  "signup",
  "login",
  "pricing",
  "tools",
]);

function isMarketingLocale(seg: string): boolean {
  return MARKETING_LOCALE_CODES.includes(seg as (typeof MARKETING_LOCALE_CODES)[number]);
}

/**
 * /{locale} only (non-default locale home).
 * /{locale}/{x} where x is static page or programmatic slug.
 * /{locale}/tools/{anything}
 */
function matchesLocaleAwareMarketing(parts: string[]): boolean {
  if (parts.length < 1) return false;
  const loc = parts[0]!;
  if (!isMarketingLocale(loc)) return false;
  if (parts.length === 1) return true;
  const second = parts[1]!;
  if (parts.length === 2) {
    if (LOCALE_STATIC_SECONDS.has(second)) return true;
    if (PROGRAMMATIC_SLUGS.has(second)) return true;
    return false;
  }
  if (parts.length === 3 && second === "tools") return true;
  return false;
}

function isAllowedGlobal(pathname: string): boolean {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (GLOBAL_ALLOW_EXACT.has(p)) return true;
  for (const pre of GLOBAL_ALLOW_PREFIXES) {
    if (p.startsWith(pre)) return true;
  }
  return false;
}

export function isValidInternalPath(pathname: string, pagePatterns: RoutePattern[], apiPatterns: RoutePattern[]): boolean {
  const raw = pathname.split("?")[0] ?? pathname;
  const p = raw.split("#")[0] ?? raw;
  const pathOnly = p.startsWith("/") ? p : `/${p}`;
  if (isAllowedGlobal(pathOnly)) return true;

  const parts = pathOnly.split("/").filter(Boolean);

  // Programmatic SEO: rewrite /{slug} -> /seo/{slug}
  if (parts.length === 1 && PROGRAMMATIC_SLUGS.has(parts[0]!)) return true;

  /**
   * If the first segment is a BCP marketing locale code, the path must satisfy locale-specific rules.
   * Do not fall through to generic [locale]/[slug] patterns (they would accept arbitrary garbage).
   */
  if (parts.length >= 1 && isMarketingLocale(parts[0]!)) {
    return matchesLocaleAwareMarketing(parts);
  }

  if (parts[0] === "api") {
    return matchesAnyPattern(apiPatterns, pathOnly);
  }

  return matchesAnyPattern(pagePatterns, pathOnly);
}

export type ExtractedRef = { file: string; line: number; raw: string; kind: string };

function stripQueryHash(href: string): string {
  let s = href.split("#")[0] ?? href;
  s = s.split("?")[0] ?? s;
  return s;
}

/** Extract static path literals from common navigation patterns. */
export function extractInternalRefsFromSource(source: string, filePath: string): ExtractedRef[] {
  const refs: ExtractedRef[] = [];
  const lines = source.split(/\r?\n/);

  const push = (lineNum: number, raw: string, kind: string) => {
    const t = raw.trim();
    if (!t || t === "/") return;
    if (t.startsWith("//")) return;
    if (/^https?:\/\//i.test(t)) return;
    if (t.startsWith("mailto:") || t.startsWith("tel:")) return;
    if (t.startsWith("javascript:")) return;
    if (t === "#" || t.startsWith("#")) return;
    if (t.includes("${") || t.includes("}}")) return;
    if (t.startsWith("data:")) return;
    refs.push({ file: filePath, line: lineNum, raw: t, kind });
  };

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;

    const hrefQuoted = /\bhref\s*=\s*["']([^"']+)["']/g;
    let m: RegExpExecArray | null;
    while ((m = hrefQuoted.exec(line)) !== null) push(lineNum, stripQueryHash(m[1]!), "href");

    const hrefTpl = /\bhref\s*=\s*\{\s*["']([^"']+)["']\s*\}/g;
    while ((m = hrefTpl.exec(line)) !== null) push(lineNum, stripQueryHash(m[1]!), "href");

    /** href={`/prefix/${slug}`} — validate static prefix */
    const hrefBacktickPrefix = /\bhref\s*=\s*\{\s*`(\/[^{`]*?)\$\{/g;
    while ((m = hrefBacktickPrefix.exec(line)) !== null) {
      const pref = stripQueryHash(m[1]!.replace(/\/+$/, "") || "/");
      if (pref && pref !== "/") push(lineNum, pref.startsWith("/") ? pref : `/${pref}`, "href-template");
    }

    /** href={`/path`} without interpolation */
    const hrefBacktickFull = /\bhref\s*=\s*\{\s*`(\/[^`${]+)`\s*\}/g;
    while ((m = hrefBacktickFull.exec(line)) !== null) push(lineNum, stripQueryHash(m[1]!), "href");

    const routerStr = /\brouter\.(push|replace|prefetch)\(\s*["']([^"']+)["']/g;
    while ((m = routerStr.exec(line)) !== null) push(lineNum, stripQueryHash(m[2]!), "router");

    const routerBacktick = /\brouter\.(push|replace|prefetch)\(\s*`(\/[^`${]*)`/g;
    while ((m = routerBacktick.exec(line)) !== null) push(lineNum, stripQueryHash(m[2]!), "router");

    const redirectDest = /\bdestination:\s*["']([^"']+)["']/g;
    while ((m = redirectDest.exec(line)) !== null) push(lineNum, stripQueryHash(m[1]!), "destination");

    const callbackUrl = /callbackUrl=([^&\s"']+)/g;
    while ((m = callbackUrl.exec(line)) !== null) {
      let v = m[1]!;
      try {
        v = decodeURIComponent(v);
      } catch {
        /* ignore */
      }
      if (v.startsWith("/")) push(lineNum, stripQueryHash(v), "callbackUrl");
    }
  });

  return refs;
}

function shouldScanFile(filePath: string): boolean {
  const ext = path.extname(filePath);
  if (!SCAN_EXTENSIONS.has(ext)) return false;
  if (filePath.includes(`${path.sep}node_modules${path.sep}`)) return false;
  if (filePath.includes(".next")) return false;
  const base = path.basename(filePath);
  if (base.endsWith(".test.ts") || base.endsWith(".test.tsx") || base.endsWith(".spec.ts")) return false;
  if (base === "audit-internal-links.test.ts") return false;
  return true;
}

function collectSourceFiles(dir: string, out: string[]): void {
  const raw: string[] = [];
  walkFiles(dir, raw);
  for (const f of raw) {
    if (shouldScanFile(f)) out.push(f);
  }
}

export type RouteValidator = {
  isValidPath: (pathname: string) => boolean;
};

export function createRouteValidator(): RouteValidator {
  const pagePatterns = collectPagePatterns();
  const apiPatterns = collectApiPatterns();
  return {
    isValidPath: (pathname: string) => isValidInternalPath(pathname, pagePatterns, apiPatterns),
  };
}

export type AuditFailure = { ref: ExtractedRef; suggestion: string | null };

export function runLinkAudit(): {
  ok: boolean;
  failures: AuditFailure[];
  filesScanned: number;
  pagePatternCount: number;
  apiPatternCount: number;
} {
  const pagePatterns = collectPagePatterns();
  const apiPatterns = collectApiPatterns();
  const candidates = buildSuggestionCandidates(pagePatterns);

  const scanRoots = [path.join(ROOT, "src"), path.join(ROOT, "scripts")];
  const allFiles: string[] = [];
  for (const r of scanRoots) {
    if (!fs.existsSync(r)) continue;
    collectSourceFiles(r, allFiles);
  }

  const nextCfg = path.join(ROOT, "next.config.ts");
  if (fs.existsSync(nextCfg) && shouldScanFile(nextCfg)) allFiles.push(nextCfg);

  const failures: AuditFailure[] = [];

  for (const file of allFiles) {
    let content: string;
    try {
      content = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const refs = extractInternalRefsFromSource(content, path.relative(ROOT, file));
    for (const ref of refs) {
      const target = ref.raw;
      if (!target.startsWith("/")) continue;
      if (!isValidInternalPath(target, pagePatterns, apiPatterns)) {
        failures.push({ ref, suggestion: suggestPath(target, candidates) });
      }
    }
  }

  return {
    ok: failures.length === 0,
    failures,
    filesScanned: allFiles.length,
    pagePatternCount: pagePatterns.length,
    apiPatternCount: apiPatterns.length,
  };
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i]![0] = i;
  for (let j = 0; j <= n; j++) dp[0]![j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const c = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i]![j] = Math.min(dp[i - 1]![j]! + 1, dp[i]![j - 1]! + 1, dp[i - 1]![j - 1]! + c);
    }
  }
  return dp[m]![n]!;
}

function buildSuggestionCandidates(pagePatterns: RoutePattern[]): string[] {
  const cands = new Set<string>(["/", "/pricing", "/faq", "/lessons", "/login", "/signup", "/blog", "/question-bank"]);
  for (const slug of PROGRAMMATIC_SLUGS) cands.add(`/${slug}`);
  for (const p of pagePatterns) {
    if (p.tokens.every((t) => t.kind === "static")) {
      cands.add("/" + p.tokens.map((t) => (t as { kind: "static"; value: string }).value).join("/"));
    }
  }
  return [...cands];
}

function suggestPath(bad: string, candidates: string[]): string | null {
  let best: string | null = null;
  let bestScore = Infinity;
  const norm = bad.startsWith("/") ? bad : `/${bad}`;
  for (const c of candidates) {
    const d = levenshtein(norm, c);
    if (d < bestScore && d <= Math.max(3, Math.floor(norm.length / 4) + 2)) {
      bestScore = d;
      best = c;
    }
  }
  return best;
}

function main(): void {
  const { ok, failures, filesScanned, pagePatternCount, apiPatternCount } = runLinkAudit();

  console.log("Internal link audit (nursenest-core)\n");
  console.log(`Pages discovered: ${pagePatternCount} | API route groups: ${apiPatternCount}`);
  console.log(`Programmatic slugs: ${PROGRAMMATIC_SLUGS.size}`);
  console.log(`Files scanned: ${filesScanned}\n`);

  if (ok) {
    console.log("OK: no invalid internal paths found.\n");
    process.exit(0);
  }

  console.log(`FAILED: ${failures.length} invalid internal path(s)\n`);
  for (const { ref, suggestion } of failures) {
    console.log(`  ${ref.file}:${ref.line}`);
    console.log(`    path: ${ref.raw}`);
    console.log(`    kind: ${ref.kind}`);
    if (suggestion) console.log(`    suggest: ${suggestion}`);
    console.log("");
  }
  process.exit(1);
}

/** Only run CLI when executed directly (not when imported by tests). */
if (path.resolve(process.argv[1] ?? "") === path.resolve(__filename)) {
  main();
}
