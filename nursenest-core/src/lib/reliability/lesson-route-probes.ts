import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { fetchWithTimeout } from "@/lib/reliability/fetch-with-timeout";
import { analyzeProbeHtml, extractHtmlTitle } from "@/lib/reliability/probe-content-guards";
import { getEffectiveCatalogLessonsForPathwaySync } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { pathwayLessonMarketingHubVerifiedCardHref } from "@/lib/lessons/pathway-lesson-types";

export type LessonRouteProbeResult = {
  kind: "lesson";
  pathwayId: string;
  path: string;
  requestedUrl: string;
  finalUrl: string;
  status: number;
  durationMs: number;
  ok: boolean;
  issues: string[];
  title: string | null;
};

export type LessonRouteProbeReport = {
  checkedAt: string;
  baseUrl: string;
  targets: LessonRouteProbeResult[];
  failures: string[];
  warnings: string[];
  ok: boolean;
  resolutionNote?: string;
};

/** Bounded catalog-backed samples (not full inventory). */
const LESSON_PROBE_PATHWAYS: readonly { pathwayId: string; maxLessons: number }[] = [
  { pathwayId: "ca-rn-nclex-rn", maxLessons: 2 },
  { pathwayId: "ca-rpn-rex-pn", maxLessons: 2 },
  { pathwayId: "ca-np-cnple", maxLessons: 2 },
  { pathwayId: "ca-allied-core", maxLessons: 2 },
  { pathwayId: "us-rn-new-grad-transition", maxLessons: 2 },
] as const;

function joinBaseAndPath(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

function sameOrigin(finalUrl: string, baseUrl: string): boolean {
  try {
    return new URL(finalUrl).origin === new URL(baseUrl).origin;
  } catch {
    return false;
  }
}

export function resolveVerifiedLessonProbePaths(): { pathwayId: string; path: string }[] {
  const out: { pathwayId: string; path: string }[] = [];
  for (const { pathwayId, maxLessons } of LESSON_PROBE_PATHWAYS) {
    const pathway = getExamPathwayById(pathwayId);
    if (!pathway) continue;
    const lessonsBasePath = marketingPathwayLessonsIndexPath(pathway);
    const lessons = getEffectiveCatalogLessonsForPathwaySync(pathwayId);
    let n = 0;
    for (const lesson of lessons) {
      if (n >= maxLessons) break;
      const href = pathwayLessonMarketingHubVerifiedCardHref(lessonsBasePath, lesson);
      if (!href) continue;
      out.push({ pathwayId, path: href });
      n++;
    }
  }
  return out;
}

async function probeLessonUrl(baseUrl: string, pathwayId: string, path: string): Promise<LessonRouteProbeResult> {
  const requestedUrl = joinBaseAndPath(baseUrl, path);
  const started = Date.now();
  let status = 0;
  let finalUrl = requestedUrl;
  let body = "";
  try {
    const res = await fetchWithTimeout(requestedUrl, {
      method: "GET",
      redirect: "follow",
      headers: { Accept: "text/html,*/*", "User-Agent": "NurseNest-ReliabilityProbe/1.0" },
    });
    status = res.status;
    finalUrl = res.url;
    body = await res.text();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      kind: "lesson",
      pathwayId,
      path,
      requestedUrl,
      finalUrl,
      status,
      durationMs: Date.now() - started,
      ok: false,
      issues: [`${pathwayId}:${path}: fetch_failed:${msg}`],
      title: null,
    };
  }

  const issues: string[] = [];
  if (!sameOrigin(finalUrl, baseUrl)) {
    issues.push(`${pathwayId}:${path}: final_url_cross_origin:${finalUrl}`);
  }
  if (status < 200 || status >= 400) {
    issues.push(`${pathwayId}:${path}: unexpected_status:${status}`);
  }
  issues.push(...analyzeProbeHtml(`${pathwayId}:${path}`, body));
  const title = extractHtmlTitle(body);
  if (!title) {
    issues.push(`${pathwayId}:${path}: missing_document_title`);
  }

  return {
    kind: "lesson",
    pathwayId,
    path,
    requestedUrl,
    finalUrl,
    status,
    durationMs: Date.now() - started,
    ok: issues.length === 0,
    issues,
    title: title ?? null,
  };
}

export async function runLessonRouteProbes(baseUrl: string): Promise<LessonRouteProbeReport> {
  const checkedAt = new Date().toISOString();
  const failures: string[] = [];
  const warnings: string[] = [];
  const paths = resolveVerifiedLessonProbePaths();

  if (paths.length === 0) {
    const note =
      "No verified marketing lesson URLs could be resolved from the bundled catalog (empty or blocked rows).";
    failures.push(note);
    return {
      checkedAt,
      baseUrl,
      targets: [],
      failures,
      warnings,
      ok: false,
      resolutionNote: note,
    };
  }

  const targets: LessonRouteProbeResult[] = [];
  for (const row of paths) {
    const t = await probeLessonUrl(baseUrl, row.pathwayId, row.path);
    targets.push(t);
    if (!t.ok) {
      for (const issue of t.issues) failures.push(issue);
    }
    if (t.durationMs > 12_000) {
      warnings.push(`${row.pathwayId}:${row.path}: slow_probe_ms:${t.durationMs}`);
    }
  }

  return {
    checkedAt,
    baseUrl,
    targets,
    failures,
    warnings,
    ok: failures.length === 0,
  };
}
