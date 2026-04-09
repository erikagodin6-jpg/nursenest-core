/**
 * Letter index (A, B, C, …) for MCQ/SATA rows — presentation only; keeps stems and options unchanged.
 */
export function QuestionChoiceLetter({ index }: { index: number }) {
  const letter = index >= 0 && index < 26 ? String.fromCharCode(65 + index) : "?";
  return (
    <span className="nn-qopt-letter" aria-hidden>
      {letter}
    </span>
  );
}
