import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PricingAdvancedEcgAddOn } from "@/components/marketing/pricing-advanced-ecg-add-on";

test("pricing add-on block keeps Advanced ECG separate from base plans", () => {
  const html = renderToStaticMarkup(
    <PricingAdvancedEcgAddOn onCheckout={() => undefined} checkoutLoading={false} />,
  );

  assert.match(html, /Advanced ECG is a separate paid module\./i);
  assert.match(html, /Not included in base exam subscriptions\./i);
  assert.match(html, /Includes full access to the Basic ECG curriculum\./i);
  assert.match(html, /One-time purchase/i);
  assert.match(html, /\$99 CAD/i);
  assert.match(html, /Lifetime access/i);
  assert.match(html, /Designed for RN\/NP, critical care, emergency, telemetry, and advanced practice ECG interpretation\./i);
  assert.match(html, /Own entitlement:\s*<code>module_advanced_ecg<\/code>/i);
  assert.doesNotMatch(html, /included in standard RN\/NP subscriptions/i);
});
