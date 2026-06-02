import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { buildFaqStructuredData, buildCourseStructuredData } from "@/lib/structured-data";
import { useState } from "react";
import {
  ArrowRight, BookOpen, FileText, Brain, Shield, CheckCircle2,
  ChevronDown, Stethoscope, Activity, Sparkles, ClipboardCheck,
  Award, TrendingUp, DollarSign, GraduationCap, Heart,
  AlertTriangle, Scissors, Users, Clock, Target, Layers,
  ShieldCheck, Syringe, HeartPulse, ListChecks, Thermometer,
} from "lucide-react";
import { EndOfContentLeadCapture } from "@/components/lead-capture";

import { useI18n } from "@/lib/i18n";
function FAQItem({ q, a }: { q: string; a: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-0" data-testid={`faq-item-${q.slice(0, 20).replace(/\s/g, "-").toLowerCase()}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left font-medium text-gray-900 hover:text-teal-700 transition-colors"
        data-testid="button-faq-toggle"
      >
        <span>{q}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="pb-4 text-gray-600 leading-relaxed">{a}</p>}
    </div>
  );
}

function InternalLinkCard({ href, title, desc, icon: Icon }: { href: string; title: string; desc: string; icon: any }) {
  return (
    <Link href={href}>
      <div className="p-5 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group" data-testid={`link-card-${title.slice(0, 20).replace(/\s/g, "-").toLowerCase()}`}>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
            <Icon className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{desc}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

const PERIOPERATIVE_NURSING_FAQS = [
  { q: "What is perioperative nursing?", a: "Perioperative nursing encompasses the care of patients throughout the surgical experience — preoperative, intraoperative, and postoperative phases. Perioperative nurses (OR nurses) are responsible for patient assessment, surgical safety protocols, sterile technique, and coordinating care among the surgical team." },
  { q: "What certifications are available for perioperative nurses?", a: "The primary certification is the CNOR (Certified Perioperative Nurse) offered by the Competency & Credentialing Institute (CCI). Other certifications include CRNFA (Certified Registered Nurse First Assistant) and CSSM (Certified in Sterile Supply Management)." },
  { q: "What is the WHO Surgical Safety Checklist?", a: "The WHO Surgical Safety Checklist is a three-phase protocol (Sign In, Time Out, Sign Out) used before, during, and after surgery to reduce surgical complications and mortality. It includes verification of patient identity, surgical site, consent, allergies, airway risk, blood loss preparation, instrument counts, and specimen labeling." },
  { q: "What is the role of the circulating nurse vs. the scrub nurse?", a: "The circulating nurse manages the overall operating room environment — patient positioning, documentation, specimen handling, and communication with the surgical team. The scrub nurse maintains the sterile field, passes instruments to the surgeon, and performs surgical counts." },
  { q: "How do I prepare for the CNOR exam?", a: "Start by reviewing the CCI CNOR exam blueprint, which covers preoperative patient assessment, intraoperative care, instrument and equipment management, sterilization and disinfection, and professional accountability. Use practice questions, flashcards, and mock exams aligned to the current blueprint." },
];

const PREOPERATIVE_CARE_FAQS = [
  { q: "What is included in a preoperative assessment?", a: "A thorough preoperative assessment includes medical history review, physical examination, medication reconciliation, allergy verification, NPO status confirmation, baseline vital signs, airway assessment (Mallampati classification), lab review (CBC, BMP, coagulation studies, type & screen), and psychosocial assessment including anxiety level and cultural considerations." },
  { q: "What are the NPO guidelines before surgery?", a: "The ASA (American Society of Anesthesiologists) NPO guidelines recommend: clear liquids up to 2 hours before surgery, breast milk up to 4 hours, infant formula/light meal up to 6 hours, and a full meal up to 8 hours before anesthesia. These guidelines reduce aspiration risk during intubation." },
  { q: "What medications should be held before surgery?", a: "Common medications held before surgery include anticoagulants (warfarin 5 days, direct oral anticoagulants 24-48 hours), antiplatelet agents (clopidogrel 5-7 days), NSAIDs (7 days), metformin (24-48 hours), and herbal supplements (2 weeks). Always verify with the anesthesiologist as some medications (beta-blockers, anti-seizure meds) should be continued." },
  { q: "What is informed consent and why is it important?", a: "Informed consent is a legal and ethical requirement where the surgeon explains the procedure, risks, benefits, alternatives, and expected outcomes to the patient before surgery. The nurse's role is to witness the consent, verify patient understanding, and ensure the form is properly signed. Consent must be obtained while the patient is competent and not under the influence of sedating medications." },
  { q: "What is the surgical site marking protocol?", a: "Surgical site marking is a Joint Commission National Patient Safety Goal requiring the surgeon to mark the operative site with indelible ink while the patient is awake and can confirm the correct site. This is critical for procedures involving laterality (left/right), multiple structures, or multiple levels (spine surgery). The mark must be visible after draping." },
];

const PREOP_GUIDE_FAQS = [
  { q: "What are the three phases of perioperative nursing?", a: "The three phases are: (1) Preoperative — from the decision for surgery through transfer to the OR, including assessment, education, and preparation; (2) Intraoperative — from OR entry to transfer to PACU, including anesthesia, sterile technique, and surgical intervention; (3) Postoperative — from PACU admission through recovery, including pain management, wound care, and discharge planning." },
  { q: "How do nurses assess surgical risk preoperatively?", a: "Nurses assess surgical risk using tools like the ASA Physical Status Classification, Mallampati Airway Score, and Braden Scale for skin integrity. Key risk factors include age >70, obesity (BMI >40), smoking history, uncontrolled diabetes (HbA1c >8%), cardiac disease, respiratory conditions, and immunosuppression. Lab values (albumin <3.5, INR >1.5) also indicate increased risk." },
  { q: "What is the preoperative teaching checklist?", a: "Preoperative teaching should cover: procedure explanation in patient-friendly language, what to expect before/during/after surgery, NPO instructions, medication management, deep breathing and incentive spirometry techniques, pain management plan, mobility expectations, surgical site care, signs of complications to report, and expected discharge timeline." },
  { q: "What are common preoperative nursing diagnoses?", a: "Common preoperative nursing diagnoses include: Anxiety related to surgical procedure and outcomes, Deficient Knowledge related to preoperative preparation, Risk for Aspiration related to impaired swallowing reflexes during anesthesia, Risk for Perioperative Hypothermia, and Risk for Surgical Site Infection." },
  { q: "When should surgery be cancelled or postponed?", a: "Surgery may be cancelled/postponed for: elevated INR or abnormal coagulation, uncontrolled blood glucose >400 mg/dL, fever >101°F indicating active infection, hemoglobin <7 g/dL for elective cases, abnormal ECG findings not previously evaluated, patient refusal or withdrawal of consent, or NPO violation within the required timeframe." },
];

const CAREER_GUIDE_FAQS = [
  { q: "What is the CNOR certification and who is eligible?", a: "The CNOR (Certified Perioperative Nurse) is offered by the Competency & Credentialing Institute (CCI). Eligibility requires: current unrestricted RN license, minimum 2 years of perioperative nursing experience with at least 50% in the intraoperative role within the past 2 years, and completion of continuing education in perioperative nursing." },
  { q: "What is the average salary for a perioperative nurse?", a: "Perioperative nurses earn an average salary of $75,000-$95,000 per year in the United States, depending on location, experience, and certifications. CNOR-certified nurses typically earn 5-15% more than non-certified OR nurses. Travel OR nursing positions can command $100,000-$130,000+ annually." },
  { q: "What is the job outlook for perioperative nurses?", a: "The Bureau of Labor Statistics projects 6% growth for registered nurses through 2032. Perioperative nursing demand is even higher due to an aging population requiring more surgical procedures, surgeon shortages increasing reliance on RNFAs, and the ongoing expansion of ambulatory surgery centers." },
  { q: "How long does it take to become a perioperative nurse?", a: "Typical timeline: BSN degree (4 years), pass NCLEX-RN, gain 1-2 years of acute care experience, complete a perioperative nurse internship or residency program (6-12 months), then gain 2+ years of OR experience before pursuing CNOR certification. Total: approximately 7-8 years from start of nursing school." },
  { q: "What are the career advancement opportunities?", a: "Career paths include: CNOR-certified staff nurse → charge nurse → OR manager → director of surgical services. Specialty paths include CRNFA (first assistant), CSSM (sterile processing management), robotic surgery specialist, cardiac surgery specialist, transplant coordinator, or nursing education/clinical instructor roles." },
];

export default function PerioperativeNursingHub() {
  const courseJsonLd = buildCourseStructuredData({
    name: "Perioperative Nursing & CNOR Exam Prep",
    description: "Comprehensive perioperative nursing study program covering surgical nursing, patient preparation, infection control, and surgical safety for CNOR certification.",
    url: "https://www.nursenest.ca/perioperative-nursing",
  });
  const faqJsonLd = buildFaqStructuredData(PERIOPERATIVE_NURSING_FAQS.map(f => ({ question: f.q, answer: f.a })));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <SEO
        title={t("pages.perioperativeHubPages.perioperativeNursingHubSurgicalNursing")}
        description={t("pages.perioperativeHubPages.masterPerioperativeNursingWithComprehensive")}
        canonicalPath="/perioperative-nursing"
        structuredData={courseJsonLd}
        additionalStructuredData={[faqJsonLd]}
        keywords="perioperative nursing, CNOR exam prep, surgical nursing, operating room nurse, OR nurse, sterile technique, surgical safety checklist"
      />

      <section className="bg-gradient-to-br from-teal-700 via-teal-800 to-teal-900 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 text-teal-200 text-sm mb-4">
            <Link href="/" className="hover:text-white">{t("pages.perioperativeHubPages.home")}</Link>
            <span>/</span>
            <Link href="/perioperative" className="hover:text-white">{t("pages.perioperativeHubPages.perioperative")}</Link>
            <span>/</span>
            <span className="text-white">{t("pages.perioperativeHubPages.perioperativeNursingHub")}</span>
          </div>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Scissors className="w-8 h-8 text-teal-200" />
              </div>
              <span className="px-3 py-1 bg-teal-600/50 rounded-full text-sm font-medium text-teal-100">{t("pages.perioperativeHubPages.cnorCrnfaCssm")}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4" data-testid="text-page-title">{t("pages.perioperativeHubPages.perioperativeNursingHub2")}</h1>
            <p className="text-lg md:text-xl text-teal-100 mb-8">{t("pages.perioperativeHubPages.yourComprehensiveResourceForMastering")}</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/perioperative/question-bank">
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-800 font-semibold rounded-lg hover:bg-teal-50 transition-colors" data-testid="link-question-bank">
                  <FileText className="w-5 h-5" /> Test Bank <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/perioperative/flashcards">
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600/50 text-white font-semibold rounded-lg hover:bg-teal-600/70 transition-colors" data-testid="link-flashcards">
                  <Brain className="w-5 h-5" /> Flashcards
                </span>
              </Link>
              <Link href="/preoperative-care">
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600/50 text-white font-semibold rounded-lg hover:bg-teal-600/70 transition-colors" data-testid="link-preop-care">
                  <ClipboardCheck className="w-5 h-5" /> Preoperative Care
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3" data-testid="text-surgical-overview">{t("pages.perioperativeHubPages.surgicalNursingOverview")}</h2>
        <p className="text-gray-600 mb-8 max-w-3xl">{t("pages.perioperativeHubPages.perioperativeNursingSpansTheEntire")}</p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { phase: "Preoperative Phase", icon: ClipboardCheck, items: ["Patient history & physical assessment", "Surgical risk stratification", "Informed consent verification", "NPO compliance confirmation", "Medication reconciliation", "Surgical site marking verification"], color: "blue" },
            { phase: "Intraoperative Phase", icon: Scissors, items: ["Sterile field setup & maintenance", "Surgical counts (instruments, sponges, sharps)", "Patient positioning & safety", "Specimen handling & labeling", "Hemostasis monitoring", "Time-out & safety checklist execution"], color: "teal" },
            { phase: "Postoperative Phase", icon: HeartPulse, items: ["PACU handoff communication", "Pain assessment & management", "Wound assessment & dressing", "Drain and output monitoring", "Mobility & DVT prevention", "Discharge teaching & follow-up"], color: "green" },
          ].map((phase) => (
            <div key={phase.phase} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className={`p-3 rounded-lg w-fit mb-4 ${phase.color === "blue" ? "bg-blue-50" : phase.color === "teal" ? "bg-teal-50" : "bg-green-50"}`}>
                <phase.icon className={`w-6 h-6 ${phase.color === "blue" ? "text-blue-600" : phase.color === "teal" ? "text-teal-600" : "text-green-600"}`} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{phase.phase}</h3>
              <ul className="space-y-2">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3" data-testid="text-infection-control">{t("pages.perioperativeHubPages.infectionControlProtocols")}</h2>
          <p className="text-gray-600 mb-8 max-w-3xl">{t("pages.perioperativeHubPages.surgicalSiteInfectionsSsisAre")}</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" /> Sterile Technique Principles
              </h3>
              <ul className="space-y-3">
                {[
                  "Only sterile items are used within the sterile field",
                  "Sterile persons touch only sterile items; non-sterile persons touch only non-sterile items",
                  "A sterile barrier that has been permeated is considered contaminated",
                  "Sterile fields should be set up as close to the time of use as possible",
                  "Tables are sterile only at table-top level; items below the waist are considered non-sterile",
                  "Edges of anything that encloses sterile contents are considered non-sterile (1-inch border rule)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-700">
                    <Shield className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Syringe className="w-5 h-5 text-teal-600" /> SSI Prevention Bundle
              </h3>
              <ul className="space-y-3">
                {[
                  "Prophylactic antibiotics within 60 minutes of incision (120 min for vancomycin/fluoroquinolones)",
                  "Appropriate hair removal with clippers (not razors) immediately before surgery",
                  "Blood glucose control (<200 mg/dL) for all surgical patients",
                  "Normothermia maintenance (core temp ≥36°C/96.8°F) perioperatively",
                  "Surgical hand antisepsis with alcohol-based rub or antimicrobial soap",
                  "Skin preparation with chlorhexidine-alcohol antiseptic at the surgical site",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3" data-testid="text-surgical-safety">{t("pages.perioperativeHubPages.surgicalSafetyChecklists")}</h2>
        <p className="text-gray-600 mb-8 max-w-3xl">{t("pages.perioperativeHubPages.theWhoSurgicalSafetyChecklist")}</p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { title: "Sign In (Before Anesthesia)", items: ["Patient identity confirmed", "Surgical site marked", "Consent form signed", "Anesthesia safety check completed", "Pulse oximeter on patient and functioning", "Known allergy status confirmed", "Difficult airway/aspiration risk assessed", "Blood loss risk evaluated (≥500 mL)"] },
            { title: "Time Out (Before Incision)", items: ["All team members introduced by name & role", "Patient identity, site & procedure confirmed", "Anticipated critical events reviewed", "Antibiotic prophylaxis given within 60 minutes", "Essential imaging displayed", "Sterility confirmed", "Equipment issues addressed"] },
            { title: "Sign Out (Before Leaving OR)", items: ["Procedure name confirmed & recorded", "Instrument, sponge & needle counts correct", "Specimen labeling confirmed", "Equipment problems documented", "Key recovery & management concerns communicated", "VTE prophylaxis plan documented"] },
          ].map((checklist) => (
            <div key={checklist.title} className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-teal-600" />
                {checklist.title}
              </h3>
              <ul className="space-y-2">
                {checklist.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <div className="w-4 h-4 rounded border-2 border-teal-400 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6" data-testid="text-study-resources">{t("pages.perioperativeHubPages.studyResources")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InternalLinkCard href="/perioperative/question-bank" title={t("pages.perioperativeHubPages.cnorTestBank")} desc="Practice questions aligned to the CNOR exam blueprint with detailed rationales." icon={FileText} />
            <InternalLinkCard href="/perioperative/flashcards" title={t("pages.perioperativeHubPages.perioperativeFlashcards")} desc="Spaced repetition flashcards covering sterile technique, instruments, and surgical safety." icon={Brain} />
            <InternalLinkCard href="/perioperative/mock-exams" title={t("pages.perioperativeHubPages.mockExams")} desc="Timed practice exams simulating CNOR test conditions with performance analytics." icon={Target} />
            <InternalLinkCard href="/preoperative-care" title={t("pages.perioperativeHubPages.preoperativeCareHub2")} desc="Comprehensive guide to preoperative assessment, NPO guidelines, and patient preparation." icon={ClipboardCheck} />
            <InternalLinkCard href="/preoperative-nursing-guide" title={t("pages.perioperativeHubPages.preoperativeNursingGuide3")} desc="Complete guide to preoperative nursing practice with evidence-based protocols." icon={BookOpen} />
            <InternalLinkCard href="/perioperative-nurse-career" title={t("pages.perioperativeHubPages.perioperativeCareerGuide")} desc="CNOR certification path, salary data, and career advancement opportunities." icon={Award} />
            <InternalLinkCard href="/perioperative/study-plan" title={t("pages.perioperativeHubPages.studyPlan")} desc="Personalized study schedule targeting your weak areas based on CNOR domains." icon={Sparkles} />
            <InternalLinkCard href="/perioperative/sterile-field-sim" title={t("pages.perioperativeHubPages.sterileFieldSimulator")} desc="Interactive practice maintaining sterile technique in surgical scenarios." icon={Shield} />
            <InternalLinkCard href="/perioperative/surgical-count-drill" title={t("pages.perioperativeHubPages.surgicalCountDrill")} desc="Practice surgical instrument and sponge count protocols." icon={ListChecks} />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="text-faqs">{t("pages.perioperativeHubPages.frequentlyAskedQuestions")}</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {PERIOPERATIVE_NURSING_FAQS.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-teal-700 to-teal-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("pages.perioperativeHubPages.readyToMasterPerioperativeNursing")}</h2>
          <p className="text-teal-100 mb-6">{t("pages.perioperativeHubPages.startWithFreePracticeQuestions")}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/perioperative/question-bank">
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-800 font-semibold rounded-lg hover:bg-teal-50 transition-colors" data-testid="link-start-practicing">
                Start Practicing <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link href="/perioperative/pricing">
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600/50 text-white font-semibold rounded-lg hover:bg-teal-600/70 transition-colors" data-testid="link-view-pricing">
                View Pricing
              </span>
            </Link>
          </div>
        </div>
      </section>

      <EndOfContentLeadCapture leadMagnetType="study_guide" professionContext="perioperative" source="perioperative-nursing-hub" />
      <Footer />
    </div>
  );
}

export function PreoperativeCareHub() {
  const courseJsonLd = buildCourseStructuredData({
    name: "Preoperative Care: Patient Preparation for Surgery",
    description: "Complete guide to preoperative nursing care including patient assessment, informed consent, NPO guidelines, medication management, and pre-surgical checklists.",
    url: "https://www.nursenest.ca/preoperative-care",
  });
  const faqJsonLd = buildFaqStructuredData(PREOPERATIVE_CARE_FAQS.map(f => ({ question: f.q, answer: f.a })));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <SEO
        title={t("pages.perioperativeHubPages.preoperativeCareHubPatientPreparation")}
        description={t("pages.perioperativeHubPages.masterPreoperativeNursingCareWith")}
        canonicalPath="/preoperative-care"
        structuredData={courseJsonLd}
        additionalStructuredData={[faqJsonLd]}
        keywords="preoperative care, preoperative nursing, pre-surgical assessment, NPO guidelines, informed consent, surgical preparation, CNOR"
      />

      <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 text-blue-200 text-sm mb-4">
            <Link href="/" className="hover:text-white">{t("pages.perioperativeHubPages.home2")}</Link>
            <span>/</span>
            <Link href="/perioperative-nursing" className="hover:text-white">{t("pages.perioperativeHubPages.perioperativeNursing")}</Link>
            <span>/</span>
            <span className="text-white">{t("pages.perioperativeHubPages.preoperativeCare")}</span>
          </div>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <ClipboardCheck className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4" data-testid="text-preop-title">{t("pages.perioperativeHubPages.preoperativeCareHub")}</h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">{t("pages.perioperativeHubPages.everythingYouNeedToKnow")}</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/perioperative/question-bank">
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-800 font-semibold rounded-lg hover:bg-blue-50 transition-colors" data-testid="link-practice-questions">
                  <FileText className="w-5 h-5" /> Practice Questions <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/perioperative-nursing">
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600/50 text-white font-semibold rounded-lg hover:bg-blue-600/70 transition-colors" data-testid="link-periop-hub">
                  <Scissors className="w-5 h-5" /> Perioperative Hub
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3" data-testid="text-preop-assessment">{t("pages.perioperativeHubPages.preoperativeAssessmentWorkflow")}</h2>
        <p className="text-gray-600 mb-8 max-w-3xl">{t("pages.perioperativeHubPages.aSystematicPreoperativeAssessmentEnsures")}</p>

        <div className="space-y-4 mb-12">
          {[
            { step: 1, title: "Medical History & Physical Exam", desc: "Review past medical/surgical history, current medications, allergies (latex, medications, food), family history of anesthesia complications (malignant hyperthermia), and perform a focused physical examination.", icon: Stethoscope },
            { step: 2, title: "Laboratory & Diagnostic Review", desc: "Verify results: CBC, BMP, coagulation studies (PT/INR, aPTT), type & screen/crossmatch, urinalysis, pregnancy test (women of childbearing age), chest X-ray, ECG (patients >50 or cardiac history), HbA1c (diabetic patients).", icon: Activity },
            { step: 3, title: "Risk Stratification", desc: "Classify ASA Physical Status (I-VI), assess Mallampati Airway Score (I-IV), evaluate VTE risk using Caprini Score, and identify fall risk. Document BMI, nutritional status (albumin level), and functional capacity (METs).", icon: Target },
            { step: 4, title: "Medication Management", desc: "Reconcile all medications including OTC and herbal supplements. Determine hold/continue status for each medication based on surgical procedure and anesthesia plan. Ensure bridge anticoagulation plan is in place if needed.", icon: Syringe },
            { step: 5, title: "Patient Education & Consent", desc: "Verify informed consent is signed by the patient and surgeon. Educate on NPO requirements, what to expect day-of-surgery, incentive spirometry, pain management plan, and expected recovery timeline.", icon: BookOpen },
            { step: 6, title: "Day-of-Surgery Verification", desc: "Confirm patient identity (two identifiers), surgical site marked, consent form signed, NPO status, IV access established, pre-procedure antibiotics ordered, VTE prophylaxis applied, and patient belongings secured.", icon: CheckCircle2 },
          ].map((step) => (
            <div key={step.step} className="flex gap-4 bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg">
                {step.step}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <step.icon className="w-5 h-5 text-blue-600" />
                  {step.title}
                </h3>
                <p className="text-gray-600 mt-1 text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3" data-testid="text-npo-guidelines">{t("pages.perioperativeHubPages.npoGuidelinesPatientEducation")}</h2>
          <p className="text-gray-600 mb-8 max-w-3xl">{t("pages.perioperativeHubPages.npoNothingByMouthGuidelines")}</p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t("pages.perioperativeHubPages.asaFastingGuidelines")}</h3>
              <div className="space-y-3">
                {[
                  { item: "Clear liquids (water, apple juice, black coffee, tea)", time: "2 hours", risk: "Low" },
                  { item: "Breast milk", time: "4 hours", risk: "Low" },
                  { item: "Infant formula, non-human milk", time: "6 hours", risk: "Medium" },
                  { item: "Light meal (toast, clear liquids)", time: "6 hours", risk: "Medium" },
                  { item: "Full meal (fried/fatty foods, meat)", time: "8+ hours", risk: "High" },
                ].map((row) => (
                  <div key={row.item} className="flex items-start justify-between gap-4 text-sm">
                    <span className="text-gray-700">{row.item}</span>
                    <span className="font-semibold text-blue-700 whitespace-nowrap">{row.time}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>{t("pages.perioperativeHubPages.examTip")}</strong> {t("pages.perioperativeHubPages.npoViolationIsACommon")}</span>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t("pages.perioperativeHubPages.presurgicalChecklist")}</h3>
              <ul className="space-y-2">
                {[
                  "Patient identity verified with two identifiers (name + DOB)",
                  "Surgical consent form signed and witnessed",
                  "Surgical site marked by surgeon with indelible ink",
                  "NPO status confirmed (last intake time documented)",
                  "Allergy band applied and allergies verified",
                  "IV access established with appropriate gauge",
                  "Preoperative medications administered per order",
                  "Baseline vital signs documented",
                  "Lab results reviewed and within acceptable range",
                  "Jewelry, dentures, prosthetics removed and secured",
                  "VTE prophylaxis (SCDs or heparin) applied",
                  "Hair removal completed with clippers if ordered",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <div className="w-4 h-4 rounded border-2 border-blue-400 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="text-related-resources">{t("pages.perioperativeHubPages.relatedResources")}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InternalLinkCard href="/perioperative-nursing" title={t("pages.perioperativeHubPages.perioperativeNursingHub3")} desc="Complete overview of all three surgical phases with safety protocols." icon={Scissors} />
          <InternalLinkCard href="/preoperative-nursing-guide" title={t("pages.perioperativeHubPages.preoperativeNursingGuide4")} desc="In-depth guide to preoperative nursing practice with FAQ." icon={BookOpen} />
          <InternalLinkCard href="/perioperative/question-bank" title={t("pages.perioperativeHubPages.cnorPracticeQuestions")} desc="Targeted questions covering preoperative assessment and patient preparation." icon={FileText} />
          <InternalLinkCard href="/perioperative/flashcards" title={t("pages.perioperativeHubPages.preoperativeFlashcards")} desc="Review key preoperative concepts with spaced repetition." icon={Brain} />
          <InternalLinkCard href="/perioperative-nurse-career" title={t("pages.perioperativeHubPages.careerGuide2")} desc="Explore perioperative nursing career paths and CNOR certification." icon={Award} />
          <InternalLinkCard href="/perioperative/mock-exams" title={t("pages.perioperativeHubPages.mockExams2")} desc="Test your preoperative knowledge under exam conditions." icon={Target} />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="text-preop-faqs">{t("pages.perioperativeHubPages.frequentlyAskedQuestions2")}</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {PREOPERATIVE_CARE_FAQS.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("pages.perioperativeHubPages.testYourPreoperativeNursingKnowledge")}</h2>
          <p className="text-blue-100 mb-6">{t("pages.perioperativeHubPages.practiceWithQuestionsCoveringPreoperative")}</p>
          <Link href="/perioperative/question-bank">
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-800 font-semibold rounded-lg hover:bg-blue-50 transition-colors" data-testid="link-start-questions">
              Start Practice Questions <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>

      <EndOfContentLeadCapture leadMagnetType="practice_questions" professionContext="perioperative" source="preoperative-care-hub" />
      <Footer />
    </div>
  );
}

export function PreoperativeNursingGuide() {
  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": "Preoperative Nursing Guide: Complete Practice Reference",
    "description": "Evidence-based preoperative nursing guide covering patient assessment, risk stratification, medication management, and surgical preparation protocols for CNOR exam preparation.",
    "url": "https://www.nursenest.ca/preoperative-nursing-guide",
    "learningResourceType": "StudyGuide",
    "educationalLevel": "Professional",
    "provider": { "@type": "Organization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
    "about": [
      { "@type": "Thing", "name": "Preoperative Nursing" },
      { "@type": "Thing", "name": "Surgical Patient Preparation" },
      { "@type": "Thing", "name": "CNOR Certification" },
    ],
  };
  const faqJsonLd = buildFaqStructuredData(PREOP_GUIDE_FAQS.map(f => ({ question: f.q, answer: f.a })));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <SEO
        title={t("pages.perioperativeHubPages.preoperativeNursingGuideCompletePractice")}
        description={t("pages.perioperativeHubPages.evidencebasedPreoperativeNursingGuideCovering")}
        canonicalPath="/preoperative-nursing-guide"
        structuredData={learningResourceJsonLd}
        additionalStructuredData={[faqJsonLd]}
        keywords="preoperative nursing guide, preoperative assessment, surgical preparation nursing, CNOR study guide, preoperative checklist, NPO guidelines nursing"
      />

      <section className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-900 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 text-indigo-200 text-sm mb-4">
            <Link href="/" className="hover:text-white">{t("pages.perioperativeHubPages.home3")}</Link>
            <span>/</span>
            <Link href="/perioperative-nursing" className="hover:text-white">{t("pages.perioperativeHubPages.perioperativeNursing2")}</Link>
            <span>/</span>
            <span className="text-white">{t("pages.perioperativeHubPages.preoperativeNursingGuide")}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-guide-title">{t("pages.perioperativeHubPages.preoperativeNursingGuide2")}</h1>
          <p className="text-lg text-indigo-100 mb-6">{t("pages.perioperativeHubPages.aComprehensiveEvidencebasedReferenceFor")}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/perioperative/question-bank">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-800 font-semibold rounded-lg hover:bg-indigo-50 transition-colors text-sm" data-testid="link-practice-questions-guide">
                Practice Questions <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link href="/perioperative/flashcards">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600/50 text-white font-semibold rounded-lg hover:bg-indigo-600/70 transition-colors text-sm" data-testid="link-flashcards-guide">
                Flashcards
              </span>
            </Link>
          </div>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-guide-overview">{t("pages.perioperativeHubPages.whatIsPreoperativeNursing")}</h2>
          <p className="text-gray-700 mb-6">{t("pages.perioperativeHubPages.preoperativeNursingEncompassesAllNursing")}</p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-12" data-testid="text-assessment-components">{t("pages.perioperativeHubPages.componentsOfThePreoperativeAssessment")}</h2>
          <p className="text-gray-700 mb-4">{t("pages.perioperativeHubPages.aComprehensivePreoperativeAssessmentFollows")}</p>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t("pages.perioperativeHubPages.healthHistoryElements")}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: "Past Surgical History", detail: "Previous surgeries, anesthesia reactions, complications (DVT, wound infection, difficult intubation)" },
                { label: "Medical Conditions", detail: "Cardiac disease, respiratory conditions, diabetes, renal/hepatic dysfunction, bleeding disorders" },
                { label: "Current Medications", detail: "Prescription, OTC, herbal supplements, recreational substances, last dose timing" },
                { label: "Allergies", detail: "Medications (antibiotics, anesthetics, opioids), latex, iodine/chlorhexidine, food allergies (eggs → propofol)" },
                { label: "Social History", detail: "Smoking status (pack-years), alcohol use (withdrawal risk), substance use, living situation, support system" },
                { label: "Family History", detail: "Malignant hyperthermia, pseudocholinesterase deficiency, bleeding disorders, adverse anesthesia reactions" },
              ].map((item) => (
                <div key={item.label} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 text-sm">{item.label}</h4>
                  <p className="text-gray-600 text-xs mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-12" data-testid="text-risk-tools">{t("pages.perioperativeHubPages.riskStratificationTools")}</h2>
          <p className="text-gray-700 mb-4">{t("pages.perioperativeHubPages.perioperativeNursesUseStandardizedTools")}</p>

          <div className="space-y-4 mb-8">
            {[
              { tool: "ASA Physical Status Classification", desc: "Six-class system (I = healthy to VI = brain-dead organ donor) that correlates with perioperative mortality risk. Class III and above require heightened monitoring and preparation." },
              { tool: "Mallampati Airway Classification", desc: "Four-class visual assessment of the oropharynx predicting intubation difficulty. Class III-IV (only hard palate visible) indicates potential difficult airway — notify anesthesia immediately." },
              { tool: "Caprini VTE Risk Assessment", desc: "Point-based scoring system for venous thromboembolism risk. Scores ≥5 indicate high risk requiring pharmacological prophylaxis (LMWH or heparin) in addition to mechanical (SCDs)." },
              { tool: "Braden Scale", desc: "Six-subscale tool assessing pressure injury risk. Scores ≤18 indicate at-risk status; intraoperative padding and positioning adjustments are critical for surgeries >2 hours." },
            ].map((item) => (
              <div key={item.tool} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-600" />
                  {item.tool}
                </h3>
                <p className="text-gray-600 text-sm mt-2">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-12" data-testid="text-medication-mgmt">{t("pages.perioperativeHubPages.preoperativeMedicationManagement")}</h2>
          <p className="text-gray-700 mb-4">{t("pages.perioperativeHubPages.medicationManagementIsACritical")}</p>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-red-700 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Medications to HOLD
                </h3>
                <ul className="space-y-2">
                  {[
                    "Warfarin — hold 5 days before; bridge with LMWH if high VTE risk",
                    "DOACs (rivaroxaban, apixaban) — hold 24-48 hours",
                    "Clopidogrel (Plavix) — hold 5-7 days",
                    "NSAIDs — hold 7 days (increased bleeding risk)",
                    "Metformin — hold 24-48 hours (lactic acidosis risk with contrast)",
                    "Herbal supplements — hold 2 weeks (ginkgo, garlic, ginseng)",
                    "MAOIs — may need 2-week washout per anesthesia",
                  ].map((med) => (
                    <li key={med} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-red-500 font-bold">✕</span>
                      <span>{med}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-700 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Medications to CONTINUE
                </h3>
                <ul className="space-y-2">
                  {[
                    "Beta-blockers — continue to prevent rebound tachycardia/HTN",
                    "Antihypertensives — continue (except ACE-I/ARBs per protocol)",
                    "Anti-seizure medications — continue with sip of water",
                    "Thyroid medications — continue morning of surgery",
                    "Chronic corticosteroids — continue (may need stress-dose)",
                    "Inhalers — continue bronchodilators morning of surgery",
                    "Cardiac medications — continue per anesthesia orders",
                  ].map((med) => (
                    <li key={med} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>{med}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-12" data-testid="text-patient-education">{t("pages.perioperativeHubPages.patientEducationAnxietyReduction")}</h2>
          <p className="text-gray-700 mb-4">{t("pages.perioperativeHubPages.preoperativeAnxietyDirectlyImpactsSurgical")}</p>
          <ul className="space-y-2 mb-8">
            {[
              "Provide procedure-specific education using teach-back method to verify understanding",
              "Demonstrate incentive spirometry and deep breathing exercises (reduces postoperative pulmonary complications by 50%)",
              "Explain the pain management plan including pain scale usage and multimodal analgesia approach",
              "Review expected postoperative course: timeline, mobility goals, drain management, diet progression",
              "Address cultural and spiritual considerations; offer chaplain services if requested",
              "Include family/support persons in teaching; provide written discharge instructions preoperatively",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-1 shrink-0" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-12">
          <h3 className="text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> CNOR Exam Pearl
          </h3>
          <p className="text-indigo-800 text-sm">{t("pages.perioperativeHubPages.thePreoperativePhaseIsThe")}</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="text-guide-resources">{t("pages.perioperativeHubPages.relatedStudyResources")}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          <InternalLinkCard href="/perioperative-nursing" title={t("pages.perioperativeHubPages.perioperativeNursingHub4")} desc="Overview of all three surgical phases with safety protocols." icon={Scissors} />
          <InternalLinkCard href="/preoperative-care" title={t("pages.perioperativeHubPages.preoperativeCareHub3")} desc="Practical preoperative assessment workflow and checklists." icon={ClipboardCheck} />
          <InternalLinkCard href="/perioperative/question-bank" title={t("pages.perioperativeHubPages.testBank")} desc="CNOR-aligned questions on preoperative nursing." icon={FileText} />
          <InternalLinkCard href="/perioperative/flashcards" title={t("pages.perioperativeHubPages.flashcards")} desc="Review preoperative concepts with spaced repetition." icon={Brain} />
          <InternalLinkCard href="/perioperative-nurse-career" title={t("pages.perioperativeHubPages.careerGuide3")} desc="CNOR certification path and perioperative career options." icon={Award} />
          <InternalLinkCard href="/perioperative/mock-exams" title={t("pages.perioperativeHubPages.mockExams3")} desc="Timed exams covering preoperative nursing content." icon={Target} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="text-guide-faqs">{t("pages.perioperativeHubPages.frequentlyAskedQuestions3")}</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-12">
          {PREOP_GUIDE_FAQS.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </article>

      <section className="bg-gradient-to-r from-indigo-700 to-indigo-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("pages.perioperativeHubPages.readyToTestYourKnowledge")}</h2>
          <p className="text-indigo-100 mb-6">{t("pages.perioperativeHubPages.practiceWithCnoralignedQuestionsCovering")}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/perioperative/question-bank">
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-800 font-semibold rounded-lg hover:bg-indigo-50 transition-colors" data-testid="link-start-cnor-prep">
                Start Practicing <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link href="/perioperative-nursing">
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600/50 text-white font-semibold rounded-lg hover:bg-indigo-600/70 transition-colors" data-testid="link-back-hub">
                Back to Hub
              </span>
            </Link>
          </div>
        </div>
      </section>

      <EndOfContentLeadCapture leadMagnetType="study_guide" professionContext="perioperative" source="preoperative-nursing-guide" />
      <Footer />
    </div>
  );
}

export function PerioperativeNurseCareer() {
  const courseJsonLd = buildCourseStructuredData({
    name: "Perioperative Nurse Career Guide & CNOR Certification Path",
    description: "Complete career guide for perioperative nurses covering CNOR certification requirements, salary information, job outlook, education pathways, and career advancement opportunities in surgical nursing.",
    url: "https://www.nursenest.ca/perioperative-nurse-career",
  });
  const faqJsonLd = buildFaqStructuredData(CAREER_GUIDE_FAQS.map(f => ({ question: f.q, answer: f.a })));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <SEO
        title={t("pages.perioperativeHubPages.perioperativeNurseCareerGuideCnor")}
        description={t("pages.perioperativeHubPages.completePerioperativeNursingCareerGuide")}
        canonicalPath="/perioperative-nurse-career"
        structuredData={courseJsonLd}
        additionalStructuredData={[faqJsonLd]}
        keywords="perioperative nurse career, CNOR certification, OR nurse salary, perioperative nursing jobs, surgical nurse career path, CNOR exam requirements"
      />

      <section className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 text-emerald-200 text-sm mb-4">
            <Link href="/" className="hover:text-white">{t("pages.perioperativeHubPages.home4")}</Link>
            <span>/</span>
            <Link href="/perioperative-nursing" className="hover:text-white">{t("pages.perioperativeHubPages.perioperativeNursing3")}</Link>
            <span>/</span>
            <span className="text-white">{t("pages.perioperativeHubPages.careerGuide")}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-career-title">{t("pages.perioperativeHubPages.perioperativeNurseCareerGuide")}</h1>
          <p className="text-lg text-emerald-100 mb-6">{t("pages.perioperativeHubPages.everythingYouNeedToKnow2")}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/perioperative-nursing">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-800 font-semibold rounded-lg hover:bg-emerald-50 transition-colors text-sm" data-testid="link-study-resources">
                Study Resources <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link href="/perioperative/question-bank">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600/50 text-white font-semibold rounded-lg hover:bg-emerald-600/70 transition-colors text-sm" data-testid="link-cnor-questions">
                CNOR Questions
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: DollarSign, label: "Avg. Salary", value: "$75K–$95K", sub: "CNOR premium: +5-15%" },
            { icon: TrendingUp, label: "Job Growth", value: "6%+", sub: "Through 2032 (BLS)" },
            { icon: GraduationCap, label: "Education", value: "BSN + RN", sub: "+ 2yr OR experience" },
            { icon: Award, label: "Certification", value: "CNOR", sub: "200-question exam" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 text-center">
              <stat.icon className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-cnor-cert">{t("pages.perioperativeHubPages.cnorCertificationRequirements")}</h2>
        <p className="text-gray-700 mb-6">{t("pages.perioperativeHubPages.theCertifiedPerioperativeNurseCnor")}</p>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-12">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t("pages.perioperativeHubPages.cnorExamBlueprint")}</h3>
          <div className="space-y-3">
            {[
              { domain: "Preoperative Patient Assessment & Diagnosis", weight: "25%", topics: "Health history, risk assessment, diagnostic evaluation, informed consent" },
              { domain: "Individualized Plan of Care", weight: "20%", topics: "Nursing diagnoses, outcome identification, surgical positioning, skin prep" },
              { domain: "Intraoperative Activities", weight: "30%", topics: "Sterile technique, surgical counts, specimen management, emergency response" },
              { domain: "Communication & Documentation", weight: "10%", topics: "Hand-off communication, surgical documentation, patient advocacy" },
              { domain: "Cleaning, Disinfection & Sterilization", weight: "10%", topics: "Instrument processing, biological indicators, storage requirements" },
              { domain: "Emergency & Safety", weight: "5%", topics: "Fire safety, MH protocol, environmental hazards, disaster response" },
            ].map((d) => (
              <div key={d.domain} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-bold text-emerald-700 whitespace-nowrap min-w-[40px]">{d.weight}</span>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{d.domain}</h4>
                  <p className="text-gray-500 text-xs mt-0.5">{d.topics}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-sm text-emerald-800"><strong>{t("pages.perioperativeHubPages.examDetails")}</strong> {t("pages.perioperativeHubPages.200MultiplechoiceQuestions175Scored")}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-career-path">{t("pages.perioperativeHubPages.careerPathTimeline")}</h2>
        <div className="space-y-4 mb-12">
          {[
            { years: "Years 1–4", title: "BSN Nursing Degree", desc: "Complete a Bachelor of Science in Nursing (BSN) degree with clinical rotations. Some programs offer perioperative elective rotations.", icon: GraduationCap },
            { years: "Year 4", title: "Pass NCLEX-RN", desc: "Successfully pass the National Council Licensure Examination for Registered Nurses to obtain your RN license.", icon: Award },
            { years: "Years 5–6", title: "Acute Care Experience", desc: "Gain 1-2 years of medical-surgical or critical care nursing experience to build foundational clinical skills.", icon: Stethoscope },
            { years: "Year 6–7", title: "Perioperative Nurse Internship", desc: "Complete a 6-12 month perioperative nurse residency or internship program offered by hospitals or AORN.", icon: Users },
            { years: "Years 7–9", title: "OR Nursing Experience", desc: "Work as a perioperative nurse for 2+ years with at least 50% of time in the intraoperative role to meet CNOR eligibility.", icon: Scissors },
            { years: "Year 9+", title: "CNOR Certification", desc: "Apply for and pass the CNOR exam. Continue professional development with CE credits. Explore specialty advancement opportunities.", icon: Target },
          ].map((step) => (
            <div key={step.title} className="flex gap-4 bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">{step.years}</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <step.icon className="w-4 h-4 text-emerald-600" />
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-salary-info">{t("pages.perioperativeHubPages.salaryCompensation")}</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{t("pages.perioperativeHubPages.baseSalaryRangesUs2024")}</h3>
              <div className="space-y-3">
                {[
                  { role: "New OR Nurse (0-2 years)", range: "$60,000 – $75,000" },
                  { role: "Experienced OR Nurse (3-5 years)", range: "$75,000 – $90,000" },
                  { role: "CNOR-Certified Nurse", range: "$80,000 – $95,000" },
                  { role: "CRNFA (First Assistant)", range: "$90,000 – $120,000" },
                  { role: "OR Manager / Director", range: "$95,000 – $135,000" },
                  { role: "Travel OR Nurse", range: "$100,000 – $130,000+" },
                ].map((row) => (
                  <div key={row.role} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{row.role}</span>
                    <span className="font-semibold text-emerald-700">{row.range}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{t("pages.perioperativeHubPages.toppayingStates")}</h3>
              <div className="space-y-3">
                {[
                  { state: "California", avg: "$105,000" },
                  { state: "Hawaii", avg: "$98,000" },
                  { state: "Massachusetts", avg: "$96,000" },
                  { state: "Oregon", avg: "$94,000" },
                  { state: "Washington", avg: "$93,000" },
                  { state: "New York", avg: "$91,000" },
                ].map((row) => (
                  <div key={row.state} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{row.state}</span>
                    <span className="font-semibold text-emerald-700">{row.avg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-advancement">{t("pages.perioperativeHubPages.careerAdvancementOpportunities")}</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {[
            { title: "Certified Registered Nurse First Assistant (CRNFA)", desc: "Assists the surgeon directly during procedures. Requires CNOR certification plus completion of a CRNFA educational program and clinical practicum." },
            { title: "Robotic Surgery Specialist", desc: "Specializes in da Vinci and other robotic surgical systems. High demand specialty with premium compensation at major medical centers." },
            { title: "Cardiac Surgery / Transplant Coordinator", desc: "Manages the perioperative care of cardiac surgery and organ transplant patients. Requires advanced critical care knowledge and specialized training." },
            { title: "Perioperative Educator / Clinical Instructor", desc: "Develops and delivers education programs for OR staff. May work in hospitals, nursing schools, or for medical device companies. MSN preferred." },
            { title: "OR Manager / Director of Surgical Services", desc: "Oversees operating room operations, staffing, budgets, and quality improvement. Requires leadership experience and often an MSN or MBA." },
            { title: "Sterile Processing Management (CSSM)", desc: "Manages the sterile processing department ensuring proper instrument decontamination, sterilization, and distribution. CCI certification available." },
          ].map((path) => (
            <div key={path.title} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-emerald-600" />
                {path.title}
              </h3>
              <p className="text-gray-600 text-xs mt-2">{path.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="text-career-resources">{t("pages.perioperativeHubPages.studyResourcesForCnorExam")}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          <InternalLinkCard href="/perioperative-nursing" title={t("pages.perioperativeHubPages.perioperativeNursingHub5")} desc="Comprehensive surgical nursing resource center." icon={Scissors} />
          <InternalLinkCard href="/preoperative-care" title={t("pages.perioperativeHubPages.preoperativeCareHub4")} desc="Master preoperative assessment and patient preparation." icon={ClipboardCheck} />
          <InternalLinkCard href="/perioperative/question-bank" title={t("pages.perioperativeHubPages.cnorTestBank2")} desc="Practice questions aligned to the CNOR exam blueprint." icon={FileText} />
          <InternalLinkCard href="/perioperative/flashcards" title={t("pages.perioperativeHubPages.flashcards2")} desc="Spaced repetition review of perioperative nursing concepts." icon={Brain} />
          <InternalLinkCard href="/perioperative/mock-exams" title={t("pages.perioperativeHubPages.mockExams4")} desc="Full-length practice exams under CNOR test conditions." icon={Target} />
          <InternalLinkCard href="/preoperative-nursing-guide" title={t("pages.perioperativeHubPages.preoperativeNursingGuide5")} desc="Evidence-based reference for surgical patient preparation." icon={BookOpen} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="text-career-faqs">{t("pages.perioperativeHubPages.frequentlyAskedQuestions4")}</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-12">
          {CAREER_GUIDE_FAQS.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("pages.perioperativeHubPages.startYourCnorExamPrep")}</h2>
          <p className="text-emerald-100 mb-6">{t("pages.perioperativeHubPages.joinThousandsOfPerioperativeNurses")}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/perioperative/question-bank">
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-800 font-semibold rounded-lg hover:bg-emerald-50 transition-colors" data-testid="link-start-cnor-prep-career">
                Start Practicing <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link href="/perioperative/pricing">
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600/50 text-white font-semibold rounded-lg hover:bg-emerald-600/70 transition-colors" data-testid="link-pricing-career">
                View Pricing
              </span>
            </Link>
          </div>
        </div>
      </section>

      <EndOfContentLeadCapture leadMagnetType="study_guide" professionContext="perioperative" source="perioperative-nurse-career" />
      <Footer />
    </div>
  );
}
