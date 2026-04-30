import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isReliabilityRequestAuthorized, RELIABILITY_SECRET_HEADER } from "@/lib/reliability/internal-reliability-guard";
import {
  analyzeProbePlainText,
  collectRawI18nKeyLeaks,
  collectReliabilityFailurePhrases,
} from "@/lib/reliability/probe-content-guards";
import {
  parseSelfHealBody,
  RELIABILITY_SELF_HEAL_ACTION,
  SELF_HEAL_REVALIDATION_STEP_LABELS,
} from "@/lib/reliability/self-heal-actions";
import { GET as reliabilityCheckGet } from "@/app/api/internal/reliability/check/route";
import { POST as reliabilitySelfHealPost } from "@/app/api/internal/reliability/self-heal/route";

describe("probe content guards", () => {
  it("collects configured failure phrases case-insensitively", () => {
    const hits = collectReliabilityFailurePhrases("Welcome — Something went wrong on our end.");
    assert.ok(hits.includes("something went wrong"));
    assert.equal(collectReliabilityFailurePhrases("All good here.").length, 0);
  });

  it("detects raw pages.home / pages.pricing substrings", () => {
    assert.ok(collectRawI18nKeyLeaks("pages.home.hero.title").includes("pages.home."));
    assert.ok(collectRawI18nKeyLeaks("See pages.pricing.plan").includes("pages.pricing."));
  });

  it("analyzeProbePlainText combines failure phrases and forbidden markers", () => {
    const issues = analyzeProbePlainText("/test", "pages.home.hero.title\nApplication error");
    assert.ok(issues.some((i) => i.includes("failure_phrase:application error")));
    assert.ok(issues.some((i) => i.includes("forbidden-production-text") || i.includes("leaked_key")));
  });
});

describe("internal reliability auth (404 contract)", () => {
  it("returns 404 when env secret is set but header is missing", async () => {
    const prev = process.env.NURSENEST_RELIABILITY_SECRET;
    process.env.NURSENEST_RELIABILITY_SECRET = "test-secret-value-16chars";
    try {
      const res = await reliabilityCheckGet(new Request("http://localhost:3000/api/internal/reliability/check"));
      assert.equal(res.status, 404);
    } finally {
      if (prev === undefined) delete process.env.NURSENEST_RELIABILITY_SECRET;
      else process.env.NURSENEST_RELIABILITY_SECRET = prev;
    }
  });

  it("returns 404 when presented secret does not match env", async () => {
    const prev = process.env.NURSENEST_RELIABILITY_SECRET;
    process.env.NURSENEST_RELIABILITY_SECRET = "aaa-only-known-to-test";
    try {
      const res = await reliabilityCheckGet(
        new Request("http://localhost:3000/api/internal/reliability/check", {
          headers: { [RELIABILITY_SECRET_HEADER]: "wrong" },
        }),
      );
      assert.equal(res.status, 404);
    } finally {
      if (prev === undefined) delete process.env.NURSENEST_RELIABILITY_SECRET;
      else process.env.NURSENEST_RELIABILITY_SECRET = prev;
    }
  });

  it("isReliabilityRequestAuthorized is false when env unset", () => {
    const prev = process.env.NURSENEST_RELIABILITY_SECRET;
    delete process.env.NURSENEST_RELIABILITY_SECRET;
    try {
      assert.equal(
        isReliabilityRequestAuthorized(
          new Request("http://x", { headers: { [RELIABILITY_SECRET_HEADER]: "x" } }),
        ),
        false,
      );
    } finally {
      if (prev !== undefined) process.env.NURSENEST_RELIABILITY_SECRET = prev;
    }
  });
});

describe("self-heal body parsing", () => {
  it("rejects unknown actions", () => {
    const r = parseSelfHealBody({ action: "delete-everything" });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.error, "unknown_action");
  });

  it("accepts revalidate-critical-paths", () => {
    const r = parseSelfHealBody({ action: RELIABILITY_SELF_HEAL_ACTION });
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.action, RELIABILITY_SELF_HEAL_ACTION);
  });

  it("allowlists only approved revalidation steps", () => {
    assert.deepEqual(SELF_HEAL_REVALIDATION_STEP_LABELS, [
      'revalidatePath("/")',
      'revalidatePath("/pricing")',
      'revalidatePath("/blog")',
      'revalidatePath("/sitemap.xml")',
      'revalidateTag("pricing", "default")',
      'revalidateTag("marketing", "default")',
      'revalidateTag("lessons", "default")',
    ]);
  });
});

describe("self-heal POST unauthorized", () => {
  it("returns 404 without valid secret", async () => {
    delete process.env.NURSENEST_RELIABILITY_SECRET;
    const res = await reliabilitySelfHealPost(
      new Request("http://localhost:3000/api/internal/reliability/self-heal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: RELIABILITY_SELF_HEAL_ACTION }),
      }),
    );
    assert.equal(res.status, 404);
  });
});
