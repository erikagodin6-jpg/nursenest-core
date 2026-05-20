import assert from "node:assert/strict";
import test from "node:test";
import {
  MARKER_CLUSTER,
  MARKER_LEAD,
  applyBodyFragmentsIdempotent,
  buildUpdatePreview,
  mergePathsDedupe,
  mergeTagsDedupe,
  normalizeManifestSlug,
  validateEnabledManifestRow,
} from "@/lib/blog/gsc-opportunity-upgrades-apply";

test("normalizeManifestSlug rejects empty and trims slashes", () => {
  assert.equal(normalizeManifestSlug("").ok, false);
  assert.equal(normalizeManifestSlug("  ").ok, false);
  assert.equal(normalizeManifestSlug(undefined).ok, false);
  assert.deepEqual(normalizeManifestSlug("/my-slug/"), { ok: true, slug: "my-slug" });
  assert.deepEqual(normalizeManifestSlug("  hyperkalemia-effects  "), { ok: true, slug: "hyperkalemia-effects" });
  assert.equal(normalizeManifestSlug("a/b").ok, false);
});

test("applyBodyFragmentsIdempotent does not duplicate lead or cluster markers", () => {
  const lead = `${MARKER_LEAD}\n<p>Once</p>`;
  const cluster = `${MARKER_CLUSTER}\n<section>Cluster</section>`;
  const body = "<p>Original</p>";
  const once = applyBodyFragmentsIdempotent(body, lead, cluster);
  assert.match(once.next, new RegExp(MARKER_LEAD.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(once.next, new RegExp(MARKER_CLUSTER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal(once.insertedLead, true);
  assert.equal(once.insertedCluster, true);
  const twice = applyBodyFragmentsIdempotent(once.next, lead, cluster);
  assert.equal(twice.next, once.next);
  assert.equal(twice.insertedLead, false);
  assert.equal(twice.insertedCluster, false);
});

test("mergeTagsDedupe dedupes case-sensitively and preserves first-seen order", () => {
  assert.deepEqual(mergeTagsDedupe(["A", "B"], ["B", "C"]), ["A", "B", "C"]);
  assert.deepEqual(mergeTagsDedupe(["A"], undefined), ["A"]);
});

test("mergePathsDedupe dedupes trimmed paths", () => {
  assert.deepEqual(mergePathsDedupe(["/a"], ["/a", " /b "]), ["/a", "/b"]);
});

test("validateEnabledManifestRow rejects empty slug after trim", () => {
  const r = validateEnabledManifestRow(
    { enabled: true, slug: "   ", mergeRelatedLessonPaths: [], appendTags: [] },
    0,
  );
  assert.equal(r.ok, false);
});

test("validateEnabledManifestRow rejects unsafe internal path in mergeRelatedLessonPaths", () => {
  const r = validateEnabledManifestRow(
    {
      enabled: true,
      slug: "x",
      bodyLeadHtml: `${MARKER_LEAD}\n<p><a href=\"/ok\">x</a></p>`,
      bodyClusterHtml: `${MARKER_CLUSTER}\n<p>y</p>`,
      mergeRelatedLessonPaths: ["https://evil.example/phish"],
      appendTags: [],
    },
    0,
  );
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.reasons.join(" "), /unsafe_or_malformed_internal_path/);
});

test("validateEnabledManifestRow rejects row without marker in lead fragment", () => {
  const r = validateEnabledManifestRow(
    {
      enabled: true,
      slug: "x",
      bodyLeadHtml: "<p>no marker</p>",
      bodyClusterHtml: `${MARKER_CLUSTER}\n<p>ok</p>`,
      mergeRelatedLessonPaths: [],
      appendTags: [],
    },
    0,
  );
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.reasons.join(" "), /bodyLeadHtml must contain/);
});

test("nonexistent slug is handled at orchestration layer (preview skip)", () => {
  const manifest = validateEnabledManifestRow(
    {
      enabled: true,
      slug: "definitely-missing-slug-xyz",
      title: "T",
      bodyLeadHtml: `${MARKER_LEAD}\n<p>x</p>`,
      bodyClusterHtml: `${MARKER_CLUSTER}\n<p>y</p>`,
      mergeRelatedLessonPaths: ["/question-bank"],
      appendTags: ["t"],
    },
    0,
  );
  assert(manifest.ok);
  if (!manifest.ok) return;
  const p = buildUpdatePreview("definitely-missing-slug-xyz", null, manifest.row, "not_found");
  assert.equal(p.decision, "skip");
  assert.equal(p.skipReason, "slug_not_found");
});
