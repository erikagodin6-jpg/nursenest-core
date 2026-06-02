# i18n Missing Or Invalid Translation Audit

Generated: 2026-05-29

## Summary

- Production artifact scan found 118 unique `missing_or_invalid` translation keys.
- All 118 keys now resolve in `../client/public/i18n/en.json`.
- All 118 public homepage keys now resolve in `public/i18n/en/pages.json`.
- `npm run i18n:validate-runtime` now enforces this contract in CI.

## Source Artifacts Scanned

- `playwright-report-full-regression`
- `reports`
- `tmp`
- `data`
- `logs`

## Missing Keys Recovered

- `pages.home.hero.panel.ecgBpm`
- `pages.home.hero.panel.masteredUnit`
- `pages.home.hero.panel.mini1.sub`
- `pages.home.hero.panel.mini1.title`
- `pages.home.hero.panel.mini2.sub`
- `pages.home.hero.panel.mini2.title`
- `pages.home.hero.panel.readinessValue`
- `pages.home.hero.panel.streakValue`
- `pages.home.hero.panel.tag`
- `pages.home.hero.statsLine.lessons`
- `pages.home.hero.statsLine.questions`
- `pages.home.hero.statsLine.separator`
- `pages.home.hero.trust.cat`
- `pages.home.hero.trust.evidence`
- `pages.home.premium.bottomCta.assurance0`
- `pages.home.premium.bottomCta.assurance1`
- `pages.home.premium.bottomCta.assurance2`
- `pages.home.premium.bottomCta.body`
- `pages.home.premium.bottomCta.eyebrow`
- `pages.home.premium.bottomCta.heading`
- `pages.home.premium.bottomCta.primaryCta`
- `pages.home.premium.bottomCta.secondaryCta`
- `pages.home.premium.bottomCta.tiles.lessons.label`
- `pages.home.premium.bottomCta.tiles.lessons.title`
- `pages.home.premium.bottomCta.tiles.practice.label`
- `pages.home.premium.bottomCta.tiles.practice.title`
- `pages.home.premium.bottomCta.tiles.schools.label`
- `pages.home.premium.bottomCta.tiles.schools.title`
- `pages.home.premium.clinicalDepth.body`
- `pages.home.premium.clinicalDepth.cards.diagnostics.body`
- `pages.home.premium.clinicalDepth.cards.diagnostics.title`
- `pages.home.premium.clinicalDepth.cards.interventions.body`
- `pages.home.premium.clinicalDepth.cards.interventions.title`
- `pages.home.premium.clinicalDepth.cards.medications.body`
- `pages.home.premium.clinicalDepth.cards.medications.title`
- `pages.home.premium.clinicalDepth.cards.pathophysiology.body`
- `pages.home.premium.clinicalDepth.cards.pathophysiology.title`
- `pages.home.premium.clinicalDepth.cards.pearls.body`
- `pages.home.premium.clinicalDepth.cards.pearls.title`
- `pages.home.premium.clinicalDepth.cards.redFlags.body`
- `pages.home.premium.clinicalDepth.cards.redFlags.title`
- `pages.home.premium.clinicalDepth.eyebrow`
- `pages.home.premium.clinicalDepth.heading`
- `pages.home.premium.clinicalDepth.priorityCueBody`
- `pages.home.premium.clinicalDepth.priorityCueLabel`
- `pages.home.premium.pathways.allied.body`
- `pages.home.premium.pathways.allied.cta`
- `pages.home.premium.pathways.allied.subtitle`
- `pages.home.premium.pathways.allied.title`
- `pages.home.premium.pathways.body`
- `pages.home.premium.pathways.eyebrow`
- `pages.home.premium.pathways.heading`
- `pages.home.premium.pathways.internationalRn.body`
- `pages.home.premium.pathways.internationalRn.cta`
- `pages.home.premium.pathways.internationalRn.subtitle`
- `pages.home.premium.pathways.internationalRn.title`
- `pages.home.premium.pathways.np.body`
- `pages.home.premium.pathways.np.cta`
- `pages.home.premium.pathways.np.subtitle`
- `pages.home.premium.pathways.np.title`
- `pages.home.premium.pathways.pn.body`
- `pages.home.premium.pathways.pn.cta`
- `pages.home.premium.pathways.pn.subtitle`
- `pages.home.premium.pathways.pn.title`
- `pages.home.premium.pathways.rn.body`
- `pages.home.premium.pathways.rn.cta`
- `pages.home.premium.pathways.rn.subtitle`
- `pages.home.premium.pathways.rn.title`
- `pages.home.premium.readiness.body`
- `pages.home.premium.readiness.catCta`
- `pages.home.premium.readiness.domains.fundamentals`
- `pages.home.premium.readiness.domains.maternity`
- `pages.home.premium.readiness.domains.medSurg`
- `pages.home.premium.readiness.domains.pediatrics`
- `pages.home.premium.readiness.domains.pharmacology`
- `pages.home.premium.readiness.domains.psych`
- `pages.home.premium.readiness.eyebrow`
- `pages.home.premium.readiness.heading`
- `pages.home.premium.readiness.metricNext.label`
- `pages.home.premium.readiness.metricNext.value`
- `pages.home.premium.readiness.metricProgress.label`
- `pages.home.premium.readiness.metricProgress.value`
- `pages.home.premium.readiness.metricStreak.label`
- `pages.home.premium.readiness.metricStreak.value`
- `pages.home.premium.readiness.previewBody`
- `pages.home.premium.readiness.previewHeading`
- `pages.home.premium.readiness.previewLabel`
- `pages.home.premium.studyEcosystem.body`
- `pages.home.premium.studyEcosystem.eyebrow`
- `pages.home.premium.studyEcosystem.heading`
- `pages.home.premium.studyEcosystem.steps.assess.body`
- `pages.home.premium.studyEcosystem.steps.assess.cta`
- `pages.home.premium.studyEcosystem.steps.assess.label`
- `pages.home.premium.studyEcosystem.steps.assess.title`
- `pages.home.premium.studyEcosystem.steps.practice.body`
- `pages.home.premium.studyEcosystem.steps.practice.cta`
- `pages.home.premium.studyEcosystem.steps.practice.label`
- `pages.home.premium.studyEcosystem.steps.practice.title`
- `pages.home.premium.studyEcosystem.steps.read.body`
- `pages.home.premium.studyEcosystem.steps.read.cta`
- `pages.home.premium.studyEcosystem.steps.read.label`
- `pages.home.premium.studyEcosystem.steps.read.title`
- `pages.home.premium.studyEcosystem.steps.recall.body`
- `pages.home.premium.studyEcosystem.steps.recall.cta`
- `pages.home.premium.studyEcosystem.steps.recall.label`
- `pages.home.premium.studyEcosystem.steps.recall.title`
- `pages.home.premium.trust.body`
- `pages.home.premium.trust.cards.np.badge`
- `pages.home.premium.trust.cards.np.name`
- `pages.home.premium.trust.cards.np.quote`
- `pages.home.premium.trust.cards.pn.badge`
- `pages.home.premium.trust.cards.pn.name`
- `pages.home.premium.trust.cards.pn.quote`
- `pages.home.premium.trust.cards.rn.badge`
- `pages.home.premium.trust.cards.rn.name`
- `pages.home.premium.trust.cards.rn.quote`
- `pages.home.premium.trust.eyebrow`
- `pages.home.premium.trust.heading`

## Validation Commands

- `npm run i18n:ci`
- `node --import tsx --test src/lib/i18n/i18n-runtime-key-validation.contract.test.ts`

