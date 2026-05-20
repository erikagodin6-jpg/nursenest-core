"use client";

/**
 * Trusted-admin HTML preview: approximates public blog article typography.
 * Does not run in public routes — only embed in admin editor.
 */
export function AdminBlogHtmlPreview({
  title,
  excerpt,
  coverImageUrl,
  coverAlt,
  bodyHtml,
}: {
  title: string;
  excerpt: string;
  coverImageUrl?: string | null;
  coverAlt?: string;
  bodyHtml?: string;
}) {
  return (
    <article className="text-[13px] leading-relaxed text-foreground">
      <header className="border-b border-border/60 pb-4">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Preview</p>
        <h1 className="mt-2 text-xl font-bold tracking-tight text-[var(--theme-heading-text)]">{title || "Untitled"}</h1>
        {excerpt.trim() ? <p className="mt-2 text-xs text-muted-foreground">{excerpt.trim().slice(0, 280)}</p> : null}
      </header>
      {coverImageUrl?.trim().startsWith("https://") ? (
        <figure className="mt-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImageUrl.trim()}
            alt={coverAlt?.trim() || ""}
            className="w-full rounded-lg border border-border object-cover"
          />
        </figure>
      ) : null}
      <div
        className="prose prose-sm prose-neutral mt-6 max-w-none dark:prose-invert [&_a]:text-primary [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-semibold"
        // Trusted: admin-authored draft HTML only
        dangerouslySetInnerHTML={{ __html: bodyHtml || "<p><em>No body yet.</em></p>" }}
      />
    </article>
  );
}
