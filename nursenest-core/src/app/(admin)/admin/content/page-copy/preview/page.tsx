import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  getMarketingPublicContentKeyDef,
  isMarketingPublicContentEditableKey,
  normalizeMarketingPublicContentLocale,
} from "@/lib/marketing/marketing-public-content-policy";
import { getMarketingPublicContentDefaultCatalogValue } from "@/lib/marketing/marketing-public-content-default-catalog";
import { buildMarketingPublicLivePageHref } from "@/lib/marketing/marketing-public-content-live-href";

export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<{ messageKey?: string; locale?: string }> };

/**
 * Staff-only staged copy preview (admin layout enforces RBAC).
 * Drafts never ship on public marketing routes; this page reads draft + published from DB for review only.
 */
export default async function AdminPageCopyPreviewPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const messageKeyRaw = typeof sp.messageKey === "string" ? sp.messageKey.trim() : "";
  const locale = normalizeMarketingPublicContentLocale(typeof sp.locale === "string" ? sp.locale : "en");

  if (!messageKeyRaw || !isMarketingPublicContentEditableKey(messageKeyRaw)) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <p className="text-sm text-muted-foreground">Provide a valid allowlisted messageKey and locale.</p>
        <Link href="/admin/content/page-copy" className="mt-4 inline-block text-sm font-semibold text-primary underline">
          ← Page copy editor
        </Link>
      </main>
    );
  }

  const messageKey = messageKeyRaw;
  const def = getMarketingPublicContentKeyDef(messageKey)!;
  const defaultCatalog = getMarketingPublicContentDefaultCatalogValue(messageKey, locale);
  const [row, revCount] = await Promise.all([
    prisma.marketingPublicContentOverride.findUnique({
      where: { messageKey_locale: { messageKey, locale } },
      select: {
        value: true,
        draftValue: true,
        isPublished: true,
        publishedAt: true,
        updatedAt: true,
      },
    }),
    prisma.marketingPublicContentOverrideRevision.count({ where: { messageKey, locale } }),
  ]);

  const publishedLive = row?.isPublished ? row.value : "";
  const stagedDraft = (row?.draftValue ?? "").trim() ? row!.draftValue! : "";
  const liveHref = buildMarketingPublicLivePageHref(locale, def.route);
  const editorBack = `/admin/content/page-copy?locale=${encodeURIComponent(locale)}`;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Staged preview</p>
          <h1 className="mt-1 text-xl font-bold text-[var(--theme-heading-text)]">Copy slot preview</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Read-only view of catalog default, published override, and staged draft. Public marketing pages still use
            published values only; drafts are not exposed to anonymous visitors.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 text-sm">
          <Link href={editorBack} className="font-semibold text-primary underline">
            ← Editor
          </Link>
          <a
            href={liveHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline"
          >
            Open live page ↗
          </a>
        </div>
      </div>

      <dl className="mt-8 grid gap-3 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4 text-sm">
        <div className="grid gap-1 sm:grid-cols-[10rem_1fr]">
          <dt className="font-semibold text-muted-foreground">Message key</dt>
          <dd className="font-mono text-xs text-foreground">{messageKey}</dd>
        </div>
        <div className="grid gap-1 sm:grid-cols-[10rem_1fr]">
          <dt className="font-semibold text-muted-foreground">Locale</dt>
          <dd>{locale}</dd>
        </div>
        <div className="grid gap-1 sm:grid-cols-[10rem_1fr]">
          <dt className="font-semibold text-muted-foreground">Route</dt>
          <dd className="font-mono text-xs">{def.route}</dd>
        </div>
        <div className="grid gap-1 sm:grid-cols-[10rem_1fr]">
          <dt className="font-semibold text-muted-foreground">Revision count</dt>
          <dd>{revCount}</dd>
        </div>
        <div className="grid gap-1 sm:grid-cols-[10rem_1fr]">
          <dt className="font-semibold text-muted-foreground">Last published</dt>
          <dd className="text-muted-foreground">
            {row?.publishedAt ? new Date(row.publishedAt).toISOString() : "—"}
          </dd>
        </div>
      </dl>

      <section className="mt-6 space-y-4">
        <h2 className="text-sm font-semibold text-[var(--theme-heading-text)]">Values</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-border/60 bg-muted/15 p-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Catalog default</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{defaultCatalog || "—"}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/15 p-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Published (live)</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{publishedLive || "—"}</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-warning)]">Staged draft</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{stagedDraft || "—"}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
