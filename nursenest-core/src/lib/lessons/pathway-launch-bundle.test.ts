import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getLaunchBundleSpec } from "@/lib/lessons/pathway-launch-bundle";

describe("pathway-launch-bundle", () => {
  it("defines a bundle for each core licensure pathway", () => {
    const ids = [
      "us-rn-nclex-rn",
      "ca-rn-nclex-rn",
      "us-lpn-nclex-pn",
      "ca-rpn-rex-pn",
      "us-np-fnp",
      "ca-np-cnple",
    ];
    for (const id of ids) {
      const spec = getLaunchBundleSpec(id);
      assert.ok(spec, `missing bundle for ${id}`);
      assert.ok(spec!.entries.length >= 8, `${id} should list at least 8 intended slugs`);
    }
  });

  it("keeps RN and CA RN bundles aligned", () => {
    const us = getLaunchBundleSpec("us-rn-nclex-rn")!;
    const ca = getLaunchBundleSpec("ca-rn-nclex-rn")!;
    assert.deepEqual(
      us.entries.map((e) => e.slug),
      ca.entries.map((e) => e.slug),
    );
  });
});
