/**
 * Learner visual convergence contract — source-file assertions (2026-05 pass).
 * Verifies that the JSX + CSS changes for the visual convergence pass are in place.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC = path.resolve(__dirname, "../..");
const APP_ROOT = path.resolve(SRC, "..");

function read(relPath: string): string {
  return fs.readFileSync(path.join(APP_ROOT, relPath), "utf8");
}

// ── Practice-tests hub ─────────────────────────────────────────────────────

describe("practice-tests hub — visual convergence", () => {
  it("hero card uses border (not border-2)", () => {
    const src = read("src/components/student/practice-tests-hub-client.tsx");
    const heroBorder2 = (src.match(/nn-premium-practice-hub-hero[^>]{0,600}border-2/g) ?? []).length;
    assert.equal(heroBorder2, 0, "practice-tests hero must not use border-2 on the outer card");
  });

  it("hero card does not use ring-1 on outer card", () => {
    const src = read("src/components/student/practice-tests-hub-client.tsx");
    const heroRing = (src.match(/nn-premium-practice-hub-hero[^>]{0,600}ring-1/g) ?? []).length;
    assert.equal(heroRing, 0, "practice-tests hero outer card must not use ring-1");
  });

  it("CTA buttons inside hero do not use border-2", () => {
    const src = read("src/components/student/practice-tests-hub-client.tsx");
    const ctaBorder2 = (src.match(/nn-e2e-exam-first-cta[^>]{0,300}border-2/g) ?? []).length;
    assert.equal(ctaBorder2, 0, "exam-first CTA buttons must not use border-2");
  });

  it("sidebar is xl-only (not lg-only)", () => {
    const src = read("src/components/student/practice-tests-hub-client.tsx");
    assert.ok(src.includes("max-xl:hidden"), "sidebar must be hidden below xl");
    assert.ok(src.includes("xl:sticky"), "sidebar must be sticky from xl");
    assert.equal(src.includes("max-lg:hidden"), false, "old max-lg:hidden guard must be replaced with max-xl:hidden");
  });

  it("section spacing uses space-y-7 (not tight space-y-5)", () => {
    const src = read("src/components/student/practice-tests-hub-client.tsx");
    assert.ok(src.includes("space-y-7"), "practice-tests shell must use at least space-y-7");
    const oldTightSpacing = (src.match(/nn-practice-tests-hub-premium space-y-5/g) ?? []).length;
    assert.equal(oldTightSpacing, 0, "old space-y-5 tight spacing must be replaced");
  });
});

// ── Flashcards hub ─────────────────────────────────────────────────────────

describe("flashcards hub — visual convergence", () => {
  it("hub shell uses at least space-y-6 (not tight space-y-4)", () => {
    const src = read("src/components/flashcards/flashcards-hub-client.tsx");
    const oldTight = (src.match(/nn-flashcards-hub-premium space-y-4/g) ?? []).length;
    assert.equal(oldTight, 0, "flashcard hub must not use old space-y-4 override");
    assert.ok(src.includes("space-y-6") || src.includes("space-y-8"), "flashcard hub must use space-y-6 or larger");
  });

  it("hero card uses larger padding (px-5 py-5)", () => {
    const src = read("src/components/flashcards/flashcards-hub-client.tsx");
    assert.ok(src.includes("px-5 py-5"), "flashcard hero must use px-5 py-5 minimum");
  });

  it("start-session CTA does not have ring-1", () => {
    const src = read("src/components/flashcards/flashcards-hub-client.tsx");
    const ctaRing = (src.match(/nn-e2e-start-review[^>]{0,400}ring-1/g) ?? []).length;
    assert.equal(ctaRing, 0, "flashcard start-session CTA must not use ring-1");
  });

  it("deck library uses larger padding (p-5 sm:p-6)", () => {
    const src = read("src/components/flashcards/flashcards-hub-client.tsx");
    assert.ok(
      src.includes("nn-flashcards-deck-library-surface") && src.includes("p-5"),
      "flashcard deck library must use p-5 minimum",
    );
  });
});

// ── Question bank ──────────────────────────────────────────────────────────

describe("question bank — visual convergence", () => {
  it("session setup accordion uses rounded-2xl", () => {
    const src = read("src/components/student/question-bank-practice-client.tsx");
    assert.ok(
      src.includes("mb-6 overflow-hidden rounded-2xl border"),
      "question bank accordion must use rounded-2xl",
    );
    assert.equal(
      src.includes("nn-card mb-4 overflow-hidden rounded-xl"),
      false,
      "old nn-card rounded-xl pattern must be replaced",
    );
  });

  it("accordion summary uses larger padding (px-5 py-4)", () => {
    const src = read("src/components/student/question-bank-practice-client.tsx");
    assert.ok(src.includes("cursor-pointer px-5 py-4"), "accordion summary must use px-5 py-4");
  });

  it("accordion inner content uses space-y-7 and p-5", () => {
    const src = read("src/components/student/question-bank-practice-client.tsx");
    assert.ok(
      src.includes("space-y-7 border-t") || src.includes("space-y-8"),
      "accordion inner div must use space-y-7 or larger",
    );
    assert.ok(src.includes("p-5 sm:p-6"), "accordion inner content must use p-5 sm:p-6");
  });

  it("no legacy Shadcn tokens remain", () => {
    const src = read("src/components/student/question-bank-practice-client.tsx");
    assert.equal((src.match(/\bbg-muted\b/g) ?? []).length, 0, "no bg-muted");
    assert.equal((src.match(/text-muted-foreground/g) ?? []).length, 0, "no text-muted-foreground");
    assert.equal((src.match(/\bbg-card\b/g) ?? []).length, 0, "no bg-card");
    assert.equal((src.match(/\bborder-border\b/g) ?? []).length, 0, "no border-border");
  });
});

// ── Lessons hub ────────────────────────────────────────────────────────────

describe("lessons hub — visual convergence", () => {
  it("container uses space-y-8 sm:space-y-10 (not tight space-y-6)", () => {
    const src = read("src/app/(student)/app/(learner)/lessons/page.tsx");
    assert.ok(src.includes("space-y-8 sm:space-y-10"), "lessons hub must use space-y-8 sm:space-y-10");
    assert.equal(
      src.includes("space-y-6 sm:space-y-8"),
      false,
      "old tight lessons spacing must be replaced",
    );
  });

  it("list body wrapper has no redundant mt-4", () => {
    const src = read("src/app/(student)/app/(learner)/lessons/page.tsx");
    assert.equal(
      src.includes('className="mt-4" data-nn-premium-lessons-hub-body'),
      false,
      "redundant mt-4 on list body wrapper must be removed",
    );
  });
});

// ── LearnerStudyPageShell ──────────────────────────────────────────────────

describe("LearnerStudyPageShell — top breathing room", () => {
  it("adds pt-1 sm:pt-2 to the base shell className", () => {
    const src = read("src/components/learner-study-ui/learner-study-page-shell.tsx");
    assert.ok(src.includes("pt-1"), "shell must include pt-1");
    assert.ok(src.includes("sm:pt-2"), "shell must include sm:pt-2");
  });
});

// ── learner-global.css ─────────────────────────────────────────────────────

describe("learner-global.css — visual convergence additions", () => {
  it("defines .nn-learner-page-hero", () => {
    const css = read("src/app/styles/learner/learner-global.css");
    assert.ok(css.includes(".nn-learner-page-hero"), ".nn-learner-page-hero must be defined");
  });

  it("defines .nn-app-lessons-hub-premium for top breathing room", () => {
    const css = read("src/app/styles/learner/learner-global.css");
    assert.ok(css.includes(".nn-app-lessons-hub-premium"), ".nn-app-lessons-hub-premium must be defined");
  });

  it("defines tablet sidebar suppression for practice-tests hub", () => {
    const css = read("src/app/styles/learner/learner-global.css");
    assert.ok(
      css.includes("max-width: 1279px") || css.includes("max-width:1279px"),
      "CSS must include max-width: 1279px for tablet sidebar suppression",
    );
  });

  it("no raw hex colors added to the convergence block", () => {
    const css = read("src/app/styles/learner/learner-global.css");
    // Find the convergence block
    const convergenceStart = css.indexOf("Visual convergence — shared learner hub rhythm");
    assert.ok(convergenceStart > -1, "convergence block must be present");
    const convergenceBlock = css.slice(convergenceStart);
    // Should not contain raw hex colors (tokens only)
    const hexColors = convergenceBlock.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
    assert.equal(hexColors.length, 0, `convergence block must use CSS vars, not hex colors: ${hexColors.join(", ")}`);
  });
});

// ── Practice-tests hub legacy token check ──────────────────────────────────

describe("practice-tests hub — no legacy tokens", () => {
  it("no bg-muted, bg-card, border-border, or text-muted-foreground", () => {
    const src = read("src/components/student/practice-tests-hub-client.tsx");
    assert.equal((src.match(/\bbg-muted\b/g) ?? []).length, 0, "no bg-muted in practice-tests hub");
    assert.equal((src.match(/\bbg-card\b/g) ?? []).length, 0, "no bg-card in practice-tests hub");
    assert.equal((src.match(/\bborder-border\b/g) ?? []).length, 0, "no border-border in practice-tests hub");
    assert.equal((src.match(/text-muted-foreground/g) ?? []).length, 0, "no text-muted-foreground in practice-tests hub");
  });
});
