"use client";

import { useState } from "react";

export function FlashcardsTool() {
  const [topic, setTopic] = useState("");
  const [quantity, setQuantity] = useState(5);
  const [tier, setTier] = useState("rn");
  const [deckTitle, setDeckTitle] = useState("");
  const [country, setCountry] = useState("CA");
  const [examFamily, setExamFamily] = useState("GENERIC");
  const [lessonId, setLessonId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function run() {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ai/flashcards/generate", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          quantity,
          tier,
          ...(deckTitle.trim() ? { deckTitle: deckTitle.trim() } : {}),
          country,
          examFamily,
          ...(lessonId.trim() ? { lessonId: lessonId.trim() } : {}),
          ...(categoryId.trim() ? { categoryId: categoryId.trim() } : {}),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (!res.ok) {
        setError(String(data.error ?? res.status));
        return;
      }
      setResult(JSON.stringify(data, null, 2));
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="nn-card space-y-4 p-6">
      <p className="text-sm text-muted">
        Generates <strong>draft records</strong> for review — never publishes flashcards to learners.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm sm:col-span-2">
          Topic
          <input
            className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </label>
        <label className="text-sm">
          Quantity (max 15)
          <input
            type="number"
            min={1}
            max={15}
            className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </label>
        <label className="text-sm">
          Tier
          <select
            className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
            value={tier}
            onChange={(e) => setTier(e.target.value)}
          >
            {["free", "rpn", "rn", "np"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm sm:col-span-2">
          Deck title (optional)
          <input
            className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
            value={deckTitle}
            onChange={(e) => setDeckTitle(e.target.value)}
          />
        </label>
        <label className="text-sm">
          Country
          <select
            className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="CA">CA</option>
            <option value="US">US</option>
          </select>
        </label>
        <label className="text-sm">
          Exam family
          <select
            className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
            value={examFamily}
            onChange={(e) => setExamFamily(e.target.value)}
          >
            {["GENERIC", "NCLEX_RN", "NCLEX_PN", "REX_PN", "NP", "ALLIED"].map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Category ID (optional)
          <input
            className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          />
        </label>
        <label className="text-sm sm:col-span-2">
          Lesson ID (optional)
          <input
            className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
            value={lessonId}
            onChange={(e) => setLessonId(e.target.value)}
          />
        </label>
      </div>
      <button
        type="button"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        disabled={loading || !topic.trim()}
        onClick={() => void run()}
      >
        {loading ? "Generating…" : "Generate drafts"}
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {result ? (
        <textarea readOnly className="h-48 w-full rounded border border-border bg-black/[0.03] p-2 font-mono text-xs" value={result} />
      ) : null}
    </div>
  );
}
