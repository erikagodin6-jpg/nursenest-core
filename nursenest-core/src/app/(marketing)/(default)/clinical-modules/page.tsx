import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, FlaskConical, Stethoscope, Zap } from "lucide-react";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/clinical-modules";
const PAGE_TITLE = "Clinical Modules — ECG, Labs & Specialty Nursing | NurseNest";
const PAGE_H1 = "Clinical specialty modules for RN and NP learners";
const PAGE_DESCRIPTION =
  "Advanced ECG interpretation, lab values mastery, and clinical scenarios for registered nurses and nurse practitioners. Specialty modules that integrate with your NurseNest study loop.";

const SITE_ORIGIN = "https://nursenest.ca";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, PATH);
      return {
        title: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: true, follow: true },
        keywords: [
          "clinical nursing modules",
          "advanced ECG nursing module",
          "ECG interpretation course nurses",
          "lab values nursing module",
          "specialty nursing training",
          "cardiac rhythm mastery",
          "NurseNest clinical modules",
          "RN specialty modules",
          "NP clinical modules",
        ],
        openGraph: {
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          url: alt.canonical,
          type: "website",
          siteName: "NurseNest",
        },
        twitter: {
          card: "summary_large_image",
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
        },
      };
    },
    { pathname: PATH, locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.clinicalModules" },
  );
}

const MODULES = [
  {
    icon: Activity,
    accent: "var(--semantic-chart-1)",
    eyebrow: "Featured · Advanced Add-On",
    title: "Advanced ECG Interpretation & Cardiac Rhythm Mastery",
    description:
      "200+ strip-based ECG questions across nine clinical tracks: 12-lead analysis, VT vs SVT differentiation, STEMI equivalents, heart blocks, pacemaker malfunction, electrolyte ECG changes, toxicology patterns, and ACLS-integrated decision-making. Designed for RN and NP learners in telemetry, ICU, CCU, ER, and cardiac settings.",
    features: [
      "Brugada algorithm for WCT (VT vs SVT)",
      "STEMI equivalents: posterior, De Winter, Wellens",
      "Mobitz I vs Mobitz II — clinical urgency",
      "Hyperkalemia / hypokalemia ECG progression",
      "Pacemaker malfunction: capture, sensing, PMT",
      "Toxicology: TCA, digoxin, QT prolongation",
      "ACLS-integrated ECG decision pathways",
      "Advanced ECG clinical case simulations",
    ],
    primaryCta: { label: "Open Advanced ECG Module", href: "/modules/ecg-advanced" },
    secondaryCta: { label: "ECG Mastery guide", href: "/advanced-ecg-nursing" },
    learnMore: "/advanced-ecg-nursing",
    featured: true,
    targetAudience: "RN, NP — separate paid add-on",
  },
  {
    icon: Zap,
    accent: "var(--semantic-info)",
    eyebrow: "Core Module · Included",
    title: "ECG Basics — Rhythm Recognition & Telemetry Foundations",
    description:
      "Core ECG curriculum for RN and NP learners: sinus rhythms, atrial arrhythmias (AFib, flutter, SVT), AV blocks, ventricular rhythms, paced rhythms, and electrolyte effects. Included with eligible base subscriptions.",
    features: [
      "Sinus rhythms and rate variants",
      "Atrial fibrillation and flutter recognition",
      "AV conduction blocks (first through complete)",
      "VT, VF, and ventricular ectopy",
      "Basic pacemaker interpretation",
      "Strip quizzes with rationale review",
      "Printable ECG worksheets",
    ],
    primaryCta: { label: "Start Basic ECG Lessons", href: "/modules/ecg/basic/lessons" },
    secondaryCta: { label: "ECG interpretation overview", href: "/ecg-interpretation" },
    learnMore: "/ecg-interpretation",
    featured: false,
    targetAudience: "RN, NP — included with base subscription",
  },
  {
    icon: FlaskConical,
    accent: "var(--semantic-chart-3)",
    eyebrow: "Clinical Tool · Free Access",
    title: "Lab Values Reference & Clinical Interpretation",
    description:
      "Interactive lab values reference covering critical values, clinical context, and nursing implications across chemistry, hematology, coagulation, and cardiac panels. Free access for all learners.",
    features: [
      "Critical lab value thresholds",
      "Chemistry panel interpretation",
      "Hematology: CBC differential",
      "Coagulation: INR, PTT, anti-Xa",
      "Cardiac: troponin, BNP, CK-MB",
      "Arterial blood gas interpretation",
    ],
    primaryCta: { label: "Open Lab Values", href: "/tools/lab-values" },
    secondaryCta: { label: "All clinical tools", href: "/tools" },
    learnMore: "/tools/lab-values",
    featured: false,
    targetAudience: "All learners — free access",
  },
  {
    icon: Stethoscope,
    accent: "var(--semantic-warning)",
    eyebrow: "Coming 2026",
    title: "Clinical Scenarios & OSCE Simulations",
    description:
      "Case-based clinical scenarios and OSCE-format simulations for RN and NP learners. Complex multi-system cases integrating assessment, diagnostic reasoning, prioritization, and documentation within nursing scope.",
    features: [
      "Complex multi-system patient cases",
      "OSCE-format clinical stations",
      "NP autonomous practice scenarios",
      "Diagnostic reasoning integration",
      "Priority intervention decision-making",
    ],
    primaryCta: { label: "View Clinical Scenarios", href: "/case-studies" },
    secondaryCta: null,
    learnMore: "/case-studies",
    featured: false,
    targetAudience: "RN, NP — check availability",
  },
];

export default function ClinicalModulesPage() {
  const breadcrumbs = [
    { name: "NurseNest", href: "/" },
    { name: "Clinical Modules", href: PATH },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_ORIGIN}${PATH}`,
        url: `${SITE_ORIGIN}${PATH}`,
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        inLanguage: "en",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbs.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: `${SITE_ORIGIN}${c.href}`,
          })),
        },
      },
      {
        "@type": "ItemList",
        name: "NurseNest Clinical Specialty Modules",
        description: PAGE_DESCRIPTION,
        itemListElement: MODULES.map((m, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: m.title,
          url: `${SITE_ORIGIN}${m.learnMore}`,
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--semantic-text-muted)]">
            {breadcrumbs.map((c, i) => (
              <li key={c.href} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden>/</span>}
                {i < breadcrumbs.length - 1 ? (
                  <Link href={c.href} className="hover:underline">{c.name}</Link>
                ) : (
                  <span className="text-[var(--semantic-text-secondary)]">{c.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-10 space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-4xl">
            {PAGE_H1}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--semantic-text-secondary)]">
            {PAGE_DESCRIPTION}
          </p>
        </header>

        {/* Module cards */}
        <section aria-labelledby="modules-heading" className="mb-12">
          <h2 id="modules-heading" className="sr-only">Available clinical specialty modules</h2>
          <div className="space-y-6">
            {MODULES.map((mod) => {
              const Icon = mod.icon;
              const accentBorder = `border-[color-mix(in_srgb,${mod.accent}_22%,var(--semantic-border-soft))]`;
              const accentBg = `bg-[color-mix(in_srgb,${mod.accent}_05%,var(--semantic-surface))]`;
              const accentIcon = `text-[${mod.accent}]`;
              const accentIconBg = `bg-[color-mix(in_srgb,${mod.accent}_10%,var(--semantic-panel-muted))]`;
              const accentIconBorder = `border-[color-mix(in_srgb,${mod.accent}_20%,var(--semantic-border-soft))]`;

              return (
                <article
                  key={mod.title}
                  className={`rounded-2xl border p-5 sm:p-6 shadow-[var(--semantic-shadow-soft)] ${accentBorder} ${accentBg} ${mod.featured ? "ring-1 ring-[color-mix(in_srgb,var(--semantic-chart-1)_30%,transparent)]" : ""}`}
                  aria-labelledby={`module-${mod.title.replace(/\s+/g, "-").toLowerCase()}`}
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    {/* Icon + eyebrow */}
                    <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
                      <span
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border ${accentIconBorder} ${accentIconBg}`}
                        style={{ color: mod.accent }}
                        aria-hidden
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                        {mod.eyebrow}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <h3
                        id={`module-${mod.title.replace(/\s+/g, "-").toLowerCase()}`}
                        className="text-lg font-semibold text-[var(--semantic-text-primary)]"
                      >
                        <Link href={mod.learnMore} className="hover:underline">
                          {mod.title}
                        </Link>
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                        {mod.description}
                      </p>

                      {/* Feature list */}
                      <ul className="mt-3 grid gap-1 sm:grid-cols-2" aria-label={`${mod.title} features`}>
                        {mod.features.map((f) => (
                          <li key={f} className="flex items-start gap-1.5 text-xs text-[var(--semantic-text-secondary)]">
                            <span
                              className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ background: mod.accent }}
                              aria-hidden
                            />
                            {f}
                          </li>
                        ))}
                      </ul>

                      {/* Audience */}
                      <p className="mt-3 text-[11px] font-medium text-[var(--semantic-text-muted)]">
                        For: {mod.targetAudience}
                      </p>

                      {/* CTAs */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          href={mod.primaryCta.href}
                          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-[var(--role-cta-foreground)] shadow-sm"
                          style={{ background: mod.accent }}
                        >
                          {mod.primaryCta.label}
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                        </Link>
                        {mod.secondaryCta ? (
                          <Link
                            href={mod.secondaryCta.href}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2 text-sm font-medium text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-surface-alt)]"
                          >
                            {mod.secondaryCta.label}
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Navigation strip */}
        <nav aria-label="Related resources" className="border-t border-[var(--semantic-border-soft)] pt-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
            Related resources
          </p>
          <ul className="flex flex-wrap gap-2">
            {[
              { href: "/advanced-ecg-nursing", label: "Advanced ECG Mastery" },
              { href: "/ecg-interpretation", label: "ECG Interpretation" },
              { href: "/ecg-telemetry-mastery", label: "Telemetry Mastery" },
              { href: "/tools", label: "Clinical Tools" },
              { href: "/tools/lab-values", label: "Lab Values" },
              { href: "/case-studies", label: "Clinical Case Studies" },
              { href: "/modules/ecg", label: "ECG Module Hub" },
              { href: "/modules/ecg-advanced", label: "Advanced ECG Add-On" },
              { href: "/us/rn/nclex-rn/lessons", label: "NCLEX-RN Lessons" },
              { href: "/canada/np/cnple/lessons", label: "CNPLE Lessons" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-medium text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-text-primary)]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </>
  );
}
