import type { ElementType, HTMLAttributes } from "react";

/**
 * Presentational shells for marketing pathway lesson hubs — **composition only**.
 * Pathway-specific copy, paywall, and layout order stay in each hub component.
 */
export type PathwayHubSectionKind =
  | "card"
  | "cardWash"
  | "callout"
  /** PN hub: bordered / shadow callout surface */
  | "calloutEmphasis"
  | "navWash"
  /** Featured lesson strip (gradient card) */
  | "featuredCard";

const KIND_CLASS: Record<PathwayHubSectionKind, string> = {
  card: "nn-study-card p-5 sm:p-6",
  cardWash: "nn-study-card nn-study-card--wash p-5 sm:p-6",
  callout: "nn-study-callout p-5 sm:p-6",
  calloutEmphasis:
    "nn-study-callout border-[var(--border-subtle)] p-5 sm:p-6 shadow-[var(--shadow-card)]",
  navWash: "nn-study-card nn-study-card--wash p-4",
  featuredCard: "nn-study-card bg-gradient-to-b from-[var(--bg-card)] to-[var(--nn-presentation-wash)] p-5 sm:p-7",
};

export type PathwayHubSectionProps = {
  kind: PathwayHubSectionKind;
  /** Use `nav` for anchor jump strips; default `section`. */
  as?: "section" | "nav";
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "className">;

export function PathwayHubSection({ kind, as, className, ...rest }: PathwayHubSectionProps) {
  const Comp = (as ?? "section") as ElementType;
  const merged = [KIND_CLASS[kind], className].filter(Boolean).join(" ");
  return <Comp className={merged} {...rest} />;
}
