import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { REGIONAL_MARKETING_LOCALE_PREFIX_MATCHERS } from "@/lib/marketing/regional-marketing-public-gate";

const dir = dirname(fileURLToPath(import.meta.url));

const PROXY_REGIONAL_BLOCK_COMMENT =
  "// Must match REGIONAL_MARKETING_LOCALE_PREFIX_MATCHERS in regional-marketing-public-gate.ts";

/**
 * Extract all `/:locale/...` matchers from proxy.ts in a tolerant way.
 * Avoid brittle “block slicing” that breaks on formatting changes.
 */
function extractLocaleMatchers(src: string): string[] {
  return [...src.matchAll(/"(\/:locale\/[^"]+)"/g)].map((m) => m[1]);
}

test("proxy.ts inlined regional locale-prefix matchers match canonical registry", () => {
  const proxySrc = readFileSync(join(dir, "proxy.ts"), "utf8");

  // Ensure anchor comment exists (drift protection)
  assert.ok(
    proxySrc.includes(PROXY_REGIONAL_BLOCK_COMMENT),
    "proxy.ts: missing regional matcher drift-prevention comment",
  );

  const fromProxyAll = extractLocaleMatchers(proxySrc);

  // Only keep matchers that belong to the canonical regional set
  const canonical = [...REGIONAL_MARKETING_LOCALE_PREFIX_MATCHERS];

  const fromProxyFiltered = fromProxyAll.filter((m) => canonical.includes(m));

  // Sort both to avoid order brittleness while still ensuring full parity
  const sortedProxy = [...new Set(fromProxyFiltered)].sort();
  const sortedCanonical = [...new Set(canonical)].sort();

  assert.deepEqual(
    sortedProxy,
    sortedCanonical,
    "proxy.ts regional locale-prefix matchers are out of sync with REGIONAL_MARKETING_LOCALE_PREFIX_MATCHERS",
  );
});