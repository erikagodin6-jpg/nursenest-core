import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

test("screenshot login waits for the hydrated POST login form before submitting", () => {
  const source = fs.readFileSync(new URL("./capture-marketing-screenshots.mjs", import.meta.url), "utf8");

  assert.equal(
    source.includes("await page.waitForFunction("),
    true,
    "capture script should wait for the hydrated login form",
  );
  assert.equal(
    source.includes('return m === "post";'),
    true,
    'capture script should verify the login form method is "post" before clicking submit',
  );
});
