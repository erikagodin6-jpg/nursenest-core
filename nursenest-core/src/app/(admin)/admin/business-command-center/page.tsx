import Link from "next/link";
import { ExecutiveBusinessCommandCenter } from "@/components/admin/executive-business-command-center";
import { requireAdmin } from "@/lib/auth/guards";
import { loadExecutiveBusinessCommandCenter } from "@/lib/admin/load-executive-business-command-center";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Business Command Center | NurseNest Admin",
  description: "Executive daily business health view for NurseNest revenue, subscriptions, learners, and uptime.",
};

export default async function AdminBusinessCommandCenterPage() {
  await requireAdmin();
  const data = await loadExecutiveBusinessCommandCenter();

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin" className="text-sm font-semibold text-muted-foreground underline">
          ← Admin overview
        </Link>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin/analytics/subscriptions" className="text-primary underline">
            Subscription analytics
          </Link>
          <Link href="/admin/analytics/funnels" className="text-muted-foreground underline">
            Funnel analytics
          </Link>
          <Link href="/admin/conversion-intelligence" className="text-muted-foreground underline">
            Conversion intelligence
          </Link>
          <Link href="/admin/ops-center" className="text-muted-foreground underline">
            Ops center
          </Link>
        </div>
      </div>
      <ExecutiveBusinessCommandCenter data={data} />
    </main>
  );
}
