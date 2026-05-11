import { AdminEcgPublishButton } from "@/components/ecg-module/admin-ecg-publish-button";
import { EcgLiveStrip } from "@/components/study/ecg-live-strip";
import { requireAdmin } from "@/lib/auth/guards";
import { defaultEcgStripConfigForRhythm } from "@/lib/ecg-module/ecg-waveform-generator";
import { getEcgRhythmTemplate } from "@/lib/ecg-module/ecg-rhythm-templates";
import {
  defaultEcgQaMetadataForRhythm,
  ECG_QUARANTINED_RHYTHM_KEYS,
  getEcgAdminWarnings,
} from "@/lib/ecg-module/ecg-safety-governance";
import { getEcgModuleReadiness, summarizeEcgModuleGates } from "@/lib/ecg-module/ecg-module-readiness";

export const dynamic = "force-dynamic";

export default async function AdminEcgModulePage() {
  await requireAdmin();
  const readiness = await getEcgModuleReadiness();
  const failures = summarizeEcgModuleGates(readiness);
  const previewConfig = defaultEcgStripConfigForRhythm("atrial_fibrillation");
  const template = getEcgRhythmTemplate(previewConfig.rhythmKey);
  const previewWarnings = getEcgAdminWarnings({
    rhythmTag: previewConfig.rhythmKey,
    mediaType: previewConfig.mediaType,
    mediaConfig: previewConfig,
    clinicianReviewedAt: null,
    ...defaultEcgQaMetadataForRhythm(previewConfig.rhythmKey, "curated"),
  });

  const cards = [
    ["Total ECG questions", readiness.counts.totalQuestions],
    ["Ready for learners", readiness.counts.readyQuestions],
    ["Rhythm interpretation", readiness.counts.rhythm],
    ["Ready rhythm items", readiness.counts.readyRhythm],
    ["Video/strip questions", readiness.counts.stripVideo],
    ["Ready strip items", readiness.counts.readyStripVideo],
    ["Case-based questions", readiness.counts.caseBased],
    ["Electrolyte/medication", readiness.counts.electrolyteMedication],
    ["Advanced ECG", readiness.counts.advanced],
    ["Flashcards", readiness.counts.flashcards],
    ["Lesson links", readiness.counts.linkedLessons],
    ["With rationale", `${readiness.percentages.rationale}%`],
    ["With media", `${readiness.percentages.media}%`],
    ["Missing media", readiness.counts.missingMedia],
    ["Missing rationale", readiness.counts.missingRationale],
    ["Validation failures", readiness.counts.validationFailures],
    ["Clinician reviewed", readiness.counts.clinicianReviewed],
    ["QA approved", readiness.counts.qaApproved],
    ["Publish-safe", readiness.counts.publishSafe],
    ["Quarantined", readiness.counts.quarantined],
    ["Publish readiness", readiness.canPublish ? "Ready" : "Blocked"],
  ] as const;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Admin module governance</p>
          <h1 className="mt-1 text-2xl font-semibold text-[var(--semantic-text-primary)]">ECG Module</h1>
          <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">Status: {readiness.status}</p>
        </div>
        <AdminEcgPublishButton disabled={!readiness.canPublish} failedReasons={failures} />
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--semantic-text-primary)]">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
          <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">Strip QA preview</h2>
          <EcgLiveStrip className="mt-4" config={previewConfig} mode="static" title="Static strip preview" />
          <EcgLiveStrip className="mt-4" config={previewConfig} mode="live" title="Live-feed preview" />
        </div>
        <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
          <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">Clinical validation</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div><dt className="font-semibold">Rhythm template</dt><dd>{template?.rhythmName ?? previewConfig.rhythmKey}</dd></div>
            <div><dt className="font-semibold">Validation status</dt><dd>{readiness.counts.validationFailures === 0 ? "Passing" : "Failing"}</dd></div>
            <div><dt className="font-semibold">Clinical warnings</dt><dd>{readiness.counts.manualReviewMissing} high-risk rhythm(s) need manual review</dd></div>
            <div><dt className="font-semibold">Needs manual review</dt><dd>{readiness.counts.manualReviewMissing > 0 ? "Yes" : "No"}</dd></div>
            <div><dt className="font-semibold">Approximate waveforms</dt><dd>{readiness.counts.waveformApproximate}</dd></div>
            <div><dt className="font-semibold">Context-dependent diagnoses</dt><dd>{readiness.counts.contextDependent}</dd></div>
          </dl>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-700/60 dark:bg-amber-950/30 dark:text-amber-100">
          <h2 className="text-base font-semibold">ECG safety warnings</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>{readiness.counts.waveformApproximate} ECG item(s) still use approximate waveform fidelity.</li>
            <li>{readiness.counts.contextDependent} rhythm pattern(s) require contextual interpretation rather than strip-only diagnosis.</li>
            <li>{readiness.counts.totalQuestions - readiness.counts.clinicianReviewed} ECG item(s) lack clinician review metadata.</li>
          </ul>
          {previewWarnings.length > 0 ? (
            <ul className="mt-3 list-disc space-y-2 pl-5">
              {previewWarnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
          <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">Quarantined rhythms</h2>
          <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
            These remain internal-only until the renderer can faithfully model conduction timing and AV dissociation.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--semantic-text-secondary)]">
            {ECG_QUARANTINED_RHYTHM_KEYS.map((rhythmKey) => (
              <li key={rhythmKey}>{getEcgRhythmTemplate(rhythmKey)?.rhythmName ?? rhythmKey}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
        <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">Readiness gates</h2>
        <ul className="mt-3 grid gap-2">
          {readiness.gates.map((gate) => (
            <li key={gate.key} className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--semantic-border-soft)] py-2 text-sm">
              <span>{gate.label}</span>
              <span className={gate.passed ? "font-semibold text-[var(--semantic-success)]" : "font-semibold text-[var(--semantic-danger)]"}>
                {gate.passed ? "Pass" : gate.reason}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
