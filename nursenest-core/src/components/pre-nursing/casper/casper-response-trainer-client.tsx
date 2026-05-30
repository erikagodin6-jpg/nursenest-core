"use client";

import { useMemo, useState } from "react";
import { Clock, MessageSquareText, PlayCircle, Send, Video } from "lucide-react";
import {
  CASPER_SCENARIOS,
  formatCasperDimensionLabel,
  reviewCasperWrittenResponse,
  type CasperScenario,
} from "@/lib/casper/casper-premium-ecosystem";

export function CasperResponseTrainerClient() {
  const [scenarioId, setScenarioId] = useState(CASPER_SCENARIOS[0]?.id ?? "");
  const [response, setResponse] = useState("");
  const scenario = useMemo(
    () => CASPER_SCENARIOS.find((item) => item.id === scenarioId) ?? CASPER_SCENARIOS[0],
    [scenarioId],
  );
  const review = useMemo(() => reviewCasperWrittenResponse(response, scenario), [response, scenario]);
  const hasResponse = response.trim().length >= 40;

  return (
    <section className="space-y-6" aria-labelledby="casper-response-trainer-heading" data-testid="casper-response-trainer">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="nn-premium-home-eyebrow">Response Trainer</p>
          <h2 id="casper-response-trainer-heading" className="nn-marketing-h2 text-balance text-[var(--semantic-text-primary)]">
            Practice a written CASPer response
          </h2>
        </div>
        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--semantic-text-primary)]">
          Scenario
          <select
            value={scenarioId}
            onChange={(event) => setScenarioId(event.target.value)}
            className="min-h-11 rounded-xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] px-3 py-2 text-sm text-[var(--semantic-text-primary)]"
          >
            {CASPER_SCENARIOS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <ScenarioPracticeCard scenario={scenario} />

        <div className="rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-5 shadow-[var(--shadow-card)]">
          <label htmlFor="casper-written-response" className="flex items-center gap-2 text-sm font-bold text-[var(--semantic-text-primary)]">
            <MessageSquareText className="h-4 w-4 text-[var(--semantic-accent)]" aria-hidden />
            Written response
          </label>
          <textarea
            id="casper-written-response"
            value={response}
            onChange={(event) => setResponse(event.target.value)}
            rows={9}
            className="mt-3 w-full rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-panel-muted)] p-4 text-sm leading-6 text-[var(--semantic-text-primary)] outline-none transition focus:border-[var(--semantic-accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--semantic-accent)_24%,transparent)]"
            placeholder="Write a balanced response: acknowledge the person, identify the issue, consider stakeholders, explain your action, and name the next step."
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--semantic-text-secondary)]">
            <span>{response.trim().split(/\s+/).filter(Boolean).length} words</span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden />
              Suggested written practice: {Math.round(scenario.timedPromptSeconds / 60)} min
            </span>
          </div>

          <div className="mt-5 rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-4" aria-live="polite">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-[var(--semantic-text-primary)]">Structured review</p>
                <p className="text-sm text-[var(--semantic-text-secondary)]">
                  {hasResponse ? `${review.level} response, ${review.overallScore}/100` : "Write at least 40 characters to unlock feedback."}
                </p>
              </div>
              <Send className="h-5 w-5 text-[var(--semantic-accent)]" aria-hidden />
            </div>
            {hasResponse ? (
              <>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {review.dimensionScores.map((dimension) => (
                    <div key={dimension.dimension} className="rounded-xl bg-[var(--semantic-panel-muted)] p-3">
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="font-semibold text-[var(--semantic-text-primary)]">
                          {formatCasperDimensionLabel(dimension.dimension)}
                        </span>
                        <span className="font-bold text-[var(--semantic-accent)]">{dimension.score}</span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-[var(--semantic-text-secondary)]">{dimension.feedback}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <ReviewList title="Strengths" items={review.strengths.length ? review.strengths : ["The response has a clear starting point."]} />
                  <ReviewList title="Next steps" items={review.nextSteps} />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function ScenarioPracticeCard({ scenario }: { scenario: CasperScenario }) {
  return (
    <article className="rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--semantic-accent)]">
            {scenario.category.replaceAll("_", " ")}
          </p>
          <h3 className="mt-2 text-xl font-bold text-[var(--semantic-text-primary)]">{scenario.title}</h3>
        </div>
        <PlayCircle className="h-5 w-5 shrink-0 text-[var(--semantic-accent)]" aria-hidden />
      </div>
      <p className="mt-3 text-sm font-semibold text-[var(--semantic-text-secondary)]">{scenario.setting}</p>
      <p className="mt-4 text-base leading-7 text-[var(--semantic-text-primary)]">{scenario.prompt}</p>

      <div className="mt-5 grid gap-3">
        <TrainerList title="Stakeholder cues" items={scenario.stakeholderCues} />
        <TrainerList title="Communication framework" items={scenario.communicationFramework} />
      </div>

      <div className="mt-5 rounded-2xl bg-[var(--semantic-panel-muted)] p-4">
        <p className="flex items-center gap-2 text-sm font-bold text-[var(--semantic-text-primary)]">
          <Video className="h-4 w-4 text-[var(--semantic-accent)]" aria-hidden />
          Video response coaching
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--semantic-text-secondary)]">
          {scenario.videoCoaching.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function TrainerList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-sm font-bold text-[var(--semantic-text-primary)]">{title}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--semantic-text-secondary)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ReviewList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-sm font-bold text-[var(--semantic-text-primary)]">{title}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--semantic-text-secondary)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
