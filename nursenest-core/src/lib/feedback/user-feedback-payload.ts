import { z } from "zod";
import type { Prisma } from "@prisma/client";
import {
  UserFeedbackCategory,
  UserFeedbackSeverity,
} from "@prisma/client";

const categoryValues = [
  "BUG",
  "BROKEN_CONTENT",
  "CONFUSING_QUESTION",
  "LESSON_ISSUE",
  "BILLING_SUBSCRIPTION",
  "PERFORMANCE",
  "FEATURE_REQUEST",
  "GENERAL",
] as const satisfies readonly UserFeedbackCategory[];

const severityValues = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const satisfies readonly UserFeedbackSeverity[];

export const userFeedbackSubmitSchema = z.object({
  category: z.enum(categoryValues),
  severity: z.enum(severityValues).optional(),
  summary: z.string().trim().min(10, "Please add a bit more detail (at least 10 characters).").max(500),
  details: z.string().trim().max(8000).optional().nullable(),
  pageUrl: z.string().trim().min(1).max(2048),
  routeKey: z.string().trim().max(512).optional().nullable(),
  pathwayId: z.string().trim().max(64).optional().nullable(),
  examContext: z.record(z.string(), z.unknown()).optional().nullable(),
  userAgent: z.string().max(512).optional().nullable(),
  deviceHint: z.string().max(120).optional().nullable(),
  /** Data URL (image/png or image/jpeg), server-capped length. */
  screenshotDataUrl: z.string().max(400_000).optional().nullable(),
  clientMeta: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type UserFeedbackSubmitInput = z.infer<typeof userFeedbackSubmitSchema>;

const MAX_SCREENSHOT_CHARS = 350_000;

export function normalizeFeedbackPayload(
  raw: unknown,
): { ok: true; data: UserFeedbackSubmitInput } | { ok: false; error: string } {
  const parsed = userFeedbackSubmitSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors[0] ?? parsed.error.message;
    return { ok: false, error: msg };
  }
  const d = parsed.data;
  if (d.screenshotDataUrl) {
    if (d.screenshotDataUrl.length > MAX_SCREENSHOT_CHARS) {
      return { ok: false, error: "Screenshot is too large. Try a smaller image or skip the attachment." };
    }
    if (!d.screenshotDataUrl.startsWith("data:image/png;base64,") && !d.screenshotDataUrl.startsWith("data:image/jpeg;base64,")) {
      return { ok: false, error: "Screenshots must be PNG or JPEG." };
    }
  }
  return { ok: true, data: d };
}

export function defaultSeverityForCategory(category: UserFeedbackCategory): UserFeedbackSeverity {
  switch (category) {
    case "BUG":
    case "BROKEN_CONTENT":
    case "BILLING_SUBSCRIPTION":
    case "PERFORMANCE":
      return "MEDIUM";
    case "CONFUSING_QUESTION":
    case "LESSON_ISSUE":
      return "MEDIUM";
    case "FEATURE_REQUEST":
    case "GENERAL":
      return "LOW";
    default:
      return "MEDIUM";
  }
}

export function toPrismaCreateArgs(
  input: UserFeedbackSubmitInput,
  userId: string | null,
): Prisma.UserFeedbackReportCreateArgs["data"] {
  const severity = input.severity ?? defaultSeverityForCategory(input.category);
  return {
    category: input.category,
    severity,
    summary: input.summary,
    details: input.details?.length ? input.details : null,
    pageUrl: input.pageUrl,
    routeKey: input.routeKey?.length ? input.routeKey : null,
    userId: userId ?? undefined,
    pathwayId: input.pathwayId?.length ? input.pathwayId : null,
    examContextJson: input.examContext && Object.keys(input.examContext).length ? (input.examContext as Prisma.InputJsonValue) : undefined,
    userAgent: input.userAgent?.length ? input.userAgent.slice(0, 512) : null,
    deviceHint: input.deviceHint?.length ? input.deviceHint.slice(0, 120) : null,
    screenshotDataUrl: input.screenshotDataUrl?.length ? input.screenshotDataUrl : null,
    clientMetaJson: input.clientMeta && Object.keys(input.clientMeta).length ? (input.clientMeta as Prisma.InputJsonValue) : undefined,
  };
}
