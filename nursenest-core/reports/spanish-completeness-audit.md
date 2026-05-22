# Spanish Completeness Audit

Generated: 2026-05-22T01:24:20.619Z

Spanish key coverage: 100% (18828/18828)
Missing Spanish keys: 0
Extra Spanish keys: 0
Placeholder fields: 0
English leak suspicions: 4243
English-identical fields for human review: 12427

| Route | Surface | Score | Indexable | Review count | Top issue |
| --- | --- | ---: | --- | ---: | --- |
| /es | homepage | 100 | yes | 80 | brand.applyNest |
| /es/pricing | pricing | 100 | yes | 80 | footer.applyNest |
| /es/rn | rn-hub | 100 | yes | 80 | components.examPathwayHub.body.bulletFlashcards |
| /es/rex-pn | rex-pn-hub | 100 | yes | 80 | components.examPathwayHub.body.bulletFlashcards |
| /es/np | np-hub | 100 | yes | 80 | components.examPathwayHub.body.bulletFlashcards |
| /es/allied | allied-hub | 100 | yes | 75 | allied.alliedHealthHub.alliedHealthCareers |
| /es/lessons | lesson-library | 100 | yes | 54 | lessons.competitor.youtube |
| /es/question-bank | practice-questions | 100 | yes | 49 | footer.applyNest |
| /app/flashcards | flashcards | 100 | no | 47 | flashcards.categoryCardiovascular |
| /app/practice-tests/cat-launch | cat | 100 | no | 32 | nav.allied.caseSims |
| /es/login | auth | 100 | no | 80 | account.role.admin |

## Critical Review Fields

- allied.alliedHealthHub.alliedHealthCareers
- allied.alliedHealthHub.breadcrumb
- allied.alliedHealthHub.frequentlyAskedQuestions
- allied.alliedHealthHub.home
- allied.alliedHealthHub.jobOutlook
- allied.alliedHealthHub.salaryRange
- auth.transition.accountRecovery.eyebrow
- auth.transition.accountRecovery.help
- auth.transition.accountRecovery.loadingDetail
- auth.transition.accountRecovery.loadingHeadline
- auth.transition.accountRecovery.message
- auth.transition.accountRecovery.title
- auth.transition.authError.eyebrow
- auth.transition.authError.loadingHeadline
- auth.transition.authError.rateLimitedEyebrow
- auth.transition.authError.rateLimitedHelp
- auth.transition.authError.rateLimitedMessage
- auth.transition.authError.rateLimitedTitle
- auth.transition.common.alreadySignedInHelp
- auth.transition.common.ctaContinue
- auth.transition.common.ctaResume
- auth.transition.common.ctaStart
- auth.transition.common.exploreLessons
- auth.transition.common.signInContinue
- auth.transition.common.signInPrefix
- auth.transition.common.whatsNextEyebrow
- auth.transition.emailVerified.eyebrow
- auth.transition.emailVerified.help
- auth.transition.emailVerified.messageGeneral
- auth.transition.emailVerified.messageNp
- auth.transition.emailVerified.messageRn
- auth.transition.emailVerified.messageRpn
- auth.transition.emailVerified.title
- auth.transition.emailVerified.verifyBannerMessage
- auth.transition.emailVerified.verifyBannerTitle
- auth.transition.emailVerified.whatsNextTitleGeneral
- auth.transition.emailVerified.whatsNextTitleNp
- auth.transition.emailVerified.whatsNextTitleRn
- auth.transition.emailVerified.whatsNextTitleRpn
- auth.transition.loading.emailVerifiedDetail
- auth.transition.loading.emailVerifiedHeadline
- auth.transition.loading.oauthDetail
- auth.transition.loading.oauthHeadline
- auth.transition.loading.sessionDetail
- auth.transition.loading.sessionHeadline
- auth.transition.magicLink.confirmedEyebrow
- auth.transition.magicLink.confirmedMessage
- auth.transition.magicLink.confirmedTitle
- auth.transition.magicLink.expiredEyebrow
- auth.transition.magicLink.expiredHelp
- auth.transition.magicLink.expiredMessage
- auth.transition.magicLink.expiredTitle
- auth.transition.magicLink.invalidEyebrow
- auth.transition.magicLink.invalidMessage
- auth.transition.magicLink.invalidTitle
- auth.transition.magicLink.loadingDetail
- auth.transition.magicLink.loadingHeadline
- auth.transition.magicLink.sentEyebrow
- auth.transition.magicLink.sentHelp
- auth.transition.magicLink.sentMessage
- auth.transition.magicLink.sentTitle
- auth.transition.oauth.eyebrow
- auth.transition.oauth.helpDefault
- auth.transition.oauth.messageDefault
- auth.transition.oauth.providerApple
- auth.transition.oauth.providerGoogle
- auth.transition.oauth.providerUnknown
- auth.transition.oauth.title
- auth.transition.passwordReset.eyebrow
- auth.transition.passwordReset.help
- auth.transition.passwordReset.loadingDetail
- auth.transition.passwordReset.loadingHeadline
- auth.transition.passwordReset.message
- auth.transition.passwordReset.title
- auth.transition.sessionExpired.eyebrow
- auth.transition.sessionExpired.helpDefault
- auth.transition.sessionExpired.message
- auth.transition.sessionExpired.title
- auth.transition.signIn.alreadySignedInSuffix
- auth.transition.signIn.continuationNpDifferential
