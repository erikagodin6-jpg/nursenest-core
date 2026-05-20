import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { filterEeatEditorialRows } from "@/lib/admin/eeat-editorial-filters";
import {
  buildEeatEditorialRowFromRaw,
  coerceAuditJsonRoot,
  normalizePrioritizedQueue,
  normalizeRawPage,
  rollupByPathway,
} from "@/lib/admin/eeat-editorial-dashboard";
import { rowsToCsv } from "@/lib/admin/eeat-editorial-csv";

describe("eeat-editorial-dashboard", () => {
  it("normalizeRawPage coerces partial / malformed shapes without throwing", () => {
    const a = normalizeRawPage(null, 0);
    assert.equal(a.id, "invalid-row:0");
    assert.equal(a.contentType, "unknown");
    assert.equal(a.eeatScore, 0);

    const b = normalizeRawPage({ id: "lesson:x:y:z", eeatScore: "72", flags: ["internal_links_low"] }, 1);
    assert.equal(b.eeatScore, 72);
    assert.deepEqual(b.flags, ["internal_links_low"]);

    const c = normalizeRawPage({ id: 123 as unknown as string, eeatScore: 0.85 }, 2);
    assert.equal(c.id, "invalid-row:2");
    assert.ok(c.eeatScore >= 84 && c.eeatScore <= 86);
  });

  it("buildEeatEditorialRowFromRaw sets flags-derived fields for normalized input", () => {
    const raw = normalizeRawPage(
      {
        id: "blog:some-post",
        contentType: "blog",
        urlPattern: "/blog/x",
        eeatScore: 40,
        sectionCompleteness: 0.5,
        internalLinksCount: 1,
        wordCount: 100,
        authorPresent: false,
        lastUpdated: null,
        flags: ["author_missing", "internal_links_low"],
      },
      0,
    );
    const row = buildEeatEditorialRowFromRaw(raw);
    assert.equal(row.missingAttribution, true);
    assert.equal(row.missingInternalLinks, true);
    assert.equal(row.staleContent, false);
  });

  it("sorts rows by eeatScore ascending after build", () => {
    const r1 = buildEeatEditorialRowFromRaw(
      normalizeRawPage({ id: "seo:a", eeatScore: 90, flags: [] }, 0),
    );
    const r2 = buildEeatEditorialRowFromRaw(
      normalizeRawPage({ id: "seo:b", eeatScore: 10, flags: [] }, 1),
    );
    const sorted = [r1, r2].sort((a, b) => a.eeatScore - b.eeatScore);
    assert.deepEqual(
      sorted.map((r) => r.eeatScore),
      [10, 90],
    );
  });

  it("rollupByPathway ranks pathways by ascending average score", () => {
    const rows = [
      buildEeatEditorialRowFromRaw(normalizeRawPage({ id: "lesson:aaa:b:c", eeatScore: 80, flags: [] }, 0)),
      buildEeatEditorialRowFromRaw(normalizeRawPage({ id: "lesson:aaa:d:e", eeatScore: 60, flags: [] }, 1)),
      buildEeatEditorialRowFromRaw(normalizeRawPage({ id: "blog:x", eeatScore: 50, flags: [] }, 2)),
    ];
    const roll = rollupByPathway(rows);
    assert.equal(roll[0].pathwayKey, "blog");
    assert.equal(roll[0].averageScore, 50);
    assert.equal(roll[roll.length - 1].pathwayKey, "aaa");
    assert.equal(roll[roll.length - 1].averageScore, 70);
  });

  it("filterEeatEditorialRows: content type, pathway, score band, stale, thin, links, attribution", () => {
    const rows = [
      buildEeatEditorialRowFromRaw(
        normalizeRawPage(
          {
            id: "lesson:rn:b:c",
            contentType: "pathway_lesson",
            eeatScore: 65,
            flags: ["stale_content", "thin_programmatic"],
          },
          0,
        ),
      ),
      buildEeatEditorialRowFromRaw(
        normalizeRawPage(
          {
            id: "blog:z",
            contentType: "blog",
            eeatScore: 40,
            flags: ["author_missing"],
          },
          1,
        ),
      ),
    ];

    assert.equal(
      filterEeatEditorialRows(rows, {
        contentType: "blog",
        pathway: "all",
        scoreBand: "all",
        staleOnly: false,
        thinOnly: false,
        missingLinks: false,
        missingAttr: false,
      }).length,
      1,
    );

    assert.equal(
      filterEeatEditorialRows(rows, {
        contentType: "all",
        pathway: "rn",
        scoreBand: "all",
        staleOnly: false,
        thinOnly: false,
        missingLinks: false,
        missingAttr: false,
      }).length,
      1,
    );

    assert.equal(
      filterEeatEditorialRows(rows, {
        contentType: "all",
        pathway: "all",
        scoreBand: "below70",
        staleOnly: false,
        thinOnly: false,
        missingLinks: false,
        missingAttr: false,
      }).length,
      2,
    );

    const critical = filterEeatEditorialRows(rows, {
      contentType: "all",
      pathway: "all",
      scoreBand: "critical",
      staleOnly: false,
      thinOnly: false,
      missingLinks: false,
      missingAttr: false,
    });
    assert.ok(critical.every((r) => r.priority === "critical"));

    assert.equal(
      filterEeatEditorialRows(rows, {
        contentType: "all",
        pathway: "all",
        scoreBand: "all",
        staleOnly: true,
        thinOnly: false,
        missingLinks: false,
        missingAttr: false,
      }).length,
      1,
    );

    assert.equal(
      filterEeatEditorialRows(rows, {
        contentType: "all",
        pathway: "all",
        scoreBand: "all",
        staleOnly: false,
        thinOnly: true,
        missingLinks: false,
        missingAttr: false,
      }).length,
      1,
    );

    assert.equal(
      filterEeatEditorialRows(rows, {
        contentType: "all",
        pathway: "all",
        scoreBand: "all",
        staleOnly: false,
        thinOnly: false,
        missingLinks: true,
        missingAttr: false,
      }).length,
      0,
    );

    assert.equal(
      filterEeatEditorialRows(rows, {
        contentType: "all",
        pathway: "all",
        scoreBand: "all",
        staleOnly: false,
        thinOnly: false,
        missingLinks: false,
        missingAttr: true,
      }).length,
      1,
    );
  });

  it("coerceAuditJsonRoot wraps page-scores array root as pages", () => {
    const sink: string[] = [];
    const r = coerceAuditJsonRoot([{ id: "lesson:x:y:z" }], "eeat-page-scores.json", "pageScores", sink);
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.ok(Array.isArray(r.data.pages));
      assert.equal((r.data.pages as unknown[]).length, 1);
    }
    assert.ok(sink.some((m) => m.includes("array") && m.includes("pages")));
  });

  it("coerceAuditJsonRoot wraps completion-queue array root when entries look like queue rows", () => {
    const sink: string[] = [];
    const r = coerceAuditJsonRoot([{ id: "a", score: 1 }], "eeat-completion-queue.json", "completionQueue", sink);
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.ok(Array.isArray(r.data.prioritized));
    }
  });

  it("coerceAuditJsonRoot rejects malformed completion-queue array entries with warning", () => {
    const sink: string[] = [];
    const r = coerceAuditJsonRoot([1, 2], "eeat-completion-queue.json", "completionQueue", sink);
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.deepEqual(r.data, {});
    }
    assert.ok(sink.some((m) => m.includes("not queue-shaped")));
  });

  it("normalizePrioritizedQueue drops invalid entries and caps length", () => {
    const q = normalizePrioritizedQueue(
      [
        { id: "a", score: 1, flags: [] },
        null,
        { id: "b", score: 2, flags: ["x"] },
        ...Array.from({ length: 50 }, (_, i) => ({ id: `x${i}`, score: i, flags: [] })),
      ],
      3,
    );
    assert.equal(q.length, 3);
    assert.equal(q[0].id, "a");
  });
});

function csvDataRowCount(csv: string): number {
  const lines = csv.replace(/^\uFEFF/, "").split("\n").filter((line) => line.length > 0);
  return Math.max(0, lines.length - 1);
}

describe("eeat-editorial-csv + filter parity", () => {
  it("CSV row count matches filtered rows; escapes quotes and newlines; BOM + headers", () => {
    const rows = [
      buildEeatEditorialRowFromRaw(
        normalizeRawPage(
          {
            id: 'lesson:test:"q":x',
            contentType: "pathway_lesson",
            eeatScore: 55,
            flags: ["internal_links_low"],
            urlPattern: "/p",
          },
          0,
        ),
      ),
    ];
    const filtered = filterEeatEditorialRows(rows, {
      contentType: "all",
      pathway: "all",
      scoreBand: "all",
      staleOnly: false,
      thinOnly: false,
      missingLinks: false,
      missingAttr: false,
    });
    const csv = rowsToCsv(filtered);
    assert.ok(csv.startsWith("\uFEFF"));
    const lines = csv.replace(/^\uFEFF/, "").split("\n");
    assert.equal(lines.length - 1, filtered.length);
    assert.ok(lines[0].includes("id") && lines[0].includes("pathwayKey"));
    assert.match(csv, /""/);
  });

  it("CSV data rows match filtered count for two non-trivial filter combinations; duplicate ids export as separate rows", () => {
    const rows = [
      buildEeatEditorialRowFromRaw(
        normalizeRawPage(
          {
            id: "lesson:rn:dup:case",
            contentType: "pathway_lesson",
            eeatScore: 44,
            flags: ["stale_content"],
            urlPattern: "/lessons/a",
          },
          0,
        ),
      ),
      buildEeatEditorialRowFromRaw(
        normalizeRawPage(
          {
            id: "blog:post-one",
            contentType: "blog",
            eeatScore: 82,
            urlPattern: "/blog/post-one",
          },
          1,
        ),
      ),
      buildEeatEditorialRowFromRaw(
        normalizeRawPage(
          {
            id: "lesson:rn:dup:case",
            contentType: "pathway_lesson",
            eeatScore: 38,
            flags: ["internal_links_low"],
            urlPattern: "/lessons/b",
          },
          2,
        ),
      ),
    ];

    const f1 = filterEeatEditorialRows(rows, {
      contentType: "pathway_lesson",
      pathway: "rn",
      scoreBand: "all",
      staleOnly: false,
      thinOnly: false,
      missingLinks: false,
      missingAttr: false,
    });
    assert.equal(f1.length, 2);
    assert.equal(csvDataRowCount(rowsToCsv(f1)), f1.length);

    const f2 = filterEeatEditorialRows(rows, {
      contentType: "all",
      pathway: "all",
      scoreBand: "critical",
      staleOnly: false,
      thinOnly: false,
      missingLinks: false,
      missingAttr: false,
    });
    assert.ok(f2.length >= 1);
    assert.equal(csvDataRowCount(rowsToCsv(f2)), f2.length);

    const all = filterEeatEditorialRows(rows, {
      contentType: "all",
      pathway: "all",
      scoreBand: "all",
      staleOnly: false,
      thinOnly: false,
      missingLinks: false,
      missingAttr: false,
    });
    assert.equal(all.length, 3);
    const fullCsv = rowsToCsv(all);
    assert.equal(csvDataRowCount(fullCsv), 3);
    const occurrences = fullCsv.split("\n").filter((line) => line.includes("lesson:rn:dup:case"));
    assert.equal(occurrences.length, 2, "duplicate string ids should emit two CSV lines");
  });
});
