const TIER_PREFIXES = /^(RN|NP|RPN|LVN|NCLEX|NCLEX-RN|NCLEX-PN|REx-PN)\s+/i;
const TIER_SUFFIXES = /\s+\((RN|NP|RPN|LVN|NCLEX|RPN\/LVN|RPN\/RN)\)$/i;
const TIER_SLUG_SUFFIXES = /-(rpn|rn|np|lvn|nclex)$/i;

const FILLER_WORDS = [
  "overview", "lesson", "guide", "explained", "management of",
  "understanding", "introduction to", "fundamentals", "review",
  "basics for practical nurses", "for practical nurses",
  "basics", "an overview", "a guide", "a review",
];

const FILLER_REGEX = new RegExp(
  `\\b(${FILLER_WORDS.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
  'gi'
);

const ABBREVIATION_MAP: Record<string, string> = {
  "PE": "Pulmonary Embolism",
  "SVT": "Supraventricular Tachycardia",
  "V Tach": "Ventricular Tachycardia",
  "VT": "Ventricular Tachycardia",
  "V Fib": "Ventricular Fibrillation",
  "VF": "Ventricular Fibrillation",
  "AFib": "Atrial Fibrillation",
  "A Fib": "Atrial Fibrillation",
  "MI": "Myocardial Infarction",
  "CHF": "Congestive Heart Failure",
  "HF": "Heart Failure",
  "DVT": "Deep Vein Thrombosis",
  "COPD": "Chronic Obstructive Pulmonary Disease",
  "DKA": "Diabetic Ketoacidosis",
  "HHNS": "Hyperosmolar Hyperglycemic State",
  "SIADH": "Syndrome of Inappropriate ADH",
  "AKI": "Acute Kidney Injury",
  "CKD": "Chronic Kidney Disease",
  "UTI": "Urinary Tract Infection",
  "BPH": "Benign Prostatic Hyperplasia",
  "GERD": "Gastroesophageal Reflux Disease",
  "IBS": "Irritable Bowel Syndrome",
  "ARDS": "Acute Respiratory Distress Syndrome",
  "TB": "Tuberculosis",
  "RSV": "Respiratory Syncytial Virus",
  "ADHD": "Attention Deficit Hyperactivity Disorder",
  "OCD": "Obsessive Compulsive Disorder",
  "PTSD": "Post-Traumatic Stress Disorder",
  "DIC": "Disseminated Intravascular Coagulation",
  "AAA": "Abdominal Aortic Aneurysm",
  "PAD": "Peripheral Artery Disease",
  "CAD": "Coronary Artery Disease",
  "TIA": "Transient Ischemic Attack",
  "ICP": "Intracranial Pressure",
  "GCS": "Glasgow Coma Scale",
  "PPH": "Postpartum Hemorrhage",
  "NEC": "Necrotizing Enterocolitis",
  "HELLP": "HELLP Syndrome",
  "ABG": "Arterial Blood Gas",
  "ECG": "Electrocardiogram",
  "EKG": "Electrocardiogram",
  "OSA": "Obstructive Sleep Apnea",
  "ERCP": "Endoscopic Retrograde Cholangiopancreatography",
  "EGD": "Esophagogastroduodenoscopy",
  "PEA": "Pulseless Electrical Activity",
  "NMS": "Neuroleptic Malignant Syndrome",
  "ALS": "Amyotrophic Lateral Sclerosis",
  "MS": "Multiple Sclerosis",
  "GBS": "Guillain-Barré Syndrome",
  "SLE": "Systemic Lupus Erythematosus",
  "RA": "Rheumatoid Arthritis",
  "CF": "Cystic Fibrosis",
  "HIV": "Human Immunodeficiency Virus",
  "AIDS": "Acquired Immunodeficiency Syndrome",
  "MRSA": "Methicillin-Resistant Staphylococcus Aureus",
  "VRE": "Vancomycin-Resistant Enterococcus",
  "C. diff": "Clostridioides Difficile",
  "CDiff": "Clostridioides Difficile",
};

const SPELLING_CORRECTIONS: Record<string, string> = {
  "Tumpr": "Tumor",
  "Mesothemioma": "Mesothelioma",
  "Mesotheleoma": "Mesothelioma",
  "Pericardal": "Pericardial",
  "Pnuemonia": "Pneumonia",
  "Pnuemothorax": "Pneumothorax",
  "Rhabdomylosis": "Rhabdomyolysis",
  "Guillian": "Guillain",
  "Barr": "Barré",
  "Parkinsons": "Parkinson's",
  "Alzheimers": "Alzheimer's",
  "Raynauds": "Raynaud's",
  "Buergers": "Buerger's",
  "Addisons": "Addison's",
  "Cushings": "Cushing's",
  "Gravess": "Graves'",
  "Marfans": "Marfan",
  "Kawasakis": "Kawasaki",
  "Crohns": "Crohn's",
  "Hodgkins": "Hodgkin's",
  "Bells": "Bell's",
  "Wernickes": "Wernicke",
  "Korsakoffs": "Korsakoff",
  "Reyes": "Reye's",
  "Hirschsprungs": "Hirschsprung's",
  "Turners": "Turner",
  "Klinefelters": "Klinefelter",
};

const MEDICAL_ACRONYMS = new Set([
  "COPD", "ECG", "EKG", "ICU", "IV", "NG", "ABG", "DKA", "HHNS", "SIADH",
  "DVT", "PE", "MI", "HF", "AKI", "CKD", "UTI", "BPH", "GERD", "IBS",
  "GI", "CNS", "PNS", "MS", "ALS", "ACLS", "BLS", "ADHD", "OCD", "PTSD",
  "DIC", "TB", "RSV", "ARDS", "ERCP", "EGD", "AI", "SEO", "AAA", "PPH",
  "NEC", "HELLP", "HIE", "RDS", "SBAR", "GCS", "NIH", "SOFA", "APACHE",
  "PPE", "AML", "CHF", "ADPIE", "DAR", "AV", "VAC", "OB", "DSM",
  "SCAT5", "APGAR", "HIV", "AIDS", "MRSA", "VRE", "SLE", "NMS",
  "PEA", "OSA", "CAD", "PAD", "TIA", "ICP", "GBS", "RA", "CF",
]);

const LOWERCASE_WORDS = new Set(["vs", "of", "the", "for", "in", "to", "and", "a", "an", "or", "with"]);

const BANNED_TITLE_WORDS = new Set([
  "rn", "rpn", "np", "nclex", "lvn", "overview", "lesson", "guide", "explained",
]);

export interface CanonicalResult {
  canonicalTitle: string;
  canonicalSlug: string;
  wasChanged: boolean;
  corrections: string[];
}

export function canonicalizeTitle(rawTitle: string): CanonicalResult {
  const corrections: string[] = [];
  let title = rawTitle.trim();
  const original = title;

  const tierPrefixMatch = title.match(TIER_PREFIXES);
  if (tierPrefixMatch) {
    title = title.replace(TIER_PREFIXES, "").trim();
    corrections.push(`Removed tier prefix: "${tierPrefixMatch[0].trim()}"`);
  }

  const tierSuffixMatch = title.match(TIER_SUFFIXES);
  if (tierSuffixMatch) {
    title = title.replace(TIER_SUFFIXES, "").trim();
    corrections.push(`Removed tier suffix: "${tierSuffixMatch[0].trim()}"`);
  }

  title = title.replace(FILLER_REGEX, "").trim();
  title = title.replace(/\s{2,}/g, " ").trim();
  if (title !== original.replace(TIER_PREFIXES, "").replace(TIER_SUFFIXES, "").trim()) {
    corrections.push("Removed filler words");
  }

  const titleWords = title.split(/\s+/);
  if (titleWords.length <= 3) {
    for (const [abbr, full] of Object.entries(ABBREVIATION_MAP)) {
      const abbrTokens = abbr.split(/\s+/);
      if (abbrTokens.length > 1) {
        const escapedAbbr = abbr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const multiRegex = new RegExp(`^${escapedAbbr}$`, "i");
        if (multiRegex.test(title.trim())) {
          title = full;
          corrections.push(`Expanded abbreviation: "${abbr}" → "${full}"`);
          break;
        }
        const partialRegex = new RegExp(`\\b${escapedAbbr}\\b`, "i");
        if (partialRegex.test(title)) {
          title = title.replace(partialRegex, full);
          corrections.push(`Expanded abbreviation: "${abbr}" → "${full}"`);
        }
      } else {
        const abbrRegex = new RegExp(`^${abbr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i");
        for (let i = 0; i < titleWords.length; i++) {
          if (abbrRegex.test(titleWords[i])) {
            titleWords[i] = full;
            corrections.push(`Expanded abbreviation: "${abbr}" → "${full}"`);
          }
        }
        title = titleWords.join(" ");
      }
    }
  }

  for (const [wrong, right] of Object.entries(SPELLING_CORRECTIONS)) {
    const regex = new RegExp(`\\b${wrong}\\b`, "gi");
    if (regex.test(title)) {
      title = title.replace(regex, right);
      corrections.push(`Spelling: "${wrong}" → "${right}"`);
    }
  }

  title = toTitleCase(title);

  if (title.length > 45) {
    const colonIdx = title.indexOf(":");
    if (colonIdx > 0 && colonIdx <= 45) {
      const beforeColon = title.slice(0, colonIdx).trim();
      if (beforeColon.length >= 8) {
        title = beforeColon;
        corrections.push("Truncated at colon to stay under 45 chars");
      }
    }
  }

  title = title.replace(/^[:\-–—,.\s]+/, "").replace(/[:\-–—,.\s]+$/, "").trim();

  const slug = generateCanonicalSlug(title);
  const wasChanged = title !== original;

  return { canonicalTitle: title, canonicalSlug: slug, wasChanged, corrections };
}

export function canonicalizeSlug(rawSlug: string): string {
  let slug = rawSlug;

  slug = slug.replace(TIER_SLUG_SUFFIXES, "");

  const fillerSlugParts = [
    "-overview", "-lesson", "-guide", "-explained",
    "-basics-for-practical-nurses", "-for-practical-nurses",
    "-basics", "-review", "-fundamentals",
    "-introduction-to", "-management-of", "-understanding",
  ];
  for (const filler of fillerSlugParts) {
    if (slug.endsWith(filler)) {
      slug = slug.slice(0, -filler.length);
    }
  }

  slug = slug.replace(/^(rpn|rn|np|lvn|nclex)-/i, "");

  slug = slug.replace(/--+/g, "-").replace(/^-|-$/g, "");

  return slug;
}

function generateCanonicalSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeForAlias(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "");
}

function toTitleCase(str: string): string {
  const words = str.split(/\s+/);
  return words
    .map((word, index) => {
      const upper = word.toUpperCase();
      if (MEDICAL_ACRONYMS.has(upper)) return upper;
      if (index > 0 && LOWERCASE_WORDS.has(word.toLowerCase())) return word.toLowerCase();
      if (/['']/.test(word)) {
        const parts = word.split(/([''])/);
        return parts.map((p, i) => {
          if (/^['']$/.test(p)) return p;
          if (i === 0) return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
          return p.toLowerCase();
        }).join("");
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

export function resolveAbbreviation(query: string): string | null {
  const upper = query.toUpperCase().trim();
  for (const [abbr, full] of Object.entries(ABBREVIATION_MAP)) {
    if (abbr.toUpperCase() === upper) return full;
  }
  return null;
}

export function getAbbreviationMap(): Record<string, string> {
  return { ...ABBREVIATION_MAP };
}

export interface TitleValidationResult {
  valid: boolean;
  errors: string[];
  suggestions: string[];
}

export function validateLessonTitle(title: string): TitleValidationResult {
  const errors: string[] = [];
  const suggestions: string[] = [];

  if (!title || !title.trim()) {
    errors.push("Title is required");
    return { valid: false, errors, suggestions };
  }

  const words = title.toLowerCase().split(/\s+/);
  for (const word of words) {
    if (BANNED_TITLE_WORDS.has(word)) {
      errors.push(`Title contains banned word: "${word}"`);
      suggestions.push(`Remove "${word}" from the title`);
    }
  }

  if (TIER_PREFIXES.test(title)) {
    errors.push("Title contains a tier prefix (RN, NP, RPN, LVN, NCLEX)");
    suggestions.push("Remove the tier prefix from the title");
  }

  if (TIER_SUFFIXES.test(title)) {
    errors.push("Title contains a tier suffix");
    suggestions.push("Remove the tier suffix from the title");
  }

  if (title.length > 45) {
    errors.push(`Title is ${title.length} chars, max 45 allowed`);
    suggestions.push("Shorten the title to 45 characters or fewer");
  }

  const wordCount = title.trim().split(/\s+/).length;
  if (wordCount > 4) {
    errors.push(`Title has ${wordCount} words, max 4 allowed`);
    suggestions.push("Shorten to 2–4 words");
  } else if (wordCount < 2) {
    suggestions.push("Aim for at least 2 words for clarity");
  }

  return { valid: errors.length === 0, errors, suggestions };
}

export function stripTierFromBreadcrumb(name: string): string {
  return name
    .replace(TIER_PREFIXES, "")
    .replace(TIER_SUFFIXES, "")
    .replace(/\s*\(RPN\/LVN\)\s*/gi, "")
    .replace(/\s*\(RPN\/RN\)\s*/gi, "")
    .trim();
}

export interface MigrationReport {
  lessonsScanned: number;
  titlesCanonicalized: number;
  slugsStandardized: number;
  aliasesCreated: number;
  spellingCorrections: number;
  duplicatesFound: number;
  referencesUpdated: number;
  lowConfidenceItems: { id: string; title: string; reason: string }[];
}

export function createEmptyReport(): MigrationReport {
  return {
    lessonsScanned: 0,
    titlesCanonicalized: 0,
    slugsStandardized: 0,
    aliasesCreated: 0,
    spellingCorrections: 0,
    duplicatesFound: 0,
    referencesUpdated: 0,
    lowConfidenceItems: [],
  };
}
