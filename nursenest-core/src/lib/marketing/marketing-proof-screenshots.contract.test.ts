import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  FLAGSHIP_PROOF_SCREENSHOTS,
  HOME_FEATURE_DEEP_DIVE_PROOFS,
  marketingProofFromCoreKey,
  pathwayHubPrimaryProof,
  pathwayHubSecondaryProofs,
} from "@/lib/marketing/marketing-proof-screenshots";
import {
  GENERATED_SCREENSHOT_PATHS,
} from "@/lib/marketing/generated-screenshot-registry";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-pathways-catalog";

const publicDir = path.resolve(process.cwd(), "public");
const nextConfig = fs.readFileSync(path.join(process.cwd(), "next.config.mjs"), "utf8");

test("marketing proof screenshots resolve to existing generated WebP assets", () => {
  const paths = new Set<string>();

  for (const shot of Object.values(FLAGSHIP_PROOF_SCREENSHOTS)) {
    if (!shot) continue;
    paths.add(shot.src);
  }
  for (const shot of HOME_FEATURE_DEEP_DIVE_PROOFS) {
    paths.add(shot.src);
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

test("Next image optimizer allows local marketing proof screenshots", () => {
  assert.match(
    nextConfig,
    /pathname:\s*"\/marketing\/\*\*"/,
    "local marketing screenshots must be allowed by next.config images.localPatterns",
  );
});

test("every pathway hub proof screenshot resolves to an allowed local asset", () => {
  for (const pathway of EXAM_PATHWAYS) {
    const shots = [pathwayHubPrimaryProof(pathway), ...pathwayHubSecondaryProofs(pathway)];
    for (const shot of shots) {
      const abs = path.join(publicDir, shot.src.replace(/^\//, ""));
      assert.ok(fs.existsSync(abs), `${pathway.id} proof asset should exist: ${shot.src}`);
      assert.match(
        shot.src,
        /^\/marketing\//,
        `${pathway.id} proof asset should be under allowed /marketing/** image path`,
      );
    }
  }
});

test("core marketing proof keys resolve to single canonical theme paths", () => {
  const flashcards = marketingProofFromCoreKey("flashcards", {
    alt: "Flashcards",
    theme: "blossom",
  });
  assert.match(flashcards.src, /themes\/blossom\/flashcards\.webp$/);

  const ecgOcean = marketingProofFromCoreKey("ecg-workstation", {
    alt: "ECG",
    theme: "ocean",
  });
  assert.match(ecgOcean.src, /core\/ecg-workstation\.webp$/);

  const catMidnight = marketingProofFromCoreKey("cat-exam-session", {
    alt: "CAT",
    theme: "midnight",
  });
  assert.match(
    catMidnight.src,
    /core\/cat-exam-session\.webp$/,
    "Keys without theme captures use core/ as the sole canonical path",
  );
});
