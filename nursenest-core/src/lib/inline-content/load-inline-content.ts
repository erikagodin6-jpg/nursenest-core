import "server-only";

import { cache } from "react";
import type { InlineContentKind } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { sanitizeInlineRichHtml } from "@/lib/inline-content/sanitize-inline-html";

export type InlineContentResolved = {
  text: string;
  kind: InlineContentKind;
};

const SEP = "\x1e";

async function loadInlineContentMapImpl(keysJoined: string): Promise<Map<string, InlineContentResolved>> {
  const keys = keysJoined.split(SEP).filter(Boolean);
  const out = new Map<string, InlineContentResolved>();
  if (keys.length === 0) return out;
  if (!isDatabaseUrlConfigured()) return out;

  try {
    const rows = await prisma.inlineContentEntry.findMany({
      where: { key: { in: keys } },
      select: { key: true, body: true, kind: true },
    });
    for (const r of rows) {
      const text = r.kind === "RICH_HTML" ? sanitizeInlineRichHtml(r.body) : r.body;
      out.set(r.key, { text, kind: r.kind });
    }
  } catch {
    /* ignore — fall back to defaults */
  }
  return out;
}

/** Request-cached batch load; pass sorted unique keys joined with the same separator internally. */
export const loadInlineContentMap = cache(async (keysJoined: string) => loadInlineContentMapImpl(keysJoined));

/**
 * Batch-load inline overrides for a set of keys (one DB round-trip per unique key-set per request).
 */
export async function preloadInlineContentMap(keys: readonly string[]): Promise<Record<string, InlineContentResolved>> {
  const uniq = [...new Set(keys)].filter(Boolean).sort();
  if (uniq.length === 0) return {};
  const joined = uniq.join(SEP);
  const map = await loadInlineContentMap(joined);
  return Object.fromEntries([...map.entries()]);
}

export function resolveInlineText(
  contentKey: string,
  defaultText: string,
  preloaded: Record<string, InlineContentResolved> | undefined,
): InlineContentResolved {
  const row = preloaded?.[contentKey];
  if (row) return row;
  return { text: defaultText, kind: "PLAIN" };
}

/** Use optional parent batch map; otherwise loads this key from the DB (cached per request). */
export async function getInlineContentResolved(
  contentKey: string,
  defaultText: string,
  kindDefault: InlineContentKind,
  preloaded?: Record<string, InlineContentResolved>,
): Promise<InlineContentResolved> {
  const hit = preloaded?.[contentKey];
  if (hit) return hit;
  const map = await preloadInlineContentMap([contentKey]);
  return map[contentKey] ?? { text: defaultText, kind: kindDefault };
}
