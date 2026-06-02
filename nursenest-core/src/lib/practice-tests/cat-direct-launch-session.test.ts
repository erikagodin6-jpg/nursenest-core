import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  __resetCatDirectLaunchSessionInflightForTests,
  runCatDirectLaunchSessionOnce,
} from "@/lib/practice-tests/cat-direct-launch-session";
import type { PracticeTestPathwayClientShell } from "@/lib/practice-tests/types";

const shell: PracticeTestPathwayClientShell = {
  id: "us-rn-nclex-rn",
  countrySlug: "us",
  roleTrack: "rn",
  examCode: "nclex-rn",
  shortName: "RN",
  examFamily: "NCLEX_RN",
};

beforeEach(() => {
  __resetCatDirectLaunchSessionInflightForTests();
});

describe("runCatDirectLaunchSessionOnce", () => {
  it("dedupes parallel callers into one readiness and one POST", async () => {
    let readinessCalls = 0;
    let postCalls = 0;
    const fetchImpl: typeof fetch = async (input, init) => {
      const url = typeof input === "string" ? input : input.url;
      if (url.includes("cat-readiness")) {
        readinessCalls += 1;
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
      }
      if (url.includes("/api/practice-tests") && init?.method === "POST") {
        postCalls += 1;
        await new Promise((r) => setTimeout(r, 15));
        return new Response(JSON.stringify({ id: "test-session-1" }), { status: 201 });
      }
      return new Response("not found", { status: 404 });
    };

    const [a, b] = await Promise.all([
      runCatDirectLaunchSessionOnce("us-rn-nclex-rn", shell, fetchImpl),
      runCatDirectLaunchSessionOnce("us-rn-nclex-rn", shell, fetchImpl),
    ]);
    assert.equal(a.ok, true);
    assert.equal(b.ok, true);
    if (a.ok && b.ok) {
      assert.equal(a.practiceTestId, "test-session-1");
      assert.equal(b.practiceTestId, "test-session-1");
    }
    assert.equal(readinessCalls, 1);
    assert.equal(postCalls, 1);
  });
});
