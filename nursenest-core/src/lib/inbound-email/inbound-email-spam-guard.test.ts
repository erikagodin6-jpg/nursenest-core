import assert from "node:assert/strict";
import test from "node:test";
import { shouldIgnoreInboundAsSpam } from "@/lib/inbound-email/inbound-email-spam-guard";
import type { NormalizedInboundMessage } from "@/lib/inbound-email/postmark-inbound-types";

function base(over: Partial<NormalizedInboundMessage>): NormalizedInboundMessage {
  return {
    fromEmail: "learner@example.com",
    fromDisplayName: "Learner",
    subject: "Billing question",
    textBody: "Hello, I need help with my subscription.",
    htmlBody: "",
    messageId: "abc",
    headers: [],
    ...over,
  };
}

test("spam guard ignores empty body", () => {
  const r = shouldIgnoreInboundAsSpam(base({ textBody: "", htmlBody: "" }));
  assert.equal(r.ignore, true);
});

test("spam guard ignores noreply senders", () => {
  const r = shouldIgnoreInboundAsSpam(base({ fromEmail: "noreply@stripe.com", textBody: "x" }));
  assert.equal(r.ignore, true);
});

test("spam guard allows normal learner mail", () => {
  const r = shouldIgnoreInboundAsSpam(base({}));
  assert.equal(r.ignore, false);
});

test("spam guard ignores Auto-Submitted auto-generated", () => {
  const r = shouldIgnoreInboundAsSpam(
    base({
      headers: [{ name: "Auto-Submitted", value: "auto-generated" }],
    }),
  );
  assert.equal(r.ignore, true);
});
