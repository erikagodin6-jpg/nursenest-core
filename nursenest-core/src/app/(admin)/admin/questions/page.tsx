import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { ContentStatus } from "@prisma/client";

export default async function AdminQuestionsPage({
  searchParams,
}: {
  searchParams?: Promise<{ exam?: string; topic?: string; focus?: string }>;
}) {
  await requireAdmin();
  const params = (await searchParams) ?? {};
  const exam = params.exam?.trim() || undefined;
  const topic = params.topic?.trim() || undefined;
  const focus = params.focus?.trim() || undefined;

  const where = {
    status: ContentStatus.PUBLISHED,
    ...(exam ? { exam } : {}),
    ...(topic ? { topic } : {}),
    ...(focus ? { id: focus } : {}),
  };

  const rows = await prisma.examQuestion.findMany({
    where,
    select: {
      id: true,
      exam: true,
      topic: true,
      stem: true,
      rationale: true,
      updatedAt: true,
      status: true,
    },
    orderBy: { updatedAt: "desc" },
    take: focus ? 1 : 80,
  });

  const wordCount = (s: string | null) => {
    const t = (s ?? "").trim();
    if (!t) return 0;
    return t.split(/\s+/).filter(Boolean).length;
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--theme-heading-text)]">Question bank admin</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Operational remediation queue for rationale/stem quality. AI drafting lives under{" "}
        <Link className="font-semibold text-primary underline" href="/admin/ai/exam-questions">
          AI exam questions
        </Link>
        . NCLEX client-needs backfill queue:{" "}
        <Link className="font-semibold text-primary underline" href="/admin/questions/nclex-mapping">
          NCLEX mapping
        </Link>
        . Image URLs for stems, exhibits, or rationales: pick from the{" "}
        <Link className="font-semibold text-primary underline" href="/admin/media">
          media library
        </Link>{" "}
        (copy URL into JSON via <span className="font-mono">Open JSON</span>).
      </p>

      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        {exam ? <span className="rounded-full bg-muted px-2 py-1">exam: {exam}</span> : null}
        {topic ? <span className="rounded-full bg-muted px-2 py-1">topic: {topic}</span> : null}
        {focus ? <span className="rounded-full bg-muted px-2 py-1">focus: {focus.slice(0, 8)}…</span> : null}
      </div>

      <div className="mt-6 overflow-auto rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="py-2">Question</th>
              <th className="py-2">Exam</th>
              <th className="py-2">Topic</th>
              <th className="py-2 text-right">Rationale words</th>
              <th className="py-2 text-right">Updated</th>
              <th className="py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/40">
                <td className="py-2">
                  <p className="line-clamp-2 max-w-md">{r.stem}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{r.id.slice(0, 8)}…</p>
                </td>
                <td className="py-2 font-mono text-xs">{r.exam}</td>
                <td className="py-2">{r.topic ?? "N/A"}</td>
                <td className="py-2 text-right tabular-nums">{wordCount(r.rationale)}</td>
                <td className="py-2 text-right text-xs">{new Date(r.updatedAt).toLocaleDateString()}</td>
                <td className="py-2 text-right">
                  <a className="text-xs font-semibold text-primary underline" href={`/api/admin/questions/${r.id}`} target="_blank" rel="noreferrer">
                    Open JSON
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-6 space-y-2 text-sm">
        <li>
          <Link className="text-primary underline" href="/api/admin/questions?page=1&pageSize=20">
            GET /api/admin/questions
          </Link>
        </li>
        <li>
          <Link className="text-primary underline" href="/api/admin/question-bank-coverage">
            Question bank coverage
          </Link>
        </li>
        <li>
          <Link className="text-primary underline" href="/api/admin/question-bank-diagnostics">
            Question bank diagnostics
          </Link>
        </li>
      </ul>
    </main>
  );
}
