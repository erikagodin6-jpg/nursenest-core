"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { buildHeroGatewayClusters } from "@/lib/marketing/home-hero-gateway-config";
import type { HeroGatewayLink, NursenestMarketingRegion } from "@/lib/marketing/home-hero-gateway-config";
import { useMarketingI18n } from "@/lib/marketing-i18n";

const GATEWAY_COPY = {
  title: "Choose your path",
  subtitle:
    "Pick a role, then open questions, lessons, or timed exams. Paths follow the region toggle above.",
  regionHint: "links match this region",
  badgePrimary: "Most common entry",
  quickLinks: "Shortcuts",
  frictionNote:
    "Short bank passes and previews run before a full subscription. Longer sessions may ask you to sign in.",
} as const;

type Props = {
  region: NursenestMarketingRegion;
};

export function HomeHeroPathGateway({ region }: Props) {
  const { locale, t } = useMarketingI18n();
  const clusters = buildHeroGatewayClusters(region);

  const localize = (href: string) => (href.startsWith("http") ? href : withMarketingLocale(locale, href));

  const [rn, lpn, np, allied, newGrad] = clusters;

  return (
    <div
      className="mt-8 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/80 p-4 shadow-[var(--shadow-card)] sm:p-6"
      data-testid="hero-path-gateway"
    >
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-[var(--theme-heading-text)] sm:text-lg">{GATEWAY_COPY.title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-[var(--theme-muted-text)]">{GATEWAY_COPY.subtitle}</p>
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted-text)]">
          {region === "US" ? t("home.region.us") : t("home.region.ca")} · {GATEWAY_COPY.regionHint}
        </p>
      </div>

      <div className="rounded-xl border border-[var(--theme-card-border)] bg-card p-4 shadow-sm sm:p-5 lg:grid lg:grid-cols-12 lg:gap-6" data-testid="hero-gateway-nursing">
        <div className="lg:col-span-5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-primary">{GATEWAY_COPY.badgePrimary}</p>
          <h3 className="mt-1 text-lg font-bold text-[var(--theme-heading-text)]">{rn.title}</h3>
          {rn.intro && <p className="mt-2 text-sm text-[var(--theme-muted-text)]">{rn.intro}</p>}
          {rn.primaryCta && (
            <PrimaryCtaButton
              cta={rn.primaryCta}
              localize={localize}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110 sm:w-auto"
              icon="arrow"
            />
          )}
          {rn.primaryCta?.description && (
            <p className="mt-2 text-xs text-[var(--theme-muted-text)]">{rn.primaryCta.description}</p>
          )}
        </div>
        <div className="mt-4 border-t border-[var(--theme-card-border)] pt-4 lg:col-span-7 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="text-xs font-semibold text-[var(--theme-heading-text)]">{GATEWAY_COPY.quickLinks}</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {rn.links.map((link) => (
              <li key={link.id}>
                <GatewayLink link={link} localize={localize} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ClusterCard cluster={lpn} localize={localize} testId="hero-gateway-lpn" />
        <ClusterCard cluster={np} localize={localize} testId="hero-gateway-np" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ClusterCard cluster={allied} localize={localize} testId="hero-gateway-allied" />
        <ClusterCard cluster={newGrad} localize={localize} testId="hero-gateway-newgrad" />
      </div>

      <p className="mt-4 text-center text-xs text-[var(--theme-muted-text)] sm:text-left">{GATEWAY_COPY.frictionNote}</p>
    </div>
  );
}

function ClusterCard({
  cluster,
  localize,
  testId,
}: {
  cluster: ReturnType<typeof buildHeroGatewayClusters>[number];
  localize: (h: string) => string;
  testId: string;
}) {
  return (
    <div
      className="flex min-h-full flex-col rounded-xl border border-[var(--theme-card-border)] bg-card p-4 shadow-sm sm:p-5"
      data-testid={testId}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-[var(--theme-heading-text)]">{cluster.title}</h3>
          {cluster.intro && <p className="mt-1 text-sm text-[var(--theme-muted-text)]">{cluster.intro}</p>}
        </div>
        {cluster.primaryCta && (
          <PrimaryCtaButton
            cta={cluster.primaryCta}
            localize={localize}
            className="inline-flex shrink-0 items-center rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10"
            icon="chevron"
          />
        )}
      </div>
      <ul className="mt-4 grid flex-1 gap-1.5 sm:grid-cols-2">
        {cluster.links.map((link) => (
          <li key={link.id}>
            <GatewayLink link={link} localize={localize} compact />
          </li>
        ))}
      </ul>
    </div>
  );
}

function PrimaryCtaButton({
  cta,
  localize,
  className,
  icon,
}: {
  cta: HeroGatewayLink;
  localize: (h: string) => string;
  className: string;
  icon: "arrow" | "chevron";
}) {
  const external = Boolean(cta.external || cta.href.startsWith("http"));
  const href = external ? cta.href : localize(cta.href);
  const inner = (
    <>
      {cta.label}
      {icon === "arrow" ? <ArrowRight className="ml-2 h-4 w-4" /> : <ChevronRight className="ml-0.5 h-3.5 w-3.5" />}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }
  return <Link href={href} className={className}>{inner}</Link>;
}

function GatewayLink({
  link,
  localize,
  compact,
}: {
  link: { id: string; label: string; href: string; external?: boolean };
  localize: (h: string) => string;
  compact?: boolean;
}) {
  const href = link.external || link.href.startsWith("http") ? link.href : localize(link.href);
  const className = compact
    ? "group flex items-center gap-1 text-sm font-medium text-primary hover:underline"
    : "group flex items-start gap-2 rounded-lg border border-transparent px-2 py-1.5 text-sm font-medium text-[var(--theme-heading-text)] hover:border-[var(--theme-card-border)] hover:bg-[var(--theme-muted-surface)]";

  const inner = (
    <>
      <span className="min-w-0 flex-1">{link.label}</span>
      <ChevronRight className={`shrink-0 text-primary opacity-70 transition group-hover:translate-x-0.5 ${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
    </>
  );

  if (link.external || link.href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
