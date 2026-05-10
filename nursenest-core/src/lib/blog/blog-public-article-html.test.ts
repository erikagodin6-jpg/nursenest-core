import assert from "node:assert/strict";
import test from "node:test";
import {
  extractFaqPairsFromFaqSchemaSectionHtml,
  looksLikeEngineBlogSchemaSummaryJson,
  publicBlogClinicalBlurb,
  sanitizePublicBlogBodyHtml,
} from "@/lib/blog/blog-public-article-html";
import { getBlogStaticLongtailRecord } from "@/lib/blog/blog-static-longtail-load";

test("looksLikeEngineBlogSchemaSummaryJson detects generator schemaSummary payloads", () => {
  assert.equal(
    looksLikeEngineBlogSchemaSummaryJson(
      JSON.stringify({
        emitFaqSchema: true,
        breadcrumbs: [{ label: "Home", href: "/" }],
      }),
    ),
    true,
  );
  assert.equal(
    looksLikeEngineBlogSchemaSummaryJson(
      JSON.stringify({
        version: 5,
        type: "BlogPosting",
        breadcrumbs: [],
      }),
    ),
    true,
  );
  assert.equal(looksLikeEngineBlogSchemaSummaryJson("Plain clinical overview text."), false);
});

test("publicBlogClinicalBlurb never returns raw engine JSON; prefers shortSummary then SEO excerpt", () => {
  const json = JSON.stringify({ emitFaqSchema: true, schemaOpportunities: [] });
  assert.equal(
    publicBlogClinicalBlurb({
      shortSummary: null,
      schemaSummary: json,
      seoSuggestedExcerpt: "Learner-facing excerpt from SEO bundle.",
    }),
    "Learner-facing excerpt from SEO bundle.",
  );
  assert.equal(
    publicBlogClinicalBlurb({
      shortSummary: "Human short summary.",
      schemaSummary: json,
      seoSuggestedExcerpt: null,
    }),
    "Human short summary.",
  );
  assert.equal(
    publicBlogClinicalBlurb({
      shortSummary: "```json\n" + json + "\n```",
      schemaSummary: null,
      seoSuggestedExcerpt: "Fence-wrapped JSON in shortSummary should not surface.",
    }),
    "Fence-wrapped JSON in shortSummary should not surface.",
  );
});

test("sanitizePublicBlogBodyHtml renames pipeline headings and screen-readers FAQ title", () => {
  const raw = `<h2>Suggested internal links</h2><ul><li><a href="/blog/x">x</a></li></ul>
<h2>Premium lesson CTA</h2><p>Study loop</p>
<h2>FAQ Schema Questions</h2><h3>Q1?</h3><p>A1.</p>`;
  const out = sanitizePublicBlogBodyHtml(raw, { hasStructuredApaReferences: false });
  assert.match(out, /Related reading/);
  assert.match(out, /Study with NurseNest/);
  assert.match(out, /nn-blog-related-reading-card/);
  assert.match(out, /nn-blog-study-cta-card/);
  assert.match(out, /<details class="nn-blog-public-faq-item/);
  assert.match(out, /<summary[^>]*>Q1\?/);
  assert.ok(!/Suggested internal links/i.test(out));
  assert.ok(!/Premium lesson CTA/i.test(out));
  assert.ok(!/FAQ Schema Questions/i.test(out));
});

test("sanitizePublicBlogBodyHtml strips engine JSON paragraphs and editorial/breadcrumb scaffold H2s", () => {
  const json = JSON.stringify({ emitFaqSchema: true, schemaOpportunities: [{ type: "BlogPosting", rationale: "x" }] });
  const raw = `<h2>Intro</h2><p>OK.</p><p>${json.replace(/</g, "&lt;")}</p>
<h2>Editorial status: published</h2><p>Internal only.</p>
<h2>Breadcrumbs</h2><pre>{"@type":"BreadcrumbList"}</pre>
<h2>Done</h2><p>End.</p>`;
  const out = sanitizePublicBlogBodyHtml(raw, { hasStructuredApaReferences: false });
  assert.ok(!/emitFaqSchema/.test(out));
  assert.ok(!/Editorial status/i.test(out));
  assert.ok(!/BreadcrumbList/.test(out));
  assert.match(out, /<h2>Intro<\/h2>/);
  assert.match(out, /<h2>Done<\/h2>/);
});

test("sanitizePublicBlogBodyHtml strips first APA reference block when structured apaReferences render", () => {
  const raw = `<h2>Core</h2><p>Body.</p><h2>APA-7 References</h2><p>Smith (2020).</p><h2>More</h2><p>End.</p>`;
  const out = sanitizePublicBlogBodyHtml(raw, { hasStructuredApaReferences: true });
  assert.ok(!/APA-7 References/i.test(out));
  assert.ok(!/Smith \(2020\)/.test(out));
  assert.match(out, /<h2>Core<\/h2>/);
  assert.match(out, /<h2>More<\/h2>/);
});

test("sanitizePublicBlogBodyHtml strips plain References H2 when page-level apaReferences exist", () => {
  const raw = `<h2>Core</h2><p>Body.</p><h2>References</h2><p>Smith (2020).</p><h2>More</h2>`;
  const out = sanitizePublicBlogBodyHtml(raw, { hasStructuredApaReferences: true });
  assert.ok(!/<h2[^>]*>References<\/h2>/i.test(out));
  assert.ok(!/Smith \(2020\)/.test(out));
});

test("stroke-ischemic-vs-hemorrhagic long-tail: scaffold becomes cards + FAQ accordion", () => {
  const r = getBlogStaticLongtailRecord("stroke-ischemic-vs-hemorrhagic-nursing-care");
  assert.ok(r, "expected long-tail record");
  const out = sanitizePublicBlogBodyHtml(r!.bodyHtml, { hasStructuredApaReferences: false });
  assert.ok(!/FAQ Schema Questions/i.test(out));
  assert.ok(!/Suggested internal links/i.test(out));
  assert.ok(!/Premium lesson CTA/i.test(out));
  assert.match(out, /nn-blog-related-reading-card/);
  assert.match(out, /nn-blog-study-cta-card/);
  assert.match(out, /nn-blog-public-faq/);
  assert.match(out, /References \(APA 7\)/);
});

test("extractFaqPairsFromFaqSchemaSectionHtml reads h3/p pairs under FAQ scaffold heading", () => {
  const raw = `<h2>FAQ Schema Questions</h2><h3>What is LKW?</h3><p>Baseline time.</p><h3>Why CT?</h3><p>Rule out bleed.</p><h2>Done</h2>`;
  const items = extractFaqPairsFromFaqSchemaSectionHtml(raw);
  assert.equal(items.length, 2);
  assert.equal(items[0]?.q, "What is LKW?");
  assert.equal(items[1]?.q, "Why CT?");
});
