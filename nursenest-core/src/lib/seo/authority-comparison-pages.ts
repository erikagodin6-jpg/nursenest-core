export type AuthorityComparisonPage = {
  slug: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  lead: string;
  comparison: {
    caption: string;
    columns: readonly string[];
    rows: readonly (readonly string[])[];
  };
  balancedNotes: readonly string[];
  bestFor: readonly { label: string; body: string }[];
  internalLinks: readonly { label: string; href: string }[];
  faq: readonly { question: string; answer: string }[];
};

function comparisonPath(slug: string): string {
  return `/compare/${slug}`;
}

const cnpleLinks = [
  { label: "CNPLE practice questions", href: "/canada/np/cnple/practice-questions" },
  { label: "CNPLE exam format", href: "/canada/np/cnple/exam-format" },
  { label: "CNPLE study plan", href: "/canada/np/cnple/study-plan" },
] as const;

const rexLinks = [
  { label: "REx-PN practice questions", href: "/canada/rpn/rex-pn/practice-questions" },
  { label: "REx-PN CAT simulation", href: "/canada/rpn/rex-pn/cat-simulation" },
  { label: "REx-PN study plan", href: "/canada/rpn/rex-pn/study-plan" },
] as const;

export const AUTHORITY_COMPARISON_PAGES: readonly AuthorityComparisonPage[] = [
  {
    slug: "cnple-vs-nclex",
    path: comparisonPath("cnple-vs-nclex"),
    title: "CNPLE vs NCLEX: Exam Differences for Canadian Nurses | NurseNest",
    description:
      "Compare CNPLE and NCLEX by role, format, clinical reasoning, scope, and study strategy. Balanced guidance for Canadian NP and RN exam candidates.",
    h1: "CNPLE vs NCLEX: which exam are you preparing for?",
    eyebrow: "Exam comparison",
    lead:
      "CNPLE and NCLEX are not interchangeable exams. CNPLE preparation is built around Canadian nurse practitioner entry-to-practice judgment, while NCLEX preparation focuses on RN or PN licensure decisions. The safest study plan starts by matching the exam to the role, scope, and question style.",
    comparison: {
      caption: "CNPLE vs NCLEX comparison",
      columns: ["Dimension", "CNPLE", "NCLEX"],
      rows: [
        ["Role target", "Canadian nurse practitioner entry-to-practice", "RN or PN entry-to-practice depending on exam"],
        ["Reasoning focus", "Advanced assessment, diagnosis, prescribing, follow-up, and referral", "Nursing safety, prioritization, delegation, care management, and client needs"],
        ["Study risk", "Using generic RN material that misses NP prescribing and diagnostic depth", "Using advanced-practice material that overcomplicates RN/PN scope"],
      ],
    },
    balancedNotes: [
      "NurseNest does not claim official affiliation with either exam administrator.",
      "The better resource is the one aligned to your registration pathway, not the one with the largest generic question count.",
      "Candidates should confirm current scheduling and administrative details with their regulator or exam provider.",
    ],
    bestFor: [
      { label: "Choose CNPLE prep if", body: "you are preparing for Canadian nurse practitioner registration and need NP-level clinical judgment, prescribing, diagnostics, and Canadian scope context." },
      { label: "Choose NCLEX prep if", body: "you are preparing for RN or PN licensure and need client-needs, safety, prioritization, and entry-level nursing decision practice." },
    ],
    internalLinks: cnpleLinks,
    faq: [
      { question: "Is CNPLE the same as NCLEX?", answer: "No. CNPLE is for Canadian nurse practitioner entry-to-practice, while NCLEX is for RN or PN licensure. The exams assess different scopes and decision levels." },
      { question: "Can NCLEX questions help with CNPLE?", answer: "Some safety and clinical fundamentals overlap, but CNPLE candidates need NP-specific diagnostics, prescribing, follow-up, and Canadian guideline context." },
      { question: "Which exam is harder?", answer: "Difficulty depends on role preparation. CNPLE can feel harder for learners without advanced-practice case reasoning; NCLEX can feel harder when prioritization and client-needs switching are weak." },
    ],
  },
  {
    slug: "rex-pn-vs-nclex-pn",
    path: comparisonPath("rex-pn-vs-nclex-pn"),
    title: "REx-PN vs NCLEX-PN: Canadian and US Practical Nursing Exams | NurseNest",
    description:
      "Compare REx-PN and NCLEX-PN by country, CAT format, client needs, scope language, and study strategy for practical nursing candidates.",
    h1: "REx-PN vs NCLEX-PN: what practical nursing candidates should know",
    eyebrow: "Exam comparison",
    lead:
      "REx-PN and NCLEX-PN both assess practical nursing readiness, but candidates should not treat them as duplicate exams. The most important differences are registration context, terminology, scope expectations, and how practice questions should be reviewed.",
    comparison: {
      caption: "REx-PN vs NCLEX-PN comparison",
      columns: ["Dimension", "REx-PN", "NCLEX-PN"],
      rows: [
        ["Primary context", "Canadian practical nursing registration", "US practical/vocational nursing licensure"],
        ["Study language", "Canadian RPN scope, client needs, local registration context", "US PN/LVN scope, NCLEX client needs, US clinical terminology"],
        ["High-yield practice", "CAT-style REx-PN questions, priority, delegation, pharmacology, safety", "NCLEX-PN questions, client needs, safety, delegation, pharmacology"],
      ],
    },
    balancedNotes: [
      "Overlap in nursing concepts does not mean the exams should share one undifferentiated study plan.",
      "Canadian candidates should practise Canadian practical nursing wording and RPN scope.",
      "Question quality matters more than raw item count when rationales teach why distractors are unsafe.",
    ],
    bestFor: [
      { label: "Choose REx-PN prep if", body: "you are seeking Canadian practical nursing registration and need CAT practice with Canadian RPN context." },
      { label: "Choose NCLEX-PN prep if", body: "you are preparing for US PN/LVN licensure and need NCLEX-PN style client-needs practice." },
    ],
    internalLinks: rexLinks,
    faq: [
      { question: "Is REx-PN harder than NCLEX-PN?", answer: "It depends on preparation fit. REx-PN can feel harder when candidates use US-only wording and miss Canadian practical nursing scope and registration context." },
      { question: "Can I use NCLEX-PN questions for REx-PN?", answer: "Some fundamentals overlap, but REx-PN candidates should add Canadian RPN scope, client-needs framing, and CAT-style practice." },
      { question: "Do both exams use adaptive testing?", answer: "REx-PN uses computerized adaptive testing. Candidates should confirm current details for their exam administration and practise adaptive-style decision discipline." },
    ],
  },
  {
    slug: "nursenest-vs-uworld",
    path: comparisonPath("nursenest-vs-uworld"),
    title: "NurseNest vs UWorld: Nursing Exam Prep Comparison | NurseNest",
    description:
      "Compare NurseNest and UWorld for nursing exam prep by question practice, Canadian pathways, adaptive study tools, rationales, and learner fit.",
    h1: "NurseNest vs UWorld: which question bank fits your study plan?",
    eyebrow: "Resource comparison",
    lead:
      "UWorld is a well-known question bank. NurseNest is built as a broader adaptive clinical learning system with Canadian pathway support, lessons, flashcards, CAT-style practice, and related-content study loops. The right choice depends on exam, country, budget, and how much guided remediation you need.",
    comparison: {
      caption: "NurseNest vs UWorld feature comparison",
      columns: ["Feature", "NurseNest", "UWorld"],
      rows: [
        ["Canadian exam focus", "Dedicated CNPLE and REx-PN authority pages plus Canadian pathway routing", "Known primarily for large licensure question banks"],
        ["Study loop", "Questions, lessons, flashcards, CAT practice, related content, and pathway hubs", "Question-bank centered study workflow"],
        ["Best fit", "Learners who want guided remediation and Canadian pathway context", "Learners who primarily want a large standalone question bank"],
      ],
    },
    balancedNotes: [
      "This comparison is educational and should be verified against each provider's current product pages before purchase.",
      "Avoid choosing by brand alone; choose by exam pathway and how you actually study after missing questions.",
      "A learner who already has strong content knowledge may need a different tool than a learner who needs structured remediation.",
    ],
    bestFor: [
      { label: "NurseNest may fit if", body: "you want Canadian CNPLE or REx-PN context, linked lessons, flashcards, CAT-style practice, and topical authority hubs." },
      { label: "UWorld may fit if", body: "you want a large question-bank-first workflow and already know how to remediate missed concepts independently." },
    ],
    internalLinks: [...cnpleLinks, ...rexLinks],
    faq: [
      { question: "Is NurseNest better than UWorld?", answer: "It depends on the learner. NurseNest emphasizes adaptive study loops and Canadian pathway context; UWorld is widely known for question-bank practice." },
      { question: "Can I use both NurseNest and UWorld?", answer: "Yes, but avoid duplicating passive review. Use one system as the source of truth for miss logs, remediation, and readiness tracking." },
      { question: "Which is better for CNPLE or REx-PN?", answer: "Canadian candidates should prioritize resources that explicitly address CNPLE or REx-PN language, scope, and exam structure." },
    ],
  },
  {
    slug: "nursenest-vs-archer",
    path: comparisonPath("nursenest-vs-archer"),
    title: "NurseNest vs Archer: Nursing Exam Prep Comparison | NurseNest",
    description:
      "Compare NurseNest and Archer for nursing exam prep by adaptive practice, rationales, Canadian exam coverage, remediation, and learner fit.",
    h1: "NurseNest vs Archer: compare exam prep workflows",
    eyebrow: "Resource comparison",
    lead:
      "Archer is commonly evaluated by learners looking for affordable nursing exam practice. NurseNest is positioned as a premium adaptive study ecosystem with lessons, flashcards, CAT-style practice, authority hubs, and Canadian exam coverage. This page compares fit without pretending one resource is best for every learner.",
    comparison: {
      caption: "NurseNest vs Archer feature comparison",
      columns: ["Feature", "NurseNest", "Archer"],
      rows: [
        ["Workflow", "Integrated lessons, questions, flashcards, CAT practice, and related study links", "Question and readiness-style prep focus"],
        ["Canadian pathways", "Dedicated CNPLE and REx-PN pages and internal links", "Learners should verify current Canadian exam support"],
        ["Best fit", "Learners who need remediation after missed questions", "Learners seeking a question-heavy exam-prep option"],
      ],
    },
    balancedNotes: [
      "Feature availability changes, so candidates should verify current pricing and inclusions before buying.",
      "The strongest prep system is the one that changes behavior after missed questions.",
      "A lower-cost tool can still be valuable if it matches the exam and the learner reviews rationales deeply.",
    ],
    bestFor: [
      { label: "NurseNest may fit if", body: "you want one place for pathway-specific lessons, question practice, CAT-style sessions, flashcards, and related resources." },
      { label: "Archer may fit if", body: "you want a question-practice-focused option and have a separate plan for content remediation." },
    ],
    internalLinks: [...cnpleLinks, ...rexLinks],
    faq: [
      { question: "Is NurseNest or Archer better for Canadian exams?", answer: "Canadian candidates should prioritize explicit CNPLE or REx-PN support. Verify each tool's current Canadian coverage before purchase." },
      { question: "Do comparison pages include affiliate claims?", answer: "This page is written as an educational comparison and avoids deceptive superiority claims." },
      { question: "What matters most when comparing question banks?", answer: "Exam alignment, rationale quality, remediation tools, adaptive practice, and whether the learner actually reviews misses effectively." },
    ],
  },
  {
    slug: "best-rex-pn-question-banks",
    path: comparisonPath("best-rex-pn-question-banks"),
    title: "Best REx-PN Question Banks: What Canadian Candidates Need | NurseNest",
    description:
      "Learn how to choose a REx-PN question bank with CAT-style practice, Canadian RPN scope, client-needs rationales, and remediation tools.",
    h1: "Best REx-PN question banks: what to look for",
    eyebrow: "Buying guide",
    lead:
      "The best REx-PN question bank is not the one with the biggest number on the sales page. It is the one that teaches Canadian practical nursing scope, client-needs reasoning, CAT-style decision discipline, and what to study after a miss.",
    comparison: {
      caption: "REx-PN question bank selection criteria",
      columns: ["Criterion", "Why it matters", "What to check"],
      rows: [
        ["Canadian RPN context", "Avoids US-only scope and terminology drift", "Look for REx-PN and Canadian practical nursing language"],
        ["Rationales", "Missed questions should teach decision rules", "Check whether distractors are explained, not just the correct option"],
        ["Remediation", "Learners need next steps after weak categories", "Look for linked lessons, flashcards, and CAT practice"],
      ],
    },
    balancedNotes: [
      "No question bank can guarantee a pass.",
      "Use official regulator and exam-provider resources for administrative details.",
      "A smaller aligned bank can outperform a larger generic bank when rationales are clinically useful.",
    ],
    bestFor: [
      { label: "High-intent learners", body: "Candidates close to writing should prioritize CAT-style practice and repeated-error cleanup." },
      { label: "Early learners", body: "Students earlier in the programme should prioritize lessons and client-needs foundations before heavy CAT work." },
    ],
    internalLinks: rexLinks,
    faq: [
      { question: "How many REx-PN questions do I need?", answer: "Quality and review depth matter more than a fixed number. Track whether repeated misses decrease by client-needs category." },
      { question: "Should a REx-PN question bank include CAT practice?", answer: "Yes. CAT-style sessions help learners practise uncertainty, pacing, and adaptive difficulty after targeted remediation." },
      { question: "What makes a REx-PN rationale useful?", answer: "A useful rationale explains the client cue, the risk, why the correct answer is safest, and why each distractor is weaker." },
    ],
  },
  {
    slug: "best-cnple-prep-resources",
    path: comparisonPath("best-cnple-prep-resources"),
    title: "Best CNPLE Prep Resources: Canadian NP Study Guide | NurseNest",
    description:
      "Choose CNPLE prep resources with Canadian NP scope, case-based questions, prescribing safety, LOFT-format practice, and clinical judgment review.",
    h1: "Best CNPLE prep resources: what Canadian NP candidates need",
    eyebrow: "Buying guide",
    lead:
      "CNPLE candidates need resources that match advanced practice. A useful prep system should cover Canadian NP clinical judgment, prescribing safety, case-based reasoning, LOFT-style pacing, and remediation after missed questions.",
    comparison: {
      caption: "CNPLE prep resource selection criteria",
      columns: ["Criterion", "Why it matters", "What to check"],
      rows: [
        ["Canadian NP scope", "CNPLE asks advanced-practice decisions, not generic RN recall", "Look for diagnosis, prescribing, monitoring, referral, and follow-up"],
        ["Case-based practice", "Learners need to reason through vignettes", "Check whether questions include rationales and distractor logic"],
        ["LOFT pacing", "Fixed-length stamina needs deliberate practice", "Look for timed sets and simulation-style practice"],
      ],
    },
    balancedNotes: [
      "Candidates should confirm current exam details through official channels.",
      "Avoid resources that only rename generic nursing content as CNPLE prep.",
      "A good resource makes the learner explain why a management option is unsafe, incomplete, or out of scope.",
    ],
    bestFor: [
      { label: "NP candidates near exam date", body: "Prioritize LOFT-style timing, case-based questions, and prescribing safety review." },
      { label: "Earlier NP learners", body: "Prioritize study plans, diagnostic reasoning, and Canadian guideline context before full simulation." },
    ],
    internalLinks: cnpleLinks,
    faq: [
      { question: "What should a CNPLE prep resource include?", answer: "It should include Canadian NP scope, case-based questions, prescribing safety, diagnostics, follow-up, and timed practice." },
      { question: "Are generic NCLEX resources enough for CNPLE?", answer: "No. They can support foundational safety, but they usually do not cover NP-level diagnosis, prescribing, and management decisions deeply enough." },
      { question: "How should I compare CNPLE prep resources?", answer: "Compare clinical depth, Canadian relevance, rationale quality, study planning, and whether the tool helps remediate misses." },
    ],
  },
] as const;

const bySlug = new Map(AUTHORITY_COMPARISON_PAGES.map((page) => [page.slug, page]));

export function listAuthorityComparisonPages(): readonly AuthorityComparisonPage[] {
  return AUTHORITY_COMPARISON_PAGES;
}

export function listAuthorityComparisonPaths(): string[] {
  return AUTHORITY_COMPARISON_PAGES.map((page) => page.path);
}

export function getAuthorityComparisonPage(slug: string): AuthorityComparisonPage | undefined {
  return bySlug.get(slug);
}
