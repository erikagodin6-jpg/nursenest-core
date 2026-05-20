import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { buildAlliedGlobalHubPath, isAlliedHealthPathway } from "@/lib/allied/allied-global-pathway";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { pathwayPricingBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 86400;

type Props = { params: Promise<{ locale: string; slug: string; examCode: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}`;
  const pricingPath = `${pathname}/pricing`;
  return safeGenerateMetadata(
    async () => {
      const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname: pricingPath });
      if (!pathway) return {};
      const canonicalPath = buildExamPathwayPath(pathway, "pricing");
      const canonical = absoluteUrl(canonicalPath);
      const title = `Pricing · ${pathway.displayName} | NurseNest`;
      const description = `Plans for ${pathway.shortName} on NurseNest (${pathway.countryCode}). Checkout uses tier ${pathway.stripeTier} with content scoped to this pathway.`;
      return {
        title,
        description,
        alternates: { canonical },
        openGraph: { title, description, url: canonical, type: "website" },
      };
    },
    { pathname: pricingPath, locale, routeGroup: "marketing.exam_hub.pricing" },
  );
}

export default async function ExamPathwayPricingPage({ params }: Props) {
  const { locale, slug, examCode } = await params;
  const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname: `/${locale}/${slug}/${examCode}/pricing` });
  if (!pathway) notFound();
  if (isAlliedHealthPathway(pathway)) {
    permanentRedirect(buildAlliedGlobalHubPath("pricing"));
  }

  const [messages, fallbackMessages] = await Promise.all([
    loadMarketingMessages(locale).catch(() => ({} as Record<string, string>)),
    loadMarketingMessages(DEFAULT_MARKETING_LOCALE).catch(() => ({} as Record<string, string>)),
  ]);
  const t = (key: string, fallback: string) => messages[key] ?? fallbackMessages[key] ?? fallback;
  const { crumbs, schemaItems } = pathwayPricingBreadcrumbs(pathway);
  const waitlist = pathway.acquisitionMode === "waitlist" || pathway.status === "upcoming";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} navClassName="nn-marketing-caption text-[var(--theme-muted-text)]" />
      <Link href={buildExamPathwayPath(pathway)} className="text-sm font-medium text-primary hover:underline">
        ← {pathway.shortName} {t("pages.pricing.pathwayPage.backOverviewSuffix", "overview")}
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-[var(--theme-heading-text)]">
        {t("pages.pricing.pathwayPage.headingPrefix", "Plans for")} {pathway.displayName}
      </h1>
      <p className="mt-3 text-[var(--theme-muted-text)]">
        {waitlist
          ? t(
              "pages.pricing.pathwayPage.waitlistBody",
              "Pricing for this pathway will open when the exam offering is finalized. Join the waitlist or explore another active track in the meantime.",
            )
          : t(
              "pages.pricing.pathwayPage.scopeBodyTemplate",
              `Checkout uses the ${pathway.stripeTier} subscription tier for ${pathway.countryCode}. This pricing route is for ${pathway.shortName} only, so content stays scoped to this pathway instead of unlocking unrelated roles or countries.`,
            )
              .replace("{{tier}}", pathway.stripeTier)
              .replace("{{country}}", pathway.countryCode)
              .replace("{{pathway}}", pathway.shortName)}
      </p>

      {waitlist ? (
        <div className="mt-8 space-y-4">
          <Link
            href="/signup"
            className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            {t("pages.pricing.pathwayPage.waitlistCta", "Join the waitlist")}
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          <p className="text-sm text-muted">
            {t(
              "pages.pricing.pathwayPage.checkoutLeadPrefix",
              "Stripe checkout uses",
            )}{" "}
            <strong className="text-foreground">{t("pages.pricing.pathwayPage.countryTierLabel", "country + tier")}</strong>
            . {t("pages.pricing.pathwayPage.chooseLabel", "Choose")}{" "}
            <strong className="text-foreground">{pathway.stripeTier}</strong> {t("pages.pricing.pathwayPage.withBillingCountry", "with billing country")}{" "}
            <strong className="text-foreground">{pathway.countryCode}</strong>.{" "}
            {t(
              "pages.pricing.pathwayPage.checkoutBodySuffix",
              "After payment, your NurseNest profile tier and country update from that plan so lessons, questions, flashcards, and exams match this pathway.",
            )}
          </p>
          <Link
            href="/pricing"
            className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            {t("pages.pricing.pathwayPage.checkoutCta", "Continue to pricing and confirm this pathway")}
          </Link>
        </div>
      )}
    </div>
  );
}
