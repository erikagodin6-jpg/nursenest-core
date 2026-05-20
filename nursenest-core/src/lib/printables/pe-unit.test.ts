import assert from "node:assert/strict";
import test from "node:test";
import { PrintableAccessSource } from "@prisma/client";
import { printableDownloadSourceForEvent } from "./printable-download-source";
import { hashPrintablePrivacyPart } from "./printable-privacy-hash";
import { evaluatePrintableLearnerAccess, printableProductPricingValid } from "./printable-entitlement";
import { validatePrintablePdfMediaAsset, validatePrintableThumbnailMediaAsset } from "./printable-media-validation";
import {
  fetchPrintableAssetBodyFromSpaces,
  setPrintableAssetFetchOverrideForTests,
} from "./fetch-printable-asset-from-spaces";
import { isPrintableAdminApiAllowed, isPrintableStoreEnabledForLearners } from "./printable-store-flags";

test("printableDownloadSourceForEvent maps modes", () => {
  assert.equal(
    printableDownloadSourceForEvent({ isFree: true, isPremiumIncluded: false, paidAccessSource: null }),
    "LEARNER",
  );
  assert.equal(
    printableDownloadSourceForEvent({ isFree: false, isPremiumIncluded: true, paidAccessSource: null }),
    "SUBSCRIPTION",
  );
  assert.equal(
    printableDownloadSourceForEvent({
      isFree: false,
      isPremiumIncluded: false,
      paidAccessSource: PrintableAccessSource.PURCHASE,
    }),
    "PURCHASE",
  );
});

test("printableProductPricingValid", () => {
  assert.equal(printableProductPricingValid({ isFree: true, isPremiumIncluded: false, priceCents: 0 }), true);
  assert.equal(printableProductPricingValid({ isFree: false, isPremiumIncluded: false, priceCents: 100 }), true);
  assert.equal(printableProductPricingValid({ isFree: false, isPremiumIncluded: true, priceCents: 0 }), true);
  assert.equal(printableProductPricingValid({ isFree: true, isPremiumIncluded: true, priceCents: 0 }), false);
  assert.equal(printableProductPricingValid({ isFree: true, isPremiumIncluded: false, priceCents: 99 }), false);
  assert.equal(printableProductPricingValid({ isFree: false, isPremiumIncluded: false, priceCents: 0 }), false);
  assert.equal(printableProductPricingValid({ isFree: false, isPremiumIncluded: true, priceCents: 100 }), false);
});

test("validatePrintablePdfMediaAsset rejects non-pdf mime and docx", () => {
  assert.equal(
    validatePrintablePdfMediaAsset({ kind: "pdf", mimeType: "application/pdf" }).ok,
    true,
  );
  assert.equal(
    validatePrintablePdfMediaAsset({
      kind: "pdf",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }).ok,
    false,
  );
  assert.equal(validatePrintablePdfMediaAsset({ kind: "pdf", mimeType: "application/octet-stream" }).ok, false);
  assert.equal(validatePrintablePdfMediaAsset({ kind: "image", mimeType: "application/pdf" }).ok, false);
});

test("validatePrintableThumbnailMediaAsset allows png/jpeg/webp only", () => {
  assert.equal(validatePrintableThumbnailMediaAsset({ kind: "image", mimeType: "image/png" }).ok, true);
  assert.equal(validatePrintableThumbnailMediaAsset({ kind: "image", mimeType: "image/jpeg" }).ok, true);
  assert.equal(validatePrintableThumbnailMediaAsset({ kind: "image", mimeType: "image/webp" }).ok, true);
  assert.equal(validatePrintableThumbnailMediaAsset({ kind: "image", mimeType: "image/gif" }).ok, false);
  assert.equal(validatePrintableThumbnailMediaAsset({ kind: "image", mimeType: "image/svg+xml" }).ok, false);
});

test("fetchPrintableAssetBodyFromSpaces uses test override when set", async () => {
  try {
    setPrintableAssetFetchOverrideForTests(async () => ({
      body: new Uint8Array([1, 2, 3]),
      contentType: "application/pdf",
      contentLength: 3,
    }));
    const got = await fetchPrintableAssetBodyFromSpaces("any-key");
    assert.ok(got);
    assert.equal(got!.body.byteLength, 3);
  } finally {
    setPrintableAssetFetchOverrideForTests(null);
  }
});

test("evaluatePrintableLearnerAccess: unpublished and premium gating", () => {
  const base = {
    id: "p1",
    pathwayId: "all",
    isFree: true,
    isPremiumIncluded: false,
    priceCents: 0,
    isPublished: false,
  };
  assert.equal(evaluatePrintableLearnerAccess(base, { hasPremium: true, allowedExam: { pathwayId: "x" } } as never).ok, false);

  const prem = { ...base, isPublished: true, isFree: false, isPremiumIncluded: true, priceCents: 0 };
  assert.equal(
    evaluatePrintableLearnerAccess(prem, { hasPremium: false, allowedExam: { pathwayId: "x" } } as never).ok,
    false,
  );
  assert.equal(
    evaluatePrintableLearnerAccess(prem, { hasPremium: true, allowedExam: { pathwayId: "x" } } as never).ok,
    true,
  );
});

test("PRINTABLE_STORE_ENABLED gates learner flag", () => {
  const prev = process.env.PRINTABLE_STORE_ENABLED;
  try {
    delete process.env.PRINTABLE_STORE_ENABLED;
    assert.equal(isPrintableStoreEnabledForLearners(), false);
    process.env.PRINTABLE_STORE_ENABLED = "true";
    assert.equal(isPrintableStoreEnabledForLearners(), true);
  } finally {
    if (prev === undefined) delete process.env.PRINTABLE_STORE_ENABLED;
    else process.env.PRINTABLE_STORE_ENABLED = prev;
  }
});

test("ADMIN_PRINTABLES_ENABLED=false blocks admin API when learner store off", () => {
  const prevL = process.env.PRINTABLE_STORE_ENABLED;
  const prevA = process.env.ADMIN_PRINTABLES_ENABLED;
  try {
    delete process.env.PRINTABLE_STORE_ENABLED;
    process.env.ADMIN_PRINTABLES_ENABLED = "false";
    assert.equal(isPrintableAdminApiAllowed(), false);
    process.env.ADMIN_PRINTABLES_ENABLED = "true";
    assert.equal(isPrintableAdminApiAllowed(), true);
    process.env.PRINTABLE_STORE_ENABLED = "true";
    delete process.env.ADMIN_PRINTABLES_ENABLED;
    assert.equal(isPrintableAdminApiAllowed(), true);
  } finally {
    if (prevL === undefined) delete process.env.PRINTABLE_STORE_ENABLED;
    else process.env.PRINTABLE_STORE_ENABLED = prevL;
    if (prevA === undefined) delete process.env.ADMIN_PRINTABLES_ENABLED;
    else process.env.ADMIN_PRINTABLES_ENABLED = prevA;
  }
});

test("hashPrintablePrivacyPart is stable for same input", () => {
  const prev = process.env.AUTH_SECRET;
  process.env.AUTH_SECRET = "unit-test-printable-privacy-secret-min-32-chars";
  try {
    const a = hashPrintablePrivacyPart("ip", "203.0.113.9");
    const b = hashPrintablePrivacyPart("ip", "203.0.113.9");
    assert.equal(a, b);
    assert.equal(typeof a, "string");
  } finally {
    if (prev === undefined) delete process.env.AUTH_SECRET;
    else process.env.AUTH_SECRET = prev;
  }
});
