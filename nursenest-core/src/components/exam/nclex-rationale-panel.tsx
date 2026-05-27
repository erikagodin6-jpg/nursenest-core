"use client";

import { CheckCircle, XCircle, Info, AlertTriangle, X, Lock } from "lucide-react";

export type NclexRationalePanelStatus =
  | "waiting"
  | "correct"
  | "incorrect"
  | "exam_locked";

export type NclexRationaleDistractor = {
  letter: string;
  text: string;
  reason: string;
};

export type NclexRationalePanelProps = {
  status: NclexRationalePanelStatus;
  /** The display text of the correct answer option */
  correctAnswerText?: string | null;
  /** The letter of the correct answer, e.g. "C" */
  correctAnswerLetter?: string | null;
  /** Main explanation of why the correct answer is correct */
  correctExplanation?: string | null;
  /** Per-distractor rationale for incorrect answers */
  distractors?: NclexRationaleDistractor[];
  /** Key takeaway bullet */
  keyTakeaway?: string | null;
  /** Reference source text */
  referenceSource?: string | null;
  /** Clinical pearl */
  clinicalPearl?: string | null;
  onClose?: () => void;
};

export function NclexRationalePanel({
  status,
  correctAnswerText,
  correctAnswerLetter,
  correctExplanation,
  distractors = [],
  keyTakeaway,
  referenceSource,
  clinicalPearl,
  onClose,
}: NclexRationalePanelProps) {
  return (
    <div className="nn-nclex-practice-split__rationale">
      <div className="nn-nclex-rationale__header">
        <span className="nn-nclex-rationale__title">Rationale</span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close rationale panel"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "1.5rem",
              height: "1.5rem",
              borderRadius: "0.375rem",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#94a3b8",
            }}
          >
            <X size={14} aria-hidden />
          </button>
        )}
      </div>

      <div className="nn-nclex-rationale">
        {status === "waiting" && (
          <div className="nn-nclex-rationale__waiting">
            <Info size={28} style={{ margin: "0 auto 0.75rem", display: "block", color: "#cbd5e1" }} />
            <p style={{ fontWeight: 600, color: "#475569", marginBottom: "0.4rem" }}>
              Review appears after you answer.
            </p>
            <p style={{ fontSize: "0.8125rem" }}>
              Submit your response to see the correct answer, explanation, and distractor rationale.
            </p>
          </div>
        )}

        {status === "exam_locked" && (
          <div className="nn-nclex-rationale__waiting">
            <Lock size={24} style={{ margin: "0 auto 0.75rem", display: "block", color: "#cbd5e1" }} />
            <p style={{ fontWeight: 600, color: "#475569", marginBottom: "0.4rem" }}>Answer Locked</p>
            <p style={{ fontSize: "0.8125rem" }}>
              Explanations are revealed when you finish the full exam.
            </p>
          </div>
        )}

        {(status === "correct" || status === "incorrect") && (
          <div className="nn-nclex-rationale__body">

            {/* Correct answer card */}
            {correctAnswerText && (
              <div className="nn-nclex-rationale__answer-card nn-nclex-rationale__answer-card--correct">
                <div className="nn-nclex-rationale__answer-badge nn-nclex-rationale__answer-badge--correct">
                  {correctAnswerLetter ?? <CheckCircle size={12} />}
                </div>
                <div className="nn-nclex-rationale__answer-detail">
                  <p className="nn-nclex-rationale__answer-verdict">Correct answer</p>
                  <p className="nn-nclex-rationale__answer-text">{correctAnswerText}</p>
                </div>
              </div>
            )}

            {/* Outcome badge for the user's selection */}
            {status === "incorrect" && (
              <div className="nn-nclex-rationale__answer-card nn-nclex-rationale__answer-card--incorrect">
                <div className="nn-nclex-rationale__answer-badge" style={{ background: "#dc2626", color: "#fff" }}>
                  <XCircle size={14} />
                </div>
                <div className="nn-nclex-rationale__answer-detail">
                  <p className="nn-nclex-rationale__answer-verdict" style={{ color: "#dc2626" }}>Your answer was incorrect</p>
                  <p className="nn-nclex-rationale__answer-text">
                    Review the explanation below to understand why.
                  </p>
                </div>
              </div>
            )}

            {/* Why this is correct */}
            {correctExplanation && (
              <div className="nn-nclex-rationale__section">
                <div className="nn-nclex-rationale__section-header">
                  <div className="nn-nclex-rationale__section-icon nn-nclex-rationale__section-icon--info">
                    <Info size={10} />
                  </div>
                  <span className="nn-nclex-rationale__section-title">Why this is correct</span>
                </div>
                <p className="nn-nclex-rationale__section-body">{correctExplanation}</p>
              </div>
            )}

            {/* Clinical pearl */}
            {clinicalPearl && (
              <div className="nn-nclex-rationale__section nn-nclex-rationale__section--pearl">
                <div className="nn-nclex-rationale__section-header">
                  <div className="nn-nclex-rationale__section-icon nn-nclex-rationale__section-icon--success">
                    ✦
                  </div>
                  <span className="nn-nclex-rationale__section-title">Clinical Pearl</span>
                </div>
                <p className="nn-nclex-rationale__section-body">{clinicalPearl}</p>
              </div>
            )}

            {/* Why others are incorrect */}
            {distractors.length > 0 && (
              <div className="nn-nclex-rationale__section nn-nclex-rationale__section--incorrect">
                <div className="nn-nclex-rationale__section-header">
                  <div className="nn-nclex-rationale__section-icon nn-nclex-rationale__section-icon--warn">
                    <AlertTriangle size={10} />
                  </div>
                  <span className="nn-nclex-rationale__section-title">Why others are incorrect</span>
                </div>
                {distractors.map((d) => (
                  <div key={d.letter} className="nn-nclex-rationale__distractor">
                    <div className="nn-nclex-rationale__distractor-label">
                      <div className="nn-nclex-rationale__distractor-badge">{d.letter}</div>
                      <span className="nn-nclex-rationale__distractor-text">{d.text}</span>
                    </div>
                    <p className="nn-nclex-rationale__distractor-reason">{d.reason}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Key takeaway */}
            {keyTakeaway && (
              <div className="nn-nclex-rationale__key-takeaway">
                <p className="nn-nclex-rationale__key-takeaway-title">Key Takeaway</p>
                <p className="nn-nclex-rationale__key-takeaway-text">{keyTakeaway}</p>
              </div>
            )}

            {/* References */}
            {referenceSource && (
              <details className="nn-nclex-rationale__references">
                <summary>View References</summary>
                <div className="nn-nclex-rationale__references-body">{referenceSource}</div>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Build distractor list from the existing practice runner data format */
export function buildNclexDistractors(
  allOptionKeys: string[],
  correctKeys: string[],
  optionDisplayMap: Record<string, string>,
  distractorRationalesMap: Record<string, string> | null | undefined,
  missingFallback = "This choice may be plausible, but it is lower priority than the correct answer. Use the stem cues to choose the option that protects safety, addresses the most urgent change, or gives the nurse the assessment data needed before acting.",
): NclexRationaleDistractor[] {
  const correctSet = new Set(correctKeys);
  const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];
  return allOptionKeys
    .filter((k) => !correctSet.has(k))
    .map((k, i) => ({
      letter: LETTERS[i] ?? k.slice(0, 1).toUpperCase(),
      text: optionDisplayMap[k] ?? k,
      reason: distractorRationalesMap?.[k] ?? missingFallback,
    }));
}
