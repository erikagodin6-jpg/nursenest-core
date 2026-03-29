"use client";

import { useEffect, useState } from "react";

type Row = {
  id: string;
  stem: string;
  questionType: string;
  options: unknown;
  category?: { name: string };
};

export function FreemiumQuestionPeek() {
  const [rows, setRows] = useState<Row[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/questions?pageSize=5", { signal: ac.signal });
        const data = await res.json();
        if (!res.ok) {
          if (!cancelled) setError(data.message ?? "Preview unavailable.");
          return;
        }
        if (!cancelled) {
          setRows(data.questions ?? []);
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
    return <p className="nn-card mt-4 p-4 text-sm text-muted">Loading complimentary preview…</p>;
  }

  return (
    <section className="mt-6 space-y-3">
      <h2 className="text-lg font-semibold">Complimentary preview</h2>
      <p className="text-sm text-muted">
        Rationales unlock with a subscription. {remaining !== null ? `${remaining} preview slots remain after this batch.` : null}
      </p>
      <div className="space-y-3">
        {rows.map((q) => (
          <article className="nn-card p-4" key={q.id}>
            <p className="text-xs uppercase tracking-wide text-muted">{q.questionType}</p>
            <h3 className="mt-1 font-semibold">{q.stem}</h3>
            {q.category?.name ? <p className="mt-1 text-xs text-muted">{q.category.name}</p> : null}
            <p className="mt-2 text-xs text-muted">Answer choices load in the full bank—upgrade to submit and track.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
