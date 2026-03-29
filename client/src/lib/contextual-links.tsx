import React from "react";
import { LocaleLink } from "@/lib/LocaleLink";
import type { GuideContextualLink } from "@shared/healthcare-guide-data";

export function createContextualLinkTracker(): Set<string> {
  return new Set<string>();
}

const BOUNDARY_CHARS = /[\s,;:.!?()"'\-—\/\[\]]/;

function isWordBoundary(text: string, index: number): boolean {
  if (index <= 0 || index >= text.length) return true;
  return BOUNDARY_CHARS.test(text[index - 1]) || BOUNDARY_CHARS.test(text[index]);
}

export function renderTextWithContextualLinks(
  text: string | undefined,
  contextualLinks: GuideContextualLink[] | undefined,
  usedHrefs?: Set<string>,
  className?: string
): React.ReactNode {
  if (!text) {
    return text ?? null;
  }

  if (!contextualLinks || contextualLinks.length === 0) {
    return text;
  }

  const validLinks = contextualLinks.filter((l) => l.term.trim().length > 0);
  if (validLinks.length === 0) {
    return text;
  }

  const sortedLinks = [...validLinks].sort(
    (a, b) => b.term.length - a.term.length
  );

  const tracker = usedHrefs || new Set<string>();

  const pattern = sortedLinks
    .map((link) => `(${escapeRegExp(link.term)})`)
    .join("|");
  const regex = new RegExp(pattern, "gi");

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const matchedText = match[0];
    const matchIndex = match.index;
    const matchEnd = matchIndex + matchedText.length;

    if (!isWordBoundary(text, matchIndex) || !isWordBoundary(text, matchEnd)) {
      continue;
    }

    const link = sortedLinks.find(
      (l) => l.term.toLowerCase() === matchedText.toLowerCase()
    );

    if (!link || tracker.has(link.href)) {
      continue;
    }

    if (matchIndex > lastIndex) {
      parts.push(text.slice(lastIndex, matchIndex));
    }

    tracker.add(link.href);

    parts.push(
      <LocaleLink
        key={`ctx-link-${matchIndex}`}
        href={link.href}
        className={className || "text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-500 transition-colors"}
        data-testid={`contextual-link-${link.term.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {matchedText}
      </LocaleLink>
    );

    lastIndex = matchEnd;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  if (parts.length === 0) {
    return text;
  }

  return <>{parts}</>;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
