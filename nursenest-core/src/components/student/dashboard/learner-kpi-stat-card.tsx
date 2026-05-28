import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

export type LearnerKpiTrend = "up" | "flat" | "down" | null;

export function LearnerKpiStatCard({
  eyebrow,
  title,
  score,
  scoreSuffix,
  interpretation,
  href,
  hrefLabel,
  trend,
  trendLabel,
  accentVar = "var(--semantic-brand)",
  icon,
  progress,
  footer,
  className = "",
}: {
  eyebrow: string;
  title: string;
  score: ReactNode;
  scoreSuffix?: string;
  interpretation?: string;
  href?: string;
  hrefLabel?: string;
  trend?: LearnerKpiTrend;
  trendLabel?: string;
  /** CSS color for --kpi-accent on the card root */
  accentVar?: string;
  icon?: ReactNode;
  progress?: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  const trendClass =
    trend === "up"
      ? "nn-kpi-stat-card__trend nn-kpi-stat-card__trend--up"
      : trend === "down"
        ? "nn-kpi-stat-card__trend nn-kpi-stat-card__trend--down"
        : trend === "flat"
          ? "nn-kpi-stat-card__trend nn-kpi-stat-card__trend--flat"
          : null;

  const TrendIcon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus;

  return (
    <article
      className={`nn-kpi-stat-card min-w-0 min-h-0 ${className}`.trim()}
      style={{ ["--kpi-accent" as string]: accentVar }}
    >
      <div className="nn-kpi-stat-card__head min-w-0">
        {icon ? <div className="nn-kpi-stat-card__icon" aria-hidden>{icon}</div> : null}
        <div className="nn-kpi-stat-card__meta min-w-0">
          <p className="nn-dash-report-eyebrow" style={{ color: accentVar }}>
            {eyebrow}
          </p>
          <p className="mt-1 text-sm font-semibold leading-snug text-[var(--semantic-text-primary)]">{title}</p>
          <div className="nn-kpi-stat-card__score-row">
            <span className="nn-kpi-stat-card__score">{score}</span>
            {scoreSuffix ? <span className="nn-kpi-stat-card__score-suffix">{scoreSuffix}</span> : null}
            {trend && trendLabel ? (
              <span className={trendClass ?? ""}>
                <TrendIcon className="h-3 w-3" aria-hidden />
                {trendLabel}
              </span>
            ) : null}
          </div>
        </div>
      </div>
      {interpretation ? <p className="nn-kpi-stat-card__interpretation nn-dash-report-copy">{interpretation}</p> : null}
      {progress ? <div className="nn-kpi-stat-card__track min-w-0">{progress}</div> : null}
      {footer ? <div className="nn-kpi-stat-card__footer min-w-0">{footer}</div> : null}
      {href && hrefLabel ? (
        <Link
          href={href}
          className="mt-1 inline-flex text-xs font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
        >
          {hrefLabel}
        </Link>
      ) : null}
    </article>
  );
}
