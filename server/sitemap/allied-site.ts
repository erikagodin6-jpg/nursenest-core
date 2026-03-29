import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../storage";
import { importClientDataAbsolute } from "../client-data-import";
import {
  getSiteBase, todayDate, toLastmod, localizedUrl, getIndexableLocales
} from "./helpers";

const __dirnameAlliedSitemap =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

/** Avoid literal `../../client/...` strings so server `tsc` does not trace client modules. */
function alliedSiteClientDataModule(...segments: string[]): string {
  return path.resolve(__dirnameAlliedSitemap, "..", "..", "client", "src", "data", ...segments);
}

const ALLIED_PREFIX = "/allied-health";

const STATIC_CONTENT_DATE = "2025-01-15";

export async function generateAlliedCareers(): Promise<string[]> {
  const base = getSiteBase();
  const locales = getIndexableLocales();
  const urls: string[] = [];

  urls.push(localizedUrl(base, `${ALLIED_PREFIX}/careers`, "0.9", "monthly", locales, STATIC_CONTENT_DATE));

  const canonicalCareerRoutes = [
    "/rrt", "/paramedic", "/pharmacy-technician", "/mlt", "/imaging",
    "/social-work", "/psychotherapy", "/addictions", "/occupational-therapy",
  ];

  for (const route of canonicalCareerRoutes) {
    urls.push(localizedUrl(base, `${ALLIED_PREFIX}${route}`, "0.9", "weekly", locales, STATIC_CONTENT_DATE));
  }

  const careerGuidePages = [
    "how-to-become-a-paramedic", "how-to-become-a-respiratory-therapist",
    "how-to-become-a-medical-lab-technologist", "how-to-become-a-radiologic-technologist",
    "how-to-become-a-social-worker", "how-to-become-a-psychotherapist",
    "how-to-become-an-addictions-counselor", "how-to-become-an-occupational-therapist",
    "how-to-become-a-pharmacy-technician",
  ];
  for (const page of careerGuidePages) {
    urls.push(localizedUrl(base, `${ALLIED_PREFIX}/${page}`, "0.9", "monthly", locales, STATIC_CONTENT_DATE));
  }

  return urls;
}

export async function generateAlliedExams(): Promise<string[]> {
  const base = getSiteBase();
  const locales = getIndexableLocales();
  const urls: string[] = [];

  urls.push(localizedUrl(base, `${ALLIED_PREFIX}/qbank`, "0.8", "weekly", locales, STATIC_CONTENT_DATE));

  const canonicalCareerRoutes = [
    "/rrt", "/paramedic", "/pharmacy-technician", "/mlt", "/imaging",
    "/social-work", "/psychotherapy", "/addictions", "/occupational-therapy",
  ];
  const examSubPages = ["mock-exams", "flashcards", "study-plan"];
  for (const route of canonicalCareerRoutes) {
    for (const sub of examSubPages) {
      urls.push(localizedUrl(base, `${ALLIED_PREFIX}${route}/${sub}`, "0.8", "weekly", locales, STATIC_CONTENT_DATE));
    }
  }

  const allExamPrepPages = new Set([
    "paramedic-exam-prep", "rrt-exam-prep", "mlt-exam-prep", "radiography-exam-prep",
    "social-work-exam-prep", "psychotherapy-exam-prep", "addictions-counselling-exam-prep", "occupational-therapy-exam-prep",
    "respiratory-therapy-exam-prep", "medical-lab-tech-exam-prep",
    "diagnostic-imaging-exam-prep", "physical-therapy-exam-prep",
  ]);
  for (const page of allExamPrepPages) {
    urls.push(localizedUrl(base, `${ALLIED_PREFIX}/${page}`, "0.8", "monthly", locales, STATIC_CONTENT_DATE));
  }

  return urls;
}

export async function generateAlliedTools(): Promise<string[]> {
  const base = getSiteBase();
  const locales = getIndexableLocales();
  const urls: string[] = [];

  const canonicalCareerRoutes = [
    "/rrt", "/paramedic", "/pharmacy-technician", "/mlt", "/imaging",
    "/social-work", "/psychotherapy", "/addictions", "/occupational-therapy",
  ];
  const toolSubPages = ["sims", "tools"];
  for (const route of canonicalCareerRoutes) {
    for (const sub of toolSubPages) {
      urls.push(localizedUrl(base, `${ALLIED_PREFIX}${route}/${sub}`, "0.7", "weekly", locales, STATIC_CONTENT_DATE));
    }
  }

  const otNamespacedPages = [
    "occupational-therapist/question-bank",
    "occupational-therapist/mock-exams",
    "occupational-therapist/study-plan",
  ];
  for (const page of otNamespacedPages) {
    urls.push(localizedUrl(base, `${ALLIED_PREFIX}/${page}`, "0.7", "monthly", locales, STATIC_CONTENT_DATE));
  }

  urls.push(localizedUrl(base, `${ALLIED_PREFIX}/pharmacy-technician/drug-classes`, "0.7", "weekly", locales, STATIC_CONTENT_DATE));
  const drugClassSlugs = ["ace-inhibitors", "beta-blockers", "statins", "antibiotics", "antidiabetic-drugs", "antidepressants", "antihistamines"];
  for (const slug of drugClassSlugs) {
    urls.push(localizedUrl(base, `${ALLIED_PREFIX}/pharmacy-technician/drug-classes/${slug}`, "0.7", "monthly", locales, STATIC_CONTENT_DATE));
  }
  urls.push(localizedUrl(base, `${ALLIED_PREFIX}/pharmacy-technician/practice-exam-questions`, "0.7", "weekly", locales, STATIC_CONTENT_DATE));

  urls.push(localizedUrl(base, `${ALLIED_PREFIX}/pharmacy-technician/medications`, "0.8", "weekly", locales, STATIC_CONTENT_DATE));
  const pharmtechMedicationSlugs = [
    "lisinopril", "atorvastatin", "metformin", "amoxicillin", "omeprazole", "metoprolol",
    "amlodipine", "levothyroxine", "losartan", "sertraline", "albuterol", "gabapentin",
    "hydrochlorothiazide", "pantoprazole", "furosemide", "prednisone", "warfarin",
    "insulin-glargine", "rosuvastatin", "azithromycin", "escitalopram", "montelukast",
    "duloxetine", "clopidogrel", "tramadol", "fluoxetine", "apixaban", "oxycodone",
    "amphetamine-dextroamphetamine", "simvastatin", "alprazolam", "glipizide", "ibuprofen",
    "acetaminophen", "empagliflozin", "sitagliptin", "semaglutide", "methylphenidate",
    "doxycycline", "spironolactone", "fluticasone",
  ];
  for (const slug of pharmtechMedicationSlugs) {
    urls.push(localizedUrl(base, `${ALLIED_PREFIX}/pharmacy-technician/medications/${slug}`, "0.7", "monthly", locales, STATIC_CONTENT_DATE));
  }

  urls.push(localizedUrl(base, `${ALLIED_PREFIX}/pharmacy-technician/calculations`, "0.8", "weekly", locales, STATIC_CONTENT_DATE));
  const pharmtechCalculationSlugs = [
    "dosage-calculations", "iv-flow-rate", "unit-conversions", "alligation-method",
    "ratio-proportion", "bsa-calculations", "concentration-dilution", "days-supply",
  ];
  for (const slug of pharmtechCalculationSlugs) {
    urls.push(localizedUrl(base, `${ALLIED_PREFIX}/pharmacy-technician/calculations/${slug}`, "0.7", "monthly", locales, STATIC_CONTENT_DATE));
  }

  urls.push(localizedUrl(base, `${ALLIED_PREFIX}/pharmacy-technician/sig-codes`, "0.8", "weekly", locales, STATIC_CONTENT_DATE));
  const pharmtechSigCodeSlugs = ["common-sig-codes", "dangerous-abbreviations", "sig-code-practice"];
  for (const slug of pharmtechSigCodeSlugs) {
    urls.push(localizedUrl(base, `${ALLIED_PREFIX}/pharmacy-technician/sig-codes/${slug}`, "0.7", "monthly", locales, STATIC_CONTENT_DATE));
  }

  urls.push(localizedUrl(base, `${ALLIED_PREFIX}/pharmacy-technician/law`, "0.8", "weekly", locales, STATIC_CONTENT_DATE));
  const pharmtechLawSlugs = ["controlled-substances", "medication-safety", "pharmacy-operations", "hipaa-patient-privacy"];
  for (const slug of pharmtechLawSlugs) {
    urls.push(localizedUrl(base, `${ALLIED_PREFIX}/pharmacy-technician/law/${slug}`, "0.7", "monthly", locales, STATIC_CONTENT_DATE));
  }

  urls.push(localizedUrl(base, `${ALLIED_PREFIX}/pharmacy-technician/guides`, "0.8", "weekly", locales, STATIC_CONTENT_DATE));
  const pharmtechGuideSlugs = ["ptcb-exam-study-guide", "top-200-drugs-study-strategy", "pharmacy-math-cheat-sheet"];
  for (const slug of pharmtechGuideSlugs) {
    urls.push(localizedUrl(base, `${ALLIED_PREFIX}/pharmacy-technician/guides/${slug}`, "0.7", "monthly", locales, STATIC_CONTENT_DATE));
  }

  urls.push(localizedUrl(base, `${ALLIED_PREFIX}/rrt/pharmacology`, "0.7", "weekly", locales, STATIC_CONTENT_DATE));
  const rrtPharmacologySlugs = [
    "bronchodilators", "corticosteroids", "mucolytics", "aerosolized-anti-infectives",
    "adrenergic-medications", "diuretics-cardiopulmonary", "emergency-medications",
    "sedation-paralytics", "inhaled-delivery-devices", "side-effects-contraindications",
    "pediatric-neonatal-pharmacology", "ventilator-linked-pharmacology",
    "surfactant-therapy", "leukotriene-modifiers", "aerosol-delivery-during-ventilation",
  ];
  for (const slug of rrtPharmacologySlugs) {
    urls.push(localizedUrl(base, `${ALLIED_PREFIX}/rrt/pharmacology/${slug}`, "0.7", "monthly", locales, STATIC_CONTENT_DATE));
  }

  return urls;
}

export async function generateAlliedTopics(): Promise<string[]> {
  const base = getSiteBase();
  const locales = getIndexableLocales();
  const urls: string[] = [];

  const topicHubPages = [
    "respiratory-therapy-topics-hub", "paramedic-topics-hub",
  ];
  for (const page of topicHubPages) {
    urls.push(localizedUrl(base, `${ALLIED_PREFIX}/${page}`, "0.6", "weekly", locales, STATIC_CONTENT_DATE));
  }

  urls.push(localizedUrl(base, `${ALLIED_PREFIX}/mlt/lab-values`, "0.8", "weekly", locales, STATIC_CONTENT_DATE));
  urls.push(localizedUrl(base, `${ALLIED_PREFIX}/mlt/lab-values/complete-chart`, "0.7", "monthly", locales, STATIC_CONTENT_DATE));
  urls.push(localizedUrl(base, `${ALLIED_PREFIX}/mlt/lab-values/top-50`, "0.7", "monthly", locales, STATIC_CONTENT_DATE));
  try {
    const { getAllMltLabValueSlugs } = await importClientDataAbsolute(
      alliedSiteClientDataModule("mlt-lab-values"),
    );
    for (const slug of getAllMltLabValueSlugs()) {
      urls.push(localizedUrl(base, `${ALLIED_PREFIX}/mlt/lab-values/${slug}`, "0.7", "weekly", locales, STATIC_CONTENT_DATE));
    }
  } catch {}

  urls.push(localizedUrl(base, `${ALLIED_PREFIX}/mlt/microbiology`, "0.8", "weekly", locales, STATIC_CONTENT_DATE));
  urls.push(localizedUrl(base, `${ALLIED_PREFIX}/mlt/microbiology/quick-guide`, "0.7", "monthly", locales, STATIC_CONTENT_DATE));
  try {
    const { getAllMicrobiologyTopicSlugs } = await importClientDataAbsolute(
      alliedSiteClientDataModule("seo-microbiology"),
    );
    for (const slug of getAllMicrobiologyTopicSlugs()) {
      urls.push(localizedUrl(base, `${ALLIED_PREFIX}/mlt/microbiology/${slug}`, "0.7", "weekly", locales, STATIC_CONTENT_DATE));
    }
  } catch {}

  const encyclopediaProfessions = [
    "paramedic", "respiratory-therapy", "mlt", "imaging",
    "social-work", "psychotherapy", "addictions", "occupational-therapy",
  ];
  for (const prof of encyclopediaProfessions) {
    urls.push(localizedUrl(base, `${ALLIED_PREFIX}/${prof}-encyclopedia`, "0.5", "weekly", locales, STATIC_CONTENT_DATE));
  }

  const paramedicTables: Record<string, string> = {
    paramedic_topic_pages: `${ALLIED_PREFIX}/paramedic/topic`,
    paramedic_category_pages: `${ALLIED_PREFIX}/paramedic/category`,
    paramedic_glossary_entries: `${ALLIED_PREFIX}/paramedic/glossary`,
    paramedic_comparison_pages: `${ALLIED_PREFIX}/paramedic/compare`,
    paramedic_study_guides: `${ALLIED_PREFIX}/paramedic/study-guide`,
  };

  for (const [tbl, prefix] of Object.entries(paramedicTables)) {
    try {
      const result = await pool.query(
        `SELECT slug, updated_at FROM ${tbl} WHERE status = 'published' AND content_domain = 'paramedic' AND (is_noindex IS NULL OR is_noindex = false)`
      );
      for (const row of result.rows) {
        urls.push(localizedUrl(base, `${prefix}/${row.slug}`, "0.6", "weekly", locales, toLastmod(row.updated_at)));
      }
    } catch {}
  }

  try {
    const result = await pool.query(
      `SELECT DISTINCT subtopic
       FROM allied_questions
       WHERE career_type = 'paramedic' AND COALESCE(subtopic, '') <> ''`,
    );
    const topicSlugs = new Set<string>();
    for (const row of result.rows) {
      const raw = String(row.subtopic || "");
      const slug = raw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      if (slug) topicSlugs.add(slug);
    }
    urls.push(localizedUrl(base, `${ALLIED_PREFIX}/paramedic/questions`, "0.6", "weekly", locales, STATIC_CONTENT_DATE));
    for (const slug of topicSlugs) {
      urls.push(localizedUrl(base, `${ALLIED_PREFIX}/paramedic/questions/${slug}`, "0.6", "weekly", locales, STATIC_CONTENT_DATE));
    }
  } catch {}

  try {
    const programmaticResult = await pool.query(
      `SELECT slug, updated_at FROM programmatic_pages WHERE status = 'published' ORDER BY updated_at DESC`
    );
    for (const row of programmaticResult.rows) {
      urls.push(localizedUrl(base, `${ALLIED_PREFIX}/${row.slug}`, "0.6", "weekly", locales, toLastmod(row.updated_at)));
    }
  } catch {}

  const alliedQuestionCareerTypes: string[] = ["rrt", "mlt", "imaging"];
  for (const careerType of alliedQuestionCareerTypes) {
    try {
      const result = await pool.query(
        `SELECT DISTINCT subtopic
         FROM allied_questions
         WHERE career_type = $1 AND COALESCE(subtopic, '') <> ''`,
        [careerType],
      );
      const slugSet = new Set<string>();
      for (const row of result.rows) {
        const raw = String(row.subtopic || "");
        const slug = raw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        if (slug) slugSet.add(slug);
      }
      urls.push(localizedUrl(base, `${ALLIED_PREFIX}/${careerType}/questions`, "0.6", "weekly", locales, STATIC_CONTENT_DATE));
      for (const slug of slugSet) {
        urls.push(localizedUrl(base, `${ALLIED_PREFIX}/${careerType}/questions/${slug}`, "0.6", "weekly", locales, STATIC_CONTENT_DATE));
      }
    } catch {}
  }

  return urls;
}

export async function generateAlliedSeoLanding(): Promise<string[]> {
  const base = getSiteBase();
  const locales = getIndexableLocales();
  const urls: string[] = [];

  urls.push(localizedUrl(base, `${ALLIED_PREFIX}`, "1.0", "weekly", locales, STATIC_CONTENT_DATE));
  urls.push(localizedUrl(base, `${ALLIED_PREFIX}/pricing`, "0.8", "monthly", locales, STATIC_CONTENT_DATE));

  const seoLandingPages = [
    "pharmacy-technician-practice-questions", "pharmacy-technician-mock-exam", "pharmacy-technician-study-guide",
    "rrt-practice-questions", "rrt-mock-exam", "rrt-study-guide",
    "social-worker-exam-prep", "social-worker-career-guide", "social-worker-study-guide", "social-worker-practice-questions",
    "psychotherapist-exam-prep", "psychotherapist-career-guide", "psychotherapist-study-guide", "psychotherapist-practice-questions",
    "addictions-counsellor-exam-prep", "addictions-counsellor-career-guide", "addictions-counsellor-study-guide", "addictions-counsellor-practice-questions",
    "occupational-therapy-exam-prep", "occupational-therapy-career-guide", "occupational-therapy-study-guide", "occupational-therapy-practice-questions",
    "surgical-technologist-practice-questions", "surgical-technologist-mock-exam", "surgical-technologist-study-guide",
    "surgical-technologist-certification-guide", "surgical-technologist-sterile-technique-guide", "surgical-instruments-identification-guide",
  ];
  for (const page of seoLandingPages) {
    urls.push(localizedUrl(base, `${ALLIED_PREFIX}/${page}`, "0.7", "monthly", locales, STATIC_CONTENT_DATE));
  }

  const ptaSeoGuidePages = [
    "low-back-pain-rehabilitation", "knee-osteoarthritis-rehabilitation", "stroke-rehabilitation",
    "acl-injury-rehabilitation", "rotator-cuff-rehabilitation", "parkinsons-disease-rehabilitation",
    "post-op-knee-replacement",
    "range-of-motion-exercises", "strengthening-exercises", "balance-training-exercises",
    "gait-training-exercises", "postural-correction-exercises", "core-stability-exercises",
    "major-muscle-groups", "joint-movements-kinesiology", "kinesiology-basics", "biomechanics-fundamentals",
    "heat-vs-cold-therapy", "ultrasound-therapy", "electrical-stimulation-therapy",
    "rehab-progression-protocols", "post-surgical-timelines",
    "how-to-pass-the-pta-exam", "top-50-pta-exam-questions", "common-rehab-mistakes-pta",
  ];
  for (const page of ptaSeoGuidePages) {
    urls.push(localizedUrl(base, `${ALLIED_PREFIX}/physiotherapy-assistant/guide/${page}`, "0.7", "monthly", locales, STATIC_CONTENT_DATE));
  }

  return urls;
}

export async function generateBloodBankCluster(): Promise<string[]> {
  const base = getSiteBase();
  const locales = getIndexableLocales();
  const urls: string[] = [];

  urls.push(localizedUrl(base, `${ALLIED_PREFIX}/mlt/blood-bank`, "0.8", "weekly", locales, STATIC_CONTENT_DATE));
  urls.push(localizedUrl(base, `${ALLIED_PREFIX}/mlt/blood-bank/cheat-sheet`, "0.7", "monthly", locales, STATIC_CONTENT_DATE));

  // Keep in sync with client/src/data/seo-blood-bank.ts seoBloodBankTopics slugs
  const bloodBankTopicSlugs = [
    "abo-blood-groups", "rh-factor", "crossmatching", "transfusion-reactions",
    "compatibility-chart", "hdfn", "massive-transfusion", "antibody-screening",
    "blood-component-therapy",
  ];
  for (const slug of bloodBankTopicSlugs) {
    urls.push(localizedUrl(base, `${ALLIED_PREFIX}/mlt/blood-bank/${slug}`, "0.7", "monthly", locales, STATIC_CONTENT_DATE));
  }

  return urls;
}

export async function generateAlliedPages(): Promise<string[]> {
  const careers = await generateAlliedCareers().catch(() => []);
  const exams = await generateAlliedExams().catch(() => []);
  const tools = await generateAlliedTools().catch(() => []);
  const seoLanding = await generateAlliedSeoLanding().catch(() => []);
  const bloodBank = await generateBloodBankCluster().catch(() => []);
  return [...careers, ...exams, ...tools, ...seoLanding, ...bloodBank];
}

export async function generateAlliedDatabaseContent(): Promise<string[]> {
  return generateAlliedTopics();
}
