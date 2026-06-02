import { requireAdmin } from "@/lib/auth/guards";
import { OpsCenterDashboard } from "@/components/admin/ops-center-dashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Operations Center | NurseNest Admin",
  description: "Platform intelligence — system, learner, feature, and performance health at a glance.",
};

export default async function OpsCenterPage() {
  await requireAdmin();
  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <OpsCenterDashboard />
    </main>
  );
}
