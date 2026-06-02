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
  /* callout → left-bordered accent panel with bubble surface — clearly themed */
  callout: "nn-callout-accent p-5 sm:p-6",
  /* calloutEmphasis → stronger bubble surface with top border accent */
  calloutEmphasis: "nn-surface-bubble rounded-[1.125rem] border border-[var(--surface-bubble-border)] shadow-[var(--shadow-card)] border-t-2 border-t-[var(--surface-bubble-strong)] p-5 sm:p-6",
  navWash: "nn-study-card nn-study-card--wash p-4",
  /* featuredCard → bubble surface gradient so it visibly shifts between themes */
  featuredCard: "nn-study-card nn-study-card--wash bg-gradient-to-b from-[var(--surface-bubble)] to-[var(--bg-card)] border-[var(--surface-bubble-border)] p-5 sm:p-7",
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
