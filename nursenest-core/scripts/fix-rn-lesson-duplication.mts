#!/usr/bin/env tsx
/**
 * RN lesson duplication audit + repair.
 *
 * Run from repo root:
 *   cd nursenest-core
 *   npx tsx scripts/fix-rn-lesson-duplication.mts --dry-run
 *   npx tsx scripts/fix-rn-lesson-duplication.mts --fix
 *   npx tsx scripts/fix-rn-lesson-duplication.mts --fix --slug cardiac-catheterization
 *
 * Purpose:
 * - Finds RN lessons where the template has duplicated generic clinical-deterioration prose.
 * - Repairs the cardiac catheterization lesson with concise, procedure-specific RN content.
 * - Removes exact duplicate sections/sentences from RN catalog JSON without touching non-RN slices.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type Section = {
  id?: string;
  kind?: string;
  heading?: string;
  body?: string;
};

type Lesson = {
  slug?: string;
  title?: string;
  tier?: string;
  bodySystem?: string;
  topic?: string;
  pathwayIds?: string[];
  sections?: Section[];
  linked_flashcard_prompts?: string[];
  [key: string]: unknown;
};

type Catalog = {
  pathways?: Record<string, { lessons?: Lesson[] } | Lesson[]>;
  lessons?: Lesson[];
  [key: string]: unknown;
};

type Finding = {
  file: string;
  pathway: string;
  slug: string;
  title: string;
  score: number;
  issues: string[];
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const argv = process.argv.slice(2);
const FIX = argv.includes("--fix");
const DRY_RUN = argv.includes("--dry-run") || !FIX;
const slugFilter = valueAfter("--slug");

const BOILERPLATE_PATTERNS: Array<{ label: string; regex: RegExp }> = [
  { label: "generic-bedside-practice-repeat", regex: /In bedside practice, .+?should always be interpreted in the context of trend data, focused reassessment, communication with the provider, and escalation/gi },
  { label: "generic-pathophysiology-fill", regex: /These mechanisms explain why patients with .+? develop recognizable changes in tissue perfusion, oxygen delivery, inflammation, compensatory responses, and downstream organ stress/gi },
  { label: "generic-priority-fill", regex: /requires early recognition, careful trend assessment, and rapid prioritization when the patient begins to deteriorate/gi },
  { label: "generic-critical-values-fill", regex: /Examples of clinically important numeric patterns include SpO2 <90%, SBP <90 mm Hg, MAP <65 mm Hg/gi },
  { label: "generic-medical-treatment-fill", regex: /Treatment decisions for .+? should focus on the medical goal: improving oxygenation, perfusion, rhythm stability/gi },
];

const CARDIAC_CATH_SECTIONS: Section[] = [
  {
    id: "overview",
    kind: "overview",
    heading: "Overview",
    body: "Cardiac catheterization is an invasive diagnostic or interventional procedure in which a catheter is advanced through the radial or femoral artery to evaluate coronary blood flow, cardiac pressures, valve function, and structural disease. It may be paired with angiography, percutaneous coronary intervention, balloon angioplasty, or stent placement. RN care focuses on preparation, allergy and renal-risk screening, post-procedure hemostasis, rhythm monitoring, distal perfusion, and early recognition of bleeding or ischemic complications. The most important nursing shift is from routine pre-procedure preparation to high-frequency post-procedure surveillance because access-site bleeding, retroperitoneal hemorrhage, dysrhythmias, stroke, or acute vessel occlusion can evolve quickly.",
  },
  {
    id: "pathophysiology",
    kind: "pathophysiology",
    heading: "Pathophysiology",
    body: "The catheter enters the arterial circulation and can temporarily disrupt vascular integrity, platelet activation, coronary perfusion, and electrical stability. Contrast dye makes coronary anatomy visible but increases osmotic load and can worsen kidney injury in patients with chronic kidney disease, dehydration, diabetes, or recent nephrotoxic exposure. Femoral access creates risk for external bleeding, hematoma, pseudoaneurysm, and retroperitoneal bleeding because the puncture site is close to large vessels and deeper tissue planes. Radial access lowers major bleeding risk but still requires careful hand perfusion assessment because radial artery spasm, thrombosis, or excessive compression can compromise circulation. During coronary intervention, plaque manipulation and balloon inflation may transiently reduce coronary flow, triggering chest pain, ischemic ECG changes, dysrhythmias, or hemodynamic instability.",
  },
  {
    id: "risk_factors",
    kind: "risk_factors",
    heading: "Risk factors",
    body: "Higher-risk patients include older adults, patients receiving anticoagulants or antiplatelets, patients with thrombocytopenia or coagulopathy, and patients with chronic kidney disease, diabetes, heart failure, or prior contrast reaction. Femoral access increases concern for immobility-related bleeding if the patient bends the hip, sits up too early, coughs forcefully, or strains. Radial access requires attention to prior radial procedures, abnormal Allen or Barbeau testing when used by local protocol, small vessel size, and hand ischemia symptoms. Baseline hypotension, active chest pain, acute coronary syndrome, severe aortic stenosis, or unstable rhythms make the post-procedure period higher acuity.",
  },
  {
    id: "signs_symptoms",
    kind: "signs_symptoms",
    heading: "Signs & Symptoms",
    body: "Expected post-procedure findings include mild localized tenderness and a stable dressing without expansion of drainage. Concerning findings are new chest pain, shortness of breath, diaphoresis, dysrhythmia, hypotension, tachycardia, altered level of consciousness, loss of distal pulse, cool or pale extremity, numbness, tingling, expanding hematoma, or uncontrolled oozing. After femoral access, new flank pain, back pain, abdominal fullness, falling blood pressure, or unexplained tachycardia should be treated as possible retroperitoneal bleeding until proven otherwise. After radial access, hand pain, cyanosis, delayed capillary refill, paresthesia, or absent pulse distal to the compression device may indicate impaired perfusion from excessive compression, spasm, or thrombosis.",
  },
  {
    id: "diagnostics_labs",
    kind: "diagnostics_labs",
    heading: "Diagnostics & Labs",
    body: "Before the procedure, verify ordered ECG, baseline vital signs, renal function, CBC, coagulation studies when indicated, pregnancy testing when relevant, and contrast allergy history. Creatinine and estimated GFR matter because contrast exposure can precipitate acute kidney injury, especially when the patient is volume depleted or taking nephrotoxic medications. Platelets, hemoglobin, hematocrit, INR, PT, and aPTT help estimate bleeding risk and provide a baseline if post-procedure bleeding is suspected. After the procedure, trend vital signs, access-site appearance, distal neurovascular status, urine output, ECG rhythm, and recurrent chest pain. A falling hemoglobin, reduced urine output, new ST changes, or unstable rhythm should change urgency immediately.",
  },
  {
    id: "nursing_interventions",
    kind: "nursing_interventions",
    heading: "Nursing Interventions",
    body: "Pre-procedure priorities are confirming informed consent, checking allergies to contrast or iodine-containing products as documented by local policy, reviewing anticoagulant and antiplatelet instructions, maintaining NPO status if ordered, verifying IV access, documenting baseline distal pulses and neurovascular status, and teaching the patient what to expect. Post-procedure priorities are frequent vital signs, continuous or ordered rhythm monitoring, access-site checks, distal pulse checks, skin color and temperature assessment, pain assessment, and prompt escalation of bleeding or ischemic symptoms. For femoral access, keep the affected leg straight, avoid hip flexion, maintain ordered bedrest, and apply manual pressure or activate help for bleeding. For radial access, assess circulation frequently and release compression only according to protocol.",
  },
  {
    id: "red_flags",
    kind: "red_flags",
    heading: "Red Flags / Danger Signs",
    body: "Escalate immediately for sudden hypotension, tachycardia with pallor or diaphoresis, expanding hematoma, active bleeding not controlled with pressure, severe back or flank pain after femoral access, new chest pain, shortness of breath, acute neurologic deficit, decreased level of consciousness, loss of distal pulse, cool or mottled extremity, or severe hand pain after radial access. These are not routine monitoring findings; they suggest hemorrhage, vessel occlusion, recurrent ischemia, stroke, dysrhythmia, or shock. The safest RN response is to stay with the patient, call for help, apply pressure if bleeding is visible, reassess ABCs and perfusion, obtain objective data, and notify the provider or rapid response team according to severity.",
  },
  {
    id: "complications",
    kind: "complications",
    heading: "Complications",
    body: "Major complications include bleeding, hematoma, pseudoaneurysm, arteriovenous fistula, retroperitoneal hemorrhage, contrast-induced nephropathy, allergic or anaphylactoid contrast reaction, dysrhythmias, coronary artery dissection, acute vessel closure, myocardial infarction, stroke, infection, and vascular occlusion. Femoral complications often present as access-site bleeding, thigh/groin swelling, bruising, hypotension, or back/flank pain. Radial complications often present as hand ischemia symptoms, numbness, pain, or weak distal flow. Contrast nephropathy may present later with reduced urine output or rising creatinine, so hydration instructions and follow-up matter.",
  },
  {
    id: "patient_education",
    kind: "patient_education",
    heading: "Patient & Client Education",
    body: "Teach the patient to keep the affected extremity still as instructed, avoid heavy lifting and strenuous activity for the ordered period, inspect the access site, and report bleeding, swelling, increasing pain, numbness, tingling, fever, drainage, chest pain, shortness of breath, syncope, or new neurologic symptoms. If bleeding occurs at home, the patient should apply firm pressure and seek emergency help if it does not stop or if symptoms of shock occur. Encourage fluids after contrast if not contraindicated by heart failure, renal restriction, or provider order. Use teach-back: 'Show me where you will check the site and tell me which symptoms mean you need emergency care.'",
  },
  {
    id: "clinical_pearls",
    kind: "clinical_pearls",
    heading: "Clinical Pearls",
    body: "The common NCLEX trap is choosing documentation, routine teaching, or comfort measures before addressing bleeding, perfusion loss, chest pain, or neurologic change. For femoral access, severe back pain plus hypotension is retroperitoneal bleeding until proven otherwise. For radial access, the hand matters more than the appearance of the wrist dressing alone. Always compare distal pulses, capillary refill, skin temperature, sensation, and movement to baseline. Do not ambulate a femoral-access patient early, do not ignore a small hematoma that is expanding, and do not remove or loosen radial compression outside protocol.",
  },
  {
    id: "clinical_decision_making",
    kind: "clinical_decision_making",
    heading: "Clinical Decision-Making & Priorities",
    body: "First decide whether the patient is stable or showing hemorrhage, ischemia, dysrhythmia, stroke symptoms, or impaired distal perfusion. The first action for visible access-site bleeding is direct pressure while calling for help. The first action for loss of distal pulse or cool extremity is immediate neurovascular reassessment and urgent provider notification. The first action for chest pain after PCI is to assess ABCs, obtain vital signs and rhythm data, follow chest-pain protocol or orders, and escalate because acute re-occlusion is possible. Routine discharge teaching comes only after hemostasis, perfusion, rhythm, and symptoms are stable.",
  },
  {
    id: "case_based_application",
    kind: "case_based_application",
    heading: "Case-Based Application",
    body: "A 68-year-old patient returns from PCI through the right femoral artery. Thirty minutes later the nurse notes BP 88/54, HR 116, increasing groin tenderness, and new lower back pain. The dressing has only a small amount of drainage. The most likely concern is retroperitoneal or access-site bleeding because hypotension and tachycardia suggest blood loss even without dramatic external bleeding. The nurse should stay with the patient, keep the leg straight, assess the groin and abdomen, check distal pulses and skin temperature, apply pressure if external bleeding appears, notify the provider or rapid response team, and prepare for labs, fluids, blood products, or imaging as ordered. Waiting to document or offering reassurance would delay treatment of possible hemorrhage.",
  },
  {
    id: "linked_flashcard_prompts",
    kind: "linked_flashcard_prompts",
    heading: "Linked flashcard prompts",
    body: [
      "1. What are the priority pre-procedure checks before cardiac catheterization?",
      "2. What neurovascular findings must be assessed after femoral or radial access?",
      "3. What findings suggest retroperitoneal bleeding after femoral cardiac cath?",
      "4. What symptoms suggest impaired hand perfusion after radial access?",
      "5. What labs matter before contrast exposure and why?",
      "6. What is the first nursing action for active access-site bleeding?",
      "7. What patient teaching is required after discharge from cardiac catheterization?",
      "8. What NCLEX traps appear in post-cardiac catheterization questions?",
    ].join("\n"),
  },
];

const CARDIAC_CATH_PROMPTS = CARDIAC_CATH_SECTIONS.find((s) => s.kind === "linked_flashcard_prompts")!
  .body!
  .split("\n")
  .map((line) => line.replace(/^\d+\.\s*/, ""));

function valueAfter(flag: string): string | null {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] ?? null : null;
}

function walkJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkJsonFiles(p));
    else if (entry.isFile() && entry.name.endsWith(".json")) out.push(p);
  }
  return out;
}

function isRnPathway(pathway: string): boolean {
  return /(^|[-_])rn($|[-_])|nclex-rn/i.test(pathway);
}

function isRnLesson(lesson: Lesson, pathway: string): boolean {
  if (isRnPathway(pathway)) return true;
  if (String(lesson.tier || "").toLowerCase() === "rn") return true;
  return Array.isArray(lesson.pathwayIds) && lesson.pathwayIds.some(isRnPathway);
}

function normalizeSentence(s: string): string {
  return s
    .toLowerCase()
    .replace(/cardiac catheterization: pre- and post-procedure nursing care/g, "{topic}")
    .replace(/[^a-z0-9{}<>% ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSentences(text: string): string[] {
  return String(text || "")
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 45);
}

function dedupeBody(body: string): { body: string; removed: number } {
  const seen = new Set<string>();
  const kept: string[] = [];
  let removed = 0;
  for (const sentence of splitSentences(body)) {
    const key = normalizeSentence(sentence);
    if (seen.has(key)) {
      removed++;
      continue;
    }
    seen.add(key);
    kept.push(sentence);
  }
  return { body: kept.join(" "), removed };
}

function auditLesson(file: string, pathway: string, lesson: Lesson): Finding | null {
  const sections = Array.isArray(lesson.sections) ? lesson.sections : [];
  const allText = sections.map((s) => s.body || "").join("\n");
  const issues: string[] = [];
  let score = 0;

  for (const pattern of BOILERPLATE_PATTERNS) {
    const matches = allText.match(pattern.regex) || [];
    if (matches.length > 0) {
      score += matches.length * 2;
      issues.push(`${pattern.label}: ${matches.length}`);
    }
  }

  const sentenceCounts = new Map<string, number>();
  for (const s of splitSentences(allText)) {
    const key = normalizeSentence(s);
    sentenceCounts.set(key, (sentenceCounts.get(key) || 0) + 1);
  }
  const repeatedSentences = [...sentenceCounts.values()].filter((n) => n > 1).reduce((sum, n) => sum + n - 1, 0);
  if (repeatedSentences > 0) {
    score += repeatedSentences;
    issues.push(`repeated-sentences: ${repeatedSentences}`);
  }

  const kindCounts = new Map<string, number>();
  for (const section of sections) {
    const key = String(section.kind || section.heading || "unknown").toLowerCase();
    kindCounts.set(key, (kindCounts.get(key) || 0) + 1);
  }
  const duplicateKinds = [...kindCounts.entries()].filter(([, n]) => n > 1);
  if (duplicateKinds.length) {
    score += duplicateKinds.length * 3;
    issues.push(`duplicate-section-kinds: ${duplicateKinds.map(([k, n]) => `${k}x${n}`).join(",")}`);
  }

  if (!score) return null;
  return {
    file: path.relative(pkgRoot, file),
    pathway,
    slug: String(lesson.slug || ""),
    title: String(lesson.title || ""),
    score,
    issues,
  };
}

function looksLikeCardiacCathLesson(lesson: Lesson): boolean {
  const haystack = `${lesson.slug || ""} ${lesson.title || ""} ${lesson.topic || ""}`.toLowerCase();
  return haystack.includes("cardiac-catheterization") || haystack.includes("cardiac catheterization");
}

function repairLesson(lesson: Lesson): { changed: boolean; notes: string[] } {
  const notes: string[] = [];

  if (looksLikeCardiacCathLesson(lesson)) {
    lesson.sections = CARDIAC_CATH_SECTIONS.map((s) => ({ ...s }));
    lesson.linked_flashcard_prompts = [...CARDIAC_CATH_PROMPTS];
    notes.push("replaced cardiac catheterization with procedure-specific RN sections");
    return { changed: true, notes };
  }

  const sections = Array.isArray(lesson.sections) ? lesson.sections : [];
  if (!sections.length) return { changed: false, notes };

  let changed = false;
  const seenSectionBodies = new Set<string>();
  const repairedSections: Section[] = [];

  for (const section of sections) {
    const body = String(section.body || "");
    const normalizedBody = normalizeSentence(body);
    if (normalizedBody && seenSectionBodies.has(normalizedBody)) {
      changed = true;
      notes.push(`removed duplicate section: ${section.kind || section.heading || "unknown"}`);
      continue;
    }
    if (normalizedBody) seenSectionBodies.add(normalizedBody);

    const deduped = dedupeBody(body);
    let nextBody = deduped.body || body;
    if (deduped.removed > 0) {
      changed = true;
      notes.push(`removed ${deduped.removed} repeated sentence(s) from ${section.kind || section.heading || "section"}`);
    }

    // Strip repeated generic bedside-practice footer when it appears as a pasted template paragraph.
    let footerRemoved = 0;
    nextBody = nextBody.replace(BOILERPLATE_PATTERNS[0]!.regex, () => {
      footerRemoved++;
      return "";
    }).replace(/\s{2,}/g, " ").trim();
    if (footerRemoved > 0) {
      changed = true;
      notes.push(`removed generic bedside-practice footer from ${section.kind || section.heading || "section"}`);
    }

    repairedSections.push({ ...section, body: nextBody });
  }

  if (changed) lesson.sections = repairedSections;
  return { changed, notes };
}

function visitLessons(catalog: Catalog, file: string, visitor: (lesson: Lesson, pathway: string) => void): void {
  if (catalog.pathways && typeof catalog.pathways === "object") {
    for (const [pathway, raw] of Object.entries(catalog.pathways)) {
      const lessons = Array.isArray(raw) ? raw : raw.lessons || [];
      for (const lesson of lessons) {
        if (isRnLesson(lesson, pathway)) visitor(lesson, pathway);
      }
    }
  }
  if (Array.isArray(catalog.lessons)) {
    for (const lesson of catalog.lessons) {
      if (isRnLesson(lesson, "lesson-library")) visitor(lesson, "lesson-library");
    }
  }
}

function main(): void {
  const targetFiles = [
    ...walkJsonFiles(path.join(pkgRoot, "src", "content", "pathway-lessons")),
    path.join(pkgRoot, "src", "content", "lessons", "lesson-library.json"),
  ].filter((p, i, arr) => fs.existsSync(p) && arr.indexOf(p) === i);

  const findings: Finding[] = [];
  const repaired: Array<{ file: string; pathway: string; slug: string; title: string; notes: string[] }> = [];
  let scanned = 0;

  for (const file of targetFiles) {
    const raw = fs.readFileSync(file, "utf8");
    const catalog = JSON.parse(raw) as Catalog;
    let dirty = false;

    visitLessons(catalog, file, (lesson, pathway) => {
      if (slugFilter && lesson.slug !== slugFilter && !String(lesson.title || "").toLowerCase().includes(slugFilter.toLowerCase())) return;
      scanned++;
      const finding = auditLesson(file, pathway, lesson);
      if (finding) findings.push(finding);
      if (FIX && finding) {
        const result = repairLesson(lesson);
        if (result.changed) {
          dirty = true;
          repaired.push({
            file: path.relative(pkgRoot, file),
            pathway,
            slug: String(lesson.slug || ""),
            title: String(lesson.title || ""),
            notes: result.notes,
          });
        }
      }
    });

    if (FIX && dirty) fs.writeFileSync(file, `${JSON.stringify(catalog, null, 2)}\n`);
  }

  findings.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  const report = {
    mode: DRY_RUN ? "dry-run" : "fix",
    scannedRnLessons: scanned,
    findings: findings.length,
    repaired: repaired.length,
    topFindings: findings.slice(0, 50),
    repairedLessons: repaired,
  };

  const reportDir = path.join(pkgRoot, "reports");
  fs.mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, "rn-lesson-duplication-audit.json");
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log(JSON.stringify(report, null, 2));
  console.log(`\nReport written: ${path.relative(pkgRoot, reportPath)}`);
  if (DRY_RUN) console.log("\nDry run only. Re-run with --fix to write repairs.");
}

main();
