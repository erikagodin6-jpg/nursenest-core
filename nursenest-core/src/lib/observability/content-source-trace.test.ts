import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { isContentSourceTraceEnabled } from "./content-source-trace";

const origEnv = { ...process.env };

afterEach(() => {
  process.env.NODE_ENV = origEnv.NODE_ENV;
  process.env.CONTENT_SOURCE_TRACE = origEnv.CONTENT_SOURCE_TRACE ?? "";
  if (origEnv.CONTENT_SOURCE_TRACE === undefined) delete process.env.CONTENT_SOURCE_TRACE;
});

test("isContentSourceTraceEnabled: CONTENT_SOURCE_TRACE=1 forces on in production", () => {
  process.env.NODE_ENV = "production";
  process.env.CONTENT_SOURCE_TRACE = "1";
  assert.equal(isContentSourceTraceEnabled(), true);
});

test("isContentSourceTraceEnabled: CONTENT_SOURCE_TRACE=0 disables in development", () => {
  process.env.NODE_ENV = "development";
  process.env.CONTENT_SOURCE_TRACE = "0";
  assert.equal(isContentSourceTraceEnabled(), false);
});

test("isContentSourceTraceEnabled: development defaults on", () => {
  process.env.NODE_ENV = "development";
  delete process.env.CONTENT_SOURCE_TRACE;
  assert.equal(isContentSourceTraceEnabled(), true);
});
