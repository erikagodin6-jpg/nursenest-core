import assert from "node:assert/strict";
import test from "node:test";
import { humanizedMarketingKeyFallback } from "@/lib/marketing-i18n/marketing-message-value-policy";

import { isPlaceholderAuthCopy } from "./is-placeholder-auth-copy";

test("isPlaceholderAuthCopy flags humanized missing-key fallback", () => {
  const key = "pages.authTrust.accountSafeQuestion";
  assert.equal(isPlaceholderAuthCopy(humanizedMarketingKeyFallback(key), key), true);
});

test("isPlaceholderAuthCopy allows normal auth reassurance copy", () => {
  assert.equal(isPlaceholderAuthCopy("Is my account secure?", "pages.authTrust.accountSafeQuestion"), false);
});

test("isPlaceholderAuthCopy flags raw dotted keys", () => {
  assert.equal(isPlaceholderAuthCopy("pages.authTrust.heading"), true);
});
