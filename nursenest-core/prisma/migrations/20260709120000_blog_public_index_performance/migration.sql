-- Public /blog index performance.
-- Supports bounded list queries that filter by public lifecycle fields and sort by newest first.

CREATE INDEX IF NOT EXISTS "BlogPost_public_status_workflow_publish_sort_idx"
ON "BlogPost" (
  "postStatus",
  "workflowStatus",
  "publishAt",
  "updatedAt" DESC,
  "createdAt" DESC,
  "slug"
);

CREATE INDEX IF NOT EXISTS "BlogPost_public_locale_status_workflow_publish_sort_idx"
ON "BlogPost" (
  "locale",
  "postStatus",
  "workflowStatus",
  "publishAt",
  "updatedAt" DESC,
  "createdAt" DESC,
  "slug"
);

CREATE INDEX IF NOT EXISTS "BlogPost_public_career_locale_status_workflow_sort_idx"
ON "BlogPost" (
  "careerSlug",
  "locale",
  "postStatus",
  "workflowStatus",
  "publishAt",
  "updatedAt" DESC,
  "createdAt" DESC,
  "slug"
);

CREATE INDEX IF NOT EXISTS "BlogPost_public_category_status_workflow_sort_idx"
ON "BlogPost" (
  "category",
  "postStatus",
  "workflowStatus",
  "publishAt",
  "updatedAt" DESC,
  "createdAt" DESC,
  "slug"
);

CREATE INDEX IF NOT EXISTS "BlogPost_tags_gin_idx"
ON "BlogPost" USING GIN ("tags");
