/**
 * Shared long-form article size floors (no imports from the generation pipeline — keeps
 * {@link validateBlogPrePublish} free of cycles with {@link persistControlPanelDraft}).
 */

export const BLOG_ARTICLE_MIN_BODY_CHARS = 450;
