# OpenRouter blog model fix — 2026-05-09

## Summary
- Model resolution: OPENROUTER_MODEL → BLOG_OPENROUTER_MODEL → openai/gpt-4o-mini (`openai-env.ts`); `openRouterErrorIndicatesInvalidModelSlug()` for 404/no-endpoint errors.
- blog-ai-provider: operator-facing routing errors; first-call log with slug only.
- Classifier + admin generate-ai: invalid slug errors are not transient-retried.
- blog-seo-topic-intent: clinical suffix repair helper + forbidden-branch repair.
- package.json: fixed generate:blogs scripts.
- Docs, README, .env.example, diagnose script updated; removed claude-3.5-sonnet examples.

## Tests
node --import tsx --test on blog-ai-provider, openai-blog-lesson-model, blog-generation-repair-retry, blog-seo-topic-intent, blog-cli — pass.

## rg anthropic/claude-3.5-sonnet
Clean in product paths after this change.
