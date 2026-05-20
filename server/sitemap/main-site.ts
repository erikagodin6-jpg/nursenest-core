import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../storage";
import { storage } from "../storage";
import { importClientDataAbsolute } from "../client-data-import";
import {
  getSiteBase, todayDate, toLastmod, simpleUrl, localizedUrl,
  getIndexableLocales, SITEMAP_SPLIT_LIMIT, splitIntoChunks,
  getSharedStaticRoutes, LEARN_REDIRECTS, COMPARE_PAGES, NURSING_QUESTION_TIERS,
  hasTimestampSuffix, isLowValueTranslatedPage
} from "./helpers";

const __dirnameMainSitemap =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export async function generateMainPages(): Promise<string[]> {
  const base = getSiteBase();
  const today = todayDate();
  const locales = getIndexableLocales();
  const urls: string[] = [];

  const sharedRoutes = getSharedStaticRoutes(today);
  for (const route of sharedRoutes) {
    const localeSet = route.multilingual ? locales : ["en"];
    urls.push(localizedUrl(base, route.path, route.priority, route.changefreq, localeSet, route.lastmod));
  }

  for (const slug of COMPARE_PAGES) {
    urls.push(localizedUrl(base, `/compare/${slug}`, "0.7", "monthly", locales, today));
  }

  for (const tier of NURSING_QUESTION_TIERS) {
    urls.push(localizedUrl(base, `/${tier}/questions`, "0.8", "weekly", locales, today));
  }

  return urls;
}

export async function generateMainLessons(): Promise<string[]> {
  const base = getSiteBase();
  const today = todayDate();
  const locales = getIndexableLocales();
  const urls: string[] = [];

  try {
    const result = await pool.query(
      `SELECT slug, updated_at, title, definition, pathophysiology,
              signs_symptoms, diagnostics, treatment, nursing_interventions
       FROM lessons WHERE status = 'published' ORDER BY updated_at DESC`
    );
    for (const lesson of result.rows) {
      if (hasTimestampSuffix(lesson.slug)) continue;
      if (isLessonThinForSitemap(lesson)) continue;
      urls.push(localizedUrl(base, `/lessons/${lesson.slug}`, "0.8", "weekly", locales, toLastmod(lesson.updated_at)));
    }
  } catch (e) {
    console.error("Sitemap: lessons query error:", e);
  }

  return urls;
}

function isLessonThinForSitemap(lesson: any): boolean {
  const title = (lesson.title || "").toLowerCase();
  const PLACEHOLDER_MARKERS = [/unable to complete/i, /placeholder/i, /\[draft\]/i, /test publish/i, /coming soon/i];
  if (PLACEHOLDER_MARKERS.some(p => p.test(title))) return true;

  const definition = lesson.definition || "";
  const pathophysiology = lesson.pathophysiology || "";
  const signs = Array.isArray(lesson.signs_symptoms) ? lesson.signs_symptoms : [];
  const diagnostics = Array.isArray(lesson.diagnostics) ? lesson.diagnostics : [];
  const treatment = Array.isArray(lesson.treatment) ? lesson.treatment : [];
  const interventions = Array.isArray(lesson.nursing_interventions) ? lesson.nursing_interventions : [];

  const textContent = [
    definition,
    pathophysiology,
    ...signs,
    ...diagnostics,
    ...treatment,
    ...interventions,
  ].join(" ");
  const wordCount = textContent.split(/\s+/).filter(Boolean).length;

  if (wordCount < 150) return true;

  const filledSections = [
    definition.length > 20,
    pathophysiology.length > 20,
    signs.length >= 2,
    diagnostics.length >= 1,
    treatment.length >= 1,
    interventions.length >= 1,
  ].filter(Boolean).length;

  if (filledSections < 2) return true;

  return false;
}

export async function generateMainQuestions(): Promise<string[]> {
  const base = getSiteBase();
  const today = todayDate();
  const locales = getIndexableLocales();
  const urls: string[] = [];

  try {
    const nursingTopicResult = await pool.query(
      `SELECT DISTINCT tier, topic FROM exam_questions WHERE status = 'published' AND topic IS NOT NULL AND topic != '' AND tier IN ('rpn', 'rn', 'np') ORDER BY topic`
    );
    const seenSlugs = new Set<string>();
    for (const row of nursingTopicResult.rows) {
      const slug = row.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      const key = `${row.tier}/${slug}`;
      if (slug && !seenSlugs.has(key)) {
        seenSlugs.add(key);
        urls.push(localizedUrl(base, `/${row.tier}/questions/${slug}`, "0.7", "weekly", locales, today));
      }
    }
  } catch (e) {
    console.error("Sitemap: nursing questions error:", e);
  }

  const previewSeen = new Set<string>();
  try {
    const previewTopicResult = await pool.query(
      `SELECT DISTINCT topic FROM exam_questions WHERE status = 'published' AND career_type = 'nursing' AND topic IS NOT NULL AND topic != '' ORDER BY topic`
    );
    for (const row of previewTopicResult.rows) {
      const slug = row.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      if (slug && !previewSeen.has(slug)) {
        previewSeen.add(slug);
        urls.push(localizedUrl(base, `/questions/${slug}`, "0.7", "weekly", locales, today));
        urls.push(localizedUrl(base, `/preview/${slug}`, "0.8", "weekly", locales, today));
      }
    }
  } catch (e) {
    console.error("Sitemap: question preview error:", e);
  }

  const specialtyPreviewSlugs = [
    "icu", "emergency-nursing", "nicu", "med-surg", "trauma-nursing",
    "mental-health", "orthopedic", "renal", "palliative-care",
  ];
  for (const slug of specialtyPreviewSlugs) {
    if (!previewSeen.has(slug)) {
      previewSeen.add(slug);
      urls.push(localizedUrl(base, `/preview/${slug}`, "0.8", "weekly", locales, today));
    }
  }

  const practiceQuestionCombos = [
    { tier: "rpn", systems: ["cardiovascular", "respiratory", "neurological", "gastrointestinal", "endocrine", "renal", "pharmacology", "hematology", "maternal", "pediatric", "mental-health", "musculoskeletal", "assessment"] },
    { tier: "rn", systems: ["cardiovascular", "respiratory", "neurological", "gastrointestinal", "endocrine", "renal", "pharmacology", "hematology", "maternal", "pediatric", "mental-health", "musculoskeletal", "assessment"] },
    { tier: "np", systems: ["cardiovascular", "respiratory", "neurological", "gastrointestinal", "endocrine", "renal", "pharmacology", "hematology", "assessment"] },
  ];
  for (const combo of practiceQuestionCombos) {
    for (const system of combo.systems) {
      urls.push(localizedUrl(base, `/practice-questions/${combo.tier}/${system}`, "0.8", "weekly", locales, today));
    }
  }

  return urls;
}

export async function generateMainFlashcards(): Promise<string[]> {
  const urls: string[] = [];

  // flashcards/deck/* pages are noindex per isNoindexPath, so they are excluded from the sitemap
  // to avoid conflicts between sitemap inclusion and noindex directives.
  // Only the /flashcards landing page (included in static routes) remains in the sitemap.

  return urls;
}

async function _generateMainFlashcardsLegacy(): Promise<string[]> {
  const base = getSiteBase();
  const today = todayDate();
  const locales = getIndexableLocales();
  const urls: string[] = [];

  try {
    const result = await pool.query(
      `SELECT slug, updated_at FROM flashcard_decks WHERE visibility = 'public' AND slug IS NOT NULL ORDER BY updated_at DESC LIMIT 5000`
    );
    for (const deck of result.rows) {
      if (deck.slug) {
        urls.push(localizedUrl(base, `/flashcards/deck/${deck.slug}`, "0.6", "weekly", locales, toLastmod(deck.updated_at)));
      }
    }
  } catch {}

  return urls;
}

export async function generateMainSpecialties(): Promise<string[]> {
  const base = getSiteBase();
  const today = todayDate();
  const enOnly = ["en"];
  const urls: string[] = [];

  try {
    const hubPages = await pool.query(
      `SELECT slug, page_type, last_updated FROM seo_pages WHERE is_public = true AND language_code = 'en' AND page_type IN ('certification', 'specialty', 'study-pathway') ORDER BY title`
    );
    const typeToPath: Record<string, string> = { certification: "certifications", specialty: "specialties", "study-pathway": "study-pathways" };
    for (const page of hubPages.rows) {
      const prefix = typeToPath[page.page_type] || page.page_type;
      urls.push(localizedUrl(base, `/${prefix}/${page.slug}`, "0.7", "monthly", enOnly, toLastmod(page.last_updated)));
    }
  } catch (e) {
    console.error("Sitemap: specialties error:", e);
  }

  return urls;
}

export async function generateMainGlossary(): Promise<string[]> {
  const base = getSiteBase();
  const today = todayDate();
  const locales = getIndexableLocales();
  const urls: string[] = [];

  const glossaryTermSlugs = [
    "auscultation","blood-pressure","bradycardia","tachycardia","cardiac-output","stroke-volume","preload","afterload",
    "myocardial-infarction","heart-failure","pulmonary-embolism","deep-vein-thrombosis","atrial-fibrillation","sinus-rhythm",
    "st-elevation","qrs-complex","p-wave","t-wave","ventricular-tachycardia","ventricular-fibrillation",
    "hemoglobin","hematocrit","potassium","sodium","calcium","magnesium","bun","creatinine","inr","troponin","abg",
    "metabolic-acidosis","metabolic-alkalosis","respiratory-acidosis","respiratory-alkalosis",
    "anaphylaxis","sepsis","septic-shock","diabetic-ketoacidosis","siadh","diabetes-insipidus",
    "pneumothorax","copd","asthma","stroke","increased-intracranial-pressure",
    "glasgow-coma-scale","apgar-score","braden-scale","pain-assessment","sbar","head-to-toe-assessment","vital-signs","pulse-oximetry",
    "epinephrine","warfarin","heparin","digoxin","ace-inhibitors","beta-blockers","nitroglycerin","insulin","morphine","naloxone",
    "dopamine","furosemide","amiodarone",
    "foley-catheter","nasogastric-tube","central-line","lumbar-puncture","tracheostomy","chest-tube","blood-transfusion",
    "wound-vac","mechanical-ventilation","endotracheal-intubation","iv-insertion","sterile-technique",
    "atelectasis","pleural-effusion","acute-kidney-injury","cirrhosis","pancreatitis",
    "hypothyroidism","hyperthyroidism","addison-disease","cushing-syndrome","compartment-syndrome",
    "malignant-hyperthermia","dic","tumor-lysis-syndrome","eclampsia","hellp-syndrome",
    "placenta-previa","abruptio-placentae","neonatal-respiratory-distress-syndrome",
    "delegation","nursing-process","informed-consent","alveoli","diaphragm",
    "sinoatrial-node","atrioventricular-node","nephron","glomerular-filtration-rate",
    "cerebral-perfusion-pressure","myelin-sheath","peritoneum","hemostasis",
    "wbc-count","platelet-count","albumin","lactate","prothrombin-time","aptt",
    "cardiogenic-shock","hypovolemic-shock","distributive-shock","infective-endocarditis",
    "aortic-dissection","peripheral-artery-disease","autonomic-dysreflexia","rhabdomyolysis",
    "guillain-barre-syndrome","meningitis","burns-classification","pacemaker","defibrillation",
    "cardioversion","arterial-blood-gas-sampling","incentive-spirometry","suctioning",
  ];
  for (const slug of glossaryTermSlugs) {
    urls.push(localizedUrl(base, `/glossary/${slug}`, "0.5", "monthly", locales, today));
  }

  return urls;
}

export async function generateMainMedicalAbbreviations(): Promise<string[]> {
  const base = getSiteBase();
  const today = todayDate();
  const locales = getIndexableLocales();
  const urls: string[] = [];

  const abbreviationSlugs = [
    "sbar","adpie","prn","bid","tid","stat","npo","i-o","vs","wnl",
    "sob","abg","bmp","cbc","ac","pc","hs","rom","adl","dnr",
    "dx","tx","hx","qd","spo2",
  ];
  for (const slug of abbreviationSlugs) {
    urls.push(localizedUrl(base, `/medical-abbreviations-for-nurses/${slug}`, "0.5", "monthly", locales, today));
  }

  return urls;
}

export async function generateMainNursingSkillChecklists(): Promise<string[]> {
  const base = getSiteBase();
  const today = todayDate();
  const locales = getIndexableLocales();
  const urls: string[] = [];

  const checklistSlugs = [
    "iv-insertion","central-line-care","wound-dressing","oxygen-therapy-setup","blood-transfusion",
  ];
  for (const slug of checklistSlugs) {
    urls.push(localizedUrl(base, `/nursing-skill-checklists/${slug}`, "0.6", "monthly", locales, today));
  }

  return urls;
}

export async function generateMainClinicalClarity(): Promise<string[]> {
  const base = getSiteBase();
  const today = todayDate();
  const locales = getIndexableLocales();
  const urls: string[] = [];

  const clarityTopics = [
    "why-does-hyperkalemia-cause-cardiac-arrest","why-does-dka-cause-fruity-breath",
    "why-do-opioids-cause-constipation","why-does-preeclampsia-cause-seizures",
    "why-does-heart-failure-cause-edema","why-does-anemia-cause-tachycardia",
    "why-does-pneumothorax-cause-tracheal-deviation","why-does-hypothyroidism-cause-weight-gain",
    "why-does-diabetes-cause-peripheral-neuropathy","why-does-immobility-cause-deep-vein-thrombosis",
    "why-does-hyperglycemia-cause-polyuria","why-does-copd-cause-barrel-chest",
    "why-does-pancreatitis-cause-hypocalcemia","why-does-cirrhosis-cause-ascites",
    "why-do-burns-cause-hyperkalemia","why-does-a-stroke-cause-dysphagia",
    "why-does-acute-kidney-injury-cause-metabolic-acidosis","why-does-myocardial-infarction-cause-cardiogenic-shock",
    "why-does-hypoxia-cause-restlessness-before-drowsiness","why-does-atrial-fibrillation-cause-stroke",
    "why-does-addisons-disease-cause-hyperpigmentation","why-does-spinal-cord-injury-cause-autonomic-dysreflexia",
    "why-does-blood-transfusion-cause-hyperkalemia","why-does-nephrotic-syndrome-cause-edema",
    "why-does-pyloric-stenosis-cause-metabolic-alkalosis","why-does-cushing-syndrome-cause-moon-face",
    "why-does-iron-deficiency-cause-pica","why-does-sickle-cell-crisis-cause-severe-pain",
    "why-does-magnesium-deficiency-worsen-hypokalemia","why-does-meningitis-cause-neck-stiffness",
    "why-does-thyroid-storm-cause-hyperthermia","why-does-calcium-affect-muscle-contraction",
    "why-does-massive-pe-cause-right-heart-failure","why-does-rhabdomyolysis-cause-acute-kidney-injury",
    "why-does-guillain-barre-cause-ascending-paralysis",
  ];
  for (const slug of clarityTopics) {
    urls.push(localizedUrl(base, `/clinical-clarity/${slug}`, "0.6", "monthly", locales, today));
  }

  return urls;
}

export async function generateMainBlog(): Promise<string[]> {
  const base = getSiteBase();
  const today = todayDate();
  const locales = getIndexableLocales();
  const enOnly = ["en"];
  const urls: string[] = [];

  try {
    const publishedContent = await storage.getPublishedContent();
    const blogTypes = ["blog", "blog-post", "article"];
    const blogPosts = publishedContent.filter((item) => {
      if (!blogTypes.includes(item.type || "") || !item.slug) return false;
      const contentLen = JSON.stringify(item.content || "").length;
      if (contentLen < 5000) return false;
      if (item.slug in LEARN_REDIRECTS) return false;
      if (hasTimestampSuffix(item.slug)) return false;
      return true;
    });
    for (const post of blogPosts) {
      const lastmod = post.updatedAt ? toLastmod(post.updatedAt) : (post.publishedAt ? toLastmod(post.publishedAt) : today);
      urls.push(localizedUrl(base, `/learn/${post.slug}`, "0.6", "weekly", enOnly, lastmod));
    }
  } catch {}

  try {
    const blogClusters = await pool.query(
      `SELECT pillar_slug, updated_at FROM blog_clusters WHERE status = 'published' ORDER BY updated_at DESC`
    );
    for (const cluster of blogClusters.rows) {
      urls.push(localizedUrl(base, `/blog/${cluster.pillar_slug}`, "0.8", "weekly", enOnly, toLastmod(cluster.updated_at)));
    }
  } catch {}

  return urls;
}

export async function generateMainMedicalImaging(): Promise<string[]> {
  const base = getSiteBase();
  const today = todayDate();
  const locales = getIndexableLocales();
  const urls: string[] = [];

  try {
    const seoPages = await pool.query(
      `SELECT slug, country, updated_at FROM imaging_seo_pages WHERE status = 'published' ORDER BY updated_at DESC LIMIT 5000`
    );
    for (const page of seoPages.rows) {
      urls.push(localizedUrl(base, `/medical-imaging/${page.country}/seo/${page.slug}`, "0.7", "weekly", locales, toLastmod(page.updated_at)));
    }
  } catch {}

  try {
    const blogArticles = await pool.query(
      `SELECT slug, updated_at FROM imaging_blog_articles WHERE status = 'published' ORDER BY updated_at DESC LIMIT 5000`
    );
    for (const article of blogArticles.rows) {
      urls.push(localizedUrl(base, `/medical-imaging/blog/${article.slug}`, "0.7", "weekly", locales, toLastmod(article.updated_at)));
    }
  } catch {}

  try {
    const posEntries = await pool.query(
      `SELECT slug, country, updated_at FROM imaging_positioning_entries WHERE status = 'published' ORDER BY updated_at DESC LIMIT 5000`
    );
    for (const entry of posEntries.rows) {
      urls.push(localizedUrl(base, `/medical-imaging/${entry.country}/positioning/${entry.slug}`, "0.7", "monthly", locales, toLastmod(entry.updated_at)));
    }
  } catch {}

  return urls;
}

export async function generateMainSeoContent(): Promise<string[]> {
  const base = getSiteBase();
  const today = todayDate();
  const enOnly = ["en"];
  const urls: string[] = [];

  try {
    const seoArticles = await pool.query(
      `SELECT slug, updated_at, type, site_context, career_track FROM seo_articles WHERE status = 'published' ORDER BY updated_at DESC`
    );
    for (const article of seoArticles.rows) {
      const priority = article.type === "pillar" ? "0.9" : "0.7";
      const articlePath = article.site_context === "allied" && article.career_track
        ? `/allied/${article.slug}`
        : `/seo/${article.slug}`;
      urls.push(localizedUrl(base, articlePath, priority, "weekly", enOnly, toLastmod(article.updated_at)));
    }
  } catch {}

  try {
    const practicePages = await pool.query(
      `SELECT slug, updated_at FROM practice_pages WHERE status = 'published' ORDER BY updated_at DESC`
    );
    for (const page of practicePages.rows) {
      urls.push(localizedUrl(base, `/practice/${page.slug}`, "0.7", "weekly", enOnly, toLastmod(page.updated_at)));
    }
  } catch {}

  try {
    const seoPages = await pool.query(
      `SELECT slug, language_code, page_type, last_updated FROM seo_pages WHERE is_public = true AND is_indexable = true ORDER BY last_updated DESC`
    );
    const highPriorityTypes = new Set(["pillar", "program-landing", "topic-hub", "long-form-guide"]);
    for (const page of seoPages.rows) {
      const priority = highPriorityTypes.has(page.page_type) ? "0.9" : "0.7";
      const pageTypePathMap: Record<string, string> = {
        "program-landing": "",
        "topic-hub": "",
        "long-form-guide": "study-guide",
        "long-tail": "study-guide",
      };
      const pathPrefix = pageTypePathMap[page.page_type];
      const pagePath = pathPrefix !== undefined
        ? (pathPrefix ? `/${pathPrefix}/${page.slug}` : `/${page.slug}`)
        : `/${page.language_code}/study-guide/${page.slug}`;
      urls.push(simpleUrl(`${base}${pagePath}`, toLastmod(page.last_updated), "weekly", priority));
    }
  } catch {}

  try {
    const contentLessons = await pool.query(
      `SELECT DISTINCT ON (slug) slug, updated_at FROM content_items WHERE type = 'lesson' AND status = 'published' ORDER BY slug, updated_at DESC`
    );
    const seenSlugs = new Set<string>();
    for (const lesson of contentLessons.rows) {
      if (seenSlugs.has(lesson.slug)) continue;
      seenSlugs.add(lesson.slug);
      urls.push(localizedUrl(base, `/lessons/${lesson.slug}`, "0.8", "weekly", enOnly, toLastmod(lesson.updated_at)));
    }
  } catch {}

  return urls;
}

export async function generateMainTopics(): Promise<string[]> {
  const base = getSiteBase();
  const today = todayDate();
  const locales = getIndexableLocales();
  const urls: string[] = [];

  try {
    const { internalLinkMap } = await importClientDataAbsolute(
      path.resolve(__dirnameMainSitemap, "../../client/src/data/internal-links"),
    );
    const topicSlugs = Object.keys(internalLinkMap);
    for (const slug of topicSlugs) {
      urls.push(localizedUrl(base, `/topics/${slug}`, "0.7", "monthly", locales, today));
    }
  } catch {}

  try {
    const { seoConditions: condData } = await importClientDataAbsolute(
      path.resolve(__dirnameMainSitemap, "../../client/src/data/seo-conditions"),
    );
    for (const c of condData) {
      urls.push(localizedUrl(base, `/conditions/${c.slug}`, "0.8", "monthly", locales, today));
    }
  } catch {
    const seoConditions = ["hypertension", "diabetes", "asthma", "copd", "heart-failure", "sepsis", "pneumonia"];
    for (const c of seoConditions) {
      urls.push(localizedUrl(base, `/conditions/${c}`, "0.8", "monthly", locales, today));
    }
  }

  try {
    const { seoMedications: medData } = await importClientDataAbsolute(
      path.resolve(__dirnameMainSitemap, "../../client/src/data/seo-medications"),
    );
    for (const m of medData) {
      urls.push(localizedUrl(base, `/medications/${m.slug}`, "0.8", "monthly", locales, today));
    }
  } catch {
    const seoMedications = ["metformin", "lisinopril", "warfarin", "insulin", "amiodarone"];
    for (const m of seoMedications) {
      urls.push(localizedUrl(base, `/medications/${m}`, "0.8", "monthly", locales, today));
    }
  }

  try {
    const { seoLabValues: labData } = await importClientDataAbsolute(
      path.resolve(__dirnameMainSitemap, "../../client/src/data/seo-lab-values"),
    );
    for (const l of labData) {
      urls.push(localizedUrl(base, `/lab-values/${l.slug}`, "0.8", "monthly", locales, today));
    }
  } catch {
    const seoLabValues = ["sodium", "potassium", "troponin", "creatinine", "inr", "calcium", "magnesium", "bicarbonate", "bun", "hemoglobin", "white-blood-cells"];
    for (const l of seoLabValues) {
      urls.push(localizedUrl(base, `/lab-values/${l}`, "0.8", "monthly", locales, today));
    }
  }

  const seoClinicalComparisons = [
    "dka-vs-hhs", "crohns-vs-ulcerative-colitis", "stable-vs-unstable-angina",
    "type-1-vs-type-2-diabetes", "left-vs-right-heart-failure", "dvt-vs-pe",
    "addisons-vs-cushings", "hypothyroid-vs-hyperthyroid",
    "ulcerative-colitis-vs-crohns-disease", "preeclampsia-vs-eclampsia",
  ];
  for (const c of seoClinicalComparisons) {
    urls.push(localizedUrl(base, `/clinical-comparisons/${c}`, "0.8", "monthly", locales, today));
  }

  const seoSymptomAssessments = [
    "chest-pain", "shortness-of-breath", "hyperkalemia", "altered-level-of-consciousness",
    "abdominal-pain", "fever", "edema", "tachycardia", "hypotension", "dyspnea",
  ];
  for (const s of seoSymptomAssessments) {
    urls.push(localizedUrl(base, `/symptoms/${s}`, "0.8", "monthly", locales, today));
  }

  const seoHerbalPages = [
    "herbal-supplements-that-interact-with-medications",
    "herbal-supplements-nurses-should-ask-patients-about",
    "common-herbal-supplement-drug-interactions",
    "patient-teaching-about-herbal-supplements",
    "herbal-supplements-that-increase-bleeding-risk",
  ];
  urls.push(localizedUrl(base, "/herbal-supplements", "0.8", "monthly", locales, today));
  for (const h of seoHerbalPages) {
    urls.push(localizedUrl(base, `/herbal-supplements/${h}`, "0.8", "monthly", locales, today));
  }

  const rexPnCategoryPages = ["practice-questions", "fundamentals", "pharmacology", "safety-and-infection-control", "clinical-judgment", "exam-tips", "study-plan"];
  for (const slug of rexPnCategoryPages) {
    urls.push(localizedUrl(base, `/rex-pn/${slug}`, "0.8", "monthly", locales, today));
  }

  const rexPnConditionPages = ["heart-failure", "diabetes-dka-hhs", "copd", "pneumonia", "sepsis", "hypertension", "mi-acs", "stroke"];
  for (const slug of rexPnConditionPages) {
    urls.push(localizedUrl(base, `/rex-pn/conditions/${slug}`, "0.8", "monthly", locales, today));
  }

  const rexPnMedicationPages = ["furosemide"];
  for (const slug of rexPnMedicationPages) {
    urls.push(localizedUrl(base, `/rex-pn/medications/${slug}`, "0.8", "monthly", locales, today));
  }

  const rexPnLabValuePages = ["potassium", "sodium", "abgs"];
  for (const slug of rexPnLabValuePages) {
    urls.push(localizedUrl(base, `/rex-pn/lab-values/${slug}`, "0.8", "monthly", locales, today));
  }

  const rexPnComparisonPages = ["dka-vs-hhs", "crohns-vs-uc", "stable-vs-unstable-angina"];
  for (const slug of rexPnComparisonPages) {
    urls.push(localizedUrl(base, `/rex-pn/compare/${slug}`, "0.7", "monthly", locales, today));
  }

  const rexPnStrategyPages = ["how-to-pass-rex-pn", "pharmacology-fundamentals"];
  for (const slug of rexPnStrategyPages) {
    urls.push(localizedUrl(base, `/rex-pn/strategy/${slug}`, "0.7", "monthly", locales, today));
  }

  const nclexRnCategoryPages = ["practice-questions", "ngn", "prioritization-and-delegation", "pharmacology", "adult-health", "maternal-child", "mental-health", "exam-strategy", "top-conditions", "lab-values", "medications"];
  for (const slug of nclexRnCategoryPages) {
    urls.push(localizedUrl(base, `/nclex-rn/${slug}`, "0.8", "monthly", locales, today));
  }

  const nclexRnConditionPages = ["heart-failure", "diabetes-dka-hhs", "copd", "pneumonia", "sepsis", "hypertension", "mi-acs", "stroke"];
  for (const slug of nclexRnConditionPages) {
    urls.push(localizedUrl(base, `/nclex-rn/conditions/${slug}`, "0.8", "monthly", locales, today));
  }

  const nclexRnMedicationPages = ["insulin-types", "furosemide", "warfarin", "heparin", "metformin", "lisinopril", "metoprolol", "digoxin"];
  for (const slug of nclexRnMedicationPages) {
    urls.push(localizedUrl(base, `/nclex-rn/medications/${slug}`, "0.8", "monthly", locales, today));
  }

  const nclexRnLabValuePages = ["potassium", "sodium", "abgs", "bnp", "troponin", "a1c"];
  for (const slug of nclexRnLabValuePages) {
    urls.push(localizedUrl(base, `/nclex-rn/lab-values/${slug}`, "0.8", "monthly", locales, today));
  }

  const nclexRnComparisonPages = ["dka-vs-hhs", "viral-vs-bacterial-pneumonia", "iron-deficiency-vs-b12-deficiency", "stable-vs-unstable-angina"];
  for (const slug of nclexRnComparisonPages) {
    urls.push(localizedUrl(base, `/nclex-rn/compare/${slug}`, "0.7", "monthly", locales, today));
  }

  const nclexRnStrategyPages = ["how-to-study-for-nclex-rn", "prioritization-tips", "clinical-judgment-framework", "ngn-question-strategy"];
  for (const slug of nclexRnStrategyPages) {
    urls.push(localizedUrl(base, `/nclex-rn/strategy/${slug}`, "0.7", "monthly", locales, today));
  }

  const npExamCategoryPages = ["practice-questions", "differential-diagnosis", "primary-care", "pharmacology", "diagnostics", "chronic-disease-management", "case-studies", "exam-strategy", "top-conditions", "lab-values", "medications"];
  for (const slug of npExamCategoryPages) {
    urls.push(localizedUrl(base, `/np-exam/${slug}`, "0.8", "monthly", locales, today));
  }

  const npExamConditionPages = ["hypertension", "type-2-diabetes", "heart-failure", "copd", "asthma", "hypothyroidism", "hyperthyroidism", "depression", "anxiety", "atrial-fibrillation", "community-acquired-pneumonia", "uti-complicated", "chronic-kidney-disease", "gerd", "osteoarthritis", "iron-deficiency-anemia", "stroke-tia", "acute-coronary-syndrome", "diabetes-dka-hhs", "pneumonia", "sepsis", "mi-acs", "stroke", "thyroid-disorders"];
  for (const slug of npExamConditionPages) {
    urls.push(localizedUrl(base, `/np-exam/conditions/${slug}`, "0.8", "monthly", locales, today));
  }

  const npExamMedicationPages = ["ace-inhibitors", "beta-blockers", "statins", "ssris", "metformin", "levothyroxine", "ppis", "inhaled-corticosteroids", "thiazide-diuretics", "anticoagulants-doacs", "sglt2-inhibitors", "antibiotics-first-line", "arbs", "calcium-channel-blockers", "glp1-agonists", "insulin", "antibiotics-overview"];
  for (const slug of npExamMedicationPages) {
    urls.push(localizedUrl(base, `/np-exam/medications/${slug}`, "0.8", "monthly", locales, today));
  }

  const npExamLabValuePages = ["cbc-differential", "cmp", "hba1c", "tsh-free-t4", "lipid-panel", "troponin", "bnp-nt-probnp", "urinalysis", "potassium", "sodium", "abgs", "a1c", "tsh-t3-t4", "cbc-interpretation"];
  for (const slug of npExamLabValuePages) {
    urls.push(localizedUrl(base, `/np-exam/lab-values/${slug}`, "0.8", "monthly", locales, today));
  }

  const npExamComparisonPages = ["aanp-vs-ancc", "stable-angina-vs-acs", "hypothyroidism-vs-hyperthyroidism", "gerd-vs-pud", "depression-vs-anxiety-pharmacotherapy", "ckd-stages-management", "dka-vs-hhs", "crohns-vs-uc", "stable-vs-unstable-angina", "viral-vs-bacterial-pneumonia", "hypothyroid-vs-hyperthyroid"];
  for (const slug of npExamComparisonPages) {
    urls.push(localizedUrl(base, `/np-exam/compare/${slug}`, "0.7", "monthly", locales, today));
  }

  const npExamStrategyPages = ["best-np-exam-study-strategy", "diagnostic-reasoning-framework", "prescribing-pearls-review", "soap-note-approach", "differential-diagnosis-question-strategy", "np-exam-study-strategy", "differential-diagnosis-approach", "soap-notes-methodology", "case-study-approach"];
  for (const slug of npExamStrategyPages) {
    urls.push(localizedUrl(base, `/np-exam/strategy/${slug}`, "0.7", "monthly", locales, today));
  }

  const npExamCaseStudyPages = ["differential-diagnosis-cases", "primary-care-scenarios", "chronic-disease-cases"];
  for (const slug of npExamCaseStudyPages) {
    urls.push(localizedUrl(base, `/np-exam/case-studies/${slug}`, "0.7", "monthly", locales, today));
  }

  return urls;
}

export async function generateExamBlueprintSeoPages(): Promise<string[]> {
  const base = getSiteBase();
  const today = todayDate();
  const locales = getIndexableLocales();
  const urls: string[] = [];

  const blueprintRoutes = [
    { path: "/nclex/cardiac-questions", priority: "0.8" },
    { path: "/nclex/pharmacology-practice", priority: "0.8" },
    { path: "/nclex/respiratory-questions", priority: "0.8" },
    { path: "/nclex/mental-health-questions", priority: "0.8" },
    { path: "/rex-pn/pharmacology-practice", priority: "0.8" },
    { path: "/rex-pn/clinical-practice-questions", priority: "0.8" },
    { path: "/rex-pn/professional-practice-questions", priority: "0.8" },
    { path: "/np-exam/primary-care-questions", priority: "0.8" },
    { path: "/np-exam/pharmacology-advanced", priority: "0.8" },
    { path: "/np-exam/differential-diagnosis", priority: "0.8" },
  ];

  for (const route of blueprintRoutes) {
    urls.push(localizedUrl(base, route.path, route.priority, "weekly", locales, today));
  }

  return urls;
}

export async function generateSeoContentPages(): Promise<string[]> {
  const base = getSiteBase();
  const today = todayDate();
  const urls: string[] = [];
  const includedSlugs = new Set<string>();

  try {
    const { getSeoContentSlugs } = await import("../seo-content-pages");
    const slugs = getSeoContentSlugs();
    for (const slug of slugs) {
      includedSlugs.add(slug);
      urls.push(simpleUrl(`${base}/${slug}`, today, "weekly", "0.7"));
    }
  } catch {}

  try {
    const result = await pool.query(
      "SELECT slug, updated_at FROM programmatic_pages WHERE source_content_type = 'seo-landing' AND status = 'published' ORDER BY slug"
    );
    for (const row of result.rows) {
      if (!includedSlugs.has(row.slug)) {
        includedSlugs.add(row.slug);
        urls.push(simpleUrl(`${base}/${row.slug}`, toLastmod(row.updated_at), "weekly", "0.7"));
      }
    }
  } catch {}

  return urls;
}

export async function generateMainProgrammatic(): Promise<string[]> {
  const base = getSiteBase();
  const today = todayDate();
  const urls: string[] = [];

  try {
    const locales = getIndexableLocales();
    const hubResult = await pool.query(
      "SELECT slug, updated_at FROM seo_hub_pages WHERE status = 'published' ORDER BY slug"
    );
    for (const row of hubResult.rows) {
      urls.push(localizedUrl(base, `/${row.slug}`, "0.7", "weekly", locales, toLastmod(row.updated_at)));
    }
  } catch (e) {
    console.error("Sitemap: seo_hub_pages query error:", e);
  }

  const programmaticSitemapTypes: Record<string, string> = {
    "study-guide": "study-guide",
    "exam-tips": "exam-tips",
    "clinical-scenarios": "clinical-scenarios",
    "practice-questions": "practice-questions",
    "question-detail": "question-detail",
    "flashcard-detail": "flashcard-detail",
  };

  for (const [_key, pageType] of Object.entries(programmaticSitemapTypes)) {
    try {
      const result = await pool.query(
        "SELECT slug, updated_at FROM programmatic_pages WHERE page_type = $1 AND status = 'published' AND source_content_type != 'seo-landing' ORDER BY slug",
        [pageType]
      );
      for (const row of result.rows) {
        urls.push(simpleUrl(`${base}/${row.slug}`, toLastmod(row.updated_at), "weekly", "0.6"));
      }
    } catch {}
  }

  return urls;
}

const CLINICAL_SEO_ROUTE_MAP: Record<string, (slug: string) => string> = {
  condition: (slug) => `/nclex/clinical/${slug}`,
  symptom: (slug) => `/symptoms/${slug}`,
  medication: (slug) => `/meds/${slug}`,
  "lab-value": (slug) => `/labs/${slug}`,
  comparison: (slug) => `/clinical-compare/${slug}`,
};

export async function generateClinicalSeoPages(): Promise<string[]> {
  const base = getSiteBase();
  const today = todayDate();
  const locales = getIndexableLocales();
  const urls: string[] = [];

  try {
    const result = await pool.query(
      `SELECT slug, page_type, body_system, updated_at FROM clinical_seo_pages WHERE status = 'published' ORDER BY updated_at DESC`
    );
    for (const row of result.rows) {
      const routeFn = CLINICAL_SEO_ROUTE_MAP[row.page_type];
      if (!routeFn) continue;
      let path = routeFn(row.slug);
      if (row.page_type === "condition" && row.body_system) {
        const system = row.body_system.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        path = `/nclex/${system}/${row.slug}`;
      }
      urls.push(localizedUrl(base, path, "0.8", "weekly", locales, toLastmod(row.updated_at) || today));
    }
  } catch (e) {
    console.error("Sitemap: clinical SEO pages error:", e);
  }

  return urls;
}
