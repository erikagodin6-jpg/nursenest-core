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
  assert.match(css, /grid-template-columns: minmax\(0, 1\.45fr\) minmax\(28rem, 1fr\)/);
  assert.match(css, /Question \/ rationale balance: rationale is a primary learning surface/);
  assert.match(css, /--nn-flashcard-refinement-card: var\(--semantic-surface\)/);
  assert.match(css, /Flashcard viewport fit \+ metric alignment recovery/);
  assert.match(css, /Text baseline alignment recovery/);
  assert.match(css, /\.nn-flashcard-learning-topbar__meta > div[\s\S]*?align-items: baseline !important/);
  assert.match(css, /\.nn-flashcard-topbar-progress[\s\S]*?align-items: baseline !important/);
  assert.match(css, /\.nn-flashcard-topbar-progress-track[\s\S]*?position: absolute !important/);
  assert.match(css, /\.nn-flashcard-card-action-row,[\s\S]*?\.nn-flashcard-answer-status[\s\S]*?align-items: center !important/);
  assert.match(css, /\.nn-flashcard-hero-surface,[\s\S]*?\.nn-flashcard-rationale-panel[\s\S]*?background: var\(--semantic-surface\) !important/);
  assert.match(css, /Static rationale reading window/);
  assert.match(css, /\.nn-flashcard-rationale-panel__body[\s\S]*?overflow-y: auto !important/);
  assert.match(css, /\[data-nn-clinical-pearl\]/);

  const blossomLayoutStart = css.indexOf(
    'html[data-theme="blossom"]:where(:has([data-nn-flashcard-layout-refinement])',
  );
  const blossomLayoutEnd = css.indexOf('html[data-theme="ocean"]:where(:has([data-nn-flashcard-layout-refinement])');
  assert.ok(blossomLayoutStart >= 0 && blossomLayoutEnd > blossomLayoutStart, "Blossom flashcard layout theme block must exist");
  const blossomLayoutBlock = css.slice(blossomLayoutStart, blossomLayoutEnd);
  assert.match(blossomLayoutBlock, /var\(--semantic-brand\) 16%/, "Blossom gradient must start with pink brand tint");
  assert.match(blossomLayoutBlock, /var\(--semantic-info\) 7%/, "Blossom gradient must fade through a cool blue tint");
  assert.doesNotMatch(
    blossomLayoutBlock,
    /accent-peach|panel-warm|warning-soft/,
    "Blossom flashcard layout background must not use apricot/peach tokens",
  );

  const blossomPremiumStart = css.indexOf(
    'html[data-theme="blossom"]:where(:has([data-nn-flashcard-premium-visual-refinement])),',
  );
  const blossomPremiumEnd = css.indexOf('html[data-theme="forest"]:where(:has([data-nn-flashcard-premium-visual-refinement]))');
  assert.ok(blossomPremiumStart >= 0 && blossomPremiumEnd > blossomPremiumStart, "Blossom premium visual theme block must exist");
  const blossomPremiumBlock = css.slice(blossomPremiumStart, blossomPremiumEnd);
  assert.match(blossomPremiumBlock, /var\(--semantic-brand\) 16%/);
  assert.match(blossomPremiumBlock, /var\(--semantic-info\) 7%/);
  assert.doesNotMatch(blossomPremiumBlock, /accent-peach|panel-warm|warning-soft/);

  const session = readFileSync(
    join(root, "src/components/study/active-study-session.tsx"),
    "utf8",
  );
  assert.match(session, /data-nn-flashcard-layout-refinement/);
  assert.match(session, /data-nn-flashcard-premium-visual-refinement/);
  assert.match(session, /header\.hubLabel/);
});
