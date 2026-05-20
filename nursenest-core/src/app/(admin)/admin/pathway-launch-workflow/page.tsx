import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import { listExpansionHubRegions, getExamHubForGlobalRegion } from "@/lib/marketing/global-region-exam-hubs";
import { REGION_CONFIG } from "@/lib/i18n/global-regions";
import { PathwayLaunchWorkflowPanel, type WorkflowRow } from "@/components/admin/pathway-launch-workflow-panel";

export const dynamic = "force-dynamic";

export default async function PathwayLaunchWorkflowPage() {
  await requireAdmin();

  let workflows: WorkflowRow[] = [];
  try {
    const rows = await prisma.pathwayLaunchWorkflow.findMany({
      orderBy: [{ isTeamFocus: "desc" }, { updatedAt: "desc" }],
    });
    workflows = rows.map((w) => ({
      id: w.id,
      targetKey: w.targetKey,
      stage: w.stage,
      isTeamFocus: w.isTeamFocus,
      notes: w.notes,
      attestations: w.attestations,
    }));
  } catch {
    workflows = [];
  }

  const pathwayOptions = EXAM_PATHWAYS.filter((p) => p.status !== "hidden").map((p) => ({
    id: p.id,
    label: `${p.shortName} · ${p.displayName}`,
  }));

  const regionSlugs = listExpansionHubRegions();
  const regionOptions = regionSlugs.map((slug) => {
    const hub = getExamHubForGlobalRegion(slug);
    const name = REGION_CONFIG[slug]?.displayName ?? slug;
    return {
      slug,
      label: `${name} (${hub?.hubPath ?? "—"})`,
      hubPath: hub?.hubPath ?? "/",
    };
  });

  const defaultTargetKey =
    workflows.find((w) => w.isTeamFocus)?.targetKey ??
    (pathwayOptions[0] ? `pathway:${pathwayOptions[0].id}` : regionOptions[0] ? `region:${regionOptions[0].slug}` : "pathway:us-rn-nclex-rn");

  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Launch operations</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Pathway &amp; region launch workflow</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            One country or pathway at a time: move through draft → content → QA → SEO → ready to publish → live → post-publish
            verification. Advancing to <strong>Ready to publish</strong> or <strong>Published live</strong> is blocked until automated checks
            and required attestations pass — live learners are unchanged until code approval sets ship (
            <code className="rounded bg-muted px-1">PATHWAY_LAUNCH_APPROVED</code>,{" "}
            <code className="rounded bg-muted px-1">GLOBAL_REGION_EXPANSION_PUBLISHED</code>).
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/admin/country-exam-readiness" className="rounded-lg border border-border px-3 py-2 font-medium hover:bg-muted">
            Country / exam readiness
          </Link>
          <Link href="/admin/inventory" className="rounded-lg border border-border px-3 py-2 font-medium hover:bg-muted">
            Inventory
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <PathwayLaunchWorkflowPanel
          initialWorkflows={workflows}
          pathwayOptions={pathwayOptions}
          regionOptions={regionOptions}
          defaultTargetKey={defaultTargetKey}
        />
      </div>
    </main>
  );
}
