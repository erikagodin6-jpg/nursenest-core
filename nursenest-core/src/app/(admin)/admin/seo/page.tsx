import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  await requireAdmin();
  const weakBlog = await prisma.blogPost.findMany({
    where: {
      OR: [
        { seoTitle: null },
        { seoDescription: null },
        { seoTitle: "" },
        { seoDescription: "" },
        { excerpt: "" },
      ],
    },
    orderBy: { updatedAt: "desc" },
    take: 80,
    select: {
      id: true,
      slug: true,
      title: true,
      postStatus: true,
      seoTitle: true,
      seoDescription: true,
      excerpt: true,
    },
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">SEO backlog</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Blog posts with missing title, description, or excerpt. Edit in scheduler or via API.
          </p>
        </div>
        <Link href="/admin" className="text-sm font-semibold text-primary underline">
          ← Overview
        </Link>
      </div>

      <section className="mt-8 nn-card p-6">
        <h2 className="text-lg font-semibold">Blog posts needing metadata ({weakBlog.length} shown)</h2>
        <div className="mt-4 overflow-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="py-2">Slug</th>
                <th className="py-2">Status</th>
                <th className="py-2">Issues</th>
              </tr>
            </thead>
            <tbody>
              {weakBlog.map((p) => {
                const issues: string[] = [];
                if (!p.seoTitle?.trim()) issues.push("seoTitle");
                if (!p.seoDescription?.trim()) issues.push("seoDescription");
                if (!p.excerpt?.trim()) issues.push("excerpt");
                return (
                  <tr key={p.id} className="border-b border-border/50">
                    <td className="py-2">
                      <Link href={`/blog/${p.slug}`} className="font-mono text-xs text-primary underline">
                        {p.slug}
                      </Link>
                      <div className="text-xs text-muted-foreground">{p.title}</div>
                    </td>
                    <td className="py-2">{p.postStatus}</td>
                    <td className="py-2 text-xs">{issues.join(", ") || "N/A"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Pathway lesson SEO gaps are summarized on the command center. Full pathway editor uses lesson admin routes. Structured
          data / OG tags for marketing pages: verify per-route <code className="rounded bg-muted px-1">metadata</code> in App Router.
        </p>
      </section>
    </main>
  );
}
