# NurseNest — Schema Health Report (Phase 8)

**Date:** 2026-05-30
**Scope:** Schema coverage, accuracy, and errors across all marketing page types

---

## Schema Infrastructure

NurseNest emits structured data via React components in `src/components/seo/`:

| Component | Schema Type | Used On |
|---|---|---|
| `WebPageJsonLd` / `buildMarketingWebPageJsonLdProps` | `WebPage` / `MedicalWebPage` | All marketing pages |
| `BreadcrumbJsonLd` | `BreadcrumbList` | All marketing pages with breadcrumbs |
| `FaqJsonLd` | `FAQPage` | Homepage, select marketing pages |
| `eeat-content-attribution.tsx` | `Article` or `Person` | Blog posts, lesson pages |
| Marketing page-level | `Organization`, `WebSite` | Layout-level (assumed) |

---

## Schema Coverage Audit by Page Type

### Homepage

| Schema | Present | Quality |
|---|---|---|
| `WebPage` | ✅ Yes | `buildMarketingWebPageJsonLdProps` emits correct URL, name, description |
| `BreadcrumbList` | ✅ Yes | `BreadcrumbJsonLd` on homepage |
| `FAQPage` | ✅ Yes | `MARKETING_HOME_FAQ_JSONLD` |
| `Organization` | ⚠️ Needs verify | Should be in layout — confirm presence |
| `WebSite` | ⚠️ Needs verify | Should include `potentialAction` (SearchAction) for sitelinks |
| `EducationalOrganization` | ❌ Missing | Would strengthen EEAT for nursing education platform |
| `Course` or `EducationalOccupationalProgram` | ❌ Missing | Could improve visibility in "Courses" rich results |

### Blog Posts

| Schema | Present | Quality |
|---|---|---|
| `Article` | ⚠️ Partial | `eeat-content-attribution.tsx` exists but verify every post uses it |
| `BreadcrumbList` | ⚠️ Needs verify | Should be on every blog post |
| `FAQPage` | ❌ Missing | Many blog posts contain Q&A format — add FAQ schema to posts with >2 questions |
| `Person` (author) | ⚠️ Partial | EEAT attribution component exists — verify author details (name, credentials, URL) |

### Lesson Pages

| Schema | Present | Quality |
|---|---|---|
| `Article` | ❌ Missing | Lesson pages are educational articles — should have Article or LearningResource schema |
| `BreadcrumbList` | ⚠️ Partial | Breadcrumbs visible but verify JSON-LD on every lesson |
| `Course` | ❌ Missing | Individual lessons could use `hasPart` relationship to Course |
| `MedicalWebPage` | ❌ Missing | Clinical lessons covering medical content should declare `MedicalWebPage` |
| `FAQPage` | ❌ Missing | Lessons with FAQ sections should add FAQ schema |

### Exam Pathway Hub Pages (`/canada/rn/nclex-rn/`, etc.)

| Schema | Present | Quality |
|---|---|---|
| `WebPage` | ⚠️ Needs verify | Hub pages should declare WebPage with `about` pointing to NCLEX/exam entity |
| `BreadcrumbList` | ⚠️ Needs verify | Breadcrumb visible but JSON-LD needs audit |
| `Course` or `EducationalOccupationalProgram` | ❌ Missing | NCLEX-RN prep is a structured educational program — use `EducationalOccupationalProgram` schema |
| `FAQPage` | ❌ Missing | Hub pages with FAQ sections should emit FAQPage schema |

### Authority Cluster Pages (Programmatic SEO)

| Schema | Present | Quality |
|---|---|---|
| `MedicalCondition` | ❌ Missing | Pages about specific conditions (Sepsis, CHF, etc.) should use `MedicalCondition` |
| `MedicalWebPage` | ❌ Missing | Clinical content pages should declare `MedicalWebPage` with `specialty` |
| `Article` | ❌ Missing | Should have Article with author, datePublished, dateModified |
| `FAQPage` | ❌ Missing | Most authority cluster pages include FAQ — add schema |
| `BreadcrumbList` | ❌ Missing | Needs audit — likely missing on programmatic pages |

### Pricing Page

| Schema | Present | Quality |
|---|---|---|
| `WebPage` | ⚠️ Needs verify | Should be present |
| `Offer` | ❌ Missing | Pricing tiers could use `Offer` schema with price, priceCurrency |
| `FAQPage` | ⚠️ Partial | Pricing FAQ exists (`pricing-subscription-faq.tsx`) but schema not confirmed |

### Pre-Nursing / ATI TEAS / HESI / CASPer Pages

| Schema | Present | Quality |
|---|---|---|
| `EducationalOccupationalProgram` | ❌ Missing | ATI TEAS, HESI prep qualify as educational program pages |
| `WebPage` | ⚠️ Needs verify | Should be present |
| `FAQPage` | ❌ Missing | Pre-nursing FAQ would benefit from schema |

### ECG Module Pages

| Schema | Present | Quality |
|---|---|---|
| `WebPage` | ⚠️ Needs verify | Should be present |
| `Course` | ❌ Missing | ECG interpretation module is a structured course |
| `MedicalWebPage` | ❌ Missing | ECG content is medical education — use `MedicalWebPage` with `specialty: Cardiology` |

---

## Critical Schema Errors to Fix

### 1. Missing `WebSite` with `SearchAction`

**Impact:** Without `WebSite` + `potentialAction: SearchAction`, Google cannot generate sitelinks search box in search results. This is a high-impact omission.

**Fix:** Add to root layout:
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "NurseNest",
  "url": "https://www.nursenest.ca",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.nursenest.ca/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

### 2. Missing `Organization` with `sameAs`

**Impact:** Without `Organization` schema, Google has limited structured signals about NurseNest as an entity. EEAT depends on entity recognition.

**Fix:** Add to root layout with `sameAs` links to LinkedIn, Twitter/X, and any relevant authority listings.

### 3. Blog Post `Article` Schema Missing `author.url` and `credentials`

**Impact:** Google's E-E-A-T evaluation for medical/health content requires demonstrated author expertise. Anonymous authorship is a red flag.

**Current:** `eeat-content-attribution.tsx` exists but may not include author credentials or URL.

**Fix:** Every blog post and lesson page Article schema must include:
```json
"author": {
  "@type": "Person",
  "name": "Author Name",
  "url": "https://www.nursenest.ca/about/author-name",
  "credential": "RN, BScN"
}
```

### 4. Missing `MedicalWebPage` on Clinical Content

**Impact:** Google treats health/medical content differently. `MedicalWebPage` schema with `specialty`, `reviewedBy`, and `lastReviewed` sends strong EEAT signals.

**Fix:** Add to all lesson pages and authority cluster pages with medical content:
```json
{
  "@type": "MedicalWebPage",
  "specialty": "Nursing",
  "lastReviewed": "2026-01-01",
  "reviewedBy": {
    "@type": "Person",
    "name": "Reviewer Name",
    "credential": "RN, MN"
  }
}
```

### 5. FAQ Schema on Lesson and Authority Pages

**Impact:** FAQ schema on high-quality pages can generate "People Also Ask" rich results, significantly increasing SERP real estate.

**Current:** Only the homepage has FAQ schema.

**Fix:** Audit all blog posts and lesson pages for embedded Q&A content. Add `FAQPage` schema to any page with ≥2 Q&A pairs.

---

## Schema Validation Checklist

Run these checks after implementing fixes:

- [ ] Google Rich Results Test — no errors on homepage
- [ ] Google Rich Results Test — Article schema valid on 5 sample blog posts
- [ ] Google Rich Results Test — FAQ schema valid on homepage and 5 sample authority pages
- [ ] Google Rich Results Test — BreadcrumbList valid on 5 sample lesson pages
- [ ] Schema.org validator — no `@context` errors
- [ ] No conflicting `@type` on same page (e.g., both `Article` and `WebPage` on same element)
- [ ] All `datePublished` and `dateModified` are valid ISO 8601 dates
- [ ] All author URLs are valid, 200-returning pages

---

## Priority Implementation Order

| Schema | Priority | Expected Impact |
|---|---|---|
| `WebSite` + `SearchAction` | CRITICAL | Sitelinks search box in SERPs |
| `Organization` + `sameAs` | CRITICAL | Entity recognition + EEAT |
| `Article` with author credentials on blog posts | HIGH | E-E-A-T for health content |
| `MedicalWebPage` on lesson pages | HIGH | Medical content EEAT signals |
| `FAQPage` on lesson + authority pages | HIGH | People Also Ask rich results |
| `EducationalOccupationalProgram` on pathway hubs | MEDIUM | Educational program visibility |
| `Course` on ECG and structured modules | MEDIUM | Course-specific rich results |
| `MedicalCondition` on condition authority pages | MEDIUM | Knowledge panel signals |
| `Offer` on pricing page | LOW | Pricing snippet visibility |

---

*Generated from code review of `src/components/seo/`, `src/app/(marketing)/(default)/page.tsx`, `src/components/marketing/home/premium-homepage-hero.tsx` and surrounding schema infrastructure*
