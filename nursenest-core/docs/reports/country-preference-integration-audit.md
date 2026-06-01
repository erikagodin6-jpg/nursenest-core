# Country Preference Integration Audit

Date: 2026-06-01

## Executive Summary

Country preference is implemented as a five-country user preference:

- Canada
- United States
- United Kingdom
- Australia
- Ireland

The preference is stored in `nn_country_preference` and derives the existing binary exam-region context:

- Canada -> `CA`
- United States, United Kingdom, Australia, Ireland -> `US`

Audit finding: the architecture was present, but several shells still depended on older `nn_marketing_region` or `nn_global_region` state. That meant a user could choose a country in one surface and then see stale or fallback country behavior elsewhere.

Low-risk integrations implemented immediately:

- Country preference now also writes `nn_global_region`.
- Authenticated app layout now seeds `CountryPreferenceRoot` from the server cookie.
- Authenticated app layout now derives its initial US/CA exam region from `nn_country_preference` when no explicit `nn_marketing_region` exists.
- Default marketing layout dynamic shell now derives initial US/CA exam region from `nn_country_preference`.
- Default marketing layout fast homepage shell now reads and passes `nn_country_preference`.
- Locale-prefixed marketing layout now wraps public chrome in `CountryPreferenceRoot`.
- Locale-prefixed marketing layout now derives initial US/CA exam region from `nn_country_preference`.

## Implementation Notes

Files changed:

- `src/lib/region/country-preference.ts`
- `src/app/(app)/layout.tsx`
- `src/app/(marketing)/(default)/layout.tsx`
- `src/app/(marketing)/[locale]/layout.tsx`
- `docs/reports/country-preference-integration-audit.md`

The change intentionally does not alter database entitlement, question-bank, lesson, flashcard, CAT, or subscription scoping. Those surfaces remain governed by learner profile/pathway/entitlement. Country preference now ensures the UI context, labels, chrome, pricing region, and marketing routing align consistently.

## Surface Audit

| Surface | Current behavior | Country-aware behavior | Missing integrations | Estimated impact |
| --- | --- | --- | --- | --- |
| Homepage | Default marketing layout already had `NursenestRegionRoot` and the country selector, but the fast static homepage shell passed `serverCountry=null`. | Fast shell now reads `nn_country_preference`, seeds `CountryPreferenceRoot`, and derives the initial US/CA exam region from the selected country. | UK, Australia, and Ireland still reuse US-backed homepage/exam-region content because full country homepage configs do not exist for those three markets. | High. First-paint homepage chrome and CTAs now align with stored preference instead of defaulting back to Canada/US fallback state. |
| Navigation | Header selector existed and marketing sub-nav consumed `useCountryPreference` for exam labels. Some layouts did not provide `CountryPreferenceRoot`. | Default marketing, locale marketing, and app shells now provide the country preference context. Selector also syncs `nn_global_region`. | Country-specific marketing chrome only has full configs for Canada/US plus existing global hubs; UK/AU/IE need dedicated nav config before distinct hub chrome can be shown. | High. Header/sub-nav labels now stay consistent across anonymous, localized, and authenticated shells. |
| Pricing | Pricing primarily used `useNursenestRegion` and `nn_global_region`. Country selector only updated `nn_country_preference` and binary exam region before this patch. | Country selection now writes `nn_global_region`, so pricing checkout context and NA billing gate see the same selected country. App/marketing providers also seed region from country preference. | Pricing amounts remain CA/US only. UK/AU/IE map through US-backed pricing until localized billing/catalog policy exists. | High. Reduces mismatch between selected country, checkout global-region payload, and displayed US/CA plan set. |
| Lessons | Public lesson hubs are URL/pathway scoped. Learner app lessons depend on account/pathway state and existing app providers. | Authenticated app now has `CountryPreferenceRoot`, so any lesson chrome or client components using country preference receive the selected country. Data scope is unchanged. | Country preference does not automatically switch a learner's saved pathway or entitlement. That should remain an explicit account/pathway action. | Medium. Improves contextual consistency without risking cross-country lesson leakage. |
| Flashcards | Flashcard inventory and custom sessions are pathway/data scoped. Country preference provider was missing from the authenticated app shell. | Authenticated flashcard surfaces can now read the same selected country context. Actual card pool selection remains pathway/inventory driven. | Country preference should not override flashcard pool country unless launch filters explicitly choose a matching pathway. | Medium. Fixes UI/context drift while preserving pool integrity. |
| Practice Tests | Practice/CAT-like question pools use pathway, tier, country code, and entitlement gates. | App provider now exposes country preference globally. Practice data scoping remains unchanged. | Account-level pathway preference integration is still separate from transient country preference. | Medium. Safer localization of labels and chrome; no accidental bank mixing. |
| CAT Exams | CAT availability and pools are pathway-scoped and entitlement-gated. | CAT pages in the app can now consume country preference context consistently through the app layout. | Country preference should not silently move a learner between CAT pools. Add explicit pathway switch UX if desired. | Medium. Reduces shell mismatch; preserves exam validity. |
| Study Plans | Study plans are learner/profile/pathway driven. | App layout now provides selected country context for study-plan chrome and recommendations that opt in. | Study-plan algorithm still needs an explicit account/pathway country source before using country preference to change assignments. | Medium. Good contextual consistency; algorithmic localization remains a future account preference task. |
| Blog Recommendations | Blog index has a country preference hint and the selector. Related content is mostly post/category/pathway driven. Some logic reads `nn_global_region`. | Selector now writes `nn_global_region`, improving blog recommendation/gating consistency where that cookie is read. Locale layout now provides `CountryPreferenceRoot`. | No full country-rank feed for UK/AU/IE from the five-country preference yet. Australia has international content maps, but not wired as the generic blog index ranking source. | Medium-high. Users selecting a country see consistent hint/chrome; deeper recommendation ranking still needs targeted feed integration. |
| SEO Metadata | SEO metadata is route/pathway/canonical driven, not user-cookie driven. That is correct for indexability. | Country preference does not mutate canonical metadata. Country-specific routes keep static metadata and canonical URLs. | Personalized country cookies should not change SEO metadata on canonical pages. Add dedicated UK/AU/IE routes/metadata before indexing those as separate experiences. | Low for runtime UX, high for future SEO expansion. Correctly avoids cookie-personalized canonical churn. |

## Low-Risk Integrations Implemented

### 1. Sync Five-Country Preference To Global Region Cookie

Before:

- Selecting a country wrote `nn_country_preference`.
- It also drove the binary `NursenestRegion`.
- Some surfaces still read `nn_global_region`, so global-region consumers could remain stale.

After:

- `writeCountryPreferenceCookie()` also writes `nn_global_region`.
- Mapping:
  - `canada` -> `canada`
  - `us` -> `us`
  - `uk` -> `uk`
  - `aus` -> `aus`
  - `ireland` -> `ireland`

Impact:

- Pricing, checkout global-region context, marketing chrome, and blog hints have a shared cookie signal.

### 2. Add Country Preference Provider To Authenticated App

Before:

- `(app)/layout.tsx` provided only `NursenestRegionRoot`.
- Learner surfaces could not reliably consume `useCountryPreference`.

After:

- `(app)/layout.tsx` wraps learner routes in `CountryPreferenceRoot`.
- The server reads `nn_country_preference` and passes it into the provider.
- Initial `NursenestRegionRoot` derives from the country preference when no explicit marketing region cookie exists.

Impact:

- Lessons, flashcards, practice, CAT, and study-plan routes share one selected country context.

### 3. Add Country Preference To Marketing Shells

Before:

- The normal default marketing shell provided country preference.
- The fast homepage shell ignored the cookie.
- The locale-prefixed marketing shell had `NursenestRegionRoot` but no `CountryPreferenceRoot`.

After:

- Fast homepage shell reads and passes `nn_country_preference`.
- Default marketing dynamic shell derives its exam region from country preference.
- Locale-prefixed marketing shell now provides `CountryPreferenceRoot` and derives the initial exam region from country preference.

Impact:

- Homepage, navigation, pricing, blog, and localized marketing routes preserve country preference across shell boundaries.

## Remaining Gaps

1. UK, Australia, and Ireland need dedicated marketing country chrome configs if they should have distinct public nav, footer featured links, homepage copy, and pathway cards.
2. Blog ranking is not yet fully country-personalized for the five-country selector. It has country hints and country-tagged content, but the generic blog index still loads the standard published feed.
3. Learner account pathway preference is separate from transient country preference. That is correct for safety, but it means selecting Australia does not automatically change a saved RN/PN/NP pathway.
4. Country preference is not persisted to the authenticated user profile in this patch. The architecture comments allow account-level persistence, but this low-risk integration keeps changes to cookies/localStorage/context only.
5. SEO metadata should remain route-based. Dedicated UK/AU/IE indexed experiences require explicit route and metadata work, not cookie-personalized metadata.

## Recommendation

Next implementation wave:

1. Add country chrome configs for UK, Australia, and Ireland.
2. Add a country-aware blog recommendation adapter that ranks country-specific posts first when `nn_country_preference` is present.
3. Add an explicit "Make this my study pathway" flow that writes account-level pathway/country preferences after confirmation.
4. Add focused tests for:
   - selector writes `nn_country_preference` and `nn_global_region`
   - app layout seeds `CountryPreferenceRoot`
   - locale layout exposes `useCountryPreference`
   - pricing sees global-region cookie after a country switch

## Verification

Passed:

```bash
npm run typecheck:critical
```

Passed:

```bash
node --import tsx --test src/lib/marketing/resolve-marketing-exam-region.test.ts src/lib/navigation/global-region-country-switcher-list.contract.test.ts
```

Result:

- 13 tests passed.

Also attempted:

```bash
node --import tsx --test src/lib/marketing/resolve-marketing-exam-region.test.ts src/lib/navigation/global-region-country-switcher-list.contract.test.ts src/lib/stripe/pricing-map.na-country-ambiguity.test.ts
```

Result:

- Country/region tests passed.
- `src/lib/stripe/pricing-map.na-country-ambiguity.test.ts` failed because `findTierCountryByPriceId` returned `CA` where the existing test expects `undefined`.
- This patch did not modify `src/lib/stripe/pricing-map.ts`; the failure appears separate from the country-preference provider/cookie integration.
