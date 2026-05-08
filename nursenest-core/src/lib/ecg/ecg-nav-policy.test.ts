import assert from "node:assert/strict";
import test from "node:test";
import { buildOptionalEcgShellNavItem } from "@/lib/navigation/learner-primary-nav";

test("ECG nav hidden without pathway", () => {
  assert.equal(buildOptionalEcgShellNavItem(null), null);
});

test("ECG nav hidden for unknown pathway id", () => {
  assert.equal(buildOptionalEcgShellNavItem("not-a-real-pathway-id-xyz"), null);
});

test("ECG nav visible for US RN pathway", () => {
  const row = buildOptionalEcgShellNavItem("us-rn-nclex-rn");
  assert.ok(row);
  assert.equal(row!.href, "/app/rn/ecg");
});

test("ECG nav visible for US NP pathway", () => {
  const row = buildOptionalEcgShellNavItem("us-np-fnp");
  assert.ok(row);
  assert.equal(row!.href, "/app/np/ecg");
});

test("ECG nav visible for Canada RPN pathway", () => {
  const row = buildOptionalEcgShellNavItem("ca-rpn-rex-pn");
  assert.ok(row);
  assert.equal(row!.href, "/app/pn/ecg");
});
