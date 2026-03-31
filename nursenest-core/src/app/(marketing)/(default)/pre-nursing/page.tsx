import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { PreNursingLandingClient } from "@/components/pre-nursing/pre-nursing-landing-client";
import strings from "@/content/pre-nursing/pre-nursing-strings-en.json";
import { preNursingHubBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { absoluteUrl } from "@/lib/seo/site-origin";

const dict = strings as Record<string, string>;

export const revalidate = 86400;

const title = "Free Pre-Nursing foundations for nursing school | NurseNest";
const description =
  "Free interactive Pre-Nursing modules: anatomy, chemistry, infection control, communication & more. No subscription required. Optional readiness target and a clear path to paid NCLEX/RPN/NP prep when you’re ready.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/pre-nursing") },
  openGraph: {
    title,
    description,
    url: absoluteUrl("/pre-nursing"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function PreNursingLandingPage() {
  const { crumbs, schemaItems } = preNursingHubBreadcrumbs();

  return (
    <div className="nn-marketing-surface">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <BreadcrumbJsonLd items={schemaItems} />
        <div className="mb-8">
          <BreadcrumbTrail items={crumbs} />
        </div>

        <PreNursingLandingClient />

        <section className="mt-16 border-t border-border pt-12">
          <h2 className="text-2xl font-bold text-[var(--theme-heading-text)]">What Pre-Nursing is</h2>
          <p className="mt-3 max-w-3xl text-muted">
            NurseNest Pre-Nursing is a free, structured library of interactive modules — anatomy, chemistry, infection
            control, communication, and more — so you can strengthen prerequisites and habits before you invest in full NCLEX
            or RPN exam prep.
          </p>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">Who it’s for</h3>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted">
              <li>Students preparing to apply to nursing programs</li>
              <li>Anyone refreshing sciences before clinical coursework</li>
              <li>Learners who want structured foundations without a paywall</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">What happens next</h3>
            <p className="mt-3 text-sm text-muted">
              When you’re ready, NurseNest offers paid exam pathways with full question banks, mocks, and lessons aligned to
              NCLEX-RN, NCLEX-PN, REX-PN, and NP tracks — the same product family, with entitlements that match your
              subscription.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
              <Link href="/pricing" className="text-primary hover:underline">
                View plans
              </Link>
              <Link href="/exam-lessons" className="text-primary hover:underline">
                Exam lesson hubs
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">Quick links</h3>
          <ul className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
            <li>
              <Link href="/pre-nursing/lessons" className="text-primary hover:underline">
                All lessons (paginated)
              </Link>
            </li>
            <li>
              <Link href="/pre-nursing/study-plan" className="text-primary hover:underline">
                Study planning
              </Link>
            </li>
            <li>
              <Link href="/tools/med-math" className="text-primary hover:underline">
                Med math tools
              </Link>
            </li>
            <li>
              <Link href="/signup" className="text-primary hover:underline">
                {dict["preNursing.explorePlans"] ?? "Create account"}
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
