import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { buildFlashcardCustomSession } from "@/lib/flashcards/build-flashcard-custom-session";
import { loadFlashcardsExamInventoryForPathway } from "@/lib/flashcards/load-flashcards-exam-inventory.server";

const REPORT_DIR = join(process.cwd(), "reports");
const AUDIT_PATH = join(REPORT_DIR, "flashcard-category-audit.md");
const VERIFY_PATH = join(REPORT_DIR, "flashcard-category-fix-verification.md");

const PATHWAYS = [
  { group: "RN", id: "ca-rn-nclex-rn" },
  { group: "RN", id: "us-rn-nclex-rn" },
  { group: "RPN", id: "ca-rpn-rex-pn" },
  { group: "PN", id: "us-lpn-nclex-pn" },
  { group: "NP", id: "ca-np-cnple" },
  { group: "NP", id: "us-np-fnp" },
  { group: "NP", id: "us-np-agpcnp" },
  { group: "NP", id: "us-np-pmhnp" },
  { group: "NP", id: "us-np-whnp" },
  { group: "NP", id: "us-np-pnp-pc" },
] as const;

type Row = {
  group: string;
  pathwayId: string;
  categoryId: string;
  categorySlug: string;
  inventoryCount: number;
  publishedCount: number;
  filteredCount: number;
  finalAvailableCount: number;
  sessionCreated: boolean;
  broken: boolean;
  rootCause: string;
};

function accessScope(pathway: { stripeTier: unknown; countryCode: unknown }): AccessScope {
  return {
    hasAccess: true,
    tier: pathway.stripeTier,
    country: pathway.countryCode,
    alliedCareer: null,
    reason: "active_subscription",
  } as AccessScope;
}

function slugForCategoryId(id: string): string {
  return id.toLowerCase().replace(/_/g, "-");
}

function table(rows: Row[]): string {
  return [
    "| Pathway | Category ID | Category Slug | Flashcard Count | Published Count | Filtered Count | Final Available | Session Created | Root Cause |",
    "|---|---|---|---:|---:|---:|---:|---|---|",
    ...rows.map((r) =>
      [
        r.pathwayId,
        r.categoryId,
        r.categorySlug,
        String(r.inventoryCount),
        String(r.publishedCount),
        String(r.filteredCount),
        String(r.finalAvailableCount),
        r.sessionCreated ? "Yes" : "No",
        r.rootCause,
      ].join(" | ").replace(/^/, "| ").replace(/$/, " |"),
    ),
  ].join("\n");
}

async function auditPathway(pathwayMeta: (typeof PATHWAYS)[number]): Promise<Row[]> {
  const pathway = getExamPathwayById(pathwayMeta.id);
  if (!pathway) {
    return [{
      group: pathwayMeta.group,
      pathwayId: pathwayMeta.id,
      categoryId: "(pathway not found)",
      categorySlug: "",
      inventoryCount: 0,
      publishedCount: 0,
      filteredCount: 0,
      finalAvailableCount: 0,
      sessionCreated: false,
      broken: true,
      rootCause: "pathway_not_registered",
    }];
  }

  const entitlement = accessScope(pathway);
  const inv = await loadFlashcardsExamInventoryForPathway({
    userId: "flashcard-category-audit",
    entitlement,
    pathway,
  });

  if (!inv.ok) {
    return [{
      group: pathwayMeta.group,
      pathwayId: pathwayMeta.id,
      categoryId: "(inventory failed)",
      categorySlug: "",
      inventoryCount: 0,
      publishedCount: 0,
      filteredCount: 0,
      finalAvailableCount: 0,
      sessionCreated: false,
      broken: true,
      rootCause: inv.code,
    }];
  }

  const rows: Row[] = [];
  for (const category of inv.categoryOptions.filter((c) => c.count > 0)) {
    const built = await buildFlashcardCustomSession({
      userId: "flashcard-category-audit",
      entitlement,
      pathwayId: pathwayMeta.id,
      selectedCategories: [category.id],
      stateIds: [],
      weakOnly: false,
      incorrectOnly: false,
      starredOnly: false,
      savedOnly: false,
      notesOnly: false,
      revisitOnly: false,
      notStudiedOnly: false,
      recentStudiedOnly: false,
      recentDays: 7,
      shuffle: false,
      mode: "mixed",
      limit: 20,
      includeCards: true,
      sourceKind: "all",
      sessionSeed: `audit:${pathwayMeta.id}:${category.id}`,
      cardLimitRaw: "20",
    });

    const filteredCount = built.ok ? built.summary.matchingCards : 0;
    const finalAvailableCount = built.ok ? built.summary.returnedCards : 0;
    const broken = category.count > 0 && finalAvailableCount === 0;
    rows.push({
      group: pathwayMeta.group,
      pathwayId: pathwayMeta.id,
      categoryId: category.id,
      categorySlug: slugForCategoryId(category.id),
      inventoryCount: category.count,
      publishedCount: inv.total,
      filteredCount,
      finalAvailableCount,
      sessionCreated: built.ok && finalAvailableCount > 0,
      broken,
      rootCause: broken
        ? built.ok
          ? "filtered_or_serialized_to_zero"
          : built.reason
        : "none",
    });
  }
  return rows;
}

async function main() {
  await mkdir(REPORT_DIR, { recursive: true });
  const rows: Row[] = [];
  for (const pathway of PATHWAYS) {
    rows.push(...(await auditPathway(pathway)));
  }
  const broken = rows.filter((r) => r.broken);
  const now = new Date().toISOString();

  const rootCause = broken.length === 0
    ? "No post-fix false empty categories were found in the audited visible inventory."
    : "At least one visible category still filtered or serialized to zero.";

  const audit = `# Flashcard Category Audit

Generated: ${now}

## Root Cause

The pre-fix failure had two production causes.

1. Source-of-truth divergence: the launcher displays canonical body-system selections and inventory rows derived from the shared question-bank/lesson taxonomy, while session filtering compared selected raw builder IDs directly against independently classified card IDs. Aliases such as \`infection_control\` versus \`immune_infectious\`, \`renal_urinary\` versus \`renal_genitourinary\`, and \`reproductive_maternal_newborn\` versus \`reproductive_obstetrics\` could therefore show inventory but filter the study pool to zero.
2. Serialization false-empty: some visible categories had matching cards, but the custom-session builder only accepted strict four-option MCQ payloads. Legacy exam-backed rows with usable front/back flashcard content and incomplete option metadata were discarded, so non-empty categories such as \`fundamentals_safety\` and \`musculoskeletal\` could return "no cards" after filtering.

The live inventory path also had an audit-time SQL issue: parameterized \`SET LOCAL statement_timeout\` is invalid in PostgreSQL. Optional diagnostic counts could also timeout and abort the inventory transaction. Those diagnostics are now best-effort and cannot force a false empty inventory state.

Responsible files:

- \`src/components/flashcards/flashcards-hub-client.tsx\`
- \`src/lib/learner-study-hub/body-system-data.ts\`
- \`src/lib/flashcards/build-flashcard-custom-session.ts\`
- \`src/lib/flashcards/flashcard-study-serialize.ts\`
- \`src/lib/flashcards/flashcard-builder-taxonomy.ts\`
- \`src/lib/flashcards/load-flashcards-exam-inventory.server.ts\`

## Category Counts

${table(rows)}

## Broken Categories

${broken.length === 0 ? "None." : table(broken)}
`;

  const verification = `# Flashcard Category Fix Verification

Generated: ${now}

## Verdict

${broken.length === 0 ? "PASS" : "FAIL"}

${rootCause}

## Coverage

- RN: ${rows.filter((r) => r.group === "RN").length} visible categories checked
- RPN: ${rows.filter((r) => r.group === "RPN").length} visible categories checked
- PN: ${rows.filter((r) => r.group === "PN").length} visible categories checked
- NP: ${rows.filter((r) => r.group === "NP").length} visible categories checked

## Results

${table(rows)}
`;

  await writeFile(AUDIT_PATH, audit);
  await writeFile(VERIFY_PATH, verification);
  console.log(JSON.stringify({
    ok: broken.length === 0,
    rows: rows.length,
    broken: broken.length,
    auditPath: AUDIT_PATH,
    verificationPath: VERIFY_PATH,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
