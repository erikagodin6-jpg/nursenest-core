import Link from "next/link";
import { auth } from "@/lib/auth";
import { lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import { logBlockedAccess, logEntitlementMismatch } from "@/lib/entitlements/entitlement-logging";
import { safeServerLog } from "@/lib/observability/safe-server-log";

function LessonBody({ content }: { content: unknown }) {
  if (Array.isArray(content)) {
    return (
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--theme-body-text)]">
        {content.map((block, i) => {
          if (typeof block === "string") {
            return (
              <p key={i} className="whitespace-pre-wrap">
                {block}
              </p>
            );
          }
          if (block && typeof block === "object" && "text" in block) {
            const t = (block as { text?: string }).text;
            if (typeof t === "string") {
              return (
                <p key={i} className="whitespace-pre-wrap">
                  {t}
                </p>
              );
            }
          }
          return (
            <pre key={i} className="overflow-x-auto rounded-lg bg-[var(--theme-muted-surface)] p-3 text-xs">
              {JSON.stringify(block, null, 2)}
            </pre>
          );
        })}
      </div>
    );
  }
  if (typeof content === "string") {
    return <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed">{content}</div>;
  }
  return (
    <pre className="mt-6 overflow-x-auto rounded-lg bg-[var(--theme-muted-surface)] p-4 text-xs">
      {JSON.stringify(content, null, 2)}
    </pre>
  );
}

type Props = { params: Promise<{ id: string }> };

export default async function LessonDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <main className="space-y-4">
        <p className="text-sm text-muted">
          We couldn’t finish checking your subscription (temporary data issue). This is not the same as being out of
          plan—refresh, then reopen this lesson; sign in again if it persists.
        </p>
        <Link className="text-sm font-semibold text-primary underline" href="/app/lessons">
          Back to lessons
        </Link>
      </main>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <main className="space-y-4">
        <p className="text-sm text-muted">You need an active subscription to open full app lessons.</p>
        <Link className="text-sm font-semibold text-primary underline" href="/app/lessons">
          Back to lessons
        </Link>
      </main>
    );
  }

  const resolved = await withDatabaseFallback(async () => {
    const exists = await prisma.contentItem.findFirst({
      where: { id, type: "lesson" },
      select: { id: true },
    });
    if (!exists) return { kind: "not_found" as const };
    const row = await prisma.contentItem.findFirst({
      where: { AND: [{ id }, { type: "lesson" }, lessonAccessWhere(entitlement)] },
      select: {
        id: true,
        title: true,
        summary: true,
        content: true,
      },
    });
    if (!row) return { kind: "out_of_plan" as const };
    return { kind: "ok" as const, row };
  }, null);

  if (resolved === null) {
    safeServerLog("page_lesson_detail", "db_unavailable", { id });
    return (
      <main className="space-y-4">
        <p className="text-sm text-muted">
          We couldn’t load this lesson because the database was unreachable or the request failed—not because the lesson is
          missing. Try again in a moment.
        </p>
        <Link className="text-sm font-semibold text-primary underline" href="/app/lessons">
          Back to lessons
        </Link>
      </main>
    );
  }

  if (resolved.kind === "not_found") {
    safeServerLog("page_lesson_detail", "lesson_not_found", { id });
    return (
      <main className="space-y-4">
        <p className="text-sm text-muted">No lesson exists at this link. It may have been removed or the URL is incorrect.</p>
        <Link className="text-sm font-semibold text-primary underline" href="/app/lessons">
          Back to lessons
        </Link>
      </main>
    );
  }

  if (resolved.kind === "out_of_plan") {
    safeServerLog("page_lesson_detail", "lesson_out_of_entitlement", { id });
    logBlockedAccess({
      surface: "page_lesson_detail",
      reason: "lesson_out_of_plan",
      lessonIdPrefix: id.slice(0, 8),
      userTier: String(entitlement.tier ?? ""),
      userCountry: String(entitlement.country ?? ""),
    });
    const meta = await withDatabaseFallback(
      async () =>
        prisma.contentItem.findFirst({
          where: { id, type: "lesson" },
          select: { tier: true, regionScope: true, status: true },
        }),
      null,
    );
    if (meta?.status === "published") {
      logEntitlementMismatch({
        surface: "page_lesson_detail",
        reason: "published_lesson_excluded_by_entitlement",
        lessonIdPrefix: id.slice(0, 8),
        contentTier: meta.tier ?? "",
        contentRegionScope: meta.regionScope ?? "",
      });
    }
    return (
      <main className="space-y-4">
        <p className="text-sm text-muted">
          This lesson is not included in your current region or plan. Update your profile country and tier, or choose a plan that
          matches the content library you need.
        </p>
        <Link className="text-sm font-semibold text-primary underline" href="/app/lessons">
          Back to lessons
        </Link>
      </main>
    );
  }

  const row = resolved.row;

  return (
    <main>
      <Link href="/app/lessons" className="text-sm font-medium text-primary hover:underline">
        ← All lessons
      </Link>
      <h1 className="mt-4 text-3xl font-bold">{row.title}</h1>
      {row.summary ? <p className="mt-2 text-sm text-muted">{row.summary}</p> : null}
      <LessonBody content={row.content as unknown} />
      <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
        <Link
          href="/app/questions"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Apply in question bank
        </Link>
        <Link href="/app/exams" className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-gray-50">
          Timed practice exam
        </Link>
      </div>
    </main>
  );
}
