import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();

function source(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

test("marketing layout seeds SessionProvider from server auth instead of hard-coded logged-out state", () => {
  const layout = source("src/app/(marketing)/layout.tsx");

  assert.match(layout, /getMarketingInitialSession/);
  assert.match(layout, /await auth\(\)/);
  assert.match(layout, /getAuthSessionWithJwtCookieFallback/);
  assert.match(layout, /jar\.getAll\(\)\.map\(\(cookie\) => cookie\.name\)/);
  assert.match(layout, /name\.startsWith\(`\$\{sessionName\}\.`\)/);
  assert.match(layout, /<AuthSessionProvider session=\{session\} runtimeBoundary="public">/);
  assert.doesNotMatch(layout, /<AuthSessionProvider session=\{null\} runtimeBoundary="public">/);
});

test("marketing layout treats chunked Auth.js and NextAuth session cookies as authenticated-pending", () => {
  const layout = source("src/app/(marketing)/layout.tsx");

  assert.match(layout, /"authjs\.session-token"/);
  assert.match(layout, /"__Secure-authjs\.session-token"/);
  assert.match(layout, /"next-auth\.session-token"/);
  assert.match(layout, /"__Secure-next-auth\.session-token"/);
  assert.doesNotMatch(layout, /jar\.has\("authjs\.session-token"\)\s*\|\|/);
});

test("marketing header does not render guest CTAs while session status is loading", () => {
  const header = source("src/components/layout/site-header.tsx");

  assert.match(header, /isSessionPending\s*\?\s*\(/);
  assert.match(header, /Checking account status/);
  assert.doesNotMatch(header, /show guest buttons immediately/i);
});

test("marketing header renders authenticated users through a centralized account menu", () => {
  const header = source("src/components/layout/site-header.tsx");

  assert.match(header, /function UserAccountMenu/);
  assert.match(header, /aria-haspopup="menu"/);
  assert.match(header, /role="menu"/);
  assert.match(header, /Profile/);
  assert.match(header, /Study Analytics/);
  assert.match(header, /Progress Report Card/);
  assert.match(header, /Billing/);
  assert.match(header, /Report a Problem/);
  assert.match(header, /MobileUserAccountSection/);
});
