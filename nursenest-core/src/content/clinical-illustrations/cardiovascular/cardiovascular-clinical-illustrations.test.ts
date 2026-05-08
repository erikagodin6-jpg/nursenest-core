import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import {
  CARDIOVASCULAR_CLINICAL_ILLUSTRATIONS,
  resolveCardiovascularClinicalIllustration,
} from "@/content/clinical-illustrations/cardiovascular";

test("cardiovascular clinical illustrations: all launch assets exist", () => {
  assert.equal(CARDIOVASCULAR_CLINICAL_ILLUSTRATIONS.length, 15);
  for (const entry of CARDIOVASCULAR_CLINICAL_ILLUSTRATIONS) {
    assert.ok(entry.alt.length > 24, `${entry.id} should have descriptive alt text`);
    assert.ok(entry.caption.length > 12, `${entry.id} should have a concise caption`);
    assert.ok(entry.publicPath.endsWith(".svg"), `${entry.id} should use a small vector asset`);
    assert.ok(
      existsSync(path.join(process.cwd(), "public", entry.publicPath.replace(/^\//, ""))),
      `${entry.id} asset should exist at ${entry.publicPath}`,
    );
  }
});

test("cardiovascular clinical illustrations: RN seed lessons resolve across high-priority cardiovascular topics", () => {
  const rnSlugs = [
    "heart-failure-nursing-priorities-hy",
    "acute-coronary-syndrome-gold",
    "acute-myocardial-infarction-troponin",
    "atrial-fibrillation-rate-control",
    "hypertensive-crisis-vs-urgency",
    "shock-recognition-fluids",
  ];
  for (const slug of rnSlugs) {
    assert.ok(resolveCardiovascularClinicalIllustration({ slug }), `${slug} should resolve`);
  }
});

test("cardiovascular clinical illustrations: RPN and NP reuse matching base illustrations", () => {
  const examples = [
    ["bp26-carpn-x003-heart-failure-discharge-teaching", "heart-failure"],
    ["bp26-uslpn-pa-shock-classify", "shock-states"],
    ["np-heart-failure-primary-care-gold", "heart-failure"],
    ["fnp-adult-hypertension-intensification", "hypertension"],
  ] as const;

  for (const [slug, expectedId] of examples) {
    const resolved = resolveCardiovascularClinicalIllustration({ slug });
    assert.equal(resolved?.id, expectedId, `${slug} should reuse ${expectedId}`);
  }
});
