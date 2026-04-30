"use client";

import type { InternalCourseStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const STATUSES: InternalCourseStatus[] = ["draft", "internal", "published"];

export function InternalCourseStatusControl(props: { courseId: string; initialStatus: InternalCourseStatus }) {
  const { courseId, initialStatus } = props;
  const router = useRouter();
  const [status, setStatus] = useState<InternalCourseStatus>(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onChange(next: InternalCourseStatus) {
    if (next === status) return;
    setError(null);
    startTransition(async () => {
      const r = await fetch(`/api/admin/internal-courses/${encodeURIComponent(courseId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!r.ok) {
        const j = (await r.json().catch(() => null)) as { error?: string } | null;
        setError(j?.error ?? `Update failed (${r.status})`);
        return;
      }
      setStatus(next);
      router.refresh();
    });
  }

  return (
    <div className="flex min-w-[160px] flex-col items-end gap-1">
      <label className="sr-only" htmlFor={`internal-course-status-${courseId}`}>
        Status
      </label>
      <select
        id={`internal-course-status-${courseId}`}
        className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
        value={status}
        disabled={pending}
        onChange={(e) => onChange(e.target.value as InternalCourseStatus)}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {error ? <p className="max-w-[220px] text-right text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
