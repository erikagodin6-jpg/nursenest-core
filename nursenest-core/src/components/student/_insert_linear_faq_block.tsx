      <PracticeSessionLayout className={`flex min-h-0 flex-1 flex-col ${chromeClass}`}>
        <ExamSessionShell neutralPalette immersive className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-0 bg-transparent !shadow-none">
          <ExamSessionTopBar
            left={
              <div className="space-y-1">
                <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                  {tx("learner.practiceTests.run.question", "Question")} {idx + 1}{" "}
                  {tx("learner.practiceTests.run.of", "of")} {total}
                </p>
                {examName ? (
                  <p className="line-clamp-2 nn-marketing-body-sm font-medium text-[var(--theme-heading-text)]">
                    {examName}
                  </p>
                ) : null}
              </div>
            }
            center={
              <span className="nn-marketing-caption text-[var(--semantic-text-muted)]">{topBarRightLabel}</span>
            }
            right={
              <div className="flex flex-wrap items-center justify-end gap-2">
                <ExamSessionThemeTrigger variant="pill" />
                <ExamTimerReadout remainingSec={timedMode ? remainingSec : null} />
              </div>
            }
          />
          <ExamProgressBar current={idx + 1} total={total} />
          {sessionRecoveryBanner}
          <div className="nn-question-session nn-question-session--split min-h-0 flex-1 overflow-hidden !px-0 sm:!px-0">
            <div className="nn-question-session-primary min-h-0 overflow-y-auto">
              <PracticeQuestionCard
                stem={
                  typeof current.stem === "string" && current.stem.trim().length > 0
                    ? current.stem
                    : tx(
                      "learner.practiceTests.run.questionUnavailable",
                      "Question text is unavailable. Try reloading this item.",
                    )
                }
                topic={current.topic}
                subtopic={current.subtopic}
                difficultyLabel={
                  current.difficulty != null
                    ? difficultyBandLabel(current.difficulty)
                    : null
                }
                optionsLabel={isSata
                  ? tx("learner.practiceTests.run.selectAllThatApply", "Select all that apply")
                  : tx("learner.practiceTests.run.selectBestAnswer", "Select the best answer")}
              >
                {timedMode && timeLimitSec != null ? (
                  <p className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[var(--semantic-warning-soft)] px-3 py-2 text-xs font-medium text-[var(--semantic-warning-contrast)]">
                    {tx(
                      "learner.practiceTests.run.timedAutoEnd",
                      "Timed session: the exam may end automatically when time expires.",
                    )}
                  </p>
                ) : null}
                {timedMode ? (
                  <div className="flex justify-end">
                    <ExamTimerReadout remainingSec={remainingSec} />
                  </div>
                ) : null}
                {practiceOptionRows}

                {confidenceTrackingEnabled ? (
                  <ConfidenceSelector
                    questionId={current.id}
                    value={confidence[current.id] ?? null}
                    onChange={setConfidenceForQuestion}
                  />
                ) : (
                  <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]">
                    {tx(
                      "learner.practiceTests.run.confidenceTrackingOff",
                      "Confidence tracking is off in your study settings for this session.",
                    )}
                  </div>
                )}

                <div className="nn-practice-q-nav nn-question-nav-actions">
                  <button
                    type="button"
                    aria-pressed={Boolean(flagged[current.id])}
                    className={`inline-flex min-h-[2.5rem] shrink-0 items-center rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                      flagged[current.id]
                        ? "border-[color-mix(in_srgb,var(--semantic-brand)_26%,var(--semantic-border-soft))] bg-[var(--surface-emphasis,color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface)))] text-[var(--semantic-text-primary)]"
                        : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-muted)] hover:bg-[var(--surface-soft-a,var(--semantic-panel-muted))]"
                    }`}
                    onClick={() =>
                      setFlagged((f) => ({ ...f, [current.id]: !f[current.id] }))
                    }
                  >
                    {flagged[current.id]
                      ? tx("learner.practiceTests.run.marked", "Marked")
                      : tx("learner.practiceTests.run.flag", "Flag")}
                  </button>
                  <div className="nn-practice-q-nav__spacer" />
                  {!isLinearEngine ? (
                    <button
                      type="button"
                      disabled={idx === 0 || controlsBusy}
                      className="nn-btn-secondary min-h-[2.5rem] rounded-lg px-4 text-sm font-semibold disabled:opacity-40"
                      onClick={() => void goPrev()}
                    >
                      {tx("learner.practiceTests.run.previous", "Previous")}
                    </button>
                  ) : null}
                  {isLinearEngine && !currentCommitted ? (
                    <button
                      type="button"
                      disabled={controlsBusy || !hasMeaningfulAnswer(current.id)}
                      className="nn-btn-primary min-h-[2.5rem] rounded-lg px-5 text-sm font-semibold shadow-none disabled:opacity-40"
                      onClick={() => void submitLinearCommit()}
                    >
                      {saving
                        ? tx("learner.practiceTests.run.submitting", "Submitting...")
                        : tx("learner.practiceTests.run.submitAnswer", "Submit answer")}
                    </button>
                  ) : null}
                  {idx < total - 1 ? (
                    <button
                      type="button"
                      disabled={controlsBusy || (isLinearEngine && !currentCommitted)}
                      className="nn-btn-primary min-h-[2.5rem] rounded-lg px-5 text-sm font-semibold shadow-none disabled:opacity-40"
                      onClick={() => void goNext()}
                    >
                      {tx("learner.practiceTests.run.next", "Next")}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={controlsBusy || (isLinearEngine && !currentCommitted)}
                      className="nn-btn-primary min-h-[2.5rem] rounded-lg px-5 text-sm font-semibold shadow-none disabled:opacity-40"
                      onClick={() => void submitTest()}
                    >
                      {saving
                        ? tx("learner.practiceTests.run.submitting", "Submitting...")
                        : tx("learner.practiceTests.run.finish", "Finish")}
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={controlsBusy}
                    className="text-xs font-medium text-[var(--semantic-text-muted)] underline-offset-2 hover:text-[var(--semantic-text-secondary)] hover:underline"
                    onClick={() => void abandon()}
                  >
                    {tx("learner.practiceTests.run.abandon", "Abandon")}
                  </button>
                </div>
              </PracticeQuestionCard>
            </div>
            <aside className="nn-question-session-rationale min-h-0 space-y-4 overflow-y-auto">
              <PracticeRationaleFullPanel
                status={rationaleFullStatus}
                correctKeys={linearFeedback?.correctKeys}
                optionDisplayMap={optionDisplayMap}
                allOptionKeys={optsCanonical}
                correctAnswerExplanation={linearFeedback?.correctAnswerExplanation}
                rationale={linearFeedback?.rationale}
                distractorRationalesMap={linearFeedback?.distractorRationalesMap}
                keyTakeaway={linearFeedback?.keyTakeaway}
                relatedLessons={linearFeedback?.relatedLessons ?? []}
                confidenceLevel={confidenceTrackingEnabled ? (confidence[current.id] ?? null) : null}
              />
            </aside>
          </div>
        </ExamSessionShell>
      </PracticeSessionLayout>
