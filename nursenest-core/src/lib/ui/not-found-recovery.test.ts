import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildNotFoundRecoverySuggestions,
  closestPathwayInFamily,
  dedupeRecoveryLinksStable,
  mergeNotFoundRecoveryLinks,
  normalizeNotFoundPathname,
  NOT_FOUND_RECOVERY_CAP,
} from "@/lib/ui/not-found-recovery";

describe("not-found-recovery", () => {
  it("normalizeNotFoundPathname strips query/hash and collapses slashes", () => {
    assert.equal(normalizeNotFoundPathname("/a/b?x=1#h"), "/a/b");
    assert.equal(normalizeNotFoundPathname(""), "/");
  });

  it("normalizeNotFoundPathname strips leading en/fr before a known country slug", () => {
    assert.equal(normalizeNotFoundPathname("/en/us/rn/nclex-rn"), "/us/rn/nclex-rn");
    assert.equal(normalizeNotFoundPathname("/fr/canada/rpn/rex-pn"), "/canada/rpn/rex-pn");
  });

  it("does not strip a two-letter segment that is not a locale prefix", () => {
    assert.equal(normalizeNotFoundPathname("/us/rn/nclex-rn"), "/us/rn/nclex-rn");
  });

  it("suggests lesson hub when lesson slug is invalid under a resolved pathway", () => {
    const links = buildNotFoundRecoverySuggestions("/us/rn/nclex-rn/lessons/not-a-real-lesson-slug");
    const lesson = links.find((l) => l.href === "/us/rn/nclex-rn/lessons");
    assert.ok(lesson);
  });

  it("app typo suggestions stay on fixed internal routes", () => {
    const links = buildNotFoundRecoverySuggestions("/app/lesson");
    assert.ok(links.some((l) => l.href === "/app/lessons"));
  });

  it("dedupeRecoveryLinksStable removes duplicate hrefs with first winning", () => {
    const a = dedupeRecoveryLinksStable([
      { label: "A", href: "/x" },
      { label: "B", href: "/x" },
      { label: "C", href: "/y" },
    ]);
    assert.equal(a.length, 2);
    assert.equal(a[0]!.label, "A");
  });

  it("mergeNotFoundRecoveryLinks caps total and preserves smart-first ordering", () => {
    const smart = Array.from({ length: 6 }, (_, i) => ({
      label: `S${i}`,
      href: `/s${i}`,
    }));
    const base = [{ label: "Dash", href: "/app" }];
    const merged = mergeNotFoundRecoveryLinks(smart, base, NOT_FOUND_RECOVERY_CAP);
    assert.equal(merged.length, NOT_FOUND_RECOVERY_CAP);
    assert.equal(merged[0]!.href, "/s0");
  });

  it("closestPathwayInFamily only fires within Levenshtein <= 2 for same country+role", () => {
    const close = closestPathwayInFamily("us", "np", "fnp");
    assert.ok(close);
    assert.equal(close!.examCode, "fnp");
    const far = closestPathwayInFamily("us", "np", "zzzzzz");
    assert.equal(far, undefined);
  });

  it("emits only safe relative hrefs", () => {
    const links = buildNotFoundRecoverySuggestions("/us/rn/nclex-rn/lessons/bad");
    for (const l of links) {
      assert.ok(l.href.startsWith("/"));
      assert.equal(l.href.startsWith("//"), false);
    }
  });
});
