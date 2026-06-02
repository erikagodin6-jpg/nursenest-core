import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const thisDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(thisDir, "..", "..", "..");

function read(rel: string): string {
  return fs.readFileSync(path.join(repoRoot, rel), "utf8");
}

describe("link-target-registry — canonical marketing paths", () => {
  it("uses canonical Canada PN and US NP question/lesson hubs (not legacy aliases)", () => {
    const src = read("src/lib/linking/link-target-registry.ts");
    assert.match(src, /caRpn:\s*"\/canada\/pn\/rex-pn\/questions"/);
    assert.match(src, /usNp:\s*"\/us\/np\/fnp\/questions"/);
    assert.match(src, /caRpn:\s*"\/canada\/pn\/rex-pn\/lessons"/);
    assert.doesNotMatch(src, /\/canada\/rpn\/rex-pn\/questions/);
    assert.doesNotMatch(src, /\/us\/np\/nclex-rn\/questions/);
  });

  it("lessons hub renders pathway-scoped FAQ JSON-LD", () => {
    const src = read("src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx");
    assert.match(src, /pathwayLessonsHubFaqSchema/);
    assert.match(src, /<FaqJsonLd items=\{pathwayLessonsHubFaqSchema\(pathway\)\} \/>/);
  });
});
