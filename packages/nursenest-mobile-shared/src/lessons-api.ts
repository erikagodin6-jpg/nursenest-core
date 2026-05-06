import type { MobileNativeApiClient, MobileNativePreparedRequest } from "./contracts.js";
import type {
  MobilePathwayLessonDetailResponse,
  MobilePathwayLessonsListResponse,
  MobilePathwayLessonTopicsResponse,
} from "./lesson-types.js";

export type PathwayLessonsListParams = {
  readonly pathwayId?: string | null;
  readonly topicSlug?: string | null;
  readonly topic?: string | null;
  readonly q?: string | null;
  readonly page?: number;
  readonly limit?: number;
};

export function buildPathwayLessonsListPath(params: PathwayLessonsListParams): string {
  const qs = new URLSearchParams();
  if (params.pathwayId?.trim()) qs.set("pathwayId", params.pathwayId.trim());
  if (params.topicSlug?.trim()) qs.set("topicSlug", params.topicSlug.trim().toLowerCase());
  if (params.topic?.trim()) qs.set("topic", params.topic.trim());
  if (params.q?.trim()) qs.set("q", params.q.trim());
  if (params.page != null && params.page > 1) qs.set("page", String(params.page));
  if (params.limit != null) qs.set("limit", String(params.limit));
  const s = qs.toString();
  return s ? `/api/learner/pathway-lessons?${s}` : "/api/learner/pathway-lessons";
}

export function buildPathwayLessonTopicsPath(pathwayId: string): string {
  const qs = new URLSearchParams({ pathwayId: pathwayId.trim() });
  return `/api/learner/pathway-lessons/topics?${qs.toString()}`;
}

export function buildPathwayLessonDetailPath(args: { readonly id?: string; readonly pathwayId?: string; readonly slug?: string }): string {
  const qs = new URLSearchParams();
  if (args.id?.trim()) qs.set("id", args.id.trim());
  if (args.pathwayId?.trim()) qs.set("pathwayId", args.pathwayId.trim());
  if (args.slug?.trim()) qs.set("slug", args.slug.trim());
  return `/api/learner/pathway-lesson?${qs.toString()}`;
}

export async function fetchPathwayLessonsPage(
  client: MobileNativeApiClient,
  params: PathwayLessonsListParams,
): Promise<MobilePathwayLessonsListResponse> {
  const req: MobileNativePreparedRequest = {
    operationId: "learner.pathway_lessons.list",
    method: "GET",
    path: buildPathwayLessonsListPath(params),
  };
  const res = await client.executeJson<MobilePathwayLessonsListResponse>(req);
  if (!res.ok) throw new Error(res.message);
  return res.data;
}

export async function fetchPathwayLessonTopics(
  client: MobileNativeApiClient,
  pathwayId: string,
): Promise<MobilePathwayLessonTopicsResponse> {
  const req: MobileNativePreparedRequest = {
    operationId: "learner.pathway_lessons.topics",
    method: "GET",
    path: buildPathwayLessonTopicsPath(pathwayId),
  };
  const res = await client.executeJson<MobilePathwayLessonTopicsResponse>(req);
  if (!res.ok) throw new Error(res.message);
  return res.data;
}

export async function fetchPathwayLessonDetail(
  client: MobileNativeApiClient,
  args: { readonly id?: string; readonly pathwayId?: string; readonly slug?: string },
): Promise<MobilePathwayLessonDetailResponse> {
  const req: MobileNativePreparedRequest = {
    operationId: "learner.pathway_lesson.detail",
    method: "GET",
    path: buildPathwayLessonDetailPath(args),
  };
  const res = await client.executeJson<MobilePathwayLessonDetailResponse>(req);
  if (!res.ok) throw new Error(res.message);
  return res.data;
}

/** React Query cache keys — keep stable; persist layer may filter to hub/detail only (no full catalog). */
export type PathwayLessonProgressPostBody = {
  readonly pathwayId: string;
  readonly lessonSlug: string;
  readonly action?: "open" | "engage" | "complete" | "uncomplete";
  readonly completed?: boolean;
};

export async function postPathwayLessonProgress(
  client: MobileNativeApiClient,
  body: PathwayLessonProgressPostBody,
): Promise<unknown> {
  const req: MobileNativePreparedRequest = {
    operationId: "lessons.pathway_progress",
    method: "POST",
    path: "/api/lessons/pathway-progress",
    bodyJson: body,
  };
  const res = await client.executeJson<unknown>(req);
  if (!res.ok) throw new Error(res.message);
  return res.data;
}

export const lessonQueryKeys = {
  all: ["lessons"] as const,
  list: (params: PathwayLessonsListParams) => [...lessonQueryKeys.all, "list", params] as const,
  topics: (pathwayId: string) => [...lessonQueryKeys.all, "topics", pathwayId] as const,
  detail: (args: { id?: string; pathwayId?: string; slug?: string }) => [...lessonQueryKeys.all, "detail", args] as const,
};
