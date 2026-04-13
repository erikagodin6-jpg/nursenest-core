ALTER TABLE "User"
ADD COLUMN "enable_adaptive_plan" BOOLEAN,
ADD COLUMN "enable_spaced_repetition" BOOLEAN,
ADD COLUMN "enable_confidence_tracking" BOOLEAN,
ADD COLUMN "enable_pre_post_quizzes" BOOLEAN,
ADD COLUMN "show_heatmap" BOOLEAN,
ADD COLUMN "show_advanced_insights" BOOLEAN,
ADD COLUMN "enable_weakness_alerts" BOOLEAN,
ADD COLUMN "enable_decay_alerts" BOOLEAN,
ADD COLUMN "preferred_session_length" INTEGER;
