"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { ADMIN_BLOG_TARGET_EXAM_OPTIONS } from "@/lib/marketing/blog-admin-exam-options";
import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import { parseBlogSeoBundle } from "@/lib/blog/blog-seo-automation";
import { formatAdminRateLimitMessageFromJson } from "@/lib/admin/format-admin-rate-limit-message";
import { useAdminAiGenerationGate } from "@/components/admin/admin-ai-generation-context";

const templates = Object.values(BlogPostTemplate);

type PostPayload = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  seoTitle: string | null;
  seoDescription: string | null;
  outlineJson: unknown;
  faqBlock: unknown;
  internalLinkPlan: unknown;
  apaReferences: string[];
  schemaSummary: string | null;
  workflowStatus?: string | null;
  medicalRiskFlags?: string[];
  coverImagePrompt?: string | null;
  coverImageAlt?: string | null;
  postStatus: string;
};

function PackageSection({
  title,
  children,
  review,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  review?: boolean;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4 shadow-sm ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2">
        <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">{title}</h3>
        {review ? (
          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-900 dark:text-amber-100">
            Review
          </span>
        ) : null}
      </div>
      <div className="mt-3 text-sm text-muted-foreground">{children}</div>
    </section>
  );
}

export function AdminBlogStudioClient() {
  const aiGate = useAdminAiGenerationGate();
  const [topic, setTopic] = useState("");
  const [exam, setExam] = useState(ADMIN_BLOG_TARGET_EXAM_OPTIONS[0].value);
  const [country, setCountry] = useState<"US" | "CA" | "unspecified">("unspecified");
  const [keywords, setKeywords] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [keywordCluster, setKeywordCluster] = useState("");
  const [template, setTemplate] = useState<BlogPostTemplate>(BlogPostTemplate.TOPIC_EXPLAINED);
  const [intent, setIntent] = useState<BlogPostIntent>(BlogPostIntent.EXAM_PREP);
  const [funnelStage, setFunnelStage] = useState<BlogFunnelStage>(BlogFunnelStage.CONSIDERATION);
  const [tone, setTone] = useState<"professional" | "supportive" | "direct">("professional");
  const [includeImage, setIncludeImage] = useState(true);
  const [includeAiImage, setIncludeAiImage] = useState(false);
  const [fixedSlug, setFixedSlug] = useState("");
  const [sourceRecordsJson, setSourceRecordsJson] = useState("[]");
  const [allowInsufficientCitations, setAllowInsufficientCitations] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [plan, setPlan] = useState<BlogControlPanelPlan | null>(null);
  const [post, setPost] = useState<PostPayload | null>(null);
  const [prePub, setPrePub] = useState<{ okToPublish: boolean; blocking: unknown[]; warnings: unknown[] } | null>(null);
  const [prePubErr, setPrePubErr] = useState<string | null>(null);

  const resetResult = useCallback(() => {
    setPlan(null);
    setPost(null);
    setWarnings([]);
    setPrePub(null);
    setPrePubErr(null);
  }, []);

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    resetResult();
    try {
      let sourceRecords: unknown[] | undefined;
      try {
        const parsed = JSON.parse(sourceRecordsJson.trim() || "[]");
        sourceRecords = Array.isArray(parsed) ? parsed : undefined;
      } catch {
        setErr("Source records must be valid JSON array (use [] if none).");
        setBusy(false);
        return;
      }
      const res = await fetch("/api/admin/blog/control-panel/generate", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          exam,
          country,
          keywords: keywords || undefined,
          targetKeyword: targetKeyword || undefined,
          keywordCluster: keywordCluster || undefined,
          template,
          intent,
          funnelStage,
          tone,
          includeImage,
          includeAiImage,
          fixedSlug: fixedSlug.trim() || undefined,
          sourceRecords,
          allowInsufficientCitations: allowInsufficientCitations || undefined,
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        message?: string;
        plan?: BlogControlPanelPlan;
        post?: PostPayload;
        warnings?: string[];
        hint?: string;
        existingSlug?: string;
      };
      if (res.status === 409) {
        setErr(json.hint ?? `Duplicate topic — see ${json.existingSlug ?? "existing post"}.`);
        return;
      }
      if (res.status === 422) {
        setErr(json.message ?? json.error ?? "Citation gate blocked save. Add verified sources or allow override.");
        if (json.plan) setPlan(json.plan);
        return;
      }
      if (!res.ok) {
        setErr(
          res.status === 429
            ? formatAdminRateLimitMessageFromJson(json)
            : (json.message ?? json.error ?? "Generation failed"),
        );
        if (json.plan) setPlan(json.plan);
        return;
      }
      if (json.post) {
        setPost(json.post);
        setPlan(json.plan ?? null);
        setWarnings(json.warnings ?? []);
      } else {
        setErr("No post returned — check API logs.");
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function runPrePublishCheck() {
    if (!post?.id) return;
    setPrePubErr(null);
    setPrePub(null);
    try {
      const res = await fetch(`/api/admin/blog/${post.id}/pre-publish-validation`, {
        cache: "no-store",
        credentials: "include",
      });
      const json = (await res.json()) as {
        prePublish?: { okToPublish: boolean; blocking: unknown[]; warnings: unknown[] };
        error?: string;
      };
      if (!res.ok) {
        setPrePubErr(json.error ?? "Validation failed");
        return;
      }
      if (json.prePublish) setPrePub(json.prePublish);
    } catch (e) {
      setPrePubErr(e instanceof Error ? e.message : String(e));
    }
  }

  const seo = post?.internalLinkPlan
    ? parseBlogSeoBundle((post.internalLinkPlan as { seo?: unknown }).seo)
    : null;

  type SchemaSummaryJson = {
    version?: number;
    emitFaqSchema?: boolean;
    schemaOpportunities?: Array<{ type: string; rationale: string }>;
  };
  let schemaParsed: SchemaSummaryJson | null = null;
  if (post?.schemaSummary) {
    try {
      schemaParsed = JSON.parse(post.schemaSummary) as SchemaSummaryJson;
    } catch {
      schemaParsed = null;
    }
  }

  const faqItems = (post?.faqBlock as { items?: { q: string; a: string }[] } | null)?.items ?? [];

  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] via-transparent to-emerald-500/[0.04] p-6">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Topic → structured package → draft</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Uses the same two-stage pipeline as the{" "}
          <Link href="/admin/blog/control-panel" className="font-semibold text-primary underline">
            AI control panel
          </Link>
          : editorial JSON plan, then HTML body, then a real <code className="rounded bg-muted px-1">DRAFT</code> row. Add verified
          sources (HTTPS or DOI + metadata) to satisfy the citation gate on high-risk topics. Future locales: store English first;
          translate from approved <code className="rounded bg-muted px-1">BlogPost</code> rows.
        </p>
      </div>

      <form onSubmit={onGenerate} className="grid gap-6 rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] p-6 lg:grid-cols-2">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">1. Brief</h2>
        </div>
        <label className="block space-y-1 lg:col-span-2">
          <span className="text-xs font-medium text-muted-foreground">Topic *</span>
          <input
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            minLength={3}
            placeholder="e.g. SpO2 interpretation before NCLEX-style prioritization"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Exam / track *</span>
          <select className="w-full rounded-lg border border-border px-3 py-2 text-sm" value={exam} onChange={(e) => setExam(e.target.value)}>
            {ADMIN_BLOG_TARGET_EXAM_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Country context</span>
          <select
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            value={country}
            onChange={(e) => setCountry(e.target.value as typeof country)}
          >
            <option value="unspecified">Unspecified</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
          </select>
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Template</span>
          <select
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            value={template}
            onChange={(e) => setTemplate(e.target.value as BlogPostTemplate)}
          >
            {templates.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Intent / funnel / tone</span>
          <div className="flex flex-wrap gap-2">
            <select
              className="min-w-0 flex-1 rounded-lg border border-border px-2 py-2 text-xs"
              value={intent}
              onChange={(e) => setIntent(e.target.value as BlogPostIntent)}
            >
              {Object.values(BlogPostIntent).map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
            <select
              className="min-w-0 flex-1 rounded-lg border border-border px-2 py-2 text-xs"
              value={funnelStage}
              onChange={(e) => setFunnelStage(e.target.value as BlogFunnelStage)}
            >
              {Object.values(BlogFunnelStage).map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
            <select
              className="min-w-0 flex-1 rounded-lg border border-border px-2 py-2 text-xs"
              value={tone}
              onChange={(e) => setTone(e.target.value as typeof tone)}
            >
              <option value="professional">Professional</option>
              <option value="supportive">Supportive</option>
              <option value="direct">Direct</option>
            </select>
          </div>
        </label>
        <label className="block space-y-1 lg:col-span-2">
          <span className="text-xs font-medium text-muted-foreground">Keywords (comma-separated)</span>
          <input
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="optional"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Primary keyword</span>
          <input className="w-full rounded-lg border border-border px-3 py-2 text-sm" value={targetKeyword} onChange={(e) => setTargetKeyword(e.target.value)} />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Keyword cluster</span>
          <input className="w-full rounded-lg border border-border px-3 py-2 text-sm" value={keywordCluster} onChange={(e) => setKeywordCluster(e.target.value)} />
        </label>
        <label className="block space-y-1 lg:col-span-2">
          <span className="text-xs font-medium text-muted-foreground">Optional slug (kebab-case)</span>
          <input
            className="w-full rounded-lg border border-border px-3 py-2 text-sm font-mono text-xs"
            value={fixedSlug}
            onChange={(e) => setFixedSlug(e.target.value)}
            placeholder="auto if empty"
          />
        </label>
        <label className="flex items-center gap-2 text-sm lg:col-span-2">
          <input type="checkbox" checked={includeImage} onChange={(e) => setIncludeImage(e.target.checked)} />
          Plan hero / inline image slots (prompts + alt ideas)
        </label>
        <label className="flex items-center gap-2 text-sm lg:col-span-2">
          <input type="checkbox" checked={includeAiImage} onChange={(e) => setIncludeAiImage(e.target.checked)} />
          Request AI hero generation (stores prompt; run image workflow separately)
        </label>
        <label className="block space-y-1 lg:col-span-2">
          <span className="text-xs font-medium text-muted-foreground">Verified sources JSON (APA inputs)</span>
          <textarea
            className="min-h-[100px] w-full rounded-lg border border-border px-3 py-2 font-mono text-xs"
            value={sourceRecordsJson}
            onChange={(e) => setSourceRecordsJson(e.target.value)}
            placeholder='[{"title":"...","year":"2024","url":"https://..."}]'
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-amber-900 dark:text-amber-100 lg:col-span-2">
          <input type="checkbox" checked={allowInsufficientCitations} onChange={(e) => setAllowInsufficientCitations(e.target.checked)} />
          Allow save without verified citations (high-risk topics — not recommended)
        </label>
        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={busy || !aiGate.runnable}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Generating…" : "Generate article package"}
          </button>
        </div>
        {err ? <p className="lg:col-span-2 text-sm text-rose-700">{err}</p> : null}
      </form>

      {warnings.length > 0 ? (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          <p className="font-semibold text-amber-950 dark:text-amber-50">Warnings</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
            {warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {post ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">2. Generated package</h2>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/admin/blog/control-panel?id=${encodeURIComponent(post.id)}`}
                className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm font-semibold hover:bg-muted/50"
              >
                Open in full editor
              </Link>
              <Link href={`/blog/${post.slug}`} className="rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-muted/50" target="_blank" rel="noreferrer">
                Preview public URL
              </Link>
              <button type="button" onClick={runPrePublishCheck} className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
                Run publish validation
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Post ID: <code className="rounded bg-muted px-1">{post.id}</code> · Status: {post.postStatus} · Workflow: {post.workflowStatus ?? "—"}
          </p>
          {prePubErr ? <p className="text-sm text-rose-700">{prePubErr}</p> : null}
          {prePub ? (
            <div
              className={`rounded-xl border p-4 text-sm ${
                prePub.okToPublish ? "border-emerald-500/40 bg-emerald-500/10" : "border-rose-500/40 bg-rose-500/10"
              }`}
            >
              <p className="font-semibold">{prePub.okToPublish ? "Ready to publish (no blockers)" : "Blocked — fix issues before publish"}</p>
              {prePub.blocking.length > 0 ? (
                <ul className="mt-2 list-inside list-disc">
                  {(prePub.blocking as { message: string }[]).map((b, i) => (
                    <li key={i}>{b.message}</li>
                  ))}
                </ul>
              ) : null}
              {prePub.warnings.length > 0 ? (
                <ul className="mt-2 list-inside list-disc text-muted-foreground">
                  {(prePub.warnings as { message: string }[]).map((b, i) => (
                    <li key={i}>{b.message}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-2">
            <PackageSection title="SEO title (meta)" review>
              <p className="text-foreground">{post.seoTitle ?? "—"}</p>
            </PackageSection>
            <PackageSection title="Meta description" review>
              <p className="text-foreground">{post.seoDescription ?? "—"}</p>
            </PackageSection>
            <PackageSection title="Slug suggestion" review>
              <code className="text-foreground">{post.slug}</code>
            </PackageSection>
            <PackageSection title="H1 (on-page title)" review>
              <p className="text-foreground">{post.title}</p>
            </PackageSection>
            <PackageSection title="Structured outline" review className="lg:col-span-2">
              <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-muted/30 p-3 text-xs text-foreground">
                {JSON.stringify(post.outlineJson, null, 2)}
              </pre>
            </PackageSection>
            <PackageSection title="Full article draft (HTML)" review className="lg:col-span-2">
              <p className="mb-2 text-xs">Length: {post.body.length.toLocaleString()} chars</p>
              <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-muted/30 p-3 text-xs text-foreground">
                {post.body.slice(0, 12000)}
                {post.body.length > 12000 ? "\n… truncated — use full editor for complete body." : ""}
              </pre>
            </PackageSection>
            <PackageSection title="FAQ section" review className="lg:col-span-2">
              {faqItems.length === 0 ? (
                <p>None stored on post.</p>
              ) : (
                <ul className="space-y-3">
                  {faqItems.map((f, i) => (
                    <li key={i}>
                      <strong className="text-foreground">{f.q}</strong>
                      <p className="mt-1 whitespace-pre-wrap">{f.a}</p>
                    </li>
                  ))}
                </ul>
              )}
            </PackageSection>
            <PackageSection title="Breadcrumb recommendations" review className="lg:col-span-2">
              {seo?.normalizedBreadcrumbs?.length ? (
                <ol className="list-inside list-decimal space-y-1 text-foreground">
                  {seo.normalizedBreadcrumbs.map((b, i) => (
                    <li key={i}>
                      {b.label} → <code className="text-xs">{b.href}</code>
                    </li>
                  ))}
                </ol>
              ) : (
                <p>—</p>
              )}
            </PackageSection>
            <PackageSection title="Internal link recommendations" review className="lg:col-span-2">
              <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-muted/30 p-3 text-xs">
                {JSON.stringify((post.internalLinkPlan as { lessons?: unknown })?.lessons ?? [], null, 2)}
              </pre>
            </PackageSection>
            <PackageSection title="Image recommendations & placement" review className="lg:col-span-2">
              <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-muted/30 p-3 text-xs">
                {JSON.stringify((post.internalLinkPlan as { imagePlacements?: unknown })?.imagePlacements ?? [], null, 2)}
              </pre>
              {post.coverImagePrompt ? (
                <p className="mt-2 text-xs">
                  <span className="font-medium text-foreground">Hero prompt: </span>
                  {post.coverImagePrompt}
                </p>
              ) : null}
            </PackageSection>
            <PackageSection title="APA 7 references (verified rows)" review className="lg:col-span-2">
              {post.apaReferences?.length ? (
                <ul className="list-inside list-decimal space-y-1 text-foreground">
                  {post.apaReferences.map((line, i) => (
                    <li key={i} className="whitespace-pre-wrap">
                      {line}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>None yet — add sources JSON and regenerate, or edit in full panel.</p>
              )}
            </PackageSection>
            <PackageSection title="Schema & structured data opportunities" review className="lg:col-span-2">
              <p className="mb-2 text-xs">
                Summary JSON v{schemaParsed?.version ?? "?"} · emit FAQ schema:{" "}
                {String(seo?.emitFaqSchema ?? schemaParsed?.emitFaqSchema ?? false)}
              </p>
              {schemaParsed?.schemaOpportunities?.length ? (
                <ul className="space-y-2">
                  {schemaParsed.schemaOpportunities.map((s: { type: string; rationale: string }, i: number) => (
                    <li key={i}>
                      <strong className="text-foreground">{s.type}</strong>: {s.rationale}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs">No extra opportunities in summary — defaults still include BlogPosting on public templates.</p>
              )}
            </PackageSection>
            <PackageSection
              title="Manual review & guardrails"
              review
              className="lg:col-span-2"
            >
              <ul className="space-y-1">
                <li>
                  Medical / policy flags: {(post.medicalRiskFlags ?? []).join(", ") || "None recorded"}
                </li>
                <li>Requires references flag is enforced by citation gate + editor review before live publish.</li>
                <li>For unsupported clinical claims, edit body in the full panel and add authoritative sources.</li>
              </ul>
            </PackageSection>
          </div>
        </div>
      ) : null}

      {plan && !post ? (
        <div className="rounded-xl border border-sky-500/40 bg-sky-500/10 p-4 text-sm text-foreground">
          <p className="font-semibold">Plan recovered (persist blocked or partial failure)</p>
          <p className="mt-1 text-muted-foreground">Open the control panel to persist draft manually or fix citations.</p>
          <pre className="mt-3 max-h-64 overflow-auto rounded-lg bg-muted/30 p-3 text-xs">{JSON.stringify(plan, null, 2)}</pre>
        </div>
      ) : null}
    </div>
  );
}
