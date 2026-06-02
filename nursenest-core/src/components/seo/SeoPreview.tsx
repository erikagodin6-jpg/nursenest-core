"use client";

import type { ReactNode } from "react";

export type SeoPreviewProps = {
  metaTitle: string;
  metaDescription: string;
  /** Full URL or path shown under the title (SERP-style). */
  displayUrl: string;
  primaryKeyword?: string;
  /** Optional: duplicate-title check vs recent siblings in the editor session. */
  peerTitles?: readonly string[];
};

function titleTooLong(title: string): boolean {
  return title.length > 70;
}

function missingKeyword(title: string, keyword: string | undefined): boolean {
  if (!keyword?.trim()) return false;
  return !title.toLowerCase().includes(keyword.trim().toLowerCase());
}

function duplicateTitle(title: string, peers: readonly string[] | undefined): boolean {
  if (!peers?.length) return false;
  const t = title.trim().toLowerCase();
  return peers.some((p) => p.trim().toLowerCase() === t);
}

/**
 * Dev/admin SERP-style preview with lightweight warnings (no network).
 */
export function SeoPreview(props: SeoPreviewProps): ReactNode {
  const warnings: string[] = [];
  if (titleTooLong(props.metaTitle)) warnings.push("Title may truncate in Google (>70 chars).");
  if (missingKeyword(props.metaTitle, props.primaryKeyword)) warnings.push("Primary keyword not detected in title.");
  if (duplicateTitle(props.metaTitle, props.peerTitles)) warnings.push("Duplicate title vs peer list.");

  return (
    <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-4 text-sm text-[var(--theme-body-text)]">
      <div className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">SERP preview</div>
      <div className="mt-2 line-clamp-2 text-lg text-[color-mix(in_srgb,var(--semantic-info)_55%,var(--theme-heading-text))]">
        {props.metaTitle}
      </div>
      <div className="mt-1 line-clamp-1 text-xs text-[var(--semantic-success)]">{props.displayUrl}</div>
      <div className="mt-2 line-clamp-3 text-sm text-[var(--theme-muted-text)]">{props.metaDescription}</div>
      {warnings.length > 0 ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-[var(--semantic-warning)]">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
