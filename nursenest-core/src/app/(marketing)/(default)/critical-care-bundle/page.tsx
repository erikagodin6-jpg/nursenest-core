import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, CheckCircle2, Heart, Zap } from "lucide-react";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/critical-care-bundle";
const PAGE_TITLE = "Critical Care Bundle | Advanced ECG + Hemodynamic Monitoring | NurseNest";
const PAGE_DESCRIPTION =
  "Complete ICU/CCU clinical readiness: Advanced ECG Interpretation + Advanced Hemodynamic Monitoring in one bundle. $249 CAD one-time for RN and NP learners — save $49 vs buying separately.";
const SITE_ORIGIN = "https://nursenest.ca";

const BUNDLE_INCLUDES = [
  { label: "Advanced ECG Interpretation", items: ["STEMI localization by territory", "12-lead analysis and axis interpretation", "Complex arrhythmias: VT, VF, WPW, torsades", "Bundle branch blocks, AV blocks, pacemaker rhythms", "Electrolyte and toxicology ECG changes", "200+ strip-based practice questions"] },
  { label: "Advanced Hemodynamic Monitoring", items: ["Swan-Ganz / pulmonary artery catheter", "Cardiac index, SVR, SVV, PAOP/wedge pressure", "Mixed venous oxygen saturation (SvO2)", "Vasopressor selection and titration reasoning", "Fluid responsiveness assessment", "ICU case simulations"] },
];

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${SITE_ORIGIN}${PATH}`,
    alternates: marketingAlternatesSharedPage(PATH, DEFAULT_MARKETING_LOCALE),
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Critical Care Bundle — Advanced ECG + Advanced Hemodynamic Monitoring",
        description: PAGE_DESCRIPTION,
        brand: { "@type": "Brand", name: "NurseNest" },
        offers: {
          "@type": "Offer",
          price: "249",
          priceCurrency: "CAD",
          availability: "https://schema.org/InStock",
          priceValidUntil: "2027-12-31",
          description: "One-time purchase for RN and NP subscribers",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
          { "@type": "ListItem", position: 2, name: "Advanced Hemodynamics", item: `${SITE_ORIGIN}/advanced-hemodynamic-monitoring` },
          { "@type": "ListItem", position: 3, name: "Critical Care Bundle", item: `${SITE_ORIGIN}${PATH}` },
        ],
      },
    ],
  });
}

export default function CriticalCareBundlePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/advanced-hemodynamic-monitoring" className="hover:text-primary">Advanced Hemodynamics</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Critical Care Bundle</span>
      </nav>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold mb-4">
          <Zap className="w-4 h-4" />
          Best value — save $49 CAD vs separate purchases
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
          Critical Care Bundle: Advanced ECG + Advanced Hemodynamic Monitoring
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">{PAGE_DESCRIPTION}</p>
      </div>

      <div className="rounded-2xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-white p-8 mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-3xl font-bold text-gray-900">$249 <span className="text-base font-normal text-gray-500">CAD</span></p>
            <p className="text-sm text-gray-500">One-time · RN &amp; NP only</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-rose-600">Save $49 CAD</p>
            <p className="text-xs text-gray-400">vs $149 + $149 separately</p>
          </div>
        </div>
        <Link
          href="/modules/hemodynamics-advanced#upgrade?bundle=critical-care"
          className="block text-center px-6 py-3.5 rounded-full bg-rose-600 text-white font-semibold hover:brightness-110 transition-all mb-4"
        >
          <Heart className="inline w-4 h-4 mr-2" />
          Get Critical Care Bundle — $249 CAD
        </Link>
        <p className="text-xs text-center text-gray-500">One-time purchase · Requires active RN or NP subscription · Instant access</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        {BUNDLE_INCLUDES.map((section) => (
          <div key={section.label} className="rounded-xl border border-gray-100 bg-white p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500" />
              {section.label}
            </h3>
            <ul className="space-y-1.5">
              {section.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/advanced-ecg-nursing" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">
          Advanced ECG details
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/advanced-hemodynamic-monitoring" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">
          Advanced Hemodynamics details
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}
