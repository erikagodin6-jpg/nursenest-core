import assert from "node:assert/strict";
import test from "node:test";
import { isInboundAiAutoReplyEnabled } from "@/lib/inbound-email/inbound-ai-autoreply-env";

const KEY = "INBOUND_AI_AUTO_REPLY_ENABLED";

test("autoreply disabled when env unset", () => {
  const prev = process.env[KEY];
  delete process.env[KEY];
  assert.equal(isInboundAiAutoReplyEnabled(), false);
  if (prev !== undefined) process.env[KEY] = prev;
});

test("autoreply enabled only for explicit true", () => {
  const prev = process.env[KEY];
  process.env[KEY] = "true";
  assert.equal(isInboundAiAutoReplyEnabled(), true);
  process.env[KEY] = "TRUE";
  assert.equal(isInboundAiAutoReplyEnabled(), true);
  process.env[KEY] = "false";
  assert.equal(isInboundAiAutoReplyEnabled(), false);
  process.env[KEY] = "maybe";
  assert.equal(isInboundAiAutoReplyEnabled(), false);
  if (prev !== undefined) process.env[KEY] = prev;
  else delete process.env[KEY];
});
