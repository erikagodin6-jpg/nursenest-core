# International Content Recovery Report

Date: 2026-05-31

Status: internal recovery audit. This report does not authorize publication. International pathways and recovered candidates remain draft, admin-only, noindex, hidden from navigation, and unavailable to learners.

## Executive Finding

NurseNest already contains a meaningful international foundation. The strongest recovered assets are not hidden learner pathways; they are reusable clinical content, exam/pathway registries, SEO/blog content, localized exam overlays, draft/import infrastructure, and existing country-scoping fields in lessons, questions, flashcards, simulations, and blog systems.

## Repository Scan Summary

| Signal | Files With Matches |
| --- | ---: |
| United Kingdom / UK / NMC / NMC CBT | 1,592 |
| Australia / NMBA / AHPRA | 1,543 |
| New Zealand / NCNZ | 129 |
| Ireland / NMBI | 70 |
| United States / NCLEX-RN / NCLEX-PN / TEAS / HESI / CASPER | 2,231 |
| Canada / REx-PN / CNPLE | 2,964 |

These counts are repository keyword signals, not publishable content counts. They confirm that expansion should begin with recovery and classification before net-new generation.

## Recovered Content Surfaces

| Surface | Evidence | Reuse Notes |
| --- | --- | --- |
| Static longtail content | `src/content/blog-static-longtail/` | Contains international, UK, Australia, New Zealand, U.S., NCLEX, REx-PN, and global clinical articles. |
| Blog seed data | `data/blog-content/*-nursing/sample-posts.json` | Existing seed sets for Australia, India, Philippines, Middle East, and other regions. |
| Blog manifests | `data/blog-manifest/*-nursing-200.manifest.json` | Existing large-scale planning manifests for international SEO regions. |
| Localized exam overlays | `tools/i18n/marketing/`, `scripts/i18n/` | Exam-specific localized overlays for Australia, India, Philippines, Middle East, and broader exam content. |
| RN/RPN pathway lessons | `src/content/pathway-lessons/` | Active NCLEX/REx-PN lesson catalogs and generated indexes for CA/US pathways. |
| Generated content batches | `output/*-content-batch.json` | Existing RN, PN, NP, Allied, Pre-Nursing, and New Grad content batches for reuse review. |
| Clinical case studies | `src/content/clinical-case-studies.json` | Reusable case/simulation foundation for global deterioration and clinical judgment content. |
| Exam questions | `src/content/questions/` and `ExamQuestion` schema | Existing NCLEX and clinical judgment question structures can be tagged and adapted. |
| Flashcards | `FlashcardDeck`, `Flashcard`, and source files | Existing status/country/tier fields support hidden drafts and market scoping. |
| Import/draft infrastructure | `ContentImportRun`, `LessonBatchQueueItem`, blog draft jobs | Platform already supports review queues and unpublished draft workflows. |

## High-Value Recovered Examples

- UK: Duty of Candour, NMC revalidation, UK ACP topics, medicines reconciliation, safeguarding-adjacent and deterioration content.
- Australia: Australian healthcare system, rural healthcare, digital health documentation, falls prevention, infection control, Australia NP/ACP longtail assets.
- New Zealand: rural nursing and cultural safety signals, with smaller existing volume.
- United States: NCLEX-RN, NCLEX-PN, NGN, CGFNS, ATT/Pearson VUE, and U.S.-specific nursing review articles.
- Global: sepsis, COPD, heart failure, ECG, ABG, shock, electrolyte, pharmacology, lab interpretation, and clinical skills assets.

## Database And Schema Recovery Findings

Existing models already support recovery and hidden states:

- `ContentItem.status` defaults to `draft`.
- `ExamQuestion.status` defaults to `draft` and indexes `status`, `exam`, `tier`, and `countryCode`.
- `PathwayLesson.status` supports content status and pathway scoping.
- `FlashcardDeck.status`, `Flashcard.status`, `country`, `tier`, and visibility fields support unpublished banks.
- Clinical scenarios use draft publish states.
- Blog posts, campaigns, batch schedules, draft generation batches, import runs, and content automation logs support draft/review workflows.

## Required Next Recovery Actions

1. Build a machine-readable inventory from `src/content/blog-static-longtail/`, `src/content/pathway-lessons/`, `output/`, and `data/blog-content/`.
2. Fingerprint titles and slugs across lessons, questions, flashcards, and blog posts.
3. Classify each candidate as `global`, `country_specific`, `exam_specific`, or `future`.
4. Route recovered candidates into `HIDDEN_INTERNATIONAL_CONTENT_INVENTORY`.
5. Keep all recovered international candidates unpublished until editorial review.

