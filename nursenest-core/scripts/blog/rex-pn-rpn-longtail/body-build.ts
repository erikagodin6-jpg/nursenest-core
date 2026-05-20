import type { AnchorSpec } from "./anchors-data";
import type { VariantSpec } from "./variants-data";
import { hashString, pick, pickIndex } from "./hash-pick";

function h2(title: string, body: string): string {
  return `<h2>${title}</h2>\n${body.trim()}\n`;
}

function p(...chunks: string[]): string {
  return chunks.map((c) => `<p>${c}</p>`).join("\n");
}

const BLOG_LINKS_POOL = [
  { href: "/blog/hyperkalemia-ecg-changes-nursing-students", label: "Hyperkalemia ECG changes and potassium safety (long-tail review)" },
  { href: "/blog/sepsis-pathophysiology-early-nursing-recognition", label: "Sepsis recognition and early nursing priorities" },
  { href: "/blog/acute-kidney-injury-prerenal-intrinsic-postrenal", label: "Acute kidney injury patterns for exam reasoning" },
  { href: "/blog/left-sided-vs-right-sided-heart-failure", label: "Left-sided versus right-sided heart failure comparison" },
  { href: "/blog/copd-symptoms-treatment-nursing-care", label: "COPD symptoms, oxygen safety themes, and nursing care" },
  { href: "/blog/hyponatremia-symptoms-causes-nursing-priorities", label: "Hyponatremia assessment and nursing priorities" },
  { href: "/blog/warfarin-vs-heparin-nursing-comparison", label: "Warfarin versus heparin nursing comparison (anticoagulation reasoning)" },
] as const;

/** Deterministic internal link set (4–5) per slug */
function internalLinksHtml(slug: string): string {
  const seed = hashString(`${slug}-links`);
  const used = new Set<number>();
  const items: string[] = [];
  items.push(`<li><a href="/app/dashboard">NurseNest learner dashboard</a> — track progress, streaks, and your next best study step.</li>`);
  items.push(`<li><a href="/app/flashcards">Flashcards</a> — spaced repetition for vocabulary-heavy nursing topics.</li>`);
  items.push(`<li><a href="/app/practice-tests">Practice tests and CAT-style workflows</a> — build stamina for case-based items.</li>`);
  items.push(`<li><a href="/app/labs">Labs hub</a> — strengthen interpretation skills that show up in clinical stems.</li>`);
  let n = 0;
  while (n < 2) {
    const idx = pickIndex(seed + n * 9973, BLOG_LINKS_POOL.length);
    if (used.has(idx)) break;
    used.add(idx);
    const row = BLOG_LINKS_POOL[idx]!;
    items.push(`<li><a href="${row.href}">${row.label}</a></li>`);
    n++;
  }
  return `<ul>\n${items.map((x) => `  ${x}`).join("\n")}\n</ul>`;
}

function faqBlock(slug: string, anchor: AnchorSpec, variant: VariantSpec): string {
  const seed = hashString(`${slug}-faq`);
  const q1 = pick(
    [
      `How does ${variant.emphasis} change the “best answer” on REx-PN-style items?`,
      `What should Canadian PN students emphasize when studying ${anchor.titleCore.toLowerCase()}?`,
      `Why do REx-PN writers pair ${anchor.category.toLowerCase()} with safety language?`,
    ],
    seed,
  );
  const q2 = pick(
    [
      "Is this article a substitute for my college’s clinical placement expectations?",
      "Does this content replace my provincial regulatory college standards?",
      "Can I use this page as individualized medical advice?",
    ],
    seed + 1,
  );
  const q3 = pick(
    [
      "How should I practise so this topic feels automatic under time pressure?",
      "What is the fastest way to turn reading into exam-ready judgment?",
      "Which NurseNest surfaces pair best with this topic for repetition?",
    ],
    seed + 2,
  );
  return `
<h3>${q1}</h3>
<p>Examinations reward the safest next step within practical nursing scope, clear communication, and trend-based thinking. Use this guide to organize the stem: identify instability first, then match actions to orders, policy, and Canadian documentation expectations.</p>
<h3>${q2}</h3>
<p>No. This resource supports educational exam preparation. Your program manual, clinical agency policies, and provincial regulatory standards remain authoritative for practice decisions.</p>
<h3>${q3}</h3>
<p>Alternate short reading sessions with question practice, verbalize rationales out loud, and revisit missed items with a short written summary of the mechanism you misunderstood.</p>`.trim();
}

function apaReferences(seed: number): string {
  const blocks = [
    `<p>Canadian Institute for Health Information. (2023). <em>Health workforce in Canada</em>. Government of Canada Open Data and CIHI catalogues (use current CIHI pages for coursework citations).</p>`,
    `<p>College of Nurses of Ontario. (2024). <em>Practice standards and guidelines</em>. Retrieved from https://www.cno.org/en/standards-guidelines/ (use your province’s college site if you are not in Ontario).</p>`,
    `<p>Government of Canada. (2023). <em>Medication safety for consumers</em>. Health Canada. Retrieved from https://www.canada.ca/en/health-canada/services/drugs-health-products/medication-use.html</p>`,
    `<p>Public Health Agency of Canada. (2023). <em>Infection prevention and control</em>. Retrieved from https://www.canada.ca/en/public-health/services/infection-prevention-control.html</p>`,
    `<p>Registered Nurses' Association of Ontario. (2017). <em>Preventing falls and reducing injury from falls</em> (3rd ed.). Nursing Best Practice Guidelines. Retrieved from https://rnao.ca/bpg/guidelines/prev-falls-injury</p>`,
    `<p>Health Standards Organization &amp; Canadian Patient Safety Institute. (2020). <em>Canadian medication reconciliation</em> (HSO standard; educational overview). Retrieved from https://www.patientsafetyinstitute.ca/en/toolsResources/</p>`,
  ];
  const a = pickIndex(seed, blocks.length);
  const b = (a + 2) % blocks.length;
  const c = (a + 4) % blocks.length;
  return [blocks[a], blocks[b], blocks[c]].join("\n");
}

/**
 * Long-form HTML body for hybrid static long-tail markdown.
 * Target: ≥1400 words substantive teaching text (counted without frontmatter).
 */
export function buildLongtailBodyHtml(slug: string, anchor: AnchorSpec, variant: VariantSpec): string {
  const seed = hashString(slug);
  const lens = anchor.lens;
  const cues = anchor.cues;
  const settings = anchor.settings;
  const em = variant.emphasis;
  const titleCore = anchor.titleCore;

  const intro = p(
    `This deep guide is written for <strong>Canadian practical nursing (PN/RPN) students</strong> who are building confidence for <strong>REx-PN</strong>-style case questions. The focus is <strong>${titleCore.toLowerCase()}</strong>, anchored in realistic Canadian workflows: medication safety language, interprofessional collaboration, and escalation habits that match what regulators expect at the entry-to-practice level.`,
    `${lens} As you read, keep two questions active: what is the patient’s trajectory right now, and what is the safest nursing action within <strong>practical nursing scope</strong> in the setting described? Those two questions mirror how high-quality items separate a “true statement” from the <strong>best next step</strong>.`,
    `NurseNest treats exam prep as clinical reasoning training, not trivia memorization. That means you will see connections between assessment cues, documentation obligations, teaching priorities, and the ${em} themes that show up repeatedly when writers want to test whether you can protect patients during uncertainty.`,
    `Throughout, we use <strong>Canadian terminology</strong> (for example, practical nurse/RPN language, Canadian medication safety expectations, and IPAC phrasing aligned to national and provincial public health materials). If your program uses a slightly different label for a role or form, map the concept to your local policy rather than debating naming alone.`,
  );

  const takeaways = `<ul>
  <li><strong>REx-PN</strong> items often reward trend recognition, not single-point data, when the stem describes ${titleCore.toLowerCase()}.</li>
  <li>Canadian PN scope is <strong>setting- and province-dependent</strong>; exams still expect you to refuse actions outside scope even when the patient needs help.</li>
  <li>${cues.split(".")[0]}.</li>
  <li>Documentation should make your assessment, actions, education, and escalation <strong>auditable</strong> for another nurse continuing care.</li>
  <li>Patient teaching should be <strong>plain-language, teach-back friendly</strong>, and culturally humble rather than lecture-style.</li>
  <li>Use this page as a structured review, then immediately apply it with practice questions so judgment stays fast under pressure.</li>
</ul>`;

  const whyRex = p(
    `The REx-PN exam pathway is designed for <strong>Canadian entry-to-practice</strong> expectations. That matters because clinical judgment questions are written with Canadian healthcare structures in mind: primary care access patterns, hospital and LTC staffing realities, public health reporting themes, and medication safety habits that differ from United States-centric vignettes.`,
    `When a stem highlights ${titleCore.toLowerCase()}, writers are often testing whether you can connect classroom pathophysiology to <strong>what a practical nurse can assess, monitor, teach, delegate, and escalate</strong> in the same breath. That is different from memorizing a textbook paragraph in isolation. The exam wants the habit of scanning for instability, then choosing an action that matches scope and policy.`,
    `Another REx-PN pattern is “layered distractors”: two answers sound caring, but one delays necessary escalation; two answers sound clinical, but one exceeds PN scope; two answers sound educational, but one ignores acute risk. Your preparation should train you to notice which layer the item is testing: safety, delegation, documentation, teaching, or prioritization.`,
  );

  const scope = p(
    `Canadian practical nursing scope is not uniform across every province, yet exam items still require a consistent principle: <strong>work within orders, policy, and regulatory standards</strong>, and use interprofessional pathways when needs exceed independent nursing actions. When you study ${titleCore.toLowerCase()}, keep a mental checklist: assessment and monitoring within training, medication administration when authorized, wound and device care as competency and policy allow, teaching and coaching, and early notification when risk rises.`,
    `In ${settings}, the same clinical topic can look different depending on resources. A home care visit may emphasize teaching and environmental modification; an LTC night shift may emphasize safe med passes, falls risk, and delirium surveillance; an acute med-surg assignment may emphasize pre- and post-op pathways, IV site checks, and rapid response activation language. The exam rewards matching your answer to the <strong>setting implied by the stem</strong>, not your favourite rotation experience.`,
    `Delegation is a recurring Canadian theme. Practical nurses frequently collaborate with unregulated care providers (UCPs) and other roles. Items may test appropriate delegation, clear instruction, follow-up, and accountability. The wrong answer often “sounds efficient” but removes necessary supervision or asks a UCP to perform a task that requires nursing judgment you cannot delegate away.`,
    `Finally, cultural safety and anti-racism are increasingly embedded as professional expectations for Canadian nurses. Items may test respectful communication, advocacy within scope, and awareness of structural barriers affecting access and trust. Prepare by learning foundational concepts from your program’s assigned sources rather than relying on stereotypes.`,
  );

  const judgment = p(
    `Clinical judgment, for practical nursing exams, is the disciplined sequence: <strong>notice risk → choose the safest immediate nursing action → communicate clearly → document objectively → reassess</strong>. For ${titleCore.toLowerCase()}, your “risk scan” should deliberately include vitals trajectory, pain and comfort, infection cues, mobility and safety, medication effects, cognitive status, fluid balance, and psychosocial stressors that change adherence.`,
    `Prioritization drills should force you to name the <strong>most urgent threat</strong> in one sentence. If you cannot name it, you are guessing. Common urgent threats include airway compromise, uncontrolled bleeding, sepsis suspicion, new neurologic deficits, chest pain patterns that require escalation, severe hypoglycemia, high fever with immunocompromise, and sudden behaviour change suggesting delirium or stroke.`,
    `This variant emphasizes <strong>${em}</strong>. Apply that lens directly: when two interventions are “nice to do,” pick the one that reduces imminent harm or stabilizes the patient pathway. When two communications are “reasonable,” pick the one that closes the loop with the right role at the right urgency. When two documentation options exist, pick the one that captures objective findings and follow-up rather than judgemental language.`,
    `If you feel stuck, replay the stem as a handoff: what would you want the next nurse to know immediately? That question often reveals the priority data point, the priority action, and the priority escalation.`,
  );

  const traps = p(
    `Common REx-PN traps for this topic cluster include choosing teaching when the patient is unstable, choosing independent prescription-style fixes, choosing “reassure only” when objective data are worsening, and choosing interventions that require a physician/nurse practitioner order you do not have. Another trap is selecting an answer because it contains a buzzword (“beta blocker,” “potassium,” “oxygen”) without matching mechanism to presentation.`,
    `Canadian exams also like to test whether you understand <strong>medication administration rights</strong> as a safety system, not a chant. The distractor may show a partially correct check that still violates policy (wrong patient, wrong time, unclear order, unclear route, allergy not verified). Another favourite is antibiotic stewardship framing: infection signs plus culture themes without implying you independently select antibiotics.`,
    `Finally, watch for traps that confuse <strong>scope in different settings</strong>. The practical nurse in LTC may have a different medication administration profile than the PN in a clinic item. Read for what the stem author explicitly authorizes you to do.`,
  );

  const delegation = p(
    `Safety and delegation questions expect you to protect patients while respecting accountability chains. For ${titleCore.toLowerCase()}, ask: is this task appropriate to delegate, did I give clear criteria and timelines, and how will I verify outcomes? If the task requires ongoing nursing assessment that cannot be reduced to a checklist, delegation may be inappropriate.`,
    `Canadian medication safety language often emphasizes verification, high-alert drug vigilance, independent double checks where required by policy, and reporting near misses. Items may reward refusing to administer when the five rights cannot be satisfied, even when a patient pressures you to “just give it.”`,
    `Escalation is part of safety. If you recognize a pattern that suggests abuse, neglect, infectious disease risk beyond routine precautions, or sudden deterioration, the exam expects you to follow the safest pathway: notify appropriate roles, preserve evidence-oriented documentation language, and keep the patient physically safe within your abilities.`,
  );

  const documentation = p(
    `Documentation expectations on Canadian exams frequently test objective, timed, and signed entries rather than narrative opinion. For ${titleCore.toLowerCase()}, strong charting includes what you assessed (with specifics), what changed compared to prior entries, what you did, what you taught, how the patient responded, and what you communicated upstream.`,
    `Avoid blamey adjectives about patients or families. Avoid copying forward vague phrases (“fine,” “stable”) without supporting data. Avoid charting ahead of care. If the item tests legal sensitivity, choose language that shows facts, actions, and follow-up rather than diagnostic certainty you cannot claim.`,
    `If your variant emphasizes documentation, practise rewriting one paragraph of notes into a legally defensible version: short sentences, measurable findings, and clear times.`,
  );

  const communication = p(
    `Communication and teaching questions reward empathy without vagueness. For ${titleCore.toLowerCase()}, use teach-back, chunk-and-check, interpreter access when language barriers exist, and culturally safer approaches that centre patient goals rather than nurse convenience.`,
    `Canadian patient teaching often includes practical constraints: medication costs, transportation, shift work, caregiving loads, food security, and literacy. The best answer frequently acknowledges barriers and offers a feasible plan (follow-up timing, simplified teaching aids, referral suggestions within scope) rather than a generic lecture.`,
    `Therapeutic communication also includes boundaries: professional tone, trauma-informed pacing, and redirecting inappropriate behaviour while preserving dignity.`,
  );

  const escalation = p(
    `Red flag situations are the exam’s favourite accelerators. For this topic, connect ${cues.toLowerCase()} to escalation pathways used in Canadian agencies: notify the nurse in charge or provider using SBAR, activate rapid response or emergency services when criteria are met, and follow sepsis or stroke protocols as taught rather than improvising.`,
    `If the stem includes infectious disease risk that requires airborne or droplet precautions beyond routine practices, your answer should reflect IPAC training rather than “finish the task quickly.” If the stem includes possible interpersonal violence, choose safety, private assessment opportunities, and reporting pathways rather than confrontational heroics.`,
    `Escalation is not failure; it is nursing judgment. Many learners lose points because they confuse “independence” with “avoiding help.”`,
  );

  const ngn = p(
    `NGN-style and case-based thinking often appear as trend items, select-all-that-apply, matrix layouts, or bowtie diagrams depending on your exam interface training. The underlying skill is unchanged: identify the mechanism, identify the harm, and match evidence to actions.`,
    `For ${titleCore.toLowerCase()}, practise “chart review” thinking: scan vitals across time, scan intake/output, scan lab rows for directionality, and scan nurse notes for subtle wording changes. Then answer the item’s prompt exactly—some students miss points because they answer a different question than the one asked.`,
    `When an item allows multiple correct options, avoid extreme all-or-nothing guessing. Use elimination based on scope and safety first.`,
  );

  const review = p(
    `Exam-focused review points: re-state ${titleCore.toLowerCase()} in one sentence without looking; list six assessment cues you would actually measure at the bedside; list four nursing actions you can take within PN scope; list three red flags that force escalation; list two teaching statements you would use with a patient; list one documentation sentence you would chart after the encounter.`,
    `If you cannot complete that checklist quickly, you are not exam-ready yet—return to your skills lab objectives and your program’s clinical decision-making framework.`,
  );

  const premium = p(
    `Premium NurseNest pathways help you convert reading into repetition: lessons that respect your time, flashcards for vocabulary-heavy concepts, practice tests that mirror case complexity, and CAT-style experiences that push you to stabilize under pressure. Use this article as orientation, then let the platform drive spaced practice so ${titleCore.toLowerCase()} becomes automatic recognition rather than slow recall.`,
    `If you are balancing school, work, and caregiving, prioritize short daily sessions over occasional marathon cramming—consistency beats intensity for long-tail topics like ${anchor.category.toLowerCase()}.`,
  );

  const parts = [
    h2("Introduction", intro),
    h2("Key Takeaways", takeaways),
    h2("Why this matters for REx-PN", whyRex),
    h2("Canadian practical nursing scope considerations", scope),
    h2("Clinical judgment and prioritization", judgment),
    h2("Common REx-PN exam traps", traps),
    h2("Safety and delegation considerations", delegation),
    h2("Documentation expectations", documentation),
    h2("Communication and patient teaching", communication),
    h2("Escalation/red flag situations", escalation),
    h2("NGN/REx-style question thinking", ngn),
    h2("Exam-focused review points", review),
    h2("Suggested internal links", internalLinksHtml(slug)),
    h2("Premium CTA", premium),
    h2("FAQ Schema Questions", faqBlock(slug, anchor, variant)),
    h2("APA-7 references", apaReferences(seed)),
  ];

  return `${parts.join("\n\n")}\n`;
}
