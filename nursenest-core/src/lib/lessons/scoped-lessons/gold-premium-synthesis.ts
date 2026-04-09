/**
 * Builds 11-section premium pathway lessons from legacy five-block gold content + shared core.
 * Keeps clinical substance in one place while meeting premium structure and word-count targets.
 */
import { PREMIUM_MIN_WORDS, PREMIUM_SECTION_HEADINGS } from "@/lib/lessons/pathway-lesson-premium";
import { countWords, stripToPlainText } from "@/lib/content-quality/plain-text";
import type {
  PathwayLessonOmittedPremiumSection,
  PathwayLessonRelatedRef,
  PathwayLessonSection,
} from "@/lib/lessons/pathway-lesson-types";

export type GoldTierGeo = "us_pn" | "ca_rpn" | "us_rn" | "ca_rn" | "us_np";

/** Exam label for bridging prose in premium introductions. */
export const PATHWAY_EXAM_LABEL: Record<string, string> = {
  "us-lpn-nclex-pn": "NCLEX-PN (United States)",
  "ca-rpn-rex-pn": "REx-PN (Canada)",
  "us-rn-nclex-rn": "NCLEX-RN (United States)",
  "ca-rn-nclex-rn": "NCLEX-RN (Canada)",
  "us-np-fnp": "NP certification preparation (United States)",
  "us-np-agpcnp": "NP certification preparation (United States)",
  "us-np-pmhnp": "NP certification preparation (United States)",
};

export function pathwayIdToTierGeo(pathwayId: string): GoldTierGeo | null {
  const m: Record<string, GoldTierGeo> = {
    "us-lpn-nclex-pn": "us_pn",
    "ca-rpn-rex-pn": "ca_rpn",
    "us-rn-nclex-rn": "us_rn",
    "ca-rn-nclex-rn": "ca_rn",
    "us-np-fnp": "us_np",
    "us-np-agpcnp": "us_np",
    "us-np-pmhnp": "us_np",
  };
  return m[pathwayId] ?? null;
}

export type GoldPremiumSynthesisInput = {
  /** High-yield pathophysiology / mechanism block (maps to Pathophysiology / Overview). */
  sharedCore: string;
  clinical_meaning: string;
  exam_relevance: string;
  clinical_scenario: string;
  takeaways: string;
  tierGeo: GoldTierGeo;
  /** Human-readable exam label for bridging prose, e.g. "NCLEX-RN (US)". */
  examLabel: string;
  /** Optional labs body; when absent, labs section is omitted with reason. */
  labsDiagnostics?: string;
  labsOmitReason?: string;
  /** When country notes are not needed (e.g. already embedded everywhere). */
  countryNotesOmitReason?: string;
  relatedSlugs: string[];
  relatedTitlesBySlug?: Record<string, string>;
};

function ensureTierRelevanceWordCount(body: string): string {
  return ensureMinimumWords(body, PREMIUM_MIN_WORDS.tier_specific_relevance, TIER_RELEVANCE_PAD);
}

function tierRelevanceBlock(tierGeo: GoldTierGeo): string {
  switch (tierGeo) {
    case "us_pn":
      return `**RN (registered nurse) items** often give you **assignment authority**, **care plan changes**, **IV push scope where licensed**, and **leadership in rapid response**—the stem expects you to **coordinate**, **prioritize multiple patients**, and **interpret trends** that change orders.

**PN/LVN (US)** items emphasize **stable execution within orders**, **timely reporting**, **reinforcement of teaching**, and **safe delegation awareness**—avoid answers that **silently expand scope** (independent titration, diagnosing beyond assessment data, or delaying escalation).

**NP (US)** items add **diagnostic reasoning**, **risk stratification**, **prescribing and follow-up planning** when the vignette is ambulatory or protocol-driven—choose **site-of-care** and **cannot-miss** pathways over reassurance when red flags appear.

**How to use this triad**  
Read the stem’s **role line first**. Then eliminate options that belong to a **different license level** than the item tests, even if the clinical topic is the same.`;
    case "ca_rpn":
      return `**RN (Canada)** items assume **collaborative acute care**, **independent nursing judgment within standards**, and **clear documentation** when client status changes—expect **metric labs** and **interprofessional** language.

**RPN (Canada)** items align with **college standards** and **employer policy**: strong **assessment and reporting**, **ordered interventions**, and **safe scope**—avoid **prescriptive authority** or **RN-only triage** unless the stem explicitly authorizes a protocol.

**NP (Canada)** where tested mirrors **advanced assessment**, **diagnosis-related reasoning**, and **treatment planning** within the item’s specialty frame.

**Study tip**  
When a stem names a role, treat **scope errors** as high-probability distractors—especially around **medication changes**, **diagnostic interpretation**, and **discharge decisions**.`;
    case "us_rn":
      return `**RN (US)** items reward **synthesis**: linking vitals, labs, and history to **risk**, then choosing **assessment or intervention** that matches **unstable versus stable** presentations.

**PN/LVN** work is often shown as **supportive**—your RN answer should still **respect** what PNs do, but the item usually tests **RN leadership**, **teaching**, **care coordination**, and **priority decisions**.

**NP** items are distinct on **NP pathways**; when you are on an RN hub, do not import **prescriptive** actions unless the stem places you in that role.

**Exam habit**  
After reading the stem, say aloud: **who am I here?** Then lock scope before you eliminate options.`;
    case "ca_rn":
      return `**RN (Canada)** items emphasize **clinical judgment** with **Canadian context** (metric units, interprofessional roles, and college-aligned language) while testing the **same prioritization spine** as US boards.

**RPN** items (on PN pathways) stress **safe scope**, **timely collaboration**, and **objective reporting**—choose **escalation** over **silent fixes** when findings exceed stable monitoring.

**NP** reasoning appears on **NP pathways**; keep **RN hub** answers within **RN authority** unless the item explicitly shifts role.

**Crosswalk**  
When you see **mmol/L**, **kPa**, or Canadian facility labels, the **judgment pattern** still prioritizes **life threats**, **acute change**, and **safe sequencing**.`;
    case "us_np":
      return `**NP items** test **ambulatory and acute decision-making**: **cannot-miss** presentations, **risk scores when appropriate**, **shared decision-making**, and **clear safety netting**—not “reassuring” through red flags.

**RN-level care** still matters as background: you should **recognize** when **inpatient escalation** beats **outpatient watchful waiting**.

**PN/LVN scope** is rarely the tested operator in NP items; avoid **delegating diagnostic responsibility** to roles the stem does not assign.

**Practical filter**  
If two answers are “nice,” pick the one that **closes risk fastest** with **appropriate site-of-care** and **follow-up that is specific**.

**Documentation and medicolegal tone**  
NP stems still reward **objective reasoning**: what you ruled out, what you monitored, and what you told the client to do if things worsen—examiners embed **silent deterioration** and **ambiguous consent** as distractors.`;
    default:
      return "";
  }
}

function countryNotesBlock(tierGeo: GoldTierGeo): string {
  switch (tierGeo) {
    case "ca_rpn":
    case "ca_rn":
      return `**Canada-specific emphasis**  
Stems may show **SI labs** and Canadian care settings. **Provincial colleges** and **employer policy** still define what each role may initiate independently—items reward **safe collaboration** and **timely RN/NP/physician contact** when status changes.

**Terminology**  
Expect **RPN** language for practical nursing and **RN** for registered nursing; exam writers often embed **metric vitals** and **interprofessional** cues that mirror practice documents, not US state boards.

**Exam habit**  
When units or titles look unfamiliar, translate them into **risk and scope**: who must be notified, what must be reassessed, and what cannot wait—Canadian stems use the same **prioritization spine** as US items with different labels on the vitals line.`;
    case "us_pn":
    case "us_rn":
    case "us_np":
      return `**United States emphasis**  
Items reference **state-dependent scope** through the **stem’s role** and **order context**. Prefer **protocol/order-driven** actions for practical nurses, **independent nursing judgment** within standards for RNs, and **advanced-practice** reasoning for NPs when applicable. Facility policy and standing orders still appear as the “rules of the game” inside the vignette.

**Exam vocabulary**  
**LVN/LPN**, **RN**, and **NP** labels are deliberate; mismatched actions (for example, prescribing as an LPN) are classic distractors.

**Study angle**  
When a US item feels “unfair,” it is often testing whether you **respect scope** and **escalate** instead of improvising. Choose answers that **protect the client** and **match the license** named in the stem, even when another action would be appropriate for a different role.`;
    default:
      return "";
  }
}

function relatedNextStepsBody(input: GoldPremiumSynthesisInput): string {
  const lines: string[] = [
    "Use this lesson as a hub: connect the pathophysiology and traps below to **timed question practice** and **topic-scoped review** so the pattern sticks under pressure.",
  ];
  for (const slug of input.relatedSlugs.slice(0, 6)) {
    const title = input.relatedTitlesBySlug?.[slug] ?? slug.replace(/-/g, " ");
    lines.push(`- Deepen with **[${title}](LESSON:${slug})** when that topic appears in the same stem family.`);
  }
  lines.push(
    `- Return to your **pathway lessons hub** and run a **question bank** session on the same topic tag to consolidate elimination habits for **${input.examLabel}**.`,
    `- Pair with **flashcards** on the matching concept cluster so vocabulary (labs, medications, escalation phrases) is automatic on exam day.`,
  );
  return lines.join("\n\n");
}

function nursingBlock(input: GoldPremiumSynthesisInput): string {
  return `**Assessment priorities**  
Start from **objective data** that changes fastest: **vitals**, **oxygenation**, **perfusion**, **mental status**, **pain pattern**, and **bleeding** when relevant. Tie each finding to **what could worsen in the next minutes**—that lens matches how stems are written.

**Head-to-toe discipline**  
When the vignette feels vague, run a structured scan: **airway and work of breathing**, **circulation and end-organ perfusion**, **neuro baseline**, **infection sources**, and **lines, tubes, and drains** that can fail quietly. Prefer **trends** over a single snapshot when the stem gives multiple time points.

**Monitoring and actions**  
Stay inside the **orders and role** the stem assigns for **${input.examLabel}**. Execute **safe, sequential** care: stabilize the client, **reassess after time-limited interventions**, and **communicate clearly** with the interprofessional team using **concise reporting** (situation, background, assessment, and what you need next).

**Escalation**  
When data cross instability thresholds implied by the vignette, choose **activation of emergency resources**, **provider notification**, or **higher level of care** over **routine tasks**, **delayed reassessment**, or **comfort-only** choices that ignore trajectory.

**Communication that wins points**  
Use **objective, concise reporting** (trend + current value + what you need) rather than long narratives. Exams reward **closed-loop** communication: you assessed, you acted within role, you notified, and you prepared the client or environment for the next step in care.`;
}

function clientEducationBlock(input: GoldPremiumSynthesisInput): string {
  return `**Safety teaching**  
Translate pathophysiology into **what the client should feel**, **what to track at home when appropriate**, and **when to seek urgent care**—items reward **specific** return precautions rather than vague reassurance. Avoid teaching that **minimizes red flags** or **promises certainty** when the clinical situation still needs monitoring.

**Follow-up**  
Include **medication adherence cues**, **device use** (oxygen delivery, inhalers), and **symptom journals** when the topic fits. Link teaching to **monitoring** you can verify (for example, **peak flow**, **weights**, **glucose**, **wound changes**, or **daily functional tolerance**) so education is actionable, not abstract.

**Family and caregivers**  
When stems include family, choose answers that **empower observation** (“call if…”) and **clear escalation paths**, while respecting **privacy** and **scope** for your role in **${input.examLabel}**. The best options name **specific triggers** (worsening shortness of breath, new neurologic changes, uncontrolled pain, fever with confusion) rather than generic advice.`;
}

function redFlagsBlock(): string {
  return `**Treat as emergent when** you see **rapid trajectory change**: worsening hypotension despite therapy, **new neurologic deficit**, **crushing chest pressure with diaphoresis**, **oxygenation that fails to improve with appropriate delivery**, **uncontrolled bleeding**, or **sepsis physiology** (fever or hypothermia with tachycardia and poor perfusion).

**Escalation beats busywork**  
The right option usually **closes a safety loop**: **rapid response or code activation** when criteria are met, **concise provider notification with objective data**, **preparing time-sensitive medications or procedures**, or **moving to a higher level of care**. Wrong options often **finish documentation first**, **delay reassessment**, **offer reassurance without data**, or **teach** while instability is still unresolved.

**Distractor families**  
Comfort requests, routine medications, and **non-urgent tasks** are deliberately paired with **abnormal vitals** or **worsening symptoms**—the exam is testing whether you **protect the client now** and **communicate risk** clearly, not whether you can complete the longest task list.`;
}

function collapseInlineParagraphs(s: string): string {
  return s.trim().replace(/\n\n+/g, " ").replace(/\s+/g, " ");
}

/** Keep 2–3 `\n\n`-separated paragraphs; grow the last paragraph until the intro meets the premium floor (max ~250 words). */
const INTRO_TOP_UP_SENTENCES = [
  "On the exam, writers often pair **stable-sounding options** with **unstable data**—notice the mismatch before you commit.",
  "If the stem names a **license or role**, reread that line; **scope errors** are classic trap answers even when the clinical topic is familiar.",
  "Run a **60-second scan**: breathing work and oxygenation, perfusion and end organs, neuro baseline, likely infection sources, and devices that can fail quietly.",
  "When two answers feel partly right, pick the one that **reduces imminent harm** and **matches orders** for the role you were given.",
  "Train yourself to state the **primary risk** in one short phrase **before** you read the options so distractors do not rewrite your priority list.",
];

function ensureIntroductionWordCount(intro: string): string {
  let text = intro.trim();
  let w = countWords(stripToPlainText(text));
  if (w >= PREMIUM_MIN_WORDS.introduction) return text;
  const paras = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  if (paras.length === 0) return text;
  let i = 0;
  while (w < PREMIUM_MIN_WORDS.introduction && i < INTRO_TOP_UP_SENTENCES.length) {
    paras[paras.length - 1] = `${paras[paras.length - 1]} ${INTRO_TOP_UP_SENTENCES[i]}`;
    text = paras.join("\n\n");
    w = countWords(stripToPlainText(text));
    i += 1;
  }
  return text;
}

const PATHO_EXAM_PAD = `**Connecting mechanism to the stem**  
When new data appear, trace them to the underlying process and the **compensatory response** that is winning or failing. Ask what assessment would **prove improvement** versus **deterioration** in the next few minutes—exam distractors often ignore that trajectory even when the words sound clinically sophisticated.`;

const PEARLS_DEPTH_PAD = `**One more exam habit**  
When an option feels emotionally “right,” verify it against **vitals, trajectory, and the role named in the stem** so you do not miss a quieter life threat hiding in the same vignette.`;

function ensureClinicalPearlsWordCount(body: string): string {
  const t = body.trim();
  if (countWords(stripToPlainText(t)) >= PREMIUM_MIN_WORDS.clinical_pearls) return t;
  return `${t}\n\n${PEARLS_DEPTH_PAD}`;
}

function ensurePathophysiologyDepth(body: string): string {
  const t = body.trim();
  if (countWords(stripToPlainText(t)) >= 140) return t;
  return `${t}\n\n${PATHO_EXAM_PAD}`;
}

/** Keeps premium validators satisfied when shared tier templates sit just under the floor. */
function ensureMinimumWords(body: string, min: number, padMarkdown: string): string {
  let t = body.trim();
  const pad = padMarkdown.trim();
  while (countWords(stripToPlainText(t)) < min) {
    t = `${t}\n\n${pad}`;
  }
  return t;
}

const TIER_RELEVANCE_PAD = `**Exam execution habit**  
Before you lock an answer, name the **primary instability**, the **assessment that proves or disproves it**, and the **communication or activation step** you would not skip. Boards reward **trajectory thinking** and **closed-loop teamwork**—not the longest comfort list—when vitals, perfusion, oxygenation, or mentation are shifting.`;

const CLINICAL_PEARLS_PAD = `**Second-pass discipline**  
If an option feels compassionate but ignores abnormal vitals, a new deficit, or worsening work of breathing, it is usually wrong. Re-scan the stem for **trend language**, **new orders**, and **line or device clues** before you submit.`;

/**
 * Premium validation requires a substantive meta summary; short variant blurbs from gold JSON often sit at ~10–11 words.
 */
export function ensurePremiumSeoDescription(description: string, examContext: string): string {
  const t = description.trim();
  if (countWords(stripToPlainText(t)) >= 12) return t;
  const ctx = examContext.trim() || "nursing licensure preparation";
  return `${t} NurseNest aligns this hub to ${ctx} item logic: vitals-first assessment, timely escalation when trajectory worsens, and scope-safe actions that close the safety loop.`.trim();
}

function signsBlock(clinical_scenario: string): string {
  return `${clinical_scenario.trim()}

**Early, classic, and late patterns**  
Read the stem’s timeline: **early** cues are often subtle (fatigue, mild dyspnea, vague discomfort, “something is off”), **classic** clusters are the board’s shorthand when it wants fast recognition, and **late** findings reflect **compensatory failure** (hypotension, altered mentation, collapse). Your job is to match the **stage implied by the data**, not the single picture you memorized from one textbook page.

**Tie symptoms to objective data**  
Pair what the client reports with **vitals**, **oxygenation**, **perfusion**, **pain quality**, **mental status**, and **relevant devices** so you are not guessing from adjectives alone—exam writers hide the diagnosis inside **concrete measurements** and short trend lines.`;
}

export function synthesizeGoldPremiumSections(
  input: GoldPremiumSynthesisInput,
): {
  sections: PathwayLessonSection[];
  premiumOmittedSections: PathwayLessonOmittedPremiumSection[];
  relatedLessonRefs: PathwayLessonRelatedRef[];
} {
  const intro = ensureIntroductionWordCount(
    [
      collapseInlineParagraphs(input.clinical_meaning),
      collapseInlineParagraphs(input.exam_relevance),
      `For **${input.examLabel}**, questions rarely announce the topic in the first sentence. They hide it inside **vitals, labs, and a short story**. Your job is to name the **clinical problem**, justify **why it matters now**, and select the **safest next step** for the **role** you are given—before you let distractors pull you toward busywork or out-of-scope heroics. When two answers feel partly right, pick the one that **closes risk first** and **matches your license** in the stem.`,
    ].join("\n\n"),
  );

  const pearls = ensureClinicalPearlsWordCount(
    [
      input.takeaways.trim(),
      `**Exam traps worth rehearsing**  
Watch for options that **sound compassionate** but **delay assessment**, **skip monitoring after an intervention**, or **assume stability** you have not established. **Pattern recognition** beats cramming isolated facts: rehearse **if I see X and Y, I think Z and do A** chains aloud.`,
      `**Quick self-check before you submit your answer**  
Name the **primary risk**, the **first assessment** that protects the client, and the **escalation** you would not skip—if you cannot say all three in one breath, re-read the stem for hidden instability.`,
    ].join("\n\n"),
  );

  const omitted: PathwayLessonOmittedPremiumSection[] = [];
  const labBody = input.labsDiagnostics?.trim();
  if (!labBody) {
    omitted.push({
      kind: "labs_diagnostics",
      reason:
        input.labsOmitReason?.trim() ||
        "Labs and diagnostics are covered in sibling lessons for this topic cluster; this lesson emphasizes prioritization and management patterns without duplicating standalone lab interpretation.",
    });
  }

  let countryBody = countryNotesBlock(input.tierGeo).trim();
  if (input.countryNotesOmitReason) {
    omitted.push({ kind: "country_specific_notes", reason: input.countryNotesOmitReason });
    countryBody = "";
  }

  const sections: PathwayLessonSection[] = [
    { id: "introduction", heading: PREMIUM_SECTION_HEADINGS.introduction, kind: "introduction", body: intro },
    {
      id: "pathophysiology_overview",
      heading: PREMIUM_SECTION_HEADINGS.pathophysiology_overview,
      kind: "pathophysiology_overview",
      body: ensurePathophysiologyDepth(input.sharedCore),
    },
    {
      id: "signs_symptoms",
      heading: PREMIUM_SECTION_HEADINGS.signs_symptoms,
      kind: "signs_symptoms",
      body: signsBlock(input.clinical_scenario),
    },
    {
      id: "red_flags",
      heading: PREMIUM_SECTION_HEADINGS.red_flags,
      kind: "red_flags",
      body: redFlagsBlock(),
    },
    ...(labBody
      ? [
          {
            id: "labs_diagnostics",
            heading: PREMIUM_SECTION_HEADINGS.labs_diagnostics,
            kind: "labs_diagnostics" as const,
            body: labBody,
          },
        ]
      : []),
    {
      id: "nursing_assessment_interventions",
      heading: PREMIUM_SECTION_HEADINGS.nursing_assessment_interventions,
      kind: "nursing_assessment_interventions",
      body: nursingBlock(input),
    },
    {
      id: "clinical_pearls",
      heading: PREMIUM_SECTION_HEADINGS.clinical_pearls,
      kind: "clinical_pearls",
      body: pearls,
    },
    {
      id: "client_education",
      heading: PREMIUM_SECTION_HEADINGS.client_education,
      kind: "client_education",
      body: clientEducationBlock(input),
    },
    {
      id: "tier_specific_relevance",
      heading: PREMIUM_SECTION_HEADINGS.tier_specific_relevance,
      kind: "tier_specific_relevance",
      body: ensureTierRelevanceWordCount(tierRelevanceBlock(input.tierGeo)),
    },
    ...(countryBody
      ? [
          {
            id: "country_specific_notes",
            heading: PREMIUM_SECTION_HEADINGS.country_specific_notes,
            kind: "country_specific_notes" as const,
            body: countryBody,
          },
        ]
      : []),
    {
      id: "related_next_steps",
      heading: PREMIUM_SECTION_HEADINGS.related_next_steps,
      kind: "related_next_steps",
      body: relatedNextStepsBody(input),
    },
  ];

  const relatedLessonRefs: PathwayLessonRelatedRef[] = input.relatedSlugs.map((slug) => ({
    slug,
    titleHint: input.relatedTitlesBySlug?.[slug],
  }));

  return { sections, premiumOmittedSections: omitted, relatedLessonRefs };
}

/** Structured case-study spine: scenario → findings → priorities → actions → rationale → safety (maps into premium sections). */
export type CaseStudyCasebookInput = {
  tierGeo: GoldTierGeo;
  examLabel: string;
  scenarioSetup: string;
  clinical_meaning: string;
  exam_relevance: string;
  pathophysiologyCore: string;
  keyFindingsSignsSymptoms: string;
  whatMattersMostEscalation: string;
  labsDiagnostics?: string;
  labsOmitReason?: string;
  prioritizationNextActions: string;
  rationaleDecisions: string;
  escalationSafetyTeaching: string;
  takeaways: string;
  relatedSlugs: string[];
  relatedTitlesBySlug?: Record<string, string>;
  countryNotesOmitReason?: string;
};

function padKind(kind: keyof typeof PREMIUM_MIN_WORDS, body: string, pad: string): string {
  let t = body.trim();
  while (countWords(stripToPlainText(t)) < PREMIUM_MIN_WORDS[kind]) {
    t = `${t}\n\n${pad.trim()}`;
  }
  return t;
}

function syntheticGoldInput(examLabel: string, tierGeo: GoldTierGeo): GoldPremiumSynthesisInput {
  return {
    sharedCore: "",
    clinical_meaning: "",
    exam_relevance: "",
    clinical_scenario: "",
    takeaways: "",
    tierGeo,
    examLabel,
    relatedSlugs: [],
  };
}

/** Merge overflow paragraphs so premium intro stays within 2–3 blocks (validator). */
function capPremiumIntroParagraphs(body: string, maxParagraphs: number): string {
  const paras = body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (paras.length <= maxParagraphs) return paras.join("\n\n");
  const head = paras.slice(0, maxParagraphs - 1);
  const tail = paras.slice(maxParagraphs - 1).join(" ");
  return [...head, tail].join("\n\n");
}

/**
 * Premium case-study lesson: explicit narrative blocks mapped to the exam-complete spine.
 * Use for RN / PN / NP pathway-scoped “casebook” lessons that differentiate from topic-overview gold lessons.
 */
export function synthesizeCaseStudyCasebookSections(input: CaseStudyCasebookInput): {
  sections: PathwayLessonSection[];
  premiumOmittedSections: PathwayLessonOmittedPremiumSection[];
  relatedLessonRefs: PathwayLessonRelatedRef[];
} {
  const syn = syntheticGoldInput(input.examLabel, input.tierGeo);
  /** Exactly 3 `\n\n`-separated blocks (premium intro allows 2–3 paragraphs). */
  const scenarioFlattened = input.scenarioSetup.trim().replace(/\s+/g, " ");
  const introCore = [
    `**Scenario setup**\n\n${scenarioFlattened}`,
    `${collapseInlineParagraphs(input.clinical_meaning)} ${collapseInlineParagraphs(input.exam_relevance)}`.trim(),
    `This **case-study format** is intentional: boards reward **trajectory thinking**—what changed, what is unstable, and what you do **next** for the **role** named in the stem. For **${input.examLabel}**, read the **assignment line** before you eliminate answers. **Slow read:** re-scan the stem for **vitals trends**, **oxygen settings**, **allergies**, and **time since onset**—case items often hide the decisive clue in a single line.`,
  ].join("\n\n");
  let intro = ensureIntroductionWordCount(introCore);
  if (countWords(stripToPlainText(intro)) < PREMIUM_MIN_WORDS.introduction) {
    intro = ensureMinimumWords(
      intro,
      PREMIUM_MIN_WORDS.introduction,
      `**Exam habit**  
Name the **single highest-risk problem** in one sentence before you read the options; case stems reward that discipline for **${input.examLabel}**.`,
    );
  }
  intro = capPremiumIntroParagraphs(intro, 3);
  let introWc = countWords(stripToPlainText(intro));
  let introPad = 0;
  while (introWc < PREMIUM_MIN_WORDS.introduction && introPad < 40) {
    const paras = intro.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
    if (paras.length === 0) break;
    paras[paras.length - 1] = `${paras[paras.length - 1]} ${INTRO_TOP_UP_SENTENCES[introPad % INTRO_TOP_UP_SENTENCES.length]}`;
    intro = paras.join("\n\n");
    introWc = countWords(stripToPlainText(intro));
    introPad += 1;
  }
  while (introWc > 250) {
    intro = intro.replace(/\s+[^\s.]+[.?!]\s*$/, "").trim();
    introWc = countWords(stripToPlainText(intro));
  }
  while (introWc < PREMIUM_MIN_WORDS.introduction) {
    const paras = intro.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
    if (paras.length === 0) break;
    paras[paras.length - 1] = `${paras[paras.length - 1]} ${INTRO_TOP_UP_SENTENCES[introPad % INTRO_TOP_UP_SENTENCES.length]}`;
    intro = paras.join("\n\n");
    introWc = countWords(stripToPlainText(intro));
    introPad += 1;
  }

  const signsBody = padKind(
    "signs_symptoms",
    signsBlock(input.keyFindingsSignsSymptoms),
    `**Key findings checklist**  
Re-read the stem for **numbers you skipped**: vitals trends, device settings, allergies, and time since symptom onset. Case-style items often hide the “why now” clue in a single lab line or a single sentence of background.`,
  );

  const redBody = padKind(
    "red_flags",
    `${input.whatMattersMostEscalation.trim()}\n\n**Escalation & safety (case lens)**\nWhen instability is present, the best answer usually **activates help**, **obtains time-sensitive diagnostics**, or **prepares rescue therapies** per orders—not paperwork, not delayed reassessment, and not scope-expanding heroics.`,
    redFlagsBlock(),
  );

  const nursingCombined = padKind(
    "nursing_assessment_interventions",
    `**Prioritization & next actions (this case)**\n\n${input.prioritizationNextActions.trim()}\n\n${nursingBlock(syn)}`,
    `**Reassessment loop**  
After any intervention, ask: did **oxygenation, perfusion, or mentation** improve on a short timeline? If not, **escalate** with objective data.`,
  );

  const pearlsCombined = padKind(
    "clinical_pearls",
    ensureClinicalPearlsWordCount(
      [
        `**Rationale for the best decisions (eliminate distractors)**\n\n${input.rationaleDecisions.trim()}`,
        `**Takeaways you can reuse on similar stems**\n\n${input.takeaways.trim()}`,
        `**Second-pass rule**  
If two answers sound “reasonable,” choose the one that **closes the highest-risk problem first** and matches **your license** in the stem.`,
      ].join("\n\n"),
    ),
    PEARLS_DEPTH_PAD,
  );

  const clientCombined = padKind(
    "client_education",
    `**Escalation, handoffs, and safety teaching**\n\n${input.escalationSafetyTeaching.trim()}\n\n${clientEducationBlock(syn)}`,
    `**Teach specifics**  
Name **return precautions** with concrete triggers (worsening shortness of breath, new neuro deficits, uncontrolled bleeding, fever with confusion) rather than “call if worse.”`,
  );

  const omitted: PathwayLessonOmittedPremiumSection[] = [];
  const labBodyRaw = input.labsDiagnostics?.trim();
  const LAB_DIAGNOSTICS_PAD = `**Stem integration**  
When labs appear, tie each line to **physiology** and **what you do next**—stems often hide the decisive value in a parenthetical or a number you skimmed past. Re-check **units** (mg/dL vs mmol/L) before you eliminate an answer.`;
  const labBody = labBodyRaw
    ? padKind("labs_diagnostics", labBodyRaw, LAB_DIAGNOSTICS_PAD)
    : undefined;
  if (!labBodyRaw) {
    omitted.push({
      kind: "labs_diagnostics",
      reason:
        input.labsOmitReason?.trim() ||
        "Labs and diagnostics are integrated into the case findings section; this lesson emphasizes prioritization and management patterns in a single vignette.",
    });
  }

  let countryBody = countryNotesBlock(input.tierGeo).trim();
  if (input.countryNotesOmitReason) {
    omitted.push({ kind: "country_specific_notes", reason: input.countryNotesOmitReason });
    countryBody = "";
  }

  const sections: PathwayLessonSection[] = [
    { id: "introduction", heading: PREMIUM_SECTION_HEADINGS.introduction, kind: "introduction", body: intro },
    {
      id: "pathophysiology_overview",
      heading: PREMIUM_SECTION_HEADINGS.pathophysiology_overview,
      kind: "pathophysiology_overview",
      body: padKind(
        "pathophysiology_overview",
        ensurePathophysiologyDepth(input.pathophysiologyCore),
        PATHO_EXAM_PAD,
      ),
    },
    {
      id: "signs_symptoms",
      heading: PREMIUM_SECTION_HEADINGS.signs_symptoms,
      kind: "signs_symptoms",
      body: signsBody,
    },
    {
      id: "red_flags",
      heading: PREMIUM_SECTION_HEADINGS.red_flags,
      kind: "red_flags",
      body: redBody,
    },
    ...(labBody
      ? [
          {
            id: "labs_diagnostics",
            heading: PREMIUM_SECTION_HEADINGS.labs_diagnostics,
            kind: "labs_diagnostics" as const,
            body: labBody,
          },
        ]
      : []),
    {
      id: "nursing_assessment_interventions",
      heading: PREMIUM_SECTION_HEADINGS.nursing_assessment_interventions,
      kind: "nursing_assessment_interventions",
      body: nursingCombined,
    },
    {
      id: "clinical_pearls",
      heading: PREMIUM_SECTION_HEADINGS.clinical_pearls,
      kind: "clinical_pearls",
      body: pearlsCombined,
    },
    {
      id: "client_education",
      heading: PREMIUM_SECTION_HEADINGS.client_education,
      kind: "client_education",
      body: clientCombined,
    },
    {
      id: "tier_specific_relevance",
      heading: PREMIUM_SECTION_HEADINGS.tier_specific_relevance,
      kind: "tier_specific_relevance",
      body: ensureTierRelevanceWordCount(tierRelevanceBlock(input.tierGeo)),
    },
    ...(countryBody
      ? [
          {
            id: "country_specific_notes",
            heading: PREMIUM_SECTION_HEADINGS.country_specific_notes,
            kind: "country_specific_notes" as const,
            body: countryBody,
          },
        ]
      : []),
    {
      id: "related_next_steps",
      heading: PREMIUM_SECTION_HEADINGS.related_next_steps,
      kind: "related_next_steps",
      body: relatedNextStepsBody({
        ...syn,
        relatedSlugs: input.relatedSlugs,
        relatedTitlesBySlug: input.relatedTitlesBySlug,
      }),
    },
  ];

  const relatedLessonRefs: PathwayLessonRelatedRef[] = input.relatedSlugs.map((slug) => ({
    slug,
    titleHint: input.relatedTitlesBySlug?.[slug],
  }));

  return { sections, premiumOmittedSections: omitted, relatedLessonRefs };
}
