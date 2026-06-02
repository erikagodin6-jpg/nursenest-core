# Admin blog generator / publisher — fix report

**Date:** 2026-05-09  
**Scope:** Queue → generate → validate → schedule/publish path, provider/env resolution, admin UI error surfacing, batch schedule detail parity, logging.

## Summary

- Blog OpenRouter model resolution now prefers `BLOG_OPENROUTER_MODEL` over `OPENROUTER_MODEL`; shared non-blog path keeps `OPENROUTER_MODEL` first.
- Generation job tick failures return `code` + `message`; draft batch UI aggregates API error fields.
- Batch schedule GET includes `blogPost` on items; topic batch + draft batch show slug and public `/blog/[slug]` preview links.
- `generateAutomatedBlogPost` logs `blogAiProvider` + `blogAiModel` at generation start.
- Gemini JSON accepts `BLOG_GEMINI_MODEL` before `GEMINI_MODEL`.

## Verification article

Topic: *Why potassium changes are dangerous in acute kidney injury nursing exams* — expected slug `why-potassium-changes-are-dangerous-in-acute-kidney-injury-nursing-exams`. **Not published in this sandbox** (no live keys / build OOM).

## Commands

- `npm run typecheck:critical` → exit 0  
- `node --import tsx --test src/lib/ai/openai-blog-lesson-model.test.ts` → exit 0  
- `npm run test:blog-recovery` → exit 0  
- `npm run test:homepage` → exit 0  
- `npm run build` → exit 137 (OOM / Killed)

## Truthpack

No `.vibecheck/truthpack` JSON found in checked paths; env names match code in `openai-env.ts`, `blog-ai-routing.ts`, `gemini-json.ts`.
