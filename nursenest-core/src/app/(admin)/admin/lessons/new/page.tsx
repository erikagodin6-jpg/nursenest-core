import { requireAdmin } from "@/lib/auth/guards";
import { AdminLessonFormClient } from "@/components/admin/lessons/admin-lesson-form-client";

export const dynamic = "force-dynamic";

export default async function AdminNewLessonPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <AdminLessonFormClient />
    </main>
  );
}
