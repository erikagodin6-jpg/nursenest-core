import Link from "next/link";
import { AdminDemoUsersPanel } from "@/components/admin/admin-demo-users-panel";
import { listPublicExamPathways } from "@/lib/exam-pathways/exam-product-registry";
import { prisma } from "@/lib/db";
import { API_LIST_PAGE_SIZE_HARD_MAX } from "@/lib/api/api-pagination-limits";
import { catPathwayRegionRoleLabel } from "@/lib/exam-pathways/cat-pathway-labels";

export const dynamic = "force-dynamic";

export default async function AdminDemoUsersPage() {
  const pathways = listPublicExamPathways().map((p) => ({
    id: p.id,
    label: `${catPathwayRegionRoleLabel(p)} · ${p.shortName}`,
  }));

  const rows = await prisma.user.findMany({
    where: { isDemoUser: true },
    orderBy: { createdAt: "desc" },
    take: API_LIST_PAGE_SIZE_HARD_MAX,
    select: {
      id: true,
      email: true,
      name: true,
      tier: true,
      country: true,
      learnerPath: true,
      createdAt: true,
    },
  });

  const initialUsers = rows.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Super</p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--theme-heading-text)]">Demo users</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            QA and screenshot accounts with seeded progress. They cannot start Stripe checkout or free trials, and public
            signup rejects the reserved email domain.
          </p>
        </div>
        <Link href="/admin" className="text-sm font-semibold text-primary underline">
          ← Overview
        </Link>
      </div>

      <div className="mt-8">
        <AdminDemoUsersPanel pathways={pathways} initialUsers={initialUsers} />
      </div>
    </main>
  );
}
