/**
 * Writes rn-nclex-respiratory-expansion-catalog.json for ca-rn-nclex-rn + us-rn-nclex-rn.
 * Run: node scripts/generate-rn-respiratory-expansion-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RESPIRATORY_EXPANSION_DEFS_A } from "./respiratory-expansion-defs-a.mjs";
import { RESPIRATORY_EXPANSION_DEFS_B } from "./respiratory-expansion-defs-b.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../src/content/pathway-lessons/rn-nclex-respiratory-expansion-catalog.json");

const DEFS = [...RESPIRATORY_EXPANSION_DEFS_A, ...RESPIRATORY_EXPANSION_DEFS_B];

function pathwayIntro(pathwayId) {
  if (pathwayId === "ca-rn-nclex-rn") {
    return `Canadian items may use **metric** units and provincial isolation wording; prioritization logic matches NCLEX-RN.

**Pathway context (RN, Canada).** This lesson supports NCLEX-RN preparation with Canada-friendly practice framing (SI measures where shown, interprofessional norms). Continue with related lessons from the [pathway lesson hub](/canada/rn/nclex-rn/lessons).`;
  }
  return `US NCLEX-RN items often test **unstable vs stable**, **airway first**, and **ventilator/chest tube** emergencies.

**Pathway context (RN, United States).** Continue with related lessons from the [pathway lesson hub](/us/rn/nclex-rn/lessons).`;
}

function buildLesson(def, pathwayId) {
  const intro = pathwayIntro(pathwayId);
  const displayTopic = "Respiratory";
  const seoDescription = `Clinical review: ${def.seoTitle.replace(" | NCLEX-RN | NurseNest", "")} — ${displayTopic}. Board-style clinical judgment: priorities, red flags, and first-line nursing actions.`;

  const clinical_meaning = `**${def.title}** (${displayTopic}) links assessment, oxygen delivery, airway management, infection prevention, and critical care monitoring to nursing judgment: protect **airway and breathing**, titrate **oxygen per orders and targets**, recognize **acute deterioration** (silent chest, fatigue, rising CO₂, tension pneumothorax), support **ventilation and chest drainage** safely, and escalate when respiratory failure threatens perfusion or mentation.

${intro}

**Learning objectives**
- Integrate **inspection, work of breathing, SpO₂, ABG when shown, breath sounds, ventilator/chest tube cues, and mentation** to identify respiratory emergencies and complications.
- Select **nursing interventions and teaching** aligned with orders, scope, RT and provider plans, and facility policy.
- Communicate **early** when findings suggest **complete obstruction**, **tension pneumothorax**, **massive hemothorax**, **ventilator failure**, **sudden desaturation with altered LOC**, or **rapid clinical decline**.`;

  const exam_relevance = `Examiners use **${def.title}** to probe prioritization, monitoring, and escalation under time pressure.

${def.exam}

Eliminate answers that **skip airway assessment**, **delay escalation** when data show instability, or **delegate** RN-level clinical judgment inappropriately. Boards often use "first," "priority," or "most important" language—choose the option that **reduces harm fastest** for the deteriorating client.`;

  const core_concept = `**Nursing priorities (high yield)**
${def.bullets}

**Red flags / safety alerts**
- **Airway compromise**: stridor, inability to handle secretions, **silent chest**, sudden voice change → activate emergency support per protocol; **position of comfort** when upper obstruction suspected.
- **Oxygen toxicity / hyperoxia in retainers**: somnolence with **rising PaCO₂**—titrate to **ordered SpO₂ targets** and escalate ventilation support when acidosis worsens.
- **Tension pneumothorax**: hypotension, **distended neck veins**, unilateral absent sounds, tracheal shift (late) → emergency decompression themes; do not delay for routine imaging when stem portrays classic shock.
- **Chest tube**: sudden **increased** air leak, **1500 mL**-type rapid blood loss thresholds when stem states policy, **dislodgement** → occlusive dressing and immediate notification.
- **Ventilator alarms**: **never silence without assessment**; treat **client** before **machine** unless circuit disconnect is obvious and safe to fix immediately.

**Patient teaching (stable contexts)**
- Teach **device use** (NC, mask, CPAP), **signs of worsening** (worsening dyspnea, new cyanosis, fever), **infection prevention** at home when applicable, and **when to call emergency services**.

**NCLEX-style clinical reasoning**
- Match **data → risk → first action**; avoid teaching-first answers when airway, breathing, or perfusion is threatened.
- When multiple clients compete, pick the client who **decompensates fastest** if unattended.`;

  const clinical_scenario = `**Patient vignette.** A client scenario related to **${def.hook}** brings respiratory risks to the foreground. You pair **focused assessment** (work of breathing, auscultation, SpO₂ trend, mental status, device and tube checks) with **vitals and labs** when provided, maintain **oxygen and isolation per orders**, follow **ventilation and drainage plans**, and **notify the provider or activate the emergency team** when policy criteria are met.

**Clinical application:** You compare competing tasks. The correct "first" action closes the **highest-risk gap**—usually **assess airway**, **support breathing**, **verify tube/circuit**, **relieve life threats**, or **obtain critical diagnostics**—rather than routine comfort measures alone.

**Exam fork:** If the stem clusters **stridor with drooling**, **sudden unilateral absent breath sounds with shock**, **high-pressure vent alarm with desaturation**, or **massive hemothorax**, prioritize **life-saving sequences** that match unit protocol and NCLEX-RN expectations.`;

  const hubPath = pathwayId === "ca-rn-nclex-rn" ? "/canada/rn/nclex-rn/lessons" : "/us/rn/nclex-rn/lessons";
  const takeaways = `- Tie **RR + work of breathing + SpO₂ + mentation + breath sounds** (and **ventilator/chest tube** checks when relevant) before routine tasks when respiratory risk is rising.
- Use the respiratory topic hub (**\`respiratory\`**) to cluster practice with related lessons.
- Link review: [ABG basics](LESSON:abg-interpretation-basics-hy) · [COPD oxygen](LESSON:copd-exacerbation-oxygen) · [pneumonia oxygenation](LESSON:pneumonia-oxygenation) · [pleural effusion & chest tubes](LESSON:pleural-effusion-chest-tubes) · [pathway lesson hub](${hubPath})

**Takeaway drill:** Name the **life threat**, the **two objective findings** you recheck first, and the **single escalation** that matches policy—then pick the answer that matches that sequence.`;

  return {
    slug: def.slug,
    title: def.title,
    topic: displayTopic,
    topicSlug: "respiratory",
    bodySystem: "Respiratory",
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
  source: "scripts/generate-rn-respiratory-expansion-catalog.mjs",
  pathways,
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(`Wrote ${outPath} (${DEFS.length} lessons x 2 pathways)`);
