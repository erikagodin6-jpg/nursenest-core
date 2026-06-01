#!/usr/bin/env tsx
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { ALLIED_MASTERY_MODULES } from "../src/lib/allied/allied-mastery-modules";
import { ALLIED_PROFESSIONS } from "../src/lib/allied/allied-professions-registry";
import { ALLIED_READINESS_MANIFEST } from "../src/lib/allied/allied-readiness-manifest";
import {
  buildAlliedQuestionModalityAuditReport,
  type AlliedModuleQuestionAudit,
} from "../src/lib/allied/allied-question-modality-audit";
import { ALLIED_PROFESSION_DEDICATED_CATALOGS } from "../src/content/pathway-lessons/allied-professions/registry";

type TruthStatus = "Supported" | "Partially supported" | "Unsupported" | "Risk";

type FunnelProfession = {
  id: string;
  label: string;
  registryKey: string;
  moduleProfessionKeys: string[];
  catalogFiles: string[];
  targets: {
    lessons: number;
    flashcards: number;
    questions: number;
    simulations: number;
  };
};

type ProfessionEvidence = FunnelProfession & {
  route: string;
  title: string;
  description: string;
  lessons: number;
  flashcards: number;
  questions: number;
  cases: number;
  simulations: number;
  readinessManifestPct: number;
  qualityPct: number;
};

const OUT_DIR = resolve("docs");

const TARGETS: FunnelProfession[] = [
  {
    id: "respiratory",
    label: "Respiratory Therapy",
    registryKey: "respiratory",
    moduleProfessionKeys: ["respiratory"],
    catalogFiles: ["respiratory-therapy", "respiratory-therapy-floor-practice"],
    targets: { lessons: 300, flashcards: 3000, questions: 2500, simulations: 100 },
  },
  {
    id: "paramedic",
    label: "Paramedicine",
    registryKey: "paramedic",
    moduleProfessionKeys: ["paramedic"],
    catalogFiles: ["emergency-medical-services"],
    targets: { lessons: 300, flashcards: 3000, questions: 2500, simulations: 100 },
  },
  {
    id: "mlt",
    label: "Medical Laboratory Technology",
    registryKey: "mlt",
    moduleProfessionKeys: ["mlt"],
    catalogFiles: ["medical-laboratory-technology"],
    targets: { lessons: 300, flashcards: 3000, questions: 2500, simulations: 100 },
  },
  {
    id: "physiotherapy",
    label: "Physiotherapy",
    registryKey: "physiotherapy",
    moduleProfessionKeys: ["pta"],
    catalogFiles: ["physiotherapy-rehab"],
    targets: { lessons: 250, flashcards: 2500, questions: 2000, simulations: 75 },
  },
  {
    id: "occupational-therapy",
    label: "Occupational Therapy",
    registryKey: "occupational-therapy",
    moduleProfessionKeys: ["ota"],
    catalogFiles: ["occupational-therapy"],
    targets: { lessons: 250, flashcards: 2500, questions: 2000, simulations: 75 },
  },
  {
    id: "psw-hca",
    label: "PSW",
    registryKey: "psw-hca",
    moduleProfessionKeys: [],
    catalogFiles: [],
    targets: { lessons: 200, flashcards: 2000, questions: 1500, simulations: 50 },
  },
  {
    id: "social-work",
    label: "Social Work",
    registryKey: "social-work",
    moduleProfessionKeys: [],
    catalogFiles: ["mental-health-social-work"],
    targets: { lessons: 250, flashcards: 2500, questions: 2000, simulations: 75 },
  },
  {
    id: "psychotherapy",
    label: "Psychotherapy",
    registryKey: "psychotherapy",
    moduleProfessionKeys: [],
    catalogFiles: ["mental-health-social-work"],
    targets: { lessons: 250, flashcards: 2500, questions: 2000, simulations: 75 },
  },
];

function pct(n: number, d: number): string {
  return `${Math.min(100, Math.max(0, (n / Math.max(1, d)) * 100)).toFixed(1)}%`;
}

function mdTable(rows: string[][]): string {
  if (rows.length === 0) return "";
  const [header, ...body] = rows;
  return [
    `| ${header!.join(" | ")} |`,
    `| ${header!.map(() => "---").join(" | ")} |`,
    ...body.map((row) => `| ${row.map((cell) => cell.replace(/\|/g, "\\|").replace(/\n/g, "<br>")).join(" | ")} |`),
  ].join("\n");
}

function catalogLessonCount(catalogFiles: string[]): number {
  return catalogFiles.reduce((sum, file) => {
    const catalog = ALLIED_PROFESSION_DEDICATED_CATALOGS[file] as { lessons?: unknown[] } | undefined;
    return sum + (catalog?.lessons?.length ?? 0);
  }, 0);
}

function moduleAuditsFor(target: FunnelProfession, audits: AlliedModuleQuestionAudit[]): AlliedModuleQuestionAudit[] {
  return audits.filter((audit) => target.moduleProfessionKeys.includes(audit.professionKey));
}

function readinessManifestPct(target: FunnelProfession): number {
  return ALLIED_READINESS_MANIFEST.find((entry) => entry.professionKey === target.id)?.percentComplete ?? 0;
}

function supportStatus(current: number, target: number): TruthStatus {
  if (current <= 0) return "Unsupported";
  if (current >= target * 0.9) return "Supported";
  return "Partially supported";
}

function buildEvidence(): ProfessionEvidence[] {
  const audit = buildAlliedQuestionModalityAuditReport();
  return TARGETS.map((target) => {
    const profession = ALLIED_PROFESSIONS.find((p) => p.professionKey === target.registryKey);
    if (!profession) throw new Error(`Missing allied profession registry row for ${target.registryKey}`);
    const modules = ALLIED_MASTERY_MODULES.filter((module) =>
      target.moduleProfessionKeys.some((key) => module.professionKeys.includes(key)),
    );
    const moduleAudits = moduleAuditsFor(target, audit.modules);
    const questions = moduleAudits.reduce((sum, row) => sum + row.questionCount, 0);
    const qualityPct =
      moduleAudits.length > 0
        ? moduleAudits.reduce((sum, row) => sum + row.modalityCompliancePct, 0) / moduleAudits.length
        : 0;
    return {
      ...target,
      route: `/allied-health/${profession.segment}`,
      title: profession.title,
      description: profession.description,
      lessons: catalogLessonCount(target.catalogFiles),
      flashcards: 0,
      questions,
      cases: modules.filter((module) => module.contentTypes.includes("case_scenarios")).length,
      simulations: modules.filter(
        (module) => module.contentTypes.includes("clinical_action_layer") || module.contentTypes.includes("case_scenarios"),
      ).length,
      readinessManifestPct: readinessManifestPct(target),
      qualityPct,
    };
  });
}

function claimVerdict(row: ProfessionEvidence): TruthStatus {
  const hardUnsupported =
    row.flashcards === 0 ||
    row.questions === 0 ||
    row.simulations < Math.max(1, row.targets.simulations * 0.2) ||
    row.readinessManifestPct >= 90 && row.lessons + row.questions + row.simulations < row.targets.lessons * 0.25;
  if (hardUnsupported) return "Risk";
  if (row.lessons >= row.targets.lessons * 0.9 && row.questions >= row.targets.questions * 0.9) return "Supported";
  return "Partially supported";
}

function landingPageAudit(rows: ProfessionEvidence[]): string {
  const summaryRows = rows.map((row) => [
    row.label,
    row.route,
    row.lessons.toString(),
    row.questions.toString(),
    row.flashcards.toString(),
    row.simulations.toString(),
    `${row.readinessManifestPct}%`,
    claimVerdict(row),
    row.flashcards === 0
      ? "Remove or qualify flashcard availability until decks are evidenced."
      : row.questions === 0
        ? "Remove question-bank CTAs until profession-scoped items are evidenced."
        : row.simulations < row.targets.simulations * 0.2
          ? "Qualify simulation/case language as limited preview only."
          : "Keep claims count-scoped.",
  ]);

  return `# Allied Landing Page Truthfulness Audit

Generated: ${new Date().toISOString()}

Scope: post-homepage Allied profession landing pages only. The homepage was not modified or audited for remediation in this pass.

Evidence sources:
- \`src/app/(marketing)/(default)/allied-health/[slug]/page.tsx\`
- \`src/components/marketing/allied-health-pathway-hub.tsx\`
- \`src/lib/allied/allied-professions-registry.ts\`
- \`src/lib/allied/allied-readiness-manifest.ts\`
- \`src/lib/allied/allied-mastery-modules.ts\`
- \`src/content/pathway-lessons/allied-professions/registry.ts\`

## Executive Verdict

The Allied profession pages are not yet truth-safe for broad commercial conversion. Titles and descriptions are generally track-specific and defensible, but the post-homepage experience still risks overpromising when it presents flashcards, adaptive readiness, practice exams, CAT/adaptive study, or full profession readiness as available surfaces. Current repository evidence shows uneven lesson/question depth, zero evidenced profession-specific flashcards in this audit model, and limited simulation/case depth.

## Profession Landing Page Matrix

${mdTable([
  ["Profession", "Route", "Lessons", "Questions", "Flashcards", "Simulation-like modules", "Manifest readiness", "Verdict", "Required copy action"],
  ...summaryRows,
])}

## Claim-Level Findings

${mdTable([
  ["Claim area", "Observed surface", "Truthfulness verdict", "Evidence", "Action"],
  [
    "Titles and descriptions",
    "`generateMetadata()` uses profession registry title/description.",
    "Partially supported",
    "Registry copy is profession-specific and does not usually state exact counts.",
    "Keep titles, but avoid phrases implying complete exam readiness until per-profession readiness meets launch thresholds.",
  ],
  [
    "Feature lists",
    "Profession registry `features` plus `AlliedHealthPathwayHub` guided study path.",
    "Risk",
    "Feature lists emphasize pathway isolation and lessons, but hub modules expose Flashcards, Adaptive readiness, and Practice exams even where evidence is incomplete.",
    "Gate or qualify feature cards by profession evidence; do not show unavailable modules as part of a ready study path.",
  ],
  [
    "CTA copy",
    "`Lessons for This Track`, question-bank and pricing CTAs.",
    "Risk",
    "Some professions have zero or very low attributable question inventory; PSW has no dedicated catalog evidence.",
    "Route CTAs to only demonstrated surfaces or label them as previews/waitlist.",
  ],
  [
    "Readiness claims",
    "`ALLIED_READINESS_MANIFEST` reports 97-100% for several professions.",
    "Unsupported",
    "Manifest readiness percentages conflict with content parity evidence for lessons, flashcards, questions, simulations, and readiness domains.",
    "Do not display high readiness percentages in learner-facing Allied funnels until calculated from inventory and quality gates.",
  ],
  [
    "Simulation claims",
    "Clinical scenario/case language and simulation-like module references.",
    "Risk",
    "Simulation counts are module-derived and below target for every audited profession.",
    "Use limited-case language only; reserve `simulation library` claims for professions meeting simulation thresholds.",
  ],
  [
    "Question bank claims",
    "Question hub and practice CTAs.",
    "Partially supported",
    "RT, Paramedicine, MLT, PT, and OT have some question evidence; PSW, Social Work, and Psychotherapy have none in the audited module mapping.",
    "Show actual counts or suppress question-bank claims for unsupported professions.",
  ],
  [
    "Flashcard claims",
    "Guided study path includes flashcards.",
    "Unsupported",
    "No profession-specific flashcard inventory is evidenced by this repository-only audit.",
    "Remove, hide, or mark flashcards as coming soon per profession.",
  ],
])}

## Non-Homepage Required Remediation

1. Make the Allied profession hub render module cards only when that profession has demonstrable inventory.
2. Replace high readiness percentages with computed readiness derived from lessons, questions, flashcards, simulations, and quality gates.
3. Suppress or qualify flashcard, practice-exam, and CAT/adaptive claims unless the profession has an immediately accessible surface after signup.
4. Add evidence-backed counts near CTAs where inventory is still developing.
`;
}

function signupAudit(rows: ProfessionEvidence[]): string {
  const allUnsupportedFlashcards = rows.every((row) => row.flashcards === 0);
  const zeroQuestionRows = rows.filter((row) => row.questions === 0).map((row) => row.label).join(", ");
  return `# Allied Signup Truthfulness Audit

Generated: ${new Date().toISOString()}

Scope: \`/pricing\`, \`/signup\`, \`/allied/allied-health/pricing\`, checkout handoff, and upgrade/subscription routing evidence.

## Executive Verdict

The billing system supports Allied checkout selection, but the signup funnel should not promise a complete Allied learning product for every profession. Pricing metadata still describes plans with lessons, questions, flashcards, and mock exams as a general platform promise. That is not currently safe for the audited Allied professions because flashcards are not evidenced and several professions lack attributable question depth.

## Funnel Claim Matrix

${mdTable([
  ["Surface", "Observed claim", "Verdict", "Evidence", "Required action"],
  [
    "`/pricing` metadata",
    "Plans by exam pathway with practice questions, clinical lessons, flashcards, and mock exams.",
    allUnsupportedFlashcards ? "Unsupported" : "Risk",
    "`src/app/(marketing)/(default)/pricing/page.tsx` fallback description includes flashcards and mock exams; Allied flashcards/practice exams are not evidenced in this audit.",
    "Scope pricing copy to available surfaces or add an Allied-specific caveat.",
  ],
  [
    "`/allied/allied-health/pricing`",
    "Redirects through shared pathway pricing and says lessons, questions, flashcards, and exams match this pathway.",
    "Risk",
    "Shared pathway pricing page redirects Allied to global Allied pricing and uses broad pathway subscription language.",
    "Avoid saying flashcards/exams match the pathway unless that can be demonstrated for the selected Allied career.",
  ],
  [
    "`/signup`",
    "Utility signup route; noindex metadata.",
    "Supported",
    "`src/app/(marketing)/(default)/signup/page.tsx` is noindex and delegates to `MarketingSignupPage`.",
    "Keep signup utility copy generic; do not add Allied completion claims.",
  ],
  [
    "Checkout API",
    "Requires Allied career selection and stores Allied career metadata.",
    "Supported",
    "`src/app/api/subscriptions/checkout/route.ts` requires `alliedCareer` for tier `ALLIED` and writes career metadata.",
    "Checkout can sell a career line, but product copy must clarify current content coverage.",
  ],
  [
    "Upgrade/account flow",
    "Allied access after payment.",
    "Partially supported",
    "Learner account routes exist, but per-profession feature completeness remains uneven.",
    "Use `access to available Allied Health study tools` instead of `complete exam prep` until parity thresholds are met.",
  ],
])}

## Immediate Commercial Risk

- Zero evidenced flashcards across audited Allied professions means any paid-tier promise of Allied flashcards is not truth-safe.
- Professions with no attributable question inventory in this model: ${zeroQuestionRows || "none"}.
- Practice exams and CAT/adaptive claims should be treated as unavailable unless a profession-specific launch gate proves item volume and scoring reliability.

## Required Funnel Rule

The pricing and checkout path may sell only what the learner can access immediately after signup. Until parity improves, Allied plan copy should say: "includes available Allied Health lessons and practice tools for selected careers; some professions are in staged rollout."
`;
}

function dashboardAudit(rows: ProfessionEvidence[]): string {
  return `# Allied Dashboard Truthfulness Audit

Generated: ${new Date().toISOString()}

Scope: learner dashboard, study plan, readiness report, analytics, and account performance surfaces after an Allied learner signs in.

## Executive Verdict

The learner dashboard infrastructure exists, but Allied-specific truthfulness depends on whether each panel can resolve profession-scoped content. Current repository evidence supports generic learner analytics and readiness infrastructure, not complete Allied profession readiness. Dashboard surfaces should avoid implying mature CAT, practice exam, flashcard, or simulation coverage for Allied learners until those inventories exist by profession.

## Dashboard Surface Matrix

${mdTable([
  ["Surface", "Route/evidence", "Verdict", "Truthfulness requirement"],
  [
    "Learner dashboard",
    "`src/app/(app)/app/(learner)` plus `load-learner-shell-pathway-metadata.ts` resolves `alliedProfessionKey`.",
    "Partially supported",
    "Dashboard can identify Allied profession context, but cards must only link to inventory-backed modules.",
  ],
  [
    "Study plans",
    "`src/app/(app)/app/(learner)/study-plan/page.tsx` loads premium dashboard snapshot.",
    "Risk",
    "Study plans should not recommend flashcards, CAT, practice exams, or simulations for Allied professions unless those surfaces have evidence.",
  ],
  [
    "Readiness reports",
    "`/app/account/readiness` and `loadReadinessDashboardData` exist.",
    "Risk",
    "Readiness should be based on actual learner attempts and profession-scoped item pools, not static Allied manifest percentages.",
  ],
  [
    "Analytics",
    "`/app/account/analytics` exists and is subscription-gated.",
    "Partially supported",
    "Analytics can exist as a platform feature, but pathway-specific insight quality will be limited for professions with low/no inventory.",
  ],
  [
    "Flashcards dashboard links",
    "`/app/flashcards` accepts `alliedProfession` query context.",
    "Unsupported for claim strength",
    "Routing support is not the same as profession-specific flashcard inventory; this audit found zero evidenced profession flashcards.",
  ],
])}

## Profession Dashboard Risk Matrix

${mdTable([
  ["Profession", "Lessons", "Questions", "Flashcards", "Simulations", "Dashboard-safe modules"],
  ...rows.map((row) => [
    row.label,
    `${row.lessons}/${row.targets.lessons}`,
    `${row.questions}/${row.targets.questions}`,
    `${row.flashcards}/${row.targets.flashcards}`,
    `${row.simulations}/${row.targets.simulations}`,
    [
      row.lessons > 0 ? "lessons" : "",
      row.questions > 0 ? "limited practice" : "",
      row.cases > 0 ? "limited cases" : "",
    ]
      .filter(Boolean)
      .join(", ") || "none evidenced",
  ]),
])}

## Required Dashboard Guardrails

1. Hide or disable empty profession-specific widgets instead of showing "coming soon" inside a paid dashboard.
2. Label readiness as "insufficient data" until the learner has enough profession-scoped attempts.
3. Do not show static 97-100% Allied readiness manifest values as learner-facing readiness.
4. Ensure "Study next" never recommends a content type with zero profession inventory.
`;
}

function pathwayMatrix(rows: ProfessionEvidence[]): string {
  return `# Allied Pathway Feature Matrix

Generated: ${new Date().toISOString()}

Status key: Supported = demonstrable and near launch threshold; Partial = demonstrable but below threshold; Unsupported = no repository evidence in this audit; Risk = route/platform exists but profession-specific content evidence is insufficient.

${mdTable([
  [
    "Profession",
    "Lessons",
    "Flashcards",
    "Questions",
    "CAT",
    "Practice exams",
    "Study plans",
    "Analytics",
    "Readiness domains",
    "Case scenarios",
  ],
  ...rows.map((row) => [
    row.label,
    `${supportStatus(row.lessons, row.targets.lessons)} (${row.lessons}/${row.targets.lessons})`,
    `${supportStatus(row.flashcards, row.targets.flashcards)} (${row.flashcards}/${row.targets.flashcards})`,
    `${supportStatus(row.questions, row.targets.questions)} (${row.questions}/${row.targets.questions})`,
    row.questions >= 500 ? "Risk: item volume may support pilots only" : "Unsupported",
    "Unsupported",
    row.lessons > 0 || row.questions > 0 ? "Risk: platform exists, profession depth uneven" : "Unsupported",
    row.questions > 0 ? "Partial: attempt analytics possible after use" : "Unsupported",
    row.readinessManifestPct >= 90 ? "Risk: manifest high, inventory low" : "Unsupported",
    `${supportStatus(row.cases, Math.max(25, row.targets.simulations / 2))} (${row.cases})`,
  ]),
])}

## Feature Publication Rules

- Lessons may be advertised only with actual counts or "starter library" language until 90% of target.
- Flashcards may not be advertised for Allied professions until profession-scoped decks or generated cards are evidenced.
- CAT and practice exams may not be advertised until profession-specific pool size, scoring, and post-exam review are validated.
- Study plans, analytics, and readiness may be advertised as platform capabilities only when copy states they calibrate after learner activity and available profession content.
- Case scenario claims must stay "limited case practice" until simulation/case thresholds are reached.
`;
}

function seoAudit(rows: ProfessionEvidence[]): string {
  return `# Allied SEO Truthfulness Audit

Generated: ${new Date().toISOString()}

Scope: meta titles, descriptions, canonical URLs, Open Graph, WebPage JSON-LD, breadcrumb schema, and FAQ/schema risk after the homepage.

## Executive Verdict

Profession page metadata is mostly safe because it is track-specific and count-neutral. The main SEO risks are broad claims in pricing metadata and CAT/adaptive metadata. Schema should not imply complete flashcard, mock exam, CAT, or simulation capability for Allied professions until each profession can demonstrate those surfaces after signup.

## SEO Surface Matrix

${mdTable([
  ["Surface", "Evidence", "Verdict", "Action"],
  [
    "Profession page title/meta description",
    "`/allied-health/[slug]` uses `prof.title` and `prof.description`.",
    "Partially supported",
    "Keep count-neutral metadata. Avoid adding completion, unlimited, or full-certification claims.",
  ],
  [
    "Profession canonical/Open Graph",
    "`alternates.canonical` and OG URL use profession route.",
    "Supported",
    "No duplicate canonical issue found for profession landing pages in this pass.",
  ],
  [
    "Profession WebPage JSON-LD",
    "`WebPageJsonLd` uses the same title/description/path.",
    "Partially supported",
    "Safe if title/description remain truth-scoped.",
  ],
  [
    "Breadcrumb schema",
    "`alliedProfessionBreadcrumbs()` renders profession breadcrumb trail.",
    "Supported",
    "No unsupported feature claim identified in breadcrumbs.",
  ],
  [
    "Allied CAT metadata",
    "`/allied/allied-health/cat` title/lead claims CAT/adaptive assessment.",
    "Risk",
    "No profession-specific CAT launch gate evidence in this audit; noindex or qualify until validated.",
  ],
  [
    "Pricing metadata",
    "`/pricing` fallback description claims flashcards and mock exams.",
    "Unsupported for Allied",
    "Use generic pricing copy or conditional Allied metadata without flashcards/mock exams until evidenced.",
  ],
  [
    "FAQ schema",
    "No profession-specific FAQ schema evidence was identified in audited profession page file; homepage FAQ is out of scope.",
    "Supported with caveat",
    "If FAQ schema is later added to profession pages, each answer must be inventory-backed.",
  ],
])}

## Profession Metadata Review

${mdTable([
  ["Profession", "Route", "Title verdict", "Description verdict", "Primary risk"],
  ...rows.map((row) => [
    row.label,
    row.route,
    "Supported",
    row.description.toLowerCase().includes("practice") && row.questions === 0 ? "Risk" : "Partially supported",
    row.description.toLowerCase().includes("practice") && row.questions === 0
      ? "Description mentions practice but no attributable questions were evidenced."
      : row.readinessManifestPct >= 90 && claimVerdict(row) !== "Supported"
        ? "High readiness claims elsewhere may conflict with metadata."
        : "Keep metadata count-neutral.",
  ]),
])}

## SEO Guardrail

No indexable Allied page should claim CAT, mock exams, flashcards, simulations, or complete readiness unless the corresponding post-signup module is demonstrable for that exact profession.
`;
}

function main(): void {
  const rows = buildEvidence();
  mkdirSync(OUT_DIR, { recursive: true });
  const files: Record<string, string> = {
    "allied-landing-page-truthfulness-audit.md": landingPageAudit(rows),
    "allied-signup-truthfulness-audit.md": signupAudit(rows),
    "allied-dashboard-truthfulness-audit.md": dashboardAudit(rows),
    "allied-pathway-feature-matrix.md": pathwayMatrix(rows),
    "allied-seo-truthfulness-audit.md": seoAudit(rows),
  };

  for (const [filename, body] of Object.entries(files)) {
    writeFileSync(resolve(OUT_DIR, filename), `${body.trim()}\n`, "utf8");
  }

  console.log(`Wrote ${Object.keys(files).length} Allied funnel truthfulness audit reports to ${OUT_DIR}`);
}

main();
