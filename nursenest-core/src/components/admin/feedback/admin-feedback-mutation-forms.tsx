"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { adminFeedbackInboxHref } from "@/lib/admin/feedback-inbox-url";
import {
  clearUserFeedbackDuplicate,
  linkUserFeedbackDuplicate,
  saveUserFeedbackInternalNotes,
  submitAdminFeedbackTriage,
} from "@/app/(admin)/admin/feedback/actions";
import type { AdminActionResult } from "@/lib/admin/admin-action-result";
import type { AdminMutationResult } from "@/lib/admin/admin-data-result";

const initialMutation: AdminMutationResult = { ok: true };
const initialTriage: AdminActionResult | null = null;

function PendingInline() {
  const { pending } = useFormStatus();
  if (!pending) return null;
  return <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-primary" aria-hidden />;
}

/** One-click status shortcuts (same contract as full status dropdown). */
export function AdminFeedbackQuickStatusRow({ reportId }: { reportId: string }) {
  const [state, action] = useActionState(submitAdminFeedbackTriage, initialTriage);

  const rows: Array<{ status: string; label: string }> = [
    { status: "UNDER_REVIEW", label: "Mark under review" },
    { status: "FIXED", label: "Mark fixed" },
    { status: "DISMISSED", label: "Dismiss" },
  ];

  return (
    <div className="rounded-lg border border-border/60 bg-background/60 p-3">
      {state && !state.ok ? (
        <p className="mb-2 text-sm text-[var(--semantic-danger)]" role="alert">
          {state.message}
        </p>
      ) : null}
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Quick actions</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {rows.map((r) => (
          <form key={r.status} action={action} className="inline-flex items-center">
            <input type="hidden" name="nn_fb_op" value="set_status" />
            <input type="hidden" name="reportId" value={reportId} />
            <input type="hidden" name="status" value={r.status} />
            <button
              type="submit"
              className="rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-semibold hover:bg-muted/50"
            >
              {r.label}
              <PendingInline />
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}

export function AdminFeedbackDuplicateForms({
  reportId,
  sp,
  hasDuplicateOf,
}: {
  reportId: string;
  sp: Record<string, string | undefined>;
  hasDuplicateOf: boolean;
}) {
  const [linkState, linkAction] = useActionState(linkUserFeedbackDuplicate, initialMutation);
  const [clearState, clearAction] = useActionState(clearUserFeedbackDuplicate, initialMutation);

  return (
    <div className="mt-3 space-y-4">
      {!linkState.ok ? (
        <p className="text-sm text-[var(--semantic-danger)]" role="alert">
          {linkState.message}
        </p>
      ) : null}
      {!clearState.ok ? (
        <p className="text-sm text-[var(--semantic-danger)]" role="alert">
          {clearState.message}
        </p>
      ) : null}
      <form action={linkAction} className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end">
        <input type="hidden" name="reportId" value={reportId} />
        <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs font-medium text-foreground">
          Primary report id (cuid)
          <input
            name="primaryReportId"
            required
            autoComplete="off"
            className="rounded-md border border-border bg-background px-2 py-1.5 font-mono text-xs"
            placeholder="Paste primary feedback id"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-95"
        >
          Link as duplicate
          <PendingInline />
        </button>
      </form>
      {hasDuplicateOf ? (
        <form action={clearAction} className="flex flex-wrap items-center gap-2">
          <input type="hidden" name="reportId" value={reportId} />
          <button
            type="submit"
            className="text-sm font-semibold text-[var(--semantic-danger)] underline-offset-2 hover:underline"
          >
            Unlink duplicate
            <PendingInline />
          </button>
          <span className="text-xs text-muted-foreground">
            Or open the{" "}
            <Link href={adminFeedbackInboxHref(sp, { r: reportId })} className="text-primary underline">
              primary report
            </Link>
            .
          </span>
        </form>
      ) : null}
    </div>
  );
}

export function AdminFeedbackInternalNotesForm({
  reportId,
  defaultNotes,
}: {
  reportId: string;
  defaultNotes: string | null;
}) {
  const [state, formAction] = useActionState(saveUserFeedbackInternalNotes, initialMutation);

  return (
    <div className="mt-2 space-y-2">
      {!state.ok ? (
        <p className="text-sm text-[var(--semantic-danger)]" role="alert">
          {state.message}
        </p>
      ) : null}
      <form action={formAction} className="space-y-2">
        <input type="hidden" name="reportId" value={reportId} />
        <textarea
          name="internalNotes"
          defaultValue={defaultNotes ?? ""}
          rows={5}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          placeholder="Internal notes for staff…"
        />
        <button
          type="submit"
          className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-muted/50"
        >
          Save notes
          <PendingInline />
        </button>
      </form>
    </div>
  );
}
