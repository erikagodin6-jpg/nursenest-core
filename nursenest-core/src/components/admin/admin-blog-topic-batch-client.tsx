"use client";

import { useCallback, useMemo, useState } from "react";
import type { BlogBatchScheduleStatus, BlogPostTemplate } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ScheduleListRow = {
  id: string;
  status: BlogBatchScheduleStatus;
  cadencePerDay: number;
  startAt: string;
  nextRunAt: string | null;
  lastRunAt: string | null;
  totalItems: number;
  publishedCount: number;
  failedCount: number;
  skippedCount: number;
  exam: string;
  country: string;
  defaultTemplate: BlogPostTemplate;
  createdAt: string;
};

type ItemRow = {
  id: string;
  ordinal: number;
  topicRaw: string;
  plannedPublishAt: string;
  status: string;
  failureReason: string | null;
};

type ScheduleDetail = ScheduleListRow & {
  items: ItemRow[];
};

const statusBadgeClass = (s: BlogBatchScheduleStatus) => {
  const map: Record<BlogBatchScheduleStatus, string> = {
    ACTIVE: "bg-emerald-600/15 text-emerald-800 dark:text-emerald-200",
    PAUSED: "bg-amber-500/15 text-amber-900 dark:text-amber-100",
    COMPLETED: "bg-slate-500/15 text-slate-800 dark:text-slate-200",
    CANCELLED: "bg-rose-500/15 text-rose-900 dark:text-rose-100",
  };
  return map[s] ?? map.CANCELLED;
};

export function AdminBlogTopicBatchClient({
  initialSchedules,
}: {
  initialSchedules: ScheduleListRow[];
}) {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [topicsText, setTopicsText] = useState("");
  const [cadencePerDay, setCadencePerDay] = useState("1");
  const [startAtLocal, setStartAtLocal] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });
  const [exam, setExam] = useState("NCLEX-RN");
  const [country, setCountry] = useState("unspecified");
  const [template, setTemplate] = useState<BlogPostTemplate>("TOPIC_EXPLAINED");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [preview, setPreview] = useState<{
    totalTopics: number;
    droppedDuplicateLines: number;
    preview: { topic: string; plannedPublishAt: string }[];
  } | null>(null);
  const [detail, setDetail] = useState<ScheduleDetail | null>(null);
  const [runLoading, setRunLoading] = useState(false);

  const refreshList = useCallback(async () => {
    const res = await fetch("/api/admin/blog/batch-schedule");
    if (!res.ok) return;
    const data = (await res.json()) as { schedules: ScheduleListRow[] };
    setSchedules(data.schedules);
  }, []);

  const dryRun = useCallback(async () => {
    setMessage(null);
    setLoading(true);
    try {
      const startAt = new Date(startAtLocal).toISOString();
      const res = await fetch("/api/admin/blog/batch-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicsText,
          cadencePerDay: Number(cadencePerDay),
          startAt,
          exam,
          country,
          defaultTemplate: template,
          dryRun: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Preview failed");
        setPreview(null);
        return;
      }
      setPreview({
        totalTopics: data.totalTopics,
        droppedDuplicateLines: data.droppedDuplicateLines,
        preview: data.preview,
      });
      setMessage(`Preview: ${data.totalTopics} topics (${data.droppedDuplicateLines} duplicate lines removed).`);
    } finally {
      setLoading(false);
    }
  }, [topicsText, cadencePerDay, startAtLocal, exam, country, template]);

  const createSchedule = useCallback(async () => {
    setMessage(null);
    setLoading(true);
    try {
      const startAt = new Date(startAtLocal).toISOString();
      const res = await fetch("/api/admin/blog/batch-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicsText,
          cadencePerDay: Number(cadencePerDay),
          startAt,
          exam,
          country,
          defaultTemplate: template,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Save failed");
        return;
      }
      setMessage(`Saved schedule ${data.schedule?.id}. Dropped duplicate lines in paste: ${data.droppedDuplicateLines ?? 0}.`);
      setTopicsText("");
      setPreview(null);
      await refreshList();
      if (data.schedule) {
        setDetail(data.schedule as ScheduleDetail);
      }
    } finally {
      setLoading(false);
    }
  }, [topicsText, cadencePerDay, startAtLocal, exam, country, template, refreshList]);

  const loadDetail = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/blog/batch-schedule/${id}`);
    if (!res.ok) return;
    const data = (await res.json()) as { schedule: ScheduleDetail };
    setDetail(data.schedule);
  }, []);

  const patchSchedule = useCallback(
    async (id: string, status: BlogBatchScheduleStatus) => {
      const res = await fetch(`/api/admin/blog/batch-schedule/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = (await res.json()) as { schedule?: ScheduleDetail };
      if (!res.ok) return;
      await refreshList();
      if (detail?.id === id && data.schedule) {
        setDetail(data.schedule);
      }
    },
    [refreshList, detail?.id],
  );

  const runProcessor = useCallback(async () => {
    setRunLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/blog/batch-schedule/run", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.errors?.[0] ?? "Run failed");
        return;
      }
      setMessage(
        `Processed ${data.processedItems ?? 0} item(s). Schedules touched: ${(data.schedulesTouched ?? []).length}.`,
      );
      await refreshList();
      if (detail?.id) await loadDetail(detail.id);
    } finally {
      setRunLoading(false);
    }
  }, [refreshList, detail?.id, loadDetail]);

  const cadenceLabel = useMemo(() => {
    const n = Number(cadencePerDay);
    if (n === 1) return "1 / day (~24h apart)";
    return `${n} / day (~${Math.round(24 / n)}h apart)`;
  }, [cadencePerDay]);

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-border/80 bg-[var(--theme-card-bg)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">New topic batch</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          One topic per line. Duplicates in the paste are dropped. Generation uses the same AI + dedupe rules as the single-post
          generator. Cron or “Run processor now” picks up due items.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="topics-batch" className="text-sm font-medium">
              Topics
            </label>
            <textarea
              id="topics-batch"
              rows={10}
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder={"Pharmacology lab values for NCLEX\nDelegation and assignment\n..."}
              value={topicsText}
              onChange={(e) => setTopicsText(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-sm font-medium">Cadence (per 24h)</label>
              <select
                className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={cadencePerDay}
                onChange={(e) => setCadencePerDay(e.target.value)}
              >
                {["1", "2", "3", "4", "6", "8", "12"].map((n) => (
                  <option key={n} value={n}>
                    {n} / day
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted-foreground">{cadenceLabel}</p>
            </div>
            <div>
              <label htmlFor="start-at" className="text-sm font-medium">
                Start (local)
              </label>
              <input
                id="start-at"
                type="datetime-local"
                className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={startAtLocal}
                onChange={(e) => setStartAtLocal(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="exam" className="text-sm font-medium">
                Exam label
              </label>
              <input
                id="exam"
                className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={exam}
                onChange={(e) => setExam(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Country</label>
              <select
                className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="unspecified">Unspecified</option>
                <option value="US">US</option>
                <option value="CA">CA</option>
              </select>
            </div>
          </div>

          <div className="max-w-md">
            <label className="text-sm font-medium">Template</label>
            <select
              className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={template}
              onChange={(e) => setTemplate(e.target.value as BlogPostTemplate)}
            >
              <option value="TOPIC_EXPLAINED">Topic explained</option>
              <option value="HOW_TO_PASS">How to pass</option>
              <option value="FAQ_STYLE">FAQ style</option>
              <option value="EXAM_GUIDE">Exam guide</option>
            </select>
          </div>

          {preview ? (
            <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3 text-sm">
              <p className="font-medium text-primary">Preview (first slots)</p>
              <ul className="mt-2 space-y-1 font-mono text-xs text-muted-foreground">
                {preview.preview.map((row) => (
                  <li key={row.plannedPublishAt + row.topic}>
                    {row.plannedPublishAt.slice(0, 16).replace("T", " ")} · {row.topic.slice(0, 80)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" disabled={loading} onClick={dryRun}>
              Preview slots
            </Button>
            <Button type="button" disabled={loading} onClick={createSchedule}>
              Save batch schedule
            </Button>
            <Button type="button" variant="outline" disabled={runLoading} onClick={runProcessor}>
              {runLoading ? "Running…" : "Run processor now"}
            </Button>
          </div>
          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Schedules</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border/70">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Exam</th>
                <th className="px-3 py-2">Cadence</th>
                <th className="px-3 py-2">Progress</th>
                <th className="px-3 py-2">Next slot</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s) => (
                <tr key={s.id} className="border-t border-border/60">
                  <td className="px-3 py-2">
                    <Badge className={`rounded-full px-2 py-0.5 text-xs font-normal ${statusBadgeClass(s.status)}`}>{s.status}</Badge>
                  </td>
                  <td className="px-3 py-2">{s.exam}</td>
                  <td className="px-3 py-2">{s.cadencePerDay}/day</td>
                  <td className="px-3 py-2">
                    {s.publishedCount + s.skippedCount + s.failedCount}/{s.totalItems} ·{" "}
                    <span className="text-emerald-700 dark:text-emerald-300">ok {s.publishedCount}</span> ·{" "}
                    <span className="text-amber-700 dark:text-amber-200">skip {s.skippedCount}</span> ·{" "}
                    <span className="text-rose-700 dark:text-rose-200">fail {s.failedCount}</span>
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {s.nextRunAt ? new Date(s.nextRunAt).toLocaleString() : "N/A"}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      <Button type="button" variant="ghost" size="sm" className="h-8" onClick={() => loadDetail(s.id)}>
                        Details
                      </Button>
                      {s.status === "ACTIVE" ? (
                        <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => patchSchedule(s.id, "PAUSED")}>
                          Pause
                        </Button>
                      ) : null}
                      {s.status === "PAUSED" ? (
                        <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => patchSchedule(s.id, "ACTIVE")}>
                          Resume
                        </Button>
                      ) : null}
                      {s.status === "ACTIVE" || s.status === "PAUSED" ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 text-rose-700"
                          onClick={() => patchSchedule(s.id, "CANCELLED")}
                        >
                          Cancel
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {schedules.length === 0 ? <p className="p-4 text-sm text-muted-foreground">No schedules yet.</p> : null}
        </div>
      </section>

      {detail ? (
        <section className="rounded-xl border border-border/80 bg-muted/30 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold">Items: {detail.id}</h3>
            <Button type="button" variant="ghost" size="sm" onClick={() => setDetail(null)}>
              Close
            </Button>
          </div>
          <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto text-sm">
            {detail.items.map((it) => (
              <li key={it.id} className="rounded-md border border-border/60 bg-background px-3 py-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-medium">
                    #{it.ordinal} · {it.topicRaw}
                  </span>
                  <Badge className="rounded border border-border px-2 py-0.5 text-xs">{it.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{new Date(it.plannedPublishAt).toLocaleString()}</p>
                {it.failureReason ? <p className="mt-1 text-xs text-rose-700 dark:text-rose-300">{it.failureReason}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-xs text-muted-foreground">
        Cron: POST <code className="rounded bg-muted px-1">/api/cron/blog-batch-schedule</code> with{" "}
        <code className="rounded bg-muted px-1">Authorization: Bearer CRON_SECRET</code> every 5–15 minutes. Requires{" "}
        <code className="rounded bg-muted px-1">AI_ADMIN_GENERATION_ENABLED</code> and OpenAI keys, same as the blog generator.
      </p>
    </div>
  );
}
