import { AdminNavClient } from "@/components/admin/admin-nav-client";
import { requireAdmin } from "@/lib/auth/guards";
import { getStaffSession } from "@/lib/auth/staff-session";
import type { StaffTier } from "@/lib/auth/staff-roles";

export const dynamic = "force-dynamic";

export default async function AdminSubLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const staff = await getStaffSession().catch(() => null);
  const tier: StaffTier = staff?.tier ?? "super";

  return (
    <div className="flex min-h-[70vh] min-w-0 flex-col bg-[var(--theme-bg)] lg:min-h-screen">
      <AdminNavClient staffTier={tier} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
