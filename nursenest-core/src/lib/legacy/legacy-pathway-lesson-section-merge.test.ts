import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mergeLegacySectionsIntoCurrent } from "@/lib/legacy/legacy-pathway-lesson-section-merge";

describe("legacy-pathway-lesson-section-merge", () => {
  it("appends missing section kinds", () => {
    const current = [
      { id: "a", kind: "introduction", heading: "Intro", body: "Enough words here to not be considered empty for other tests.".repeat(3) },
    ];
    const legacy = [
      {
        id: "x",
        kind: "clinical_pearls",
        heading: "Pearls",
        body: "Pearl one about safety.\n\nPearl two about prioritization.",
      },
    ];
    const { sections, changed, notes } = mergeLegacySectionsIntoCurrent(current, legacy);
    assert.equal(changed, true);
    assert.ok(notes.some((n) => n.startsWith("appended_section:clinical_pearls")));
    assert.equal(sections.filter((s) => String(s.kind) === "clinical_pearls").length, 1);
  });

  it("replaces only weak sections with richer legacy bodies", () => {
    const current = [{ id: "p", kind: "pathophysiology_overview", heading: "Patho", body: "short" }];
    const legacy = [
      {
        id: "L",
        kind: "pathophysiology_overview",
        heading: "Patho",
        body: "A much longer mechanistic explanation ".repeat(25).trim(),
      },
    ];
    const { sections, notes } = mergeLegacySectionsIntoCurrent(current, legacy);
    assert.ok(notes.some((n) => n.startsWith("replaced_weak_section:pathophysiology_overview")));
    const p = sections.find((s) => s.kind === "pathophysiology_overview");
    assert.ok(p && p.body.length > 80);
  });

  it("dedupes supplemental lines instead of duplicating paragraphs", () => {
    const filler = "Serum sodium trends with osmolality and volume status for acute care review. ".repeat(18);
    const body = `${filler}\n\nKnown fact about sodium imbalance.\n\nSecond unique line here.`;
    const current = [{ id: "l", kind: "labs_diagnostics", heading: "Labs", body }];
    const legacy = [{ id: "L2", kind: "labs_diagnostics", heading: "Labs", body: `${body}\n\nThird brand new line for learner.` }];
    const { sections, notes } = mergeLegacySectionsIntoCurrent(current, legacy);
    assert.ok(notes.some((n) => n.startsWith("appended_deduped_lines:labs_diagnostics")));
    const merged = sections.find((s) => s.kind === "labs_diagnostics")!.body;
    assert.match(merged, /Third brand new line/);
    assert.equal((merged.match(/Known fact about sodium imbalance/g) || []).length, 1);
  });
});
