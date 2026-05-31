import {
  normalizeClinicalPearlLines,
  type ClinicalPearlLine,
} from "@/lib/lessons/extract-clinical-pearl-lines";

export function LessonClinicalPearlsRail({
  pearls,
  collapsed = false,
}: {
  pearls: ClinicalPearlLine[];
  collapsed?: boolean;
}) {
  const safePearls = normalizeClinicalPearlLines(pearls, {
    source: "LessonClinicalPearlsRail",
  });

  if (collapsed || safePearls.length === 0) return null;

  return (
    <div
      className="nn-lesson-clinical-pearls-rail"
      data-nn-lesson-clinical-pearls-rail
      aria-label="Clinical pearls"
    >
      <p className="nn-lesson-clinical-pearls-rail__label">Clinical Pearls</p>
      <ul className="nn-lesson-clinical-pearls-rail__list">
        {safePearls.map((pearl, index) => (
          <li key={`${pearl.text.slice(0, 24)}-${index}`}>
            <div className="nn-lesson-clinical-pearls-rail__box">
              <b>{pearl.label}</b>
              <p>{pearl.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
