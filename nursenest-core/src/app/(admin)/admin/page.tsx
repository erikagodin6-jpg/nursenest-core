import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { loadAdminCommandCenter } from "@/lib/admin/load-admin-command-center";
import { AdminCommandCenter } from "@/components/admin/admin-command-center";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();
  const data = await loadAdminCommandCenter();

  if (!data) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-6 text-sm">
          Command center metrics are unavailable (database offline, safe mode, or load error). Check{" "}
          <Link className="font-semibold text-primary underline" href="/admin/operations">
            operations
          </Link>
          .
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <AdminCommandCenter data={data} />
    </main>
  );
}
