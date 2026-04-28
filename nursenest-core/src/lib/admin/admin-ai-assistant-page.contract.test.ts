import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");

function read(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

describe("admin ai assistant page contract", () => {
  it("keeps the admin page behind requireAdmin and renders the assistant client", () => {
    const src = read("app/(admin)/admin/ai-assistant/page.tsx");
    assert.match(src, /await requireAdmin\(\)/);
    assert.match(src, /AdminAiAssistantClient/);
  });
});
