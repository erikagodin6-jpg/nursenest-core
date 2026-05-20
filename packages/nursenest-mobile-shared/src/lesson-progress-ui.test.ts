import { describe, expect, it } from "vitest";
import type { MobilePathwayLessonListRow } from "./lesson-types.js";
import { lessonListProgressPillText, pathwayLessonProgressKey } from "./lesson-progress-ui.js";

const baseRow = (slug: string): MobilePathwayLessonListRow => ({
  id: "x",
  title: "T",
  summary: null,
  topic: null,
  bodySystem: null,
  pathwayMeta: { pathwayId: "us-rn-nclex-rn", slug },
});

describe("lesson-progress-ui", () => {
  it("builds stable progress keys", () => {
    expect(pathwayLessonProgressKey(baseRow("fluid-balance"))).toBe("us-rn-nclex-rn:fluid-balance");
  });

  it("maps progress to pill labels", () => {
    const map = { "us-rn-nclex-rn:a": "completed", "us-rn-nclex-rn:b": "in_progress" } as const;
    expect(lessonListProgressPillText(baseRow("a"), map)).toBe("Done");
    expect(lessonListProgressPillText(baseRow("b"), map)).toBe("In progress");
    expect(lessonListProgressPillText(baseRow("c"), map)).toBe(null);
    expect(lessonListProgressPillText(baseRow("d"), { "us-rn-nclex-rn:d": "not_started" })).toBe(null);
  });
});
