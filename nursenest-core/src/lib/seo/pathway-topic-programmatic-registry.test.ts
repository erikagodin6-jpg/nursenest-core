import assert from "node:assert/strict";
import test from "node:test";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import {
  collectPathwayTopicProgrammaticPublicPaths,
  getPathwayTopicProgrammaticRow,
} from "@/lib/seo/pathway-topic-programmatic-registry";

function parseProgrammaticPath(path: string): { country: string; roleTrack: string; examCode: string; seoSlug: string } | null {
  const parts = path.split("/").filter(Boolean);
  if (parts.length !== 4) return null;
  const [country, roleTrack, examCode, seoSlug] = parts;
  if (!country || !roleTrack || !examCode || !seoSlug) return null;
  return { country, roleTrack, examCode, seoSlug };
}

test("every emitted pathway-topic programmatic path round-trips through route truth", async () => {
  const paths = collectPathwayTopicProgrammaticPublicPaths();
  assert.ok(paths.length > 0);

  for (const path of paths) {
    const parsed = parseProgrammaticPath(path);
    assert.ok(parsed, `expected 4 path segments for ${path}`);
    if (!parsed) continue;

    const pathway = await resolveExamPathwaySafe(parsed.country, parsed.roleTrack, parsed.examCode, { pathname: path });
    assert.ok(pathway, `expected pathway to resolve for ${path}`);
    if (!pathway) continue;

    const row = getPathwayTopicProgrammaticRow(pathway.id, parsed.seoSlug);
    assert.ok(row, `expected registry row for ${path}`);
    if (!row) continue;

    assert.equal(row.page.slug, parsed.seoSlug, `page slug drift for ${path}`);
    assert.equal(buildExamPathwayPath(pathway, parsed.seoSlug), path, `rebuilt path mismatch for ${path}`);
  }
});
