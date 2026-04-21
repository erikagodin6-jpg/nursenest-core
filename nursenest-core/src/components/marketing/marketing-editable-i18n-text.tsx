"use client";

import { useCallback, useId, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { useMarketingLocale } from "@/components/i18n/marketing-i18n-provider";
import { useMarketingPublicContentEdit } from "@/components/marketing/marketing-public-content-edit-provider";
import { getMarketingPublicContentKeyDef } from "@/lib/marketing/marketing-public-content-policy";

type Props = {
  messageKey: string;
  children: ReactNode;
  className?: string;
  /** When children are not a plain string, pass the same text used for display so the editor opens with the correct draft. */
  initialDraft?: string;
};

/**
 * Admin-only inline affordance for allowlisted marketing keys. Public visitors see `children` only.
 */
export function MarketingEditableI18nText({ messageKey, children, className, initialDraft }: Props) {
  const { isStaff } = useMarketingPublicContentEdit();
  const locale = useMarketingLocale();
  const router = useRouter();
  const def = getMarketingPublicContentKeyDef(messageKey);
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorText, setErrorText] = useState<string | null>(null);

  const beginEdit = useCallback(() => {
    if (!def) return;
    const initial =
      (typeof initialDraft === "string" && initialDraft.length > 0
        ? initialDraft
        : typeof children === "string"
          ? children
          : String(children ?? "")
      ).trim();
    setDraft(initial);
    setStatus("idle");
    setErrorText(null);
    setOpen(true);
  }, [children, def, initialDraft]);

  const save = useCallback(async () => {
    if (!def) return;
    setStatus("saving");
    setErrorText(null);
    try {
      const res = await fetch("/api/admin/marketing-public-content", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upsert",
          messageKey,
          locale,
          value: draft,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string; code?: string };
      if (!res.ok) {
        setStatus("error");
        setErrorText(json.error ?? `Save failed (${res.status})`);
        return;
      }
      setStatus("ok");
      setOpen(false);
      router.refresh();
    } catch (e) {
      setStatus("error");
      setErrorText(e instanceof Error ? e.message : "Network error");
    }
  }, [def, draft, locale, messageKey, router]);

  const reset = useCallback(async () => {
    if (!def) return;
    setStatus("saving");
    setErrorText(null);
    try {
      const res = await fetch("/api/admin/marketing-public-content", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset",
          messageKey,
          locale,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setErrorText(json.error ?? `Reset failed (${res.status})`);
        return;
      }
      setStatus("ok");
      setOpen(false);
      router.refresh();
    } catch (e) {
      setStatus("error");
      setErrorText(e instanceof Error ? e.message : "Network error");
    }
  }, [def, locale, messageKey, router]);

  if (!isStaff || !def) {
    return className ? <span className={className}>{children}</span> : <>{children}</>;
  }

  return (
    <span className={`group relative inline ${className ?? ""}`}>
      <span className="align-middle">{children}</span>
      <button
        type="button"
        className="ml-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] align-middle text-[var(--semantic-brand)] opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={`Edit marketing copy: ${messageKey}`}
        onClick={() => (open ? setOpen(false) : beginEdit())}
      >
        <Pencil className="h-3.5 w-3.5" aria-hidden />
      </button>
      {open ? (
        <span
          id={panelId}
          role="dialog"
          aria-label="Edit marketing text"
          className="absolute left-0 top-full z-50 mt-2 w-[min(100vw-2rem,28rem)] rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] p-3 shadow-lg"
        >
          <textarea
            className="min-h-[5rem] w-full resize-y rounded border border-[var(--semantic-border-soft)] bg-[var(--page-bg)] p-2 text-sm text-[var(--palette-text)]"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={def.maxLen}
            aria-label="Draft text"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-md bg-[var(--semantic-brand)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-brand-contrast)] disabled:opacity-50"
              disabled={status === "saving"}
              onClick={() => void save()}
            >
              Save
            </button>
            <button
              type="button"
              className="rounded-md border border-[var(--semantic-border-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--palette-text)] disabled:opacity-50"
              disabled={status === "saving"}
              onClick={() => void reset()}
            >
              Reset to default
            </button>
            <button
              type="button"
              className="rounded-md px-2 py-1.5 text-xs text-[var(--palette-text-muted)]"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
          {errorText ? <p className="mt-2 text-xs text-[var(--semantic-danger)]">{errorText}</p> : null}
          {status === "ok" && !errorText ? (
            <p className="mt-2 text-xs text-[var(--semantic-success)]">Saved — refreshing…</p>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}
