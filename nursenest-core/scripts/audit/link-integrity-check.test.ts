import assert from "node:assert/strict";
import test from "node:test";
import { analyzeHtmlIntegritySignals, extractInternalHrefs } from "./link-integrity-check.mts";

test("extractInternalHrefs finds same-origin links", () => {
  const html = `<div><a href="/pricing">P</a><a href="https://evil.com/x">E</a><a href="/faq?q=1">F</a></div>`;
  const base = new URL("http://127.0.0.1:3000/");
  const out = extractInternalHrefs(html, base).sort();
  assert.deepEqual(out, ["/faq?q=1", "/pricing"].sort());
});

test("extractInternalHrefs skips mailto and hash-only", () => {
  const html = `<a href="mailto:a@b.co">m</a><a href="#x">h</a><a href="/blog#x">b</a>`;
  const base = new URL("http://127.0.0.1:3000/");
  const out = extractInternalHrefs(html, base);
  assert.ok(out.some((x) => x.startsWith("/blog")));
});

test("analyzeHtmlIntegritySignals flags expansion unpublished redirect", () => {
  const html = "<html><body><main>Lessons hub</main></body></html>";
  const w = analyzeHtmlIntegritySignals(html, "/exams/japan", "/lessons");
  assert.ok(w.some((x) => x.code === "EXPANSION_UNPUBLISHED_REDIRECT"));
});

test("analyzeHtmlIntegritySignals flags placeholder copy", () => {
  const html = "<html><body><main>Coming soon to this page</main></body></html>";
  const w = analyzeHtmlIntegritySignals(html, "/pricing", "/pricing");
  assert.ok(w.some((x) => x.code === "PLACEHOLDER_COPY"));
});
