"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type InternalDecisionTreeNode = {
  id: string;
  prompt: string;
  choices: Array<{ label: string; next: string }>;
};

export type InternalDecisionTreeContent = {
  rootId: string;
  nodes: InternalDecisionTreeNode[];
};

export function InternalCourseDecisionTreeModule({
  content,
  lessonAppHref,
}: {
  content: InternalDecisionTreeContent;
  lessonAppHref: string | null;
}) {
  const nodeMap = useMemo(() => new Map(content.nodes.map((n) => [n.id, n])), [content.nodes]);
  const [currentId, setCurrentId] = useState(content.rootId);
  const node = nodeMap.get(currentId);

  return (
    <div className="space-y-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-4)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_10%,transparent)] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-foreground">Decision tree</h3>
        <span className="nn-badge-semantic-info rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
          Clinical logic
        </span>
      </div>
      {lessonAppHref ? (
        <p className="text-xs text-muted-foreground">
          <Link href={lessonAppHref} className="font-semibold text-primary underline-offset-2 hover:underline">
            Related pathway lesson
          </Link>
        </p>
      ) : null}
      {!node ? (
        <p className="text-sm text-muted-foreground">Invalid tree state.</p>
      ) : (
        <>
          <p className="text-sm font-medium text-foreground">{node.prompt}</p>
          {node.choices.length > 0 ? (
            <div className="flex flex-col gap-2">
              {node.choices.map((c, i) => (
                <button
                  key={`${node.id}-${i}`}
                  type="button"
                  className="rounded-lg border border-border bg-background/80 px-3 py-2 text-left text-sm font-medium hover:bg-muted/40"
                  onClick={() => setCurrentId(c.next)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">End of branch — use Reset to replay.</p>
          )}
          <button
            type="button"
            className="text-xs font-semibold text-primary underline-offset-2 hover:underline"
            onClick={() => setCurrentId(content.rootId)}
          >
            Reset tree
          </button>
        </>
      )}
    </div>
  );
}
