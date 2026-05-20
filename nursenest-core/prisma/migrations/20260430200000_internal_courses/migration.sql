-- Feature-gated internal interactive courses (not public marketing).
DO $$ BEGIN
  CREATE TYPE "InternalCourseStatus" AS ENUM ('draft', 'internal', 'published');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "InternalCourseModuleType" AS ENUM ('ecg', 'scenario', 'quiz', 'decision_tree');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "internal_courses" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "title" VARCHAR(240) NOT NULL,
    "description" TEXT NOT NULL,
    "status" "InternalCourseStatus" NOT NULL DEFAULT 'draft',
    "pathway_ids" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "internal_courses_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "internal_courses_code_key" ON "internal_courses"("code");
CREATE INDEX IF NOT EXISTS "internal_courses_status_idx" ON "internal_courses"("status");

CREATE TABLE IF NOT EXISTS "internal_course_modules" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "type" "InternalCourseModuleType" NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "content" JSONB NOT NULL,
    "pathway_id" VARCHAR(64),
    "lesson_slug" VARCHAR(200),

    CONSTRAINT "internal_course_modules_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "internal_course_modules_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "internal_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "internal_course_modules_course_id_sort_order_idx" ON "internal_course_modules"("course_id", "sort_order");
