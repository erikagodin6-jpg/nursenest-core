import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const modPath = join(__dirname, "revalidate-pathway-lesson-surfaces.ts");

describe("revalidateSurfacesAfterPathwayLessonMutation", () => {
  it("always invalidates pathway lesson data cache tags (not gated on catalog resolution)", () => {
    const src = readFileSync(modPath, "utf8");
    assert.ok(src.includes("revalidateTag(hubTag)"));
    assert.ok(src.includes("revalidateTag(lessonTag)"));
    assert.ok(src.includes("`pathway-lesson:${pathwayId}:${slugTrim}`"));
    assert.ok(src.includes("marketingPathwayLessonDetailPath"));
    assert.ok(src.includes("revalidatePath(pathname, \"layout\")"));
  });
});
