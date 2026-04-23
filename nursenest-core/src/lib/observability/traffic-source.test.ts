import test from "node:test";
import assert from "node:assert/strict";
import {
  NN_TRAFFIC_SOURCE_HEADER,
  NN_TRAFFIC_SOURCE_SYNTHETIC,
  trafficSourceFromRequest,
} from "@/lib/observability/traffic-source-constants";

test("trafficSourceFromRequest — synthetic header", () => {
  const req = new Request("https://example.com/api/x", {
    headers: { [NN_TRAFFIC_SOURCE_HEADER]: NN_TRAFFIC_SOURCE_SYNTHETIC },
  });
  assert.equal(trafficSourceFromRequest(req), "synthetic");
});

test("trafficSourceFromRequest — admin learner QA cookie (signed-shape heuristic)", () => {
  const plausibleSigned = "aaaabbbbccccdddd.0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
  const req = new Request("https://example.com/app", {
    headers: { cookie: `a=1; nn_admin_learner_qa=${plausibleSigned}; b=2` },
  });
  assert.equal(trafficSourceFromRequest(req), "admin_learner_qa");
});

test("trafficSourceFromRequest — synthetic header wins over QA cookie", () => {
  const req = new Request("https://example.com/api/x", {
    headers: {
      cookie: "nn_admin_learner_qa=shortnodots",
      [NN_TRAFFIC_SOURCE_HEADER]: NN_TRAFFIC_SOURCE_SYNTHETIC,
    },
  });
  assert.equal(trafficSourceFromRequest(req), "synthetic");
});

test("trafficSourceFromRequest — junk QA cookie value is customer", () => {
  const req = new Request("https://example.com/app", {
    headers: { cookie: "nn_admin_learner_qa=x" },
  });
  assert.equal(trafficSourceFromRequest(req), "customer");
});

test("trafficSourceFromRequest — default customer", () => {
  const req = new Request("https://example.com/");
  assert.equal(trafficSourceFromRequest(req), "customer");
});
