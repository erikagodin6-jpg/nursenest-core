import { Link } from "wouter";
import { useState } from "react";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PremiumUpgradeCTA } from "./premium-cta";
import { useI18n } from "@/lib/i18n";
import { buildFaqStructuredData } from "@/lib/structured-data";
import {
  ArrowRight, Award, ShieldCheck, BookOpen, ChevronRight,
  HelpCircle, TrendingUp, Clock, DollarSign, GraduationCap,
  Heart, Zap, Activity, Baby, Scissors, Stethoscope, Brain
} from "lucide-react";

export const NEWGRAD_CERTIFICATIONS = [
  {
    slug: "acls",
    name: "ACLS",
    fullName: "Advanced Cardiovascular Life Support",
    org: "AHA",
    description: "Master cardiac arrest algorithms, STEMI management, stroke protocols, and advanced airway interventions required in most acute care settings.",
    questionCount: "200+",
    icon: Heart,
    color: "red",
    topics: [
      "Cardiac arrest algorithms (VF/pVT, PEA, Asystole)",
      "Post-cardiac arrest care & targeted temperature management",
      "Acute coronary syndromes & STEMI management",
      "Stroke recognition & fibrinolytic checklist",
      "Bradycardia & tachycardia algorithms",
      "Advanced airway management",
      "Pharmacology (epinephrine, amiodarone, atropine, adenosine)",
      "High-quality CPR & team dynamics",
    ],
    clinicalContext: "ACLS certification is required by virtually all hospitals for nurses working in ICU, ER, telemetry, step-down, and procedural areas. Many employers require ACLS within 90 days of hire for new graduate nurses in acute care.",
    faq: [
      { question: "Is ACLS required for new graduate nurses?", answer: "Most hospitals require ACLS for nurses in critical care, emergency, telemetry, and step-down units. Some require it before starting, others within 90 days of hire. Med-surg units may not require it immediately but encourage it." },
      { question: "How long does the ACLS course take?", answer: "The initial ACLS provider course is typically 2 days (about 14 hours). Renewal courses are shorter, usually 1 day. Many programs include online pre-learning modules." },
      { question: "What is the pass rate for ACLS?", answer: "ACLS pass rates are generally high (85-95%) because the course includes extensive practice before testing. The written exam requires 84% to pass, and you must demonstrate competency in megacode scenarios." },
    ],
  },
  {
    slug: "bls",
    name: "BLS",
    fullName: "Basic Life Support",
    org: "AHA",
    description: "Foundation of emergency response — high-quality CPR, AED use, choking management, and team-based resuscitation for healthcare providers.",
    questionCount: "150+",
    icon: Activity,
    color: "blue",
    topics: [
      "High-quality CPR for adults, children, and infants",
      "AED operation and pad placement",
      "Bag-valve-mask ventilation technique",
      "Choking management (conscious and unconscious)",
      "Recovery position and post-resuscitation care",
      "Team-based resuscitation dynamics",
      "Special considerations (drowning, opioid overdose, pregnancy)",
      "Chain of survival and early recognition",
    ],
    clinicalContext: "BLS is the most fundamental certification for all healthcare providers. Every hospital requires current BLS certification for all nursing staff, regardless of unit or specialty. It must be renewed every 2 years.",
    faq: [
      { question: "Is BLS required before starting work?", answer: "Yes. BLS is universally required before your first day on any nursing unit. Most nursing programs include BLS certification as part of the curriculum, so you likely already have it." },
      { question: "How often does BLS need to be renewed?", answer: "BLS certification is valid for 2 years. Most hospitals track renewal dates and require you to recertify before expiration. Renewal courses are shorter than initial certification." },
      { question: "AHA vs Red Cross BLS — does it matter?", answer: "Most hospitals accept AHA (American Heart Association) BLS for Healthcare Providers. Some also accept Red Cross BLS/CPR for Healthcare Providers. Check with your employer's education department for their specific requirements." },
    ],
  },
  {
    slug: "pals",
    name: "PALS",
    fullName: "Pediatric Advanced Life Support",
    org: "AHA",
    description: "Pediatric emergency assessment, recognition of respiratory failure, shock management, and pediatric resuscitation algorithms.",
    questionCount: "180+",
    icon: Baby,
    color: "sky",
    topics: [
      "Pediatric assessment triangle (PAT)",
      "Recognition of respiratory distress vs failure",
      "Pediatric shock recognition and fluid resuscitation",
      "Pediatric cardiac arrest algorithms",
      "Bradycardia and tachycardia management in children",
      "Post-resuscitation care for pediatric patients",
      "Pediatric pharmacology and weight-based dosing",
      "Effective team dynamics in pediatric emergencies",
    ],
    clinicalContext: "PALS is required for nurses in pediatric units, pediatric ICU, pediatric emergency departments, and many general emergency departments. It's typically required within 6 months of hire for applicable units.",
    faq: [
      { question: "Do I need PALS for the ER?", answer: "Most emergency departments require PALS certification, usually within 6 months of hire. Even if your ED primarily sees adult patients, pediatric emergencies can present at any time." },
      { question: "Is PALS harder than ACLS?", answer: "Many nurses find PALS more challenging because pediatric assessments require different parameters and weight-based calculations. However, the course structure is similar to ACLS with extensive practice scenarios." },
      { question: "Can I take PALS before working in pediatrics?", answer: "Yes. PALS is open to all healthcare providers. Taking it proactively shows initiative and can make you a more competitive candidate for pediatric positions." },
    ],
  },
  {
    slug: "nrp",
    name: "NRP",
    fullName: "Neonatal Resuscitation Program",
    org: "AAP",
    description: "Neonatal stabilization, resuscitation decision-making, positive pressure ventilation, and advanced neonatal interventions.",
    questionCount: "120+",
    icon: Baby,
    color: "pink",
    topics: [
      "Initial steps of neonatal resuscitation",
      "Positive pressure ventilation (PPV) technique",
      "Chest compressions in neonates",
      "Endotracheal intubation and laryngeal mask airway",
      "Umbilical venous catheterization",
      "Medication administration in neonatal resuscitation",
      "Special considerations (meconium, preterm infants)",
      "Post-resuscitation care and team debriefing",
    ],
    clinicalContext: "NRP is required for nurses working in Labor & Delivery, NICU, newborn nursery, and some emergency departments. The AAP (American Academy of Pediatrics) oversees this certification.",
    faq: [
      { question: "Is NRP required for L&D nurses?", answer: "Yes. NRP is universally required for nurses working in labor and delivery, NICU, and newborn nursery. Most hospitals require completion within the first 90 days of hire." },
      { question: "How is NRP different from PALS?", answer: "NRP focuses specifically on newborn resuscitation (first minutes to hours of life), while PALS covers pediatric emergencies for children beyond the neonatal period. Different algorithms and interventions apply." },
      { question: "How often is NRP renewed?", answer: "NRP certification is valid for 2 years. The renewal process includes an online exam and hands-on skills evaluation. Many hospitals offer NRP courses in-house." },
    ],
  },
  {
    slug: "tncc",
    name: "TNCC",
    fullName: "Trauma Nursing Core Course",
    org: "ENA",
    description: "Systematic trauma assessment, primary and secondary surveys, hemorrhage control, and multi-system trauma management.",
    questionCount: "160+",
    icon: Zap,
    color: "orange",
    topics: [
      "Primary survey (ABCDE) and rapid assessment",
      "Secondary survey and head-to-toe assessment",
      "Hemorrhage recognition and massive transfusion protocols",
      "Traumatic brain injury assessment and management",
      "Spinal cord injury stabilization",
      "Thoracic and abdominal trauma",
      "Musculoskeletal trauma and compartment syndrome",
      "Burns, blast injuries, and special populations",
    ],
    clinicalContext: "TNCC from the Emergency Nurses Association (ENA) is required or strongly encouraged for ER nurses, especially in trauma centers. It's typically required within 6 months of hire for emergency department nurses.",
    faq: [
      { question: "Is TNCC required for ER nurses?", answer: "Most trauma centers and many emergency departments require TNCC. Level I and II trauma centers almost universally require it. Some hospitals require it within 6-12 months of hire." },
      { question: "What's the TNCC course format?", answer: "TNCC is a 2-day course (approximately 16 hours) that includes lectures, skill stations, and a written exam. You must pass both the written test and demonstrate competency in trauma assessment scenarios." },
      { question: "How does TNCC compare to ATLS?", answer: "TNCC is designed for nurses while ATLS (Advanced Trauma Life Support) is for physicians. Both use systematic assessment approaches, but TNCC focuses on nursing-specific interventions and assessment skills." },
    ],
  },
  {
    slug: "enpc",
    name: "ENPC",
    fullName: "Emergency Nursing Pediatric Course",
    org: "ENA",
    description: "Pediatric emergency assessment, triage, stabilization, and family-centered care in the emergency setting.",
    questionCount: "140+",
    icon: Stethoscope,
    color: "emerald",
    topics: [
      "Pediatric assessment triangle and triage",
      "Respiratory emergencies in children",
      "Pediatric shock and fluid resuscitation",
      "Pediatric trauma assessment",
      "Child maltreatment recognition and reporting",
      "Toxicological emergencies in children",
      "Neonatal emergencies presenting to the ED",
      "Family-centered care and psychosocial considerations",
    ],
    clinicalContext: "ENPC is offered by the Emergency Nurses Association (ENA) and complements PALS for nurses working in emergency departments that see pediatric patients. It focuses on the emergency nursing perspective of pediatric care.",
    faq: [
      { question: "Do I need both PALS and ENPC?", answer: "Many EDs require PALS and recommend ENPC. PALS focuses on algorithms and medical management, while ENPC focuses on nursing assessment, triage, and family-centered care specific to the emergency setting." },
      { question: "Is ENPC required for pediatric ED nurses?", answer: "Most pediatric emergency departments require or strongly recommend ENPC. General EDs that see pediatric patients also increasingly require it, especially in larger systems." },
      { question: "What's the ENPC course format?", answer: "ENPC is a 2-day course with lectures, skill stations, and written evaluation. It covers pediatric-specific triage, assessment, and emergency nursing interventions." },
    ],
  },
  {
    slug: "cen",
    name: "CEN",
    fullName: "Certified Emergency Nurse",
    org: "BCEN",
    description: "Comprehensive emergency nursing certification — triage, trauma, cardiac emergencies, and the full spectrum of emergency care.",
    questionCount: "250+",
    icon: Scissors,
    color: "violet",
    topics: [
      "Cardiovascular emergencies (ACS, dysrhythmias, heart failure)",
      "Respiratory emergencies (PE, pneumothorax, asthma)",
      "Neurological emergencies (stroke, seizures, TBI)",
      "Gastrointestinal and genitourinary emergencies",
      "Orthopedic and wound emergencies",
      "Toxicological emergencies and substance abuse",
      "Environmental emergencies (heat stroke, hypothermia, bites)",
      "Professional issues (triage, disaster preparedness, legal/ethical)",
    ],
    clinicalContext: "The CEN from the Board of Certification for Emergency Nursing (BCEN) requires a minimum of 2 years of emergency nursing experience. It's a knowledge-based exam (not a course) that demonstrates ER expertise.",
    faq: [
      { question: "When can I sit for the CEN?", answer: "BCEN recommends 2 years of emergency nursing experience, though there is no strict hour requirement. Most nurses feel ready after 2-3 years of full-time ER work." },
      { question: "How hard is the CEN exam?", answer: "The CEN has a pass rate of approximately 60-70% for first-time test-takers. It's a 175-question computer-based exam covering all aspects of emergency nursing. Thorough preparation is essential." },
      { question: "Is CEN worth getting?", answer: "CEN certification demonstrates emergency nursing expertise, typically increases salary ($2,000-$5,000 annually), is often required for clinical ladder advancement, and can make you more competitive for leadership positions." },
    ],
  },
  {
    slug: "ccrn",
    name: "CCRN",
    fullName: "Critical-Care Registered Nurse",
    org: "AACN",
    description: "Gold standard ICU certification — hemodynamic monitoring, ventilator management, vasoactive medications, and complex critical care decision-making.",
    questionCount: "300+",
    icon: Activity,
    color: "rose",
    topics: [
      "Hemodynamic monitoring and waveform interpretation",
      "Mechanical ventilation modes and troubleshooting",
      "Vasoactive medication titration protocols",
      "Sepsis bundles and management",
      "Acute respiratory distress syndrome (ARDS)",
      "Acute kidney injury and CRRT",
      "Neurological critical care (ICP monitoring, stroke)",
      "Multisystem organ dysfunction and critical care pharmacology",
    ],
    clinicalContext: "The CCRN from the American Association of Critical-Care Nurses (AACN) is the most recognized ICU certification. It requires 1,750 hours of direct critical care experience within the past 2 years.",
    faq: [
      { question: "How long before I can sit for the CCRN?", answer: "You need 1,750 hours of direct adult critical care nursing experience in the 2 years preceding your application. Most new grads can sit for the exam after about 1.5-2 years of full-time ICU work." },
      { question: "What is the CCRN pass rate?", answer: "The CCRN pass rate is approximately 70-80% for first-time test-takers. Thorough preparation using practice questions and review courses significantly improves pass rates." },
      { question: "Is CCRN worth it for new ICU nurses?", answer: "Absolutely. CCRN certification demonstrates critical care expertise, often increases salary ($2,000-$10,000 annually), and is required for clinical ladder advancement at many hospitals." },
    ],
  },
];

const COLOR_MAP: Record<string, { bg: string; iconColor: string; border: string; badge: string }> = {
  red: { bg: "bg-red-50", iconColor: "text-red-600", border: "border-red-100", badge: "bg-red-100 text-red-700" },
  blue: { bg: "bg-blue-50", iconColor: "text-blue-600", border: "border-blue-100", badge: "bg-blue-100 text-blue-700" },
  sky: { bg: "bg-sky-50", iconColor: "text-sky-600", border: "border-sky-100", badge: "bg-sky-100 text-sky-700" },
  orange: { bg: "bg-orange-50", iconColor: "text-orange-600", border: "border-orange-100", badge: "bg-orange-100 text-orange-700" },
  pink: { bg: "bg-pink-50", iconColor: "text-pink-600", border: "border-pink-100", badge: "bg-pink-100 text-pink-700" },
  emerald: { bg: "bg-emerald-50", iconColor: "text-emerald-600", border: "border-emerald-100", badge: "bg-emerald-100 text-emerald-700" },
  rose: { bg: "bg-rose-50", iconColor: "text-rose-600", border: "border-rose-100", badge: "bg-rose-100 text-rose-700" },
  violet: { bg: "bg-violet-50", iconColor: "text-violet-600", border: "border-violet-100", badge: "bg-violet-100 text-violet-700" },
};

export default function NewGradCertificationsHub() {
  const { t } = useI18n();

  const WHY_CERTIFY = [
    { icon: ShieldCheck, titleKey: "newGrad.certs.why1Title", descKey: "newGrad.certs.why1Desc" },
    { icon: DollarSign, titleKey: "newGrad.certs.why2Title", descKey: "newGrad.certs.why2Desc" },
    { icon: TrendingUp, titleKey: "newGrad.certs.why3Title", descKey: "newGrad.certs.why3Desc" },
    { icon: Clock, titleKey: "newGrad.certs.why4Title", descKey: "newGrad.certs.why4Desc" },
  ];

  const FAQ_DATA = [
    { questionKey: "newGrad.certs.faq1Q", answerKey: "newGrad.certs.faq1A" },
    { questionKey: "newGrad.certs.faq2Q", answerKey: "newGrad.certs.faq2A" },
    { questionKey: "newGrad.certs.faq3Q", answerKey: "newGrad.certs.faq3A" },
    { questionKey: "newGrad.certs.faq4Q", answerKey: "newGrad.certs.faq4A" },
    { questionKey: "newGrad.certs.faq5Q", answerKey: "newGrad.certs.faq5A" },
    { questionKey: "newGrad.certs.faq6Q", answerKey: "newGrad.certs.faq6A" },
  ];

  const TIMELINE = [
    { phaseKey: "newGrad.certs.phase1", certsKey: "newGrad.certs.phase1Certs", descKey: "newGrad.certs.phase1Desc" },
    { phaseKey: "newGrad.certs.phase2", certsKey: "newGrad.certs.phase2Certs", descKey: "newGrad.certs.phase2Desc" },
    { phaseKey: "newGrad.certs.phase3", certsKey: "newGrad.certs.phase3Certs", descKey: "newGrad.certs.phase3Desc" },
    { phaseKey: "newGrad.certs.phase4", certsKey: "newGrad.certs.phase4Certs", descKey: "newGrad.certs.phase4Desc" },
  ];

  const faqForStructuredData = FAQ_DATA.map(f => ({ question: t(f.questionKey), answer: t(f.answerKey) }));
  const faqStructuredData = buildFaqStructuredData(faqForStructuredData);

  const courseStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "New Grad Nursing Certifications",
    "description": t("newGrad.certs.seoDescription"),
    "numberOfItems": NEWGRAD_CERTIFICATIONS.length,
    "itemListElement": NEWGRAD_CERTIFICATIONS.map((cert, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "EducationalOccupationalCredential",
        "name": `${cert.name} - ${cert.fullName}`,
        "description": cert.description,
        "credentialCategory": "Hospital Certification",
        "recognizedBy": { "@type": "Organization", "name": cert.org },
        "url": `https://www.nursenest.ca/newgrad/certifications/${cert.slug}`,
      },
    })),
  };

  return (
    <div data-testid="page-newgrad-certifications-hub">
      <Navigation />
      <SEO
        title={t("newGrad.certs.seoTitle")}
        description={t("newGrad.certs.seoDescription")}
        keywords="new grad certifications, ACLS certification, BLS certification, PALS certification, TNCC certification, NRP certification, CEN certification, CCRN certification, new nurse certifications, hospital certifications nursing"
        canonicalPath="/newgrad/certifications"
        structuredData={courseStructuredData}
        breadcrumbs={[
          { name: t("newGrad.common.home"), url: "https://www.nursenest.ca" },
          { name: t("newGrad.common.newGradHub"), url: "https://www.nursenest.ca/new-grad" },
          { name: t("newGrad.common.certifications"), url: "https://www.nursenest.ca/newgrad/certifications" },
        ]}
        additionalStructuredData={[faqStructuredData]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumb-nav">
            <Link href="/" className="hover:text-blue-600">{t("newGrad.common.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/newgrad" className="hover:text-blue-600">{t("newGrad.common.newGradHub")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-700 font-medium">{t("newGrad.common.certifications")}</span>
          </div>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 mb-4" data-testid="badge-certifications">
              <GraduationCap className="w-4 h-4" /> {t("newGrad.certs.badge")}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-page-title">
              {t("newGrad.certs.title")}
            </h1>
            <p className="text-lg text-gray-600 mb-8" data-testid="text-page-subtitle">
              {t("newGrad.certs.subtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#certifications" onClick={(e) => { e.preventDefault(); document.getElementById('certifications')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200" data-testid="button-explore-certs">
                {t("newGrad.certs.exploreCerts")} <ArrowRight className="w-4 h-4" />
              </a>
              <Link href="/newgrad" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors border border-blue-200" data-testid="button-new-grad-hub">
                {t("newGrad.common.newGradHub")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-why-certify">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center" data-testid="text-why-heading">{t("newGrad.certs.whyTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_CERTIFY.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 text-center" data-testid={`card-why-${i}`}>
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{t(item.titleKey)}</h3>
                <p className="text-sm text-gray-500">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" id="certifications" data-testid="section-certification-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-grid-heading">{t("newGrad.certs.gridTitle")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("newGrad.certs.gridDesc")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {NEWGRAD_CERTIFICATIONS.map((cert) => {
              const colors = COLOR_MAP[cert.color] || COLOR_MAP.blue;
              const hasPrepPage = ["bls", "acls", "pals", "nrp", "tncc", "enpc"].includes(cert.slug);
              return (
                <div key={cert.slug} className={`bg-white rounded-xl border ${colors.border} p-6 hover:shadow-md transition-all h-full`} data-testid={`card-cert-${cert.slug}`}>
                  <Link href={`/newgrad/certifications/${cert.slug}`} className="group">
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
                      <cert.icon className={`w-6 h-6 ${colors.iconColor}`} />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors" data-testid={`text-cert-name-${cert.slug}`}>
                        {cert.name}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{cert.org}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">{cert.fullName}</p>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{cert.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{cert.questionCount} {t("newGrad.common.questions")}</span>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                        {t("newGrad.common.studyGuide")} <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                  {hasPrepPage && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                      <Link href={`/certifications/${cert.slug}-prep`} className="flex-1 text-center text-xs font-medium px-2 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors" data-testid={`link-prep-${cert.slug}`}>
                        {t("newGrad.common.prepGuide")}
                      </Link>
                      <Link href={`/certifications/${cert.slug}-renewal-prep`} className="flex-1 text-center text-xs font-medium px-2 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors" data-testid={`link-renewal-${cert.slug}`}>
                        {t("newGrad.common.renewalPrep")}
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-timeline">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-timeline-heading">{t("newGrad.certs.timelineTitle")}</h2>
            <p className="text-gray-600">{t("newGrad.certs.timelineDesc")}</p>
          </div>
          <div className="space-y-4">
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex gap-4 items-start bg-white rounded-xl border border-gray-100 p-5" data-testid={`timeline-phase-${i}`}>
                <div className="w-32 shrink-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">{t(item.phaseKey)}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t(item.certsKey)}</h3>
                  <p className="text-sm text-gray-500">{t(item.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-cross-links">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center" data-testid="text-cross-heading">{t("newGrad.certs.relatedTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/nursing-certifications" className="bg-emerald-50 rounded-xl p-6 hover:bg-emerald-100 transition-colors group" data-testid="link-nursing-certs">
              <h3 className="font-semibold text-emerald-900 mb-1 group-hover:text-emerald-700">{t("newGrad.certs.relatedNursingCerts")}</h3>
              <p className="text-sm text-emerald-700/70">{t("newGrad.certs.relatedNursingCertsDesc")}</p>
            </Link>
            <Link href="/newgrad/guides" className="bg-violet-50 rounded-xl p-6 hover:bg-violet-100 transition-colors group" data-testid="link-guides">
              <h3 className="font-semibold text-violet-900 mb-1 group-hover:text-violet-700">{t("newGrad.certs.relatedGuides")}</h3>
              <p className="text-sm text-violet-700/70">{t("newGrad.certs.relatedGuidesDesc")}</p>
            </Link>
            <Link href="/free-practice" className="bg-blue-50 rounded-xl p-6 hover:bg-blue-100 transition-colors group" data-testid="link-test-bank">
              <h3 className="font-semibold text-blue-900 mb-1 group-hover:text-blue-700">{t("newGrad.certs.relatedPractice")}</h3>
              <p className="text-sm text-blue-700/70">{t("newGrad.certs.relatedPracticeDesc")}</p>
            </Link>
            <Link href="/flashcards" className="bg-amber-50 rounded-xl p-6 hover:bg-amber-100 transition-colors group" data-testid="link-flashcards">
              <h3 className="font-semibold text-amber-900 mb-1 group-hover:text-amber-700">{t("newGrad.certs.relatedFlashcards")}</h3>
              <p className="text-sm text-amber-700/70">{t("newGrad.certs.relatedFlashcardsDesc")}</p>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PremiumUpgradeCTA requiredEntitlement="certification" context="Unlock the full certification prep suite with practice question banks, mock exams, flashcard decks, and algorithm reviews for all nursing certifications." />
      </div>

      <section className="py-16 bg-white" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center" data-testid="text-faq-heading">{t("newGrad.certs.faqTitle")}</h2>
          <div className="space-y-3">
            {FAQ_DATA.map((faq, i) => (
              <FAQItem key={i} question={t(faq.questionKey)} answer={t(faq.answerKey)} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700" data-testid="section-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" data-testid="text-cta-heading">
            {t("newGrad.certs.ctaTitle")}
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            {t("newGrad.certs.ctaDesc")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/free-practice" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg" data-testid="button-cta-qbank">
              {t("newGrad.common.practiceQuestions")} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/subscribe/newgrad" className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-colors border border-blue-400" data-testid="button-cta-pricing">
              {t("newGrad.common.viewPricing")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${index}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors" data-testid={`button-faq-toggle-${index}`}>
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <HelpCircle className={`w-5 h-5 flex-shrink-0 transition-colors ${open ? 'text-blue-500' : 'text-gray-400'}`} />
      </button>
      {open && <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed" data-testid={`text-faq-answer-${index}`}>{answer}</div>}
    </div>
  );
}
