import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveTierBlocksForViewer, tierBlockVisibleToViewer } from "./tier-block-content";

describe("tier-block-content", () => {
  it("unwraps all tiers when viewerTier is undefined", () => {
    const src = `A<TierBlock tier="NP">B</TierBlock>C`;
    assert.equal(resolveTierBlocksForViewer(src, undefined), "ABC");
  });

  it("PN viewer drops NP-only block", () => {
    const src = `X<TierBlock tier="PN">P</TierBlock><TierBlock tier="NP">N</TierBlock>Z`;
    assert.equal(resolveTierBlocksForViewer(src, "RPN"), "XPZ");
  });

  it("NP viewer keeps PN and NP blocks", () => {
    const src = `<TierBlock tier="PN">p</TierBlock><TierBlock tier="NP">n</TierBlock>`;
    assert.equal(resolveTierBlocksForViewer(src, "NP"), "pn");
  });

  it("strict_single RN viewer keeps only RN lane", () => {
    const src = `<TierBlock tier="PN">p</TierBlock><TierBlock tier="RN">r</TierBlock>`;
    assert.equal(resolveTierBlocksForViewer(src, "RN", "strict_single"), "r");
  });

  it("strict_single NP viewer keeps only NP lane", () => {
    const src = `<TierBlock tier="PN">p</TierBlock><TierBlock tier="NP">n</TierBlock>`;
    assert.equal(resolveTierBlocksForViewer(src, "NP", "strict_single"), "n");
  });

  it("ALL always visible to PN", () => {
    assert.equal(tierBlockVisibleToViewer("ALL", "RPN"), true);
  });
});
