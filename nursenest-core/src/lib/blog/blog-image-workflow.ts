/**
 * Image workflow for AI-assisted blog posts: structured slots, attachments, and safe published HTML.
 */

import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import { parseBlogSeoBundle, type BlogSeoBundle } from "@/lib/blog/blog-seo-automation";

export type BlogImageSlotRole = "hero" | "inline";

export type NormalizedImagePlacement = {
  slotKey: string;
  role: BlogImageSlotRole;
  section: string;
  promptIdea: string;
  altIdea: string;
  captionIdea?: string;
};

export type BlogImageAttachmentSourceKind = "none" | "upload" | "external_url" | "ai_prompt";

/** Persisted beside plan rows in `internalLinkPlan.imageAttachments`. */
export type BlogImageSlotAttachment = {
  slotKey: string;
  /** Public https URL when an asset is attached */
  url: string | null;
  alt: string;
  caption: string | null;
  sourceKind: BlogImageAttachmentSourceKind;
};

export function defaultSlotKeyForPlacementIndex(index: number): string {
  return index === 0 ? "hero" : `inline_${index}`;
}

export function inferRoleForPlacementIndex(index: number): BlogImageSlotRole {
  return index === 0 ? "hero" : "inline";
}

/** Normalize model/plan placements with stable slot keys for admin attachment UI. */
export function normalizeImagePlacementsFromPlan(
  placements: BlogControlPanelPlan["imagePlacements"],
): NormalizedImagePlacement[] {
  return placements.map((p, i) => ({
    slotKey: (p.slotKey ?? defaultSlotKeyForPlacementIndex(i)).slice(0, 48),
    role: p.role ?? inferRoleForPlacementIndex(i),
    section: p.section,
    promptIdea: p.promptIdea,
    altIdea: p.altIdea,
    captionIdea: p.captionIdea,
  }));
}

export type ParsedInternalLinkPlan = {
  lessons: BlogControlPanelPlan["suggestedInternalLessons"];
  imagePlacements: BlogControlPanelPlan["imagePlacements"];
  imageAttachments: BlogImageSlotAttachment[];
  seo: BlogSeoBundle | null;
};

const EMPTY_ATTACHMENTS: BlogImageSlotAttachment[] = [];

/** Best-effort read of `BlogPost.internalLinkPlan` JSON. */
export function parseInternalLinkPlanJson(raw: unknown): ParsedInternalLinkPlan {
  if (!raw || typeof raw !== "object") {
    return { lessons: [], imagePlacements: [], imageAttachments: EMPTY_ATTACHMENTS, seo: null };
  }
  const o = raw as Record<string, unknown>;
  const lessons = Array.isArray(o.lessons) ? (o.lessons as BlogControlPanelPlan["suggestedInternalLessons"]) : [];
  const imagePlacements = Array.isArray(o.imagePlacements)
    ? (o.imagePlacements as BlogControlPanelPlan["imagePlacements"])
    : [];
  let imageAttachments: BlogImageSlotAttachment[] = [];
  if (Array.isArray(o.imageAttachments)) {
    imageAttachments = o.imageAttachments
      .map((row): BlogImageSlotAttachment | null => {
        if (!row || typeof row !== "object") return null;
        const r = row as Record<string, unknown>;
        const slotKey = typeof r.slotKey === "string" ? r.slotKey.slice(0, 48) : "";
        if (!slotKey) return null;
        const url = typeof r.url === "string" && r.url.trim() ? r.url.trim().slice(0, 2000) : null;
        const alt = typeof r.alt === "string" ? r.alt.slice(0, 240) : "";
        const caption = typeof r.caption === "string" && r.caption.trim() ? r.caption.trim().slice(0, 300) : null;
        const sk = r.sourceKind;
        const sourceKind: BlogImageAttachmentSourceKind =
          sk === "upload" || sk === "external_url" || sk === "ai_prompt" || sk === "none" ? sk : url ? "external_url" : "none";
        return { slotKey, url, alt, caption, sourceKind };
      })
      .filter((x): x is BlogImageSlotAttachment => Boolean(x));
  }
  const seo = parseBlogSeoBundle(o.seo);
  return { lessons, imagePlacements, imageAttachments, seo };
}

export function mergeAttachmentsBySlotKey(rows: BlogImageSlotAttachment[]): BlogImageSlotAttachment[] {
  const by = new Map<string, BlogImageSlotAttachment>();
  for (const r of rows) {
    by.set(r.slotKey, r);
  }
  return [...by.values()];
}

export function isPlausiblePublicImageUrl(src: string): boolean {
  const s = src.trim();
  if (!/^https:\/\//i.test(s)) return false;
  try {
    const u = new URL(s);
    return u.protocol === "https:" && Boolean(u.hostname?.includes("."));
  } catch {
    return false;
  }
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Paste-safe figure snippet for article HTML (requires https URL). */
export function buildEducationalFigureHtml(url: string, alt: string, caption?: string | null): string {
  const u = url.trim();
  const a = alt.trim();
  if (!isPlausiblePublicImageUrl(u)) return "";
  const img = `<img src="${escapeAttr(u)}" alt="${escapeAttr(a)}" class="w-full rounded-xl border border-[var(--theme-card-border)] object-cover" loading="lazy" decoding="async" />`;
  const cap = caption?.trim();
  if (cap) {
    return `<figure class="my-6">${img}<figcaption class="mt-2 text-xs text-muted-foreground">${escapeAttr(cap)}</figcaption></figure>`;
  }
  return `<figure class="my-6">${img}</figure>`;
}

/**
 * Remove `<img>` tags without a usable https URL; drop figures that end up empty.
 * Keeps published HTML free of broken image placeholders the model or editor might introduce.
 */
export function stripBrokenOrEmptyImagesFromHtml(html: string): string {
  let s = html.replace(/<img\b[^>]*>/gi, (tag) => {
    const srcM = /\ssrc\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(tag);
    const raw = (srcM?.[2] ?? srcM?.[3] ?? srcM?.[4] ?? "").trim();
    if (!raw || !isPlausiblePublicImageUrl(raw)) {
      return "";
    }
    return tag;
  });
  // Figures that only contained removed content
  s = s.replace(/<figure[^>]*>[\s\u00a0]*<\/figure>/gi, "");
  return s;
}
