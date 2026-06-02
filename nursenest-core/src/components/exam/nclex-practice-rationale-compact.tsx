"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, BookOpen, Lightbulb, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

export type NclexPracticeRationaleCompactProps = {
  status: "waiting" | "correct" | "incorrect" | null;
  correctKeys?: string[];
  optionDisplayMap?: Record<string, string>;
  correctAnswerExplanation?: string | null;
  rationale?: string | null;
  primaryDistractorText?: string | null;
  relatedLessons?: { title: string; href: string }[];
  keyTakeaway?: string | null;
  clinicalPearl?: string | null;
  referenceSource?: string | null;
};

export function NclexPracticeRationaleCompact({
  status,
  correctKeys = [],
  optionDisplayMap = {},
  correctAnswerExplanation,
  rationale,
  primaryDistractorText,
  relatedLessons = [],
  keyTakeaway,
  clinicalPearl,
  referenceSource,
}: NclexPracticeRationaleCompactProps) {
  const [showRefs, setShowRefs] = useState(false);

  if (status === "waiting" || status === null) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 1rem",
          gap: "0.75rem",
          color: "var(--semantic-text-muted, #94a3b8)",
          textAlign: "center",
        }}
      >
        <BookOpen size={28} aria-hidden style={{ opacity: 0.5 }} />
        <p style={{ fontSize: "0.875rem", maxWidth: "22rem", lineHeight: 1.5 }}>
          Submit your answer to see the rationale, key takeaways, and lesson links.
        </p>
      </div>
    );
  }

  const isCorrect = status === "correct";
  const correctLabel = correctKeys.map((k) => optionDisplayMap[k] ?? k).join(", ") || "—";
  const explanationText = (correctAnswerExplanation ?? rationale ?? "").trim();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Status badge */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "0.75rem",
          padding: "0.875rem 1rem",
          borderRadius: "0.625rem",
          background: isCorrect
            ? "color-mix(in srgb, var(--semantic-success, #16a34a) 10%, var(--semantic-surface, #fff))"
            : "color-mix(in srgb, var(--semantic-danger, #dc2626) 10%, var(--semantic-surface, #fff))",
          border: `1.5px solid ${isCorrect
            ? "color-mix(in srgb, var(--semantic-success, #16a34a) 28%, var(--semantic-border-soft, #e2e8f0))"
            : "color-mix(in srgb, var(--semantic-danger, #dc2626) 28%, var(--semantic-border-soft, #e2e8f0))"}`,
        }}
      >
        {isCorrect
          ? <CheckCircle2 size={18} aria-hidden style={{ color: "var(--semantic-success, #16a34a)", flexShrink: 0, marginTop: "0.1rem" }} />
          : <XCircle size={18} aria-hidden style={{ color: "var(--semantic-danger, #dc2626)", flexShrink: 0, marginTop: "0.1rem" }} />}
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--semantic-text-primary)", marginBottom: "0.2rem" }}>
            {isCorrect ? "Correct" : "Incorrect"}
          </p>
          <p style={{ fontSize: "0.8125rem", color: "var(--semantic-text-secondary)", lineHeight: 1.45 }}>
            <span style={{ fontWeight: 600 }}>Correct answer: </span>
            {correctLabel}
          </p>
          {!isCorrect && primaryDistractorText && (
            <p style={{ fontSize: "0.8125rem", color: "var(--semantic-text-secondary)", marginTop: "0.375rem", lineHeight: 1.45 }}>
              <span style={{ fontWeight: 600 }}>Why not your choice: </span>
              {primaryDistractorText}
            </p>
          )}
        </div>
      </div>

      {/* Explanation */}
      {explanationText ? (
        <section>
          <h3 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--semantic-text-muted, #64748b)", marginBottom: "0.5rem" }}>
            Explanation
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--semantic-text-primary)", lineHeight: 1.6 }}>
            {explanationText}
          </p>
        </section>
      ) : null}

      {/* Key Takeaway */}
      {keyTakeaway ? (
        <section
          style={{
            display: "flex",
            gap: "0.625rem",
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            background: "color-mix(in srgb, var(--semantic-brand, #0f2d57) 6%, var(--semantic-surface, #fff))",
            border: "1.5px solid color-mix(in srgb, var(--semantic-brand, #0f2d57) 16%, var(--semantic-border-soft, #e2e8f0))",
          }}
        >
          <Lightbulb size={15} aria-hidden style={{ color: "var(--semantic-brand, #0f2d57)", flexShrink: 0, marginTop: "0.125rem" }} />
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--semantic-brand, #0f2d57)", marginBottom: "0.25rem" }}>
              Key Takeaway
            </p>
            <p style={{ fontSize: "0.8125rem", color: "var(--semantic-text-primary)", lineHeight: 1.5 }}>
              {keyTakeaway}
            </p>
          </div>
        </section>
      ) : null}

      {/* Clinical pearl */}
      {clinicalPearl ? (
        <section>
          <h3 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--semantic-text-muted, #64748b)", marginBottom: "0.5rem" }}>
            Clinical Pearl
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--semantic-text-primary)", lineHeight: 1.6 }}>
            {clinicalPearl}
          </p>
        </section>
      ) : null}

      {/* Related lessons */}
      {relatedLessons.length > 0 ? (
        <section>
          <h3 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--semantic-text-muted, #64748b)", marginBottom: "0.5rem" }}>
            Study Further
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            {relatedLessons.map((lesson) => (
              <li key={lesson.href}>
                <Link
                  href={lesson.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--semantic-brand, #0f2d57)",
                    textDecoration: "none",
                  }}
                >
                  <ExternalLink size={12} aria-hidden />
                  {lesson.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* View References (collapsible) */}
      {referenceSource ? (
        <section>
          <button
            type="button"
            onClick={() => setShowRefs((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--semantic-text-secondary, #64748b)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
            aria-expanded={showRefs}
          >
            {showRefs ? <ChevronUp size={14} aria-hidden /> : <ChevronDown size={14} aria-hidden />}
            View References
          </button>
          {showRefs ? (
            <p style={{ marginTop: "0.5rem", fontSize: "0.8125rem", color: "var(--semantic-text-muted, #64748b)", lineHeight: 1.5 }}>
              {referenceSource}
            </p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
