import type { Metadata } from "next";
import Link from "next/link";
import { Activity, AlertTriangle, BookOpen, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/acls-rhythms";
const PAGE_TITLE = "ACLS Rhythms for Nurses — Recognition & Algorithm Integration | NurseNest";
const PAGE_H1 = "ACLS rhythms for nurses: recognition, algorithm integration, and clinical decision-making";
const PAGE_DESCRIPTION =
  "ACLS rhythm recognition for RN and NP nurses: shockable vs non-shockable, VF, pulseless VT, asystole, PEA, defibrillation energy, antiarrhythmic sequencing, and cardioversion indications integrated with ACLS algorithm decision branches.";

const SITE_ORIGIN = "https://nursenest.ca";

const ACLS_RHYTHM_GROUPS = [
  {
    category: "Shockable Arrest Rhythms",
    danger: true,
    rhythms: [
      { name: "Ventricular fibrillation (VF)", action: "Defibrillation 200J biphasic → CPR 2 min → rhythm check" },
      { name: "Pulseless ventricular tachycardia (pVT)", action: "Same algorithm as VF — shock first, CPR immediately after" },
    ],
    note: "Shockable rhythms require immediate defibrillation. VF and pVT are the only rhythms treated with defibrillation in adult ACLS.",
  },
  {
    category: "Non-Shockable Arrest Rhythms",
    danger: true,
    rhythms: [
      { name: "Asystole", action: "CPR + epinephrine 1mg q3–5min + reversible cause search (6Hs/5Ts)" },
      { name: "Pulseless electrical activity (PEA)", action: "CPR + epinephrine + aggressive reversible cause search" },
    ],
    note: "Non-shockable arrest rhythms are treated with CPR, epinephrine, and finding the reversible cause. Do NOT defibrillate asystole or PEA.",
  },
  {
    category: "Peri-Arrest Tachycardias",
    danger: false,
    rhythms: [
      { name: "Unstable narrow-complex tachycardia (SVT, AFib, flutter)", action: "Synchronized cardioversion 50–100J" },
      { name: "Unstable wide-complex tachycardia (suspected VT)", action: "Synchronized cardioversion 100J, escalate" },
      { name: "Stable SVT with narrow QRS", action: "Vagal maneuvers → adenosine 6mg rapid IV push" },
      { name: "Stable wide-complex tachycardia (VT with pulse)", action: "IV amiodarone 150mg/10min → synchronized cardioversion" },
    ],
    note: "For ANY tachycardia with hemodynamic instability (hypotension, altered mentation, pulmonary edema, chest pain with ischemic changes): synchronized cardioversion first.",
  },
  {
    category: "Peri-Arrest Bradycardias",
    danger: false,
    rhythms: [
      { name: "Symptomatic bradycardia with pulse", action: "Atropine 0.5mg IV (up to 3mg total) → transcutaneous pacing → dopamine/epinephrine infusion" },
      { name: "Mobitz II / complete heart block", action: "Prepare for pacing. Atropine unreliable for infranodal block. Transcutaneous pacing while arranging transvenous." },
    ],
    note: "Atropine works for nodal bradycardia (AV node block, vagal). It is unreliable for infranodal block (Mobitz II, CHB) — prepare pacing regardless.",
  },
];

const CLINICAL_PEARLS = [
  "VF vs artifact: ASSESS THE PATIENT first — check responsiveness and pulse before defibrillating",
  "PEA: the ECG alone never diagnoses PEA — a pulse check is mandatory",
  "Adenosine must be given as rapid IV bolus + immediate 20mL NS flush (half-life < 10 seconds)",
  "Synchronized cardioversion prevents R-on-T by delivering shock with QRS peak — not with T wave",
  "After defibrillation: resume CPR IMMEDIATELY — do not pause to check rhythm or pulse",
  "Asystole: confirm in two leads — fine VF can mimic asystole and IS shockable",
  "Epinephrine 1mg IV/IO q3–5min for all pulseless arrest (shockable and non-shockable)",
  "Amiodarone for refractory VF/pVT: 300mg IV bolus first dose, 150mg second dose",
  "Magnesium 2g IV for torsades de pointes — regardless of serum magnesium level",
  "Post-ROSC: avoid hyperoxia (target SpO₂ 94–99%), avoid hypotension (MAP ≥ 65 mmHg)",
];

const FAQ_ITEMS = [
  {
    question: "What is the ACLS algorithm decision point for shockable vs non-shockable?",
    answer:
      "After confirming pulselessness and beginning CPR, the first rhythm check determines the path. If VF or pulseless VT is confirmed: shock (200J biphasic, or 360J monophasic for VF), then resume CPR immediately for 2 minutes, then recheck. If asystole or PEA: NO shock — give epinephrine 1mg IV/IO, continue CPR, and aggressively search for reversible causes (6 Hs: hypovolemia, hypoxia, hydrogen ion/acidosis, hypo/hyperkalemia, hypothermia; 5 Ts: tension pneumothorax, tamponade, toxins, thrombosis-PE, thrombosis-coronary).",
  },
  {
    question: "What does 'synchronized cardioversion' mean and when is it used?",
    answer:
      "Synchronized cardioversion delivers an electrical shock timed to the QRS complex peak (R wave), preventing the shock from landing on the T wave and inducing VF (R-on-T). It is used for tachycardias WITH a pulse that are hemodynamically unstable: unstable SVT, AFib, atrial flutter, and VT with a pulse. It is NOT used for pulseless VT or VF (which requires unsynchronized defibrillation). The defibrillator must be set to 'synchronized' mode — confirm the sync marker is aligning with QRS complexes before delivering the shock.",
  },
  {
    question: "Why is amiodarone used for VF instead of lidocaine?",
    answer:
      "Both amiodarone and lidocaine are acceptable per current ACLS guidelines for shock-refractory VF/pVT. Amiodarone (300mg IV bolus) is generally preferred as first-line because it has broader ionic channel effects and showed modest benefit in VF outcomes versus placebo in major trials. Lidocaine (1.5 mg/kg IV) is an acceptable alternative, particularly when amiodarone is unavailable or when the patient has known structural heart disease where lidocaine may be preferred. Neither drug reliably converts VF — defibrillation remains the definitive treatment.",
  },
  {
    question: "How does NurseNest ECG training prepare me for ACLS rhythms?",
    answer:
      "NurseNest ECG training builds the interpretive foundation that ACLS builds upon. ACLS tells you what to do once a rhythm is identified — NurseNest training develops the skill to identify the rhythm correctly and confidently. The Core ECG module covers rhythm recognition from first principles. The Advanced ECG module includes ACLS-relevant scenarios: VT vs SVT with aberrancy, pulseless vs. pulsed rhythm management, defibrillation indications, and cardioversion decision-making. Both are integrated into your adaptive study loop for targeted weak-area practice.",
  },
  {
    question: "What is the most commonly missed ACLS rhythm on nursing exams?",
    answer:
      "PEA (pulseless electrical activity) is the most commonly misunderstood ACLS rhythm. It presents as an organized ECG rhythm — which novices confuse with a perfusing rhythm. The defining feature of PEA is the ABSENCE of a pulse despite organized electrical activity. The correct response is CPR + epinephrine + reversible cause search — NOT cardioversion, NOT rate control. The second most missed concept: that asystole must be confirmed in two ECG leads before withholding defibrillation, because fine VF (which IS shockable) can appear flat in a single lead.",
  },
];

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
          "ACLS rhythms nursing",
          "ACLS rhythm recognition",
          "shockable vs non-shockable rhythms",
          "VF VT ACLS nursing",
          "PEA asystole ACLS",
          "defibrillation cardioversion nursing",
          "ACLS algorithm nursing",
          "cardiac arrest rhythms RN",
        ],
        openGraph: {
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          type: "website",
          url: `${SITE_ORIGIN}${PATH}`,
        },
      };
    },
    {
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      robots: { index: true, follow: true },
    },
  );
}

export default function AclsRhythmsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "NurseNest", item: SITE_ORIGIN },
          { "@type": "ListItem", position: 2, name: "ECG Interpretation", item: `${SITE_ORIGIN}/ecg` },
          { "@type": "ListItem", position: 3, name: "ACLS Rhythms", item: `${SITE_ORIGIN}${PATH}` },
        ],
      },
      {
        "@type": "Course",
        name: "ACLS Rhythms for Nurses",
        description: PAGE_DESCRIPTION,
        provider: { "@type": "Organization", name: "NurseNest", url: SITE_ORIGIN },
        hasCourseInstance: { "@type": "CourseInstance", courseMode: "online" },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 flex items-center gap-2 text-xs text-[var(--semantic-text-muted)]" aria-label="Breadcrumb">
        <Link href="/ecg" className="hover:text-[var(--semantic-brand)]">ECG Interpretation</Link>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <span className="text-[var(--semantic-text-primary)] font-medium">ACLS Rhythms</span>
      </nav>

      <header className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-danger)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_06%,var(--semantic-surface))] px-3 py-1 text-xs font-semibold text-[var(--semantic-danger)]">
          <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
          ACLS Critical Rhythms
        </div>
        <h1 className="mb-4 text-3xl font-bold leading-tight text-[var(--semantic-text-primary)] sm:text-4xl">
          {PAGE_H1}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-[var(--semantic-text-secondary)]">
          ACLS rhythm recognition is the foundation of cardiac arrest management. This page covers
          shockable vs non-shockable arrest rhythms, peri-arrest tachycardias and bradycardias,
          and the clinical decision points that connect ECG recognition to ACLS algorithm branches.
        </p>
      </header>

      {/* Rhythm groups */}
      <section className="mb-12 space-y-6" aria-labelledby="acls-rhythms-heading">
        <h2 id="acls-rhythms-heading" className="text-2xl font-bold text-[var(--semantic-text-primary)]">
          ACLS rhythm categories and immediate actions
        </h2>
        {ACLS_RHYTHM_GROUPS.map((group) => (
          <div
            key={group.category}
            className={`rounded-2xl border p-5 ${group.danger ? "border-[color-mix(in_srgb,var(--semantic-danger)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_03%,var(--semantic-surface))]" : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]"}`}
          >
            <h3 className="mb-3 font-bold text-[var(--semantic-text-primary)]">{group.category}</h3>
            <ul className="mb-3 space-y-2">
              {group.rhythms.map((r) => (
                <li key={r.name} className="text-sm">
                  <span className="font-semibold text-[var(--semantic-text-primary)]">{r.name}: </span>
                  <span className="text-[var(--semantic-text-secondary)]">{r.action}</span>
                </li>
              ))}
            </ul>
            <p className="rounded-lg bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))] px-3 py-2 text-xs italic text-[var(--semantic-text-secondary)]">
              {group.note}
            </p>
          </div>
        ))}
      </section>

      {/* Clinical pearls */}
      <section className="mb-12" aria-labelledby="pearls-heading">
        <h2 id="pearls-heading" className="mb-4 text-2xl font-bold text-[var(--semantic-text-primary)]">
          High-yield ACLS clinical pearls
        </h2>
        <ul className="space-y-2">
          {CLINICAL_PEARLS.map((pearl) => (
            <li key={pearl} className="flex items-start gap-2.5 text-sm text-[var(--semantic-text-secondary)]">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-warning-contrast)]" aria-hidden />
              {pearl}
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="mb-12" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="mb-6 text-2xl font-bold text-[var(--semantic-text-primary)]">
          Frequently asked questions — ACLS rhythms
        </h2>
        <div className="space-y-5">
          {FAQ_ITEMS.map((faq) => (
            <div key={faq.question} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
              <h3 className="mb-2 font-semibold text-[var(--semantic-text-primary)]">{faq.question}</h3>
              <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Internal links */}
      <section className="mb-10" aria-labelledby="related-heading">
        <h2 id="related-heading" className="mb-4 text-lg font-semibold text-[var(--semantic-text-primary)]">
          Related ECG topics
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/ecg", label: "ECG Hub" },
            { href: "/telemetry-nursing", label: "Telemetry Nursing" },
            { href: "/pals-rhythms", label: "PALS Rhythms" },
            { href: "/advanced-ecg-nursing/acls-rhythms", label: "Advanced ACLS ECG" },
            { href: "/ecg/ventricular-tachycardia", label: "Ventricular Tachycardia" },
            { href: "/advanced-ecg-nursing/critical-care-ecg", label: "Critical Care ECG" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-sm font-medium text-[var(--semantic-brand)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_06%,var(--semantic-surface))]">
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-[var(--role-cta)] p-6" aria-labelledby="cta-heading">
        <h2 id="cta-heading" className="mb-2 text-xl font-bold text-[var(--role-cta-foreground)]">
          Practice ACLS rhythm recognition
        </h2>
        <p className="mb-5 text-sm text-[color-mix(in_srgb,var(--role-cta-foreground)_80%,transparent)]">
          Strip-based ACLS rhythm questions with mechanism-based rationales. Included with eligible RN and NP subscriptions.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/modules/ecg/basic/lessons" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--role-cta)] shadow-sm">
            <BookOpen className="h-4 w-4" aria-hidden />
            ECG Lessons
          </Link>
          <Link href="/modules/ecg/basic/quizzes" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white">
            <Activity className="h-4 w-4" aria-hidden />
            ACLS Strip Drills
          </Link>
        </div>
      </section>
    </main>
  );
}
