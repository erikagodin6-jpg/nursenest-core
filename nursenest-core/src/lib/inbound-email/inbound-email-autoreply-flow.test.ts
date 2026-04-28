import assert from "node:assert/strict";
import test from "node:test";
import type { InboundAutoreplyFlowDeps } from "@/lib/inbound-email/inbound-email-autoreply-flow";
import { processInboundEmailAutoreplyFlow } from "@/lib/inbound-email/inbound-email-autoreply-flow";
import type { NormalizedInboundMessage } from "@/lib/inbound-email/postmark-inbound-types";
import { SUPPORT_EMAIL } from "@/lib/support/support-policy";

function base(over: Partial<NormalizedInboundMessage>): NormalizedInboundMessage {
  return {
    fromEmail: "learner@example.com",
    fromDisplayName: "Learner",
    subject: "Study question",
    textBody: "Hello, I need help with flashcards.",
    htmlBody: "",
    messageId: "pm-inbound-1",
    headers: [],
    ...over,
  };
}

function noopDeps(over: Partial<InboundAutoreplyFlowDeps> = {}) {
  const metrics = { reserveCalls: 0, generateCalls: 0, sendCalls: 0 };
  const deps: InboundAutoreplyFlowDeps = {
    reserve: async (args) => {
      metrics.reserveCalls += 1;
      return over.reserve ? over.reserve(args) : "reserved";
    },
    finalizeSkipped: over.finalizeSkipped ?? (async () => {}),
    finalizeReplied: over.finalizeReplied ?? (async () => {}),
    finalizeFailed: over.finalizeFailed ?? (async () => {}),
    generateReply: async (msg) => {
      metrics.generateCalls += 1;
      return over.generateReply ? over.generateReply(msg) : "Thanks for writing.";
    },
    sendReply: async (p) => {
      metrics.sendCalls += 1;
      return over.sendReply ? over.sendReply(p) : { ok: true as const, messageId: "out-1", submittedAt: "2020-01-01" };
    },
  };
  return { deps, metrics };
}

test("flow skips self-address before reserve", async () => {
  const { deps, metrics } = noopDeps();
  const r = await processInboundEmailAutoreplyFlow({
    msg: base({ fromEmail: SUPPORT_EMAIL }),
    autoReplyEnabled: true,
    postmarkToken: "tok",
    openAiConfigured: true,
    outboundFrom: SUPPORT_EMAIL,
    supportEmail: SUPPORT_EMAIL,
    databaseConfigured: true,
    deps,
  });
  assert.equal(r.status, 200);
  assert.equal((r.body as { reason?: string }).reason, "loop_self_address");
  assert.equal(metrics.reserveCalls, 0);
  assert.equal(metrics.generateCalls, 0);
});

test("flow skips spam before reserve", async () => {
  const { deps, metrics } = noopDeps();
  const r = await processInboundEmailAutoreplyFlow({
    msg: base({ fromEmail: "noreply@stripe.com" }),
    autoReplyEnabled: true,
    postmarkToken: "tok",
    openAiConfigured: true,
    outboundFrom: SUPPORT_EMAIL,
    supportEmail: SUPPORT_EMAIL,
    databaseConfigured: true,
    deps,
  });
  assert.equal(r.status, 200);
  assert.equal((r.body as { skipped?: boolean }).skipped, true);
  assert.equal(metrics.reserveCalls, 0);
});

test("flow skips missing MessageID before reserve", async () => {
  const { deps, metrics } = noopDeps();
  const r = await processInboundEmailAutoreplyFlow({
    msg: base({ messageId: null }),
    autoReplyEnabled: true,
    postmarkToken: "tok",
    openAiConfigured: true,
    outboundFrom: SUPPORT_EMAIL,
    supportEmail: SUPPORT_EMAIL,
    databaseConfigured: true,
    deps,
  });
  assert.equal(r.status, 200);
  assert.equal((r.body as { reason?: string }).reason, "missing_message_id");
  assert.equal(metrics.reserveCalls, 0);
});

test("flow returns 503 when database not configured", async () => {
  const { deps, metrics } = noopDeps();
  const r = await processInboundEmailAutoreplyFlow({
    msg: base(),
    autoReplyEnabled: true,
    postmarkToken: "tok",
    openAiConfigured: true,
    outboundFrom: SUPPORT_EMAIL,
    supportEmail: SUPPORT_EMAIL,
    databaseConfigured: false,
    deps,
  });
  assert.equal(r.status, 503);
  assert.equal(metrics.reserveCalls, 0);
});

test("flow duplicate does not call generate or send", async () => {
  const { deps, metrics } = noopDeps({
    reserve: async () => "duplicate",
  });
  const r = await processInboundEmailAutoreplyFlow({
    msg: base(),
    autoReplyEnabled: true,
    postmarkToken: "tok",
    openAiConfigured: true,
    outboundFrom: SUPPORT_EMAIL,
    supportEmail: SUPPORT_EMAIL,
    databaseConfigured: true,
    deps,
  });
  assert.equal(r.status, 200);
  assert.deepEqual(r.body, { ok: true, skipped: true, reason: "duplicate" });
  assert.equal(metrics.generateCalls, 0);
  assert.equal(metrics.sendCalls, 0);
});

test("flow when autoreply disabled finalizes skip and does not call OpenAI or Postmark", async () => {
  let skippedDetail = "";
  const { deps, metrics } = noopDeps({
    finalizeSkipped: async (_id, detail) => {
      skippedDetail = detail;
    },
  });
  const r = await processInboundEmailAutoreplyFlow({
    msg: base(),
    autoReplyEnabled: false,
    postmarkToken: null,
    openAiConfigured: false,
    outboundFrom: SUPPORT_EMAIL,
    supportEmail: SUPPORT_EMAIL,
    databaseConfigured: true,
    deps,
  });
  assert.equal(r.status, 200);
  assert.deepEqual(r.body, { ok: true, skipped: true, reason: "auto_reply_disabled" });
  assert.equal(skippedDetail, "auto_reply_disabled");
  assert.equal(metrics.reserveCalls, 1);
  assert.equal(metrics.generateCalls, 0);
  assert.equal(metrics.sendCalls, 0);
});

test("flow when enabled sends once", async () => {
  let repliedWith = "";
  const { deps, metrics } = noopDeps({
    finalizeReplied: async (id, args) => {
      repliedWith = `${id}:${args.outboundMessageId}`;
    },
  });
  const r = await processInboundEmailAutoreplyFlow({
    msg: base(),
    autoReplyEnabled: true,
    postmarkToken: "tok",
    openAiConfigured: true,
    outboundFrom: SUPPORT_EMAIL,
    supportEmail: SUPPORT_EMAIL,
    databaseConfigured: true,
    deps,
  });
  assert.equal(r.status, 200);
  assert.equal((r.body as { ok?: boolean }).ok, true);
  assert.equal(metrics.generateCalls, 1);
  assert.equal(metrics.sendCalls, 1);
  assert.equal(repliedWith, "pm-inbound-1:out-1");
});

test("flow skips sensitive billing/refund content before AI and Postmark", async () => {
  let skippedDetail = "";
  const { deps, metrics } = noopDeps({
    finalizeSkipped: async (_id, detail) => {
      skippedDetail = detail;
    },
  });
  const r = await processInboundEmailAutoreplyFlow({
    msg: base({ subject: "Refund please", textBody: "I was charged twice." }),
    autoReplyEnabled: true,
    postmarkToken: "tok",
    openAiConfigured: true,
    outboundFrom: SUPPORT_EMAIL,
    supportEmail: SUPPORT_EMAIL,
    databaseConfigured: true,
    deps,
  });
  assert.equal(r.status, 200);
  assert.deepEqual(r.body, { ok: true, skipped: true, reason: "requires_manual_review" });
  assert.equal(skippedDetail, "requires_manual_review");
  assert.equal(metrics.reserveCalls, 1);
  assert.equal(metrics.generateCalls, 0);
  assert.equal(metrics.sendCalls, 0);
});
