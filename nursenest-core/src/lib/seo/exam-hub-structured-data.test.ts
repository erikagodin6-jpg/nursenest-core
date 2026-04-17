import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

test("public exam hub overview emits page-level WebPageJsonLd without FAQPage markup", () => {
  const source = readFileSync(
    path.resolve(process.cwd(), "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx"),
    "utf8",
  );

  assert.match(source, /<WebPageJsonLd/);
  assert.doesNotMatch(source, /<FaqJsonLd/);
});
