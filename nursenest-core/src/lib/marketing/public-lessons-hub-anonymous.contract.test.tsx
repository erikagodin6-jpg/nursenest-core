import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LessonsPageShell } from "@/components/pathway-lessons/lessons-page-shell";
import { MarketingPublicLessonsHubAnonymousUpgradeStrip } from "@/components/pathway-lessons/marketing-public-lessons-hub-anonymous-upgrade-strip";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LESSONS_HUB_PAGE = path.resolve(
  __dirname,
  "../../app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx",
);

const BLOCKLIST = [
  "debug",
  "inventory",
  "source of truth",
  "audit",
  "internal",
  "CAT pool",
  "linked learning signal",
  "unpublished",
  "coming soon",
  "placeholder",
] as const;

function stripTagsForSmoke(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

describe("public lessons hub — anonymous marketing surfaces", () => {
  it("keeps blocklisted operational tokens out of hero + upgrade strip markup", () => {
    const html = renderToStaticMarkup(
      <LessonsPageShell
        title="NCLEX lessons"
        subtitle="Browse with confidence."
        pathwayTrack="rn"
        heroPrimaryCta={{
          label: "Create a free account",
          href: "/signup?callbackUrl=%2Fus%2Frn%2Fnclex-rn%2Flessons",
        }}
      >
        <section
          id="pathway-lesson-library"
          className="nn-qa-pathway-lessons-hub"
          data-nn-qa-pathway-lessons-hub="true"
          aria-labelledby="lesson-library-heading"
        >
          <h2 id="lesson-library-heading">
            Lesson library
          </h2>
        </section>
        <MarketingPublicLessonsHubAnonymousUpgradeStrip
          marketingUiLocale="en"
          signupCallbackPath="/us/rn/nclex-rn/lessons"
        />
      </LessonsPageShell>,
    );
    const visible = stripTagsForSmoke(html);
    for (const token of BLOCKLIST) {
      assert.equal(
        visible.includes(token),
        false,
        `unexpected public copy token "${token}"`,
      );
    }
    assert.equal((html.match(/data-nn-qa-public-hub-upgrade-strip/g) ?? []).length, 1);
    assert.equal((html.match(/id="nn-lessons-hub-title"/g) ?? []).length, 1);
    assert.equal((html.match(/data-nn-qa-pathway-lessons-hub/g) ?? []).length, 1);
  });

  it("keeps anonymous upgrade and sticky study chrome wired into the hub route", () => {
    const src = fs.readFileSync(LESSONS_HUB_PAGE, "utf8");
    assert.ok(src.includes("MarketingLessonsHubStickyStudyChrome"));
    assert.ok(src.includes("MarketingPublicLessonsHubAnonymousUpgradeStrip"));
    assert.ok(src.includes("heroPrimaryCta"));
  });

  it("hub route source avoids restored arch graphic markers", () => {
    const src = fs.readFileSync(LESSONS_HUB_PAGE, "utf8");
    assert.equal(src.includes("nn-arch"), false);
    assert.equal(src.toLowerCase().includes("archgraphic"), false);
  });
});
