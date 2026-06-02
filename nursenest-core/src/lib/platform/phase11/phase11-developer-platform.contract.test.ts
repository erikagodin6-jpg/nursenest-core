import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ApiObservabilityMetric,
  ApiTokenKind,
  DeveloperApiScope,
  IntegrationEventDomain,
  NurseNestApiVersion,
  WEBHOOK_IDEMPOTENCY_HEADERS,
} from "@/lib/platform/phase11";
import { IntegrationEventDomain as Phase10Events } from "@/lib/platform/phase10/integration-events";

describe("phase11 developer platform contracts", () => {
  it("defines API version and scope taxonomies", () => {
    assert.equal(NurseNestApiVersion.v1DeveloperPreview, "1");
    assert.ok(DeveloperApiScope.learnerSelfProgressRead.startsWith("nn:"));
  });

  it("aligns observability metrics with stable dot notation", () => {
    assert.ok(ApiObservabilityMetric.entitlementDenied.includes("entitlement"));
    assert.equal(ApiTokenKind.integrationBearer, "integration_bearer");
  });

  it("keeps webhook event taxonomy aligned with Phase 10", () => {
    assert.deepStrictEqual(IntegrationEventDomain, Phase10Events);
  });

  it("documents idempotency header names without values", () => {
    assert.equal(WEBHOOK_IDEMPOTENCY_HEADERS.deliveryId, "x-nn-delivery-id");
  });
});
