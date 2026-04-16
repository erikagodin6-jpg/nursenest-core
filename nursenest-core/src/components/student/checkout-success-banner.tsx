"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { SuccessLeaf } from "@/components/ui/success-leaf";
import { useMarketingI18n } from "@/lib/marketing-i18n";

type SyncOutcome = "pending" | "ok" | "issue";

function Inner() {
  const sp = useSearchParams();
  const { update } = useSession();
  const { t } = useMarketingI18n();
  const [open, setOpen] = useState(false);
  const [syncOutcome, setSyncOutcome] = useState<SyncOutcome>("pending");

  useEffect(() => {
    if (sp.get("checkout") !== "success") return;
    setOpen(true);
    let cancelled = false;
    setSyncOutcome("pending");
    (async () => {
      try {
        const res = await fetch("/api/auth/sync-session", { credentials: "include" });
        if (cancelled) return;
        if (!res.ok) {
          setSyncOutcome("issue");
          return;
        }
        const data = (await res.json()) as {
          tier?: string;
          country?: string;
          subscriptionStatus?: string;
          role?: string;
        };
        await update({
          tier: data.tier,
          country: data.country,
          subscriptionStatus: data.subscriptionStatus,
          ...(data.role !== undefined ? { role: data.role } : {}),
        });
        setSyncOutcome("ok");
      } catch {
        if (!cancelled) setSyncOutcome("issue");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sp, update]);

  if (!open) return null;

  const isPending = syncOutcome === "pending";
  const isOk = syncOutcome === "ok";
  const isIssue = syncOutcome === "issue";

  const panelClass = isIssue
    ? "mb-6 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_38%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_92%,var(--semantic-surface))] px-4 py-3.5 text-sm text-[var(--semantic-text-primary)] shadow-[var(--semantic-shadow-soft)]"
    : "mb-6 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success-soft)_94%,var(--semantic-surface))] px-4 py-3.5 text-sm text-[var(--semantic-success-contrast)] shadow-[var(--semantic-shadow-soft)]";

  const title =
    isPending
      ? t("learner.checkoutReturn.pendingTitle")
      : isOk
        ? t("learner.checkoutReturn.successTitle")
        : t("learner.checkoutReturn.syncIssueTitle");

  const body =
    isPending
      ? t("learner.checkoutReturn.pendingBody")
      : isOk
        ? t("learner.checkoutReturn.successBody")
        : t("learner.checkoutReturn.syncIssueBody");

  return (
    <div className={panelClass}>
      <p className="flex items-center gap-2.5 font-semibold leading-snug">
        {isOk ? <SuccessLeaf show={isOk} size={18} /> : null}
        {title}
      </p>
      <p
        className={
          isIssue
            ? "mt-1.5 leading-relaxed text-[var(--semantic-text-secondary)]"
            : "mt-1.5 text-[color-mix(in_srgb,var(--semantic-success-contrast)_88%,var(--semantic-text-primary))] leading-relaxed"
        }
      >
        {body}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Link
          className={
            isIssue
              ? "rounded-full bg-[color-mix(in_srgb,var(--semantic-warning)_85%,var(--semantic-brand))] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-text-primary)] shadow-sm hover:opacity-95"
              : "rounded-full bg-[var(--semantic-success)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:opacity-95"
          }
          href="/app/account/overview"
        >
          {t("learner.dashboard.openAccountHub")}
        </Link>
        {!isPending ? (
          <Link
            className="rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-semibold hover:bg-[var(--semantic-panel-muted)]"
            href="/app/questions"
          >
            {t("examAttempt.openQuestionBank")}
          </Link>
        ) : null}
        <button type="button" className="text-xs underline" onClick={() => setOpen(false)}>
          Dismiss
        </button>
      </div>
    </div>
  );
}

export function CheckoutSuccessBanner() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
