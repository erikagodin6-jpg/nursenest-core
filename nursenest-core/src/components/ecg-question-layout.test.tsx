/**
 * ECGQuestionLayout — unit tests
 *
 * Run via: node --import tsx --test src/components/ecg-question-layout.test.tsx
 *
 * Uses renderToStaticMarkup (no jsdom needed) to assert HTML structure.
 * defaultSelectedAnswer + defaultSubmitted props let us render the post-submit
 * state without requiring user interaction.
 *
 * Dispatcher smoke tests (tests 8–9):
 *   ImageBasedRenderer itself is a pure pass-through with no hooks, so it can be
 *   imported and rendered (ECG branch) from this context safely.
 *   The NonECGImageRenderer branch uses useI18n (client-only hook) + a separate
 *   copy of React from root/node_modules, which triggers a dual-React crash when
 *   rendered via renderToStaticMarkup here.  Non-ECG rendering is therefore
 *   covered by the Playwright CAT/practice smoke tests, not this file.
 */
import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ECGQuestionLayout } from "@/components/ecg-question-layout";
// ImageBasedRenderer is imported for the dispatcher smoke tests (tests 8–9).
// It lives in client/src and is accessed via the @legacy-client alias.
import { ImageBasedRenderer } from "@legacy-client/components/advanced-question-renderers";

// ─── Shared fixture ───────────────────────────────────────────────────────────

const ecgQuestion = {
  id: "ecg-test-001",
  stem: "Based on the following ECG findings, which rhythm is most likely present?",
  imageDescription:
    "Rhythm strip showing narrow complex tachycardia at 180 bpm with regular RR intervals and absent P waves preceding QRS complexes.",
  imageType: "ecg" as const,
  clinicalFindings: [
    "Narrow QRS complexes (0.08 s)",
    "Rate approximately 180 bpm",
    "No visible P waves",
    "Regular rhythm",
  ],
  options: [
    "Sinus tachycardia",
    "Supraventricular tachycardia (SVT)",
    "Atrial flutter with 2:1 block",
    "Ventricular tachycardia",
  ],
  correctAnswer: 1,
  rationale:
    "SVT presents with narrow complex tachycardia at 150–250 bpm with absent or retrograde P waves. The regular rate and narrow QRS distinguish it from VT.",
  bodySystem: "Cardiology",
  tier: "rn",
  difficulty: 2 as const,
  rhythmRate: "180 bpm",
  rhythmRegularity: "Regular",
  pWaves: "Absent",
  prInterval: "Not measurable",
  qrsWidth: "0.08 s (narrow)",
  clinicalSignificance: "Hemodynamically stable SVT",
  nursingAction: "Apply vagal maneuvers; prepare adenosine 6 mg IV per protocol",
  vitals: { BP: "104/68 mmHg", HR: "180 bpm", SpO2: "97%" },
  labs: { "K+": "4.1 mEq/L", "Troponin": "Negative" },
  medications: ["Metoprolol 25 mg PO daily"],
};

// ─── Test 1: Renders without crashing ────────────────────────────────────────

test("ECG layout renders without crashing and shows question stem", () => {
  const html = renderToStaticMarkup(
    React.createElement(ECGQuestionLayout, {
      question: ecgQuestion,
      isLearningMode: true,
    }),
  );

  assert.match(html, /which rhythm is most likely present/i, "stem text is rendered");
  assert.match(
    html,
    new RegExp(`data-testid="ecg-question-${ecgQuestion.id}"`),
    "root testid present",
  );
  assert.match(html, /data-testid="section-ecg-strip"/, "ECG strip panel rendered");
  assert.match(html, /Supraventricular tachycardia/, "answer options rendered");
});

// ─── Test 2: Locked ECG respects entitlement ─────────────────────────────────

test("locked ECG shows paywall gate and hides question content", () => {
  const html = renderToStaticMarkup(
    React.createElement(ECGQuestionLayout, {
      question: ecgQuestion,
      locked: true,
    }),
  );

  assert.match(html, /data-testid="section-ecg-paywall"/, "paywall gate rendered");
  assert.match(html, /RN.*NP Only/i, "tier restriction message present");
  assert.doesNotMatch(
    html,
    /which rhythm is most likely present/i,
    "question stem must NOT appear when locked",
  );
  assert.doesNotMatch(
    html,
    /Supraventricular tachycardia/,
    "answer options must NOT appear when locked",
  );
  assert.doesNotMatch(
    html,
    /data-testid="section-ecg-strip"/,
    "ECG strip must NOT appear when locked",
  );
});

// ─── Test 3: Practice mode rationale visible after answer ────────────────────

test("practice mode shows rationale and rhythm breakdown after answer", () => {
  const html = renderToStaticMarkup(
    React.createElement(ECGQuestionLayout, {
      question: ecgQuestion,
      isLearningMode: true,
      defaultSelectedAnswer: 1,
      defaultSubmitted: true,
    }),
  );

  assert.match(html, /data-testid="section-ecg-rationale"/, "rationale section rendered");
  assert.match(
    html,
    /SVT presents with narrow complex tachycardia/i,
    "rationale text is visible",
  );
  assert.match(html, /Rationale/i, "rationale heading visible");
  assert.match(
    html,
    /data-testid="section-rhythm-breakdown"/,
    "rhythm breakdown panel rendered in practice mode",
  );
  assert.match(html, /180 bpm/, "rhythm rate shown in breakdown");
  assert.match(html, /vagal maneuvers/, "nursing action shown in breakdown");
  // Suppressed indicator must NOT appear in practice mode
  assert.doesNotMatch(html, /data-testid="section-ecg-rationale-suppressed"/);
});

// ─── Test 4: CAT / exam mode rationale hidden ────────────────────────────────

test("CAT/exam mode suppresses rationale and shows neutral indicator", () => {
  const html = renderToStaticMarkup(
    React.createElement(ECGQuestionLayout, {
      question: ecgQuestion,
      isLearningMode: false,
      defaultSelectedAnswer: 1,
      defaultSubmitted: true,
    }),
  );

  // Rationale section must NOT be present
  assert.doesNotMatch(
    html,
    /data-testid="section-ecg-rationale"(?!-suppressed)/,
    "rationale section must be hidden in exam mode",
  );
  assert.doesNotMatch(
    html,
    /SVT presents with narrow complex tachycardia/i,
    "rationale text must not be visible in exam mode",
  );
  // Neutral suppressed indicator must be shown instead
  assert.match(
    html,
    /data-testid="section-ecg-rationale-suppressed"/,
    "suppressed indicator rendered",
  );
  assert.match(html, /Practice mode/i, "suppressed message references practice mode");
});

// ─── Test 5: Mobile — no horizontal overflow ──────────────────────────────────

test("mobile layout uses overflow-x-auto on strip and no fixed min-width wider than viewport", () => {
  const html = renderToStaticMarkup(
    React.createElement(ECGQuestionLayout, {
      question: ecgQuestion,
      isLearningMode: true,
    }),
  );

  // Must have overflow-x-auto so the strip scrolls instead of overflowing
  assert.match(html, /overflow-x-auto/, "overflow-x-auto present for horizontal scroll");

  // Must NOT contain Tailwind min-w-[Npx] classes wider than a phone (> 375px)
  // e.g. min-w-[400px], min-w-[600px] would force overflow
  const problematic = html.match(/min-w-\[(\d+)px\]/g) ?? [];
  for (const cls of problematic) {
    const px = parseInt(cls.replace(/\D/g, ""), 10);
    assert.ok(px <= 375, `Found ${cls} which would overflow at 375px mobile`);
  }

  // Must NOT have inline style min-width that forces width > phone
  const inlineMinWidth = html.match(/min-width:\s*(\d+)px/g) ?? [];
  for (const style of inlineMinWidth) {
    const px = parseInt(style.replace(/\D/g, ""), 10);
    assert.ok(px <= 375, `Inline style "${style}" would overflow at 375px mobile`);
  }
});

// ─── Test 6: Accessible label on ECG strip ────────────────────────────────────

test("ECG strip panel has an aria-label for screen readers", () => {
  const html = renderToStaticMarkup(
    React.createElement(ECGQuestionLayout, {
      question: ecgQuestion,
      isLearningMode: true,
    }),
  );

  // The strip region must have aria-label so screen readers can identify it
  assert.match(
    html,
    /aria-label="ECG\/EKG clinical strip and findings"/,
    "strip region has descriptive aria-label",
  );

  // When an imageUrl is set, the <img> must carry the description as alt text
  const withImage = renderToStaticMarkup(
    React.createElement(ECGQuestionLayout, {
      question: { ...ecgQuestion, imageUrl: "https://cdn.example.com/strip.png" },
      isLearningMode: true,
    }),
  );
  assert.match(
    withImage,
    /alt="ECG rhythm strip:/,
    "img element has descriptive alt text",
  );
  assert.match(
    withImage,
    /data-testid="img-ecg-strip"/,
    "ECG strip image has testid",
  );
});

// ─── Test 7: invalid / non-HTTPS imageUrl safety guard ───────────────────────

test("non-HTTPS / malformed / javascript: imageUrl falls back to text description", () => {
  const unsafeUrls = [
    "http://example.com/ecg.png",   // plain HTTP — mixed-content risk
    "",                              // empty string
    "javascript:alert(1)",           // XSS vector
    "data:image/png;base64,abc",    // data URI — potential XSS payload
    "//cdn.example.com/strip.png",  // protocol-relative — resolves to http in some contexts
    "not-a-url-at-all",             // malformed
    "ftp://files.example.com/ecg",  // non-web scheme
  ];

  for (const url of unsafeUrls) {
    const html = renderToStaticMarkup(
      React.createElement(ECGQuestionLayout, {
        question: { ...ecgQuestion, imageUrl: url },
        isLearningMode: true,
      }),
    );
    assert.doesNotMatch(
      html,
      /data-testid="img-ecg-strip"/,
      `<img> must NOT render for unsafe URL: "${url}"`,
    );
    assert.match(
      html,
      /data-testid="text-ecg-description"/,
      `text description must show for unsafe URL: "${url}"`,
    );
  }

  // Confirm a valid HTTPS URL still renders the <img>
  const safeHtml = renderToStaticMarkup(
    React.createElement(ECGQuestionLayout, {
      question: { ...ecgQuestion, imageUrl: "https://cdn.nursenest.com/ecg/svt.png" },
      isLearningMode: true,
    }),
  );
  assert.match(safeHtml, /data-testid="img-ecg-strip"/, "HTTPS URL renders <img>");
  assert.doesNotMatch(safeHtml, /data-testid="text-ecg-description"/, "description hidden when img renders");
});

// ─── Test 8: dispatcher module smoke ─────────────────────────────────────────

test("ImageBasedRenderer module loads and exports a callable function", async () => {
  // Static import already ran above; this async form makes the intent explicit
  // and ensures the module resolves through @legacy-client without crashing.
  const mod = await import("@legacy-client/components/advanced-question-renderers");
  assert.equal(
    typeof mod.ImageBasedRenderer,
    "function",
    "ImageBasedRenderer must be exported as a function",
  );
  // Verify other renderers are still present (regression guard)
  assert.equal(typeof mod.MatrixRenderer, "function", "MatrixRenderer still exported");
  assert.equal(typeof mod.TrendRenderer, "function", "TrendRenderer still exported");
  assert.equal(typeof mod.DragDropRenderer, "function", "DragDropRenderer still exported");
});

// ─── Test 9: dispatcher ECG routing — no hook errors ─────────────────────────

test("ImageBasedRenderer with imageType='ecg' renders ECGQuestionLayout without hook errors", () => {
  // ImageBasedRenderer is a pure pass-through with no hooks of its own.
  // The ECG branch renders ECGQuestionLayout, which lives in nursenest-core and
  // shares the same React copy as this test's react-dom/server → hooks work.
  const html = renderToStaticMarkup(
    React.createElement(ImageBasedRenderer, { question: ecgQuestion }),
  );

  // ECGQuestionLayout root testid must be present
  assert.match(
    html,
    new RegExp(`data-testid="ecg-question-${ecgQuestion.id}"`),
    "ECGQuestionLayout rendered for imageType='ecg'",
  );
  // Legacy NonECGImageRenderer testid must NOT appear
  assert.doesNotMatch(
    html,
    new RegExp(`data-testid="question-image-${ecgQuestion.id}"`),
    "NonECGImageRenderer must NOT render for imageType='ecg'",
  );
  // Strip panel and stem must be present
  assert.match(html, /data-testid="section-ecg-strip"/, "ECG strip panel present");
  assert.match(html, /which rhythm is most likely present/i, "question stem rendered");

  // Locked path: ecgLocked=true shows paywall, not the question
  const lockedHtml = renderToStaticMarkup(
    React.createElement(ImageBasedRenderer, { question: ecgQuestion, ecgLocked: true }),
  );
  assert.match(lockedHtml, /data-testid="section-ecg-paywall"/, "locked ECG shows paywall");
  assert.doesNotMatch(lockedHtml, /data-testid="section-ecg-strip"/, "strip hidden when locked");
});
