import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const thisDir = path.dirname(fileURLToPath(import.meta.url));
/** `src/lib/linking/` → nursenest-core package root */
const repoRoot = path.resolve(thisDir, "..", "..", "..");

function read(rel: string): string {
  return fs.readFileSync(path.join(repoRoot, rel), "utf8");
}

describe("automatic internal links — lesson ↔ blog automation", () => {
  it("links module fetches tier-scoped blog candidates for pathway lessons", () => {
    const src = read("src/lib/linking/automatic-internal-links.ts");
    assert.match(src, /fetchRelatedBlogCandidatesForPathwayLesson/);
    assert.match(src, /pathwayIdForBlogPost\(\{ exam: r\.exam/);
    assert.match(src, /blogs: \[dbLessonBlogs, registry\.blogs\]/);
  });

  it("marketing lesson detail excludes footer blog hub from auto-related href set", () => {
    const src = read(
      "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx",
    );
    assert.match(src, /automaticRelatedExcludeHrefs/);
    assert.match(src, /excludeHrefs=\{automaticRelatedExcludeHrefs\}/);
  });

  it("AutomaticRelatedContentForPublic lesson surface can render blog section", () => {
    const src = read("src/components/linking/automatic-related-content-for-public.tsx");
    assert.match(src, /excludeHrefs\?: string\[\]/);
    assert.match(src, /"blog", "cat"/);
  });

  it("app lesson page surfaces related reading strip", () => {
    const src = read("src/app/(app)/app/(learner)/lessons/[id]/page.tsx");
    assert.match(src, /AppLessonRelatedReading/);
  });

  it("flashcard study session can link to topic bank drill when topicCode is present", () => {
    const src = read("src/components/flashcards/flashcard-custom-study-client.tsx");
    assert.match(src, /practiceTopicHref/);
    const study = read("src/components/study/active-study-session.tsx");
    assert.match(study, /practiceTopicHref/);
  });
});
