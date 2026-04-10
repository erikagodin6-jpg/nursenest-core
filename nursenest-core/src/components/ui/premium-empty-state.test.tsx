import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { BookOpen } from "lucide-react";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";

describe("PremiumEmptyState", () => {
  it("renders primary and secondary hrefs; sanitizes unsafe primary to fallback", () => {
    const html = renderToStaticMarkup(
      <PremiumEmptyState
        headline="H"
        body="B"
        visualLayout="split"
        Icon={BookOpen}
        primaryCta={{ label: "Go", href: "//bad", variant: "primary" }}
        secondaryCtas={[{ label: "More", href: "/safe", variant: "secondary" }]}
        primaryShowArrow
      />,
    );
    assert.match(html, /href="\/"/);
    assert.match(html, /href="\/safe"/);
  });

  it("supports stack layout without icon", () => {
    const html = renderToStaticMarkup(
      <PremiumEmptyState headline="H" body="B" primaryCta={{ label: "Go", href: "/ok" }} tone="early" density="compact" />,
    );
    assert.match(html, /href="\/ok"/);
    assert.match(html, /data-nn-premium-empty/);
  });

  it("sanitizes unsafe secondary CTAs to home fallback", () => {
    const html = renderToStaticMarkup(
      <PremiumEmptyState
        headline="H"
        body="B"
        primaryCta={{ label: "P", href: "/fine" }}
        secondaryCtas={[{ label: "X", href: "//evil" }]}
      />,
    );
    assert.match(html, /href="\/fine"/);
    assert.match(html, /href="\/"/);
  });
});
