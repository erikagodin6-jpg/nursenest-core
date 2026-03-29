import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, BookOpen, GraduationCap, DollarSign,
  Clock, Stethoscope, Award, CheckCircle2, MapPin, TrendingUp
} from "lucide-react";

interface CareerTrackInfo {
  slug: string;
  title: string;
  fullTitle: string;
  description: string;
  heroSubtitle: string;
  examName: string;
  educationLength: string;
  salaryRange: string;
  salaryMedian: string;
  growthRate: string;
  steps: { title: string; description: string }[];
  examInfo: { name: string; sections: string[]; passingScore: string; format: string };
  skills: string[];
  workSettings: string[];
  ctaPath: string;
  relatedTracks: { slug: string; title: string; description: string }[];
}

const CAREER_TRACKS: Record<string, CareerTrackInfo> = {
  rpn: {
    slug: "rpn",
    title: "RPN / LVN",
    fullTitle: "Registered Practical Nurse (RPN) / Licensed Vocational Nurse (LVN)",
    description: "Registered Practical Nurses (RPNs) in Canada and Licensed Vocational Nurses (LVNs) in the US provide essential direct patient care under the direction of registered nurses and physicians. They are vital members of the healthcare team.",
    heroSubtitle: "Start your nursing career with practical, hands-on patient care training",
    examName: "NCLEX-PN / REx-PN",
    educationLength: "12-18 months",
    salaryRange: "$42,000 - $62,000",
    salaryMedian: "$52,000",
    growthRate: "6%",
    steps: [
      { title: "Complete a Practical Nursing Program", description: "Enroll in an accredited 12-18 month practical nursing diploma or certificate program. These programs combine classroom instruction with clinical rotations in hospitals, long-term care, and community settings." },
      { title: "Pass the Licensing Exam", description: "In the US, pass the NCLEX-PN exam. In Canada, pass the REx-PN (Regulatory Exam - Practical Nurse). Both exams use computerized adaptive testing (CAT) to assess nursing competency." },
      { title: "Apply for State/Provincial Licensure", description: "After passing the exam, apply for licensure with your state board of nursing (US) or provincial regulatory body (Canada). Requirements may include a background check and proof of education." },
      { title: "Begin Your Career", description: "Start working in hospitals, long-term care facilities, clinics, home health, or community settings. Many RPNs/LVNs later pursue further education to become RNs." },
    ],
    examInfo: {
      name: "NCLEX-PN / REx-PN",
      sections: ["Safe and Effective Care Environment", "Health Promotion and Maintenance", "Psychosocial Integrity", "Physiological Integrity"],
      passingScore: "Computerized Adaptive Testing (CAT) - passing standard set by NCSBN",
      format: "85-150 questions (NCLEX-PN) / 170 questions (REx-PN), multiple choice with select-all-that-apply",
    },
    skills: [
      "Medication administration", "Vital signs monitoring", "Wound care and dressing changes",
      "Patient hygiene and comfort care", "Documentation and charting", "IV therapy (in some jurisdictions)",
      "Patient education", "Blood glucose monitoring", "Catheter care", "Specimen collection",
    ],
    workSettings: ["Hospitals", "Long-term care facilities", "Home health agencies", "Clinics and physician offices", "Rehabilitation centers", "Community health centers"],
    ctaPath: "/start-free",
    relatedTracks: [
      { slug: "rn", title: "Registered Nurse (RN)", description: "Advance your career with a broader scope of practice and higher earning potential." },
      { slug: "np", title: "Nurse Practitioner (NP)", description: "Reach the highest level of nursing practice with prescriptive authority." },
    ],
  },
  rn: {
    slug: "rn",
    title: "Registered Nurse (RN)",
    fullTitle: "Registered Nurse (RN)",
    description: "Registered Nurses are the backbone of healthcare, providing and coordinating patient care, educating patients about health conditions, and providing emotional support. RNs work in diverse settings from critical care to community health.",
    heroSubtitle: "Join the largest healthcare profession and make a difference every day",
    examName: "NCLEX-RN",
    educationLength: "2-4 years",
    salaryRange: "$60,000 - $95,000",
    salaryMedian: "$77,600",
    growthRate: "9%",
    steps: [
      { title: "Earn a Nursing Degree", description: "Complete either an Associate Degree in Nursing (ADN, 2 years) or a Bachelor of Science in Nursing (BSN, 4 years). BSN graduates have broader career opportunities and many employers prefer or require a BSN." },
      { title: "Pass the NCLEX-RN Exam", description: "After graduating from an accredited program, take and pass the NCLEX-RN exam. This computerized adaptive test assesses your readiness for safe, entry-level nursing practice." },
      { title: "Obtain State/Provincial Licensure", description: "Apply to your state board of nursing or provincial regulatory body for RN licensure. Requirements include passing the NCLEX-RN, background checks, and proof of education from an approved program." },
      { title: "Choose Your Specialty", description: "RNs can specialize in areas like critical care (CCRN), emergency nursing (CEN), pediatrics (CPN), oncology (OCN), or many other specialties through additional certification and experience." },
    ],
    examInfo: {
      name: "NCLEX-RN",
      sections: ["Safe and Effective Care Environment (Management of Care, Safety)", "Health Promotion and Maintenance", "Psychosocial Integrity", "Physiological Integrity (Basic Care, Pharmacological, Reduction of Risk, Physiological Adaptation)"],
      passingScore: "CAT - logit score above passing standard (revised every 3 years by NCSBN)",
      format: "75-145 questions, multiple choice, select-all-that-apply, hot spot, drag-and-drop, and NGN case studies",
    },
    skills: [
      "Advanced patient assessment", "Critical thinking and clinical judgment", "Medication management",
      "IV therapy and blood administration", "Care coordination and delegation", "Patient and family education",
      "Emergency response", "Evidence-based practice", "Interdisciplinary collaboration", "Leadership and advocacy",
    ],
    workSettings: ["Hospitals (medical-surgical, ICU, ER)", "Outpatient clinics", "Schools and universities", "Public health departments", "Home health", "Telehealth", "Research facilities", "Travel nursing"],
    ctaPath: "/start-free",
    relatedTracks: [
      { slug: "rpn", title: "RPN / LVN", description: "A stepping stone into nursing with shorter education requirements." },
      { slug: "np", title: "Nurse Practitioner (NP)", description: "Advance to the highest level of nursing with prescriptive authority and independent practice." },
    ],
  },
  np: {
    slug: "np",
    title: "Nurse Practitioner (NP)",
    fullTitle: "Nurse Practitioner (NP)",
    description: "Nurse Practitioners are advanced practice registered nurses (APRNs) who provide primary, acute, and specialty healthcare. NPs can diagnose conditions, prescribe medications, order tests, and in many states/provinces practice independently.",
    heroSubtitle: "Lead healthcare as an advanced practice provider with full prescriptive authority",
    examName: "AANP / ANCC Certification",
    educationLength: "6-8 years total",
    salaryRange: "$95,000 - $140,000",
    salaryMedian: "$121,610",
    growthRate: "40%",
    steps: [
      { title: "Earn a BSN Degree", description: "Start with a Bachelor of Science in Nursing (BSN). If you already have an RN license with an ADN, many RN-to-BSN bridge programs are available, often completed in 12-18 months online." },
      { title: "Gain Clinical Experience as an RN", description: "Most NP programs require 1-2 years of RN clinical experience. Many NPs gain experience in acute care, emergency, or specialty settings before applying to graduate programs." },
      { title: "Complete an MSN or DNP Program", description: "Enroll in a Master of Science in Nursing (MSN) or Doctor of Nursing Practice (DNP) program with an NP track. Programs typically take 2-4 years and include 500-1,000+ clinical hours." },
      { title: "Pass National Certification", description: "After graduating, pass the AANP (American Association of Nurse Practitioners) or ANCC (American Nurses Credentialing Center) certification exam in your specialty area." },
      { title: "Obtain APRN Licensure", description: "Apply for Advanced Practice Registered Nurse (APRN) licensure in your state or province. Requirements vary; 26 US states plus DC allow full practice authority for NPs." },
    ],
    examInfo: {
      name: "AANP / ANCC Family NP Certification",
      sections: ["Assessment and Diagnosis", "Clinical Management (Pharmacological and Non-pharmacological)", "Health Promotion and Disease Prevention", "Professional Role and Policy", "Research and Evidence-Based Practice"],
      passingScore: "AANP: 500/800 scaled score; ANCC: 350/500 scaled score",
      format: "150 questions (AANP) / 175 questions (ANCC), multiple choice, 3 hours",
    },
    skills: [
      "Autonomous patient assessment and diagnosis", "Prescriptive authority (medications, treatments)", "Ordering and interpreting diagnostic tests",
      "Performing procedures (suturing, biopsies, joint injections)", "Chronic disease management", "Health promotion and disease prevention",
      "Differential diagnosis", "Evidence-based clinical decision making", "Collaborative practice and referral", "Patient advocacy and policy influence",
    ],
    workSettings: ["Primary care clinics", "Specialty practices (cardiology, dermatology, psychiatry)", "Hospitals and acute care", "Urgent care centers", "Retail health clinics", "Telehealth platforms", "Academic institutions", "Independent practice (in full practice authority states)"],
    ctaPath: "/start-free",
    relatedTracks: [
      { slug: "rpn", title: "RPN / LVN", description: "The entry point into nursing practice with practical training." },
      { slug: "rn", title: "Registered Nurse (RN)", description: "The foundational nursing role required before advancing to NP." },
    ],
  },
};

export default function NursingCareerPage() {
  const { t } = useI18n();
  const params = useParams<{ track: string }>();
  const track = params.track || "rpn";
  const info = CAREER_TRACKS[track];

  if (!info) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.nursingCareerPages.careerTrackNotFound")}</h1>
        <p className="text-gray-600 mb-4">{t("pages.nursingCareerPages.theNursingCareerTrackYoure")}</p>
        <Link href="/" className="inline-block px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="link-back-home">
          Go Home
        </Link>
      </div>
    );
  }

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "How to Become a Nurse", href: "/how-to-become-a-nurse/rpn" },
    { label: info.title, href: `/how-to-become-a-nurse/${info.slug}` },
  ];

  const parseSalaryNumber = (s: string): number => parseInt(s.replace(/[^0-9]/g, ""), 10) || 0;
  const salaryParts = info.salaryRange.split(/\s*[-–]\s*/);
  const salaryMin = parseSalaryNumber(salaryParts[0] || "0");
  const salaryMax = parseSalaryNumber(salaryParts[1] || "0");

  const occupationalCategories: Record<string, string> = { rpn: "29-2061", rn: "29-1141", np: "29-1171" };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `How to Become a ${info.fullTitle}`,
    description: info.description,
    publisher: { "@type": "Organization", name: "NurseNest" },
    about: [
      { "@type": "Occupation", name: info.fullTitle, estimatedSalary: { "@type": "MonetaryAmountDistribution", name: "Annual Salary", currency: "USD", median: parseSalaryNumber(info.salaryMedian) } },
    ],
  };

  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": info.fullTitle,
    "description": `Career opportunity as a ${info.fullTitle}. ${info.description}`,
    "hiringOrganization": {
      "@type": "Organization",
      "name": "NurseNest",
      "sameAs": "https://www.nursenest.ca",
    },
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": {
        "@type": "QuantitativeValue",
        "minValue": salaryMin,
        "maxValue": salaryMax,
        "unitText": "YEAR",
      },
    },
    "employmentType": "FULL_TIME",
    "jobLocationType": "TELECOMMUTE",
    "educationRequirements": {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": info.examName,
    },
    "occupationalCategory": occupationalCategories[info.slug] || "29-1141",
    "url": `https://www.nursenest.ca/how-to-become-a-nurse/${info.slug}`,
    "datePosted": "2025-01-15",
    "validThrough": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  };

  const educationalOrgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "NurseNest",
    "url": "https://www.nursenest.ca",
    "description": "Comprehensive nursing exam preparation platform for RPN/LVN, RN, and NP students.",
  };

  const allSchemas = [structuredData, jobPostingSchema, educationalOrgSchema];

  return (
    <div data-testid="nursing-career-page">
      <Helmet>
        <title>{`How to Become a ${info.fullTitle} | Career Guide | NurseNest`}</title>
        <meta name="description" content={`Learn how to become a ${info.fullTitle}. Education requirements, exam info (${info.examName}), salary range (${info.salaryRange}), and step-by-step career guide.`} />
        <meta name="keywords" content={`how to become a ${info.title.toLowerCase()}, ${info.title.toLowerCase()} career, ${info.examName} exam, nursing career guide, ${info.title.toLowerCase()} salary`} />
        <link rel="canonical" href={`https://www.nursenest.ca/how-to-become-a-nurse/${info.slug}`} />
        {allSchemas.map((schema, i) => (
          <script key={i} type="application/ld+json">{JSON.stringify(schema)}</script>
        ))}
      </Helmet>

      <nav className="bg-white border-b border-gray-100 py-3 px-4" data-testid="breadcrumbs">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              {i < breadcrumbs.length - 1 ? (
                <Link href={b.href} className="hover:text-teal-600 transition-colors">{b.label}</Link>
              ) : (
                <span className="text-gray-900 font-medium">{b.label}</span>
              )}
            </span>
          ))}
        </div>
      </nav>

      <section className="bg-gradient-to-br from-teal-50 via-white to-blue-50 border-b border-gray-100 py-12 px-4" data-testid="section-career-hero">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">{t("pages.nursingCareerPages.careerGuide")}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" data-testid="text-career-title">
            How to Become a {info.fullTitle}
          </h1>
          <p className="text-lg text-gray-600 mb-6">{info.heroSubtitle}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center" data-testid="stat-education">
              <Clock className="w-5 h-5 text-teal-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500">{t("pages.nursingCareerPages.education")}</p>
              <p className="text-sm font-bold text-gray-900">{info.educationLength}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center" data-testid="stat-salary">
              <DollarSign className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500">{t("pages.nursingCareerPages.salaryRange")}</p>
              <p className="text-sm font-bold text-gray-900">{info.salaryRange}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center" data-testid="stat-exam">
              <Award className="w-5 h-5 text-purple-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500">{t("pages.nursingCareerPages.exam")}</p>
              <p className="text-sm font-bold text-gray-900">{info.examName}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center" data-testid="stat-growth">
              <TrendingUp className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500">{t("pages.nursingCareerPages.jobGrowth")}</p>
              <p className="text-sm font-bold text-gray-900">{info.growthRate} (10-year)</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 px-4" data-testid="section-overview">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What Does a {info.title} Do?</h2>
          <p className="text-gray-700 leading-relaxed mb-6">{info.description}</p>
        </div>
      </section>

      <section className="py-10 px-4 bg-gray-50" data-testid="section-steps">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Steps to Become a {info.title}</h2>
          <div className="space-y-6">
            {info.steps.map((step, i) => (
              <div key={i} className="flex gap-4 bg-white rounded-xl border border-gray-200 p-6" data-testid={`step-${i}`}>
                <div className="flex-shrink-0 w-10 h-10 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-lg">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 px-4" data-testid="section-exam-info">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{info.examInfo.name} Exam Details</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{t("pages.nursingCareerPages.format")}</h3>
              <p className="text-gray-700">{info.examInfo.format}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{t("pages.nursingCareerPages.passingScore")}</h3>
              <p className="text-gray-700">{info.examInfo.passingScore}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{t("pages.nursingCareerPages.contentAreas")}</h3>
              <ul className="space-y-1">
                {info.examInfo.sections.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 bg-teal-50 rounded-xl border border-teal-200 p-5">
            <h3 className="text-lg font-bold text-teal-800 mb-2">{t("pages.nursingCareerPages.prepareWithNursenest")}</h3>
            <p className="text-sm text-teal-900 mb-4">NurseNest offers 1,200+ practice questions, clinical lessons, and adaptive exam simulations designed specifically for {info.examName} preparation.</p>
            <Link href={info.ctaPath} className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-all" data-testid="button-exam-cta">
              Start Free Prep <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 px-4 bg-gray-50" data-testid="section-skills">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.nursingCareerPages.keySkills")}</h2>
              <ul className="space-y-2">
                {info.skills.map((skill, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <Stethoscope className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.nursingCareerPages.workSettings")}</h2>
              <ul className="space-y-2">
                {info.workSettings.map((setting, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    {setting}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 px-4" data-testid="section-related-tracks">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t("pages.nursingCareerPages.relatedNursingCareers")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {info.relatedTracks.map(rt => (
              <Link
                key={rt.slug}
                href={`/how-to-become-a-nurse/${rt.slug}`}
                className="group bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-teal-200 transition-all"
                data-testid={`link-related-${rt.slug}`}
              >
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-teal-700 transition-colors mb-1">{rt.title}</h3>
                <p className="text-sm text-gray-500">{rt.description}</p>
                <span className="inline-flex items-center gap-1 text-teal-600 text-sm font-medium mt-3">
                  Learn More <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 border-t border-gray-100" data-testid="section-study-links">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Study Resources for {info.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href={`/${info.slug}/questions`} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all" data-testid="link-practice-questions">
              <GraduationCap className="w-5 h-5 text-teal-500" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{t("pages.nursingCareerPages.practiceQuestions")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingCareerPages.topicbasedExamPrep")}</p>
              </div>
            </Link>
            <Link href="/lessons" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all" data-testid="link-lessons">
              <BookOpen className="w-5 h-5 text-teal-500" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{t("pages.nursingCareerPages.clinicalLessons")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingCareerPages.200PathophysiologyGuides")}</p>
              </div>
            </Link>
            <Link href="/mock-exams" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all" data-testid="link-mock-exams">
              <Award className="w-5 h-5 text-teal-500" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{t("pages.nursingCareerPages.mockExams")}</h3>
                <p className="text-xs text-gray-500">{t("pages.nursingCareerPages.timedExamSimulations")}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-br from-teal-50 to-blue-50 border-t border-gray-100" data-testid="section-final-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Start Your {info.title} Journey Today</h2>
          <p className="text-gray-600 mb-6">Join thousands of nursing students preparing for their {info.examName} exam with NurseNest.</p>
          <Link href="/start-free" className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-600 text-white rounded-xl text-base font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200" data-testid="button-final-cta">
            Start Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
