# OpenRouter blog generation fix (2026-05-09)

## Summary

- **Model resolution**: `OPENROUTER_MODEL` → `BLOG_OPENROUTER_MODEL` → `openai/gpt-4o-mini` via `resolveOpenRouterModelSlugFromEnv()`; `getBlogOpenRouterChatModel()` / `getOpenRouterChatModel()` no longer throw when unset.
- **Startup logging**: First OpenRouter chat completion logs `[OpenRouter] Resolved chat model slug: …` (no secrets).
- **404 / routing failures**: HTTP 404 or bodies indicating no endpoints / unknown model produce an actionable error pointing operators at `OPENROUTER_MODEL` / `BLOG_OPENROUTER_MODEL` and https://openrouter.ai/models. No special retry loop was added (existing repair paths do not treat these as transient).
- **Topic repair**: Generic prefixes (“Understanding…”, “Guide to…”, etc.) are stripped and `normalizeBlogTopicIntent` re-runs (bounded depth) before final rejection; `validateSpecificTopic` failures tied to generic phrasing trigger the same peel when applicable.
- **Docs**: `docs/INTEGRATIONS_RUNBOOK.md`, `docs/environment-reference.md`, `scripts/blog-ai-generate.ts`, `scripts/diagnose-blog-openrouter-env.ts` updated; removed all references to `anthropic/claude-3.5-sonnet`.

## Truthpack

`.vibecheck/truthpack/` was **not present** in this workspace clone (glob search under repo root returned no matches). No truthpack fields were modified.

## Files changed

| Path |
|------|
| `nursenest-core/src/lib/ai/openai-env.ts` |
| `nursenest-core/src/lib/ai/blog-ai-provider.ts` |
| `nursenest-core/src/lib/blog/blog-seo-topic-intent.ts` |
| `nursenest-core/src/lib/blog/blog-seo-topic-intent.test.ts` |
| `nursenest-core/src/lib/ai/openai-blog-lesson-model.test.ts` |
| `nursenest-core/src/lib/ai/blog-ai-provider.test.ts` |
| `nursenest-core/scripts/diagnose-blog-openrouter-env.ts` |
| `nursenest-core/scripts/blog-ai-generate.ts` |
| `nursenest-core/docs/INTEGRATIONS_RUNBOOK.md` |
| `nursenest-core/docs/environment-reference.md` |
| `nursenest-core/reports/openrouter-blog-model-fix-2026-05-09.md` (this file) |

## Grep proof (`anthropic/claude-3.5-sonnet`)

Run from repo root:

```bash
grep -r "anthropic/claude-3.5-sonnet" nursenest-core || echo "no matches"
```

Expected: **no matches**.

## Validation

Commands run (from `nursenest-core/`):

```bash
npx tsx --test src/lib/blog/blog-seo-topic-intent.test.ts \
  src/lib/ai/openai-blog-lesson-model.test.ts \
  src/lib/ai/blog-ai-provider.test.ts
npx tsx --test src/lib/blog/blog-topic-intent-pipeline.contract.test.ts
```

Result: **all passed** (46 + 1 tests in the combined topic/OpenRouter run; 4 blog-ai-provider tests including new 404 case; 1 contract test).

**Smallest blog/OpenRouter dry check**: `npx tsx scripts/diagnose-blog-openrouter-env.ts` — prints provider, resolved model label, and redacted key metadata (no network call).

Full `scripts/blog-ai-generate.ts --dry-run` was not run here (requires DB/bootstrap); use when validating end-to-end against a configured database.
