import { requireAdmin } from "@/lib/auth/guards";
import { getStaffSession } from "@/lib/auth/staff-session";
import { readAdminLearnerQaPublicState } from "@/lib/admin/admin-learner-qa-simulation";
import { AdminLearnerQaPanel } from "@/components/admin/admin-learner-qa-panel";

export const dynamic = "force-dynamic";

export default async function AdminLearnerQaPage() {
  await requireAdmin();
  const staff = await getStaffSession();
  const userId = staff?.userId ?? "";
  const initial = userId ? await readAdminLearnerQaPublicState(userId) : null;

  return <AdminLearnerQaPanel initialState={initial} />;
}
