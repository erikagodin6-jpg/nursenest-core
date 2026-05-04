import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  MASTERY_MODULE_REGISTRY,
  MASTERY_REQUIRED_MODALITIES,
  masteryModulesByType,
} from "@/lib/mastery-modules/mastery-module-registry";
import {
  assertNoMasteryLeak,
  MASTERY_EXCLUDED_MODULE_TYPES,
  MASTERY_EXCLUSION_WHERE,
} from "@/lib/mastery-modules/assert-no-mastery-leak";
import {
  validateEmergencyPatternQuestion,
  type EmergencyPatternQuestion,
  type TimedPattern,
} from "@/lib/mastery-modules/emergency-pattern-validator";

function listFiles(relativePath: string): string[] {
  const absolutePath = join(process.cwd(), relativePath);
  if (!existsSync(absolutePath)) return [];
  const stat = statSync(absolutePath);
  if (stat.isFile()) return [absolutePath];
  return readdirSync(absolutePath, { withFileTypes: true }).flatMap((entry) => {
    const child = join(relativePath, entry.name);
    if (entry.isDirectory()) return listFiles(child);
    if (entry.isFile()) return [join(process.cwd(), child)];
    return [];
  });
}

function readFiles(paths: string[]): string {
  return paths.flatMap(listFiles).map((file) => readFileSync(file, "utf8")).join("\n");
}

test("shared MasteryModule Prisma architecture exists", () => {
  const schema = readFileSync(join(process.cwd(), "prisma/schema.prisma"), "utf8");
  for (const model of ["MasteryModule", "MasteryLesson", "MasteryQuestion", "MasteryCaseScenario", "MasteryPatternMap"]) {
    assert.match(schema, new RegExp(`model\\s+${model}\\s+\\{`), model);
  }
  assert.match(schema, /@@map\("mastery_modules"\)/);
  assert.match(schema, /moduleType\s+String\s+@map\("module_type"\)/);
  assert.match(schema, /isPublic\s+Boolean\s+@default\(false\)/);
  assert.match(schema, /adminPreviewOnly\s+Boolean\s+@default\(true\)/);
});

test("all planned mastery modules are represented in the shared registry with required module types", () => {
  const byType = new Map(MASTERY_MODULE_REGISTRY.map((module) => [module.id, module.moduleType]));
  const expected = {
    "ecg-mastery": "ecg",
    "lab-values-basics": "lab-values",
    "lab-values-basic": "lab-values",
    "lab-values-advanced": "lab-values",
    "respiratory-abg-mastery": "abg",
    "respiratory-ventilator-basics": "ventilator-management",
    "respiratory-ventilator-management": "ventilator-management",
    "respiratory-paramedic-oxygen-delivery": "oxygen-delivery",
    "paramedic-oxygen-delivery": "oxygen-delivery",
    "respiratory-paramedic-respiratory-distress": "respiratory-distress",
    "paramedic-respiratory-distress": "respiratory-distress",
    "pharmacy-tech-iv-infusion-safety": "iv-infusion-safety",
    "paramedic-iv-infusion-safety": "iv-infusion-safety",
    "paramedic-neuro-stroke-recognition": "neuro-stroke-recognition",
    "ota-neuro-stroke-recognition": "neuro-stroke-recognition",
    "paramedic-trauma-triage": "trauma-triage",
    "mlt-advanced-lab-interpretation": "advanced-lab-interpretation",
    "pharmacy-tech-pharmacology-patterns": "pharmacy",
    "pharmacy-tech-dosage-calculations": "pharmacy",
    "ota-adl-functional-assessment": "functional-assessment",
    "pta-msk-rehab-assessment": "msk-rehab",
    "imaging-image-recognition": "image-recognition",
    "sonography-ecg-cardiac-patterns": "cardiac-pattern-recognition",
    "paramedic-emergency-pattern-recognition": "emergency-pattern-recognition",
    "pta-movement-injury-mechanics": "movement-injury-mechanics",
    "ota-functional-assessment-adl-safety": "functional-assessment-adl-safety",
  } as const;
  assert.equal(MASTERY_MODULE_REGISTRY.length, Object.keys(expected).length);
  for (const [id, moduleType] of Object.entries(expected)) {
    assert.equal(byType.get(id), moduleType, id);
  }
  assert.equal(masteryModulesByType("oxygen-delivery").length, 2);
  assert.equal(masteryModulesByType("respiratory-distress").length, 2);
  assert.equal(masteryModulesByType("iv-infusion-safety").length, 2);
  assert.equal(masteryModulesByType("neuro-stroke-recognition").length, 2);
  assert.equal(masteryModulesByType("lab-values").length, 3);
});

test("shared mastery registry entries stay hidden and admin-preview only", () => {
  for (const module of MASTERY_MODULE_REGISTRY) {
    assert.equal(module.isPublic, false, module.id);
    assert.equal(module.adminPreviewOnly, true, module.id);
    assert.ok(module.route.startsWith("/"), module.id);
  }
});

test("admin module routes are guarded and allied admin preview is paginated", () => {
  const adminRoot = readFileSync(join(process.cwd(), "src/app/(admin)/admin/modules/page.tsx"), "utf8");
  const alliedAdmin = readFileSync(join(process.cwd(), "src/app/(admin)/admin/modules/allied/page.tsx"), "utf8");
  assert.match(adminRoot, /requireAdmin\(\)/);
  assert.match(alliedAdmin, /requireAdmin\(\)/);
  assert.match(alliedAdmin, /ADMIN_ALLIED_MODULES_PAGE_SIZE/);
  assert.match(alliedAdmin, /slice\(\(page - 1\) \* ADMIN_ALLIED_MODULES_PAGE_SIZE/);
});

test("hidden mastery modules stay out of public exposure surfaces", () => {
  const sitemapAndSeo = readFiles(["src/app/sitemap.xml/route.ts", "src/lib/seo", "reports/localized-seo-audit.json", "reports/localized-seo-audit.md"]);
  const navPricingHome = readFiles([
    "src/lib/navigation",
    "src/lib/marketing",
    "src/app/(marketing)/(default)/pricing",
    "src/app/(marketing)/[locale]/pricing",
    "src/lib/pricing",
    "src/lib/conversion/pricing-catalog.ts",
    "src/lib/stripe/pricing-map.ts",
    "src/app/(marketing)/(default)/page.tsx",
    "src/app/(marketing)/[locale]/page.tsx",
  ]);
  for (const module of MASTERY_MODULE_REGISTRY) {
    assert.doesNotMatch(sitemapAndSeo, new RegExp(module.route.replaceAll("/", "\\/")), module.route);
    assert.doesNotMatch(navPricingHome, new RegExp(module.route.replaceAll("/", "\\/")), module.route);
    assert.doesNotMatch(navPricingHome, new RegExp(module.entitlementKey.replaceAll("/", "\\/")), module.entitlementKey);
  }
});

test("CAT and core practice exam code do not query MasteryQuestion", () => {
  const poolSources = readFiles(["src/lib/cat", "src/lib/practice-tests", "src/lib/exam-pathways", "src/app/api/cat", "src/app/api/practice-tests"]);
  assert.doesNotMatch(poolSources, /masteryQuestion/i);
  assert.doesNotMatch(poolSources, /MasteryQuestion/);
  assert.doesNotMatch(poolSources, /mastery_questions/);
});

test("mastery media stays URL/config only with no local media imports", () => {
  const masterySources = readFiles(["src/lib/allied", "src/lib/mastery-modules", "src/components/ecg-module", "src/components/study/ecg-live-strip.tsx"]);
  assert.doesNotMatch(masterySources, /import\s+.*\.(mp4|webm|mp3|wav|png|jpg|jpeg|gif|svg)/i);
  assert.doesNotMatch(masterySources, /from\s+["'][^"']+\.(mp4|webm|mp3|wav|png|jpg|jpeg|gif|svg)["']/i);
  assert.match(masterySources, /Url|mediaConfig|deviceImageUrl|waveformImageUrl|videoUrl|audioUrl/);
});

test("assertNoMasteryLeak throws when moduleType is present and passes when absent", () => {
  // Throws for any mastery module type
  for (const source of ["CAT", "practice", "flashcards", "homepage", "seo"] as const) {
    assert.throws(
      () => assertNoMasteryLeak({ source, moduleType: "emergency-pattern-recognition" }),
      /MASTERY_LEAK_BLOCKED.*moduleType=emergency-pattern-recognition/,
      `${source}: should throw on emergency-pattern-recognition`,
    );
    assert.throws(
      () => assertNoMasteryLeak({ source, moduleType: "respiratory-distress" }),
      /MASTERY_LEAK_BLOCKED/,
      `${source}: should throw on respiratory-distress`,
    );
  }

  // Does NOT throw when moduleType is absent / null / undefined
  assert.doesNotThrow(() => assertNoMasteryLeak({ source: "CAT" }));
  assert.doesNotThrow(() => assertNoMasteryLeak({ source: "CAT", moduleType: null }));
  assert.doesNotThrow(() => assertNoMasteryLeak({ source: "CAT", moduleType: undefined }));
});

test("MASTERY_EXCLUDED_MODULE_TYPES covers all registered module types", () => {
  const excluded = new Set(MASTERY_EXCLUDED_MODULE_TYPES);

  // Must include all critical module types
  for (const required of [
    "emergency-pattern-recognition",
    "respiratory-distress",
    "ecg",
    "abg",
    "ventilator-management",
    "oxygen-delivery",
    "iv-infusion-safety",
    "lab-values",
    "cardiac-pattern-recognition",
    "movement-injury-mechanics",
    "functional-assessment-adl-safety",
  ]) {
    assert.ok(excluded.has(required as never), `MASTERY_EXCLUDED_MODULE_TYPES missing: ${required}`);
  }

  // All entries in the registry must be covered by the exclusion list
  for (const entry of MASTERY_MODULE_REGISTRY) {
    assert.ok(
      excluded.has(entry.moduleType as never),
      `Registry moduleType "${entry.moduleType}" (${entry.id}) not in MASTERY_EXCLUDED_MODULE_TYPES`,
    );
  }
});

test("MASTERY_EXCLUSION_WHERE has correct Prisma-compatible filter shape", () => {
  assert.ok(Array.isArray(MASTERY_EXCLUSION_WHERE.NOT.moduleType.in));
  assert.ok(MASTERY_EXCLUSION_WHERE.NOT.moduleType.in.length > 0);
  assert.equal(MASTERY_EXCLUSION_WHERE.isPublic, true);
  assert.equal(MASTERY_EXCLUSION_WHERE.adminPreviewOnly, false);
});

test("emergency pattern recognition registry entry has required modalities declared", () => {
  const modalities = MASTERY_REQUIRED_MODALITIES["emergency-pattern-recognition"];
  assert.ok(modalities, "emergency-pattern-recognition must have requiredModalities");
  assert.equal(modalities.lungSound, "audio", "lungSound must require audio");
  assert.ok(Array.isArray(modalities.ecg), "ecg must be an array of compatible types");
  assert.ok((modalities.ecg as string[]).includes("image"), "ecg must allow image");
  assert.ok((modalities.ecg as string[]).includes("video"), "ecg must allow video");
  assert.equal(modalities.traumaImage, "image", "traumaImage must require image");
  assert.equal(modalities.glucose, "numeric", "glucose must be numeric");
  assert.equal(modalities.vitals, "required", "vitals must be required");
});

test("validateEmergencyPatternQuestion throws on missing vitals", () => {
  const q = {
    id: "test-missing-vitals",
    clinicalData: { vitals: null as unknown as never },
    answerOptions: ["A", "B"],
    correctAnswerId: "A",
    rationale: "Test rationale",
    clinicalLookFor: "Test",
  } as unknown as EmergencyPatternQuestion;
  assert.throws(() => validateEmergencyPatternQuestion(q), /missing required clinicalData\.vitals/);
});

test("validateEmergencyPatternQuestion throws on incomplete vitals", () => {
  const q = {
    id: "test-incomplete-vitals",
    clinicalData: { vitals: { HR: 88, BP: "120/78" } } as unknown as never,
    answerOptions: ["A", "B"],
    correctAnswerId: "A",
    rationale: "Test",
    clinicalLookFor: "Test",
  } as unknown as EmergencyPatternQuestion;
  assert.throws(() => validateEmergencyPatternQuestion(q), /incomplete vitals/);
});

test("validateEmergencyPatternQuestion throws when lung-sound tag is missing audio", () => {
  const q: EmergencyPatternQuestion = {
    id: "test-lung-no-audio",
    tags: ["lung-sound"],
    clinicalData: { vitals: { HR: 110, BP: "88/60", RR: 28, SpO2: 88 } },
    clinicalMedia: { type: "image", url: "https://example.com/chest.png" },
    answerOptions: ["Wheezing", "Crackles"],
    correctAnswerId: "Wheezing",
    rationale: "Bronchospasm produces wheezing.",
    clinicalLookFor: "Listen for expiratory wheezing.",
  };
  assert.throws(
    () => validateEmergencyPatternQuestion(q),
    /tagged "lung-sound" requires ClinicalMedia\.type="audio"/,
  );
});

test("validateEmergencyPatternQuestion throws when ecg tag is missing ECG-compatible media", () => {
  const q: EmergencyPatternQuestion = {
    id: "test-ecg-no-media",
    tags: ["ecg"],
    clinicalData: { vitals: { HR: 90, BP: "110/70", RR: 16, SpO2: 97 } },
    clinicalMedia: { type: "audio", url: "https://example.com/sound.mp3" },
    answerOptions: ["STEMI", "Normal sinus"],
    correctAnswerId: "STEMI",
    rationale: "ST elevation present.",
    clinicalLookFor: "Check leads II/III/aVF for ST elevation.",
  };
  assert.throws(
    () => validateEmergencyPatternQuestion(q),
    /tagged "ecg" requires ClinicalMedia with type image\/video\/ecg/,
  );
});

test("validateEmergencyPatternQuestion throws when altered-loc + hypoglycemia option is missing glucose", () => {
  const q: EmergencyPatternQuestion = {
    id: "test-altered-loc-no-glucose",
    tags: ["altered-loc"],
    clinicalData: { vitals: { HR: 72, BP: "118/76", RR: 14, SpO2: 99 } },
    // No glucose set
    answerOptions: ["Hypoglycemia", "Stroke", "Overdose"],
    correctAnswerId: "Hypoglycemia",
    rationale: "Hypoglycemia is a common cause of altered LOC. Glucose check is required.",
    clinicalLookFor: "Check glucose immediately.",
  };
  assert.throws(
    () => validateEmergencyPatternQuestion(q),
    /altered-LOC question with hypoglycemia option requires clinicalData\.glucose/,
  );
});

test("validateEmergencyPatternQuestion passes a valid well-formed question", () => {
  const q: EmergencyPatternQuestion = {
    id: "test-valid-q",
    tags: ["ecg"],
    clinicalData: {
      vitals: { HR: 88, BP: "104/68", RR: 18, SpO2: 96 },
    },
    clinicalMedia: {
      type: "ecg",
      url: "https://cdn.example.com/ecg/stemi-inferior.png",
      label: "12-lead ECG showing inferior STEMI",
    },
    answerOptions: [
      "Inferior STEMI — priority transport for primary PCI",
      "Normal sinus rhythm — reassess in 5 min",
      "Atrial fibrillation — rate control en route",
    ],
    correctAnswerId: "Inferior STEMI — priority transport for primary PCI",
    rationale:
      "ST elevation in leads II, III, and aVF with reciprocal changes in aVL is consistent with inferior STEMI. Priority transport to PCI-capable centre is indicated.",
    distractorRationales: {
      "Normal sinus rhythm — reassess in 5 min": "ST elevation is clearly present — dismissing it is dangerous.",
      "Atrial fibrillation — rate control en route": "Rhythm is sinus; rate control is incorrect management.",
    },
    clinicalLookFor:
      "ST elevation ≥1 mm in two contiguous inferior leads; reciprocal depression in lateral leads.",
    timedPattern: {
      stimulus: "Chest pain + ST elevation in II/III/aVF",
      timeLimitMs: 10000,
      expectedPattern: "Inferior STEMI",
      expectedAction: "Priority transport to PCI centre",
      escalationCriteria: ["Cardiogenic shock", "Persistent hypotension", "Complete AV block"],
    },
  };
  assert.doesNotThrow(() => validateEmergencyPatternQuestion(q));
});

test("TimedPattern shape supports rapid recognition pattern recognition layer", () => {
  const timed: TimedPattern = {
    stimulus: "BP 78/44 + HR 142 + cool clammy skin",
    timeLimitMs: 10000,
    expectedPattern: "Hypovolemic shock",
    expectedAction: "IV access + fluid resuscitation + priority transport",
    escalationCriteria: [
      "HR > 150",
      "BP < 70/40",
      "Unresponsive to 500 mL fluid bolus",
    ],
  };
  assert.equal(typeof timed.stimulus, "string");
  assert.equal(typeof timed.timeLimitMs, "number");
  assert.equal(typeof timed.expectedPattern, "string");
  assert.equal(typeof timed.expectedAction, "string");
  assert.ok(Array.isArray(timed.escalationCriteria));
  assert.ok(timed.escalationCriteria.length > 0);
  assert.ok(timed.timeLimitMs > 0);
});
