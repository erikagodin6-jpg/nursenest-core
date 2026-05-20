import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, BookOpen } from "lucide-react";
import { AcademyBreadcrumbBar } from "@/components/clinical-academy/clinical-academy-chrome";
import { labsClinicalModuleLeafBreadcrumbs } from "@/lib/breadcrumbs/academy-breadcrumbs";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/arterial-line-interpretation";
const PAGE_TITLE = "Arterial Line Interpretation for Nurses | Waveform Analysis, Zeroing & Troubleshooting | NurseNest";
const PAGE_DESCRIPTION =
  "Master arterial line interpretation for nursing practice: normal A-line waveform morphology, dicrotic notch significance, dampening patterns, zeroing and leveling technique, pulse pressure variation, and clinical troubleshooting.";
const SITE_ORIGIN = "https://nursenest.ca";

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
        name: "Arterial Line Interpretation for Nurses",
        description: PAGE_DESCRIPTION,
        url: `${SITE_ORIGIN}${PATH}`,
        provider: { "@type": "EducationalOrganization", name: "NurseNest", url: SITE_ORIGIN },
        courseMode: "online",
        educationalLevel: "Professional",
      },
],
  });
}

export default function ArterialLineInterpretationPage() {
  const breadcrumbResolution = labsClinicalModuleLeafBreadcrumbs("Arterial Line Interpretation", PATH);
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AcademyBreadcrumbBar resolution={breadcrumbResolution} className="mb-8" />
<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
        Arterial line interpretation: waveform analysis, zeroing, and troubleshooting
      </h1>
      <p className="text-lg text-gray-600 leading-relaxed mb-10">{PAGE_DESCRIPTION}</p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Normal A-line waveform components</h2>
        <div className="space-y-3">
          {[
            { label: "Systolic peak", desc: "Rapid upstroke from ventricular ejection — corresponds to systolic BP" },
            { label: "Dicrotic notch", desc: "Brief dip following aortic valve closure — marks end of systole; absent/dampened in aortic insufficiency" },
            { label: "Diastolic runoff", desc: "Gradual decline as blood flows to periphery — corresponds to diastolic BP" },
            { label: "Pulse pressure", desc: "Systolic − diastolic; narrow PP = low stroke volume; wide PP = distributive shock or aortic insufficiency" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white">
              <Activity className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Troubleshooting abnormal waveforms</h2>
        <div className="space-y-3">
          {[
            { label: "Over-dampened", desc: "Low-amplitude, rounded trace — causes: air bubble, clot, kink, loose connection. Over-reads diastolic, under-reads systolic." },
            { label: "Under-dampened (resonant)", desc: "Exaggerated systolic spike, false-high systolic — causes: stiff tubing, incorrect fluid column. Check fast-flush square wave test." },
            { label: "Loss of dicrotic notch", desc: "Suggests poor peripheral vascular tone, aortic regurgitation, or over-dampening." },
            { label: "Pulsus paradoxus on A-line", desc: ">10 mmHg systolic drop with inspiration — suggests cardiac tamponade, severe COPD, or tension pneumothorax." },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-xl border border-amber-100 bg-amber-50">
              <p className="font-semibold text-amber-900 text-sm mb-1">{item.label}</p>
              <p className="text-sm text-amber-800">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {[
          { href: "/hemodynamic-monitoring", label: "Hemodynamic Fundamentals", desc: "MAP, CVP, preload, shock states" },
          { href: "/advanced-hemodynamic-monitoring", label: "Advanced Hemodynamics", desc: "Swan-Ganz, SVR, PAOP, SvO2" },
          { href: "/shock-and-perfusion", label: "Shock & Perfusion", desc: "Shock classification and treatment" },
          { href: "/ecg-interpretation", label: "ECG Interpretation", desc: "Rhythm recognition for ICU" },
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

      <Link href="/modules/hemodynamics" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-semibold text-sm hover:brightness-110">
        Practice in Hemodynamics Module <ArrowRight className="w-4 h-4" />
      </Link>
    </main>
  );
}
