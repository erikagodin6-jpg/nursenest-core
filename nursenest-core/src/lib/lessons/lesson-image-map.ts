/**
 * Centralized lesson image map for clinical images stored in the nursenest-images Spaces bucket.
 *
 * MATCHING PRIORITY (in order, most to least specific):
 *   1. Exact slug match      (slugs array — highest confidence)
 *   2. Keyword match         (topic/topicSlug substring — medium confidence)
 *   3. Body system fallback  (bodySystem match — low confidence, only when ONE entry matches)
 *
 * Object keys are bare Spaces filenames (root-level bucket objects).
 * CDN URL is built by publicCdnUrlForObjectKey() from @/lib/education-images/cdn-url.
 *
 * HOW TO ADD AN IMAGE:
 *   1. Upload the image to the nursenest-images Spaces bucket.
 *   2. Add an entry below with the filename, relevant slugs, and keywords.
 *   3. Run: npm run typecheck to verify.
 */

export type LessonImageMapEntry = {
  /** Bare filename or path in the Spaces bucket (object key). */
  objectKey: string;
  /** Optional human-readable caption shown below the image. */
  caption?: string;
  /** Exact lesson slug matches — highest confidence, checked before keywords. */
  slugs?: readonly string[];
  /** Keywords/phrases checked against lesson topic and topicSlug (case-insensitive substring). */
  keywords?: readonly string[];
  /**
   * Body system labels used for last-resort fallback.
   * Fallback only fires when EXACTLY ONE entry in the map matches a given body system,
   * preventing wrong images from appearing on unrelated lessons in the same system.
   */
  bodySystems?: readonly string[];
  /** Broad category label (informational). */
  category?: string;
};

export const LESSON_IMAGE_MAP: readonly LessonImageMapEntry[] = [
  // ── Perioperative / Bariatric ─────────────────────────────────────────────
  {
    objectKey: "bariatricsurgery.png",
    keywords: [
      "bariatric surgery",
      "bariatric",
      "obesity surgery",
      "gastric bypass",
      "sleeve gastrectomy",
      "roux-en-y",
      "metabolic surgery",
    ],
    bodySystems: ["perioperative", "surgical"],
    category: "perioperative",
    caption: "Bariatric surgery — perioperative nursing considerations",
  },

  // ── Cardiovascular ────────────────────────────────────────────────────────
  {
    objectKey: "acutecoronarysyndrome.jpeg",
    slugs: [
      "acute-coronary-syndrome",
      "acs-nursing",
      "acs-management",
      "acute-coronary-syndrome-nursing",
      "acute-coronary-syndrome-management",
      "nstemi",
      "stemi",
      "stemi-nursing",
      "nstemi-nursing",
      "unstable-angina",
      "unstable-angina-nursing",
      "acs-pathophysiology",
    ],
    keywords: [
      "acute coronary syndrome",
      "acs",
      "stemi",
      "nstemi",
      "unstable angina",
      "myocardial infarction",
      "heart attack nursing",
      "acs management",
      "coronary artery occlusion",
      "plaque rupture",
    ],
    bodySystems: [],
    category: "cardiovascular",
    caption: "Acute coronary syndrome — STEMI/NSTEMI pathophysiology and nursing management",
  },
  {
    objectKey: "cardiacamyloidosis.png",
    slugs: [
      "cardiac-amyloidosis",
      "amyloid-cardiomyopathy",
      "cardiac-amyloidosis-nursing",
      "cardiac-amyloidosis-heart-failure",
    ],
    keywords: ["cardiac amyloidosis", "amyloidosis cardiomyopathy", "amyloid heart", "transthyretin amyloidosis"],
    bodySystems: [],
    category: "cardiovascular",
    caption: "Cardiac amyloidosis — restrictive cardiomyopathy",
  },
  {
    objectKey: "cardiacsarcoidosis.png",
    slugs: [
      "cardiac-sarcoidosis",
      "cardiac-sarcoidosis-nursing",
      "sarcoidosis-cardiomyopathy",
    ],
    keywords: [
      "cardiac sarcoidosis",
      "sarcoidosis heart",
      "inflammatory cardiomyopathy sarcoid",
      "granulomatous cardiomyopathy",
    ],
    bodySystems: [],
    category: "cardiovascular",
    caption: "Cardiac sarcoidosis — inflammatory cardiomyopathy",
  },
  {
    objectKey: "eisenmenger.png",
    slugs: [
      "eisenmenger-syndrome",
      "eisenmenger-complex",
      "eisenmenger",
      "eisenmenger-physiology",
    ],
    keywords: [
      "eisenmenger syndrome",
      "eisenmenger complex",
      "eisenmenger",
      "pulmonary hypertension congenital reversal",
      "left to right shunt reversal",
    ],
    bodySystems: [],
    category: "cardiovascular",
    caption: "Eisenmenger syndrome — congenital heart disease complication",
  },

  // ── Vascular ──────────────────────────────────────────────────────────────
  {
    objectKey: "dvt.png",
    slugs: [
      "deep-vein-thrombosis",
      "dvt",
      "dvt-nursing",
      "lower-extremity-dvt",
      "deep-vein-thrombosis-nursing",
      /** Bundled NCLEX-RN hub lessons (canonical catalog slugs) */
      "deep-vein-thrombosis-dvt-prevention-and-nursing-management-nclex-rn",
      "dvt-pe-prevention-nursing",
      "dvt-pe-nursing-priorities",
    ],
    keywords: [
      "deep vein thrombosis",
      "dvt",
      "venous thromboembolism",
      "vte prophylaxis",
      "blood clot leg",
      "lower extremity dvt",
    ],
    bodySystems: ["vascular"],
    category: "vascular",
    caption: "Deep vein thrombosis — vascular nursing assessment",
  },
  {
    objectKey: "abdominalaorticaneurysm.jpeg",
    slugs: [
      "abdominal-aortic-aneurysm",
      "aaa-aneurysm",
      "aortic-aneurysm",
      "abdominal-aortic-aneurysm-nursing",
      "aaa-nursing",
      "aortic-aneurysm-repair",
      "endovascular-aortic-repair",
      "evar-nursing",
      "open-aortic-repair",
    ],
    keywords: [
      "abdominal aortic aneurysm",
      "aortic aneurysm",
      "aaa",
      "aortic dilation",
      "endovascular aortic repair",
      "evar",
      "open aortic repair",
      "aortic rupture",
    ],
    bodySystems: [],
    category: "vascular",
    caption: "Abdominal aortic aneurysm — vascular nursing assessment and management",
  },
  {
    objectKey: "carotidbodytumor.png",
    slugs: [
      "carotid-body-tumor",
      "carotid-paraganglioma",
      "carotid-body-paraganglioma",
      "carotid-body-neoplasm",
    ],
    keywords: [
      "carotid body tumor",
      "carotid body paraganglioma",
      "carotid paraganglioma",
      "carotid body neoplasm",
      "glomus caroticum",
    ],
    bodySystems: [],
    category: "vascular",
    caption: "Carotid body tumor — vascular/neuro nursing assessment",
  },
  {
    objectKey: "giantcell.png",
    slugs: [
      "giant-cell-arteritis",
      "temporal-arteritis",
      "gca-vasculitis",
      "gca",
      "giant-cell-arteritis-nursing",
    ],
    keywords: [
      "giant cell arteritis",
      "temporal arteritis",
      "giant cell vasculitis",
      "cranial vasculitis",
      "polymyalgia rheumatica arteritis",
      "gca nursing",
    ],
    bodySystems: [],
    category: "vascular",
    caption: "Giant cell arteritis — large-vessel vasculitis nursing care",
  },

  // ── Respiratory / Vasculitis ───────────────────────────────────────────────
  {
    objectKey: "churgstrauss.jpeg",
    slugs: [
      "churg-strauss",
      "eosinophilic-granulomatosis-polyangiitis",
      "egpa",
      "churg-strauss-syndrome",
      "allergic-granulomatosis",
    ],
    keywords: [
      "churg strauss",
      "eosinophilic granulomatosis polyangiitis",
      "egpa",
      "anca vasculitis respiratory",
      "allergic granulomatosis angiitis",
    ],
    bodySystems: [],
    category: "respiratory",
    caption: "Eosinophilic granulomatosis with polyangiitis — Churg-Strauss syndrome",
  },

  // ── Musculoskeletal / Safety ───────────────────────────────────────────────
  {
    objectKey: "crutchparalysis.png",
    slugs: [
      "crutch-palsy",
      "crutch-paralysis",
      "radial-nerve-compression-crutch",
      "crutch-nerve-injury",
      "axillary-crutch-palsy",
    ],
    keywords: [
      "crutch paralysis",
      "crutch palsy",
      "crutch radial nerve",
      "axillary crutch nerve",
      "mobility aid nerve injury",
      "crutch safety nerve",
    ],
    bodySystems: [],
    category: "musculoskeletal",
    caption: "Crutch paralysis — radial nerve compression and mobility safety",
  },

  // ── Maternity / OB ────────────────────────────────────────────────────────
  {
    objectKey: "decels.png",
    slugs: [
      "fetal-heart-rate-decelerations",
      "fhr-decelerations",
      "late-decelerations",
      "variable-decelerations",
      "early-decelerations",
      "fetal-monitoring-decelerations",
      "fetal-decelerations-nursing",
    ],
    keywords: [
      "fetal decelerations",
      "fhr decelerations",
      "fetal heart rate decelerations",
      "late decelerations",
      "variable decelerations",
      "early decelerations",
      "fetal monitoring decelerations",
      "electronic fetal monitoring",
      "nst strip",
    ],
    bodySystems: ["maternity", "obstetrics", "maternal-newborn"],
    category: "maternity",
    caption: "Fetal heart rate decelerations — maternity nursing monitoring",
  },
];

// ── Lookup helpers ─────────────────────────────────────────────────────────────

/** Normalize text for case-insensitive substring comparison. */
function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function textContainsKeyword(text: string, keywords: readonly string[]): boolean {
  const n = norm(text);
  return keywords.some((kw) => n.includes(norm(kw)));
}

export type ImageMapSource = "map_slug" | "map_keyword" | "map_body_system";

export type ImageMapMatch = {
  objectKey: string;
  source: ImageMapSource;
  caption?: string;
} | null;

/**
 * Resolve a lesson image from the structured map.
 *
 * Priority:
 *   1. Exact slug/topicSlug match → `"map_slug"` (most specific)
 *   2. Keyword match in topic or topicSlug text → `"map_keyword"`
 *   3. Body system fallback — only when EXACTLY ONE map entry matches → `"map_body_system"`
 *
 * Returns null when no confident match exists.
 */
export function resolveImageFromLessonMap({
  slug,
  topic,
  topicSlug,
  bodySystem,
}: {
  slug?: string | null;
  topic?: string | null;
  topicSlug?: string | null;
  bodySystem?: string | null;
}): ImageMapMatch {
  const normSlug = norm(slug ?? "");
  const normTopicSlug = norm(topicSlug ?? "");
  const normTopic = norm(topic ?? "");
  const normBodySystem = norm(bodySystem ?? "");

  // Pass 1: exact slug + keyword matches
  for (const entry of LESSON_IMAGE_MAP) {
    // 1a. Exact slug or topicSlug match
    if (entry.slugs?.length) {
      for (const s of entry.slugs) {
        const ns = norm(s);
        if ((normSlug && normSlug === ns) || (normTopicSlug && normTopicSlug === ns)) {
          return { objectKey: entry.objectKey, source: "map_slug", caption: entry.caption };
        }
      }
    }

    // 1b. Keyword match in topic / topicSlug combined text
    if (entry.keywords?.length) {
      const haystack = [normTopic, normTopicSlug].filter(Boolean).join(" ");
      if (haystack && textContainsKeyword(haystack, entry.keywords)) {
        return { objectKey: entry.objectKey, source: "map_keyword", caption: entry.caption };
      }
    }
  }

  // Pass 2: body system fallback — only when EXACTLY ONE entry matches (prevents wrong attribution)
  if (normBodySystem) {
    const matches = LESSON_IMAGE_MAP.filter(
      (e) =>
        (e.bodySystems?.length ?? 0) > 0 &&
        e.bodySystems!.some((bs) => normBodySystem.includes(norm(bs))),
    );
    if (matches.length === 1) {
      return { objectKey: matches[0].objectKey, source: "map_body_system", caption: matches[0].caption };
    }
  }

  return null;
}
