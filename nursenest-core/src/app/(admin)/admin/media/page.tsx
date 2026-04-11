import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminMediaLibraryClient } from "@/components/admin/media/admin-media-library-client";

export const dynamic = "force-dynamic";

export default async function AdminMediaLibraryPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap gap-3 text-sm font-semibold">
        <Link href="/admin" className="text-primary underline">
          ← Admin home
        </Link>
        <Link href="/admin/blog/control-panel" className="text-muted-foreground underline">
          Blog panel
        </Link>
        <Link href="/admin/lessons" className="text-muted-foreground underline">
          Lessons
        </Link>
        <Link href="/admin/media/screenshots" className="text-muted-foreground underline">
          Screenshots
        </Link>
      </div>

      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Content</p>
        <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Media library</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Uploads go to DigitalOcean Spaces (CDN). Tag and describe assets here, then pick them from the blog and lesson
          editors. Usage counts are best-effort—run a scan to refresh references across blogs, lessons, pathway lessons,
          and exam questions.
        </p>
      </div>

      <AdminMediaLibraryClient />
    </main>
  );
}
