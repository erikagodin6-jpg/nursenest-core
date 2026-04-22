import assert from "node:assert/strict";
import * as React from "react";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { PathwayLessonDetailHeader } from "@/components/lessons/pathway-lesson-detail-header";

const pathway = {
  id: "ca-rn-juris",
  countrySlug: "canada",
  roleTrack: "rn",
  examCode: "juris",
  countryCode: "CA",
  examFamily: "NCLEX_RN" as never,
  stripeTier: "RN" as never,
  displayName: "RN Jurisprudence",
  shortName: "RN",
  status: "live",
} as ExamPathwayDefinition;

test("PathwayLessonDetailHeader: no lg flex split when trailing is absent", () => {
  const html = renderToStaticMarkup(
    <PathwayLessonDetailHeader
      pathway={pathway}
      lessonsBasePath="/canada/rn/juris/lessons"
      lessonTitle="Sample lesson"
      lessonTopic="Cardiovascular"
      bodySystem="Cardiovascular"
    />,
  );
  assert.equal(html.includes("lg:flex"), false);
});

test("PathwayLessonDetailHeader: lg flex split when trailing is present", () => {
  const html = renderToStaticMarkup(
    <PathwayLessonDetailHeader
      pathway={pathway}
      lessonsBasePath="/canada/rn/juris/lessons"
      lessonTitle="Sample lesson"
      lessonTopic="Cardiovascular"
      bodySystem="Cardiovascular"
      trailing={<span data-testid="trail">badge</span>}
    />,
  );
  assert.equal(html.includes("lg:flex"), true);
});
