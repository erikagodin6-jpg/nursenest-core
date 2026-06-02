import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ExamFamily } from "@prisma/client";
import { usesPremiumLessonReadingV2Layout } from "@/lib/lessons/premium-lesson-reading-v2";

describe("usesPremiumLessonReadingV2Layout", () => {
  it("enables for RN, RPN, and NP pathways", () => {
    assert.equal(
      usesPremiumLessonReadingV2Layout({
        pathwayId: "us-rn-nclex-rn",
        examFamily: ExamFamily.NCLEX_RN,
        roleTrack: "rn",
      }),
      true,
    );
    assert.equal(
      usesPremiumLessonReadingV2Layout({
        pathwayId: "ca-rpn-rex-pn",
        examFamily: ExamFamily.REX_PN,
        roleTrack: "rpn",
      }),
      true,
    );
    assert.equal(
      usesPremiumLessonReadingV2Layout({
        pathwayId: "ca-np-cnple",
        examFamily: ExamFamily.NP,
        roleTrack: "np",
      }),
      true,
    );
    assert.equal(
      usesPremiumLessonReadingV2Layout({
        pathwayId: "us-np-fnp",
        examFamily: ExamFamily.NP,
        roleTrack: "np",
      }),
      true,
    );
  });

  it("does not enable for unrelated tracks like US LPN", () => {
    assert.equal(
      usesPremiumLessonReadingV2Layout({
        pathwayId: "us-lpn-nclex-pn",
        examFamily: ExamFamily.NCLEX_PN,
        roleTrack: "lpn",
      }),
      false,
    );
  });
});
