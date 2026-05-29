import Link from "next/link";
import { BlueprintComplianceDashboard } from "@/components/admin/blueprints/blueprint-compliance-dashboard";
import { requireAdmin } from "@/lib/auth/guards";
import {
  blueprintPathwayOptions,
  loadAdminBlueprintComplianceDashboard,
} from "@/lib/blueprints/load-blueprint-compliance.server";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default async function AdminBlueprintCompliancePage({ searchParams }: PageProps) {
  await requireAdmin();
  const params = (await searchParams) ?? {};
  const pathwayId = first(params.pathwayId);
  const data = await loadAdminBlueprintComplianceDashboard(pathwayId);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Content</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Exam blueprint compliance</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Track target versus actual domain distribution across question banks, flashcards, lessons, CAT-ready pools,
            and clinical simulations. Use the gaps to prioritize content creation before learner-facing imbalance appears.
          </p>
        </div>
        <Link href="/admin/content-coverage" className="text-sm font-semibold text-primary underline">
          Content coverage →
        </Link>
      </div>
      <BlueprintComplianceDashboard data={data} selectedPathwayId={pathwayId} pathwayOptions={blueprintPathwayOptions()} />
    </main>
  );
}
