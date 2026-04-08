/**
 * Builds 11-section premium pathway lessons from legacy five-block gold content + shared core.
 * Keeps clinical substance in one place while meeting premium structure and word-count targets.
 */
import { PREMIUM_SECTION_HEADINGS } from "@/lib/lessons/pathway-lesson-premium";
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
If two answers are “nice,” pick the one that **closes risk fastest** with **appropriate site-of-care** and **follow-up that is specific**.`;
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
Expect **RPN** language for practical nursing and **RN** for registered nursing; exam writers often embed **metric vitals** and **interprofessional** cues that mirror practice documents, not US state boards.`;
    case "us_pn":
    case "us_rn":
    case "us_np":
      return `**United States emphasis**  
Items reference **state-dependent scope** through the **stem’s role** and **order context**. Prefer **protocol/order-driven** actions for practical nurses, **independent nursing judgment** within standards for RNs, and **advanced-practice** reasoning for NPs when applicable.

**Exam vocabulary**  
**LVN/LPN**, **RN**, and **NP** labels are deliberate; mismatched actions (for example, prescribing as an LPN) are classic distractors.`;
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
When data cross instability thresholds implied by the vignette, choose **activation of emergency resources**, **provider notification**, or **higher level of care** over **routine tasks**, **delayed reassessment**, or **comfort-only** choices that ignore trajectory.`;
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
  const intro = [
    input.clinical_meaning.trim(),
    input.exam_relevance.trim(),
    `For **${input.examLabel}**, questions rarely announce the topic in the first sentence. They hide it inside **vitals, labs, and a short story**. Your job is to name the **clinical problem**, justify **why it matters now**, and select the **safest next step** for the **role** you are given—before you let distractors pull you toward busywork or out-of-scope heroics.`,
  ].join("\n\n");

  const pearls = [
    input.takeaways.trim(),
    `**Exam traps worth rehearsing**  
Watch for options that **sound compassionate** but **delay assessment**, **skip monitoring after an intervention**, or **assume stability** you have not established. **Pattern recognition** beats cramming isolated facts: rehearse **if I see X and Y, I think Z and do A** chains aloud.`,
  ].join("\n\n");

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
      body: input.sharedCore.trim(),
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
      body: tierRelevanceBlock(input.tierGeo),
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
