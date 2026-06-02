"use client";

import { useTransition, useState } from "react";
import type { UserFeedbackStatus } from "@prisma/client";
import type { AdminMutationResult } from "@/lib/admin/admin-data-result";
import { updateUserFeedbackReportStatus } from "@/app/(admin)/admin/feedback/actions";

const OPTIONS: { value: UserFeedbackStatus; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "UNDER_REVIEW", label: "Under review" },
  { value: "FIXED", label: "Fixed" },
  { value: "DISMISSED", label: "Dismissed" },
];

const initialMutation: AdminMutationResult = { ok: true };

export function AdminFeedbackStatusForm({
  reportId,
  status,
}: {
  reportId: string;
  status: UserFeedbackStatus;
}) {
  const [state, setState] = useState<AdminMutationResult>(initialMutation);
  const [isPending, startTransition] = useTransition();

  function submitStatus(nextStatus: UserFeedbackStatus) {
    const formData = new FormData();
    formData.set("reportId", reportId);
    formData.set("status", nextStatus);

    startTransition(async () => {
      const result = await updateUserFeedbackReportStatus(initialMutation, formData);
      setState(result);
    });
  }

  return (
    <div className="space-y-2">
      {state.ok ? null : (
        <p className="text-sm text-[var(--semantic-danger)]" role="alert">
          {state.message}
        </p>
      )}

      <div className="inline-flex items-center gap-2">
        <label className="sr-only" htmlFor={`fb-status-${reportId}`}>
          Update status
        </label>

        <select
          id={`fb-status-${reportId}`}
          name="status"
          defaultValue={status}
          disabled={isPending}
          onChange={(e) => submitStatus(e.currentTarget.value as UserFeedbackStatus)}
          className="w-full min-h-[42px] rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm disabled:opacity-60"
        >
          {OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {isPending ? (
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-primary" aria-hidden />
        ) : null}
      </div>
    </div>
  );
}