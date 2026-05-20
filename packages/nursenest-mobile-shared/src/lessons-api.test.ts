import { describe, expect, it } from "vitest";
import { buildPathwayLessonDetailPath, lessonQueryKeys, MobileLessonDetailFetchError } from "./lessons-api.js";

describe("buildPathwayLessonDetailPath", () => {
  it("serializes id-only lookup", () => {
    expect(buildPathwayLessonDetailPath({ id: "clxyz123" })).toBe("/api/learner/pathway-lesson?id=clxyz123");
  });

  it("serializes pathwayId and slug", () => {
    const p = buildPathwayLessonDetailPath({ pathwayId: "us-rn-nclex-rn", slug: "airway-basics" });
    expect(p.startsWith("/api/learner/pathway-lesson?")).toBe(true);
    expect(p).toContain("pathwayId=us-rn-nclex-rn");
    expect(p).toContain("slug=airway-basics");
  });

  it("prefers explicit id when all args provided", () => {
    const p = buildPathwayLessonDetailPath({ id: "only-id", pathwayId: "p", slug: "s" });
    expect(p).toContain("id=only-id");
    expect(p).toContain("pathwayId=p");
    expect(p).toContain("slug=s");
  });
});

describe("lessonQueryKeys.detail", () => {
  it("keeps stable tuple shape for react-query", () => {
    expect(lessonQueryKeys.detail({ id: "a" })).toEqual(["lessons", "detail", { id: "a" }]);
    expect(lessonQueryKeys.detail({ pathwayId: "p", slug: "s" })).toEqual(["lessons", "detail", { pathwayId: "p", slug: "s" }]);
  });
});

describe("MobileLessonDetailFetchError", () => {
  it("preserves status and JSON body for paywall helpers", () => {
    const err = new MobileLessonDetailFetchError("Subscription required", {
      status: 403,
      errorBody: { code: "not_subscribed" },
    });
    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(403);
    expect((err.errorBody as { code: string }).code).toBe("not_subscribed");
  });
});

/** Runtime guard for JSON.parse bodies — mobile detail screen relies on these keys. */
function isMobilePathwayLessonDetailPayload(x: unknown): boolean {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.pathwayId !== "string" || typeof o.lessonId !== "string") return false;
  if (typeof o.progressStatus !== "string") return false;
  const ent = o.entitlement;
  if (!ent || typeof ent !== "object") return false;
  const e = ent as Record<string, unknown>;
  if (typeof e.hasAccess !== "boolean" || typeof e.canShowLessonProgress !== "boolean") return false;
  const rec = o.record;
  if (!rec || typeof rec !== "object") return false;
  const r = rec as Record<string, unknown>;
  if (typeof r.slug !== "string" || typeof r.title !== "string") return false;
  if (!Array.isArray(r.sections)) return false;
  if (!Array.isArray(o.related)) return false;
  return true;
}

describe("pathway lesson detail JSON shape guard", () => {
  it("accepts minimal successful API-shaped payload", () => {
    const body = {
      pathwayId: "us-rn-nclex-rn",
      lessonId: "cllessonfake01",
      record: {
        slug: "airway-basics",
        title: "Airway basics",
        topic: "Airway",
        topicSlug: "airway",
        bodySystem: "Respiratory",
        sections: [{ id: "s1", heading: "Overview", kind: "body", body: "Hello" }],
      },
      progressStatus: "not_started",
      related: [],
      entitlement: { hasAccess: true, canShowLessonProgress: true },
    };
    expect(isMobilePathwayLessonDetailPayload(body)).toBe(true);
  });

  it("rejects truncated or wrong-type payloads", () => {
    expect(isMobilePathwayLessonDetailPayload(null)).toBe(false);
    expect(isMobilePathwayLessonDetailPayload({ pathwayId: "p" })).toBe(false);
    expect(isMobilePathwayLessonDetailPayload({ pathwayId: "p", lessonId: "l", record: { slug: "s" }, progressStatus: "x", related: [], entitlement: {} })).toBe(
      false,
    );
  });
});
