"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { readQuestionPerformanceSample } from "@/lib/learner/question-performance-events";
import type { AdaptiveTeachingLoopRecommendation } from "@/lib/learner/adaptive-teaching-loop";

export function AdaptiveRecommendationLoopPanel({
  userId,
  fallbackTopics,
}: {
  userId: string;
  fallbackTopics: string[];
}) {
  const [data, setData] = useState<AdaptiveTeachingLoopRecommendation | null>(null);
  const requestKeyRef = useRef<string>("");
  const fallbackKey = useMemo(() => fallbackTopics.slice(0, 3).join("|"), [fallbackTopics]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!userId) return;
      const requestKey = `${userId}:${fallbackKey}`;
      if (requestKeyRef.current === requestKey) return;
      requestKeyRef.current = requestKey;
      const events = readQuestionPerformanceSample(userId, 120);
      const res = await fetch("/api/learner/adaptive-loop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events, fallbackTopics: fallbackTopics.slice(0, 3) }),
      }).catch(() => null);
      if (!res?.ok) return;
      const json = (await res.json().catch(() => null)) as AdaptiveTeachingLoopRecommendation | null;
      if (!cancelled && json) setData(json);
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [userId, fallbackTopics, fallbackKey]);

  if (!data) return null;

  return (
    <div className="mt-6 rounded-xl border border-border/60 bg-muted/15 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Priority review loop</p>
      <p className="mt-1 text-sm text-foreground">
        <span className="font-medium">Prioritized topic:</span>{" "}
        {data.prioritizedTopic ?? "N/A"}
        {data.prioritizedSubtopic ? ` · ${data.prioritizedSubtopic}` : ""}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Strong teaching payload: {data.strongTeachingPayloadExists ? "yes" : "no"} · Concept image:{" "}
        {data.conceptImageAvailable ? "available" : "missing"}
      </p>

      {data.recommendedContent.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {data.recommendedContent.slice(0, 4).map((r) => (
            <li key={`${r.kind}-${r.id}`} className="rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold uppercase">{r.kind}</span>
                <span className="text-xs text-muted-foreground">
                  teaching {r.strongTeachingPayload ? "strong" : "limited"} · image {r.conceptImageAvailable ? "yes" : "no"}
                </span>
              </div>
              <Link href={r.href} className="mt-1 block font-medium text-primary hover:underline">
                {r.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">No targeted recommendation yet. Continue the priority review queue to refine this loop.</p>
      )}

      {data.dataGaps.length > 0 ? (
        <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-muted-foreground">
          {data.dataGaps.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

