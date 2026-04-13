"use client";

import { useFormStatus } from "react-dom";
import type { UserFeedbackStatus } from "@prisma/client";
import { updateUserFeedbackReportStatus } from "@/app/(admin)/admin/feedback/actions";

const OPTIONS: { value: UserFeedbackStatus; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "UNDER_REVIEW", label: "Under review" },
  { value: "FIXED", label: "Fixed" },
  { value: "DISMISSED", label: "Dismissed" },
];

function PendingDot() {
  const { pending } = useFormStatus();
  if (!pending) return null;
  return (
    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-primary" aria-hidden />
  );
}

export function AdminFeedbackStatusForm({ reportId, status }: { reportId: string; status: UserFeedbackStatus }) {
  return (
    <form action={updateUserFeedbackReportStatus} className="inline-flex items-center gap-2">
      <input type="hidden" name="reportId" value={reportId} />
      <label className="sr-only" htmlFor={`fb-status-${reportId}`}>
        Update status
      </label>
      <select
        id={`fb-status-${reportId}`}
        name="status"
        defaultValue={status}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-lg border border-border bg-background px-2 py-1 text-xs font-medium text-foreground shadow-sm"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <PendingDot />
    </form>
  );
}
