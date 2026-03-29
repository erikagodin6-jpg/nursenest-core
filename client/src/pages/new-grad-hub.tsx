import { useState } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import HeroFeatureStrip from "@/components/hero-feature-strip";
import HeroTrustIndicator from "@/components/hero-trust-indicator";
import { buildFaqStructuredData, PARENT_EDUCATIONAL_ORG } from "@/lib/structured-data";
import { PROFESSION_LIST } from "@/pages/new-grad/profession-data";
import { getCrossPlatformLinksForNewGrad } from "@/data/internal-links";
import { SocialProofBar } from "@/components/conversion-funnel";
import {
  ArrowRight, BookOpen, FileText, Brain, Zap, GraduationCap,
  CheckCircle2, ChevronRight, Check, X, HelpCircle,
  Briefcase, ClipboardList, Heart, Shield, Users, Clock,
  AlertTriangle, MessageSquare, Award, Target, Lightbulb,
  Star, TrendingUp, ChevronDown, Stethoscope, Activity,
  Baby, Scissors, Ribbon
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useI18n } from "@/lib/i18n";
const CERTIFICATION_GRID = [
  { name: "ACLS", desc: "Advanced Cardiovascular Life Support — cardiac arrest algorithms, post-ROSC care, and acute coronary syndromes.", href: "/newgrad/certifications/acls", icon: Heart, color: "bg-red-50 text-red-600 border-red-100" },
  { name: "BLS", desc: "Basic Life Support — high-quality CPR, AED operation, and team-based resuscitation.", href: "/newgrad/certifications/bls", icon: Activity, color: "bg-blue-50 text-blue-600 border-blue-100" },
  { name: "PALS", desc: "Pediatric Advanced Life Support — pediatric emergencies, respiratory distress, and shock management.", href: "/newgrad/certifications/pals", icon: Baby, color: "bg-sky-50 text-sky-600 border-sky-100" },
  { name: "TNCC", desc: "Trauma Nursing Core Course — systematic trauma assessment and injury management.", href: "/newgrad/certifications/tncc", icon: Zap, color: "bg-orange-50 text-orange-600 border-orange-100" },
  { name: "NRP", desc: "Neonatal Resuscitation Program — neonatal resuscitation steps and interventions.", href: "/newgrad/certifications/nrp", icon: Baby, color: "bg-pink-50 text-pink-600 border-pink-100" },
  { name: "CCRN", desc: "Critical-Care Registered Nurse — ICU hemodynamics, ventilator management, and vasoactive drips.", href: "/newgrad/certifications/ccrn", icon: Activity, color: "bg-rose-50 text-rose-600 border-rose-100" },
  { name: "Pediatric Nursing", desc: "Caring for infants, children, and adolescents across clinical settings.", href: "/certifications/cpn", icon: Baby, color: "bg-pink-50 text-pink-600 border-pink-100" },
  { name: "Cardiac Nursing", desc: "Cardiovascular care including ECG interpretation and heart failure management.", href: "/nursing-specialties/cardiac-nurse", icon: Heart, color: "bg-rose-50 text-rose-600 border-rose-100" },
  { name: "Mental Health Nursing", desc: "Psychiatric nursing, therapeutic communication, and crisis intervention.", href: "/nursing-specialties/mental-health-nurse", icon: Brain, color: "bg-teal-50 text-teal-600 border-teal-100" },
];

const SURVIVAL_GUIDES = [
  { title: "First-Year Survival Guide", desc: "Week-by-week roadmap from orientation through independent practice with milestone checklists and reflection prompts.", href: "/newgrad/guides", icon: Target },
  { title: "How to Handle Your First Code", desc: "Step-by-step guide for your first code blue — roles, algorithms, and how to manage the emotional aftermath.", href: "/newgrad/guides", icon: AlertTriangle },
  { title: "Charting Tips for New Nurses", desc: "Documentation strategies that save time, protect your license, and communicate effectively with the care team.", href: "/newgrad/guides", icon: FileText },
  { title: "Shift Organization Mastery", desc: "Brain sheets, time-blocking strategies, and prioritization frameworks to survive 12-hour shifts.", href: "/newgrad/workplace", icon: Clock },
  { title: "Time Management for New Grads", desc: "Evidence-based techniques for managing multi-patient assignments without falling behind.", href: "/newgrad/workplace", icon: ClipboardList },
];

const CAREER_GROWTH = [
  { title: "Nursing Certifications", desc: "Explore ACLS, BLS, PALS, TNCC, NRP, CEN, CCRN and other certifications to boost your career.", href: "/newgrad/certifications", icon: Award },
  { title: "Specialization Pathways", desc: "Map your journey from generalist to specialist — ICU, ER, oncology, pediatrics, and more.", href: "/nursing-specialties", icon: TrendingUp },
  { title: "Career Advancement", desc: "From clinical ladder progression to advanced practice roles — plan your next career move.", href: "/newgrad/career", icon: Lightbulb },
];

const FAQ_DATA = [
  { question: "Is this for Canadian or American nurses?", answer: "Both! Our interview prep, resume templates, and career transition content is designed for new graduate nurses in both Canada and the United States. We cover region-specific licensing requirements, job search strategies, and employer expectations for both countries." },
  { question: "Do I need this if I already have a job?", answer: "Absolutely. The First 90 Days Roadmap and Clinical Confidence Builder are specifically designed for nurses who have already landed their first position. These tools help you navigate orientation, build confidence during your transition period, and set yourself up for long-term success." },
  { question: "What if I'm an Internationally Educated Nurse (IEN)?", answer: "We include specific resources for IENs including bridging program guidance, credential evaluation tips, interview preparation for common IEN-specific questions, and cultural workplace navigation strategies for both Canadian and American healthcare systems." },
  { question: "How is this different from YouTube or free resources?", answer: "Free resources are scattered and generic. NurseNest provides a structured, sequential program with nursing-specific STAR framework training, ATS-optimized resume templates tested with actual healthcare recruiters, and interview questions sourced from real nurse manager hiring panels." },
  { question: "Can I use this while still in nursing school?", answer: "Yes! We recommend starting 3-6 months before graduation. Begin with resume building and interview prep during your final semester so you're ready to apply the moment you pass your licensing exam." },
  { question: "What types of certifications are covered?", answer: "We cover all major nursing certifications including CCRN (Critical Care), CEN (Emergency), OCN (Oncology), CNOR (Perioperative), CPN (Pediatric), PMH-BC (Mental Health), and Canadian CNA specialty certifications." },
];

const faqStructuredData = buildFaqStructuredData(
  FAQ_DATA.map(f => ({ question: f.question, answer: f.answer }))
);

const courseStructuredData = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "New Grad RN Transition Hub",
  "description": "Master your nursing career transition with interview prep, resume builder, cover letter tools, and first 90 days survival guide. Built for new graduate RNs.",
  "provider": {
    "@type": "EducationalOrganization",
    "name": "NurseNest",
    "url": "https://www.nursenest.ca",
    "parentOrganization": {
      "@type": "EducationalOrganization",
      "name": PARENT_EDUCATIONAL_ORG.name,
      "url": PARENT_EDUCATIONAL_ORG.url,
    },
  },
  "educationalLevel": "New Graduate Nurse",
  "about": "Nursing Career Transition",
  "inLanguage": "en",
  "url": "https://www.nursenest.ca/new-grad",
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "online",
    "courseWorkload": "PT10H",
  },
};

const articleStructuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "New Grad Hub - Career Launch Platform for Healthcare Professionals",
  "description": "Career transition resources for new graduate healthcare professionals. Nursing, paramedic, respiratory therapy, MLT, diagnostic imaging, and occupational therapy career guides.",
  "author": {
    "@type": "EducationalOrganization",
    "name": "NurseNest",
    "url": "https://www.nursenest.ca",
  },
  "publisher": {
    "@type": "EducationalOrganization",
    "name": "NurseNest",
    "url": "https://www.nursenest.ca",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.nursenest.ca/brand-logo.gif",
    },
    "parentOrganization": {
      "@type": "EducationalOrganization",
      "name": PARENT_EDUCATIONAL_ORG.name,
      "url": PARENT_EDUCATIONAL_ORG.url,
    },
  },
  "datePublished": "2025-01-15",
  "dateModified": new Date().toISOString().split("T")[0],
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.nursenest.ca/new-grad",
  },
  "isPartOf": {
    "@type": "WebSite",
    "name": PARENT_EDUCATIONAL_ORG.name,
    "url": PARENT_EDUCATIONAL_ORG.url,
  },
};

export default function NewGradHub() {
  const { t } = useI18n();
  return (
    <div data-testid="new-grad-hub-page">
      <Navigation />
      <SEO
        title={t("pages.newGradHub.newGradNursingHubFirstyear")}
        description={t("pages.newGradHub.launchYourNursingCareerWith")}
        keywords="new grad nurse survival guide, nursing certifications ACLS PALS CCRN, new graduate nurse first year, nursing specialty career path, new nurse clinical skills, first year nurse tips, nursing career development"
        canonicalPath="/new-grad"
        structuredData={courseStructuredData}
        additionalStructuredData={[faqStructuredData, articleStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "New Grad Hub", url: "https://www.nursenest.ca/new-grad" },
        ]}
      />

      <section className="relative py-16 sm:py-24 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/60 to-purple-50/30" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-indigo-100/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">{t("pages.newGradHub.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-700 font-medium">{t("pages.newGradHub.newGradHub")}</span>
          </div>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-blue-100 text-blue-700" data-testid="badge-new-grad">
              <GraduationCap className="w-4 h-4" />
              New Graduate Nurse
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 leading-tight" data-testid="text-hero-title">
              Build Lasting Clinical Confidence <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{t("pages.newGradHub.fromDayOne")}</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed" data-testid="text-hero-subtitle">
              Our structured learning system for new graduates uses active recall and clinical scenarios to reinforce the skills you need — from ACLS and PALS certification prep to first-year survival guides and career growth tools.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#certifications" onClick={(e) => { e.preventDefault(); document.getElementById('certifications')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200" data-testid="button-explore-certifications">
                Browse Certification Guides <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#survival-guides" onClick={(e) => { e.preventDefault(); document.getElementById('survival-guides')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors border border-blue-200" data-testid="button-survival-guides">
                Read First-Year Survival Guides
              </a>
            </div>
          </div>
        </div>
      </section>

      <HeroFeatureStrip />
      <HeroTrustIndicator />

      <section className="py-12 bg-white border-y border-gray-100" data-testid="section-stats">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div data-testid="stat-specialties">
              <div className="text-2xl font-bold text-gray-900">9+</div>
              <div className="text-sm text-gray-500">{t("pages.newGradHub.nursingSpecialties")}</div>
            </div>
            <div data-testid="stat-certifications">
              <div className="text-2xl font-bold text-gray-900">10+</div>
              <div className="text-sm text-gray-500">{t("pages.newGradHub.certificationsCovered")}</div>
            </div>
            <div data-testid="stat-guides">
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-500">{t("pages.newGradHub.careerGuides")}</div>
            </div>
            <div data-testid="stat-interview-questions">
              <div className="text-2xl font-bold text-gray-900">40+</div>
              <div className="text-sm text-gray-500">{t("pages.newGradHub.interviewQuestions")}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" id="certifications" data-testid="section-certifications-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-emerald-100 text-emerald-700">
              <Award className="w-4 h-4" /> Nursing Certifications
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-certifications-title">{t("pages.newGradHub.exploreNursingSpecialtiesCertifications")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.newGradHub.discoverTheRightSpecialtyFor")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CERTIFICATION_GRID.map((cert, i) => {
              const CertIcon = cert.icon;
              const [bgColor, textColor, borderColor] = cert.color.split(" ");
              return (
                <Link key={i} href={cert.href} className="group" data-testid={`card-cert-${i}`}>
                  <div className={`bg-white rounded-2xl border ${borderColor} p-6 hover:shadow-lg hover:border-blue-200 transition-all h-full`}>
                    <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center mb-4`}>
                      <CertIcon className={`w-6 h-6 ${textColor}`} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-700 transition-colors" data-testid={`text-cert-name-${i}`}>
                      {cert.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">{cert.desc}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">
                      Explore Specialty <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <Link href="/newgrad/certifications" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium" data-testid="link-all-certifications">
              View All Certification Guides <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" id="survival-guides" data-testid="section-survival-guides">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-blue-100 text-blue-700">
              <Shield className="w-4 h-4" /> New Nurse Survival
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-survival-title">{t("pages.newGradHub.newNurseSurvivalGuides")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.newGradHub.practicalEvidencebasedGuidesToHelp")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {SURVIVAL_GUIDES.map((guide, i) => {
              const GuideIcon = guide.icon;
              return (
                <Link key={i} href={guide.href} className="group" data-testid={`card-survival-${i}`}>
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition-all h-full">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <GuideIcon className="w-5.5 h-5.5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 mb-1.5 group-hover:text-blue-700 transition-colors">{guide.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{guide.desc}</p>
                        <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium mt-3">
                          Read Guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-indigo-50 via-blue-50/50 to-white" data-testid="section-career-growth">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-indigo-100 text-indigo-700">
              <TrendingUp className="w-4 h-4" /> Career Growth
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-career-growth-title">{t("pages.newGradHub.careerGrowthAdvancement")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.newGradHub.planYourLongtermNursingCareer")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {CAREER_GROWTH.map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <Link key={i} href={item.href} className="group" data-testid={`card-career-growth-${i}`}>
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-indigo-200 transition-all h-full text-center">
                    <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                      <ItemIcon className="w-7 h-7 text-indigo-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-indigo-700 transition-colors">{item.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{item.desc}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium">
                      Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" id="professions" data-testid="section-profession-hubs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-professions-title">{t("pages.newGradHub.chooseYourProfession")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.newGradHub.specializedCareerTransitionResourcesFor")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROFESSION_LIST.map((prof) => {
              const PIcon = prof.icon;
              return (
                <Link key={prof.slug} href={`/new-grad/${prof.slug}`} className="group" data-testid={`card-profession-${prof.slug}`}>
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition-all h-full">
                    <div className={`w-12 h-12 rounded-xl ${prof.badgeColor} flex items-center justify-center mb-4`}>
                      <PIcon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-700 transition-colors">{prof.name}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{prof.heroSubtitle}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {prof.certifications.slice(0, 3).map((cert, ci) => (
                        <span key={ci} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{cert}</span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">
                      Explore Hub <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-10 bg-gradient-to-r from-blue-50 via-indigo-50/40 to-purple-50/30" data-testid="section-journey-cta">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">{t("pages.newGradHub.completeCareerJourney")}</p>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{t("pages.newGradHub.seeTheFullPathExam")}</h3>
              <p className="text-sm text-gray-600">{t("pages.newGradHub.followTheStepbystepJourneyFrom")}</p>
            </div>
            <Link href="/career-journey" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm" data-testid="button-newgrad-journey-cta">
              Explore Career Paths <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white" data-testid="section-authority-guides">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t("pages.newGradHub.completeCareerGuides")}</h2>
          <p className="text-sm text-gray-600 mb-5">{t("pages.newGradHub.indepthGuidesCoveringTheFull")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { href: "/guides/complete-guide-to-becoming-a-registered-nurse", title: "RN Career Guide", desc: "NCLEX-RN, clinical transition & career" },
              { href: "/guides/complete-guide-to-becoming-an-rpn-lvn", title: "RPN/LVN Career Guide", desc: "REx-PN, scope of practice & career" },
              { href: "/guides/complete-guide-to-becoming-a-paramedic", title: "Paramedic Career Guide", desc: "NREMT/COPR, field transition & career" },
            ].map((g, i) => (
              <Link key={i} href={g.href} className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group" data-testid={`link-authority-guide-${i}`}>
                <BookOpen className="w-5 h-5 text-blue-500 shrink-0" />
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 block">{g.title}</span>
                  <span className="text-xs text-gray-500">{g.desc}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-3 text-center">
            <Link href="/guides" className="text-sm text-blue-600 hover:text-blue-800 font-medium" data-testid="link-all-guides">
              View All Career Guides →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-faq-title">{t("pages.newGradHub.frequentlyAskedQuestions")}</h2>
            <p className="text-gray-600">{t("pages.newGradHub.everythingYouNeedToKnow")}</p>
          </div>
          <div className="space-y-3">
            {FAQ_DATA.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700" data-testid="section-conversion">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" data-testid="text-conversion-title">
            Launch Your Nursing Career with Confidence
          </h2>
          <p className="text-blue-100 mb-3 text-lg">
            Certifications, survival guides, interview prep, and career tools — everything for your first year.
          </p>
          <p className="text-blue-200 mb-8 text-sm">
            Starting at $19/month or included with your RN subscription.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg" data-testid="button-cta-pricing">
              View Pricing <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/new-grad/readiness-quiz" className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-colors border border-blue-400" data-testid="button-cta-quiz">
              Free Readiness Quiz
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-blue-200 text-sm">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> {t("pages.newGradHub.14dayGuarantee")}</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4" /> {t("pages.newGradHub.cancelAnytime")}</span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8" data-testid="newgrad-social-proof">
        <SocialProofBar />
      </div>

      <Footer />
    </div>
  );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${index}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        data-testid={`button-faq-toggle-${index}`}
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <HelpCircle className={`w-5 h-5 flex-shrink-0 transition-colors ${open ? 'text-blue-500' : 'text-gray-400'}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed" data-testid={`text-faq-answer-${index}`}>
          {answer}
        </div>
      )}
    </div>
  );
}