import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, BookOpen, Lock } from "lucide-react";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/pulmonary-artery-catheter";
const PAGE_TITLE = "Pulmonary Artery Catheter for Nurses | Swan-Ganz Waveforms & PAOP Interpretation | NurseNest";
const PAGE_DESCRIPTION =
  "Pulmonary artery catheter (Swan-Ganz) interpretation for nurses: insertion waveform progression, PAOP/wedge pressure, cardiac output thermodilution, mixed venous oxygen saturation, and clinical application in cardiogenic and septic shock.";
const SITE_ORIGIN = "https://nursenest.ca";

const WAVEFORM_PROGRESSION = [
  { location: "Right atrium (RA)", waveform: "Low-amplitude a-wave, c-wave, v-wave pattern; mean ~2–8 mmHg" },
  { location: "Right ventricle (RV)", waveform: "High systolic, near-zero diastolic; systolic matches PA systolic; no diastolic plateau" },
  { location: "Pulmonary artery (PA)", waveform: "Diastolic notch appears — distinguishes PA from RV; diastolic plateau present" },
  { location: "Wedge position (PAOP)", waveform: "Low-pressure a and v waves; balloon inflated, tip occludes PA; reflects LVEDP when MV is open" },
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
        name: "Pulmonary Artery Catheter (Swan-Ganz) for Nurses",
        description: PAGE_DESCRIPTION,
        url: `${SITE_ORIGIN}${PATH}`,
        provider: { "@type": "EducationalOrganization", name: "NurseNest", url: SITE_ORIGIN },
        courseMode: "online",
        educationalLevel: "Advanced",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
          { "@type": "ListItem", position: 2, name: "Advanced Hemodynamics", item: `${SITE_ORIGIN}/advanced-hemodynamic-monitoring` },
          { "@type": "ListItem", position: 3, name: "Pulmonary Artery Catheter", item: `${SITE_ORIGIN}${PATH}` },
        ],
      },
    ],
  });
}

export default function PulmonaryArteryCatheterPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/advanced-hemodynamic-monitoring" className="hover:text-primary">Advanced Hemodynamics</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Pulmonary Artery Catheter</span>
      </nav>

      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold mb-6">
        <Lock className="w-4 h-4" />
        Advanced Hemodynamics add-on — $149 CAD one-time
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
        Pulmonary artery catheter (Swan-Ganz): insertion waveforms, PAOP interpretation, and clinical application
      </h1>
      <p className="text-lg text-gray-600 leading-relaxed mb-10">{PAGE_DESCRIPTION}</p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Insertion waveform progression</h2>
        <div className="space-y-3">
          {WAVEFORM_PROGRESSION.map((stage) => (
            <div key={stage.location} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white">
              <Activity className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">{stage.location}</p>
                <p className="text-sm text-gray-600">{stage.waveform}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Key parameters and normal values</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { param: "RA pressure (CVP)", normal: "2–8 mmHg", clinical: "Elevated = RV failure, tamponade, fluid overload" },
            { param: "RV systolic", normal: "15–25 mmHg", clinical: "Elevated = pulmonary hypertension, PE" },
            { param: "PA systolic / diastolic", normal: "15–25 / 8–15 mmHg", clinical: "Pulmonary HTN if PA systolic >25 at rest" },
            { param: "PAOP (wedge)", normal: "≤18 mmHg", clinical: ">18 = cardiogenic pulmonary edema; <6 = hypovolemia" },
            { param: "Cardiac output (CO)", normal: "4–8 L/min", clinical: "Low CO + elevated PAOP = cardiogenic shock" },
            { param: "Cardiac index (CI)", normal: "2.5–4.0 L/min/m²", clinical: "<2.2 with hypoperfusion = cardiogenic shock threshold" },
            { param: "SVR", normal: "800–1200 dynes·sec/cm⁵", clinical: "Low = distributive; High = cardiogenic or hypovolemic" },
            { param: "SvO2", normal: "65–75%", clinical: "<60% = high extraction (low CO); >80% = distributive/poor utilization" },
          ].map((item) => (
            <div key={item.param} className="p-3 rounded-xl border border-gray-100 bg-white">
              <p className="font-semibold text-gray-900 text-sm">{item.param}</p>
              <p className="text-xs font-medium text-emerald-700 mt-0.5">Normal: {item.normal}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.clinical}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {[
          { href: "/advanced-hemodynamic-monitoring", label: "Advanced Hemodynamics Overview", desc: "$149 CAD add-on — full ICU simulation curriculum" },
          { href: "/hemodynamic-monitoring", label: "Hemodynamics Fundamentals", desc: "Included with RN/NP — preload, afterload, MAP" },
          { href: "/shock-and-perfusion", label: "Shock & Perfusion", desc: "Apply PAC data to shock management" },
          { href: "/cardiac-output-monitoring", label: "Cardiac Output Monitoring", desc: "Thermodilution, Fick principle, non-invasive methods" },
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

      <Link href="/advanced-hemodynamic-monitoring" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 text-white font-semibold text-sm hover:brightness-110">
        Get Advanced Hemodynamics — $149 CAD <ArrowRight className="w-4 h-4" />
      </Link>
    </main>
  );
}
