import { pool } from "./storage";
import * as fs from "fs";
import * as path from "path";
import { seoTitleMap } from "./seo-title-map";
import { isLocaleIndexable, getIndexableLocales, getHreflangCode, getLocaleDirection } from "./translation-audit";
import { normalizeCanonicalUrl, isLowValueTranslatedPage, hasTimestampSuffix, LOW_VALUE_TRANSLATED_PATHS } from "@shared/canonical-url";
import { deLocalizeSlug, localizeSlug } from "@shared/localized-slugs";
import { isEmergencyMode } from "./platform-resilience";

import { SUPPORTED_LOCALES as SUPPORTED_LOCALES_LIST, getMainSiteDomain } from "@shared/locales";

const SITE_BASE = getMainSiteDomain();
const ALLIED_SITE_BASE = "https://allied.nursenest.ca";

let lessonSeoData: Record<string, any> | null = null;
function getLessonSeoData(): Record<string, any> {
  if (!lessonSeoData) {
    try {
      const dataPath = path.join(__dirname, "lesson-seo-data.json");
      lessonSeoData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    } catch {
      lessonSeoData = {};
    }
  }
  return lessonSeoData!;
}

interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  jsonLd?: string;
  noscriptContent?: string;
  noindex?: boolean;
  breadcrumbs?: { name: string; url: string }[];
  ogImage?: string;
}

const NOINDEX_PATHS = new Set([
  "/admin",
  "/content-editor",
  "/login",
  "/register",
  "/profile",
  "/reports",
  "/dashboard",
  "/subscription/success",
  "/subscription/cancel",
  "/upgrade",
  "/feedback",
  "/diagnostic-assessment",
  "/probability-simulator",
  "/settings",
  "/notes",
  "/invite",
  "/reset-password",
  "/verify-email",
  "/allied-health/rrt/dashboard",
  "/allied-health/paramedic/dashboard",
  "/allied-health/pharmacy-technician/dashboard",
  "/allied-health/mlt/dashboard",
  "/allied-health/imaging/dashboard",
  "/allied-health/social-work/dashboard",
  "/allied-health/psychotherapy/dashboard",
  "/allied-health/addictions/dashboard",
  "/allied-health/occupational-therapy/dashboard",
]);

export function isNoindexPath(path: string, locale?: string): boolean {
  try {
    // 🚨 FAST EXIT FOR EXAM + HEAVY ROUTES
    if (
      path.startsWith("/cat-exam") ||
      path.startsWith("/qbank") ||
      path.startsWith("/mock-exams") ||
      path.startsWith("/dashboard") ||
      path.startsWith("/admin")
    ) {
      return true;
    }

    if (NOINDEX_PATHS.has(path)) return true;

    if (path.startsWith("/content-editor")) return true;
    if (path.startsWith("/flashcards/deck/")) return true;
    if (path.startsWith("/trial")) return true;
    if (path.startsWith("/account")) return true;
    if (path.startsWith("/checkout")) return true;
    if (path.startsWith("/subscription")) return true;

    if (/^\/allied-health\/[^/]+\/dashboard/.test(path)) return true;

    if (locale && isLowValueTranslatedPage(path, locale)) return true;

    return false;
  } catch (err) {
    console.error("[SEO] isNoindexPath error:", err);
    return true;
  }
}

function buildBreadcrumbs(pathname: string): { name: string; url: string }[] {
  const crumbs: { name: string; url: string }[] = [
    { name: "Home", url: `${SITE_BASE}/` },
  ];

  const lessonMatch = pathname.match(/^\/lessons\/(.+)$/);
  if (lessonMatch) {
    crumbs.push({ name: "Lessons", url: `${SITE_BASE}/lessons` });
    crumbs.push({ name: stripTierFromSeoTitle(slugToTitle(lessonMatch[1])), url: `${SITE_BASE}${pathname}` });
    return crumbs;
  }

  const clarityMatch = pathname.match(/^\/clinical-clarity\/(.+)$/);
  if (clarityMatch) {
    crumbs.push({ name: "Clinical Clarity", url: `${SITE_BASE}/clinical-clarity` });
    crumbs.push({ name: slugToTitle(clarityMatch[1]), url: `${SITE_BASE}${pathname}` });
    return crumbs;
  }

  const learnMatch = pathname.match(/^\/learn\/(.+)$/);
  if (learnMatch) {
    crumbs.push({ name: "Blog", url: `${SITE_BASE}/blog` });
    crumbs.push({ name: slugToTitle(learnMatch[1]), url: `${SITE_BASE}${pathname}` });
    return crumbs;
  }

  const shopMatch = pathname.match(/^\/shop\/(.+)$/);
  if (shopMatch) {
    crumbs.push({ name: "Store", url: `${SITE_BASE}/shop` });
    crumbs.push({ name: slugToTitle(shopMatch[1]), url: `${SITE_BASE}${pathname}` });
    return crumbs;
  }

  const applyNestCareersMatch = pathname.match(/^\/applynest\/careers\/(.+)$/);
  if (applyNestCareersMatch) {
    crumbs.push({ name: "ApplyNest", url: `${SITE_BASE}/applynest` });
    crumbs.push({ name: slugToTitle(applyNestCareersMatch[1]) + " Career Guide", url: `${SITE_BASE}${pathname}` });
    return crumbs;
  }

  const applyNestMatch = pathname.match(/^\/applynest\/(.+)$/);
  if (applyNestMatch) {
    crumbs.push({ name: "ApplyNest", url: `${SITE_BASE}/applynest` });
    crumbs.push({ name: slugToTitle(applyNestMatch[1]), url: `${SITE_BASE}${pathname}` });
    return crumbs;
  }

  const alliedHealthMatch = pathname.match(/^\/allied-health\/(.+)$/);
  if (alliedHealthMatch) {
    crumbs.push({ name: "Allied Health", url: `${SITE_BASE}/allied-health` });
    const subPath = alliedHealthMatch[1];
    const alliedProfessionLabels: Record<string, string> = {
      "rrt": "Respiratory Therapy",
      "paramedic": "Paramedic",
      "pharmacy-technician": "Pharmacy Technician",
      "mlt": "Medical Lab Technology",
      "imaging": "Diagnostic Imaging",
      "social-work": "Social Work",
      "psychotherapy": "Psychotherapy",
      "addictions": "Addictions Counselling",
      "occupational-therapy": "Occupational Therapy",
    };
    const professionMatch = subPath.match(/^([^/]+)/);
    if (professionMatch && alliedProfessionLabels[professionMatch[1]]) {
      const profKey = professionMatch[1];
      crumbs.push({ name: alliedProfessionLabels[profKey], url: `${SITE_BASE}/allied-health/${profKey}` });
      const remainder = subPath.slice(profKey.length + 1);
      if (remainder) {
        crumbs.push({ name: slugToTitle(remainder.split("/").pop() || ""), url: `${SITE_BASE}${pathname}` });
      }
    } else if (subPath === "careers") {
      crumbs.push({ name: "Career Directory", url: `${SITE_BASE}${pathname}` });
    } else if (subPath === "pricing") {
      crumbs.push({ name: "Pricing", url: `${SITE_BASE}${pathname}` });
    } else {
      crumbs.push({ name: slugToTitle(subPath.split("/").pop() || subPath), url: `${SITE_BASE}${pathname}` });
    }
    return crumbs;
  }

  if (pathname === "/allied-health") {
    crumbs.push({ name: "Allied Health", url: `${SITE_BASE}/allied-health` });
    return crumbs;
  }

  const healthcareCareerMatch = pathname.match(/^\/healthcare-careers\/(.+)$/);
  if (healthcareCareerMatch) {
    crumbs.push({ name: "Healthcare Careers", url: `${SITE_BASE}/healthcare-careers` });
    crumbs.push({ name: slugToTitle(healthcareCareerMatch[1]) + " Career Guide", url: `${SITE_BASE}${pathname}` });
    return crumbs;
  }

  const healthcareCertMatch = pathname.match(/^\/healthcare-certifications\/(.+)$/);
  if (healthcareCertMatch) {
    crumbs.push({ name: "Healthcare Certifications", url: `${SITE_BASE}/healthcare-certifications` });
    crumbs.push({ name: healthcareCertMatch[1].toUpperCase() + " Certification", url: `${SITE_BASE}${pathname}` });
    return crumbs;
  }

  const policyMatch = pathname.match(/^\/healthcare-policy-and-updates(\/(.+))?$/);
  if (policyMatch) {
    crumbs.push({ name: "Healthcare Policy & Updates", url: `${SITE_BASE}/healthcare-policy-and-updates` });
    if (policyMatch[2]) {
      crumbs.push({ name: slugToTitle(policyMatch[2]), url: `${SITE_BASE}${pathname}` });
    }
    return crumbs;
  }

  const careerMatch = pathname.match(/^\/career-development\/(.+)$/);
  if (careerMatch) {
    crumbs.push({ name: "Career Development", url: `${SITE_BASE}/new-grad` });
    crumbs.push({ name: slugToTitle(careerMatch[1]), url: `${SITE_BASE}${pathname}` });
    return crumbs;
  }

  const newGradCareerMatch = pathname.match(/^\/new-grad\/career\/(.+)$/);
  if (newGradCareerMatch) {
    crumbs.push({ name: "New Grad Hub", url: `${SITE_BASE}/new-grad` });
    crumbs.push({ name: slugToTitle(newGradCareerMatch[1]), url: `${SITE_BASE}${pathname}` });
    return crumbs;
  }

  const newGradMatch = pathname.match(/^\/new-grad(\/.*)?$/);
  if (newGradMatch && newGradMatch[1] && newGradMatch[1] !== "/") {
    crumbs.push({ name: "New Grad Hub", url: `${SITE_BASE}/new-grad` });
    const sub = newGradMatch[1].replace(/^\//, "").split("/").pop() || "";
    if (sub) crumbs.push({ name: slugToTitle(sub), url: `${SITE_BASE}${pathname}` });
    return crumbs;
  }

  const tierLabels: Record<string, string> = { rpn: "RPN / LVN", rn: "RN", np: "Nurse Practitioner" };
  const nursingQuestionTopicMatch = pathname.match(/^\/(rpn|rn|np)\/questions\/(.+)$/);
  if (nursingQuestionTopicMatch) {
    const [, t, topicSlug] = nursingQuestionTopicMatch;
    crumbs.push({ name: tierLabels[t] || t.toUpperCase(), url: `${SITE_BASE}/${t}` });
    crumbs.push({ name: "Practice Questions", url: `${SITE_BASE}/${t}/questions` });
    crumbs.push({ name: slugToTitle(topicSlug), url: `${SITE_BASE}${pathname}` });
    return crumbs;
  }

  const nursingQuestionsIndexMatch = pathname.match(/^\/(rpn|rn|np)\/questions$/);
  if (nursingQuestionsIndexMatch) {
    const t = nursingQuestionsIndexMatch[1];
    crumbs.push({ name: tierLabels[t] || t.toUpperCase(), url: `${SITE_BASE}/${t}` });
    crumbs.push({ name: "Practice Questions", url: `${SITE_BASE}${pathname}` });
    return crumbs;
  }

  const careerPageMatch = pathname.match(/^\/how-to-become-a-nurse\/(.+)$/);
  if (careerPageMatch) {
    crumbs.push({ name: "How to Become a Nurse", url: `${SITE_BASE}/how-to-become-a-nurse/rpn` });
    crumbs.push({ name: tierLabels[careerPageMatch[1]] || slugToTitle(careerPageMatch[1]), url: `${SITE_BASE}${pathname}` });
    return crumbs;
  }

  const conditionMatch = pathname.match(/^\/conditions\/(.+)$/);
  if (conditionMatch) {
    crumbs.push({ name: "Conditions", url: `${SITE_BASE}/conditions` });
    crumbs.push({ name: slugToTitle(conditionMatch[1]), url: `${SITE_BASE}${pathname}` });
    return crumbs;
  }

  const medicationMatch = pathname.match(/^\/medications\/(.+)$/);
  if (medicationMatch) {
    crumbs.push({ name: "Medications", url: `${SITE_BASE}/medications` });
    crumbs.push({ name: slugToTitle(medicationMatch[1]), url: `${SITE_BASE}${pathname}` });
    return crumbs;
  }

  const clinicalCalcMatch = pathname.match(/^\/clinical-calculators\/(.+)$/);
  if (clinicalCalcMatch) {
    crumbs.push({ name: "Clinical Calculators", url: `${SITE_BASE}/clinical-calculators` });
    crumbs.push({ name: slugToTitle(clinicalCalcMatch[1]), url: `${SITE_BASE}${pathname}` });
    return crumbs;
  }
  if (pathname === "/clinical-calculators") {
    crumbs.push({ name: "Clinical Calculators", url: `${SITE_BASE}/clinical-calculators` });
    return crumbs;
  }

  const studyGuideMatch = pathname.match(/^\/nursing-study-guides\/(.+)$/);
  if (studyGuideMatch) {
    crumbs.push({ name: "Nursing Study Guides", url: `${SITE_BASE}/nursing-study-guides` });
    crumbs.push({ name: slugToTitle(studyGuideMatch[1]), url: `${SITE_BASE}${pathname}` });
    return crumbs;
  }
  if (pathname === "/nursing-study-guides") {
    crumbs.push({ name: "Nursing Study Guides", url: `${SITE_BASE}/nursing-study-guides` });
    return crumbs;
  }

  const clinicalScenarioMatch = pathname.match(/^\/nursing-clinical-scenarios\/(.+)$/);
  if (clinicalScenarioMatch) {
    crumbs.push({ name: "Clinical Scenarios", url: `${SITE_BASE}/nursing-clinical-scenarios` });
    crumbs.push({ name: slugToTitle(clinicalScenarioMatch[1]), url: `${SITE_BASE}${pathname}` });
    return crumbs;
  }

  const perioperativePages: Record<string, string> = {
    "/preoperative-care": "Preoperative Care",
    "/preoperative-nursing-guide": "Preoperative Nursing Guide",
    "/perioperative-nurse-career": "Career Guide",
  };
  if (perioperativePages[pathname]) {
    crumbs.push({ name: "Perioperative Nursing", url: `${SITE_BASE}/perioperative-nursing` });
    crumbs.push({ name: perioperativePages[pathname], url: `${SITE_BASE}${pathname}` });
    return crumbs;
  }

  if (pathname !== "/") {
    const pageName = staticPages[pathname]?.title?.split(" | ")[0]?.split(" - ")[0] || slugToTitle(pathname.replace(/^\//, ""));
    crumbs.push({ name: pageName, url: `${SITE_BASE}${pathname}` });
  }

  return crumbs;
}

function stripTierFromSeoTitle(title: string): string {
  return title
    .replace(/^(RN|NP|RPN|LVN|NCLEX|NCLEX-RN|NCLEX-PN|REx-PN)\s+/i, "")
    .replace(/\s+\((RN|NP|RPN|LVN|NCLEX|RPN\/LVN|RPN\/RN)\)$/i, "")
    .replace(/\s*-\s*Nursing Lesson$/i, "")
    .trim();
}

const NURSING_KEYWORDS_RE = /\b(nurs|nclex|clinical|patient care|exam prep|lpn|lvn|rpn|rnursing|for nurses|nursing guide|nursing care|nursing interventions|nurse practitioner)\b/i;

function appendNursingContext(title: string, slug: string): string {
  if (NURSING_KEYWORDS_RE.test(title)) {
    return title;
  }

  if (title.includes(":") || title.includes("—") || title.includes(" - ")) {
    if (title.length > 55) return title;
  }

  const npSlugs = /-np$|^np-|-management-np$|-np-/;
  const rnSlugs = /-rn$|^rn-|-basics-rn$|-rn-/;

  if (npSlugs.test(slug)) {
    return `${title} — NP Clinical Guide`;
  }
  if (rnSlugs.test(slug)) {
    return `${title} — Nursing Guide`;
  }

  if (slug.includes("allied-") || slug.includes("-mlt") || slug.includes("-rrt") || slug.includes("paramedic")) {
    return title;
  }

  return `${title} — Nursing Guide`;
}

function slugToTitle(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bRpn\b/g, "RPN")
    .replace(/\bRn\b/g, "RN")
    .replace(/\bNp\b/g, "NP")
    .replace(/\bIcp\b/g, "ICP")
    .replace(/\bDka\b/g, "DKA")
    .replace(/\bHhns\b/g, "HHNS")
    .replace(/\bCopd\b/g, "COPD")
    .replace(/\bAki\b/g, "AKI")
    .replace(/\bCkd\b/g, "CKD")
    .replace(/\bAbg\b/g, "ABG")
    .replace(/\bPe\b/g, "PE")
    .replace(/\bDvt\b/g, "DVT")
    .replace(/\bMi\b/g, "MI")
    .replace(/\bHf\b/g, "HF")
    .replace(/\bSiadh\b/g, "SIADH")
    .replace(/\bDi\b/g, "DI")
    .replace(/\bArds\b/g, "ARDS")
    .replace(/\bTb\b/g, "TB")
    .replace(/\bOsa\b/g, "OSA")
    .replace(/\bSbar\b/g, "SBAR")
    .replace(/\bGcs\b/g, "GCS")
    .replace(/\bNih\b/g, "NIH")
    .replace(/\bEcg\b/g, "ECG")
    .replace(/\bSofa\b/g, "SOFA")
    .replace(/\bApache\b/g, "APACHE")
    .replace(/\bPph\b/g, "PPH")
    .replace(/\bNec\b/g, "NEC")
    .replace(/\bIv\b/g, "IV")
    .replace(/\bPpe\b/g, "PPE")
    .replace(/\bAdhd\b/g, "ADHD")
    .replace(/\bGi\b/g, "GI")
    .replace(/\bIbs\b/g, "IBS")
    .replace(/\bAml\b/g, "AML")
    .replace(/\bHep\b/g, "Hep")
    .replace(/\bChf\b/g, "CHF")
    .replace(/\bAdpie\b/g, "ADPIE")
    .replace(/\bAaa\b/g, "AAA")
    .replace(/\bHellp\b/g, "HELLP")
    .replace(/\bHie\b/g, "HIE")
    .replace(/\bRds\b/g, "RDS")
    .replace(/\bCdiff\b/g, "C. diff")
    .replace(/\bDar\b/g, "DAR")
    .replace(/\bNgtube\b/g, "NG Tube")
    .replace(/\bAv\b/g, "AV")
    .replace(/\bVac\b/g, "VAC")
    .replace(/\bErcp\b/g, "ERCP")
    .replace(/\bEgd\b/g, "EGD")
    .replace(/\bMgmt\b/g, "Management")
    .replace(/\bMeds\b/g, "Medications")
    .replace(/\bOb\b/g, "OB")
    .replace(/\bUs\b/g, "US")
    .replace(/\bTestbank\b/g, "Test Bank");
}

const staticPages: Record<string, { title: string; description: string }> = {
  "/": {
    title: "NurseNest - Healthcare Exam Prep | Nursing, NP, Allied Health & Certification Test Bank, Simulations & Flashcards",
    description: "Prepare for NCLEX-RN, NCLEX-PN, REx-PN, NP certification, and allied health exams with NurseNest. 13,000+ practice questions, clinical case simulations, 13,000+ flashcards, and 8,000+ lessons for nursing students, NP candidates, allied health professionals, and new graduates in Canada and the US. Start free.",
  },
  "/new-grad": {
    title: "New Grad Career Hub — Resume, Interview & Career Resources | NurseNest",
    description: "Complete career hub for new graduate nurses: resume templates, interview prep with 100+ questions, clinical confidence guides, salary negotiation tools, and first-year survival resources.",
  },
  "/resumes-cover-letters": {
    title: "Resumes & Cover Letters — Healthcare Resume Templates & Guides | NurseNest",
    description: "Build a winning healthcare resume with ATS-optimized templates, real new grad nursing resume examples, cover letter frameworks, and expert writing guides.",
  },
  "/interview-prep": {
    title: "Interview Prep — Nursing Interview Questions & Practice | NurseNest",
    description: "Prepare for nursing interviews with 100+ practice questions, STAR-method examples, behavioral interview strategies, and timed mock interview simulators.",
  },
  "/personal-statements": {
    title: "Personal Statements — Nursing School Application Essays & Examples | NurseNest",
    description: "Write winning nursing school personal statements and scholarship essays. Includes real examples, expert frameworks, and tips for BSN, MSN, and DNP program applications.",
  },
  "/resources": {
    title: "Career Resources — New Graduate Nurse Guides & Tools | NurseNest",
    description: "Navigate your first year of nursing with comprehensive career resources. Guides for clinical confidence, time management, workplace navigation, and burnout prevention.",
  },
  "/resumes-cover-letters/new-grad-nursing-resume-example": {
    title: "New Grad Nursing Resume Example — Templates & Writing Guide | NurseNest",
    description: "Create a winning new grad nursing resume with our step-by-step guide. Includes real resume examples, ATS optimization tips, and templates for med-surg, ICU, ER, and pediatric positions.",
  },
  "/resumes-cover-letters/healthcare-resume-templates": {
    title: "Healthcare Resume Templates — Free Nursing Resume Templates | NurseNest",
    description: "Download free ATS-optimized healthcare resume templates for new graduate nurses. Includes med-surg, ICU, ER, pediatric, and cover letter templates.",
  },
  "/resumes-cover-letters/ats-resume-tips-new-graduates": {
    title: "ATS Resume Tips for New Graduates — Beat Applicant Tracking Systems | NurseNest",
    description: "Master ATS resume optimization with proven tips for new graduate nurses. Learn keyword strategies, formatting rules, and common mistakes.",
  },
  "/resumes-cover-letters/cover-letter-examples-healthcare": {
    title: "Cover Letter Examples Healthcare — New Grad Nursing Cover Letters | NurseNest",
    description: "Write compelling cover letters for healthcare positions with specialty-specific examples and frameworks for new graduate nurses.",
  },
  "/resumes-cover-letters/resume-mistakes-to-avoid": {
    title: "Resume Mistakes to Avoid — New Graduate Nurse Resume Errors | NurseNest",
    description: "Avoid the most common resume mistakes new graduate nurses make. Learn how to fix formatting errors, weak descriptions, and missing keywords.",
  },
  "/interview-prep/top-nursing-interview-questions": {
    title: "Top Nursing Interview Questions — New Grad Nurse Interview Prep | NurseNest",
    description: "Prepare for your nursing interview with the top questions asked by nurse managers. Includes behavioral, clinical, and situational questions with sample answers.",
  },
  "/interview-prep/behavioral-interview-questions-healthcare": {
    title: "Behavioral Interview Questions Healthcare — STAR Method Examples | NurseNest",
    description: "Master behavioral nursing interview questions with STAR-method answers for teamwork, conflict resolution, patient advocacy, and leadership.",
  },
  "/interview-prep/tell-me-about-yourself-best-answer": {
    title: "Tell Me About Yourself — Best Nursing Interview Answer | NurseNest",
    description: "Craft the perfect answer to 'Tell me about yourself' for nursing interviews. Includes templates, examples, and a proven framework for new grads.",
  },
  "/interview-prep/star-method-explained": {
    title: "STAR Method Explained — Nursing Interview Answer Framework | NurseNest",
    description: "Learn the STAR method for nursing interviews. Step-by-step guide with healthcare examples for behavioral interview questions.",
  },
  "/interview-prep/common-interview-mistakes": {
    title: "Common Interview Mistakes — New Graduate Nurse Interview Errors | NurseNest",
    description: "Avoid the most common interview mistakes new graduate nurses make. Learn how to prevent rambling answers, poor preparation, and other errors.",
  },
  "/resources/what-to-expect-first-nursing-job": {
    title: "What to Expect First Nursing Job — New Graduate Nurse Guide | NurseNest",
    description: "Prepare for your first nursing job with this comprehensive guide covering orientation, preceptorship, clinical confidence, and workplace dynamics.",
  },
  "/resources/transition-student-to-nurse": {
    title: "Transition from Student to Nurse — New Graduate Role Change Guide | NurseNest",
    description: "Navigate the transition from nursing student to practicing nurse with strategies for managing identity change, building independence, and overcoming imposter syndrome.",
  },
  "/resources/time-management-new-nurses": {
    title: "Time Management for New Nurses — Shift Organization Guide | NurseNest",
    description: "Master time management as a new nurse with proven strategies for shift organization, patient prioritization, and documentation efficiency.",
  },
  "/resources/clinical-confidence-tips": {
    title: "Clinical Confidence Tips — New Graduate Nurse Confidence Guide | NurseNest",
    description: "Build clinical confidence as a new graduate nurse with proven strategies for developing assessment skills, managing emergencies, and overcoming imposter syndrome.",
  },
  "/personal-statements/nursing-school-personal-statement-examples": {
    title: "Nursing School Personal Statement Examples — Application Writing Guide | NurseNest",
    description: "Write a compelling nursing school personal statement with real examples and expert writing guide for BSN, MSN, and DNP applications.",
  },
  "/personal-statements/scholarship-application-tips": {
    title: "Scholarship Application Tips — Nursing Scholarship Essay Guide | NurseNest",
    description: "Win nursing scholarships with proven application strategies. Learn to write compelling essays, request strong recommendation letters, and craft financial need statements.",
  },
  "/start-free": {
    title: "Start Free - Begin Your Nursing Exam Prep | NurseNest",
    description: "Start your free NurseNest account today. Access nursing lessons, flashcards, and practice questions to begin preparing for NCLEX, NCLEX-PN, and REx-PN exams.",
  },
  "/med-math": {
    title: "Med Math Practice - Dosage Calculations | NurseNest",
    description: "Practice medication math and dosage calculations with randomized problems and step-by-step solutions. Essential for nursing exam preparation.",
  },
  "/lab-values": {
    title: "Lab Values Interpretation — Abnormal Clinical Findings and Nursing Actions | NurseNest",
    description: "Master abnormal lab value interpretation with cluster-based scenarios. Practice identifying critical values, clinical correlations, and priority nursing interventions for NCLEX, REx-PN, and nursing exam preparation.",
  },
  "/si-to-conventional-units-converter": {
    title: "SI to Conventional Units Converter — Nursing Lab Value Calculator | NurseNest",
    description: "Free nursing unit converter: convert between SI (Canadian) and conventional (U.S.) units for glucose, creatinine, hemoglobin, cholesterol, BUN, and more. Quick-reference tables and formulas for NCLEX & REx-PN prep.",
  },
  "/canadian-vs-american-lab-values": {
    title: "Canadian vs American Lab Values — SI vs Conventional Units Explained | NurseNest",
    description: "Understand why Canada and the U.S. report lab values differently. Learn the difference between SI units and conventional units, why it matters for nursing exams (NCLEX, REx-PN), and how to convert between systems.",
  },
  "/glucose-mmol-l-to-mg-dl": {
    title: "Glucose mmol/L to mg/dL Conversion — Blood Sugar Unit Calculator | NurseNest",
    description: "Convert blood glucose between mmol/L (SI/Canadian) and mg/dL (conventional/U.S.). Includes conversion formula, diabetes thresholds, quick-reference chart, and nursing clinical context.",
  },
  "/creatinine-umol-l-to-mg-dl": {
    title: "Creatinine µmol/L to mg/dL Conversion — Renal Function Calculator | NurseNest",
    description: "Convert creatinine between µmol/L (SI/Canadian) and mg/dL (conventional/U.S.). Includes renal function context, GFR interpretation, CKD staging, and nursing clinical pearls.",
  },
  "/hemoglobin-g-l-to-g-dl": {
    title: "Hemoglobin g/L to g/dL Conversion — Anemia & Transfusion Calculator | NurseNest",
    description: "Convert hemoglobin between g/L (SI/Canadian) and g/dL (conventional/U.S.). Includes anemia classification, transfusion thresholds, and nursing clinical context for blood transfusion decisions.",
  },
  "/bilirubin-umol-l-to-mg-dl": {
    title: "Bilirubin µmol/L to mg/dL Conversion — Liver & Neonatal Jaundice Calculator | NurseNest",
    description: "Convert bilirubin between µmol/L (SI/Canadian) and mg/dL (conventional/U.S.). Includes liver function context, neonatal jaundice thresholds, phototherapy guidelines, and nursing clinical pearls.",
  },
  "/calcium-mmol-l-to-mg-dl": {
    title: "Calcium mmol/L to mg/dL Conversion — Hypo/Hypercalcemia Calculator | NurseNest",
    description: "Convert calcium between mmol/L (SI/Canadian) and mg/dL (conventional/U.S.). Includes hypo/hypercalcemia clinical context, corrected calcium formula, ECG changes, and nursing assessment pearls.",
  },
  "/urea-to-bun-conversion-nursing": {
    title: "Urea to BUN Conversion — Why It's Not a Simple Relabeling | NurseNest",
    description: "Convert between urea (mmol/L, SI/Canadian) and BUN (mg/dL, conventional/U.S.). Understand why this conversion involves molecular weight, not just unit relabeling. Includes renal nursing context.",
  },
  "/cholesterol-triglyceride-unit-conversion": {
    title: "Cholesterol & Triglyceride mmol/L to mg/dL Conversion — Lipid Panel Calculator | NurseNest",
    description: "Convert total cholesterol, LDL, HDL, and triglycerides between mmol/L (SI/Canadian) and mg/dL (conventional/U.S.). Includes cardiovascular risk context, target values, and nursing clinical pearls.",
  },
  "/kg-to-lb-nursing": {
    title: "kg to lb Conversion for Nursing — Medication Dosing Weight Calculator | NurseNest",
    description: "Convert between kilograms and pounds for nursing medication dosing. Includes weight-based dosing examples, pediatric calculations, BMI context, and clinical safety pearls.",
  },
  "/celsius-to-fahrenheit-nursing": {
    title: "Celsius to Fahrenheit Conversion for Nursing — Vital Signs Temperature Calculator | NurseNest",
    description: "Convert temperature between Celsius and Fahrenheit for nursing vital signs. Includes fever thresholds, hypothermia classification, pediatric considerations, and clinical assessment pearls.",
  },
  "/clinical-clarity": {
    title: "Clinical Clarity - Why Does This Happen? | NurseNest",
    description: "Understand the 'why' behind clinical phenomena. Evidence-based explanations for pathophysiology concepts nursing students need to know.",
  },
  "/case-simulations": {
    title: "Clinical Case Simulations - Nursing Scenarios | NurseNest",
    description: "Practice clinical decision-making with branching case simulations. Manage patient scenarios with vitals, labs, and real-time feedback.",
  },
  "/first-action-simulator": {
    title: "First Action Prioritization Simulator - Nursing Priority | NurseNest",
    description: "Practice choosing the FIRST nursing action in clinical scenarios. Tier-scoped RPN, RN, and NP scenarios with immediate feedback and NCLEX-style rationales.",
  },
  "/safety-hazard-simulator": {
    title: "Safety & Hazard Detection Engine - Free Nursing Practice | NurseNest",
    description: "Free interactive patient safety training. Identify fall risks, medication errors, infection breaches, and equipment hazards in clinical environments.",
  },
  "/iv-complications-simulator": {
    title: "IV Complications Simulator - Free Nursing Practice | NurseNest",
    description: "Free interactive IV complication recognition. Identify infiltration, extravasation, phlebitis, air embolism, and more with nursing interventions.",
  },
  "/electrolyte-abg-simulator": {
    title: "Electrolyte & ABG Interpretation Engine | NurseNest",
    description: "Master electrolyte imbalances and arterial blood gas interpretation. Interactive cases with ECG clues, stepwise ABG analysis, and exam trap warnings.",
  },
  "/deteriorating-patient-simulator": {
    title: "Deteriorating Patient Simulator - Clinical Escalation | NurseNest",
    description: "Manage deteriorating patients with staged vital sign changes. Practice ABCs priority, escalation decisions, and time-critical interventions.",
  },
  "/blood-transfusion-simulator": {
    title: "Blood Transfusion Nursing Simulator | Compatibility & Reactions",
    description: "Interactive blood transfusion simulator for NCLEX & REx-PN prep. Practice ABO/Rh compatibility, recognize hemolytic, TACO & TRALI reactions, and choose nursing interventions.",
  },
  "/medication-mastery": {
    title: "Medication Mastery - Drug Mechanisms & Safety | NurseNest",
    description: "Explore medication mechanisms of action at the receptor level. Pharmacology mastery for nursing students with safety considerations.",
  },
  "/clinical-calculators": {
    title: "Clinical Calculators — Free Nursing & Medical Calculators | NurseNest",
    description: "Free interactive clinical calculators for nursing students and healthcare professionals. Anion gap, IV drip rate, BSA, pediatric dose, ABG interpreter, GFR, and BMI calculators with clinical interpretation and exam tips.",
  },
  "/clinical-calculators/anion-gap": {
    title: "Anion Gap Calculator — Metabolic Acidosis Workup | NurseNest",
    description: "Calculate anion gap from sodium, chloride, and bicarbonate values. Includes clinical interpretation for metabolic acidosis, MUDPILES mnemonic, and nursing exam tips.",
  },
  "/clinical-calculators/iv-drip-rate": {
    title: "IV Drip Rate Calculator — gtt/min & mL/hr | NurseNest",
    description: "Calculate IV drip rates in gtt/min and mL/hr. Includes drop factor selection, clinical safety checks, and nursing med math exam tips for NCLEX preparation.",
  },
  "/clinical-calculators/body-surface-area": {
    title: "Body Surface Area (BSA) Calculator — Mosteller & Du Bois | NurseNest",
    description: "Calculate body surface area using Mosteller and Du Bois formulas. Used for chemotherapy dosing, burn assessment, and cardiac index calculations in nursing practice.",
  },
  "/clinical-calculators/pediatric-dose": {
    title: "Pediatric Medication Dose Calculator — mg/kg Dosing | NurseNest",
    description: "Calculate weight-based pediatric medication doses in mg/kg. Includes safety range checking, maximum dose alerts, and nursing exam tips for medication administration.",
  },
  "/clinical-calculators/abg-interpretation": {
    title: "ABG Interpretation Helper — Arterial Blood Gas Analyzer | NurseNest",
    description: "Interpret arterial blood gas results with step-by-step analysis. Identifies acid-base disorders, compensation status, and oxygenation assessment for nursing students.",
  },
  "/clinical-calculators/gfr-calculator": {
    title: "GFR Calculator — CKD-EPI Glomerular Filtration Rate | NurseNest",
    description: "Calculate estimated GFR using the CKD-EPI equation. Includes CKD staging, clinical interpretation, medication dosing implications, and nursing assessment pearls.",
  },
  "/clinical-calculators/bmi-calculator": {
    title: "BMI Calculator — Body Mass Index for Nursing Assessment | NurseNest",
    description: "Calculate BMI from height and weight in metric or imperial units. Includes WHO classification, clinical nursing considerations, and health assessment context.",
  },
  "/nursing-study-guides": {
    title: "Nursing Study Guides — Comprehensive Exam Prep Resources | NurseNest",
    description: "Free cornerstone nursing study guides for exam preparation. Electrolytes, acid-base disorders, ECG interpretation, fluid balance, and critical lab values — deep educational content with exam tips.",
  },
  "/nursing-study-guides/electrolytes-nursing-guide": {
    title: "Electrolytes for Nursing Exams — Complete Study Guide | NurseNest",
    description: "Master electrolyte imbalances for NCLEX and nursing exams. Sodium, potassium, calcium, magnesium, and phosphorus — normal values, clinical signs, nursing interventions, and exam-style questions.",
  },
  "/nursing-study-guides/acid-base-disorders-study-guide": {
    title: "Acid-Base Disorders — Nursing Study Guide | NurseNest",
    description: "Comprehensive acid-base disorders study guide for nursing students. Respiratory and metabolic acidosis/alkalosis, ABG interpretation, compensation, and clinical nursing interventions.",
  },
  "/nursing-study-guides/ecg-interpretation-study-guide": {
    title: "ECG Interpretation — Cardiac Rhythm Study Guide for Nurses | NurseNest",
    description: "Learn ECG interpretation for nursing exams. Normal sinus rhythm, atrial fibrillation, heart blocks, STEMI, and lethal rhythms — systematic approach with clinical nursing actions.",
  },
  "/nursing-study-guides/fluid-electrolyte-balance-guide": {
    title: "Fluid and Electrolyte Balance — Nursing Study Guide | NurseNest",
    description: "Master fluid and electrolyte balance for nursing exams. Isotonic, hypotonic, and hypertonic solutions, fluid volume deficit and excess, IV fluid selection, and clinical nursing management.",
  },
  "/nursing-study-guides/critical-lab-values-guide": {
    title: "Critical Lab Values — Nursing Reference Study Guide | NurseNest",
    description: "Essential critical lab values every nurse must know. Potassium, sodium, glucose, troponin, INR, hemoglobin, and more — critical ranges, nursing actions, and NCLEX exam tips.",
  },
  "/shop": {
    title: "Nursing Study Guides & Cram Booklets | NurseNest Store",
    description: "Download professional nursing cram guides, quick reference sheets, and study bundles. NCLEX-PN, REx-PN, NCLEX-RN, and NP exam prep materials from $19. Instant PDF download.",
  },
  "/pre-nursing": {
    title: "Pre-Nursing Resources - Get Started | NurseNest",
    description: "Resources for pre-nursing students considering a career in nursing. Program information, prerequisites, and study tips. Compare NurseNest vs UWorld and Archer for your prep journey.",
  },
  "/compare/uworld-vs-archer-vs-nursenest": {
    title: "UWorld vs Archer vs NurseNest: 3-Way NCLEX Prep Comparison (2025)",
    description: "Compare UWorld ($69/mo), Archer ($59/quarter), and NurseNest ($4.99/mo) side by side. Features, pricing, NCLEX-PN / REx-PN support, and which NCLEX prep platform is best for you.",
  },
  "/compare/best-uworld-alternatives-nclex": {
    title: "Best UWorld Alternatives for NCLEX Prep 2025 | NurseNest",
    description: "Looking for cheaper UWorld alternatives? Compare NurseNest, Archer, and other NCLEX prep options. 13,000+ questions, adaptive testing, and flashcards from $4.99/month.",
  },
  "/compare/best-rex-pn-question-bank-canada": {
    title: "Best REx-PN Question Bank in Canada 2025 | NurseNest",
    description: "Find the best REx-PN question bank for Canadian practical nursing students. NurseNest offers dedicated REx-PN content, CAD pricing, and French language support.",
  },
  "/compare/nursenest-vs-uworld": {
    title: "NurseNest vs UWorld NCLEX: Compare Features & Pricing (2025)",
    description: "Compare NurseNest ($4.99/mo) vs UWorld ($69/mo) for NCLEX prep. Feature-by-feature comparison of question banks, adaptive testing, flashcards, and NCLEX-PN / REx-PN support.",
  },
  "/compare/nursenest-vs-archer": {
    title: "NurseNest vs Archer NCLEX Review: Features & Pricing (2025)",
    description: "Compare NurseNest ($4.99/mo) vs Archer ($59/quarter) for NCLEX prep. Feature comparison of question banks, flashcards, adaptive testing, and Canadian exam support.",
  },
  "/compare/nursenest-vs-quizlet": {
    title: "NurseNest vs Quizlet for Nursing: Compare Features (2025)",
    description: "Compare NurseNest ($4.99/mo) vs Quizlet+ ($7.99/mo) for nursing exam prep. Purpose-built nursing tools vs generic flashcard apps.",
  },
  "/compare/best-nclex-prep-canada": {
    title: "Best NCLEX & REx-PN Prep in Canada (2025) | NurseNest",
    description: "Find the best NCLEX and REx-PN prep for Canadian nursing students. Compare features, CAD pricing, and Canadian exam-specific content.",
  },
  "/compare/cheapest-nclex-prep": {
    title: "Cheapest NCLEX Prep 2025: Affordable Study Tools Compared",
    description: "Find the most affordable NCLEX prep in 2025. Compare NurseNest ($4.99/mo) vs UWorld ($69/mo) vs Archer ($59/quarter) vs Quizlet+ ($7.99/mo).",
  },
  "/compare/rex-pn-practice-questions-free": {
    title: "Free REx-PN Practice Questions 2025 | NurseNest Canada",
    description: "Access free REx-PN practice questions for Canadian practical nursing exam prep. Daily questions, detailed rationales, and full mock exams.",
  },
  "/terms": {
    title: "Terms of Use | NurseNest",
    description: "NurseNest Terms of Use. Read our terms and conditions for using the nursing education platform.",
  },
  "/privacy": {
    title: "Privacy Policy | NurseNest",
    description: "NurseNest Privacy Policy. Learn how we collect, use, and protect your personal information.",
  },
  "/disclaimer": {
    title: "Disclaimer | NurseNest",
    description: "NurseNest educational disclaimer. NurseNest is not affiliated with NCLEX, NCSBN, CNO, or any regulatory body.",
  },
  "/refund-policy": {
    title: "Refund Policy | NurseNest",
    description: "NurseNest refund policy. Information about subscription cancellations and refund eligibility.",
  },
  "/feedback": {
    title: "Feedback & Suggestions | NurseNest",
    description: "Share your feedback, feature requests, or report issues. Help us improve NurseNest for nursing students.",
  },
  "/rpn/questions": {
    title: "RPN / LVN Practice Questions by Topic | NurseNest",
    description: "Browse RPN/LVN practice question topics covering all body systems. Free sample questions with detailed clinical rationales for NCLEX-PN and REx-PN exam prep.",
  },
  "/rn/questions": {
    title: "RN Practice Questions by Topic | NurseNest",
    description: "Browse RN practice question topics covering all body systems. Free sample questions with detailed clinical rationales for NCLEX-RN exam preparation.",
  },
  "/np/questions": {
    title: "Nurse Practitioner Practice Questions by Topic | NurseNest",
    description: "Browse NP practice question topics covering advanced clinical scenarios. Free sample questions with detailed rationales for AANP and ANCC certification exam prep.",
  },
  "/how-to-become-a-nurse/rpn": {
    title: "How to Become a Registered Practical Nurse (RPN / LVN) | NurseNest",
    description: "Complete career guide for becoming an RPN/LVN. Education requirements, NCLEX-PN/REx-PN exam info, salary range ($42K-$62K), and step-by-step career path.",
  },
  "/how-to-become-a-nurse/rn": {
    title: "How to Become a Registered Nurse (RN) | NurseNest",
    description: "Complete career guide for becoming an RN. Education requirements, NCLEX-RN exam info, salary range ($60K-$95K), specializations, and step-by-step career path.",
  },
  "/how-to-become-a-nurse/np": {
    title: "How to Become a Nurse Practitioner (NP) | NurseNest",
    description: "Complete career guide for becoming an NP. Education requirements, AANP/ANCC certification exam info, salary range ($95K-$140K), and step-by-step career path.",
  },
  "/lectures": {
    title: "Video Lectures - Nursing Education | NurseNest",
    description: "Watch free nursing video lectures covering pathophysiology, pharmacology, and clinical skills. Visual learning for NCLEX, NCLEX-PN, and REx-PN exam preparation.",
  },
  "/simulators/clinical-skills": {
    title: "Clinical Skills Simulators - Nursing Practice | NurseNest",
    description: "Practice clinical nursing skills with interactive simulators. IV therapy, patient safety, medication administration, and clinical decision-making for nursing students.",
  },
  "/simulators/osce": {
    title: "OSCE Preparation Simulators | NurseNest",
    description: "Prepare for Objective Structured Clinical Examinations (OSCE) with interactive nursing simulators. Practice clinical competencies and assessment skills.",
  },
  "/simulators/clinical-lab": {
    title: "Clinical Lab Simulators - Lab Interpretation | NurseNest",
    description: "Practice clinical lab value interpretation with interactive simulators. ABG analysis, electrolyte interpretation, and diagnostic reasoning for nursing students.",
  },
  "/dashboard": {
    title: "Dashboard | NurseNest",
    description: "Your NurseNest learning dashboard. Track progress, view study analytics, and access your personalized learning path.",
  },
  "/question-of-the-day": {
    title: "Nursing Question of the Day - Free NCLEX Practice | NurseNest",
    description: "Answer a new nursing practice question every day. Free NCLEX, NCLEX-PN, and REx-PN exam prep with detailed rationales. Subscribe for daily email delivery.",
  },
  "/daily-question": {
    title: "Daily NCLEX Practice Question - Free Nursing Exam Prep | NurseNest",
    description: "Challenge yourself with a new NCLEX-style nursing question every day. Get detailed rationales, join the discussion, and track your progress. Free daily practice for NCLEX-RN, NCLEX-PN, and REx-PN.",
  },
  "/test-bank": {
    title: "Test Bank - 1,200+ Nursing Practice Questions | NurseNest",
    description: "Practice with 1,200+ nursing questions organized by body system and tier. Instant rationale display and progress tracking for NCLEX, NCLEX-PN, and REx-PN prep. New questions added weekly.",
  },
  "/nclex-rn/mock-exam": {
    title: "NCLEX-RN Mock Exam Simulator | Free Practice Test | NurseNest",
    description: "Take a realistic NCLEX-RN mock exam with computer adaptive testing simulation. 145 practice questions, detailed rationales, and performance analytics aligned to the 2024-2026 NCLEX-RN test plan.",
  },
  "/nclex-pn/mock-exam": {
    title: "NCLEX-PN Mock Exam Simulator | Free Practice Test | NurseNest",
    description: "Prepare for the NCLEX-PN with a realistic mock exam simulator. 150 practice questions with computer adaptive testing, rationales, and analytics for LPN/LVN students.",
  },
  "/rex-pn/mock-exam": {
    title: "REx-PN Mock Exam Simulator | Free Practice Test | NurseNest Canada",
    description: "Practice the Canadian REx-PN exam with a realistic mock simulator. 170 questions covering competencies tested on the Regulatory Exam for Practical Nurses in Canada.",
  },
  "/canada-np/mock-exam": {
    title: "Canadian NP Exam (CNPLE) Mock Simulator | NurseNest Canada",
    description: "Prepare for the Canadian Nurse Practitioner Licensing Exam (CNPLE) with a realistic mock exam. 200 advanced practice questions with rationales for NP students in Canada.",
  },
  "/us-np/mock-exam": {
    title: "US NP Certification Exam Mock Simulator (AANP/ANCC) | NurseNest",
    description: "Practice for AANP or ANCC nurse practitioner certification with a realistic mock exam. 175 advanced practice questions covering FNP, AGNP, and specialty content.",
  },
  "/perioperative-nursing": {
    title: "Perioperative Nursing Hub: Surgical Nursing & CNOR Exam Prep | NurseNest",
    description: "Master perioperative nursing with comprehensive resources on surgical safety, sterile technique, patient preparation, and CNOR exam prep. Lessons, practice questions, flashcards, and mock exams for OR nurses.",
  },
  "/preoperative-care": {
    title: "Preoperative Care Hub: Patient Preparation & Pre-Surgical Nursing | NurseNest",
    description: "Master preoperative nursing care with comprehensive resources on patient assessment, NPO guidelines, informed consent, medication management, and pre-surgical checklists for CNOR exam prep.",
  },
  "/preoperative-nursing-guide": {
    title: "Preoperative Nursing Guide: Complete Practice Reference for Surgical Preparation | NurseNest",
    description: "Evidence-based preoperative nursing guide covering patient assessment workflows, risk stratification tools, NPO guidelines, medication management, informed consent, and surgical safety protocols. Essential CNOR exam prep resource.",
  },
  "/perioperative-nurse-career": {
    title: "Perioperative Nurse Career Guide: CNOR Certification, Salary & Job Outlook | NurseNest",
    description: "Complete perioperative nursing career guide. Learn about CNOR certification requirements, salary ranges ($75K-$95K+), job outlook, education pathways, and career advancement in surgical nursing.",
  },
  "/nclex-rn": {
    title: "NCLEX-RN Exam Prep Hub | Study Guides, Mock Exams & Practice Questions | NurseNest",
    description: "Your complete NCLEX-RN exam prep hub. Access mock exams, practice questions, pharmacology flashcards, study guides, and lab value review all in one place.",
  },
  "/nclex-pn": {
    title: "NCLEX-PN Exam Prep Hub | Study Guides, Mock Exams & Practice Questions | NurseNest",
    description: "Your complete NCLEX-PN exam prep hub. Access mock exams, practice questions, pharmacology flashcards, study guides, and lab value review for LPN/LVN students.",
  },
  "/canada-np": {
    title: "Canadian NP (CNPLE) Exam Prep Hub | NurseNest Canada",
    description: "Your complete Canadian Nurse Practitioner exam prep hub. Access CNPLE mock exams, advanced practice questions, pharmacology review, and study guides.",
  },
  "/us-np": {
    title: "US NP Certification (AANP/ANCC) Exam Prep Hub | NurseNest",
    description: "Your complete US Nurse Practitioner certification exam prep hub. Access AANP/ANCC mock exams, advanced practice questions, and study guides.",
  },
  "/nclex-rn-practice-questions": {
    title: "NCLEX-RN Practice Questions | Free RN Exam Prep | NurseNest",
    description: "Practice NCLEX-RN questions with detailed rationales. System-based question banks, timed mock exams, and clinical judgment cases aligned to the 2024-2026 NCLEX-RN test plan.",
  },
  "/nclex-pn-practice-questions": {
    title: "NCLEX-PN Practice Questions | Free PN/LPN Exam Prep | NurseNest",
    description: "Practice NCLEX-PN questions with detailed rationales. RPN-level question banks, timed mock exams, and flashcards aligned to the NCLEX-PN test plan for LPN/LVN students.",
  },
  "/rex-pn-practice-questions": {
    title: "REx-PN Practice Questions | Canadian RPN Exam Prep | NurseNest",
    description: "Practice REx-PN questions with Canadian lab values, SI units, and scope-of-practice language. System-based question banks, timed mock exams, and study packs for Canadian RPN students.",
  },
  "/np-exam-practice-questions": {
    title: "NP Exam Practice Questions | AANP & ANCC Certification Prep | NurseNest",
    description: "Practice NP certification exam questions for AANP, ANCC, FNP-BC, and AGPCNP-BC. Advanced assessment, pharmacology, and clinical management questions with detailed rationales.",
  },
  "/free-practice": {
    title: "Free Nursing Practice Questions | Start Studying Now | NurseNest",
    description: "Try 10 free nursing practice questions with instant rationales. No sign-up required. Test your clinical knowledge before committing to a study plan.",
  },
  "/medical-imaging": {
    title: "Medical Imaging Academy - CAMRT & ARRT Exam Prep | NurseNest",
    description: "Prepare for CAMRT and ARRT radiography certification exams. Practice questions, positioning guides, physics review, flashcards, and adaptive exam simulators for Canada and USA.",
  },
  "/medical-imaging/canada": {
    title: "CAMRT Radiography Exam Prep - Canada | NurseNest",
    description: "Prepare for the CAMRT certification exam with Canada-specific radiographic positioning, radiation safety, patient care, and image evaluation aligned with Canadian practice standards.",
  },
  "/medical-imaging/usa": {
    title: "ARRT Radiography Exam Prep - USA | NurseNest",
    description: "Prepare for the ARRT certification exam with USA-specific radiographic positioning, NRC radiation safety, patient care, and image evaluation aligned with ASRT practice standards.",
  },
  "/medical-imaging/blog": {
    title: "Medical Imaging Blog - Study Guides & Articles | NurseNest",
    description: "Educational articles, how-to guides, and study strategies for radiography students preparing for CAMRT and ARRT certification exams.",
  },
  "/medical-imaging/blog/how-to-pass-arrt-exam": {
    title: "How to Pass the ARRT Exam on Your First Attempt | NurseNest",
    description: "Proven strategies to pass the ARRT radiography certification exam. Study schedule, content breakdown, practice question strategies, and test-day tips.",
  },
  "/medical-imaging/blog/top-50-radiology-questions": {
    title: "Top 50 ARRT Radiology Questions – Must-Know Exam Questions | NurseNest",
    description: "The 50 most important radiology questions for ARRT exam preparation. Covers physics, positioning, safety, patient care, and image quality with detailed rationales.",
  },
  "/medical-imaging/blog/common-imaging-mistakes": {
    title: "10 Common Imaging Mistakes New Radiography Technologists Make | NurseNest",
    description: "Avoid the 10 most common mistakes new radiography technologists make. Positioning errors, dose management, patient communication, and quality improvement.",
  },
  "/medical-imaging/usa/seo/x-ray-vs-ct-vs-mri": {
    title: "X-ray vs CT vs MRI – Complete Comparison Guide | NurseNest",
    description: "Compare x-ray, CT, and MRI imaging modalities. Learn the physics, clinical applications, advantages, and limitations for ARRT exam prep.",
  },
  "/medical-imaging/usa/seo/how-x-rays-work": {
    title: "How X-rays Work – X-ray Production Physics | NurseNest",
    description: "Learn how x-rays are produced including bremsstrahlung, characteristic radiation, tube components, and technical factors for ARRT exam preparation.",
  },
  "/medical-imaging/usa/seo/ct-scan-basics": {
    title: "CT Scan Basics – How Computed Tomography Works | NurseNest",
    description: "Understand CT scan fundamentals including helical scanning, Hounsfield units, windowing, reconstruction algorithms, and dose metrics for ARRT exam prep.",
  },
  "/medical-imaging/usa/seo/mri-basics": {
    title: "MRI Basics – How Magnetic Resonance Imaging Works | NurseNest",
    description: "Learn MRI fundamentals including T1/T2 weighting, pulse sequences, gadolinium contrast, and MRI safety for radiography students.",
  },
  "/medical-imaging/usa/seo/contrast-media-explained": {
    title: "Contrast Media Explained – Types, Reactions & Safety | NurseNest",
    description: "Comprehensive guide to contrast media: iodinated contrast, barium sulfate, gadolinium, reaction management, and CIN prevention for the ARRT exam.",
  },
  "/medical-imaging/usa/seo/imaging-artifacts-explained": {
    title: "Imaging Artifacts – Identification & Prevention Guide | NurseNest",
    description: "Identify and prevent common imaging artifacts in radiography, CT, and digital imaging. ARRT exam prep guide with solutions.",
  },
  "/medical-imaging/usa/seo/radiation-dose-explained": {
    title: "Radiation Dose Explained – Units & Measurement | NurseNest",
    description: "Understand radiation dose units (mGy, mSv), dose metrics (CTDIvol, DLP, SSDE), and biological dose concepts for ARRT exam preparation.",
  },
  "/medical-imaging/usa/seo/alara-principle": {
    title: "ALARA Principle – Radiation Protection Guide | NurseNest",
    description: "Master the ALARA principle for radiation protection. Practical dose minimization techniques while maintaining diagnostic image quality.",
  },
  "/medical-imaging/usa/seo/radiation-protection-techniques": {
    title: "Radiation Protection Techniques – Shielding & Distance | NurseNest",
    description: "Essential radiation protection techniques including shielding, time-distance principles, collimation, and technique optimization for ARRT exam prep.",
  },
  "/medical-imaging/usa/seo/scatter-radiation": {
    title: "Scatter Radiation – Causes, Effects & Reduction | NurseNest",
    description: "Understand scatter radiation: Compton effect, image quality impact, dose implications, and reduction techniques for ARRT exam preparation.",
  },
  "/medical-imaging/usa/seo/inverse-square-law": {
    title: "Inverse Square Law – Physics Calculations for ARRT | NurseNest",
    description: "Master inverse square law calculations for radiation intensity, SID corrections, and dose estimation. Step-by-step examples for ARRT exam prep.",
  },
  "/medical-imaging/usa/seo/shielding-exposure-limits": {
    title: "Radiation Shielding & Dose Limits – NCRP Guidelines | NurseNest",
    description: "NCRP radiation dose limits for workers, public, and pregnant workers. Complete guide to shielding types and exposure limits for ARRT exam prep.",
  },
  "/medical-imaging/usa/seo/chest-xray-positioning": {
    title: "Chest X-ray Positioning Guide – PA, Lateral & Special Views | NurseNest",
    description: "Master chest x-ray positioning including PA, lateral, AP, and decubitus projections with evaluation criteria and ARRT exam tips.",
  },
  "/medical-imaging/usa/seo/abdomen-imaging": {
    title: "Abdominal X-ray & Imaging Guide – Positioning & Pathology | NurseNest",
    description: "Complete guide to abdominal radiography positioning, normal anatomy, bowel gas patterns, and pathological findings for ARRT exam prep.",
  },
  "/medical-imaging/usa/seo/skull-imaging": {
    title: "Skull X-ray Positioning – Towne, Waters & Caldwell | NurseNest",
    description: "Master skull radiography projections including Towne, Waters, Caldwell, and lateral views with anatomy guide for ARRT exam preparation.",
  },
  "/medical-imaging/usa/seo/spine-imaging": {
    title: "Spine X-ray Positioning – Cervical, Thoracic & Lumbar | NurseNest",
    description: "Complete spine radiography positioning guide covering cervical, thoracic, and lumbar projections with CR angulation and evaluation criteria.",
  },
  "/medical-imaging/usa/seo/extremity-positioning": {
    title: "Extremity X-ray Positioning – Hands, Knee, Ankle & More | NurseNest",
    description: "Complete upper and lower extremity positioning guide for radiography. Hand, wrist, elbow, shoulder, knee, ankle, foot, and hip projections.",
  },
  "/medical-imaging/usa/seo/cross-sectional-anatomy": {
    title: "Cross-Sectional Anatomy for CT & MRI – Study Guide | NurseNest",
    description: "Essential cross-sectional anatomy for CT and MRI interpretation. Key landmarks from head to pelvis with clinical correlations for ARRT exam prep.",
  },
  "/radiography-practice-questions": {
    title: "Radiography Practice Questions - Free CAMRT & ARRT Exam Prep | NurseNest",
    description: "Practice radiography exam questions for CAMRT and ARRT certification. Timed practice exams, detailed rationales, and performance analytics for radiologic technologists.",
  },
  "/radiography-positioning-guide": {
    title: "Radiographic Positioning Guide - Complete Reference | NurseNest",
    description: "Complete radiographic positioning reference with patient positions, central ray directions, anatomy demonstrated, and evaluation criteria for every projection.",
  },
  "/radiography-artifact-recognition": {
    title: "Radiographic Artifact Recognition - Identify & Prevent | NurseNest",
    description: "Learn to identify, prevent, and correct radiographic image artifacts. Covers motion artifacts, equipment artifacts, processing errors, and patient-related artifacts.",
  },
  "/how-to-become-a-paramedic": {
    title: "How to Become a Paramedic: Career Guide for 2026 | NurseNest",
    description: "Learn the steps to becoming a paramedic, including education requirements, NREMT/COPR certification, salary expectations ($50K-$90K+), and career outlook in Canada and the USA.",
  },
  "/how-to-become-a-respiratory-therapist": {
    title: "How to Become a Respiratory Therapist (RRT): Career Guide for 2026 | NurseNest",
    description: "Discover respiratory therapist education pathways, NBRC/CBRC certification exams, salary expectations ($62K-$95K+), and a 12-14% job growth outlook.",
  },
  "/how-to-become-a-medical-lab-technologist": {
    title: "How to Become a Medical Lab Technologist (MLT): Career Guide for 2026 | NurseNest",
    description: "Explore MLT education, CSMLS/ASCP certification, salary expectations ($55K-$90K+), and career outlook for medical laboratory technologists in Canada and the USA.",
  },
  "/how-to-become-a-radiologic-technologist": {
    title: "How to Become a Radiologic Technologist: Career Guide for 2026 | NurseNest",
    description: "Learn radiologic technologist education requirements, ARRT/CAMRT certification, salary expectations ($60K-$95K+), and career growth for imaging professionals.",
  },
  "/how-to-become-a-social-worker": {
    title: "How to Become a Licensed Clinical Social Worker (LCSW): Career Guide for 2026 | NurseNest",
    description: "Explore the path to becoming an LCSW, including MSW degree requirements, ASWB exam prep, salary expectations ($55K-$95K+), and 7-9% job growth.",
  },
  "/how-to-become-a-psychotherapist": {
    title: "How to Become a Registered Psychotherapist: Career Guide for 2026 | NurseNest",
    description: "Learn psychotherapist education, CRPO/NCE registration exams, salary expectations ($50K-$100K+), and the 18-22% job growth outlook for mental health counselors.",
  },
  "/how-to-become-an-addictions-counselor": {
    title: "How to Become an Addictions Counselor: Career Guide for 2026 | NurseNest",
    description: "Discover addictions counselor certification pathways, IC&RC/CACCF exams, salary expectations ($45K-$80K+), and 18-25% job growth outlook.",
  },
  "/how-to-become-an-occupational-therapist": {
    title: "How to Become an Occupational Therapist (OT): Career Guide for 2026 | NurseNest",
    description: "Learn OT education requirements, NBCOT/NOTCE certification, salary expectations ($72K-$110K+), and 12-14% job growth for occupational therapists.",
  },
  "/how-to-become-a-pharmacy-technician": {
    title: "How to Become a Pharmacy Technician: Career Guide for 2026 | NurseNest",
    description: "Explore pharmacy technician education, PTCB/PEBC certification, salary expectations ($37K-$55K+), and career growth in retail, hospital, and specialty pharmacies.",
  },
  "/applynest": {
    title: "ApplyNest - Healthcare Career Placement | Job Search, Resumes & Interview Prep",
    description: "Launch your healthcare career with ApplyNest. Career guides, resume templates, interview prep, salary data, and job search resources for nursing and allied health professionals.",
  },
  "/applynest/resume-templates": {
    title: "Healthcare Resume Templates - New Grad, Experienced & Specialty | ApplyNest",
    description: "Free healthcare resume templates for new graduates, experienced professionals, and specialty transitions. Nursing, paramedic, RT, MLT, imaging, and pharmacy tech formats.",
  },
  "/applynest/interview-prep": {
    title: "Healthcare Interview Questions & Answers - Interview Prep | ApplyNest",
    description: "Common healthcare interview questions with sample answers and expert tips. Behavioral, clinical, and technical questions for nursing and allied health job interviews.",
  },
  "/applynest/job-search-guide": {
    title: "Healthcare Job Search Guide - Find, Evaluate & Negotiate Offers | ApplyNest",
    description: "Complete healthcare job search guide. Where to find jobs, how to evaluate offers, salary negotiation tips, and credentialing timelines for healthcare professionals.",
  },
  "/rrt-exam-prep": {
    title: "RRT Exam Prep | NBRC TMC & CSE Practice Questions | NurseNest",
    description: "Complete RRT exam preparation for NBRC TMC, CSE, and CBRC certification. Practice questions, ABG analysis, ventilator management, and mock exams with detailed rationales.",
  },
  "/mlt-exam-prep": {
    title: "MLT Exam Prep | CSMLS & ASCP Practice Questions | NurseNest",
    description: "Complete MLT exam preparation for CSMLS (Canada) and ASCP (USA) certification. 1,000+ practice questions, flashcards, mock exams, lab image drills, and personalized study plans.",
  },
  "/radiography-exam-prep": {
    title: "Radiography Exam Prep | CAMRT & ARRT Practice Questions | NurseNest",
    description: "Complete radiography exam preparation for CAMRT (Canada) and ARRT (USA) certification. Practice questions, positioning guides, physics review, flashcards, and adaptive exam simulators.",
  },
  "/social-work-exam-prep": {
    title: "Social Work Exam Prep | ASWB Clinical & Masters Practice Questions | NurseNest",
    description: "Complete ASWB exam preparation for Clinical, Masters, and Advanced Generalist levels. Practice questions, DSM-5 case studies, ethics scenario drills, mock exams, and personalized study plans.",
  },
  "/psychotherapy-exam-prep": {
    title: "Psychotherapy Exam Prep | CRPO, NCE & Counseling Certification | NurseNest",
    description: "Complete psychotherapy exam preparation for CRPO Registration Exam, NCE, CMHCE, and CCC certification. Practice questions, therapeutic modality simulations, mock exams, and clinical rationales.",
  },
  "/addictions-counselling-exam-prep": {
    title: "Addictions Counselling Exam Prep | IC&RC ADC & CASAC | NurseNest",
    description: "Complete addictions counselor exam preparation for IC&RC ADC, CASAC, and CCAC certification. Practice questions, motivational interviewing simulations, substance identification drills, and mock exams.",
  },
  "/nursing-exam-prep": {
    title: "Nursing Exam Prep — NCLEX-RN, NCLEX-PN, REx-PN & NP Certification Review | NurseNest",
    description: "Complete nursing exam preparation for NCLEX-RN, NCLEX-PN, REx-PN, and NP certification. 13,000+ practice questions, adaptive mock exams, pharmacology flashcards, and pathophysiology lessons. Start your clinical review today.",
  },
  "/hyperkalemia-effects-on-heart": {
    title: "Hyperkalemia Effects on the Heart — Nursing Physiology and ECG Changes | NurseNest",
    description: "Understand how hyperkalemia affects the heart: peaked T waves, widened QRS, cardiac arrest risk, and essential nursing interventions. Clinical guide for NCLEX, REx-PN, and nursing exam preparation.",
  },
  "/nursing-simulation-practice": {
    title: "Nursing Simulation Practice — Clinical Scenarios and Skills Training | NurseNest",
    description: "Enhance clinical competence with nursing simulation practice. Interactive patient scenarios, SBAR communication drills, clinical judgment exercises, and structured debriefing for nursing students preparing for exams.",
  },
  "/nursing/top-100-nclex-practice-questions": {
    title: "Top 100 NCLEX Practice Questions (2025) — Free Study Guide | NurseNest",
    description: "Practice 100 essential NCLEX-RN and NCLEX-PN questions with detailed rationales. Covers pharmacology, med-surg, prioritization, maternal-newborn, and more. Free study guide.",
  },
  "/paramedic/top-100-paramedic-exam-questions": {
    title: "Top 100 Paramedic Exam Questions (NREMT 2025) — Free Practice | NurseNest",
    description: "Practice 100 essential NREMT and COPR paramedic exam questions with detailed rationales. Covers cardiac emergencies, trauma, airway management, pharmacology, and more.",
  },
  "/respiratory-therapy/ultimate-respiratory-therapy-study-guide": {
    title: "Ultimate Respiratory Therapy Study Guide (2025) — TMC & CSE Exam | NurseNest",
    description: "Comprehensive respiratory therapy study guide for NBRC TMC and CSE exam prep. Covers ABG interpretation, mechanical ventilation, PFTs, neonatal care, and 100+ practice questions.",
  },
  "/mlt/complete-guide-medical-laboratory-science": {
    title: "Complete Guide to Medical Lab Science (2025) — CSMLS & ASCP Exam | NurseNest",
    description: "Comprehensive medical laboratory science study guide for CSMLS and ASCP certification. Covers hematology, microbiology, blood banking, chemistry, and quality control with practice questions.",
  },
  "/imaging/definitive-radiography-exam-preparation-guide": {
    title: "Definitive Radiography Exam Guide (2025) — ARRT & CAMRT Prep | NurseNest",
    description: "Complete radiography exam preparation guide for ARRT and CAMRT certification. Covers positioning, image production, radiation physics, CT imaging, and safety with practice questions.",
  },
  "/social-work/ultimate-aswb-exam-study-guide": {
    title: "Ultimate ASWB Exam Study Guide (2025) — Social Work Licensing | NurseNest",
    description: "Comprehensive ASWB exam study guide for Clinical, Masters, and Bachelors licensing. Covers DSM-5, ethics, intervention theories, crisis management, and practice questions.",
  },
  "/psychotherapy/complete-psychotherapy-licensing-exam-guide": {
    title: "Complete Psychotherapy Exam Guide (2025) — CRPO & NCE Prep | NurseNest",
    description: "Comprehensive psychotherapy licensing exam guide for CRPO registration and NCE certification. Covers CBT, DBT, EMDR, ethics, DSM-5, and clinical assessment with practice questions.",
  },
  "/addictions/top-100-addictions-counsellor-exam-questions": {
    title: "Top 100 Addictions Counsellor Exam Questions (2025) | NurseNest",
    description: "Practice 100 essential IC&RC and CCAC addictions counselling exam questions. Covers motivational interviewing, withdrawal management, harm reduction, ethics, and treatment planning.",
  },
  "/occupational-therapy/ultimate-nbcot-exam-preparation-guide": {
    title: "Ultimate NBCOT Exam Prep Guide (2025) — OT Certification | NurseNest",
    description: "Comprehensive NBCOT exam preparation guide for OTR and COTA certification. Covers OT theory, clinical reasoning, pediatric OT, adult rehab, mental health, and practice questions.",
  },
  "/pharmacy-tech/top-100-pharmacy-technician-exam-questions": {
    title: "Top 100 Pharmacy Technician Exam Questions (2025) — PTCB Prep | NurseNest",
    description: "Practice 100 essential PTCB and ExCPT pharmacy technician exam questions with detailed rationales. Covers pharmacy calculations, pharmacology, law, compounding, and medication safety.",
  },
  "/new-graduate-support": {
    title: "New Graduate Nurse Support Hub | Transition to Practice | NurseNest",
    description: "Comprehensive resources for new graduate nurses transitioning to practice. Clinical confidence builders, preceptor guides, resume help, and first-year survival strategies.",
  },
  "/healthcare-careers": {
    title: "Healthcare Career Explorer | Nursing & Allied Health Pathways | NurseNest",
    description: "Explore healthcare career paths in nursing, paramedicine, respiratory therapy, medical lab science, imaging, social work, and more. Salary data, education requirements, and job outlook.",
  },
  "/healthcare-careers/registered-nurse": {
    title: "Registered Nurse (RN) Career Guide | Salary, Education & Outlook | NurseNest",
    description: "Complete guide to becoming a Registered Nurse. Education pathways, NCLEX-RN licensing, salary ranges ($60K–$120K), work environments, and career advancement opportunities.",
  },
  "/healthcare-careers/licensed-practical-nurse": {
    title: "Licensed Practical Nurse (LPN/LVN) Career Guide | NurseNest",
    description: "Career guide for Licensed Practical Nurses. Education requirements, NCLEX-PN exam prep, salary data ($40K–$62K), work settings, and advancement pathways.",
  },
  "/healthcare-careers/nurse-practitioner": {
    title: "Nurse Practitioner (NP) Career Guide | Salary & Specializations | NurseNest",
    description: "Comprehensive NP career guide. Graduate education pathways, certification exams, salary ranges ($90K–$150K), specializations, and prescriptive authority details.",
  },
  "/healthcare-careers/respiratory-therapist": {
    title: "Respiratory Therapist (RRT) Career Guide | NurseNest",
    description: "Guide to becoming a Respiratory Therapist. NBRC TMC/CSE exams, education requirements, salary ranges ($55K–$95K), and career advancement opportunities.",
  },
  "/healthcare-careers/radiologic-technologist": {
    title: "Radiologic Technologist Career Guide | NurseNest",
    description: "Career guide for Radiologic Technologists. ARRT certification, education pathways, salary data ($55K–$90K), imaging specializations, and job growth outlook.",
  },
  "/healthcare-careers/sonographer": {
    title: "Diagnostic Medical Sonographer Career Guide | NurseNest",
    description: "Complete sonographer career guide. ARDMS certification, ultrasound specializations, salary ranges ($60K–$100K), education pathways, and job outlook.",
  },
  "/healthcare-careers/physical-therapist-assistant": {
    title: "Physical Therapist Assistant (PTA) Career Guide | NurseNest",
    description: "PTA career guide covering education, NPTE-PTA exam, salary ranges ($48K–$72K), work environments, and advancement opportunities in physical therapy.",
  },
  "/healthcare-careers/occupational-therapy-assistant": {
    title: "Occupational Therapy Assistant (OTA) Career Guide | NurseNest",
    description: "OTA career guide with education pathways, NBCOT-COTA exam details, salary data ($50K–$75K), work settings, and career growth outlook.",
  },
  "/healthcare-careers/surgical-technologist": {
    title: "Surgical Technologist Career Guide | NurseNest",
    description: "Guide to becoming a Surgical Technologist. NBSTSA certification, education requirements, salary ranges ($45K–$72K), OR specializations, and advancement paths.",
  },
  "/healthcare-careers/medical-laboratory-technologist": {
    title: "Medical Laboratory Technologist (MLT) Career Guide | NurseNest",
    description: "MLT career guide covering CSMLS/ASCP certification, lab specializations, salary ranges ($50K–$85K), education pathways, and career advancement.",
  },
  "/healthcare-careers/paramedic": {
    title: "Paramedic / EMT Career Guide | NurseNest",
    description: "Paramedic career guide with NREMT certification details, education pathways, salary ranges ($35K–$65K), work environments, and advancement opportunities.",
  },
  "/healthcare-careers/pharmacy-technician": {
    title: "Pharmacy Technician Career Guide | NurseNest",
    description: "Pharmacy technician career guide covering PTCB/ExCPT certification, education requirements, salary ranges ($30K–$50K), pharmacy settings, and career growth.",
  },
  "/guides": {
    title: "Healthcare Career Guides | Complete How-To Guides | NurseNest",
    description: "In-depth healthcare career guides covering nursing, paramedicine, respiratory therapy, medical lab technology, and radiography. Education pathways, certification requirements, and career advice.",
  },
  "/guides/complete-guide-to-becoming-a-registered-nurse": {
    title: "Complete Guide to Becoming a Registered Nurse (RN) | NurseNest",
    description: "Everything you need to know about becoming an RN. Education pathways, NCLEX-RN exam prep, clinical requirements, salary expectations, and career growth opportunities.",
  },
  "/guides/complete-guide-to-becoming-an-rpn-lvn": {
    title: "Complete Guide to Becoming an RPN / LVN | NurseNest",
    description: "Step-by-step guide to becoming a Registered Practical Nurse (RPN) or Licensed Vocational Nurse (LVN). NCLEX-PN/REx-PN prep, education, and career outlook.",
  },
  "/guides/complete-guide-to-becoming-a-respiratory-therapist": {
    title: "Complete Guide to Becoming a Respiratory Therapist | NurseNest",
    description: "Comprehensive guide to becoming a respiratory therapist. NBRC TMC/CSE exam prep, education requirements, salary data, and career advancement pathways.",
  },
  "/guides/complete-guide-to-becoming-a-paramedic": {
    title: "Complete Guide to Becoming a Paramedic | NurseNest",
    description: "Full career guide for aspiring paramedics. NREMT/COPR certification, training programs, salary expectations, and career opportunities in emergency medicine.",
  },
  "/guides/complete-guide-to-becoming-a-medical-lab-technologist": {
    title: "Complete Guide to Becoming a Medical Lab Technologist | NurseNest",
    description: "Detailed MLT career guide covering CSMLS/ASCP certification, education pathways, lab specializations, salary ranges, and job growth outlook.",
  },
  "/healthcare-policy-and-updates": {
    title: "Healthcare Policy & Updates Hub: Licensing, Exam Changes, Regulatory Updates | NurseNest",
    description: "Stay informed on healthcare policy changes affecting nurses. Evergreen guides on licensing policy updates, international nursing recruitment, exam format changes, and regulatory developments.",
  },
  "/healthcare-policy-and-updates/licensing-policy-changes": {
    title: "Nursing Licensing Policy Changes: Compact Licenses, Scope of Practice & Licensure Updates | NurseNest",
    description: "Comprehensive guide to nursing licensure policy changes including Nurse Licensure Compact updates, scope of practice changes, endorsement requirements, and license renewal policies across jurisdictions.",
  },
  "/healthcare-policy-and-updates/international-nursing-recruitment": {
    title: "International Nursing Recruitment Policies: Credential Evaluation, Visa Pathways & Bridging Programs | NurseNest",
    description: "Guide to international nursing recruitment policies including credential evaluation processes, visa and immigration pathways, bridging program requirements, and recruitment agency regulations.",
  },
  "/healthcare-policy-and-updates/exam-format-updates": {
    title: "Nursing Exam Format Updates: NGN, CAT Changes, Score Reporting & Testing Policies | NurseNest",
    description: "Stay current with nursing exam format changes. Comprehensive guide covering Next Generation NCLEX updates, computerized adaptive testing changes, score reporting modifications, and testing center policies.",
  },
  "/healthcare-policy-and-updates/regulatory-changes-affecting-nurses": {
    title: "Regulatory Changes Affecting Nurses: Staffing Laws, Safety Standards & Practice Requirements | NurseNest",
    description: "Comprehensive guide to healthcare regulatory changes affecting nursing practice. Covers staffing ratio laws, patient safety regulations, telehealth standards, and workplace safety requirements.",
  },
  "/nursing-certifications": {
    title: "Nursing Certifications Hub | Specialty Credentials & Exam Prep | NurseNest",
    description: "Explore nursing specialty certifications including CNOR, CCRN, CEN, and more. Certification requirements, exam prep resources, and career advancement guides.",
  },
  "/study-pathways": {
    title: "Personalized Study Pathways | Guided Nursing Exam Prep | NurseNest",
    description: "Customized study pathways for nursing students. Structured learning plans for NCLEX-RN, NCLEX-PN, REx-PN, and NP certification exams based on your strengths and weaknesses.",
  },
  "/topics": {
    title: "Nursing Topics A-Z | Clinical Study Library | NurseNest",
    description: "Browse nursing topics alphabetically. Pathophysiology, pharmacology, clinical skills, and exam prep content organized by topic for easy reference and study.",
  },
  "/nursing": {
    title: "Nursing Hub | NCLEX, REx-PN & NP Exam Prep Resources | NurseNest",
    description: "Your complete nursing education hub. Access lessons, practice questions, flashcards, mock exams, and study resources for NCLEX-RN, NCLEX-PN, REx-PN, and NP certification.",
  },
  "/nursing-specialties": {
    title: "Nursing Specialties | Explore Specialty Career Paths | NurseNest",
    description: "Explore nursing specialty areas including ICU, pediatrics, labor & delivery, mental health, oncology, and more. Certification guides, salary data, and career pathways.",
  },
  "/nursing-schools": {
    title: "Nursing Schools Directory – Global Programs Guide | NurseNest",
    description: "Comprehensive directory of nursing schools worldwide. Compare programs, tuition, admissions requirements, and licensing outcomes across 6 countries.",
  },
  "/nurse-residency-programs": {
    title: "Nurse Residency & New Grad Programs Directory | NurseNest",
    description: "Directory of nurse residency and new graduate programs. Find transition-to-practice programs by country, hospital system, and specialty.",
  },
  "/nursing-regulatory-bodies": {
    title: "Nursing Regulatory Bodies Directory – Licensing & Registration Guide | NurseNest",
    description: "Complete directory of nursing regulatory bodies worldwide. Understand licensing requirements, registration processes, and credential recognition.",
  },
  "/nursing-licensing-exams": {
    title: "Nursing Licensing Exams Database – NCLEX, REx-PN, NMC CBT, AHPRA & More | NurseNest",
    description: "Comprehensive database of nursing licensing examinations worldwide. Compare exam formats, requirements, and preparation strategies for NCLEX, REx-PN, NMC CBT, AHPRA, Prometric, IELTS, and OET.",
  },
  "/nurse-salary-guide": {
    title: "Nurse Salary Guide: Compare Nursing Salaries by Country | NurseNest",
    description: "Comprehensive nurse salary guide comparing nursing salaries, benefits, and career outlook across Canada, United States, United Kingdom, and Australia.",
  },
  "/nurse-salary-canada": {
    title: "Nurse Salary in Canada: Average Pay, Specialties & Career Outlook | NurseNest",
    description: "Complete guide to nursing salaries in Canada including average pay by province, specialty, and experience level. RN, RPN, and NP salary data.",
  },
  "/nurse-salary-united-states": {
    title: "Nurse Salary in the United States: Average Pay, Specialties & Outlook | NurseNest",
    description: "Complete guide to nursing salaries in the US including average pay by state, specialty, and experience level. RN, LPN, NP, and CRNA salary data.",
  },
  "/nurse-salary-united-kingdom": {
    title: "Nurse Salary in the United Kingdom: NHS Pay Bands & Career Guide | NurseNest",
    description: "Complete guide to nursing salaries in the UK including NHS pay bands, specialty pay, London weighting, and career progression from Band 5 to Band 8.",
  },
  "/nurse-salary-australia": {
    title: "Nurse Salary in Australia: Average Pay, Specialties & Career Outlook | NurseNest",
    description: "Complete guide to nursing salaries in Australia including average pay by state, specialty, and experience level. Penalty rates and enterprise bargaining explained.",
  },
  "/rpn": {
    title: "RPN / LVN Track | NCLEX-PN & REx-PN Exam Prep | NurseNest",
    description: "Comprehensive RPN/LVN exam preparation. Practice questions, flashcards, mock exams, and study resources tailored for NCLEX-PN and REx-PN certification exams.",
  },
  "/rn": {
    title: "RN Track | NCLEX-RN Exam Prep | NurseNest",
    description: "Complete RN exam preparation with NCLEX-RN practice questions, clinical case simulations, pharmacology flashcards, and adaptive mock exams.",
  },
  "/np": {
    title: "Nurse Practitioner Track | AANP & ANCC Certification Prep | NurseNest",
    description: "Advanced NP certification exam preparation for AANP and ANCC. Practice questions, differential diagnosis cases, pharmacology review, and mock exams.",
  },
  "/jobs": {
    title: "New Grad Healthcare Jobs — Entry Level Nursing, NP, Allied Health Positions | NurseNest",
    description: "Browse new graduate healthcare job listings including RN, LPN, Nurse Practitioner, and allied health positions. Filter by location, profession, and experience level. Find your first healthcare job with resume and interview prep tools.",
  },
  "/newgrad": {
    title: "Nursing Interview Questions & New Grad Career Hub — Interview Prep, Resume Tools & First Year Survival | NurseNest",
    description: "Top nursing interview questions, new grad nurse interview prep, and nurse behavioral interview questions with STAR-format answers. Free first nursing job interview practice, scenario questions, resume templates, salary negotiation tools, and burnout prevention strategies.",
  },
  "/newgrad/interview": {
    title: "Nursing Interview Questions — 100+ Behavioral & Clinical Scenario Questions | NurseNest",
    description: "Master nursing interview questions with 100+ behavioral interview questions, clinical scenario practice, and STAR-format sample answers. New grad nurse interview prep covering ICU, ER, Med-Surg, Pediatrics, and L&D specialties.",
  },
  "/newgrad/resume": {
    title: "New Grad Nurse Resume Guide — ATS-Optimized Templates & Examples | NurseNest",
    description: "Build an ATS-optimized nursing resume with professional templates designed for new graduate nurses. Cover letter examples, clinical placement formatting, and recruiter-approved formats for your first nursing job.",
  },
  "/newgrad/guides": {
    title: "New Graduate Nurse Guides — Clinical Skills, Unit Orientation & Career Resources | NurseNest",
    description: "Comprehensive guides for new graduate nurses covering clinical skill development, unit-specific orientation, specialty selection, and professional development. Free career resources for your first year of nursing.",
  },
  "/newgrad/career": {
    title: "Nursing Career Development — Specialties, Growth & Advancement for New Grads | NurseNest",
    description: "Explore nursing career paths, specialty options, and advancement strategies for new graduate nurses. From bedside nursing to leadership, education, and advanced practice roles.",
  },
  "/newgrad/workplace": {
    title: "Workplace Navigation for New Nurses — Communication, Teamwork & Conflict Resolution | NurseNest",
    description: "Navigate nursing workplace dynamics with guides on team communication, conflict resolution, preceptor relationships, and professional boundaries. Essential workplace survival skills for new graduate nurses.",
  },
  "/newgrad/burnout": {
    title: "New Nurse Burnout Prevention — Self-Care, Resilience & Mental Health | NurseNest",
    description: "Prevent nursing burnout with evidence-based self-care strategies, resilience building, stress management techniques, and mental health resources designed for new graduate nurses in their first year.",
  },
  "/newgrad/salary": {
    title: "New Grad Nurse Salary Guide — Negotiation Scripts & Market Data | NurseNest",
    description: "Comprehensive salary guide for new graduate nurses with market data by region, specialty salary comparisons, negotiation scripts, and total compensation analysis. Know your worth in your first nursing job.",
  },
  "/newgrad/scenarios": {
    title: "Nursing Job Scenario Questions — Workplace Practice Simulations | NurseNest",
    description: "Practice nursing job scenario questions with realistic workplace simulations. Behavioral scenarios, clinical decision-making practice, and situational judgment exercises for new grad nurse interview preparation.",
  },
  "/newgrad/professional-development": {
    title: "Professional Development for New Nurses — Continuing Education & Growth | NurseNest",
    description: "Professional development resources for new graduate nurses including continuing education planning, portfolio building, leadership development, and career milestone tracking.",
  },
  "/newgrad/survival-guide": {
    title: "New Grad Nurse Survival Guide — First Year Transition & Confidence Building | NurseNest",
    description: "The ultimate first-year nursing survival guide. Orientation preparation, clinical confidence building, time management, documentation tips, and transition-to-practice strategies for new graduate nurses.",
  },
  "/newgrad/clinical-references": {
    title: "Clinical Quick References for New Nurses — Lab Values, Meds & Procedures | NurseNest",
    description: "Essential clinical quick reference guides for new graduate nurses. Lab value ranges, common medications, nursing procedures, assessment checklists, and clinical decision-making frameworks.",
  },
  "/newgrad/certifications": {
    title: "New Grad Certifications: ACLS, BLS, PALS, TNCC, NRP, CEN, CCRN | NurseNest",
    description: "Essential hospital certifications for new graduate nurses. Comprehensive prep guides for ACLS, BLS, PALS, TNCC, NRP, CEN, and CCRN with practice questions, study resources, and exam tips.",
  },
  "/newgrad/certifications/bls": {
    title: "BLS Certification Prep: Practice Questions & Study Guide | NurseNest",
    description: "Prepare for BLS certification with 150+ practice questions, study roadmap, and clinical pearls. Master high-quality CPR, AED operation, and basic life support for healthcare providers.",
  },
  "/newgrad/certifications/acls": {
    title: "ACLS Certification Prep: Practice Test & Algorithms Review | NurseNest",
    description: "Prepare for ACLS certification with 200+ practice questions, algorithm review, and clinical scenarios. Master cardiac arrest management, rhythm recognition, and advanced pharmacology.",
  },
  "/newgrad/certifications/pals": {
    title: "PALS Certification Prep: Practice Questions & Pediatric Review | NurseNest",
    description: "Prepare for PALS certification with 180+ practice questions, pediatric assessment guides, and weight-based dosing review. Master pediatric emergencies and PALS algorithms.",
  },
  "/rex-pn": {
    title: "REx-PN Exam Prep Hub | Canadian RPN Exam Review | NurseNest",
    description: "Complete REx-PN exam preparation for Canadian practical nursing students. Mock exams, practice questions, study strategies, wellness tips, and exam format guide.",
  },
  "/rex-pn/exam-format": {
    title: "REx-PN Exam Format Guide | What to Expect | NurseNest",
    description: "Understand the REx-PN exam format, question types, time limits, and scoring. Complete guide to help Canadian RPN students prepare for exam day.",
  },
  "/rex-pn/test-taking-strategies": {
    title: "REx-PN Test-Taking Strategies | Proven Tips | NurseNest",
    description: "Expert test-taking strategies for the REx-PN exam. Time management, question analysis, elimination techniques, and stress management tips.",
  },
  "/rex-pn/wellness": {
    title: "REx-PN Exam Wellness | Stress Management & Self-Care | NurseNest",
    description: "Wellness strategies for REx-PN exam preparation. Managing test anxiety, self-care routines, study-life balance, and mental health tips for nursing students.",
  },
  "/pass-nclex-first-time": {
    title: "How to Pass NCLEX on Your First Attempt | NurseNest",
    description: "Proven strategies to pass the NCLEX exam on your first try. Study plans, practice question tips, test-day advice, and common mistakes to avoid.",
  },
  "/for-institutions": {
    title: "NurseNest for Institutions | Group Licensing & Faculty Tools | NurseNest",
    description: "NurseNest institutional partnerships for nursing programs. Group licensing, faculty dashboards, student analytics, and curriculum integration for nursing schools.",
  },
  "/clinical-skills": {
    title: "Clinical Skills Hub | Nursing Competencies & Practice | NurseNest",
    description: "Master essential clinical nursing skills. IV insertion, wound care, medication administration, patient assessment, and competency-based practice guides.",
  },
  "/order-of-the-draw": {
    title: "Order of the Draw | Phlebotomy Tube Guide | NurseNest",
    description: "Complete phlebotomy order of the draw guide. Blood collection tube colors, additives, inversions, and common errors for nursing and lab students.",
  },
  "/clinical-case-studies": {
    title: "Clinical Case Studies | Real-World Nursing Scenarios | NurseNest",
    description: "Practice clinical decision-making with evidence-based case studies. Complex patient scenarios with diagnostic reasoning and nursing intervention analysis.",
  },
  "/allied-health": {
    title: "Allied Health Exam Prep — Practice Questions & Mock Exams | NurseNest",
    description: "Pass your allied health certification exam with career-specific practice questions, blueprint-weighted mock exams, flashcards, and AI study tools for RRT, Paramedic, Pharmacy Tech, MLT, and Imaging professionals.",
  },
  "/practice-questions": {
    title: "Nursing Practice Questions | NCLEX & REx-PN Question Bank | NurseNest",
    description: "Free nursing practice questions organized by system and exam tier. NCLEX-RN, NCLEX-PN, REx-PN, and NP questions with detailed clinical rationales.",
  },
  "/pharmacology": {
    title: "Pharmacology Hub | Nursing Drug Review & Practice | NurseNest",
    description: "Master nursing pharmacology with drug class reviews, mechanism of action guides, side effect profiles, and NCLEX-focused practice questions.",
  },
  "/rpn/test-bank": {
    title: "RPN Test Bank | NCLEX-PN & REx-PN Practice Questions | NurseNest",
    description: "Comprehensive RPN/LVN test bank with practice questions organized by body system. Track progress and identify weak areas for NCLEX-PN and REx-PN exam prep.",
  },
  "/rn/test-bank": {
    title: "RN Test Bank | NCLEX-RN Practice Questions by System | NurseNest",
    description: "Complete RN test bank with NCLEX-RN practice questions organized by body system. Adaptive difficulty, detailed rationales, and performance analytics.",
  },
  "/np/test-bank": {
    title: "NP Test Bank | Advanced Practice Questions | NurseNest",
    description: "Nurse Practitioner test bank with advanced practice questions for AANP and ANCC certification. Differential diagnosis, pharmacology, and clinical management.",
  },
  "/login": {
    title: "Log In | NurseNest",
    description: "Log in to your NurseNest account to access nursing lessons, flashcards, and exam prep tools.",
  },
  "/profile": {
    title: "Your Profile | NurseNest",
    description: "Manage your NurseNest profile, view progress, and customize your learning experience.",
  },
  "/reports": {
    title: "Performance Reports | NurseNest",
    description: "Track your learning progress with detailed performance reports. Identify strengths and weak areas for focused study.",
  },
  "/paramedic-exam-study-guide": {
    title: "Paramedic Exam Study Guide | NREMT & COPR Prep 2025 | NurseNest",
    description: "Comprehensive paramedic exam study guide covering the NREMT and COPR exam blueprints. Topics breakdown, study strategies, practice questions, and flashcard decks for PCP and ACP certification.",
  },
  "/rrt-exam-study-guide": {
    title: "RRT Exam Study Guide | NBRC TMC & CSE Prep 2025 | NurseNest",
    description: "Comprehensive RRT exam study guide for the NBRC TMC and Clinical Simulation Exam. Ventilator management, ABG interpretation, airway management, and all tested domains with study strategies.",
  },
  "/mlt-exam-study-guide": {
    title: "MLT Exam Study Guide | CSMLS & ASCP Certification Prep 2025 | NurseNest",
    description: "Comprehensive MLT exam study guide for CSMLS and ASCP BOC certification. Hematology, clinical chemistry, microbiology, blood banking topics with study strategies and practice resources.",
  },
  "/imaging-exam-study-guide": {
    title: "Imaging Exam Study Guide | ARRT & CAMRT Radiography Prep 2025 | NurseNest",
    description: "Comprehensive medical imaging exam study guide for ARRT and CAMRT radiography certification. Positioning, image production, radiation safety, and patient care with study strategies.",
  },
  "/social-work-exam-study-guide": {
    title: "Social Work Exam Study Guide | ASWB Licensing Exam Prep 2025 | NurseNest",
    description: "Comprehensive social work exam study guide for ASWB Clinical and Masters licensing exams. DSM-5 diagnosis, treatment planning, ethics, and human development with proven study strategies.",
  },
  "/psychotherapy-exam-study-guide": {
    title: "Psychotherapy Exam Study Guide | CRPO & NCE Licensing Prep 2025 | NurseNest",
    description: "Comprehensive psychotherapy exam study guide for CRPO registration and NCE licensing. Therapeutic modalities, ethical practice, clinical assessment, and professional standards with study strategies.",
  },
  "/addictions-exam-study-guide": {
    title: "Addictions Exam Study Guide | IC&RC ADC & CCAC Prep 2025 | NurseNest",
    description: "Comprehensive addictions counsellor exam study guide for IC&RC ADC and CCAC certification. Screening and assessment, treatment planning, motivational interviewing, and relapse prevention strategies.",
  },
  "/occupational-therapy-exam-study-guide": {
    title: "OT Exam Study Guide | NBCOT OTR & NOTCE Prep 2025 | NurseNest",
    description: "Comprehensive occupational therapy exam study guide for NBCOT OTR and NOTCE certification. Evaluation, intervention planning, OT theory, and clinical reasoning with proven study strategies.",
  },
  "/respiratory-therapy-exam-prep": {
    title: "Respiratory Therapy Exam Prep: RRT & TMC Study Guide 2025 | NurseNest",
    description: "Comprehensive respiratory therapy exam preparation for TMC and CSE certification. Study guides, practice questions, ventilator management, ABG interpretation, and airway management.",
  },
  "/paramedic-exam-prep": {
    title: "Paramedic Exam Prep: NREMT & AEMCA Study Guide 2025 | NurseNest",
    description: "Comprehensive paramedic exam preparation for NREMT and AEMCA certification. Trauma assessment, cardiac emergencies, pharmacology, and airway management study resources.",
  },
  "/medical-lab-tech-exam-prep": {
    title: "Medical Lab Tech Exam Prep: MLT & ASCP Study Guide 2025 | NurseNest",
    description: "Comprehensive MLT exam preparation for ASCP and CSMLS certification. Hematology, clinical chemistry, microbiology, and blood bank study resources.",
  },
  "/diagnostic-imaging-exam-prep": {
    title: "Diagnostic Imaging Exam Prep: ARRT & CAMRT Study Guide 2025 | NurseNest",
    description: "Comprehensive diagnostic imaging exam preparation for ARRT and CAMRT certification. Radiographic positioning, radiation safety, image quality, and patient care.",
  },
  "/occupational-therapy-exam-prep": {
    title: "Occupational Therapy Exam Prep: NBCOT Study Guide 2025 | NurseNest",
    description: "Comprehensive OT exam preparation for NBCOT OTR certification. ADL assessment, therapeutic interventions, splinting, cognitive rehabilitation, and pediatric OT study resources.",
  },
  "/physical-therapy-exam-prep": {
    title: "Physical Therapy Exam Prep: NPTE & PTA Study Guide 2025 | NurseNest",
    description: "Comprehensive physical therapy exam preparation for NPTE-PT and NPTE-PTA certification. Therapeutic exercise, gait analysis, orthopedics, and modalities study resources.",
  },
  "/respiratory-therapy-topics-hub": {
    title: "Respiratory Therapy Topics Hub: Study Resources | NurseNest",
    description: "Complete respiratory therapy topic hub covering ABG interpretation, ventilator management, airway management, pulmonary physiology, and oxygen therapy study resources.",
  },
  "/paramedic-topics-hub": {
    title: "Paramedic Topics Hub: EMS Study Resources | NurseNest",
    description: "Complete paramedic topic hub covering trauma assessment, cardiac emergencies, airway management, pharmacology, and medical emergencies for NREMT exam prep.",
  },
  "/nclex-pharmacology-hub": {
    title: "NCLEX Pharmacology Hub: Medication Study Guide | NurseNest",
    description: "Complete NCLEX pharmacology topic hub covering drug classifications, medication safety, dosage calculations, and high-alert medications for nursing exam prep.",
  },
  "/cardiac-nursing-hub": {
    title: "Cardiac Nursing Hub: Heart & Vascular Study Guide | NurseNest",
    description: "Complete cardiac nursing topic hub covering heart failure, ECG interpretation, acute coronary syndromes, dysrhythmias, and hemodynamic monitoring for NCLEX prep.",
  },
  "/study-guide/nclex-pharmacology-study-guide": {
    title: "NCLEX Pharmacology Study Guide: Drug Review 2025 | NurseNest",
    description: "Comprehensive NCLEX pharmacology study guide covering all major drug classifications, medication safety, dosage calculations, and nursing considerations.",
  },
  "/study-guide/abg-interpretation-study-guide": {
    title: "ABG Interpretation Study Guide: Step-by-Step 2025 | NurseNest",
    description: "Comprehensive ABG interpretation study guide for nursing students. Step-by-step analysis, acid-base disorders, compensation, and clinical application with practice examples.",
  },
  "/study-guide/new-grad-nurse-survival-guide": {
    title: "New Grad Nurse Survival Guide: First Year Handbook | NurseNest",
    description: "Complete new graduate nurse survival guide covering orientation, time management, clinical skills, communication, and building confidence in your first year of nursing.",
  },
  "/study-guide/nclex-cardiology-questions": {
    title: "NCLEX Cardiology Questions: Heart Conditions Practice | NurseNest",
    description: "Practice NCLEX cardiology questions covering heart failure, ACS, dysrhythmias, and cardiac medications with detailed rationales and clinical scenarios.",
  },
  "/study-guide/respiratory-therapy-abg-questions": {
    title: "Respiratory Therapy ABG Questions: Practice Guide | NurseNest",
    description: "Practice respiratory therapy ABG interpretation questions for TMC and CSE exam preparation with step-by-step analysis and clinical scenarios.",
  },
  "/study-guide/nursing-prioritization-questions-guide": {
    title: "Nursing Prioritization Questions: NCLEX Delegation Guide | NurseNest",
    description: "Master NCLEX prioritization and delegation questions. ABCs, Maslow's hierarchy, acute vs chronic, and delegation rules for RN, LPN, and UAP scope of practice.",
  },
  "/study-guide/paramedic-trauma-assessment-questions": {
    title: "Paramedic Trauma Questions: Primary Survey Guide | NurseNest",
    description: "Practice paramedic trauma assessment questions for NREMT exam. Primary survey ABCDE approach, hemorrhage control, transport decisions, and clinical scenarios.",
  },
  "/study-guide/pediatric-nursing-nclex-questions": {
    title: "Pediatric Nursing NCLEX Questions: Study Guide | NurseNest",
    description: "Practice pediatric nursing NCLEX questions covering growth and development, pediatric assessment, common childhood conditions, and medication dosing.",
  },
  "/study-guide/blood-bank-antibody-identification-guide": {
    title: "Blood Bank Antibody ID: Panel Interpretation Guide | NurseNest",
    description: "Master blood bank antibody identification and panel interpretation for ASCP MLT exam. Rule-out methodology, multiple antibodies, and clinical significance.",
  },
  "/cardiology-nursing": {
    title: "Cardiology Nursing — Heart & Cardiovascular Topics for Nurses | NurseNest",
    description: "Master cardiology nursing concepts including cardiac rhythms, heart failure, ECG interpretation, hemodynamic monitoring, and cardiovascular pharmacology for NCLEX and clinical practice.",
  },
  "/respiratory-nursing": {
    title: "Respiratory Nursing — Pulmonary & Airway Topics for Nurses | NurseNest",
    description: "Comprehensive respiratory nursing education covering ventilator management, ABG interpretation, oxygen therapy, COPD, asthma, and pulmonary assessment for nursing students.",
  },
  "/endocrine-nursing": {
    title: "Endocrine Nursing — Hormonal & Metabolic Topics for Nurses | NurseNest",
    description: "Learn endocrine nursing topics including diabetes management, thyroid disorders, adrenal crisis, DKA, HHS, and hormonal regulation for NCLEX preparation.",
  },
  "/neurology-nursing": {
    title: "Neurology Nursing — Neurological Topics for Nurses | NurseNest",
    description: "Explore neurology nursing concepts including stroke assessment, seizure management, intracranial pressure, neurological assessment, and brain injury care for nurses.",
  },
  "/electrolytes-nursing": {
    title: "Electrolytes in Nursing — Fluid & Electrolyte Balance for Nurses | NurseNest",
    description: "Master fluid and electrolyte balance including hyperkalemia, hyponatremia, calcium regulation, acid-base disorders, and IV fluid therapy for nursing students.",
  },
  "/pharmacology-nursing": {
    title: "Pharmacology for Nurses — Medication & Drug Topics | NurseNest",
    description: "Comprehensive nursing pharmacology covering drug classifications, medication administration, dosage calculations, adverse effects, and NCLEX pharmacology review.",
  },
  "/nursing-physiology-explained": {
    title: "Nursing Physiology Explained — Clinical Pathophysiology for Nurses | NurseNest",
    description: "Explore nursing pathophysiology topics explained clearly for students. Burns and hyperkalemia, cardiac conduction, acid-base disorders, pyloric stenosis, and ECG interpretation.",
  },
  "/why-burns-cause-hyperkalemia": {
    title: "Why Burns Cause Hyperkalemia — Pathophysiology Explained | NurseNest",
    description: "Understand how thermal injury causes hyperkalemia through cellular destruction, potassium release, RAAS activation, and fluid shifts. Essential nursing pathophysiology for NCLEX prep.",
  },
  "/potassium-effects-on-cardiac-conduction": {
    title: "Potassium Effects on Cardiac Conduction — ECG Changes Explained | NurseNest",
    description: "Learn how potassium levels affect resting membrane potential, action potentials, and ECG patterns. Understand hypo- and hyperkalemia cardiac effects for nursing exams.",
  },
  "/metabolic-acidosis-in-aki": {
    title: "Metabolic Acidosis in AKI — Pathophysiology for Nurses | NurseNest",
    description: "Explore why acute kidney injury causes metabolic acidosis through impaired hydrogen ion excretion and bicarbonate regeneration. Nursing interventions and ABG interpretation.",
  },
  "/pyloric-stenosis-metabolic-alkalosis": {
    title: "Pyloric Stenosis & Metabolic Alkalosis — Pediatric Pathophysiology | NurseNest",
    description: "Discover the pathophysiology linking pyloric stenosis to hypochloremic metabolic alkalosis. Projectile vomiting, HCl loss, electrolyte imbalances, and nursing assessment.",
  },
  "/qrs-complex-explained-for-nurses": {
    title: "QRS Complex Explained for Nurses — ECG Interpretation Guide | NurseNest",
    description: "Master ventricular depolarization, bundle branch blocks, and the clinical significance of wide vs narrow QRS complexes. ECG interpretation skills for nursing practice.",
  },
  "/nclex-question-bank-guide": {
    title: "NCLEX Question Bank Guide — Best Practice Questions & Study Strategy | NurseNest",
    description: "Comprehensive NCLEX question bank guide with practice questions, study strategies, clinical judgment tips, and test-taking techniques for nursing students.",
  },
  "/rex-pn-exam-prep-guide": {
    title: "REx-PN Exam Prep Guide — Canadian Practical Nursing Exam | NurseNest",
    description: "Complete REx-PN exam preparation guide for Canadian practical nurses. Study strategies, question types, competency categories, and practice scenarios.",
  },
  "/nursing-clinical-scenarios-guide": {
    title: "Nursing Clinical Scenarios Guide — Case Studies for Exam Prep | NurseNest",
    description: "Practice nursing clinical scenarios with realistic case studies. Develop critical thinking and clinical judgment skills for NCLEX, REx-PN, and clinical practice.",
  },
  "/lab-values-complete-nursing-guide": {
    title: "Lab Values for Nurses: Complete Reference Guide | NurseNest",
    description: "Comprehensive nursing lab values reference covering CBC, BMP, CMP, coagulation, liver panel, cardiac markers, and thyroid function. Normal ranges, critical values, and clinical significance.",
  },
  "/electrolytes-nursing-exam-guide": {
    title: "Electrolytes for Nursing Exams — Complete Study Guide | NurseNest",
    description: "Master electrolyte imbalances for nursing exams. Sodium, potassium, calcium, magnesium, phosphorus, and chloride — normal ranges, symptoms, causes, and nursing interventions.",
  },
  "/acid-base-disorders-nursing": {
    title: "Acid-Base Disorders Explained — ABG Interpretation for Nurses | NurseNest",
    description: "Understand acid-base disorders and ABG interpretation for nursing practice. Metabolic and respiratory acidosis/alkalosis, compensation, and clinical nursing interventions.",
  },
  "/nursing-clinical-assessment-complete-guide": {
    title: "Nursing Clinical Assessment: Complete Head-to-Toe Guide | NurseNest",
    description: "Comprehensive nursing clinical assessment guide covering head-to-toe examination, vital signs, neurological assessment, cardiovascular assessment, and documentation.",
  },
};

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function extractTextFromContent(content: any): string {
  if (!content || !Array.isArray(content)) return "";
  const parts: string[] = [];
  for (const block of content) {
    if (typeof block === "string") {
      parts.push(block);
    } else if (block && typeof block === "object") {
      if (block.text) parts.push(block.text);
      if (block.heading) parts.push(block.heading);
      if (block.title) parts.push(block.title);
      if (block.content) {
        if (typeof block.content === "string") parts.push(block.content);
        else if (Array.isArray(block.content)) {
          for (const item of block.content) {
            if (typeof item === "string") parts.push(item);
            else if (item && item.text) parts.push(item.text);
          }
        }
      }
      if (block.items && Array.isArray(block.items)) {
        for (const item of block.items) {
          if (typeof item === "string") parts.push(item);
          else if (item && item.text) parts.push(item.text);
        }
      }
      if (block.sections && Array.isArray(block.sections)) {
        parts.push(extractTextFromContent(block.sections));
      }
    }
  }
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function buildNoscriptHtml(content: any, title: string): string {
  if (!content || !Array.isArray(content)) return "";
  const parts: string[] = [`<h1>${escapeHtml(title)}</h1>`];
  for (const block of content) {
    if (!block || typeof block !== "object") continue;
    if (block.heading) {
      parts.push(`<h2>${escapeHtml(block.heading)}</h2>`);
    }
    if (block.text) {
      parts.push(`<p>${escapeHtml(block.text)}</p>`);
    }
    if (block.content) {
      if (typeof block.content === "string") {
        parts.push(`<p>${escapeHtml(block.content)}</p>`);
      }
    }
    if (block.items && Array.isArray(block.items)) {
      parts.push("<ul>");
      for (const item of block.items) {
        const text = typeof item === "string" ? item : (item?.text || "");
        if (text) parts.push(`<li>${escapeHtml(text)}</li>`);
      }
      parts.push("</ul>");
    }
  }
  return parts.join("\n");
}

function buildLessonContentArray(lesson: any): any[] {
  const blocks: any[] = [];
  if (lesson.cellular) {
    blocks.push({ heading: lesson.cellular.title || "Pathophysiology", text: lesson.cellular.content });
  }
  if (lesson.riskFactors?.length) {
    blocks.push({ heading: "Risk Factors", items: lesson.riskFactors });
  }
  if (lesson.diagnostics?.length) {
    blocks.push({ heading: "Diagnostics", items: lesson.diagnostics });
  }
  if (lesson.signs) {
    const signItems = [...(lesson.signs.left || []), ...(lesson.signs.right || [])];
    if (signItems.length) blocks.push({ heading: "Signs and Symptoms", items: signItems });
  }
  if (lesson.management?.length) {
    blocks.push({ heading: "Management", items: lesson.management });
  }
  if (lesson.nursingActions?.length) {
    blocks.push({ heading: "Nursing Actions", items: lesson.nursingActions });
  }
  if (lesson.medications?.length) {
    for (const med of lesson.medications) {
      blocks.push({ heading: med.name, text: `${med.type} - ${med.action}` });
    }
  }
  if (lesson.pearls?.length) {
    blocks.push({ heading: "Clinical Pearls", items: lesson.pearls });
  }
  if (lesson.lifespan) {
    blocks.push({ heading: lesson.lifespan.title || "Lifespan Considerations", text: lesson.lifespan.content });
  }
  return blocks;
}

async function fetchContentForPath(pathname: string): Promise<{ title: string; content: any; summary?: string; tags?: string[]; category?: string; type?: string; createdAt?: string } | null> {
  const lessonMatch = pathname.match(/^\/lessons\/(.+)$/);
  const blogMatch = pathname.match(/^\/blog\/(.+)$/);
  const clarityMatch = pathname.match(/^\/clinical-clarity\/(.+)$/);

  if (lessonMatch) {
    const slug = lessonMatch[1];
    const data = getLessonSeoData();
    const lesson = data[slug];
    if (lesson) {
      const content = buildLessonContentArray(lesson);
      const desc = lesson.cellular?.content || "";
      return {
        title: lesson.title,
        content,
        summary: desc.substring(0, 300),
        type: "lesson",
      };
    }
    return null;
  }

  const slug = blogMatch?.[1] || clarityMatch?.[1];
  if (!slug) return null;

  try {
    const result = await pool.query(
      "SELECT title, content, summary, tags, category, type, created_at FROM content_items WHERE slug = $1 AND status = 'published' LIMIT 1",
      [slug]
    );
    if (result.rows[0]) {
      return {
        title: result.rows[0].title,
        content: result.rows[0].content,
        summary: result.rows[0].summary,
        tags: result.rows[0].tags,
        category: result.rows[0].category,
        type: result.rows[0].type,
        createdAt: result.rows[0].created_at,
      };
    }
  } catch (e) {}
  return null;
}

const LOCALE_META_OVERRIDES: Record<string, Record<string, { title: string; description: string }>> = {
  "fr": {
    "/lab-values": {
      title: "Valeurs de Laboratoire — Interprétation Clinique Infirmière | NurseNest",
      description: "Maîtrisez l'interprétation des valeurs de laboratoire anormales avec des scénarios cliniques. Plages normales, signification clinique et actions infirmières pour la préparation aux examens NCLEX et REx-PN.",
    },
    "/nursing-exam-prep": {
      title: "Préparation Examen NCLEX — Révision Complète NCLEX-RN, NCLEX-PN et REx-PN | NurseNest",
      description: "Préparez votre examen NCLEX-RN, NCLEX-PN ou REx-PN avec des ressources complètes. 4 000+ questions pratique, examens simulés adaptatifs, cartes mémoire pharmacologie et leçons de pathophysiologie. Commencez votre révision clinique.",
    },
    "/nursing-simulation-practice": {
      title: "Simulation Clinique Infirmière — Scénarios de Pratique et Formation | NurseNest",
      description: "Améliorez vos compétences cliniques avec des simulations infirmières interactives. Scénarios patients, communication SBAR, jugement clinique et débriefing structuré pour la préparation aux examens infirmiers.",
    },
    "/hyperkalemia-effects-on-heart": {
      title: "Hyperkaliémie et Effets sur le Cœur — Physiologie Infirmière et Changements ECG | NurseNest",
      description: "Comprenez les effets de l'hyperkaliémie sur le cœur : ondes T pointues, élargissement du QRS, risque d'arrêt cardiaque et interventions infirmières essentielles. Guide clinique pour la préparation NCLEX et REx-PN.",
    },
  },
  "zh-tw": {
    "/": {
      title: "NurseNest - NCLEX與REx-PN考試準備 | 護理題庫、模擬與閃卡",
      description: "使用NurseNest準備NCLEX、NCLEX-PN和REx-PN考試。1,200+護理練習題、臨床案例模擬、藥理學閃卡和200+病理生理學課程，適合加拿大和美國的RPN/LVN、RN和NP學生。每週更新內容。免費開始，無需信用卡。",
    },
    "/lessons": {
      title: "護理課程 - 病理生理學與臨床主題 | NurseNest",
      description: "瀏覽200+臨床護理課程，涵蓋病理生理學、藥理學和病患護理，適合RPN/LVN、RN和NP學生。互動式內容，專注考試準備。",
    },
    "/flashcards": {
      title: "護理閃卡 - 藥理學與臨床複習 | NurseNest",
      description: "使用互動式護理閃卡學習，涵蓋藥理學、病理生理學和臨床概念。追蹤掌握程度並收藏卡片進行重點複習。",
    },
    "/pricing": {
      title: "價格方案 - RPN、RN與NP訂閱 | NurseNest",
      description: "選擇您的NurseNest訂閱方案。RPN/LVN $29.99/月，RN/NCLEX $39.99/月，NP進階 $49.99/月。免費試用，無需信用卡。",
    },
    "/faq": {
      title: "常見問題 - NurseNest護理考試準備",
      description: "關於NurseNest護理考試準備平台的常見問題解答。了解我們的課程、題庫、閃卡和訂閱方案。",
    },
    "/blog": {
      title: "護理教育部落格 - 臨床推理與考試準備 | NurseNest",
      description: "循證護理教育文章，涵蓋臨床推理、病理生理學、藥理學和考試準備，適合RPN和RN學生。",
    },
    "/about": {
      title: "關於NurseNest - 護理考試準備平台",
      description: "了解NurseNest如何幫助護理學生準備NCLEX、NCLEX-PN和REx-PN考試。我們的使命是讓每位護理學生都能獲得優質的考試準備資源。",
    },
    "/contact": {
      title: "聯繫我們 | NurseNest",
      description: "聯繫NurseNest團隊。我們隨時為您解答關於護理考試準備平台的問題。",
    },
    "/mock-exams": {
      title: "模擬考試 - NCLEX與REx-PN練習測驗 | NurseNest",
      description: "參加模擬NCLEX、NCLEX-PN和REx-PN格式的計時考試。追蹤成績，找出薄弱環節，查看詳細解析。",
    },
    "/glossary": {
      title: "護理術語表 - 臨床術語與定義 | NurseNest",
      description: "護理關鍵術語的完整參考，包含臨床相關性。適合護理學生考試準備。",
    },
    "/anatomy": {
      title: "解剖學與生理學複習 | NurseNest",
      description: "護理學生的解剖生理學基礎複習。人體系統、結構和臨床關聯，適合考試準備。",
    },
    "/exam-prep": {
      title: "考試準備 - NCLEX與護理執照考試 | NurseNest",
      description: "使用NurseNest的題庫、模擬考試和課程準備護理執照考試。支持NCLEX-RN、NCLEX-PN、REx-PN和NP認證考試。",
    },
  },
};

function getLocalizedStaticPage(path: string, locale: string): { title: string; description: string } | undefined {
  const localeOverrides = LOCALE_META_OVERRIDES[locale];
  if (localeOverrides && localeOverrides[path]) {
    return localeOverrides[path];
  }
  return staticPages[path];
}

export function getPageMeta(pathname: string, options?: { isAllied?: boolean }): PageMeta {
  let cleanPath = pathname.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
const localeMatch = cleanPath.match(/^\/(en|fr|es|fil|hi|zh-tw|zh|ar|ko|pt|pa|vi|ht|ur|ja|fa|de|th|tr|id)(\/.*|$)/);
  const detectedLocale = localeMatch ? localeMatch[1] : "en";
  const strippedPath = localeMatch ? (localeMatch[2] || "/") : cleanPath;

  const localePrefix = `/${detectedLocale}`;
  const localeIsIndexable = isLocaleIndexable(detectedLocale);
  const isNoindexRoute = isNoindexPath(strippedPath, detectedLocale);

  const isUntranslatedContentPage = detectedLocale !== "en" && (
    strippedPath.startsWith("/learn/") ||
    (strippedPath.startsWith("/blog/") && strippedPath !== "/blog") ||
    (strippedPath.startsWith("/clinical-clarity/") && strippedPath !== "/clinical-clarity")
  );

  const noindex = isNoindexRoute || !localeIsIndexable || isUntranslatedContentPage;

  const canonicalBase = options?.isAllied ? ALLIED_SITE_BASE : SITE_BASE;
  let canonical: string;
  if (isUntranslatedContentPage) {
    const enCanonicalPath = strippedPath === "/" ? "/en" : `/en${strippedPath}`;
    canonical = `${canonicalBase}${enCanonicalPath}`;
  } else {
    canonical = normalizeCanonicalUrl(strippedPath, detectedLocale, canonicalBase);
  }

  const breadcrumbs = buildBreadcrumbs(strippedPath);
  const deLocalizedPath = detectedLocale !== "en" ? deLocalizeSlug(detectedLocale, strippedPath) : strippedPath;
  cleanPath = deLocalizedPath;

  const localizedPage = getLocalizedStaticPage(cleanPath, detectedLocale);
  if (localizedPage) {
    const result: PageMeta = {
      title: localizedPage.title,
      description: localizedPage.description,
      canonical,
      noindex,
      breadcrumbs,
    };
    if (cleanPath === "/lessons") {
      result.jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Nursing Lessons",
        "description": "Browse 200+ clinical nursing lessons covering pathophysiology, pharmacology, and patient care.",
        "url": canonical,
        "numberOfItems": 200,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Pathophysiology Lessons", "url": `${SITE_BASE}/en/lessons` },
          { "@type": "ListItem", "position": 2, "name": "Pharmacology Lessons", "url": `${SITE_BASE}/en/lessons` },
          { "@type": "ListItem", "position": 3, "name": "Clinical Nursing Skills", "url": `${SITE_BASE}/en/lessons` },
        ],
      });
    } else if (cleanPath === "/flashcards") {
      result.jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Nursing Flashcards",
        "description": "Interactive nursing flashcards covering pharmacology, pathophysiology, and clinical concepts.",
        "url": canonical,
        "numberOfItems": 50,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Pharmacology Flashcards", "url": `${SITE_BASE}/en/flashcards` },
          { "@type": "ListItem", "position": 2, "name": "Pathophysiology Flashcards", "url": `${SITE_BASE}/en/flashcards` },
          { "@type": "ListItem", "position": 3, "name": "Clinical Review Flashcards", "url": `${SITE_BASE}/en/flashcards` },
        ],
      });
    } else if (cleanPath === "/applynest") {
      result.jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "ApplyNest - Healthcare Career Placement",
        "description": "Career placement resources for nursing and allied health professionals. Job search guides, resume templates, interview prep, and salary data.",
        "url": canonical,
        "isPartOf": { "@type": "WebSite", "name": "NurseNest", "url": SITE_BASE },
        "publisher": { "@type": "Organization", "name": "NurseNest", "url": SITE_BASE },
        "mainEntity": {
          "@type": "ItemList",
          "name": "Healthcare Career Guides",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Registered Nurse (RN) Career Guide", "url": `${SITE_BASE}/applynest/careers/rn` },
            { "@type": "ListItem", "position": 2, "name": "RPN / LVN Career Guide", "url": `${SITE_BASE}/applynest/careers/rpn-lvn` },
            { "@type": "ListItem", "position": 3, "name": "Nurse Practitioner (NP) Career Guide", "url": `${SITE_BASE}/applynest/careers/np` },
            { "@type": "ListItem", "position": 4, "name": "Paramedic Career Guide", "url": `${SITE_BASE}/applynest/careers/paramedic` },
            { "@type": "ListItem", "position": 5, "name": "Respiratory Therapist (RRT) Career Guide", "url": `${SITE_BASE}/applynest/careers/rrt` },
            { "@type": "ListItem", "position": 6, "name": "Medical Lab Technologist (MLT) Career Guide", "url": `${SITE_BASE}/applynest/careers/mlt` },
            { "@type": "ListItem", "position": 7, "name": "Medical Imaging Career Guide", "url": `${SITE_BASE}/applynest/careers/imaging` },
            { "@type": "ListItem", "position": 8, "name": "Pharmacy Technician Career Guide", "url": `${SITE_BASE}/applynest/careers/pharmtech` },
          ],
        },
      });
    } else if (cleanPath === "/test-bank") {
      result.jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LearningResource",
        "name": "Nursing Practice Test Bank",
        "description": "1,200+ nursing practice questions organized by body system and tier with instant rationale display.",
        "url": canonical,
        "learningResourceType": "Quiz",
        "educationalLevel": "Professional",
        "provider": { "@type": "Organization", "name": "NurseNest", "url": SITE_BASE },
      });
    } else if (cleanPath === "/practice-questions") {
      result.jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LearningResource",
        "name": "Free Nursing Practice Questions",
        "description": "Free nursing practice questions covering NCLEX, NCLEX-PN, and REx-PN content areas with instant rationale display.",
        "url": canonical,
        "learningResourceType": "Quiz",
        "educationalLevel": "Professional",
        "isAccessibleForFree": true,
        "provider": { "@type": "Organization", "name": "NurseNest", "url": SITE_BASE },
      });
    } else if (cleanPath === "/mock-exams") {
      result.jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LearningResource",
        "name": "Nursing Mock Exams - NCLEX & NCLEX-PN / REx-PN Practice Tests",
        "description": "Take timed mock exams simulating NCLEX, NCLEX-PN, and REx-PN format with performance analytics.",
        "url": canonical,
        "learningResourceType": "Practice Exam",
        "educationalLevel": "Professional",
        "provider": { "@type": "Organization", "name": "NurseNest", "url": SITE_BASE },
      });
    } else if (cleanPath === "/free-practice") {
      result.jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LearningResource",
        "name": "Free Nursing Practice Questions",
        "description": "Start practicing with free nursing exam questions covering all major clinical content areas.",
        "url": canonical,
        "learningResourceType": "Quiz",
        "educationalLevel": "Professional",
        "isAccessibleForFree": true,
        "provider": { "@type": "Organization", "name": "NurseNest", "url": SITE_BASE },
      });
    } else if (cleanPath === "/glossary") {
      result.jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "DefinedTermSet",
        "name": "Nursing Glossary",
        "description": "Comprehensive nursing terminology glossary covering clinical, pharmacological, and pathophysiology terms.",
        "url": canonical,
      });
    } else if (cleanPath === "/case-simulations") {
      result.jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LearningResource",
        "name": "Clinical Case Simulations for Nursing Students",
        "description": "Interactive clinical case simulations with branching decision points, critical thinking challenges, and detailed debriefing.",
        "url": canonical,
        "learningResourceType": "Simulation",
        "educationalLevel": "Professional",
        "interactivityType": "active",
        "provider": { "@type": "Organization", "name": "NurseNest", "url": SITE_BASE },
      });
    } else if (cleanPath === "/perioperative-nursing") {
      result.jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Perioperative Nursing & CNOR Exam Prep",
        "description": "Comprehensive perioperative nursing study program covering surgical nursing, patient preparation, infection control, and surgical safety for CNOR certification.",
        "url": canonical,
        "provider": { "@type": "EducationalOrganization", "name": "NurseNest", "url": SITE_BASE },
        "courseMode": "online",
        "educationalLevel": "Professional",
      });
    } else if (cleanPath === "/preoperative-care") {
      result.jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Preoperative Care: Patient Preparation for Surgery",
        "description": "Complete guide to preoperative nursing care including patient assessment, informed consent, NPO guidelines, medication management, and pre-surgical checklists.",
        "url": canonical,
        "provider": { "@type": "EducationalOrganization", "name": "NurseNest", "url": SITE_BASE },
        "courseMode": "online",
        "educationalLevel": "Professional",
      });
    } else if (cleanPath === "/preoperative-nursing-guide") {
      result.jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LearningResource",
        "name": "Preoperative Nursing Guide: Complete Practice Reference",
        "description": "Evidence-based preoperative nursing guide covering patient assessment, risk stratification, medication management, and surgical preparation protocols.",
        "url": canonical,
        "learningResourceType": "StudyGuide",
        "educationalLevel": "Professional",
        "provider": { "@type": "Organization", "name": "NurseNest", "url": SITE_BASE },
      });
    } else if (cleanPath === "/perioperative-nurse-career") {
      result.jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LearningResource",
        "name": "Perioperative Nurse Career Guide & CNOR Certification Path",
        "description": "Complete career guide for perioperative nurses covering CNOR certification requirements, salary information, job outlook, education pathways, and career advancement.",
        "url": canonical,
        "learningResourceType": "CareerGuide",
        "educationalLevel": "Professional",
        "provider": { "@type": "Organization", "name": "NurseNest", "url": SITE_BASE },
      });
    }
    return result;
  }

  const nursingTopicMeta: Record<string, string> = { rpn: "RPN / LVN", rn: "RN", np: "Nurse Practitioner" };
  const nursingExamMeta: Record<string, string> = { rpn: "NCLEX-PN / REx-PN", rn: "NCLEX-RN", np: "AANP/ANCC" };
  const nursingTopicMatch = cleanPath.match(/^\/(rpn|rn|np)\/questions\/(.+)$/);
  if (nursingTopicMatch) {
    const tier = nursingTopicMatch[1];
    const topicSlug = nursingTopicMatch[2];
    const readable = slugToTitle(topicSlug);
    const tierLabel = nursingTopicMeta[tier] || tier.toUpperCase();
    const examLabel = nursingExamMeta[tier] || tier.toUpperCase();
    return {
      title: `${readable} — ${tierLabel} Practice Questions | NurseNest`,
      description: `Practice ${tierLabel} exam questions on ${readable}. Clinical vignettes with detailed rationales for ${examLabel} exam preparation. Free sample questions included.`,
      canonical,
      noindex,
      breadcrumbs,
      jsonLd: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LearningResource",
        name: `${readable} — ${tierLabel} Practice Questions`,
        description: `Practice questions on ${readable} for ${tierLabel} nursing students preparing for ${examLabel} exams.`,
        url: canonical,
        learningResourceType: "Quiz",
        educationalLevel: "Professional",
        provider: { "@type": "Organization", name: "NurseNest", url: SITE_BASE },
      }),
    };
  }

  const applyNestCareersPageMatch = cleanPath.match(/^\/applynest\/careers\/(.+)$/);
  if (applyNestCareersPageMatch) {
    const professionSlug = applyNestCareersPageMatch[1];
    const professionLabels: Record<string, string> = {
      "rn": "Registered Nurse (RN)",
      "rpn-lvn": "RPN / LVN",
      "np": "Nurse Practitioner (NP)",
      "paramedic": "Paramedic",
      "rrt": "Respiratory Therapist (RRT)",
      "mlt": "Medical Lab Technologist (MLT)",
      "imaging": "Medical Imaging / Radiologic Technologist",
      "pharmtech": "Pharmacy Technician",
    };
    const label = professionLabels[professionSlug] || slugToTitle(professionSlug);
    return {
      title: `${label} Career Guide - Job Market, Salary & Interview Tips | ApplyNest`,
      description: `Complete ${label} career guide with job market outlook, salary data, top employers, licensing requirements, resume tips, and interview preparation. Launch your ${label.toLowerCase()} career with ApplyNest.`,
      canonical,
      noindex,
      breadcrumbs,
      jsonLd: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": `${label} Career Guide`,
        "description": `Job market, salary, licensing, resume tips and interview prep for ${label.toLowerCase()} professionals.`,
        "url": canonical,
        "author": { "@type": "Organization", "name": "NurseNest" },
        "publisher": { "@type": "Organization", "name": "NurseNest", "url": SITE_BASE },
      }),
    };
  }

  const lessonMatch = cleanPath.match(/^\/lessons\/(.+)$/);
  if (lessonMatch) {
    const slug = lessonMatch[1];
    const seoEntry = seoTitleMap[slug];
    if (seoEntry) {
      const cleanSeoTitle = stripTierFromSeoTitle(seoEntry.title);
      const optimizedTitle = appendNursingContext(cleanSeoTitle, slug);
      return {
        title: `${optimizedTitle} | NurseNest`,
        description: seoEntry.description,
        canonical,
        noindex,
        breadcrumbs,
      };
    }
    const readable = stripTierFromSeoTitle(slugToTitle(slug));
    const optimizedTitle = appendNursingContext(readable, slug);
    return {
      title: `${optimizedTitle} | NurseNest`,
      description: `Learn about ${readable} with detailed pathophysiology, clinical findings, nursing interventions, and exam pearls. Evidence-based nursing education for NCLEX, NCLEX-PN, and REx-PN preparation.`,
      canonical,
      noindex,
      breadcrumbs,
    };
  }

  const clarityMatch = cleanPath.match(/^\/clinical-clarity\/(.+)$/);
  if (clarityMatch) {
    const slug = clarityMatch[1];
    const readable = slugToTitle(slug);
    return {
      title: `${readable} - Clinical Clarity | NurseNest`,
      description: `Understand ${readable.toLowerCase()}. Evidence-based pathophysiology explanation for nursing students preparing for NCLEX, NCLEX-PN, and REx-PN exams.`,
      canonical,
      noindex,
      breadcrumbs,
    };
  }

  const learnMatch = cleanPath.match(/^\/learn\/(.+)$/);
  if (learnMatch) {
    const slug = learnMatch[1];
    const readable = slugToTitle(slug);
    return {
      title: `${readable} | NurseNest`,
      description: `${readable} - nursing education content on NurseNest. Evidence-based learning for RPN/LVN, RN, and NP students.`,
      canonical,
      noindex,
      breadcrumbs,
    };
  }

  const careerGuideMatch = cleanPath.match(/^\/how-to-become-(a|an)-(.+)$/);
  if (careerGuideMatch) {
    const profession = slugToTitle(careerGuideMatch[2]);
    const careerGuideBreadcrumbs = [
      { name: "Home", url: `${SITE_BASE}/` },
      { name: "Careers", url: `${SITE_BASE}/careers` },
      { name: `How to Become ${careerGuideMatch[1] === "an" ? "an" : "a"} ${profession}`, url: `${SITE_BASE}${cleanPath}` },
    ];
    const guideJsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": staticPages[cleanPath]?.title || `How to Become ${careerGuideMatch[1] === "an" ? "an" : "a"} ${profession}`,
      "description": staticPages[cleanPath]?.description || `Career guide for becoming ${careerGuideMatch[1] === "an" ? "an" : "a"} ${profession.toLowerCase()}.`,
      "url": canonical,
      "author": { "@type": "Organization", "name": "NurseNest" },
      "publisher": { "@type": "Organization", "name": "NurseNest", "url": SITE_BASE },
    });
    return {
      title: staticPages[cleanPath]?.title || `How to Become ${careerGuideMatch[1] === "an" ? "an" : "a"} ${profession} | NurseNest`,
      description: staticPages[cleanPath]?.description || `Career guide for becoming ${careerGuideMatch[1] === "an" ? "an" : "a"} ${profession.toLowerCase()}.`,
      canonical,
      noindex,
      breadcrumbs: careerGuideBreadcrumbs,
      jsonLd: guideJsonLd,
    };
  }

  const conditionMatch = cleanPath.match(/^\/conditions\/(.+)$/);
  if (conditionMatch) {
    const slug = conditionMatch[1];
    const readable = slugToTitle(slug);
    const conditionJsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "MedicalCondition",
      "name": readable,
      "description": `${readable} - pathophysiology, clinical presentation, diagnostics, medications, and nursing interventions for nursing exam preparation.`,
      "url": canonical,
      "medicalSpecialty": { "@type": "MedicalSpecialty", "name": "Nursing" },
      "relevantSpecialty": { "@type": "MedicalSpecialty", "name": "Nursing" },
      "possibleTreatment": { "@type": "MedicalTherapy", "name": `${readable} Management` },
    });
    return {
      title: `${readable} - Nursing Study Guide | Pathophysiology & Interventions | NurseNest`,
      description: `Learn about ${readable.toLowerCase()} for nursing exams. Pathophysiology, clinical presentation, diagnostics, medications, and nursing interventions. NCLEX, NCLEX-PN, and REx-PN exam prep.`,
      canonical,
      noindex,
      breadcrumbs,
      jsonLd: conditionJsonLd,
    };
  }

  const medicationMatch = cleanPath.match(/^\/medications\/(.+)$/);
  if (medicationMatch) {
    const slug = medicationMatch[1];
    const readable = slugToTitle(slug);
    const medJsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "MedicalCondition",
      "name": readable,
      "description": `${readable} - drug class, mechanism of action, indications, side effects, contraindications, and nursing considerations.`,
      "url": canonical,
      "medicalSpecialty": "Pharmacology",
      "relevantSpecialty": { "@type": "MedicalSpecialty", "name": "Nursing Pharmacology" },
    });
    return {
      title: `${readable} - Nursing Pharmacology Guide | Drug Class, MOA & Side Effects | NurseNest`,
      description: `Study ${readable.toLowerCase()} for nursing exams. Drug class, mechanism of action, indications, side effects, contraindications, and nursing considerations for NCLEX, NCLEX-PN, and REx-PN prep.`,
      canonical,
      noindex,
      breadcrumbs,
      jsonLd: medJsonLd,
    };
  }

  const labValueMatch = cleanPath.match(/^\/lab-values\/(.+)$/);
  if (labValueMatch) {
    const slug = labValueMatch[1];
    const readable = slugToTitle(slug);
    const labFaqJsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `What is the normal range for ${readable.toLowerCase()}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `The normal range for ${readable.toLowerCase()} varies by laboratory. Consult your institution's reference ranges and clinical context for accurate interpretation.`,
          },
        },
        {
          "@type": "Question",
          "name": `What causes high ${readable.toLowerCase()} levels?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Elevated ${readable.toLowerCase()} can result from various clinical conditions. Review the clinical significance section for common causes of high values.`,
          },
        },
        {
          "@type": "Question",
          "name": `What nursing interventions are needed for abnormal ${readable.toLowerCase()}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Nursing interventions for abnormal ${readable.toLowerCase()} depend on whether values are high or low, the underlying cause, and the patient's clinical presentation.`,
          },
        },
      ],
    });
    return {
      title: `${readable} - Lab Value Interpretation | Normal Range & Clinical Significance | NurseNest`,
      description: `Master ${readable.toLowerCase()} lab value interpretation for nursing exams. Normal ranges, high/low causes, clinical significance, and nursing interventions for NCLEX, NCLEX-PN, and REx-PN prep.`,
      canonical,
      noindex,
      breadcrumbs,
      jsonLd: labFaqJsonLd,
    };
  }

  const clinicalComparisonMatch = cleanPath.match(/^\/clinical-comparisons\/(.+)$/);
  if (clinicalComparisonMatch) {
    const slug = clinicalComparisonMatch[1];
    const readable = slugToTitle(slug);
    return {
      title: `${readable} - Clinical Comparison | Side-by-Side Nursing Guide | NurseNest`,
      description: `Compare ${readable.toLowerCase()} side-by-side: pathophysiology, signs and symptoms, lab values, nursing interventions, and NCLEX exam tips for nursing students.`,
      canonical,
      noindex,
      breadcrumbs,
    };
  }

  const symptomMatch = cleanPath.match(/^\/symptoms\/(.+)$/);
  if (symptomMatch) {
    const slug = symptomMatch[1];
    const readable = slugToTitle(slug);
    return {
      title: `${readable} - Nursing Assessment | Differential Diagnosis & Red Flags | NurseNest`,
      description: `Complete ${readable.toLowerCase()} nursing assessment guide: differential diagnoses, red flags, assessment steps, clinical decision-making, and NCLEX practice questions.`,
      canonical,
      noindex,
      breadcrumbs,
    };
  }

  const careerMatch = cleanPath.match(/^\/career-development\/(.+)$/);
  const newGradCareerMatch = cleanPath.match(/^\/new-grad\/career\/(.+)$/);
  if (careerMatch || newGradCareerMatch) {
    const slug = (careerMatch || newGradCareerMatch)![1];
    const readable = slugToTitle(slug);
    const today = new Date().toISOString().split("T")[0];
    const jobPostingJsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": `${readable} - Nursing Career Guide`,
      "description": `Career guide for ${readable.toLowerCase()}. Job outlook, required skills, salary expectations, and career advancement pathways for nursing professionals.`,
      "url": canonical,
      "datePosted": today,
      "validThrough": `${new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0]}`,
      "hiringOrganization": {
        "@type": "Organization",
        "name": "NurseNest",
        "sameAs": SITE_BASE,
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": ["CA", "US"],
        },
      },
      "industry": "Healthcare / Nursing",
      "occupationalCategory": "29-1141.00",
      "employmentType": "FULL_TIME",
    });
    return {
      title: `${readable} - Nursing Career Guide | NurseNest`,
      description: `Explore ${readable.toLowerCase()} career paths in nursing. Job outlook, qualifications, salary expectations, and professional development resources for new and experienced nurses.`,
      canonical,
      noindex,
      breadcrumbs,
      jsonLd: jobPostingJsonLd,
    };
  }

  const alliedHealthProfessionMatch = cleanPath.match(/^\/allied-health\/(rrt|respiratory-therapy|paramedic|pharmacy-technician|mlt|medical-laboratory-technologist|imaging|radiologic-technologist|diagnostic-sonography|cardiac-sonographer|social-work|psychotherapy|addictions|occupational-therapy|occupational-therapy-assistant|physiotherapy-assistant|surgical-technologist|health-information-management)(\/(.+))?$/);
  if (alliedHealthProfessionMatch) {
    const profKey = alliedHealthProfessionMatch[1];
    const subPage = alliedHealthProfessionMatch[3] || "";
    const professionMeta: Record<string, { title: string; description: string; shortName: string; exams: string }> = {
      "rrt": { title: "Respiratory Therapy Practice Questions & Exam Prep | NurseNest", description: "Prepare for the NBRC TMC, CSE, and CBRC exams with 500+ respiratory therapy practice questions, mock exams, ABG interpretation drills, and ventilator management scenarios. Build exam confidence today.", shortName: "RRT", exams: "NBRC TMC, CSE & CBRC" },
      "respiratory-therapy": { title: "Respiratory Therapy Practice Questions & Exam Prep | NurseNest", description: "Prepare for the NBRC TMC, CSE, and CBRC exams with 500+ respiratory therapy practice questions, mock exams, ABG interpretation drills, and ventilator management scenarios. Build exam confidence today.", shortName: "RRT", exams: "NBRC TMC, CSE & CBRC" },
      "paramedic": { title: "Paramedic Practice Questions & NREMT Exam Prep | NurseNest", description: "Pass your NREMT or COPR paramedic exam with realistic practice questions, ACLS/PALS scenarios, trauma assessment drills, and timed mock exams. Detailed rationales for every question.", shortName: "Paramedic", exams: "NREMT & COPR" },
      "pharmacy-technician": { title: "Pharmacy Tech Practice Questions & PTCB/PEBC Exam Prep | NurseNest", description: "Pass the PTCB PTCE or PEBC exam with pharmacy technician practice questions covering dosage calculations, drug classifications, sterile compounding, and pharmacy law. Mock exams included.", shortName: "Pharmacy Tech", exams: "PTCB PTCE & PEBC" },
      "mlt": { title: "MLT Practice Questions & CSMLS/ASCP Exam Prep | NurseNest", description: "Ace your CSMLS or ASCP certification with MLT practice questions covering hematology, microbiology, blood banking, and clinical chemistry. Mock exams, flashcards, and detailed rationales included.", shortName: "MLT", exams: "CSMLS & ASCP" },
      "medical-laboratory-technologist": { title: "MLT Practice Questions & CSMLS/ASCP Exam Prep | NurseNest", description: "Ace your CSMLS or ASCP certification with MLT practice questions covering hematology, microbiology, blood banking, and clinical chemistry. Mock exams, flashcards, and detailed rationales included.", shortName: "MLT", exams: "CSMLS & ASCP" },
      "imaging": { title: "Radiography Practice Questions & ARRT/CAMRT Exam Prep | NurseNest", description: "Prepare for the ARRT or CAMRT radiography exam with positioning questions, radiation safety drills, image quality scenarios, and timed mock exams. Exam-aligned content with detailed rationales.", shortName: "Radiography", exams: "ARRT & CAMRT" },
      "radiologic-technologist": { title: "Radiography Practice Questions & ARRT/CAMRT Exam Prep | NurseNest", description: "Prepare for the ARRT or CAMRT radiography exam with positioning questions, radiation safety drills, image quality scenarios, and timed mock exams. Exam-aligned content with detailed rationales.", shortName: "Radiography", exams: "ARRT & CAMRT" },
      "diagnostic-sonography": { title: "Sonography Practice Questions & ARDMS Exam Prep | NurseNest", description: "Pass the ARDMS RDMS and SPI exams with sonography practice questions covering abdominal, OB/GYN, vascular, and physics. Mock exams, flashcards, and case-based scenarios included.", shortName: "Sonography", exams: "ARDMS RDMS & SPI" },
      "cardiac-sonographer": { title: "Cardiac Sonography Practice Questions & RDCS Exam Prep | NurseNest", description: "Prepare for the ARDMS RDCS or CCI RCS exam with echocardiography practice questions, hemodynamics drills, valve assessment scenarios, and timed mock exams. Build exam confidence.", shortName: "Cardiac Sonography", exams: "ARDMS RDCS & CCI RCS" },
      "social-work": { title: "Social Work Practice Questions & ASWB Exam Prep | NurseNest", description: "Social Work exam preparation — practice questions, mock exams, flashcards, and study guides for ASWB Licensing certification. Build exam confidence with detailed rationales.", shortName: "Social Work", exams: "ASWB Licensing" },
      "psychotherapy": { title: "Psychotherapy Practice Questions & CRPO/NCE Exam Prep | NurseNest", description: "Psychotherapy exam preparation — practice questions, mock exams, flashcards, and study guides for CRPO & NCE certification. Build exam confidence with detailed rationales.", shortName: "Psychotherapy", exams: "CRPO & NCE" },
      "addictions": { title: "Addictions Counselling Practice Questions & IC&RC Exam Prep | NurseNest", description: "Addictions Counselling exam preparation — practice questions, mock exams, flashcards, and study guides for IC&RC ADC & CCAC certification. Build exam confidence with detailed rationales.", shortName: "Addictions", exams: "IC&RC ADC & CCAC" },
      "occupational-therapy": { title: "OT Practice Questions & NBCOT Exam Prep | NurseNest", description: "Occupational Therapy exam preparation — practice questions, mock exams, flashcards, and study guides for NBCOT OTR & NOTCE certification. Build exam confidence with detailed rationales.", shortName: "OT", exams: "NBCOT OTR & NOTCE" },
      "occupational-therapy-assistant": { title: "OTA Practice Questions & NBCOT COTA Exam Prep | NurseNest", description: "Pass the NBCOT COTA exam with OTA practice questions covering ADLs, cognitive rehabilitation, pediatric milestones, and adaptive equipment. Mock exams and detailed rationales included.", shortName: "OTA", exams: "NBCOT COTA" },
      "physiotherapy-assistant": { title: "PTA Practice Questions & NPTE-PTA Exam Prep | NurseNest", description: "Ace the NPTE-PTA exam with physical therapy assistant practice questions, therapeutic exercise scenarios, gait training drills, and timed mock exams. Exam-aligned content with rationales.", shortName: "PTA", exams: "NPTE-PTA" },
      "surgical-technologist": { title: "Surgical Tech Practice Questions & CST Exam Prep | NurseNest", description: "Prepare for the NBSTSA CST exam with surgical technologist practice questions on sterile technique, instrument identification, surgical counts, and OR safety. Content coming soon.", shortName: "Surg Tech", exams: "NBSTSA CST" },
      "health-information-management": { title: "HIM Practice Questions & RHIT/RHIA Exam Prep | NurseNest", description: "Pass the AHIMA RHIT, RHIA, or CCS exam with health information management practice questions covering ICD-10 coding, HIPAA compliance, CDI, and revenue cycle management. Mock exams included.", shortName: "HIM", exams: "AHIMA RHIT, RHIA & CCS" },
    };
    const prof = professionMeta[profKey];
    const subPageTitle = subPage ? ` — ${slugToTitle(subPage.split("/").pop() || subPage)}` : "";
    const profTitle = prof ? prof.title : `${slugToTitle(profKey)} Practice Questions & Exam Prep | NurseNest`;
    const profDesc = prof ? prof.description : `${slugToTitle(profKey)} exam preparation — practice questions, mock exams, flashcards, and study guides. Build exam confidence with detailed rationales.`;
    const profShortName = prof ? prof.shortName : slugToTitle(profKey);
    const profExams = prof ? prof.exams : "";
    const alliedJsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LearningResource",
      "name": `${profShortName} Practice Questions & Exam Prep${subPageTitle}`,
      "description": profDesc,
      "url": canonical,
      "learningResourceType": "Quiz",
      "educationalLevel": "Professional",
      "provider": { "@type": "Organization", "name": "NurseNest", "url": SITE_BASE },
    });
    return {
      title: subPageTitle ? `${profShortName} Practice Questions & ${profExams} Exam Prep${subPageTitle} | NurseNest` : profTitle,
      description: profDesc,
      canonical,
      noindex,
      breadcrumbs,
      jsonLd: alliedJsonLd,
    };
  }

  const alliedGenericMatch = cleanPath.match(/^\/allied-health\/(.+)$/);
  if (alliedGenericMatch) {
    const subPath = alliedGenericMatch[1];
    const readable = slugToTitle(subPath.split("/").pop() || subPath);
    return {
      title: `${readable} | Allied Health | NurseNest`,
      description: `${readable} — allied health exam preparation resources on NurseNest. Study tools and career support for healthcare professionals.`,
      canonical,
      noindex,
      breadcrumbs,
    };
  }

  const nursingSchoolsMatch = cleanPath.match(/^\/nursing-schools\/(.+)$/);
  if (nursingSchoolsMatch) {
    const country = slugToTitle(nursingSchoolsMatch[1]);
    return {
      title: `Nursing Schools in ${country} – Accredited Programs & Admissions Guide | NurseNest`,
      description: `Complete directory of nursing schools in ${country}. Compare programs, tuition, admissions requirements, and licensing outcomes for ${country} nursing education.`,
      canonical,
      noindex,
      breadcrumbs: [
        { name: "Home", url: SITE_BASE },
        { name: "Nursing Schools", url: `${SITE_BASE}/nursing-schools` },
        { name: `Nursing Schools in ${country}`, url: `${SITE_BASE}/nursing-schools/${nursingSchoolsMatch[1]}` },
      ],
    };
  }

  const residencyMatch = cleanPath.match(/^\/nurse-residency-programs\/(.+)$/);
  if (residencyMatch) {
    const country = slugToTitle(residencyMatch[1]);
    return {
      title: `Nurse Residency Programs in ${country} – New Grad Programs Guide | NurseNest`,
      description: `Directory of nurse residency and new graduate programs in ${country}. Find transition-to-practice programs by hospital system, specialty, and application timeline.`,
      canonical,
      noindex,
      breadcrumbs: [
        { name: "Home", url: SITE_BASE },
        { name: "Nurse Residency Programs", url: `${SITE_BASE}/nurse-residency-programs` },
        { name: country, url: `${SITE_BASE}/nurse-residency-programs/${residencyMatch[1]}` },
      ],
    };
  }

  const regulatoryMatch = cleanPath.match(/^\/nursing-regulatory-bodies\/(.+)$/);
  if (regulatoryMatch) {
    const bodyName = slugToTitle(regulatoryMatch[1]);
    return {
      title: `${bodyName} – Nursing Registration & Licensing Guide | NurseNest`,
      description: `Complete guide to ${bodyName}. Learn about registration requirements, licensing exams, credential recognition, and pathways for internationally educated nurses.`,
      canonical,
      noindex,
      breadcrumbs: [
        { name: "Home", url: SITE_BASE },
        { name: "Nursing Regulatory Bodies", url: `${SITE_BASE}/nursing-regulatory-bodies` },
        { name: bodyName, url: `${SITE_BASE}/nursing-regulatory-bodies/${regulatoryMatch[1]}` },
      ],
    };
  }

  const licensingExamMatch = cleanPath.match(/^\/nursing-licensing-exams\/(.+)$/);
  if (licensingExamMatch) {
    const examName = slugToTitle(licensingExamMatch[1]);
    return {
      title: `${examName} Exam Guide: Format, Requirements & Preparation | NurseNest`,
      description: `Complete guide to the ${examName} nursing exam. Exam format, eligibility requirements, preparation strategies, costs, and frequently asked questions.`,
      canonical,
      noindex,
      breadcrumbs: [
        { name: "Home", url: SITE_BASE },
        { name: "Nursing Licensing Exams", url: `${SITE_BASE}/nursing-licensing-exams` },
        { name: examName, url: `${SITE_BASE}/nursing-licensing-exams/${licensingExamMatch[1]}` },
      ],
    };
  }

  const newGradMatch = cleanPath.match(/^\/new-grad(\/.*)?$/);
  if (newGradMatch) {
    const subPath = newGradMatch[1] || "";
    if (!subPath || subPath === "/") {
      return {
        title: "New Grad Nursing Hub — First-Year Survival Guides, Certifications & Career Tools | NurseNest",
        description: "Launch your nursing career with first-year survival guides, specialty certification prep (ACLS, PALS, CCRN), interview prep, resume templates, and career development tools for new graduate nurses.",
        canonical,
        noindex,
        breadcrumbs,
      };
    }
    const readable = slugToTitle(subPath.replace(/^\//, "").split("/").pop() || "");
    return {
      title: `${readable} — New Grad Nursing Guide | NurseNest`,
      description: `${readable} — practical guide for new graduate nurses covering clinical skills, professional development, and career transition support.`,
      canonical,
      noindex,
      breadcrumbs,
    };
  }

  return {
    title: "NurseNest - NCLEX & NCLEX-PN / REx-PN Exam Prep | Nursing Education Platform",
    description: "Prepare for NCLEX, NCLEX-PN, and REx-PN with NurseNest. 1,200+ practice questions, 200+ clinical lessons, pharmacology flashcards, and case simulations for nursing students. New content added weekly.",
    canonical,
    noindex,
    breadcrumbs,
  };
}

const KNOWN_STATIC_PATHS = new Set(Object.keys(staticPages).concat([
  "/", "/lessons", "/flashcards", "/pricing", "/start-free", "/anatomy",
  "/med-math", "/lab-values", "/mock-exams", "/clinical-clarity", "/blog",
  "/pre-nursing", "/question-of-the-day", "/daily-question", "/question-bank", "/lectures",
  "/nursing", "/nursing-specialties", "/nursing-certifications", "/healthcare-certifications", "/nursing-schools",
  "/nurse-residency-programs", "/nursing-regulatory-bodies", "/study-pathways",
  "/faq", "/about", "/contact", "/terms", "/privacy",
  "/nclex-rn-practice-questions", "/nclex-pn-practice-questions",
  "/rex-pn-practice-questions", "/np-exam-practice-questions",
  "/free-practice", "/practice-questions", "/glossary", "/medication-mastery",
  "/exam-prep", "/new-graduate-support", "/healthcare-careers", "/healthcare-certifications", "/guides",
  "/healthcare-policy-and-updates",
  "/healthcare-policy-and-updates/licensing-policy-changes",
  "/healthcare-policy-and-updates/international-nursing-recruitment",
  "/healthcare-policy-and-updates/exam-format-updates",
  "/healthcare-policy-and-updates/regulatory-changes-affecting-nurses",
  "/topics", "/allied-health", "/case-simulations", "/shop",
  "/perioperative-nursing", "/preoperative-care", "/preoperative-nursing-guide",
  "/perioperative-nurse-career", "/nclex-rn", "/nclex-pn", "/canada-np", "/us-np",
  "/medical-imaging", "/pharmacology", "/rex-pn", "/new-grad",
  "/applynest", "/clinical-skills", "/clinical-case-studies", "/for-institutions",
  "/order-of-the-draw", "/test-bank", "/dashboard", "/newgrad",
  "/international-nurses", "/international-nurses/tools",
  "/international-nurses/canada", "/international-nurses/united-states",
  "/international-nurses/united-kingdom", "/international-nurses/australia",
  "/international-nurses/new-zealand", "/international-nurses/ireland",
  "/international-nurses/uae", "/international-nurses/saudi-arabia",
  "/international-nurses/philippines-to-canada", "/international-nurses/india-to-canada",
  "/international-nurses/philippines-to-usa", "/international-nurses/india-to-uk",
  "/international-nurses/philippines-to-uk", "/international-nurses/india-to-australia",
  "/international-nurses/nigeria-to-canada", "/international-nurses/nepal-to-uk",
  "/philippines-to-canada", "/india-to-canada", "/philippines-to-usa",
  "/india-to-uk", "/philippines-to-uk", "/india-to-australia",
  "/nigeria-to-canada", "/nepal-to-uk",
  "/nclex-for-international-nurses", "/rex-pn-for-international-nurses",
  "/ielts-for-nurses", "/oet-for-nurses",
  "/nursing-credential-assessment-explained", "/how-to-transfer-nursing-license",
  "/canada-vs-usa-nursing", "/canada-vs-uk-nursing", "/australia-vs-new-zealand-nursing",
  "/nursing-bridging-programs-explained", "/international-nurse-salary-comparison",
  "/nursing-visa-sponsorship-guide", "/working-as-a-nurse-in-canada",
  "/nnas-application-guide", "/cgfns-certification-guide",
  "/nmc-registration-guide-international-nurses", "/nursing-recruitment-agencies-guide",
  "/cultural-adjustment-international-nurses", "/international-nurse-interview-tips",
  "/nursing-licensing-exams", "/nurse-salary-guide",
  "/nurse-salary-canada", "/nurse-salary-united-states",
  "/nurse-salary-united-kingdom", "/nurse-salary-australia",
  "/cardiology-nursing", "/respiratory-nursing", "/endocrine-nursing",
  "/neurology-nursing", "/electrolytes-nursing", "/pharmacology-nursing",
]));

const KNOWN_DYNAMIC_PREFIXES = [
  "/lessons/", "/learn/", "/blog/", "/clinical-clarity/", "/glossary/",
  "/rpn/questions", "/rn/questions", "/np/questions",
  "/conditions/", "/medications/", "/lab-values/",
  "/clinical-comparisons/", "/symptoms/",
  "/how-to-become-", "/career-development/", "/new-grad/",
  "/compare/", "/topics/", "/guides/", "/newgrad/", "/healthcare-careers/", "/healthcare-policy-and-updates/",
  "/allied-health/", "/flashcards/deck/",
  "/medical-imaging/", "/practice-questions/",
  "/mock-exams/", "/applynest/",
  "/perioperative-", "/preoperative-",
  "/nclex-rn/", "/nclex-pn/", "/rex-pn/", "/np-exam/", "/canada-np/", "/us-np/",
  "/rpn/", "/rn/", "/np/",
  "/nclex/", "/symptoms/", "/meds/", "/labs/", "/clinical-compare/",
  "/radiography-", "/hyperkalemia-", "/barrel-chest-",
  "/question-bank-", "/medication-mastery-", "/nursing-simulation-",
  "/nursing/", "/paramedic/", "/respiratory-therapy/", "/mlt/", "/imaging/",
  "/sepsis-", "/ventilator-", "/diabetes-", "/fluid-", "/hemodynamic-",
  "/wound-care-", "/medication-admin", "/pain-management-", "/cardiac-rhythm-",
  "/infection-control-", "/maternal-", "/pediatric-", "/mental-health-",
  "/perioperative-care-", "/pharmacology-basics-", "/nclex-clinical-",
  "/si-to-", "/canadian-vs-", "/glucose-", "/creatinine-", "/hemoglobin-",
  "/bilirubin-", "/calcium-", "/urea-", "/cholesterol-", "/kg-to-",
  "/celsius-", "/test-nclex-", "/pass-nclex-",
  "/rexpn-", "/nclex-management-", "/nclex-safety-", "/nclex-health-",
  "/nclex-psychosocial-", "/nclex-basic-", "/nclex-pharmacology",
  "/nclex-reduction-", "/nclex-physiological-", "/nclex-pn-",
  "/allied-respiratory-", "/allied-medical-", "/allied-radiography",
  "/allied-paramedic", "/allied-occupational-", "/allied-social-",
  "/allied-pharmacy-", "/allied-psychotherapy-", "/allied-health-exam-",
  "/simulators/",
  "/nursing-licensing-exams/",
  "/healthcare-careers/",
  "/healthcare-certifications/",
];

async function isDbContentAvailable(strippedPath: string): Promise<boolean> {
  const learnMatch = strippedPath.match(/^\/learn\/(.+)$/);
  if (learnMatch) {
    try {
      const result = await pool.query(
        "SELECT 1 FROM content_items WHERE slug = $1 AND status = 'published' LIMIT 1",
        [learnMatch[1]]
      );
      return result.rows.length > 0;
    } catch { return false; }
  }

  const lessonMatch = strippedPath.match(/^\/lessons\/(.+)$/);
  if (lessonMatch) {
    const data = getLessonSeoData();
    if (data[lessonMatch[1]]) return true;
    try {
      const result = await pool.query(
        "SELECT 1 FROM lessons WHERE slug = $1 AND status = 'published' LIMIT 1",
        [lessonMatch[1]]
      );
      return result.rows.length > 0;
    } catch { return false; }
  }

  const blogMatch = strippedPath.match(/^\/blog\/(.+)$/);
  const clarityMatch = strippedPath.match(/^\/clinical-clarity\/(.+)$/);
  const slug = blogMatch?.[1] || clarityMatch?.[1];
  if (slug) {
    try {
      const result = await pool.query(
        "SELECT 1 FROM content_items WHERE slug = $1 AND status = 'published' LIMIT 1",
        [slug]
      );
      return result.rows.length > 0;
    } catch { return false; }
  }

  return true;
}

export async function checkContentExists(strippedPath: string): Promise<boolean> {
  if (strippedPath === "/" || strippedPath === "") return true;

  if (KNOWN_STATIC_PATHS.has(strippedPath)) return true;

  for (const prefix of KNOWN_DYNAMIC_PREFIXES) {
    if (strippedPath.startsWith(prefix) || strippedPath === prefix.replace(/\/$/, "")) {
      const needsDbCheck = strippedPath.startsWith("/learn/") ||
        strippedPath.startsWith("/lessons/") ||
        (strippedPath.startsWith("/blog/") && strippedPath !== "/blog") ||
        (strippedPath.startsWith("/clinical-clarity/") && strippedPath !== "/clinical-clarity");
      if (needsDbCheck) {
        return isDbContentAvailable(strippedPath);
      }
      return true;
    }
  }

  if (isNoindexPath(strippedPath)) return true;

  return false;
}

export async function injectMeta(html: string, pathname: string, options?: { isAllied?: boolean }): Promise<string> {
const localeMatch = pathname.match(/^\/(en|fr|es|fil|hi|zh-tw|zh|ar|ko|pt|pa|vi|ht|ur|ja|fa|de|th|tr|id)(\/.*|$)/);
  const detectedLocale = localeMatch ? localeMatch[1] : "en";
  const strippedPath = localeMatch ? (localeMatch[2] || "/") : pathname;
  const meta = getPageMeta(pathname, options);

  if (isEmergencyMode()) {
    meta.noindex = true;
  }

  const deLocalizedStrippedPath = detectedLocale !== "en" ? deLocalizeSlug(detectedLocale, strippedPath) : strippedPath;
  const contentExists = await checkContentExists(deLocalizedStrippedPath);
  if (!contentExists) {
    meta.noindex = true;
  }

  html = html.replace(
    /<html\s+lang="[^"]*"/,
    `<html lang="${detectedLocale}"`
  );

  const dir = getLocaleDirection(detectedLocale);
  if (dir === "rtl") {
    html = html.replace(
      /<html\s+lang="[^"]*"/,
      `<html lang="${detectedLocale}" dir="rtl"`
    );
  }

  const timestampSlugMatch = strippedPath.match(/^\/(lessons|learn)\/(.+)-\d{13}$/);
  if (timestampSlugMatch) {
    meta.noindex = true;
  }

  if (detectedLocale !== "en" && strippedPath.startsWith("/lessons/")) {
    const { isLocaleIndexable } = await import("./translation-audit");
    if (!isLocaleIndexable(detectedLocale)) {
      meta.noindex = true;
    }
  }

  const contentData = await fetchContentForPath(strippedPath);
  if (contentData) {
    if (contentData.summary) {
      meta.description = contentData.summary.substring(0, 300);
    }

    const isLesson = strippedPath.startsWith("/lessons/");
    const isBlog = (strippedPath.startsWith("/blog/") && strippedPath !== "/blog") || (strippedPath.startsWith("/learn/") && strippedPath !== "/learn");
    const isClarity = strippedPath.startsWith("/clinical-clarity/") && strippedPath !== "/clinical-clarity";
    const textContent = extractTextFromContent(contentData.content);
    const wordCount = textContent.split(/\s+/).length;

    const PLACEHOLDER_CONTENT_MARKERS = [
      /unable to complete/i,
      /placeholder/i,
      /\[draft\]/i,
      /test publish/i,
      /coming soon/i,
    ];
    const titleLower = (contentData.title || "").toLowerCase();
    const isPlaceholderPage = wordCount < 200 ||
      PLACEHOLDER_CONTENT_MARKERS.some(p => p.test(titleLower)) ||
      PLACEHOLDER_CONTENT_MARKERS.some(p => p.test(textContent.substring(0, 500)));

    if (isPlaceholderPage) {
      meta.noindex = true;
    }

    if (isLesson && wordCount < 300) {
      meta.noindex = true;
    }

    const jsonLd: any = {
      "@context": "https://schema.org",
      "@type": isLesson ? "Course" : "Article",
      "name": contentData.title,
      "headline": contentData.title,
      "description": meta.description,
      "url": meta.canonical,
      "publisher": {
        "@type": "Organization",
        "name": "NurseNest",
        "url": SITE_BASE,
      },
      "provider": {
        "@type": "Organization",
        "name": "NurseNest",
        "url": SITE_BASE,
      },
      "inLanguage": detectedLocale,
    };

    if (isLesson) {
      jsonLd["@type"] = "Course";
      jsonLd["hasCourseInstance"] = {
        "@type": "CourseInstance",
        "courseMode": "online",
      };
      if (contentData.category) jsonLd["courseCode"] = contentData.category;
      jsonLd["educationalLevel"] = "Professional";
      jsonLd["about"] = {
        "@type": "MedicalCondition",
        "name": contentData.title,
        "medicalSpecialty": "Nursing",
      };
    }

    if (isBlog || isClarity) {
      jsonLd["@type"] = "Article";
      jsonLd["author"] = { "@type": "Organization", "name": "NurseNest" };
      jsonLd["wordCount"] = wordCount;
    }

    if (contentData.createdAt) {
      jsonLd["datePublished"] = new Date(contentData.createdAt).toISOString().split("T")[0];
    }
    if (contentData.tags && contentData.tags.length > 0) {
      jsonLd["keywords"] = contentData.tags.join(", ");
    }

    if (textContent.length > 100) {
      jsonLd["articleBody"] = textContent.substring(0, 5000);
    }

    meta.jsonLd = JSON.stringify(jsonLd);
    meta.noscriptContent = buildNoscriptHtml(contentData.content, contentData.title);
  }

  const EDUCATIONAL_ORG_LANDING_PAGES = new Set([
    "/", "/lessons", "/flashcards", "/test-bank", "/mock-exams",
    "/pricing", "/about", "/pre-nursing", "/free-practice",
    "/nclex-rn", "/nclex-pn", "/canada-np", "/us-np",
    "/medical-imaging", "/new-grad",
    "/exam-prep", "/new-graduate-support", "/healthcare-careers",
    "/allied-health",
  ]);

  if (EDUCATIONAL_ORG_LANDING_PAGES.has(strippedPath)) {
    const eduOrgLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "NurseNest",
      "url": `${SITE_BASE}/en`,
      "description": "Premier nursing and allied health education platform offering interactive lessons, practice questions, flashcards, and clinical simulations for RPN/LVN, RN, NP, and allied health students.",
      "educationalCredentialAwarded": "Nursing & Allied Health Exam Preparation",
      "areaServed": [
        { "@type": "Country", "name": "Canada" },
        { "@type": "Country", "name": "United States" },
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Healthcare Education Programs",
        "itemListElement": [
          { "@type": "Course", "name": "RPN/LVN Foundation Track", "description": "Core pathophysiology and foundational nursing skills" },
          { "@type": "Course", "name": "RN/NCLEX Preparation Track", "description": "Advanced clinical reasoning and NCLEX exam preparation" },
          { "@type": "Course", "name": "NP Advanced Practice Track", "description": "Molecular-level pathophysiology and diagnostic reasoning for NP certification" },
          { "@type": "Course", "name": "Allied Health Programs", "description": "Exam preparation for pharmacy tech, respiratory therapy, paramedic, MLT, and imaging professionals" },
        ],
      },
    });
    if (!meta.jsonLd) {
      meta.jsonLd = eduOrgLd;
    }
  }

  const allJsonLd: string[] = [];
  if (meta.jsonLd) {
    allJsonLd.push(meta.jsonLd);
  }

  if (meta.breadcrumbs && meta.breadcrumbs.length > 1) {
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": meta.breadcrumbs.map((crumb, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": crumb.name,
        "item": crumb.url,
      })),
    };
    allJsonLd.push(JSON.stringify(breadcrumbLd));
  }

  html = html.replace(
    /<!--SEO_TITLE-->.*?<!--\/SEO_TITLE-->/s,
    `<!--SEO_TITLE--><title>${meta.title}</title><!--/SEO_TITLE-->`
  );

  html = html.replace(
    /<!--SEO_DESC-->.*?<!--\/SEO_DESC-->/s,
    `<!--SEO_DESC--><meta name="description" content="${escapeHtml(meta.description)}" /><!--/SEO_DESC-->`
  );

  html = html.replace(
    /<!--SEO_CANONICAL-->.*?<!--\/SEO_CANONICAL-->/s,
    `<!--SEO_CANONICAL--><link rel="canonical" href="${meta.canonical}" /><!--/SEO_CANONICAL-->`
  );

  const NEVER_NOINDEX_PATHS = new Set(["/"]);
  if (NEVER_NOINDEX_PATHS.has(strippedPath) && isLocaleIndexable(detectedLocale)) {
    meta.noindex = false;
  }

  if (meta.noindex) {
    html = html.replace(
      '<meta name="robots" content="index, follow" />',
      '<meta name="robots" content="noindex, follow" />'
    );
  }

  html = html.replace(
    /<!--SEO_OG_TITLE-->.*?<!--\/SEO_OG_TITLE-->/s,
    `<!--SEO_OG_TITLE--><meta property="og:title" content="${escapeHtml(meta.title)}" /><!--/SEO_OG_TITLE-->`
  );

  html = html.replace(
    /<!--SEO_OG_DESC-->.*?<!--\/SEO_OG_DESC-->/s,
    `<!--SEO_OG_DESC--><meta property="og:description" content="${escapeHtml(meta.description)}" /><!--/SEO_OG_DESC-->`
  );

  html = html.replace(
    /<!--SEO_TW_TITLE-->.*?<!--\/SEO_TW_TITLE-->/s,
    `<!--SEO_TW_TITLE--><meta name="twitter:title" content="${escapeHtml(meta.title)}" /><!--/SEO_TW_TITLE-->`
  );

  html = html.replace(
    /<!--SEO_TW_DESC-->.*?<!--\/SEO_TW_DESC-->/s,
    `<!--SEO_TW_DESC--><meta name="twitter:description" content="${escapeHtml(meta.description)}" /><!--/SEO_TW_DESC-->`
  );

  const ogImageUrl = meta.ogImage || `${SITE_BASE}/opengraph.jpg`;
  html = html.replace(
    /<!--SEO_OG_IMAGE-->.*?<!--\/SEO_OG_IMAGE-->/s,
    `<!--SEO_OG_IMAGE--><meta property="og:image" content="${escapeHtml(ogImageUrl)}" /><!--/SEO_OG_IMAGE-->`
  );
  html = html.replace(
    /<!--SEO_OG_URL-->.*?<!--\/SEO_OG_URL-->/s,
    `<!--SEO_OG_URL--><meta property="og:url" content="${escapeHtml(meta.canonical)}" /><!--/SEO_OG_URL-->`
  );
  html = html.replace(
    /<!--SEO_TW_IMAGE-->.*?<!--\/SEO_TW_IMAGE-->/s,
    `<!--SEO_TW_IMAGE--><meta name="twitter:image" content="${escapeHtml(ogImageUrl)}" /><!--/SEO_TW_IMAGE-->`
  );

  if (allJsonLd.length > 0) {
    const jsonLdTags = allJsonLd.map(ld => `<script type="application/ld+json">${ld}</script>`).join("\n");
    html = html.replace(
      "</head>",
      `${jsonLdTags}\n</head>`
    );
  }

  const indexableLocales = getIndexableLocales();
  const englishPath = deLocalizedStrippedPath;
  const isNoindexRoute = isNoindexPath(englishPath);
  const hreflangTags: string[] = [];
  const hreflangBase = options?.isAllied ? ALLIED_SITE_BASE : SITE_BASE;

  const isContentPage = englishPath.startsWith("/lessons/") ||
    englishPath.startsWith("/learn/") ||
    englishPath.startsWith("/clinical-clarity/") ||
    (englishPath.startsWith("/blog") && englishPath !== "/blog");

  if (!isNoindexRoute) {
    const hreflangLocales = indexableLocales.filter(locale => {
      if (locale === "en") return true;
      if (isLowValueTranslatedPage(englishPath, locale)) return false;
      return true;
    });

    for (const locale of hreflangLocales) {
      const hreflang = getHreflangCode(locale);
      const localizedPath = localizeSlug(locale, englishPath);
      const localeUrl = normalizeCanonicalUrl(localizedPath, locale, hreflangBase);
      hreflangTags.push(`<link rel="alternate" hreflang="${hreflang}" href="${localeUrl}" />`);
    }
    const enPath = localizeSlug("en", englishPath);
    hreflangTags.push(`<link rel="alternate" hreflang="x-default" href="${normalizeCanonicalUrl(enPath, "en", hreflangBase)}" />`);
  }

  if (hreflangTags.length > 0) {
    html = html.replace(
      "</head>",
      `${hreflangTags.join("\n")}\n</head>`
    );
  }

  html = html.replace(
    "</head>",
    `<script>window.__INDEXABLE_LOCALES__=${JSON.stringify(indexableLocales)};</script>\n</head>`
  );

  if (meta.noscriptContent) {
    html = html.replace(
      "</body>",
      `<noscript><article role="main">${meta.noscriptContent}</article></noscript>\n</body>`
    );
  } else if ((strippedPath === "/" || strippedPath === "") && detectedLocale === "en") {
    const homepageNoscript = `<noscript><article role="main" lang="en">` +
      `<h1>NurseNest — Healthcare Exam Prep for Nursing, NP &amp; Allied Health</h1>` +
      `<p>Prepare for NCLEX-RN, NCLEX-PN, REx-PN, NP certification, and allied health exams with NurseNest. Access 13,000+ practice questions, 13,000+ flashcards, 8,000+ clinical lessons, adaptive CAT exams, and clinical case simulations.</p>` +
      `<h2>Why NurseNest?</h2>` +
      `<ul>` +
      `<li>Evidence-based active recall and spaced repetition</li>` +
      `<li>Next Generation NCLEX (NGN) clinical judgment questions</li>` +
      `<li>NCLEX &amp; REx-PN exam blueprint alignment</li>` +
      `<li>Clinical decision-making simulations</li>` +
      `</ul>` +
      `<h2>Built For</h2>` +
      `<ul>` +
      `<li>Nursing Students (RPN/LVN, RN, NP)</li>` +
      `<li>Allied Health Professionals (RRT, MLT, Paramedic, Social Work, OT)</li>` +
      `<li>New Graduates preparing for licensure</li>` +
      `</ul>` +
      `<p>Available in 20 languages. Start free at <a href="https://www.nursenest.ca/en">nursenest.ca</a>.</p>` +
      `</article></noscript>\n`;
    html = html.replace("</body>", `${homepageNoscript}</body>`);
  }

  return html;
}
