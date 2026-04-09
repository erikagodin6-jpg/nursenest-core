import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { loadAdminUserSearch } from "@/lib/admin/load-admin-user-search";
import { AdminUserSearchPanel } from "@/components/admin/admin-user-search-panel";
import { UserRole } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const initialRows = q.length >= 2 ? await loadAdminUserSearch(q) : null;

  const [recent, byCountry, byTier] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 40,
      select: { id: true, email: true, name: true, role: true, country: true, tier: true, createdAt: true, trialStatus: true },
    }),
    prisma.user.groupBy({ by: ["country"], _count: { _all: true } }),
    prisma.user.groupBy({ by: ["tier"], _count: { _all: true } }),
  ]);

  const learners = await prisma.user.count({ where: { role: UserRole.LEARNER } });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Users &amp; support lookup</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Learners: {learners.toLocaleString()} · Search links to a read-only support profile (subscription, usage, recent
            activity).
          </p>
        </div>
        <Link href="/admin" className="text-sm font-semibold text-primary underline">
          ← Overview
        </Link>
      </div>

      <div className="mt-8">
        <AdminUserSearchPanel key={q || "home"} initialQuery={q} initialRows={initialRows} />
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="nn-card p-6">
          <h2 className="text-lg font-semibold">By country</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {byCountry.map((r) => (
              <li key={r.country} className="flex justify-between">
                <span>{r.country}</span>
                <span className="tabular-nums">{r._count._all}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="nn-card p-6">
          <h2 className="text-lg font-semibold">By tier</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {byTier.map((r) => (
              <li key={r.tier} className="flex justify-between">
                <span>{r.tier}</span>
                <span className="tabular-nums">{r._count._all}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8 nn-card p-6">
        <h2 className="text-lg font-semibold">Newest registrations</h2>
        <div className="mt-4 overflow-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">Country</th>
                <th className="py-2">Tier</th>
                <th className="py-2">Trial</th>
                <th className="py-2">Created</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {recent.map((u) => (
                <tr key={u.id} className="border-b border-border/50">
                  <td className="py-2 pr-2">{u.name}</td>
                  <td className="py-2 font-mono text-xs">{u.email}</td>
                  <td className="py-2">{u.role}</td>
                  <td className="py-2">{u.country}</td>
                  <td className="py-2">{u.tier}</td>
                  <td className="py-2">{u.trialStatus}</td>
                  <td className="py-2 text-xs">{u.createdAt.toISOString().slice(0, 10)}</td>
                  <td className="py-2">
                    <Link href={`/admin/users/${encodeURIComponent(u.id)}`} className="text-primary underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
