import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { REGIONAL_MARKETING_LOCALE_PREFIX_MATCHERS } from "@/lib/marketing/regional-marketing-public-gate";

const dir = dirname(fileURLToPath(import.meta.url));

/** Anchor comment in proxy.ts — regional locale-prefix matchers are inlined after it (Next requires a static array). */
const PROXY_REGIONAL_BLOCK_COMMENT =
  "// Must match REGIONAL_MARKETING_LOCALE_PREFIX_MATCHERS in regional-marketing-public-gate.ts";

/**
 * Parses the `/:locale/...` matcher strings in the regional block of `proxy.ts` (between the drift
 * comment and the first unprefixed `"/japan"` entry). Must stay aligned with
 * {@link REGIONAL_MARKETING_LOCALE_PREFIX_MATCHERS}.
 */
function parseInlinedRegionalLocalePrefixMatchersFromProxySource(src: string): string[] {
  const start = src.indexOf(PROXY_REGIONAL_BLOCK_COMMENT);
  assert.ok(start !== -1, "proxy.ts: missing regional matcher drift-prevention comment");

  const afterMiddleEast = '"/:locale/middle-east/:path*",';
  const mid = src.indexOf(afterMiddleEast, start);
  assert.ok(mid !== -1, "proxy.ts: missing /:locale/middle-east/:path* matcher");

  const blockEnd = src.indexOf("\n    \"/japan\",", mid + afterMiddleEast.length);
  assert.ok(blockEnd !== -1, "proxy.ts: expected unprefixed /japan matchers after regional locale-prefix block");

  const block = src.slice(start, blockEnd);
  const paths = [...block.matchAll(/"(\/:locale\/[^"]+)"/g)].map((m) => m[1]);
  assert.ok(paths.length > 0, "proxy.ts: no /:locale/... matchers found in regional block");
  return paths;
}

test("proxy.ts inlined regional locale-prefix matchers match REGIONAL_MARKETING_LOCALE_PREFIX_MATCHERS", () => {
  const proxySrc = readFileSync(join(dir, "proxy.ts"), "utf8");
  const fromProxy = parseInlinedRegionalLocalePrefixMatchersFromProxySource(proxySrc);
  const canonical = [...REGIONAL_MARKETING_LOCALE_PREFIX_MATCHERS];
  assert.deepEqual(fromProxy, canonical);
});
