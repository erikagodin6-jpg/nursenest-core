#!/usr/bin/env node
/** Writes newgrad-400-seed-candidates.mjs — 400 seeds: nursing 200, allied 150, transition 50 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "newgrad-400-seed-candidates.mjs");

function shuffleOrder(n, salt) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = (i * 19 + salt * 29 + 41) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const used = new Set();
function add(x) {
  if (used.has(x.title)) throw new Error(`dup: ${x.title}`);
  used.add(x.title);
  return x;
}

function sec5(a, b, c, d, e) {
  return [a, b, c, d, e];
}

/** --- Nursing new grad: 25 × 8 = 200 --- */
const N_UNITS = [
  "ICU",
  "the ED",
  "med-surg",
  "telemetry",
  "step-down",
  "labor and delivery",
  "pediatrics",
  "psychiatry",
  "oncology",
  "rehab",
  "LTC",
  "PACU",
  "same-day surgery",
  "dialysis",
  "home health",
];
const N_ANGLE = [
  "first code blue",
  "first rapid response",
  "first death",
  "first missed assessment",
  "unsafe staffing ratios",
  "preceptor conflict",
  "charting behind",
  "giving report",
  "handling family anger",
  "med pass timing",
  "calling the provider",
  "end-of-shift anxiety",
  "night shift reality",
  "floating to an unknown unit",
  "imposter syndrome spikes",
];

const N_OPEN = [
  (u, a) => `What It’s Actually Like on ${u} When You Face Your ${a} (New Grad Nurse)`,
  (u, a) => `What Happens If You Miss Cues During ${a} on ${u} as a New Grad Nurse`,
  (u, a) => `First Shift Reality on ${u}: Why ${a} Feels Different Than School (New Grad Nurse)`,
  (u, a) => `How to Handle ${a} on ${u} Without Losing Your Confidence (New Grad Nurse)`,
  (u, a) => `New Grad Survival: What to Do First When ${a} Hits During a Busy Shift on ${u}`,
  (u, a) => `Why ${a} on ${u} Triggers Anxiety—And What Actually Helps (New Grad Nurse)`,
  (u, a) => `From Classroom to ${u}: ${a} and the Emotions Nobody Warned You About`,
  (u, a) => `Time Management Failure Mode: ${a} on ${u} and How to Recover (New Grad Nurse)`,
];

const N_CLUSTERS = [
  {
    clusterId: "cluster-ngn-icu-survival",
    pillarTopic: "New grad ICU survival",
    supportingTopics: ["hemodynamic cues", "alarm fatigue", "family meetings", "escalation paths"],
    cat: "Critical care",
  },
  {
    clusterId: "cluster-ngn-er-flow",
    pillarTopic: "New grad ED pace and prioritization",
    supportingTopics: ["triage mindset", "provider communication", "boarding patients", "safety under speed"],
    cat: "Emergency",
  },
  {
    clusterId: "cluster-ngn-med-surg-volume",
    pillarTopic: "New grad med-surg workload",
    supportingTopics: ["patient ratios", "cluster care", "wound checks", "education under time pressure"],
    cat: "Med-surg",
  },
  {
    clusterId: "cluster-ngn-telemetry-rhythm",
    pillarTopic: "Telemetry and rhythm worries",
    supportingTopics: ["alarm response", "strips basics", "provider updates", "documentation"],
    cat: "Telemetry",
  },
  {
    clusterId: "cluster-ngn-ob-peds",
    pillarTopic: "OB and pediatric firsts",
    supportingTopics: ["family-centered care", "pediatric vitals", "labor checks", "safety holds"],
    cat: "Specialty",
  },
  {
    clusterId: "cluster-ngn-psych-ltc",
    pillarTopic: "Psychiatry and LTC realities",
    supportingTopics: ["boundaries", "agitation protocols", "long-term relationships", "advocacy"],
    cat: "Behavioral health",
  },
  {
    clusterId: "cluster-ngn-oncology-rehab",
    pillarTopic: "Oncology and rehab transitions",
    supportingTopics: ["symptom clusters", "mobility goals", "chemo education", "pain reporting"],
    cat: "Specialty",
  },
  {
    clusterId: "cluster-ngn-pacu-surgery",
    pillarTopic: "Perioperative new grad edges",
    supportingTopics: ["airway checks", "pain scales", "discharge teaching", "complication cues"],
    cat: "Perioperative",
  },
  {
    clusterId: "cluster-ngn-dialysis-home",
    pillarTopic: "Dialysis and home health first year",
    supportingTopics: ["access care", "infection prevention", "travel time", "autonomy vs isolation"],
    cat: "Community",
  },
  {
    clusterId: "cluster-ngn-shift-life",
    pillarTopic: "Shift structure and stamina",
    supportingTopics: ["night shift", "twelve-hour fatigue", "meal breaks", "commute recovery"],
    cat: "Work-life",
  },
  {
    clusterId: "cluster-ngn-charting-legal",
    pillarTopic: "Charting, handoff, and legal awareness",
    supportingTopics: ["SBAR", "late entries", "incident reporting", "consent nuances"],
    cat: "Documentation",
  },
  {
    clusterId: "cluster-ngn-team-dynamics",
    pillarTopic: "Teamwork and hierarchy",
    supportingTopics: ["asking for help", "CNAs collaboration", "physician interactions", "bullying signals"],
    cat: "Professionalism",
  },
  {
    clusterId: "cluster-ngn-prioritization",
    pillarTopic: "Prioritization and delegation",
    supportingTopics: ["ABCs", "stable vs unstable", "delegation rights", "refusal pathways"],
    cat: "Clinical judgment",
  },
  {
    clusterId: "cluster-ngn-deterioration",
    pillarTopic: "Recognizing deterioration",
    supportingTopics: ["NEWS-style cues", "escalation triggers", "provider advocacy", "reassessment loops"],
    cat: "Assessment",
  },
  {
    clusterId: "cluster-ngn-emotional-reality",
    pillarTopic: "Emotions after licensure",
    supportingTopics: ["guilt", "grief", "burnout early", "therapy access", "peer support"],
    cat: "Well-being",
  },
  {
    clusterId: "cluster-ngn-first-year-skills",
    pillarTopic: "Skill-building in year one",
    supportingTopics: ["IV practice", "Foley confidence", "wound care", "patient teaching scripts"],
    cat: "Skills",
  },
  {
    clusterId: "cluster-ngn-comparisons",
    pillarTopic: "Unit and schedule comparisons",
    supportingTopics: ["ICU vs med-surg", "days vs nights", "hospital vs clinic", "union vs non-union context"],
    cat: "Career",
  },
  {
    clusterId: "cluster-ngn-mistakes-culture",
    pillarTopic: "Mistakes, near misses, and just culture",
    supportingTopics: ["self-reporting", "root cause fear", "learning from error", "second victim"],
    cat: "Safety culture",
  },
  {
    clusterId: "cluster-ngn-residency-orientation",
    pillarTopic: "Residency and orientation realities",
    supportingTopics: ["checklist fatigue", "preceptor fit", "competency days", "classroom vs floor gap"],
    cat: "Onboarding",
  },
  {
    clusterId: "cluster-ngn-patient-populations",
    pillarTopic: "Tough populations early on",
    supportingTopics: ["substance use", "homelessness", "language barriers", "agitated patients"],
    cat: "Equity",
  },
  {
    clusterId: "cluster-ngn-technology",
    pillarTopic: "Technology and alarms",
    supportingTopics: ["EMR shortcuts", "smart pumps", "tele tracking", "alarm settings"],
    cat: "Operations",
  },
  {
    clusterId: "cluster-ngn-ethics-boundaries",
    pillarTopic: "Ethics and boundaries",
    supportingTopics: ["social media", "gifts", "romantic interest", "moral distress"],
    cat: "Ethics",
  },
  {
    clusterId: "cluster-ngn-float-pool",
    pillarTopic: "Floating and staffing flex",
    supportingTopics: ["unknown unit kits", "quick orientation", "asking locals", "safe limits"],
    cat: "Staffing",
  },
  {
    clusterId: "cluster-ngn-education-role",
    pillarTopic: "Patient education under pressure",
    supportingTopics: ["teach-back", "discharge teaching", "low health literacy", "teachable moments"],
    cat: "Education",
  },
  {
    clusterId: "cluster-ngn-leadership-shadow",
    pillarTopic: "Charge nurse shadows and charge prep",
    supportingTopics: ["assignment fairness", "resource calls", "conflict on the floor", "stepping up"],
    cat: "Leadership",
  },
  {
    clusterId: "cluster-ngn-year-one-milestones",
    pillarTopic: "First year milestones",
    supportingTopics: ["confidence curve", "certifications", "unit committees", "switching specialties"],
    cat: "Growth",
  },
];

/** --- Allied new grad: 15 × 10 = 150 --- */
const A_PROF = [
  "respiratory therapist",
  "lab technologist",
  "radiologic technologist",
  "paramedic",
  "pharmacy technician",
  "PTA",
  "OTA",
  "social worker",
  "SLP",
  "dietitian",
];
const A_THEME = [
  "first solo shift",
  "first critical value call",
  "first equipment failure",
  "first angry clinician",
  "first missed protocol step",
  "first overtime cascade",
  "first scope question",
  "first documentation audit",
  "first patient complaint",
  "first code in department",
];

function alliedTitle(openerIdx, p, t, slot, seq) {
  const tag = `allied${String(seq + 1).padStart(4, "0")}`;
  const O = [
    () => `What It’s Actually Like as a New Grad ${p} During Your ${t} (${tag})`,
    () => `What Happens If Your ${t} Lands on a Short-Staffed Day—${p} (${tag})`,
    () => `First Week Reality for New Grad ${p}s: ${t} and What Preceptors Expect (${tag})`,
    () => `How to Survive ${t} in Your First Month as a ${p} (Real Workflow) (${tag})`,
    () => `New Grad ${p}: How to Handle ${t} Without Freezing (${tag})`,
    () => `Why ${t} Feels Personal as a New Grad ${p}—and How to Reset (${tag})`,
    () => `From School to Site: ${t} in the ${p} Role (${tag})`,
    () => `Time Management: ${t} vs Charting Load for New Grad ${p}s (${tag})`,
    () => `Imposter Syndrome Spike After ${t}: ${p} Coping Moves (${tag})`,
    () => `Team Dynamics: ${t} and Who You Call First (${p} New Grad) (${tag})`,
  ];
  return O[openerIdx % O.length]();
}

const A_CLUSTERS = [
  { clusterId: "cluster-nga-respiratory", pillarTopic: "New grad respiratory therapy", supportingTopics: ["vent checks", "ABG runs", "transport", "equipment alarms"], cat: "Allied acute" },
  { clusterId: "cluster-nga-lab", pillarTopic: "New grad laboratory", supportingTopics: ["QC shifts", "critical calls", "specimen drama", "bench pacing"], cat: "Laboratory" },
  { clusterId: "cluster-nga-imaging", pillarTopic: "New grad imaging", supportingTopics: ["contrast timing", "patient positioning", "throughput pressure", "radiation anxiety"], cat: "Imaging" },
  { clusterId: "cluster-nga-ems", pillarTopic: "New grad EMS", supportingTopics: ["scene chaos", "protocol memory", "handoff", "documentation in truck"], cat: "EMS" },
  { clusterId: "cluster-nga-pharmacy", pillarTopic: "New grad pharmacy technician", supportingTopics: ["verification stress", "sterile compounding pace", "customer conflict", "inventory fires"], cat: "Pharmacy" },
  { clusterId: "cluster-nga-therapy", pillarTopic: "New grad therapy assistants", supportingTopics: ["plan changes", "documentation speed", "family in room", "productivity metrics"], cat: "Therapy" },
  { clusterId: "cluster-nga-social-work", pillarTopic: "New grad clinical social work", supportingTopics: ["safety planning", "chart expectations", "multi-disciplinary friction", "secondary trauma"], cat: "Social work" },
  { clusterId: "cluster-nga-slp-diet", pillarTopic: "New grad SLP and dietetics", supportingTopics: ["swallow eval pressure", "meal timing", "education load", "scope edges"], cat: "Allied clinical" },
  { clusterId: "cluster-nga-safety-ethics", pillarTopic: "Allied safety and ethics", supportingTopics: ["HIPAA moments", "refusal to task", "reporting lines", "consent gray areas"], cat: "Ethics" },
  { clusterId: "cluster-nga-preceptor", pillarTopic: "Allied preceptor fit", supportingTopics: ["feedback styles", "skill checklists", "personality mismatch", "asking for repetition"], cat: "Onboarding" },
  { clusterId: "cluster-nga-shift-patterns", pillarTopic: "Allied shift patterns", supportingTopics: ["nights", "weekends", "on-call", "commute fatigue"], cat: "Work-life" },
  { clusterId: "cluster-nga-tech-workflow", pillarTopic: "Department workflow", supportingTopics: ["handoffs", "pager culture", "STAT queues", "interruptions"], cat: "Operations" },
  { clusterId: "cluster-nga-stress-benchmark", pillarTopic: "Stress and performance", supportingTopics: ["burnout early", "sleep debt", "caffeine loops", "therapy access"], cat: "Well-being" },
  { clusterId: "cluster-nga-scope-comparison", pillarTopic: "Scope and role clarity", supportingTopics: ["nurse overlap", "physician expectations", "ancillary tasks", "license fear"], cat: "Professional" },
  { clusterId: "cluster-nga-year-one-growth", pillarTopic: "Allied first-year growth", supportingTopics: ["certifications", "specialty pivot", "union context", "pay negotiation"], cat: "Career" },
];

/** --- Transition / career: 10 × 5 = 50 --- */
const T_HOOK = [
  "your first contract",
  "switching specialties",
  "moving states",
  "going back to school",
  "side gigs",
  "travel contracts",
  "per diem stacking",
  "union vs non-union",
  "day shift bidding",
  "mentor hunting",
  "resume gaps",
  "interview anxiety",
  "salary negotiation",
  "imposter at interviews",
  "burnout exit planning",
  "returning after leave",
  "visa and licensing delays",
  "compact license moves",
  "certification timing",
  "public service loan context",
  "night shift transition",
  "moving from aide to RN",
  "moving from tech to clinician",
  "preceptor to peer",
  "charge nurse interest",
];

const T_OPEN = [
  (h) => `Transition Guide: How to Navigate ${h} in Your First Years After Licensure`,
  (h) => `Career Navigation: What Changes When You Face ${h} (New Grad Reality)`,
  (h) => `What Nobody Tells You About ${h} During Your First 24 Months in Healthcare`,
  (h) => `How to Handle ${h} Without Derailing Confidence (Early-Career Healthcare)`,
  (h) => `First-Year Survival: ${h} and the Decisions That Actually Matter`,
];

const T_CLUSTERS = [
  { clusterId: "cluster-ngt-job-market", pillarTopic: "Job search and offers", supportingTopics: ["applications", "interviews", "references", "offer letters"], cat: "Career" },
  { clusterId: "cluster-ngt-money-benefits", pillarTopic: "Pay, benefits, and scheduling", supportingTopics: ["shift differentials", "PTO", "retirement basics", "overtime"], cat: "Compensation" },
  { clusterId: "cluster-ngt-moves-licensure", pillarTopic: "Moves and licensure", supportingTopics: ["compact", "endorsement", "timeline stress", "costs"], cat: "Logistics" },
  { clusterId: "cluster-ngt-advancement", pillarTopic: "Growth and education", supportingTopics: ["BSN next steps", "certifications", "grad school myths", "tuition reimbursement"], cat: "Education" },
  { clusterId: "cluster-ngt-wellbeing-exit", pillarTopic: "Well-being and career pivots", supportingTopics: ["therapy", "burnout signals", "leaving bedside", "returning"], cat: "Well-being" },
];

const INTENTS = [
  "what_its_like",
  "what_happens_if",
  "unit_guide",
  "clinical_decision",
  "stress_reality",
  "skill_building",
  "comparison",
  "system_workflow",
];

function intentFor(globalIdx) {
  return INTENTS[globalIdx % INTENTS.length];
}

const ORDER_200 = shuffleOrder(200, 101);
const ORDER_150 = shuffleOrder(150, 202);
const ORDER_50 = shuffleOrder(50, 303);

const rows = [];

for (let i = 0; i < 200; i++) {
  const slot = ORDER_200[i];
  const u = N_UNITS[slot % N_UNITS.length];
  const a = N_ANGLE[Math.floor(slot / N_UNITS.length) % N_ANGLE.length];
  const opener = N_OPEN[i % N_OPEN.length];
  const base = opener(u, a);
  const title = `${base} (slot${String(i + 1).padStart(4, "0")})`;
  const cl = N_CLUSTERS[Math.floor(i / 8) % N_CLUSTERS.length];
  rows.push(
    add({
      audience: "nursing",
      audienceLabel: "New Grad Nursing",
      clusterId: cl.clusterId,
      pillarTopic: cl.pillarTopic,
      supportingTopics: cl.supportingTopics,
      title,
      primaryKeyword: `new grad nurse ${u.replace(/[^a-z]/gi, " ").trim()} ${a}`,
      secondaryKeywords: sec5("first year nurse", "transition to practice", "new grad", "clinical confidence", "unit culture"),
      category: cl.cat,
      searchIntent: intentFor(i),
      unit: u.replace(/^the /, ""),
    }),
  );
}

for (let i = 0; i < 150; i++) {
  const slot = ORDER_150[i];
  const p = A_PROF[slot % A_PROF.length];
  const t = A_THEME[Math.floor(slot / A_PROF.length) % A_THEME.length];
  const title = alliedTitle(i, p, t, slot, i);
  const cl = A_CLUSTERS[Math.floor(i / 10) % A_CLUSTERS.length];
  rows.push(
    add({
      audience: "allied",
      audienceLabel: "New Grad Allied Health",
      clusterId: cl.clusterId,
      pillarTopic: cl.pillarTopic,
      supportingTopics: cl.supportingTopics,
      title,
      primaryKeyword: `new grad ${p} first year allied health`,
      secondaryKeywords: sec5("transition to practice", "preceptor", "scope of practice", "workflow", "orientation"),
      category: cl.cat,
      searchIntent: intentFor(i + 200),
      unit: null,
    }),
  );
}

for (let i = 0; i < 50; i++) {
  const slot = ORDER_50[i];
  const h = T_HOOK[slot % T_HOOK.length];
  const title = `${T_OPEN[i % T_OPEN.length](h)} (trans${String(i + 1).padStart(4, "0")})`;
  const cl = T_CLUSTERS[Math.floor(i / 10) % T_CLUSTERS.length];
  rows.push(
    add({
      audience: "transition",
      audienceLabel: "Transition / Career Navigation",
      clusterId: cl.clusterId,
      pillarTopic: cl.pillarTopic,
      supportingTopics: cl.supportingTopics,
      title,
      primaryKeyword: `healthcare career ${h} new professional`,
      secondaryKeywords: sec5("first job", "career planning", "licensed professional", "negotiation", "burnout prevention"),
      category: cl.cat,
      searchIntent: intentFor(i + 350),
      unit: null,
    }),
  );
}

const header =
  "/** Auto-generated by scripts/generate-newgrad-seed-module.mjs */\nexport const NEWGRAD_SEED_CANDIDATES = ";
fs.writeFileSync(out, header + JSON.stringify(rows, null, 2) + ";\n");
console.log("wrote", out, rows.length);
