import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminScreenshotsClient } from "@/components/admin/media/admin-screenshots-client";

export const dynamic = "force-dynamic";

export default async function AdminScreenshotsPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap gap-3 text-sm font-semibold">
        <Link href="/admin" className="text-primary underline">
          ← Admin home
        </Link>
        <Link href="/admin/media" className="text-muted-foreground underline">
          Media library
        </Link>
      </div>

      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Admin · Media · Screenshots
        </p>
        <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">
          Screenshot registry
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          All marketing screenshots registered for use in carousels, feature sections, FAQ, and the About page.
          Screenshots are stored in DigitalOcean Spaces. Use the capture workflow below to add new ones.
        </p>
      </div>

      <AdminScreenshotsClient />
    </main>
  );
}
