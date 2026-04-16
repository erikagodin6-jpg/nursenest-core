"use client";

import {
  createElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import type { InlineContentKind } from "@prisma/client";
import { useRouter } from "next/navigation";

type PlainAs = "p" | "span" | "div" | "label" | "li";
type HeadingAs = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const hoverRing =
  "transition-[box-shadow] hover:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--semantic-info)_45%,var(--semantic-border-soft))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]";

type BaseProps = {
  contentKey: string;
  defaultText: string;
  resolvedText: string;
  kind: InlineContentKind;
  isAdmin: boolean;
  className?: string;
};

function InlineEditModal({
  open,
  title,
  contentKey,
  value,
  onChange,
  onClose,
  onSave,
  saving,
  error,
  richHint,
}: {
  open: boolean;
  title: string;
  contentKey: string;
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
  error: string | null;
  richHint?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="z-[580] w-[min(100vw-2rem,32rem)] max-w-[calc(100vw-2rem)] rounded-2xl border p-0 shadow-2xl open:flex open:flex-col [&::backdrop]:bg-[color-mix(in_srgb,var(--semantic-text-primary)_22%,transparent)]"
      style={{
        borderColor: "color-mix(in srgb, var(--semantic-border-soft) 85%, transparent)",
        background: "color-mix(in srgb, var(--semantic-panel-cool) 94%, var(--theme-page-bg))",
        color: "var(--semantic-text-primary)",
      }}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="border-b px-4 py-3" style={{ borderColor: "var(--semantic-border-soft)" }}>
        <p id={titleId} className="text-sm font-semibold">
          {title}
        </p>
        <p className="mt-1 break-all font-mono text-[11px] text-[var(--semantic-text-muted)]">{contentKey}</p>
      </div>
      <div className="p-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={richHint ? 14 : 8}
          className="w-full resize-y rounded-xl border bg-[var(--theme-page-bg)] px-3 py-2 text-sm text-[var(--semantic-text-primary)] focus:outline focus:outline-2 focus:outline-[var(--semantic-brand)]"
          style={{ borderColor: "var(--semantic-border-soft)" }}
          spellCheck
        />
        {richHint ? (
          <p className="mt-2 text-[11px] text-[var(--semantic-text-muted)]">
            Limited HTML (e.g. &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;) — scripts removed on save.
          </p>
        ) : null}
        {error ? (
          <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--semantic-danger)_85%,var(--semantic-text-primary))]">{error}</p>
        ) : null}
      </div>
      <div
        className="flex justify-end gap-2 border-t px-4 py-3"
        style={{ borderColor: "var(--semantic-border-soft)" }}
      >
        <button
          type="button"
          className="rounded-lg border px-3 py-1.5 text-sm font-medium text-[var(--semantic-text-secondary)]"
          style={{ borderColor: "var(--semantic-border-soft)" }}
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={saving}
          className="rounded-lg bg-[color-mix(in_srgb,var(--semantic-brand)_88%,transparent)] px-3 py-1.5 text-sm font-semibold text-[var(--theme-body-text)] disabled:opacity-60"
          onClick={onSave}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </dialog>
  );
}

function useInlineEditModal(contentKey: string, kind: InlineContentKind, initialText: string, isAdmin: boolean) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(initialText);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(initialText);
  }, [initialText]);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/inline-content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: contentKey, body: draft, kind }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setError(j.error ?? `Save failed (${res.status})`);
        return;
      }
      setOpen(false);
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }, [contentKey, draft, kind, router]);

  return {
    open,
    setOpen,
    draft,
    setDraft,
    saving,
    error,
    save,
    openModal: () => {
      if (!isAdmin) return;
      setDraft(initialText);
      setError(null);
      setOpen(true);
    },
    closeModal: () => setOpen(false),
  };
}

export function EditableTextClient(
  props: BaseProps & {
    as?: PlainAs;
  },
) {
  const { contentKey, resolvedText, kind, isAdmin, className = "", as: Tag = "p" } = props;
  const modal = useInlineEditModal(contentKey, kind, resolvedText, isAdmin);

  if (!isAdmin) {
    return <Tag className={className}>{resolvedText}</Tag>;
  }

  return (
    <>
      <button
        type="button"
        className={`block w-full max-w-full cursor-pointer rounded-md border-0 bg-transparent p-0 text-left ${hoverRing} ${className}`}
        onClick={() => modal.openModal()}
        aria-label={`Edit content ${contentKey}`}
      >
        {resolvedText}
      </button>
      <InlineEditModal
        open={modal.open}
        title="Edit text"
        contentKey={contentKey}
        value={modal.draft}
        onChange={modal.setDraft}
        onClose={modal.closeModal}
        onSave={modal.save}
        saving={modal.saving}
        error={modal.error}
      />
    </>
  );
}

export function EditableHeadingClient(
  props: BaseProps & {
    as?: HeadingAs;
  },
) {
  const { contentKey, resolvedText, kind, isAdmin, className = "", as: Tag = "h2" } = props;
  const modal = useInlineEditModal(contentKey, kind, resolvedText, isAdmin);

  if (!isAdmin) {
    return createElement(Tag, { className }, resolvedText);
  }

  const open = () => modal.openModal();
  return (
    <>
      {createElement(
        Tag,
        {
          className: `cursor-pointer rounded-md ${hoverRing} ${className}`,
          onClick: open,
          tabIndex: 0,
          role: "button",
          onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              open();
            }
          },
          "aria-label": `Edit heading ${contentKey}`,
        } as HTMLAttributes<HTMLElement>,
        resolvedText,
      )}
      <InlineEditModal
        open={modal.open}
        title="Edit heading"
        contentKey={contentKey}
        value={modal.draft}
        onChange={modal.setDraft}
        onClose={modal.closeModal}
        onSave={modal.save}
        saving={modal.saving}
        error={modal.error}
      />
    </>
  );
}

export function EditableRichTextClient(props: BaseProps) {
  const { contentKey, resolvedText, kind, isAdmin, className = "" } = props;
  const modal = useInlineEditModal(contentKey, kind, resolvedText, isAdmin);

  const open = () => modal.openModal();
  return (
    <>
      <div
        role="button"
        tabIndex={0}
        className={`cursor-pointer rounded-md ${hoverRing} ${className}`}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open();
          }
        }}
        aria-label={`Edit rich text ${contentKey}`}
        dangerouslySetInnerHTML={{ __html: resolvedText }}
      />
      <InlineEditModal
        open={modal.open}
        title="Edit HTML"
        contentKey={contentKey}
        value={modal.draft}
        onChange={modal.setDraft}
        onClose={modal.closeModal}
        onSave={modal.save}
        saving={modal.saving}
        error={modal.error}
        richHint
      />
    </>
  );
}
