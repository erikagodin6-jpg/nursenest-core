import Link from "next/link";
import { InstitutionalLicensingDashboard } from "@/components/admin/institutions/institutional-licensing-dashboard";
import { requireAdmin } from "@/lib/auth/guards";
import { getStaffSession } from "@/lib/auth/staff-session";
import { loadInstitutionalDashboardData } from "@/lib/institutional/licensing-admin.server";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default async function AdminInstitutionsPage({ searchParams }: PageProps) {
  await requireAdmin();
  const staff = await getStaffSession();
  const params = (await searchParams) ?? {};
  const organizationId = first(params.organizationId);
  const data = await loadInstitutionalDashboardData(organizationId);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Institutional licensing</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Manage schools, hospitals, residency programs, seat licenses, faculty monitoring, readiness trends, and
            cohort completion from one governed NurseNest surface.
          </p>
        </div>
        <Link href="/admin/subscriptions" className="text-sm font-semibold text-primary underline">
          Stripe subscriptions
        </Link>
      </div>

      <InstitutionalLicensingDashboard
        data={data}
        selectedOrganizationId={organizationId}
        canMutate={staff?.tier === "super"}
      />
    </main>
  );
}
