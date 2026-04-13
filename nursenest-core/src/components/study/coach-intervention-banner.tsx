"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { CoachIntervention, CoachInterventionSeverity } from "@/lib/coach/study-coach-types";

function severityClass(sev: CoachInterventionSeverity): string {
  if (sev === "action") return "nn-coach-intervention--action";
  if (sev === "watch") return "nn-coach-intervention--watch";
  return "nn-coach-intervention--info";
}

/**
 * Quiet banner for a single coach intervention (dashboard or smart review).
 */
export function CoachInterventionBanner({
  intervention,
  dismissible = false,
}: {
  intervention: CoachIntervention | null;
  dismissible?: boolean;
}) {
  const [dismissed, setDismissed] = useState(false);
  if (!intervention || dismissed) return null;

  return (
    <div
      className={`nn-coach-intervention ${severityClass(intervention.severity)}`}
      role="status"
    >
      <div className="nn-coach-intervention__text">
        <p className="nn-coach-intervention__title">{intervention.title}</p>
        <p className="nn-coach-intervention__message">{intervention.message}</p>
      </div>
      {dismissible ? (
        <button
          type="button"
          className="nn-coach-intervention__dismiss"
          aria-label="Dismiss"
          onClick={() => setDismissed(true)}
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
