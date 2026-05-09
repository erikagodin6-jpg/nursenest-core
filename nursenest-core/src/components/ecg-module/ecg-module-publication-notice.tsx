import "server-only";

import { getCurrentEcgModuleAccess } from "@/lib/ecg-module/ecg-module.server";

/**
 * Shown only for staff previewing the ECG module before publish.
 * Learners on the published module never see this strip.
 */
export async function EcgModulePublicationNotice() {
  const access = await getCurrentEcgModuleAccess();
  if (!access.ok || access.mode !== "admin-preview") return null;

  return (
    <div
      className="border-b border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-primary)] sm:px-6 lg:px-8"
      role="status"
    >
      <strong className="font-semibold">Staff preview.</strong>{" "}
      <span className="text-[var(--semantic-text-secondary)]">
        You are viewing the ECG mastery module before it is published to subscribers. Public learners do not see this
        surface until publishing gates pass.
      </span>
    </div>
  );
}
