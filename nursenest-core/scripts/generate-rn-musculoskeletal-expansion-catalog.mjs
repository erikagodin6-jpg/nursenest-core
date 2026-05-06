/**
 * Writes rn-nclex-musculoskeletal-expansion-catalog.json for ca-rn-nclex-rn + us-rn-nclex-rn.
 * Run: node scripts/generate-rn-musculoskeletal-expansion-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MUSCULOSKELETAL_EXPANSION_DEFS_A } from "./musculoskeletal-expansion-defs-a.mjs";
import { MUSCULOSKELETAL_EXPANSION_DEFS_B } from "./musculoskeletal-expansion-defs-b.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(
  __dirname,
  "../src/content/pathway-lessons/rn-nclex-musculoskeletal-expansion-catalog.json",
);

const DEFS = [...MUSCULOSKELETAL_EXPANSION_DEFS_A, ...MUSCULOSKELETAL_EXPANSION_DEFS_B];

function pathwayIntro(pathwayId) {
  if (pathwayId === "ca-rn-nclex-rn") {
    return `Canadian items may reference **SI labs** where relevant and provincial **falls prevention** or **VTE prophylaxis** wording; prioritization logic matches NCLEX-RN.

**Pathway context (RN, Canada).** This lesson supports NCLEX-RN preparation with Canada-friendly framing. Continue with related lessons from the [pathway lesson hub](/canada/rn/nclex-rn/lessons).`;
  }
  return `US NCLEX-RN items often test **compartment syndrome**, **fat embolism**, **neurovascular compromise**, **post-op VTE**, **prosthetic/joint infection**, and **safe mobility** after orthopedic surgery.

**Pathway context (RN, United States).** Continue with related lessons from the [pathway lesson hub](/us/rn/nclex-rn/lessons).`;
}

function buildLesson(def, pathwayId) {
  const intro = pathwayIntro(pathwayId);
  const displayTopic = "Musculoskeletal";
  const seoDescription = `Clinical review: ${def.seoTitle.replace(" | NCLEX-RN | NurseNest", "")} — ${displayTopic}. Board-style clinical judgment: priorities, red flags, and first-line nursing actions.`;

  const clinical_meaning = `**${def.title}** (${displayTopic}) links **fracture care, immobility, infection, neurovascular monitoring, and safe mobility** to nursing judgment: recognize **compartment syndrome**, **fat embolism**, **DVT/PE risk**, **septic joint and osteomyelitis**, **spinal cord injury deterioration**, and **post-op complications**—and escalate when perfusion, airway, mentation, or systemic infection is threatened.

${intro}

**Learning objectives**
- Integrate **pain pattern, neurovascular checks, mobility status, vitals, labs, and wound findings** to identify urgent orthopedic and rheumatologic complications.
- Select **nursing interventions and teaching** aligned with orders, scope, therapy plans, and facility policy.
- Communicate **early** when findings suggest **compartment syndrome**, **uncontrolled hemorrhage**, **new neuro deficit**, **sepsis from bone or joint infection**, or **respiratory compromise** after immobility or surgery.`;

  const exam_relevance = `Examiners use **${def.title}** to probe prioritization, monitoring, and escalation under time pressure.

${def.exam}

Eliminate answers that **skip neurovascular checks**, **delay escalation** when perfusion or airway is at risk, **massage a painful swollen calf** when VTE is possible, or **delegate** unstable assessment. Boards often use "first," "priority," or "most important" language—choose the option that **reduces harm fastest** for the deteriorating client.`;

  const core_concept = `**Nursing priorities (high yield)**
${def.bullets}

**Red flags / safety alerts**
- **Compartment syndrome**: escalating pain, pain with passive stretch, neurovascular decline—**notify** and prepare for urgent evaluation; do not rely on absent pulses alone.
- **Fat embolism**: petechiae + hypoxemia + neuro change after long-bone injury—**oxygen, monitoring, escalation**.
- **DVT/PE**: unilateral calf swelling, pleuritic pain, hypoxia—follow **VTE pathway** per orders; no calf massage.
- **Septic joint / prosthetic infection**: hot joint + fever + systemic toxicity—**urgent evaluation**, cultures, antibiotics per orders.
- **Spinal cord injury**: maintain **spinal precautions** until cleared; watch **respiratory** effort with high cervical involvement.
- **Falls and unsafe transfers**: stop the transfer, add staff or lift, re-teach **gait belt** and device use.

**Patient teaching (stable contexts)**
- Teach **cast/traction care**, **weight-bearing limits**, **DVT prevention** (movement, hydration, meds as ordered), **wound and pin-site hygiene**, **pain scales**, and **when to seek emergency care** (numb cold limb, chest pain, SOB, spreading redness).

**NCLEX-style clinical reasoning**
- Match **data → risk → first action**; avoid teaching-first answers when **perfusion, airway, infection, or neuro** is acutely threatened.
- When multiple clients compete, pick the client who **decompensates fastest** if unattended.`;

  const clinical_scenario = `**Patient vignette.** A client scenario related to **${def.hook}** brings musculoskeletal risks to the foreground. You pair **focused assessment** (pain quality, neurovascular checks, mobility, incision/drain, lung sounds) with **vitals and labs** when provided, follow **immobilization and pharmacologic orders precisely**, and **notify the provider or activate the emergency team** when policy criteria are met.

**Clinical application:** The correct "first" action closes the **highest-risk gap**—usually **neurovascular reassessment**, **oxygen**, **bleeding control**, **removal of external compression when ordered**, **sepsis bundle themes**, or **spinal motion restriction**—rather than routine comfort measures alone.

**Exam fork:** If the stem clusters **pain with passive stretch after cast**, **petechiae with hypoxia after femur fracture**, or **purulent joint with fever**, prioritize **urgent pathways** over scheduling PT or completing paperwork first.`;

  const hubPath = pathwayId === "ca-rn-nclex-rn" ? "/canada/rn/nclex-rn/lessons" : "/us/rn/nclex-rn/lessons";
  const takeaways = `- Tie **neurovascular checks + mobility orders + infection signs + respiratory status** before routine tasks when MSK risk is rising.
- Use the Musculoskeletal topic hub (**\`musculoskeletal\`**) to cluster practice with related lessons.
- Link review: [Hip fracture & fall risk](LESSON:hip-fracture-fall-risk) · [Immobility & DVT prophylaxis](LESSON:immobility-dvt-prophylaxis) · [RA flare & immune modulators](LESSON:ra-flare-immune-modulators) · [pathway lesson hub](${hubPath})

**Takeaway drill:** Name the **life threat**, the **two objective findings** you recheck first, and the **single escalation** that matches policy—then pick the answer that matches that sequence.`;

  return {
    slug: def.slug,
    title: def.title,
    topic: displayTopic,
    topicSlug: "musculoskeletal",
    bodySystem: "Musculoskeletal",
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
  source: "scripts/generate-rn-musculoskeletal-expansion-catalog.mjs",
  pathways,
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(`Wrote ${outPath} (${DEFS.length} lessons x 2 pathways)`);
