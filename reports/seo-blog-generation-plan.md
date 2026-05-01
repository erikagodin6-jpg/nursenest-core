# SEO bulk blog generation plan

## Script

- **Entry**: `scripts/generate-seo-blog-batch.mjs` (repo root) → runs `nursenest-core/scripts/blog/generate-seo-blog-batch-runner.mts`.
- **Defaults**: dry-run; `--apply` is capped (`--limit>5` requires `--i-understand-large-apply`).
- **Report**: `reports/seo-blog-generation-report.json`.

## Topic clusters (v1)

1. Pharmacology — NCLEX/REx-PN pharmacology, safety, cardiac meds, antibiotics, diabetes, anticoagulants, digoxin, insulin.
2. Pathophysiology — HF, pulmonary edema, AKI, shock, sepsis, DKA, COPD, asthma, stroke, MI.
3. Allied health test prep — MLT, paramedic, RT, imaging, pharm tech, OTA/PTA, PSW, social work, psychotherapy.
4. Nursing exams — NCLEX RN, REx-PN, NP exams, new grad, Canadian nursing prep.

## Each post should include

- Exam-focused intro, clinical explanation, test traps, practice-style prompts, takeaways.
- Internal links to lessons / practice / flashcards / CAT entry points via existing hub builders and curated `relatedLessonPaths`.
- SEO title, meta description, canonical slug — stored on `BlogPost` (`seoTitle`, `seoDescription`, `slug`).

## Production wiring (next)

- `--apply` should enqueue `BlogArticleGenerationJob` or call `runBlogArticleGenerationPipeline` with admin credentials — not enabled without explicit ops approval.
