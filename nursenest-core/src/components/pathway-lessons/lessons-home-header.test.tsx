import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { LessonsHomeHeader } from "./lessons-home-header";
import { PathwayLessonsHubSearch } from "./pathway-lessons-hub-search";

describe("LessonsHomeHeader", () => {
  it("keeps the default lessons hub header minimal", () => {
    const html = renderToStaticMarkup(
      <LessonsHomeHeader
        eyebrow="NCLEX-RN"
        title="NCLEX-RN lessons"
        description="Browse lessons grouped by clinical area."
        searchBasePath="/canada/rn/nclex-rn/lessons"
        countryOptions={[
          { label: "Canada", href: "/canada/rn/nclex-rn/lessons", active: true },
          { label: "US", href: "/us/rn/nclex-rn/lessons" },
        ]}
        stats={[{ label: "123 total lessons" }]}
      />,
    );

    assert.match(html, /NCLEX-RN lessons/);
    assert.match(html, /Canada/);
    assert.match(html, /US/);
    assert.match(html, /Search/);
    assert.doesNotMatch(html, /123 total lessons/);
    assert.doesNotMatch(html, /Match the lesson catalog to your exam context/);
  });

  it("can opt into stats when explicitly requested", () => {
    const html = renderToStaticMarkup(
      <LessonsHomeHeader
        eyebrow="NCLEX-RN"
        title="NCLEX-RN lessons"
        description="Browse lessons grouped by clinical area."
        searchBasePath="/canada/rn/nclex-rn/lessons"
        stats={[{ label: "123 total lessons" }]}
        showStats
      />,
    );

    assert.match(html, /123 total lessons/);
  });
});

describe("PathwayLessonsHubSearch", () => {
  it("renders the default search shell without helper copy", () => {
    const html = renderToStaticMarkup(
      <PathwayLessonsHubSearch basePath="/canada/rn/nclex-rn/lessons" initialQuery="cardiac" />,
    );

    assert.match(html, /Search/);
    assert.match(html, /Clear/);
    assert.doesNotMatch(html, /Searches title, topic, and URL slug across this pathway/);
  });

  it("can opt into helper copy when needed", () => {
    const html = renderToStaticMarkup(
      <PathwayLessonsHubSearch
        basePath="/canada/rn/nclex-rn/lessons"
        initialQuery="cardiac"
        showHelperCopy
      />,
    );

    assert.match(html, /Searches title, topic, and URL slug across this pathway/);
  });
});
