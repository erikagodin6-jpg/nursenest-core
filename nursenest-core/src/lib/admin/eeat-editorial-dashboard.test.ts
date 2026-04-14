import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { filterEeatEditorialRows } from "@/lib/admin/eeat-editorial-filters";
import {
  buildEeatEditorialRowFromRaw,
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
});
