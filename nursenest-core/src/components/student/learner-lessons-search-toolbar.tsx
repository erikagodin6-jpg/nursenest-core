"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Debounced search: updates `q` and resets to page 1 (preserves topic/pathway/limit via current URL).
 */
export function LearnerLessonsSearchToolbar({
  initialQ,
  label,
  placeholder,
}: {
  initialQ: string;
  label: string;
  placeholder: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialQ);
  const committedRef = useRef(initialQ);

  useEffect(() => {
    setValue(initialQ);
    committedRef.current = initialQ;
  }, [initialQ]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const next = value.trim();
      if (next === committedRef.current.trim()) return;
      committedRef.current = next;
      const qs = new URLSearchParams(searchParams.toString());
      if (next) qs.set("q", next);
      else qs.delete("q");
      qs.set("page", "1");
      router.push(`/app/lessons?${qs.toString()}`);
    }, 300);
    return () => window.clearTimeout(id);
  }, [value, router, searchParams]);

  return (
    <div className="nn-card border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)] p-4">
      <label className="block text-sm font-semibold text-[var(--semantic-text-primary)]" htmlFor="learner-lessons-q">
        {label}
      </label>
      <input
        id="learner-lessons-q"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="mt-2 w-full max-w-xl rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm text-[var(--semantic-text-primary)] placeholder:text-[var(--semantic-text-muted)]"
      />
    </div>
  );
}
