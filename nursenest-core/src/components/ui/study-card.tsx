"use client";

/**
 * StudyCard — shared card component for lessons, questions, exam pathways, and CAT surfaces.
 *
 * ## Design goals
 * - Single visual vocabulary across marketing hubs, lesson lists, and the learner app.
 * - Semantic status badges (free, premium, completed, in_progress, new, locked).
 * - Structured meta row (questions, time, difficulty) with optional icons.
 * - Theme-safe: uses CSS variables exclusively; adapts to every `[data-theme]`.
 * - Accessible: focus-visible rings, aria-label, aria-disabled for locked state.
 * - Motion-respectful: hover/lift animations skip under `prefers-reduced-motion`.
 *
 * ## Surfaces
 * - `hub`  → `nn-exam-hub-study-card` (tall, gradient, whole-card link; used on pathway hubs)
 * - `list` → `nn-study-card` (article card; title is the link; used on lesson lists)
 * - `app`  → `nn-card`  (learner-app card; uses semantic tokens)
 *
 * ## Variants (per surface)
 * - `default`   — standard card
 * - `featured`  — stronger gradient + elevation (question bank emphasis)
 * - `completed` — success-tinted border; shows completion badge/accent
 * - `locked`    — greyed; shows lock badge; CTA becomes "Unlock" or is hidden
 */

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Lock } from "lucide-react";
import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CardStatus = "free" | "premium" | "completed" | "in_progress" | "new" | "locked";
export type CardVariant = "default" | "featured" | "locked" | "completed";
export type CardSurface = "hub" | "list" | "app";

export type CardMetaItem = {
  /** Short label: "25 questions", "~15 min", "Advanced". */
  label: string;
  icon?: LucideIcon;
};

// ---------------------------------------------------------------------------
// StatusBadge — exported so callers can use it standalone
// ---------------------------------------------------------------------------

const STATUS_BADGE_CONFIG: Record<
  CardStatus,
  { label: string; className: string }
> = {
  free: {
    label: "Free",
    className:
      "bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] text-[var(--semantic-success-contrast)] border border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))]",
  },
  premium: {
    label: "Premium",
    className:
      "bg-[color-mix(in_srgb,var(--theme-primary)_10%,var(--semantic-surface))] text-[var(--theme-primary)] border border-[color-mix(in_srgb,var(--theme-primary)_24%,var(--semantic-border-soft))]",
  },
  completed: {
    label: "Completed",
    className:
      "bg-[var(--semantic-success-soft)] text-[var(--semantic-success-contrast)] border border-[color-mix(in_srgb,var(--role-success)_30%,var(--semantic-border-soft))]",
  },
  in_progress: {
    label: "In progress",
    className:
      "bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] text-[var(--semantic-info-contrast)] border border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))]",
  },
  new: {
    label: "New",
    className:
      "bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)] border border-[color-mix(in_srgb,var(--semantic-brand)_26%,var(--semantic-border-soft))]",
  },
  locked: {
    label: "Locked",
    className:
      "bg-[var(--semantic-panel-muted)] text-[var(--semantic-text-muted)] border border-[var(--semantic-border-soft)]",
  },
};

export function StatusBadge({
  status,
  className = "",
  size = "sm",
}: {
  status: CardStatus;
  className?: string;
  size?: "xs" | "sm";
}) {
  const cfg = STATUS_BADGE_CONFIG[status];
  const sizeClass = size === "xs" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold leading-none tracking-wide ${sizeClass} ${cfg.className} ${className}`}
    >
      {status === "completed" && <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden />}
      {status === "locked" && <Lock className="h-3 w-3 shrink-0" aria-hidden />}
      {cfg.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// MetaRow — compact pill list (questions, time, difficulty)
// ---------------------------------------------------------------------------

export function MetaRow({ items, className = "" }: { items: CardMetaItem[]; className?: string }) {
  if (items.length === 0) return null;
  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${className}`} aria-label="Card details">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <span
            key={i}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--theme-muted-text)]"
          >
            {Icon ? <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden /> : null}
            {item.label}
            {i < items.length - 1 ? (
              <span className="ml-2 h-3 w-px bg-[var(--border-subtle)]" aria-hidden />
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Surface + variant → CSS class maps
// ---------------------------------------------------------------------------

function hubCardClass(variant: CardVariant): string {
  const base = "nn-exam-hub-study-card group";
  switch (variant) {
    case "featured":
      return `${base} nn-exam-hub-study-card--featured`;
    case "completed":
      return `${base} nn-exam-hub-study-card--completed`;
    case "locked":
      return `${base} nn-exam-hub-study-card--locked`;
    default:
      return base;
  }
}

function listCardClass(variant: CardVariant): string {
  const base = "nn-study-card flex h-full flex-col p-4 transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-px hover:shadow-[var(--shadow-card-hover)] focus-within:ring-2 focus-within:ring-[var(--ring-accent)] sm:p-5";
  switch (variant) {
    case "featured":
      return `${base} nn-study-card--wash`;
    case "completed":
      return `${base} nn-study-card--completed`;
    case "locked":
      return `${base} nn-study-card--locked`;
    default:
      return base;
  }
}

function appCardClass(variant: CardVariant): string {
  const base = "nn-card flex h-full flex-col overflow-hidden p-4 transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-[var(--ring-accent)] sm:p-5";
  switch (variant) {
    case "completed":
      return `${base} nn-card--completed`;
    case "locked":
      return `${base} nn-card--locked`;
    default:
      return base;
  }
}

// CTA button classes
const CTA_PRIMARY =
  "mt-auto inline-flex w-full items-center justify-center rounded-full nn-btn-primary px-5 py-3 text-sm font-semibold shadow-none transition group-hover:brightness-[1.03]";
const CTA_SECONDARY =
  "mt-auto inline-flex w-full items-center justify-center rounded-full border border-[var(--surface-bubble-border)] bg-[var(--surface-accent-soft)] px-5 py-3 text-sm font-semibold text-[var(--text-accent)] transition hover:bg-[var(--surface-bubble)] hover:border-[var(--surface-bubble-border)]";

// ---------------------------------------------------------------------------
// StudyCard
// ---------------------------------------------------------------------------

type StudyCardProps = {
  /** Card title — shown prominently. */
  title: ReactNode;
  /** Link destination. For locked cards, navigation is prevented. */
  href: string;
  /** Surface context determines base CSS class and layout pattern. */
  surface?: CardSurface;
  /** Visual emphasis level. */
  variant?: CardVariant;
  /** Short copy below the title. */
  description?: ReactNode;
  /** Compact meta items (questions count, time estimate, difficulty, etc.) */
  meta?: CardMetaItem[];
  /** Status badge shown in the header row (free, premium, completed, etc.) */
  status?: CardStatus;
  /** Leading icon — displayed in a chip on `hub` surface, inline on `list`/`app`. */
  icon?: LucideIcon;
  /** CTA button label rendered at the bottom of `hub` surface cards. */
  cta?: string;
  /** CTA style: primary (filled) or secondary (outlined). Default: secondary. */
  ctaVariant?: "primary" | "secondary";
  /** Extra content slot rendered at the bottom before the CTA. */
  footer?: ReactNode;
  /** Called when the card link is clicked (for analytics tracking). */
  onClick?: () => void;
  /** Extra classes merged onto the root element. */
  className?: string;
  /** Accessible name when the title alone is not descriptive enough. */
  ariaLabel?: string;
};

// ---------------------------------------------------------------------------
// Hub surface card (whole card is a Link)
// ---------------------------------------------------------------------------

function HubCard({
  title,
  href,
  variant = "default",
  description,
  meta,
  status,
  icon: Icon,
  cta,
  ctaVariant = "secondary",
  footer,
  onClick,
  className = "",
  ariaLabel,
}: StudyCardProps) {
  const isLocked = variant === "locked";
  const cardClass = `${hubCardClass(variant)} ${className}`.trim();
  const ctaClass = ctaVariant === "primary" ? CTA_PRIMARY : CTA_SECONDARY;
  const resolvedLabel = ariaLabel ?? (typeof title === "string" ? title : undefined);

  const inner = (
    <>
      {Icon ? (
        <div className="nn-exam-hub-study-card__icon" aria-hidden>
          <Icon className="h-5 w-5" strokeWidth={1.65} />
        </div>
      ) : null}

      <div className="mt-4 flex items-start justify-between gap-2">
        <span className="nn-marketing-h3 leading-snug">{title}</span>
        {status ? <StatusBadge status={status} size="xs" className="shrink-0" /> : null}
      </div>

      {meta && meta.length > 0 ? (
        <MetaRow items={meta} className="mt-2" />
      ) : null}

      {description ? (
        <span className="nn-marketing-body-sm mt-2 flex-1 text-[var(--theme-body-text)]">{description}</span>
      ) : null}

      {footer ?? null}

      {cta ? (
        <span className={`${ctaClass} pointer-events-none mt-4`} aria-hidden>
          {isLocked ? (
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" aria-hidden />
              {cta}
            </span>
          ) : (
            cta
          )}
        </span>
      ) : null}
    </>
  );

  if (isLocked) {
    return (
      <div
        className={cardClass}
        role="article"
        aria-label={resolvedLabel ? `${resolvedLabel} (locked)` : undefined}
        aria-disabled="true"
        tabIndex={0}
      >
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cardClass}
      aria-label={resolvedLabel}
      onClick={onClick}
    >
      {inner}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// List surface card (article; title is the interactive element)
// ---------------------------------------------------------------------------

function ListCard({
  title,
  href,
  variant = "default",
  description,
  meta,
  status,
  icon: Icon,
  cta,
  ctaVariant = "secondary",
  footer,
  onClick,
  className = "",
  ariaLabel,
}: StudyCardProps) {
  const isLocked = variant === "locked";
  const cardClass = `${listCardClass(variant)} ${className}`.trim();
  const resolvedLabel = ariaLabel ?? (typeof title === "string" ? title : undefined);

  return (
    <article
      className={cardClass}
      aria-label={resolvedLabel ? (isLocked ? `${resolvedLabel} (locked)` : resolvedLabel) : undefined}
    >
      {/* Header row: meta label, optional status badge, optional inline icon */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        {meta && meta.length > 0 ? (
          <MetaRow items={meta} />
        ) : Icon ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--theme-primary)_9%,var(--theme-page-bg))] text-[var(--theme-primary)]">
            <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </span>
        ) : null}
        {status ? <StatusBadge status={status} size="xs" /> : null}
      </div>

      {/* Title — the primary interactive element */}
      <h2 className="nn-marketing-h4 mt-2 leading-snug">
        {isLocked ? (
          <span className="flex items-center gap-1.5 text-[var(--theme-heading-text)]">
            <Lock className="h-3.5 w-3.5 shrink-0 text-[var(--theme-muted-text)]" aria-hidden />
            {title}
          </span>
        ) : (
          <Link
            href={href}
            className="text-[var(--theme-heading-text)] underline-offset-4 transition hover:text-primary hover:underline"
            onClick={onClick}
          >
            {title}
          </Link>
        )}
      </h2>

      {description ? (
        <p className="nn-marketing-body-sm mt-2 line-clamp-3 flex-1 text-[var(--theme-muted-text)]">{description}</p>
      ) : null}

      {footer ?? null}

      {cta ? (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--border-subtle)]/60 pt-4">
          {isLocked ? (
            <span
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[var(--border-medium)] bg-[var(--semantic-panel-muted)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-muted)] opacity-70`}
              aria-disabled="true"
            >
              <Lock className="h-3.5 w-3.5" aria-hidden />
              {cta}
            </span>
          ) : ctaVariant === "primary" ? (
            <Link
              href={href}
              className="inline-flex min-h-10 items-center rounded-full nn-btn-primary px-4 py-2 text-sm font-semibold shadow-none"
              onClick={onClick}
              aria-label={typeof title === "string" ? `${cta}: ${title}` : cta}
            >
              {cta}
            </Link>
          ) : (
            <Link
              href={href}
              className="inline-flex min-h-10 items-center rounded-full nn-btn-secondary px-4 py-2 text-sm font-semibold"
              onClick={onClick}
              aria-label={typeof title === "string" ? `${cta}: ${title}` : cta}
            >
              {cta}
            </Link>
          )}
        </div>
      ) : null}
    </article>
  );
}

// ---------------------------------------------------------------------------
// App surface card (learner app, uses semantic tokens)
// ---------------------------------------------------------------------------

function AppCard({
  title,
  href,
  variant = "default",
  description,
  meta,
  status,
  icon: Icon,
  cta,
  ctaVariant = "secondary",
  footer,
  onClick,
  className = "",
  ariaLabel,
}: StudyCardProps) {
  const isLocked = variant === "locked";
  const isCompleted = variant === "completed";
  const cardClass = `${appCardClass(variant)} ${className}`.trim();
  const resolvedLabel = ariaLabel ?? (typeof title === "string" ? title : undefined);

  const progressAccent = isCompleted
    ? "border-l-[var(--role-success)]"
    : "";

  return (
    <article
      className={`${cardClass} ${progressAccent} border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] shadow-[var(--semantic-shadow-soft)]`}
      aria-label={resolvedLabel ? (isLocked ? `${resolvedLabel} (locked)` : resolvedLabel) : undefined}
    >
      {/* Header */}
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        {Icon ? (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-brand)]">
            <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </span>
        ) : null}
        {status ? <StatusBadge status={status} size="xs" className="ml-auto" /> : null}
      </div>

      {/* Title */}
      <h2 className="font-semibold text-[var(--semantic-text-primary)]">
        {isLocked ? (
          <span className="flex items-center gap-1.5 text-[var(--semantic-text-secondary)]">
            <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {title}
          </span>
        ) : (
          <Link
            href={href}
            className="hover:text-[var(--semantic-brand)] hover:underline"
            onClick={onClick}
          >
            {title}
          </Link>
        )}
      </h2>

      {description ? (
        <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{description}</p>
      ) : null}

      {meta && meta.length > 0 ? (
        <MetaRow items={meta} className="mt-2" />
      ) : null}

      {footer ?? null}

      {cta && !isLocked ? (
        <Link
          href={href}
          className={`mt-3 inline-flex items-center text-sm font-semibold ${ctaVariant === "primary" ? "text-primary hover:underline" : "text-[var(--semantic-brand)] hover:underline"}`}
          onClick={onClick}
          aria-label={typeof title === "string" ? `${cta}: ${title}` : cta}
        >
          {cta}
        </Link>
      ) : null}
    </article>
  );
}

// ---------------------------------------------------------------------------
// Public export
// ---------------------------------------------------------------------------

/**
 * Unified study card for lessons, questions, exam pathways, and CAT surfaces.
 *
 * @example Hub card (pathway overview 3-up grid):
 * ```tsx
 * <StudyCard
 *   surface="hub"
 *   variant="featured"
 *   title="Question Bank"
 *   description="Board-style vignettes with full rationales."
 *   meta={[{ label: "1 200 questions" }, { label: "All topics" }]}
 *   status="premium"
 *   icon={ClipboardList}
 *   href="/us/rn/nclex-rn/questions"
 *   cta="Start practising"
 *   ctaVariant="primary"
 * />
 * ```
 *
 * @example Lesson list card:
 * ```tsx
 * <StudyCard
 *   surface="list"
 *   title="Acid-Base Balance"
 *   href="/us/rn/nclex-rn/lessons/acid-base-balance"
 *   description="Understand pH, buffer systems, and compensation mechanisms."
 *   meta={[{ label: "Fluid & Electrolytes" }, { label: "~12 min" }]}
 *   status="completed"
 *   variant="completed"
 *   cta="Read lesson"
 *   ctaVariant="primary"
 * />
 * ```
 */
export function StudyCard({ surface = "list", ...props }: StudyCardProps) {
  switch (surface) {
    case "hub":
      return <HubCard {...props} />;
    case "app":
      return <AppCard {...props} />;
    default:
      return <ListCard {...props} />;
  }
}
