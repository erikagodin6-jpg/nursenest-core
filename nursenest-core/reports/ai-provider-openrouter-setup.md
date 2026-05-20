# OpenRouter setup for blog / marketing AI

## Purpose

Route **blog** and marketing content generation that uses `openAiChatCompletion({ useBlogOpenAiApiKey: true })` through [OpenRouter](https://openrouter.ai/) when OpenAI returns billing errors (for example `insufficient_quota`) or when you prefer OpenRouter billing.

Non-blog callers (coach, study plan, lesson gap-fill, admin exam tools, and so on) **continue to require** `AI_INTEGRATIONS_OPENAI_API_KEY` or `OPENAI_API_KEY`.

## Environment variables

| Variable | Required | Notes |
|----------|----------|--------|
| `AI_PROVIDER` | For OpenRouter path | Set to `openrouter` so blog chat uses OpenRouter when `BLOG_AI_PROVIDER` is unset. |
| `BLOG_AI_PROVIDER` | Optional | `openai` \| `openrouter` \| `gemini`. When set to a known value, it **overrides** `AI_PROVIDER` for the blog chat path only. |
| `OPENROUTER_API_KEY` | Yes for OpenRouter | From OpenRouter dashboard. |
| `OPENROUTER_MODEL` | Recommended | Slug such as `openai/gpt-4o-mini`. If omitted, blog routing falls back through `BLOG_OPENAI_MODEL` → `AI_INTEGRATIONS_OPENAI_MODEL` → default `openai/gpt-4o-mini`. |
| `OPENROUTER_HTTP_REFERER` / `OPENROUTER_APP_TITLE` | Optional | OpenRouter attribution headers; defaults are set in code. |

## Runtime validation

`validateRuntimeEnvOrThrow` (and `scripts/runtime-env-guard-bootstrap.mjs`) accept **either**:

- `AI_INTEGRATIONS_OPENAI_API_KEY` or `OPENAI_API_KEY`, or  
- `OPENROUTER_API_KEY` when blog chat is configured for OpenRouter (`blogChatUsesOpenRouter()` — same rules as `getBlogAiChatProvider()`).

## OpenAI quota errors

If OpenAI returns a quota-style error during blog generation, the thrown error appends guidance to configure `AI_PROVIDER=openrouter` (or `BLOG_AI_PROVIDER=openrouter`) with `OPENROUTER_API_KEY` and `OPENROUTER_MODEL`. There is **no** automatic retry loop on OpenAI after failure.

## CLI scripts

Blog CLIs (`scripts/blog-ai-generate.ts`, `scripts/run-blog-batch.ts`, `scripts/generate-blog-posts.ts`) call `assertOpenAiKeyConfigured({ pipeline: "blog" })` and log `getBlogGenerationModelLabelForLogs()` so the printed model matches the active provider.

## Verification

```bash
cd nursenest-core
npm run typecheck
npx tsx --test src/lib/ai/blog-ai-routing.test.ts
npx tsx --test src/lib/ai/openai-blog-lesson-model.test.ts
```

Dry-run blog generation (no paid batch):

```bash
npx tsx scripts/blog-ai-generate.ts --dry-run --limit=1 --topic="Test topic for wiring only"
```

Requires DB and keys appropriate to your env; omit if not available.

## Code map

- `src/lib/ai/blog-ai-routing.ts` — `getBlogAiChatProvider()`, `blogChatUsesOpenRouter()`
- `src/lib/ai/blog-ai-provider.ts` — `blogAiChatCompletion`, shared `openRouterChatCompletion`
- `src/lib/ai/openai-env.ts` — keys, `getBlogOpenRouterChatModel`, `assertOpenAiKeyConfigured`, CLI helpers
- `src/lib/ai/openai-chat-completions.ts` — `openAiChatCompletion` blog branch
- `src/lib/ai/openai-quota-hint.ts` — quota error hint text
