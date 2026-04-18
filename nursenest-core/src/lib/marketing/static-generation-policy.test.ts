import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..", "..");

function readAppFile(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

describe("marketing static generation policy", () => {
  it("keeps default blog and exams route families dynamic at the layout level", () => {
    const blogLayout = readAppFile("app/(marketing)/(default)/blog/layout.tsx");
    const examsLayout = readAppFile("app/(marketing)/(default)/exams/layout.tsx");

    assert.match(blogLayout, /export const dynamic = "force-dynamic"/);
    assert.match(examsLayout, /export const dynamic = "force-dynamic"/);
  });

  it("keeps the default tools hub dynamic", () => {
    const toolsPage = readAppFile("app/(marketing)/(default)/tools/page.tsx");
    assert.match(toolsPage, /export const dynamic = "force-dynamic"/);
  });

  it("does not use deprecated next eslint build config", () => {
    const nextConfig = readFileSync(join(appRoot, "..", "next.config.ts"), "utf8");
    assert.doesNotMatch(nextConfig, /eslint:\s*\{/);
  });
});
