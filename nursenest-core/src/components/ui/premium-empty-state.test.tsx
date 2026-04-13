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

  it("renders brand leaf mark when brandMark is leaf and no Icon", () => {
    const html = renderToStaticMarkup(
      <PremiumEmptyState
        headline="H"
        body="B"
        brandMark="leaf"
        primaryCta={{ label: "Go", href: "/ok" }}
        animateEntrance={false}
      />,
    );
    assert.match(html, /viewBox="0 0 50 32"/);
    assert.match(html, /href="\/ok"/);
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

  it("supports custom heading, visual, and stacked CTA layout", () => {
    const html = renderToStaticMarkup(
      <PremiumEmptyState
        headingLevel="h1"
        headline="Heading"
        body="Body"
        visual={<div data-test-visual="leaf" />}
        ctaLayout="stack"
        containerClassName="outer-shell"
        primaryCta={{ label: "Primary", href: "/primary" }}
        secondaryCtas={[{ label: "Secondary", href: "/secondary" }]}
      />,
    );

    assert.match(html, /<h1[^>]*>Heading<\/h1>/);
    assert.match(html, /data-test-visual="leaf"/);
    assert.match(html, /outer-shell/);
    assert.match(html, /w-full sm:w-auto/);
  });
});
