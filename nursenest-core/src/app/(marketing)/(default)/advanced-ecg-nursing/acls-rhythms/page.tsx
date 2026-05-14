import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, CheckCircle2 } from "lucide-react";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/advanced-ecg-nursing/acls-rhythms";
const PAGE_TITLE = "ACLS Rhythms for Nurses — Shockable vs Non-Shockable, Emergency ECG Interpretation | NurseNest";
const PAGE_H1 = "ACLS rhythms and emergency ECG interpretation for RN, ICU, ER, and critical care nurses";
const PAGE_DESCRIPTION =
  "Clinician-reviewed ACLS rhythm training for nurses. Shockable vs non-shockable identification, cardioversion thresholds, post-ROSC ECG interpretation, antiarrhythmic decision-making, transcutaneous pacing, and code blue rhythm management.";

const PILLAR = "/advanced-ecg-nursing";

const SECTIONS = [
  {
    id: "shockable-vs-non-shockable",
    heading: "Shockable vs non-shockable rhythms: the critical ACLS decision that cannot be delayed",
    body: `The first rhythm analysis in a cardiac arrest determines whether electrical therapy — defibrillation — is the immediate priority. This decision must be made in seconds, not minutes. The two shockable rhythms are ventricular fibrillation (VF) and pulseless ventricular tachycardia (pVT). The two non-shockable rhythms are pulseless electrical activity (PEA) and asystole. Delivering a shock to a non-shockable rhythm wastes critical time. Failing to shock a shockable rhythm during the first two minutes of arrest dramatically reduces survival probability.

Ventricular fibrillation is the chaotic, disorganized ventricular rhythm in which the myocardium quivers without coordinated contraction. On the monitor, VF produces irregular high-amplitude waveforms with no discernible QRS complexes. The waveform amplitude degrades from coarse to fine VF over minutes — fine VF can be confused with artifact or asystole on a poorly calibrated monitor. Immediate high-energy unsynchronized defibrillation (200J biphasic or 360J monophasic for adults) followed by immediate CPR is the intervention.

Pulseless ventricular tachycardia appears on the monitor as an organized wide-complex tachycardia — regular, wide QRS complexes at a rapid rate — but produces no palpable pulse. The absence of pulse distinguishes pVT from hemodynamically stable VT. The management is identical to VF: unsynchronized defibrillation. Synchronized cardioversion is not used for pulseless VT because synchronization requires time and a detectable R wave, and the patient is in cardiac arrest.

PEA — pulseless electrical activity — is defined by organized or semi-organized electrical activity on the monitor with no corresponding palpable pulse. PEA can mimic normal sinus rhythm, bradycardia, or any organized rhythm. The key teaching point: the ECG never tells you whether a pulse is present. In any patient with altered consciousness on a monitor, pulse confirmation by palpation cannot be skipped. PEA management focuses on identifying and treating reversible causes — the Hs and Ts: hypovolemia, hypoxia, hydrogen ion (acidosis), hypo/hyperkalemia, hypothermia; tension pneumothorax, tamponade, toxins, thrombosis (pulmonary or coronary).`,
  },
  {
    id: "cardioversion-defibrillation",
    heading: "Cardioversion vs defibrillation: clinical criteria and energy selection",
    body: `Defibrillation and synchronized cardioversion are both electrical interventions, but the clinical criteria, energy selection, and synchronization settings are distinct. Confusing them — particularly using synchronized cardioversion when defibrillation is required — can cause the shock to be delayed while the device searches for an R-wave in a patient with no organized rhythm, a potentially fatal delay.

Defibrillation delivers a high-energy unsynchronized shock to terminate chaotic ventricular rhythms. It is used for VF and pulseless VT. There is no synchronization because VF has no R wave to detect, and pulseless VT management must not be delayed. Energy: 200J biphasic for initial shock (150–200J for biphasic devices; 360J for monophasic devices). CPR resumes immediately after shock delivery without checking the rhythm.

Synchronized cardioversion delivers a shock timed to the R wave of the QRS complex, avoiding delivery during the relative refractory period (T wave) when myocardium is vulnerable to R-on-T triggering VF. Synchronized cardioversion is used for hemodynamically unstable tachyarrhythmias: unstable SVT, unstable Afib/Aflutter, and stable monomorphic VT that has not responded to antiarrhythmics. Energy for cardioversion starts lower: Afib typically 120–200J biphasic; Aflutter often converts with 50–100J; SVT may require 50–100J.

Transcutaneous pacing (TCP) is the emergency intervention for hemodynamically significant bradycardia that does not respond to atropine. Indications: symptomatic sinus bradycardia, complete heart block, and Mobitz II with hemodynamic compromise. Pacing rate is typically set to 60–80 bpm initially. The capture threshold is determined by gradually increasing milliamps until electrical capture (pacer spike followed by wide QRS) and mechanical capture (palpable pulse for every pacer spike) are confirmed. Patient sedation and analgesia should be considered immediately after establishing capture.`,
  },
  {
    id: "post-rosc-ecg",
    heading: "Post-ROSC ECG interpretation: the 12-lead priorities after return of spontaneous circulation",
    body: `Return of spontaneous circulation (ROSC) initiates a new clinical phase with distinct ECG priorities. The post-resuscitation ECG serves several functions: identifying a shockable rhythm that could precipitate rearrest, screening for acute coronary occlusion that requires emergent cath lab activation, establishing a baseline for targeted temperature management monitoring, and identifying pharmacologic causes of the arrest that manifest as ECG abnormalities.

Acute STEMI identification in the post-ROSC ECG triggers urgent cath lab activation according to most institutional protocols, regardless of whether the patient is comatose. Current evidence supports emergent coronary angiography for comatose survivors of VF arrest without an obvious non-cardiac cause of arrest. The post-ROSC 12-lead ECG is the tool that initiates this time-sensitive decision.

QT interval prolongation in the post-ROSC period can result from hypothermia during targeted temperature management (TTM), antiarrhythmic medications administered during resuscitation (amiodarone, lidocaine), electrolyte disturbances secondary to cardiac arrest physiology, or underlying cardiac disease. Monitoring QTc during TTM is critical because bradycardia from cooling and QT-prolonging medications used during resuscitation create additive risk for torsades de pointes during the post-resuscitation period.

Ischemic ECG changes post-ROSC that do not meet full STEMI criteria may still represent acute coronary disease requiring intervention. The decision framework considers the arrest rhythm (VF suggests coronary etiology), clinical context, serial ECG changes, and hemodynamic stability alongside the ECG findings. A single post-ROSC ECG is never the sole determinant — serial 12-leads, troponin trajectory, and bedside echocardiography inform the emergent angiography decision collaboratively.`,
  },
  {
    id: "antiarrhythmic-integration",
    heading: "Antiarrhythmic integration in ACLS: amiodarone, lidocaine, and adenosine decision points",
    body: `Antiarrhythmic pharmacology in ACLS follows a specific sequence logic tied to the rhythm and response. Nurses in code blue situations must understand both the indication and the expected response to guide real-time management decisions.

Amiodarone is the first-line antiarrhythmic for VF/pulseless VT refractory to defibrillation after two shocks. The dose is 300 mg IV push followed by 150 mg IV push if VF/pVT persists. After ROSC, a 150 mg IV infusion over 10 minutes followed by 1 mg/min for 6 hours is the maintenance approach. Amiodarone affects sodium, potassium, and calcium channels, and also has beta-blocking and calcium channel–blocking properties — its mechanism explains why it can cause hypotension and bradycardia, both of which must be anticipated after ROSC.

Lidocaine is an acceptable alternative to amiodarone for refractory VF/pulseless VT when amiodarone is unavailable. Initial dose is 1–1.5 mg/kg IV push. Lidocaine's sodium channel blockade prolongs the action potential refractory period in ventricular myocardium. Lidocaine does not have the same vasodilatory effects as amiodarone, which is advantageous in hypotensive post-arrest states.

Adenosine is the antiarrhythmic of choice for SVT — it works by transiently blocking AV node conduction, terminating reentrant rhythms that depend on AV node participation. The dose is 6 mg IV push followed by a 20 mL saline flush; if unsuccessful after 1–2 minutes, 12 mg IV push is the second dose. Adenosine is diagnostically useful even when it does not terminate the tachycardia — the transient AV block reveals the underlying atrial activity (flutter waves, P-wave morphology) that was obscured by the tachycardia rate.`,
  },
];

const FAQ_ITEMS = [
  {
    question: "What are the shockable rhythms in ACLS?",
    answer:
      "The two shockable rhythms are ventricular fibrillation (VF) and pulseless ventricular tachycardia (pulseless VT). Both receive unsynchronized high-energy defibrillation immediately — 200J biphasic for adults. The two non-shockable rhythms are pulseless electrical activity (PEA) and asystole, which are managed with CPR and identification of reversible causes (Hs and Ts). The shockable/non-shockable decision must be made within seconds of rhythm analysis.",
  },
  {
    question: "When do nurses use synchronized cardioversion vs defibrillation?",
    answer:
      "Defibrillation is unsynchronized and used for VF and pulseless VT — both require immediate shock without waiting for R-wave synchronization. Synchronized cardioversion is used for hemodynamically unstable tachyarrhythmias where the patient still has a pulse: unstable SVT, unstable Afib/Aflutter, and unstable monomorphic VT with a pulse. Synchronization prevents delivering the shock during the T-wave (vulnerable period). Never use synchronized cardioversion for pulseless VT or VF — the synchronization delay is dangerous.",
  },
  {
    question: "What does the post-ROSC ECG screen for?",
    answer:
      "The post-ROSC 12-lead ECG screens for three primary concerns: (1) STEMI or STEMI equivalent that requires emergent cath lab activation — even in comatose patients, acute coronary occlusion is actionable. (2) QT prolongation from antiarrhythmics, electrolyte abnormalities, or hypothermia during TTM — monitors torsades risk during the post-arrest period. (3) Residual ischemic changes that, combined with arrest rhythm (VF suggests coronary etiology), troponin trends, and echo findings, inform the angiography decision.",
  },
  {
    question: "How does transcutaneous pacing work in ACLS?",
    answer:
      "Transcutaneous pacing (TCP) is emergency external pacing using adhesive electrodes delivering electrical pulses through the chest wall to stimulate ventricular depolarization. It is indicated for symptomatic bradycardia unresponsive to atropine. Set the rate (60–80 bpm) and start at maximum output, then reduce until you identify electrical capture (pacer spike followed by wide QRS) and verify mechanical capture by palpating pulse. The most common failure is not increasing output enough. TCP is painful — analgesia and sedation should follow capture establishment immediately.",
  },
];

const RELATED_LINKS = [
  { href: PILLAR, label: "Advanced ECG for Nurses" },
  { href: "/advanced-ecg-nursing/rhythm-practice", label: "Rhythm Practice Lab" },
  { href: "/advanced-ecg-nursing/12-lead-stemi", label: "12-Lead STEMI Interpretation" },
  { href: "/advanced-ecg-nursing/critical-care-ecg", label: "Critical Care ECG" },
  { href: "/advanced-ecg-nursing/medication-induced-ecg-changes", label: "Medication-Induced ECG Changes" },
  { href: "/advanced-ecg-nursing/ecg-case-simulations", label: "ECG Case Simulations" },
  { href: "/ecg-telemetry-mastery", label: "ECG Telemetry Mastery" },
];

const COVERAGE_ITEMS = [
  "VF recognition: coarse vs fine, defibrillation energy sequence",
  "Pulseless VT: wide-complex organized vs VF, same treatment",
  "PEA: organized rhythm without pulse, Hs and Ts framework",
  "Asystole: confirmation in two leads, CPR and reversible causes",
  "Defibrillation: 200J biphasic, immediate CPR after shock",
  "Synchronized cardioversion: unstable SVT, Afib, monomorphic VT",
  "Transcutaneous pacing: capture confirmation, analgesia priority",
  "Post-ROSC 12-lead: STEMI screen, QT monitoring, cath lab decision",
  "Amiodarone: 300mg push for refractory VF/pVT, maintenance dose",
  "Lidocaine: alternative to amiodarone, 1–1.5 mg/kg IV push",
  "Adenosine: SVT termination, diagnostic AV block, 6mg → 12mg",
  "Atropine: symptomatic bradycardia, 0.5mg up to 3mg maximum",
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
          "shockable rhythms nursing",
          "ACLS ECG interpretation",
          "defibrillation cardioversion nursing",
          "post ROSC ECG nursing",
          "code blue rhythm management",
          "antiarrhythmic ACLS nursing",
          "transcutaneous pacing nursing",
          "emergency ECG nursing",
          "VF pulseless VT nursing",
        ],
        openGraph: {
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          url: alt.canonical,
          type: "article",
          siteName: "NurseNest",
        },
        twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESCRIPTION },
      };
    },
    { pathname: PATH, locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.advancedEcgAclsRhythms" },
  );
}

export default function AclsRhythmsPage() {
  const breadcrumbs = [
    { name: "NurseNest", href: "/" },
    { name: "ECG Interpretation", href: "/ecg-interpretation" },
    { name: "Advanced ECG for Nurses", href: PILLAR },
    { name: "ACLS Rhythms", href: PATH },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://nursenest.io${PATH}`,
        url: `https://nursenest.io${PATH}`,
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        headline: PAGE_H1,
        inLanguage: "en",
        author: { "@type": "Organization", name: "NurseNest" },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbs.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: `https://nursenest.io${c.href}`,
          })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
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

        <header className="mb-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))] text-[var(--semantic-warning)]">
              <Activity className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
              ECG Mastery · ACLS + Emergency ECG
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-4xl">
            {PAGE_H1}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--semantic-text-secondary)]">{PAGE_DESCRIPTION}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/modules/ecg-advanced"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--role-cta)] px-5 py-2.5 text-sm font-semibold text-[var(--role-cta-foreground)] shadow-[0_2px_10px_var(--role-cta-shadow)]"
            >
              Practice ACLS Rhythms
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href={PILLAR}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-surface-alt)]"
            >
              Advanced ECG hub
            </Link>
          </div>
        </header>

        <article className="mb-10 space-y-10 text-[var(--semantic-text-secondary)]">
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id}>
              <h2 className="mb-4 text-xl font-semibold text-[var(--semantic-text-primary)]">{section.heading}</h2>
              <div className="space-y-4">
                {section.body.split("\n\n").map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed">{para}</p>
                ))}
              </div>
            </section>
          ))}
        </article>

        <section className="mb-10 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_18%,var(--semantic-surface))] p-5 sm:p-6">
          <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">ACLS rhythm coverage at a glance</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {COVERAGE_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-[var(--semantic-text-secondary)]">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--semantic-warning)]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10 space-y-4">
          <h2 className="text-xl font-semibold text-[var(--semantic-text-primary)]">Frequently asked questions</h2>
          <dl className="space-y-3">
            {FAQ_ITEMS.map((f) => (
              <div key={f.question} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
                <dt className="text-sm font-semibold text-[var(--semantic-text-primary)]">{f.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <nav aria-label="Related pages" className="border-t border-[var(--semantic-border-soft)] pt-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">ECG mastery ecosystem</p>
          <ul className="flex flex-wrap gap-2">
            {RELATED_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-medium text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-text-primary)]">
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
