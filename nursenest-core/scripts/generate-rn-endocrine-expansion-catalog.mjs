/**
 * Writes rn-nclex-endocrine-expansion-catalog.json for ca-rn-nclex-rn + us-rn-nclex-rn.
 * Run: node scripts/generate-rn-endocrine-expansion-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ENDOCRINE_EXPANSION_DEFS_A } from "./endocrine-expansion-defs-a.mjs";
import { ENDOCRINE_EXPANSION_DEFS_B } from "./endocrine-expansion-defs-b.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../src/content/pathway-lessons/rn-nclex-endocrine-expansion-catalog.json");

const DEFS = [...ENDOCRINE_EXPANSION_DEFS_A, ...ENDOCRINE_EXPANSION_DEFS_B];

function pathwayIntro(pathwayId) {
  if (pathwayId === "ca-rn-nclex-rn") {
    return `Canadian items may use **SI labs** (mmol/L for glucose where shown) and provincial diabetes program wording; prioritization logic matches NCLEX-RN.

**Pathway context (RN, Canada).** This lesson supports NCLEX-RN preparation with Canada-friendly framing. Continue with related lessons from the [pathway lesson hub](/canada/rn/nclex-rn/lessons).`;
  }
  return `US NCLEX-RN items often test **DKA vs HHS**, **insulin and potassium safety**, **thyroid storm vs myxedema**, **adrenal crisis**, and **SIADH vs DI** fluid decisions.

**Pathway context (RN, United States).** Continue with related lessons from the [pathway lesson hub](/us/rn/nclex-rn/lessons).`;
}

function buildLesson(def, pathwayId) {
  const intro = pathwayIntro(pathwayId);
  const displayTopic = "Endocrine";
  const seoDescription = `Clinical review: ${def.seoTitle.replace(" | NCLEX-RN | NurseNest", "")} — ${displayTopic}. Board-style clinical judgment: priorities, red flags, and first-line nursing actions.`;

  const clinical_meaning = `**${def.title}** (${displayTopic}) links glucose regulation, thyroid and adrenal axes, pituitary disorders, and fluid–electrolyte balance to nursing judgment: recognize **hypoglycemia and hyperglycemic emergencies**, **thyroid storm and myxedema coma**, **adrenal crisis**, **severe sodium disorders** from SIADH/DI, **calcium emergencies**, and **medication errors** involving insulin, steroids, and thyroid drugs—and escalate when perfusion, airway, or mentation is threatened.

${intro}

**Learning objectives**
- Integrate **glucose trends, ketones, insulin timing, potassium and sodium trends, vitals, neuro status, and weight/I&O** to identify endocrine emergencies and complications.
- Select **nursing interventions and teaching** aligned with orders, scope, endocrinology and pharmacy plans, and facility policy.
- Communicate **early** when findings suggest **symptomatic hypoglycemia**, **DKA/HHS**, **thyroid storm**, **myxedema coma**, **addisonian crisis**, **severe hypernatremia or hyponatremia**, or **pheochromocytoma hypertensive crisis**.`;

  const exam_relevance = `Examiners use **${def.title}** to probe prioritization, monitoring, and escalation under time pressure.

${def.exam}

Eliminate answers that **skip glucose or neuro checks**, **delay potassium safety** before insulin in DKA, **give free water** inappropriately in SIADH, or **delegate** unstable assessment. Boards often use "first," "priority," or "most important" language—choose the option that **reduces harm fastest** for the deteriorating client.`;

  const core_concept = `**Nursing priorities (high yield)**
${def.bullets}

**Red flags / safety alerts**
- **Hypoglycemia with altered LOC or seizure**: **glucose rescue** per protocol (oral if awake/safe swallow; **IV dextrose** or **glucagon** when unconscious)—never insulin first.
- **DKA/HHS**: **volume + insulin pathway** with **K⁺ checked before and during insulin**; watch for **cerebral edema** themes in pediatric DKA when stem hints.
- **Thyroid storm**: **fever + tachycardia + neuro** cluster—cooling, **beta-blockade** per orders, **antithyroid** therapy; **myxedema coma**: **hypothermia + hypoventilation**—airway, gentle rewarming, **thyroid replacement** per ICU protocol.
- **Adrenal crisis**: **hypotension + hyponatremia + hyperkalemia + hypoglycemia**—stress-dose steroid themes with fluids per orders; never abrupt steroid cessation after chronic use.
- **SIADH**: **fluid restriction** and **slow sodium correction**; **central DI**: **replace water deficit** and **desmopressin** per orders—do not confuse the two fluid strategies.

**Patient teaching (stable contexts)**
- Teach **sick-day rules**, **insulin storage and rotation**, **hypoglycemia recognition and glucagon use**, **steroid taper adherence**, **thyroid drug timing**, and **when to seek emergency care**.

**NCLEX-style clinical reasoning**
- Match **data → risk → first action**; avoid teaching-first answers when glucose, sodium, potassium, airway, or perfusion is acutely threatened.
- When multiple clients compete, pick the client who **decompensates fastest** if unattended.`;

  const clinical_scenario = `**Patient vignette.** A client scenario related to **${def.hook}** brings endocrine risks to the foreground. You pair **focused assessment** (glucose, neuro status, vitals, weight, I&O, breath pattern, skin temperature) with **labs** when provided, follow **insulin and steroid orders precisely**, and **notify the provider or activate the emergency team** when policy criteria are met.

**Clinical application:** The correct "first" action closes the **highest-risk gap**—usually **glucose rescue**, **K⁺ safety check**, **airway support**, **volume resuscitation per order**, **hold harmful fluids/meds**, or **continuous monitoring**—rather than routine comfort measures alone.

**Exam fork:** If the stem clusters **peaked T waves with rising K during DKA treatment**, **temperature >39 with tachyarrhythmia in thyrotoxicosis**, or **sodium correcting too fast with neuro change**, prioritize **protocol-driven reversal and escalation**.`;

  const hubPath = pathwayId === "ca-rn-nclex-rn" ? "/canada/rn/nclex-rn/lessons" : "/us/rn/nclex-rn/lessons";
  const takeaways = `- Tie **glucose + ketones + K⁺ + Na⁺ + vitals + mentation** (and **insulin pump/CGM** checks when relevant) before routine tasks when endocrine risk is rising.
- Use the Endocrine topic hub (**\`endocrine\`**) to cluster practice with related lessons.
- Link review: [DKA vs HHS](LESSON:dka-vs-hhs-priorities-hy) · [SIADH vs DI basics](LESSON:siadh-vs-di-basics) · [Addisonian crisis](LESSON:addisonian-crisis) · [thyroid storm & myxedema](LESSON:thyroid-storm-myxedema-clues) · [pathway lesson hub](${hubPath})

**Takeaway drill:** Name the **life threat**, the **two objective findings** you recheck first, and the **single escalation** that matches policy—then pick the answer that matches that sequence.`;

  return {
    slug: def.slug,
    title: def.title,
    topic: displayTopic,
    topicSlug: "endocrine",
    bodySystem: "Endocrine",
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
  source: "scripts/generate-rn-endocrine-expansion-catalog.mjs",
  pathways,
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(`Wrote ${outPath} (${DEFS.length} lessons x 2 pathways)`);
