/**
 * CLI argument parsing for {@link scripts/blog-ai-generate.ts} (testable, no side effects).
 */

import type { BlogCliTopicTier } from "@/lib/blog/blog-cli-pathophysiology-topic-corpus";

export type ParsedBlogCliArgs = {
  dryRun: boolean;
  limit: number;
  topics: string[];
  pathophysiologyOnly: boolean;
  tier: BlogCliTopicTier | null;
  publish: boolean;
  minWords: number;
};

const TIERS = new Set<BlogCliTopicTier>(["rn", "rpn", "pn", "np", "new-grad", "allied"]);

function parseBoolFlag(value: string | undefined, defaultTrue: boolean): boolean {
  if (value == null || value === "") return defaultTrue;
  const v = value.trim().toLowerCase();
  if (v === "true" || v === "1" || v === "yes") return true;
  if (v === "false" || v === "0" || v === "no") return false;
  return defaultTrue;
}

/** Parse argv (typically `process.argv`). */
export function parseBlogCliArgs(argv: string[]): ParsedBlogCliArgs {
  let dryRun = false;
  let limit = 5;
  const topics: string[] = [];
  let pathophysiologyOnly = false;
  let tier: BlogCliTopicTier | null = null;
  let publish = true;
  let minWords = 1200;

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]!;
    if (a === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (a === "--pathophysiology-only") {
      pathophysiologyOnly = true;
      continue;
    }
    if (a === "--limit") {
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        i += 1;
        limit = Math.max(1, parseInt(next, 10) || 5);
      }
      continue;
    }
    if (a.startsWith("--limit=")) {
      limit = Math.max(1, parseInt(a.slice("--limit=".length), 10) || 5);
      continue;
    }
    if (a === "--topic") {
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        i += 1;
        const t = next.trim();
        if (t.length >= 3) topics.push(t);
      }
      continue;
    }
    if (a.startsWith("--topic=")) {
      const t = a.slice("--topic=".length).trim();
      if (t.length >= 3) topics.push(t);
      continue;
    }
    if (a === "--tier") {
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        i += 1;
        const raw = next.trim().toLowerCase().replace(/_/g, "-");
        if (TIERS.has(raw as BlogCliTopicTier)) tier = raw as BlogCliTopicTier;
      }
      continue;
    }
    if (a.startsWith("--tier=")) {
      const raw = a.slice("--tier=".length).trim().toLowerCase().replace(/_/g, "-");
      if (TIERS.has(raw as BlogCliTopicTier)) tier = raw as BlogCliTopicTier;
      continue;
    }
    if (a === "--publish") {
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        i += 1;
        publish = parseBoolFlag(next, true);
      } else {
        publish = true;
      }
      continue;
    }
    if (a.startsWith("--publish=")) {
      publish = parseBoolFlag(a.slice("--publish=".length), true);
      continue;
    }
    if (a === "--min-words") {
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        i += 1;
        minWords = Math.max(1200, Math.min(8000, parseInt(next, 10) || 1200));
      }
      continue;
    }
    if (a.startsWith("--min-words=")) {
      minWords = Math.max(1200, Math.min(8000, parseInt(a.slice("--min-words=".length), 10) || 1200));
      continue;
    }
  }

  if (dryRun) {
    publish = false;
  }

  return { dryRun, limit, topics, pathophysiologyOnly, tier, publish, minWords };
}
