import { requireAdmin } from "@/lib/auth/guards";
import { AdminPathwayLessonFormClient } from "@/components/admin/lessons/admin-pathway-lesson-form-client";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminPathwayLessonEditPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <AdminPathwayLessonFormClient pathwayLessonId={id} />
    </main>
  );
}
