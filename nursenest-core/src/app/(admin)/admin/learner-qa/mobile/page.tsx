import { requireAdmin } from "@/lib/auth/guards";
import { getStaffSession } from "@/lib/auth/staff-session";
import {
  bannerTitleForPayload,
  getVerifiedAdminLearnerQaSimulation,
  readAdminLearnerQaPublicState,
} from "@/lib/admin/admin-learner-qa-simulation";
import {
  clampAdminLearnerQaPreviewWidth,
  sanitizeAdminLearnerQaIframePath,
} from "@/lib/admin/admin-learner-qa-mobile-preview";
import { AdminLearnerQaMobilePreview } from "@/components/admin/admin-learner-qa-mobile-preview";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{ path?: string; width?: string }>;
};

export default async function AdminLearnerQaMobilePage(props: PageProps) {
  await requireAdmin();
  const staff = await getStaffSession();
  const userId = staff?.userId ?? "";
  const sp = (await props.searchParams) ?? {};
  const path = sanitizeAdminLearnerQaIframePath(sp.path);
  const width = clampAdminLearnerQaPreviewWidth(sp.width);

  const qaState = userId ? await readAdminLearnerQaPublicState(userId) : null;
  const payload = userId ? await getVerifiedAdminLearnerQaSimulation(userId) : null;
  const learnerStateLine = payload ? bannerTitleForPayload(payload) : "None (staff live entitlements inside iframe)";

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col px-3 py-4 sm:px-6 lg:px-8">
      <AdminLearnerQaMobilePreview
        key={`${path}-${width}`}
        initialPath={path}
        initialWidth={width}
        qaState={qaState}
        learnerStateLine={learnerStateLine}
      />
    </div>
  );
}
