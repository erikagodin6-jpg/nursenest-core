import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildEducationalFigureHtml,
  mergeAttachmentsBySlotKey,
  normalizeImagePlacementsFromPlan,
  stripBrokenOrEmptyImagesFromHtml,
} from "./blog-image-workflow";

test("stripBrokenOrEmptyImagesFromHtml removes img without https src", () => {
  const html = '<p>a</p><img src="" alt="x" /><img src="http://insecure.com/x.png" /><img src="https://cdn.example.com/a.png" alt="ok" />';
  const out = stripBrokenOrEmptyImagesFromHtml(html);
  assert.ok(out.includes("https://cdn.example.com"));
  assert.ok(!out.includes("insecure.com"));
  assert.ok(!out.includes('src=""'));
});

test("normalizeImagePlacementsFromPlan assigns default slot keys", () => {
  const norm = normalizeImagePlacementsFromPlan([
    { section: "Hero", promptIdea: "Educational diagram of vitals", altIdea: "Nurse reviewing vitals chart" },
    { section: "Body", promptIdea: "Simple infusion diagram", altIdea: "IV line schematic" },
  ]);
  assert.equal(norm[0]?.slotKey, "hero");
  assert.equal(norm[1]?.slotKey, "inline_1");
});

test("mergeAttachmentsBySlotKey dedupes by slot", () => {
  const m = mergeAttachmentsBySlotKey([
    { slotKey: "hero", url: "https://a.test/1.png", alt: "A", caption: null, sourceKind: "upload" },
    { slotKey: "hero", url: "https://a.test/2.png", alt: "B", caption: null, sourceKind: "upload" },
  ]);
  assert.equal(m.length, 1);
});

test("buildEducationalFigureHtml returns empty for bad URL", () => {
  assert.equal(buildEducationalFigureHtml("/relative.png", "x"), "");
});

test("buildEducationalFigureHtml builds figure for https", () => {
  const h = buildEducationalFigureHtml("https://cdn.example.com/x.png", "Alt text", "Cap");
  assert.ok(h.includes("https://cdn.example.com/x.png"));
  assert.ok(h.includes("Alt text"));
  assert.ok(h.includes("Cap"));
});
