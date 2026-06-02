import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./storage";
import { importClientDataAbsolute } from "./client-data-import";

const __dirnameContentRel =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export interface RelatedContentItem {
  type: "lesson" | "blog" | "flashcard" | "exam-question" | "clinical-clarity" | "glossary" | "medication" | "lab-value" | "condition";
  title: string;
  slug: string;
  href: string;
  description: string;
  bodySystem?: string;
  category?: string;
  updatedAt?: string;
}

interface ContentContext {
  slug: string;
  contentType: "lesson" | "blog" | "flashcard-deck" | "exam-prep" | "allied-article" | "new-grad-guide" | "medication" | "lab-value" | "condition" | "comparison" | "specialty-hub";
  title?: string;
  bodySystem?: string;
  category?: string;
  tags?: string[];
  profession?: string;
  tier?: string;
}

const CLINICAL_SYNONYMS: Record<string, string[]> = {
  "mi": ["myocardial infarction", "heart attack", "stemi", "nstemi"],
  "myocardial infarction": ["mi", "heart attack", "stemi", "nstemi"],
  "heart attack": ["mi", "myocardial infarction"],
  "htn": ["hypertension", "high blood pressure"],
  "hypertension": ["htn", "high blood pressure"],
  "chf": ["congestive heart failure", "heart failure", "hf"],
  "heart failure": ["chf", "congestive heart failure", "hf"],
  "copd": ["chronic obstructive pulmonary disease"],
  "chronic obstructive pulmonary disease": ["copd"],
  "dm": ["diabetes mellitus", "diabetes", "type 2 diabetes"],
  "diabetes": ["dm", "diabetes mellitus", "type 2 diabetes", "t2dm"],
  "dka": ["diabetic ketoacidosis"],
  "diabetic ketoacidosis": ["dka"],
  "aki": ["acute kidney injury", "acute renal failure", "arf"],
  "acute kidney injury": ["aki", "acute renal failure", "arf"],
  "ckd": ["chronic kidney disease", "chronic renal failure"],
  "chronic kidney disease": ["ckd", "chronic renal failure"],
  "dvt": ["deep vein thrombosis"],
  "deep vein thrombosis": ["dvt"],
  "pe": ["pulmonary embolism"],
  "pulmonary embolism": ["pe"],
  "afib": ["atrial fibrillation", "a-fib", "af"],
  "atrial fibrillation": ["afib", "a-fib", "af"],
  "cva": ["cerebrovascular accident", "stroke"],
  "stroke": ["cva", "cerebrovascular accident"],
  "siadh": ["syndrome of inappropriate antidiuretic hormone"],
  "bun": ["blood urea nitrogen"],
  "inr": ["international normalized ratio", "prothrombin time"],
  "pt": ["prothrombin time", "inr"],
  "aptt": ["activated partial thromboplastin time", "ptt"],
  "cbc": ["complete blood count"],
  "abg": ["arterial blood gas"],
  "ace inhibitor": ["acei", "angiotensin converting enzyme inhibitor", "lisinopril", "enalapril", "ramipril"],
  "arb": ["angiotensin receptor blocker", "losartan", "valsartan"],
  "nsaid": ["nonsteroidal anti inflammatory", "ibuprofen", "naproxen"],
  "gfr": ["glomerular filtration rate", "egfr"],
  "bp": ["blood pressure"],
  "hr": ["heart rate"],
  "rr": ["respiratory rate"],
  "wbc": ["white blood cell", "white blood cells", "leukocyte"],
  "rbc": ["red blood cell", "red blood cells", "erythrocyte"],
  "hgb": ["hemoglobin"],
  "hemoglobin": ["hgb", "hb"],
  "hct": ["hematocrit"],
  "hematocrit": ["hct"],
  "potassium": ["k+", "k"],
  "sodium": ["na+", "na"],
  "calcium": ["ca2+", "ca"],
  "magnesium": ["mg2+", "mg"],
};

const BODY_SYSTEM_MAP: Record<string, string[]> = {
  cardiovascular: ["cardiac", "heart", "vascular", "circulatory", "coronary", "arrhythmia", "hypertension", "hypotension"],
  respiratory: ["pulmonary", "lung", "airway", "breathing", "ventilation", "oxygenation"],
  renal: ["kidney", "urinary", "nephro", "dialysis", "urine"],
  endocrine: ["diabetes", "thyroid", "adrenal", "pituitary", "hormone", "insulin", "glucose"],
  neurological: ["neuro", "brain", "nervous", "spinal", "cerebral", "seizure", "stroke"],
  gastrointestinal: ["gi", "digestive", "liver", "hepatic", "pancreas", "bowel", "stomach", "intestinal"],
  hematology: ["blood", "coagulation", "anemia", "platelet", "clotting", "transfusion"],
  musculoskeletal: ["bone", "joint", "muscle", "orthopedic", "fracture"],
  integumentary: ["skin", "wound", "burn", "derma"],
  immune: ["infection", "immunity", "autoimmune", "sepsis", "inflammatory"],
};

function normalizeForMatching(text: string): string {
  return (text || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function extractKeyTerms(text: string): string[] {
  const normalized = normalizeForMatching(text);
  const stopWords = new Set(["the", "a", "an", "and", "or", "in", "on", "to", "for", "of", "with", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "must", "shall", "can", "need", "dare", "ought", "used", "nursing", "nurse", "patient", "care", "health", "clinical", "guide", "overview", "introduction"]);
  return normalized.split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
}

function expandWithSynonyms(terms: string[]): string[] {
  const expanded = new Set(terms);
  for (const term of terms) {
    const synonyms = CLINICAL_SYNONYMS[term];
    if (synonyms) {
      for (const syn of synonyms) {
        expanded.add(syn);
      }
    }
    for (const [key, syns] of Object.entries(CLINICAL_SYNONYMS)) {
      if (syns.includes(term) && !expanded.has(key)) {
        expanded.add(key);
      }
    }
  }
  return Array.from(expanded);
}

function resolveBodySystem(bodySystem: string, keyTerms: string[]): string[] {
  const systems: string[] = [];
  if (bodySystem) systems.push(bodySystem);
  for (const [system, aliases] of Object.entries(BODY_SYSTEM_MAP)) {
    if (bodySystem && (bodySystem.includes(system) || system.includes(bodySystem) || aliases.some(a => bodySystem.includes(a)))) {
      if (!systems.includes(system)) systems.push(system);
    }
    if (keyTerms.some(t => system.includes(t) || aliases.some(a => a.includes(t) || t.includes(a)))) {
      if (!systems.includes(system)) systems.push(system);
    }
  }
  return systems;
}

let _medicationCache: any[] | null = null;
let _labValueCache: any[] | null = null;
let _conditionCache: any[] | null = null;

async function getMedications(): Promise<any[]> {
  if (_medicationCache) return _medicationCache;
  try {
    const { seoMedications } = await importClientDataAbsolute(
      path.resolve(__dirnameContentRel, "../client/src/data/seo-medications"),
    );
    const list = seoMedications ?? [];
    _medicationCache = list;
    return list;
  } catch {
    return [];
  }
}

async function getLabValues(): Promise<any[]> {
  if (_labValueCache) return _labValueCache;
  try {
    const { seoLabValues } = await importClientDataAbsolute(
      path.resolve(__dirnameContentRel, "../client/src/data/seo-lab-values"),
    );
    const list = seoLabValues ?? [];
    _labValueCache = list;
    return list;
  } catch {
    return [];
  }
}

async function getConditions(): Promise<any[]> {
  if (_conditionCache) return _conditionCache;
  try {
    const { seoConditions } = await importClientDataAbsolute(
      path.resolve(__dirnameContentRel, "../client/src/data/seo-conditions"),
    );
    const list = seoConditions ?? [];
    _conditionCache = list;
    return list;
  } catch {
    return [];
  }
}

export async function findRelatedContent(
  context: ContentContext,
  limit: number = 12
): Promise<RelatedContentItem[]> {
  const results: RelatedContentItem[] = [];
  const seenSlugs = new Set<string>();
  seenSlugs.add(context.slug);

  const rawKeyTerms = [
    ...extractKeyTerms(context.title || ""),
    ...extractKeyTerms(context.category || ""),
    ...(context.tags || []).map(t => normalizeForMatching(t)).filter(Boolean),
  ];
  if (context.profession) {
    const profTerm = normalizeForMatching(context.profession);
    if (profTerm && !rawKeyTerms.includes(profTerm)) rawKeyTerms.push(profTerm);
  }
  const keyTerms = expandWithSynonyms(rawKeyTerms);
  const bodySystem = normalizeForMatching(context.bodySystem || "");
  const bodySystems = resolveBodySystem(bodySystem, keyTerms);

  if (context.contentType !== "lesson") {
    try {
      const lessonResults = await findRelatedLessons(context, bodySystem, keyTerms, seenSlugs, Math.min(4, limit));
      results.push(...lessonResults);
    } catch (e) {
      console.error("Related content: lessons query error:", e);
    }
  }

  if (context.contentType === "lesson") {
    try {
      const peerLessons = await findRelatedLessons(context, bodySystem, keyTerms, seenSlugs, Math.min(3, limit));
      results.push(...peerLessons);
    } catch (e) {
      console.error("Related content: peer lessons query error:", e);
    }
  }

  if (context.contentType !== "medication") {
    try {
      const medResults = await findRelatedMedications(bodySystem, bodySystems, keyTerms, seenSlugs, Math.min(2, limit));
      results.push(...medResults);
    } catch (e) {
      console.error("Related content: medications error:", e);
    }
  }

  if (context.contentType !== "lab-value") {
    try {
      const labResults = await findRelatedLabValues(bodySystem, bodySystems, keyTerms, seenSlugs, Math.min(2, limit));
      results.push(...labResults);
    } catch (e) {
      console.error("Related content: lab values error:", e);
    }
  }

  if (context.contentType !== "condition") {
    try {
      const condResults = await findRelatedConditions(bodySystem, bodySystems, keyTerms, seenSlugs, Math.min(2, limit));
      results.push(...condResults);
    } catch (e) {
      console.error("Related content: conditions error:", e);
    }
  }

  if (context.contentType === "medication") {
    try {
      const condResults = await findRelatedConditions(bodySystem, bodySystems, keyTerms, seenSlugs, Math.min(3, limit));
      results.push(...condResults);
      const labResults = await findRelatedLabValues(bodySystem, bodySystems, keyTerms, seenSlugs, Math.min(2, limit));
      results.push(...labResults);
    } catch (e) {
      console.error("Related content: medication cross-type error:", e);
    }
  }

  if (context.contentType === "lab-value") {
    try {
      const condResults = await findRelatedConditions(bodySystem, bodySystems, keyTerms, seenSlugs, Math.min(2, limit));
      results.push(...condResults);
      const medResults = await findRelatedMedications(bodySystem, bodySystems, keyTerms, seenSlugs, Math.min(2, limit));
      results.push(...medResults);
    } catch (e) {
      console.error("Related content: lab-value cross-type error:", e);
    }
  }

  if (context.contentType === "condition") {
    try {
      const medResults = await findRelatedMedications(bodySystem, bodySystems, keyTerms, seenSlugs, Math.min(3, limit));
      results.push(...medResults);
      const labResults = await findRelatedLabValues(bodySystem, bodySystems, keyTerms, seenSlugs, Math.min(2, limit));
      results.push(...labResults);
      const peerConds = await findRelatedConditions(bodySystem, bodySystems, keyTerms, seenSlugs, Math.min(2, limit));
      results.push(...peerConds);
    } catch (e) {
      console.error("Related content: condition cross-type error:", e);
    }
  }

  if (context.contentType !== "blog") {
    try {
      const blogResults = await findRelatedBlog(context, bodySystem, keyTerms, seenSlugs, Math.min(3, limit));
      results.push(...blogResults);
    } catch (e) {
      console.error("Related content: blog query error:", e);
    }
  }

  if (context.contentType !== "flashcard-deck") {
    try {
      const flashcardResults = await findRelatedFlashcards(context, bodySystem, keyTerms, seenSlugs, Math.min(2, limit));
      results.push(...flashcardResults);
    } catch (e) {
      console.error("Related content: flashcards query error:", e);
    }
  }

  if (context.contentType !== "exam-prep") {
    try {
      const examResults = await findRelatedExamContent(context, bodySystem, keyTerms, seenSlugs, Math.min(2, limit));
      results.push(...examResults);
    } catch (e) {
      console.error("Related content: exam query error:", e);
    }
  }

  try {
    const clarityResults = await findRelatedClinicalClarity(bodySystem, keyTerms, seenSlugs, Math.min(2, limit));
    results.push(...clarityResults);
  } catch (e) {
    console.error("Related content: clinical clarity error:", e);
  }

  try {
    const glossaryResults = await findRelatedGlossary(bodySystem, keyTerms, seenSlugs, Math.min(2, limit));
    results.push(...glossaryResults);
  } catch (e) {
    console.error("Related content: glossary error:", e);
  }

  try {
    const newGradResults = findRelatedNewGradContent(context, keyTerms, seenSlugs, Math.min(2, limit));
    results.push(...newGradResults);
  } catch (e) {
    console.error("Related content: new grad error:", e);
  }

  return results.slice(0, limit);
}

export async function findYouMayAlsoLike(
  context: ContentContext,
  limit: number = 5
): Promise<RelatedContentItem[]> {
  const results: RelatedContentItem[] = [];
  const seenSlugs = new Set<string>();
  seenSlugs.add(context.slug);

  const rawKeyTerms = [
    ...extractKeyTerms(context.title || ""),
    ...extractKeyTerms(context.category || ""),
    ...(context.tags || []).map(t => normalizeForMatching(t)).filter(Boolean),
  ];
  const keyTerms = expandWithSynonyms(rawKeyTerms);
  const bodySystem = normalizeForMatching(context.bodySystem || "");
  const bodySystems = resolveBodySystem(bodySystem, keyTerms);

  const contentType = context.contentType;

  if (contentType === "medication") {
    const conds = await findRelatedConditions(bodySystem, bodySystems, keyTerms, seenSlugs, 2);
    results.push(...conds);
    const labs = await findRelatedLabValues(bodySystem, bodySystems, keyTerms, seenSlugs, 1);
    results.push(...labs);
    const lessons = await findRelatedLessons(context, bodySystem, keyTerms, seenSlugs, 1);
    results.push(...lessons);
    const exams = await findRelatedExamContent(context, bodySystem, keyTerms, seenSlugs, 1);
    results.push(...exams);
  } else if (contentType === "lab-value") {
    const conds = await findRelatedConditions(bodySystem, bodySystems, keyTerms, seenSlugs, 2);
    results.push(...conds);
    const meds = await findRelatedMedications(bodySystem, bodySystems, keyTerms, seenSlugs, 1);
    results.push(...meds);
    const lessons = await findRelatedLessons(context, bodySystem, keyTerms, seenSlugs, 1);
    results.push(...lessons);
    const exams = await findRelatedExamContent(context, bodySystem, keyTerms, seenSlugs, 1);
    results.push(...exams);
  } else if (contentType === "condition") {
    const meds = await findRelatedMedications(bodySystem, bodySystems, keyTerms, seenSlugs, 2);
    results.push(...meds);
    const labs = await findRelatedLabValues(bodySystem, bodySystems, keyTerms, seenSlugs, 1);
    results.push(...labs);
    const lessons = await findRelatedLessons(context, bodySystem, keyTerms, seenSlugs, 1);
    results.push(...lessons);
    const exams = await findRelatedExamContent(context, bodySystem, keyTerms, seenSlugs, 1);
    results.push(...exams);
  } else {
    const meds = await findRelatedMedications(bodySystem, bodySystems, keyTerms, seenSlugs, 1);
    results.push(...meds);
    const labs = await findRelatedLabValues(bodySystem, bodySystems, keyTerms, seenSlugs, 1);
    results.push(...labs);
    const conds = await findRelatedConditions(bodySystem, bodySystems, keyTerms, seenSlugs, 1);
    results.push(...conds);
    const lessons = await findRelatedLessons(context, bodySystem, keyTerms, seenSlugs, 1);
    results.push(...lessons);
    const exams = await findRelatedExamContent(context, bodySystem, keyTerms, seenSlugs, 1);
    results.push(...exams);
  }

  return results.slice(0, limit);
}

async function findRelatedMedications(
  bodySystem: string,
  bodySystems: string[],
  keyTerms: string[],
  seenSlugs: Set<string>,
  limit: number
): Promise<RelatedContentItem[]> {
  const items: RelatedContentItem[] = [];
  const medications = await getMedications();

  for (const med of medications) {
    if (items.length >= limit) break;
    if (seenSlugs.has(med.slug)) continue;

    const medNorm = normalizeForMatching(med.genericName);
    const medClass = normalizeForMatching(med.drugClass);
    const medIndications = (med.indications || []).map((i: string) => normalizeForMatching(i));
    const medKeywords = (med.targetKeywords || []).map((k: string) => normalizeForMatching(k));
    const brandNorms = (med.brandNames || []).map((b: string) => normalizeForMatching(b));

    let score = 0;
    for (const term of keyTerms) {
      if (medNorm.includes(term) || term.includes(medNorm)) score += 5;
      if (brandNorms.some((b: string) => b.includes(term) || term.includes(b))) score += 4;
      if (medClass.includes(term)) score += 3;
      if (medIndications.some((i: string) => i.includes(term))) score += 2;
      if (medKeywords.some((k: string) => k.includes(term))) score += 1;
    }

    for (const sys of bodySystems) {
      if (medClass.includes(sys) || medIndications.some((i: string) => i.includes(sys))) score += 2;
    }

    if (score >= 3) {
      seenSlugs.add(med.slug);
      items.push({
        type: "medication",
        title: `${med.genericName} (${med.brandNames[0] || med.drugClass})`,
        slug: med.slug,
        href: `/medications/${med.slug}`,
        description: `${med.drugClass} - pharmacology guide`,
        bodySystem,
      });
    }
  }

  return items.slice(0, limit);
}

async function findRelatedLabValues(
  bodySystem: string,
  bodySystems: string[],
  keyTerms: string[],
  seenSlugs: Set<string>,
  limit: number
): Promise<RelatedContentItem[]> {
  const items: RelatedContentItem[] = [];
  const labValues = await getLabValues();

  for (const lab of labValues) {
    if (items.length >= limit) break;
    if (seenSlugs.has(lab.slug)) continue;

    const labNorm = normalizeForMatching(lab.name);
    const labFull = normalizeForMatching(lab.fullName);
    const labOverview = normalizeForMatching(lab.overview);
    const labKeywords = normalizeForMatching(lab.keywords || "");
    const relatedSlugs = lab.relatedLabSlugs || [];

    let score = 0;
    for (const term of keyTerms) {
      if (labNorm.includes(term) || term.includes(labNorm)) score += 5;
      if (labFull.includes(term)) score += 4;
      if (labKeywords.includes(term)) score += 2;
      if (labOverview.includes(term)) score += 1;
    }

    for (const sys of bodySystems) {
      if (labOverview.includes(sys) || labKeywords.includes(sys)) score += 2;
    }

    if (keyTerms.some(t => relatedSlugs.includes(t))) score += 3;

    if (score >= 3) {
      seenSlugs.add(lab.slug);
      items.push({
        type: "lab-value",
        title: `${lab.name} Lab Values`,
        slug: lab.slug,
        href: `/lab-values/${lab.slug}`,
        description: `Normal range: ${lab.normalRange.value} ${lab.normalRange.unit}`,
        bodySystem,
      });
    }
  }

  return items.slice(0, limit);
}

async function findRelatedConditions(
  bodySystem: string,
  bodySystems: string[],
  keyTerms: string[],
  seenSlugs: Set<string>,
  limit: number
): Promise<RelatedContentItem[]> {
  const items: RelatedContentItem[] = [];
  const conditions = await getConditions();

  for (const cond of conditions) {
    if (items.length >= limit) break;
    if (seenSlugs.has(cond.slug)) continue;

    const condNorm = normalizeForMatching(cond.name);
    const condBody = normalizeForMatching(cond.bodySystem);
    const condKeywords = normalizeForMatching(cond.keywords || "");
    const condOverview = normalizeForMatching(cond.overview);
    const condMeds = (cond.medications || []).map((m: any) => normalizeForMatching(m.name));
    const relatedConds = cond.relatedConditions || [];

    let score = 0;
    for (const term of keyTerms) {
      if (condNorm.includes(term) || term.includes(condNorm)) score += 5;
      if (condBody.includes(term)) score += 3;
      if (condKeywords.includes(term)) score += 2;
      if (condMeds.some((m: string) => m.includes(term) || term.includes(m))) score += 3;
      if (condOverview.includes(term)) score += 1;
    }

    for (const sys of bodySystems) {
      if (condBody.includes(sys)) score += 3;
    }

    if (keyTerms.some(t => relatedConds.includes(t))) score += 3;

    if (score >= 3) {
      seenSlugs.add(cond.slug);
      items.push({
        type: "condition",
        title: cond.name,
        slug: cond.slug,
        href: `/conditions/${cond.slug}`,
        description: `${cond.bodySystem} - nursing study guide`,
        bodySystem: cond.bodySystem,
      });
    }
  }

  return items.slice(0, limit);
}

async function findRelatedLessons(
  context: ContentContext,
  bodySystem: string,
  keyTerms: string[],
  seenSlugs: Set<string>,
  limit: number
): Promise<RelatedContentItem[]> {
  const items: RelatedContentItem[] = [];

  if (bodySystem) {
    try {
      const result = await pool.query(
        `SELECT slug, title, body_system, category, updated_at
         FROM lessons
         WHERE status = 'published'
         AND LOWER(body_system) = $1
         AND slug != $2
         ORDER BY updated_at DESC
         LIMIT $3`,
        [bodySystem, context.slug, limit]
      );
      for (const row of result.rows) {
        if (!seenSlugs.has(row.slug)) {
          seenSlugs.add(row.slug);
          items.push({
            type: "lesson",
            title: row.title,
            slug: row.slug,
            href: `/lessons/${row.slug}`,
            description: `${row.category || row.body_system || "Clinical"} lesson`,
            bodySystem: row.body_system,
            category: row.category,
            updatedAt: row.updated_at,
          });
        }
      }
    } catch (e) {
      console.error("Related content: lesson body-system query error:", e);
    }
  }

  if (items.length < limit && keyTerms.length > 0) {
    try {
      const patterns = keyTerms.slice(0, 10).map(t => `%${t}%`);
      const result = await pool.query(
        `SELECT slug, title, body_system, category, updated_at
         FROM lessons
         WHERE status = 'published'
         AND slug != $1
         AND (LOWER(title) LIKE ANY($2::text[]) OR LOWER(category) LIKE ANY($2::text[]))
         ORDER BY updated_at DESC
         LIMIT $3`,
        [context.slug, patterns, limit - items.length]
      );
      for (const row of result.rows) {
        if (!seenSlugs.has(row.slug)) {
          seenSlugs.add(row.slug);
          items.push({
            type: "lesson",
            title: row.title,
            slug: row.slug,
            href: `/lessons/${row.slug}`,
            description: `${row.category || row.body_system || "Clinical"} lesson`,
            bodySystem: row.body_system,
            category: row.category,
            updatedAt: row.updated_at,
          });
        }
      }
    } catch (e) {
      console.error("Related content: lesson keyword query error:", e);
    }
  }

  return items.slice(0, limit);
}

async function findRelatedBlog(
  context: ContentContext,
  bodySystem: string,
  keyTerms: string[],
  seenSlugs: Set<string>,
  limit: number
): Promise<RelatedContentItem[]> {
  const items: RelatedContentItem[] = [];

  if (keyTerms.length === 0) return items;

  try {
    const patterns = keyTerms.slice(0, 10).map(t => `%${t}%`);
    const result = await pool.query(
      `SELECT slug, title, category, body_system, summary, updated_at
       FROM content_items
       WHERE status = 'published'
       AND type IN ('blog', 'blog-post', 'article')
       AND slug != $1
       AND (LOWER(title) LIKE ANY($2::text[]) OR LOWER(category) LIKE ANY($2::text[]) OR LOWER(body_system) LIKE ANY($2::text[]))
       ORDER BY updated_at DESC
       LIMIT $3`,
      [context.slug, patterns, limit]
    );
    for (const row of result.rows) {
      if (!seenSlugs.has(row.slug)) {
        seenSlugs.add(row.slug);
        items.push({
          type: "blog",
          title: row.title,
          slug: row.slug,
          href: `/learn/${row.slug}`,
          description: row.summary || `${row.category || "Clinical"} article`,
          bodySystem: row.body_system,
          category: row.category,
          updatedAt: row.updated_at,
        });
      }
    }
  } catch (e) {
    console.error("Related content: blog query error:", e);
  }

  return items.slice(0, limit);
}

async function findRelatedFlashcards(
  context: ContentContext,
  bodySystem: string,
  keyTerms: string[],
  seenSlugs: Set<string>,
  limit: number
): Promise<RelatedContentItem[]> {
  const items: RelatedContentItem[] = [];

  if (keyTerms.length === 0) return items;

  try {
    const patterns = keyTerms.slice(0, 10).map(t => `%${t}%`);
    const result = await pool.query(
      `SELECT slug, title, description, updated_at
       FROM flashcard_decks
       WHERE visibility = 'public'
       AND slug IS NOT NULL
       AND slug != $1
       AND LOWER(title) LIKE ANY($2::text[])
       ORDER BY view_count DESC NULLS LAST, updated_at DESC
       LIMIT $3`,
      [context.slug, patterns, limit]
    );
    for (const row of result.rows) {
      if (row.slug && !seenSlugs.has(row.slug)) {
        seenSlugs.add(row.slug);
        items.push({
          type: "flashcard",
          title: row.title,
          slug: row.slug,
          href: `/flashcards/deck/${row.slug}`,
          description: row.description || "Flashcard deck for active recall practice",
          updatedAt: row.updated_at,
        });
      }
    }
  } catch (e) {
    console.error("Related content: flashcard query error:", e);
  }

  return items.slice(0, limit);
}

async function findRelatedExamContent(
  context: ContentContext,
  bodySystem: string,
  keyTerms: string[],
  seenSlugs: Set<string>,
  limit: number
): Promise<RelatedContentItem[]> {
  const items: RelatedContentItem[] = [];
  const tier = context.tier || context.profession || "rn";

  if (bodySystem) {
    try {
      const result = await pool.query(
        `SELECT DISTINCT topic
         FROM exam_questions
         WHERE status = 'published'
         AND LOWER(topic) LIKE $1
         AND tier = $2
         LIMIT $3`,
        [`%${bodySystem}%`, tier, limit]
      );
      for (const row of result.rows) {
        const slug = row.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        if (slug && !seenSlugs.has(`exam-${slug}`)) {
          seenSlugs.add(`exam-${slug}`);
          items.push({
            type: "exam-question",
            title: `${row.topic} Practice Questions`,
            slug: slug,
            href: `/${tier}/questions/${slug}`,
            description: `Practice exam questions on ${row.topic}`,
            bodySystem,
          });
        }
      }
    } catch (e) {
      console.error("Related content: exam question body-system query error:", e);
    }
  }

  if (items.length < limit && keyTerms.length > 0) {
    try {
      const patterns = keyTerms.slice(0, 10).map(t => `%${t}%`);
      const result = await pool.query(
        `SELECT DISTINCT topic
         FROM exam_questions
         WHERE status = 'published'
         AND tier = $1
         AND LOWER(topic) LIKE ANY($2::text[])
         LIMIT $3`,
        [tier, patterns, limit - items.length]
      );
      for (const row of result.rows) {
        const slug = row.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        if (slug && !seenSlugs.has(`exam-${slug}`)) {
          seenSlugs.add(`exam-${slug}`);
          items.push({
            type: "exam-question",
            title: `${row.topic} Practice Questions`,
            slug: slug,
            href: `/${tier}/questions/${slug}`,
            description: `Practice exam questions on ${row.topic}`,
          });
        }
      }
    } catch (e) {
      console.error("Related content: exam question keyword query error:", e);
    }
  }

  return items.slice(0, limit);
}

const GLOSSARY_TERMS: Record<string, string[]> = {
  cardiac: ["cardiac-output", "stroke-volume", "preload", "afterload", "myocardial-infarction", "heart-failure", "atrial-fibrillation", "sinus-rhythm"],
  respiratory: ["alveoli", "diaphragm", "pneumothorax", "copd", "asthma", "atelectasis", "pleural-effusion", "mechanical-ventilation"],
  renal: ["nephron", "glomerular-filtration-rate", "acute-kidney-injury", "creatinine", "bun"],
  endocrine: ["diabetic-ketoacidosis", "siadh", "diabetes-insipidus", "hypothyroidism", "hyperthyroidism"],
  neurological: ["glasgow-coma-scale", "cerebral-perfusion-pressure", "myelin-sheath", "stroke", "increased-intracranial-pressure", "meningitis"],
  hematology: ["hemoglobin", "hematocrit", "platelet-count", "wbc-count", "dic", "hemostasis"],
  pharmacology: ["epinephrine", "warfarin", "heparin", "digoxin", "insulin", "morphine", "naloxone", "dopamine", "furosemide"],
  electrolyte: ["potassium", "sodium", "calcium", "magnesium", "metabolic-acidosis", "metabolic-alkalosis", "respiratory-acidosis", "respiratory-alkalosis"],
};

async function findRelatedGlossary(
  bodySystem: string,
  keyTerms: string[],
  seenSlugs: Set<string>,
  limit: number
): Promise<RelatedContentItem[]> {
  const items: RelatedContentItem[] = [];
  const matchedSlugs: string[] = [];

  for (const [system, terms] of Object.entries(GLOSSARY_TERMS)) {
    if (bodySystem && (bodySystem.includes(system) || system.includes(bodySystem))) {
      matchedSlugs.push(...terms);
    } else if (keyTerms.some(t => system.includes(t) || terms.some(slug => slug.includes(t)))) {
      matchedSlugs.push(...terms);
    }
  }

  for (const slug of matchedSlugs.slice(0, limit)) {
    if (!seenSlugs.has(`glossary-${slug}`)) {
      seenSlugs.add(`glossary-${slug}`);
      const title = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      items.push({
        type: "glossary" as any,
        title,
        slug,
        href: `/glossary/${slug}`,
        description: `Definition and clinical significance of ${title.toLowerCase()}`,
      });
    }
  }

  return items.slice(0, limit);
}

const NEW_GRAD_RESOURCES: { title: string; slug: string; href: string; keywords: string[] }[] = [
  { title: "New Grad Career Hub", slug: "newgrad", href: "/newgrad", keywords: ["career", "job", "graduate", "new grad", "interview", "resume", "first year"] },
  { title: "Nursing Interview Questions & Prep", slug: "newgrad-interview", href: "/newgrad/interview", keywords: ["interview", "behavioral", "star", "question", "job", "hiring"] },
  { title: "New Grad Resume Guide", slug: "newgrad-resume", href: "/newgrad/resume", keywords: ["resume", "cv", "cover letter", "job", "application", "ats"] },
  { title: "New Nurse Survival Guide", slug: "newgrad-survival", href: "/newgrad/survival-guide", keywords: ["new grad", "first year", "orientation", "transition", "confidence", "survival"] },
  { title: "New Grad Salary Guide", slug: "newgrad-salary", href: "/newgrad/salary", keywords: ["salary", "negotiation", "compensation", "pay", "wage", "benefits"] },
  { title: "Workplace Navigation for New Nurses", slug: "newgrad-workplace", href: "/newgrad/workplace", keywords: ["workplace", "team", "conflict", "communication", "preceptor", "delegation"] },
  { title: "Burnout Prevention for New Nurses", slug: "newgrad-burnout", href: "/newgrad/burnout", keywords: ["burnout", "stress", "self-care", "mental health", "resilience", "wellness"] },
  { title: "Nursing Career Development", slug: "newgrad-career", href: "/newgrad/career", keywords: ["career", "specialty", "advancement", "leadership", "professional development"] },
  { title: "New Grad Certifications Hub", slug: "newgrad-certs", href: "/newgrad/certifications", keywords: ["certification", "acls", "bls", "pals", "tncc", "ccrn", "cen"] },
];

function findRelatedNewGradContent(
  context: ContentContext,
  keyTerms: string[],
  seenSlugs: Set<string>,
  limit: number
): RelatedContentItem[] {
  const items: RelatedContentItem[] = [];
  const careerRelatedTypes = ["blog", "new-grad-guide"];
  const isCareerContent = careerRelatedTypes.includes(context.contentType) ||
    keyTerms.some(t => ["career", "job", "interview", "resume", "graduate", "new grad", "first year", "salary", "burnout"].includes(t));

  if (!isCareerContent) return items;

  for (const resource of NEW_GRAD_RESOURCES) {
    if (items.length >= limit) break;
    if (seenSlugs.has(resource.slug)) continue;

    const matchScore = resource.keywords.filter(kw =>
      keyTerms.some(t => kw.includes(t) || t.includes(kw))
    ).length;

    if (matchScore >= 1) {
      seenSlugs.add(resource.slug);
      items.push({
        type: "blog",
        title: resource.title,
        slug: resource.slug,
        href: resource.href,
        description: `Career readiness resource for new graduate nurses`,
      });
    }
  }

  return items.slice(0, limit);
}

async function findRelatedClinicalClarity(
  bodySystem: string,
  keyTerms: string[],
  seenSlugs: Set<string>,
  limit: number
): Promise<RelatedContentItem[]> {
  const CLINICAL_CLARITY_TOPICS: Record<string, { title: string; slug: string }[]> = {
    cardiac: [
      { title: "Why Does Hyperkalemia Cause Cardiac Arrest?", slug: "why-does-hyperkalemia-cause-cardiac-arrest" },
      { title: "Why Does Heart Failure Cause Edema?", slug: "why-does-heart-failure-cause-edema" },
      { title: "Why Does Atrial Fibrillation Cause Stroke?", slug: "why-does-atrial-fibrillation-cause-stroke" },
    ],
    respiratory: [
      { title: "Why Does COPD Cause Barrel Chest?", slug: "why-does-copd-cause-barrel-chest" },
      { title: "Why Does Pneumothorax Cause Tracheal Deviation?", slug: "why-does-pneumothorax-cause-tracheal-deviation" },
      { title: "Why Does Hypoxia Cause Restlessness Before Drowsiness?", slug: "why-does-hypoxia-cause-restlessness-before-drowsiness" },
    ],
    renal: [
      { title: "Why Does Acute Kidney Injury Cause Metabolic Acidosis?", slug: "why-does-acute-kidney-injury-cause-metabolic-acidosis" },
      { title: "Why Does Nephrotic Syndrome Cause Edema?", slug: "why-does-nephrotic-syndrome-cause-edema" },
    ],
    endocrine: [
      { title: "Why Does DKA Cause Fruity Breath?", slug: "why-does-dka-cause-fruity-breath" },
      { title: "Why Does Hypothyroidism Cause Weight Gain?", slug: "why-does-hypothyroidism-cause-weight-gain" },
      { title: "Why Does Diabetes Cause Peripheral Neuropathy?", slug: "why-does-diabetes-cause-peripheral-neuropathy" },
    ],
    neurological: [
      { title: "Why Does a Stroke Cause Dysphagia?", slug: "why-does-a-stroke-cause-dysphagia" },
      { title: "Why Does Meningitis Cause Neck Stiffness?", slug: "why-does-meningitis-cause-neck-stiffness" },
      { title: "Why Does Guillain-Barré Cause Ascending Paralysis?", slug: "why-does-guillain-barre-cause-ascending-paralysis" },
    ],
    gastrointestinal: [
      { title: "Why Does Cirrhosis Cause Ascites?", slug: "why-does-cirrhosis-cause-ascites" },
      { title: "Why Does Pancreatitis Cause Hypocalcemia?", slug: "why-does-pancreatitis-cause-hypocalcemia" },
    ],
    pharmacology: [
      { title: "Why Do Opioids Cause Constipation?", slug: "why-do-opioids-cause-constipation" },
    ],
    hematology: [
      { title: "Why Does Anemia Cause Tachycardia?", slug: "why-does-anemia-cause-tachycardia" },
      { title: "Why Does Sickle Cell Crisis Cause Severe Pain?", slug: "why-does-sickle-cell-crisis-cause-severe-pain" },
    ],
    maternal: [
      { title: "Why Does Preeclampsia Cause Seizures?", slug: "why-does-preeclampsia-cause-seizures" },
    ],
    musculoskeletal: [
      { title: "Why Does Rhabdomyolysis Cause Acute Kidney Injury?", slug: "why-does-rhabdomyolysis-cause-acute-kidney-injury" },
    ],
  };

  const items: RelatedContentItem[] = [];
  const matchedTopics: { title: string; slug: string }[] = [];

  for (const [system, topics] of Object.entries(CLINICAL_CLARITY_TOPICS)) {
    if (bodySystem && (bodySystem.includes(system) || system.includes(bodySystem))) {
      matchedTopics.push(...topics);
    } else if (keyTerms.some(t => system.includes(t) || topics.some(topic => topic.slug.includes(t)))) {
      matchedTopics.push(...topics);
    }
  }

  for (const topic of matchedTopics.slice(0, limit)) {
    if (!seenSlugs.has(topic.slug)) {
      seenSlugs.add(topic.slug);
      items.push({
        type: "clinical-clarity",
        title: topic.title,
        slug: topic.slug,
        href: `/clinical-clarity/${topic.slug}`,
        description: "Understand the clinical reasoning behind this phenomenon",
      });
    }
  }

  return items.slice(0, limit);
}
