"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { buildHeroGatewayClusters } from "@/lib/marketing/home-hero-gateway-config";
import type { HeroGatewayLink, NursenestMarketingRegion } from "@/lib/marketing/home-hero-gateway-config";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";

type Props = {
  region: NursenestMarketingRegion;
};

export function HomeHeroPathGateway({ region }: Props) {
  const { locale, t } = useMarketingI18n();
  const clusters = buildHeroGatewayClusters(region);

  const localize = (href: string) => (href.startsWith("http") ? href : withMarketingLocale(locale, href));

  const [rn, lpn, np, allied, newGrad] = clusters;
  const regionLabel = region === "US" ? t("home.region.us") : t("home.region.ca");
  const regionHint = t("home.gateway.regionHint").trim();
  const regionMeta = [regionLabel.trim(), regionHint].filter(Boolean).join(" · ");
  const frictionNote = t("home.gateway.frictionNote").trim();

  return (
    <div
      className="mt-8 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/80 p-4 shadow-[var(--shadow-card)] sm:p-6"
      data-testid="hero-path-gateway"
    >
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-[var(--theme-heading-text)] sm:text-lg">{t("home.gateway.title")}</h2>
          <p className="mt-1 max-w-2xl text-sm text-[var(--theme-muted-text)]">{t("home.gateway.subtitle")}</p>
        </div>
        {regionMeta ? (
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted-text)]">{regionMeta}</p>
        ) : null}
      </div>

      <div className="rounded-xl border border-[var(--theme-card-border)] bg-card p-4 shadow-sm sm:p-5 lg:grid lg:grid-cols-12 lg:gap-6" data-testid="hero-gateway-nursing">
        <div className="lg:col-span-5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-primary">{t("home.gateway.badgePrimary")}</p>
          <h3 className="mt-1 text-lg font-bold text-[var(--theme-heading-text)]">{t(rn.titleKey)}</h3>
          {rn.introKey ? <p className="mt-2 text-sm text-[var(--theme-muted-text)]">{t(rn.introKey)}</p> : null}
          {rn.primaryCta && (
            <PrimaryCtaButton
              clusterId="nursing"
              region={region}
              cta={rn.primaryCta}
              label={t(rn.primaryCta.labelKey)}
              localize={localize}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110 sm:w-auto"
              icon="arrow"
            />
          )}
          {rn.primaryCta?.descriptionKey ? (
            <p className="mt-2 text-xs text-[var(--theme-muted-text)]">{t(rn.primaryCta.descriptionKey)}</p>
          ) : null}
        </div>
        <div className="mt-4 border-t border-[var(--theme-card-border)] pt-4 lg:col-span-7 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="text-xs font-semibold text-[var(--theme-heading-text)]">{t("home.gateway.quickLinks")}</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {rn.links.map((link) => (
              <li key={link.id}>
                <GatewayLink clusterId="nursing" region={region} link={link} localize={localize} t={t} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ClusterCard cluster={lpn} localize={localize} testId="hero-gateway-lpn" region={region} t={t} />
        <ClusterCard cluster={np} localize={localize} testId="hero-gateway-np" region={region} t={t} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ClusterCard cluster={allied} localize={localize} testId="hero-gateway-allied" region={region} t={t} />
        <ClusterCard cluster={newGrad} localize={localize} testId="hero-gateway-newgrad" region={region} t={t} />
      </div>

      {frictionNote ? (
        <p className="mt-4 text-center text-xs text-[var(--theme-muted-text)] sm:text-left">{frictionNote}</p>
      ) : null}
    </div>
  );
}

function ClusterCard({
  cluster,
  localize,
  testId,
  region,
  t,
}: {
  cluster: ReturnType<typeof buildHeroGatewayClusters>[number];
  localize: (h: string) => string;
  testId: string;
  region: NursenestMarketingRegion;
  t: (key: string) => string;
}) {
  return (
    <div
      className="flex min-h-full flex-col rounded-xl border border-[var(--theme-card-border)] bg-card p-4 shadow-sm sm:p-5"
      data-testid={testId}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-[var(--theme-heading-text)]">{t(cluster.titleKey)}</h3>
          {cluster.introKey ? <p className="mt-1 text-sm text-[var(--theme-muted-text)]">{t(cluster.introKey)}</p> : null}
        </div>
        {cluster.primaryCta && (
          <PrimaryCtaButton
            clusterId={cluster.id}
            region={region}
            cta={cluster.primaryCta}
            label={t(cluster.primaryCta.labelKey)}
            localize={localize}
            className="inline-flex shrink-0 items-center rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10"
            icon="chevron"
          />
        )}
      </div>
      <ul className="mt-4 grid flex-1 gap-1.5 sm:grid-cols-2">
        {cluster.links.map((link) => (
          <li key={link.id}>
            <GatewayLink clusterId={cluster.id} region={region} link={link} localize={localize} compact t={t} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function PrimaryCtaButton({
  clusterId,
  region,
  cta,
  localize,
  className,
  icon,
  label,
}: {
  clusterId: string;
  region: NursenestMarketingRegion;
  cta: HeroGatewayLink;
  localize: (h: string) => string;
  className: string;
  icon: "arrow" | "chevron";
  label: string;
}) {
  const external = Boolean(cta.external || cta.href.startsWith("http"));
  const href = external ? cta.href : localize(cta.href);
  const track = () =>
    trackClientEvent(PH.marketingPathGatewayPrimaryCta, {
      cluster_id: clusterId,
      cta_id: cta.id,
      region,
      external,
    });
  const inner = (
    <>
      {label}
      {icon === "arrow" ? <ArrowRight className="ml-2 h-4 w-4" /> : <ChevronRight className="ml-0.5 h-3.5 w-3.5" />}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={track}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={track}>
      {inner}
    </Link>
  );
}

function GatewayLink({
  clusterId,
  region,
  link,
  localize,
  compact,
  t,
}: {
  clusterId: string;
  region: NursenestMarketingRegion;
  link: HeroGatewayLink;
  localize: (h: string) => string;
  compact?: boolean;
  t: (key: string) => string;
}) {
  const href = link.external || link.href.startsWith("http") ? link.href : localize(link.href);
  const track = () =>
    trackClientEvent(PH.marketingPathGatewayLinkClick, {
      cluster_id: clusterId,
      link_id: link.id,
      region,
    });
  const className = compact
    ? "group flex items-center gap-1 text-sm font-medium text-primary hover:underline"
    : "group flex items-start gap-2 rounded-lg border border-transparent px-2 py-1.5 text-sm font-medium text-[var(--theme-heading-text)] hover:border-[var(--theme-card-border)] hover:bg-[var(--theme-muted-surface)]";

  const inner = (
    <>
      <span className="min-w-0 flex-1">{t(link.labelKey)}</span>
      <ChevronRight className={`shrink-0 text-primary opacity-70 transition group-hover:translate-x-0.5 ${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
    </>
  );

  if (link.external || link.href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={track}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={track}>
      {inner}
    </Link>
  );
}
