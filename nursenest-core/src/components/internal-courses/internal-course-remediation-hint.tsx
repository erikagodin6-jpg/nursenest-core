"use client";

import Link from "next/link";

/**
 * Client-only remediation nudge after incorrect answers — no DB writes.
 */
export function InternalCourseRemediationHint(props: { lessonAppHref: string | null }) {
  const { lessonAppHref } = props;
  return (
    <div className="mt-3 rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_6%,transparent)] px-3 py-2 text-xs text-muted-foreground">
      <p className="font-medium text-foreground">Suggested remediation</p>
      <p className="mt-1">
        Review the related pathway lesson, then retry.{" "}
        {lessonAppHref ? (
          <Link href={lessonAppHref} className="font-semibold text-primary underline-offset-2 hover:underline">
            Open related lesson
          </Link>
        ) : (
          <span className="text-muted-foreground">No lesson link on this module.</span>
        )}
      </p>
    </div>
  );
}
