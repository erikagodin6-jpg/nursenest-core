import assert from "node:assert/strict";
import test from "node:test";
import { inboundEmailContentRequiresManualReview } from "@/lib/inbound-email/inbound-email-manual-review-guard";

test("no match for benign content", () => {
  const r = inboundEmailContentRequiresManualReview({
    subject: "Question about study plan",
    textBody: "Hi, how do I reset my password?",
  });
  assert.equal(r.required, false);
  assert.equal(r.matched, null);
});

test("matches subject case-insensitively", () => {
  const r = inboundEmailContentRequiresManualReview({
    subject: "REFUND request",
    textBody: "Hello",
  });
  assert.equal(r.required, true);
  assert.equal(r.matched, "refund");
});

test("matches body substring", () => {
  const r = inboundEmailContentRequiresManualReview({
    subject: "Help",
    textBody: "I need help with my subscription renewal.",
  });
  assert.equal(r.required, true);
  assert.equal(r.matched, "subscription");
});

test("matches billing", () => {
  const r = inboundEmailContentRequiresManualReview({
    subject: "Billing question",
    textBody: "x",
  });
  assert.equal(r.required, true);
  assert.equal(r.matched, "billing");
});

test("matches legal", () => {
  const r = inboundEmailContentRequiresManualReview({
    subject: "x",
    textBody: "This is a legal matter regarding my account.",
  });
  assert.equal(r.required, true);
  assert.equal(r.matched, "legal");
});
