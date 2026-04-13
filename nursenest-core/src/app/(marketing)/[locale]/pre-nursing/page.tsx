import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { PreNursingAccountCapture } from "@/components/pre-nursing/pre-nursing-account-capture";
import { PreNursingLandingClient } from "@/components/pre-nursing/pre-nursing-landing-client";
import { PreNursingMilestoneStrip } from "@/components/pre-nursing/pre-nursing-milestone-strip";
import { PreNursingNextStepsBlock } from "@/components/pre-nursing/pre-nursing-next-steps-block";
import { PreNursingSurfaceAnalytics } from "@/components/pre-nursing/pre-nursing-surface-analytics";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import strings from "@/content/pre-nursing/pre-nursing-strings-en.json";
import { preNursingHubBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const revalidate = 86400;

type Props = { params: Promise<{ locale: string }> };

const EN_TITLE = "Free Pre-Nursing foundations for nursing school | NurseNest";
const EN_DESCRIPTION =
  "Free interactive Pre-Nursing modules: anatomy, chemistry, infection control, communication & more. No subscription required. Optional readiness target and a clear path to paid NCLEX/RPN/NP prep when you're ready.";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();
  return safeGenerateMetadata(
    async () => {
      let msgs: Record<string, string> = {};
      try {
        msgs = await loadMarketingMessages(locale);
      } catch {
        /* fallback to English below */
      }
      const title = msgs["preNursing.hub.metaTitle"] ?? EN_TITLE;
      const description = msgs["preNursing.hub.metaDescription"] ?? EN_DESCRIPTION;
      const alt = marketingAlternatesSharedPage(locale, "/pre-nursing");
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        openGraph: { title, description, url: alt.canonical, type: "website" },
        twitter: { card: "summary_large_image", title, description },
      };
    },
    { pathname: `/${locale}/pre-nursing`, locale, routeGroup: "marketing.locale.pre_nursing" },
  );
}

export default async function LocalizedPreNursingPage({ params }: Props) {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();

  let msgs: Record<string, string> = {};
  try {
    msgs = await loadMarketingMessages(locale);
  } catch {
    /* fallback to English strings below */
  }

  const dict = strings as Record<string, string>;
  const { crumbs, schemaItems } = preNursingHubBreadcrumbs();

  const pageTitle = msgs["preNursing.hub.metaTitle"] ?? EN_TITLE;
  const pageDescription = msgs["preNursing.hub.metaDescription"] ?? EN_DESCRIPTION;

  const l = (href: string) => withMarketingLocale(locale, href);

  return (
    <div className="nn-marketing-surface">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <PreNursingSurfaceAnalytics surface="hub" />
        <WebPageJsonLd
          title={pageTitle}
          description={pageDescription}
          path={`/${locale}/pre-nursing`}
          inLanguage={locale}
        />
        <BreadcrumbJsonLd items={schemaItems} />
        <div className="mb-8">
          <BreadcrumbTrail items={crumbs} />
        </div>

        <PreNursingMilestoneStrip sourceSurface="hub" />
        <PreNursingLandingClient />
        <PreNursingAccountCapture sourceSurface="hub" />
        <PreNursingNextStepsBlock sourceSurface="hub" />

        <section className="mt-16 border-t border-border pt-12">
          <h2 className="text-2xl font-bold text-[var(--theme-heading-text)]">
            {msgs["preNursing.hub.whatItIs.heading"] ?? "What Pre-Nursing is"}
          </h2>
          <p className="mt-3 max-w-3xl text-muted">
            {msgs["preNursing.hub.whatItIs.body"] ??
              "NurseNest Pre-Nursing is a free, structured library of interactive modules (anatomy, chemistry, infection control, communication, and more) so you can strengthen prerequisites and habits before you invest in full NCLEX or RPN exam prep."}
          </p>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">
              {msgs["preNursing.hub.whoItsFor.heading"] ?? "Who it's for"}
            </h3>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted">
              <li>{msgs["preNursing.hub.whoItsFor.li1"] ?? "Students preparing to apply to nursing programs"}</li>
              <li>{msgs["preNursing.hub.whoItsFor.li2"] ?? "Anyone refreshing sciences before clinical coursework"}</li>
              <li>{msgs["preNursing.hub.whoItsFor.li3"] ?? "Learners who want structured foundations without a paywall"}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">
              {msgs["preNursing.hub.whatsNext.heading"] ?? "What happens next"}
            </h3>
            <p className="mt-3 text-sm text-muted">
              {msgs["preNursing.hub.whatsNext.body"] ??
                "When you're ready, NurseNest offers paid exam pathways with full question banks, mocks, and lessons aligned to NCLEX-RN, practical nursing (NCLEX-PN in the US or REx-PN in Canada), and NP tracks."}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
              <Link href={l("/pricing")} className="text-primary hover:underline">
                {msgs["preNursing.hub.whatsNext.viewPlans"] ?? "View plans"}
              </Link>
              <Link href={l("/lessons")} className="text-primary hover:underline">
                {msgs["preNursing.hub.whatsNext.lessonHubs"] ?? "Exam lesson hubs"}
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">
            {msgs["preNursing.hub.quickLinks.heading"] ?? "Quick links"}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
            <li>
              <Link href={l("/pre-nursing/lessons")} className="text-primary hover:underline">
                {msgs["preNursing.hub.quickLinks.allLessons"] ?? "All lessons (paginated)"}
              </Link>
            </li>
            <li>
              <Link href={l("/pre-nursing/study-plan")} className="text-primary hover:underline">
                {msgs["preNursing.hub.quickLinks.studyPlan"] ?? "Study planning"}
              </Link>
            </li>
            <li>
              <Link href={l("/tools/med-math")} className="text-primary hover:underline">
                {msgs["preNursing.hub.quickLinks.medMath"] ?? "Med math tools"}
              </Link>
            </li>
            <li>
              <Link href={l("/signup")} className="text-primary hover:underline">
                {dict["preNursing.explorePlans"] ?? msgs["preNursing.hub.quickLinks.createAccount"] ?? "Create account"}
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
