/**
 * Manual override map: lesson slug → Spaces object key.
 *
 * Use this when an image filename does not cleanly match the lesson slug —
 * for example, when an image was uploaded with a slightly different name,
 * or when multiple lessons share one canonical diagram.
 *
 * FORMAT:
 *   "<lesson-slug>": "uploads/images/<filename>.<ext>"
 *
 * Overrides are checked BEFORE automatic slug matching and always win.
 * Add entries here sparingly; the preferred workflow is to upload images
 * named exactly after the lesson slug so they match automatically.
 *
 * EXAMPLE ENTRIES (uncomment and adjust):
 *
 *   "heart-failure-left-vs-right": "uploads/images/heart-failure-comparison.png",
 *   "aki-acute-kidney-injury": "uploads/images/acute-kidney-injury.webp",
 *   "type-2-diabetes-management": "uploads/images/diabetes-mellitus.webp",
 */
export const LESSON_IMAGE_OVERRIDES: Readonly<Record<string, string>> = {
  // Add overrides here as needed.
};
