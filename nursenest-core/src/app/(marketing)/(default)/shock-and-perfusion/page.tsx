import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, BookOpen } from "lucide-react";
import { AcademyBreadcrumbBar } from "@/components/clinical-academy/clinical-academy-chrome";
import { labsClinicalModuleLeafBreadcrumbs } from "@/lib/breadcrumbs/academy-breadcrumbs";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/shock-and-perfusion";
const PAGE_TITLE = "Shock & Perfusion for Nurses | Distributive, Cardiogenic, Hypovolemic & Obstructive | NurseNest";
const PAGE_DESCRIPTION =
  "Master shock classification and perfusion assessment for nursing practice and exams. Distributive, cardiogenic, hypovolemic, and obstructive shock — hemodynamic profiles, clinical signs, vasopressor selection, and nursing priorities.";
const SITE_ORIGIN = "https://nursenest.ca";

const SHOCK_TYPES = [
  { name: "Distributive (Septic)", co: "↑ CO", svr: "↓ SVR", paop: "Normal/Low", signs: "Warm periphery, fever, bounding pulse, wide pulse pressure", examples: "Sepsis, anaphylaxis, neurogenic" },
  { name: "Cardiogenic", co: "↓ CO", svr: "↑ SVR", paop: "↑ PAOP", signs: "Cool/mottled extremities, JVD, pulmonary edema, narrow PP", examples: "MI, severe HF, myocarditis" },
  { name: "Hypovolemic", co: "↓ CO", svr: "↑ SVR", paop: "↓ PAOP", signs: "Cool extremities, tachycardia, flat neck veins, low CVP", examples: "Hemorrhage, severe dehydration, burns" },
  { name: "Obstructive", co: "↓ CO", svr: "↑ SVR", paop: "Variable", signs: "PE: hypoxia + RHF; Tamponade: Beck triad; Tension: tracheal shift", examples: "PE, cardiac tamponade, tension pneumothorax" },
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
        "@type": "Course",
        name: "Shock & Perfusion for Nurses",
        description: PAGE_DESCRIPTION,
        url: `${SITE_ORIGIN}${PATH}`,
        provider: { "@type": "EducationalOrganization", name: "NurseNest", url: SITE_ORIGIN },
        courseMode: "online",
        educationalLevel: "Professional",
      },
],
  });
}

export default function ShockAndPerfusionPage() {
  const breadcrumbResolution = labsClinicalModuleLeafBreadcrumbs("Shock & Perfusion", PATH);
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AcademyBreadcrumbBar resolution={breadcrumbResolution} className="mb-8" />
<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
        Shock and perfusion: distributive, cardiogenic, hypovolemic, and obstructive shock
      </h1>
      <p className="text-lg text-gray-600 leading-relaxed mb-10">{PAGE_DESCRIPTION}</p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Shock hemodynamic profiles</h2>
        <div className="space-y-4">
          {SHOCK_TYPES.map((shock) => (
            <div key={shock.name} className="rounded-xl border border-gray-100 bg-white p-5">
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-5 h-5 text-rose-500 shrink-0" />
                <h3 className="font-bold text-gray-900">{shock.name} Shock</h3>
              </div>
              <div className="grid sm:grid-cols-3 gap-3 mb-3">
                <div className="text-center rounded-lg bg-gray-50 p-2">
                  <p className="text-xs text-gray-500 mb-1">Cardiac Output</p>
                  <p className="font-bold text-gray-900">{shock.co}</p>
                </div>
                <div className="text-center rounded-lg bg-gray-50 p-2">
                  <p className="text-xs text-gray-500 mb-1">SVR</p>
                  <p className="font-bold text-gray-900">{shock.svr}</p>
                </div>
                <div className="text-center rounded-lg bg-gray-50 p-2">
                  <p className="text-xs text-gray-500 mb-1">PAOP/Preload</p>
                  <p className="font-bold text-gray-900">{shock.paop}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Signs: </span>{shock.signs}</p>
              <p className="text-sm text-gray-500"><span className="font-medium">Examples: </span>{shock.examples}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Related modules</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { href: "/hemodynamic-monitoring", label: "Hemodynamic Fundamentals", desc: "MAP, preload, afterload, CVP (included with RN/NP)" },
            { href: "/advanced-hemodynamic-monitoring", label: "Advanced Hemodynamics", desc: "Swan-Ganz, cardiac index, vasopressor reasoning ($149 add-on)" },
            { href: "/arterial-line-interpretation", label: "Arterial Line Interpretation", desc: "Waveform analysis, zeroing, troubleshooting" },
            { href: "/ecg-interpretation", label: "ECG Interpretation", desc: "Arrhythmia recognition for shock patients" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:border-primary/30 hover:shadow-sm transition-all">
              <BookOpen className="w-5 h-5 text-primary/70 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">{link.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="flex gap-3">
        <Link href="/modules/hemodynamics" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-semibold text-sm hover:brightness-110">
          Start Hemodynamics Module <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}
