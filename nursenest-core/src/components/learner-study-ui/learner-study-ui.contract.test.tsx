import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import React from "react";

(globalThis as unknown as { React?: typeof React }).React = React;
import { renderToStaticMarkup } from "react-dom/server";
import {
  LearnerStudyHero,
  LearnerStudyPageShell,
} from "@/components/learner-study-ui";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("learner-study-ui", () => {
  it("LearnerStudyPageShell exposes stable shell marker for hubs", () => {
    const html = renderToStaticMarkup(
      <LearnerStudyPageShell>
        <p>child</p>
      </LearnerStudyPageShell>,
    );
    assert.match(html, /data-nn-learner-study-page-shell/);
    assert.match(html, /max-w-6xl/);
  });

  it("LearnerStudyHero uses semantic foreground tokens (no text-white)", () => {
    const html = renderToStaticMarkup(
      <LearnerStudyHero title="Practice" subtitle="Body-system first" stats={<span>1</span>} />,
    );
    assert.match(html, /text-foreground/);
    assert.doesNotMatch(html, /text-white/);
  });

  it("learner-study-ui sources avoid text-white on bg-card (contrast guard)", () => {
    const dir = __dirname;
    for (const name of readdirSync(dir)) {
      if (!name.endsWith(".tsx") || name.endsWith(".test.tsx")) continue;
      const src = readFileSync(join(dir, name), "utf8");
      if (!src.includes("bg-card")) continue;
      const lines = src.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]!;
        if (line.includes("text-white") && line.includes("bg-card")) {
          assert.fail(`Forbidden text-white + bg-card on same line in ${name}:${i + 1}`);
        }
      }
    }
  });
});
