import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import {
  AdminFeedbackInboxView,
  buildFeedbackWhere,
} from "@/components/admin/feedback/admin-feedback-inbox-view";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 40;

export default async function AdminUserFeedbackPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(sp.p ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;
  const detailId = sp.r?.trim() ?? "";

  if (!isDatabaseUrlConfigured()) {
    return (
      <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">Feedback inbox</h1>
        <p className="mt-2 text-sm text-muted-foreground">Database is not configured in this environment.</p>
      </main>
    );
  }

  const where = buildFeedbackWhere(sp);

  const [rows, total, selected] = await Promise.all([
    prisma.userFeedbackReport.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip,
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
    }),
    prisma.userFeedbackReport.count({ where }),
    detailId
      ? prisma.userFeedbackReport.findFirst({
          where: { id: detailId },
          include: {
            user: { select: { id: true, email: true, name: true } },
            duplicateOf: { select: { id: true, summary: true, createdAt: true, status: true } },
            childDuplicates: {
              select: { id: true, summary: true, createdAt: true, status: true },
              orderBy: { createdAt: "desc" },
              take: 25,
            },
          },
        })
      : Promise.resolve(null),
  ]);

  return (
    <AdminFeedbackInboxView
      sp={sp}
      page={page}
      pageSize={PAGE_SIZE}
      total={total}
      rows={rows}
      selected={selected}
    />
  );
}
