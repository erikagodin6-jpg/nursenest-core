/**
 * Writes rn-nclex-fluids-electrolytes-expansion-catalog.json for ca-rn-nclex-rn + us-rn-nclex-rn.
 * Run: node scripts/generate-rn-fluids-electrolytes-expansion-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FLUIDS_ELECTROLYTES_EXPANSION_DEFS_A } from "./fluids-electrolytes-expansion-defs-a.mjs";
import { FLUIDS_ELECTROLYTES_EXPANSION_DEFS_B } from "./fluids-electrolytes-expansion-defs-b.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(
  __dirname,
  "../src/content/pathway-lessons/rn-nclex-fluids-electrolytes-expansion-catalog.json",
);

const DEFS = [...FLUIDS_ELECTROLYTES_EXPANSION_DEFS_A, ...FLUIDS_ELECTROLYTES_EXPANSION_DEFS_B];

const DISPLAY_TOPIC = "Fluids, Electrolytes & Acid-Base";
const TOPIC_SLUG = "fluids-electrolytes";
const BODY_SYSTEM = "Renal";

function pathwayIntro(pathwayId) {
  if (pathwayId === "ca-rn-nclex-rn") {
    return `Canadian items may show **SI units** (mmol/L) for electrolytes and glucose where the stem uses metric labs; prioritization logic matches NCLEX-RN.

**Pathway context (RN, Canada).** This lesson supports NCLEX-RN preparation with Canada-friendly framing. Continue with related lessons from the [pathway lesson hub](/canada/rn/nclex-rn/lessons).`;
  }
  return `US NCLEX-RN items often test **K⁺ and ECG emergencies**, **safe sodium correction**, **fluid tonicity mistakes**, **ABG interpretation with compensation**, and **DKA/HHS potassium safety**.

**Pathway context (RN, United States).** Continue with related lessons from the [pathway lesson hub](/us/rn/nclex-rn/lessons).`;
}

function buildLesson(def, pathwayId) {
  const intro = pathwayIntro(pathwayId);
  const seoDescription = `Clinical review: ${def.seoTitle.replace(" | NCLEX-RN | NurseNest", "")} — ${DISPLAY_TOPIC}. Board-style clinical judgment: priorities, red flags, and first-line nursing actions.`;

  const clinical_meaning = `**${def.title}** (${DISPLAY_TOPIC}) links **volume status, tonicity, electrolyte shifts, and acid–base balance** to nursing judgment: recognize **hyperkalemia with conduction emergencies**, **symptomatic hyponatremia and overcorrection risk**, **pulmonary edema from fluid overload**, **unsafe potassium infusions**, **calcium/tetany emergencies**, **magnesium toxicity**, and **ABG patterns** under pressure—and escalate when airway, perfusion, or rhythm is threatened.

${intro}

**Learning objectives**
- Integrate **vitals, I&O, weights, lung exam, neuro status, ECG, and BMP/ABG** to identify fluid and electrolyte emergencies.
- Select **nursing interventions and teaching** aligned with orders, scope, pharmacy protocols, and facility policy.
- Communicate **early** when findings suggest **unstable hyperkalemia**, **seizing hyponatremia**, **respiratory failure with acidosis**, **rapid sodium shifts**, or **incompatible IV electrolyte orders**.`;

  const exam_relevance = `Examiners use **${def.title}** to probe prioritization, monitoring, and escalation under time pressure.

${def.exam}

Eliminate answers that **skip ECG or neuro checks** when K or Na is extreme, **push IV potassium**, **correct sodium too fast** without monitoring, **ignore rising lactate**, or **delegate** unstable assessment. Boards often use "first," "priority," or "most important" language—choose the option that **reduces harm fastest** for the deteriorating client.`;

  const core_concept = `**Nursing priorities (high yield)**
${def.bullets}

**Red flags / safety alerts**
- **Hyperkalemia**: peaked T → wide QRS → sine wave—**calcium for ECG instability**, then **insulin/glucose** per orders; **never IV push** concentrated potassium.
- **Hyponatremia**: seizures or acute severe symptoms → **hypertonic saline** pathways with **strict correction limits**; **ODS** if corrected too fast.
- **Hypernatremia / DI**: **free water deficit** replacement **slowly**; track neuro status.
- **Fluid overload**: crackles + hypoxia + weight gain → **oxygen, positioning, provider activation**—not more isotonic bolus without indication.
- **Metabolic acidosis**: treat **cause** (sepsis, DKA, ischemic gut, toxins)—bicarbonate only when criteria match the stem.
- **COPD CO₂ narcosis**: **ventilation** strategy over blind high oxygen.

**Patient teaching (stable contexts)**
- Teach **daily weights**, **low-sodium diet literacy**, **fluid restriction measurement**, **when to call for swelling or SOB**, **oral rehydration** when appropriate, and **medication adherence** for diuretics/ACE inhibitors with lab monitoring.

**NCLEX-style clinical reasoning**
- Match **data → risk → first action**; avoid teaching-first answers when **rhythm, airway, seizure, or perfusion** is acutely threatened.
- When multiple clients compete, pick the client who **decompensates fastest** if unattended.`;

  const clinical_scenario = `**Patient vignette.** A client scenario related to **${def.hook}** brings fluid and electrolyte risks to the foreground. You pair **focused assessment** (vitals, lung sounds, edema, neuro checks, ECG, strict I&O) with **labs** when provided, follow **IV and electrolyte orders with double-checks**, and **notify the provider or activate the emergency team** when policy criteria are met.

**Clinical application:** The correct "first" action closes the **highest-risk gap**—usually **airway/oxygen**, **ECG/telemetry escalation**, **stop harmful infusions**, **seizure precautions**, **emergent labs**, or **rapid response activation**—rather than routine documentation alone.

**Exam fork:** If the stem clusters **peaked T waves**, **new confusion with Na 118**, or **Kussmaul breathing with gap acidosis**, prioritize **protocol-driven rescue and monitoring** over discharge planning.`;

  const hubPath = pathwayId === "ca-rn-nclex-rn" ? "/canada/rn/nclex-rn/lessons" : "/us/rn/nclex-rn/lessons";
  const takeaways = `- Tie **ECG + K⁺**, **neuro + Na⁺**, **lungs + weight + I&O**, and **ABG trend** before comfort-only tasks when risk is rising.
- Use the Fluids & Electrolytes topic hub (**\`${TOPIC_SLUG}\`**) to cluster practice with related lessons.
- Link review: [Fluid balance acute care](LESSON:fluid-balance-acute-care) · [Na disorders](LESSON:hyponatremia-vs-hypernatremia-hy) · [K disorders](LESSON:hypo-vs-hyperkalemia-hy) · [ABG basics](LESSON:abg-interpretation-basics-hy) · [SIADH vs DI basics](LESSON:siadh-vs-di-basics) · [DKA vs HHS](LESSON:dka-vs-hhs-priorities-hy) · [pathway lesson hub](${hubPath})

**Takeaway drill:** Name the **life threat**, the **two objective findings** you recheck first, and the **single escalation** that matches policy—then pick the answer that matches that sequence.`;

  return {
    slug: def.slug,
    title: def.title,
    topic: DISPLAY_TOPIC,
    topicSlug: TOPIC_SLUG,
    bodySystem: BODY_SYSTEM,
    previewSectionCount: 1,
    seoTitle: def.seoTitle,
    seoDescription,
    sections: [
      { id: "clinical_meaning", heading: "Clinical meaning", kind: "clinical_meaning", body: clinical_meaning },
      { id: "exam_relevance", heading: "Exam relevance", kind: "exam_relevance", body: exam_relevance },
      { id: "core_concept", heading: "Core concept", kind: "core_concept", body: core_concept },
      { id: "clinical_scenario", heading: "Clinical scenario", kind: "clinical_scenario", body: clinical_scenario },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: takeaways },
    ],
  };
}

const pathways = {
  "ca-rn-nclex-rn": DEFS.map((d) => buildLesson(d, "ca-rn-nclex-rn")),
  "us-rn-nclex-rn": DEFS.map((d) => buildLesson(d, "us-rn-nclex-rn")),
};

const out = {
  version: 1,
  generatedAt: new Date().toISOString(),
  source: "scripts/generate-rn-fluids-electrolytes-expansion-catalog.mjs",
  pathways,
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(`Wrote ${outPath} (${DEFS.length} lessons x 2 pathways)`);
