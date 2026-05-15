import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const appRoot = path.join(process.cwd(), "src/app/(marketing)/(default)");

test("RPN authority-path study surface aliases redirect to canonical PN product hubs", () => {
  const aliases = [
    ["/canada/rpn/rex-pn/lessons", "/canada/pn/rex-pn/lessons"],
    ["/canada/rpn/rex-pn/flashcards", "/canada/pn/rex-pn/flashcards"],
    ["/canada/rpn/rex-pn/pricing", "/canada/pn/rex-pn/pricing"],
  ] as const;

  for (const [alias, destination] of aliases) {
    const file = path.join(appRoot, ...alias.split("/").filter(Boolean), "page.tsx");
    assert.ok(fs.existsSync(file), `missing route alias file for ${alias}`);
    assert.match(fs.readFileSync(file, "utf8"), new RegExp(destination.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
