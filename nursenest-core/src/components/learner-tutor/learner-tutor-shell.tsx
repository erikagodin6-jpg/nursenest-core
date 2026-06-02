import { getTutorIntentRegistry } from "@/lib/learner/tutor/tutor-intent-registry";
import type { LearnerTutorShellContext } from "@/lib/learner/tutor/tutor-types";
import { LearnerTutorDock } from "@/components/learner-tutor/learner-tutor-dock";

/**
 * Server entry: resolves the **intent registry** (live vs planned) once per request.
 * The dock stays a client island for open/close and focus.
 */
export function LearnerTutorShell({ context }: { context: LearnerTutorShellContext }) {
  const intents = getTutorIntentRegistry();
  return <LearnerTutorDock context={context} intents={intents} />;
}
