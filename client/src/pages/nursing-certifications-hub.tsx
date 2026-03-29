import { Link } from "wouter";
import { useState } from "react";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import HeroFeatureStrip from "@/components/hero-feature-strip";
import HeroTrustIndicator from "@/components/hero-trust-indicator";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, Award, ShieldCheck, BookOpen, ChevronRight,
  HelpCircle, TrendingUp, Clock, DollarSign, GraduationCap,
  Stethoscope, Heart, Brain, Baby, Scissors, Ribbon, Activity,
  RefreshCw, Zap, ClipboardList, Layers, Users
} from "lucide-react";

const EMERGENCY_CERTS = [
  { slug: "bls", name: "BLS", fullName: "Basic Life Support", org: "AHA", icon: Activity, color: "blue", validity: "2 years", desc: "High-quality CPR, AED use, choking management, and team-based resuscitation for healthcare providers." },
  { slug: "acls", name: "ACLS", fullName: "Advanced Cardiovascular Life Support", org: "AHA", icon: Heart, color: "red", validity: "2 years", desc: "Cardiac arrest algorithms, rhythm recognition, acute coronary syndromes, stroke management, and pharmacology." },
  { slug: "pals", name: "PALS", fullName: "Pediatric Advanced Life Support", org: "AHA", icon: Baby, color: "sky", validity: "2 years", desc: "Pediatric assessment triangle, weight-based dosing, respiratory emergencies, shock, and cardiac arrest in children." },
  { slug: "nrp", name: "NRP", fullName: "Neonatal Resuscitation Program", org: "AAP", icon: Baby, color: "pink", validity: "2 years", desc: "Delivery room resuscitation — initial steps, positive pressure ventilation, chest compressions, and epinephrine." },
  { slug: "tncc", name: "TNCC", fullName: "Trauma Nursing Core Course", org: "ENA", icon: Zap, color: "orange", validity: "4 years", desc: "Systematic trauma assessment, hemorrhage control, massive transfusion protocols, and evidence-based trauma care." },
  { slug: "enpc", name: "ENPC", fullName: "Emergency Nursing Pediatric Course", org: "ENA", icon: Baby, color: "violet", validity: "4 years", desc: "Pediatric triage, respiratory emergencies, trauma assessment, child maltreatment recognition, and stabilization." },
];

const SPECIALTY_CERTS = [
  { slug: "ccrn", name: "CCRN", fullName: "Critical-Care Registered Nurse", org: "AACN", icon: Activity, color: "red" },
  { slug: "cen", name: "CEN", fullName: "Certified Emergency Nurse", org: "BCEN", icon: Stethoscope, color: "orange" },
  { slug: "cmsrn", name: "CMSRN", fullName: "Certified Med-Surg Nurse", org: "MSNCB", icon: Heart, color: "blue" },
  { slug: "ocn", name: "OCN", fullName: "Oncology Certified Nurse", org: "ONCC", icon: Ribbon, color: "purple" },
  { slug: "cnor", name: "CNOR", fullName: "Certified Perioperative Nurse", org: "CCI", icon: Scissors, color: "indigo" },
  { slug: "cpn", name: "CPN", fullName: "Certified Pediatric Nurse", org: "PNCB", icon: Baby, color: "sky" },
  { slug: "pmh-bc", name: "PMH-BC", fullName: "Psychiatric-Mental Health", org: "ANCC", icon: Brain, color: "teal" },
  { slug: "cna-critical-care", name: "CNA-CC", fullName: "CNA Critical Care (Canada)", org: "CNA", icon: Activity, color: "rose" },
  { slug: "cna-emergency", name: "CNA-ER", fullName: "CNA Emergency (Canada)", org: "CNA", icon: Stethoscope, color: "amber" },
  { slug: "canadian-np-exam", name: "CNPLE", fullName: "Canadian NP Licensing Exam", org: "CCRNR", icon: GraduationCap, color: "emerald" },
];

const COLOR_MAP: Record<string, { bg: string; iconColor: string; border: string }> = {
  red: { bg: "bg-red-50", iconColor: "text-red-600", border: "border-red-100" },
  orange: { bg: "bg-orange-50", iconColor: "text-orange-600", border: "border-orange-100" },
  blue: { bg: "bg-blue-50", iconColor: "text-blue-600", border: "border-blue-100" },
  purple: { bg: "bg-purple-50", iconColor: "text-purple-600", border: "border-purple-100" },
  indigo: { bg: "bg-indigo-50", iconColor: "text-indigo-600", border: "border-indigo-100" },
  sky: { bg: "bg-sky-50", iconColor: "text-sky-600", border: "border-sky-100" },
  teal: { bg: "bg-teal-50", iconColor: "text-teal-600", border: "border-teal-100" },
  rose: { bg: "bg-rose-50", iconColor: "text-rose-600", border: "border-rose-100" },
  amber: { bg: "bg-amber-50", iconColor: "text-amber-600", border: "border-amber-100" },
  emerald: { bg: "bg-emerald-50", iconColor: "text-emerald-600", border: "border-emerald-100" },
  pink: { bg: "bg-pink-50", iconColor: "text-pink-600", border: "border-pink-100" },
  violet: { bg: "bg-violet-50", iconColor: "text-violet-600", border: "border-violet-100" },
};

const FAQ_DATA = [
  { question: "How do I choose which nursing certification to pursue?", answer: "Choose based on your clinical specialty and career goals. Start with required certifications for your unit (BLS is universal, ACLS for acute care, PALS for pediatrics). Then pursue specialty certifications like CCRN or CEN after gaining clinical experience." },
  { question: "Are nursing certifications required to practice?", answer: "BLS is required for all nursing positions. ACLS, PALS, NRP, TNCC, and ENPC are required by specific units. Specialty certifications like CCRN, CEN, and CNOR are voluntary but strongly preferred by employers and required for clinical ladder advancement at many hospitals." },
  { question: "How long does it take to prepare for a certification exam?", answer: "Course-based certifications (BLS: 1 day, ACLS/PALS: 2 days, TNCC/ENPC: 2 days) include instruction time. Knowledge-based exams like CCRN and CEN typically require 6-12 weeks of self-study while working full-time." },
  { question: "Do nursing certifications increase salary?", answer: "Yes. Most hospitals offer certification pay differentials ranging from $1,000 to $10,000 annually. CCRN, CEN, and CNOR certifications typically command the highest premiums. Certifications also strengthen your position for leadership roles." },
  { question: "What is the difference between course certifications and exam certifications?", answer: "Course certifications (BLS, ACLS, PALS, NRP, TNCC, ENPC) are earned by completing a structured course with skills testing. Exam certifications (CCRN, CEN, CMSRN, etc.) require passing a comprehensive knowledge exam and typically require clinical experience hours." },
  { question: "How often do certifications need to be renewed?", answer: "BLS, ACLS, PALS, and NRP renew every 2 years. TNCC and ENPC renew every 4 years. Specialty certifications like CCRN and CEN are valid for 3-5 years and renew through continuing education, practice hours, or re-examination." },
  { question: "Are US certifications recognized in Canada?", answer: "BLS, ACLS, PALS, and NRP are recognized across North America. US specialty certifications like CCRN and CEN are recognized by many Canadian employers but are not equivalent to CNA specialty certifications. Canadian nurses may hold both." },
  { question: "What certifications should new graduate nurses get first?", answer: "BLS before day one (usually done in nursing school). ACLS within 90 days for acute care. PALS within 6 months for pediatric/ED units. NRP for labor & delivery. TNCC for trauma/ED. Specialty certifications after 1-2 years of experience." },
];

const WHY_CERTIFY = [
  { icon: DollarSign, title: "Higher Earning Potential", desc: "Certified nurses earn $3,000-$10,000 more annually" },
  { icon: TrendingUp, title: "Career Advancement", desc: "Required for leadership and clinical educator roles" },
  { icon: ShieldCheck, title: "Professional Credibility", desc: "Recognized expertise validated by national organizations" },
  { icon: Clock, title: "Magnet Recognition", desc: "Contributes to hospital Magnet designation requirements" },
];

export default function NursingCertificationsHub() {
  const { t } = useI18n();
  const faqStructuredData = buildFaqStructuredData(FAQ_DATA);

  return (
    <div data-testid="page-nursing-certifications-hub">
      <Navigation />
      <SEO
        title={t("pages.nursingCertificationsHub.nursingCertificationsGuideBlsAcls")}
        description={t("pages.nursingCertificationsHub.completeGuideToNursingCertifications")}
        keywords="nursing certifications, BLS certification, ACLS certification, PALS certification, NRP certification, TNCC certification, ENPC certification, CCRN certification, CEN certification, nursing specialty certification, certification exam prep, certification renewal"
        canonicalPath="/nursing-certifications"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Nursing Certifications Guide",
          "description": "Complete guide to nursing certifications including BLS, ACLS, PALS, NRP, TNCC, ENPC, CCRN, CEN, CMSRN, OCN, CNOR, and Canadian CNA specialty certifications.",
          "provider": { "@type": "Organization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
        }}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Nursing Certifications", url: "https://www.nursenest.ca/nursing-certifications" },
        ]}
        additionalStructuredData={[faqStructuredData]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumb-nav">
            <Link href="/" className="hover:text-emerald-600">{t("pages.nursingCertificationsHub.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-700 font-medium">{t("pages.nursingCertificationsHub.nursingCertifications")}</span>
          </div>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700 mb-4" data-testid="badge-certifications">
              <Award className="w-4 h-4" /> Certification Hub
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-page-title">
              Retain What You Study. Pass Your Certification.
            </h1>
            <p className="text-lg text-gray-600 mb-8" data-testid="text-page-subtitle">
              Our retention-focused learning system helps you prepare for every nursing certification — from BLS, ACLS, and PALS to CCRN, CEN, and CNOR — using active recall, spaced repetition, and exam blueprint alignment to build lasting knowledge.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#emergency-certs" onClick={(e) => { e.preventDefault(); document.getElementById('emergency-certs')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200" data-testid="button-emergency-certs">
                Life Support Certifications <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#specialty-certs" onClick={(e) => { e.preventDefault(); document.getElementById('specialty-certs')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-colors border border-emerald-200" data-testid="button-specialty-certs">
                Specialty Certifications
              </a>
            </div>
          </div>
        </div>
      </section>

      <HeroFeatureStrip />
      <HeroTrustIndicator />

      <section className="py-16" data-testid="section-why-certify">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center" data-testid="text-why-heading">{t("pages.nursingCertificationsHub.whyGetCertified")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_CERTIFY.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 text-center" data-testid={`card-why-${i}`}>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" id="emergency-certs" data-testid="section-emergency-certs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-emergency-heading">{t("pages.nursingCertificationsHub.lifeSupportEmergencyCertifications")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.nursingCertificationsHub.coursebasedCertificationsRequiredByHospitals")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {EMERGENCY_CERTS.map((cert) => {
              const colors = COLOR_MAP[cert.color] || COLOR_MAP.blue;
              return (
                <div key={cert.slug} className={`bg-white rounded-xl border ${colors.border} p-6 hover:shadow-md transition-all`} data-testid={`card-emergency-${cert.slug}`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <cert.icon className={`w-6 h-6 ${colors.iconColor}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-lg" data-testid={`text-cert-name-${cert.slug}`}>{cert.name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{cert.org}</span>
                      </div>
                      <p className="text-sm text-gray-500">{cert.fullName}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{cert.desc}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Renews every {cert.validity}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/certifications/${cert.slug}-prep`} className="flex-1 text-center text-sm font-medium px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors" data-testid={`link-prep-${cert.slug}`}>
                      Prep Guide
                    </Link>
                    <Link href={`/certifications/${cert.slug}-renewal-prep`} className="flex-1 text-center text-sm font-medium px-3 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors" data-testid={`link-renewal-${cert.slug}`}>
                      Renewal Prep
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <Link href="/newgrad/certifications" className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors" data-testid="link-newgrad-certs">
              <GraduationCap className="w-4 h-4" /> New graduate? See the certification timeline for your first year <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-comparison">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-comparison-heading">{t("pages.nursingCertificationsHub.certificationAtAGlance")}</h2>
            <p className="text-gray-600">{t("pages.nursingCertificationsHub.quickComparisonOfLifeSupport")}</p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm" data-testid="table-comparison">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-900">{t("pages.nursingCertificationsHub.certification")}</th>
                  <th className="px-4 py-3 font-semibold text-gray-900">{t("pages.nursingCertificationsHub.organization")}</th>
                  <th className="px-4 py-3 font-semibold text-gray-900">{t("pages.nursingCertificationsHub.validity")}</th>
                  <th className="px-4 py-3 font-semibold text-gray-900">{t("pages.nursingCertificationsHub.requiredFor")}</th>
                  <th className="px-4 py-3 font-semibold text-gray-900">{t("pages.nursingCertificationsHub.links")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { name: "BLS", org: "AHA", validity: "2 years", required: "All nursing positions", slug: "bls" },
                  { name: "ACLS", org: "AHA", validity: "2 years", required: "ICU, ER, Telemetry, Step-down", slug: "acls" },
                  { name: "PALS", org: "AHA", validity: "2 years", required: "Pediatric units, ED", slug: "pals" },
                  { name: "NRP", org: "AAP", validity: "2 years", required: "L&D, NICU, Newborn Nursery", slug: "nrp" },
                  { name: "TNCC", org: "ENA", validity: "4 years", required: "Trauma centers, ED", slug: "tncc" },
                  { name: "ENPC", org: "ENA", validity: "4 years", required: "Pediatric ED, General ED", slug: "enpc" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50" data-testid={`row-comparison-${row.slug}`}>
                    <td className="px-4 py-3 font-semibold text-gray-900">{row.name}</td>
                    <td className="px-4 py-3 text-gray-600">{row.org}</td>
                    <td className="px-4 py-3 text-gray-600">{row.validity}</td>
                    <td className="px-4 py-3 text-gray-600">{row.required}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/certifications/${row.slug}-prep`} className="text-emerald-600 hover:text-emerald-700 font-medium" data-testid={`table-link-prep-${row.slug}`}>{t("pages.nursingCertificationsHub.prep")}</Link>
                        <span className="text-gray-300">|</span>
                        <Link href={`/certifications/${row.slug}-renewal-prep`} className="text-emerald-600 hover:text-emerald-700 font-medium" data-testid={`table-link-renewal-${row.slug}`}>{t("pages.nursingCertificationsHub.renewal")}</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" id="specialty-certs" data-testid="section-specialty-certs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-specialty-heading">{t("pages.nursingCertificationsHub.specialtyNursingCertifications")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.nursingCertificationsHub.knowledgebasedExamsThatValidateExpertise")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SPECIALTY_CERTS.map((cert) => {
              const colors = COLOR_MAP[cert.color] || COLOR_MAP.blue;
              return (
                <Link key={cert.slug} href={`/certifications/${cert.slug}`} className="group" data-testid={`card-cert-${cert.slug}`}>
                  <div className={`bg-white rounded-xl border ${colors.border} p-6 hover:shadow-md transition-all h-full`}>
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
                      <cert.icon className={`w-6 h-6 ${colors.iconColor}`} />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors" data-testid={`text-cert-name-${cert.slug}`}>
                        {cert.name}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{cert.org}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{cert.fullName}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 group-hover:gap-2 transition-all">
                      View Guide <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-study-tools">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-tools-heading">{t("pages.nursingCertificationsHub.studyToolsForCertificationPrep")}</h2>
            <p className="text-gray-600">{t("pages.nursingCertificationsHub.everythingYouNeedToPrepare")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/free-practice" className="group" data-testid="link-tool-practice">
              <div className="bg-white rounded-xl border border-emerald-100 p-5 hover:shadow-md transition-all h-full text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                  <ClipboardList className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">{t("pages.nursingCertificationsHub.practiceQuestions")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingCertificationsHub.thousandsOfQuestionsAlignedTo")}</p>
              </div>
            </Link>
            <Link href="/flashcards" className="group" data-testid="link-tool-flashcards">
              <div className="bg-white rounded-xl border border-emerald-100 p-5 hover:shadow-md transition-all h-full text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                  <Layers className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">{t("pages.nursingCertificationsHub.flashcards")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingCertificationsHub.spacedrepetitionDecksForAlgorithmsMedication")}</p>
              </div>
            </Link>
            <Link href="/lessons" className="group" data-testid="link-tool-lessons">
              <div className="bg-white rounded-xl border border-emerald-100 p-5 hover:shadow-md transition-all h-full text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">{t("pages.nursingCertificationsHub.lessons")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingCertificationsHub.indepthClinicalLessonsCoveringCertification")}</p>
              </div>
            </Link>
            <Link href="/mock-exams" className="group" data-testid="link-tool-mocks">
              <div className="bg-white rounded-xl border border-emerald-100 p-5 hover:shadow-md transition-all h-full text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">{t("pages.nursingCertificationsHub.mockExams")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingCertificationsHub.timedPracticeExamsSimulatingReal")}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-cross-links">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center" data-testid="text-cross-heading">{t("pages.nursingCertificationsHub.relatedResources")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/healthcare-certifications" className="bg-teal-50 rounded-xl p-6 hover:bg-teal-100 transition-colors group" data-testid="link-healthcare-certs">
              <h3 className="font-semibold text-teal-900 mb-1 group-hover:text-teal-700">{t("pages.nursingCertificationsHub.healthcareCertificationsDatabase")}</h3>
              <p className="text-sm text-teal-700/70">{t("pages.nursingCertificationsHub.detailedGuidesWithEligibilityExam")}</p>
            </Link>
            <Link href="/rn" className="bg-blue-50 rounded-xl p-6 hover:bg-blue-100 transition-colors group" data-testid="link-rn-tier">
              <h3 className="font-semibold text-blue-900 mb-1 group-hover:text-blue-700">{t("pages.nursingCertificationsHub.rnExamPrep")}</h3>
              <p className="text-sm text-blue-700/70">{t("pages.nursingCertificationsHub.nclexrnPreparationWithPracticeQuestions")}</p>
            </Link>
            <Link href="/np" className="bg-indigo-50 rounded-xl p-6 hover:bg-indigo-100 transition-colors group" data-testid="link-np-tier">
              <h3 className="font-semibold text-indigo-900 mb-1 group-hover:text-indigo-700">{t("pages.nursingCertificationsHub.npExamPrep")}</h3>
              <p className="text-sm text-indigo-700/70">{t("pages.nursingCertificationsHub.nursePractitionerCertificationExamPreparation")}</p>
            </Link>
            <Link href="/emergency-nursing-specialty" className="bg-orange-50 rounded-xl p-6 hover:bg-orange-100 transition-colors group" data-testid="link-emergency-nursing">
              <h3 className="font-semibold text-orange-900 mb-1 group-hover:text-orange-700">{t("pages.nursingCertificationsHub.emergencyNursing")}</h3>
              <p className="text-sm text-orange-700/70">{t("pages.nursingCertificationsHub.emergencyDepartmentNursingResourcesTncc")}</p>
            </Link>
            <Link href="/critical-care-specialty" className="bg-red-50 rounded-xl p-6 hover:bg-red-100 transition-colors group" data-testid="link-critical-care">
              <h3 className="font-semibold text-red-900 mb-1 group-hover:text-red-700">{t("pages.nursingCertificationsHub.criticalCareNursing")}</h3>
              <p className="text-sm text-red-700/70">{t("pages.nursingCertificationsHub.icuNursingResourcesCcrnPrep")}</p>
            </Link>
            <Link href="/guides" className="bg-violet-50 rounded-xl p-6 hover:bg-violet-100 transition-colors group" data-testid="link-study-guides">
              <h3 className="font-semibold text-violet-900 mb-1 group-hover:text-violet-700">{t("pages.nursingCertificationsHub.studyGuides")}</h3>
              <p className="text-sm text-violet-700/70">{t("pages.nursingCertificationsHub.comprehensiveStudyGuidesForIcu")}</p>
            </Link>
            <Link href="/newgrad/certifications" className="bg-emerald-50 rounded-xl p-6 hover:bg-emerald-100 transition-colors group" data-testid="link-newgrad-hub">
              <h3 className="font-semibold text-emerald-900 mb-1 group-hover:text-emerald-700">{t("pages.nursingCertificationsHub.newGradCertificationGuide")}</h3>
              <p className="text-sm text-emerald-700/70">{t("pages.nursingCertificationsHub.certificationTimelineAndStudyStrategies")}</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center" data-testid="text-faq-heading">{t("pages.nursingCertificationsHub.certificationFaqs")}</h2>
          <div className="space-y-3">
            {FAQ_DATA.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-emerald-600 to-teal-700" data-testid="section-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" data-testid="text-cta-heading">
            Start Your Certification Journey
          </h2>
          <p className="text-emerald-100 mb-8 text-lg">
            Practice questions, flashcards, and study tools aligned to every major nursing certification exam.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/free-practice" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-emerald-700 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg" data-testid="button-cta-qbank">
              Practice Questions <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-400 transition-colors border border-emerald-400" data-testid="button-cta-pricing">
              View Pricing
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
        <HelpCircle className={`w-5 h-5 flex-shrink-0 transition-colors ${open ? 'text-emerald-500' : 'text-gray-400'}`} />
      </button>
      {open && <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed" data-testid={`text-faq-answer-${index}`}>{answer}</div>}
    </div>
  );
}
