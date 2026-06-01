# Country Selector Navigation Architecture
**Date:** 2026-06-01  
**Status:** Implemented

---

## 1. Current Architecture (Before)

### Country-Hub Navigation Model

Users who wanted country-specific content were sent to **separate URL destinations**:

| Destination | Route | Scope |
|---|---|---|
| Canada Hub | `/blog/canada-rn` | NCLEX-RN Canada blog posts |
| US Hub | `/blog/us-rn` | US NCLEX-RN blog posts |
| Canada PN Hub | `/blog/rex-pn` | REx-PN blog posts |
| US PN Hub | `/blog/nclex-pn` | NCLEX-PN blog posts |

**Problems with this model:**
1. Country selection was a **navigation act** rather than a **preference** — users had to discover and click through to a different URL to get country-relevant content.
2. The Canada Hub and US Hub only applied to the blog. The main nav, lessons, flashcards, and practice sections were already region-aware via a separate binary `NursenestRegion` ("US" | "CA") cookie.
3. Users who selected Canada in the country dropdown (the existing `CompactCountryTrigger`) still saw a separate "Canada Hub" link in the blog suggesting they navigate there again.
4. The mobile nav had no clear entry point for country selection.
5. New countries (UK, Australia, Ireland) had no representation in the primary nav flow.

### Existing Persistence Layer

The pre-existing system had **two parallel region systems**:

| System | Cookie | Storage | Scope |
|---|---|---|---|
| `NursenestRegion` ("US"\|"CA") | `nn_marketing_region` | `localStorage: nursenest-region` | Sub-nav exam strip labels + routing |
| `GlobalRegionSlug` (30 countries) | `nn_global_region` | None | Header display + i18n redirects |

The binary US/CA region drove the sub-nav labels (`nav.examStrip.pnUS` vs `nav.examStrip.pnCA`).

### Nav Structure (Before)

```
[Logo] [RN] [RPN/PN] [NP] [Allied] [Lessons] [Flashcards] [Practice] [CAT] [Blog] [Pricing]
                     ↑ Sub-nav row (exam strip)

[🌐 Country ▼] [Language ▼]   ← utility strip, opens 30-country popover
                                 Separate Canada Hub / US Hub entries existed in blog nav
```

---

## 2. Proposed Architecture (After)

### Country-Preference Model

Country selection is now a **persistent global preference**, not a navigation destination.

- **Five supported countries** cover all current exam tracks: Canada, United States, United Kingdom, Australia, Ireland.
- The preference is stored in localStorage + cookie + (when logged in) user profile.
- Exam labels in the sub-nav update **immediately** on country change — no page navigation required.
- The Canada Hub and US Hub routes are **redirected to `/blog`** so existing links don't 404.

### Five-Country Mapping

| Country | `CountryPreference` | `NursenestRegion` | RN Label | PN Label | NP Label |
|---|---|---|---|---|---|
| Canada | `"canada"` | `"CA"` | NCLEX-RN Canada | REx-PN | CNPLE |
| United States | `"us"` | `"US"` | NCLEX-RN | NCLEX-PN | NP |
| United Kingdom | `"uk"` | `"US"` | NCLEX-RN | NCLEX-PN | NP |
| Australia | `"aus"` | `"US"` | NCLEX-RN | NCLEX-PN | NP |
| Ireland | `"ireland"` | `"US"` | NCLEX-RN | NCLEX-PN | NP |

UK, Australia, and Ireland map to US routing since the content library is currently US/CA only; exam labels still reflect the selected country choice (future-proofed for localisation).

### Nav Structure (After)

```
[Logo] [RN] [RPN/PN] [NP] [Allied] [Lessons] [Flashcards] [Practice] [CAT] [Blog] [Pricing]
                     ↑ Sub-nav (exam strip) — labels dynamically update based on country preference
                       Canada: "NCLEX-RN Canada" | "REx-PN" | "CNPLE"
                       US/UK/AU/IE: "NCLEX-RN" | "NCLEX-PN" | "NP"

[🌐 Country ▼]   ← simplified 5-country quick selector (no full 30-country popover needed for primary use)
```

---

## 3. Migration Plan

### Phase 1 — Preference Layer (Implemented)

1. `src/lib/region/country-preference.ts` — `CountryPreference` type, 5-country config, label maps, persistence helpers.
2. `src/lib/region/use-country-preference.tsx` — React context + hook; reads from cookie/localStorage, syncs with `NursenestRegion`.
3. `src/components/layout/country-selector-dropdown.tsx` — Lightweight 5-country dropdown; replaces the Canada/US Hub links in the blog nav.

### Phase 2 — Sub-Nav Labels (Implemented)

4. `src/components/layout/marketing-site-sub-nav.tsx` — Uses `useCountryPreference()` for direct exam label strings instead of only the binary US/CA i18n keys.

### Phase 3 — Hub Redirects (Implemented)

5. `/blog/canada-rn/page.tsx` and `/blog/us-rn/page.tsx` — `redirect("/blog")` replaces the hub index pages; existing deep-linked articles under `/blog/canada-rn/[slug]` and `/blog/us-rn/[slug]` continue to serve.

### Phase 4 — Blog Discovery Hint (Implemented)

6. `src/components/marketing/regional-blog-discovery-hint.tsx` — Now shows the user's country preference with a direct call to action to change it, rather than linking to a separate hub URL.

---

## 4. Affected Routes

| Route | Change | SEO Impact |
|---|---|---|
| `/blog/canada-rn` | Redirected → `/blog` (301) | Existing PageRank flows to `/blog`; no content loss |
| `/blog/us-rn` | Redirected → `/blog` (301) | Same |
| `/blog/canada-rn/[slug]` | **Unchanged** — article detail pages continue serving | No impact |
| `/blog/us-rn/[slug]` | **Unchanged** — article detail pages continue serving | No impact |
| `/blog/rex-pn` | **Unchanged** | No impact |
| `/blog/nclex-pn` | **Unchanged** | No impact |
| `/blog` | Country context visible via preference chip | Improved UX |
| All other routes | Nav labels change dynamically | No structural change |

---

## 5. SEO Impact

**Minimal.** The hub redirect from `/blog/canada-rn` → `/blog` is a 301 permanent redirect. Crawlers follow this and transfer link equity to `/blog`. The individual article pages (`/blog/canada-rn/[slug]`) are **untouched** — they retain their canonical URLs, structured data, and sitemap entries.

The `/blog/canada-rn` and `/blog/us-rn` hub pages had thin content (paginated list views) so their SERP value was limited. The underlying article pages, which carry the full content, are unaffected.

The `sitemap-blog.xml` already includes `/blog/canada-rn` and `/blog/us-rn` as regional cluster hubs. With the redirect in place, search engines will update their indexes naturally over 1–4 crawl cycles.

---

## 6. Implementation Details

### `CountryPreference` Type

```ts
// src/lib/region/country-preference.ts
export type CountryPreference = "us" | "canada" | "uk" | "aus" | "ireland";

export const COUNTRY_PREFERENCE_COOKIE = "nn_country_preference";
export const COUNTRY_PREFERENCE_STORAGE_KEY = "nn_country_preference";

// Per-country exam labels for the sub-nav strip
export const COUNTRY_EXAM_LABELS: Record<CountryPreference, CountryExamLabels> = {
  canada:  { rn: "NCLEX-RN Canada", pn: "REx-PN",   np: "CNPLE",   allied: "Allied Health" },
  us:      { rn: "NCLEX-RN",        pn: "NCLEX-PN",  np: "NP",      allied: "Allied Health" },
  uk:      { rn: "NCLEX-RN",        pn: "NCLEX-PN",  np: "NP",      allied: "Allied Health" },
  aus:     { rn: "NCLEX-RN",        pn: "NCLEX-PN",  np: "NP",      allied: "Allied Health" },
  ireland: { rn: "NCLEX-RN",        pn: "NCLEX-PN",  np: "NP",      allied: "Allied Health" },
};
```

### Persistence

| Surface | Key | Written on | Read on |
|---|---|---|---|
| `localStorage` | `nn_country_preference` | User selection | Client mount (hydration) |
| Cookie | `nn_country_preference` | User selection | Server render + client |
| User profile | `countryPreference` field | On save (when auth'd) | Session load |

### `NursenestRegion` Derivation

```
CountryPreference → NursenestRegion
"canada"          → "CA"
*                 → "US"   (uk / aus / ireland use US routing)
```

The derived `NursenestRegion` is written to the existing `nn_marketing_region` cookie so the rest of the codebase continues to work without changes.

### Mobile Navigation

`CountrySelectorDropdown` is a self-contained `<select>` element on mobile (< 640px) and a styled dropdown on desktop. Both render the same 5 options and write to the same persistence layer. The mobile drawer in the site header calls the same `useCountryPreference` hook.

### Authenticated User Profile

When a user is logged in, selecting a country calls `PATCH /api/learner/preferences` with `{ countryPreference }`. On session load, the stored preference overrides the cookie/localStorage value. This is a non-blocking fire-and-forget call — if it fails, the local preference still applies.
