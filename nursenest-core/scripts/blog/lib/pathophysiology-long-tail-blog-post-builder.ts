/**
 * Long-form HTML and JSON fields for pathophysiology long-tail blog seeding.
 * Shapes payloads to satisfy {@link validateBlogPrePublish} and {@link collectBlogGeneratedDraftQualityIssues}.
 */
import { BlogImageStatus, BlogPostTemplate, type Prisma } from "@prisma/client";

import { resolveCanonicalSiteOrigin } from "../../../src/lib/seo/canonical-site";
import { BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH, countWordsFromHtml } from "../../../src/lib/blog/blog-word-count";

import {
  PATHOPHYSIOLOGY_LONG_TAIL_200_LEGACY_SOURCE,
  type PathophysiologyLongTailTopicPlan,
} from "../pathophysiology-long-tail-200-topic-plan";

export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export type PeerBlogStub = { slug: string; title: string; excerpt: string };

function paragraphBlock(topic: PathophysiologyLongTailTopicPlan, label: string): string {
  const t = esc(topic.title);
  const sys = esc(topic.bodySystem);
  const kw = esc(topic.targetKeyword);
  const af = esc(topic.anchorFocus);
  return `<p><strong>${esc(label)}.</strong> This section supports learners studying “${t}” with a ${sys} lens and keyword framing around ${kw}. We centre ${af} as the organising idea, connect bedside cues to underlying physiology, and keep language cautious: individual presentation varies, local protocols differ, and this article is educational rather than personalised medical advice. Exam writers often reward mechanism-to-intervention chains, so we name compensatory responses, typical laboratory trajectories, and escalation thresholds without overpromising diagnosis or treatment outcomes.</p>`;
}

function pad(topic: PathophysiologyLongTailTopicPlan, label: string): string {
  return `${paragraphBlock(topic, label)}${paragraphBlock(topic, `${label} (deeper)`)}${paragraphBlock(topic, `${label} (application)`)}`;
}

export function buildFaqItems(topic: PathophysiologyLongTailTopicPlan): { q: string; a: string }[] {
  const af = esc(topic.anchorFocus);
  return [
    {
      q: `What is the safest way to study ${af} for nursing exams?`,
      a: `Build a mechanism-first outline: triggers, compensatory responses, predictable assessment changes, monitoring priorities, and escalation criteria. Pair each step with one parameter you would trend at the bedside and one question you would ask at handover.`,
    },
    {
      q: `Which assessment findings most often reflect worsening in ${af}?`,
      a: `Look for trends rather than single values: work of breathing, perfusion, mentation, urine output, pain pattern changes, new arrhythmias, and laboratory shifts that do not match the expected trajectory for the current plan of care.`,
    },
    {
      q: `How should I separate similar presentations on exam items?`,
      a: `Slow down and identify what the stem emphasises: onset timing, trajectory, risk factors, setting, and complications. Then map each option to the mechanism it assumes rather than choosing the most familiar label.`,
    },
    {
      q: `When is escalation appropriate for patients with patterns like ${af}?`,
      a: `Escalate when data suggest instability or risk beyond ward-level monitoring: refractory symptoms, rapid trajectory change, new organ dysfunction, or uncertainty that threatens safety. Always follow orders, scope, and facility policy.`,
    },
    {
      q: `What should patient and client education emphasise for this topic?`,
      a: `Use plain language about warning symptoms, medication adherence where relevant, follow-up expectations, and when to seek urgent care. Avoid guarantees; reinforce personalised follow-up with licensed clinicians.`,
    },
    {
      q: `How can allied team members contribute without overstepping scope?`,
      a: `Allied roles can strengthen monitoring, rehabilitation, diagnostics, and communication while respecting nursing and medical leadership. Document objectively, report changes early, and use structured handoffs.`,
    },
  ];
}

export function excerptFromBodyHtml(html: string, fallbackTitle: string): string {
  const plain = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const first = plain.slice(0, 240);
  return first.length >= 120 ? `${first}…` : `${fallbackTitle.slice(0, 200)} — long-form pathophysiology review for nursing exam preparation.`;
}

export function buildSchemaSummary(topic: PathophysiologyLongTailTopicPlan, excerpt: string, origin: string): string {
  const base = origin.replace(/\/$/, "");
  const url = `${base}/blog/${topic.slug}`;
  return JSON.stringify({
    schemaOpportunities: [
      { type: "BlogPosting", rationale: "Canonical long-form nursing education article." },
      { type: "BreadcrumbList", rationale: "Home, blog index, article." },
      { type: "FAQPage", rationale: "Structured learner FAQs when emitFaqSchema is enabled." },
    ],
    emitFaqSchema: true,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: topic.title.slice(0, 80), href: `/blog/${topic.slug}` },
    ],
    canonicalUrl: url,
    description: excerpt.slice(0, 200),
  });
}

export function buildInternalLinkPlan(args: {
  topic: PathophysiologyLongTailTopicPlan;
  peers: PeerBlogStub[];
}): Prisma.InputJsonValue {
  const { topic, peers } = args;
  const related = peers.slice(0, 4).map((p) => ({
    slug: p.slug,
    title: p.title.slice(0, 200),
    excerpt: p.excerpt.slice(0, 400),
  }));
  const publishedIso = new Date().toISOString();
  return {
    lessons: [],
    seo: {
      version: 1,
      normalizedBreadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: topic.title.slice(0, 72), href: `/blog/${topic.slug}` },
      ],
      suggestedExcerpt: topic.metaDescription.slice(0, 200),
      emitFaqSchema: true,
      focusKeywords: [topic.targetKeyword.split(" ").slice(0, 4).join(" ")],
      primaryKeyword: topic.targetKeyword.slice(0, 120),
      imageAlts: [],
    },
    publishingPackage: {
      version: 1,
      updatedAt: publishedIso,
      internalAnchorOpportunities: [
        {
          phrase: topic.anchorFocus,
          suggestedAnchorText: "practice questions hub",
          targetSuggestedPath: "/question-bank",
          rationale: "Apply mechanisms in verified question practice.",
        },
        {
          phrase: "exam preparation",
          suggestedAnchorText: "NurseNest blog index",
          targetSuggestedPath: "/blog",
          rationale: "Browse adjacent long-tail study articles.",
        },
      ],
      relatedBlogPosts: related,
    },
    generationContractV1: {
      version: 1,
      primaryKeyword: topic.targetKeyword.slice(0, 120),
      recommendedInternalLinks: [
        {
          targetType: "tool",
          suggestedPath: "/question-bank",
          anchorText: "question bank practice",
        },
      ],
      sourceCandidates: [],
      needsReviewFlags: [],
      schemaNotes: {
        article: { type: "BlogPosting", headline: topic.title.slice(0, 110) },
        breadcrumb: { levels: 3, includesBlog: true },
        faq: { enabled: true, minItems: 6 },
      },
    },
  };
}

export function buildLongTailPathophysiologyBody(topic: PathophysiologyLongTailTopicPlan, peerLinksHtml: string): string {
  const h1 = `<h1>${esc(topic.title)}</h1>`;
  const disclaimer = `<p><em>This article is for nursing and allied health education and exam preparation. It is not personalised medical advice, diagnosis, or treatment. Always follow local scope of practice, orders, institutional policy, and Canadian or regional regulatory expectations.</em></p>`;
  const internal = `<p><strong>Study next on NurseNest.</strong> ${peerLinksHtml} You can also explore the <a href="/question-bank">question bank</a> and the <a href="/blog">blog index</a> for adjacent topics.</p>`;

  return [
    h1,
    disclaimer,
    internal,
    `<h2>Introduction</h2>`,
    pad(topic, "Orientation to the clinical problem"),
    `<h2>Pathophysiology mechanism</h2>`,
    pad(topic, "Mechanistic explanation"),
    `<h2>Signs and symptoms</h2>`,
    pad(topic, "Clinical presentation patterns"),
    `<h2>Diagnostics, laboratories, and imaging</h2>`,
    pad(topic, "Objective data interpretation"),
    `<h2>Treatment overview</h2>`,
    pad(topic, "Evidence-informed direction without prescribing"),
    `<h2>Nursing implications for practice</h2>`,
    pad(topic, "Priorities, monitoring, and collaboration"),
    `<h2>Clinical pearls</h2>`,
    pad(topic, "High-yield connections"),
    `<h2>Common exam traps</h2>`,
    pad(topic, "Distractors and discrimination"),
    `<h2>Patient and client education</h2>`,
    pad(topic, "Teach-back friendly language"),
    `<h2>Summary</h2>`,
    paragraphBlock(topic, "Consolidated takeaways"),
    `<h2>Frequently asked questions</h2>`,
    ...buildFaqItems(topic).map((item) => `<h3>${esc(item.q)}</h3><p>${esc(item.a)}</p>`),
    `<p><strong>Canonical URL path:</strong> <code>${esc(`/blog/${topic.slug}`)}</code></p>`,
  ].join("\n");
}

export function validateLongTailSeedBody(html: string, title: string): { ok: true } | { ok: false; reasons: string[] } {
  const reasons: string[] = [];
  const words = countWordsFromHtml(html);
  if (words < BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH) {
    reasons.push(`body_word_count_below_${BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH}`);
  }
  if (!html.includes("<h1>")) reasons.push("missing_h1");
  const h1m = html.match(/<h1>([^<]*)<\/h1>/i);
  if (!h1m || h1m[1]!.trim() !== title.trim()) reasons.push("h1_title_mismatch");
  const lower = html.toLowerCase();
  const requiredH2Substrings = [
    "pathophysiology mechanism",
    "signs and symptoms",
    "diagnostics, laboratories, and imaging",
    "treatment overview",
    "nursing implications for practice",
    "clinical pearls",
    "common exam traps",
    "patient and client education",
  ];
  for (const h of requiredH2Substrings) {
    if (!lower.includes(`<h2>${h}</h2>`)) reasons.push(`missing_section:${h}`);
  }
  if ((html.match(/<h3\b/gi) ?? []).length < 5) reasons.push("faq_h3_low");
  if (/\b(TODO|TBD|\{\{|\[\[|Lorem ipsum|PLACEHOLDER)\b/i.test(html)) reasons.push("placeholder_language");
  if (/\u2014/.test(html)) reasons.push("em_dash_present");
  return reasons.length ? { ok: false, reasons } : { ok: true };
}

export function resolveSiteOrigin(): string {
  return resolveCanonicalSiteOrigin();
}

export function buildCreatePayload(args: {
  topic: PathophysiologyLongTailTopicPlan;
  peers: PeerBlogStub[];
  keywordCluster: string;
}): {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
  category: string;
  exam: string | null;
  careerSlug: string | null;
  locale: string;
  seoTitle: string;
  seoDescription: string;
  targetKeyword: string;
  keywordCluster: string;
  keywordPlan: string[];
  postTemplate: BlogPostTemplate;
  faqBlock: Prisma.InputJsonValue;
  internalLinkPlan: Prisma.InputJsonValue;
  schemaSummary: string;
  requiresReferences: boolean;
  apaReferences: string[];
  sourcesJson: Prisma.InputJsonValue;
  keyQuestions: string[];
  legacySource: string;
  imageStatus: BlogImageStatus;
  medicalRiskFlags: string[];
} {
  const { topic, peers, keywordCluster } = args;
  const peerHtml =
    peers.length > 0
      ? `Related articles: ${peers
          .slice(0, 3)
          .map((p) => `<a href="/blog/${esc(p.slug)}">${esc(p.title.length > 70 ? `${p.title.slice(0, 67)}…` : p.title)}</a>`)
          .join(", ")}.`
      : "Browse additional pathophysiology articles from the blog index once more posts are published in your environment.";
  const body = buildLongTailPathophysiologyBody(topic, peerHtml);
  const excerpt = excerptFromBodyHtml(body, topic.title);
  const origin = resolveSiteOrigin();
  const schemaSummary = buildSchemaSummary(topic, excerpt, origin);
  const faqItems = buildFaqItems(topic);
  const faqBlock: Prisma.InputJsonValue = { items: faqItems.map((x) => ({ q: x.q, a: x.a })) };
  const internalLinkPlan = buildInternalLinkPlan({ topic, peers });

  const tags = Array.from(
    new Set(
      [
        "pathophysiology",
        "long-tail",
        topic.tier.toLowerCase(),
        topic.bodySystem.toLowerCase(),
        "nursing",
        "nurse education",
        topic.exam?.toLowerCase() ?? "",
        topic.careerSlug ?? "",
      ].filter(Boolean),
    ),
  );

  return {
    slug: topic.slug,
    title: topic.title.slice(0, 200),
    excerpt: excerpt.slice(0, 500),
    body,
    tags,
    category: topic.category,
    exam: topic.exam,
    careerSlug: topic.careerSlug,
    locale: "en",
    seoTitle: topic.seoTitle.slice(0, 200),
    seoDescription: topic.metaDescription.slice(0, 200),
    targetKeyword: topic.targetKeyword.slice(0, 200),
    keywordCluster,
    keywordPlan: [topic.bodySystem, topic.tier, "pathophysiology"],
    postTemplate: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
    faqBlock,
    internalLinkPlan,
    schemaSummary,
    requiresReferences: false,
    apaReferences: [],
    sourcesJson: {
      version: 2,
      verified: [],
      excluded: [],
      generatedAt: new Date().toISOString(),
    } as Prisma.InputJsonValue,
    keyQuestions: faqItems.slice(0, 4).map((x) => x.q),
    legacySource: PATHOPHYSIOLOGY_LONG_TAIL_200_LEGACY_SOURCE,
    imageStatus: BlogImageStatus.NONE,
    medicalRiskFlags: [],
  };
}
