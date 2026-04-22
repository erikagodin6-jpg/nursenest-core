import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { publicCopyForReadinessConfig, readinessConfigForPathway } from "@/lib/exam-pathways/pathway-readiness-config";
import {
  pathwayCatLandingTitle,
  pathwayCatLandingSubtitle,
  pathwayCatMetadataDescription,
} from "@/lib/exam-pathways/pathway-cat-marketing-copy";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("pathway CAT marketing copy", () => {
  it("uses CAT in the hero title, not Readiness Exam", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const t = pathwayCatLandingTitle(pathway);
    assert.match(t, /CAT/i);
    assert.doesNotMatch(t, /Readiness Exam/i);
  });

  it("subtitle mentions CAT and regional exam line", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const rc = readinessConfigForPathway(pathway);
    const pc = publicCopyForReadinessConfig(rc);
    const s = pathwayCatLandingSubtitle(pathway, pc);
    assert.match(s, /Computerized adaptive testing/i);
    assert.match(s, /NCLEX-RN/i);
  });

  it("metadata description stays CAT-forward", () => {
    const pathway = getExamPathwayById("ca-rn-nclex-rn");
    assert.ok(pathway);
    const rc = readinessConfigForPathway(pathway);
    const pc = publicCopyForReadinessConfig(rc);
    const d = pathwayCatMetadataDescription(pathway, pc);
    assert.match(d, /CAT/i);
  });
});

describe("marketing CAT route source (static string regression)", () => {
  it("does not use the old readiness upsell lock headline", () => {
    const src = readFileSync(
      join(__dirname, "../../app/(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx"),
      "utf8",
    );
    assert.ok(!src.includes("Unlock Readiness Exam"), "removed misleading readiness upsell CTA");
    assert.ok(!src.includes("Readiness exam locked"), "removed readiness lock headline");
  });
});
