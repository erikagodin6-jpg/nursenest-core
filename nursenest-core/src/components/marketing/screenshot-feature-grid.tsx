"use client";

/**
 * ScreenshotFeatureGrid — registry-driven screenshot grid and feature-screenshot block.
 *
 * Provides composable, theme-aware screenshot display primitives:
 *
 *   ScreenshotGrid      — 1-to-3 column grid of screenshots with labels.
 *   ScreenshotFeatureBlock — alternating text-left / screenshot-right block.
 *   ScreenshotTile       — individual screenshot with label and optional description.
 *
 * All screenshots load from the CDN via `MarketingChainScreenshot` (existing
 * infrastructure with PNG-first → error fallback chain). No local imports.
 *
 * Usage:
 *   import { ScreenshotGrid, ScreenshotFeatureBlock } from "@/components/marketing/screenshot-feature-grid";
 *   import { SCREENSHOT_GROUPS, getScreenshotsByIds } from "@/lib/marketing/screenshot-registry";
 *
 *   <ScreenshotGrid ids={SCREENSHOT_GROUPS.pricingPreview} cols={3} />
 *
 *   <ScreenshotFeatureBlock
 *     screenshotId={8}
 *     heading="Your personalised study plan"
 *     bullets={["3–5 day structured plan", "Lesson + practice links", "Retest guidance"]}
 *   />
 */

import { useMemo } from "react";
import type { ReactNode } from "react";
import { MarketingChainScreenshot } from "@/components/marketing/marketing-screenshot-stack";
import {
  SCREENSHOT_REGISTRY,
  SCREENSHOT_GROUPS,
  getScreenshotsByIds,
  type ScreenshotId,
  type ScreenshotFeature,
} from "@/lib/marketing/screenshot-registry";

// ── Shared token helpers (CSS custom properties, no hardcoded colors) ─────────

const SURFACE_ELEVATED = "color-mix(in srgb, var(--palette-primary) 4%, var(--palette-surface))";
const SOFT_A = "color-mix(in srgb, var(--palette-primary) 6%, var(--palette-surface))";
const BORDER = "var(--border-subtle)";
const TEXT_PRIMARY = "var(--palette-heading)";
const TEXT_SECONDARY = "var(--palette-text)";
const TEXT_MUTED = "var(--palette-text-muted)";
const ACCENT = "var(--palette-primary)";

// ── ScreenshotTile ────────────────────────────────────────────────────────────

/**
 * Single screenshot card with label and optional description.
 * Used as the cell inside ScreenshotGrid.
 */
export function ScreenshotTile({
  id,
  showLabel = true,
  showDescription = false,
  aspectRatio = "16 / 10",
  className = "",
}: {
  id: ScreenshotId;
  showLabel?: boolean;
  showDescription?: boolean;
  aspectRatio?: string;
  className?: string;
}) {
  const record = useMemo(() => SCREENSHOT_REGISTRY.find((s) => s.id === id), [id]);

  if (!record) return null;

  return (
    <div className={`flex min-w-0 flex-col gap-2.5 ${className}`}>
      <MarketingChainScreenshot
        objectKey={record.objectKey}
        publicUrl={record.publicUrl}
        alt={record.alt ?? record.label}
        aspectRatio={aspectRatio}
        fit="contain"
        rounded="rounded-xl"
        imgClassName="object-top"
      />
      {showLabel ? (
        <div className="px-0.5">
          <p
            className="text-sm font-semibold leading-snug"
            style={{ color: TEXT_PRIMARY }}
          >
            {record.label}
          </p>
          {showDescription ? (
            <p
              className="mt-0.5 text-xs leading-relaxed"
              style={{ color: TEXT_MUTED }}
            >
              {record.description}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// ── ScreenshotGrid ────────────────────────────────────────────────────────────

type GridIds = {
  ids: readonly ScreenshotId[];
  feature?: never;
  group?: never;
};
type GridFeature = {
  feature: ScreenshotFeature;
  ids?: never;
  group?: never;
};
type GridGroup = {
  group: keyof typeof SCREENSHOT_GROUPS;
  ids?: never;
  feature?: never;
};

type ScreenshotGridSourceProps = GridIds | GridFeature | GridGroup;

export type ScreenshotGridProps = ScreenshotGridSourceProps & {
  /** Number of columns on ≥md viewports (default 3, max 3) */
  cols?: 1 | 2 | 3;
  showLabel?: boolean;
  showDescription?: boolean;
  aspectRatio?: string;
  className?: string;
  testId?: string;
};

function resolveGridIds(props: ScreenshotGridSourceProps): readonly ScreenshotId[] {
  if ("ids" in props && props.ids) return props.ids;
  if ("group" in props && props.group) return SCREENSHOT_GROUPS[props.group];
  if ("feature" in props && props.feature) {
    const feat = props.feature;
    return SCREENSHOT_REGISTRY.filter((s) => s.feature === feat).map((s) => s.id);
  }
  return [];
}

const COLS_CLASS: Record<1 | 2 | 3, string> = {
  1: "grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
};

/**
 * Responsive grid of screenshot tiles.
 *
 * <ScreenshotGrid ids={SCREENSHOT_GROUPS.pricingPreview} cols={3} showDescription />
 */
export function ScreenshotGrid({
  cols = 3,
  showLabel = true,
  showDescription = false,
  aspectRatio = "16 / 10",
  className = "",
  testId = "screenshot-grid",
  ...source
}: ScreenshotGridProps) {
  const ids = useMemo(
    () => resolveGridIds(source as ScreenshotGridSourceProps),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(source)],
  );

  if (ids.length === 0) return null;

  return (
    <div
      className={`grid gap-6 md:gap-8 ${COLS_CLASS[cols]} ${className}`}
      data-testid={testId}
    >
      {ids.map((id) => (
        <ScreenshotTile
          key={id}
          id={id}
          showLabel={showLabel}
          showDescription={showDescription}
          aspectRatio={aspectRatio}
        />
      ))}
    </div>
  );
}

// ── ScreenshotFeatureBlock ────────────────────────────────────────────────────

export type ScreenshotFeatureBlockProps = {
  screenshotId: ScreenshotId;
  heading: string;
  subheading?: string;
  bullets: string[];
  /** Flip: when true, screenshot appears on the LEFT, text on the RIGHT */
  flip?: boolean;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  accentColor?: string;
  aspectRatio?: string;
  className?: string;
  testId?: string;
};

/**
 * Alternating text / screenshot feature block for deep-dive sections.
 *
 * Text is on the left, screenshot on the right by default.
 * Set `flip` to alternate layout.
 *
 * <ScreenshotFeatureBlock
 *   screenshotId={8}
 *   heading="Your personalised study plan"
 *   bullets={["3–5 day plan built from your data", "Lesson + practice links", "Retest strategy"]}
 *   primaryCta={{ label: "Unlock study plans", href: "/pricing" }}
 *   flip={false}
 * />
 */
export function ScreenshotFeatureBlock({
  screenshotId,
  heading,
  subheading,
  bullets,
  flip = false,
  primaryCta,
  secondaryCta,
  accentColor = ACCENT,
  aspectRatio = "16 / 10",
  className = "",
  testId,
}: ScreenshotFeatureBlockProps) {
  const record = useMemo(
    () => SCREENSHOT_REGISTRY.find((s) => s.id === screenshotId),
    [screenshotId],
  );

  const textBlock = (
    <div className="flex min-w-0 flex-col justify-center gap-5 py-2">
      {subheading ? (
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: accentColor }}
        >
          {subheading}
        </p>
      ) : null}
      <h3
        className="nn-marketing-h3 text-balance"
        style={{ color: TEXT_PRIMARY }}
      >
        {heading}
      </h3>
      {bullets.length > 0 ? (
        <ul className="space-y-2.5">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                style={{
                  background: `color-mix(in srgb, ${accentColor} 14%, var(--palette-surface))`,
                  color: accentColor,
                }}
                aria-hidden
              >
                ✓
              </span>
              <span className="text-sm leading-relaxed" style={{ color: TEXT_SECONDARY }}>
                {b}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {(primaryCta || secondaryCta) ? (
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {primaryCta ? (
            <a
              href={primaryCta.href}
              className="nn-marketing-cta-primary inline-flex min-h-[2.75rem] items-center rounded-full px-5 text-sm font-semibold transition"
              style={{
                background: accentColor,
                color: "var(--color-on-primary, #fff)",
              }}
            >
              {primaryCta.label}
            </a>
          ) : null}
          {secondaryCta ? (
            <a
              href={secondaryCta.href}
              className="inline-flex min-h-[2.75rem] items-center rounded-full px-5 text-sm font-semibold transition"
              style={{
                border: `1.5px solid ${BORDER}`,
                color: TEXT_PRIMARY,
                background: "transparent",
              }}
            >
              {secondaryCta.label}
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  const screenshotBlock = record ? (
    <div className="min-w-0">
      <MarketingChainScreenshot
        objectKey={record.objectKey}
        publicUrl={record.publicUrl}
        alt={record.alt ?? record.label}
        aspectRatio={aspectRatio}
        fit="contain"
        rounded="rounded-2xl"
        imgClassName="object-top"
        className="shadow-[var(--shadow-elevated)]"
      />
    </div>
  ) : (
    /* Skeleton placeholder when screenshot not in registry */
    <div
      className="w-full rounded-2xl"
      style={{
        aspectRatio,
        background: SOFT_A,
        border: `1px solid ${BORDER}`,
      }}
      aria-hidden
    />
  );

  return (
    <div
      className={`grid items-center gap-10 md:grid-cols-2 md:gap-14 ${className}`}
      data-testid={testId}
    >
      {flip ? (
        <>
          {screenshotBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {screenshotBlock}
        </>
      )}
    </div>
  );
}

// ── ScreenshotProductCard ─────────────────────────────────────────────────────

/**
 * A card combining a screenshot with a short title and description.
 * Designed for product preview grids (e.g. pricing page "The full study experience").
 */
export function ScreenshotProductCard({
  screenshotId,
  icon,
  title,
  description,
  detail,
  className = "",
}: {
  screenshotId: ScreenshotId;
  icon?: ReactNode;
  title: string;
  description: string;
  detail?: string;
  className?: string;
}) {
  const record = useMemo(
    () => SCREENSHOT_REGISTRY.find((s) => s.id === screenshotId),
    [screenshotId],
  );

  return (
    <div
      className={`nn-elevation-panel nn-motion-standard flex flex-col gap-0 overflow-hidden rounded-2xl ${className}`}
      style={{ border: `1px solid ${BORDER}`, background: SURFACE_ELEVATED }}
    >
      {/* Screenshot — top of card, fills edge-to-edge */}
      <div style={{ background: SOFT_A, borderBottom: `1px solid ${BORDER}` }}>
        {record ? (
          <MarketingChainScreenshot
            objectKey={record.objectKey}
            publicUrl={record.publicUrl}
            alt={record.alt ?? record.label}
            aspectRatio="16 / 9"
            fit="contain"
            rounded="rounded-none"
            imgClassName="object-top"
          />
        ) : (
          <div
            className="w-full"
            style={{ aspectRatio: "16 / 9", background: SOFT_A }}
            aria-hidden
          />
        )}
      </div>

      {/* Text content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {icon ? (
          <span className="inline-flex items-center justify-center rounded-lg bg-[var(--surface-accent-soft)] p-2 text-[var(--text-accent)]" aria-hidden>
            {icon}
          </span>
        ) : null}
        <div>
          <h3
            className="nn-marketing-h4 mb-1.5 leading-snug"
            style={{ color: TEXT_PRIMARY }}
          >
            {title}
          </h3>
          <p
            className="text-sm leading-relaxed"
            style={{ color: TEXT_SECONDARY }}
          >
            {description}
          </p>
        </div>
        {detail ? (
          <p
            className="mt-auto rounded-lg p-2.5 text-[11px] font-medium leading-relaxed"
            style={{
              background: SOFT_A,
              border: `1px solid ${BORDER}`,
              color: TEXT_MUTED,
            }}
          >
            {detail}
          </p>
        ) : null}
      </div>
    </div>
  );
}
