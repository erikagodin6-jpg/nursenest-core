import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = join(process.cwd());

test("flashcard layout refinement pass is wired", () => {
  const layout = readFileSync(
    join(root, "src/app/(app)/app/(learner)/flashcards/layout.tsx"),
    "utf8",
  );
  assert.match(layout, /learner-flashcard-layout-refinement-pass\.css/);

  const css = readFileSync(
    join(root, "src/app/learner-flashcard-layout-refinement-pass.css"),
    "utf8",
  );
  assert.match(css, /data-nn-flashcard-layout-refinement/);
  assert.match(css, /data-nn-flashcard-premium-visual-refinement/);
  assert.match(css, /grid-template-columns: minmax\(0, 1\.42fr\) minmax\(28rem, 1fr\)/);
  assert.match(css, /--nn-flashcard-refinement-card: var\(--semantic-surface\)/);
  assert.match(css, /\[data-nn-clinical-pearl\]/);
  assert.match(css, /overflow-y: visible !important/);

  const session = readFileSync(
    join(root, "src/components/study/active-study-session.tsx"),
    "utf8",
  );
  assert.match(session, /data-nn-flashcard-layout-refinement/);
  assert.match(session, /data-nn-flashcard-premium-visual-refinement/);
  assert.match(session, /header\.hubLabel/);
});
