import Link from "next/link";
import { notFound } from "next/navigation";
import { getExamPathwayByRoute } from "@/lib/exam-pathways/exam-product-registry";

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ locale: string; slug: string; examCode: string }> };

export default async function ExamPathwayPricingPage({ params }: Props) {
  const { locale, slug, examCode } = await params;
  const pathway = getExamPathwayByRoute(locale, slug, examCode);
  if (!pathway) notFound();

  const waitlist = pathway.acquisitionMode === "waitlist" || pathway.status === "upcoming";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href={`/${pathway.countrySlug}/${pathway.roleTrack}/${pathway.examCode}`} className="text-sm font-medium text-primary hover:underline">
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
