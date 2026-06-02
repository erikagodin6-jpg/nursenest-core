import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { authRouteQueryString } from "@/lib/auth/auth-route-query";
import { isLearnerShell } from "@/lib/navigation/learner-shell";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..", "..");

function read(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

test("auth pages stay outside learner shell classification", () => {
  for (const path of [
    "/login",
    "/signup",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/fr/login",
    "/fr/signup",
    "/fr/sign-up",
  ]) {
    assert.equal(isLearnerShell(path), false, `${path} must not render inside the learner shell`);
  }
});

test("sign-up alias preserves auth query parameters", () => {
  assert.equal(
    authRouteQueryString({
      callbackUrl: "/pricing?plan=rn-monthly",
      utm_source: "navbar",
      empty: "",
    }),
    "?callbackUrl=%2Fpricing%3Fplan%3Drn-monthly&utm_source=navbar",
  );
});

test("auth entry routes use the shared premium auth experience", () => {
  assert.match(
    read("components/marketing/marketing-login-page.tsx"),
    /PremiumAuthShell/,
    "login must use the shared premium auth shell",
  );
  assert.match(
    read("components/auth/signup-experience-client.tsx"),
    /AuthExperienceShell/,
    "signup must use the shared premium auth shell",
  );
  assert.match(
    read("components/auth/signup-form.tsx"),
    /pages\.signup\.createAccount/,
    "signup CTA must use explicit Create Account copy, not a generic Continue button",
  );
});

test("sign-up alias routes redirect to canonical signup routes", () => {
  assert.match(
    read("app/(marketing)/(default)/sign-up/page.tsx"),
    /redirect\(`\/signup/,
    "default /sign-up must redirect to /signup",
  );
  assert.match(
    read("app/(marketing)/[locale]/sign-up/page.tsx"),
    /withMarketingLocale\(resolvedLocale, "\/signup"\)/,
    "localized /sign-up must redirect to localized signup",
  );
});
