import assert from "node:assert/strict";
import test from "node:test";
import { CountryCode } from "@prisma/client";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BlogPostDistributionFooter } from "@/components/blog/blog-post-distribution-footer";

test("BlogPostDistributionFooter keeps primary study links on marketing-safe URLs", () => {
  const html = renderToStaticMarkup(
    <BlogPostDistributionFooter
      exam="NCLEX-RN"
      countryTarget={CountryCode.US}
      relatedLessonPaths={[
        "/us/rn/nclex-rn/lessons/fluid-balance-acute-care",
        "/app/lessons/private-should-drop",
      ]}
      relatedQuestionIds={["q-1"]}
      relatedTools={["lab-values"]}
    />,
  );

  assert.match(html, /href="\/us\/rn\/nclex-rn\/lessons\/fluid-balance-acute-care"/);
  assert.doesNotMatch(html, /private-should-drop/);
  assert.match(html, /href="\/us\/rn\/nclex-rn\/cat"/);
  assert.match(html, /href="\/tools\/lab-values"/);
});

test("BlogPostDistributionFooter gates app-only CTAs through login callback links", () => {
  const html = renderToStaticMarkup(
    <BlogPostDistributionFooter
      exam="REX-PN"
      countryTarget={CountryCode.CA}
      relatedLessonPaths={[]}
      relatedQuestionIds={["q-1"]}
      relatedTools={[]}
    />,
  );

  assert.match(html, /href="\/canada\/pn\/rex-pn\/questions"/);
  assert.match(html, /href="\/canada\/pn\/rex-pn\/cat"/);
  assert.match(html, /href="\/login\?callbackUrl=%2Fapp%2Fquestions"/);
  assert.match(html, /href="\/login\?callbackUrl=%2Fapp%2Fstudy-plan"/);
  assert.doesNotMatch(html, /href="\/app\//);
});
