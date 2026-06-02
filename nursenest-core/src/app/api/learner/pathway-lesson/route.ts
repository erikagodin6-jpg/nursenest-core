import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { pathwayLessonReadOmitArgs } from "@/lib/db/pathway-lesson-structural-column-runtime";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { loadLearnerActivityContext } from "@/lib/learner/load-learner-activity-context";
import { resolveAppSubscriberPathwayLessonForDetail } from "@/lib/lessons/app-subscriber-lesson-detail-resolve";
import { getRelatedPathwayLessons } from "@/lib/lessons/pathway-lesson-loader";
import { loadPathwayLessonProgressForSlug } from "@/lib/lessons/pathway-lesson-progress";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";

export const dynamic = "force-dynamic";

const DETAIL_DB_TIMEOUT_MS = 2500;

/**
 * GET /api/learner/pathway-lesson?id=<pathway_lessons.cuid>
 * GET /api/learner/pathway-lesson?pathwayId=<id>&slug=<slug>
 *
 * `firstContent=1` returns the lesson record and the first visible content window
 * without progress or related-lesson personalization. Use it when opening the
 * reader shell; hydrate progress/related study actions after content is visible.
 *
 * Canonical PathwayLesson payload for native detail (same resolver stack as `/app/lessons/[id]`).
 */
export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/pathway-lesson", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;
    const { entitlement } = gate;

    setSentryServerContext({
      route: "/api/learner/pathway-lesson",
      feature: SERVER_FEATURE.lesson,
      userId: gate.userId,
    });

    const url = new URL(req.url);
    const id = url.searchParams.get("id")?.trim() ?? "";
    const pathwayId = url.searchParams.get("pathwayId")?.trim() ?? "";
    const slug = url.searchParams.get("slug")?.trim() ?? "";
    const firstContentOnly = url.searchParams.get("firstContent") === "1";

    const readOmit = await pathwayLessonReadOmitArgs();

    const pwRow = await withDatabaseFallbackTimeout(
      async () => {
        if (id) {
          return prisma.pathwayLesson.findUnique({
            ...readOmit,
            where: { id },
          });
        }
        if (pathwayId.length >= 3 && slug.length > 0) {
          return prisma.pathwayLesson.findUnique({
            ...readOmit,
            where: {
              pathwayId_slug_locale: {
                pathwayId,
                slug,
                locale: "en",
              },
            },
          });
        }
        return null;
      },
      null,
      DETAIL_DB_TIMEOUT_MS,
      { scope: "api_pathway_lesson_detail", label: "load_row" },
    );

    if (!pwRow) {
      return NextResponse.json({ error: "Lesson not found", code: "not_found" }, { status: 404 });
    }

    const learnerContext = await withDatabaseFallbackTimeout(
      () => loadLearnerActivityContext(gate.userId),
      null,
      DETAIL_DB_TIMEOUT_MS,
      { scope: "api_pathway_lesson_detail", label: "learner_context" },
    );
    const learnerPath = learnerContext?.learnerPath ?? null;
    const marketingLocale = await getMarketingLocaleForDefaultRoute();

    const resolution = await resolveAppSubscriberPathwayLessonForDetail({
      entitlement,
      learnerPath,
      marketingLocale,
      pwRow,
    });

    if (resolution.kind === "out_of_plan") {
      return NextResponse.json({ error: "Not available on your plan", code: "out_of_plan" }, { status: 403 });
    }
    if (resolution.kind === "not_found") {
      return NextResponse.json({ error: "Lesson not found", code: "not_found" }, { status: 404 });
    }

    const record = resolution.record;
    const progressStatus = !firstContentOnly && entitlement.hasAccess
      ? await loadPathwayLessonProgressForSlug(gate.userId, resolution.pathwayId, record.slug)
      : ("not_started" as const);

    const related = firstContentOnly
      ? []
      : await getRelatedPathwayLessons(
          resolution.pathwayId,
          record.topicSlug,
          record.slug,
          8,
          marketingLocale,
          record.bodySystem,
        );

    const relatedFiltered = related.filter((l) => l.slug !== record.slug).slice(0, 8);
    const relatedSlugs = relatedFiltered.map((l) => l.slug);
    const relatedIdRows =
      relatedSlugs.length > 0
        ? await prisma.pathwayLesson.findMany({
            where: {
              pathwayId: resolution.pathwayId,
              locale: "en",
              slug: { in: relatedSlugs },
            },
            select: { id: true, slug: true },
          })
        : [];
    const idBySlug = new Map(relatedIdRows.map((r) => [r.slug, r.id]));

    const relatedSummaries = relatedFiltered.map((l) => ({
      lessonId: idBySlug.get(l.slug) ?? null,
      slug: l.slug,
      title: l.title,
      topicSlug: l.topicSlug,
      topic: l.topic,
    }));

    return NextResponse.json({
      pathwayId: resolution.pathwayId,
      lessonId: pwRow.id,
      record,
      firstContentOnly,
      progressStatus,
      related: relatedSummaries,
      entitlement: {
        hasAccess: entitlement.hasAccess,
        canShowLessonProgress: entitlement.hasAccess === true,
      },
    });
  });
}
