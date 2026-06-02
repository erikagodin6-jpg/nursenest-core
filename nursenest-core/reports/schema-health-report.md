# Phase 8 — Schema Validation Report
Generated: 2026-05-30 | Source: `src/components/seo/seo-json-ld.tsx`

---

## Schema Components Inventory

All schema components live in `src/components/seo/seo-json-ld.tsx`.

| Schema Type | Component | Used On |
|---|---|---|
| `WebSite` | `WebSiteJsonLd` | Global site header |
| `Organization` | `OrganizationJsonLd` | Sitewide (via layout) |
| `WebPage` | `WebPageJsonLd` | Exam pathway hub pages |
| `BreadcrumbList` | `BreadcrumbJsonLd` | Exam pathway hubs, lesson pages |
| `Course` | `ExamPrepCourseJsonLd` | Exam pathway hub pages |
| `EducationalOccupationalProgram` | (via Course) | Exam pathway hubs |
| `Article` | `ArticleJsonLd` | Blog posts |
| `FAQPage` | `FaqJsonLd` | Pricing page, commercial landing pages |
| `MedicalWebPage` | Not confirmed present | ❌ Missing |
| `MedicalCondition` | Not confirmed present | ❌ Missing |

---

## Schema Coverage by Page Type

### Exam Pathway Hub Pages (`/us/rn/nclex-rn`)

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "NCLEX-RN Exam Prep | United States | NurseNest",
  "description": "...",
  "provider": {
    "@type": "Organization",
    "name": "NurseNest",
    "url": "https://nursenest.io"
  },
  "educationalLevel": "Professional",
  "courseCode": "nclex-rn",
  "hasCourseInstance": {...}
}
```

**Status:** ✅ Course schema present. Breadcrumb schema present.

### Blog Posts

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "author": {...},
  "datePublished": "...",
  "publisher": {...}
}
```

**Status:** ✅ Article schema present.

### Pricing Page

FAQPage schema present via `FaqJsonLd` in `pricing-subscription-faq.tsx`.

**Status:** ✅ FAQ schema present.

### NCLEX Commercial Landing Pages

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [...]
}
```

**Status:** ✅ FAQ schema present for commercial landing pages.

---

## Missing Schema

### MedicalWebPage — HIGH Priority for SEO Authority

Clinical content pages (lessons about cardiac conditions, pharmacology, etc.) should use `MedicalWebPage` schema. This signals to Google that the content is medically relevant and reviewed.

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "name": "Heart Failure: Pathophysiology and Nursing Management",
  "medicalAudience": {
    "@type": "MedicalAudience",
    "audienceType": "Nurse"
  },
  "lastReviewed": "2026-01-01",
  "reviewedBy": {
    "@type": "Organization",
    "name": "NurseNest Clinical Team"
  }
}
```

**File to modify:** Lesson detail page metadata generator.

### MedicalCondition — MEDIUM Priority

Glossary pages covering specific medical conditions could use `MedicalCondition` schema.

---

## Schema Validation Findings

| Schema Type | Valid | Issues |
|---|---|---|
| `WebSite` | ✅ Valid | None |
| `Organization` | ✅ Valid | None |
| `Course` (exam hub) | ✅ Valid | `courseCode` field — verify Google accepts non-standard codes |
| `BreadcrumbList` | ✅ Valid | None |
| `Article` (blog) | ✅ Valid | Verify `dateModified` is updated on content changes |
| `FAQPage` (pricing) | ✅ Valid | None |
| `MedicalWebPage` | ❌ Not present | Add to lesson detail pages |
| `MedicalCondition` | ❌ Not present | Add to glossary pages |

---

## Action Items

| Action | Priority | Effort | Impact |
|---|---|---|---|
| Add `MedicalWebPage` schema to lesson detail pages | HIGH | 4h | High — improves healthcare EEAT signals |
| Verify `Article.dateModified` updates on blog edits | MEDIUM | 1h | Medium |
| Add `MedicalCondition` schema to glossary | LOW | 3h | Low-medium |
| Test all schema in Google Rich Results Test | HIGH | 1h | Verification |
| Submit to Google for rich results eligibility (Course, FAQ, Article) | HIGH | 0.5h | Visibility |

---

## Rich Results Eligibility

| Rich Result Type | Eligible? | Status |
|---|---|---|
| Course carousel | ✅ Yes | `Course` schema present |
| FAQ rich results | ✅ Yes | `FAQPage` schema present |
| Article rich results | ✅ Yes | `Article` schema present |
| Breadcrumb rich results | ✅ Yes | `BreadcrumbList` present |
| Medical rich results | ❌ No | `MedicalWebPage` not present yet |
