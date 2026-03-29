import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { I18nDiagnosticsDashboard } from "@/components/admin/i18n-diagnostics-dashboard";

export const metadata = {
  title: "i18n diagnostics | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminI18nPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10">
      <nav className="mb-6 text-sm text-muted">
        <Link href="/admin" className="text-primary underline hover:opacity-90">
          ← Admin home
        </Link>
      </nav>
      <I18nDiagnosticsDashboard />
    </main>
  );
}
