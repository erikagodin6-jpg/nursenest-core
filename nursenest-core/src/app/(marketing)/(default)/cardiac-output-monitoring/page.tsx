import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, BookOpen } from "lucide-react";
import { AcademyBreadcrumbBar } from "@/components/clinical-academy/clinical-academy-chrome";
import { labsClinicalModuleLeafBreadcrumbs } from "@/lib/breadcrumbs/academy-breadcrumbs";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/cardiac-output-monitoring";
const PAGE_TITLE = "Cardiac Output Monitoring for Nurses | Thermodilution, Fick & Non-Invasive Methods | NurseNest";
const PAGE_DESCRIPTION =
  "Cardiac output monitoring for nursing practice and exams. Thermodilution technique, Fick principle, non-invasive CO estimation, cardiac index interpretation, and clinical application in ICU hemodynamic management.";
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
        name: "Cardiac Output Monitoring for Nurses",
        description: PAGE_DESCRIPTION,
        url: `${SITE_ORIGIN}${PATH}`,
        provider: { "@type": "EducationalOrganization", name: "NurseNest", url: SITE_ORIGIN },
        courseMode: "online",
        educationalLevel: "Professional",
      },
],
  });
}

export default function CardiacOutputMonitoringPage() {
  const breadcrumbResolution = labsClinicalModuleLeafBreadcrumbs("Cardiac Output Monitoring", PATH);
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AcademyBreadcrumbBar resolution={breadcrumbResolution} className="mb-8" />
<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
        Cardiac output monitoring: thermodilution, Fick principle, cardiac index, and clinical interpretation
      </h1>
      <p className="text-lg text-gray-600 leading-relaxed mb-10">{PAGE_DESCRIPTION}</p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Cardiac output measurement methods</h2>
        <div className="space-y-4">
          {[
            {
              method: "Thermodilution (PAC gold standard)",
              principle: "Cold saline injected into RA; temperature change measured at PA thermistor. CO inversely proportional to temperature change area.",
              normals: "4–8 L/min; average 3 measurements for accuracy",
              limitations: "Errors: injection technique, timing to respiration, tricuspid regurgitation, intracardiac shunts",
            },
            {
              method: "Fick Principle (oxygen consumption method)",
              principle: "CO = VO2 / (CaO2 − CvO2). Uses measured oxygen consumption and arteriovenous O2 difference. Most accurate in steady state.",
              normals: "Same targets as thermodilution; most accurate with direct VO2 measurement",
              limitations: "Requires arterial and PA blood sampling; assumed VO2 introduces error",
            },
            {
              method: "Non-invasive / minimally invasive",
              principle: "PiCCO (pulse contour analysis + transpulmonary thermodilution), FloTrac/Vigileo (arterial waveform analysis), bioreactance (NICOM), echocardiography.",
              normals: "Validated against thermodilution in hemodynamically stable patients",
              limitations: "Accuracy reduced in arrhythmias, high vasopressor requirements, poor A-line quality",
            },
          ].map((item) => (
            <div key={item.method} className="p-5 rounded-xl border border-gray-100 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-blue-500 shrink-0" />
                <h3 className="font-bold text-gray-900">{item.method}</h3>
              </div>
              <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Principle: </span>{item.principle}</p>
              <p className="text-sm text-emerald-700 mb-1"><span className="font-medium">Values: </span>{item.normals}</p>
              <p className="text-sm text-amber-700"><span className="font-medium">Limitations: </span>{item.limitations}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Cardiac index: normalizing for body size</h2>
        <div className="p-5 rounded-xl border border-blue-100 bg-blue-50">
          <p className="text-sm text-gray-700 mb-2"><strong>CI = CO ÷ BSA</strong> (normal: 2.5–4.0 L/min/m²)</p>
          <p className="text-sm text-gray-600">Cardiac index corrects for body surface area. A CO of 4 L/min is adequate for a 50 kg patient but inadequate for a 100 kg patient. <strong>CI &lt;2.2 L/min/m²</strong> with signs of hypoperfusion defines cardiogenic shock.</p>
        </div>
      </section>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {[
          { href: "/hemodynamic-monitoring", label: "Hemodynamics Fundamentals", desc: "Preload, afterload, MAP, shock (included with RN/NP)" },
          { href: "/advanced-hemodynamic-monitoring", label: "Advanced Hemodynamics", desc: "Swan-Ganz, SVR, PAOP, ICU simulations ($149 add-on)" },
          { href: "/pulmonary-artery-catheter", label: "Pulmonary Artery Catheter", desc: "Swan-Ganz waveforms and parameters" },
          { href: "/shock-and-perfusion", label: "Shock & Perfusion", desc: "Apply CO data to shock management" },
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
