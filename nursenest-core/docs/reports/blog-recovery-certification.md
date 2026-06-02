# Blog Recovery Certification Audit
Generated: 2026-06-01

## Data Source Note
**Database unavailable.** The `DATABASE_URL` in `.env.local` is a placeholder (`postgresql://USER:PASSWORD@HOST:PORT/DATABASE`). All counts are based on the two static blog corpora in the repository:
- **Static TS corpus** (`src/content/blog-static-posts.ts`): 3 posts
- **Static longtail corpus** (`src/content/blog-static-longtail/`): 4,595 unique markdown files

The Prisma schema (`prisma/schema.prisma`) defines `BlogPost.postStatus` (`DRAFT | SCHEDULED | PUBLISHED | NEEDS_REVIEW | APPROVED | FAILED`). Without DB access, all status classifications are inferred from static file metadata only. The DB may contain additional posts not reflected here.

---

## Summary
| Metric | Count |
|--------|-------|
| Total Articles (static sources) | 4,598 |
| Published (publishedAt <= 2026-06-01, no draft flag) | 4,598 |
| Scheduled (publishedAt > 2026-06-01) | 0 |
| Draft (draft: true) | 0 |
| Orphaned (slug has no matching route) | 0 |
| Indexed (noIndex not set) | 4,598 |
| Non-Indexed (noIndex=true) | 0 |
| Missing Cover Image | 4,595 |
| Thin Content (<300 words) | 338 |
| Pipeline Pointers (stub body) | 50 |
| Missing CTA (/app/ links = 0) | 157 |
| Missing Internal Links (<3 total) | 70 |

**Note:** The `noIndex` field does not exist in the longtail frontmatter schema or the static TS corpus type. The Prisma `BlogPost` model also has no `noIndex` column. There is no mechanism to flag individual posts as noindex in the static corpus. Assume all static posts are indexable.

---

## Status Breakdown by Locale
| Locale | Published | Scheduled | Draft | Total |
|--------|-----------|-----------|-------|-------|
| en (English) | 3,398 | 0 | 0 | 3,398 |
| pt (Portuguese) | 150 | 0 | 0 | 150 |
| es (Spanish) | 150 | 0 | 0 | 150 |
| ar (Arabic) | 150 | 0 | 0 | 150 |
| tl/fil (Filipino) | 150 | 0 | 0 | 150 |
| zh-Hans (Chinese Simplified) | 150 | 0 | 0 | 150 |
| fr (French) | 150 | 0 | 0 | 150 |
| hi (Hindi) | 150 | 0 | 0 | 150 |
| ja (Japanese) | 150 | 0 | 0 | 150 |
| **Total** | **4,598** | **0** | **0** | **4,598** |

*Note: The 3 static TS posts are English; the 4,595 longtail posts include all locales.*

---

## English Content Breakdown by Pathway
| Pathway | Count |
|---------|-------|
| NCLEX-RN / RN | 785 |
| REx-PN / CPNRE / RPN | 689 |
| Nurse Practitioner (NP) | 747 |
| Other EN (New Grad, RT, EMS, MLT, Allied, International, etc.) | 1,177 |
| **Total EN** | **3,398** |

---

## Publish Date Distribution (Longtail Corpus)
| PublishedAt | Count |
|-------------|-------|
| 2026-03-10 | 1 |
| 2026-03-11 | 1 |
| 2026-03-12 | 1 |
| 2026-05-09 | 3,825 |
| 2026-05-10 | 60 |
| 2026-05-14 | 12 |
| 2026-05-27 | 695 |
| Static TS (createdAt) | 3 |

All publish dates are in the past relative to 2026-06-01. Zero posts are future-scheduled in the static corpus.

---

## Failures Summary
| Issue | Count | Severity |
|-------|-------|----------|
| MISSING_IMAGE (no coverImage field in schema/files) | 4,595 | MEDIUM |
| THIN_CONTENT (<300 words, non-pipeline) | 288 | MEDIUM |
| THIN_CONTENT (pipeline pointer stub) | 50 | HIGH |
| MISSING_INTERNAL_LINKS (<3 total links) | 70 | MEDIUM |
| MISSING_CTA (zero /app/ links) | 157 | LOW |

### Key Failures Detail

**THIN_CONTENT — Pipeline Pointer Stubs (50 posts, HIGH)**
Files matching the pattern `*-pipeline.md` where the body contains `"Production HTML for this topic lives in..."`. These are placeholder stubs with 35–50 words pointing to external `data/blog-content/` directories. The canonical body HTML was not found in the repository. These posts are publicly accessible at `/blog/{slug}` but serve only stub content.

Sample stubs:
- `newgrad-nursing-missed-assessment-on-psychiatry-a-practical-pipeline`
- `nclex-patho-abg-post-arrest-pipeline`
- `nclex-patho-ards-prone-pipeline`
- `nclex-patho-qsofa-sirs-pipeline`
- `nclex-patho-sglt2-hf-pipeline`

**THIN_CONTENT — Non-Pipeline (<300 words, 288 posts, MEDIUM)**
Primarily Japanese (`ja-intl-*`) and Chinese Simplified (`zh-hans-intl-*`) posts in the international nursing cluster (approximately 224–231 words each), plus some English RT/nursing exam posts.

**MISSING_INTERNAL_LINKS — Zero links (70 posts, MEDIUM)**
Includes all pipeline stubs plus standalone RT study posts lacking any href attributes:
- `abg-interpretation-tricks-for-rt-students`
- `respiratory-therapy-study-guide-for-board-exams`
- `how-to-pass-respiratory-therapy-board-exam`
- `hyperkalemia-ecg-changes-explained`
- `oxygen-delivery-devices-explained-for-rt-students`
- `ventilator-modes-explained-for-rt-students`

**MISSING_CTA (157 posts, LOW)**
Posts with no `/app/` prefixed links. The 3 static TS posts link to `/question-bank`, `/flashcards`, `/tools` (not `/app/` paths) and are also technically MISSING_CTA by this criterion. Plus 154 longtail posts.

---

## Notes
1. Database was unreachable during this audit (placeholder credentials). All analysis uses the static file corpus only.
2. The `noIndex` field does not exist in the `BlogPost` Prisma schema or static post type definitions. No posts are programmatically hidden via noIndex.
3. The static TS corpus (`blog-static-posts.ts`) and static JSON (`blog-static-posts.json`) both carry the same 3 slugs — they appear to be dual formats of the same content and are counted once.
4. Route analysis: All posts match the `/blog/[slug]` dynamic route. No orphaned slugs identified (all slugs are valid path segments; none have `careerSlug` in the static corpus that would redirect to a different canonical path).
5. The blog post page (`/blog/[slug]/page.tsx`) always emits `BlogPostingJsonLd` (structured data) and generates a canonical via `resolvePublicCanonicalUrl`. Both checks pass for all static posts.
