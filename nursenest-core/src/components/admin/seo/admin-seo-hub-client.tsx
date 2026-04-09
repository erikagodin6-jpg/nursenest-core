"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type TabId = "overview" | "metadata" | "slugs" | "linking" | "broken" | "opportunities" | "validate";

const TABS: Array<{ id: TabId; label: string; desc: string }> = [
  { id: "overview", label: "Overview", desc: "Counts & shortcuts" },
  { id: "metadata", label: "Metadata", desc: "Missing titles, descriptions, excerpts" },
  { id: "slugs", label: "Slug library", desc: "Cross-table slug collisions" },
  { id: "linking", label: "Internal linking", desc: "Thin in-body links & related paths" },
  { id: "broken", label: "Broken links", desc: "Blog & lesson hrefs that fail checks" },
  { id: "opportunities", label: "Opportunities", desc: "Suggested improvements" },
  { id: "validate", label: "Validate URL", desc: "Check a path against inventory" },
];

type FullReport = {
  metadata: {
    blogs: unknown[];
    lessons: unknown[];
    pathwayLessons: unknown[];
  };
  slugs: unknown[];
  linking: unknown[];
  broken: unknown[];
  opportunities: unknown[];
  generatedAt: string;
};

export function AdminSeoHubClient() {
  const sp = useSearchParams();
  const tabFromUrl = sp.get("tab") as TabId | null;
  const [tab, setTab] = useState<TabId>(TABS.some((t) => t.id === tabFromUrl) ? tabFromUrl! : "overview");
  const [data, setData] = useState<FullReport | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [validatePath, setValidatePath] = useState("/blog/");
  const [validateBusy, setValidateBusy] = useState(false);
  const [validateResult, setValidateResult] = useState<{ status: string; detail: string; path: string } | null>(null);

  useEffect(() => {
    const t = sp.get("tab") as TabId | null;
    if (t && TABS.some((x) => x.id === t)) setTab(t);
  }, [sp]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/seo/report?kind=all", { cache: "no-store" });
      const j = (await res.json()) as FullReport & { error?: string };
      if (!res.ok) {
        setErr(j.error ?? "Failed to load report");
        setData(null);
        return;
      }
      setData(j);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const stats = useMemo(() => {
    if (!data) return null;
    return {
      metaBlog: data.metadata.blogs.length,
      metaLesson: data.metadata.lessons.length,
      metaPathway: data.metadata.pathwayLessons.length,
      slugCollisions: data.slugs.length,
      weakLinking: data.linking.length,
      broken: data.broken.length,
      opportunities: data.opportunities.length,
    };
  }, [data]);

  async function runValidate() {
    setValidateBusy(true);
    setValidateResult(null);
    try {
      const res = await fetch("/api/admin/seo/validate-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: validatePath.trim() }),
      });
      const j = (await res.json()) as { status?: string; detail?: string; path?: string; error?: string };
      if (!res.ok) {
        setValidateResult({ status: "error", detail: j.error ?? "Request failed", path: validatePath });
        return;
      }
      setValidateResult({
        status: String(j.status ?? ""),
        detail: String(j.detail ?? ""),
        path: String(j.path ?? validatePath),
      });
    } finally {
      setValidateBusy(false);
    }
  }

  function setTabHref(id: TabId) {
    setTab(id);
    const u = new URL(window.location.href);
    u.searchParams.set("tab", id);
    window.history.replaceState(null, "", u.toString());
  }

  return (
    <div className="space-y-8">
      {err ? (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-900 dark:text-rose-100">
          {err}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2 border-b border-border/70 pb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTabHref(t.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              tab === t.id
                ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => void load()}
          className="ml-auto rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted/60"
        >
          Refresh data
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          Running audits…
        </div>
      ) : null}

      {data && tab === "overview" && stats ? (
        <section className="nn-card space-y-4 p-6">
          <p className="text-xs text-muted-foreground">
            Generated {new Date(data.generatedAt).toLocaleString()} · Blog, ContentItem lessons, and pathway lessons are scanned
            server-side.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Metadata gaps (blog)" value={stats.metaBlog} onClick={() => setTabHref("metadata")} />
            <StatCard label="Metadata gaps (app lessons)" value={stats.metaLesson} onClick={() => setTabHref("metadata")} />
            <StatCard label="Metadata gaps (pathway)" value={stats.metaPathway} onClick={() => setTabHref("metadata")} />
            <StatCard label="Slug collisions" value={stats.slugCollisions} onClick={() => setTabHref("slugs")} />
            <StatCard label="Weak internal linking" value={stats.weakLinking} onClick={() => setTabHref("linking")} />
            <StatCard label="Broken internal hrefs" value={stats.broken} onClick={() => setTabHref("broken")} />
            <StatCard label="Link opportunities" value={stats.opportunities} onClick={() => setTabHref("opportunities")} />
          </div>
          <ul className="text-sm text-muted-foreground">
            <li>
              • Fix metadata and slugs in{" "}
              <Link className="font-semibold text-primary underline" href="/admin/blog/control-panel">
                Blog control panel
              </Link>{" "}
              or{" "}
              <Link className="font-semibold text-primary underline" href="/admin/lessons">
                Lessons
              </Link>
              .
            </li>
            <li>• Pathway lesson rows without SEO fields are listed in Metadata — editing may require your content pipeline.</li>
          </ul>
        </section>
      ) : null}

      {data && tab === "metadata" ? <MetadataTables data={data.metadata} /> : null}
      {data && tab === "slugs" ? <SlugTable rows={data.slugs as SlugRow[]} /> : null}
      {data && tab === "linking" ? <LinkingTable rows={data.linking as LinkingRow[]} /> : null}
      {data && tab === "broken" ? <BrokenTable rows={data.broken as BrokenRow[]} /> : null}
      {data && tab === "opportunities" ? <OppTable rows={data.opportunities as OppRow[]} /> : null}

      {tab === "validate" ? (
        <section className="nn-card space-y-4 p-6">
          <h2 className="text-lg font-semibold">Validate internal path</h2>
          <p className="text-sm text-muted-foreground">
            Enter a root-relative path (e.g. <code className="rounded bg-muted px-1">/blog/my-slug</code>) or a full URL to the
            same site. Uses live slug inventories + programmatic registry.
          </p>
          <div className="flex flex-wrap gap-2">
            <input
              className="min-w-[240px] flex-1 rounded-lg border border-border px-3 py-2 font-mono text-sm"
              value={validatePath}
              onChange={(e) => setValidatePath(e.target.value)}
              placeholder="/blog/… or https://…"
            />
            <button
              type="button"
              disabled={validateBusy}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              onClick={() => void runValidate()}
            >
              {validateBusy ? "Checking…" : "Validate"}
            </button>
          </div>
          {validateResult ? (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                validateResult.status === "ok"
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : validateResult.status === "broken"
                    ? "border-rose-500/40 bg-rose-500/10"
                    : "border-amber-500/40 bg-amber-500/10"
              }`}
            >
              <p className="font-mono text-xs">{validateResult.path}</p>
              <p className="mt-1 font-semibold capitalize">{validateResult.status}</p>
              <p className="mt-1 text-muted-foreground">{validateResult.detail}</p>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function StatCard({ label, value, onClick }: { label: string; value: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-border/80 bg-[var(--theme-card-bg)] p-4 text-left transition hover:border-primary/40"
    >
      <p className="text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">{value}</p>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
    </button>
  );
}

type MetaBlog = {
  id: string;
  slug: string;
  title: string;
  postStatus: string;
  issues: string[];
  editHref: string;
  publicHref: string;
};

type MetaLesson = {
  id: string;
  slug: string;
  title: string;
  status: string | null;
  issues: string[];
  editHref: string;
};

type MetaPath = {
  id: string;
  pathwayId: string;
  slug: string;
  title: string;
  locale: string;
  issues: string[];
};

function MetadataTables({
  data,
}: {
  data: { blogs: MetaBlog[]; lessons: MetaLesson[]; pathwayLessons: MetaPath[] };
}) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold">Blog posts — missing fields (latest scan)</h2>
        <p className="text-sm text-muted-foreground">
          Rows with empty seoTitle, seoDescription, or excerpt (among recent posts).
        </p>
        <div className="mt-3 overflow-auto rounded-xl border border-border/70">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-muted/30 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Slug</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Missing</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.blogs.map((p) => (
                <tr key={p.id} className="border-b border-border/40">
                  <td className="px-3 py-2">
                    <span className="font-mono text-xs">{p.slug}</span>
                    <div className="text-xs text-muted-foreground">{p.title}</div>
                  </td>
                  <td className="px-3 py-2">{p.postStatus}</td>
                  <td className="px-3 py-2 text-xs">{p.issues.join(", ")}</td>
                  <td className="px-3 py-2 text-right">
                    <Link className="text-primary underline" href={p.editHref}>
                      Edit
                    </Link>{" "}
                    ·{" "}
                    <a className="text-muted-foreground underline" href={p.publicHref} target="_blank" rel="noreferrer">
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.blogs.length === 0 ? <p className="p-4 text-sm text-muted-foreground">No gaps in sampled posts.</p> : null}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">App lessons (ContentItem)</h2>
        <div className="mt-3 overflow-auto rounded-xl border border-border/70">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-border bg-muted/30 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Slug</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Missing</th>
                <th className="px-3 py-2 text-right">Edit</th>
              </tr>
            </thead>
            <tbody>
              {data.lessons.map((l) => (
                <tr key={l.slug} className="border-b border-border/40">
                  <td className="px-3 py-2">
                    <span className="font-mono text-xs">{l.slug}</span>
                    <div className="text-xs text-muted-foreground">{l.title}</div>
                  </td>
                  <td className="px-3 py-2">{l.status ?? "—"}</td>
                  <td className="px-3 py-2 text-xs">{l.issues.join(", ")}</td>
                  <td className="px-3 py-2 text-right">
                    <Link className="text-primary underline" href={l.editHref}>
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.lessons.length === 0 ? <p className="p-4 text-sm text-muted-foreground">No gaps in sampled lessons.</p> : null}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Pathway lessons (DB)</h2>
        <p className="text-sm text-muted-foreground">
          Marketing pathway pages; fix SEO fields via your import pipeline or DB if needed.
        </p>
        <div className="mt-3 overflow-auto rounded-xl border border-border/70">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-border bg-muted/30 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Pathway</th>
                <th className="px-3 py-2">Slug</th>
                <th className="px-3 py-2">Missing</th>
              </tr>
            </thead>
            <tbody>
              {data.pathwayLessons.map((p) => (
                <tr key={p.id} className="border-b border-border/40">
                  <td className="px-3 py-2 font-mono text-xs">{p.pathwayId}</td>
                  <td className="px-3 py-2">
                    <span className="font-mono text-xs">{p.slug}</span>
                    <div className="text-xs text-muted-foreground">{p.title}</div>
                  </td>
                  <td className="px-3 py-2 text-xs">{p.issues.join(", ")} (locale {p.locale})</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.pathwayLessons.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No gaps in sampled pathway lessons.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

type SlugRow = { slug: string; locations: Array<{ type: string; label: string; href: string }> };

function SlugTable({ rows }: { rows: SlugRow[] }) {
  return (
    <section className="nn-card space-y-3 p-6">
      <h2 className="text-lg font-semibold">Slug collisions (blog ↔ app lesson)</h2>
      <p className="text-sm text-muted-foreground">
        Same slug string in <code className="rounded bg-muted px-1">blog_posts</code> and{" "}
        <code className="rounded bg-muted px-1">content_items</code> can confuse editors and analytics. Rename one side if
        unintended.
      </p>
      <div className="overflow-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase text-muted-foreground">
            <tr>
              <th className="py-2">Slug</th>
              <th className="py-2">Locations</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug} className="border-b border-border/40 align-top">
                <td className="py-2 font-mono text-xs">{r.slug}</td>
                <td className="py-2">
                  <ul className="space-y-1 text-xs">
                    {r.locations.map((loc, i) => (
                      <li key={`${loc.href}-${i}`}>
                        <span className="text-muted-foreground">{loc.type}:</span> {loc.label}{" "}
                        <Link className="text-primary underline" href={loc.href}>
                          Open
                        </Link>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? <p className="py-6 text-sm text-muted-foreground">No duplicate slugs across blog and lessons.</p> : null}
      </div>
    </section>
  );
}

type LinkingRow = {
  slug: string;
  title: string;
  internalAnchors: number;
  relatedPaths: number;
  reasons: string[];
  editHref: string;
};

function LinkingTable({ rows }: { rows: LinkingRow[] }) {
  return (
    <section className="nn-card space-y-3 p-6">
      <h2 className="text-lg font-semibold">Weak internal linking (published blogs)</h2>
      <p className="text-sm text-muted-foreground">
        Flags posts with fewer than two in-body root-relative links and/or empty <code className="rounded bg-muted px-1">relatedLessonPaths</code>.
      </p>
      <div className="overflow-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase text-muted-foreground">
            <tr>
              <th className="py-2">Post</th>
              <th className="py-2">Anchors</th>
              <th className="py-2">Related paths</th>
              <th className="py-2">Notes</th>
              <th className="py-2 text-right">Edit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug} className="border-b border-border/40">
                <td className="py-2">
                  <span className="font-mono text-xs">{r.slug}</span>
                  <div className="text-xs text-muted-foreground">{r.title}</div>
                </td>
                <td className="py-2 tabular-nums">{r.internalAnchors}</td>
                <td className="py-2 tabular-nums">{r.relatedPaths}</td>
                <td className="py-2 text-xs text-muted-foreground">{r.reasons.join(" · ")}</td>
                <td className="py-2 text-right">
                  <Link className="text-primary underline" href={r.editHref}>
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? <p className="py-6 text-sm text-muted-foreground">No weak rows in the latest published sample.</p> : null}
      </div>
    </section>
  );
}

type BrokenRow = {
  sourceKind: string;
  sourceLabel: string;
  href: string;
  status: string;
  detail: string;
  editHref: string;
};

function BrokenTable({ rows }: { rows: BrokenRow[] }) {
  return (
    <section className="nn-card space-y-3 p-6">
      <h2 className="text-lg font-semibold">Broken internal links</h2>
      <p className="text-sm text-muted-foreground">
        Parsed <code className="rounded bg-muted px-1">&lt;a href&gt;</code> from recent blog bodies and lesson JSON/text. Only
        paths classified as broken are listed (e.g. /blog/slug with no post).
      </p>
      <div className="overflow-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase text-muted-foreground">
            <tr>
              <th className="py-2">Source</th>
              <th className="py-2">Href</th>
              <th className="py-2">Detail</th>
              <th className="py-2 text-right">Fix</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${r.sourceLabel}-${r.href}-${i}`} className="border-b border-border/40 align-top">
                <td className="py-2 text-xs">
                  <span className="text-muted-foreground">{r.sourceKind}</span>
                  <div>{r.sourceLabel}</div>
                </td>
                <td className="py-2 font-mono text-xs break-all">{r.href}</td>
                <td className="py-2 text-xs text-rose-800 dark:text-rose-200">{r.detail}</td>
                <td className="py-2 text-right">
                  <Link className="text-primary underline" href={r.editHref}>
                    Open editor
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">No broken paths detected in the sampled content.</p>
        ) : null}
      </div>
    </section>
  );
}

type OppRow = { slug: string; title: string; exam: string | null; hint: string; editHref: string };

function OppTable({ rows }: { rows: OppRow[] }) {
  return (
    <section className="nn-card space-y-3 p-6">
      <h2 className="text-lg font-semibold">Suggested link opportunities</h2>
      <p className="text-sm text-muted-foreground">Heuristic suggestions — review before changing content.</p>
      <div className="overflow-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase text-muted-foreground">
            <tr>
              <th className="py-2">Post</th>
              <th className="py-2">Exam</th>
              <th className="py-2">Hint</th>
              <th className="py-2 text-right">Open</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.slug}-${r.hint.slice(0, 20)}`} className="border-b border-border/40 align-top">
                <td className="py-2">
                  <span className="font-mono text-xs">{r.slug}</span>
                  <div className="text-xs text-muted-foreground">{r.title}</div>
                </td>
                <td className="py-2 text-xs">{r.exam ?? "—"}</td>
                <td className="py-2 text-xs">{r.hint}</td>
                <td className="py-2 text-right">
                  <Link className="text-primary underline" href={r.editHref}>
                    Control panel
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? <p className="py-6 text-sm text-muted-foreground">No opportunities in the current sample.</p> : null}
      </div>
    </section>
  );
}
