import { requireAdmin } from "@/lib/auth/guards";
import { getStaffSession } from "@/lib/auth/staff-session";
import { readAdminLearnerQaPublicState } from "@/lib/admin/admin-learner-qa-simulation";
import { AdminLearnerQaEntitlementDiagnostics } from "@/components/admin/admin-learner-qa-entitlement-diagnostics.server";
import { AdminLearnerQaPanel } from "@/components/admin/admin-learner-qa-panel";

export const dynamic = "force-dynamic";

export default async function AdminLearnerQaPage() {
  await requireAdmin();
  const staff = await getStaffSession();
  const userId = staff?.userId ?? "";
  const initial = userId ? await readAdminLearnerQaPublicState(userId) : null;

  return (
    <>
      {userId ? (
        <div className="mx-auto w-full max-w-3xl px-4 pt-8 sm:px-6 lg:px-8">
          <AdminLearnerQaEntitlementDiagnostics userId={userId} />
        </div>
      ) : null}
      <AdminLearnerQaPanel initialState={initial} />
    </>
  );
}
