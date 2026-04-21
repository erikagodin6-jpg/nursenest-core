import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
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
      const pathway = resolveExamPathwaySafe(locale, slug, examCode, { pathname: pricingPath });
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
  const pathway = resolveExamPathwaySafe(locale, slug, examCode, { pathname: `/${locale}/${slug}/${examCode}/pricing` });
  if (!pathway) notFound();

  const { crumbs, schemaItems } = pathwayPricingBreadcrumbs(pathway);
  const waitlist = pathway.acquisitionMode === "waitlist" || pathway.status === "upcoming";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} navClassName="nn-marketing-caption text-[var(--theme-muted-text)]" />
      <Link href={buildExamPathwayPath(pathway)} className="text-sm font-medium text-primary hover:underline">
        ← {pathway.shortName} overview
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-[var(--theme-heading-text)]">Plans for {pathway.displayName}</h1>
      <p className="mt-3 text-[var(--theme-muted-text)]">
        {waitlist
          ? "Pricing for this pathway will open when the exam offering is finalized. Join the waitlist or explore other active tracks."
          : `Checkout uses the ${pathway.stripeTier} subscription tier for ${pathway.countryCode} with content scoped to ${pathway.shortName}, not shared with other roles or countries.`}
      </p>

      {waitlist ? (
        <div className="mt-8 space-y-4">
          <Link
            href="/signup"
            className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Join waitlist (sign up)
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          <p className="text-sm text-muted">
            Stripe checkout uses <strong className="text-foreground">country + tier</strong>. Choose{" "}
            <strong className="text-foreground">{pathway.stripeTier}</strong> with billing country{" "}
            <strong className="text-foreground">{pathway.countryCode}</strong>. After payment, your NurseNest profile tier and
            country update from that plan so lessons, questions, and exams match this pathway.
          </p>
          <Link
            href="/pricing"
            className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Continue to plans & checkout
          </Link>
        </div>
      )}
    </div>
  );
}
