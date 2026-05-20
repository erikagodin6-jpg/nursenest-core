-- Optional study-loop links: scoped pathway + lesson slug for question bank / clinical scenarios.
ALTER TABLE "exam_questions" ADD COLUMN "study_link_pathway_id" VARCHAR(64);
ALTER TABLE "exam_questions" ADD COLUMN "study_link_lesson_slug" VARCHAR(200);

ALTER TABLE "clinical_nursing_scenarios" ADD COLUMN "study_link_lesson_slug" VARCHAR(200);

CREATE INDEX "exam_questions_study_link_pathway_lesson_idx"
  ON "exam_questions" ("study_link_pathway_id", "study_link_lesson_slug");
