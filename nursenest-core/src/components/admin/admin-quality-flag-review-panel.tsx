"use client";

import { useMemo, useState } from "react";

type QualityRow = {
  id: string;
  tier: string;
  topic: string;
  qualityFlags: string[];
  stemPreview: string;
};

type FilterId = "all" | "short-stem" | "duplicate-options" | "synthetic-rationale";

const FILTER_TO_TAG: Record<Exclude<FilterId, "all">, string> = {
  "short-stem": "quality:short-stem",
  "duplicate-options": "quality:duplicate-options",
  "synthetic-rationale": "quality:synthetic-rationale",
};

export function AdminQualityFlagReviewPanel({ rows }: { rows: QualityRow[] }) {
  const [filter, setFilter] = useState<FilterId>("all");

  const filteredRows = useMemo(() => {
    if (filter === "all") return rows;
    const tag = FILTER_TO_TAG[filter];
    return rows.filter((r) => r.qualityFlags.includes(tag));
  }, [rows, filter]);

  const counts = useMemo(
    () => ({
      all: rows.length,
      shortStem: rows.filter((r) => r.qualityFlags.includes("quality:short-stem")).length,
      duplicateOptions: rows.filter((r) => r.qualityFlags.includes("quality:duplicate-options")).length,
      syntheticRationale: rows.filter((r) => r.qualityFlags.includes("quality:synthetic-rationale")).length,
    }),
    [rows],
  );

  return (
    <section className="nn-card p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Quality-flag review</h2>
          <p className="mt-1 text-sm text-muted-foreground">Review flagged RN/PN questions by short stem, duplicate options, and synthetic rationale.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button className={`rounded-md px-2 py-1 ${filter === "all" ? "bg-primary text-primary-foreground" : "bg-muted"}`} onClick={() => setFilter("all")}>
            All ({counts.all})
          </button>
          <button
            className={`rounded-md px-2 py-1 ${filter === "short-stem" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            onClick={() => setFilter("short-stem")}
          >
            Short stem ({counts.shortStem})
          </button>
          <button
            className={`rounded-md px-2 py-1 ${filter === "duplicate-options" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            onClick={() => setFilter("duplicate-options")}
          >
            Duplicate options ({counts.duplicateOptions})
          </button>
          <button
            className={`rounded-md px-2 py-1 ${filter === "synthetic-rationale" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            onClick={() => setFilter("synthetic-rationale")}
          >
            Synthetic rationale ({counts.syntheticRationale})
          </button>
        </div>
      </div>

      <div className="mt-4 max-h-96 overflow-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="py-2">Question ID</th>
              <th className="py-2">Tier</th>
              <th className="py-2">Topic</th>
              <th className="py-2">Quality flags</th>
              <th className="py-2">Stem preview</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id} className="border-b border-border/50">
                <td className="py-1.5 font-mono">{row.id}</td>
                <td className="py-1.5">{row.tier}</td>
                <td className="py-1.5">{row.topic}</td>
                <td className="py-1.5">{row.qualityFlags.join(", ")}</td>
                <td className="py-1.5">{row.stemPreview}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
