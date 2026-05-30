import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  FLAGSHIP_PROOF_SCREENSHOTS,
  HOME_FEATURE_DEEP_DIVE_PROOFS,
  marketingProofFromCoreKey,
} from "@/lib/marketing/marketing-proof-screenshots";
import {
  GENERATED_SCREENSHOT_PATHS,
} from "@/lib/marketing/generated-screenshot-registry";

const publicDir = path.resolve(process.cwd(), "public");

test("marketing proof screenshots resolve to existing generated WebP assets", () => {
  const paths = new Set<string>();

  for (const shot of Object.values(FLAGSHIP_PROOF_SCREENSHOTS)) {
    if (!shot) continue;
    paths.add(shot.fallbackSrc);
  }
  for (const shot of HOME_FEATURE_DEEP_DIVE_PROOFS) {
    paths.add(shot.fallbackSrc);
  }
  paths.add(GENERATED_SCREENSHOT_PATHS.rnMarketingHub);
  paths.add(GENERATED_SCREENSHOT_PATHS.pnMarketingHub);
  paths.add(GENERATED_SCREENSHOT_PATHS.npMarketingHub);
  paths.add(GENERATED_SCREENSHOT_PATHS.alliedMarketingHub);
  paths.add(GENERATED_SCREENSHOT_PATHS.newGradMarketingHub);

  for (const rel of paths) {
    const abs = path.join(publicDir, rel.replace(/^\//, ""));
    assert.ok(fs.existsSync(abs), `Missing marketing proof asset: ${rel}`);
  }
});

test("core marketing proof keys use theme-aware fallbacks", () => {
  const flashcards = marketingProofFromCoreKey("flashcards", {
    alt: "Flashcards",
    theme: "blossom",
  });
  assert.match(flashcards.src, /themes\/blossom\/flashcards\.webp$/);
  assert.match(flashcards.fallbackSrc, /core\/flashcards\.webp$/);
});
