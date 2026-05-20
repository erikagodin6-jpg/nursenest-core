/**
 * Contract: shipped Jitter / Bodymovin placeholder stays small and structurally valid.
 *
 * Run from `nursenest-core/`: `npm run test:jitter-lottie-loader-asset`
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  assertLottieLoaderJsonByteSize,
  assertLottieLoaderJsonShape,
  LOTTIE_LOADER_JSON_MAX_BYTES,
  LOTTIE_LOADER_JSON_WARN_BYTES,
} from "@/lib/animations/lottie-loader-guards";

/** Test file: `src/lib/animations/*.test.ts` → repo root is three levels up. */
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const assetPath = path.join(repoRoot, "public", "animations", "nursenest-loader-jitter.json");

test("public/animations/nursenest-loader-jitter.json exists", () => {
  assert.ok(fs.existsSync(assetPath), `missing ${assetPath}`);
});

test("nursenest-loader-jitter.json: size guard (warn >100KB, fail >200KB)", () => {
  const buf = fs.readFileSync(assetPath);
  if (buf.length > LOTTIE_LOADER_JSON_WARN_BYTES) {
    console.warn(
      `[test] nursenest-loader-jitter.json is ${buf.length} bytes (>${LOTTIE_LOADER_JSON_WARN_BYTES} warn). ` +
        `Consider optimizing the Jitter export.`,
    );
  }
  assert.ok(
    buf.length <= LOTTIE_LOADER_JSON_MAX_BYTES,
    `${assetPath}: ${buf.length} bytes exceeds hard cap ${LOTTIE_LOADER_JSON_MAX_BYTES} (200KB). Re-export a lighter Lottie.`,
  );
  assertLottieLoaderJsonByteSize(buf.length);
});

test("nursenest-loader-jitter.json: minimal Bodymovin shape", () => {
  const raw = fs.readFileSync(assetPath, "utf8");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    assert.fail(`invalid JSON: ${assetPath}: ${e}`);
  }
  assert.doesNotThrow(() => assertLottieLoaderJsonShape(parsed));
});

test("assertLottieLoaderJsonShape rejects garbage", () => {
  assert.throws(() => assertLottieLoaderJsonShape(null));
  assert.throws(() => assertLottieLoaderJsonShape({}));
  assert.throws(() => assertLottieLoaderJsonShape({ v: "5", fr: 30, op: 60, ip: 0, w: 1, h: 1, layers: [] }));
});

test("assertLottieLoaderJsonByteSize throws above max", () => {
  assert.throws(() => assertLottieLoaderJsonByteSize(LOTTIE_LOADER_JSON_MAX_BYTES + 1));
});
