# Global CSS Usage Audit
Generated: 2026-05-13T13:35:28.089Z

## Summary

| Classification | Blocks | Size | % of Total |
|---|---|---|---|
| GLOBAL_REQUIRED | 241 | 88.2 KB | 23.8% |
| LEARNER_ONLY | 810 | 146.9 KB | 39.7% |
| MARKETING_ONLY | 140 | 35.6 KB | 9.6% |
| ADMIN_ONLY | 0 | 0.0 KB | 0.0% |
| SHARED_COMPONENT | 127 | 32.7 KB | 8.8% |
| UNKNOWN | 299 | 66.4 KB | 18.0% |
| **TOTAL** | **1617** | **369.8 KB** | 100% |

## Extraction Opportunity

| Target | SAFE blocks | SAFE bytes | Risk |
|---|---|---|---|
| Learner layout | 93 | 14.1 KB | SAFE |
| Marketing layout | 132 | 33.7 KB | SAFE |
| Admin layout | 0 | 0.0 KB | SAFE |
| Shared components | 0 | 0.0 KB | NEEDS_REVIEW |

**Total movable (SAFE only): 47.9 KB**
**Projected root CSS after extraction: 322.0 KB**

## Block Detail

### `html[data-nn-nav-pending="true"] body::before`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 21–36 (0.3 KB)
- **Files**: none found

### `@theme inline`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 737–875 (7.3 KB)
- **Files**: none found

### `*`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 937–940 (0.1 KB)
- **Files**: none found

### `a`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 960–963 (0.0 KB)
- **Files**: none found

### `.nn-skeleton-block`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 986–992 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/lessons/page.tsx, src/app/(student)/app/(learner)/page.tsx

### `.nn-skeleton-block--tall`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 993–995 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/page.tsx

### `.nn-skeleton-block--short`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 996–998 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/page.tsx

### `.nn-skeleton-block--toolbar`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 999–1002 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/lessons/page.tsx

### `.nn-brand-header-logo-slot,`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1015–1027 (0.2 KB)
- **Files**: src/lib/branding/logo-config.ts

### `.nn-brand-header-logo-slot img.nn-brand-header-logo,`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1029–1047 (0.4 KB)
- **Files**: src/lib/branding/logo-config.ts

### `.nn-brand-header-logo-slot img.nn-brand-header-logo,`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1049–1052 (0.1 KB)
- **Files**: src/lib/branding/logo-config.ts

### `.nn-brand-footer-logo-slot img.nn-brand-footer-logo,`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1054–1058 (0.1 KB)
- **Files**: src/lib/branding/logo-config.ts

### `.nn-header-logo-link`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1060–1068 (0.2 KB)
- **Files**: src/components/layout/site-header.tsx

### `.nn-card-ink`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1094–1096 (0.1 KB)
- **Files**: src/components/ui/card.tsx

### `.nn-ui-btn`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1102–1119 (0.7 KB)
- **Files**: src/components/marketing/marketing-for-institutions-premium-client.tsx, src/components/ui/button.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantA.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantB.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantC.tsx

### `.nn-ui-btn:hover:not(:disabled):not([aria-disabled="true"]):not(.nn-ui-btn--link`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1120–1122 (0.1 KB)
- **Files**: src/components/marketing/marketing-for-institutions-premium-client.tsx, src/components/ui/button.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantA.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantB.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantC.tsx

### `.nn-ui-btn:active:not(:disabled):not([aria-disabled="true"])`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1123–1125 (0.1 KB)
- **Files**: src/components/marketing/marketing-for-institutions-premium-client.tsx, src/components/ui/button.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantA.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantB.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantC.tsx

### `.nn-ui-btn:focus-visible`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1126–1129 (0.1 KB)
- **Files**: src/components/marketing/marketing-for-institutions-premium-client.tsx, src/components/ui/button.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantA.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantB.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantC.tsx

### `.nn-ui-btn:disabled,`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1130–1135 (0.1 KB)
- **Files**: src/components/marketing/marketing-for-institutions-premium-client.tsx, src/components/ui/button.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantA.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantB.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantC.tsx

### `.nn-ui-btn--md`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1136–1139 (0.1 KB)
- **Files**: src/components/ui/button.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantA.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantB.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantC.tsx, src/components/lessons/lesson-mark-complete-button.tsx

### `.nn-ui-btn--sm`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1140–1144 (0.1 KB)
- **Files**: src/components/ui/button.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantC.tsx

### `.nn-ui-btn--lg`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1145–1149 (0.1 KB)
- **Files**: src/components/marketing/marketing-for-institutions-premium-client.tsx, src/components/ui/button.tsx

### `.nn-ui-btn--icon`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1150–1154 (0.1 KB)
- **Files**: src/components/ui/button.tsx

### `.nn-ui-btn--primary`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1155–1159 (0.1 KB)
- **Files**: src/components/ui/button.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantA.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantB.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantC.tsx

### `.nn-ui-btn--primary:hover:not(:disabled):not([aria-disabled="true"]):not(:active`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1160–1166 (0.3 KB)
- **Files**: src/components/ui/button.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantA.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantB.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantC.tsx

### `.nn-ui-btn--primary:active:not(:disabled):not([aria-disabled="true"])`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1167–1171 (0.2 KB)
- **Files**: src/components/ui/button.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantA.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantB.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantC.tsx

### `.nn-ui-btn--secondary`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1172–1176 (0.2 KB)
- **Files**: src/components/ui/button.tsx

### `.nn-ui-btn--secondary:hover:not(:disabled):not([aria-disabled="true"]):not(:acti`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1177–1182 (0.3 KB)
- **Files**: src/components/ui/button.tsx

### `.nn-ui-btn--secondary:active:not(:disabled):not([aria-disabled="true"])`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1183–1185 (0.2 KB)
- **Files**: src/components/ui/button.tsx

### `.nn-ui-btn--outline`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1186–1190 (0.1 KB)
- **Files**: src/components/marketing/marketing-for-institutions-premium-client.tsx, src/components/ui/button.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantA.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantB.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantC.tsx

### `.nn-ui-btn--outline:hover:not(:disabled):not([aria-disabled="true"]):not(:active`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1191–1198 (0.4 KB)
- **Files**: src/components/marketing/marketing-for-institutions-premium-client.tsx, src/components/ui/button.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantA.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantB.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantC.tsx

### `.nn-ui-btn--outline:active:not(:disabled):not([aria-disabled="true"])`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1199–1201 (0.2 KB)
- **Files**: src/components/marketing/marketing-for-institutions-premium-client.tsx, src/components/ui/button.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantA.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantB.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantC.tsx

### `.nn-ui-btn--ghost`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1202–1206 (0.1 KB)
- **Files**: src/components/ui/button.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantA.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantB.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantC.tsx

### `.nn-ui-btn--ghost:hover:not(:disabled):not([aria-disabled="true"]):not(:active)`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1207–1211 (0.3 KB)
- **Files**: src/components/ui/button.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantA.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantB.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantC.tsx

### `.nn-ui-btn--ghost:active:not(:disabled):not([aria-disabled="true"])`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1212–1214 (0.1 KB)
- **Files**: src/components/ui/button.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantA.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantB.tsx, src/components/preview/figma-navigation/FigmaPreviewNavVariantC.tsx

### `.nn-ui-btn--destructive`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1215–1219 (0.2 KB)
- **Files**: src/components/ui/button.tsx

### `.nn-ui-btn--destructive:hover:not(:disabled):not([aria-disabled="true"]):not(:ac`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1229–1231 (0.2 KB)
- **Files**: src/components/ui/button.tsx

### `.nn-ui-btn--destructive:active:not(:disabled):not([aria-disabled="true"])`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1232–1234 (0.1 KB)
- **Files**: src/components/ui/button.tsx

### `.nn-ui-btn--link`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1235–1243 (0.2 KB)
- **Files**: src/components/ui/button.tsx

### `.nn-ui-btn--link:hover:not(:disabled):not([aria-disabled="true"])`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1244–1246 (0.1 KB)
- **Files**: src/components/ui/button.tsx

### `.nn-ui-badge`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1248–1256 (0.2 KB)
- **Files**: src/components/ui/badge.tsx

### `.nn-ui-badge--surface`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1257–1261 (0.1 KB)
- **Files**: src/components/ui/badge.tsx

### `.nn-ui-badge--secondary`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1262–1266 (0.1 KB)
- **Files**: src/components/ui/badge.tsx

### `.nn-ui-badge--outline`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1267–1270 (0.1 KB)
- **Files**: src/components/ui/badge.tsx

### `.nn-ui-badge--success`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1271–1275 (0.2 KB)
- **Files**: src/components/ui/badge.tsx

### `.nn-ui-badge--warning`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1276–1280 (0.1 KB)
- **Files**: src/components/ui/badge.tsx

### `.nn-ui-progress`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1282–1290 (0.2 KB)
- **Files**: src/components/ui/progress.tsx

### `.nn-ui-progress__fill`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1291–1296 (0.1 KB)
- **Files**: src/components/ui/progress.tsx

### `.nn-ui-progress[data-variant="accent"] .nn-ui-progress__fill`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1297–1299 (0.1 KB)
- **Files**: src/components/ui/progress.tsx

### `.nn-marketing-card`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1302–1317 (0.7 KB)
- **Files**: src/components/marketing/home-landing-sections.tsx

### `.nn-marketing-card:hover`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1319–1323 (0.1 KB)
- **Files**: src/components/marketing/home-landing-sections.tsx

### `.nn-marketing-card-pad`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1325–1327 (0.1 KB)
- **Files**: src/components/marketing/home-landing-sections.tsx

### `.nn-section-block`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1336–1339 (0.1 KB)
- **Files**: src/components/marketing/home-sample-question-preview.tsx, src/components/marketing/home-trust-fears-section.tsx, src/components/marketing/home-platform-preview-section.tsx, src/components/marketing/home-objection-faq-section.tsx, src/components/marketing/home-product-pillars-section.tsx

### `.nn-section-shell`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1341–1345 (0.1 KB)
- **Files**: src/components/marketing/for-institutions-pricing-and-form.tsx, src/components/marketing/home-trust-strip-section.tsx, src/components/marketing/home-hero-screenshot-section.tsx, src/components/marketing/home-sample-question-preview.tsx, src/components/marketing/home-trust-fears-section.tsx

### `.nn-section-stack-md`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1357–1361 (0.1 KB)
- **Files**: none found

### `.nn-section-stack-tight`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1363–1367 (0.1 KB)
- **Files**: none found

### `.nn-section-enter`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1370–1372 (0.1 KB)
- **Files**: src/components/marketing/home-trust-strip-section.tsx, src/components/marketing/home-trust-proof-section.tsx, src/components/marketing/home-reviews-section.tsx

### `.nn-empty-state-enter`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1375–1377 (0.1 KB)
- **Files**: src/components/ui/premium-empty-state.tsx

### `.nn-icon-sm`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1391–1391 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx

### `.nn-icon-md`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1392–1392 (0.1 KB)
- **Files**: src/components/marketing/pricing-sections.tsx, src/components/marketing/home-trust-strip-section.tsx, src/components/marketing/home-platform-preview-section.tsx, src/components/marketing/home-reviews-section.tsx

### `.nn-icon-lg`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1393–1393 (0.1 KB)
- **Files**: src/components/marketing/home-reviews-section.tsx

### `.nn-icon-accent`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1394–1394 (0.0 KB)
- **Files**: none found

### `.nn-icon-muted`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1395–1395 (0.1 KB)
- **Files**: none found

### `.nn-icon-trust`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1396–1396 (0.0 KB)
- **Files**: none found

### `.nn-marketing-h1`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1399–1406 (0.2 KB)
- **Files**: src/app/(marketing)/(default)/canada-np-exam-prep/page.tsx, src/app/(marketing)/(default)/cnple-vs-cnpe/page.tsx, src/app/(marketing)/(default)/what-is-the-cnple/page.tsx, src/app/(marketing)/(default)/questions/[slug]/page.tsx, src/app/(marketing)/(default)/cnple-study-guide/page.tsx

### `.nn-marketing-h2`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1408–1415 (0.2 KB)
- **Files**: src/app/(marketing)/(default)/canada-np-exam-prep/page.tsx, src/app/(marketing)/(default)/cnple-vs-cnpe/page.tsx, src/app/(marketing)/(default)/what-is-the-cnple/page.tsx, src/app/(marketing)/(default)/cnple-study-guide/page.tsx, src/app/(marketing)/(default)/exams/uk/page.tsx

### `.nn-marketing-h3`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1417–1423 (0.2 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx, src/app/(marketing)/(default)/canada-np-exam-prep/page.tsx, src/app/(marketing)/(default)/cnple-vs-cnpe/page.tsx, src/app/(marketing)/(default)/what-is-the-cnple/page.tsx, src/app/(marketing)/(default)/questions/[slug]/page.tsx

### `.nn-marketing-h4`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1425–1430 (0.2 KB)
- **Files**: src/app/(marketing)/(default)/questions/[slug]/page.tsx, src/components/marketing/nursing-tier-hub-page.tsx, src/components/marketing/pricing-sections.tsx, src/components/marketing/marketing-hero-carousel.tsx, src/components/marketing/case-studies-page-client.tsx

### `.nn-marketing-body`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1432–1437 (0.2 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx, src/app/(marketing)/(default)/canada-np-exam-prep/page.tsx, src/app/(marketing)/(default)/cnple-vs-cnpe/page.tsx, src/app/(marketing)/(default)/lessons/page.tsx, src/app/(marketing)/(default)/what-is-the-cnple/page.tsx

### `.nn-marketing-body-sm`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1439–1444 (0.2 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx, src/app/(marketing)/(default)/lessons/page.tsx, src/app/(marketing)/(default)/questions/[slug]/page.tsx, src/app/(marketing)/(default)/question-bank/page.tsx, src/app/(marketing)/(default)/allied-health/page.tsx

### `.nn-marketing-caption`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1446–1451 (0.1 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx, src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx, src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/pricing/page.tsx, src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx, src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx

### `.nn-marketing-lead`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1453–1459 (0.2 KB)
- **Files**: src/app/(marketing)/(default)/canada-np-exam-prep/page.tsx, src/app/(marketing)/(default)/cnple-vs-cnpe/page.tsx, src/app/(marketing)/(default)/what-is-the-cnple/page.tsx, src/app/(marketing)/(default)/cnple-study-guide/page.tsx, src/app/(marketing)/(default)/exams/uk/page.tsx

### `.nn-marketing-eyebrow,`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1467–1474 (0.2 KB)
- **Files**: src/app/(marketing)/(default)/question-bank/page.tsx, src/app/(marketing)/(default)/allied/[career]/page.tsx, src/components/marketing/allied-health-hub-content.tsx, src/components/marketing/marketing-trust-section.tsx, src/components/marketing/public-question-bank-hub-view.tsx

### `.nn-marketing-label--accent`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1476–1478 (0.1 KB)
- **Files**: src/app/(marketing)/(default)/question-bank/page.tsx, src/components/marketing/allied-health-hub-content.tsx, src/components/marketing/public-question-bank-hub-view.tsx, src/components/marketing/public-lessons-pathway-sections.tsx, src/components/pathway-lessons/fnp-lessons-hub.tsx

### `.nn-marketing-cta-group`
- **Classification**: MARKETING_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 1481–1486 (0.1 KB)
- **Files**: none found

### `article .prose`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1500–1508 (0.2 KB)
- **Files**: none found

### `article .prose :where(p)`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1510–1513 (0.1 KB)
- **Files**: none found

### `article .prose :where(p:last-child)`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1515–1517 (0.1 KB)
- **Files**: none found

### `article .prose :where(h2)`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1519–1527 (0.3 KB)
- **Files**: none found

### `article .prose :where(h3)`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1529–1537 (0.2 KB)
- **Files**: none found

### `article .prose :where(h4)`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1539–1546 (0.2 KB)
- **Files**: none found

### `article .prose :where(ul, ol)`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1548–1552 (0.1 KB)
- **Files**: none found

### `article .prose :where(li)`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1554–1558 (0.1 KB)
- **Files**: none found

### `article .prose :where(ul)`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1560–1562 (0.1 KB)
- **Files**: none found

### `article .prose :where(ol)`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1564–1566 (0.1 KB)
- **Files**: none found

### `article .prose :where(a)`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1568–1572 (0.1 KB)
- **Files**: none found

### `article .prose :where(blockquote)`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1574–1580 (0.2 KB)
- **Files**: none found

### `article .prose :where(code)`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1582–1585 (0.1 KB)
- **Files**: none found

### `article .prose :where(pre)`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1587–1596 (0.3 KB)
- **Files**: none found

### `.nn-card-interactive`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1598–1604 (0.3 KB)
- **Files**: src/app/(marketing)/(default)/pre-nursing/lessons/page.tsx, src/components/marketing/pricing-page-client.tsx, src/components/pathway-lessons/pathway-lessons-next-step-ctas.tsx, src/components/pre-nursing/pre-nursing-landing-client.tsx, src/components/exam-pathways/exam-pathway-hub-body.tsx

### `.nn-card-interactive:hover`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1606–1611 (0.3 KB)
- **Files**: src/app/(marketing)/(default)/pre-nursing/lessons/page.tsx, src/components/marketing/pricing-page-client.tsx, src/components/pathway-lessons/pathway-lessons-next-step-ctas.tsx, src/components/pre-nursing/pre-nursing-landing-client.tsx, src/components/exam-pathways/exam-pathway-hub-body.tsx

### `.nn-elevation-panel`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1620–1624 (0.1 KB)
- **Files**: src/components/marketing/pricing-sections.tsx, src/components/marketing/pricing-clinical-readiness-ecosystem.tsx, src/components/marketing/screenshot-feature-grid.tsx, src/components/marketing/pricing-conversion-clarity.tsx

### `.nn-elevation-panel:hover`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1625–1628 (0.1 KB)
- **Files**: src/components/marketing/pricing-sections.tsx, src/components/marketing/pricing-clinical-readiness-ecosystem.tsx, src/components/marketing/screenshot-feature-grid.tsx, src/components/marketing/pricing-conversion-clarity.tsx

### `.nn-motion-standard`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1629–1637 (0.5 KB)
- **Files**: src/components/marketing/pricing-sections.tsx, src/components/marketing/home-sample-question-preview.tsx, src/components/marketing/screenshot-feature-grid.tsx, src/components/marketing/home-start-practice-cta-band.tsx, src/components/marketing/home-how-it-works-section.tsx

### `.nn-motion-standard:hover`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1638–1640 (0.1 KB)
- **Files**: src/components/marketing/pricing-sections.tsx, src/components/marketing/home-sample-question-preview.tsx, src/components/marketing/screenshot-feature-grid.tsx, src/components/marketing/home-start-practice-cta-band.tsx, src/components/marketing/home-how-it-works-section.tsx

### `.nn-motion-standard:active`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1641–1644 (0.1 KB)
- **Files**: src/components/marketing/pricing-sections.tsx, src/components/marketing/home-sample-question-preview.tsx, src/components/marketing/screenshot-feature-grid.tsx, src/components/marketing/home-start-practice-cta-band.tsx, src/components/marketing/home-how-it-works-section.tsx

### `.nn-hero-pastel-layers`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1658–1660 (0.1 KB)
- **Files**: none found

### `.nn-home-marketing-root`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1665–1672 (0.3 KB)
- **Files**: src/components/marketing/home-restored-client.tsx, src/lib/marketing/homepage-pagespeed-performance.contract.test.ts

### `.nn-home-marketing-rich-hero.nn-hero-bridge`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1674–1694 (0.7 KB)
- **Files**: src/components/marketing/home/premium-homepage-hero.tsx, src/components/marketing/home-conversion-hero.tsx

### `.nn-home-hero-product-band`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1696–1704 (0.4 KB)
- **Files**: src/components/marketing/home-hero-screenshot-section.tsx, src/components/marketing/home-restored-client.tsx

### `.nn-home-rich-placeholder-band`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1706–1709 (0.1 KB)
- **Files**: none found

### `.nn-home-rich-placeholder-band::before`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1711–1720 (0.2 KB)
- **Files**: none found

### `.nn-home-rich-placeholder-band--tone-warm`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1722–1729 (0.3 KB)
- **Files**: none found

### `.nn-home-rich-placeholder-band--tone-warm::before`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1731–1737 (0.2 KB)
- **Files**: none found

### `.nn-home-rich-placeholder-band--tone-positive`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1739–1746 (0.3 KB)
- **Files**: none found

### `.nn-home-rich-placeholder-band--tone-positive::before`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1748–1754 (0.2 KB)
- **Files**: none found

### `.nn-home-rich-placeholder-band--tone-cool`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1756–1763 (0.3 KB)
- **Files**: none found

### `.nn-home-rich-placeholder-band--tone-cool::before`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1765–1772 (0.2 KB)
- **Files**: none found

### `.nn-home-rich-placeholder-accent-bar`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1774–1776 (0.1 KB)
- **Files**: none found

### `.nn-home-rich-placeholder-band--tone-warm .nn-home-rich-placeholder-accent-bar`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1784–1791 (0.3 KB)
- **Files**: none found

### `.nn-home-rich-placeholder-band--tone-positive .nn-home-rich-placeholder-accent-b`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1793–1800 (0.3 KB)
- **Files**: none found

### `.nn-home-rich-placeholder-band--tone-cool .nn-home-rich-placeholder-accent-bar`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1802–1809 (0.3 KB)
- **Files**: none found

### `.nn-home-rich-placeholder-card`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1811–1813 (0.1 KB)
- **Files**: none found

### `.nn-home-rich-placeholder-band--tone-warm .nn-home-rich-placeholder-card`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1815–1822 (0.4 KB)
- **Files**: none found

### `.nn-home-rich-placeholder-band--tone-positive .nn-home-rich-placeholder-card`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1824–1831 (0.4 KB)
- **Files**: none found

### `.nn-home-rich-placeholder-band--tone-cool .nn-home-rich-placeholder-card`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1833–1840 (0.4 KB)
- **Files**: none found

### `.nn-home-pathways-band`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1842–1850 (0.4 KB)
- **Files**: none found

### `.nn-home-pathways-band .nn-home-pathway-card[data-nn-home-tier-card="rn"]`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1853–1864 (0.5 KB)
- **Files**: none found

### `.nn-home-pathways-band .nn-home-pathway-card[data-nn-home-tier-card="pn"]`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1866–1877 (0.5 KB)
- **Files**: none found

### `.nn-home-pathways-band .nn-home-pathway-card[data-nn-home-tier-card="np"]`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1879–1890 (0.5 KB)
- **Files**: none found

### `.nn-home-pathways-band .nn-home-pathway-card[data-nn-home-tier-card="allied"]`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1892–1903 (0.5 KB)
- **Files**: none found

### `.nn-home-final-cta-band`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1912–1919 (0.3 KB)
- **Files**: src/components/marketing/home-final-study-cta.tsx

### `.nn-home-blog-teaser-shell`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 1921–1930 (0.4 KB)
- **Files**: src/components/marketing/home-blog-teaser-section.server.tsx

### `.nn-surface-section`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1933–1941 (0.2 KB)
- **Files**: none found

### `.nn-surface-section-alt`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1944–1952 (0.2 KB)
- **Files**: none found

### `.nn-surface-bubble`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1961–1964 (0.1 KB)
- **Files**: src/components/pathway-lessons/pathway-hub-section.tsx, src/components/student/dashboard/quick-action-panel.tsx, src/components/student/learner-study-next-block.tsx

### `.nn-surface-bubble-strong`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1967–1971 (0.1 KB)
- **Files**: none found

### `.nn-surface-accent-soft`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1974–1978 (0.1 KB)
- **Files**: none found

### `.nn-surface-accent-strong`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 1981–1985 (0.1 KB)
- **Files**: none found

### `.nn-text-accent`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1988–1990 (0.0 KB)
- **Files**: none found

### `.nn-ring-accent`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1993–1996 (0.1 KB)
- **Files**: none found

### `.nn-callout-accent`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 1999–2004 (0.2 KB)
- **Files**: src/components/pathway-lessons/pathway-hub-section.tsx

### `.nn-section-soft`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 2007–2009 (0.1 KB)
- **Files**: src/components/marketing/home-features-section.tsx, src/components/marketing/home-comparison-section.tsx

### `.nn-card-soft`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2011–2021 (0.4 KB)
- **Files**: none found

### `.nn-card-soft:hover`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2023–2027 (0.2 KB)
- **Files**: none found

### `.nn-card-system`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 2030–2038 (0.2 KB)
- **Files**: src/components/marketing/home-platform-preview-section.tsx, src/components/marketing/home-product-pillars-section.tsx, src/components/marketing/home-features-section.tsx, src/components/marketing/home-reviews-section.tsx, src/components/study/study-mode-cards.tsx

### `.nn-card-system-pad`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 2040–2042 (0.0 KB)
- **Files**: src/components/marketing/home-platform-preview-section.tsx, src/components/marketing/home-product-pillars-section.tsx, src/components/marketing/home-features-section.tsx, src/components/marketing/home-reviews-section.tsx, src/components/study/study-mode-cards.tsx

### `.nn-card-system--interactive`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 2049–2056 (0.3 KB)
- **Files**: src/components/marketing/home-product-pillars-section.tsx, src/components/marketing/home-features-section.tsx, src/components/marketing/home-reviews-section.tsx, src/components/study/study-mode-cards.tsx

### `.nn-card-system--interactive:hover`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 2058–2062 (0.2 KB)
- **Files**: src/components/marketing/home-product-pillars-section.tsx, src/components/marketing/home-features-section.tsx, src/components/marketing/home-reviews-section.tsx, src/components/study/study-mode-cards.tsx

### `.nn-card-system__icon`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 2064–2073 (0.3 KB)
- **Files**: src/components/marketing/home-platform-preview-section.tsx, src/components/marketing/home-product-pillars-section.tsx, src/components/marketing/home-features-section.tsx, src/components/study/study-mode-cards.tsx

### `.nn-card-system__eyebrow`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 2075–2088 (0.4 KB)
- **Files**: src/components/marketing/home-platform-preview-section.tsx, src/components/marketing/home-product-pillars-section.tsx, src/components/marketing/home-features-section.tsx, src/components/marketing/home-reviews-section.tsx, src/components/study/study-mode-cards.tsx

### `.nn-card-system__title`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 2090–2096 (0.2 KB)
- **Files**: src/components/marketing/home-platform-preview-section.tsx, src/components/marketing/home-product-pillars-section.tsx, src/components/marketing/home-features-section.tsx, src/components/marketing/home-reviews-section.tsx, src/components/study/study-mode-cards.tsx

### `.nn-card-system__description`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 2098–2103 (0.2 KB)
- **Files**: src/components/marketing/home-platform-preview-section.tsx, src/components/marketing/home-product-pillars-section.tsx, src/components/marketing/home-features-section.tsx, src/components/marketing/home-reviews-section.tsx, src/components/study/study-mode-cards.tsx

### `.nn-card-system__cta`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 2105–2114 (0.2 KB)
- **Files**: src/components/marketing/home-product-pillars-section.tsx, src/components/study/study-mode-cards.tsx

### `.nn-card-system:hover .nn-card-system__cta`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 2116–2118 (0.1 KB)
- **Files**: src/components/marketing/home-platform-preview-section.tsx, src/components/marketing/home-product-pillars-section.tsx, src/components/marketing/home-features-section.tsx, src/components/marketing/home-reviews-section.tsx, src/components/study/study-mode-cards.tsx

### `.nn-card-soft--shine`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2120–2123 (0.1 KB)
- **Files**: none found

### `.nn-card-soft--shine::before`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2125–2133 (0.2 KB)
- **Files**: none found

### `.nn-badge-soft`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2135–2143 (0.2 KB)
- **Files**: none found

### `.nn-button-primary-pastel`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2145–2160 (0.7 KB)
- **Files**: none found

### `.nn-button-primary-pastel:hover:not(:disabled):not([aria-disabled="true"]):not(:`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2162–2166 (0.2 KB)
- **Files**: none found

### `.nn-button-primary-pastel:active:not(:disabled):not([aria-disabled="true"])`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2168–2172 (0.2 KB)
- **Files**: none found

### `.nn-marketing-nav-link`
- **Classification**: MARKETING_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 2229–2249 (0.7 KB)
- **Files**: src/components/layout/tier-gateway-dropdown.tsx, src/components/layout/site-header.tsx, src/components/preview/figma-navigation/FigmaPreviewNavMenu.tsx, src/components/preview/figma-navigation/FigmaPreviewNavLogo.tsx

### `.nn-marketing-nav-link:hover`
- **Classification**: MARKETING_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 2251–2255 (0.2 KB)
- **Files**: src/components/layout/tier-gateway-dropdown.tsx, src/components/layout/site-header.tsx, src/components/preview/figma-navigation/FigmaPreviewNavMenu.tsx, src/components/preview/figma-navigation/FigmaPreviewNavLogo.tsx

### `.nn-marketing-nav-link[aria-current="page"],`
- **Classification**: MARKETING_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 2264–2271 (0.3 KB)
- **Files**: src/components/layout/tier-gateway-dropdown.tsx, src/components/layout/site-header.tsx, src/components/preview/figma-navigation/FigmaPreviewNavMenu.tsx, src/components/preview/figma-navigation/FigmaPreviewNavLogo.tsx

### `.nn-marketing-nav-link:focus-visible`
- **Classification**: MARKETING_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 2273–2276 (0.1 KB)
- **Files**: src/components/layout/tier-gateway-dropdown.tsx, src/components/layout/site-header.tsx, src/components/preview/figma-navigation/FigmaPreviewNavMenu.tsx, src/components/preview/figma-navigation/FigmaPreviewNavLogo.tsx

### `.nn-learner-nav-link`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 2279–2296 (0.5 KB)
- **Files**: none found

### `.nn-learner-nav-link:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 2298–2302 (0.2 KB)
- **Files**: none found

### `.nn-learner-nav-link[aria-current="page"],`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 2304–2310 (0.3 KB)
- **Files**: none found

### `.nn-learner-nav-link:focus-visible`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 2312–2315 (0.1 KB)
- **Files**: none found

### `.nn-learner-nav-link.nn-learner-nav-link--primary`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 2318–2322 (0.2 KB)
- **Files**: none found

### `.nn-learner-nav-link.nn-learner-nav-link--primary:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 2324–2327 (0.2 KB)
- **Files**: none found

### `.nn-learner-nav-link.nn-learner-nav-link--primary[aria-current="page"],`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 2329–2335 (0.3 KB)
- **Files**: none found

### `.nn-learner-nav-drawer-link--primary`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 2338–2342 (0.2 KB)
- **Files**: none found

### `.nn-learner-nav-drawer-link--primary[aria-current="page"]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 2344–2347 (0.2 KB)
- **Files**: none found

### `.nn-learner-shell-link--primary`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 2350–2355 (0.2 KB)
- **Files**: src/components/layout/learner-shell-primary-nav.tsx

### `.nn-learner-shell-link--primary:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 2357–2359 (0.1 KB)
- **Files**: src/components/layout/learner-shell-primary-nav.tsx

### `.nn-learner-shell-bottom-link--primary`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 2362–2366 (0.2 KB)
- **Files**: src/components/layout/learner-shell-primary-nav.tsx

### `.nn-header-tier-pill`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2369–2383 (0.5 KB)
- **Files**: src/components/layout/learner-shell-primary-nav.tsx, src/components/layout/site-header.tsx

### `.nn-header-tier-pill--compact`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2385–2389 (0.1 KB)
- **Files**: src/components/layout/learner-shell-primary-nav.tsx, src/components/layout/site-header.tsx

### `.nn-header-account-trigger`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2391–2407 (0.5 KB)
- **Files**: src/components/layout/site-header.tsx

### `.nn-header-account-trigger:hover`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2409–2411 (0.1 KB)
- **Files**: src/components/layout/site-header.tsx

### `.nn-header-account-trigger:focus-visible`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2413–2416 (0.1 KB)
- **Files**: src/components/layout/site-header.tsx

### `.nn-header-brand-lockup`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2419–2421 (0.1 KB)
- **Files**: src/components/brand/header-brand-lockup.tsx, src/lib/theme/site-header-marketing-chrome.contract.test.ts

### `.nn-header-desktop-grid`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2424–2426 (0.0 KB)
- **Files**: src/components/layout/site-header.tsx

### `.nn-header-hide-until-xl`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2472–2474 (0.0 KB)
- **Files**: src/components/layout/site-header.tsx

### `.nn-header-hide-until-xl-flex`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2481–2483 (0.0 KB)
- **Files**: src/components/layout/site-header.tsx

### `.nn-header-mobile-only-flex`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2490–2492 (0.0 KB)
- **Files**: src/components/layout/site-header.tsx, src/lib/theme/site-header-marketing-chrome.contract.test.ts

### `.nn-header-mobile-only-inline-flex`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2499–2501 (0.1 KB)
- **Files**: src/components/layout/site-header.tsx

### `.nn-header-overlay-mobile-only`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2508–2510 (0.1 KB)
- **Files**: src/components/layout/site-header.tsx, src/components/preview/figma-navigation/FigmaPreviewNavMobileSheet.tsx

### `.nn-marketing-hub-strip--desktop`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 2518–2520 (0.1 KB)
- **Files**: src/components/marketing/marketing-country-hub-strip.tsx

### `.nn-header-utility`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2528–2534 (0.3 KB)
- **Files**: src/components/layout/marketing-header-utility-strip.tsx, src/lib/theme/marketing-header-bands.contract.test.ts, src/lib/theme/nav-on-active-fg.contract.test.ts

### `.nn-header-nav`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2537–2547 (0.4 KB)
- **Files**: src/components/layout/site-header.tsx, src/lib/theme/marketing-header-bands.contract.test.ts

### `.nn-header-nav--scrolled`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2549–2552 (0.2 KB)
- **Files**: none found

### `.nn-header-primary-inner-shell.nn-section-shell`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2565–2567 (0.1 KB)
- **Files**: src/components/layout/site-header.tsx, src/lib/theme/marketing-header-bands.contract.test.ts

### `.nn-header-utility-dark`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2580–2596 (1.0 KB)
- **Files**: src/components/layout/marketing-header-utility-strip.tsx, src/lib/theme/marketing-header-bands.contract.test.ts, src/lib/theme/nav-on-active-fg.contract.test.ts

### `.nn-header-logo-row`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2599–2631 (2.0 KB)
- **Files**: src/components/layout/site-header.tsx, src/lib/theme/marketing-header-bands.contract.test.ts, src/lib/theme/navigation-primary-band-readability.contract.test.ts, src/lib/theme/nav-on-active-fg.contract.test.ts

### `.nn-header-logo-row--scrolled`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2633–2638 (0.3 KB)
- **Files**: src/components/layout/site-header.tsx

### `.nn-header-logo-row:not(.nn-header-logo-row--scrolled)`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2640–2642 (0.1 KB)
- **Files**: src/components/layout/site-header.tsx, src/lib/theme/marketing-header-bands.contract.test.ts, src/lib/theme/navigation-primary-band-readability.contract.test.ts, src/lib/theme/nav-on-active-fg.contract.test.ts

### `.nn-header-dark-surface`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2653–2666 (0.8 KB)
- **Files**: src/components/layout/site-header.tsx, src/lib/theme/marketing-header-bands.contract.test.ts, src/lib/theme/nav-chrome.ts, src/lib/theme/site-header-marketing-chrome.contract.test.ts

### `.nn-header-nav-row`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2670–2684 (0.7 KB)
- **Files**: src/components/layout/site-header.tsx, src/lib/theme/marketing-header-bands.contract.test.ts

### `.nn-header-nav-row .nn-marketing-nav-link`
- **Classification**: MARKETING_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 2687–2691 (0.1 KB)
- **Files**: src/components/layout/site-header.tsx, src/lib/theme/marketing-header-bands.contract.test.ts

### `.nn-header-logo-row > .nn-header-nav-row`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2701–2716 (0.9 KB)
- **Files**: src/components/layout/site-header.tsx, src/lib/theme/marketing-header-bands.contract.test.ts, src/lib/theme/navigation-primary-band-readability.contract.test.ts, src/lib/theme/nav-on-active-fg.contract.test.ts

### `.nn-header-accent-bar`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2719–2722 (0.1 KB)
- **Files**: none found

### `.nn-nav-popup`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 2727–2737 (0.8 KB)
- **Files**: src/components/auth/marketing-header-auth.tsx

### `.nn-footer-surface`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 2739–2742 (0.1 KB)
- **Files**: none found

### `.nn-footer-link`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 2744–2752 (0.3 KB)
- **Files**: src/components/layout/site-footer.tsx

### `.nn-footer-link:hover`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 2754–2757 (0.1 KB)
- **Files**: src/components/layout/site-footer.tsx

### `.nn-footer-link:focus-visible`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 2759–2763 (0.1 KB)
- **Files**: src/components/layout/site-footer.tsx

### `.nn-hero-branded`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 2766–2768 (0.1 KB)
- **Files**: none found

### `.nn-hero-branded.nn-hero-branded--ambient-depth`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 2771–2775 (0.2 KB)
- **Files**: none found

### `.nn-marketing-trust-strip`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 2786–2788 (0.1 KB)
- **Files**: src/components/marketing/home-trust-strip-section.tsx

### `.nn-marketing-trust-panel`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 2798–2808 (0.4 KB)
- **Files**: src/components/marketing/home-trust-strip-section.tsx

### `.nn-marketing-trust-panel::before`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 2810–2828 (0.6 KB)
- **Files**: src/components/marketing/home-trust-strip-section.tsx

### `.nn-lesson-system-card`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 2838–2842 (0.2 KB)
- **Files**: src/components/marketing/allied-health-pathway-hub.tsx, src/components/pathway-lessons/lesson-system-card.tsx, src/components/learner-study-ui/learner-category-card.tsx, src/components/learner-study-hub/learner-body-system-card.tsx

### `.nn-accent-surface-a`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 2861–2865 (0.2 KB)
- **Files**: src/components/marketing/marketing-trust-signals-strip.tsx

### `.nn-accent-surface-b`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 2866–2870 (0.2 KB)
- **Files**: none found

### `.nn-accent-surface-c`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 2871–2874 (0.1 KB)
- **Files**: none found

### `.nn-trust-surface`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 2875–2878 (0.1 KB)
- **Files**: src/components/marketing/marketing-trust-signals-strip.tsx

### `.nn-surface-inset`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2881–2885 (0.1 KB)
- **Files**: src/components/pathway-lessons/fnp-lessons-hub.tsx, src/components/pathway-lessons/nclex-pn-lessons-hub.tsx, src/components/pathway-lessons/pathway-nclex-scalable-lesson-list.tsx, src/components/pathway-lessons/fnp-lesson-explorer.tsx, src/components/pathway-lessons/nclex-rn-lessons-hub.tsx

### `.nn-surface-elevated`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 2887–2892 (0.2 KB)
- **Files**: src/components/pathway-lessons/fnp-lesson-explorer.tsx, src/components/pathway-lessons/pathway-lessons-grouped-hub.tsx, src/lib/ui/themes/dashboard-theme-tokens.ts

### `.nn-chip`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 2895–2906 (0.3 KB)
- **Files**: src/components/pathway-lessons/fnp-lessons-hub.tsx, src/components/pathway-lessons/pathway-topic-cluster-grouped-nav.tsx, src/components/pathway-lessons/nclex-pn-lessons-hub.tsx, src/components/pathway-lessons/pathway-topic-cluster-sibling-nav.tsx, src/components/pathway-lessons/fnp-lesson-explorer.tsx

### `.nn-chip:hover:not([data-selected="true"]):not([aria-pressed="true"])`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 2909–2913 (0.3 KB)
- **Files**: src/components/pathway-lessons/fnp-lessons-hub.tsx, src/components/pathway-lessons/pathway-topic-cluster-grouped-nav.tsx, src/components/pathway-lessons/nclex-pn-lessons-hub.tsx, src/components/pathway-lessons/pathway-topic-cluster-sibling-nav.tsx, src/components/pathway-lessons/fnp-lesson-explorer.tsx

### `.nn-chip[data-selected="true"],`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 2920–2929 (0.3 KB)
- **Files**: src/components/pathway-lessons/fnp-lessons-hub.tsx, src/components/pathway-lessons/pathway-topic-cluster-grouped-nav.tsx, src/components/pathway-lessons/nclex-pn-lessons-hub.tsx, src/components/pathway-lessons/pathway-topic-cluster-sibling-nav.tsx, src/components/pathway-lessons/fnp-lesson-explorer.tsx

### `.nn-chip:focus-visible`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 2931–2934 (0.1 KB)
- **Files**: src/components/pathway-lessons/fnp-lessons-hub.tsx, src/components/pathway-lessons/pathway-topic-cluster-grouped-nav.tsx, src/components/pathway-lessons/nclex-pn-lessons-hub.tsx, src/components/pathway-lessons/pathway-topic-cluster-sibling-nav.tsx, src/components/pathway-lessons/fnp-lesson-explorer.tsx

### `.nn-tab-pill`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 2937–2946 (0.2 KB)
- **Files**: src/components/student/practice-tests-hub-client.tsx

### `.nn-tab-pill:hover`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 2949–2953 (0.2 KB)
- **Files**: src/components/student/practice-tests-hub-client.tsx

### `.nn-tab-pill[data-active="true"],`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 2956–2965 (0.3 KB)
- **Files**: src/components/student/practice-tests-hub-client.tsx

### `.nn-tab-pill:focus-visible`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 2967–2970 (0.1 KB)
- **Files**: src/components/student/practice-tests-hub-client.tsx

### `.nn-accent-icon-wrap`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 2973–2979 (0.2 KB)
- **Files**: none found

### `.nn-accent-icon`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 2980–2982 (0.0 KB)
- **Files**: src/components/marketing/home-features-section.tsx

### `.nn-accent-pill`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 2984–2988 (0.1 KB)
- **Files**: src/components/pathway-lessons/fnp-lessons-hub.tsx, src/components/pathway-lessons/fnp-lesson-explorer.tsx

### `.nn-accent-soft-ring`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 2989–2992 (0.1 KB)
- **Files**: none found

### `.nn-theme-gradient-br`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 2993–3002 (0.3 KB)
- **Files**: none found

### `.nn-theme-gradient-br::before`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3004–3012 (0.2 KB)
- **Files**: none found

### `.nn-theme-gradient-br > *`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3014–3017 (0.1 KB)
- **Files**: none found

### `.nn-gradient-safe`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 3024–3028 (0.1 KB)
- **Files**: src/components/marketing/pricing-sections.tsx, src/components/marketing/pricing-hero.tsx, src/components/marketing/allied-health-hub-content.tsx, src/components/marketing/new-grad/new-grad-marketing-command-hero.tsx, src/components/marketing/about-page-client.tsx

### `.nn-gradient-safe::before`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 3030–3038 (0.2 KB)
- **Files**: src/components/marketing/pricing-sections.tsx, src/components/marketing/pricing-hero.tsx, src/components/marketing/allied-health-hub-content.tsx, src/components/marketing/new-grad/new-grad-marketing-command-hero.tsx, src/components/marketing/about-page-client.tsx

### `.nn-gradient-safe > *`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 3040–3043 (0.1 KB)
- **Files**: src/components/marketing/pricing-sections.tsx, src/components/marketing/pricing-hero.tsx, src/components/marketing/allied-health-hub-content.tsx, src/components/marketing/new-grad/new-grad-marketing-command-hero.tsx, src/components/marketing/about-page-client.tsx

### `.nn-trust-check`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3044–3047 (0.2 KB)
- **Files**: none found

### `.nn-btn-primary`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 3049–3066 (0.9 KB)
- **Files**: src/app/(student)/app/(learner)/printables/printables-learner-hub.tsx, src/app/(student)/app/(learner)/start-studying/page.tsx, src/components/admin/admin-dashboard-overview.tsx, src/components/admin/theme-qa-matrix.tsx, src/components/pathway-lessons/fnp-lessons-hub.tsx

### `.nn-button-primary`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 3069–3084 (0.6 KB)
- **Files**: src/components/auth/marketing-header-auth.tsx

### `.nn-nav-cta`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 3087–3097 (0.5 KB)
- **Files**: src/components/marketing/country-marketing-home.tsx, src/components/marketing/global-marketing-home-intro.server.tsx, src/components/auth/marketing-header-auth.tsx, src/components/layout/site-footer.tsx, src/components/layout/site-header.tsx

### `.nn-nav-cta:hover:not(:disabled):not([aria-disabled="true"]):not(:active)`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 3098–3102 (0.2 KB)
- **Files**: src/components/marketing/country-marketing-home.tsx, src/components/marketing/global-marketing-home-intro.server.tsx, src/components/auth/marketing-header-auth.tsx, src/components/layout/site-footer.tsx, src/components/layout/site-header.tsx

### `.nn-nav-cta:active:not(:disabled):not([aria-disabled="true"])`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 3103–3107 (0.2 KB)
- **Files**: src/components/marketing/country-marketing-home.tsx, src/components/marketing/global-marketing-home-intro.server.tsx, src/components/auth/marketing-header-auth.tsx, src/components/layout/site-footer.tsx, src/components/layout/site-header.tsx

### `.nn-button-primary:hover:not(:disabled):not([aria-disabled="true"]):not(:active)`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 3108–3113 (0.2 KB)
- **Files**: src/components/auth/marketing-header-auth.tsx

### `.nn-button-primary:active:not(:disabled):not([aria-disabled="true"])`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 3114–3119 (0.2 KB)
- **Files**: src/components/auth/marketing-header-auth.tsx

### `.nn-button-primary:disabled,`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 3120–3127 (0.2 KB)
- **Files**: src/components/auth/marketing-header-auth.tsx

### `.nn-btn-primary:hover:not(:disabled):not([aria-disabled="true"]):not(:active)`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 3129–3136 (0.4 KB)
- **Files**: src/app/(student)/app/(learner)/printables/printables-learner-hub.tsx, src/app/(student)/app/(learner)/start-studying/page.tsx, src/components/admin/admin-dashboard-overview.tsx, src/components/admin/theme-qa-matrix.tsx, src/components/pathway-lessons/fnp-lessons-hub.tsx

### `.nn-btn-primary:active:not(:disabled):not([aria-disabled="true"])`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 3138–3145 (0.4 KB)
- **Files**: src/app/(student)/app/(learner)/printables/printables-learner-hub.tsx, src/app/(student)/app/(learner)/start-studying/page.tsx, src/components/admin/admin-dashboard-overview.tsx, src/components/admin/theme-qa-matrix.tsx, src/components/pathway-lessons/fnp-lessons-hub.tsx

### `.nn-btn-primary:disabled,`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 3147–3154 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/printables/printables-learner-hub.tsx, src/app/(student)/app/(learner)/start-studying/page.tsx, src/components/admin/admin-dashboard-overview.tsx, src/components/admin/theme-qa-matrix.tsx, src/components/pathway-lessons/fnp-lessons-hub.tsx

### `.nn-btn-primary:focus-visible,`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 3156–3161 (0.1 KB)
- **Files**: src/components/marketing/country-marketing-home.tsx, src/components/marketing/global-marketing-home-intro.server.tsx, src/components/auth/marketing-header-auth.tsx, src/components/layout/site-footer.tsx, src/components/layout/site-header.tsx

### `.nn-btn-primary.inline-flex,`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 3164–3167 (0.0 KB)
- **Files**: src/app/(student)/app/(learner)/practice-tests/cat-insights/page.tsx, src/components/admin/admin-automation-logs-client.tsx, src/components/admin/admin-dashboard-overview.tsx, src/components/admin/theme-qa-matrix.tsx, src/components/pathway-lessons/fnp-lessons-hub.tsx

### `.nn-btn-primary.inline-flex svg,`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 3168–3172 (0.1 KB)
- **Files**: src/components/marketing/for-institutions-pricing-and-form.tsx, src/components/marketing/allied-health-hub-content.tsx, src/components/marketing/pricing-page-client.tsx, src/components/auth/signup-form.tsx, src/lib/theme/marketing-hero-pattern.ts

### `.nn-btn-secondary`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 3174–3187 (0.7 KB)
- **Files**: src/app/(student)/app/(learner)/practice-tests/cat-insights/page.tsx, src/components/admin/admin-automation-logs-client.tsx, src/components/admin/admin-dashboard-overview.tsx, src/components/admin/theme-qa-matrix.tsx, src/components/pathway-lessons/fnp-lessons-hub.tsx

### `.nn-btn-secondary:hover:not(:disabled):not([aria-disabled="true"]):not(:active)`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 3189–3195 (0.3 KB)
- **Files**: src/app/(student)/app/(learner)/practice-tests/cat-insights/page.tsx, src/components/admin/admin-automation-logs-client.tsx, src/components/admin/admin-dashboard-overview.tsx, src/components/admin/theme-qa-matrix.tsx, src/components/pathway-lessons/fnp-lessons-hub.tsx

### `.nn-btn-secondary:active:not(:disabled):not([aria-disabled="true"])`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 3197–3200 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/practice-tests/cat-insights/page.tsx, src/components/admin/admin-automation-logs-client.tsx, src/components/admin/admin-dashboard-overview.tsx, src/components/admin/theme-qa-matrix.tsx, src/components/pathway-lessons/fnp-lessons-hub.tsx

### `.nn-btn-secondary:focus-visible`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 3202–3205 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/practice-tests/cat-insights/page.tsx, src/components/admin/admin-automation-logs-client.tsx, src/components/admin/admin-dashboard-overview.tsx, src/components/admin/theme-qa-matrix.tsx, src/components/pathway-lessons/fnp-lessons-hub.tsx

### `.nn-trust-mark`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3208–3210 (0.1 KB)
- **Files**: none found

### `.nn-link-quiet`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 3221–3227 (0.2 KB)
- **Files**: src/components/marketing/for-institutions-pricing-and-form.tsx, src/components/marketing/allied-health-hub-content.tsx, src/components/marketing/pricing-page-client.tsx, src/components/auth/signup-form.tsx, src/lib/theme/marketing-hero-pattern.ts

### `.nn-link-quiet:hover`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 3229–3232 (0.1 KB)
- **Files**: src/components/marketing/for-institutions-pricing-and-form.tsx, src/components/marketing/allied-health-hub-content.tsx, src/components/marketing/pricing-page-client.tsx, src/components/auth/signup-form.tsx, src/lib/theme/marketing-hero-pattern.ts

### `.animate-page-enter`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3234–3237 (0.2 KB)
- **Files**: none found

### `.nn-header-animate-in`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 3293–3295 (0.0 KB)
- **Files**: src/lib/marketing/homepage-pagespeed-performance.contract.test.ts, src/components/layout/site-header.tsx

### `.nn-carousel-slide-crossfade`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 3340–3344 (0.2 KB)
- **Files**: src/components/marketing/marketing-hero-carousel.tsx

### `.nn-carousel-slide-crossfade.nn-carousel-slide-crossfade--depth`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 3347–3349 (0.1 KB)
- **Files**: src/components/marketing/marketing-hero-carousel.tsx

### `.nn-skeleton-fade`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 3363–3366 (0.1 KB)
- **Files**: src/components/marketing/marketing-hero-carousel.tsx, src/app/(student)/app/loading.tsx, src/components/study/learner-command-center-client.tsx

### `.nn-skeleton-soft-pulse`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 3378–3380 (0.1 KB)
- **Files**: src/components/marketing/marketing-hero-carousel.tsx, src/components/study/learner-command-center-client.tsx, src/components/study/coach-response-panel.tsx

### `.nn-marketing-x`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 3421–3424 (0.1 KB)
- **Files**: src/app/(marketing)/(default)/canada-np-exam-prep/page.tsx, src/app/(marketing)/(default)/cnple-vs-cnpe/page.tsx, src/app/(marketing)/(default)/pricing/page.tsx, src/app/(marketing)/(default)/what-is-the-cnple/page.tsx, src/app/(marketing)/(default)/cnple-study-guide/page.tsx

### `.nn-rhythm-section`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 3438–3441 (0.1 KB)
- **Files**: src/app/(marketing)/(default)/allied-health/page.tsx, src/components/marketing/home-trust-strip-section.tsx, src/components/marketing/home-hero-screenshot-section.tsx, src/components/marketing/global-marketing-home-intro.server.tsx, src/components/marketing/practice-exams-hub-content.tsx

### `.nn-rhythm-page`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 3443–3446 (0.1 KB)
- **Files**: src/app/(marketing)/(default)/canada-np-exam-prep/page.tsx, src/app/(marketing)/(default)/cnple-vs-cnpe/page.tsx, src/app/(marketing)/(default)/what-is-the-cnple/page.tsx, src/app/(marketing)/(default)/cnple-study-guide/page.tsx, src/app/(marketing)/(default)/exams/uk/page.tsx

### `.nn-hero-bridge`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 3448–3450 (0.1 KB)
- **Files**: src/components/marketing/home/premium-homepage-hero.tsx, src/components/marketing/home-conversion-hero.tsx, src/components/admin/theme-qa-matrix.tsx, src/lib/theme/marketing-hero-pattern.ts

### `.nn-marketing-hero-section`
- **Classification**: MARKETING_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 3453–3456 (0.1 KB)
- **Files**: src/lib/theme/marketing-hero-pattern.ts

### `.nn-stack-hero-heading`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 3458–3462 (0.1 KB)
- **Files**: src/components/marketing/marketing-public-study-landing.tsx, src/lib/theme/marketing-hero-pattern.ts

### `.nn-hero-cta-row`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 3465–3470 (0.1 KB)
- **Files**: src/components/marketing/marketing-public-study-landing.tsx, src/components/admin/theme-qa-matrix.tsx, src/lib/theme/marketing-hero-pattern.ts

### `.nn-final-cta-row`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3480–3485 (0.1 KB)
- **Files**: src/lib/theme/marketing-hero-pattern.ts

### `html[data-learner-exam-chrome="hidden"] .nn-learner-exam-chrome-target,`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 3497–3502 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/layout.tsx

### `html[data-learner-exam-chrome="hidden"] .nn-learner-app,`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 3505–3509 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/layout.tsx

### `.nn-study-card`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 3602–3608 (0.3 KB)
- **Files**: src/components/pathway-lessons/pathway-hub-section.tsx, src/components/pathway-lessons/fnp-lessons-hub.tsx, src/components/pathway-lessons/pathway-high-yield-start.tsx, src/components/pathway-lessons/pathway-topic-cluster-grouped-nav.tsx, src/components/pathway-lessons/pathway-question-hub-related-lessons.tsx

### `.nn-study-card--wash`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 3610–3613 (0.1 KB)
- **Files**: src/components/pathway-lessons/pathway-hub-section.tsx, src/components/pathway-lessons/fnp-lessons-hub.tsx, src/components/pathway-lessons/pathway-high-yield-start.tsx, src/components/pathway-lessons/pathway-topic-cluster-grouped-nav.tsx, src/components/pathway-lessons/pathway-question-hub-related-lessons.tsx

### `.nn-lesson-list-card`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3616–3624 (0.2 KB)
- **Files**: src/components/pathway-lessons/fnp-lesson-explorer.tsx, src/components/pathway-lessons/pathway-lessons-grouped-hub.tsx

### `.nn-study-callout`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 3626–3631 (0.2 KB)
- **Files**: src/components/marketing/nursing-tier-hub-page.tsx, src/components/pathway-lessons/fnp-lessons-hub.tsx, src/components/pathway-lessons/pathway-lessons-grouped-hub.tsx, src/components/lessons/pathway-lesson-quizzes.tsx, src/components/lessons/pathway-lesson-link-practice.tsx

### `.nn-lesson-page-shell`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 3634–3641 (0.3 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx, src/components/lessons/pathway-lesson-detail-loading-fallback.tsx

### `.nn-lesson-page-title`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3644–3651 (0.3 KB)
- **Files**: src/components/lessons/pathway-lesson-detail-header.tsx

### `.nn-lesson-page-reading`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3654–3661 (0.2 KB)
- **Files**: none found

### `.nn-lesson-quiz-module`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3664–3669 (0.3 KB)
- **Files**: src/components/lessons/lesson-post-assessment-card.tsx, src/components/lessons/lesson-pre-assessment-card.tsx, src/components/lessons/pathway-lesson-legacy-study-shell.tsx

### `.nn-lesson-module-eyebrow`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3671–3677 (0.2 KB)
- **Files**: src/components/lessons/lesson-post-assessment-card.tsx, src/components/lessons/pathway-lesson-actions.tsx, src/components/lessons/lesson-pre-assessment-card.tsx, src/components/lessons/pathway-lesson-legacy-study-shell.tsx, src/components/lessons/pathway-lesson-study-loop-cta.tsx

### `.nn-lesson-section-card.nn-lesson-section-card--editorial`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 3680–3690 (0.3 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-section-card.nn-lesson-section-card--editorial:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 3692–3696 (0.2 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-section-eyebrow`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 3698–3705 (0.2 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx

### `.nn-lesson-section-card.nn-lesson-section-card--callout`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 3708–3712 (0.2 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-section-heading`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 3714–3719 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx

### `.nn-lesson-support-card`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3721–3723 (0.1 KB)
- **Files**: none found

### `.nn-lesson-page-shell--np`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 3726–3732 (0.1 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx, src/components/lessons/pathway-lesson-detail-loading-fallback.tsx

### `.nn-np-hub-root`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3735–3745 (0.4 KB)
- **Files**: src/components/pathway-lessons/fnp-lessons-hub.tsx, src/components/pathway-lessons/pathway-lessons-grouped-hub.tsx

### `.nn-lessons-hero--np`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3754–3760 (0.2 KB)
- **Files**: src/components/pathway-lessons/pathway-lessons-study-hero.tsx

### `.nn-lesson-article-section`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3763–3769 (0.3 KB)
- **Files**: src/components/pre-nursing/pre-nursing-lesson-template-v2.tsx

### `.nn-lesson-article-section--alt`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3777–3780 (0.2 KB)
- **Files**: none found

### `.nn-lesson-hy-takeaways`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3783–3789 (0.3 KB)
- **Files**: src/components/lessons/exam-takeaways-block.tsx

### `.nn-lesson-hy-takeaways--bottom`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3791–3794 (0.2 KB)
- **Files**: none found

### `.nn-lesson-hy-takeaways__title`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3796–3803 (0.2 KB)
- **Files**: src/components/lessons/exam-takeaways-block.tsx

### `.nn-lesson-hy-takeaways__list`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3805–3815 (0.2 KB)
- **Files**: src/components/lessons/exam-takeaways-block.tsx

### `.nn-lesson-hy-takeaways__item::marker`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3817–3819 (0.1 KB)
- **Files**: src/components/lessons/exam-takeaways-block.tsx

### `.nn-lesson-hy-traps`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3821–3826 (0.3 KB)
- **Files**: src/components/lessons/pathway-lesson-study-strips.tsx

### `.nn-lesson-hy-traps__title`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3828–3833 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-study-strips.tsx

### `.nn-lesson-hy-traps__lede`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3835–3838 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-study-strips.tsx

### `.nn-lesson-hy-traps__list`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3840–3850 (0.2 KB)
- **Files**: src/components/lessons/pathway-lesson-study-strips.tsx

### `.nn-lesson-hy-traps__item::marker`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3852–3854 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-study-strips.tsx

### `.nn-lesson-hy-memory`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3856–3861 (0.2 KB)
- **Files**: src/components/lessons/pathway-lesson-study-strips.tsx

### `.nn-lesson-hy-memory__label`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3863–3870 (0.2 KB)
- **Files**: src/components/lessons/pathway-lesson-study-strips.tsx

### `.nn-lesson-hy-memory__text`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3872–3878 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-study-strips.tsx

### `.nn-lesson-content.nn-lesson-prose,`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3883–3893 (0.3 KB)
- **Files**: src/components/lessons/pathway-lesson-body.tsx, styles/learner-ds.css

### `.nn-lesson-content.nn-lesson-prose pre,`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3918–3925 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-body.tsx, styles/learner-ds.css

### `.nn-lesson-callout`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3928–3936 (0.4 KB)
- **Files**: src/components/lessons/pathway-lesson-callout.tsx

### `.nn-lesson-callout--exam`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3937–3940 (0.2 KB)
- **Files**: none found

### `.nn-lesson-callout--clinical`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3941–3944 (0.2 KB)
- **Files**: none found

### `.nn-lesson-callout__label`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3945–3952 (0.2 KB)
- **Files**: src/components/lessons/pathway-lesson-callout.tsx

### `.nn-lesson-callout__body`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3953–3958 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-callout.tsx

### `.nn-lesson-prose ul,`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3965–3970 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-body.tsx, styles/learner-ds.css

### `.nn-lesson-prose li`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3972–3977 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-body.tsx, styles/learner-ds.css

### `.nn-lesson-prose ul`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3979–3981 (0.0 KB)
- **Files**: src/components/lessons/pathway-lesson-body.tsx, styles/learner-ds.css

### `.nn-lesson-prose ol`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3983–3985 (0.0 KB)
- **Files**: src/components/lessons/pathway-lesson-body.tsx, styles/learner-ds.css

### `.nn-lesson-section-card .nn-lesson-prose li::marker`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 3988–3990 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-prose .nn-lesson-list-header`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 3993–3997 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-body.tsx, styles/learner-ds.css

### `.nn-lesson-exam-focus-inline`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4000–4004 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-body.tsx

### `.nn-lesson-exam-focus-inline__card`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4014–4020 (0.4 KB)
- **Files**: src/components/lessons/pathway-lesson-body.tsx

### `.nn-lesson-exam-focus-inline__card[data-exam-focus-block="traps"]`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4022–4025 (0.2 KB)
- **Files**: src/components/lessons/pathway-lesson-body.tsx

### `.nn-lesson-exam-focus-inline__card[data-exam-focus-block="priorities"]`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4027–4030 (0.2 KB)
- **Files**: src/components/lessons/pathway-lesson-body.tsx

### `.nn-lesson-exam-focus-inline__head`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4032–4037 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-body.tsx

### `.nn-lesson-exam-focus-inline__icon`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4039–4044 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-body.tsx

### `.nn-lesson-exam-focus-inline__card[data-exam-focus-block="how-tested"] .nn-lesso`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4046–4048 (0.2 KB)
- **Files**: src/components/lessons/pathway-lesson-body.tsx

### `.nn-lesson-exam-focus-inline__card[data-exam-focus-block="traps"] .nn-lesson-exa`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4050–4052 (0.2 KB)
- **Files**: src/components/lessons/pathway-lesson-body.tsx

### `.nn-lesson-exam-focus-inline__card[data-exam-focus-block="priorities"] .nn-lesso`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4054–4056 (0.2 KB)
- **Files**: src/components/lessons/pathway-lesson-body.tsx

### `.nn-lesson-exam-focus-inline__title`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4058–4066 (0.2 KB)
- **Files**: src/components/lessons/pathway-lesson-body.tsx

### `.nn-lesson-exam-focus-inline__body`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4068–4070 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-body.tsx

### `.nn-lesson-section-card[data-lsc-kind="tier_specific_relevance"] .nn-lesson-cont`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4073–4075 (0.2 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-section-card[data-lsc-kind="labs_diagnostics"] .nn-lesson-content.nn-`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4077–4080 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-section-card[data-lsc-kind="clinical_pearls"] .nn-lesson-content.nn-l`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4082–4084 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-section-card[data-lsc-kind="nursing_assessment_interventions"]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4086–4090 (0.0 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-section-card[data-lsc-kind="treatment_management"] .nn-lesson-content`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4093–4095 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-section-card[data-lsc-kind="clinical_scenario"] .nn-lesson-content.nn`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4097–4099 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-section-card[data-lsc-kind="related_next_steps"] .nn-lesson-content.n`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4101–4103 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-prose strong`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4105–4108 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-body.tsx, styles/learner-ds.css

### `.nn-lesson-prose > p,`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4110–4113 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-body.tsx, styles/learner-ds.css

### `.nn-lesson-section-card`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4121–4143 (1.1 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-section-card[data-lsc-role="info"]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4166–4170 (0.2 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-section-card[data-lsc-role="warning"]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4171–4175 (0.2 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-section-card[data-lsc-role="danger"]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4176–4181 (0.3 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-section-card[data-lsc-role="success"]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4182–4186 (0.2 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-section-card[data-lsc-role="education"]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4187–4191 (0.2 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-section-card[data-lsc-role="concept"]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4192–4196 (0.3 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-section-card[data-lsc-role="action"]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4197–4201 (0.2 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-section-card[data-lsc-role="diagnostic"]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4202–4206 (0.2 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-section-card[data-lsc-role="application"]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4207–4211 (0.2 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-section-card[data-lsc-role="review"]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4212–4216 (0.2 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-section-card[data-lsc-role="cta"]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4217–4221 (0.2 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-section-chip`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4228–4243 (0.5 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx

### `.nn-lesson-section-card figure`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4248–4251 (0.2 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-section-card figcaption`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4253–4258 (0.2 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.nn-lesson-section-card .nn-lesson-section-lead-figure`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4261–4265 (0.3 KB)
- **Files**: src/components/lessons/lesson-section-card.tsx, src/components/lessons/pathway-lesson-figures.tsx, src/lib/ui/lesson-section-theme.ts

### `.lv-section[data-lsc-role] .nn-lesson-section-lead-figure`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4267–4271 (0.3 KB)
- **Files**: src/components/lessons/lesson-section-optional-image.tsx

### `.nn-lesson-rationale`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4277–4283 (0.3 KB)
- **Files**: src/components/lessons/pathway-lesson-quiz-set.tsx

### `.nn-lesson-rationale__label`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4285–4292 (0.2 KB)
- **Files**: src/components/lessons/pathway-lesson-quiz-set.tsx

### `.nn-lesson-rationale__body`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4294–4301 (0.2 KB)
- **Files**: src/components/lessons/pathway-lesson-quiz-set.tsx

### `.nn-lesson-page`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 4307–4309 (0.0 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx, src/app/(student)/app/(learner)/lessons/[id]/page.tsx, src/components/lessons/lesson-page-header.tsx, src/components/lessons/pathway-lesson-detail-loading-fallback.tsx, src/components/lessons/pathway-lesson-detail-header.tsx

### `.nn-lesson-page-header`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 4311–4314 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/lessons/[id]/page.tsx, src/components/lessons/lesson-page-header.tsx

### `.nn-lesson-page--learner-app`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 4317–4319 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-page--learner-app .nn-lesson-editorial-rail--hero`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 4321–4326 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-page--learner-app .nn-lesson-editorial-rail--main`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 4328–4334 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-page--learner-app .nn-lesson-page-header`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 4342–4346 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-page--learner-app .nn-lesson-layout--triple`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 4348–4350 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-page--learner-app .nn-lesson-section-card.nn-lesson-section-card--edi`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 4358–4368 (0.6 KB)
- **Files**: src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-page--learner-app .nn-lesson-section-card.nn-lesson-section-card--cal`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 4370–4379 (0.5 KB)
- **Files**: src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-utilities-rail .rounded-lg,`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4381–4385 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-study-rail.tsx

### `.nn-lesson-utility-card`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4387–4391 (0.2 KB)
- **Files**: src/components/lessons/pathway-lesson-study-rail.tsx

### `.nn-lesson-utility-card--accent`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4393–4396 (0.2 KB)
- **Files**: src/components/lessons/pathway-lesson-study-rail.tsx

### `.nn-lesson-utility-card__row`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4398–4403 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-study-rail.tsx

### `.nn-lesson-utility-card h2`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4405–4410 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-study-rail.tsx

### `.nn-lesson-utility-card p`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4412–4417 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-study-rail.tsx

### `.nn-lesson-quick-summary`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4419–4428 (0.6 KB)
- **Files**: src/components/lessons/pathway-lesson-quick-clinical-summary.tsx

### `.nn-lesson-quick-summary__header`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4430–4435 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-quick-clinical-summary.tsx

### `.nn-lesson-quick-summary__header p`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4437–4444 (0.2 KB)
- **Files**: src/components/lessons/pathway-lesson-quick-clinical-summary.tsx

### `.nn-lesson-quick-summary__header h2`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4446–4452 (0.2 KB)
- **Files**: src/components/lessons/pathway-lesson-quick-clinical-summary.tsx

### `.nn-lesson-quick-summary__grid`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4454–4457 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-quick-clinical-summary.tsx

### `.nn-lesson-quick-summary-card`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4471–4479 (0.4 KB)
- **Files**: src/components/lessons/pathway-lesson-quick-clinical-summary.tsx

### `.nn-lesson-quick-summary-card__title`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4481–4486 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-quick-clinical-summary.tsx

### `.nn-lesson-quick-summary-card__icon`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4488–4497 (0.3 KB)
- **Files**: src/components/lessons/pathway-lesson-quick-clinical-summary.tsx

### `.nn-lesson-quick-summary-card h3`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4499–4504 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-quick-clinical-summary.tsx

### `.nn-lesson-quick-summary-card ul`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4506–4511 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-quick-clinical-summary.tsx

### `.nn-lesson-quick-summary-card li`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4513–4517 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-quick-clinical-summary.tsx

### `.nn-lesson-page--learner-app .nn-lesson-section-card.nn-lesson-section-card--cal`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 4519–4522 (0.3 KB)
- **Files**: src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-page--learner-app .nn-lesson-section-card.nn-lesson-section-card--cal`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 4524–4528 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-section-card.nn-lesson-section-card--tier-callout,`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 4530–4534 (0.3 KB)
- **Files**: src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-page--learner-app .nn-lesson-section-chip`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 4536–4539 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-page--learner-app .nn-lesson-section-card .nn-lesson-section-heading,`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 4541–4548 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-page--learner-app .nn-lesson-editorial-rail--main .nn-lesson-content.`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 4550–4556 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-page--learner-app .nn-lesson-section-nav`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 4566–4571 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-study-loop--learner`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4573–4578 (0.3 KB)
- **Files**: src/components/lessons/pathway-lesson-study-loop-cta.tsx

### `.nn-lesson-layout--triple,`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 4581–4586 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-main`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 4622–4624 (0.0 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx, src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-study-rail-aside`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 4626–4628 (0.0 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx, src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-section-nav-mobile`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4642–4647 (0.2 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-section-nav-mobile__summary`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4649–4660 (0.3 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-section-nav-mobile__summary::-webkit-details-marker`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4662–4664 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-section-nav-mobile[open] .nn-lesson-section-nav-mobile__chevron`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4666–4668 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-section-nav-mobile__chevron`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4670–4672 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-section-nav-mobile__panel`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4674–4679 (0.2 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-section-nav`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 4681–4683 (0.0 KB)
- **Files**: src/lib/marketing/public-lesson-detail-marketing.contract.test.tsx, src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-section-nav__header`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4707–4713 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-section-nav__header p`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4715–4721 (0.2 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-section-nav__header span,`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4723–4727 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-section-nav__progress`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4729–4739 (0.4 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-section-nav__progress strong`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4741–4745 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-section-nav__jump`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4747–4752 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-section-nav__jump button`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4754–4762 (0.3 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-section-nav__jump button:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4764–4767 (0.2 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-nav-item`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4769–4779 (0.3 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-nav-item:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4781–4783 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-nav-item[data-active]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4785–4788 (0.2 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-nav-dot`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4790–4802 (0.3 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-nav-dot[data-role=info]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4804–4804 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-nav-dot[data-role=warning]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4805–4805 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-nav-dot[data-role=danger]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4806–4806 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-nav-dot[data-role=success]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4807–4807 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-nav-dot[data-role=education]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4808–4808 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-nav-dot[data-role=concept]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4809–4809 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-nav-dot[data-role=action]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4810–4810 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-nav-dot[data-role=diagnostic]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4811–4811 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-nav-dot[data-role=application]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4812–4812 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-nav-dot[data-role=review]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4813–4813 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-nav-dot[data-role=cta]`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4814–4814 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-nav-label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4816–4822 (0.2 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-nav-item[data-active] .nn-lesson-nav-label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4824–4827 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-nav-chip`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4829–4835 (0.2 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-nav-item[data-active] .nn-lesson-nav-chip`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4837–4839 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-nav-item[data-completed] .nn-lesson-nav-dot`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 4841–4845 (0.1 KB)
- **Files**: src/components/lessons/lesson-section-nav.tsx

### `.nn-lesson-phase-strip`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4847–4855 (0.4 KB)
- **Files**: src/components/lessons/lesson-study-phase-progress.tsx

### `.nn-lesson-phase-strip__top,`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4857–4863 (0.1 KB)
- **Files**: src/components/lessons/lesson-study-phase-progress.tsx

### `.nn-lesson-phase-strip__label`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4865–4872 (0.2 KB)
- **Files**: src/components/lessons/lesson-study-phase-progress.tsx

### `.nn-lesson-phase-strip__percent`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4874–4878 (0.1 KB)
- **Files**: src/components/lessons/lesson-study-phase-progress.tsx

### `.nn-lesson-phase-strip__bar`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4880–4886 (0.2 KB)
- **Files**: src/components/lessons/lesson-study-phase-progress.tsx

### `.nn-lesson-phase-strip__bar span`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4888–4893 (0.2 KB)
- **Files**: src/components/lessons/lesson-study-phase-progress.tsx

### `.nn-lesson-phase-strip__steps`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4895–4899 (0.1 KB)
- **Files**: src/components/lessons/lesson-study-phase-progress.tsx

### `.nn-lesson-phase-strip__steps li`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4901–4909 (0.2 KB)
- **Files**: src/components/lessons/lesson-study-phase-progress.tsx

### `.nn-lesson-phase-strip__dot`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4911–4920 (0.3 KB)
- **Files**: src/components/lessons/lesson-study-phase-progress.tsx

### `.nn-lesson-phase-strip__steps li[data-active]`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4922–4924 (0.1 KB)
- **Files**: src/components/lessons/lesson-study-phase-progress.tsx

### `.nn-lesson-phase-strip__steps li[data-active] .nn-lesson-phase-strip__dot`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4926–4930 (0.3 KB)
- **Files**: src/components/lessons/lesson-study-phase-progress.tsx

### `.nn-lesson-phase-strip__steps li[data-complete] .nn-lesson-phase-strip__dot`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4932–4936 (0.2 KB)
- **Files**: src/components/lessons/lesson-study-phase-progress.tsx

### `.nn-lesson-leaf-loader`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4956–4960 (0.1 KB)
- **Files**: src/components/lessons/pathway-lesson-detail-loading-fallback.tsx

### `.nn-lesson-leaf-loader__leaf`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 4962–4968 (0.2 KB)
- **Files**: src/components/lessons/pathway-lesson-detail-loading-fallback.tsx

### `.nn-lesson-article-flow`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 5008–5015 (0.2 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx, src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-article-flow.nn-lesson-article-grid`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 5017–5019 (0.1 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx, src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-article-flow::before`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 5021–5032 (0.4 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx, src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-article-flow > .nn-lesson-section-card`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 5034–5037 (0.1 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx, src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-article-flow > .nn-lesson-section-card.nn-lesson-section-card--callou`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 5039–5041 (0.1 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx, src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-article-flow .nn-lesson-section-card.nn-lesson-section-card--spine-cl`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 5044–5047 (0.3 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx, src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-article-flow .nn-lesson-section-card.nn-lesson-section-card--spine-ex`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 5049–5052 (0.3 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx, src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-article-flow .nn-lesson-section-card.nn-lesson-section-card--spine-co`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 5054–5057 (0.3 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx, src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-article-flow .nn-lesson-section-card.nn-lesson-section-card--spine-cl`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 5059–5062 (0.3 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx, src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-article-flow .nn-lesson-section-card.nn-lesson-section-card--spine-ta`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 5064–5067 (0.3 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx, src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-article-flow .nn-lesson-section-card.nn-lesson-section-card--editoria`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 5070–5079 (0.7 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx, src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-article-flow .nn-lesson-section-card.nn-lesson-section-card--editoria`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 5081–5090 (0.7 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx, src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-lesson-article-flow .nn-lesson-content.nn-lesson-prose,`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 5102–5105 (0.1 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx, src/app/(student)/app/(learner)/lessons/[id]/page.tsx

### `.nn-mistake-card`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 5155–5163 (0.3 KB)
- **Files**: src/components/mistakes/mistake-card.tsx

### `.nn-study-loop-outer`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5182–5192 (0.4 KB)
- **Files**: src/components/lessons/pathway-lesson-study-loop-cta.tsx, src/components/student/practice-test-study-loop-next.tsx

### `.nn-study-pill-secondary`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5195–5213 (0.7 KB)
- **Files**: src/components/pathway-lessons/pathway-lessons-study-hero.tsx, src/components/pathway-lessons/pathway-lesson-pagination.tsx, src/components/pathway-lessons/pathway-lessons-hub-search.tsx

### `.nn-study-pill-secondary:hover:not(:active)`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5214–5219 (0.3 KB)
- **Files**: src/components/pathway-lessons/pathway-lessons-study-hero.tsx, src/components/pathway-lessons/pathway-lesson-pagination.tsx, src/components/pathway-lessons/pathway-lessons-hub-search.tsx

### `.nn-study-pill-secondary:active`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5220–5223 (0.2 KB)
- **Files**: src/components/pathway-lessons/pathway-lessons-study-hero.tsx, src/components/pathway-lessons/pathway-lesson-pagination.tsx, src/components/pathway-lessons/pathway-lessons-hub-search.tsx

### `.nn-study-pill-secondary:focus-visible`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5224–5229 (0.2 KB)
- **Files**: src/components/pathway-lessons/pathway-lessons-study-hero.tsx, src/components/pathway-lessons/pathway-lesson-pagination.tsx, src/components/pathway-lessons/pathway-lessons-hub-search.tsx

### `.nn-study-pill-secondary--accent`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5232–5236 (0.1 KB)
- **Files**: none found

### `.nn-study-card.nn-study-card--accent-leading`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5239–5242 (0.1 KB)
- **Files**: src/components/pathway-lessons/pathway-hub-section.tsx, src/components/pathway-lessons/fnp-lessons-hub.tsx, src/components/pathway-lessons/pathway-high-yield-start.tsx, src/components/pathway-lessons/pathway-topic-cluster-grouped-nav.tsx, src/components/pathway-lessons/pathway-question-hub-related-lessons.tsx

### `.nn-card-secondary`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 5263–5268 (0.2 KB)
- **Files**: none found

### `.nn-card-cool`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 5270–5275 (0.2 KB)
- **Files**: src/components/student/learner-account-nav.tsx

### `.nn-card-positive`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 5277–5282 (0.2 KB)
- **Files**: none found

### `.nn-card-emphasis`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 5284–5289 (0.3 KB)
- **Files**: none found

### `.nn-card-warm`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 5291–5296 (0.2 KB)
- **Files**: none found

### `.nn-alt-section-base`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 5299–5301 (0.1 KB)
- **Files**: none found

### `.nn-alt-section-a`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 5303–5305 (0.1 KB)
- **Files**: none found

### `.nn-alt-section-b`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 5307–5309 (0.1 KB)
- **Files**: none found

### `.nn-alt-section-cool`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 5311–5313 (0.1 KB)
- **Files**: none found

### `.nn-question-session`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5315–5323 (0.2 KB)
- **Files**: src/components/exam/session-split-rationale-aside.tsx, src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/exam-practice-client.tsx, src/components/student/practice-test-runner/practice-test-runner-board-parts.tsx, src/components/student/freemium-question-peek.tsx

### `.nn-question-session--split`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5332–5343 (0.2 KB)
- **Files**: src/components/student/exam-practice-client.tsx, src/components/student/practice-test-runner-client.tsx, src/components/student/practice-question-session-client.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-question-session--split.nn-question-session--single`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5362–5364 (0.1 KB)
- **Files**: src/components/student/exam-practice-client.tsx, src/components/student/practice-test-runner-client.tsx, src/components/student/practice-question-session-client.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-question-session-primary`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5366–5370 (0.1 KB)
- **Files**: src/components/student/exam-practice-client.tsx, src/components/student/practice-test-runner-client.tsx, src/components/student/practice-question-session-client.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-question-session-rationale`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5372–5379 (0.1 KB)
- **Files**: src/components/exam/session-split-rationale-aside.tsx, src/components/student/practice-test-runner/practice-test-runner-board-parts.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-question-session-rationale > .nn-practice-rationale-full,`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5381–5385 (0.1 KB)
- **Files**: src/components/exam/session-split-rationale-aside.tsx, src/components/student/practice-test-runner/practice-test-runner-board-parts.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-question-rationale-placeholder`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5399–5410 (0.4 KB)
- **Files**: src/components/exam/session-split-rationale-aside.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-question-stem`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5412–5420 (0.2 KB)
- **Files**: src/components/flashcards/flashcard-rich-content.tsx, src/components/student/exam-practice-client.tsx, src/components/student/freemium-question-peek.tsx, src/components/student/practice-question-session-client.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-question-stem-wrap`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5428–5432 (0.2 KB)
- **Files**: src/components/student/exam-practice-client.tsx, src/components/student/freemium-question-peek.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-question-stem-card`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5435–5448 (0.4 KB)
- **Files**: src/components/student/exam-practice-client.tsx, src/components/student/freemium-question-peek.tsx, src/components/student/practice-question-session-client.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-question-stem-card .nn-question-stem-wrap`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5450–5454 (0.1 KB)
- **Files**: src/components/student/exam-practice-client.tsx, src/components/student/freemium-question-peek.tsx, src/components/student/practice-question-session-client.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-qopt-list`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5456–5460 (0.1 KB)
- **Files**: src/components/student/exam-practice-client.tsx, src/components/student/freemium-question-peek.tsx, src/components/student/practice-question-session-client.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-question-session-primary ul.nn-qopt-list button.flex-1`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5469–5474 (0.2 KB)
- **Files**: src/components/student/exam-practice-client.tsx, src/components/student/practice-test-runner-client.tsx, src/components/student/practice-question-session-client.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-question-session-primary ul.nn-qopt-list label span.min-w-0.flex-1`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5476–5479 (0.1 KB)
- **Files**: src/components/student/exam-practice-client.tsx, src/components/student/practice-test-runner-client.tsx, src/components/student/practice-question-session-client.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-flashcard-rich`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 5482–5485 (0.1 KB)
- **Files**: src/components/flashcards/flashcard-rich-content.tsx

### `.nn-flashcard-rich img`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 5487–5494 (0.2 KB)
- **Files**: src/components/flashcards/flashcard-rich-content.tsx

### `.nn-flashcard-rich figure`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 5495–5497 (0.1 KB)
- **Files**: src/components/flashcards/flashcard-rich-content.tsx

### `.nn-flashcard-rich figcaption`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 5498–5503 (0.1 KB)
- **Files**: src/components/flashcards/flashcard-rich-content.tsx

### `.nn-rationale-key-point`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5505–5512 (0.2 KB)
- **Files**: src/components/student/premium-rationale-panel.tsx

### `.nn-rationale-key-point__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5514–5524 (0.2 KB)
- **Files**: src/components/student/premium-rationale-panel.tsx

### `.nn-rationale-key-point__icon`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5526–5531 (0.1 KB)
- **Files**: src/components/student/premium-rationale-panel.tsx

### `.nn-rationale-key-point__body`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5533–5539 (0.2 KB)
- **Files**: src/components/student/premium-rationale-panel.tsx

### `.nn-question-options-label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5541–5548 (0.2 KB)
- **Files**: src/components/student/exam-practice-client.tsx, src/components/student/freemium-question-peek.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-qopt-surface`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5551–5564 (0.5 KB)
- **Files**: src/components/study/cat-question-card.tsx, src/components/student/exam-practice-client.tsx, src/components/student/freemium-question-peek.tsx, src/components/student/practice-question-session-client.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-qopt-surface--interactive:hover:not(:disabled)`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5572–5578 (0.4 KB)
- **Files**: src/components/student/exam-practice-client.tsx, src/components/student/freemium-question-peek.tsx, src/components/student/practice-question-session-client.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-qopt-surface--selected`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5599–5605 (0.4 KB)
- **Files**: src/components/student/exam-practice-client.tsx, src/components/student/freemium-question-peek.tsx, src/components/student/practice-question-session-client.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-qopt-surface--highlight`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5607–5611 (0.3 KB)
- **Files**: src/components/student/question-bank-practice-client.tsx

### `.nn-qopt-surface--correct`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5613–5616 (0.1 KB)
- **Files**: src/components/student/freemium-question-peek.tsx, src/components/student/practice-question-session-client.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-qopt-surface--incorrect`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5618–5621 (0.2 KB)
- **Files**: src/components/student/freemium-question-peek.tsx, src/components/student/practice-question-session-client.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-qopt-surface--dim`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5632–5634 (0.0 KB)
- **Files**: src/components/student/freemium-question-peek.tsx, src/components/student/practice-question-session-client.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-qopt-letter`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5637–5656 (0.6 KB)
- **Files**: src/components/student/question-choice-letter.tsx

### `.nn-qopt-surface--selected .nn-qopt-letter`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5658–5662 (0.2 KB)
- **Files**: src/components/student/exam-practice-client.tsx, src/components/student/freemium-question-peek.tsx, src/components/student/practice-question-session-client.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-qopt-surface--correct .nn-qopt-letter`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5664–5668 (0.2 KB)
- **Files**: src/components/student/freemium-question-peek.tsx, src/components/student/practice-question-session-client.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-qopt-surface--incorrect .nn-qopt-letter`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5670–5674 (0.3 KB)
- **Files**: src/components/student/freemium-question-peek.tsx, src/components/student/practice-question-session-client.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-qopt-surface--highlight .nn-qopt-letter`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5686–5689 (0.2 KB)
- **Files**: src/components/student/question-bank-practice-client.tsx

### `.nn-qopt-surface--interactive:focus-visible`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5691–5696 (0.2 KB)
- **Files**: src/components/student/exam-practice-client.tsx, src/components/student/freemium-question-peek.tsx, src/components/student/practice-question-session-client.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-qopt-surface--interactive:disabled`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5698–5701 (0.1 KB)
- **Files**: src/components/student/exam-practice-client.tsx, src/components/student/freemium-question-peek.tsx, src/components/student/practice-question-session-client.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-exam-session.nn-exam-session--immersive .nn-exam-session-sticky-chrome`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5752–5758 (0.2 KB)
- **Files**: src/components/exam/exam-session-shell.tsx, src/components/study/active-study-session.tsx, src/components/skeletons/hub-page-skeleton.tsx, src/components/student/learner-dashboard-page-shell.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-skeleton`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 5767–5771 (0.2 KB)
- **Files**: src/app/(marketing)/(default)/canada/new-grad/loading.tsx, src/app/(marketing)/(default)/us/new-grad/loading.tsx, src/app/(marketing)/(default)/allied/loading.tsx, src/app/(marketing)/loading.tsx, src/components/marketing/marketing-hero-carousel.tsx

### `.nn-skeleton-shimmer::after`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 5773–5785 (0.3 KB)
- **Files**: src/components/student/focus-today-strip.tsx, src/components/student/practice-question-session-client.tsx

### `.nn-qopt-tool`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5799–5812 (0.5 KB)
- **Files**: src/components/student/question-bank-practice-client.tsx

### `.nn-qopt-tool:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5814–5817 (0.2 KB)
- **Files**: src/components/student/question-bank-practice-client.tsx

### `.nn-qopt-tool--mark`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5819–5823 (0.2 KB)
- **Files**: src/components/student/question-bank-practice-client.tsx

### `.nn-question-rationale-card`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5825–5831 (0.3 KB)
- **Files**: src/components/student/cat-study-feedback-panel.tsx, src/components/student/premium-rationale-panel.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-question-rationale-card__verdict`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5833–5836 (0.1 KB)
- **Files**: src/components/student/cat-study-feedback-panel.tsx, src/components/student/premium-rationale-panel.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-question-rationale-card__verdict--ok`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5838–5840 (0.1 KB)
- **Files**: src/components/student/cat-study-feedback-panel.tsx, src/components/student/premium-rationale-panel.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-question-rationale-card__verdict--miss`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5842–5844 (0.1 KB)
- **Files**: src/components/student/cat-study-feedback-panel.tsx, src/components/student/premium-rationale-panel.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-question-rationale-card__body`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5854–5857 (0.1 KB)
- **Files**: src/components/student/cat-study-feedback-panel.tsx, src/components/student/premium-rationale-panel.tsx

### `.nn-rationale-prose`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5860–5865 (0.1 KB)
- **Files**: src/components/student/cat-study-feedback-panel.tsx, src/components/student/premium-rationale-panel.tsx

### `.nn-rationale-details summary .nn-rationale-chevron`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5867–5869 (0.1 KB)
- **Files**: src/components/student/premium-rationale-panel.tsx

### `.nn-rationale-details[open] summary .nn-rationale-chevron`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5871–5873 (0.1 KB)
- **Files**: src/components/student/premium-rationale-panel.tsx

### `.nn-question-nav-actions`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5875–5883 (0.2 KB)
- **Files**: src/components/student/exam-practice-client.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-question-nav-actions__next`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5924–5927 (0.1 KB)
- **Files**: src/components/student/exam-practice-client.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-exam-hub-conversion`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 5940–5952 (0.5 KB)
- **Files**: src/components/exam-pathways/exam-pathway-hub-study-modes.tsx

### `.nn-exam-hub-study-card`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 5954–5977 (0.8 KB)
- **Files**: src/components/marketing/nursing-tier-hub-page.tsx, src/components/marketing/allied-pathway-hub-cat-card.tsx, src/components/marketing/new-grad-work-area-hub.tsx, src/components/marketing/allied-health-pathway-hub.tsx, src/lib/marketing/exam-pathway-hub-premium-modules.ts

### `.nn-exam-hub-study-card:hover`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 5986–5990 (0.1 KB)
- **Files**: src/components/marketing/nursing-tier-hub-page.tsx, src/components/marketing/allied-pathway-hub-cat-card.tsx, src/components/marketing/new-grad-work-area-hub.tsx, src/components/marketing/allied-health-pathway-hub.tsx, src/lib/marketing/exam-pathway-hub-premium-modules.ts

### `.nn-exam-hub-study-card:focus-visible`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 5992–5995 (0.1 KB)
- **Files**: src/components/marketing/nursing-tier-hub-page.tsx, src/components/marketing/allied-pathway-hub-cat-card.tsx, src/components/marketing/new-grad-work-area-hub.tsx, src/components/marketing/allied-health-pathway-hub.tsx, src/lib/marketing/exam-pathway-hub-premium-modules.ts

### `.nn-exam-hub-study-card:focus:not(:focus-visible)`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 5997–5999 (0.1 KB)
- **Files**: src/components/marketing/nursing-tier-hub-page.tsx, src/components/marketing/allied-pathway-hub-cat-card.tsx, src/components/marketing/new-grad-work-area-hub.tsx, src/components/marketing/allied-health-pathway-hub.tsx, src/lib/marketing/exam-pathway-hub-premium-modules.ts

### `.nn-exam-hub-study-card--lessons`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6002–6010 (0.3 KB)
- **Files**: src/components/marketing/nursing-tier-hub-page.tsx, src/components/marketing/new-grad-work-area-hub.tsx, src/components/marketing/allied-health-pathway-hub.tsx, src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/pre-nursing/pre-nursing-marketing-hub-actions.tsx

### `.nn-exam-hub-study-card--featured`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6013–6022 (0.4 KB)
- **Files**: src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/ui/study-card.tsx

### `.nn-exam-hub-study-card--featured:hover`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6024–6029 (0.3 KB)
- **Files**: src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/ui/study-card.tsx

### `.nn-exam-hub-study-card--cat`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6032–6040 (0.3 KB)
- **Files**: src/components/marketing/nursing-tier-hub-page.tsx, src/components/marketing/allied-pathway-hub-cat-card.tsx, src/components/marketing/new-grad-work-area-hub.tsx, src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/study/cat-session-cards.tsx

### `.nn-exam-hub-study-card__icon`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6042–6053 (0.4 KB)
- **Files**: src/components/ui/study-card.tsx

### `.nn-exam-hub-study-card--featured .nn-exam-hub-study-card__icon`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6055–6058 (0.2 KB)
- **Files**: src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/ui/study-card.tsx

### `.nn-exam-hub-study-card--completed`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6071–6079 (0.3 KB)
- **Files**: src/components/ui/study-card.tsx

### `.nn-exam-hub-study-card--completed:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6081–6083 (0.1 KB)
- **Files**: src/components/ui/study-card.tsx

### `.nn-exam-hub-study-card--completed .nn-exam-hub-study-card__icon`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6085–6089 (0.3 KB)
- **Files**: src/components/ui/study-card.tsx

### `.nn-exam-hub-study-card--locked`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6092–6101 (0.3 KB)
- **Files**: src/components/ui/study-card.tsx

### `.nn-exam-hub-study-card--locked:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6103–6107 (0.1 KB)
- **Files**: src/components/ui/study-card.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-nursing-tier-hub-hero-band,`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6114–6126 (0.5 KB)
- **Files**: src/components/marketing/marketing-pathway-hub-hero-band.tsx, src/components/pathway-lessons/lessons-page-shell.tsx

### `.nn-premium-pathway-hub[data-nn-allied-pathway-hub="1"][data-nn-allied-hub-tone=`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6129–6131 (0.2 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx, src/components/marketing/nursing-tier-hub-page.tsx, src/components/marketing/new-grad-marketing-landing.tsx, src/components/marketing/new-grad-work-area-hub.tsx, src/components/marketing/allied-health-pathway-hub.tsx

### `.nn-premium-pathway-hub[data-nn-allied-pathway-hub="1"][data-nn-allied-hub-tone=`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6132–6134 (0.2 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx, src/components/marketing/nursing-tier-hub-page.tsx, src/components/marketing/new-grad-marketing-landing.tsx, src/components/marketing/new-grad-work-area-hub.tsx, src/components/marketing/allied-health-pathway-hub.tsx

### `.nn-premium-pathway-hub[data-nn-allied-pathway-hub="1"][data-nn-allied-hub-tone=`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6135–6137 (0.2 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx, src/components/marketing/nursing-tier-hub-page.tsx, src/components/marketing/new-grad-marketing-landing.tsx, src/components/marketing/new-grad-work-area-hub.tsx, src/components/marketing/allied-health-pathway-hub.tsx

### `.nn-premium-pathway-hub[data-nn-allied-pathway-hub="1"][data-nn-allied-hub-tone=`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6138–6140 (0.2 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx, src/components/marketing/nursing-tier-hub-page.tsx, src/components/marketing/new-grad-marketing-landing.tsx, src/components/marketing/new-grad-work-area-hub.tsx, src/components/marketing/allied-health-pathway-hub.tsx

### `.nn-premium-pathway-hub[data-nn-allied-pathway-hub="1"][data-nn-allied-hub-tone=`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6141–6143 (0.2 KB)
- **Files**: src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx, src/components/marketing/nursing-tier-hub-page.tsx, src/components/marketing/new-grad-marketing-landing.tsx, src/components/marketing/new-grad-work-area-hub.tsx, src/components/marketing/allied-health-pathway-hub.tsx

### `.nn-premium-pathway-hub--new-grad .nn-nursing-tier-hub-hero-band`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6146–6148 (0.2 KB)
- **Files**: src/components/marketing/nursing-tier-hub-page.tsx, src/components/marketing/new-grad-marketing-landing.tsx, src/components/marketing/new-grad-work-area-hub.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-conversion`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6150–6159 (0.5 KB)
- **Files**: src/components/exam-pathways/exam-pathway-hub-study-modes.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6161–6173 (0.5 KB)
- **Files**: src/components/marketing/nursing-tier-hub-page.tsx, src/components/marketing/allied-pathway-hub-cat-card.tsx, src/components/marketing/new-grad-work-area-hub.tsx, src/components/marketing/allied-health-pathway-hub.tsx, src/lib/marketing/exam-pathway-hub-premium-modules.ts

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card:hover`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6175–6181 (0.2 KB)
- **Files**: src/components/marketing/nursing-tier-hub-page.tsx, src/components/marketing/allied-pathway-hub-cat-card.tsx, src/components/marketing/new-grad-work-area-hub.tsx, src/components/marketing/allied-health-pathway-hub.tsx, src/lib/marketing/exam-pathway-hub-premium-modules.ts

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--lessons`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6187–6199 (0.4 KB)
- **Files**: src/components/marketing/nursing-tier-hub-page.tsx, src/components/marketing/new-grad-work-area-hub.tsx, src/components/marketing/allied-health-pathway-hub.tsx, src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/pre-nursing/pre-nursing-marketing-hub-actions.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--lessons:hover`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6201–6211 (0.5 KB)
- **Files**: src/components/marketing/nursing-tier-hub-page.tsx, src/components/marketing/new-grad-work-area-hub.tsx, src/components/marketing/allied-health-pathway-hub.tsx, src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/pre-nursing/pre-nursing-marketing-hub-actions.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--featured`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6213–6225 (0.5 KB)
- **Files**: src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/ui/study-card.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--featured:hover`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6227–6233 (0.4 KB)
- **Files**: src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/ui/study-card.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--cat`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6235–6247 (0.5 KB)
- **Files**: src/components/marketing/nursing-tier-hub-page.tsx, src/components/marketing/allied-pathway-hub-cat-card.tsx, src/components/marketing/new-grad-work-area-hub.tsx, src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/study/cat-session-cards.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--cat:hover`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6249–6259 (0.5 KB)
- **Files**: src/components/marketing/nursing-tier-hub-page.tsx, src/components/marketing/allied-pathway-hub-cat-card.tsx, src/components/marketing/new-grad-work-area-hub.tsx, src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/study/cat-session-cards.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--featured.nn-exam-h`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6270–6282 (0.5 KB)
- **Files**: src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/ui/study-card.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--featured.nn-exam-h`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6284–6295 (0.6 KB)
- **Files**: src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/ui/study-card.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--featured.nn-exam-h`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6297–6309 (0.5 KB)
- **Files**: src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/ui/study-card.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--featured.nn-exam-h`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6311–6322 (0.6 KB)
- **Files**: src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/ui/study-card.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--featured.nn-exam-h`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6324–6336 (0.5 KB)
- **Files**: src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/ui/study-card.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--featured.nn-exam-h`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6338–6349 (0.6 KB)
- **Files**: src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/ui/study-card.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--featured.nn-exam-h`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6351–6363 (0.5 KB)
- **Files**: src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/ui/study-card.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--featured.nn-exam-h`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6365–6376 (0.6 KB)
- **Files**: src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/ui/study-card.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--featured.nn-exam-h`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6378–6390 (0.5 KB)
- **Files**: src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/ui/study-card.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--featured.nn-exam-h`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6392–6403 (0.6 KB)
- **Files**: src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/ui/study-card.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--featured.nn-exam-h`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6405–6409 (0.3 KB)
- **Files**: src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/ui/study-card.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--featured.nn-exam-h`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6411–6415 (0.3 KB)
- **Files**: src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/ui/study-card.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--featured.nn-exam-h`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6417–6421 (0.4 KB)
- **Files**: src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/ui/study-card.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--featured.nn-exam-h`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6423–6431 (0.4 KB)
- **Files**: src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/ui/study-card.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--featured.nn-exam-h`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6433–6441 (0.5 KB)
- **Files**: src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/ui/study-card.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--lessons .nn-exam-h`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6444–6448 (0.3 KB)
- **Files**: src/components/marketing/nursing-tier-hub-page.tsx, src/components/marketing/new-grad-work-area-hub.tsx, src/components/marketing/allied-health-pathway-hub.tsx, src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/pre-nursing/pre-nursing-marketing-hub-actions.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--cat .nn-exam-hub-s`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6450–6458 (0.4 KB)
- **Files**: src/components/marketing/nursing-tier-hub-page.tsx, src/components/marketing/allied-pathway-hub-cat-card.tsx, src/components/marketing/new-grad-work-area-hub.tsx, src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/study/cat-session-cards.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card__icon`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6460–6464 (0.3 KB)
- **Files**: src/components/ui/study-card.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-exam-hub-study-card--featured .nn-exam-`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 6466–6473 (0.4 KB)
- **Files**: src/lib/marketing/exam-pathway-hub-premium-modules.ts, src/components/ui/study-card.tsx

### `[data-nn-nursing-tier-hub="surface"] .nn-nursing-tier-hub-lesson-progress-track`
- **Classification**: MARKETING_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6475–6477 (0.2 KB)
- **Files**: src/components/exam-pathways/exam-pathway-hub-study-modes.tsx

### `.nn-study-card--completed`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6480–6483 (0.1 KB)
- **Files**: src/components/ui/study-card.tsx

### `.nn-study-card--locked`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6486–6492 (0.3 KB)
- **Files**: src/components/ui/study-card.tsx

### `.nn-card--completed`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 6495–6497 (0.1 KB)
- **Files**: src/components/ui/study-card.tsx, src/components/student/product/lesson-card.tsx

### `.nn-card--locked`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 6500–6505 (0.3 KB)
- **Files**: src/components/ui/study-card.tsx

### `.nn-exam-session.nn-exam-session--neutral`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6523–6529 (0.3 KB)
- **Files**: src/components/exam/exam-session-shell.tsx, src/components/study/active-study-session.tsx, src/components/skeletons/hub-page-skeleton.tsx, src/components/student/learner-dashboard-page-shell.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-exam-session.nn-exam-session--immersive`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6532–6535 (0.1 KB)
- **Files**: src/components/exam/exam-session-shell.tsx, src/components/study/active-study-session.tsx, src/components/skeletons/hub-page-skeleton.tsx, src/components/student/learner-dashboard-page-shell.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-question-type-chip`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6537–6550 (0.5 KB)
- **Files**: src/components/student/exam-practice-client.tsx, src/components/student/practice-question-session-client.tsx, src/components/student/question-bank-practice-client.tsx

### `.dark .nn-exam-session.nn-exam-session--neutral`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6552–6556 (0.2 KB)
- **Files**: src/components/exam/exam-session-shell.tsx, src/components/study/active-study-session.tsx, src/components/skeletons/hub-page-skeleton.tsx, src/components/student/learner-dashboard-page-shell.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-rationale-segment`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6570–6576 (0.3 KB)
- **Files**: src/components/student/premium-rationale-panel.tsx

### `.nn-rationale-segment--distractors`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6578–6581 (0.2 KB)
- **Files**: src/components/student/premium-rationale-panel.tsx

### `.nn-rationale-segment__title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6583–6590 (0.2 KB)
- **Files**: src/components/student/premium-rationale-panel.tsx

### `.nn-skeleton`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 6615–6620 (0.2 KB)
- **Files**: src/app/(marketing)/(default)/canada/new-grad/loading.tsx, src/app/(marketing)/(default)/us/new-grad/loading.tsx, src/app/(marketing)/(default)/allied/loading.tsx, src/app/(marketing)/loading.tsx, src/components/marketing/marketing-hero-carousel.tsx

### `.nn-skeleton::after`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 6622–6634 (0.3 KB)
- **Files**: src/app/(marketing)/(default)/canada/new-grad/loading.tsx, src/app/(marketing)/(default)/us/new-grad/loading.tsx, src/app/(marketing)/(default)/allied/loading.tsx, src/app/(marketing)/loading.tsx, src/components/marketing/marketing-hero-carousel.tsx

### `.nn-dashboard-empty-cta`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 6667–6686 (0.8 KB)
- **Files**: none found

### `.nn-dashboard-empty-cta:hover:not(:active)`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 6688–6693 (0.3 KB)
- **Files**: none found

### `.nn-dashboard-empty-cta:active`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 6695–6698 (0.2 KB)
- **Files**: none found

### `.nn-cat-exam-header`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6749–6753 (0.1 KB)
- **Files**: none found

### `.nn-cat-exam-header__row`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6761–6767 (0.1 KB)
- **Files**: none found

### `.nn-cat-exam-progress`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6770–6775 (0.2 KB)
- **Files**: none found

### `.nn-cat-exam-progress-fill`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6777–6781 (0.2 KB)
- **Files**: none found

### `.nn-cat-exam-body`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6790–6794 (0.1 KB)
- **Files**: none found

### `.nn-cat-exam-topic-meta`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6809–6821 (0.3 KB)
- **Files**: none found

### `.nn-cat-exam-topic-meta__topic`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6823–6826 (0.1 KB)
- **Files**: none found

### `.nn-cat-exam-stem`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6829–6836 (0.2 KB)
- **Files**: src/components/study/cat-question-card.tsx

### `.nn-cat-exam-options-label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6847–6854 (0.2 KB)
- **Files**: none found

### `.nn-cat-exam-session .nn-qopt-surface`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6861–6865 (0.2 KB)
- **Files**: none found

### `.nn-cat-exam-session .nn-qopt-surface--interactive:hover:not(:disabled)`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6867–6872 (0.3 KB)
- **Files**: none found

### `.nn-cat-exam-session .nn-qopt-letter`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6881–6884 (0.1 KB)
- **Files**: none found

### `.nn-cat-exam-session .nn-qopt-list`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6887–6889 (0.1 KB)
- **Files**: none found

### `.nn-cat-exam-nav`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6898–6907 (0.2 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-nav__flag`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6910–6912 (0.0 KB)
- **Files**: none found

### `.nn-cat-exam-timing-alert`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6915–6924 (0.3 KB)
- **Files**: src/components/student/practice-test-runner/practice-test-runner-board-parts.tsx

### `.nn-cat-study-rationale-col`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6927–6930 (0.1 KB)
- **Files**: none found

### `.nn-practice-session-header`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6945–6949 (0.2 KB)
- **Files**: none found

### `.nn-practice-session-header__row`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6957–6963 (0.2 KB)
- **Files**: none found

### `.nn-practice-session-progress-bar`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6971–6976 (0.2 KB)
- **Files**: none found

### `.nn-practice-session-progress-fill`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6978–6986 (0.2 KB)
- **Files**: none found

### `.nn-practice-content-grid`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 6989–6992 (0.1 KB)
- **Files**: none found

### `.nn-practice-question-col`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7001–7003 (0.1 KB)
- **Files**: none found

### `.nn-practice-rationale-col`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7018–7021 (0.1 KB)
- **Files**: none found

### `.nn-practice-rationale-panel`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7031–7044 (0.4 KB)
- **Files**: src/components/study/practice-rationale-panel.tsx

### `.nn-practice-rationale-panel__scroll`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7046–7056 (0.2 KB)
- **Files**: src/components/study/practice-rationale-panel.tsx

### `.nn-practice-verdict-banner`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7065–7071 (0.1 KB)
- **Files**: src/components/study/practice-rationale-panel.tsx

### `.nn-practice-verdict-banner--correct`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7073–7076 (0.2 KB)
- **Files**: src/components/study/practice-rationale-panel.tsx

### `.nn-practice-verdict-banner--incorrect`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7078–7081 (0.2 KB)
- **Files**: src/components/study/practice-rationale-panel.tsx

### `.nn-practice-rationale-section`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7084–7090 (0.2 KB)
- **Files**: src/components/study/practice-rationale-panel.tsx

### `.nn-practice-rationale-section--success`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7092–7095 (0.2 KB)
- **Files**: src/components/study/practice-rationale-panel.tsx

### `.nn-practice-rationale-section--info`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7097–7100 (0.2 KB)
- **Files**: src/components/study/practice-rationale-panel.tsx

### `.nn-practice-rationale-section--warning`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7102–7105 (0.2 KB)
- **Files**: none found

### `.nn-practice-rationale-section--brand`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7107–7110 (0.2 KB)
- **Files**: src/components/study/practice-rationale-panel.tsx

### `.nn-practice-rationale-section--muted`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7112–7114 (0.1 KB)
- **Files**: none found

### `.nn-practice-rationale-section__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7116–7126 (0.3 KB)
- **Files**: src/components/study/practice-rationale-panel.tsx

### `.nn-practice-rationale-section--success .nn-practice-rationale-section__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7128–7130 (0.1 KB)
- **Files**: src/components/study/practice-rationale-panel.tsx

### `.nn-practice-rationale-section--info .nn-practice-rationale-section__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7132–7134 (0.1 KB)
- **Files**: src/components/study/practice-rationale-panel.tsx

### `.nn-practice-rationale-section--warning .nn-practice-rationale-section__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7136–7138 (0.1 KB)
- **Files**: none found

### `.nn-practice-rationale-section--brand .nn-practice-rationale-section__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7140–7142 (0.2 KB)
- **Files**: src/components/study/practice-rationale-panel.tsx

### `.nn-practice-rationale-section__body`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7144–7151 (0.2 KB)
- **Files**: src/components/study/practice-rationale-panel.tsx

### `.nn-practice-rationale-placeholder`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7154–7165 (0.3 KB)
- **Files**: src/components/study/practice-rationale-panel.tsx

### `.nn-practice-topic-chip`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7168–7179 (0.4 KB)
- **Files**: none found

### `.nn-teaching-section`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7193–7199 (0.3 KB)
- **Files**: src/components/student/teaching-breakdown.tsx

### `.nn-teaching-section--correct`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7202–7205 (0.2 KB)
- **Files**: src/components/student/teaching-breakdown.tsx

### `.nn-teaching-section--takeaway`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7208–7211 (0.2 KB)
- **Files**: src/components/student/teaching-breakdown.tsx

### `.nn-teaching-section--distractors`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7214–7217 (0.2 KB)
- **Files**: src/components/student/teaching-breakdown.tsx

### `.nn-teaching-section--tip`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7220–7224 (0.2 KB)
- **Files**: src/components/student/teaching-breakdown.tsx

### `.nn-teaching-section--trap`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7227–7230 (0.2 KB)
- **Files**: src/components/student/teaching-breakdown.tsx

### `.nn-teaching-section--memory`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7233–7236 (0.2 KB)
- **Files**: src/components/student/teaching-breakdown.tsx

### `.nn-teaching-section__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7238–7248 (0.2 KB)
- **Files**: src/components/student/teaching-breakdown.tsx

### `.nn-teaching-section--correct .nn-teaching-section__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7250–7252 (0.1 KB)
- **Files**: src/components/student/teaching-breakdown.tsx

### `.nn-teaching-section--takeaway .nn-teaching-section__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7254–7256 (0.1 KB)
- **Files**: src/components/student/teaching-breakdown.tsx

### `.nn-teaching-section--distractors .nn-teaching-section__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7258–7260 (0.1 KB)
- **Files**: src/components/student/teaching-breakdown.tsx

### `.nn-teaching-section--tip .nn-teaching-section__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7262–7265 (0.2 KB)
- **Files**: src/components/student/teaching-breakdown.tsx

### `.nn-teaching-section--trap .nn-teaching-section__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7267–7269 (0.1 KB)
- **Files**: src/components/student/teaching-breakdown.tsx

### `.nn-teaching-section__body`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7271–7277 (0.2 KB)
- **Files**: src/components/student/teaching-breakdown.tsx

### `.nn-session-score-hero`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7283–7294 (0.5 KB)
- **Files**: src/components/student/question-session-study-loop-panel.tsx

### `.nn-session-stat-grid`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7302–7307 (0.1 KB)
- **Files**: src/components/student/question-session-study-loop-panel.tsx

### `.nn-session-stat-card`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7315–7322 (0.3 KB)
- **Files**: src/components/student/question-session-study-loop-panel.tsx

### `.nn-session-stat-card--correct`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7324–7327 (0.2 KB)
- **Files**: src/components/student/question-session-study-loop-panel.tsx

### `.nn-session-stat-card--wrong`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7329–7332 (0.2 KB)
- **Files**: src/components/student/question-session-study-loop-panel.tsx

### `.nn-confidence-row`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7338–7343 (0.1 KB)
- **Files**: src/components/student/question-bank-practice-client.tsx

### `.nn-confidence-chip`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7345–7359 (0.5 KB)
- **Files**: src/components/study/confidence-analytics.tsx, src/components/study/confidence-selector.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-confidence-chip:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7361–7365 (0.2 KB)
- **Files**: src/components/study/confidence-analytics.tsx, src/components/study/confidence-selector.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-confidence-chip--low.nn-confidence-chip--selected`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7367–7371 (0.3 KB)
- **Files**: none found

### `.nn-confidence-chip--medium.nn-confidence-chip--selected`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7373–7377 (0.3 KB)
- **Files**: none found

### `.nn-confidence-chip--high.nn-confidence-chip--selected`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7379–7383 (0.3 KB)
- **Files**: none found

### `.nn-qbank-skeleton`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 7389–7395 (0.2 KB)
- **Files**: src/components/student/question-bank-practice-client.tsx

### `.nn-qbank-skeleton__bar`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 7397–7402 (0.2 KB)
- **Files**: src/components/student/question-bank-practice-client.tsx

### `.nn-qbank-skeleton__bar::after`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 7404–7416 (0.3 KB)
- **Files**: src/components/student/question-bank-practice-client.tsx

### `.nn-cat-session`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7430–7435 (0.2 KB)
- **Files**: src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-session.nn-exam-variant--nclex`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7437–7439 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-session.nn-exam-variant--rex`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7441–7443 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-session.nn-exam-variant--np`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7445–7447 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-top-bar`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7451–7454 (0.1 KB)
- **Files**: none found

### `.nn-cat-top-bar__row`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7456–7463 (0.1 KB)
- **Files**: none found

### `.nn-cat-top-bar__counter`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7465–7470 (0.1 KB)
- **Files**: none found

### `.nn-cat-top-bar__exam-name`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7472–7479 (0.2 KB)
- **Files**: none found

### `.nn-cat-top-bar__meta`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7481–7484 (0.1 KB)
- **Files**: none found

### `.nn-cat-top-bar__right`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7486–7491 (0.1 KB)
- **Files**: none found

### `.nn-cat-top-bar__pct`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7493–7497 (0.1 KB)
- **Files**: none found

### `.nn-cat-top-bar__progress`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7500–7505 (0.2 KB)
- **Files**: none found

### `.nn-cat-top-bar__progress-fill`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7507–7511 (0.1 KB)
- **Files**: none found

### `.nn-cat-grid`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7521–7526 (0.1 KB)
- **Files**: none found

### `.nn-cat-exam-chrome .nn-cat-exam-col`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7541–7545 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-chrome`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7548–7551 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-board-top,`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7554–7557 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner/practice-test-runner-board-parts.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-board-footer.nn-premium-cat-adaptive-footer`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7560–7563 (0.2 KB)
- **Files**: src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner/practice-test-runner-board-parts.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-board-frame`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7565–7567 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-content-well`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7569–7571 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-board-progress`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7573–7575 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-category-label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7577–7584 (0.2 KB)
- **Files**: src/components/study/cat-question-card.tsx

### `.nn-cat-exam-navigator-dialog::backdrop`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7586–7588 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-topbar`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7590–7596 (0.2 KB)
- **Files**: src/components/exam/exam-session-shell.tsx

### `.nn-cat-exam-chrome .nn-exam-progress--cat-exam-adaptive`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7608–7614 (0.3 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-chrome .nn-exam-progress--cat-exam-adaptive > div:first-child`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7616–7618 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-chrome .nn-exam-progress--cat-exam-adaptive .nn-marketing-caption`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7620–7623 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-chrome .nn-exam-progress--cat-exam-adaptive .nn-progress-fill-revea`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7625–7627 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-question-card--exam-stack .nn-cat-question-card__exam-scroll`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7629–7635 (0.4 KB)
- **Files**: src/components/study/cat-question-card.test.tsx, src/components/study/cat-question-card.tsx, src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-chrome .nn-cat-session.nn-cat-session--exam-single`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7654–7656 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-question-session.nn-question-session--single`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7658–7661 (0.2 KB)
- **Files**: src/components/exam/session-split-rationale-aside.tsx, src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/exam-practice-client.tsx, src/components/student/practice-test-runner/practice-test-runner-board-parts.tsx, src/components/student/freemium-question-peek.tsx

### `.nn-cat-exam-chrome .nn-cat-session.nn-cat-session--exam-single .nn-cat-exam-col`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7670–7673 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-question-card.nn-cat-question-card--exam-stack`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7683–7687 (0.1 KB)
- **Files**: src/components/study/cat-question-card.test.tsx, src/components/study/cat-question-card.tsx, src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-question-card--exam-stack .nn-cat-question-stem,`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7695–7704 (0.3 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-question-card--exam-stack .nn-cat-topic-meta`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7713–7717 (0.1 KB)
- **Files**: src/components/study/cat-question-card.test.tsx, src/components/study/cat-question-card.tsx, src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-question-card--exam-stack .nn-cat-exam-timing-alert`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7719–7721 (0.1 KB)
- **Files**: src/components/study/cat-question-card.test.tsx, src/components/study/cat-question-card.tsx, src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-question-card--exam-stack .nn-cat-options-label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7723–7727 (0.1 KB)
- **Files**: src/components/study/cat-question-card.test.tsx, src/components/study/cat-question-card.tsx, src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-chrome .nn-cat-session.nn-cat-session--exam-single .nn-cat-opt__tex`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7729–7733 (0.1 KB)
- **Files**: src/components/study/cat-question-card.test.tsx, src/components/study/cat-question-card.tsx, src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-chrome .nn-cat-session.nn-cat-session--exam-single .nn-cat-opt-list`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7735–7738 (0.1 KB)
- **Files**: src/components/study/cat-question-card.test.tsx, src/components/study/cat-question-card.tsx, src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-chrome .nn-cat-session.nn-cat-session--exam-single .nn-cat-opt,`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7740–7749 (0.2 KB)
- **Files**: src/components/study/cat-question-card.test.tsx, src/components/study/cat-question-card.tsx, src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-question-card--exam-stack .nn-cat-opt--interactive:hover:not(:disabled)`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7751–7753 (0.2 KB)
- **Files**: src/components/study/cat-question-card.test.tsx, src/components/study/cat-question-card.tsx, src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-question-card--exam-stack .nn-cat-opt--selected,`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7755–7763 (0.4 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-question-card--exam-stack .nn-cat-opt--selected .nn-cat-opt__text,`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7765–7768 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-question-card--exam-stack .nn-cat-opt--dim,`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7770–7777 (0.3 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-question-card--exam-stack .nn-cat-opt:disabled,`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7779–7788 (0.3 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-question-card--exam-stack .nn-cat-opt__letter`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7790–7794 (0.1 KB)
- **Files**: src/components/study/cat-question-card.test.tsx, src/components/study/cat-question-card.tsx, src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-question-card--exam-stack .nn-cat-opt--interactive:focus-visible,`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7796–7802 (0.2 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-question-card--exam-stack .nn-cat-question-card__exam-footer--anchored`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7805–7811 (0.4 KB)
- **Files**: src/components/study/cat-question-card.test.tsx, src/components/study/cat-question-card.tsx, src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-question-card--exam-stack .nn-cat-question-nav`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7814–7828 (0.4 KB)
- **Files**: src/components/study/cat-question-card.test.tsx, src/components/study/cat-question-card.tsx, src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-question-card--exam-stack .nn-btn-primary`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7830–7833 (0.1 KB)
- **Files**: src/components/study/cat-question-card.test.tsx, src/components/study/cat-question-card.tsx, src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-chrome.nn-cat-adaptive-exam-session .nn-exam-progress--cat-exam-ada`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7992–7995 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-chrome.nn-cat-adaptive-exam-session .nn-exam-progress--cat-exam-ada`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 7997–7999 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-chrome.nn-cat-adaptive-exam-session .nn-cat-exam-col`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8001–8004 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-chrome.nn-cat-adaptive-exam-session .nn-cat-exam-item-head`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8006–8008 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-chrome.nn-cat-adaptive-exam-session .nn-cat-exam-timing-alert`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8010–8012 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-chrome.nn-cat-adaptive-exam-session .nn-cat-exam-stem-scroll .nn-ca`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8014–8016 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-chrome.nn-cat-adaptive-exam-session .nn-cat-exam-post-stem .nn-cat-`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8018–8020 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-chrome.nn-cat-adaptive-exam-session .nn-cat-exam-post-stem .nn-cat-`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8022–8024 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-chrome.nn-cat-adaptive-exam-session .nn-cat-exam-post-stem .nn-cat-`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8026–8029 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-chrome.nn-cat-adaptive-exam-session .nn-cat-exam-post-stem .nn-cat-`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8031–8035 (0.2 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-exam-chrome.nn-cat-adaptive-exam-session .nn-cat-exam-board-footer--adap`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8037–8039 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-client.tsx

### `.nn-cat-question-card__exam-scroll--partitioned`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8115–8117 (0.1 KB)
- **Files**: src/components/study/cat-question-card.tsx

### `.nn-cat-question-card__exam-scroll--partitioned .nn-cat-exam-stem-scroll`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8120–8123 (0.1 KB)
- **Files**: src/components/study/cat-question-card.tsx

### `.nn-cat-question-card`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8139–8147 (0.2 KB)
- **Files**: src/components/study/cat-question-card.test.tsx, src/components/study/cat-question-card.tsx, src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-topic-meta`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8156–8165 (0.2 KB)
- **Files**: src/components/study/cat-question-card.tsx

### `.nn-cat-topic-meta__name`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8167–8170 (0.1 KB)
- **Files**: src/components/study/cat-question-card.tsx

### `.nn-cat-question-stem`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8173–8184 (0.3 KB)
- **Files**: src/components/study/cat-question-card.tsx

### `.nn-cat-options-label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8194–8201 (0.2 KB)
- **Files**: src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner/practice-test-runner-board-parts.tsx

### `.nn-cat-opt-list`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8206–8213 (0.1 KB)
- **Files**: src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner/practice-test-runner-board-parts.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-opt`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8216–8233 (0.4 KB)
- **Files**: src/components/study/cat-question-card.test.tsx, src/components/study/cat-question-card.tsx, src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner/practice-test-runner-board-parts.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-opt:disabled`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8235–8237 (0.0 KB)
- **Files**: src/components/study/cat-question-card.test.tsx, src/components/study/cat-question-card.tsx, src/components/student/practice-test-runner-shell-interactions.test.tsx, src/components/student/practice-test-runner/practice-test-runner-board-parts.tsx, src/components/student/practice-test-runner-client.tsx

### `.nn-cat-opt--interactive:hover:not(:disabled)`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8240–8244 (0.3 KB)
- **Files**: src/components/study/cat-question-card.tsx

### `.nn-cat-opt--selected`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8247–8251 (0.3 KB)
- **Files**: src/components/study/cat-question-card.tsx

### `.nn-cat-opt--correct`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8254–8259 (0.3 KB)
- **Files**: src/components/study/cat-question-card.tsx

### `.nn-cat-opt--incorrect`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8262–8265 (0.2 KB)
- **Files**: src/components/study/cat-question-card.tsx

### `.nn-cat-opt--dim`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8276–8278 (0.0 KB)
- **Files**: src/components/study/cat-question-card.tsx

### `.nn-cat-opt__letter`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8281–8300 (0.5 KB)
- **Files**: src/components/study/cat-question-card.test.tsx, src/components/study/cat-question-card.tsx

### `.nn-cat-opt--selected .nn-cat-opt__letter`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8302–8306 (0.2 KB)
- **Files**: src/components/study/cat-question-card.tsx

### `.nn-cat-opt--correct .nn-cat-opt__letter`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8308–8312 (0.3 KB)
- **Files**: src/components/study/cat-question-card.tsx

### `.nn-cat-opt--correct .nn-cat-opt__control,`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8314–8318 (0.2 KB)
- **Files**: src/components/study/cat-question-card.tsx

### `.nn-cat-opt--incorrect .nn-cat-opt__letter`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8320–8324 (0.3 KB)
- **Files**: src/components/study/cat-question-card.tsx

### `.nn-cat-opt__text`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8327–8335 (0.2 KB)
- **Files**: src/components/study/cat-question-card.tsx

### `.nn-cat-opt--interactive:focus-visible`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8338–8343 (0.2 KB)
- **Files**: src/components/study/cat-question-card.tsx

### `.nn-cat-opt__control`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8345–8354 (0.3 KB)
- **Files**: src/components/study/cat-question-card.tsx

### `.nn-cat-opt__control--checked`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8356–8359 (0.2 KB)
- **Files**: src/components/study/cat-question-card.tsx

### `.nn-cat-opt--multi .nn-cat-opt__control`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8362–8368 (0.1 KB)
- **Files**: src/components/study/cat-question-card.tsx

### `.nn-cat-opt--multi .nn-cat-opt__control--checked::after`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8370–8381 (0.3 KB)
- **Files**: src/components/study/cat-question-card.tsx

### `.nn-cat-rationale-card`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8392–8403 (0.4 KB)
- **Files**: none found

### `.nn-cat-rationale-section`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8414–8418 (0.1 KB)
- **Files**: none found

### `.nn-cat-rationale-section:last-child`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8420–8424 (0.1 KB)
- **Files**: none found

### `.nn-cat-rationale-section__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8426–8433 (0.2 KB)
- **Files**: none found

### `.nn-cat-rationale-section__body`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8435–8439 (0.1 KB)
- **Files**: none found

### `.nn-cat-rationale-section--takeaway`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8442–8449 (0.2 KB)
- **Files**: none found

### `.nn-cat-rationale-placeholder`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8452–8461 (0.2 KB)
- **Files**: none found

### `.nn-cat-rationale-placeholder__icon`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8463–8468 (0.1 KB)
- **Files**: none found

### `.nn-cat-rationale-placeholder__title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8470–8474 (0.1 KB)
- **Files**: none found

### `.nn-cat-rationale-placeholder__body`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8476–8480 (0.1 KB)
- **Files**: none found

### `.nn-cat-question-nav`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8483–8491 (0.2 KB)
- **Files**: none found

### `.nn-cat-question-nav__flag`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8493–8495 (0.1 KB)
- **Files**: none found

### `.nn-cat-results`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8512–8516 (0.1 KB)
- **Files**: src/components/study/cat-upgrade-card.tsx, src/components/study/cat-readiness-trend.tsx, src/components/study/cat-topic-impact.tsx, src/components/study/cat-guided-next-steps.tsx, src/components/study/cat-next-steps.tsx

### `.nn-cat-results__score-block`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8525–8531 (0.2 KB)
- **Files**: none found

### `.nn-cat-results__score-value`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8533–8539 (0.2 KB)
- **Files**: none found

### `.nn-cat-results__score-label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8541–8545 (0.1 KB)
- **Files**: none found

### `.nn-cat-results__cards`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8548–8553 (0.1 KB)
- **Files**: src/components/study/cat-readiness-cards.tsx

### `.nn-cat-perf-card`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8569–8575 (0.3 KB)
- **Files**: src/components/study/cat-results-summary.tsx

### `.nn-cat-perf-card:nth-child(2)`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8576–8576 (0.1 KB)
- **Files**: src/components/study/cat-results-summary.tsx

### `.nn-cat-perf-card:nth-child(3)`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8577–8577 (0.1 KB)
- **Files**: src/components/study/cat-results-summary.tsx

### `.nn-cat-perf-card:nth-child(4)`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8578–8578 (0.1 KB)
- **Files**: src/components/study/cat-results-summary.tsx

### `.nn-cat-perf-card__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8585–8591 (0.2 KB)
- **Files**: src/components/study/cat-results-summary.tsx

### `.nn-cat-perf-card__value`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8593–8600 (0.2 KB)
- **Files**: src/components/study/cat-results-summary.tsx

### `.nn-cat-perf-card__sub`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8602–8606 (0.1 KB)
- **Files**: src/components/study/cat-results-summary.tsx

### `.nn-cat-results__section`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8609–8611 (0.0 KB)
- **Files**: src/components/study/cat-upgrade-card.tsx, src/components/study/cat-readiness-trend.tsx, src/components/study/cat-topic-impact.tsx, src/components/study/cat-guided-next-steps.tsx, src/components/study/cat-next-steps.tsx

### `.nn-cat-results__section-title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8613–8618 (0.1 KB)
- **Files**: src/components/study/cat-topic-impact.tsx, src/components/study/cat-guided-next-steps.tsx, src/components/study/cat-next-steps.tsx, src/components/study/cat-results-summary.tsx

### `.nn-results-header`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 8621–8623 (0.1 KB)
- **Files**: none found

### `.nn-cat-topic-row`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8631–8637 (0.1 KB)
- **Files**: src/components/study/cat-topic-impact.tsx, src/components/study/cat-results-summary.tsx

### `.nn-cat-topic-row:last-child`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8639–8641 (0.1 KB)
- **Files**: src/components/study/cat-topic-impact.tsx, src/components/study/cat-results-summary.tsx

### `.nn-cat-topic-row__name`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8643–8649 (0.1 KB)
- **Files**: src/components/study/cat-topic-impact.tsx, src/components/study/cat-results-summary.tsx

### `.nn-cat-topic-row__track`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8651–8658 (0.2 KB)
- **Files**: src/components/study/cat-topic-impact.tsx, src/components/study/cat-results-summary.tsx

### `.nn-cat-topic-row__fill`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8660–8665 (0.2 KB)
- **Files**: src/components/study/cat-topic-impact.tsx, src/components/study/cat-results-summary.tsx

### `.nn-cat-topic-row__pct`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8673–8679 (0.1 KB)
- **Files**: src/components/study/cat-results-summary.tsx

### `.nn-cat-results__next-steps`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8682–8687 (0.1 KB)
- **Files**: none found

### `.nn-cat-readiness-hero`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8697–8704 (0.3 KB)
- **Files**: src/components/study/cat-readiness-hero.tsx

### `.nn-cat-readiness-hero__score`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8717–8725 (0.2 KB)
- **Files**: src/components/study/cat-readiness-hero.tsx

### `.nn-cat-readiness-hero__score-label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8732–8737 (0.1 KB)
- **Files**: src/components/study/cat-readiness-hero.tsx

### `.nn-cat-readiness-hero__interpretation`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8739–8745 (0.2 KB)
- **Files**: src/components/study/cat-readiness-hero.tsx

### `.nn-cat-readiness-hero__cta`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8747–8753 (0.1 KB)
- **Files**: src/components/study/cat-readiness-hero.tsx

### `.nn-cat-readiness-badge`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8757–8767 (0.3 KB)
- **Files**: src/components/study/cat-readiness-hero.tsx

### `.nn-cat-readiness-badge--not-ready`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8774–8778 (0.2 KB)
- **Files**: src/components/study/cat-readiness-hero.tsx

### `.nn-cat-readiness-badge--building`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8780–8785 (0.3 KB)
- **Files**: src/components/study/cat-readiness-hero.tsx

### `.nn-cat-readiness-badge--approaching`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8787–8792 (0.3 KB)
- **Files**: src/components/study/cat-readiness-hero.tsx

### `.nn-cat-readiness-badge--exam-ready`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8794–8799 (0.3 KB)
- **Files**: src/components/study/cat-readiness-hero.tsx

### `.nn-cat-section-intro`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8803–8807 (0.1 KB)
- **Files**: src/components/study/cat-topic-impact.tsx

### `.nn-cat-section-weak`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8810–8817 (0.3 KB)
- **Files**: src/components/study/cat-topic-impact.tsx

### `.nn-cat-section-strength`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8820–8827 (0.3 KB)
- **Files**: src/components/study/cat-topic-impact.tsx

### `.nn-cat-topic-descriptor`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8830–8838 (0.2 KB)
- **Files**: src/components/study/cat-topic-impact.tsx

### `.nn-cat-topic-row__fill--muted`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8841–8843 (0.1 KB)
- **Files**: src/components/study/cat-topic-impact.tsx

### `.nn-cat-topic-row__fill--success`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8845–8847 (0.1 KB)
- **Files**: src/components/study/cat-topic-impact.tsx

### `.nn-cat-trend-card`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8851–8856 (0.2 KB)
- **Files**: src/components/study/cat-readiness-trend.tsx

### `.nn-cat-trend-card__title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8858–8863 (0.1 KB)
- **Files**: src/components/study/cat-readiness-trend.tsx

### `.nn-cat-trend-grid`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8865–8869 (0.1 KB)
- **Files**: src/components/study/cat-readiness-trend.tsx

### `.nn-cat-trend-stat__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8878–8884 (0.2 KB)
- **Files**: src/components/study/cat-readiness-trend.tsx

### `.nn-cat-trend-stat__value`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8886–8892 (0.1 KB)
- **Files**: src/components/study/cat-readiness-trend.tsx

### `.nn-cat-trend-stat__value--positive`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8894–8896 (0.1 KB)
- **Files**: src/components/study/cat-readiness-trend.tsx

### `.nn-cat-trend-stat__value--negative`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8898–8900 (0.1 KB)
- **Files**: src/components/study/cat-readiness-trend.tsx

### `.nn-cat-trend-empty`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8902–8906 (0.1 KB)
- **Files**: src/components/study/cat-readiness-trend.tsx

### `.nn-cat-next-steps-grid`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8910–8914 (0.1 KB)
- **Files**: src/components/study/cat-guided-next-steps.tsx, src/components/study/cat-next-steps.tsx

### `.nn-cat-next-step-card`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8922–8930 (0.2 KB)
- **Files**: src/components/study/cat-guided-next-steps.tsx, src/components/study/cat-next-steps.tsx

### `.nn-cat-next-step-card__num`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8932–8938 (0.2 KB)
- **Files**: src/components/study/cat-guided-next-steps.tsx, src/components/study/cat-next-steps.tsx

### `.nn-cat-next-step-card__title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8940–8945 (0.1 KB)
- **Files**: src/components/study/cat-guided-next-steps.tsx, src/components/study/cat-next-steps.tsx

### `.nn-cat-next-step-card__desc`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8947–8952 (0.1 KB)
- **Files**: src/components/study/cat-guided-next-steps.tsx, src/components/study/cat-next-steps.tsx

### `.nn-cat-next-step-card__action`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8954–8956 (0.1 KB)
- **Files**: src/components/study/cat-guided-next-steps.tsx, src/components/study/cat-next-steps.tsx

### `.nn-cat-upgrade-card`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8960–8971 (0.3 KB)
- **Files**: src/components/study/cat-upgrade-card.tsx

### `.nn-cat-upgrade-card__content`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8980–8983 (0.1 KB)
- **Files**: src/components/study/cat-upgrade-card.tsx

### `.nn-cat-upgrade-card__title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8985–8989 (0.1 KB)
- **Files**: src/components/study/cat-upgrade-card.tsx

### `.nn-cat-upgrade-card__body`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8991–8997 (0.1 KB)
- **Files**: src/components/study/cat-upgrade-card.tsx

### `.nn-cat-upgrade-card__actions`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 8999–9005 (0.1 KB)
- **Files**: src/components/study/cat-upgrade-card.tsx

### `.nn-practice-session`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9013–9022 (0.3 KB)
- **Files**: src/components/exam/learner-exam-chrome.tsx, src/components/study/practice-session-layout.tsx

### `.nn-practice-session.nn-exam-variant--nclex`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9024–9026 (0.1 KB)
- **Files**: src/components/exam/learner-exam-chrome.tsx, src/components/study/practice-session-layout.tsx

### `.nn-practice-session.nn-exam-variant--rex`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9028–9030 (0.1 KB)
- **Files**: src/components/exam/learner-exam-chrome.tsx, src/components/study/practice-session-layout.tsx

### `.nn-practice-session.nn-exam-variant--np`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9032–9034 (0.1 KB)
- **Files**: src/components/exam/learner-exam-chrome.tsx, src/components/study/practice-session-layout.tsx

### `.nn-practice-top-bar`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9054–9057 (0.1 KB)
- **Files**: src/components/study/practice-session-layout.tsx

### `.nn-practice-top-bar__row`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9059–9065 (0.1 KB)
- **Files**: src/components/study/practice-session-layout.tsx

### `.nn-practice-top-bar__left-stack`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9067–9069 (0.1 KB)
- **Files**: src/components/study/practice-session-layout.tsx

### `.nn-practice-top-bar__exam-name`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9071–9078 (0.2 KB)
- **Files**: src/components/study/practice-session-layout.tsx

### `.nn-practice-top-bar__left`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9080–9084 (0.1 KB)
- **Files**: src/components/study/practice-session-layout.tsx

### `.nn-practice-top-bar__right`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9086–9090 (0.1 KB)
- **Files**: src/components/study/practice-session-layout.tsx

### `.nn-practice-top-bar__progress`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9092–9098 (0.2 KB)
- **Files**: src/components/study/practice-session-layout.tsx

### `.nn-practice-top-bar__progress-fill`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9100–9105 (0.1 KB)
- **Files**: src/components/study/practice-session-layout.tsx

### `.nn-practice-session-grid`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9115–9120 (0.1 KB)
- **Files**: src/components/study/practice-session-layout.tsx

### `.nn-practice-q-card`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9142–9156 (0.4 KB)
- **Files**: src/components/study/practice-question-card.tsx

### `.nn-practice-q-card__meta`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9165–9173 (0.2 KB)
- **Files**: src/components/study/practice-question-card.tsx

### `.nn-practice-q-card__meta-chip`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9175–9183 (0.2 KB)
- **Files**: src/components/study/practice-question-card.tsx

### `.nn-practice-q-card__stem`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9185–9194 (0.2 KB)
- **Files**: src/components/study/practice-question-card.tsx

### `.nn-practice-q-opts-label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9196–9203 (0.2 KB)
- **Files**: src/components/study/practice-question-card.tsx

### `.nn-practice-opt-list`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9207–9214 (0.1 KB)
- **Files**: none found

### `.nn-practice-opt`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9216–9232 (0.4 KB)
- **Files**: src/components/study/strategy-session-client.tsx, src/components/study/practice-question-card.tsx

### `.nn-practice-opt:hover:not(:disabled)`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9234–9237 (0.2 KB)
- **Files**: src/components/study/strategy-session-client.tsx, src/components/study/practice-question-card.tsx

### `.nn-practice-opt:focus-visible`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9239–9242 (0.1 KB)
- **Files**: src/components/study/strategy-session-client.tsx, src/components/study/practice-question-card.tsx

### `.nn-practice-opt--selected`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9245–9248 (0.2 KB)
- **Files**: src/components/study/strategy-session-client.tsx, src/components/study/practice-question-card.tsx

### `.nn-practice-opt--correct`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9251–9255 (0.2 KB)
- **Files**: src/components/study/strategy-session-client.tsx, src/components/study/practice-question-card.tsx

### `.nn-practice-opt--incorrect`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9258–9261 (0.2 KB)
- **Files**: src/components/study/strategy-session-client.tsx, src/components/study/practice-question-card.tsx

### `.nn-practice-opt--dim`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9264–9267 (0.1 KB)
- **Files**: src/components/study/strategy-session-client.tsx, src/components/study/practice-question-card.tsx

### `.nn-practice-opt:disabled`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9269–9271 (0.0 KB)
- **Files**: src/components/study/strategy-session-client.tsx, src/components/study/practice-question-card.tsx

### `.nn-practice-opt__letter`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9274–9287 (0.3 KB)
- **Files**: src/components/study/strategy-session-client.tsx, src/components/study/practice-question-card.tsx

### `.nn-practice-opt__control`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9289–9298 (0.3 KB)
- **Files**: src/components/study/practice-question-card.tsx

### `.nn-practice-opt__control--checked`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9300–9303 (0.2 KB)
- **Files**: src/components/study/practice-question-card.tsx

### `.nn-practice-opt--correct .nn-practice-opt__letter`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9305–9308 (0.1 KB)
- **Files**: src/components/study/strategy-session-client.tsx, src/components/study/practice-question-card.tsx

### `.nn-practice-opt--incorrect .nn-practice-opt__letter`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9310–9313 (0.1 KB)
- **Files**: src/components/study/strategy-session-client.tsx, src/components/study/practice-question-card.tsx

### `.nn-practice-opt__text`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9315–9323 (0.2 KB)
- **Files**: src/components/study/strategy-session-client.tsx, src/components/study/practice-question-card.tsx

### `.nn-practice-q-nav`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9327–9335 (0.2 KB)
- **Files**: none found

### `.nn-practice-q-nav__spacer`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9350–9352 (0.0 KB)
- **Files**: none found

### `.nn-practice-rationale-full`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9357–9370 (0.4 KB)
- **Files**: src/components/study/practice-rationale-full-panel.tsx

### `.nn-practice-rationale-full__scroll`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9372–9382 (0.2 KB)
- **Files**: src/components/study/practice-rationale-full-panel.tsx

### `.nn-practice-rsection`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9392–9398 (0.1 KB)
- **Files**: src/components/study/practice-rationale-full-panel.tsx

### `.nn-practice-rsection--success`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9400–9405 (0.3 KB)
- **Files**: none found

### `.nn-practice-rsection--info`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9407–9412 (0.2 KB)
- **Files**: none found

### `.nn-practice-rsection--error`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9414–9418 (0.2 KB)
- **Files**: none found

### `.nn-practice-rsection--muted`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9420–9424 (0.2 KB)
- **Files**: none found

### `.nn-practice-rsection--takeaway`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9426–9431 (0.2 KB)
- **Files**: none found

### `.nn-practice-rsection--pearl`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9434–9437 (0.2 KB)
- **Files**: none found

### `.nn-practice-rsection--pearl .nn-practice-rsection__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9439–9441 (0.1 KB)
- **Files**: none found

### `.nn-practice-rsection__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9443–9452 (0.2 KB)
- **Files**: src/components/study/practice-rationale-full-panel.tsx

### `.nn-practice-rsection__body`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9454–9460 (0.2 KB)
- **Files**: src/components/study/practice-rationale-full-panel.tsx

### `.nn-practice-incorrect-opt-row`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9464–9470 (0.2 KB)
- **Files**: src/components/study/practice-rationale-full-panel.tsx

### `.nn-practice-incorrect-opt-row:last-child`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9472–9475 (0.1 KB)
- **Files**: src/components/study/practice-rationale-full-panel.tsx

### `.nn-practice-incorrect-opt-row__letter`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9477–9489 (0.3 KB)
- **Files**: src/components/study/practice-rationale-full-panel.tsx

### `.nn-practice-incorrect-opt-row__content`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9491–9494 (0.1 KB)
- **Files**: src/components/study/practice-rationale-full-panel.tsx

### `.nn-practice-incorrect-opt-row__text`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9496–9501 (0.1 KB)
- **Files**: src/components/study/practice-rationale-full-panel.tsx

### `.nn-practice-incorrect-opt-row--danger-label .nn-practice-incorrect-opt-row__tex`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9503–9505 (0.2 KB)
- **Files**: src/components/study/practice-rationale-full-panel.tsx

### `.nn-practice-incorrect-opt-row__explanation`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9507–9512 (0.1 KB)
- **Files**: src/components/study/practice-rationale-full-panel.tsx

### `.nn-practice-lessons`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9516–9520 (0.1 KB)
- **Files**: src/components/study/practice-rationale-full-panel.tsx

### `.nn-practice-lesson-link`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9522–9535 (0.3 KB)
- **Files**: src/components/study/practice-rationale-full-panel.tsx

### `.nn-practice-lesson-link:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9537–9540 (0.2 KB)
- **Files**: src/components/study/practice-rationale-full-panel.tsx

### `.nn-practice-lesson-link__title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9542–9548 (0.2 KB)
- **Files**: src/components/study/practice-rationale-full-panel.tsx

### `.nn-practice-lesson-link__icon`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9550–9554 (0.1 KB)
- **Files**: src/components/study/practice-rationale-full-panel.tsx

### `.nn-practice-rationale-waiting`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9558–9568 (0.2 KB)
- **Files**: src/components/study/practice-rationale-full-panel.tsx, src/components/study/cat-rationale-panel.tsx

### `.nn-practice-rationale-waiting__text`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9570–9575 (0.2 KB)
- **Files**: src/components/study/practice-rationale-full-panel.tsx, src/components/study/cat-rationale-panel.tsx

### `.nn-practice-rationale-waiting__sub`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9577–9582 (0.1 KB)
- **Files**: src/components/study/practice-rationale-full-panel.tsx, src/components/study/cat-rationale-panel.tsx

### `.nn-practice-rationale-locked`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9586–9591 (0.1 KB)
- **Files**: src/components/study/practice-rationale-full-panel.tsx, src/components/study/cat-rationale-panel.tsx

### `.nn-practice-rationale-locked__title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9593–9597 (0.1 KB)
- **Files**: src/components/study/practice-rationale-full-panel.tsx, src/components/study/cat-rationale-panel.tsx

### `.nn-practice-rationale-locked__body`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9599–9603 (0.1 KB)
- **Files**: src/components/study/practice-rationale-full-panel.tsx, src/components/study/cat-rationale-panel.tsx

### `.nn-confidence-selector`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9612–9621 (0.3 KB)
- **Files**: src/components/study/confidence-selector.tsx

### `.nn-confidence-selector--neutral`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9624–9628 (0.2 KB)
- **Files**: src/components/study/confidence-selector.tsx

### `.nn-confidence-selector__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9630–9636 (0.2 KB)
- **Files**: src/components/study/confidence-selector.tsx

### `.nn-confidence-pills`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9640–9644 (0.1 KB)
- **Files**: src/components/study/confidence-selector.tsx

### `.nn-confidence-pill`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9646–9662 (0.4 KB)
- **Files**: src/components/study/confidence-selector.tsx

### `.nn-confidence-pill:hover:not(:disabled)`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9664–9668 (0.2 KB)
- **Files**: src/components/study/confidence-selector.tsx

### `.nn-confidence-pill:focus-visible`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9670–9673 (0.1 KB)
- **Files**: src/components/study/confidence-selector.tsx

### `.nn-confidence-pill--selected-low`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9676–9681 (0.3 KB)
- **Files**: none found

### `.nn-confidence-pill--selected-medium`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9684–9690 (0.3 KB)
- **Files**: none found

### `.nn-confidence-pill--selected-high`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9693–9703 (0.4 KB)
- **Files**: none found

### `.nn-confidence-pill--selected-neutral`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9706–9712 (0.3 KB)
- **Files**: src/components/study/confidence-selector.tsx

### `.nn-confidence-chip`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9716–9728 (0.4 KB)
- **Files**: src/components/study/confidence-analytics.tsx, src/components/study/confidence-selector.tsx, src/components/student/question-bank-practice-client.tsx

### `.nn-confidence-strip`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9732–9744 (0.4 KB)
- **Files**: src/components/study/confidence-analytics.tsx

### `.nn-confidence-strip strong`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9746–9749 (0.1 KB)
- **Files**: src/components/study/confidence-analytics.tsx

### `.nn-confidence-pattern-grid`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9753–9757 (0.1 KB)
- **Files**: src/components/study/confidence-analytics.tsx

### `.nn-confidence-pattern-card`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9765–9771 (0.1 KB)
- **Files**: src/components/study/confidence-analytics.tsx

### `.nn-confidence-pattern-card--warning`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9774–9779 (0.3 KB)
- **Files**: src/components/study/confidence-analytics.tsx

### `.nn-confidence-pattern-card--info`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9782–9787 (0.3 KB)
- **Files**: src/components/study/confidence-analytics.tsx

### `.nn-confidence-pattern-card--success`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9790–9799 (0.3 KB)
- **Files**: src/components/study/confidence-analytics.tsx

### `.nn-confidence-pattern-card__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9801–9807 (0.2 KB)
- **Files**: src/components/study/confidence-analytics.tsx

### `.nn-confidence-pattern-card__value`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9809–9815 (0.2 KB)
- **Files**: src/components/study/confidence-analytics.tsx

### `.nn-confidence-pattern-card__desc`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9817–9822 (0.1 KB)
- **Files**: src/components/study/confidence-analytics.tsx

### `.nn-review-priority-groups`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9826–9830 (0.1 KB)
- **Files**: src/components/study/confidence-analytics.tsx

### `.nn-review-priority-group`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9832–9838 (0.1 KB)
- **Files**: src/components/study/confidence-analytics.tsx

### `.nn-review-priority-group--high`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9841–9845 (0.2 KB)
- **Files**: src/components/study/confidence-analytics.tsx

### `.nn-review-priority-group--medium`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9848–9853 (0.3 KB)
- **Files**: src/components/study/confidence-analytics.tsx

### `.nn-review-priority-group--stable`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9856–9865 (0.3 KB)
- **Files**: src/components/study/confidence-analytics.tsx

### `.nn-review-priority-group__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9867–9873 (0.2 KB)
- **Files**: src/components/study/confidence-analytics.tsx

### `.nn-review-priority-group__title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9875–9880 (0.1 KB)
- **Files**: src/components/study/confidence-analytics.tsx

### `.nn-review-priority-group__items`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9882–9886 (0.1 KB)
- **Files**: src/components/study/confidence-analytics.tsx

### `.nn-review-priority-group__item`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9888–9892 (0.1 KB)
- **Files**: src/components/study/confidence-analytics.tsx

### `.nn-review-priority-group__empty`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9894–9898 (0.1 KB)
- **Files**: src/components/study/confidence-analytics.tsx

### `.nn-confidence-section-title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9901–9906 (0.1 KB)
- **Files**: src/components/study/confidence-analytics.tsx

### `.nn-smart-review`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 9916–9920 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-smart-review-strip`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 9924–9935 (0.4 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-smart-review-strip__heading`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 9937–9941 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-smart-review-strip__body`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 9943–9947 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-filters`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9951–9961 (0.3 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-filter-toggle`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9963–9977 (0.4 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-filter-toggle:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9979–9982 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-filter-toggle--active`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9984–9989 (0.3 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-filter-select`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 9991–10000 (0.3 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-filter-label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10002–10008 (0.2 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-group`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10012–10016 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-group--priority`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10019–10021 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-group--priority .nn-review-group__header`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10023–10026 (0.2 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-group--needs-review`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10029–10031 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-group--needs-review .nn-review-group__header`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10033–10036 (0.2 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-group--uncertain`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10039–10041 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-group--uncertain .nn-review-group__header`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10043–10046 (0.2 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-group--strong`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10049–10055 (0.2 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-group--strong .nn-review-group__header`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10057–10064 (0.2 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-group__header`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10067–10075 (0.2 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-group__header:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10077–10079 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-group__header-main`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10081–10084 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-group__title-row`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10086–10091 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-group__title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10093–10097 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-group__count`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10099–10111 (0.3 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-group__desc`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10113–10118 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-group__chevron`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10120–10127 (0.2 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-group__chevron--open`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10129–10131 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-group__body`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10134–10137 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-group__empty`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10140–10145 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-q-rows`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10149–10153 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-q-row`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10155–10157 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-q-row:last-child`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10159–10161 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-q-row__main`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10163–10169 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-q-row__main:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10171–10174 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-q-row__num`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10176–10183 (0.2 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-q-row__body`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10185–10188 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-q-row__text`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10190–10198 (0.2 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-q-row__topic`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10200–10212 (0.4 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-q-row__meta`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10214–10220 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-q-row__chips`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10222–10227 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-q-row__actions`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10229–10232 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-chip`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10236–10245 (0.2 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-chip--correct`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10247–10256 (0.3 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-chip--incorrect`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10258–10262 (0.2 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-chip--high`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10264–10273 (0.3 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-chip--medium`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10275–10280 (0.3 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-chip--low`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10282–10287 (0.3 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-q-rationale`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10291–10299 (0.3 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-q-rationale__stem`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10301–10307 (0.2 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-q-rationale__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10309–10315 (0.2 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-q-rationale__text`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10317–10321 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-q-rationale__links`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10323–10328 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-action-btn`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10331–10345 (0.4 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-action-btn:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10347–10351 (0.2 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-action-btn--active`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10353–10358 (0.3 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-action-link`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10360–10372 (0.4 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-review-action-link:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10374–10376 (0.1 KB)
- **Files**: src/components/study/smart-review-screen.tsx

### `.nn-study-plan`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10405–10409 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-plan__divider`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10411–10415 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-plan-summary`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10419–10426 (0.3 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-plan-summary__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10428–10435 (0.2 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-plan-summary__hero`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10437–10441 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-plan-summary__score`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10443–10450 (0.2 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-plan-summary__hero-text`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10452–10457 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-plan-summary__interp`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10459–10463 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-plan-section`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10467–10471 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-plan-section__title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10473–10478 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-plan-section__desc`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10480–10485 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-focus-areas-list`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10489–10493 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-focus-area-row`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10495–10503 (0.2 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-focus-area-row--major`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10506–10510 (0.2 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-focus-area-row--reinforcement`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10513–10517 (0.2 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-focus-area-row--slight`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10520–10523 (0.2 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-focus-area-row__body`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10525–10528 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-focus-area-row__name`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10530–10534 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-focus-area-row__signal`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10536–10540 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-focus-area-row__right`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10542–10548 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-focus-area-row__label`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10550–10560 (0.3 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-focus-area-row__label--reinforcement`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10562–10564 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-focus-area-row__label--slight`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10566–10568 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-focus-area-row__pct`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10570–10574 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-day-card`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10578–10582 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-day-card--a`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10584–10587 (0.1 KB)
- **Files**: none found

### `.nn-study-day-card--b`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10589–10592 (0.1 KB)
- **Files**: none found

### `.nn-study-day-card__header`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10594–10600 (0.2 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-day-card__day-badge`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10602–10615 (0.4 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-day-card__title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10617–10622 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-day-card__body`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10624–10630 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-block`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10634–10642 (0.2 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-block__step-col`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10644–10651 (0.2 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-block__step-number`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10653–10658 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-block__icon`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10660–10668 (0.2 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-block__icon--lesson`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10670–10673 (0.2 KB)
- **Files**: none found

### `.nn-study-block__icon--practice`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10675–10678 (0.2 KB)
- **Files**: none found

### `.nn-study-block__icon--review`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10680–10683 (0.2 KB)
- **Files**: none found

### `.nn-study-block__icon--recap`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10685–10688 (0.2 KB)
- **Files**: none found

### `.nn-study-block__content`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10690–10696 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-block__type-label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10698–10704 (0.2 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-block__instruction`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10706–10710 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-block__cta`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10712–10721 (0.2 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-block__cta:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10723–10725 (0.0 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-study-block__cta::after`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 10727–10730 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-retest-card`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10734–10743 (0.3 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-retest-card__heading`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10745–10749 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-retest-card__timing-text`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10751–10755 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-retest-card__recommendation`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10757–10761 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-retest-card__cta`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10763–10776 (0.3 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-retest-card__cta:hover`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10778–10781 (0.1 KB)
- **Files**: src/components/study/study-plan.tsx

### `.nn-premium-lock-card`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10816–10823 (0.3 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-premium-lock-card::before`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10826–10835 (0.2 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-premium-lock-card__header`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10837–10843 (0.2 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-premium-lock-card__icon-wrap`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10846–10856 (0.3 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-premium-lock-card__icon`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10858–10861 (0.1 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-premium-lock-card__title`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10863–10869 (0.2 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-premium-lock-card__badge`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10871–10886 (0.5 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-premium-lock-card__body`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10888–10893 (0.1 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-premium-lock-card__description`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10895–10899 (0.1 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-premium-lock-card__bullets`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10901–10908 (0.1 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-premium-lock-card__bullet`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10910–10917 (0.2 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-premium-lock-card__tier-hint`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10919–10924 (0.1 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-premium-lock-card__actions`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10926–10931 (0.1 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-locked-preview`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10935–10941 (0.2 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-locked-preview__content`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10943–10959 (0.3 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-locked-preview__overlay`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10961–10968 (0.3 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-locked-preview__overlay-title`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10970–10977 (0.2 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-locked-preview__overlay-desc`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10979–10983 (0.1 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-preview-divider`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10987–10992 (0.1 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-preview-divider__line`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 10994–10998 (0.1 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-preview-divider__label`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11000–11014 (0.4 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-upgrade-prompt-card`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11018–11029 (0.4 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-upgrade-prompt-card::before`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11032–11041 (0.2 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-upgrade-prompt-card__title`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11043–11048 (0.2 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-upgrade-prompt-card__body`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11050–11054 (0.1 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-upgrade-prompt-card__bullets`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11056–11063 (0.1 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-upgrade-prompt-card__bullet`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11065–11072 (0.2 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-upgrade-prompt-card__actions`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11074–11079 (0.1 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-locked-metric-card`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11083–11089 (0.3 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-locked-metric-card__header`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11091–11097 (0.3 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-locked-metric-card__blur`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11099–11108 (0.2 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-locked-metric-card__lock`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11110–11118 (0.2 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-study-day-shell`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11122–11127 (0.2 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-study-day-shell__header`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11129–11134 (0.1 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-study-day-shell__badge`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11136–11149 (0.4 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-study-day-shell__title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11151–11157 (0.2 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-study-day-shell__lock`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11159–11162 (0.1 KB)
- **Files**: src/components/study/premium-gate.tsx

### `.nn-onboarding-step__title`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11166–11172 (0.2 KB)
- **Files**: src/components/onboarding/trial-onboarding-flow.tsx

### `.nn-onboarding-step__subtitle`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11173–11178 (0.1 KB)
- **Files**: src/components/onboarding/trial-onboarding-flow.tsx

### `.nn-onboarding-option`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11179–11190 (0.3 KB)
- **Files**: src/components/onboarding/trial-onboarding-flow.tsx

### `.nn-onboarding-option:hover`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11191–11194 (0.2 KB)
- **Files**: src/components/onboarding/trial-onboarding-flow.tsx

### `.nn-onboarding-option--selected`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11195–11199 (0.2 KB)
- **Files**: src/components/onboarding/trial-onboarding-flow.tsx

### `.nn-onboarding-date-input`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11200–11210 (0.3 KB)
- **Files**: src/components/onboarding/trial-onboarding-flow.tsx

### `.nn-onboarding-date-input:focus`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11211–11215 (0.2 KB)
- **Files**: src/components/onboarding/trial-onboarding-flow.tsx

### `.nn-notification-bell`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11219–11232 (0.4 KB)
- **Files**: src/components/student/engagement-notification-panel.tsx

### `.nn-notification-bell:hover`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11233–11237 (0.2 KB)
- **Files**: src/components/student/engagement-notification-panel.tsx

### `.nn-notification-badge`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11238–11255 (0.4 KB)
- **Files**: src/components/student/engagement-notification-panel.tsx

### `.nn-notification-panel`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11256–11270 (0.4 KB)
- **Files**: src/components/student/engagement-notification-panel.tsx

### `.nn-notification-panel__header`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11271–11277 (0.2 KB)
- **Files**: src/components/student/engagement-notification-panel.tsx

### `.nn-notification-panel__body`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11278–11281 (0.1 KB)
- **Files**: src/components/student/engagement-notification-panel.tsx

### `.nn-notification-item`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11282–11286 (0.2 KB)
- **Files**: src/components/student/engagement-notification-panel.tsx

### `.nn-notification-item:last-child`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11287–11289 (0.1 KB)
- **Files**: src/components/student/engagement-notification-panel.tsx

### `.nn-notification-item:hover`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11290–11292 (0.1 KB)
- **Files**: src/components/student/engagement-notification-panel.tsx

### `.nn-engagement-nudge`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11296–11305 (0.3 KB)
- **Files**: src/components/student/engagement-nudge-strip.tsx, src/components/student/spaced-review-reminder.tsx

### `.nn-engagement-nudge:hover`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11306–11309 (0.2 KB)
- **Files**: src/components/student/engagement-nudge-strip.tsx, src/components/student/spaced-review-reminder.tsx

### `.nn-engagement-nudge__icon`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11310–11318 (0.2 KB)
- **Files**: src/components/student/engagement-nudge-strip.tsx, src/components/student/spaced-review-reminder.tsx

### `.nn-engagement-nudge__content`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11319–11322 (0.1 KB)
- **Files**: src/components/student/engagement-nudge-strip.tsx, src/components/student/spaced-review-reminder.tsx

### `.nn-engagement-nudge__title`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11323–11328 (0.1 KB)
- **Files**: src/components/student/engagement-nudge-strip.tsx, src/components/student/spaced-review-reminder.tsx

### `.nn-engagement-nudge__body`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11329–11334 (0.1 KB)
- **Files**: src/components/student/engagement-nudge-strip.tsx, src/components/student/spaced-review-reminder.tsx

### `.nn-engagement-nudge__cta`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11335–11343 (0.2 KB)
- **Files**: src/components/student/engagement-nudge-strip.tsx, src/components/student/spaced-review-reminder.tsx

### `.nn-engagement-nudge__cta:hover`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 11344–11346 (0.0 KB)
- **Files**: src/components/student/engagement-nudge-strip.tsx, src/components/student/spaced-review-reminder.tsx

### `.nn-hiw-section`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 11350–11353 (0.1 KB)
- **Files**: src/components/marketing/how-it-works-page-client.tsx

### `.nn-hiw-section--alt`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 11354–11361 (0.2 KB)
- **Files**: src/components/marketing/how-it-works-page-client.tsx

### `.nn-hiw-step-card`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 11370–11376 (0.2 KB)
- **Files**: src/components/marketing/how-it-works-page-client.tsx

### `.nn-hiw-step-card:hover`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 11377–11381 (0.2 KB)
- **Files**: src/components/marketing/how-it-works-page-client.tsx

### `.nn-hiw-feature-card`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 11382–11388 (0.3 KB)
- **Files**: src/components/marketing/how-it-works-page-client.tsx

### `.nn-hiw-feature-card:hover`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 11389–11393 (0.2 KB)
- **Files**: src/components/marketing/how-it-works-page-client.tsx

### `.nn-hiw-preview-card`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 11394–11400 (0.2 KB)
- **Files**: src/components/marketing/how-it-works-page-client.tsx

### `.nn-hiw-preview-card:hover`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 11401–11405 (0.2 KB)
- **Files**: src/components/marketing/how-it-works-page-client.tsx

### `.nn-dash`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 11409–11414 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/page.tsx, src/components/learner-tutor/learner-tutor-dock.tsx, src/components/learner-ui/learner-kicker-heading.tsx, src/components/learner-ui/learner-study-surface-section.tsx, src/components/student/learner-adaptive-recommendations-section.tsx

### `.nn-dash--learner-home`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11415–11423 (0.5 KB)
- **Files**: src/components/student/learner-dashboard-page-shell.tsx

### `.nn-dash-hub-layout`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11426–11431 (0.1 KB)
- **Files**: src/components/student/learner-dashboard-hub-layout.tsx, src/components/student/learner-dashboard-media-query.ts

### `.nn-dash-hub-nav-scroll`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11434–11438 (0.1 KB)
- **Files**: src/components/student/learner-dashboard-hub-nav-island.tsx

### `.nn-dash-hub-nav-details`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11467–11469 (0.0 KB)
- **Files**: src/components/student/learner-dashboard-hub-nav-island.tsx

### `.nn-dash-hub-nav-details__summary`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11470–11487 (0.6 KB)
- **Files**: src/components/student/learner-dashboard-hub-nav-island.tsx

### `.nn-dash-hub-nav-details__summary::-webkit-details-marker`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11488–11490 (0.1 KB)
- **Files**: src/components/student/learner-dashboard-hub-nav-island.tsx

### `.nn-dash-hub-nav-details__summary::after`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11491–11501 (0.4 KB)
- **Files**: src/components/student/learner-dashboard-hub-nav-island.tsx

### `.nn-dash-hub-nav-details[open] .nn-dash-hub-nav-details__summary::after`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11502–11505 (0.1 KB)
- **Files**: src/components/student/learner-dashboard-hub-nav-island.tsx

### `.nn-dash-hub-nav-details__summary:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11506–11509 (0.2 KB)
- **Files**: src/components/student/learner-dashboard-hub-nav-island.tsx

### `.nn-dash-hub-nav`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11516–11524 (0.3 KB)
- **Files**: src/components/student/learner-dashboard-hub-nav-island.tsx

### `.nn-dash-hub-nav__heading`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11532–11539 (0.2 KB)
- **Files**: src/components/student/learner-dashboard-hub-nav-island.tsx

### `.nn-dash-hub-nav__list`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11540–11547 (0.1 KB)
- **Files**: src/components/student/learner-dashboard-hub-nav-island.tsx

### `.nn-dash-hub-nav__item`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11558–11560 (0.0 KB)
- **Files**: src/components/student/learner-dashboard-hub-nav-island.tsx

### `.nn-dash-hub-nav__link`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11561–11575 (0.3 KB)
- **Files**: src/components/student/learner-dashboard-hub-nav-island.tsx

### `.nn-dash-hub-nav__link:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11576–11580 (0.2 KB)
- **Files**: src/components/student/learner-dashboard-hub-nav-island.tsx

### `.nn-dash-hub-nav__link:focus-visible`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11581–11584 (0.1 KB)
- **Files**: src/components/student/learner-dashboard-hub-nav-island.tsx

### `.nn-dash-hub-main`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11591–11595 (0.1 KB)
- **Files**: src/components/student/learner-dashboard-hub-layout.tsx

### `.nn-dash--learner-home .nn-dash-band--stack-tight + .nn-dash-band--stack-tight`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11598–11600 (0.1 KB)
- **Files**: src/components/student/learner-dashboard-page-shell.tsx

### `.nn-learner-app:has([data-testid="learner-dashboard-shell"]) .nn-learner-shell-n`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 11603–11606 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/layout.tsx

### `.nn-dash--learner-home .nn-dash-band--adaptive .nn-dash-section`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11615–11617 (0.1 KB)
- **Files**: src/components/student/learner-dashboard-page-shell.tsx

### `.nn-dash--learner-home .nn-dash-band--adaptive .nn-dash-section.rounded-2xl`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11618–11620 (0.1 KB)
- **Files**: src/components/student/learner-dashboard-page-shell.tsx

### `.nn-dash-section`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 11627–11632 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/page.tsx, src/components/learner-tutor/learner-tutor-dock.tsx, src/components/learner-ui/learner-kicker-heading.tsx, src/components/learner-ui/learner-study-surface-section.tsx, src/components/student/learner-adaptive-recommendations-section.tsx

### `.nn-dash-section .nn-ls-kicker`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 11633–11637 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/page.tsx, src/components/learner-tutor/learner-tutor-dock.tsx, src/components/learner-ui/learner-kicker-heading.tsx, src/components/learner-ui/learner-study-surface-section.tsx, src/components/student/learner-adaptive-recommendations-section.tsx

### `.nn-dash-section .nn-ls-title`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 11638–11643 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/page.tsx, src/components/learner-tutor/learner-tutor-dock.tsx, src/components/learner-ui/learner-kicker-heading.tsx, src/components/learner-ui/learner-study-surface-section.tsx, src/components/student/learner-adaptive-recommendations-section.tsx

### `.nn-dash-section .nn-ls-intro`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 11644–11647 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/page.tsx, src/components/learner-tutor/learner-tutor-dock.tsx, src/components/learner-ui/learner-kicker-heading.tsx, src/components/learner-ui/learner-study-surface-section.tsx, src/components/student/learner-adaptive-recommendations-section.tsx

### `.nn-dash--learner-home .nn-dash-section > .nn-ls-surface`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11653–11655 (0.1 KB)
- **Files**: src/components/student/learner-dashboard-page-shell.tsx

### `.nn-dash-section:nth-child(2)`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 11662–11662 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/page.tsx, src/components/learner-tutor/learner-tutor-dock.tsx, src/components/learner-ui/learner-kicker-heading.tsx, src/components/learner-ui/learner-study-surface-section.tsx, src/components/student/learner-adaptive-recommendations-section.tsx

### `.nn-dash-section:nth-child(3)`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 11663–11663 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/page.tsx, src/components/learner-tutor/learner-tutor-dock.tsx, src/components/learner-ui/learner-kicker-heading.tsx, src/components/learner-ui/learner-study-surface-section.tsx, src/components/student/learner-adaptive-recommendations-section.tsx

### `.nn-dash-section:nth-child(4)`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 11664–11664 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/page.tsx, src/components/learner-tutor/learner-tutor-dock.tsx, src/components/learner-ui/learner-kicker-heading.tsx, src/components/learner-ui/learner-study-surface-section.tsx, src/components/student/learner-adaptive-recommendations-section.tsx

### `.nn-dash-section:nth-child(5)`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 11665–11665 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/page.tsx, src/components/learner-tutor/learner-tutor-dock.tsx, src/components/learner-ui/learner-kicker-heading.tsx, src/components/learner-ui/learner-study-surface-section.tsx, src/components/student/learner-adaptive-recommendations-section.tsx

### `.nn-dash-section:nth-child(n+6)`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 11666–11666 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/page.tsx, src/components/learner-tutor/learner-tutor-dock.tsx, src/components/learner-ui/learner-kicker-heading.tsx, src/components/learner-ui/learner-study-surface-section.tsx, src/components/student/learner-adaptive-recommendations-section.tsx

### `.nn-dash-section-label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11668–11675 (0.2 KB)
- **Files**: src/components/learner-tutor/learner-tutor-dock.tsx

### `.nn-dash-divider`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11677–11685 (0.3 KB)
- **Files**: none found

### `.nn-dash-page-header`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11688–11697 (0.3 KB)
- **Files**: src/components/student/learner-dashboard-page-shell.tsx

### `.nn-dash-page-header__top`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11703–11707 (0.1 KB)
- **Files**: src/components/student/learner-dashboard-page-shell.tsx

### `.nn-dash-page-header__eyebrow`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11716–11722 (0.2 KB)
- **Files**: none found

### `.nn-dash-page-header__title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11723–11730 (0.2 KB)
- **Files**: src/components/student/learner-dashboard-page-shell.tsx

### `.nn-dash-page-header__subtitle`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11731–11737 (0.2 KB)
- **Files**: src/components/student/learner-dashboard-page-shell.tsx

### `.nn-dash-page-header__identity`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11738–11744 (0.1 KB)
- **Files**: src/components/student/learner-dashboard-page-shell.tsx

### `.nn-dash-page-header__pill`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11745–11757 (0.4 KB)
- **Files**: src/components/student/learner-dashboard-page-shell.tsx

### `.nn-dash-page-header__meta`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11758–11761 (0.1 KB)
- **Files**: src/components/student/learner-dashboard-page-shell.tsx

### `.nn-dash-page-header__context`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11762–11768 (0.2 KB)
- **Files**: src/components/student/learner-dashboard-page-shell.tsx

### `.nn-dash-page-header__actions`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11769–11775 (0.1 KB)
- **Files**: none found

### `.nn-dash-page-header__secondary-actions`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11785–11790 (0.1 KB)
- **Files**: none found

### `.nn-dash-page-header__secondary-link`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11796–11802 (0.2 KB)
- **Files**: none found

### `.nn-dash-page-header__secondary-link:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11803–11805 (0.1 KB)
- **Files**: none found

### `.nn-dash-page-header--compact`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11807–11814 (0.2 KB)
- **Files**: src/components/student/learner-dashboard-page-shell.tsx

### `.nn-dash-page-header--compact .nn-dash-page-header__top`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11815–11817 (0.1 KB)
- **Files**: src/components/student/learner-dashboard-page-shell.tsx

### `.nn-dash-page-header--learner-hub.nn-dash-page-header--compact`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11833–11836 (0.1 KB)
- **Files**: src/components/student/learner-dashboard-page-shell.tsx

### `.nn-dash-page-header__title-row`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11843–11848 (0.1 KB)
- **Files**: src/components/student/learner-dashboard-page-shell.tsx

### `.nn-dash-page-header--compact .nn-dash-page-header__title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11849–11852 (0.1 KB)
- **Files**: src/components/student/learner-dashboard-page-shell.tsx

### `.nn-dash-page-header__identity--inline`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11853–11856 (0.1 KB)
- **Files**: src/components/student/learner-dashboard-page-shell.tsx

### `.nn-learner-shell-sticky`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 11865–11867 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/layout.tsx

### `.nn-learner-shell-nav-row`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 11870–11873 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/layout.tsx

### `.nn-learner-shell-bottom-scroll`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11876–11881 (0.2 KB)
- **Files**: none found

### `.nn-dash-hero-shell`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11883–11899 (0.7 KB)
- **Files**: none found

### `.nn-dash-hero-shell__glow`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11905–11916 (0.3 KB)
- **Files**: none found

### `.nn-dash-hero-shell__grid`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11917–11921 (0.1 KB)
- **Files**: none found

### `.nn-dash-hero-shell__body`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11929–11931 (0.0 KB)
- **Files**: none found

### `.nn-dash-hero-shell__eyebrow`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11932–11939 (0.2 KB)
- **Files**: none found

### `.nn-dash-hero-shell__title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11940–11949 (0.2 KB)
- **Files**: none found

### `.nn-dash-hero-shell__lead`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11955–11961 (0.2 KB)
- **Files**: none found

### `.nn-dash-hero-shell__chips`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11962–11964 (0.1 KB)
- **Files**: none found

### `.nn-dash-hero-shell__aside`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11965–11970 (0.1 KB)
- **Files**: none found

### `.nn-dash-context-link`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11971–11989 (0.8 KB)
- **Files**: none found

### `.nn-dash-context-link:hover:not(:active)`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11990–11994 (0.3 KB)
- **Files**: none found

### `.nn-dash-context-link__kicker`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 11995–12001 (0.2 KB)
- **Files**: none found

### `.nn-dash-context-link__title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12002–12007 (0.1 KB)
- **Files**: none found

### `.nn-dash-hero-note`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12008–12012 (0.1 KB)
- **Files**: none found

### `.nn-dash-hero-note__eyebrow`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12013–12019 (0.2 KB)
- **Files**: none found

### `.nn-dash-hero-note__title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12020–12025 (0.1 KB)
- **Files**: none found

### `.nn-dash-hero-note__body`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12026–12030 (0.1 KB)
- **Files**: none found

### `.nn-dash-band`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 12032–12034 (0.0 KB)
- **Files**: src/app/(student)/app/(learner)/page.tsx, src/components/student/dashboard/learner-premium-nursing-analytics.tsx, src/components/student/learner-dashboard-readiness-next-strip.tsx, src/components/student/learner-study-home-durability-minimal.tsx, src/components/student/learner-study-home.tsx

### `.nn-dash-core-shortcuts__list`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12037–12044 (0.2 KB)
- **Files**: src/components/student/learner-core-study-shortcuts.tsx

### `.nn-dash-core-shortcuts__link`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12045–12061 (0.5 KB)
- **Files**: src/components/student/learner-core-study-shortcuts.tsx

### `.nn-dash-core-shortcuts__link:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12062–12065 (0.2 KB)
- **Files**: src/components/student/learner-core-study-shortcuts.tsx

### `.nn-dash-priority-grid,`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12067–12077 (0.1 KB)
- **Files**: src/components/student/learner-study-home.tsx

### `.nn-dash-priority-grid.nn-dash-priority-grid--solo`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12080–12082 (0.1 KB)
- **Files**: none found

### `.nn-dash-goals-grid`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12085–12089 (0.1 KB)
- **Files**: src/components/student/learner-study-home.tsx

### `.nn-dash-goals-grid__main`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12090–12093 (0.1 KB)
- **Files**: src/components/student/learner-study-home.tsx

### `.nn-dash-goals-grid__rail`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12094–12097 (0.1 KB)
- **Files**: src/components/student/learner-study-home.tsx

### `.nn-dash-priority-grid__rail,`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12139–12146 (0.1 KB)
- **Files**: src/components/student/learner-study-home.tsx

### `.nn-dash-attention-grid__wide,`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12147–12157 (0.0 KB)
- **Files**: none found

### `.nn-dash-explore-stack`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12163–12167 (0.1 KB)
- **Files**: none found

### `.nn-dash-explore-tail`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12168–12172 (0.1 KB)
- **Files**: src/components/student/learner-study-home.tsx

### `.nn-dash-account-cta`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12173–12177 (0.1 KB)
- **Files**: src/components/student/learner-study-home.tsx

### `.nn-primary-action-card`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 12188–12209 (0.9 KB)
- **Files**: src/components/student/dashboard/primary-action-card.tsx

### `.nn-primary-action-card::before`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 12210–12221 (0.3 KB)
- **Files**: src/components/student/dashboard/primary-action-card.tsx

### `.nn-primary-action-card:hover:not(:active)`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 12227–12233 (0.3 KB)
- **Files**: src/components/student/dashboard/primary-action-card.tsx

### `.nn-primary-action-card:active`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 12234–12239 (0.2 KB)
- **Files**: src/components/student/dashboard/primary-action-card.tsx

### `.nn-primary-action-card__icon`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 12240–12251 (0.4 KB)
- **Files**: src/components/student/dashboard/primary-action-card.tsx

### `.nn-primary-action-card__title`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 12252–12259 (0.2 KB)
- **Files**: src/components/student/dashboard/primary-action-card.tsx

### `.nn-primary-action-card__subtitle`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 12265–12271 (0.2 KB)
- **Files**: src/components/student/dashboard/primary-action-card.tsx

### `.nn-primary-action-card__reasoning`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 12272–12280 (0.3 KB)
- **Files**: src/components/student/dashboard/primary-action-card.tsx

### `.nn-primary-action-card__arrow`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 12281–12292 (0.4 KB)
- **Files**: src/components/student/dashboard/primary-action-card.tsx

### `.nn-primary-action-card:hover:not(:active) .nn-primary-action-card__arrow`
- **Classification**: SHARED_COMPONENT
- **Risk**: NEEDS_REVIEW
- **Recommendation**: move-to-shared
- **Lines**: 12293–12297 (0.3 KB)
- **Files**: src/components/student/dashboard/primary-action-card.tsx

### `.nn-countdown-card`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 12301–12316 (0.6 KB)
- **Files**: src/components/student/dashboard/exam-countdown-card.tsx

### `.nn-countdown-card:hover`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 12317–12319 (0.1 KB)
- **Files**: src/components/student/dashboard/exam-countdown-card.tsx

### `.nn-countdown-card::after`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 12320–12328 (0.1 KB)
- **Files**: src/components/student/dashboard/exam-countdown-card.tsx

### `.nn-heatmap-card`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 12332–12344 (0.5 KB)
- **Files**: src/components/student/dashboard/weakness-heatmap.tsx

### `.nn-heatmap-cell`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 12351–12369 (0.5 KB)
- **Files**: src/components/student/dashboard/weakness-heatmap.tsx

### `.nn-heatmap-cell:hover`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 12370–12373 (0.1 KB)
- **Files**: src/components/student/dashboard/weakness-heatmap.tsx

### `.nn-heatmap-cell__bar`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 12374–12378 (0.1 KB)
- **Files**: src/components/student/dashboard/weakness-heatmap.tsx

### `.nn-smart-actions-section`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 12382–12394 (0.6 KB)
- **Files**: src/components/student/dashboard/smart-actions-bar.tsx

### `.nn-smart-action`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 12401–12420 (0.5 KB)
- **Files**: src/components/student/dashboard/smart-actions-bar.tsx

### `.nn-smart-action:hover`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 12421–12425 (0.2 KB)
- **Files**: src/components/student/dashboard/smart-actions-bar.tsx

### `.nn-locked-hero`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 12429–12440 (0.6 KB)
- **Files**: src/components/student/dashboard/locked-dashboard-overlay.tsx

### `.nn-locked-feature-card`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 12441–12448 (0.2 KB)
- **Files**: src/components/student/dashboard/locked-dashboard-overlay.tsx

### `.nn-locked-feature-card:hover`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 12449–12453 (0.2 KB)
- **Files**: src/components/student/dashboard/locked-dashboard-overlay.tsx

### `.nn-coach-action-btn`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12461–12475 (0.5 KB)
- **Files**: src/components/study/coach-weak-summary.tsx, src/components/study/coach-lesson-helper.tsx, src/components/study/coach-review-helper.tsx, src/components/student/dashboard/coach-card.tsx

### `.nn-coach-action-btn:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12476–12481 (0.3 KB)
- **Files**: src/components/study/coach-weak-summary.tsx, src/components/study/coach-lesson-helper.tsx, src/components/study/coach-review-helper.tsx, src/components/student/dashboard/coach-card.tsx

### `.nn-coach-action-btn:active`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12482–12484 (0.1 KB)
- **Files**: src/components/study/coach-weak-summary.tsx, src/components/study/coach-lesson-helper.tsx, src/components/study/coach-review-helper.tsx, src/components/student/dashboard/coach-card.tsx

### `.nn-coach-action-btn--wide`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12485–12489 (0.1 KB)
- **Files**: src/components/study/coach-weak-summary.tsx

### `.nn-coach-follow-up-btn`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12493–12506 (0.4 KB)
- **Files**: src/components/study/coach-response-panel.tsx

### `.nn-coach-follow-up-btn:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12507–12510 (0.2 KB)
- **Files**: src/components/study/coach-response-panel.tsx

### `.nn-coach-panel`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12514–12523 (0.3 KB)
- **Files**: src/components/study/coach-response-panel.tsx

### `.nn-coach-panel__header`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12524–12530 (0.2 KB)
- **Files**: src/components/study/coach-response-panel.tsx

### `.nn-coach-panel__title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12531–12536 (0.1 KB)
- **Files**: src/components/study/coach-response-panel.tsx

### `.nn-coach-panel__close`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12537–12549 (0.3 KB)
- **Files**: src/components/study/coach-response-panel.tsx

### `.nn-coach-panel__close:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12550–12553 (0.1 KB)
- **Files**: src/components/study/coach-response-panel.tsx

### `.nn-coach-panel__body`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12554–12556 (0.1 KB)
- **Files**: src/components/study/coach-response-panel.tsx

### `.nn-coach-panel__loading`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12557–12562 (0.1 KB)
- **Files**: src/components/study/coach-response-panel.tsx

### `.nn-coach-panel__loading--skeleton`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12563–12565 (0.1 KB)
- **Files**: src/components/study/coach-response-panel.tsx

### `.nn-coach-panel__error`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12566–12571 (0.1 KB)
- **Files**: src/components/study/coach-response-panel.tsx

### `.nn-coach-panel__content`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12572–12576 (0.1 KB)
- **Files**: src/components/study/coach-response-panel.tsx

### `.nn-coach-panel__line`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12577–12581 (0.1 KB)
- **Files**: src/components/study/coach-response-panel.tsx

### `.nn-coach-panel__follow-ups`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12582–12589 (0.2 KB)
- **Files**: src/components/study/coach-response-panel.tsx

### `.nn-coach-inline`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12593–12597 (0.2 KB)
- **Files**: src/components/study/coach-review-helper.tsx

### `.nn-coach-inline__actions`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12598–12602 (0.1 KB)
- **Files**: src/components/study/coach-review-helper.tsx

### `.nn-coach-inline__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12603–12609 (0.2 KB)
- **Files**: src/components/study/coach-review-helper.tsx

### `.nn-coach-inline__buttons`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12610–12614 (0.1 KB)
- **Files**: src/components/study/coach-review-helper.tsx

### `.nn-coach-card`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12618–12633 (0.6 KB)
- **Files**: src/components/student/dashboard/coach-card.tsx

### `.nn-coach-card__header`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12634–12638 (0.1 KB)
- **Files**: src/components/student/dashboard/coach-card.tsx

### `.nn-coach-card__title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12639–12644 (0.1 KB)
- **Files**: src/components/student/dashboard/coach-card.tsx

### `.nn-coach-card__actions`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12645–12649 (0.1 KB)
- **Files**: src/components/student/dashboard/coach-card.tsx

### `.nn-coach-lesson-strip`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12653–12664 (0.4 KB)
- **Files**: src/components/study/coach-lesson-helper.tsx

### `.nn-coach-lesson-strip__header`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12665–12670 (0.1 KB)
- **Files**: src/components/study/coach-lesson-helper.tsx

### `.nn-coach-lesson-strip__title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12671–12676 (0.1 KB)
- **Files**: src/components/study/coach-lesson-helper.tsx

### `.nn-coach-lesson-strip__actions`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12677–12681 (0.1 KB)
- **Files**: src/components/study/coach-lesson-helper.tsx

### `.nn-coach-weak-summary`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12685–12687 (0.0 KB)
- **Files**: src/components/study/coach-weak-summary.tsx

### `.nn-coach-lesson-strip__hint`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12691–12700 (0.4 KB)
- **Files**: src/components/study/coach-lesson-helper.tsx

### `.nn-coach-readiness-card`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12702–12708 (0.2 KB)
- **Files**: src/components/study/coach-readiness-card.tsx

### `.nn-coach-readiness-card__eyebrow`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12709–12716 (0.2 KB)
- **Files**: src/components/study/coach-readiness-card.tsx

### `.nn-coach-readiness-card__row`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12717–12721 (0.1 KB)
- **Files**: src/components/study/coach-readiness-card.tsx

### `.nn-coach-readiness-card__score`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12722–12728 (0.2 KB)
- **Files**: src/components/study/coach-readiness-card.tsx

### `.nn-coach-readiness-card__meta`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12729–12731 (0.0 KB)
- **Files**: src/components/study/coach-readiness-card.tsx

### `.nn-coach-readiness-card__band`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12732–12737 (0.1 KB)
- **Files**: src/components/study/coach-readiness-card.tsx

### `.nn-coach-readiness-card__conf`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12738–12742 (0.1 KB)
- **Files**: src/components/study/coach-readiness-card.tsx

### `.nn-coach-readiness-card__note`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12743–12748 (0.1 KB)
- **Files**: src/components/study/coach-readiness-card.tsx

### `.nn-coach-readiness-card--at-risk`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12749–12756 (0.3 KB)
- **Files**: none found

### `.nn-coach-readiness-card--borderline`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12757–12764 (0.3 KB)
- **Files**: none found

### `.nn-coach-readiness-card--passing-range`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12765–12772 (0.3 KB)
- **Files**: none found

### `.nn-coach-readiness-card--strong`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12773–12780 (0.3 KB)
- **Files**: none found

### `.nn-coach-priority-list`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12782–12791 (0.3 KB)
- **Files**: src/components/study/coach-priority-list.tsx

### `.nn-coach-priority-list__title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12792–12797 (0.1 KB)
- **Files**: src/components/study/coach-priority-list.tsx

### `.nn-coach-priority-list__intro`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12798–12803 (0.1 KB)
- **Files**: src/components/study/coach-priority-list.tsx

### `.nn-coach-priority-list__list`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12804–12811 (0.1 KB)
- **Files**: src/components/study/coach-priority-list.tsx

### `.nn-coach-priority-list__item`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12812–12816 (0.1 KB)
- **Files**: src/components/study/coach-priority-list.tsx

### `.nn-coach-priority-list__dot`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12817–12823 (0.1 KB)
- **Files**: src/components/study/coach-priority-list.tsx

### `.nn-coach-priority-list__dot--1`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12824–12826 (0.1 KB)
- **Files**: src/components/study/coach-priority-list.tsx

### `.nn-coach-priority-list__dot--2`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12827–12829 (0.1 KB)
- **Files**: src/components/study/coach-priority-list.tsx

### `.nn-coach-priority-list__dot--3`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12830–12832 (0.1 KB)
- **Files**: src/components/study/coach-priority-list.tsx

### `.nn-coach-priority-list__dot--4`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12833–12835 (0.1 KB)
- **Files**: src/components/study/coach-priority-list.tsx

### `.nn-coach-priority-list__dot--5`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12836–12838 (0.1 KB)
- **Files**: src/components/study/coach-priority-list.tsx

### `.nn-coach-priority-list__body`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12839–12841 (0.0 KB)
- **Files**: src/components/study/coach-priority-list.tsx

### `.nn-coach-priority-list__label`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12842–12847 (0.1 KB)
- **Files**: src/components/study/coach-priority-list.tsx

### `.nn-coach-priority-list__reason`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12848–12853 (0.1 KB)
- **Files**: src/components/study/coach-priority-list.tsx

### `.nn-coach-pattern-insights`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12855–12864 (0.3 KB)
- **Files**: src/components/study/coach-pattern-insights.tsx

### `.nn-coach-pattern-insights__title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12865–12870 (0.1 KB)
- **Files**: src/components/study/coach-pattern-insights.tsx

### `.nn-coach-pattern-insights__list`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12871–12877 (0.2 KB)
- **Files**: src/components/study/coach-pattern-insights.tsx

### `.nn-coach-pattern-insights__item`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12878–12880 (0.1 KB)
- **Files**: src/components/study/coach-pattern-insights.tsx

### `.nn-coach-intervention`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12882–12890 (0.2 KB)
- **Files**: src/components/study/coach-intervention-banner.tsx

### `.nn-coach-intervention__text`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12891–12894 (0.1 KB)
- **Files**: src/components/study/coach-intervention-banner.tsx

### `.nn-coach-intervention__title`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12895–12900 (0.1 KB)
- **Files**: src/components/study/coach-intervention-banner.tsx

### `.nn-coach-intervention__message`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12901–12906 (0.1 KB)
- **Files**: src/components/study/coach-intervention-banner.tsx

### `.nn-coach-intervention__dismiss`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12907–12916 (0.2 KB)
- **Files**: src/components/study/coach-intervention-banner.tsx

### `.nn-coach-intervention__dismiss:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12917–12920 (0.2 KB)
- **Files**: src/components/study/coach-intervention-banner.tsx

### `.nn-coach-intervention--action`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12921–12928 (0.3 KB)
- **Files**: src/components/study/coach-intervention-banner.tsx

### `.nn-coach-intervention--watch`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12929–12936 (0.3 KB)
- **Files**: src/components/study/coach-intervention-banner.tsx

### `.nn-coach-intervention--info`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12937–12944 (0.3 KB)
- **Files**: src/components/study/coach-intervention-banner.tsx

### `.nn-session-feedback`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12948–12957 (0.3 KB)
- **Files**: src/components/student/session-feedback-strip.tsx

### `.nn-session-feedback--positive`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12958–12965 (0.3 KB)
- **Files**: src/components/student/session-feedback-strip.tsx

### `.nn-session-feedback--guidance`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12966–12973 (0.3 KB)
- **Files**: src/components/student/session-feedback-strip.tsx

### `.nn-session-feedback--neutral`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12974–12976 (0.1 KB)
- **Files**: src/components/student/session-feedback-strip.tsx

### `.nn-session-feedback__icon`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12977–12985 (0.2 KB)
- **Files**: src/components/student/session-feedback-strip.tsx

### `.nn-session-feedback__text`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12986–12988 (0.0 KB)
- **Files**: src/components/student/session-feedback-strip.tsx

### `.nn-session-feedback__primary`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12989–12994 (0.1 KB)
- **Files**: src/components/student/session-feedback-strip.tsx

### `.nn-session-feedback__secondary`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 12995–13000 (0.1 KB)
- **Files**: src/components/student/session-feedback-strip.tsx

### `.nn-session-feedback-list`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 13004–13016 (0.4 KB)
- **Files**: src/components/student/session-feedback-strip.tsx

### `.nn-session-feedback-list__item`
- **Classification**: LEARNER_ONLY
- **Risk**: NEEDS_REVIEW
- **Recommendation**: review-then-move
- **Lines**: 13017–13024 (0.2 KB)
- **Files**: src/components/student/session-feedback-strip.tsx

### `.nn-readiness-card`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13028–13030 (0.1 KB)
- **Files**: src/components/student/dashboard/readiness-score-card.tsx

### `.nn-readiness-band-badge`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13032–13045 (0.4 KB)
- **Files**: src/components/student/dashboard/readiness-score-card.tsx

### `.nn-readiness-trend`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13047–13055 (0.2 KB)
- **Files**: src/components/student/dashboard/readiness-score-card.tsx

### `.nn-readiness-trend--up`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13057–13061 (0.2 KB)
- **Files**: src/components/student/dashboard/readiness-score-card.tsx

### `.nn-readiness-trend--flat`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13062–13066 (0.2 KB)
- **Files**: src/components/student/dashboard/readiness-score-card.tsx

### `.nn-readiness-trend--down`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13067–13071 (0.2 KB)
- **Files**: src/components/student/dashboard/readiness-score-card.tsx

### `.nn-readiness-section-label`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13073–13078 (0.1 KB)
- **Files**: src/components/student/dashboard/readiness-score-card.tsx

### `.nn-readiness-actions-strip`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13080–13089 (0.3 KB)
- **Files**: src/components/student/dashboard/readiness-score-card.tsx

### `@container (min-width: 28rem)`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13090–13096 (0.1 KB)
- **Files**: src/components/student/dashboard/readiness-score-card.tsx

### `.nn-readiness-details`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13098–13100 (0.1 KB)
- **Files**: src/components/student/dashboard/readiness-score-card.tsx

### `.nn-readiness-details-trigger`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13101–13114 (0.3 KB)
- **Files**: src/components/student/dashboard/readiness-score-card.tsx

### `.nn-readiness-details-trigger:hover`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13115–13117 (0.1 KB)
- **Files**: src/components/student/dashboard/readiness-score-card.tsx

### `.nn-benchmark-card`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13127–13138 (0.4 KB)
- **Files**: src/components/student/dashboard/benchmark-card.tsx

### `.nn-benchmark-percentile-block`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13140–13145 (0.3 KB)
- **Files**: src/components/student/dashboard/benchmark-card.tsx

### `.nn-qs`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13174–13182 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs--fade-in`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13184–13186 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs--stagger-1`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13188–13188 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs--stagger-2`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13189–13189 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs--stagger-3`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13190–13190 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__center`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13192–13199 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__spinner`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13201–13208 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__intro`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13212–13219 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__intro-icon`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13221–13230 (0.3 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__intro-title`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13232–13237 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__intro-desc`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13239–13244 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__intro-meta`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13246–13254 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__topbar`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13258–13262 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__progress-bar`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13264–13270 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__progress-fill`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13272–13277 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__progress-count`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13279–13285 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__card`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13289–13295 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__card--enter`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13297–13299 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__card--exit`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13301–13303 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__topic-tag`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13305–13316 (0.3 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__stem`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13318–13324 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__options`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13326–13330 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__option`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13332–13343 (0.3 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__option:hover:not(:disabled)`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13345–13348 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__option:active:not(:disabled)`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13350–13352 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__option--selected`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13354–13357 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__option-key`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13359–13373 (0.4 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__option--selected .nn-qs__option-key`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13375–13378 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__option-text`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13380–13384 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__nav`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13388–13391 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__btn`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13393–13408 (0.4 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__btn:hover:not(:disabled)`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13410–13413 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__btn:active:not(:disabled)`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13415–13417 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__btn:disabled`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13419–13422 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__btn--wide`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13424–13426 (0.0 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__link-secondary`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13428–13439 (0.3 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__link-secondary:hover`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13441–13443 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__hero`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13447–13452 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__hero-kicker`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13454–13461 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__hero-score-row`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13463–13467 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__hero-score`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13469–13475 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__hero-detail`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13477–13481 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__hero-correct`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13483–13487 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__hero-msg`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13489–13493 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__section`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13497–13502 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__section-header`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13504–13509 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__section-title`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13511–13515 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__weak-list`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13519–13523 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__weak-chip`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13525–13533 (0.3 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__review-line`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13537–13543 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__review-line:last-of-type`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13545–13547 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__review-lock`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13549–13556 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__cta-card`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13560–13574 (0.4 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__cta-title`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13576–13581 (0.1 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__cta-perks`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13583–13593 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__cta-perks li`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13595–13602 (0.2 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-qs__cta-perks li > svg`
- **Classification**: LEARNER_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-learner
- **Lines**: 13604–13606 (0.0 KB)
- **Files**: src/app/(student)/app/(learner)/quick-start/quick-start-flow-client.tsx

### `.nn-trial-blocked`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13648–13658 (0.4 KB)
- **Files**: src/components/auth/trial-blocked-card.tsx

### `.nn-trial-blocked__title`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13660–13664 (0.1 KB)
- **Files**: src/components/auth/trial-blocked-card.tsx

### `.nn-trial-blocked__body`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13666–13671 (0.1 KB)
- **Files**: src/components/auth/trial-blocked-card.tsx

### `.nn-trial-blocked__actions`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13673–13677 (0.1 KB)
- **Files**: src/components/auth/trial-blocked-card.tsx

### `.nn-trial-blocked__btn-primary`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13679–13690 (0.3 KB)
- **Files**: src/components/auth/trial-blocked-card.tsx

### `.nn-trial-blocked__btn-primary:hover`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13692–13694 (0.1 KB)
- **Files**: src/components/auth/trial-blocked-card.tsx

### `.nn-trial-blocked__btn-secondary`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13696–13708 (0.4 KB)
- **Files**: src/components/auth/trial-blocked-card.tsx

### `.nn-trial-blocked__btn-secondary:hover`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13710–13713 (0.1 KB)
- **Files**: src/components/auth/trial-blocked-card.tsx

### `.nn-verify-banner`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13717–13726 (0.3 KB)
- **Files**: src/components/auth/email-verification-banner.tsx

### `.nn-verify-banner__content`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13728–13732 (0.1 KB)
- **Files**: src/components/auth/email-verification-banner.tsx

### `.nn-verify-banner__text`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13734–13739 (0.1 KB)
- **Files**: src/components/auth/email-verification-banner.tsx

### `.nn-verify-banner__resend`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13741–13750 (0.2 KB)
- **Files**: src/components/auth/email-verification-banner.tsx

### `.nn-verify-banner__resend:hover`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13752–13754 (0.1 KB)
- **Files**: src/components/auth/email-verification-banner.tsx

### `.nn-verify-banner__resend:disabled`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13756–13759 (0.1 KB)
- **Files**: src/components/auth/email-verification-banner.tsx

### `.nn-verify-banner__sent`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13761–13765 (0.1 KB)
- **Files**: src/components/auth/email-verification-banner.tsx

### `.nn-verify-status`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13769–13778 (0.2 KB)
- **Files**: src/components/auth/verify-status-banner.tsx

### `.nn-verify-status--success`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13780–13784 (0.2 KB)
- **Files**: src/components/auth/verify-status-banner.tsx

### `.nn-verify-status--warning`
- **Classification**: UNKNOWN
- **Risk**: NEEDS_REVIEW
- **Recommendation**: keep-global
- **Lines**: 13786–13790 (0.3 KB)
- **Files**: src/components/auth/verify-status-banner.tsx

### `.nn-account-recovery-hint`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 13794–13799 (0.1 KB)
- **Files**: src/components/marketing/marketing-login-page.tsx

### `.nn-account-recovery-hint p`
- **Classification**: MARKETING_ONLY
- **Risk**: SAFE
- **Recommendation**: move-to-marketing
- **Lines**: 13801–13805 (0.1 KB)
- **Files**: src/components/marketing/marketing-login-page.tsx


## KEEP-GLOBAL Reference

The following blocks are classified GLOBAL_REQUIRED or HIGH_RISK and must remain in globals.css:

- Lines 1–1: `@import "tailwindcss";`
- Lines 2–2: `@import "./theme-palettes.css";`
- Lines 3–3: `@import "./color-roles.css";`
- Lines 4–4: `@import "./semantic-status-tokens.css";`
- Lines 8–8: `@import "./marketing-brand-atmosphere.css";`
- Lines 9–9: `@import "./full-platform-convergence.css";`
- Lines 10–10: `@import "./premium-color-depth-convergence.css";`
- Lines 11–11: `@import "./premium-atmospheric-ecosystem-convergence.css";`
- Lines 12–12: `@import "./premium-mobile-study-experience-audit.css";`
- Lines 13–13: `@import "./mobile-ux-standards.css";`
- Lines 15–19: `html,`
- Lines 47–51: `@media (prefers-reduced-motion: no-preference)`
- Lines 59–189: `:root`
- Lines 215–565: `html[data-theme]`
- Lines 572–580: `[data-theme]`
- Lines 583–735: `html[data-theme="dark-clinical"],`
- Lines 877–935: `@layer utilities`
- Lines 942–950: `body`
- Lines 952–954: `:where(html[lang="hi"], html[lang="hi"] body, [data-locale="hi"], [lang="hi"])`
- Lines 956–958: `:where(p, li, dd)`
- Lines 966–978: `:where(`
- Lines 981–985: `@keyframes nn-skeleton-pulse-soft`
- Lines 1003–1008: `@media (prefers-reduced-motion: reduce)`
- Lines 1081–1085: `@media (prefers-reduced-motion: reduce)`
- Lines 1220–1228: `html[data-theme="dark-clinical"] .nn-ui-btn--destructive,`
- Lines 1329–1333: `@media (min-width: 640px)`
- Lines 1346–1350: `@media (min-width: 640px)`
- Lines 1351–1355: `@media (min-width: 1024px)`
- Lines 1379–1388: `@keyframes nn-empty-state-fade`
- Lines 1461–1465: `@media (min-width: 640px)`
- Lines 1487–1494: `@media (min-width: 640px)`
- Lines 1613–1617: `@media (prefers-reduced-motion: reduce)`
- Lines 1647–1655: `html[data-theme] .nn-marketing-surface`
- Lines 1778–1782: `@media (min-width: 640px)`
- Lines 1905–1909: `@media (prefers-reduced-motion: no-preference)`
- Lines 2043–2047: `@media (min-width: 640px)`
- Lines 2174–2226: `@media (prefers-reduced-motion: reduce)`
- Lines 2257–2262: `@media (prefers-reduced-motion: no-preference)`
- Lines 2428–2464: `@media (min-width: 1024px)`
- Lines 2475–2479: `@media (min-width: 1024px)`
- Lines 2484–2488: `@media (min-width: 1024px)`
- Lines 2493–2497: `@media (min-width: 1024px)`
- Lines 2502–2506: `@media (min-width: 1024px)`
- Lines 2511–2515: `@media (min-width: 1024px)`
- Lines 2521–2525: `@media (min-width: 1024px)`
- Lines 2568–2572: `@media (min-width: 640px)`
- Lines 2573–2577: `@media (min-width: 1024px)`
- Lines 2644–2648: `@media (prefers-reduced-motion: reduce)`
- Lines 2693–2698: `@media (prefers-reduced-motion: no-preference)`
- Lines 2777–2781: `@media (prefers-reduced-motion: no-preference)`
- Lines 2790–2796: `html[data-theme] .nn-marketing-trust-strip`
- Lines 2844–2858: `@media (prefers-reduced-motion: no-preference)`
- Lines 3212–3218: `html[data-theme="dark-clinical"] .nn-trust-mark,`
- Lines 3240–3244: `@media (min-width: 768px)`
- Lines 3246–3255: `@keyframes heroFadeUp`
- Lines 3257–3266: `@keyframes pageEnter`
- Lines 3268–3277: `@keyframes nn-section-fade-up`
- Lines 3282–3291: `@keyframes nn-header-enter`
- Lines 3299–3306: `@keyframes nn-overlay-enter`
- Lines 3308–3317: `@keyframes nn-success-reveal`
- Lines 3319–3326: `@keyframes nn-drawer-slide-in`
- Lines 3328–3337: `@keyframes nn-mega-panel-enter`
- Lines 3352–3361: `@keyframes nn-skeleton-fade-in`
- Lines 3368–3376: `@keyframes nn-skeleton-soft-pulse`
- Lines 3382–3389: `@keyframes nn-drawer-slide-up`
- Lines 3391–3416: `@media (prefers-reduced-motion: reduce)`
- Lines 3425–3430: `@media (min-width: 640px)`
- Lines 3431–3436: `@media (min-width: 1024px)`
- Lines 3471–3477: `@media (min-width: 640px)`
- Lines 3486–3494: `@media (min-width: 640px)`
- Lines 3511–3517: `@media (min-width: 768px)`
- Lines 3520–3595: `@media (min-width: 1024px)`
- Lines 3747–3751: `@media (min-width: 640px)`
- Lines 3771–3775: `@media (min-width: 640px)`
- Lines 3895–3900: `@media (max-width: 767.98px)`
- Lines 3902–3908: `@media (min-width: 768px)`
- Lines 3910–3915: `@media (min-width: 1024px)`
- Lines 4006–4012: `@media (min-width: 640px)`
- Lines 4145–4149: `@media (min-width: 640px)`
- Lines 4151–4159: `@media (prefers-reduced-motion: no-preference)`
- Lines 4336–4340: `@media (min-width: 640px)`
- Lines 4352–4356: `@media (min-width: 1024px)`
- Lines 4459–4463: `@media (min-width: 480px)`
- Lines 4465–4469: `@media (min-width: 760px)`
- Lines 4558–4564: `@media (min-width: 768px)`
- Lines 4588–4601: `@media (min-width: 1024px) and (max-width: 1279px)`
- Lines 4603–4620: `@media (min-width: 1280px)`
- Lines 4630–4636: `@media (max-width: 767px)`
- Lines 4685–4705: `@media (min-width: 1024px)`
- Lines 4938–4949: `@media (max-width: 520px)`
- Lines 4970–4982: `@media (prefers-reduced-motion: no-preference)`
- Lines 4984–4988: `@media (prefers-reduced-motion: reduce)`
- Lines 4990–5001: `@keyframes nn-lesson-leaf-pulse`
- Lines 5092–5100: `@media (prefers-reduced-motion: no-preference)`
- Lines 5107–5112: `@media (min-width: 768px)`
- Lines 5116–5125: `html[data-theme="dark-clinical"] .nn-lesson-article-flow::before,`
- Lines 5127–5137: `html[data-theme="dark-clinical"] .nn-lesson-article-flow .nn-lesson-section-card`
- Lines 5139–5149: `html[data-theme="dark-clinical"] .nn-lesson-article-flow .nn-lesson-section-card`
- Lines 5165–5169: `@media (min-width: 640px)`
- Lines 5171–5176: `@media (prefers-reduced-motion: no-preference)`
- Lines 5325–5329: `@media (min-width: 640px)`
- Lines 5345–5350: `@media (min-width: 640px)`
- Lines 5353–5359: `@media (min-width: 1100px)`
- Lines 5387–5397: `@media (min-width: 1100px)`
- Lines 5422–5426: `@media (min-width: 768px)`
- Lines 5462–5466: `@media (min-width: 640px)`
- Lines 5566–5570: `@media (min-width: 640px)`
- Lines 5580–5584: `@media (prefers-reduced-motion: reduce)`
- Lines 5586–5591: `@media (prefers-reduced-motion: no-preference)`
- Lines 5593–5597: `@media (prefers-reduced-motion: reduce)`
- Lines 5623–5630: `html[data-theme="dark-clinical"] .nn-qopt-surface--incorrect,`
- Lines 5676–5684: `html[data-theme="dark-clinical"] .nn-qopt-surface--incorrect .nn-qopt-letter,`
- Lines 5703–5708: `@media (prefers-reduced-motion: reduce)`
- Lines 5711–5727: `@keyframes nn-qopt-verdict-success-pulse`
- Lines 5729–5739: `@keyframes nn-qopt-verdict-incorrect-soft`
- Lines 5741–5749: `@media (prefers-reduced-motion: no-preference)`
- Lines 5760–5764: `@media (prefers-reduced-motion: reduce)`
- Lines 5787–5791: `@keyframes nn-skeleton-shimmer`
- Lines 5793–5797: `@media (prefers-reduced-motion: reduce)`
- Lines 5846–5852: `html[data-theme="dark-clinical"] .nn-question-rationale-card__verdict--miss,`
- Lines 5885–5890: `@media (min-width: 640px)`
- Lines 5893–5906: `@media (max-width: 1023px)`
- Lines 5909–5922: `@media (max-width: 1023px)`
- Lines 5929–5934: `@media (min-width: 640px)`
- Lines 5979–5984: `@media (min-width: 768px)`
- Lines 6060–6068: `@media (prefers-reduced-motion: reduce)`
- Lines 6508–6512: `html[data-theme] .nn-exam-session`
- Lines 6515–6521: `html[data-theme] .nn-exam-session.nn-exam-session--neutral`
- Lines 6558–6565: `html[data-theme="dark-clinical"] .nn-exam-session:not(.nn-exam-session--neutral)`
- Lines 6592–6596: `@media (prefers-reduced-motion: no-preference)`
- Lines 6598–6607: `@keyframes nn-rationale-body-enter`
- Lines 6609–6613: `@media (prefers-reduced-motion: reduce)`
- Lines 6636–6640: `@media (prefers-reduced-motion: reduce)`
- Lines 6642–6646: `@keyframes nn-skeleton-shimmer`
- Lines 6648–6659: `@media (hover: hover) and (prefers-reduced-motion: no-preference)`
- Lines 6661–6665: `@media (prefers-reduced-motion: reduce)`
- Lines 6700–6708: `@keyframes nn-not-found-float`
- Lines 6710–6714: `@media (prefers-reduced-motion: no-preference)`
- Lines 6716–6720: `@media (prefers-reduced-motion: reduce)`
- Lines 6732–6736: `html[data-theme] .nn-exam-session.nn-cat-exam-session`
- Lines 6739–6746: `html[data-theme="dark-clinical"] .nn-exam-session.nn-cat-exam-session,`
- Lines 6755–6759: `@media (min-width: 640px)`
- Lines 6783–6787: `@media (prefers-reduced-motion: reduce)`
- Lines 6796–6800: `@media (min-width: 640px)`
- Lines 6802–6806: `@media (min-width: 1024px)`
- Lines 6838–6844: `@media (min-width: 768px)`
- Lines 6874–6878: `@media (prefers-reduced-motion: no-preference)`
- Lines 6891–6895: `@media (min-width: 640px)`
- Lines 6932–6938: `@media (min-width: 1024px)`
- Lines 6951–6955: `@media (min-width: 640px)`
- Lines 6965–6969: `@media (min-width: 640px)`
- Lines 6994–6998: `@media (min-width: 1024px)`
- Lines 7005–7009: `@media (min-width: 640px)`
- Lines 7011–7015: `@media (min-width: 1024px)`
- Lines 7023–7028: `@media (min-width: 1100px)`
- Lines 7058–7062: `@media (min-width: 640px)`
- Lines 7181–7185: `@media (prefers-reduced-motion: no-preference)`
- Lines 7296–7300: `@media (min-width: 640px)`
- Lines 7309–7313: `@media (max-width: 400px)`
- Lines 7418–7422: `@media (prefers-reduced-motion: reduce)`
- Lines 7513–7517: `@media (prefers-reduced-motion: reduce)`
- Lines 7528–7533: `@media (min-width: 1024px)`
- Lines 7598–7605: `@media (min-width: 640px)`
- Lines 7637–7641: `@media (max-height: 900px)`
- Lines 7643–7651: `@media (prefers-reduced-motion: reduce)`
- Lines 7663–7668: `@media (min-width: 640px)`
- Lines 7675–7680: `@media (max-width: 639px)`
- Lines 7689–7693: `@media (min-width: 640px)`
- Lines 7706–7711: `@media (min-width: 768px)`
- Lines 7836–7891: `@media (max-height: 900px)`
- Lines 7894–7923: `@media (max-height: 768px)`
- Lines 7929–7968: `@media (max-width: 639.98px)`
- Lines 7970–7986: `@media (min-width: 1024px) and (max-height: 900px)`
- Lines 8042–8113: `@media (min-width: 1024px)`
- Lines 8125–8130: `@media (max-height: 900px)`
- Lines 8132–8137: `@media (max-height: 720px)`
- Lines 8149–8153: `@media (max-width: 639px)`
- Lines 8186–8191: `@media (max-width: 639px)`
- Lines 8267–8273: `html[data-theme="dark-clinical"] .nn-cat-opt--incorrect,`
- Lines 8383–8388: `@media (prefers-reduced-motion: reduce)`
- Lines 8405–8411: `@media (max-width: 1023px)`
- Lines 8497–8508: `@media (max-width: 767px)`
- Lines 8518–8522: `@media (max-width: 639px)`
- Lines 8555–8560: `@media (max-width: 639px)`
- Lines 8562–8566: `@media (min-width: 640px) and (max-width: 767px)`
- Lines 8579–8583: `@media (prefers-reduced-motion: reduce)`
- Lines 8624–8628: `@media (prefers-reduced-motion: reduce)`
- Lines 8667–8671: `@media (prefers-reduced-motion: reduce)`
- Lines 8705–8709: `@media (prefers-reduced-motion: reduce)`
- Lines 8711–8715: `@media (max-width: 639px)`
- Lines 8726–8730: `@media (prefers-reduced-motion: reduce)`
- Lines 8768–8772: `@media (prefers-reduced-motion: reduce)`
- Lines 8871–8876: `@media (max-width: 479px)`
- Lines 8916–8920: `@media (max-width: 767px)`
- Lines 8973–8978: `@media (max-width: 639px)`
- Lines 9037–9044: `@media (min-width: 1024px)`
- Lines 9046–9050: `@media (max-width: 639px)`
- Lines 9107–9111: `@media (prefers-reduced-motion: reduce)`
- Lines 9122–9138: `@media (min-width: 1100px)`
- Lines 9158–9163: `@media (min-width: 640px)`
- Lines 9337–9348: `@media (max-width: 767px)`
- Lines 9384–9389: `@media (min-width: 640px)`
- Lines 9759–9763: `@media (min-width: 640px)`
- Lines 10380–10396: `@media (max-width: 639px)`
- Lines 10785–10801: `@media (max-width: 639px)`
- Lines 11362–11369: `@media (min-width: 640px)`
- Lines 11439–11456: `@media (max-width: 1023px)`
- Lines 11457–11464: `@media (min-width: 1024px)`
- Lines 11510–11514: `@media (min-width: 1024px)`
- Lines 11525–11531: `@media (min-width: 1024px)`
- Lines 11548–11557: `@media (min-width: 1024px)`
- Lines 11585–11590: `@media (min-width: 1024px)`
- Lines 11607–11612: `@media (min-width: 640px)`
- Lines 11621–11625: `@media (min-width: 640px)`
- Lines 11657–11661: `@media (min-width: 640px)`
- Lines 11698–11702: `@media (min-width: 640px)`
- Lines 11708–11715: `@media (min-width: 768px)`
- Lines 11776–11784: `@media (min-width: 640px)`
- Lines 11791–11795: `@media (min-width: 640px)`
- Lines 11818–11825: `@media (min-width: 640px)`
- Lines 11826–11830: `@media (min-width: 768px)`
- Lines 11837–11841: `@media (min-width: 640px)`
- Lines 11857–11862: `@media (min-width: 900px)`
- Lines 11900–11904: `@media (min-width: 640px)`
- Lines 11922–11928: `@media (min-width: 1024px)`
- Lines 11950–11954: `@media (min-width: 640px)`
- Lines 12098–12105: `@media (min-width: 1180px)`
- Lines 12107–12138: `@media (min-width: 1180px)`
- Lines 12158–12162: `@media (min-width: 1024px)`
- Lines 12178–12184: `@media (min-width: 640px)`
- Lines 12222–12226: `@media (min-width: 640px)`
- Lines 12260–12264: `@media (min-width: 640px)`
- Lines 12345–12349: `@media (min-width: 640px)`
- Lines 12395–12399: `@media (min-width: 640px)`
- Lines 13118–13123: `@media (min-width: 640px)`
- Lines 13153–13156: `@keyframes nn-qs-fade-in`
- Lines 13158–13161: `@keyframes nn-qs-card-enter`
- Lines 13163–13166: `@keyframes nn-qs-card-exit`
- Lines 13168–13170: `@keyframes nn-qs-spin`
- Lines 13610–13640: `@media (max-width: 480px)`
- Lines 13812–13926: `@media (max-width: 768px)`
