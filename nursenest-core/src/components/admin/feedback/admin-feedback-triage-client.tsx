"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import type { UserFeedbackStatus } from "@prisma/client";
import { submitAdminFeedbackTriage } from "@/app/(admin)/admin/feedback/actions";
import type { AdminActionResult } from "@/lib/admin/admin-action-result";
import { adminFeedbackInboxHref } from "@/lib/admin/feedback-inbox-url";

function PendingDot() {
  const { pending } = useFormStatus();
  if (!pending) return null;
  return (
    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-primary" aria-hidden />
  );
}

function TriageAlert({ state }: { state: AdminActionResult | null }) {
  if (!state || state.ok) return null;
  return (
    <p role="alert" className="mt-2 text-xs font-medium text-destructive">
      {state.message}
    </p>
  );
}

export function AdminFeedbackQuickStatusButtons({ reportId }: { reportId: string }) {
  const [state, formAction] = useFormState(submitAdminFeedbackTriage, null as AdminActionResult | null);
  const buttons: { status: UserFeedbackStatus; label: string; className: string }[] = [
    {
      status: "UNDER_REVIEW",
      label: "Under review",
      className:
        "rounded-xl border border-sky-500/35 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-950 hover:bg-sky-500/15 dark:text-sky-50",
    },
    {
      status: "FIXED",
      label: "Mark fixed",
      className:
        "rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-950 hover:bg-emerald-500/15 dark:text-emerald-50",
    },
    {
      status: "DISMISSED",
      label: "Dismiss",
      className:
        "rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted/60",
    },
    {
      status: "NEW",
      label: "Re-open as new",
      className:
        "rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/30",
    },
  ];
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {buttons.map((b) => (
          <form key={b.status} action={formAction} className="inline">
            <input type="hidden" name="nn_fb_op" value="set_status" />
            <input type="hidden" name="reportId" value={reportId} />
            <input type="hidden" name="status" value={b.status} />
            <button type="submit" className={b.className}>
              {b.label}
            </button>
          </form>
        ))}
      </div>
      <TriageAlert state={state} />
    </div>
  );
}

export function AdminFeedbackDuplicateControls(props: {
  reportId: string;
  sp: Record<string, string | undefined>;
  duplicateOf: { id: string; summary: string } | null;
}) {
  const [state, formAction] = useFormState(submitAdminFeedbackTriage, null as AdminActionResult | null);
  const { reportId, sp, duplicateOf } = props;

  if (duplicateOf) {
    return (
      <div className="mt-2 space-y-2 text-sm">
        <p className="text-muted-foreground">
          Linked to{" "}
          <Link href={adminFeedbackInboxHref(sp, { r: duplicateOf.id })} className="font-mono font-semibold text-primary">
            {duplicateOf.id.slice(0, 10)}…
          </Link>
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2">{duplicateOf.summary}</p>
        <form action={formAction}>
          <input type="hidden" name="nn_fb_op" value="clear_duplicate" />
          <input type="hidden" name="reportId" value={reportId} />
          <button type="submit" className="mt-2 text-xs font-semibold text-primary underline">
            Unlink duplicate
          </button>
        </form>
        <TriageAlert state={state} />
      </div>
    );
  }

  return (
    <div>
      <form action={formAction} className="mt-3 space-y-2">
        <input type="hidden" name="nn_fb_op" value="link_duplicate" />
        <input type="hidden" name="reportId" value={reportId} />
        <label className="block text-[11px] font-medium text-muted-foreground" htmlFor="primaryReportId">
          Canonical report id
        </label>
        <input
          id="primaryReportId"
          name="primaryReportId"
          placeholder="Paste primary report cuid"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs"
          autoComplete="off"
        />
        <button
          type="submit"
          className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold hover:bg-muted/40"
        >
          Mark as duplicate of…
        </button>
      </form>
      <TriageAlert state={state} />
    </div>
  );
}

export function AdminFeedbackInternalNotesForm(props: { reportId: string; defaultNotes: string }) {
  const [state, formAction] = useFormState(submitAdminFeedbackTriage, null as AdminActionResult | null);
  return (
    <div>
      <form action={formAction} className="mt-3 space-y-2">
        <input type="hidden" name="nn_fb_op" value="save_notes" />
        <input type="hidden" name="reportId" value={props.reportId} />
        <textarea
          name="internalNotes"
          defaultValue={props.defaultNotes}
          rows={5}
          className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2 text-sm leading-relaxed shadow-inner"
          placeholder="Triage notes, owner, related ticket, hypothesis…"
        />
        <button
          type="submit"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95"
        >
          Save notes
        </button>
        <PendingDot />
      </form>
      <TriageAlert state={state} />
    </div>
  );
}
