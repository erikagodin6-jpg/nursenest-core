import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";

export default async function AdminLessonsPage() {
  await requireAdmin();
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--theme-heading-text)]">Lessons admin</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Paginated JSON lists for pathway + content-item lessons. For deep coverage, use{" "}
        <Link className="font-semibold text-primary underline" href="/admin/content">
          Content & coverage
        </Link>
        .
      </p>
      <ul className="mt-6 space-y-2 text-sm">
        <li>
          <Link className="text-primary underline" href="/api/admin/lessons?page=1&pageSize=20">
            GET /api/admin/lessons
          </Link>
        </li>
        <li>
          <Link className="text-primary underline" href="/api/admin/pathway-lesson-translations">
            Pathway translation coverage
          </Link>
        </li>
      </ul>
    </main>
  );
}
