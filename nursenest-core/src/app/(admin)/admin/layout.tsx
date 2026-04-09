import { AdminNavClient } from "@/components/admin/admin-nav-client";
import { requireAdmin } from "@/lib/auth/guards";
import { getStaffSession } from "@/lib/auth/staff-session";
import type { StaffTier } from "@/lib/auth/staff-roles";

export default async function AdminSubLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const staff = await getStaffSession();
  const tier: StaffTier = staff?.tier ?? "super";

  return (
    <div className="flex min-h-[70vh] flex-col bg-[var(--theme-bg)] lg:min-h-screen lg:flex-row">
      <AdminNavClient staffTier={tier} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
