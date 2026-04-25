"use client";

import { useTransition, useState } from "react";
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

function PendingInline({ pending }: { pending: boolean }) {
  if (!pending) return null;
  return (
    <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-primary" aria-hidden />
  );
}

/** One-click status shortcuts */
export function AdminFeedbackQuickStatusRow({ reportId }: { reportId: string }) {
  const [state, setState] = useState<AdminActionResult | null>(initialTriage);
  const [isPending, startTransition] = useTransition();

  const rows: Array<{ status: string; label: string }> = [
    { status: "UNDER_REVIEW", label: "Mark under review" },
    { status: "FIXED", label: "Mark fixed" },
    { status: "DISMISSED", label: "Dismiss" },
  ];

  function runAction(status: string) {
    const formData = new FormData();
    formData.set("nn_fb_op", "set_status");
    formData.set("reportId", reportId);
    formData.set("status", status);

    startTransition(async () => {
      const result = await submitAdminFeedbackTriage(formData);
      setState(result);
    });
  }

  return (
    <div className="rounded-lg border border-border/60 bg-background/60 p-3">
      {state && !state.ok ? (
        <p className="mb-2 text-sm text-[var(--semantic-danger)]">{state.message}</p>
      ) : null}

      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Quick actions
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        {rows.map((r) => (
          <button
            key={r.status}
            onClick={() => runAction(r.status)}
            disabled={isPending}
            className="rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-semibold hover:bg-muted/50 disabled:opacity-60"
          >
            {r.label}
            <PendingInline pending={isPending} />
          </button>
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
  const [linkState, setLinkState] = useState<AdminMutationResult>(initialMutation);
  const [clearState, setClearState] = useState<AdminMutationResult>(initialMutation);
  const [isPending, startTransition] = useTransition();

  function linkDuplicate(formData: FormData) {
    startTransition(async () => {
      const result = await linkUserFeedbackDuplicate(initialMutation, formData);
      setLinkState(result);
    });
  }

  function clearDuplicate(formData: FormData) {
    startTransition(async () => {
      const result = await clearUserFeedbackDuplicate(initialMutation, formData);
      setClearState(result);
    });
  }

  return (
    <div className="mt-3 space-y-4">
      {!linkState.ok && <p className="text-sm text-[var(--semantic-danger)]">{linkState.message}</p>}
      {!clearState.ok && <p className="text-sm text-[var(--semantic-danger)]">{clearState.message}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          linkDuplicate(new FormData(e.currentTarget));
        }}
        className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end"
      >
        <input type="hidden" name="reportId" value={reportId} />

        <input
          name="primaryReportId"
          required
          className="rounded-md border border-border px-2 py-1.5 text-xs"
          placeholder="Primary report id"
        />

        <button type="submit" disabled={isPending} className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-white">
          Link
          <PendingInline pending={isPending} />
        </button>
      </form>

      {hasDuplicateOf && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            clearDuplicate(new FormData(e.currentTarget));
          }}
          className="flex gap-2"
        >
          <input type="hidden" name="reportId" value={reportId} />

          <button type="submit" disabled={isPending} className="text-sm text-red-600 underline">
            Unlink
            <PendingInline pending={isPending} />
          </button>

          <Link href={adminFeedbackInboxHref(sp, { r: reportId })}>Primary report</Link>
        </form>
      )}
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
  const [state, setState] = useState<AdminMutationResult>(initialMutation);
  const [isPending, startTransition] = useTransition();

  function submitNotes(formData: FormData) {
    startTransition(async () => {
      const result = await saveUserFeedbackInternalNotes(initialMutation, formData);
      setState(result);
    });
  }

  return (
    <div className="mt-2 space-y-2">
      {!state.ok && <p className="text-sm text-[var(--semantic-danger)]">{state.message}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitNotes(new FormData(e.currentTarget));
        }}
        className="space-y-2"
      >
        <input type="hidden" name="reportId" value={reportId} />

        <textarea
          name="internalNotes"
          defaultValue={defaultNotes ?? ""}
          rows={5}
          className="w-full rounded-md border border-border px-3 py-2 text-sm"
        />

        <button type="submit" disabled={isPending} className="rounded-md border px-3 py-1.5 text-xs">
          Save
          <PendingInline pending={isPending} />
        </button>
      </form>
    </div>
  );
}