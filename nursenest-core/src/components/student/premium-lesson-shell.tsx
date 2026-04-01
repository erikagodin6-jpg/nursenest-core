"use client";

import type { ReactNode } from "react";
import { LearnerNoteScope } from "@prisma/client";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";
import { ProtectedPremiumContent } from "@/components/student/protected-premium-content";
import { StudyNotesPanel } from "@/components/student/study-notes-panel";

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
  children,
}: Props) {
  return (
    <div className="space-y-4">
      <p className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted">
        Premium content is for individual subscriber use. Notes are printable; protected lesson content is not. Copying is
        limited on lesson text—this is deterrence only, not DRM.
      </p>
      {qualityNotice}
      <ProtectedPremiumContent
        userLabel={userLabel}
        flags={flags}
        telemetrySurface={scope === LearnerNoteScope.PATHWAY_LESSON ? "pathway_lesson" : "content_lesson"}
      >
        {children}
      </ProtectedPremiumContent>
      <StudyNotesPanel
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
