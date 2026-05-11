import { ADVANCED_ECG_PRICING_ANCHOR } from "@/lib/advanced-ecg/advanced-ecg-module-config";

export type AdvancedEcgMarketingPage = {
  slug: "" | "telemetry" | "12-lead" | "acls" | "case-studies" | "pacemaker-rhythms";
  path: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  heroLead: string;
  heroMetrics: readonly string[];
  curriculumTitle: string;
  curriculumBody: string;
  curriculumItems: readonly string[];
  proofTitle: string;
  proofBody: string;
  proofItems: readonly string[];
  outcomeTitle: string;
  outcomeBody: string;
  outcomeItems: readonly string[];
  stripPreviewTitle: string;
  stripPreviewItems: readonly string[];
  faqs: readonly { question: string; answer: string }[];
  internalLinks: readonly { href: string; label: string; description: string }[];
};

function page(def: Omit<AdvancedEcgMarketingPage, "path">): AdvancedEcgMarketingPage {
  return {
    ...def,
    path: def.slug ? `/advanced-ecg/${def.slug}` : "/advanced-ecg",
  };
}

export const ADVANCED_ECG_MARKETING_PAGES = [
  page({
    slug: "",
    title: "Advanced ECG & Telemetry Mastery | Premium ECG Specialty Module | NurseNest",
    description:
      "Own Advanced ECG & Telemetry Mastery as a one-time premium specialty module with telemetry, 12-lead, ACLS, pacemaker rhythms, annotated strips, and clinician-reviewed cases.",
    h1: "Advanced ECG & Telemetry Mastery for premium rhythm interpretation",
    eyebrow: "Premium specialty module",
    heroLead:
      "Built for RN and NP learners who need more than generic ECG review. Move from Basic ECG Foundations into telemetry, 12-lead, ACLS, pacemaker interpretation, and curated critical-care cases in one dedicated specialty lane.",
    heroMetrics: ["One-time purchase", "Includes Basic ECG Foundations", "Clinician-reviewed strip library"],
    curriculumTitle: "What is inside the module",
    curriculumBody:
      "The full specialty route is organized like a telemetry desk, not a generic exam catalog. Each section reinforces recognition, interpretation, escalation, and next-step clinical reasoning.",
    curriculumItems: [
      "Foundational advanced rhythm review that reconnects rate, axis, ischemia, and conduction before higher-acuity interpretation.",
      "Telemetry and ICU interpretation blocks with monitor-based pattern recognition, alarm triage, and escalation framing.",
      "12-lead, ACLS, and case-study tracks that connect strips to clinical context instead of isolated memorization.",
    ],
    proofTitle: "Why the product feels premium",
    proofBody:
      "The module is intentionally separate from base subscriptions and generic NCLEX messaging. It is positioned as a specialty purchase for learners who want deeper cardiac interpretation fluency.",
    proofItems: [
      "Annotated strip previews emphasize pacing spikes, conduction landmarks, and telemetry callouts.",
      "One-time ownership keeps the specialty lane persistent without altering the rest of the learner subscription model.",
      "Upgrade calls and learner routing stay inside a dedicated Advanced ECG identity instead of disappearing into standard lesson flows.",
    ],
    outcomeTitle: "What learners should walk away with",
    outcomeBody:
      "The goal is confidence under rhythm pressure: recognizing what matters first, naming what is happening, and knowing whether the strip is a watch, a workup, or a call-now event.",
    outcomeItems: [
      "Interpret advanced rhythms faster with cleaner telemetry pattern recognition.",
      "Read 12-lead and ACLS scenarios with stronger escalation instincts.",
      "Carry the included Basic ECG Foundations into one continuous specialty progression.",
    ],
    stripPreviewTitle: "Annotated strip previews",
    stripPreviewItems: ["Telemetry escalation markers", "12-lead localization cues", "Pacemaker spike recognition", "Malfunction pattern callouts"],
    faqs: [
      {
        question: "Is Advanced ECG included in base subscriptions?",
        answer:
          "No. Advanced ECG & Telemetry Mastery is a separate premium specialty purchase and does not automatically unlock with the base exam plans.",
      },
      {
        question: "Does the module include the basic ECG curriculum?",
        answer:
          "Yes. Advanced ECG ownership includes full access to the Basic ECG Foundations so learners can move through one continuous ECG progression.",
      },
      {
        question: "Who is the module built for?",
        answer:
          "Phase 1 is positioned for RN and NP learners who want telemetry, 12-lead, ACLS, pacemaker, and critical-care rhythm interpretation beyond generic exam prep.",
      },
    ],
    internalLinks: [
      { href: "/advanced-ecg/telemetry", label: "Telemetry track", description: "See the ICU monitor interpretation and escalation lane." },
      { href: "/advanced-ecg/12-lead", label: "12-lead interpretation", description: "Review localization, morphology, and ischemia framing." },
      { href: "/advanced-ecg/pacemaker-rhythms", label: "Pacemaker rhythms", description: "Explore curated paced-strip interpretation and malfunction recognition." },
    ],
  }),
  page({
    slug: "telemetry",
    title: "Telemetry ECG Training for ICU and Stepdown Interpretation | NurseNest",
    description:
      "Study telemetry rhythm interpretation with premium monitor-focused ECG training, alarm triage, escalation cues, and clinician-reviewed strip walkthroughs.",
    h1: "Telemetry interpretation built for ICU and progressive-care rhythm work",
    eyebrow: "Telemetry track",
    heroLead:
      "The telemetry lane focuses on what bedside monitors demand: faster recognition, more disciplined escalation, and cleaner translation from strip to action.",
    heroMetrics: ["Monitor-first interpretation", "Escalation cues", "Clinical alarm context"],
    curriculumTitle: "Telemetry curriculum",
    curriculumBody:
      "This section moves beyond isolated strips. Learners practice rhythm recognition in a monitor-shaped environment with emphasis on deterioration risk and what deserves immediate escalation.",
    curriculumItems: [
      "Progressive-care rhythm recognition with rate, regularity, and conduction pattern overlays.",
      "Alarm-triage framing that separates noise, nuisance, and urgent monitor findings.",
      "Case-based telemetry interpretation that ties strip changes to patient condition and response.",
    ],
    proofTitle: "Premium telemetry design choices",
    proofBody:
      "The visual language leans into workstation clarity instead of generic exam cards so the page reads like a specialty training surface.",
    proofItems: [
      "Dark-surface telemetry styling optimized for rhythm visibility.",
      "Multi-hue status cues for stable, watch, urgent, and critical findings.",
      "Dedicated upgrade path that preserves the specialty-module identity.",
    ],
    outcomeTitle: "Telemetry outcomes",
    outcomeBody: "Learners should leave this lane faster at seeing what changed and clearer on whether it changes nursing action right now.",
    outcomeItems: [
      "Spot monitor patterns and escalation triggers with less hesitation.",
      "Connect telemetry strips to bedside action and communication.",
      "Use the same specialty route later for paced rhythms and curated critical-care cases.",
    ],
    stripPreviewTitle: "Previewed telemetry themes",
    stripPreviewItems: ["Rate shift trends", "Conduction change flags", "Alarm-relevant morphology cues", "Escalation note overlays"],
    faqs: [
      {
        question: "Is this telemetry content different from basic ECG review?",
        answer:
          "Yes. The telemetry track is framed for monitor interpretation, escalation, and bedside rhythm changes instead of introductory ECG recognition alone.",
      },
      {
        question: "Do I need to finish the basic ECG curriculum first?",
        answer:
          "Advanced ECG ownership includes the Basic ECG Foundations, so learners can refresh the fundamentals and then move straight into telemetry work.",
      },
    ],
    internalLinks: [
      { href: "/advanced-ecg", label: "Module overview", description: "See the full premium specialty structure." },
      { href: "/advanced-ecg/acls", label: "ACLS rhythm lane", description: "Connect telemetry signals to emergency rhythm action." },
      { href: "/advanced-ecg/case-studies", label: "Case studies", description: "Apply telemetry interpretation inside curated scenarios." },
    ],
  }),
  page({
    slug: "12-lead",
    title: "12-Lead ECG Interpretation Course for Nurses | NurseNest",
    description:
      "Improve 12-lead ECG interpretation with premium nurse-focused training on localization, conduction, ischemia clues, and annotated strip walkthroughs.",
    h1: "12-lead interpretation that connects morphology to clinical meaning",
    eyebrow: "12-lead lane",
    heroLead:
      "This lane turns 12-lead review into a clinical reasoning tool. Learners focus on localization, conduction, ischemia clues, and what the pattern means in real nursing decisions.",
    heroMetrics: ["Localization cues", "Conduction pattern review", "Clinician-reviewed walkthroughs"],
    curriculumTitle: "12-lead curriculum",
    curriculumBody:
      "Learners move from lead relationships into pattern interpretation without flattening the work into pure memorization. The lane is designed for nurses who want confident pattern language and escalation instinct.",
    curriculumItems: [
      "Lead grouping and territory orientation that keeps the anatomy grounded.",
      "Morphology checkpoints for ischemia, infarct suspicion, conduction delay, and bundle patterns.",
      "Annotated examples showing how the strip changes urgency and the next clinical question.",
    ],
    proofTitle: "Why this feels different from generic 12-lead review",
    proofBody:
      "The instruction is not a static poster. It is built like a premium interpretation module that ties visual pattern recognition to nursing communication and action.",
    proofItems: [
      "A curated set of premium preview strips instead of filler waveform art.",
      "One-time specialty ownership without bundling confusion.",
      "Integrated pathway from foundational ECG refresh into 12-lead fluency.",
    ],
    outcomeTitle: "12-lead outcomes",
    outcomeBody:
      "Learners should be able to describe what they see, what it likely means, and how urgently it changes the care conversation.",
    outcomeItems: [
      "Read lead-group relationships with more confidence.",
      "Identify concerning morphology and communicate it clearly.",
      "Carry those pattern-recognition gains back into telemetry and ACLS decision work.",
    ],
    stripPreviewTitle: "Previewed 12-lead themes",
    stripPreviewItems: ["Territory mapping", "ST and T-wave pattern cues", "Conduction delay landmarks", "Urgency callout notes"],
    faqs: [
      {
        question: "Is this a full 12-lead course or just a quick reference?",
        answer:
          "It is positioned as a premium learning lane inside the Advanced ECG specialty module, with curated interpretation walkthroughs rather than a bare cheat sheet.",
      },
      {
        question: "Does it stay separate from base exam prep?",
        answer:
          "Yes. The public page and learner route are intentionally separate from generic prep so the product reads as a dedicated specialty module.",
      },
    ],
    internalLinks: [
      { href: "/advanced-ecg", label: "Advanced ECG overview", description: "Return to the full specialty module overview." },
      { href: "/advanced-ecg/telemetry", label: "Telemetry lane", description: "See the bedside monitor interpretation track." },
      { href: "/advanced-ecg/pacemaker-rhythms", label: "Pacemaker rhythms", description: "Explore curated paced-strip interpretation next." },
    ],
  }),
  page({
    slug: "acls",
    title: "ACLS Rhythm Interpretation for Nurses | NurseNest",
    description:
      "Practice ACLS-focused ECG interpretation with premium rhythm escalation cues, emergency-pattern review, and clinician-reviewed case framing.",
    h1: "ACLS rhythm interpretation that sharpens emergency recognition",
    eyebrow: "ACLS lane",
    heroLead:
      "The ACLS lane is built for rhythm situations where the interpretation changes urgency immediately. It emphasizes recognition, escalation language, and disciplined case framing.",
    heroMetrics: ["Emergency rhythm cues", "Escalation-focused review", "Case-first framing"],
    curriculumTitle: "ACLS curriculum",
    curriculumBody:
      "The goal is not to replace ACLS certification. It is to strengthen rhythm interpretation around unstable, emergent, and high-stakes monitor patterns.",
    curriculumItems: [
      "Unstable rhythm review with clear recognition checkpoints.",
      "Escalation framing that reinforces communication and urgency.",
      "Curated cases that connect strip interpretation to action priority.",
    ],
    proofTitle: "What makes the ACLS lane premium",
    proofBody:
      "It is taught as advanced interpretation work, not just a flashcard list of algorithms. The lane stays visually and structurally aligned with the Advanced ECG specialty identity.",
    proofItems: [
      "Telemetry-style strip boards with urgent callouts.",
      "Case framing that emphasizes why the rhythm matters now.",
      "Separate upgrade and learner routing that preserves the specialty signal.",
    ],
    outcomeTitle: "ACLS outcomes",
    outcomeBody:
      "Learners should finish this lane with faster emergency recognition and cleaner language for communicating rhythm concerns.",
    outcomeItems: [
      "Identify unstable rhythms with less delay.",
      "Tie rhythm interpretation to escalation and next-step thinking.",
      "Use curated emergency cases to rehearse clinical judgment under pressure.",
    ],
    stripPreviewTitle: "Previewed ACLS themes",
    stripPreviewItems: ["Unstable rhythm markers", "Urgency overlays", "Escalation language prompts", "Case-sequence rhythm changes"],
    faqs: [
      {
        question: "Is this an ACLS certification replacement?",
        answer:
          "No. It is an interpretation-focused learning lane inside Advanced ECG & Telemetry Mastery, designed to reinforce rhythm recognition and escalation thinking.",
      },
      {
        question: "Does it include basic ECG review too?",
        answer:
          "Yes. Advanced ECG ownership includes Basic ECG Foundations so learners can stabilize fundamentals before moving into high-acuity rhythm work.",
      },
    ],
    internalLinks: [
      { href: "/advanced-ecg", label: "Module overview", description: "View the full Advanced ECG specialty module." },
      { href: "/advanced-ecg/telemetry", label: "Telemetry lane", description: "Connect emergency interpretation back to monitor-based rhythm work." },
      { href: "/advanced-ecg/case-studies", label: "Case studies", description: "See the curated case progression lane." },
    ],
  }),
  page({
    slug: "case-studies",
    title: "ECG Case Studies for Advanced Rhythm Interpretation | NurseNest",
    description:
      "Work through clinician-reviewed ECG case studies that connect telemetry, 12-lead, ACLS, and paced-strip interpretation to real clinical reasoning.",
    h1: "Case studies that make advanced ECG interpretation stick",
    eyebrow: "Case-study lane",
    heroLead:
      "Curated cases turn strip recognition into clinical judgment. Each case links findings, context, and action so advanced ECG study feels more like practice and less like isolated pattern sorting.",
    heroMetrics: ["Clinician-reviewed cases", "Telemetry and 12-lead crossover", "Action-focused interpretation"],
    curriculumTitle: "Case-study curriculum",
    curriculumBody:
      "The case lane acts like a capstone across the specialty module. It ties together rhythm patterning, 12-lead thinking, telemetry changes, and paced-strip interpretation in curated patient stories.",
    curriculumItems: [
      "Monitor changes across a clinical timeline rather than one isolated strip.",
      "Interpretation prompts that connect pattern recognition to next action.",
      "Crossovers between telemetry, ACLS, pacemaker, and foundational ECG review.",
    ],
    proofTitle: "Why curated cases matter",
    proofBody:
      "Case-based interpretation helps learners transfer rhythm knowledge under pressure. That is why the module emphasizes clinician-reviewed, publish-safe cases over unsupported synthetic physiology.",
    proofItems: [
      "Realistic sequence framing without overstating simulation fidelity.",
      "Escalation cues that separate observation from urgent action.",
      "A premium lane that feels clinically intelligent instead of administratively organized.",
    ],
    outcomeTitle: "Case-study outcomes",
    outcomeBody:
      "The goal is stronger transfer: learners should be able to hold the strip and the patient picture in mind at the same time.",
    outcomeItems: [
      "Interpret rhythm changes with better context retention.",
      "Choose stronger next-step language during discussion or handoff.",
      "Practice advanced ECG reasoning inside a premium, specialty-specific route.",
    ],
    stripPreviewTitle: "Previewed case-study themes",
    stripPreviewItems: ["Case timeline markers", "Escalation decision points", "Telemetry-to-action transitions", "Cross-track rhythm comparisons"],
    faqs: [
      {
        question: "Are these cases interactive simulations?",
        answer:
          "Phase 1 uses curated clinician-reviewed cases and annotated strips. Future simulation work is reserved for a later roadmap once stronger pacing-specific safeguards are in place.",
      },
      {
        question: "Why put case studies inside a premium ECG module?",
        answer:
          "Because advanced rhythm interpretation is most useful when learners apply it in context. The case lane helps bridge knowledge into clinical judgment.",
      },
    ],
    internalLinks: [
      { href: "/advanced-ecg", label: "Advanced ECG overview", description: "See the full specialty module and upgrade framing." },
      { href: "/advanced-ecg/acls", label: "ACLS lane", description: "Reinforce emergency rhythm interpretation." },
      { href: "/advanced-ecg/pacemaker-rhythms", label: "Pacemaker rhythms", description: "Review curated paced-strip interpretation next." },
    ],
  }),
  page({
    slug: "pacemaker-rhythms",
    title: "Pacemaker Rhythm Interpretation for Nurses | NurseNest",
    description:
      "Study pacemaker ECG interpretation with curated clinician-reviewed telemetry pacemaker strips, paced rhythm recognition, ventricular paced rhythm review, pacemaker malfunction ECG callouts, and ICU telemetry pacing workflows.",
    h1: "Pacemaker rhythm interpretation with ICU-grade paced-strip training",
    eyebrow: "Pacemaker lane",
    heroLead:
      "Pacemaker interpretation is a core advanced telemetry skill, so this lane is built around clinician-reviewed static strips, pacing-spike visibility, paced rhythm recognition, ventricular paced rhythm interpretation, malfunction recognition, and publish-safe ICU telemetry teaching patterns.",
    heroMetrics: ["Clinician-reviewed paced strips", "Pacing-spike highlighting", "ICU telemetry pacing"],
    curriculumTitle: "Pacemaker curriculum",
    curriculumBody:
      "Phase 1 keeps this content curated and static on purpose. The lane focuses on paced rhythm recognition, capture and sensing cues, malfunction callouts, and ICU telemetry reasoning without pretending unsupported generated physiology is production safe.",
    curriculumItems: [
      "Pacemaker foundations covering anatomy, sensing, capture, pacing spikes, atrial pacing, ventricular paced rhythm recognition, and dual-chamber pacing.",
      "Paced rhythm recognition for atrial paced rhythms, ventricular paced rhythm patterns, AV sequential pacing, demand pacing, and asynchronous pacing.",
      "Pacemaker malfunction ECG interpretation for failure to capture, failure to sense, failure to pace, oversensing, undersensing, and pseudomalfunctions.",
      "ICU telemetry pacing walkthroughs for temporary pacing, transcutaneous pacing, transvenous pacing, unstable paced patients, and pacing emergencies.",
      "Advanced concepts tying fusion beats, pseudofusion, ICD rhythms, CRT / biventricular pacing, and pacemaker-mediated tachycardia back to curated telemetry cases.",
    ],
    proofTitle: "Safety and fidelity stance",
    proofBody:
      "Pacemaker content is deliberately quarantined from simplified waveform generation. The public page emphasizes clinician-reviewed static strips, annotated pacing overlays, and professionally curated telemetry cases so the product promise matches current safety limits.",
    proofItems: [
      "No fake advanced pacing physiology in Phase 1 marketing or learner content.",
      "Preview strips emphasize spike visibility, capture landmarks, pacemaker malfunction ECG notes, and case-based interpretation.",
      "Future pacing simulation work is explicitly reserved for a later roadmap with stronger validation.",
    ],
    outcomeTitle: "Pacemaker outcomes",
    outcomeBody:
      "Learners should leave able to recognize paced-strip patterns, describe suspected malfunction types, and know when ICU telemetry pacing interpretation requires escalation.",
    outcomeItems: [
      "Read pacing spikes and capture patterns with more confidence.",
      "Distinguish common malfunction patterns on curated strips.",
      "Carry paced-strip interpretation into the broader telemetry and case-study lanes without relying on unsupported generated pacing simulations.",
    ],
    stripPreviewTitle: "Previewed pacemaker themes",
    stripPreviewItems: [
      "Ventricular paced rhythm recognition overlays",
      "Sensing and capture checkpoints",
      "Pacemaker malfunction ECG callout labels",
      "ICU telemetry pacing escalation boards",
    ],
    faqs: [
      {
        question: "Are the pacemaker rhythms generated dynamically?",
        answer:
          "No. Phase 1 pacemaker content uses static, annotated, clinician-reviewed strips and explicitly avoids unsupported generated pacing physiology.",
      },
      {
        question: "Why is the pacemaker lane part of Advanced ECG?",
        answer:
          "Because paced-strip interpretation is treated as a premium advanced telemetry competency, not a generic beginner ECG topic.",
      },
    ],
    internalLinks: [
      { href: "/advanced-ecg", label: "Advanced ECG overview", description: "See how the pacemaker lane fits inside the premium module." },
      { href: "/advanced-ecg/telemetry", label: "Telemetry lane", description: "Connect paced-strip review back to monitor interpretation." },
      { href: "/advanced-ecg/case-studies", label: "Case studies", description: "See how curated cases reinforce paced-rhythm reasoning." },
    ],
  }),
] as const satisfies readonly AdvancedEcgMarketingPage[];

const ADVANCED_ECG_MARKETING_PAGES_BY_PATH = new Map(
  ADVANCED_ECG_MARKETING_PAGES.map((page) => [page.path, page]),
);

export function getAdvancedEcgMarketingPageByPath(path: string): AdvancedEcgMarketingPage | undefined {
  return ADVANCED_ECG_MARKETING_PAGES_BY_PATH.get(path);
}

export function getAdvancedEcgMarketingPageBySegments(segments?: string[]): AdvancedEcgMarketingPage | undefined {
  if (!segments || segments.length === 0) {
    return getAdvancedEcgMarketingPageByPath("/advanced-ecg");
  }
  const cleaned = segments.filter(Boolean);
  if (cleaned.length > 1) return undefined;
  return getAdvancedEcgMarketingPageByPath(`/advanced-ecg/${cleaned[0]}`);
}

export function listAdvancedEcgMarketingPaths(): string[] {
  return ADVANCED_ECG_MARKETING_PAGES.map((page) => page.path);
}

export function buildAdvancedEcgMarketingFaqJsonLd(page: AdvancedEcgMarketingPage): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export const ADVANCED_ECG_MARKETING_PRIMARY_CTA = {
  href: ADVANCED_ECG_PRICING_ANCHOR,
  label: "Buy Advanced ECG",
} as const;

export const ADVANCED_ECG_MARKETING_SECONDARY_CTA = {
  href: "/modules/ecg-advanced",
  label: "Preview learner route",
} as const;
