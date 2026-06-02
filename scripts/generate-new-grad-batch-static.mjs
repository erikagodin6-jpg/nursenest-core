#!/usr/bin/env node
/**
 * New grad transition batch: 40 lessons + 120 questions from
 * output/new-grad-transition-blueprint.json
 *
 * Topic selection: 40 topics exactly across prioritization, delegation, time management,
 * shift organization, physician communication, handoff, and escalation (realistic TTP focus).
 * Questions: 3 scenario-based items per topic (120 total). Static, unique stems.
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLUEPRINT = path.join(ROOT, "output/new-grad-transition-blueprint.json");
const OUT = path.join(ROOT, "output/new-grad-content-batch.json");
/** Schema-aligned with output/new-grad-transition-lessons.json (no pathwayId / blueprintMeta). */
const OUT_LESSONS = path.join(ROOT, "output/new-grad-transition-batch-40-lessons.json");
/** Schema-aligned with output/new-grad-transition-questions.json (no pathwayId). */
const OUT_QUESTIONS = path.join(ROOT, "output/new-grad-transition-batch-120-questions.json");

const PROGRAM = "new-grad-transition";
const PATHWAY_ID = "new-grad-transition";

/** Domains in order; counts sum to 40 in current blueprint. */
const DOMAIN_SEQUENCE = [
  "Prioritization",
  "Delegation",
  "Time Management",
  "Shift Organization",
  "Communication with Physicians",
  "Handoff",
  "Escalation",
];

function stemHash(stem) {
  return crypto.createHash("sha256").update(stem.replace(/\s+/g, " ").trim().toLowerCase()).digest("hex").slice(0, 32);
}

function selectFortyTopics(bp) {
  const topics = bp.topics;
  const out = [];
  for (const domain of DOMAIN_SEQUENCE) {
    const rows = topics.filter((t) => t.domain === domain);
    rows.sort(
      (a, b) =>
        (a.topicSlug || "").localeCompare(b.topicSlug || "", "en", { sensitivity: "base" }),
    );
    out.push(...rows);
  }
  if (out.length !== 40) {
    throw new Error(
      `Expected 40 topics from DOMAIN_SEQUENCE, got ${out.length}. Adjust DOMAIN_SEQUENCE to match blueprint.`,
    );
  }
  return out;
}

function pickRelated(all, row, max = 6) {
  const same = all.filter((x) => x.topicSlug !== row.topicSlug && x.domain === row.domain);
  const pool = [...same, ...all.filter((x) => x.topicSlug !== row.topicSlug)];
  const seen = new Set();
  const res = [];
  for (const x of pool) {
    if (seen.has(x.topicSlug)) continue;
    seen.add(x.topicSlug);
    res.push(x.topicSlug);
    if (res.length >= max) break;
  }
  return res;
}

function buildLesson(allRows, row) {
  const slug = row.topicSlug;
  const tags = Array.from(
    new Set([...(row.tags || []), "new-grad", "transition-to-practice", slugify(row.domain)]),
  ).map((x) => String(x).toLowerCase());

  const summary = `Realistic transition-to-practice lesson for new graduate RNs: ${row.topic}. Setting: ${row.setting}. Focus: prioritization, delegation, time management, and professional communication under real floor pressure—not textbook perfection. Content is exam- and orientation-style preparation; follow institutional policy and scope in practice.`;

  const learningObjectives = [
    `Apply ${row.domain} principles to common first-year scenarios on ${row.setting}.`,
    `Use structured communication (e.g., ISBAR/SBAR) when handing off, escalating, or clarifying care.`,
    `Identify when delegation is appropriate, what must stay with the RN, and how to follow up after delegation.`,
    `Protect patient safety when time compression, interruptions, and competing priorities threaten thorough assessment.`,
  ];

  const sections = [
    {
      heading: "What this looks like on the floor",
      body: `${row.topic} (${row.subdomain}) is a frequent stress point for new grads because it combines clinical judgment with workflow discipline. You will rehearse realistic patterns: who you see first, what you delegate to PSW/UAP versus what you must assess yourself, how you batch tasks without skipping safety checks, and how you speak up using calm, specific language.`,
    },
    {
      heading: "Prioritization and delegation together",
      body: `Treat prioritization and delegation as one system: first stabilize threats to airway, breathing, circulation, and rapid neuro decline; then match tasks to the right role and competence. Delegation without follow-up is abandonment; follow-up without clear instruction is chaos. When overwhelmed, escalate early to your charge nurse with a concise summary of what you have done and what you need.`,
    },
    {
      heading: "Time management without unsafe shortcuts",
      body: `Time management on shift is not “doing more faster.” It is protecting the highest-risk tasks (high-alert meds, new instability, post-op checks) while batching lower-risk tasks when safe. Documentation should follow care, not replace it. When your plan breaks, replan visibly: update your brain sheet, communicate delays, and reset expectations with patients and families when appropriate.`,
    },
    {
      heading: "Communication that keeps patients safe",
      body: `Handoffs, physician calls, and conflict moments share one rule: objective data first, clear request second, and respectful tone throughout. Practice ISBAR/SBAR until it feels automatic. If information is missing in a handoff, stop the line and ask clarifying questions—politely but firmly—because incomplete handoff is a patient safety defect.`,
    },
    {
      heading: "Exam and competency traps",
      body: `Tests reward the safest next action, not the socially easiest action. Watch for distractors that prioritize comfort tasks over instability, charting over assessment, or “not bothering” the physician when objective criteria meet escalation protocols. Choose the option that demonstrates accountable RN judgment within scope.`,
    },
  ];

  const examTips = [
    "Multi-patient stems: pick the patient with the most acute ABCDE threat first.",
    "Delegation stems: tasks that require ongoing clinical judgment generally stay with the RN.",
    "SBAR/ISBAR: situation and assessment must contain objective data, not opinions only.",
    "When two patients seem urgent, compare who deteriorates fastest without intervention.",
  ];

  return {
    title: row.topic,
    slug,
    topicSlug: slug,
    program: PROGRAM,
    pathwayId: PATHWAY_ID,
    country: "CA-US",
    exam: "nclex-rn",
    domain: row.domain,
    subdomain: row.subdomain,
    bodySystem: "professional-practice",
    setting: row.setting,
    tags,
    summary,
    learningObjectives,
    sections,
    examTips,
    relatedTopicSlugs: pickRelated(allRows, row, 6),
    seoTitle: `${row.topic} | New grad transition`.slice(0, 70),
    seoDescription: summary.slice(0, 160),
    blueprintMeta: { topicSlug: slug, domain: row.domain, subdomain: row.subdomain, setting: row.setting },
  };
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function pickIndex(seed, modulo) {
  const hex = crypto.createHash("sha256").update(seed).digest("hex");
  return parseInt(hex.slice(0, 8), 16) % modulo;
}

/** Three distinct patients per vignette; deterministic from slug + slot + global index. */
function cohortFromSeed(seed) {
  const h = crypto.createHash("sha256").update(seed).digest();
  const names = ["Okonkwo", "Patel", "Rivera", "Nguyen", "Hassan", "Chen", "Brooks", "Ibrahim"];
  const base = 402 + (h[0] % 14);
  const pickName = (i) => names[(h[i % 32] + i * 3) % names.length];
  return {
    r1: base,
    l1: pickName(1),
    r2: base + 1 + (h[3] % 2),
    l2: pickName(4),
    r3: base + 3 + (h[5] % 2),
    l3: pickName(7),
  };
}

function wrapQuestion(row, globalIdx, qSlot, partial) {
  const difficulty = qSlot === 0 ? "medium" : qSlot === 1 ? "medium" : "hard";
  const cognitiveLevel = qSlot === 0 ? "application" : qSlot === 1 ? "application" : "analysis";
  const tagExtra =
    qSlot === 0 ? ["scenario", "prioritization"] : qSlot === 1 ? ["scenario", "delegation"] : ["scenario", "communication", "time-management"];
  const rawTags = [...(row.tags || []), ...tagExtra, "new-grad"];
  const tags = [];
  const seenTag = new Set();
  for (const t of rawTags) {
    const s = slugify(t);
    if (!s || seenTag.has(s)) continue;
    seenTag.add(s);
    tags.push(s);
  }
  return {
    ...partial,
    difficulty,
    topicSlug: row.topicSlug,
    tags,
    bodySystem: "professional-practice",
    domain: row.domain,
    subdomain: row.subdomain,
    program: PROGRAM,
    pathwayId: PATHWAY_ID,
    country: "CA-US",
    exam: "nclex-rn",
    cognitiveLevel,
    relatedLessonSlugs: [row.topicSlug],
  };
}

/** Multi-patient / acuity prioritization — template rotates by topic; stem always names the lesson focus. */
function buildQuestionPrioritization(row, globalIdx) {
  const c = cohortFromSeed(`${row.topicSlug}:p1:${globalIdx}`);
  const S = row.setting;
  const T = row.topic;
  const templates = [
    {
      stem: `Mid-morning on a ${S} unit, Room ${c.r1} (${c.l1}) has new confusion and slurred speech that started within the past hour. Room ${c.r2} (${c.l2}) wants help locating a phone charger. Room ${c.r3} (${c.l3}) is stable and asks for ice water. Applying \"${T}\", which patient should you assess first?`,
      choices: [
        `A. Room ${c.r1} (${c.l1}) first because acute neuro change can signal time-sensitive compromise`,
        `B. Room ${c.r2} (${c.l2}) first to reduce environmental stressors before clinical tasks`,
        `C. Room ${c.r3} (${c.l3}) first because hydration supports overall stability`,
        `D. Finish a non-urgent chart check on another patient before visiting any of these three`,
      ],
      correctAnswer: "A",
      rationale: `Prioritization under \"${T}\" means addressing the highest-acuity threat first: new confusion and speech change warrant immediate RN assessment and likely escalation per protocol. Comfort and routine requests should not delay evaluation of acute neuro change.`,
      incorrectRationales: {
        B: "Locating belongings is low acuity and should not precede assessment of new focal neuro deficits.",
        C: "Ice water is a comfort measure for a patient described as stable; it does not outrank acute neuro change.",
        D: "Charting or administrative tasks should not delay assessment when an acute change is reported.",
      },
    },
    {
      stem: `You inherit four patients at 0730 on ${S}. Room ${c.r1} (${c.l1}) is post-op day one with systolic BP 88 mmHg and HR 118 bpm on the last set. Room ${c.r2} (${c.l2}) is awaiting discharge teaching. Room ${c.r3} (${c.l3}) asks for a warm blanket. For \"${T}\", who do you see first?`,
      choices: [
        `A. Room ${c.r1} (${c.l1}) because hypotension with tachycardia in a fresh post-op patient is a circulation priority`,
        `B. Room ${c.r2} (${c.l2}) because discharge delays frustrate patients and should come first`,
        `C. Room ${c.r3} (${c.l3}) because thermoregulation prevents complications`,
        `D. Start med pass for all patients before assessments to stay on time`,
      ],
      correctAnswer: "A",
      rationale: `In \"${T}\", circulation concerns in a post-operative patient (hypotension + tachycardia) outrank discharge logistics and comfort-only requests until stability is clarified.`,
      incorrectRationales: {
        B: "Discharge teaching matters but should follow stabilization of possible hemorrhage or hypovolemia.",
        C: "Warm blanket is lowest acuity compared with possible post-op hypovolemia or bleeding.",
        D: "Medication administration should not precede assessment of a patient with possible hemodynamic compromise.",
      },
    },
    {
      stem: `Room ${c.r1} (${c.l1}) reports sudden shortness of breath and SpO2 88% on 2 L nasal cannula (was 94% one hour ago). Room ${c.r2} (${c.l2}) wants pain medication for 4/10 shoulder ache. Room ${c.r3} (${c.l3}) needs a signature on a meal tray form. Under \"${T}\", what is your priority?`,
      choices: [
        `A. Assess Room ${c.r1} (${c.l1}) immediately for work of breathing and oxygenation`,
        `B. Administer PRN analgesia to Room ${c.r2} (${c.l2}) before reassessing oxygen`,
        `C. Complete the tray form for Room ${c.r3} (${c.l3}) to avoid dietary delays`,
        `D. Ask the unit clerk to retake vitals on Room ${c.r1} while you finish another task`,
      ],
      correctAnswer: "A",
      rationale: `Breathing threat (falling oxygen with subjective dyspnea) is the priority in \"${T}\". The RN should assess and intervene/escalate before lower-acuity comfort or paperwork.`,
      incorrectRationales: {
        B: "Mild pain does not precede assessment of acute hypoxemia and increased work of breathing.",
        C: "Administrative tasks should not delay assessment of respiratory compromise.",
        D: "Delegating reassessment of possible deterioration without RN evaluation is unsafe; the RN should assess first.",
      },
    },
    {
      stem: `The charge nurse asks you to accept a new admission while your current assignment is full. Your other patients are stable except Room ${c.r1} (${c.l1}), who has a potassium result just flagged critical low on the monitor and is on active diuretic therapy. For \"${T}\", what should you do first?`,
      choices: [
        `A. Go to Room ${c.r1} (${c.l1}), assess, and prepare to notify the provider with objective data`,
        `B. Accept the admission first because throughput is the unit priority`,
        `C. Call the provider about the critical lab before any bedside assessment`,
        `D. Ask another nurse to cover your entire assignment while you orient the admission`,
      ],
      correctAnswer: "A",
      rationale: `Critical values require bedside assessment to pair data with clinical findings before escalation—central to \"${T}\". Accepting a new patient before addressing a critical lab risks harm.`,
      incorrectRationales: {
        B: "Unit flow cannot outrank immediate safety actions for a patient with a critical lab on high-risk therapy.",
        C: "Calling without assessment gives incomplete information and delays targeted interventions at the bedside.",
        D: "Dumping assignment accountability is not an appropriate first step; address the acute safety issue with structured help if needed.",
      },
    },
    {
      stem: `At 1600, Room ${c.r1} (${c.l1}) has IV antibiotics due now for sepsis (first dose still not given, admitted 2 hours ago). Room ${c.r2} (${c.l2}) wants help rearranging flowers. Room ${c.r3} (${c.l3}) is stable and requests a sleeping mask. For \"${T}\", which action comes first?`,
      choices: [
        `A. Prepare and administer the time-sensitive antibiotic for Room ${c.r1} (${c.l1}) per sepsis urgency`,
        `B. Help Room ${c.r2} (${c.l2}) with flowers to maintain rapport`,
        `C. Bring a mask to Room ${c.r3} (${c.l3}) first because rest aids recovery`,
        `D. Batch all tasks until 1700 to improve efficiency`,
      ],
      correctAnswer: "A",
      rationale: `Time-sensitive sepsis antibiotics are a mortality-linked priority in \"${T}\". Non-urgent comfort tasks should follow time-critical therapies when the patient is described as unstable from infection risk.`,
      incorrectRationales: {
        B: "Environmental tasks are low acuity compared with delayed first-dose sepsis antibiotics.",
        C: "Sleep comfort is reasonable but not before urgent infection-related medication timing.",
        D: "Batching should not delay time-sensitive treatments with high harm risk if delayed.",
      },
    },
    {
      stem: `Room ${c.r1} (${c.l1}) states they feel “weird” and you note irregular telemetry with new dizziness. Room ${c.r2} (${c.l2}) wants a second pillow. Room ${c.r3} (${c.l3}) asks you to find their dentures. Applying \"${T}\", what is your best next action?`,
      choices: [
        `A. Assess Room ${c.r1} (${c.l1}) at the bedside and follow dysrhythmia/unit protocol`,
        `B. Bring pillows to Room ${c.r2} (${c.l2}) first to reduce call-bell frequency`,
        `C. Search for dentures for Room ${c.r3} (${c.l3}) to support nutrition`,
        `D. Silence telemetry alarms temporarily while you finish documentation`,
      ],
      correctAnswer: "A",
      rationale: `Objective cardiovascular/neurologic changes with symptoms outrank comfort requests in \"${T}\". Silencing alarms without assessment is unsafe.`,
      incorrectRationales: {
        B: "Pillow requests are low acuity compared with possible arrhythmia-related symptoms.",
        C: "Denture location is not an immediate safety threat compared with dizziness and irregular telemetry.",
        D: "Silencing alarms without assessment masks deterioration and violates safety expectations.",
      },
    },
    {
      stem: `You promised Room ${c.r2} (${c.l2}) you would return at 1100 for wound teaching. At 1055, Room ${c.r1} (${c.l1}) develops rigors and a temp spike to 39.2°C with HR 118. Room ${c.r3} (${c.l3}) calls for a TV remote. For \"${T}\", what do you do first?`,
      choices: [
        `A. Assess and stabilize/escalate for Room ${c.r1} (${c.l1}) because new fever with tachycardia suggests acute illness`,
        `B. Keep the 1100 teaching commitment to Room ${c.r2} (${c.l2}) to maintain trust`,
        `C. Bring the remote to Room ${c.r3} (${c.l3}) first since it is quick`,
        `D. Send a text message to the physician without bedside data`,
      ],
      correctAnswer: "A",
      rationale: `Even with a prior commitment, \"${T}\" requires reprioritizing when a patient shows signs of acute infection or sepsis risk. Teaching can be rescheduled with transparent communication.`,
      incorrectRationales: {
        B: "Trust is important, but acute physiologic change outranked scheduled teaching when safety is at stake.",
        C: "Low-acuity requests should not precede assessment of fever with tachycardia.",
        D: "Communication should include bedside assessment data, not texts without context (follow unit policy for secure communication).",
      },
    },
    {
      stem: `Room ${c.r1} (${c.l1}) is NPO for procedure later today and asks for breakfast now. Room ${c.r2} (${c.l2}) has acute abdominal distension and absent bowel sounds with increasing pain. Room ${c.r3} (${c.l3}) wants lotion applied. Under \"${T}\", which patient needs you first?`,
      choices: [
        `A. Room ${c.r2} (${c.l2}) because acute abdomen changes can signal obstruction or perforation risk`,
        `B. Room ${c.r1} (${c.l1}) because NPO patients become hangry and non-adherent`,
        `C. Room ${c.r3} (${c.l3}) because skin care prevents breakdown`,
        `D. Call dietary first to negotiate NPO status for Room ${c.r1} (${c.l1})`,
      ],
      correctAnswer: "A",
      rationale: `Acute abdomen findings with worsening pain are a safety priority in \"${T}\". NPO education and skin care follow after ruling out urgent surgical/medical issues.`,
      incorrectRationales: {
        B: "Hunger discomfort does not outrank possible acute abdominal pathology.",
        C: "Skin care is important but not before assessment of acute abdomen symptoms.",
        D: "Dietary should not be the first stop when another patient has acute abdomen red flags.",
      },
    },
    {
      stem: `Room ${c.r1} (${c.l1}) reports chest pressure with diaphoresis; last BP 92/60. Room ${c.r2} (${c.l2}) wants discharge paperwork started early. Room ${c.r3} (${c.l3}) asks for a Wi-Fi password. For \"${T}\", which patient do you prioritize?`,
      choices: [
        `A. Room ${c.r1} (${c.l1}) because chest pressure with hypotension and diaphoresis may be cardiac compromise`,
        `B. Room ${c.r2} (${c.l2}) to improve throughput`,
        `C. Room ${c.r3} (${c.l3}) to reduce anxiety`,
        `D. Finish med reconciliation for a stable patient before assessing Room ${c.r1} (${c.l1})`,
      ],
      correctAnswer: "A",
      rationale: `Possible ACS or shock pattern is the highest acuity in \"${T}\". Throughput and convenience tasks must wait.`,
      incorrectRationales: {
        B: "Discharge logistics do not precede possible cardiac emergency symptoms.",
        C: "Wi-Fi access is not a clinical priority compared with chest pressure and hypotension.",
        D: "Med reconciliation should not delay assessment of possible cardiac compromise.",
      },
    },
    {
      stem: `Room ${c.r1} (${c.l1}) has a new oxygen requirement (4 L from 2 L) and mild anxiety. Room ${c.r2} (${c.l2}) wants a chaplain visit arranged. Room ${c.r3} (${c.l3}) requests a different gown color. Applying \"${T}\", what is your first action?`,
      choices: [
        `A. Assess Room ${c.r1} (${c.l1}) for work of breathing, lung sounds, and trends`,
        `B. Arrange chaplaincy first for Room ${c.r2} (${c.l2})`,
        `C. Change the gown for Room ${c.r3} (${c.l3}) to support dignity`,
        `D. Offer PRN anxiolytic to Room ${c.r1} (${c.l1}) before any physical assessment`,
      ],
      correctAnswer: "A",
      rationale: `Increasing oxygen needs signal respiratory deterioration risk; assessment precedes medication decisions in \"${T}\".`,
      incorrectRationales: {
        B: "Psychosocial support matters but should not precede assessment of worsening oxygenation.",
        C: "Gown preference is lowest acuity compared with increased oxygen requirement.",
        D: "Medications should follow assessment, not replace it, when respiratory status is changing.",
      },
    },
    {
      stem: `You are pulled to help with a rapid response elsewhere. Before leaving, Room ${c.r1} (${c.l1}) is on insulin infusion with stable glucose; Room ${c.r2} (${c.l2}) has new unilateral leg swelling and calf pain; Room ${c.r3} (${c.l3}) wants a snack. For \"${T}\", what must you address before stepping away?`,
      choices: [
        `A. Hand off high-alert infusion monitoring and assess/escalate leg symptoms for Room ${c.r2} (${c.l2}) per VTE concern`,
        `B. Grab the snack for Room ${c.r3} (${c.l3}) so they do not feel neglected`,
        `C. Silence alarms on Room ${c.r1} (${c.l1}) because glucose is stable`,
        `D. Leave without telling anyone because the RRT needs help immediately`,
      ],
      correctAnswer: "A",
      rationale: `\"${T}\" includes safe handoff of high-alert therapies and addressing possible VTE symptoms before leaving the assignment zone without coverage.`,
      incorrectRationales: {
        B: "Snacks are not a safety priority compared with VTE symptoms and insulin infusion accountability.",
        C: "Silencing alarms is unsafe; hand off monitoring responsibility instead.",
        D: "Leaving without coverage or communication abandons patients and violates accountability.",
      },
    },
    {
      stem: `Room ${c.r1} (${c.l1}) has a draining surgical wound with new purulent odor and increasing pain. Room ${c.r2} (${c.l2}) wants a fan. Room ${c.r3} (${c.l3}) asks you to print email instructions. Under \"${T}\", which patient should you assess first?`,
      choices: [
        `A. Room ${c.r1} (${c.l1}) because wound changes with pain may signal infection or dehiscence risk`,
        `B. Room ${c.r2} (${c.l2}) for comfort`,
        `C. Room ${c.r3} (${c.l3}) for administrative help`,
        `D. Wait for the next dressing change round in 2 hours`,
      ],
      correctAnswer: "A",
      rationale: `New purulent drainage and worsening pain are assessment priorities in \"${T}\" before comfort or clerical tasks.`,
      incorrectRationales: {
        B: "Fan comfort does not precede possible surgical site infection.",
        C: "Printing instructions is not urgent compared with possible wound complications.",
        D: "Delaying assessment of new wound changes is unsafe.",
      },
    },
    {
      stem: `Room ${c.r1} (${c.l1}) is on contact precautions and reports severe headache with photophobia (new today). Room ${c.r2} (${c.l2}) wants the room temperature changed. Room ${c.r3} (${c.l3}) requests a hairbrush. For \"${T}\", who do you see first?`,
      choices: [
        `A. Room ${c.r1} (${c.l1}) to assess neuro status and follow isolation-appropriate escalation`,
        `B. Room ${c.r2} (${c.l2}) because environment affects satisfaction scores`,
        `C. Room ${c.r3} (${c.l3}) because grooming supports dignity`,
        `D. Cluster all three tasks after lunch to save PPE`,
      ],
      correctAnswer: "A",
      rationale: `New severe headache with photophobia warrants timely RN assessment in \"${T}\"; environmental and grooming tasks follow.`,
      incorrectRationales: {
        B: "Temperature comfort does not precede assessment of acute neuro symptoms.",
        C: "Grooming is lower acuity than possible meningeal irritation or other neuro emergencies.",
        D: "Clustering should not delay assessment of new neuro red flags.",
      },
    },
    {
      stem: `Room ${c.r1} (${c.l1}) has acute urinary retention with suprapubic distension and inability to void for 8 hours. Room ${c.r2} (${c.l2}) wants a magazine. Room ${c.r3} (${c.l3}) asks for a pillow reposition. Applying \"${T}\", what is your priority?`,
      choices: [
        `A. Assess and intervene/escalate for Room ${c.r1} (${c.l1}) because retention can cause renal injury and discomfort`,
        `B. Bring a magazine to Room ${c.r2} (${c.l2})`,
        `C. Reposition pillows for Room ${c.r3} (${c.l3}) first`,
        `D. Tell the patient to “drink more water” and reassess tonight`,
      ],
      correctAnswer: "A",
      rationale: `Urinary retention with distension is an urgent comfort/safety issue in \"${T}\" that requires RN assessment and likely provider notification.`,
      incorrectRationales: {
        B: "Leisure items are low acuity compared with retention.",
        C: "Pillow repositioning is low acuity compared with retention.",
        D: "Increasing oral intake without assessment can worsen retention; this is not an appropriate first response.",
      },
    },
    {
      stem: `Room ${c.r1} (${c.l1}) reports suicidal ideation with a vague plan (new disclosure). Room ${c.r2} (${c.l2}) wants extra blankets. Room ${c.r3} (${c.l3}) wants the lights dimmed. Under \"${T}\", what is your immediate priority?`,
      choices: [
        `A. Stay with/ensure safety for Room ${c.r1} (${c.l1}) and activate crisis/safety protocol per policy`,
        `B. Bring blankets first to calm the environment`,
        `C. Dim lights for Room ${c.r3} (${c.l3}) to promote sleep`,
        `D. Promise confidentiality and leave to get coffee before discussing further`,
      ],
      correctAnswer: "A",
      rationale: `Safety risk from suicidal ideation is the highest priority in \"${T}\" and requires immediate protective actions per institutional protocol.`,
      incorrectRationales: {
        B: "Environmental comfort does not precede immediate safety risk.",
        C: "Lighting adjustments are not appropriate before addressing suicidal ideation.",
        D: "Leaving a patient disclosing SI is unsafe; confidentiality has limits when safety is at risk—follow policy.",
      },
    },
  ];
  const t = templates[pickIndex(`${row.topicSlug}:pri`, templates.length)];
  return wrapQuestion(row, globalIdx, 0, {
    stem: t.stem,
    questionType: "single-best-answer",
    choices: t.choices,
    correctAnswer: t.correctAnswer,
    correctAnswers: null,
    rationale: t.rationale,
    incorrectRationales: t.incorrectRationales,
  });
}

function buildQuestionDelegation(row, globalIdx) {
  const c = cohortFromSeed(`${row.topicSlug}:del:${globalIdx}`);
  const T = row.topic;
  const templates = [
    {
      stem: `You delegated ambulation to a PSW/UAP for Room ${c.r1} (${c.l1}). The PSW/UAP reports dizziness and diaphoresis mid-walk. Applying \"${T}\", what is your best first action?`,
      choices: [
        "A. Go to the bedside, assess the patient, and follow fall-risk/instability protocols",
        "B. Tell the PSW/UAP to complete the walk to build endurance",
        "C. Ask the PSW/UAP to interpret telemetry and adjust antiarrhythmics",
        "D. Ignore the report because the patient walked yesterday without issue",
      ],
      correctAnswer: "A",
      rationale: `The RN retains accountability after delegation. New instability symptoms require RN assessment; pushing activity or delegating clinical interpretation is inappropriate in \"${T}\".`,
      incorrectRationales: {
        B: "Continuing ambulation despite dizziness risks falls and injury.",
        C: "Medication and rhythm interpretation are outside UAP/PSW scope.",
        D: "Prior tolerance does not negate new symptoms requiring reassessment.",
      },
    },
    {
      stem: `You delegated fingerstick blood glucose to the PSW/UAP for Room ${c.r2} (${c.l2}). They report a reading of 2.2 mmol/L and the patient is shaky. For \"${T}\", what should you do first?`,
      choices: [
        "A. Verify symptoms at bedside, repeat/confirm per policy, treat hypoglycemia protocol, and notify provider if indicated",
        "B. Tell the PSW/UAP to give juice without RN verification because they already checked once",
        "C. Chart the result and go to lunch because the patient looks ‘fine’ from the door",
        "D. Ask the PSW/UAP to independently titrate insulin per sliding scale",
      ],
      correctAnswer: "A",
      rationale: `Critical or symptomatic glucose values require RN follow-through in \"${T}\": confirm, treat per protocol, and communicate when thresholds are met.`,
      incorrectRationales: {
        B: "Treatment decisions for symptomatic hypoglycemia should follow RN assessment and protocol, not unlicensed independent action.",
        C: "Door assessments are inadequate; hypoglycemia can progress quickly.",
        D: "Insulin titration is not delegated to UAP/PSW.",
      },
    },
    {
      stem: `You delegated intake/output recording. The PSW/UAP reports Room ${c.r3} (${c.l3}) has not voided for 10 hours and looks uncomfortable with a distended lower abdomen. Under \"${T}\", what is your priority?`,
      choices: [
        "A. Assess the patient yourself and escalate for possible retention/obstruction per findings",
        "B. Tell the PSW/UAP to encourage more oral fluids only",
        "C. Document ‘will monitor’ and defer assessment until rounds",
        "D. Ask the PSW/UAP to insert a urinary catheter independently",
      ],
      correctAnswer: "A",
      rationale: `Possible urinary retention requires RN assessment and appropriate orders in \"${T}\". Catheter insertion is not a UAP/PSW function in most settings.`,
      incorrectRationales: {
        B: "Fluids alone may worsen retention; assessment comes first.",
        C: "Delaying assessment of distension and inability to void is unsafe.",
        D: "Invasive procedures require appropriate licensure and orders.",
      },
    },
    {
      stem: `You delegated bed linen change for a patient on droplet precautions. The PSW/UAP asks you to ‘just pop in quickly’ without PPE because it is faster. For \"${T}\", what is the best response?`,
      choices: [
        "A. Reinforce correct PPE and either supervise safe care or perform the portion requiring RN judgment",
        "B. Agree to save time if the patient looks stable",
        "C. Tell the patient to turn away so PPE is unnecessary",
        "D. Cancel the linen change to avoid conflict",
      ],
      correctAnswer: "A",
      rationale: `Infection control and supervision are part of delegation accountability in \"${T}\". Shortcuts that violate precautions are never acceptable.`,
      incorrectRationales: {
        B: "Speed does not justify infection prevention breaches.",
        C: "Patient positioning does not replace required precautions.",
        D: "Avoiding basic care is not an appropriate substitute for safe practice.",
      },
    },
    {
      stem: `You delegated ambulation; the PSW/UAP did not report back. You find Room ${c.r1} (${c.l1}) alone in the bathroom, pale, with HR 128 on their wearable. For \"${T}\", what reflects best accountability?`,
      choices: [
        "A. Assess/treat per protocol, ensure patient safety, then debrief the PSW/UAP on clear reporting expectations",
        "B. Reprimand the PSW/UAP publicly at the nurses’ station first",
        "C. Assume the PSW/UAP is busy and leave the patient in the bathroom",
        "D. Chart that the PSW/UAP was noncompliant without speaking to them",
      ],
      correctAnswer: "A",
      rationale: `Patient safety first, then closed-loop feedback—core to \"${T}\" after delegation gaps.`,
      incorrectRationales: {
        B: "Public shaming undermines teamwork and delays care.",
        C: "Leaving a symptomatic patient unattended is unsafe.",
        D: "Charting accusations without conversation is unprofessional and may be inaccurate.",
      },
    },
    {
      stem: `An RPN/LPN you collaborate with asks you to ‘sign off’ on an insulin dose they drew up for your shared patient without you seeing the draw. For \"${T}\", what is appropriate?`,
      choices: [
        "A. Refuse to cosign without following institutional policy for high-alert meds, independent verification, and scope",
        "B. Sign quickly to maintain a friendly relationship",
        "C. Tell them to give the dose without documentation to save time",
        "D. Ask the PSW/UAP to verify the insulin instead",
      ],
      correctAnswer: "A",
      rationale: `High-alert medications and cosign policies exist to prevent errors; \"${T}\" includes assertive adherence to policy and scope.`,
      incorrectRationales: {
        B: "Relationships do not override medication safety checks.",
        C: "Undocumented administration is unsafe and often prohibited.",
        D: "UAP/PSW cannot substitute for licensed verification requirements.",
      },
    },
    {
      stem: `You delegated vital signs every 4 hours. At hour 3, the PSW/UAP reports they forgot Room ${c.r2} (${c.l2}), who is on telemetry for new AFib with RVR. For \"${T}\", what do you do first?`,
      choices: [
        "A. Obtain vitals and focused assessment now and adjust monitoring/escalation per findings",
        "B. Wait until hour 4 because that was the scheduled frequency",
        "C. Remove telemetry because it causes alarm fatigue",
        "D. Delegate the assessment solely to the charge nurse without seeing the patient",
      ],
      correctAnswer: "A",
      rationale: `Missed monitoring on higher-risk patients requires immediate catch-up assessment in \"${T}\"; scheduled frequency is a minimum, not a ceiling, when risk increases.`,
      incorrectRationales: {
        B: "Rigid adherence to schedule ignores increased risk from missed data.",
        C: "Removing monitoring without orders and assessment is unsafe.",
        D: "You remain responsible for your assignment unless formally reassigned.",
      },
    },
    {
      stem: `You delegated feeding assistance. The PSW/UAP reports coughing with meals and ‘wet voice’ afterward. For \"${T}\", what is your best next step?`,
      choices: [
        "A. Assess swallowing risk, hold oral intake if indicated per policy, notify provider/SLT per protocol",
        "B. Tell the PSW/UAP to encourage faster eating to finish trays on time",
        "C. Delegate thickened liquids trial without assessment or orders",
        "D. Document ‘patient picky eater’ and continue regular diet",
      ],
      correctAnswer: "A",
      rationale: `Aspiration risk signals require RN assessment and escalation in \"${T}\"; diet changes require orders and evaluation.`,
      incorrectRationales: {
        B: "Faster eating can increase aspiration risk.",
        C: "Diet texture changes require assessment and provider/SLT input per policy.",
        D: "Mislabeling symptoms as preference delays necessary evaluation.",
      },
    },
    {
      stem: `You delegated a bed bath. The PSW/UAP reports a new stageable pressure injury on the sacrum. Under \"${T}\", what should you do first?`,
      choices: [
        "A. Assess and measure/document per protocol, notify wound care/provider as required, and update the plan of care",
        "B. Tell the PSW/UAP to apply triple antibiotic ointment they brought from home",
        "C. Ignore it until next shift because baths are low priority",
        "D. Cover it with gauze without assessment to ‘protect dignity’",
      ],
      correctAnswer: "A",
      rationale: `New skin breakdown requires RN assessment, documentation, and appropriate referrals in \"${T}\".`,
      incorrectRationales: {
        B: "Unapproved products and home remedies are unsafe and out of scope.",
        C: "Pressure injuries can worsen quickly; delaying assessment is unsafe.",
        D: "Dressings without assessment/documentation do not meet standards of care.",
      },
    },
    {
      stem: `You delegated ambulation; the PSW/UAP refuses because they feel the patient is ‘too heavy.’ The patient is medically cleared to walk with assist x2. For \"${T}\", what is best?`,
      choices: [
        "A. Reassign the task appropriately (equipment/another staff) while maintaining patient safety and clear communication",
        "B. Cancel mobility for the shift to avoid conflict",
        "C. Tell the patient they cannot walk because staff disagrees",
        "D. Delegate the walk to a visitor without training",
      ],
      correctAnswer: "A",
      rationale: `Delegation must match right person/right task; if unsafe for one assistant, solve with equipment/team support in \"${T}\" rather than abandoning mobility when ordered.`,
      incorrectRationales: {
        B: "Avoiding ordered mobility without clinical rationale can cause harm (deconditioning, complications).",
        C: "Blaming the patient is unprofessional and may breach advocacy expectations.",
        D: "Untrained visitors are not appropriate substitutes for mobility assistance.",
      },
    },
    {
      stem: `You delegated gathering supplies for a dressing change. The PSW/UAP opened sterile supplies onto a contaminated surface. For \"${T}\", what should you do?`,
      choices: [
        "A. Stop the procedure, discard compromised supplies, and redo setup safely with RN oversight/teaching",
        "B. Use the supplies anyway to avoid waste",
        "C. Ask the PSW/UAP to complete the sterile dressing independently",
        "D. Hide the error from the patient to maintain confidence",
      ],
      correctAnswer: "A",
      rationale: `Sterility breaches require restart and teaching in \"${T}\" to prevent infection.`,
      incorrectRationales: {
        B: "Sterility cannot be compromised to save supplies.",
        C: "Sterile technique for complex dressings is typically RN scope; verify policy.",
        D: "Concealing errors undermines trust and safety culture.",
      },
    },
  ];
  const t = templates[pickIndex(`${row.topicSlug}:deleg`, templates.length)];
  return wrapQuestion(row, globalIdx, 1, {
    stem: t.stem,
    questionType: "single-best-answer",
    choices: t.choices,
    correctAnswer: t.correctAnswer,
    correctAnswers: null,
    rationale: t.rationale,
    incorrectRationales: t.incorrectRationales,
  });
}

function buildQuestionCommTime(row, globalIdx) {
  const c = cohortFromSeed(`${row.topicSlug}:ct:${globalIdx}`);
  const T = row.topic;
  const templates = [
    {
      stem: `You must call the covering provider about Room ${c.r1} (${c.l1}) (new hypotension after fluids). Charge is tied up. For \"${T}\`, what demonstrates best communication and time management?`,
      choices: [
        "A. Collect objective data, use SBAR/ISBAR, state a clear request, and document the interaction per policy",
        "B. Page ‘come now’ without vitals or assessment",
        "C. Wait until 2200 to batch calls",
        "D. Ask the family to page the physician directly",
      ],
      correctAnswer: "A",
      rationale: `Prepared structured communication saves time and reduces errors in \"${T}\".`,
      incorrectRationales: {
        B: "Vague urgent pages delay care and frustrate providers.",
        C: "Unstable trends should not wait for convenience batching.",
        D: "Families should not replace professional escalation pathways.",
      },
    },
    {
      stem: `During bedside handoff, Room ${c.r2} (${c.l2})’s family interrupts with unrelated stories. For \"${T}\", what is best?`,
      choices: [
        "A. Acknowledge briefly, redirect to patient-centred ISBAR content, and offer a later time for social conversation",
        "B. Stop report entirely until the family finishes",
        "C. Whisper report outside the room without involving the patient",
        "D. Skip allergy verification to save time",
      ],
      correctAnswer: "A",
      rationale: `Handoff should stay structured, inclusive of the patient when appropriate, and safety-focused in \"${T}\".`,
      incorrectRationales: {
        B: "Unbounded interruptions can omit critical data and prolong risk.",
        C: "Excluding the patient without rationale can reduce engagement and safety checks.",
        D: "Allergy verification is a non-negotiable safety step.",
      },
    },
    {
      stem: `You receive incomplete report: unknown IV fluids running and missing code status. For \"${T}\`, what should you do first?`,
      choices: [
        "A. Pause unsafe assumptions, verify at the bedside/EHR with the outgoing nurse, and clarify orders before proceeding",
        "B. Assume DNR because the patient is elderly",
        "C. Assume normal saline because ‘most people are on it’",
        "D. Speed up by starting tasks without verifying",
      ],
      correctAnswer: "A",
      rationale: `Incomplete handoff requires closed-loop clarification in \"${T}\" before interventions.`,
      incorrectRationales: {
        B: "Code status is never assumed by age.",
        C: "Infusions must be verified, not guessed.",
        D: "Assumption-based care causes serious errors.",
      },
    },
    {
      stem: `The physician dismisses your concern about Room ${c.r3} (${c.l3})’s trend of rising lactate and increasing confusion. For \"${T}\`, what is most appropriate?`,
      choices: [
        "A. Re-state objective data calmly, use advocacy/chain of command per policy, and continue monitoring with clear documentation",
        "B. Accept dismissal silently to avoid being labeled difficult",
        "C. Tell the family the physician does not care",
        "D. Withhold monitoring data from the next shift to avoid conflict",
      ],
      correctAnswer: "A",
      rationale: `Professional persistence with data and policy-backed escalation protects patients in \"${T}\".`,
      incorrectRationales: {
        B: "Silence when objective risk exists can harm patients.",
        C: "Triangulating blame onto providers undermines trust and professionalism.",
        D: "Withholding information at handoff is unsafe.",
      },
    },
    {
      stem: `You disagree with a telephone order that sounds unclear for high-alert medication dosing. For \"${T}\`, what is best?`,
      choices: [
        "A. Use read-back, clarify dose/route/frequency, involve second nurse verification if required, and refuse to execute if still ambiguous",
        "B. Guess the dose from handwriting to keep workflow moving",
        "C. Ask a PSW/UAP to confirm the order with the pharmacy",
        "D. Implement the order and chart later",
      ],
      correctAnswer: "A",
      rationale: `High-alert medication safety requires clarity and verification in \"${T}\".`,
      incorrectRationales: {
        B: "Guessing doses is never acceptable.",
        C: "Order clarification is a licensed/accountable role per policy.",
        D: "Delayed documentation increases error risk.",
      },
    },
    {
      stem: `You are behind on charting but two call bells ring simultaneously. For \"${T}\`, what reflects safest time management?`,
      choices: [
        "A. Quickly compare acuity (who is unstable vs stable request) and seek brief help from charge if both are high risk",
        "B. Always answer the nearest bell regardless of acuity",
        "C. Finish charting first because ‘if it is not charted it did not happen’",
        "D. Ignore both until med pass is complete",
      ],
      correctAnswer: "A",
      rationale: `Time management must preserve safety sorting and appropriate help-seeking in \"${T}\".`,
      incorrectRationales: {
        B: "Proximity alone is not a prioritization framework.",
        C: "Charting should not delay response to acute needs.",
        D: "Ignoring calls without triage is unsafe.",
      },
    },
    {
      stem: `End of shift is 30 minutes away and you have not started handoff notes. A stable patient asks for discharge teaching now. For \"${T}\", what is best?`,
      choices: [
        "A. Negotiate a realistic plan: start essential safety teaching now and coordinate with oncoming nurse for completion",
        "B. Rush handoff with missing data to leave on time",
        "C. Promise teaching you cannot complete and leave silently",
        "D. Tell the patient teaching is ‘not nursing’s job’",
      ],
      correctAnswer: "A",
      rationale: `Transparent coordination balances teaching continuity with safe handoff in \"${T}\".`,
      incorrectRationales: {
        B: "Incomplete handoff risks errors.",
        C: "Broken promises and silent departure harm trust and safety.",
        D: "Patient education is within nursing scope and unit expectations.",
      },
    },
    {
      stem: `You need the rapid response team. For \"${T}\", what is the best first communication step?`,
      choices: [
        "A. Activate per protocol with location, primary problem, recent vitals/interventions, and who is at the bedside",
        "B. Yell in the hallway without specifics",
        "C. Wait until you have a definitive diagnosis before calling",
        "D. Ask the family to call 911 from the parking lot",
      ],
      correctAnswer: "A",
      rationale: `RRT activation should be structured, early, and information-rich in \"${T}\".`,
      incorrectRationales: {
        B: "Unstructured yelling delays coordinated response.",
        C: "RRT exists for early deterioration, not only after collapse.",
        D: "In-hospital emergencies use internal emergency systems.",
      },
    },
    {
      stem: `A colleague speaks rudely to you in front of patients during a busy code. For \"${T}\`, what is most professional after the acute event stabilizes?`,
      choices: [
        "A. Debrief privately using respectful assertiveness and escalate to leadership if behavior persists or affects care",
        "B. Retaliate with sarcasm at the desk",
        "C. Complain about them loudly on social media",
        "D. Refuse to work with them ever again without discussion",
      ],
      correctAnswer: "A",
      rationale: `Conflict resolution that preserves professionalism supports safety culture in \"${T}\".`,
      incorrectRationales: {
        B: "Retaliation escalates conflict and models poor behavior for patients.",
        C: "Social media breaches privacy and professionalism.",
        D: "Absolute refusal without process may abandon patients and teamwork norms.",
      },
    },
    {
      stem: `You are double-booked: physician wants bedside rounds now while your other patient needs a time-sensitive antibiotic. For \"${T}\", what is best?`,
      choices: [
        "A. Communicate the time-critical need, coordinate coverage or brief delay with clear patient safety rationale, then execute the priority",
        "B. Skip the antibiotic to look attentive on rounds",
        "C. Hide from the physician until both tasks resolve",
        "D. Delegate antibiotic administration to an unlicensed volunteer",
      ],
      correctAnswer: "A",
      rationale: `Negotiation and coverage are appropriate when two legitimate priorities compete in \"${T}\".`,
      incorrectRationales: {
        B: "Time-sensitive therapies should not be skipped for appearances.",
        C: "Avoidance delays necessary communication.",
        D: "Medication administration is not delegated to volunteers.",
      },
    },
    {
      stem: `Your brain sheet is disorganized after repeated interruptions. For \"${T}\", what is the best mid-shift reset?`,
      choices: [
        "A. Take 3–5 minutes to rewrite priorities, re-check high-risk tasks, and tell charge if you need redistribution",
        "B. Work faster without a plan",
        "C. Stop assessing patients to reorganize paperwork for 30 minutes",
        "D. Copy another nurse’s brain sheet without understanding their patients",
      ],
      correctAnswer: "A",
      rationale: `Brief structured replanning reduces errors during interruption storms in \"${T}\".`,
      incorrectRationales: {
        B: "Speed without prioritization increases omissions.",
        C: "Extended non-clinical pauses can delay necessary assessments.",
        D: "Borrowed tools without patient-specific understanding are unsafe.",
      },
    },
  ];
  const t = templates[pickIndex(`${row.topicSlug}:comm`, templates.length)];
  return wrapQuestion(row, globalIdx, 2, {
    stem: t.stem,
    questionType: "single-best-answer",
    choices: t.choices,
    correctAnswer: t.correctAnswer,
    correctAnswers: null,
    rationale: t.rationale,
    incorrectRationales: t.incorrectRationales,
  });
}

function stripLessonForSchemaExport(lesson) {
  const { pathwayId: _p, blueprintMeta: _b, ...rest } = lesson;
  return rest;
}

function stripQuestionForSchemaExport(q) {
  const { pathwayId: _p, ...rest } = q;
  return rest;
}

function questionMetaStats(questions) {
  const difficultyDistribution = { easy: 0, medium: 0, hard: 0 };
  const typeDistribution = {};
  const domains = new Set();
  for (const q of questions) {
    difficultyDistribution[q.difficulty] = (difficultyDistribution[q.difficulty] || 0) + 1;
    typeDistribution[q.questionType] = (typeDistribution[q.questionType] || 0) + 1;
    domains.add(q.domain);
  }
  return { difficultyDistribution, typeDistribution, domainsCovered: domains.size };
}

function main() {
  const bp = JSON.parse(fs.readFileSync(BLUEPRINT, "utf8"));
  const allRows = bp.topics;
  const selected = selectFortyTopics(bp);

  const lessons = selected.map((row) => buildLesson(allRows, row));

  const relatedByTopic = new Map(
    lessons.map((l) => {
      const chain = [l.topicSlug, ...(l.relatedTopicSlugs || [])];
      const uniq = [...new Set(chain)].slice(0, 6);
      return [l.topicSlug, uniq.slice(0, 3)];
    }),
  );

  const questions = [];
  let g = 0;
  for (const row of selected) {
    questions.push(buildQuestionPrioritization(row, g++));
    questions.push(buildQuestionDelegation(row, g++));
    questions.push(buildQuestionCommTime(row, g++));
  }

  for (const q of questions) {
    q.relatedLessonSlugs = relatedByTopic.get(q.topicSlug) || [q.topicSlug];
  }

  if (lessons.length !== 40) throw new Error(`lessons ${lessons.length}`);
  if (questions.length !== 120) throw new Error(`questions ${questions.length}`);

  const seen = new Set();
  for (const q of questions) {
    const h = stemHash(q.stem);
    if (seen.has(h)) throw new Error(`Duplicate stem hash for ${q.topicSlug}`);
    seen.add(h);
  }

  const byDomain = {};
  for (const l of lessons) byDomain[l.domain] = (byDomain[l.domain] || 0) + 1;

  const generatedAt = new Date().toISOString();
  const qStats = questionMetaStats(questions);

  const out = {
    _meta: {
      description: "40 new-grad transition lessons + 120 scenario questions (static generator)",
      program: PROGRAM,
      pathwayId: PATHWAY_ID,
      blueprintFile: "output/new-grad-transition-blueprint.json",
      generatedAt,
      topicDomainsIncluded: DOMAIN_SEQUENCE,
      lessonsByDomain: byDomain,
      totalLessons: lessons.length,
      totalQuestions: questions.length,
      questionsPerTopic: 3,
      scenarioTypes: ["multi-patient prioritization", "delegation follow-up", "SBAR/time management"],
      stemHashAlgorithm: "sha256-hex-first32-lowercase-stem",
      splitExports: {
        lessons: "output/new-grad-transition-batch-40-lessons.json",
        questions: "output/new-grad-transition-batch-120-questions.json",
      },
    },
    lessons,
    questions,
  };

  const lessonsExport = {
    _meta: {
      description:
        "40 blueprint-topic lessons (Prioritization, Delegation, Time Management, Shift Organization, Physician Communication, Handoff, Escalation) — batch extension",
      totalLessons: lessons.length,
      program: PROGRAM,
      generatedAt,
      schemaVersion: "1.0",
      sourceBlueprint: "output/new-grad-transition-blueprint.json",
    },
    lessons: lessons.map(stripLessonForSchemaExport),
  };

  const questionsExport = {
    _meta: {
      description: "120 scenario-based exam questions for the 40-topic new-grad batch (3 per lesson)",
      totalQuestions: questions.length,
      program: PROGRAM,
      generatedAt,
      domainsCovered: qStats.domainsCovered,
      difficultyDistribution: qStats.difficultyDistribution,
      typeDistribution: qStats.typeDistribution,
    },
    questions: questions.map(stripQuestionForSchemaExport),
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2), "utf8");
  fs.writeFileSync(OUT_LESSONS, JSON.stringify(lessonsExport, null, 2), "utf8");
  fs.writeFileSync(OUT_QUESTIONS, JSON.stringify(questionsExport, null, 2), "utf8");
  console.log(`Wrote ${OUT}`);
  console.log(`Wrote ${OUT_LESSONS}`);
  console.log(`Wrote ${OUT_QUESTIONS}`);
  console.log(JSON.stringify(out._meta, null, 2));
}

main();
