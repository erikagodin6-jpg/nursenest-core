import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");

function read(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

describe("printable store (contract)", () => {
  it("gates learner list on PRINTABLE_STORE_ENABLED", () => {
    const src = read("app/api/printables/route.ts");
    assert.match(src, /isPrintableStoreEnabledForLearners/);
  });

  it("learner printables page notFound when store disabled", () => {
    const src = read("app/(student)/app/(learner)/printables/page.tsx");
    assert.match(src, /isPrintableStoreEnabledForLearners/);
    assert.match(src, /notFound/);
  });

  it("learner shell nav includes optional printouts when layout passes visibility", () => {
    const src = read("components/layout/learner-shell-primary-nav.tsx");
    assert.match(src, /buildOptionalPrintablesShellNavItem/);
    assert.match(src, /printablesNavVisible/);
  });

  it("learner download records privacy hashes and uses entitlement helpers", () => {
    const src = read("app/api/printables/[id]/download/route.ts");
    assert.match(src, /hashPrintablePrivacyPart/);
    assert.match(src, /evaluatePrintableLearnerAccess/);
    assert.match(src, /printableDownloadEvent\.create/);
    assert.match(src, /fetchPrintableAssetBodyFromSpaces/);
  });

  it("admin preview download is tracked separately (ADMIN_PREVIEW)", () => {
    const src = read("app/api/admin/printables/[id]/preview-download/route.ts");
    assert.match(src, /ADMIN_PREVIEW/);
  });

  it("admin upload requires explicit confirmIntent", () => {
    const src = read("app/api/admin/printables/[id]/upload/route.ts");
    assert.match(src, /printable-admin-upload-confirm/);
  });

  it("admin JSON mutations require parseAdminJsonMutationIntent", () => {
    assert.match(read("app/api/admin/printables/route.ts"), /parseAdminJsonMutationIntent/);
    assert.match(read("app/api/admin/printables/[id]/route.ts"), /parseAdminJsonMutationIntent/);
  });

  it("RBAC allowlists admin printables paths for support tier", () => {
    const src = read("lib/auth/admin-path-policy.ts");
    assert.match(src, /"\/admin\/printables"/);
    assert.match(src, /"\/api\/admin\/printables"/);
  });

  it("learner JSON responses omit storage URLs (no publicUrl / storageKey in printables route)", () => {
    const src = read("app/api/printables/route.ts");
    assert.equal(src.includes("publicUrl"), false);
    assert.equal(src.includes("storageKey"), false);
  });

  it("learner detail route omits storageKey and publicUrl", () => {
    const src = read("app/api/printables/[id]/route.ts");
    assert.equal(src.includes("storageKey"), false);
    assert.equal(src.includes("publicUrl"), false);
  });

  it("learner download validates PDF MIME before stream and uses Spaces fetch", () => {
    const src = read("app/api/printables/[id]/download/route.ts");
    assert.match(src, /validatePrintablePdfMediaAsset/);
    assert.match(src, /fetchPrintableAssetBodyFromSpaces/);
    assert.match(src, /purchase_required/);
    assert.match(src, /userHasPaidPrintableAccess/);
  });

  it("global analytics summary includes downloadsByDay aggregation", () => {
    const src = read("lib/printables/printable-analytics.server.ts");
    assert.match(src, /downloadsByDay/);
    assert.match(src, /getPrintableAnalyticsSummary/);
  });
});
