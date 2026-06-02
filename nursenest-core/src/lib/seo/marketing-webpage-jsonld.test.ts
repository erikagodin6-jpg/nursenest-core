import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";

test("buildMarketingWebPageJsonLdProps uses root-style path for default locale", () => {
  const props = buildMarketingWebPageJsonLdProps({
    locale: DEFAULT_MARKETING_LOCALE,
    enPath: "/practice-exams",
    title: "Practice",
    description: "Description",
  });
  assert.equal(props.path, "/practice-exams");
  assert.equal(props.inLanguage, DEFAULT_MARKETING_LOCALE);
});

test("buildMarketingWebPageJsonLdProps prefixes localized route paths", () => {
  const props = buildMarketingWebPageJsonLdProps({
    locale: "fr",
    enPath: "/practice-exams",
    title: "Practice",
    description: "Description",
  });
  assert.equal(props.path, "/fr/practice-exams");
  assert.equal(props.inLanguage, "fr");
});

test("buildMarketingWebPageJsonLdProps optional inLanguage overrides locale tag", () => {
  const props = buildMarketingWebPageJsonLdProps({
    locale: DEFAULT_MARKETING_LOCALE,
    enPath: "/",
    title: "Home",
    description: "Desc",
    inLanguage: "en-CA",
  });
  assert.equal(props.inLanguage, "en-CA");
});

type TargetRouteExpectation = {
  file: string;
  enPath: string;
  localeSnippet: string;
};

const TARGET_ROUTE_EXPECTATIONS: TargetRouteExpectation[] = [
  { file: "src/app/(marketing)/(default)/page.tsx", enPath: "/", localeSnippet: "locale: STATIC_LOCALE," },
  { file: "src/app/(marketing)/[locale]/page.tsx", enPath: "/", localeSnippet: "locale," },
  {
    file: "src/app/(marketing)/(default)/pricing/page.tsx",
    enPath: "/pricing",
    localeSnippet: "locale: DEFAULT_MARKETING_LOCALE,",
  },
  { file: "src/app/(marketing)/[locale]/pricing/page.tsx", enPath: "/pricing", localeSnippet: "locale," },
  { file: "src/app/(marketing)/(default)/lessons/page.tsx", enPath: "/lessons", localeSnippet: "locale," },
  { file: "src/app/(marketing)/[locale]/lessons/page.tsx", enPath: "/lessons", localeSnippet: "locale," },
  {
    file: "src/app/(marketing)/(default)/question-bank/page.tsx",
    enPath: "/question-bank",
    localeSnippet: "locale,",
  },
  { file: "src/app/(marketing)/[locale]/question-bank/page.tsx", enPath: "/question-bank", localeSnippet: "locale," },
  {
    file: "src/app/(marketing)/(default)/practice-exams/page.tsx",
    enPath: "/practice-exams",
    localeSnippet: "locale,",
  },
  { file: "src/app/(marketing)/[locale]/practice-exams/page.tsx", enPath: "/practice-exams", localeSnippet: "locale," },
];

for (const route of TARGET_ROUTE_EXPECTATIONS) {
  test(`route schema hardening: ${route.file}`, () => {
    const absolute = path.resolve(process.cwd(), route.file);
    const source = readFileSync(absolute, "utf8");

    const webPageNodeCount = (source.match(/<WebPageJsonLd/g) ?? []).length;
    assert.equal(webPageNodeCount, 1, "must render exactly one WebPageJsonLd node");

    assert.match(source, /buildMarketingWebPageJsonLdProps\(\{/, "must use shared JSON-LD helper");
    assert.match(source, new RegExp(`enPath:\\s*"${route.enPath.replace("/", "\\/")}"`), "must keep canonical path mapping");
    assert.match(source, new RegExp(route.localeSnippet.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

    assert.match(source, /\btitle\b\s*[:,]/, "WebPageJsonLd helper must receive a title");
    assert.match(source, /\bdescription\b\s*[:,]/, "WebPageJsonLd helper must receive a description");
  });
}
