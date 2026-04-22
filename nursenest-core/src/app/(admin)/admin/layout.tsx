import { AdminNavClient } from "@/components/admin/admin-nav-client";
import { AdminAiGenerationBanner } from "@/components/admin/admin-ai-generation-banner";
import { AdminAiGenerationProvider } from "@/components/admin/admin-ai-generation-context";
import { requireAdmin } from "@/lib/auth/guards";
import { getStaffSession } from "@/lib/auth/staff-session";
import type { StaffTier } from "@/lib/auth/staff-roles";
import { getAdminAiGenerationGate, warnAdminAiGenerationMisconfigurationIfNeeded } from "@/lib/ai/admin-ai-policy";

export const dynamic = "force-dynamic";

export default async function AdminSubLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const staff = await getStaffSession().catch(() => null);
  const tier: StaffTier = staff?.tier ?? "super";
  const aiGate = getAdminAiGenerationGate();
  warnAdminAiGenerationMisconfigurationIfNeeded(aiGate);

  return (
    <div className="flex min-h-[70vh] min-w-0 flex-col bg-[var(--theme-bg)] lg:min-h-screen">
      <AdminNavClient staffTier={tier} />
      <AdminAiGenerationProvider value={aiGate}>
        {!aiGate.runnable ? (
          <div className="border-b border-border/60 bg-[var(--theme-muted-surface)]/35 px-0 py-3 sm:py-4">
            <AdminAiGenerationBanner gate={aiGate} />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">{children}</div>
      </AdminAiGenerationProvider>
    </div>
  );
}
