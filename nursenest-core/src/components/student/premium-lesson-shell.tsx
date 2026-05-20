"use client";

import type { ReactNode } from "react";
import { LockKeyhole } from "lucide-react";
import { LearnerNoteScope } from "@prisma/client";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";
import { ProtectedPremiumContent } from "@/components/student/protected-premium-content";
import { LessonNotesDrawer } from "@/components/lessons/lesson-notes-drawer";

type Props = {
  userId: string;
  userLabel: string;
  flags: PremiumProtectionFlags;
  scope: LearnerNoteScope;
  contextId: string;
  pathwayId?: string | null;
  topic?: string | null;
  sourceLabel: string;
  /** Optional server-rendered notice (e.g. thin lesson quality). */
  qualityNotice?: ReactNode;
  /** Single-line premium notice for dense lesson layouts. */
  compactSubscriberBanner?: boolean;
  children: ReactNode;
};

export function PremiumLessonShell({
  userId,
  userLabel,
  flags,
  scope,
  contextId,
  pathwayId,
  topic,
  sourceLabel,
  qualityNotice,
  compactSubscriberBanner = false,
  children,
}: Props) {
  return (
    <div className={compactSubscriberBanner ? "space-y-3" : "space-y-5"}>
      <p
        className={
          compactSubscriberBanner
            ? "flex items-center gap-2 rounded-md border px-3 py-2 text-[0.7rem] font-medium leading-snug"
            : "flex items-start gap-2.5 rounded-xl border px-4 py-3 text-xs font-medium leading-relaxed"
        }
        style={{
          background: "color-mix(in srgb, var(--semantic-brand) 5%, var(--bg-card))",
          borderColor: "color-mix(in srgb, var(--semantic-brand) 14%, var(--border-subtle))",
          color: "var(--semantic-text-muted)",
        }}
      >
        <LockKeyhole
          className={compactSubscriberBanner ? "h-3 w-3 shrink-0" : "mt-0.5 h-3.5 w-3.5 shrink-0"}
          style={{ color: "var(--semantic-brand)" }}
          aria-hidden="true"
        />
        {compactSubscriberBanner
          ? "Subscriber lesson — notes printable; copy deterrence active."
          : "Premium subscriber content. Notes are printable; copying is deterred but not DRM-locked."}
      </p>
      {qualityNotice}
      <ProtectedPremiumContent
        userLabel={userLabel}
        flags={flags}
        telemetrySurface={scope === LearnerNoteScope.PATHWAY_LESSON ? "pathway_lesson" : "content_lesson"}
      >
        {children}
      </ProtectedPremiumContent>
      <LessonNotesDrawer
        userId={userId}
        scope={scope}
        contextId={contextId}
        pathwayId={pathwayId}
        topic={topic}
        sourceLabel={sourceLabel}
        userLabel={userLabel}
        flags={flags}
      />
    </div>
  );
}
