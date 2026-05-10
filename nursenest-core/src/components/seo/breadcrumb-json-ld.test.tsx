import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";

function extractJsonLd(html: string): unknown {
  const match = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/);
  assert.ok(match?.[1], "expected BreadcrumbJsonLd script");
  return JSON.parse(match[1]);
}

test("BreadcrumbJsonLd emits valid BreadcrumbList schema for public crumbs", () => {
  const html = renderToStaticMarkup(
    <BreadcrumbJsonLd
      items={[
        { name: "Home", item: "https://www.nursenest.ca/" },
        { name: "Lessons", item: "https://www.nursenest.ca/lessons" },
      ]}
    />,
  );
  const data = extractJsonLd(html) as {
    "@type": string;
    itemListElement: Array<{ "@type": string; position: number; name: string; item: string }>;
  };

  assert.equal(data["@type"], "BreadcrumbList");
  assert.equal(data.itemListElement.length, 2);
  assert.deepEqual(
    data.itemListElement.map((item) => item.position),
    [1, 2],
  );
  assert.equal(data.itemListElement[1]?.item, "https://www.nursenest.ca/lessons");
});

test("BreadcrumbJsonLd filters private /app, /admin, /api, /seo, query, and hash URLs", () => {
  const html = renderToStaticMarkup(
    <BreadcrumbJsonLd
      items={[
        { name: "Home", item: "https://www.nursenest.ca/" },
        { name: "App", item: "https://www.nursenest.ca/app" },
        { name: "Admin", item: "https://www.nursenest.ca/admin" },
        { name: "API", item: "https://www.nursenest.ca/api/status" },
        { name: "SEO rewrite", item: "https://www.nursenest.ca/seo/example" },
        { name: "Query", item: "https://www.nursenest.ca/lessons?page=2" },
        { name: "Hash", item: "https://www.nursenest.ca/lessons#top" },
      ]}
    />,
  );
  const data = extractJsonLd(html) as {
    itemListElement: Array<{ name: string; item: string }>;
  };

  assert.deepEqual(
    data.itemListElement.map((item) => item.name),
    ["Home"],
  );
  assert.ok(data.itemListElement.every((item) => !/\/(?:app|admin|api|seo)(?:\/|$)|[?#]/.test(item.item)));
});
