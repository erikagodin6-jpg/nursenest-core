"use client";

import { useEffect, useState } from "react";

type Row = { id: string; title: string; summary: string; slug: string };

export function FreemiumLessonPeek() {
  const [rows, setRows] = useState<Row[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/lessons?pageSize=4", { signal: ac.signal });
        const data = await res.json();
        if (!res.ok) {
          if (!cancelled) setError(data.message ?? "Preview unavailable.");
          return;
        }
        if (!cancelled) {
          setRows(data.lessons ?? []);
          setRemaining(typeof data.freemiumRemainingAfterBatch === "number" ? data.freemiumRemainingAfterBatch : null);
        }
      } catch {
        if (!cancelled) setError("Could not load preview.");
      }
    })();
    return () => {
      cancelled = true;
      ac.abort();
    };
  }, []);

  if (error) {
    return <p className="nn-card mt-4 p-4 text-sm text-muted">{error}</p>;
  }

  if (rows.length === 0 && remaining === null) {
    return <p className="nn-card mt-4 p-4 text-sm text-muted">Loading lesson preview…</p>;
  }

  return (
    <section className="mt-6 space-y-3">
      <h2 className="text-lg font-semibold">Lesson preview</h2>
      <p className="text-sm text-muted">
        Full lesson bodies unlock with a subscription. {remaining !== null ? `${remaining} preview rows remain.` : null}
      </p>
      <ul className="space-y-2">
        {rows.map((l) => (
          <li className="nn-card p-3 text-sm" key={l.id}>
            <p className="font-semibold">{l.title}</p>
            <p className="mt-1 text-muted">{l.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
