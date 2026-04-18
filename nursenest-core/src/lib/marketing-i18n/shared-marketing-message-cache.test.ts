import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createSharedMarketingMessageCache } from "@/lib/marketing-i18n/shared-marketing-message-cache";

describe("createSharedMarketingMessageCache", () => {
  it("reuses the same in-flight load for the same key", async () => {
    const cache = createSharedMarketingMessageCache<string>();
    let calls = 0;

    const load = async () => {
      calls += 1;
      return "shared-result";
    };

    const [first, second] = await Promise.all([cache.get("pages:en", load), cache.get("pages:en", load)]);

    assert.equal(first, "shared-result");
    assert.equal(second, "shared-result");
    assert.equal(calls, 1);
  });

  it("evicts rejected loads so retries can recover", async () => {
    const cache = createSharedMarketingMessageCache<string>();
    let calls = 0;

    await assert.rejects(
      cache.get("pages:en", async () => {
        calls += 1;
        throw new Error("boom");
      }),
      /boom/,
    );

    const recovered = await cache.get("pages:en", async () => {
      calls += 1;
      return "ok";
    });

    assert.equal(recovered, "ok");
    assert.equal(calls, 2);
  });
});
