import assert from "node:assert/strict";
import test from "node:test";
import type { Metadata } from "next";
import {
  SeoHttpValidationStrictError,
  validateMetadataAlternatesHttp,
} from "@/lib/seo/seo-http-emit-validation";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

const SAVED_ENV = { ...process.env };
const ORIGINAL_FETCH = globalThis.fetch;

function setEnv(overrides: Record<string, string | undefined>): void {
  process.env = { ...SAVED_ENV };
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function setFetchStatus(status: number): void {
  globalThis.fetch = async () => new Response(null, { status });
}

function metadataWithCanonical(url: string): Metadata {
  return {
    title: "Home",
    description: "Desc",
    alternates: {
      canonical: url,
    },
  };
}

test("validateMetadataAlternatesHttp skips outbound HTTP checks entirely in production request mode", async () => {
  setEnv({
    NODE_ENV: "production",
    VERCEL_ENV: "production",
    CI: undefined,
    SEO_HTTP_VALIDATE_PAGE_METADATA: "1",
    SEO_HTTP_VALIDATE_STRICT: "1",
  });

  let fetchCalls = 0;
  globalThis.fetch = async () => {
    fetchCalls += 1;
    return new Response(null, { status: 500 });
  };

  const result = await validateMetadataAlternatesHttp(metadataWithCanonical("https://example.com/"), {
    pathname: "/",
    routeGroup: "marketing.default.home",
    sourceFile: "src/app/(marketing)/(default)/page.tsx",
    generator: "generateMetadata",
  });

  assert.equal(fetchCalls, 0);
  assert.equal(result.failures.length, 0);
  assert.equal(result.strictRequested, true);
  assert.equal(result.strictEnforced, false);
  assert.equal(result.environmentName, "production");
  assert.equal(result.skipped, true);
  assert.equal(result.skipReason, "production_request_mode");
});

test("validateMetadataAlternatesHttp still throws strict validation errors in development", async () => {
  setEnv({
    NODE_ENV: "development",
    VERCEL_ENV: undefined,
    CI: undefined,
    SEO_HTTP_VALIDATE_PAGE_METADATA: "1",
    SEO_HTTP_VALIDATE_STRICT: "1",
  });
  setFetchStatus(500);

  await assert.rejects(
    validateMetadataAlternatesHttp(metadataWithCanonical("https://example.com/"), {
      pathname: "/",
      routeGroup: "marketing.default.home",
      sourceFile: "src/app/(marketing)/(default)/page.tsx",
      generator: "generateMetadata",
    }),
    SeoHttpValidationStrictError,
  );
});

test("safeGenerateMetadata returns route fallback metadata instead of throwing on strict validation failures", async () => {
  setEnv({
    NODE_ENV: "production",
    VERCEL_ENV: "production",
    CI: "1",
    SEO_HTTP_VALIDATE_PAGE_METADATA: "1",
    SEO_HTTP_VALIDATE_STRICT: "1",
  });
  setFetchStatus(500);

  const fallback: Metadata = {
    title: "Safe Home",
    description: "Fallback home metadata",
  };

  const result = await safeGenerateMetadata(
    async () => metadataWithCanonical("https://example.com/"),
    {
      pathname: "/",
      routeGroup: "marketing.default.home",
      fallbackMetadata: fallback,
    },
  );

  assert.deepEqual(result, fallback);
});

test.after(() => {
  process.env = { ...SAVED_ENV };
  globalThis.fetch = ORIGINAL_FETCH;
});
