# Marketing translation backlog (audit → roadmap)

**Source of truth:** `tools/i18n/marketing/marketing-en.json`
**Definition of “missing”:** key is absent from `tools/i18n/marketing/locale/marketing-<locale>.json` (no value in overlay file).
**Planning only:** no translations in this document.

## Executive summary

English key count: **1451** (flat keys in `marketing-en.json`).

| Locale | Missing keys | Notes |
|--------|---------------:|-------|
| `ar` | 1238 | Top 100 in locale section below |
| `de` | 1238 | Top 100 in locale section below |
| `es` | 292 | Top 100 in locale section below |
| `fa` | 1238 | Top 100 in locale section below |
| `fr` | 263 | Top 100 in locale section below |
| `hi` | 1238 | Top 100 in locale section below |
| `ht` | 1238 | Top 100 in locale section below |
| `id` | 1238 | Top 100 in locale section below |
| `ja` | 1238 | Top 100 in locale section below |
| `ko` | 1238 | Top 100 in locale section below |
| `pa` | 1238 | Top 100 in locale section below |
| `pt` | 1238 | Top 100 in locale section below |
| `th` | 1238 | Top 100 in locale section below |
| `tl` | 292 | Top 100 in locale section below |
| `tr` | 1238 | Top 100 in locale section below |
| `ur` | 1238 | Top 100 in locale section below |
| `vi` | 1238 | Top 100 in locale section below |
| `zh-tw` | 1238 | Top 100 in locale section below |
| `zh` | 1238 | Top 100 in locale section below |

Locales with **0** missing still need QA for English-identical strings in overlays; this backlog only tracks **absent** keys.

---
## Recommended translation order (global)

Work in this order to maximize conversion and first-session quality:

1. **Pricing** — checkout, plans, narratives, segment copy.
2. **Paywall** — entitlement and upgrade messaging.
3. **Homepage** — hero, social proof, email capture, primary landing.
4. **Nav** — header labels, exam strip, wayfinding.
5. **Footer** — links, trust, secondary navigation.
6. **Auth** — login/signup and `auth.*` where present.
7. **Other** — remaining keys (components, tools, SEO meta, etc.) after scoped groups.

Within each group, translate in **lexical key order** unless PM designates a subset.

---

## Locale: `ar`

| Group | Missing count |
|-------|----------------:|
| Pricing (`pages.pricing.*`) | 118 |
| Paywall (`paywall.*`) | 35 |
| Homepage (`home.*`, `pages.home.*`) | 393 |
| Navigation (`nav.*`) | 36 |
| Footer (`footer.*`) | 43 |
| Auth (`pages.login.*`, `pages.signup.*`, `auth.*`) | 17 |
| Other (not in scoped groups) | 596 |
| **Total missing** | **1238** |

### Top 100 missing keys (impact order: pricing → paywall → homepage → nav → footer → auth → other)

#### Pricing (`pages.pricing.*`)

- `pages.pricing.billing.heading`
- `pages.pricing.billing.helper`
- `pages.pricing.billing.recurringDisclosure`
- `pages.pricing.checkout.comingSoon`
- `pages.pricing.checkout.continue`
- `pages.pricing.checkout.mustAcceptPolicies`
- `pages.pricing.checkout.policyAckBetween1`
- `pages.pricing.checkout.policyAckBetween2`
- `pages.pricing.checkout.policyAckEnd`
- `pages.pricing.checkout.policyAckStart`
- `pages.pricing.checkout.policyPrivacyLabel`
- `pages.pricing.checkout.policyRefundLabel`
- `pages.pricing.checkout.policyTermsLabel`
- `pages.pricing.checkout.recurringShort`
- `pages.pricing.country.ca`
- `pages.pricing.country.us`
- `pages.pricing.countryLabel`
- `pages.pricing.description`
- `pages.pricing.duration.3month`
- `pages.pricing.duration.6month`
- `pages.pricing.duration.monthly`
- `pages.pricing.duration.yearly`
- `pages.pricing.error.checkoutNetwork`
- `pages.pricing.error.checkoutSignIn`
- `pages.pricing.error.checkoutUnavailable`
- `pages.pricing.error.loadPlans`
- `pages.pricing.h1`
- `pages.pricing.institutionalBanner`
- `pages.pricing.institutionalLink`
- `pages.pricing.intro`
- `pages.pricing.narrative.allied.headline`
- `pages.pricing.narrative.allied.headlineOutcome`
- `pages.pricing.narrative.allied.headlineUrgency`
- `pages.pricing.narrative.allied.included0`
- `pages.pricing.narrative.allied.included1`
- `pages.pricing.narrative.allied.included2`
- `pages.pricing.narrative.allied.included3`
- `pages.pricing.narrative.allied.outcome0`
- `pages.pricing.narrative.allied.outcome1`
- `pages.pricing.narrative.allied.outcome2`
- `pages.pricing.narrative.allied.proofLine`
- `pages.pricing.narrative.allied.subhead`
- `pages.pricing.narrative.lvn_lpn.headline`
- `pages.pricing.narrative.lvn_lpn.headlineOutcome`
- `pages.pricing.narrative.lvn_lpn.headlineUrgency`
- `pages.pricing.narrative.lvn_lpn.included0`
- `pages.pricing.narrative.lvn_lpn.included1`
- `pages.pricing.narrative.lvn_lpn.included2`
- `pages.pricing.narrative.lvn_lpn.included3`
- `pages.pricing.narrative.lvn_lpn.outcome0`
- `pages.pricing.narrative.lvn_lpn.outcome1`
- `pages.pricing.narrative.lvn_lpn.outcome2`
- `pages.pricing.narrative.lvn_lpn.proofLine`
- `pages.pricing.narrative.lvn_lpn.subhead`
- `pages.pricing.narrative.np.headline`
- `pages.pricing.narrative.np.headlineOutcome`
- `pages.pricing.narrative.np.headlineUrgency`
- `pages.pricing.narrative.np.included0`
- `pages.pricing.narrative.np.included1`
- `pages.pricing.narrative.np.included2`
- `pages.pricing.narrative.np.included3`
- `pages.pricing.narrative.np.outcome0`
- `pages.pricing.narrative.np.outcome1`
- `pages.pricing.narrative.np.outcome2`
- `pages.pricing.narrative.np.proofLine`
- `pages.pricing.narrative.np.subhead`
- `pages.pricing.narrative.rn.headline`
- `pages.pricing.narrative.rn.headlineOutcome`
- `pages.pricing.narrative.rn.headlineUrgency`
- `pages.pricing.narrative.rn.included0`
- `pages.pricing.narrative.rn.included1`
- `pages.pricing.narrative.rn.included2`
- `pages.pricing.narrative.rn.included3`
- `pages.pricing.narrative.rn.outcome0`
- `pages.pricing.narrative.rn.outcome1`
- `pages.pricing.narrative.rn.outcome2`
- `pages.pricing.narrative.rn.proofLine`
- `pages.pricing.narrative.rn.subhead`
- `pages.pricing.narrative.rpn.headline`
- `pages.pricing.narrative.rpn.headlineOutcome`
- `pages.pricing.narrative.rpn.headlineUrgency`
- `pages.pricing.narrative.rpn.included0`
- `pages.pricing.narrative.rpn.included1`
- `pages.pricing.narrative.rpn.included2`
- `pages.pricing.narrative.rpn.included3`
- `pages.pricing.narrative.rpn.outcome0`
- `pages.pricing.narrative.rpn.outcome1`
- `pages.pricing.narrative.rpn.outcome2`
- `pages.pricing.narrative.rpn.proofLine`
- `pages.pricing.narrative.rpn.subhead`
- `pages.pricing.narrative.variant.urgencyLine`
- `pages.pricing.plan.avgSuffix`
- `pages.pricing.plan.bestValue`
- `pages.pricing.plan.saveVsMonthly`
- `pages.pricing.preview.badge`
- `pages.pricing.preview.body`
- `pages.pricing.preview.metricAccuracy`
- `pages.pricing.preview.metricAccuracyCaption`
- `pages.pricing.preview.metricsLabel`
- `pages.pricing.preview.metricStreak`

*…and 1138 additional missing keys after the top 100 (continue in the same priority order).*

---

## Locale: `de`

| Group | Missing count |
|-------|----------------:|
| Pricing (`pages.pricing.*`) | 118 |
| Paywall (`paywall.*`) | 35 |
| Homepage (`home.*`, `pages.home.*`) | 393 |
| Navigation (`nav.*`) | 36 |
| Footer (`footer.*`) | 43 |
| Auth (`pages.login.*`, `pages.signup.*`, `auth.*`) | 17 |
| Other (not in scoped groups) | 596 |
| **Total missing** | **1238** |

### Top 100 missing keys (impact order: pricing → paywall → homepage → nav → footer → auth → other)

#### Pricing (`pages.pricing.*`)

- `pages.pricing.billing.heading`
- `pages.pricing.billing.helper`
- `pages.pricing.billing.recurringDisclosure`
- `pages.pricing.checkout.comingSoon`
- `pages.pricing.checkout.continue`
- `pages.pricing.checkout.mustAcceptPolicies`
- `pages.pricing.checkout.policyAckBetween1`
- `pages.pricing.checkout.policyAckBetween2`
- `pages.pricing.checkout.policyAckEnd`
- `pages.pricing.checkout.policyAckStart`
- `pages.pricing.checkout.policyPrivacyLabel`
- `pages.pricing.checkout.policyRefundLabel`
- `pages.pricing.checkout.policyTermsLabel`
- `pages.pricing.checkout.recurringShort`
- `pages.pricing.country.ca`
- `pages.pricing.country.us`
- `pages.pricing.countryLabel`
- `pages.pricing.description`
- `pages.pricing.duration.3month`
- `pages.pricing.duration.6month`
- `pages.pricing.duration.monthly`
- `pages.pricing.duration.yearly`
- `pages.pricing.error.checkoutNetwork`
- `pages.pricing.error.checkoutSignIn`
- `pages.pricing.error.checkoutUnavailable`
- `pages.pricing.error.loadPlans`
- `pages.pricing.h1`
- `pages.pricing.institutionalBanner`
- `pages.pricing.institutionalLink`
- `pages.pricing.intro`
- `pages.pricing.narrative.allied.headline`
- `pages.pricing.narrative.allied.headlineOutcome`
- `pages.pricing.narrative.allied.headlineUrgency`
- `pages.pricing.narrative.allied.included0`
- `pages.pricing.narrative.allied.included1`
- `pages.pricing.narrative.allied.included2`
- `pages.pricing.narrative.allied.included3`
- `pages.pricing.narrative.allied.outcome0`
- `pages.pricing.narrative.allied.outcome1`
- `pages.pricing.narrative.allied.outcome2`
- `pages.pricing.narrative.allied.proofLine`
- `pages.pricing.narrative.allied.subhead`
- `pages.pricing.narrative.lvn_lpn.headline`
- `pages.pricing.narrative.lvn_lpn.headlineOutcome`
- `pages.pricing.narrative.lvn_lpn.headlineUrgency`
- `pages.pricing.narrative.lvn_lpn.included0`
- `pages.pricing.narrative.lvn_lpn.included1`
- `pages.pricing.narrative.lvn_lpn.included2`
- `pages.pricing.narrative.lvn_lpn.included3`
- `pages.pricing.narrative.lvn_lpn.outcome0`
- `pages.pricing.narrative.lvn_lpn.outcome1`
- `pages.pricing.narrative.lvn_lpn.outcome2`
- `pages.pricing.narrative.lvn_lpn.proofLine`
- `pages.pricing.narrative.lvn_lpn.subhead`
- `pages.pricing.narrative.np.headline`
- `pages.pricing.narrative.np.headlineOutcome`
- `pages.pricing.narrative.np.headlineUrgency`
- `pages.pricing.narrative.np.included0`
- `pages.pricing.narrative.np.included1`
- `pages.pricing.narrative.np.included2`
- `pages.pricing.narrative.np.included3`
- `pages.pricing.narrative.np.outcome0`
- `pages.pricing.narrative.np.outcome1`
- `pages.pricing.narrative.np.outcome2`
- `pages.pricing.narrative.np.proofLine`
- `pages.pricing.narrative.np.subhead`
- `pages.pricing.narrative.rn.headline`
- `pages.pricing.narrative.rn.headlineOutcome`
- `pages.pricing.narrative.rn.headlineUrgency`
- `pages.pricing.narrative.rn.included0`
- `pages.pricing.narrative.rn.included1`
- `pages.pricing.narrative.rn.included2`
- `pages.pricing.narrative.rn.included3`
- `pages.pricing.narrative.rn.outcome0`
- `pages.pricing.narrative.rn.outcome1`
- `pages.pricing.narrative.rn.outcome2`
- `pages.pricing.narrative.rn.proofLine`
- `pages.pricing.narrative.rn.subhead`
- `pages.pricing.narrative.rpn.headline`
- `pages.pricing.narrative.rpn.headlineOutcome`
- `pages.pricing.narrative.rpn.headlineUrgency`
- `pages.pricing.narrative.rpn.included0`
- `pages.pricing.narrative.rpn.included1`
- `pages.pricing.narrative.rpn.included2`
- `pages.pricing.narrative.rpn.included3`
- `pages.pricing.narrative.rpn.outcome0`
- `pages.pricing.narrative.rpn.outcome1`
- `pages.pricing.narrative.rpn.outcome2`
- `pages.pricing.narrative.rpn.proofLine`
- `pages.pricing.narrative.rpn.subhead`
- `pages.pricing.narrative.variant.urgencyLine`
- `pages.pricing.plan.avgSuffix`
- `pages.pricing.plan.bestValue`
- `pages.pricing.plan.saveVsMonthly`
- `pages.pricing.preview.badge`
- `pages.pricing.preview.body`
- `pages.pricing.preview.metricAccuracy`
- `pages.pricing.preview.metricAccuracyCaption`
- `pages.pricing.preview.metricsLabel`
- `pages.pricing.preview.metricStreak`

*…and 1138 additional missing keys after the top 100 (continue in the same priority order).*

---

## Locale: `es`

| Group | Missing count |
|-------|----------------:|
| Pricing (`pages.pricing.*`) | 0 |
| Paywall (`paywall.*`) | 0 |
| Homepage (`home.*`, `pages.home.*`) | 0 |
| Navigation (`nav.*`) | 0 |
| Footer (`footer.*`) | 0 |
| Auth (`pages.login.*`, `pages.signup.*`, `auth.*`) | 0 |
| Other (not in scoped groups) | 292 |
| **Total missing** | **292** |

### Top 100 missing keys (impact order: pricing → paywall → homepage → nav → footer → auth → other)

#### Other (not in scoped groups)

- `learner.entitlement.flashcardsShort`
- `learner.entitlement.verifyFailed`
- `learner.entitlement.verifyFailedShort`
- `learner.error.app.description`
- `learner.error.app.retry`
- `learner.error.app.title`
- `learner.error.section.dashboard`
- `learner.error.section.description`
- `learner.error.section.title`
- `learner.error.section.tryAgain`
- `learner.examPractice.chooseMode`
- `learner.examPractice.disclaimer`
- `learner.examPractice.emptySuffix`
- `learner.examPractice.loadQuestionFailed`
- `learner.examPractice.networkStart`
- `learner.examPractice.preparing`
- `learner.examPractice.recordAttemptFailed`
- `learner.examPractice.retry`
- `learner.examPractice.sessionLoadFailed`
- `learner.examPractice.timed`
- `learner.examPractice.timedButton`
- `learner.examPractice.timedModeHint`
- `learner.examPractice.untimed`
- `learner.exams.page.afterSubscribe.li1`
- `learner.exams.page.afterSubscribe.li2`
- `learner.exams.page.afterSubscribe.li3`
- `learner.exams.page.afterSubscribe.title`
- `learner.exams.page.defaultExamBody`
- `learner.exams.page.defaultExamTitle`
- `learner.exams.page.historyLoadFailed`
- `learner.exams.page.latestAttempt`
- `learner.exams.page.latestStrong`
- `learner.exams.page.latestWeak`
- `learner.exams.page.noAttempts`
- `learner.exams.page.openQuestionBankArrow`
- `learner.exams.page.reportCardBody`
- `learner.exams.page.reportCardTitle`
- `learner.exams.page.subscriberIntro`
- `learner.exams.page.subtitle.locked`
- `learner.exams.page.title`
- `learner.exams.shell.backToDashboard`
- `learner.exams.shell.signIn`
- `learner.exams.shell.signInToPractice`
- `learner.examSession.empty.bankEmptyGlobal.body`
- `learner.examSession.empty.bankEmptyGlobal.title`
- `learner.examSession.empty.default.body`
- `learner.examSession.empty.default.title`
- `learner.examSession.empty.entitlementExcludesAll.body`
- `learner.examSession.empty.entitlementExcludesAll.title`
- `learner.examSession.empty.indeterminate.body`
- `learner.examSession.empty.indeterminate.title`
- `learner.examSession.start.cannotStart`
- `learner.examSession.start.examNotInPlan`
- `learner.examSession.start.examUnavailable`
- `learner.examSession.start.generic`
- `learner.examSession.start.serviceUnavailable`
- `learner.examSession.start.signInAgain`
- `learner.examSession.start.startFailed503`
- `learner.examSession.start.subscriptionRequired`
- `learner.flashcards.hub.allTags`
- `learner.flashcards.hub.bestStreak`
- `learner.flashcards.hub.bottomExamLessons`
- `learner.flashcards.hub.bottomQuestionBank`
- `learner.flashcards.hub.cardsCount`
- `learner.flashcards.hub.dayStreak`
- `learner.flashcards.hub.deckMetaPathway`
- `learner.flashcards.hub.dueToday`
- `learner.flashcards.hub.emptyLink`
- `learner.flashcards.hub.emptyPrefix`
- `learner.flashcards.hub.examFamilyAll`
- `learner.flashcards.hub.filterExamFamily`
- `learner.flashcards.hub.filterPathway`
- `learner.flashcards.hub.learning`
- `learner.flashcards.hub.loadDecksFailed`
- `learner.flashcards.hub.loadingDecks`
- `learner.flashcards.hub.next`
- `learner.flashcards.hub.overdue`
- `learner.flashcards.hub.pageOf`
- `learner.flashcards.hub.paginationAria`
- `learner.flashcards.hub.pathwayAll`
- `learner.flashcards.hub.previous`
- `learner.flashcards.hub.publicSeoCta`
- `learner.flashcards.hub.reviews`
- `learner.flashcards.hub.search`
- `learner.flashcards.hub.searchDecksLabel`
- `learner.flashcards.hub.searchPlaceholder`
- `learner.flashcards.hub.study`
- `learner.flashcards.hub.studyShuffled`
- `learner.flashcards.hub.subscribeUnlock`
- `learner.flashcards.hub.subscriptionRequired`
- `learner.flashcards.hub.subtitle`
- `learner.flashcards.hub.tagsPrefix`
- `learner.flashcards.hub.title`
- `learner.flashcards.hub.topicTag`
- `learner.flashcards.hub.weakAreasCta`
- `learner.flashcards.page.subtitle.locked`
- `learner.flashcards.page.title`
- `learner.loading.app`
- `learner.loading.flashcards`
- `learner.loading.questionBank`

*…and 192 additional missing keys after the top 100 (continue in the same priority order).*

---

## Locale: `fa`

| Group | Missing count |
|-------|----------------:|
| Pricing (`pages.pricing.*`) | 118 |
| Paywall (`paywall.*`) | 35 |
| Homepage (`home.*`, `pages.home.*`) | 393 |
| Navigation (`nav.*`) | 36 |
| Footer (`footer.*`) | 43 |
| Auth (`pages.login.*`, `pages.signup.*`, `auth.*`) | 17 |
| Other (not in scoped groups) | 596 |
| **Total missing** | **1238** |

### Top 100 missing keys (impact order: pricing → paywall → homepage → nav → footer → auth → other)

#### Pricing (`pages.pricing.*`)

- `pages.pricing.billing.heading`
- `pages.pricing.billing.helper`
- `pages.pricing.billing.recurringDisclosure`
- `pages.pricing.checkout.comingSoon`
- `pages.pricing.checkout.continue`
- `pages.pricing.checkout.mustAcceptPolicies`
- `pages.pricing.checkout.policyAckBetween1`
- `pages.pricing.checkout.policyAckBetween2`
- `pages.pricing.checkout.policyAckEnd`
- `pages.pricing.checkout.policyAckStart`
- `pages.pricing.checkout.policyPrivacyLabel`
- `pages.pricing.checkout.policyRefundLabel`
- `pages.pricing.checkout.policyTermsLabel`
- `pages.pricing.checkout.recurringShort`
- `pages.pricing.country.ca`
- `pages.pricing.country.us`
- `pages.pricing.countryLabel`
- `pages.pricing.description`
- `pages.pricing.duration.3month`
- `pages.pricing.duration.6month`
- `pages.pricing.duration.monthly`
- `pages.pricing.duration.yearly`
- `pages.pricing.error.checkoutNetwork`
- `pages.pricing.error.checkoutSignIn`
- `pages.pricing.error.checkoutUnavailable`
- `pages.pricing.error.loadPlans`
- `pages.pricing.h1`
- `pages.pricing.institutionalBanner`
- `pages.pricing.institutionalLink`
- `pages.pricing.intro`
- `pages.pricing.narrative.allied.headline`
- `pages.pricing.narrative.allied.headlineOutcome`
- `pages.pricing.narrative.allied.headlineUrgency`
- `pages.pricing.narrative.allied.included0`
- `pages.pricing.narrative.allied.included1`
- `pages.pricing.narrative.allied.included2`
- `pages.pricing.narrative.allied.included3`
- `pages.pricing.narrative.allied.outcome0`
- `pages.pricing.narrative.allied.outcome1`
- `pages.pricing.narrative.allied.outcome2`
- `pages.pricing.narrative.allied.proofLine`
- `pages.pricing.narrative.allied.subhead`
- `pages.pricing.narrative.lvn_lpn.headline`
- `pages.pricing.narrative.lvn_lpn.headlineOutcome`
- `pages.pricing.narrative.lvn_lpn.headlineUrgency`
- `pages.pricing.narrative.lvn_lpn.included0`
- `pages.pricing.narrative.lvn_lpn.included1`
- `pages.pricing.narrative.lvn_lpn.included2`
- `pages.pricing.narrative.lvn_lpn.included3`
- `pages.pricing.narrative.lvn_lpn.outcome0`
- `pages.pricing.narrative.lvn_lpn.outcome1`
- `pages.pricing.narrative.lvn_lpn.outcome2`
- `pages.pricing.narrative.lvn_lpn.proofLine`
- `pages.pricing.narrative.lvn_lpn.subhead`
- `pages.pricing.narrative.np.headline`
- `pages.pricing.narrative.np.headlineOutcome`
- `pages.pricing.narrative.np.headlineUrgency`
- `pages.pricing.narrative.np.included0`
- `pages.pricing.narrative.np.included1`
- `pages.pricing.narrative.np.included2`
- `pages.pricing.narrative.np.included3`
- `pages.pricing.narrative.np.outcome0`
- `pages.pricing.narrative.np.outcome1`
- `pages.pricing.narrative.np.outcome2`
- `pages.pricing.narrative.np.proofLine`
- `pages.pricing.narrative.np.subhead`
- `pages.pricing.narrative.rn.headline`
- `pages.pricing.narrative.rn.headlineOutcome`
- `pages.pricing.narrative.rn.headlineUrgency`
- `pages.pricing.narrative.rn.included0`
- `pages.pricing.narrative.rn.included1`
- `pages.pricing.narrative.rn.included2`
- `pages.pricing.narrative.rn.included3`
- `pages.pricing.narrative.rn.outcome0`
- `pages.pricing.narrative.rn.outcome1`
- `pages.pricing.narrative.rn.outcome2`
- `pages.pricing.narrative.rn.proofLine`
- `pages.pricing.narrative.rn.subhead`
- `pages.pricing.narrative.rpn.headline`
- `pages.pricing.narrative.rpn.headlineOutcome`
- `pages.pricing.narrative.rpn.headlineUrgency`
- `pages.pricing.narrative.rpn.included0`
- `pages.pricing.narrative.rpn.included1`
- `pages.pricing.narrative.rpn.included2`
- `pages.pricing.narrative.rpn.included3`
- `pages.pricing.narrative.rpn.outcome0`
- `pages.pricing.narrative.rpn.outcome1`
- `pages.pricing.narrative.rpn.outcome2`
- `pages.pricing.narrative.rpn.proofLine`
- `pages.pricing.narrative.rpn.subhead`
- `pages.pricing.narrative.variant.urgencyLine`
- `pages.pricing.plan.avgSuffix`
- `pages.pricing.plan.bestValue`
- `pages.pricing.plan.saveVsMonthly`
- `pages.pricing.preview.badge`
- `pages.pricing.preview.body`
- `pages.pricing.preview.metricAccuracy`
- `pages.pricing.preview.metricAccuracyCaption`
- `pages.pricing.preview.metricsLabel`
- `pages.pricing.preview.metricStreak`

*…and 1138 additional missing keys after the top 100 (continue in the same priority order).*

---

## Locale: `fr`

| Group | Missing count |
|-------|----------------:|
| Pricing (`pages.pricing.*`) | 0 |
| Paywall (`paywall.*`) | 0 |
| Homepage (`home.*`, `pages.home.*`) | 10 |
| Navigation (`nav.*`) | 0 |
| Footer (`footer.*`) | 0 |
| Auth (`pages.login.*`, `pages.signup.*`, `auth.*`) | 0 |
| Other (not in scoped groups) | 253 |
| **Total missing** | **263** |

### Top 100 missing keys (impact order: pricing → paywall → homepage → nav → footer → auth → other)

#### Homepage (`home.*`, `pages.home.*`)

- `pages.home.adminLessonCountBreakdown`
- `pages.home.availableIn20LanguagesStudy`
- `pages.home.canadianFlag`
- `pages.home.metaDescription`
- `pages.home.metaTitle`
- `pages.home.rarr`
- `pages.home.storeProducts`
- `pages.home.totalLessons`
- `pages.home.totalQuestions`
- `pages.home.usFlag`

#### Other (not in scoped groups)

- `components.competitiveDifferentiation.clinicalLearningSystem`
- `components.competitiveDifferentiation.feature`
- `components.competitiveDifferentiation.platformComparison`
- `components.competitiveDifferentiation.typicalPlatforms`
- `components.competitiveDifferentiation.typicalPlatforms2`
- `components.footer.applynestHealthcareProgramApplicationsAnd`
- `components.footer.healthcareProgramApplicationsAdmissionsAnd`
- `components.footer.nclexrnPrep`
- `components.footer.npExamPrepHub`
- `components.footer.nursenestNursingAndHealthcareExam`
- `components.footer.nursingExamPrepClinicalTools`
- `components.footer.nursingExamPrepHub`
- `components.footer.ourEducationEcosystem`
- `components.footer.paramedic`
- `components.footer.respiratoryTherapist`
- `components.footer.rexpnNclexpnPrep`
- `components.heroAlliedHealth.careerreadinessScenariosGoal`
- `components.heroAlliedHealth.comingSoon`
- `components.heroAlliedHealth.comingSoon2`
- `components.heroAlliedHealth.newGraduate`
- `components.heroAlliedHealth.prenursing`
- `components.heroAlliedHealth.prepareForNursingSchoolSuccess`
- `components.heroAlliedHealth.questions`
- `components.heroAlliedHealth.questions2`
- `components.heroAlliedHealth.questionsGoal`
- `components.heroAlliedHealth.transitionFromStudentToConfident`
- `components.heroCertifications.startPrep`
- `components.heroExpansionTracker.alliedHealthMajorCareers`
- `components.heroExpansionTracker.nursingTiers`
- `components.heroFeaturesGrid.learnMore`
- `components.heroGlobalCoverage.rarr`
- `components.heroGlobalCoverage.supportedCountries`
- `components.heroGlobalCoverage.supportedLanguages`
- `components.heroNursingTiers.20Languages`
- `components.heroNursingTiers.majorExams`
- `components.heroNursingTiers.mockExams`
- `components.heroNursingTiers.questionsGoal`
- `components.heroNursingTiers.studyGuides`
- `components.homeBottomSections.25Questions`
- `components.homeBottomSections.adaptive`
- `components.homeBottomSections.builtForYou`
- `components.homeBottomSections.canada`
- `components.homeBottomSections.createYourPlan`
- `components.homeBottomSections.customStudyPlanner`
- `components.homeBottomSections.dailyTasks`
- `components.homeBottomSections.domainAnalysis`
- `components.homeBottomSections.free`
- `components.homeBottomSections.freeReadinessExam`
- `components.homeBottomSections.instantResults`
- `components.homeBottomSections.noCost`
- `components.homeBottomSections.performanceReportCard`
- `components.homeBottomSections.personalized`
- `components.homeBottomSections.progressTracking`
- `components.homeBottomSections.readinessExamBody`
- `components.homeBottomSections.reportCardBody`
- `components.homeBottomSections.scoreTrends`
- `components.homeBottomSections.studyPlannerBody`
- `components.homeBottomSections.studyToolsCta`
- `components.homeBottomSections.studyToolsHeading`
- `components.homeBottomSections.studyToolsSubcopy`
- `components.homeBottomSections.takeTheFreeExam`
- `components.homeBottomSections.unitedStates`
- `components.homeBottomSections.viewYourReportCard`
- `components.homeBottomSections.weakAreaDetection`
- `components.homeChoosePath.chooseYourPath`
- `components.homeChoosePath.clinicalLessons`
- `components.homeChoosePath.flashcards`
- `components.homeChoosePath.languagesSupported`
- `components.homeChoosePath.practiceQuestions`
- `components.homeChoosePath.whetherYoureANursingStudent`
- `components.homeConversionSections.7dayMoneybackGuarantee`
- `components.homeConversionSections.allied`
- `components.homeConversionSections.aProvenSystemToPrepare`
- `components.homeConversionSections.averageRating`
- `components.homeConversionSections.chooseYourPath`
- `components.homeConversionSections.competitiveCta`
- `components.homeConversionSections.competitiveHeading`
- `components.homeConversionSections.competitiveRow0.feature`
- `components.homeConversionSections.competitiveRow0.ours`
- `components.homeConversionSections.competitiveRow0.typical`
- `components.homeConversionSections.competitiveRow1.feature`
- `components.homeConversionSections.competitiveRow1.ours`
- `components.homeConversionSections.competitiveRow1.typical`
- `components.homeConversionSections.competitiveRow2.feature`
- `components.homeConversionSections.competitiveRow2.ours`
- `components.homeConversionSections.competitiveRow2.typical`
- `components.homeConversionSections.competitiveRow3.feature`
- `components.homeConversionSections.competitiveRow3.ours`
- `components.homeConversionSections.competitiveRow3.typical`
- `components.homeConversionSections.competitiveRow4.feature`

*…and 163 additional missing keys after the top 100 (continue in the same priority order).*

---

## Locale: `hi`

| Group | Missing count |
|-------|----------------:|
| Pricing (`pages.pricing.*`) | 118 |
| Paywall (`paywall.*`) | 35 |
| Homepage (`home.*`, `pages.home.*`) | 393 |
| Navigation (`nav.*`) | 36 |
| Footer (`footer.*`) | 43 |
| Auth (`pages.login.*`, `pages.signup.*`, `auth.*`) | 17 |
| Other (not in scoped groups) | 596 |
| **Total missing** | **1238** |

### Top 100 missing keys (impact order: pricing → paywall → homepage → nav → footer → auth → other)

#### Pricing (`pages.pricing.*`)

- `pages.pricing.billing.heading`
- `pages.pricing.billing.helper`
- `pages.pricing.billing.recurringDisclosure`
- `pages.pricing.checkout.comingSoon`
- `pages.pricing.checkout.continue`
- `pages.pricing.checkout.mustAcceptPolicies`
- `pages.pricing.checkout.policyAckBetween1`
- `pages.pricing.checkout.policyAckBetween2`
- `pages.pricing.checkout.policyAckEnd`
- `pages.pricing.checkout.policyAckStart`
- `pages.pricing.checkout.policyPrivacyLabel`
- `pages.pricing.checkout.policyRefundLabel`
- `pages.pricing.checkout.policyTermsLabel`
- `pages.pricing.checkout.recurringShort`
- `pages.pricing.country.ca`
- `pages.pricing.country.us`
- `pages.pricing.countryLabel`
- `pages.pricing.description`
- `pages.pricing.duration.3month`
- `pages.pricing.duration.6month`
- `pages.pricing.duration.monthly`
- `pages.pricing.duration.yearly`
- `pages.pricing.error.checkoutNetwork`
- `pages.pricing.error.checkoutSignIn`
- `pages.pricing.error.checkoutUnavailable`
- `pages.pricing.error.loadPlans`
- `pages.pricing.h1`
- `pages.pricing.institutionalBanner`
- `pages.pricing.institutionalLink`
- `pages.pricing.intro`
- `pages.pricing.narrative.allied.headline`
- `pages.pricing.narrative.allied.headlineOutcome`
- `pages.pricing.narrative.allied.headlineUrgency`
- `pages.pricing.narrative.allied.included0`
- `pages.pricing.narrative.allied.included1`
- `pages.pricing.narrative.allied.included2`
- `pages.pricing.narrative.allied.included3`
- `pages.pricing.narrative.allied.outcome0`
- `pages.pricing.narrative.allied.outcome1`
- `pages.pricing.narrative.allied.outcome2`
- `pages.pricing.narrative.allied.proofLine`
- `pages.pricing.narrative.allied.subhead`
- `pages.pricing.narrative.lvn_lpn.headline`
- `pages.pricing.narrative.lvn_lpn.headlineOutcome`
- `pages.pricing.narrative.lvn_lpn.headlineUrgency`
- `pages.pricing.narrative.lvn_lpn.included0`
- `pages.pricing.narrative.lvn_lpn.included1`
- `pages.pricing.narrative.lvn_lpn.included2`
- `pages.pricing.narrative.lvn_lpn.included3`
- `pages.pricing.narrative.lvn_lpn.outcome0`
- `pages.pricing.narrative.lvn_lpn.outcome1`
- `pages.pricing.narrative.lvn_lpn.outcome2`
- `pages.pricing.narrative.lvn_lpn.proofLine`
- `pages.pricing.narrative.lvn_lpn.subhead`
- `pages.pricing.narrative.np.headline`
- `pages.pricing.narrative.np.headlineOutcome`
- `pages.pricing.narrative.np.headlineUrgency`
- `pages.pricing.narrative.np.included0`
- `pages.pricing.narrative.np.included1`
- `pages.pricing.narrative.np.included2`
- `pages.pricing.narrative.np.included3`
- `pages.pricing.narrative.np.outcome0`
- `pages.pricing.narrative.np.outcome1`
- `pages.pricing.narrative.np.outcome2`
- `pages.pricing.narrative.np.proofLine`
- `pages.pricing.narrative.np.subhead`
- `pages.pricing.narrative.rn.headline`
- `pages.pricing.narrative.rn.headlineOutcome`
- `pages.pricing.narrative.rn.headlineUrgency`
- `pages.pricing.narrative.rn.included0`
- `pages.pricing.narrative.rn.included1`
- `pages.pricing.narrative.rn.included2`
- `pages.pricing.narrative.rn.included3`
- `pages.pricing.narrative.rn.outcome0`
- `pages.pricing.narrative.rn.outcome1`
- `pages.pricing.narrative.rn.outcome2`
- `pages.pricing.narrative.rn.proofLine`
- `pages.pricing.narrative.rn.subhead`
- `pages.pricing.narrative.rpn.headline`
- `pages.pricing.narrative.rpn.headlineOutcome`
- `pages.pricing.narrative.rpn.headlineUrgency`
- `pages.pricing.narrative.rpn.included0`
- `pages.pricing.narrative.rpn.included1`
- `pages.pricing.narrative.rpn.included2`
- `pages.pricing.narrative.rpn.included3`
- `pages.pricing.narrative.rpn.outcome0`
- `pages.pricing.narrative.rpn.outcome1`
- `pages.pricing.narrative.rpn.outcome2`
- `pages.pricing.narrative.rpn.proofLine`
- `pages.pricing.narrative.rpn.subhead`
- `pages.pricing.narrative.variant.urgencyLine`
- `pages.pricing.plan.avgSuffix`
- `pages.pricing.plan.bestValue`
- `pages.pricing.plan.saveVsMonthly`
- `pages.pricing.preview.badge`
- `pages.pricing.preview.body`
- `pages.pricing.preview.metricAccuracy`
- `pages.pricing.preview.metricAccuracyCaption`
- `pages.pricing.preview.metricsLabel`
- `pages.pricing.preview.metricStreak`

*…and 1138 additional missing keys after the top 100 (continue in the same priority order).*

---

## Locale: `ht`

| Group | Missing count |
|-------|----------------:|
| Pricing (`pages.pricing.*`) | 118 |
| Paywall (`paywall.*`) | 35 |
| Homepage (`home.*`, `pages.home.*`) | 393 |
| Navigation (`nav.*`) | 36 |
| Footer (`footer.*`) | 43 |
| Auth (`pages.login.*`, `pages.signup.*`, `auth.*`) | 17 |
| Other (not in scoped groups) | 596 |
| **Total missing** | **1238** |

### Top 100 missing keys (impact order: pricing → paywall → homepage → nav → footer → auth → other)

#### Pricing (`pages.pricing.*`)

- `pages.pricing.billing.heading`
- `pages.pricing.billing.helper`
- `pages.pricing.billing.recurringDisclosure`
- `pages.pricing.checkout.comingSoon`
- `pages.pricing.checkout.continue`
- `pages.pricing.checkout.mustAcceptPolicies`
- `pages.pricing.checkout.policyAckBetween1`
- `pages.pricing.checkout.policyAckBetween2`
- `pages.pricing.checkout.policyAckEnd`
- `pages.pricing.checkout.policyAckStart`
- `pages.pricing.checkout.policyPrivacyLabel`
- `pages.pricing.checkout.policyRefundLabel`
- `pages.pricing.checkout.policyTermsLabel`
- `pages.pricing.checkout.recurringShort`
- `pages.pricing.country.ca`
- `pages.pricing.country.us`
- `pages.pricing.countryLabel`
- `pages.pricing.description`
- `pages.pricing.duration.3month`
- `pages.pricing.duration.6month`
- `pages.pricing.duration.monthly`
- `pages.pricing.duration.yearly`
- `pages.pricing.error.checkoutNetwork`
- `pages.pricing.error.checkoutSignIn`
- `pages.pricing.error.checkoutUnavailable`
- `pages.pricing.error.loadPlans`
- `pages.pricing.h1`
- `pages.pricing.institutionalBanner`
- `pages.pricing.institutionalLink`
- `pages.pricing.intro`
- `pages.pricing.narrative.allied.headline`
- `pages.pricing.narrative.allied.headlineOutcome`
- `pages.pricing.narrative.allied.headlineUrgency`
- `pages.pricing.narrative.allied.included0`
- `pages.pricing.narrative.allied.included1`
- `pages.pricing.narrative.allied.included2`
- `pages.pricing.narrative.allied.included3`
- `pages.pricing.narrative.allied.outcome0`
- `pages.pricing.narrative.allied.outcome1`
- `pages.pricing.narrative.allied.outcome2`
- `pages.pricing.narrative.allied.proofLine`
- `pages.pricing.narrative.allied.subhead`
- `pages.pricing.narrative.lvn_lpn.headline`
- `pages.pricing.narrative.lvn_lpn.headlineOutcome`
- `pages.pricing.narrative.lvn_lpn.headlineUrgency`
- `pages.pricing.narrative.lvn_lpn.included0`
- `pages.pricing.narrative.lvn_lpn.included1`
- `pages.pricing.narrative.lvn_lpn.included2`
- `pages.pricing.narrative.lvn_lpn.included3`
- `pages.pricing.narrative.lvn_lpn.outcome0`
- `pages.pricing.narrative.lvn_lpn.outcome1`
- `pages.pricing.narrative.lvn_lpn.outcome2`
- `pages.pricing.narrative.lvn_lpn.proofLine`
- `pages.pricing.narrative.lvn_lpn.subhead`
- `pages.pricing.narrative.np.headline`
- `pages.pricing.narrative.np.headlineOutcome`
- `pages.pricing.narrative.np.headlineUrgency`
- `pages.pricing.narrative.np.included0`
- `pages.pricing.narrative.np.included1`
- `pages.pricing.narrative.np.included2`
- `pages.pricing.narrative.np.included3`
- `pages.pricing.narrative.np.outcome0`
- `pages.pricing.narrative.np.outcome1`
- `pages.pricing.narrative.np.outcome2`
- `pages.pricing.narrative.np.proofLine`
- `pages.pricing.narrative.np.subhead`
- `pages.pricing.narrative.rn.headline`
- `pages.pricing.narrative.rn.headlineOutcome`
- `pages.pricing.narrative.rn.headlineUrgency`
- `pages.pricing.narrative.rn.included0`
- `pages.pricing.narrative.rn.included1`
- `pages.pricing.narrative.rn.included2`
- `pages.pricing.narrative.rn.included3`
- `pages.pricing.narrative.rn.outcome0`
- `pages.pricing.narrative.rn.outcome1`
- `pages.pricing.narrative.rn.outcome2`
- `pages.pricing.narrative.rn.proofLine`
- `pages.pricing.narrative.rn.subhead`
- `pages.pricing.narrative.rpn.headline`
- `pages.pricing.narrative.rpn.headlineOutcome`
- `pages.pricing.narrative.rpn.headlineUrgency`
- `pages.pricing.narrative.rpn.included0`
- `pages.pricing.narrative.rpn.included1`
- `pages.pricing.narrative.rpn.included2`
- `pages.pricing.narrative.rpn.included3`
- `pages.pricing.narrative.rpn.outcome0`
- `pages.pricing.narrative.rpn.outcome1`
- `pages.pricing.narrative.rpn.outcome2`
- `pages.pricing.narrative.rpn.proofLine`
- `pages.pricing.narrative.rpn.subhead`
- `pages.pricing.narrative.variant.urgencyLine`
- `pages.pricing.plan.avgSuffix`
- `pages.pricing.plan.bestValue`
- `pages.pricing.plan.saveVsMonthly`
- `pages.pricing.preview.badge`
- `pages.pricing.preview.body`
- `pages.pricing.preview.metricAccuracy`
- `pages.pricing.preview.metricAccuracyCaption`
- `pages.pricing.preview.metricsLabel`
- `pages.pricing.preview.metricStreak`

*…and 1138 additional missing keys after the top 100 (continue in the same priority order).*

---

## Locale: `id`

| Group | Missing count |
|-------|----------------:|
| Pricing (`pages.pricing.*`) | 118 |
| Paywall (`paywall.*`) | 35 |
| Homepage (`home.*`, `pages.home.*`) | 393 |
| Navigation (`nav.*`) | 36 |
| Footer (`footer.*`) | 43 |
| Auth (`pages.login.*`, `pages.signup.*`, `auth.*`) | 17 |
| Other (not in scoped groups) | 596 |
| **Total missing** | **1238** |

### Top 100 missing keys (impact order: pricing → paywall → homepage → nav → footer → auth → other)

#### Pricing (`pages.pricing.*`)

- `pages.pricing.billing.heading`
- `pages.pricing.billing.helper`
- `pages.pricing.billing.recurringDisclosure`
- `pages.pricing.checkout.comingSoon`
- `pages.pricing.checkout.continue`
- `pages.pricing.checkout.mustAcceptPolicies`
- `pages.pricing.checkout.policyAckBetween1`
- `pages.pricing.checkout.policyAckBetween2`
- `pages.pricing.checkout.policyAckEnd`
- `pages.pricing.checkout.policyAckStart`
- `pages.pricing.checkout.policyPrivacyLabel`
- `pages.pricing.checkout.policyRefundLabel`
- `pages.pricing.checkout.policyTermsLabel`
- `pages.pricing.checkout.recurringShort`
- `pages.pricing.country.ca`
- `pages.pricing.country.us`
- `pages.pricing.countryLabel`
- `pages.pricing.description`
- `pages.pricing.duration.3month`
- `pages.pricing.duration.6month`
- `pages.pricing.duration.monthly`
- `pages.pricing.duration.yearly`
- `pages.pricing.error.checkoutNetwork`
- `pages.pricing.error.checkoutSignIn`
- `pages.pricing.error.checkoutUnavailable`
- `pages.pricing.error.loadPlans`
- `pages.pricing.h1`
- `pages.pricing.institutionalBanner`
- `pages.pricing.institutionalLink`
- `pages.pricing.intro`
- `pages.pricing.narrative.allied.headline`
- `pages.pricing.narrative.allied.headlineOutcome`
- `pages.pricing.narrative.allied.headlineUrgency`
- `pages.pricing.narrative.allied.included0`
- `pages.pricing.narrative.allied.included1`
- `pages.pricing.narrative.allied.included2`
- `pages.pricing.narrative.allied.included3`
- `pages.pricing.narrative.allied.outcome0`
- `pages.pricing.narrative.allied.outcome1`
- `pages.pricing.narrative.allied.outcome2`
- `pages.pricing.narrative.allied.proofLine`
- `pages.pricing.narrative.allied.subhead`
- `pages.pricing.narrative.lvn_lpn.headline`
- `pages.pricing.narrative.lvn_lpn.headlineOutcome`
- `pages.pricing.narrative.lvn_lpn.headlineUrgency`
- `pages.pricing.narrative.lvn_lpn.included0`
- `pages.pricing.narrative.lvn_lpn.included1`
- `pages.pricing.narrative.lvn_lpn.included2`
- `pages.pricing.narrative.lvn_lpn.included3`
- `pages.pricing.narrative.lvn_lpn.outcome0`
- `pages.pricing.narrative.lvn_lpn.outcome1`
- `pages.pricing.narrative.lvn_lpn.outcome2`
- `pages.pricing.narrative.lvn_lpn.proofLine`
- `pages.pricing.narrative.lvn_lpn.subhead`
- `pages.pricing.narrative.np.headline`
- `pages.pricing.narrative.np.headlineOutcome`
- `pages.pricing.narrative.np.headlineUrgency`
- `pages.pricing.narrative.np.included0`
- `pages.pricing.narrative.np.included1`
- `pages.pricing.narrative.np.included2`
- `pages.pricing.narrative.np.included3`
- `pages.pricing.narrative.np.outcome0`
- `pages.pricing.narrative.np.outcome1`
- `pages.pricing.narrative.np.outcome2`
- `pages.pricing.narrative.np.proofLine`
- `pages.pricing.narrative.np.subhead`
- `pages.pricing.narrative.rn.headline`
- `pages.pricing.narrative.rn.headlineOutcome`
- `pages.pricing.narrative.rn.headlineUrgency`
- `pages.pricing.narrative.rn.included0`
- `pages.pricing.narrative.rn.included1`
- `pages.pricing.narrative.rn.included2`
- `pages.pricing.narrative.rn.included3`
- `pages.pricing.narrative.rn.outcome0`
- `pages.pricing.narrative.rn.outcome1`
- `pages.pricing.narrative.rn.outcome2`
- `pages.pricing.narrative.rn.proofLine`
- `pages.pricing.narrative.rn.subhead`
- `pages.pricing.narrative.rpn.headline`
- `pages.pricing.narrative.rpn.headlineOutcome`
- `pages.pricing.narrative.rpn.headlineUrgency`
- `pages.pricing.narrative.rpn.included0`
- `pages.pricing.narrative.rpn.included1`
- `pages.pricing.narrative.rpn.included2`
- `pages.pricing.narrative.rpn.included3`
- `pages.pricing.narrative.rpn.outcome0`
- `pages.pricing.narrative.rpn.outcome1`
- `pages.pricing.narrative.rpn.outcome2`
- `pages.pricing.narrative.rpn.proofLine`
- `pages.pricing.narrative.rpn.subhead`
- `pages.pricing.narrative.variant.urgencyLine`
- `pages.pricing.plan.avgSuffix`
- `pages.pricing.plan.bestValue`
- `pages.pricing.plan.saveVsMonthly`
- `pages.pricing.preview.badge`
- `pages.pricing.preview.body`
- `pages.pricing.preview.metricAccuracy`
- `pages.pricing.preview.metricAccuracyCaption`
- `pages.pricing.preview.metricsLabel`
- `pages.pricing.preview.metricStreak`

*…and 1138 additional missing keys after the top 100 (continue in the same priority order).*

---

## Locale: `ja`

| Group | Missing count |
|-------|----------------:|
| Pricing (`pages.pricing.*`) | 118 |
| Paywall (`paywall.*`) | 35 |
| Homepage (`home.*`, `pages.home.*`) | 393 |
| Navigation (`nav.*`) | 36 |
| Footer (`footer.*`) | 43 |
| Auth (`pages.login.*`, `pages.signup.*`, `auth.*`) | 17 |
| Other (not in scoped groups) | 596 |
| **Total missing** | **1238** |

### Top 100 missing keys (impact order: pricing → paywall → homepage → nav → footer → auth → other)

#### Pricing (`pages.pricing.*`)

- `pages.pricing.billing.heading`
- `pages.pricing.billing.helper`
- `pages.pricing.billing.recurringDisclosure`
- `pages.pricing.checkout.comingSoon`
- `pages.pricing.checkout.continue`
- `pages.pricing.checkout.mustAcceptPolicies`
- `pages.pricing.checkout.policyAckBetween1`
- `pages.pricing.checkout.policyAckBetween2`
- `pages.pricing.checkout.policyAckEnd`
- `pages.pricing.checkout.policyAckStart`
- `pages.pricing.checkout.policyPrivacyLabel`
- `pages.pricing.checkout.policyRefundLabel`
- `pages.pricing.checkout.policyTermsLabel`
- `pages.pricing.checkout.recurringShort`
- `pages.pricing.country.ca`
- `pages.pricing.country.us`
- `pages.pricing.countryLabel`
- `pages.pricing.description`
- `pages.pricing.duration.3month`
- `pages.pricing.duration.6month`
- `pages.pricing.duration.monthly`
- `pages.pricing.duration.yearly`
- `pages.pricing.error.checkoutNetwork`
- `pages.pricing.error.checkoutSignIn`
- `pages.pricing.error.checkoutUnavailable`
- `pages.pricing.error.loadPlans`
- `pages.pricing.h1`
- `pages.pricing.institutionalBanner`
- `pages.pricing.institutionalLink`
- `pages.pricing.intro`
- `pages.pricing.narrative.allied.headline`
- `pages.pricing.narrative.allied.headlineOutcome`
- `pages.pricing.narrative.allied.headlineUrgency`
- `pages.pricing.narrative.allied.included0`
- `pages.pricing.narrative.allied.included1`
- `pages.pricing.narrative.allied.included2`
- `pages.pricing.narrative.allied.included3`
- `pages.pricing.narrative.allied.outcome0`
- `pages.pricing.narrative.allied.outcome1`
- `pages.pricing.narrative.allied.outcome2`
- `pages.pricing.narrative.allied.proofLine`
- `pages.pricing.narrative.allied.subhead`
- `pages.pricing.narrative.lvn_lpn.headline`
- `pages.pricing.narrative.lvn_lpn.headlineOutcome`
- `pages.pricing.narrative.lvn_lpn.headlineUrgency`
- `pages.pricing.narrative.lvn_lpn.included0`
- `pages.pricing.narrative.lvn_lpn.included1`
- `pages.pricing.narrative.lvn_lpn.included2`
- `pages.pricing.narrative.lvn_lpn.included3`
- `pages.pricing.narrative.lvn_lpn.outcome0`
- `pages.pricing.narrative.lvn_lpn.outcome1`
- `pages.pricing.narrative.lvn_lpn.outcome2`
- `pages.pricing.narrative.lvn_lpn.proofLine`
- `pages.pricing.narrative.lvn_lpn.subhead`
- `pages.pricing.narrative.np.headline`
- `pages.pricing.narrative.np.headlineOutcome`
- `pages.pricing.narrative.np.headlineUrgency`
- `pages.pricing.narrative.np.included0`
- `pages.pricing.narrative.np.included1`
- `pages.pricing.narrative.np.included2`
- `pages.pricing.narrative.np.included3`
- `pages.pricing.narrative.np.outcome0`
- `pages.pricing.narrative.np.outcome1`
- `pages.pricing.narrative.np.outcome2`
- `pages.pricing.narrative.np.proofLine`
- `pages.pricing.narrative.np.subhead`
- `pages.pricing.narrative.rn.headline`
- `pages.pricing.narrative.rn.headlineOutcome`
- `pages.pricing.narrative.rn.headlineUrgency`
- `pages.pricing.narrative.rn.included0`
- `pages.pricing.narrative.rn.included1`
- `pages.pricing.narrative.rn.included2`
- `pages.pricing.narrative.rn.included3`
- `pages.pricing.narrative.rn.outcome0`
- `pages.pricing.narrative.rn.outcome1`
- `pages.pricing.narrative.rn.outcome2`
- `pages.pricing.narrative.rn.proofLine`
- `pages.pricing.narrative.rn.subhead`
- `pages.pricing.narrative.rpn.headline`
- `pages.pricing.narrative.rpn.headlineOutcome`
- `pages.pricing.narrative.rpn.headlineUrgency`
- `pages.pricing.narrative.rpn.included0`
- `pages.pricing.narrative.rpn.included1`
- `pages.pricing.narrative.rpn.included2`
- `pages.pricing.narrative.rpn.included3`
- `pages.pricing.narrative.rpn.outcome0`
- `pages.pricing.narrative.rpn.outcome1`
- `pages.pricing.narrative.rpn.outcome2`
- `pages.pricing.narrative.rpn.proofLine`
- `pages.pricing.narrative.rpn.subhead`
- `pages.pricing.narrative.variant.urgencyLine`
- `pages.pricing.plan.avgSuffix`
- `pages.pricing.plan.bestValue`
- `pages.pricing.plan.saveVsMonthly`
- `pages.pricing.preview.badge`
- `pages.pricing.preview.body`
- `pages.pricing.preview.metricAccuracy`
- `pages.pricing.preview.metricAccuracyCaption`
- `pages.pricing.preview.metricsLabel`
- `pages.pricing.preview.metricStreak`

*…and 1138 additional missing keys after the top 100 (continue in the same priority order).*

---

## Locale: `ko`

| Group | Missing count |
|-------|----------------:|
| Pricing (`pages.pricing.*`) | 118 |
| Paywall (`paywall.*`) | 35 |
| Homepage (`home.*`, `pages.home.*`) | 393 |
| Navigation (`nav.*`) | 36 |
| Footer (`footer.*`) | 43 |
| Auth (`pages.login.*`, `pages.signup.*`, `auth.*`) | 17 |
| Other (not in scoped groups) | 596 |
| **Total missing** | **1238** |

### Top 100 missing keys (impact order: pricing → paywall → homepage → nav → footer → auth → other)

#### Pricing (`pages.pricing.*`)

- `pages.pricing.billing.heading`
- `pages.pricing.billing.helper`
- `pages.pricing.billing.recurringDisclosure`
- `pages.pricing.checkout.comingSoon`
- `pages.pricing.checkout.continue`
- `pages.pricing.checkout.mustAcceptPolicies`
- `pages.pricing.checkout.policyAckBetween1`
- `pages.pricing.checkout.policyAckBetween2`
- `pages.pricing.checkout.policyAckEnd`
- `pages.pricing.checkout.policyAckStart`
- `pages.pricing.checkout.policyPrivacyLabel`
- `pages.pricing.checkout.policyRefundLabel`
- `pages.pricing.checkout.policyTermsLabel`
- `pages.pricing.checkout.recurringShort`
- `pages.pricing.country.ca`
- `pages.pricing.country.us`
- `pages.pricing.countryLabel`
- `pages.pricing.description`
- `pages.pricing.duration.3month`
- `pages.pricing.duration.6month`
- `pages.pricing.duration.monthly`
- `pages.pricing.duration.yearly`
- `pages.pricing.error.checkoutNetwork`
- `pages.pricing.error.checkoutSignIn`
- `pages.pricing.error.checkoutUnavailable`
- `pages.pricing.error.loadPlans`
- `pages.pricing.h1`
- `pages.pricing.institutionalBanner`
- `pages.pricing.institutionalLink`
- `pages.pricing.intro`
- `pages.pricing.narrative.allied.headline`
- `pages.pricing.narrative.allied.headlineOutcome`
- `pages.pricing.narrative.allied.headlineUrgency`
- `pages.pricing.narrative.allied.included0`
- `pages.pricing.narrative.allied.included1`
- `pages.pricing.narrative.allied.included2`
- `pages.pricing.narrative.allied.included3`
- `pages.pricing.narrative.allied.outcome0`
- `pages.pricing.narrative.allied.outcome1`
- `pages.pricing.narrative.allied.outcome2`
- `pages.pricing.narrative.allied.proofLine`
- `pages.pricing.narrative.allied.subhead`
- `pages.pricing.narrative.lvn_lpn.headline`
- `pages.pricing.narrative.lvn_lpn.headlineOutcome`
- `pages.pricing.narrative.lvn_lpn.headlineUrgency`
- `pages.pricing.narrative.lvn_lpn.included0`
- `pages.pricing.narrative.lvn_lpn.included1`
- `pages.pricing.narrative.lvn_lpn.included2`
- `pages.pricing.narrative.lvn_lpn.included3`
- `pages.pricing.narrative.lvn_lpn.outcome0`
- `pages.pricing.narrative.lvn_lpn.outcome1`
- `pages.pricing.narrative.lvn_lpn.outcome2`
- `pages.pricing.narrative.lvn_lpn.proofLine`
- `pages.pricing.narrative.lvn_lpn.subhead`
- `pages.pricing.narrative.np.headline`
- `pages.pricing.narrative.np.headlineOutcome`
- `pages.pricing.narrative.np.headlineUrgency`
- `pages.pricing.narrative.np.included0`
- `pages.pricing.narrative.np.included1`
- `pages.pricing.narrative.np.included2`
- `pages.pricing.narrative.np.included3`
- `pages.pricing.narrative.np.outcome0`
- `pages.pricing.narrative.np.outcome1`
- `pages.pricing.narrative.np.outcome2`
- `pages.pricing.narrative.np.proofLine`
- `pages.pricing.narrative.np.subhead`
- `pages.pricing.narrative.rn.headline`
- `pages.pricing.narrative.rn.headlineOutcome`
- `pages.pricing.narrative.rn.headlineUrgency`
- `pages.pricing.narrative.rn.included0`
- `pages.pricing.narrative.rn.included1`
- `pages.pricing.narrative.rn.included2`
- `pages.pricing.narrative.rn.included3`
- `pages.pricing.narrative.rn.outcome0`
- `pages.pricing.narrative.rn.outcome1`
- `pages.pricing.narrative.rn.outcome2`
- `pages.pricing.narrative.rn.proofLine`
- `pages.pricing.narrative.rn.subhead`
- `pages.pricing.narrative.rpn.headline`
- `pages.pricing.narrative.rpn.headlineOutcome`
- `pages.pricing.narrative.rpn.headlineUrgency`
- `pages.pricing.narrative.rpn.included0`
- `pages.pricing.narrative.rpn.included1`
- `pages.pricing.narrative.rpn.included2`
- `pages.pricing.narrative.rpn.included3`
- `pages.pricing.narrative.rpn.outcome0`
- `pages.pricing.narrative.rpn.outcome1`
- `pages.pricing.narrative.rpn.outcome2`
- `pages.pricing.narrative.rpn.proofLine`
- `pages.pricing.narrative.rpn.subhead`
- `pages.pricing.narrative.variant.urgencyLine`
- `pages.pricing.plan.avgSuffix`
- `pages.pricing.plan.bestValue`
- `pages.pricing.plan.saveVsMonthly`
- `pages.pricing.preview.badge`
- `pages.pricing.preview.body`
- `pages.pricing.preview.metricAccuracy`
- `pages.pricing.preview.metricAccuracyCaption`
- `pages.pricing.preview.metricsLabel`
- `pages.pricing.preview.metricStreak`

*…and 1138 additional missing keys after the top 100 (continue in the same priority order).*

---

## Locale: `pa`

| Group | Missing count |
|-------|----------------:|
| Pricing (`pages.pricing.*`) | 118 |
| Paywall (`paywall.*`) | 35 |
| Homepage (`home.*`, `pages.home.*`) | 393 |
| Navigation (`nav.*`) | 36 |
| Footer (`footer.*`) | 43 |
| Auth (`pages.login.*`, `pages.signup.*`, `auth.*`) | 17 |
| Other (not in scoped groups) | 596 |
| **Total missing** | **1238** |

### Top 100 missing keys (impact order: pricing → paywall → homepage → nav → footer → auth → other)

#### Pricing (`pages.pricing.*`)

- `pages.pricing.billing.heading`
- `pages.pricing.billing.helper`
- `pages.pricing.billing.recurringDisclosure`
- `pages.pricing.checkout.comingSoon`
- `pages.pricing.checkout.continue`
- `pages.pricing.checkout.mustAcceptPolicies`
- `pages.pricing.checkout.policyAckBetween1`
- `pages.pricing.checkout.policyAckBetween2`
- `pages.pricing.checkout.policyAckEnd`
- `pages.pricing.checkout.policyAckStart`
- `pages.pricing.checkout.policyPrivacyLabel`
- `pages.pricing.checkout.policyRefundLabel`
- `pages.pricing.checkout.policyTermsLabel`
- `pages.pricing.checkout.recurringShort`
- `pages.pricing.country.ca`
- `pages.pricing.country.us`
- `pages.pricing.countryLabel`
- `pages.pricing.description`
- `pages.pricing.duration.3month`
- `pages.pricing.duration.6month`
- `pages.pricing.duration.monthly`
- `pages.pricing.duration.yearly`
- `pages.pricing.error.checkoutNetwork`
- `pages.pricing.error.checkoutSignIn`
- `pages.pricing.error.checkoutUnavailable`
- `pages.pricing.error.loadPlans`
- `pages.pricing.h1`
- `pages.pricing.institutionalBanner`
- `pages.pricing.institutionalLink`
- `pages.pricing.intro`
- `pages.pricing.narrative.allied.headline`
- `pages.pricing.narrative.allied.headlineOutcome`
- `pages.pricing.narrative.allied.headlineUrgency`
- `pages.pricing.narrative.allied.included0`
- `pages.pricing.narrative.allied.included1`
- `pages.pricing.narrative.allied.included2`
- `pages.pricing.narrative.allied.included3`
- `pages.pricing.narrative.allied.outcome0`
- `pages.pricing.narrative.allied.outcome1`
- `pages.pricing.narrative.allied.outcome2`
- `pages.pricing.narrative.allied.proofLine`
- `pages.pricing.narrative.allied.subhead`
- `pages.pricing.narrative.lvn_lpn.headline`
- `pages.pricing.narrative.lvn_lpn.headlineOutcome`
- `pages.pricing.narrative.lvn_lpn.headlineUrgency`
- `pages.pricing.narrative.lvn_lpn.included0`
- `pages.pricing.narrative.lvn_lpn.included1`
- `pages.pricing.narrative.lvn_lpn.included2`
- `pages.pricing.narrative.lvn_lpn.included3`
- `pages.pricing.narrative.lvn_lpn.outcome0`
- `pages.pricing.narrative.lvn_lpn.outcome1`
- `pages.pricing.narrative.lvn_lpn.outcome2`
- `pages.pricing.narrative.lvn_lpn.proofLine`
- `pages.pricing.narrative.lvn_lpn.subhead`
- `pages.pricing.narrative.np.headline`
- `pages.pricing.narrative.np.headlineOutcome`
- `pages.pricing.narrative.np.headlineUrgency`
- `pages.pricing.narrative.np.included0`
- `pages.pricing.narrative.np.included1`
- `pages.pricing.narrative.np.included2`
- `pages.pricing.narrative.np.included3`
- `pages.pricing.narrative.np.outcome0`
- `pages.pricing.narrative.np.outcome1`
- `pages.pricing.narrative.np.outcome2`
- `pages.pricing.narrative.np.proofLine`
- `pages.pricing.narrative.np.subhead`
- `pages.pricing.narrative.rn.headline`
- `pages.pricing.narrative.rn.headlineOutcome`
- `pages.pricing.narrative.rn.headlineUrgency`
- `pages.pricing.narrative.rn.included0`
- `pages.pricing.narrative.rn.included1`
- `pages.pricing.narrative.rn.included2`
- `pages.pricing.narrative.rn.included3`
- `pages.pricing.narrative.rn.outcome0`
- `pages.pricing.narrative.rn.outcome1`
- `pages.pricing.narrative.rn.outcome2`
- `pages.pricing.narrative.rn.proofLine`
- `pages.pricing.narrative.rn.subhead`
- `pages.pricing.narrative.rpn.headline`
- `pages.pricing.narrative.rpn.headlineOutcome`
- `pages.pricing.narrative.rpn.headlineUrgency`
- `pages.pricing.narrative.rpn.included0`
- `pages.pricing.narrative.rpn.included1`
- `pages.pricing.narrative.rpn.included2`
- `pages.pricing.narrative.rpn.included3`
- `pages.pricing.narrative.rpn.outcome0`
- `pages.pricing.narrative.rpn.outcome1`
- `pages.pricing.narrative.rpn.outcome2`
- `pages.pricing.narrative.rpn.proofLine`
- `pages.pricing.narrative.rpn.subhead`
- `pages.pricing.narrative.variant.urgencyLine`
- `pages.pricing.plan.avgSuffix`
- `pages.pricing.plan.bestValue`
- `pages.pricing.plan.saveVsMonthly`
- `pages.pricing.preview.badge`
- `pages.pricing.preview.body`
- `pages.pricing.preview.metricAccuracy`
- `pages.pricing.preview.metricAccuracyCaption`
- `pages.pricing.preview.metricsLabel`
- `pages.pricing.preview.metricStreak`

*…and 1138 additional missing keys after the top 100 (continue in the same priority order).*

---

## Locale: `pt`

| Group | Missing count |
|-------|----------------:|
| Pricing (`pages.pricing.*`) | 118 |
| Paywall (`paywall.*`) | 35 |
| Homepage (`home.*`, `pages.home.*`) | 393 |
| Navigation (`nav.*`) | 36 |
| Footer (`footer.*`) | 43 |
| Auth (`pages.login.*`, `pages.signup.*`, `auth.*`) | 17 |
| Other (not in scoped groups) | 596 |
| **Total missing** | **1238** |

### Top 100 missing keys (impact order: pricing → paywall → homepage → nav → footer → auth → other)

#### Pricing (`pages.pricing.*`)

- `pages.pricing.billing.heading`
- `pages.pricing.billing.helper`
- `pages.pricing.billing.recurringDisclosure`
- `pages.pricing.checkout.comingSoon`
- `pages.pricing.checkout.continue`
- `pages.pricing.checkout.mustAcceptPolicies`
- `pages.pricing.checkout.policyAckBetween1`
- `pages.pricing.checkout.policyAckBetween2`
- `pages.pricing.checkout.policyAckEnd`
- `pages.pricing.checkout.policyAckStart`
- `pages.pricing.checkout.policyPrivacyLabel`
- `pages.pricing.checkout.policyRefundLabel`
- `pages.pricing.checkout.policyTermsLabel`
- `pages.pricing.checkout.recurringShort`
- `pages.pricing.country.ca`
- `pages.pricing.country.us`
- `pages.pricing.countryLabel`
- `pages.pricing.description`
- `pages.pricing.duration.3month`
- `pages.pricing.duration.6month`
- `pages.pricing.duration.monthly`
- `pages.pricing.duration.yearly`
- `pages.pricing.error.checkoutNetwork`
- `pages.pricing.error.checkoutSignIn`
- `pages.pricing.error.checkoutUnavailable`
- `pages.pricing.error.loadPlans`
- `pages.pricing.h1`
- `pages.pricing.institutionalBanner`
- `pages.pricing.institutionalLink`
- `pages.pricing.intro`
- `pages.pricing.narrative.allied.headline`
- `pages.pricing.narrative.allied.headlineOutcome`
- `pages.pricing.narrative.allied.headlineUrgency`
- `pages.pricing.narrative.allied.included0`
- `pages.pricing.narrative.allied.included1`
- `pages.pricing.narrative.allied.included2`
- `pages.pricing.narrative.allied.included3`
- `pages.pricing.narrative.allied.outcome0`
- `pages.pricing.narrative.allied.outcome1`
- `pages.pricing.narrative.allied.outcome2`
- `pages.pricing.narrative.allied.proofLine`
- `pages.pricing.narrative.allied.subhead`
- `pages.pricing.narrative.lvn_lpn.headline`
- `pages.pricing.narrative.lvn_lpn.headlineOutcome`
- `pages.pricing.narrative.lvn_lpn.headlineUrgency`
- `pages.pricing.narrative.lvn_lpn.included0`
- `pages.pricing.narrative.lvn_lpn.included1`
- `pages.pricing.narrative.lvn_lpn.included2`
- `pages.pricing.narrative.lvn_lpn.included3`
- `pages.pricing.narrative.lvn_lpn.outcome0`
- `pages.pricing.narrative.lvn_lpn.outcome1`
- `pages.pricing.narrative.lvn_lpn.outcome2`
- `pages.pricing.narrative.lvn_lpn.proofLine`
- `pages.pricing.narrative.lvn_lpn.subhead`
- `pages.pricing.narrative.np.headline`
- `pages.pricing.narrative.np.headlineOutcome`
- `pages.pricing.narrative.np.headlineUrgency`
- `pages.pricing.narrative.np.included0`
- `pages.pricing.narrative.np.included1`
- `pages.pricing.narrative.np.included2`
- `pages.pricing.narrative.np.included3`
- `pages.pricing.narrative.np.outcome0`
- `pages.pricing.narrative.np.outcome1`
- `pages.pricing.narrative.np.outcome2`
- `pages.pricing.narrative.np.proofLine`
- `pages.pricing.narrative.np.subhead`
- `pages.pricing.narrative.rn.headline`
- `pages.pricing.narrative.rn.headlineOutcome`
- `pages.pricing.narrative.rn.headlineUrgency`
- `pages.pricing.narrative.rn.included0`
- `pages.pricing.narrative.rn.included1`
- `pages.pricing.narrative.rn.included2`
- `pages.pricing.narrative.rn.included3`
- `pages.pricing.narrative.rn.outcome0`
- `pages.pricing.narrative.rn.outcome1`
- `pages.pricing.narrative.rn.outcome2`
- `pages.pricing.narrative.rn.proofLine`
- `pages.pricing.narrative.rn.subhead`
- `pages.pricing.narrative.rpn.headline`
- `pages.pricing.narrative.rpn.headlineOutcome`
- `pages.pricing.narrative.rpn.headlineUrgency`
- `pages.pricing.narrative.rpn.included0`
- `pages.pricing.narrative.rpn.included1`
- `pages.pricing.narrative.rpn.included2`
- `pages.pricing.narrative.rpn.included3`
- `pages.pricing.narrative.rpn.outcome0`
- `pages.pricing.narrative.rpn.outcome1`
- `pages.pricing.narrative.rpn.outcome2`
- `pages.pricing.narrative.rpn.proofLine`
- `pages.pricing.narrative.rpn.subhead`
- `pages.pricing.narrative.variant.urgencyLine`
- `pages.pricing.plan.avgSuffix`
- `pages.pricing.plan.bestValue`
- `pages.pricing.plan.saveVsMonthly`
- `pages.pricing.preview.badge`
- `pages.pricing.preview.body`
- `pages.pricing.preview.metricAccuracy`
- `pages.pricing.preview.metricAccuracyCaption`
- `pages.pricing.preview.metricsLabel`
- `pages.pricing.preview.metricStreak`

*…and 1138 additional missing keys after the top 100 (continue in the same priority order).*

---

## Locale: `th`

| Group | Missing count |
|-------|----------------:|
| Pricing (`pages.pricing.*`) | 118 |
| Paywall (`paywall.*`) | 35 |
| Homepage (`home.*`, `pages.home.*`) | 393 |
| Navigation (`nav.*`) | 36 |
| Footer (`footer.*`) | 43 |
| Auth (`pages.login.*`, `pages.signup.*`, `auth.*`) | 17 |
| Other (not in scoped groups) | 596 |
| **Total missing** | **1238** |

### Top 100 missing keys (impact order: pricing → paywall → homepage → nav → footer → auth → other)

#### Pricing (`pages.pricing.*`)

- `pages.pricing.billing.heading`
- `pages.pricing.billing.helper`
- `pages.pricing.billing.recurringDisclosure`
- `pages.pricing.checkout.comingSoon`
- `pages.pricing.checkout.continue`
- `pages.pricing.checkout.mustAcceptPolicies`
- `pages.pricing.checkout.policyAckBetween1`
- `pages.pricing.checkout.policyAckBetween2`
- `pages.pricing.checkout.policyAckEnd`
- `pages.pricing.checkout.policyAckStart`
- `pages.pricing.checkout.policyPrivacyLabel`
- `pages.pricing.checkout.policyRefundLabel`
- `pages.pricing.checkout.policyTermsLabel`
- `pages.pricing.checkout.recurringShort`
- `pages.pricing.country.ca`
- `pages.pricing.country.us`
- `pages.pricing.countryLabel`
- `pages.pricing.description`
- `pages.pricing.duration.3month`
- `pages.pricing.duration.6month`
- `pages.pricing.duration.monthly`
- `pages.pricing.duration.yearly`
- `pages.pricing.error.checkoutNetwork`
- `pages.pricing.error.checkoutSignIn`
- `pages.pricing.error.checkoutUnavailable`
- `pages.pricing.error.loadPlans`
- `pages.pricing.h1`
- `pages.pricing.institutionalBanner`
- `pages.pricing.institutionalLink`
- `pages.pricing.intro`
- `pages.pricing.narrative.allied.headline`
- `pages.pricing.narrative.allied.headlineOutcome`
- `pages.pricing.narrative.allied.headlineUrgency`
- `pages.pricing.narrative.allied.included0`
- `pages.pricing.narrative.allied.included1`
- `pages.pricing.narrative.allied.included2`
- `pages.pricing.narrative.allied.included3`
- `pages.pricing.narrative.allied.outcome0`
- `pages.pricing.narrative.allied.outcome1`
- `pages.pricing.narrative.allied.outcome2`
- `pages.pricing.narrative.allied.proofLine`
- `pages.pricing.narrative.allied.subhead`
- `pages.pricing.narrative.lvn_lpn.headline`
- `pages.pricing.narrative.lvn_lpn.headlineOutcome`
- `pages.pricing.narrative.lvn_lpn.headlineUrgency`
- `pages.pricing.narrative.lvn_lpn.included0`
- `pages.pricing.narrative.lvn_lpn.included1`
- `pages.pricing.narrative.lvn_lpn.included2`
- `pages.pricing.narrative.lvn_lpn.included3`
- `pages.pricing.narrative.lvn_lpn.outcome0`
- `pages.pricing.narrative.lvn_lpn.outcome1`
- `pages.pricing.narrative.lvn_lpn.outcome2`
- `pages.pricing.narrative.lvn_lpn.proofLine`
- `pages.pricing.narrative.lvn_lpn.subhead`
- `pages.pricing.narrative.np.headline`
- `pages.pricing.narrative.np.headlineOutcome`
- `pages.pricing.narrative.np.headlineUrgency`
- `pages.pricing.narrative.np.included0`
- `pages.pricing.narrative.np.included1`
- `pages.pricing.narrative.np.included2`
- `pages.pricing.narrative.np.included3`
- `pages.pricing.narrative.np.outcome0`
- `pages.pricing.narrative.np.outcome1`
- `pages.pricing.narrative.np.outcome2`
- `pages.pricing.narrative.np.proofLine`
- `pages.pricing.narrative.np.subhead`
- `pages.pricing.narrative.rn.headline`
- `pages.pricing.narrative.rn.headlineOutcome`
- `pages.pricing.narrative.rn.headlineUrgency`
- `pages.pricing.narrative.rn.included0`
- `pages.pricing.narrative.rn.included1`
- `pages.pricing.narrative.rn.included2`
- `pages.pricing.narrative.rn.included3`
- `pages.pricing.narrative.rn.outcome0`
- `pages.pricing.narrative.rn.outcome1`
- `pages.pricing.narrative.rn.outcome2`
- `pages.pricing.narrative.rn.proofLine`
- `pages.pricing.narrative.rn.subhead`
- `pages.pricing.narrative.rpn.headline`
- `pages.pricing.narrative.rpn.headlineOutcome`
- `pages.pricing.narrative.rpn.headlineUrgency`
- `pages.pricing.narrative.rpn.included0`
- `pages.pricing.narrative.rpn.included1`
- `pages.pricing.narrative.rpn.included2`
- `pages.pricing.narrative.rpn.included3`
- `pages.pricing.narrative.rpn.outcome0`
- `pages.pricing.narrative.rpn.outcome1`
- `pages.pricing.narrative.rpn.outcome2`
- `pages.pricing.narrative.rpn.proofLine`
- `pages.pricing.narrative.rpn.subhead`
- `pages.pricing.narrative.variant.urgencyLine`
- `pages.pricing.plan.avgSuffix`
- `pages.pricing.plan.bestValue`
- `pages.pricing.plan.saveVsMonthly`
- `pages.pricing.preview.badge`
- `pages.pricing.preview.body`
- `pages.pricing.preview.metricAccuracy`
- `pages.pricing.preview.metricAccuracyCaption`
- `pages.pricing.preview.metricsLabel`
- `pages.pricing.preview.metricStreak`

*…and 1138 additional missing keys after the top 100 (continue in the same priority order).*

---

## Locale: `tl`

| Group | Missing count |
|-------|----------------:|
| Pricing (`pages.pricing.*`) | 0 |
| Paywall (`paywall.*`) | 0 |
| Homepage (`home.*`, `pages.home.*`) | 0 |
| Navigation (`nav.*`) | 0 |
| Footer (`footer.*`) | 0 |
| Auth (`pages.login.*`, `pages.signup.*`, `auth.*`) | 0 |
| Other (not in scoped groups) | 292 |
| **Total missing** | **292** |

### Top 100 missing keys (impact order: pricing → paywall → homepage → nav → footer → auth → other)

#### Other (not in scoped groups)

- `learner.entitlement.flashcardsShort`
- `learner.entitlement.verifyFailed`
- `learner.entitlement.verifyFailedShort`
- `learner.error.app.description`
- `learner.error.app.retry`
- `learner.error.app.title`
- `learner.error.section.dashboard`
- `learner.error.section.description`
- `learner.error.section.title`
- `learner.error.section.tryAgain`
- `learner.examPractice.chooseMode`
- `learner.examPractice.disclaimer`
- `learner.examPractice.emptySuffix`
- `learner.examPractice.loadQuestionFailed`
- `learner.examPractice.networkStart`
- `learner.examPractice.preparing`
- `learner.examPractice.recordAttemptFailed`
- `learner.examPractice.retry`
- `learner.examPractice.sessionLoadFailed`
- `learner.examPractice.timed`
- `learner.examPractice.timedButton`
- `learner.examPractice.timedModeHint`
- `learner.examPractice.untimed`
- `learner.exams.page.afterSubscribe.li1`
- `learner.exams.page.afterSubscribe.li2`
- `learner.exams.page.afterSubscribe.li3`
- `learner.exams.page.afterSubscribe.title`
- `learner.exams.page.defaultExamBody`
- `learner.exams.page.defaultExamTitle`
- `learner.exams.page.historyLoadFailed`
- `learner.exams.page.latestAttempt`
- `learner.exams.page.latestStrong`
- `learner.exams.page.latestWeak`
- `learner.exams.page.noAttempts`
- `learner.exams.page.openQuestionBankArrow`
- `learner.exams.page.reportCardBody`
- `learner.exams.page.reportCardTitle`
- `learner.exams.page.subscriberIntro`
- `learner.exams.page.subtitle.locked`
- `learner.exams.page.title`
- `learner.exams.shell.backToDashboard`
- `learner.exams.shell.signIn`
- `learner.exams.shell.signInToPractice`
- `learner.examSession.empty.bankEmptyGlobal.body`
- `learner.examSession.empty.bankEmptyGlobal.title`
- `learner.examSession.empty.default.body`
- `learner.examSession.empty.default.title`
- `learner.examSession.empty.entitlementExcludesAll.body`
- `learner.examSession.empty.entitlementExcludesAll.title`
- `learner.examSession.empty.indeterminate.body`
- `learner.examSession.empty.indeterminate.title`
- `learner.examSession.start.cannotStart`
- `learner.examSession.start.examNotInPlan`
- `learner.examSession.start.examUnavailable`
- `learner.examSession.start.generic`
- `learner.examSession.start.serviceUnavailable`
- `learner.examSession.start.signInAgain`
- `learner.examSession.start.startFailed503`
- `learner.examSession.start.subscriptionRequired`
- `learner.flashcards.hub.allTags`
- `learner.flashcards.hub.bestStreak`
- `learner.flashcards.hub.bottomExamLessons`
- `learner.flashcards.hub.bottomQuestionBank`
- `learner.flashcards.hub.cardsCount`
- `learner.flashcards.hub.dayStreak`
- `learner.flashcards.hub.deckMetaPathway`
- `learner.flashcards.hub.dueToday`
- `learner.flashcards.hub.emptyLink`
- `learner.flashcards.hub.emptyPrefix`
- `learner.flashcards.hub.examFamilyAll`
- `learner.flashcards.hub.filterExamFamily`
- `learner.flashcards.hub.filterPathway`
- `learner.flashcards.hub.learning`
- `learner.flashcards.hub.loadDecksFailed`
- `learner.flashcards.hub.loadingDecks`
- `learner.flashcards.hub.next`
- `learner.flashcards.hub.overdue`
- `learner.flashcards.hub.pageOf`
- `learner.flashcards.hub.paginationAria`
- `learner.flashcards.hub.pathwayAll`
- `learner.flashcards.hub.previous`
- `learner.flashcards.hub.publicSeoCta`
- `learner.flashcards.hub.reviews`
- `learner.flashcards.hub.search`
- `learner.flashcards.hub.searchDecksLabel`
- `learner.flashcards.hub.searchPlaceholder`
- `learner.flashcards.hub.study`
- `learner.flashcards.hub.studyShuffled`
- `learner.flashcards.hub.subscribeUnlock`
- `learner.flashcards.hub.subscriptionRequired`
- `learner.flashcards.hub.subtitle`
- `learner.flashcards.hub.tagsPrefix`
- `learner.flashcards.hub.title`
- `learner.flashcards.hub.topicTag`
- `learner.flashcards.hub.weakAreasCta`
- `learner.flashcards.page.subtitle.locked`
- `learner.flashcards.page.title`
- `learner.loading.app`
- `learner.loading.flashcards`
- `learner.loading.questionBank`

*…and 192 additional missing keys after the top 100 (continue in the same priority order).*

---

## Locale: `tr`

| Group | Missing count |
|-------|----------------:|
| Pricing (`pages.pricing.*`) | 118 |
| Paywall (`paywall.*`) | 35 |
| Homepage (`home.*`, `pages.home.*`) | 393 |
| Navigation (`nav.*`) | 36 |
| Footer (`footer.*`) | 43 |
| Auth (`pages.login.*`, `pages.signup.*`, `auth.*`) | 17 |
| Other (not in scoped groups) | 596 |
| **Total missing** | **1238** |

### Top 100 missing keys (impact order: pricing → paywall → homepage → nav → footer → auth → other)

#### Pricing (`pages.pricing.*`)

- `pages.pricing.billing.heading`
- `pages.pricing.billing.helper`
- `pages.pricing.billing.recurringDisclosure`
- `pages.pricing.checkout.comingSoon`
- `pages.pricing.checkout.continue`
- `pages.pricing.checkout.mustAcceptPolicies`
- `pages.pricing.checkout.policyAckBetween1`
- `pages.pricing.checkout.policyAckBetween2`
- `pages.pricing.checkout.policyAckEnd`
- `pages.pricing.checkout.policyAckStart`
- `pages.pricing.checkout.policyPrivacyLabel`
- `pages.pricing.checkout.policyRefundLabel`
- `pages.pricing.checkout.policyTermsLabel`
- `pages.pricing.checkout.recurringShort`
- `pages.pricing.country.ca`
- `pages.pricing.country.us`
- `pages.pricing.countryLabel`
- `pages.pricing.description`
- `pages.pricing.duration.3month`
- `pages.pricing.duration.6month`
- `pages.pricing.duration.monthly`
- `pages.pricing.duration.yearly`
- `pages.pricing.error.checkoutNetwork`
- `pages.pricing.error.checkoutSignIn`
- `pages.pricing.error.checkoutUnavailable`
- `pages.pricing.error.loadPlans`
- `pages.pricing.h1`
- `pages.pricing.institutionalBanner`
- `pages.pricing.institutionalLink`
- `pages.pricing.intro`
- `pages.pricing.narrative.allied.headline`
- `pages.pricing.narrative.allied.headlineOutcome`
- `pages.pricing.narrative.allied.headlineUrgency`
- `pages.pricing.narrative.allied.included0`
- `pages.pricing.narrative.allied.included1`
- `pages.pricing.narrative.allied.included2`
- `pages.pricing.narrative.allied.included3`
- `pages.pricing.narrative.allied.outcome0`
- `pages.pricing.narrative.allied.outcome1`
- `pages.pricing.narrative.allied.outcome2`
- `pages.pricing.narrative.allied.proofLine`
- `pages.pricing.narrative.allied.subhead`
- `pages.pricing.narrative.lvn_lpn.headline`
- `pages.pricing.narrative.lvn_lpn.headlineOutcome`
- `pages.pricing.narrative.lvn_lpn.headlineUrgency`
- `pages.pricing.narrative.lvn_lpn.included0`
- `pages.pricing.narrative.lvn_lpn.included1`
- `pages.pricing.narrative.lvn_lpn.included2`
- `pages.pricing.narrative.lvn_lpn.included3`
- `pages.pricing.narrative.lvn_lpn.outcome0`
- `pages.pricing.narrative.lvn_lpn.outcome1`
- `pages.pricing.narrative.lvn_lpn.outcome2`
- `pages.pricing.narrative.lvn_lpn.proofLine`
- `pages.pricing.narrative.lvn_lpn.subhead`
- `pages.pricing.narrative.np.headline`
- `pages.pricing.narrative.np.headlineOutcome`
- `pages.pricing.narrative.np.headlineUrgency`
- `pages.pricing.narrative.np.included0`
- `pages.pricing.narrative.np.included1`
- `pages.pricing.narrative.np.included2`
- `pages.pricing.narrative.np.included3`
- `pages.pricing.narrative.np.outcome0`
- `pages.pricing.narrative.np.outcome1`
- `pages.pricing.narrative.np.outcome2`
- `pages.pricing.narrative.np.proofLine`
- `pages.pricing.narrative.np.subhead`
- `pages.pricing.narrative.rn.headline`
- `pages.pricing.narrative.rn.headlineOutcome`
- `pages.pricing.narrative.rn.headlineUrgency`
- `pages.pricing.narrative.rn.included0`
- `pages.pricing.narrative.rn.included1`
- `pages.pricing.narrative.rn.included2`
- `pages.pricing.narrative.rn.included3`
- `pages.pricing.narrative.rn.outcome0`
- `pages.pricing.narrative.rn.outcome1`
- `pages.pricing.narrative.rn.outcome2`
- `pages.pricing.narrative.rn.proofLine`
- `pages.pricing.narrative.rn.subhead`
- `pages.pricing.narrative.rpn.headline`
- `pages.pricing.narrative.rpn.headlineOutcome`
- `pages.pricing.narrative.rpn.headlineUrgency`
- `pages.pricing.narrative.rpn.included0`
- `pages.pricing.narrative.rpn.included1`
- `pages.pricing.narrative.rpn.included2`
- `pages.pricing.narrative.rpn.included3`
- `pages.pricing.narrative.rpn.outcome0`
- `pages.pricing.narrative.rpn.outcome1`
- `pages.pricing.narrative.rpn.outcome2`
- `pages.pricing.narrative.rpn.proofLine`
- `pages.pricing.narrative.rpn.subhead`
- `pages.pricing.narrative.variant.urgencyLine`
- `pages.pricing.plan.avgSuffix`
- `pages.pricing.plan.bestValue`
- `pages.pricing.plan.saveVsMonthly`
- `pages.pricing.preview.badge`
- `pages.pricing.preview.body`
- `pages.pricing.preview.metricAccuracy`
- `pages.pricing.preview.metricAccuracyCaption`
- `pages.pricing.preview.metricsLabel`
- `pages.pricing.preview.metricStreak`

*…and 1138 additional missing keys after the top 100 (continue in the same priority order).*

---

## Locale: `ur`

| Group | Missing count |
|-------|----------------:|
| Pricing (`pages.pricing.*`) | 118 |
| Paywall (`paywall.*`) | 35 |
| Homepage (`home.*`, `pages.home.*`) | 393 |
| Navigation (`nav.*`) | 36 |
| Footer (`footer.*`) | 43 |
| Auth (`pages.login.*`, `pages.signup.*`, `auth.*`) | 17 |
| Other (not in scoped groups) | 596 |
| **Total missing** | **1238** |

### Top 100 missing keys (impact order: pricing → paywall → homepage → nav → footer → auth → other)

#### Pricing (`pages.pricing.*`)

- `pages.pricing.billing.heading`
- `pages.pricing.billing.helper`
- `pages.pricing.billing.recurringDisclosure`
- `pages.pricing.checkout.comingSoon`
- `pages.pricing.checkout.continue`
- `pages.pricing.checkout.mustAcceptPolicies`
- `pages.pricing.checkout.policyAckBetween1`
- `pages.pricing.checkout.policyAckBetween2`
- `pages.pricing.checkout.policyAckEnd`
- `pages.pricing.checkout.policyAckStart`
- `pages.pricing.checkout.policyPrivacyLabel`
- `pages.pricing.checkout.policyRefundLabel`
- `pages.pricing.checkout.policyTermsLabel`
- `pages.pricing.checkout.recurringShort`
- `pages.pricing.country.ca`
- `pages.pricing.country.us`
- `pages.pricing.countryLabel`
- `pages.pricing.description`
- `pages.pricing.duration.3month`
- `pages.pricing.duration.6month`
- `pages.pricing.duration.monthly`
- `pages.pricing.duration.yearly`
- `pages.pricing.error.checkoutNetwork`
- `pages.pricing.error.checkoutSignIn`
- `pages.pricing.error.checkoutUnavailable`
- `pages.pricing.error.loadPlans`
- `pages.pricing.h1`
- `pages.pricing.institutionalBanner`
- `pages.pricing.institutionalLink`
- `pages.pricing.intro`
- `pages.pricing.narrative.allied.headline`
- `pages.pricing.narrative.allied.headlineOutcome`
- `pages.pricing.narrative.allied.headlineUrgency`
- `pages.pricing.narrative.allied.included0`
- `pages.pricing.narrative.allied.included1`
- `pages.pricing.narrative.allied.included2`
- `pages.pricing.narrative.allied.included3`
- `pages.pricing.narrative.allied.outcome0`
- `pages.pricing.narrative.allied.outcome1`
- `pages.pricing.narrative.allied.outcome2`
- `pages.pricing.narrative.allied.proofLine`
- `pages.pricing.narrative.allied.subhead`
- `pages.pricing.narrative.lvn_lpn.headline`
- `pages.pricing.narrative.lvn_lpn.headlineOutcome`
- `pages.pricing.narrative.lvn_lpn.headlineUrgency`
- `pages.pricing.narrative.lvn_lpn.included0`
- `pages.pricing.narrative.lvn_lpn.included1`
- `pages.pricing.narrative.lvn_lpn.included2`
- `pages.pricing.narrative.lvn_lpn.included3`
- `pages.pricing.narrative.lvn_lpn.outcome0`
- `pages.pricing.narrative.lvn_lpn.outcome1`
- `pages.pricing.narrative.lvn_lpn.outcome2`
- `pages.pricing.narrative.lvn_lpn.proofLine`
- `pages.pricing.narrative.lvn_lpn.subhead`
- `pages.pricing.narrative.np.headline`
- `pages.pricing.narrative.np.headlineOutcome`
- `pages.pricing.narrative.np.headlineUrgency`
- `pages.pricing.narrative.np.included0`
- `pages.pricing.narrative.np.included1`
- `pages.pricing.narrative.np.included2`
- `pages.pricing.narrative.np.included3`
- `pages.pricing.narrative.np.outcome0`
- `pages.pricing.narrative.np.outcome1`
- `pages.pricing.narrative.np.outcome2`
- `pages.pricing.narrative.np.proofLine`
- `pages.pricing.narrative.np.subhead`
- `pages.pricing.narrative.rn.headline`
- `pages.pricing.narrative.rn.headlineOutcome`
- `pages.pricing.narrative.rn.headlineUrgency`
- `pages.pricing.narrative.rn.included0`
- `pages.pricing.narrative.rn.included1`
- `pages.pricing.narrative.rn.included2`
- `pages.pricing.narrative.rn.included3`
- `pages.pricing.narrative.rn.outcome0`
- `pages.pricing.narrative.rn.outcome1`
- `pages.pricing.narrative.rn.outcome2`
- `pages.pricing.narrative.rn.proofLine`
- `pages.pricing.narrative.rn.subhead`
- `pages.pricing.narrative.rpn.headline`
- `pages.pricing.narrative.rpn.headlineOutcome`
- `pages.pricing.narrative.rpn.headlineUrgency`
- `pages.pricing.narrative.rpn.included0`
- `pages.pricing.narrative.rpn.included1`
- `pages.pricing.narrative.rpn.included2`
- `pages.pricing.narrative.rpn.included3`
- `pages.pricing.narrative.rpn.outcome0`
- `pages.pricing.narrative.rpn.outcome1`
- `pages.pricing.narrative.rpn.outcome2`
- `pages.pricing.narrative.rpn.proofLine`
- `pages.pricing.narrative.rpn.subhead`
- `pages.pricing.narrative.variant.urgencyLine`
- `pages.pricing.plan.avgSuffix`
- `pages.pricing.plan.bestValue`
- `pages.pricing.plan.saveVsMonthly`
- `pages.pricing.preview.badge`
- `pages.pricing.preview.body`
- `pages.pricing.preview.metricAccuracy`
- `pages.pricing.preview.metricAccuracyCaption`
- `pages.pricing.preview.metricsLabel`
- `pages.pricing.preview.metricStreak`

*…and 1138 additional missing keys after the top 100 (continue in the same priority order).*

---

## Locale: `vi`

| Group | Missing count |
|-------|----------------:|
| Pricing (`pages.pricing.*`) | 118 |
| Paywall (`paywall.*`) | 35 |
| Homepage (`home.*`, `pages.home.*`) | 393 |
| Navigation (`nav.*`) | 36 |
| Footer (`footer.*`) | 43 |
| Auth (`pages.login.*`, `pages.signup.*`, `auth.*`) | 17 |
| Other (not in scoped groups) | 596 |
| **Total missing** | **1238** |

### Top 100 missing keys (impact order: pricing → paywall → homepage → nav → footer → auth → other)

#### Pricing (`pages.pricing.*`)

- `pages.pricing.billing.heading`
- `pages.pricing.billing.helper`
- `pages.pricing.billing.recurringDisclosure`
- `pages.pricing.checkout.comingSoon`
- `pages.pricing.checkout.continue`
- `pages.pricing.checkout.mustAcceptPolicies`
- `pages.pricing.checkout.policyAckBetween1`
- `pages.pricing.checkout.policyAckBetween2`
- `pages.pricing.checkout.policyAckEnd`
- `pages.pricing.checkout.policyAckStart`
- `pages.pricing.checkout.policyPrivacyLabel`
- `pages.pricing.checkout.policyRefundLabel`
- `pages.pricing.checkout.policyTermsLabel`
- `pages.pricing.checkout.recurringShort`
- `pages.pricing.country.ca`
- `pages.pricing.country.us`
- `pages.pricing.countryLabel`
- `pages.pricing.description`
- `pages.pricing.duration.3month`
- `pages.pricing.duration.6month`
- `pages.pricing.duration.monthly`
- `pages.pricing.duration.yearly`
- `pages.pricing.error.checkoutNetwork`
- `pages.pricing.error.checkoutSignIn`
- `pages.pricing.error.checkoutUnavailable`
- `pages.pricing.error.loadPlans`
- `pages.pricing.h1`
- `pages.pricing.institutionalBanner`
- `pages.pricing.institutionalLink`
- `pages.pricing.intro`
- `pages.pricing.narrative.allied.headline`
- `pages.pricing.narrative.allied.headlineOutcome`
- `pages.pricing.narrative.allied.headlineUrgency`
- `pages.pricing.narrative.allied.included0`
- `pages.pricing.narrative.allied.included1`
- `pages.pricing.narrative.allied.included2`
- `pages.pricing.narrative.allied.included3`
- `pages.pricing.narrative.allied.outcome0`
- `pages.pricing.narrative.allied.outcome1`
- `pages.pricing.narrative.allied.outcome2`
- `pages.pricing.narrative.allied.proofLine`
- `pages.pricing.narrative.allied.subhead`
- `pages.pricing.narrative.lvn_lpn.headline`
- `pages.pricing.narrative.lvn_lpn.headlineOutcome`
- `pages.pricing.narrative.lvn_lpn.headlineUrgency`
- `pages.pricing.narrative.lvn_lpn.included0`
- `pages.pricing.narrative.lvn_lpn.included1`
- `pages.pricing.narrative.lvn_lpn.included2`
- `pages.pricing.narrative.lvn_lpn.included3`
- `pages.pricing.narrative.lvn_lpn.outcome0`
- `pages.pricing.narrative.lvn_lpn.outcome1`
- `pages.pricing.narrative.lvn_lpn.outcome2`
- `pages.pricing.narrative.lvn_lpn.proofLine`
- `pages.pricing.narrative.lvn_lpn.subhead`
- `pages.pricing.narrative.np.headline`
- `pages.pricing.narrative.np.headlineOutcome`
- `pages.pricing.narrative.np.headlineUrgency`
- `pages.pricing.narrative.np.included0`
- `pages.pricing.narrative.np.included1`
- `pages.pricing.narrative.np.included2`
- `pages.pricing.narrative.np.included3`
- `pages.pricing.narrative.np.outcome0`
- `pages.pricing.narrative.np.outcome1`
- `pages.pricing.narrative.np.outcome2`
- `pages.pricing.narrative.np.proofLine`
- `pages.pricing.narrative.np.subhead`
- `pages.pricing.narrative.rn.headline`
- `pages.pricing.narrative.rn.headlineOutcome`
- `pages.pricing.narrative.rn.headlineUrgency`
- `pages.pricing.narrative.rn.included0`
- `pages.pricing.narrative.rn.included1`
- `pages.pricing.narrative.rn.included2`
- `pages.pricing.narrative.rn.included3`
- `pages.pricing.narrative.rn.outcome0`
- `pages.pricing.narrative.rn.outcome1`
- `pages.pricing.narrative.rn.outcome2`
- `pages.pricing.narrative.rn.proofLine`
- `pages.pricing.narrative.rn.subhead`
- `pages.pricing.narrative.rpn.headline`
- `pages.pricing.narrative.rpn.headlineOutcome`
- `pages.pricing.narrative.rpn.headlineUrgency`
- `pages.pricing.narrative.rpn.included0`
- `pages.pricing.narrative.rpn.included1`
- `pages.pricing.narrative.rpn.included2`
- `pages.pricing.narrative.rpn.included3`
- `pages.pricing.narrative.rpn.outcome0`
- `pages.pricing.narrative.rpn.outcome1`
- `pages.pricing.narrative.rpn.outcome2`
- `pages.pricing.narrative.rpn.proofLine`
- `pages.pricing.narrative.rpn.subhead`
- `pages.pricing.narrative.variant.urgencyLine`
- `pages.pricing.plan.avgSuffix`
- `pages.pricing.plan.bestValue`
- `pages.pricing.plan.saveVsMonthly`
- `pages.pricing.preview.badge`
- `pages.pricing.preview.body`
- `pages.pricing.preview.metricAccuracy`
- `pages.pricing.preview.metricAccuracyCaption`
- `pages.pricing.preview.metricsLabel`
- `pages.pricing.preview.metricStreak`

*…and 1138 additional missing keys after the top 100 (continue in the same priority order).*

---

## Locale: `zh`

| Group | Missing count |
|-------|----------------:|
| Pricing (`pages.pricing.*`) | 118 |
| Paywall (`paywall.*`) | 35 |
| Homepage (`home.*`, `pages.home.*`) | 393 |
| Navigation (`nav.*`) | 36 |
| Footer (`footer.*`) | 43 |
| Auth (`pages.login.*`, `pages.signup.*`, `auth.*`) | 17 |
| Other (not in scoped groups) | 596 |
| **Total missing** | **1238** |

### Top 100 missing keys (impact order: pricing → paywall → homepage → nav → footer → auth → other)

#### Pricing (`pages.pricing.*`)

- `pages.pricing.billing.heading`
- `pages.pricing.billing.helper`
- `pages.pricing.billing.recurringDisclosure`
- `pages.pricing.checkout.comingSoon`
- `pages.pricing.checkout.continue`
- `pages.pricing.checkout.mustAcceptPolicies`
- `pages.pricing.checkout.policyAckBetween1`
- `pages.pricing.checkout.policyAckBetween2`
- `pages.pricing.checkout.policyAckEnd`
- `pages.pricing.checkout.policyAckStart`
- `pages.pricing.checkout.policyPrivacyLabel`
- `pages.pricing.checkout.policyRefundLabel`
- `pages.pricing.checkout.policyTermsLabel`
- `pages.pricing.checkout.recurringShort`
- `pages.pricing.country.ca`
- `pages.pricing.country.us`
- `pages.pricing.countryLabel`
- `pages.pricing.description`
- `pages.pricing.duration.3month`
- `pages.pricing.duration.6month`
- `pages.pricing.duration.monthly`
- `pages.pricing.duration.yearly`
- `pages.pricing.error.checkoutNetwork`
- `pages.pricing.error.checkoutSignIn`
- `pages.pricing.error.checkoutUnavailable`
- `pages.pricing.error.loadPlans`
- `pages.pricing.h1`
- `pages.pricing.institutionalBanner`
- `pages.pricing.institutionalLink`
- `pages.pricing.intro`
- `pages.pricing.narrative.allied.headline`
- `pages.pricing.narrative.allied.headlineOutcome`
- `pages.pricing.narrative.allied.headlineUrgency`
- `pages.pricing.narrative.allied.included0`
- `pages.pricing.narrative.allied.included1`
- `pages.pricing.narrative.allied.included2`
- `pages.pricing.narrative.allied.included3`
- `pages.pricing.narrative.allied.outcome0`
- `pages.pricing.narrative.allied.outcome1`
- `pages.pricing.narrative.allied.outcome2`
- `pages.pricing.narrative.allied.proofLine`
- `pages.pricing.narrative.allied.subhead`
- `pages.pricing.narrative.lvn_lpn.headline`
- `pages.pricing.narrative.lvn_lpn.headlineOutcome`
- `pages.pricing.narrative.lvn_lpn.headlineUrgency`
- `pages.pricing.narrative.lvn_lpn.included0`
- `pages.pricing.narrative.lvn_lpn.included1`
- `pages.pricing.narrative.lvn_lpn.included2`
- `pages.pricing.narrative.lvn_lpn.included3`
- `pages.pricing.narrative.lvn_lpn.outcome0`
- `pages.pricing.narrative.lvn_lpn.outcome1`
- `pages.pricing.narrative.lvn_lpn.outcome2`
- `pages.pricing.narrative.lvn_lpn.proofLine`
- `pages.pricing.narrative.lvn_lpn.subhead`
- `pages.pricing.narrative.np.headline`
- `pages.pricing.narrative.np.headlineOutcome`
- `pages.pricing.narrative.np.headlineUrgency`
- `pages.pricing.narrative.np.included0`
- `pages.pricing.narrative.np.included1`
- `pages.pricing.narrative.np.included2`
- `pages.pricing.narrative.np.included3`
- `pages.pricing.narrative.np.outcome0`
- `pages.pricing.narrative.np.outcome1`
- `pages.pricing.narrative.np.outcome2`
- `pages.pricing.narrative.np.proofLine`
- `pages.pricing.narrative.np.subhead`
- `pages.pricing.narrative.rn.headline`
- `pages.pricing.narrative.rn.headlineOutcome`
- `pages.pricing.narrative.rn.headlineUrgency`
- `pages.pricing.narrative.rn.included0`
- `pages.pricing.narrative.rn.included1`
- `pages.pricing.narrative.rn.included2`
- `pages.pricing.narrative.rn.included3`
- `pages.pricing.narrative.rn.outcome0`
- `pages.pricing.narrative.rn.outcome1`
- `pages.pricing.narrative.rn.outcome2`
- `pages.pricing.narrative.rn.proofLine`
- `pages.pricing.narrative.rn.subhead`
- `pages.pricing.narrative.rpn.headline`
- `pages.pricing.narrative.rpn.headlineOutcome`
- `pages.pricing.narrative.rpn.headlineUrgency`
- `pages.pricing.narrative.rpn.included0`
- `pages.pricing.narrative.rpn.included1`
- `pages.pricing.narrative.rpn.included2`
- `pages.pricing.narrative.rpn.included3`
- `pages.pricing.narrative.rpn.outcome0`
- `pages.pricing.narrative.rpn.outcome1`
- `pages.pricing.narrative.rpn.outcome2`
- `pages.pricing.narrative.rpn.proofLine`
- `pages.pricing.narrative.rpn.subhead`
- `pages.pricing.narrative.variant.urgencyLine`
- `pages.pricing.plan.avgSuffix`
- `pages.pricing.plan.bestValue`
- `pages.pricing.plan.saveVsMonthly`
- `pages.pricing.preview.badge`
- `pages.pricing.preview.body`
- `pages.pricing.preview.metricAccuracy`
- `pages.pricing.preview.metricAccuracyCaption`
- `pages.pricing.preview.metricsLabel`
- `pages.pricing.preview.metricStreak`

*…and 1138 additional missing keys after the top 100 (continue in the same priority order).*

---

## Locale: `zh-tw`

| Group | Missing count |
|-------|----------------:|
| Pricing (`pages.pricing.*`) | 118 |
| Paywall (`paywall.*`) | 35 |
| Homepage (`home.*`, `pages.home.*`) | 393 |
| Navigation (`nav.*`) | 36 |
| Footer (`footer.*`) | 43 |
| Auth (`pages.login.*`, `pages.signup.*`, `auth.*`) | 17 |
| Other (not in scoped groups) | 596 |
| **Total missing** | **1238** |

### Top 100 missing keys (impact order: pricing → paywall → homepage → nav → footer → auth → other)

#### Pricing (`pages.pricing.*`)

- `pages.pricing.billing.heading`
- `pages.pricing.billing.helper`
- `pages.pricing.billing.recurringDisclosure`
- `pages.pricing.checkout.comingSoon`
- `pages.pricing.checkout.continue`
- `pages.pricing.checkout.mustAcceptPolicies`
- `pages.pricing.checkout.policyAckBetween1`
- `pages.pricing.checkout.policyAckBetween2`
- `pages.pricing.checkout.policyAckEnd`
- `pages.pricing.checkout.policyAckStart`
- `pages.pricing.checkout.policyPrivacyLabel`
- `pages.pricing.checkout.policyRefundLabel`
- `pages.pricing.checkout.policyTermsLabel`
- `pages.pricing.checkout.recurringShort`
- `pages.pricing.country.ca`
- `pages.pricing.country.us`
- `pages.pricing.countryLabel`
- `pages.pricing.description`
- `pages.pricing.duration.3month`
- `pages.pricing.duration.6month`
- `pages.pricing.duration.monthly`
- `pages.pricing.duration.yearly`
- `pages.pricing.error.checkoutNetwork`
- `pages.pricing.error.checkoutSignIn`
- `pages.pricing.error.checkoutUnavailable`
- `pages.pricing.error.loadPlans`
- `pages.pricing.h1`
- `pages.pricing.institutionalBanner`
- `pages.pricing.institutionalLink`
- `pages.pricing.intro`
- `pages.pricing.narrative.allied.headline`
- `pages.pricing.narrative.allied.headlineOutcome`
- `pages.pricing.narrative.allied.headlineUrgency`
- `pages.pricing.narrative.allied.included0`
- `pages.pricing.narrative.allied.included1`
- `pages.pricing.narrative.allied.included2`
- `pages.pricing.narrative.allied.included3`
- `pages.pricing.narrative.allied.outcome0`
- `pages.pricing.narrative.allied.outcome1`
- `pages.pricing.narrative.allied.outcome2`
- `pages.pricing.narrative.allied.proofLine`
- `pages.pricing.narrative.allied.subhead`
- `pages.pricing.narrative.lvn_lpn.headline`
- `pages.pricing.narrative.lvn_lpn.headlineOutcome`
- `pages.pricing.narrative.lvn_lpn.headlineUrgency`
- `pages.pricing.narrative.lvn_lpn.included0`
- `pages.pricing.narrative.lvn_lpn.included1`
- `pages.pricing.narrative.lvn_lpn.included2`
- `pages.pricing.narrative.lvn_lpn.included3`
- `pages.pricing.narrative.lvn_lpn.outcome0`
- `pages.pricing.narrative.lvn_lpn.outcome1`
- `pages.pricing.narrative.lvn_lpn.outcome2`
- `pages.pricing.narrative.lvn_lpn.proofLine`
- `pages.pricing.narrative.lvn_lpn.subhead`
- `pages.pricing.narrative.np.headline`
- `pages.pricing.narrative.np.headlineOutcome`
- `pages.pricing.narrative.np.headlineUrgency`
- `pages.pricing.narrative.np.included0`
- `pages.pricing.narrative.np.included1`
- `pages.pricing.narrative.np.included2`
- `pages.pricing.narrative.np.included3`
- `pages.pricing.narrative.np.outcome0`
- `pages.pricing.narrative.np.outcome1`
- `pages.pricing.narrative.np.outcome2`
- `pages.pricing.narrative.np.proofLine`
- `pages.pricing.narrative.np.subhead`
- `pages.pricing.narrative.rn.headline`
- `pages.pricing.narrative.rn.headlineOutcome`
- `pages.pricing.narrative.rn.headlineUrgency`
- `pages.pricing.narrative.rn.included0`
- `pages.pricing.narrative.rn.included1`
- `pages.pricing.narrative.rn.included2`
- `pages.pricing.narrative.rn.included3`
- `pages.pricing.narrative.rn.outcome0`
- `pages.pricing.narrative.rn.outcome1`
- `pages.pricing.narrative.rn.outcome2`
- `pages.pricing.narrative.rn.proofLine`
- `pages.pricing.narrative.rn.subhead`
- `pages.pricing.narrative.rpn.headline`
- `pages.pricing.narrative.rpn.headlineOutcome`
- `pages.pricing.narrative.rpn.headlineUrgency`
- `pages.pricing.narrative.rpn.included0`
- `pages.pricing.narrative.rpn.included1`
- `pages.pricing.narrative.rpn.included2`
- `pages.pricing.narrative.rpn.included3`
- `pages.pricing.narrative.rpn.outcome0`
- `pages.pricing.narrative.rpn.outcome1`
- `pages.pricing.narrative.rpn.outcome2`
- `pages.pricing.narrative.rpn.proofLine`
- `pages.pricing.narrative.rpn.subhead`
- `pages.pricing.narrative.variant.urgencyLine`
- `pages.pricing.plan.avgSuffix`
- `pages.pricing.plan.bestValue`
- `pages.pricing.plan.saveVsMonthly`
- `pages.pricing.preview.badge`
- `pages.pricing.preview.body`
- `pages.pricing.preview.metricAccuracy`
- `pages.pricing.preview.metricAccuracyCaption`
- `pages.pricing.preview.metricsLabel`
- `pages.pricing.preview.metricStreak`

*…and 1138 additional missing keys after the top 100 (continue in the same priority order).*

---
