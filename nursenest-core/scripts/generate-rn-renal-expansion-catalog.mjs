/**
 * Writes rn-nclex-renal-expansion-catalog.json for ca-rn-nclex-rn + us-rn-nclex-rn.
 * Run: node scripts/generate-rn-renal-expansion-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RENAL_EXPANSION_DEFS_A } from "./renal-expansion-defs-a.mjs";
import { RENAL_EXPANSION_DEFS_B } from "./renal-expansion-defs-b.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../src/content/pathway-lessons/rn-nclex-renal-expansion-catalog.json");

const DEFS = [...RENAL_EXPANSION_DEFS_A, ...RENAL_EXPANSION_DEFS_B];

function pathwayIntro(pathwayId) {
  if (pathwayId === "ca-rn-nclex-rn") {
    return `Canadian items may use **SI labs** (e.g. mmol/L for glucose or creatinine where shown) and provincial unit norms; prioritization logic matches NCLEX-RN.

**Pathway context (RN, Canada).** This lesson supports NCLEX-RN preparation with Canada-friendly framing. Continue with related lessons from the [pathway lesson hub](/canada/rn/nclex-rn/lessons).`;
  }
  return `US NCLEX-RN items often test **hyperkalemia and ECG**, **oliguria**, **fluid overload**, **dialysis access**, and **first actions** in acute change.

**Pathway context (RN, United States).** Continue with related lessons from the [pathway lesson hub](/us/rn/nclex-rn/lessons).`;
}

function buildLesson(def, pathwayId) {
  const intro = pathwayIntro(pathwayId);
  const displayTopic = "Renal & Urinary";
  const seoDescription = `Clinical review: ${def.seoTitle.replace(" | NCLEX-RN | NurseNest", "")} — ${displayTopic}. Board-style clinical judgment: priorities, red flags, and first-line nursing actions.`;

  const clinical_meaning = `**${def.title}** (${displayTopic}) links assessment, fluid and electrolyte balance, urinary elimination, renal replacement therapies, and medication safety to nursing judgment: protect **perfusion and kidney function**, monitor **I&O and weights**, recognize **hyperkalemia**, **oliguria**, **access complications**, **peritonitis**, and **post-dialysis instability**, and escalate when **AKI**, **pulmonary edema**, **infection**, or **transplant rejection** threatens the client.

${intro}

**Learning objectives**
- Integrate **vitals, edema pattern, lung sounds, urine output, labs (creatinine, eGFR, electrolytes, urinalysis), dialysis access, catheter function, and mentation** to identify renal emergencies and complications.
- Select **nursing interventions and teaching** aligned with orders, scope, nephrology/dialysis/transplant plans, and facility policy.
- Communicate **early** when findings suggest **critical hyperkalemia**, **anuria with shock**, **infected or clotted access**, **dialysis disequilibrium**, **acute retention**, **TURP syndrome**, or **rapid creatinine rise**.`;

  const exam_relevance = `Examiners use **${def.title}** to probe prioritization, monitoring, and escalation under time pressure.

${def.exam}

Eliminate answers that **skip assessment**, **delay escalation** when data show instability, or **delegate** RN-level clinical judgment inappropriately. Boards often use "first," "priority," or "most important" language—choose the option that **reduces harm fastest** for the deteriorating client.`;

  const core_concept = `**Nursing priorities (high yield)**
${def.bullets}

**Red flags / safety alerts**
- **Hyperkalemia with ECG changes**: peaked T waves, widened QRS, sine wave—**continuous monitoring**, **notify**, **prepare calcium/insulin protocols** per orders; **never** give supplemental potassium.
- **Oliguria / anuria** with **rising creatinine** or **hypotension**: treat perfusion and obstruction themes first; notify for **AKI** trajectory.
- **Fluid overload**: crackles, hypoxia, **interdialytic weight gain**—oxygen, strict I&O, dialysis coordination; avoid inappropriate fluid boluses when overload is dominant.
- **Dialysis access**: loss of thrill/bruit, fever over site, pulsatile pseudoaneurysm—**stop using access**, **notify** vascular team; **no BP/IV** on fistula arm.
- **PD peritonitis**: cloudy effluent + pain/fever—culture pathway and antibiotics per protocol, not watchful waiting alone.

**Patient teaching (stable contexts)**
- Teach **fluid and sodium limits**, **binder timing with meals**, **infection signs at catheter or PD exit site**, **when to call** transplant or dialysis team, and **medication adherence** for BP and immunosuppression.

**NCLEX-style clinical reasoning**
- Match **data → risk → first action**; avoid teaching-first answers when **K⁺**, **perfusion**, or **airway/oxygenation** is threatened.
- When multiple clients compete, pick the client who **decompensates fastest** if unattended.`;

  const clinical_scenario = `**Patient vignette.** A client scenario related to **${def.hook}** brings renal and urinary risks to the foreground. You pair **focused assessment** (volume status, access site, catheter patency, urine colour and amount, neuro status) with **vitals and labs** when provided, follow **dialysis/transplant/catheter orders**, and **notify the provider or specialty team** when policy criteria are met.

**Clinical application:** The correct "first" action closes the **highest-risk gap**—usually **assess perfusion and rhythm**, **relieve obstruction**, **stabilize K⁺**, **support breathing**, **protect access**, or **obtain critical diagnostics**—rather than routine comfort or delayed reporting alone.

**Exam fork:** If the stem clusters **wide QRS with high K⁺**, **no urine output with shock**, **purulent PD effluent with fever**, or **sudden confusion during first HD**, prioritize **life-saving sequences** that match unit protocol and NCLEX-RN expectations.`;

  const hubPath = pathwayId === "ca-rn-nclex-rn" ? "/canada/rn/nclex-rn/lessons" : "/us/rn/nclex-rn/lessons";
  const takeaways = `- Tie **I&O + weight + BP + lung sounds + K⁺ + access/exit site** (and **dialysis schedule** when relevant) before routine tasks when renal risk is rising.
- Use the Renal & Urinary topic hub (**\`renal-gu\`**) to cluster practice with related lessons.
- Link review: [AKI prerenal vs intrarenal](LESSON:aki-prerenal-vs-intrarenal) · [hemodialysis access](LESSON:hemodialysis-access-care) · [K⁺ emergencies](LESSON:hypo-vs-hyperkalemia-hy) · [peritoneal dialysis complications](LESSON:peritoneal-dialysis-complications) · [pathway lesson hub](${hubPath})

**Takeaway drill:** Name the **life threat**, the **two objective findings** you recheck first, and the **single escalation** that matches policy—then pick the answer that matches that sequence.`;

  return {
    slug: def.slug,
    title: def.title,
    topic: displayTopic,
    topicSlug: "renal-gu",
    bodySystem: "Renal",
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
  source: "scripts/generate-rn-renal-expansion-catalog.mjs",
  pathways,
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(`Wrote ${outPath} (${DEFS.length} lessons x 2 pathways)`);
