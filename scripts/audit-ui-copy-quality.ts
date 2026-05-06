/**
 * UI copy quality audit — scans Next app sources for likely user-visible issues:
 * - dotted i18n-style keys in JSX text
 * - SCREAMING_SNAKE internal tokens as bare JSX text
 * - title="..." / label="..." values that look like raw i18n keys
 * - awkward internal phrases in admin surfaces
 *
 * Run from repo root:
 *   npx tsx scripts/audit-ui-copy-quality.ts
 *   npx tsx scripts/audit-ui-copy-quality.ts --ci
 *
 * Exit 1 when `--ci` and findings exceed threshold.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { looksLikeRawI18nKey } from "../nursenest-core/src/lib/ui/format-display-label.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const ROOT = fs.existsSync(path.join(REPO_ROOT, "nursenest-core", "src", "app"))
  ? path.join(REPO_ROOT, "nursenest-core")
  : REPO_ROOT;
const SCAN_ROOT = path.join(ROOT, "src");

const IGNORE_DIRS = new Set(["node_modules", ".next", "dist", ".git", "coverage", "__tests__", "legacy"]);

type Hit = { file: string; line: number; text: string; rule: string };

/** Strip `<code>...</code>` so intentional env / token names in monospace do not trip heuristics. */
function lineForHeuristicScan(line: string): string {
  return line.replace(/<code[^>]*>[\s\S]*?<\/code>/gi, " ");
}

const JSX_TEXT_DOTTED_KEY =
  />\s*((?:pages|footer|blog|admin|content|learner|app|nav|components|marketing|errors|forms)(?:\.[a-z0-9_-]+){2,})\s*</gi;

const JSX_TEXT_SCREAMING_SNAKE = />\s*([A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+)\s*</g;

const JSX_ALL_CAPS_TOKEN = />\s*([A-Z]{5,})\s*</g;
const ALLOWED_ALL_CAPS = new Set(["HTTPS", "HTTP", "HTML", "JSON", "NCLEX", "EMAIL", "SLACK", "NURSE", "ADMIN"]);

const AWKWARD_PHRASE = /\b(not configured|database_url not configured|safe mode:\s*off|topic_intent_rejected)\b/gi;

function isAdminPath(rel: string): boolean {
  return rel.includes(`${path.sep}(admin)${path.sep}`) || rel.includes("/(admin)/");
}

function walkFiles(dir: string, out: string[]): void {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (IGNORE_DIRS.has(e.name)) continue;
      walkFiles(p, out);
    } else if (e.isFile() && (e.name.endsWith(".tsx") || e.name.endsWith(".ts"))) {
      out.push(p);
    }
  }
}

function scanFile(file: string): Hit[] {
  const hits: Hit[] = [];
  const rel = path.relative(REPO_ROOT, file);
  const admin = isAdminPath(rel);
  let content: string;
  try {
    content = fs.readFileSync(file, "utf8");
  } catch {
    return hits;
  }
  const lines = content.split(/\r?\n/);

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) return;

    const scanLine = lineForHeuristicScan(line);
    let m: RegExpExecArray | null;

    JSX_TEXT_DOTTED_KEY.lastIndex = 0;
    while ((m = JSX_TEXT_DOTTED_KEY.exec(scanLine)) !== null) {
      hits.push({ file: rel, line: idx + 1, text: m[1] ?? "", rule: "jsx_text_dotted_key" });
    }

    JSX_TEXT_SCREAMING_SNAKE.lastIndex = 0;
    while ((m = JSX_TEXT_SCREAMING_SNAKE.exec(scanLine)) !== null) {
      hits.push({ file: rel, line: idx + 1, text: m[1] ?? "", rule: "jsx_text_screaming_snake" });
    }

    if (admin) {
      JSX_ALL_CAPS_TOKEN.lastIndex = 0;
      while ((m = JSX_ALL_CAPS_TOKEN.exec(scanLine)) !== null) {
        const tok = m[1] ?? "";
        if (ALLOWED_ALL_CAPS.has(tok)) continue;
        hits.push({ file: rel, line: idx + 1, text: tok, rule: "jsx_all_caps_admin" });
      }
    }

    if (admin) {
      let ap: RegExpExecArray | null;
      const apRe = new RegExp(AWKWARD_PHRASE.source, AWKWARD_PHRASE.flags);
      while ((ap = apRe.exec(scanLine)) !== null) {
        hits.push({ file: rel, line: idx + 1, text: ap[0] ?? "", rule: "awkward_phrase_admin" });
      }
    }

    const strLit =
      /(?:\btitle=|\blabel=|\bplaceholder=|\baria-label=)\{?\s*["']([^"'\\]{2,200})["']\s*\}?/gi;
    while ((m = strLit.exec(scanLine)) !== null) {
      const v = m[1]?.trim() ?? "";
      if (looksLikeRawI18nKey(v)) {
        hits.push({ file: rel, line: idx + 1, text: v, rule: "prop_string_looks_like_i18n_key" });
      }
    }

    /** Admin/marketing: headings whose visible text starts lowercase (title case heuristic). */
    if (admin || rel.includes(`${path.sep}marketing${path.sep}`) || rel.includes("/(marketing)/")) {
      const lowerHeading = /<h[1-3][^>]*>\s*([a-z][a-z\s&'/,.:0-9()-]{4,100})\s*<\/h[1-3]>/i;
      const lh = lowerHeading.exec(scanLine);
      if (lh) {
        const inner = lh[1]?.trim() ?? "";
        if (inner && !inner.includes("{") && /^[a-z]/.test(inner) && /\s/.test(inner)) {
          hits.push({ file: rel, line: idx + 1, text: inner.slice(0, 100), rule: "possible_sentence_case_heading" });
        }
      }
    }
  });

  return hits;
}

function main() {
  const args = new Set(process.argv.slice(2));
  const ci = args.has("--ci");
  const max = ci ? 0 : 400;

  const files: string[] = [];
  walkFiles(SCAN_ROOT, files);

  const all: Hit[] = [];
  for (const f of files) {
    all.push(...scanFile(f));
  }

  const dedup = new Map<string, Hit>();
  for (const h of all) {
    dedup.set(`${h.file}:${h.line}:${h.rule}:${h.text}`, h);
  }
  const hits = [...dedup.values()].sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);

  console.log(`[audit-ui-copy-quality] scanned ${files.length} files under ${path.relative(REPO_ROOT, SCAN_ROOT)}`);
  console.log(`[audit-ui-copy-quality] findings: ${hits.length}${ci ? " (ci mode: max 0)" : ` (showing up to ${max})`}`);

  for (const h of hits.slice(0, max)) {
    console.log(`${h.file}:${h.line}\t${h.rule}\t${h.text}`);
  }

  if (ci && hits.length > 0) {
    console.error("[audit-ui-copy-quality] CI failed: fix copy issues or adjust heuristics with documented exceptions.");
    process.exit(1);
  }
}

main();
