import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminLessonsLibraryClient } from "@/components/admin/lessons/admin-lessons-library-client";

export const dynamic = "force-dynamic";

export default async function AdminLessonsLibraryPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap gap-3 text-sm font-semibold">
        <Link href="/admin" className="text-primary underline">
          ← Admin home
        </Link>
        <Link href="/admin/content" className="text-muted-foreground underline">
          Content & coverage
        </Link>
      </div>
      <AdminLessonsLibraryClient />
    </main>
  );
}
