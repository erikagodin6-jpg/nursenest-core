/**
 * Writes rn-nclex-maternal-newborn-expansion-catalog.json for ca-rn-nclex-rn + us-rn-nclex-rn.
 * Run: node scripts/generate-rn-maternal-newborn-expansion-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MATERNAL_NEWBORN_EXPANSION_DEFS_A } from "./maternal-newborn-expansion-defs-a.mjs";
import { MATERNAL_NEWBORN_EXPANSION_DEFS_B } from "./maternal-newborn-expansion-defs-b.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../src/content/pathway-lessons/rn-nclex-maternal-newborn-expansion-catalog.json");

const DEFS = [...MATERNAL_NEWBORN_EXPANSION_DEFS_A, ...MATERNAL_NEWBORN_EXPANSION_DEFS_B];

function pathwayIntro(pathwayId) {
  if (pathwayId === "ca-rn-nclex-rn") {
    return `Canadian items may use **metric** units and provincial wording; prioritization logic matches NCLEX-RN.

**Pathway context (RN, Canada).** This lesson supports NCLEX-RN preparation with Canada-friendly practice framing (SI measures where shown, interprofessional norms). Continue with related lessons from the [pathway lesson hub](/canada/rn/nclex-rn/lessons).`;
  }
  return `US NCLEX-RN items often test **unstable vs stable**, **delegation**, and **first action** sequencing.

**Pathway context (RN, United States).** Continue with related lessons from the [pathway lesson hub](/us/rn/nclex-rn/lessons).`;
}

function buildLesson(def, pathwayId) {
  const intro = pathwayIntro(pathwayId);
  const displayTopic = "Maternity";
  const seoDescription = `Clinical review: ${def.seoTitle.replace(" | NCLEX-RN | NurseNest", "")} — ${displayTopic}. Board-style clinical judgment: priorities, red flags, and first-line nursing actions.`;

  const clinical_meaning = `**${def.title}** (${displayTopic}) links antepartum risk screening, intrapartum maternal-fetal surveillance, immediate postpartum stabilization, and newborn transition to safe nursing judgment: recognize hemorrhage, severe hypertension and seizure risk, non-reassuring fetal status patterns, cord emergencies, infection, and neonatal respiratory or metabolic compromise, then escalate per policy and orders.

${intro}

**Learning objectives**
- Integrate **maternal vitals, uterine tone, lochia, pain, fetal tracing, and newborn work of breathing** to identify priority threats across the perinatal continuum.
- Select **nursing interventions and teaching** aligned with orders, scope, and unit protocol for labour, OR recovery, and postpartum or newborn liaison themes when shown.
- Communicate **early** when findings suggest **severe hypertension**, **eclampsia**, **magnesium toxicity**, **obstetric hemorrhage**, **uterine rupture**, **shoulder dystocia**, **cord prolapse**, **sepsis**, **respiratory failure**, or **critical newborn hypoglycemia**.`;

  const exam_relevance = `Examiners use **${def.title}** to probe prioritization, monitoring, and escalation under time pressure.

${def.exam}

Eliminate answers that **skip assessment**, **delay escalation** when data show risk, or **delegate** RN-level clinical judgment inappropriately. Boards often use "first," "priority," or "most important" language—choose the option that **reduces harm fastest** for the deteriorating mother or newborn.`;

  const core_concept = `**Nursing priorities (high yield)**
${def.bullets}

**Red flags / safety alerts**
- **Maternal bleeding** with hypotension, tachycardia, or altered mental status → activate hemorrhage pathway per protocol; large-bore access and type and screen themes when shown.
- **Severe-range blood pressure**, **headache with visual changes**, **RUQ pain**, **hyperreflexia**, or **seizure** → preeclampsia/eclampsia cluster; magnesium and antihypertensive safety when ordered.
- **Magnesium toxicity** clues: absent DTRs, respiratory depression, extreme somnolence → stop infusion per order/policy and prepare emergency support.
- **Non-reassuring FHR**, **uterine tachysystole**, **loss of station**, **sudden severe pain** → intrapartum emergency mindset until ruled out.
- **Newborn grunting, nasal flaring, retractions**, **cyanosis**, **apnea**, **temperature instability**, or **feeding refusal with jitteriness** → escalate newborn assessment per protocol.

**Patient teaching (stable contexts)**
- Teach **warning signs** (bleeding, fever, severe headache, decreased fetal movement, fluid gush, regular contractions before term) and **when to call emergency services** versus same-day clinic.
- Reinforce **medication safety**, **breastfeeding or formula preparation basics**, **safe sleep on a firm flat surface**, and **follow-up timing** only as orders and readiness allow.

**NCLEX-style clinical reasoning**
- Match **data → risk → first action**; avoid comfort-only or teaching-first answers when instability is present.
- When multiple patients compete, pick the mother-baby pair who **decompensates fastest** if unattended.`;

  const clinical_scenario = `**Patient vignette.** A perinatal client scenario related to **${def.hook}** brings you to the bedside. You pair **focused maternal and fetal assessment** (or **newborn assessment** when the stem is post-birth) with **vitals, labs, and tracing review** when provided, maintain **airway and perfusion**, protect **bleeding and infection control**, and **notify the provider or activate the emergency team** when policy criteria are met.

**Clinical application:** You compare competing tasks. The correct "first" action closes the **highest-risk gap**—usually reassessment plus escalation for **hemorrhage**, **severe hypertension/seizure**, **cord prolapse**, **shoulder dystocia**, **uterine rupture**, **sepsis**, or **newborn respiratory failure**—rather than routine documentation or delayed reporting alone.

**Exam fork:** If the stem clusters **late decelerations with loss of variability**, **acute abdomen with fetal bradycardia**, **prolapsed cord with bradycardia**, **shoulder dystocia after head delivery**, or **postpartum fundus that fails to contract with heavy bleeding**, prioritize **life-saving sequences** that match your unit protocol and NCLEX-RN expectations.`;

  const hubPath = pathwayId === "ca-rn-nclex-rn" ? "/canada/rn/nclex-rn/lessons" : "/us/rn/nclex-rn/lessons";
  const takeaways = `- Tie **maternal vitals + uterine tone + lochia + pain + fetal status** (and **newborn tone, color, RR, glucose** when relevant) before routine tasks when risk is rising.
- Use the maternity topic hub (**\`maternity\`**) to cluster practice with related lessons.
- Link review: [Postpartum hemorrhage](LESSON:postpartum-hemorrhage) · [Late decelerations & FHR](LESSON:late-decelerations-fhr) · [Preeclampsia vs eclampsia](LESSON:preeclampsia-vs-eclampsia) · [Newborn thermoregulation & feeding](LESSON:newborn-thermoregulation-feeding) · [Rh incompatibility basics](LESSON:rh-incompatibility-basics) · [pathway lesson hub](${hubPath})

**Takeaway drill:** Name the **life threat**, the **two objective findings** you recheck first, and the **single escalation** that matches policy—then pick the answer that matches that sequence.`;

  return {
    slug: def.slug,
    title: def.title,
    topic: displayTopic,
    topicSlug: "maternity",
    bodySystem: "General",
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
  source: "scripts/generate-rn-maternal-newborn-expansion-catalog.mjs",
  pathways,
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(`Wrote ${outPath} (${DEFS.length} lessons x 2 pathways)`);
