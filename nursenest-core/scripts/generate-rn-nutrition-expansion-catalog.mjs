/**
 * Writes rn-nclex-nutrition-expansion-catalog.json for ca-rn-nclex-rn + us-rn-nclex-rn.
 * Run: node scripts/generate-rn-nutrition-expansion-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NUTRITION_EXPANSION_DEFS_A } from "./nutrition-expansion-defs-a.mjs";
import { NUTRITION_EXPANSION_DEFS_B } from "./nutrition-expansion-defs-b.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../src/content/pathway-lessons/rn-nclex-nutrition-expansion-catalog.json");

const DEFS = [...NUTRITION_EXPANSION_DEFS_A, ...NUTRITION_EXPANSION_DEFS_B];

function pathwayIntro(pathwayId) {
  if (pathwayId === "ca-rn-nclex-rn") {
    return `Canadian items may use **metric** units (including **mmol/L** for glucose where shown) and provincial wording; prioritization logic matches NCLEX-RN.

**Pathway context (RN, Canada).** This lesson supports NCLEX-RN preparation with Canada-friendly practice framing (SI measures where shown, interprofessional norms). Continue with related lessons from the [pathway lesson hub](/canada/rn/nclex-rn/lessons).`;
  }
  return `US NCLEX-RN items often test **unstable vs stable**, **delegation**, and **first action** sequencing.

**Pathway context (RN, United States).** Continue with related lessons from the [pathway lesson hub](/us/rn/nclex-rn/lessons).`;
}

function buildLesson(def, pathwayId) {
  const intro = pathwayIntro(pathwayId);
  const displayTopic = "Nutrition";
  const seoDescription = `Clinical review: ${def.seoTitle.replace(" | NCLEX-RN | NurseNest", "")} — ${displayTopic}. Board-style clinical judgment: priorities, red flags, and first-line nursing actions.`;

  const clinical_meaning = `**${def.title}** (${displayTopic}) links screening, therapeutic diets, oral and enteral support, and parenteral nutrition safety to nursing judgment: protect **airway and aspiration risk**, maintain **glycemic stability**, correct **dehydration and electrolyte disturbances** per orders, watch for **refeeding syndrome**, and escalate when nutrition problems drive **acute instability**.

${intro}

**Learning objectives**
- Integrate **intake history, diet orders, weights, I and O, glucose, and relevant labs** to identify nutrition-related risks and complications.
- Select **nursing interventions and teaching** aligned with orders, scope, dietitian and provider plans, and facility policy.
- Communicate **early** when findings suggest **aspiration**, **symptomatic hypoglycemia or hyperglycemia**, **critical electrolyte imbalance**, **fluid overload or deficit**, **tube misplacement or dislodgement**, **TPN line infection**, or **rapid decline from malnutrition**.`;

  const exam_relevance = `Examiners use **${def.title}** to probe prioritization, monitoring, and escalation under time pressure.

${def.exam}

Eliminate answers that **skip assessment**, **delay escalation** when data show risk, or **delegate** RN-level clinical judgment inappropriately. Boards often use "first," "priority," or "most important" language—choose the option that **reduces harm fastest** for the deteriorating client.`;

  const core_concept = `**Nursing priorities (high yield)**
${def.bullets}

**Red flags / safety alerts**
- **Aspiration**: coughing, wet voice, desaturation during feeding or med pass → stop oral intake, elevate HOB, assess, notify per policy.
- **Hypoglycemia / hyperglycemia**: altered mental status, diaphoresis, Kussmaul, rapid glucose swings with TPN or diabetes → treat per protocol and notify when thresholds met.
- **Electrolytes**: symptomatic **hypo- or hyperkalemia**, **rapid sodium shifts**, **tetany** with calcium or magnesium disturbance → continuous monitoring and replacement only per orders.
- **Refeeding syndrome**: phosphate, potassium, magnesium drops with edema or arrhythmias after starting feeds in malnourished clients → slow advancement and urgent reporting.
- **Enteral/TPN access**: sudden abdominal pain, high residuals per policy, emesis, fever with central line → stop and escalate per orders.

**Patient teaching (stable contexts)**
- Teach **diet level**, **fluid and sodium** restrictions, **carb consistency**, **food safety**, and **when to call** for inability to swallow, repeated vomiting, or glucose extremes.
- Reinforce **cultural respect**, **literacy-appropriate** materials, and **follow-up** with outpatient dietitian when ordered.

**NCLEX-style clinical reasoning**
- Match **data → risk → first action**; avoid teaching-first answers when airway, perfusion, or glucose crisis is present.
- When multiple clients compete, pick the client who **decompensates fastest** if unattended.`;

  const clinical_scenario = `**Patient vignette.** A client scenario related to **${def.hook}** brings nutrition risks to the foreground. You pair **focused assessment** (swallow, GI tolerance, glucose, weight trend, line or tube site) with **vitals and labs** when provided, maintain **aspiration precautions**, follow **diet and infusion orders**, and **notify the provider or activate the emergency team** when policy criteria are met.

**Clinical application:** You compare competing tasks. The correct "first" action closes the **highest-risk gap**—usually **stop unsafe intake**, **assess airway and breathing**, **verify access**, **check glucose**, or **obtain critical labs**—rather than routine tray delivery or delayed reporting alone.

**Exam fork:** If the stem clusters **desaturation during feeding**, **rigors with central line TPN**, **refractory vomiting with distension**, or **seizures with critically low glucose**, prioritize **life-saving sequences** that match unit protocol and NCLEX-RN expectations.`;

  const hubPath = pathwayId === "ca-rn-nclex-rn" ? "/canada/rn/nclex-rn/lessons" : "/us/rn/nclex-rn/lessons";
  const takeaways = `- Tie **weights + I and O + glucose + diet order + swallow status** (and **tube/line checks** when relevant) before routine tasks when risk is rising.
- Use the nutrition topic hub (**\`nutrition\`**) to cluster practice with related lessons.
- Link review: [Enteral feeding tube safety](LESSON:enteral-feeding-tube-safety) · [TPN line care basics](LESSON:tpn-line-care-basics) · [pathway lesson hub](${hubPath})

**Takeaway drill:** Name the **life threat**, the **two objective findings** you recheck first, and the **single escalation** that matches policy—then pick the answer that matches that sequence.`;

  return {
    slug: def.slug,
    title: def.title,
    topic: displayTopic,
    topicSlug: "nutrition",
    bodySystem: "Gastrointestinal",
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
  source: "scripts/generate-rn-nutrition-expansion-catalog.mjs",
  pathways,
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(`Wrote ${outPath} (${DEFS.length} lessons x 2 pathways)`);
