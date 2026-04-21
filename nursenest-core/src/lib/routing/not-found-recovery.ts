import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getExamPathwayByRoute, listExamPathways } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { loadPathwayHubResumePayload } from "@/lib/learner/pathway-lesson-continuation";
import { emptyStateCopy } from "@/lib/ui/empty-state-copy";

export type NotFoundRecoveryCta = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
};

export type NotFoundRouteKind =
  | "generic"
  | "pathway_overview"
  | "pathway_lessons"
  | "closest_pathway";

export type NotFoundRouteContext = {
  kind: NotFoundRouteKind;
  pathname: string;
  pathway: ExamPathwayDefinition | null;
  pathwayOverviewHref: string | null;
  pathwayLessonsHref: string | null;
};

export type NotFoundRecoveryModel = {
  headline: string;
  body: string;
  hint?: string;
  primaryCta: NotFoundRecoveryCta;
  secondaryCtas: NotFoundRecoveryCta[];
};

function normalizePathname(pathname: string): string {
  const trimmed = pathname.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("/") ? trimmed.toLowerCase() : `/${trimmed.toLowerCase()}`;
}

function maybeMatchClosestPathway(
  countrySlug: string,
  roleTrack: string,
  examCode: string,
): ExamPathwayDefinition | null {
  const normalizedExam = examCode.trim().toLowerCase();
  if (!countrySlug || !roleTrack || !normalizedExam) return null;

  const condensedExam = normalizedExam.replace(/-/g, "");
  const candidates = listExamPathways()
    .filter((p) => p.status !== "hidden")
    .filter((p) => p.countrySlug === countrySlug && p.roleTrack === roleTrack);

  const matches = candidates.filter((candidate) => {
    const code = candidate.examCode.toLowerCase();
    const condensedCode = code.replace(/-/g, "");
    return (
      code.startsWith(normalizedExam) ||
      normalizedExam.startsWith(code) ||
      condensedCode.startsWith(condensedExam) ||
      condensedExam.startsWith(condensedCode)
    );
  });

  return matches.length === 1 ? matches[0] : null;
}

function pickCopyVariant(pathname: string): number {
  let total = 0;
  for (const char of pathname) total += char.charCodeAt(0);
  return total;
}

export function resolveNotFoundRouteContext(pathname: string): NotFoundRouteContext {
  const normalized = normalizePathname(pathname);
  const segments = normalized.split("/").filter(Boolean);

  if (segments.length >= 3) {
    const [countrySlug, roleTrack, examCode, ...rest] = segments;
    const exact = getExamPathwayByRoute(countrySlug, roleTrack, examCode);
    if (exact) {
      return {
        kind: rest[0] === "lessons" ? "pathway_lessons" : "pathway_overview",
        pathname: normalized,
        pathway: exact,
        pathwayOverviewHref: buildExamPathwayPath(exact),
        pathwayLessonsHref: buildExamPathwayPath(exact, "lessons"),
      };
    }

    const closest = maybeMatchClosestPathway(countrySlug, roleTrack, examCode);
    if (closest) {
      return {
        kind: "closest_pathway",
        pathname: normalized,
        pathway: closest,
        pathwayOverviewHref: buildExamPathwayPath(closest),
        pathwayLessonsHref: buildExamPathwayPath(closest, "lessons"),
      };
    }
  }

  return {
    kind: "generic",
    pathname: normalized,
    pathway: null,
    pathwayOverviewHref: null,
    pathwayLessonsHref: null,
  };
}

export function buildNotFoundRecoveryModel(
  context: NotFoundRouteContext,
  options?: {
    signedIn?: boolean;
    dashboardHref?: string;
    resumeHref?: string | null;
    resumeLabel?: string | null;
  },
): NotFoundRecoveryModel {
  const variant = pickCopyVariant(context.pathname || "/404");
  const pathwayLine = context.pathway?.shortName;
  const exam = context.pathway?.displayName;
  const copy =
    context.kind === "generic"
      ? emptyStateCopy.notFoundMinimal({ variant })
      : emptyStateCopy.notFound({ exam, pathwayLine, variant });

  const secondaryCtas: NotFoundRecoveryCta[] = [];

  let primaryCta: NotFoundRecoveryCta = { label: "Go Home", href: "/", variant: "primary" };
  if (context.kind === "pathway_lessons" && context.pathwayLessonsHref) {
    primaryCta = { label: "Browse Lessons", href: context.pathwayLessonsHref, variant: "primary" };
    if (context.pathwayOverviewHref) {
      secondaryCtas.push({ label: "Open Pathway Hub", href: context.pathwayOverviewHref, variant: "secondary" });
    }
  } else if ((context.kind === "pathway_overview" || context.kind === "closest_pathway") && context.pathwayOverviewHref) {
    primaryCta = { label: "Open Pathway Hub", href: context.pathwayOverviewHref, variant: "primary" };
    if (context.pathwayLessonsHref) {
      secondaryCtas.push({ label: "Browse Lessons", href: context.pathwayLessonsHref, variant: "secondary" });
    }
  }

  if (options?.signedIn && options.resumeHref) {
    secondaryCtas.unshift({
      label: options.resumeLabel?.trim() || "Resume Studying",
      href: options.resumeHref,
      variant: "secondary",
    });
  }
  if (options?.signedIn && options.dashboardHref) {
    secondaryCtas.unshift({ label: "Go to Dashboard", href: options.dashboardHref, variant: "secondary" });
  }

  const hasBrowseLessons =
    primaryCta.label === "Browse Lessons" || secondaryCtas.some((cta) => cta.label === "Browse Lessons");
  if (!hasBrowseLessons) {
    secondaryCtas.push({
      label: "Browse Lessons",
      href: context.pathwayLessonsHref ?? "/lessons",
      variant: "secondary",
    });
  }

  const hasHome = primaryCta.label === "Go Home" || secondaryCtas.some((cta) => cta.label === "Go Home");
  if (!hasHome) {
    secondaryCtas.push({ label: "Go Home", href: "/", variant: "ghost" });
  }

  const deduped: NotFoundRecoveryCta[] = [];
  for (const cta of secondaryCtas) {
    if (!cta.href) continue;
    if (cta.href === primaryCta.href && cta.label === primaryCta.label) continue;
    if (deduped.some((existing) => existing.href === cta.href && existing.label === cta.label)) continue;
    deduped.push(cta);
  }

  return {
    headline: copy.headline,
    body: copy.body,
    hint: copy.hint,
    primaryCta,
    secondaryCtas: deduped,
  };
}

export async function loadNotFoundRecovery(): Promise<NotFoundRecoveryModel> {
  const headerList = await headers();
  const context = resolveNotFoundRouteContext(headerList.get("x-nn-pathname") ?? "");
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? "";

  if (!userId) {
    return buildNotFoundRecoveryModel(context);
  }

  const options: Parameters<typeof buildNotFoundRecoveryModel>[1] = {
    signedIn: true,
    dashboardHref: "/app",
  };

  if (!context.pathway || !context.pathwayLessonsHref) {
    return buildNotFoundRecoveryModel(context, options);
  }

  try {
    const entitlement = await resolveEntitlementForPage(userId);
    if (entitlement === "error" || !entitlement.hasAccess) {
      return buildNotFoundRecoveryModel(context, options);
    }

    let learnerPath: string | null = null;
    if (isDatabaseUrlConfigured()) {
      const userRow = await prisma.user.findUnique({
        where: { id: userId },
        select: { learnerPath: true },
      });
      learnerPath = userRow?.learnerPath ?? null;
    }

    const resume = await loadPathwayHubResumePayload(
      userId,
      entitlement,
      learnerPath,
      context.pathway,
      context.pathwayLessonsHref,
    );
    const resumeTarget = resume.nextRecommended ?? resume.lastTouched;
    if (resumeTarget?.href) {
      options.resumeHref = resumeTarget.href;
      options.resumeLabel = "Resume Studying";
    }
  } catch {
    // Recovery pages must stay resilient — if subscriber lookups fail, fall back to safe static CTAs.
  }

  return buildNotFoundRecoveryModel(context, options);
}
