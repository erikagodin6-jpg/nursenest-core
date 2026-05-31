import { ContentStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { loadUserRoleFromDbIdentity } from "@/lib/auth/admin-role-source";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { lessonSystemTopicSlugCandidates } from "@/lib/lessons/lesson-system-navigation";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Lesson Debug | NurseNest",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ pathwayId?: string; system?: string }>;
};

function debugLessonsEnabled(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.LESSON_DEBUG_ROUTE === "1";
}

async function requireAdminDebugAccess(): Promise<void> {
  if (!debugLessonsEnabled()) notFound();
  const session = await auth();
  const user = session?.user as { id?: string; email?: string | null } | undefined;
  const role = await loadUserRoleFromDbIdentity({ userId: user?.id, email: user?.email });
  if (!role?.isAdmin && process.env.NODE_ENV === "production") notFound();
}

export default async function DebugLessonsPage({ searchParams }: Props) {
  await requireAdminDebugAccess();
  const sp = await searchParams;
  const pathwayId = sp.pathwayId?.trim() || "ca-rn-nclex-rn";
  const system = sp.system?.trim() || "cardiovascular";
  const topicCandidates = lessonSystemTopicSlugCandidates(system);

  if (!isDatabaseUrlConfigured()) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Lesson Debug</h1>
        <p className="mt-4 text-sm">Database is not configured in this environment.</p>
      </main>
    );
  }

  const rows = await prisma.pathwayLesson.findMany({
    where: {
      pathwayId,
      status: ContentStatus.PUBLISHED,
      OR: topicCandidates.length
        ? [
            { topicSlug: { in: topicCandidates } },
            { bodySystem: { in: topicCandidates } },
          ]
        : undefined,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      topicSlug: true,
      bodySystem: true,
      locale: true,
      structuralPublicComplete: true,
    },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    take: 50,
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Lesson Debug</h1>
      <p className="mt-2 text-sm">Admin-only raw pathway lesson query results. This route is noindex and disabled in production unless explicitly enabled.</p>
      <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="font-semibold">Pathway</dt>
          <dd>{pathwayId}</dd>
        </div>
        <div>
          <dt className="font-semibold">System</dt>
          <dd>{system}</dd>
        </div>
        <div>
          <dt className="font-semibold">Rows</dt>
          <dd>{rows.length}</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm">
        Candidates: <code>{topicCandidates.join(", ") || "(none)"}</code>
      </p>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr>
              {["Lesson ID", "Title", "System", "Slug", "Topic Slug", "Locale", "Public Complete"].map((heading) => (
                <th key={heading} className="border px-3 py-2 font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="border px-3 py-2">{row.id}</td>
                <td className="border px-3 py-2">{row.title}</td>
                <td className="border px-3 py-2">{row.bodySystem}</td>
                <td className="border px-3 py-2">{row.slug}</td>
                <td className="border px-3 py-2">{row.topicSlug}</td>
                <td className="border px-3 py-2">{row.locale}</td>
                <td className="border px-3 py-2">{row.structuralPublicComplete ? "yes" : "no"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
