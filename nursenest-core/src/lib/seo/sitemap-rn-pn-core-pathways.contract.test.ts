/**
 * RN / PN marketing hubs must stay in the exam-pathway sitemap slice (G-009 SAFE_FOR_AI guard).
 */
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

test("collectExamPathwayUrls includes US RN, CA RN, US NCLEX-PN, and CA REx-PN marketing roots", async () => {
  const origin = "https://www.example.test";
  const script = `
    (async () => {
      const { collectExamPathwayUrls } = await import("./src/lib/seo/sitemap-static-xml.ts");
      const urls = await collectExamPathwayUrls(${JSON.stringify(origin)});
      process.stdout.write(JSON.stringify(urls));
    })().catch((error) => {
      console.error(error);
      process.exit(1);
    });
  `;
  const urls = JSON.parse(
    execFileSync(process.execPath, ["--import", "tsx", "--eval", script], {
      cwd: process.cwd(),
      encoding: "utf8",
    }),
  ) as string[];
  const set = new Set(urls.map((url) => url.trim()));
  assert.ok(set.has(`${origin}/us/rn/nclex-rn`), "expected US RN hub");
  assert.ok(set.has(`${origin}/canada/rn/nclex-rn`), "expected CA RN hub");
  assert.ok(set.has(`${origin}/us/pn/nclex-pn`), "expected US PN / NCLEX-PN hub");
  assert.ok(set.has(`${origin}/canada/pn/rex-pn`), "expected CA REx-PN hub");
});
