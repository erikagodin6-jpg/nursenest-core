# Runtime Boundary Audit

Generated: 2026-05-25T11:44:31.887Z

## Summary

- Files with runtime dependencies: 2773
- Critical public files: 8
- Blocking core public files: 0
- Public marketing provider passive: yes
- Learner app provider authenticated: yes

## Route Groups

| Group | Files | High/Cross Blast Radius | Public Auth Runtime | Top Dependencies |
| --- | ---: | ---: | ---: | --- |
| admin | 98 | 0 | 0 | force-dynamic 97, request-api 21, prisma 21, entitlement 9, provider 4, marketing-loader 3 |
| admin-api | 177 | 0 | 0 | middleware 177, prisma 112, force-dynamic 64, request-api 46, provider 37, cache-isr 10 |
| api | 184 | 0 | 0 | middleware 175, force-dynamic 109, entitlement 98, prisma 88, provider 74, auth-server 51 |
| auth | 8 | 0 | 0 | middleware 7, prisma 5, auth-server 3, provider 2, force-dynamic 2, entitlement 1 |
| learner | 132 | 0 | 0 | auth-server 70, learner-loader 62, entitlement 54, request-api 39, marketing-loader 38, force-dynamic 36 |
| other | 25 | 0 | 0 | force-dynamic 14, request-api 6, cache-isr 3, layout 2, auth-server 2, provider 2 |
| public | 295 | 78 | 7 | cache-isr 186, marketing-loader 150, force-dynamic 76, request-api 35, layout 16, provider 11 |
| runtime | 6 | 0 | 0 | force-dynamic 6, layout 1 |
| shared-component | 505 | 119 | 0 | marketing-loader 275, learner-loader 191, provider 105, entitlement 55, request-api 30, auth-session-client 23 |
| shared-lib | 1343 | 698 | 0 | entitlement 432, provider 407, learner-loader 358, prisma 343, marketing-loader 184, request-api 47 |

## Critical Public Dependencies

- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/flashcards/page.tsx` — optional-public-session, direct-prisma-client
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx` — learner-server-loader
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx` — learner-server-loader
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/report-card/page.tsx` — optional-public-session
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/simulation/page.tsx` — optional-public-session
- `src/app/(marketing)/(default)/allied-health/[slug]/page.tsx` — direct-prisma-client
- `src/app/(marketing)/(default)/allied/[career]/page.tsx` — optional-public-session, direct-prisma-client
- `src/app/(marketing)/(default)/allied/allied-health/page.tsx` — optional-public-session, direct-prisma-client

## Highest Blast Radius Files

- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/[exam]/page.tsx` (public) — force-dynamic, cache-isr, marketing-loader
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx` (public) — provider, request-api, force-dynamic, cache-isr, learner-loader, marketing-loader
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/clinical-scenarios/page.tsx` (public) — force-dynamic, cache-isr
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/flashcards/page.tsx` (public) — prisma, force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/layout.tsx` (public) — layout, request-api, force-dynamic
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/page.tsx` (public) — entitlement, request-api, force-dynamic
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx` (public) — provider, entitlement, request-api, learner-loader, marketing-loader
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx` (public) — provider, request-api, force-dynamic, cache-isr, learner-loader, marketing-loader
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/topics/[topicSlug]/page.tsx` (public) — request-api, force-dynamic
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/osce/[stationId]/page.tsx` (public) — force-dynamic, cache-isr
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/osce/page.tsx` (public) — force-dynamic, cache-isr
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx` (public) — request-api, force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/pricing/page.tsx` (public) — force-dynamic, cache-isr, marketing-loader
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx` (public) — provider, request-api, force-dynamic, cache-isr, learner-loader, marketing-loader
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/report-card/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/simulation/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/study-resources/[bodyKey]/page.tsx` (public) — force-dynamic, cache-isr
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/study/[topicSlug]/page.tsx` (public) — force-dynamic, cache-isr
- `src/app/(marketing)/(default)/allied-health/[slug]/lessons/[lessonSlug]/page.tsx` (public) — force-dynamic
- `src/app/(marketing)/(default)/allied-health/[slug]/lessons/page.tsx` (public) — request-api, force-dynamic
- `src/app/(marketing)/(default)/allied-health/[slug]/page.tsx` (public) — prisma, force-dynamic, cache-isr, marketing-loader
- `src/app/(marketing)/(default)/allied-health/page.tsx` (public) — force-dynamic, cache-isr, marketing-loader
- `src/app/(marketing)/(default)/allied/[career]/lessons/page.tsx` (public) — force-dynamic
- `src/app/(marketing)/(default)/allied/[career]/modules/[moduleSlug]/page.tsx` (public) — entitlement, force-dynamic
- `src/app/(marketing)/(default)/allied/[career]/modules/page.tsx` (public) — force-dynamic
- `src/app/(marketing)/(default)/allied/[career]/page.tsx` (public) — prisma, request-api, force-dynamic, cache-isr, marketing-loader
- `src/app/(marketing)/(default)/allied/allied-health/cat/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/allied/allied-health/page.tsx` (public) — prisma, request-api, force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/australia/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/blog/page.tsx` (public) — request-api, force-dynamic, cache-isr, marketing-loader
- `src/app/(marketing)/(default)/canada/np/cnple/page.tsx` (public) — force-dynamic
- `src/app/(marketing)/(default)/canada/rn/nclex-rn/page.tsx` (public) — force-dynamic
- `src/app/(marketing)/(default)/china/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/exams/layout.tsx` (public) — layout, force-dynamic
- `src/app/(marketing)/(default)/exams/uk/page.tsx` (public) — learner-loader, marketing-loader
- `src/app/(marketing)/(default)/flashcards/[slug]/page.tsx` (public) — force-dynamic, cache-isr, marketing-loader
- `src/app/(marketing)/(default)/flashcards/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/france/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/germany/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/hungary/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/india/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/italy/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/japan/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/korea/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/layout.tsx` (public) — layout, provider, auth-session-client, request-api, force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/lessons/page.tsx` (public) — force-dynamic, cache-isr, marketing-loader
- `src/app/(marketing)/(default)/login/page.tsx` (public) — provider, force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/medical-laboratory-technology/specialty-modules/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/mexico/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/middle-east/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/page.tsx` (public) — force-dynamic, cache-isr, marketing-loader
- `src/app/(marketing)/(default)/portugal/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/pre-nursing/[slug]/page.tsx` (public) — force-dynamic, cache-isr
- `src/app/(marketing)/(default)/pre-nursing/lessons/[slug]/page.tsx` (public) — force-dynamic, cache-isr
- `src/app/(marketing)/(default)/pre-nursing/lessons/page.tsx` (public) — request-api, force-dynamic, cache-isr, marketing-loader
- `src/app/(marketing)/(default)/pre-nursing/practice/[slug]/page.tsx` (public) — force-dynamic
- `src/app/(marketing)/(default)/reset-password/page.tsx` (public) — request-api, force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/respiratory-therapy/ventilator-training/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/signup/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/tools/[slug]/page.tsx` (public) — force-dynamic, cache-isr, marketing-loader
- `src/app/(marketing)/(default)/tools/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/(default)/verify-email/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/[locale]/[slug]/[examCode]/[exam]/blog/[postSlug]/page.tsx` (public) — force-dynamic, cache-isr
- `src/app/(marketing)/[locale]/australia/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/[locale]/china/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/[locale]/france/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/[locale]/germany/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/[locale]/hungary/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/[locale]/india/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/[locale]/italy/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/[locale]/japan/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/[locale]/korea/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/[locale]/layout.tsx` (public) — layout, provider, auth-session-client, request-api, force-dynamic, marketing-loader
- `src/app/(marketing)/[locale]/mexico/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/[locale]/middle-east/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/[locale]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/[locale]/portugal/[topic]/page.tsx` (public) — force-dynamic, marketing-loader
- `src/app/(marketing)/[locale]/pre-nursing/lessons/[slug]/page.tsx` (public) — force-dynamic, cache-isr
- `src/components/account/account-delete-danger-zone.tsx` (shared-component) — auth-session-client
- `src/components/admin/admin-ai-assistant-client.test.tsx` (shared-component) — provider

