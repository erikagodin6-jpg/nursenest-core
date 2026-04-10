import assert from "node:assert/strict";
import test from "node:test";
import {
  buildNotFoundRecoveryModel,
  resolveNotFoundRouteContext,
} from "@/lib/routing/not-found-recovery";

test("missing lesson routes recover to the pathway lessons hub", () => {
  const context = resolveNotFoundRouteContext("/us/np/fnp/lessons/missing-slug");

  assert.equal(context.kind, "pathway_lessons");
  assert.equal(context.pathway?.id, "us-np-fnp");
  assert.equal(context.pathwayLessonsHref, "/us/np/fnp/lessons");
  assert.equal(context.pathwayOverviewHref, "/us/np/fnp");

  const recovery = buildNotFoundRecoveryModel(context);

  assert.equal(recovery.primaryCta.label, "Browse Lessons");
  assert.equal(recovery.primaryCta.href, "/us/np/fnp/lessons");
  assert.ok(recovery.secondaryCtas.some((cta) => cta.label === "Go Home" && cta.href === "/"));
});

test("pathway child routes recover to the matching pathway hub", () => {
  const context = resolveNotFoundRouteContext("/canada/rpn/rex-pn/unknown-child");

  assert.equal(context.kind, "pathway_overview");
  assert.equal(context.pathway?.id, "ca-rpn-rex-pn");

  const recovery = buildNotFoundRecoveryModel(context);

  assert.equal(recovery.primaryCta.label, "Open Pathway Hub");
  assert.equal(recovery.primaryCta.href, "/canada/rpn/rex-pn");
  assert.ok(
    recovery.secondaryCtas.some((cta) => cta.label === "Browse Lessons" && cta.href === "/canada/rpn/rex-pn/lessons"),
  );
});

test("unique typo-like exam segments suggest the closest pathway landing page", () => {
  const context = resolveNotFoundRouteContext("/us/np/pmhn/overview");

  assert.equal(context.kind, "closest_pathway");
  assert.equal(context.pathway?.id, "us-np-pmhnp");

  const recovery = buildNotFoundRecoveryModel(context);

  assert.equal(recovery.primaryCta.href, "/us/np/pmhnp");
  assert.ok(recovery.body.includes("PMHNP"));
});

test("signed-in recovery can include resume and dashboard links without losing core CTAs", () => {
  const context = resolveNotFoundRouteContext("/missing-page");
  const recovery = buildNotFoundRecoveryModel(context, {
    dashboardHref: "/app",
    resumeHref: "/us/rn/nclex-rn/lessons/fluid-balance",
    resumeLabel: "Resume Studying",
    signedIn: true,
  });

  assert.equal(recovery.primaryCta.label, "Go Home");
  assert.ok(recovery.secondaryCtas.some((cta) => cta.label === "Browse Lessons" && cta.href === "/lessons"));
  assert.ok(recovery.secondaryCtas.some((cta) => cta.label === "Go to Dashboard" && cta.href === "/app"));
  assert.ok(
    recovery.secondaryCtas.some(
      (cta) => cta.label === "Resume Studying" && cta.href === "/us/rn/nclex-rn/lessons/fluid-balance",
    ),
  );
});
