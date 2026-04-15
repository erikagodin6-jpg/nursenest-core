          <ExamSessionShell neutralPalette immersive className="overflow-hidden">
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
                <span className="nn-marketing-caption font-semibold tabular-nums text-[var(--semantic-text-muted)]">
                  {Math.round(sessionPct)}% {tx("learner.practiceTests.run.complete", "complete")}
                </span>
              }
              right={
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <ExamSessionThemeTrigger />
                  <ExamTimerReadout remainingSec={timedMode ? remainingSec : null} />
                </div>
              }
            />
            <ExamProgressBar current={idx + 1} total={total} />
            {sessionRecoveryBanner}
            <div className={`nn-cat-session ${chromeClass}`}>
              <div className="nn-question-session nn-question-session--split !px-0 sm:!px-0">
                <div className="nn-question-session-primary">
                  <QuestionCard
                    stem={current.stem ?? ""}
                    topic={current.topic}
                    subtopic={current.subtopic}
                    difficultyLabel={
                      current.difficulty != null ? difficultyBandLabel(current.difficulty) : null
                    }
                  >
                    {timedMode && timeLimitSec != null ? (
                      <div className="nn-cat-exam-timing-alert mb-5" role="alert">
                        {tx(
                          "learner.practiceTests.run.timedAutoEnd",
                          "Timed session: the exam may end automatically when time expires.",
                        )}
                      </div>
                    ) : null}

                    {catLiveTransparency || adaptiveDifficultyHistory.length > 0 ? (
                      <div className="mb-5">
                        <CatLiveTransparencyStrip
                          difficultyTail={adaptiveDifficultyHistory}
                          theta={adaptiveTheta}
                          se={adaptiveSe}
                          show={catLiveTransparency}
                          onToggle={setCatLiveTransparency}
                        />
                      </div>
                    ) : null}

                    <p className="nn-cat-options-label">
                      {isSata
                        ? tx("learner.practiceTests.run.selectAllThatApply", "Select all that apply")
                        : tx("learner.practiceTests.run.selectBestAnswer", "Select the best answer")}
                    </p>

                    {catOptions}

                    {confidenceTrackingEnabled && hasMeaningfulAnswer(current.id) ? (
                      <div className="mt-4">
                        <ConfidenceSelector
                          questionId={current.id}
                          value={confidence[current.id] ?? null}
                          neutral
                          onChange={setConfidenceForQuestion}
                        />
                      </div>
                    ) : null}

                    <div className="nn-cat-question-nav nn-question-nav-actions">
                      <button
                        type="button"
                        aria-pressed={Boolean(flagged[current.id])}
                        disabled={controlsBusy}
                        className={`nn-cat-question-nav__flag inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-semibold transition ${
                          flagged[current.id]
                            ? "border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] text-[var(--semantic-text-primary)]"
                            : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-muted)] hover:bg-[var(--semantic-panel-muted)]"
                        }`}
                        onClick={() => setFlagged((f) => ({ ...f, [current.id]: !f[current.id] }))}
                      >
                        <span aria-hidden="true">{flagged[current.id] ? "★" : "☆"}</span>
                        {flagged[current.id]
                          ? tx("learner.practiceTests.run.flagged", "Flagged")
                          : tx("learner.practiceTests.run.flag", "Flag")}
                      </button>
                      <button
                        type="button"
                        disabled={controlsBusy}
                        className="text-xs font-medium text-[var(--semantic-text-muted)] underline-offset-2 hover:text-[var(--semantic-text-secondary)] hover:underline"
                        onClick={() => void abandon()}
                      >
                        {tx("learner.practiceTests.run.endSession", "End session")}
                      </button>
                      {isExamStyle ? (
                        idx < total - 1 ? (
                          <button
                            type="button"
                            disabled={controlsBusy || !hasMeaningfulAnswer(current.id)}
                            className="nn-btn-primary min-h-[2.75rem] rounded-lg px-6 text-sm font-semibold shadow-none disabled:opacity-40"
                            onClick={() => void catAdvance()}
                          >
                            {saving
                              ? tx("learner.practiceTests.run.working", "Working...")
                              : tx("learner.practiceTests.run.nextQuestion", "Next question")}
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={controlsBusy || !hasMeaningfulAnswer(current.id)}
                            className="nn-btn-primary min-h-[2.75rem] rounded-lg px-6 text-sm font-semibold shadow-none disabled:opacity-40"
                            onClick={() => void catAdvance()}
                          >
                            {saving
                              ? tx("learner.practiceTests.run.working", "Working...")
                              : tx("learner.practiceTests.run.submitAndFinish", "Submit & finish")}
                          </button>
                        )
                      ) : rationalePanelMode === "feedback" ? null : (
                        <button
                          type="button"
                          disabled={controlsBusy || !hasMeaningfulAnswer(current.id)}
                          className="nn-btn-primary min-h-[2.75rem] rounded-lg px-6 text-sm font-semibold shadow-none disabled:opacity-40"
                          onClick={() => void catAdvance()}
                        >
                          {saving
                            ? tx("learner.practiceTests.run.working", "Working...")
                            : tx("learner.practiceTests.run.seeExplanation", "See explanation")}
                        </button>
                      )}
                    </div>
                  </QuestionCard>
                </div>

                {isExamStyle ? (
                  <SessionSplitRationaleAside variant="locked" />
                ) : (
                  <aside className="nn-question-session-rationale space-y-4">
                    <RationalePanel
                      mode={rationalePanelMode}
                      feedback={
                        rationalePanelMode === "feedback" ? catStudyFeedback ?? undefined : undefined
                      }
                      optionKeys={optsCanonical}
                      optionTexts={optsDisplay}
                    />
                  </aside>
                )}
              </div>
            </div>
          </ExamSessionShell>
