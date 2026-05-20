# NP specialty readiness audit

**Goal:** Audit NurseNest NP discoverability as a **multi-specialty public + learner ecosystem**, not an FNP-default funnel. This document tracks what should be true for `FNP`, `AGPCNP`, `PMHNP`, `WHNP`, `PNP-PC`, and `CNPLE` across sitemap coverage, public discovery, learner route access, and SEO depth.

**Constraints:** Read-only audit rubric. No schema, route-architecture, or entitlement redesign assumptions.

## Primary pathway IDs

| Specialty | Pathway ID | Canonical hub |
| --- | --- | --- |
| FNP | `us-np-fnp` | `/us/np/fnp` |
| AGPCNP | `us-np-agpcnp` | `/us/np/agpcnp` |
| PMHNP | `us-np-pmhnp` | `/us/np/pmhnp` |
| WHNP | `us-np-whnp` | `/us/np/whnp` |
| PNP-PC | `us-np-pnp-pc` | `/us/np/pnp-pc` |
| CNPLE | `ca-np-cnple` | `/canada/np/cnple` |

## 1. Sitemap presence

Audit:

- English `/{slug}` sitemap entries for shared NP discovery pages:
  - `/np-exam-practice-questions`
  - `/np-exam-prep`
  - `/np-clinical-cases`
  - `/cnple-practice-questions`
  - `/canada-np-exam-prep`
  - `/np-study-guide-canada`
- Localized `/{locale}/{slug}` emission for the same pages where the localized marketing shell exists.
- No stale hub-redirect suppression for live NP discovery pages.

Pass condition:

- Shared NP discovery slugs emit in English and localized marketing sitemap slices without duplicate canonical conflicts.

## 2. Internal linking and specialty discovery

Audit:

- Generic NP umbrella pages show specialty-first discovery before specialty-specific CTAs dominate.
- Header mega menu exposes direct specialty links for all six NP tracks.
- Footer includes direct NP specialty discovery without crowding RN / PN links.
- Homepage NP card copy reflects the multi-specialty ecosystem rather than only FNP or CNPLE.

Pass condition:

- A public user can discover each NP specialty from generic NP pages, header navigation, footer navigation, and the homepage without guessing hidden routes.

## 3. Canonical integrity

Audit:

- Shared NP discovery pages remain self-canonical where intended.
- Specialty hubs remain canonical at:
  - `/us/np/fnp`
  - `/us/np/agpcnp`
  - `/us/np/pmhnp`
  - `/us/np/whnp`
  - `/us/np/pnp-pc`
  - `/canada/np/cnple`
- No new redirect loops or duplicate canonical chains introduced by sitemap changes.

Pass condition:

- Discovery pages are indexable when live and specialty hubs retain stable canonical ownership.

## 4. Specialty route discovery

Audit:

- Public marketing hubs exist and are reachable for all six pathways.
- `getPathwayProgrammaticSeoLanding()` resolves:
  - US NP pathways to `/np-exam-prep`
  - CNPLE to `/canada-np-exam-prep`
- Generic NP product links resolve to discovery hubs rather than default FNP lesson/question/CAT URLs.

Pass condition:

- Specialty-neutral public discovery exists before users enter pathway-scoped question or CAT flows.

## 5. Lesson inventory

Audit:

- Confirm each specialty hub has an indexable lessons route.
- Spot-check that lesson entry counts are non-zero in environments where seeded or production data exists.

Pass condition:

- Each specialty has a reachable lessons hub, even if content depth varies by launch phase.

## 6. Question inventory

Audit:

- Confirm each specialty hub has a questions route.
- Verify generic umbrella CTAs no longer send US NP traffic directly to FNP question banks.

Pass condition:

- Users can reach pathway-scoped questions only after selecting the intended specialty, or directly from a specialty hub.

## 7. CAT readiness

Audit:

- Verify public CAT entry routes exist for each specialty hub.
- Confirm generic umbrella CTA routing does not skip specialty selection for US NP.

Pass condition:

- CAT is reachable from each specialty hub and generic discovery pages no longer imply FNP is the default CAT track.

## 8. Flashcard readiness

Audit:

- Confirm flashcard flows can be opened for the expanded NP pathway matrix (`us-np-fnp`, `us-np-agpcnp`, `us-np-pmhnp`, `us-np-whnp`, `us-np-pnp-pc`, `ca-np-cnple`).
- Validate specialty IDs are covered by cross-tier gating helpers and paid-pathway QA where applicable.

Pass condition:

- QA no longer treats NP as only FNP + CNPLE for flashcard access checks.

## 9. Mobile visibility

Audit:

- Generic NP discovery cards wrap cleanly on mobile.
- Header and footer specialty labels remain readable without clipping or mid-label wrapping.
- CNPLE still reads as Canada-specific on narrow screens.

Pass condition:

- Mobile public discovery is legible and hierarchy remains premium, not crowded.

## 10. Marketing distribution

Audit:

- Header, footer, homepage, and programmatic umbrella pages all surface specialty discovery.
- RN / PN prominence remains intact.

Pass condition:

- NP specialty discovery improves without turning the whole public chrome into an NP-first navigation system.

## 11. SEO cluster coverage

Audit:

- `np-advanced-seo-topics.ts` includes first-class `WHNP`.
- `np-advanced-seo-posts.ts` contains long-form coverage for:
  - WHNP
  - CNPLE
  - PNP-PC depth beyond one-off comparison posts
- Topic inventory reflects specialty-specific categories like pharmacology, clinical management, differential diagnosis, prenatal/gynecology, pediatrics, psych, and case-style prep.

Pass condition:

- Advanced NP SEO inventory no longer under-represents WHNP or treats CNPLE / PNP-PC as thin edge cases.

## Suggested verification commands

| Area | Command |
| --- | --- |
| Focused NP SEO units | `node --import tsx --test src/lib/seo/sitemap-public-index-filter.test.ts src/lib/seo/programmatic-page-links.test.ts src/lib/seo/pathway-programmatic-seo.test.ts src/lib/seo/np-advanced-seo-inventory.test.ts src/lib/navigation/marketing-mega-menu.test.ts` |
| Critical typecheck | `npm run typecheck:critical` |
| Sitemap / SEO validation | `npm run test:seo-sitemap` and repo SEO validation scripts |
| Marketing E2E | Relevant Playwright public marketing route specs for NP surfaces |
| Localized checks | Localized sitemap and i18n route readiness checks |

## Evidence checklist

- [ ] Shared NP discovery slugs appear in English sitemap output.
- [ ] Shared NP discovery slugs appear in localized marketing sitemap output.
- [ ] Generic NP umbrella pages show specialty cards.
- [ ] Header mega menu exposes six NP specialty links.
- [ ] Footer exposes six NP specialty links.
- [ ] Homepage NP copy describes multi-specialty NP coverage.
- [ ] WHNP is present in advanced topic and post inventories.
- [ ] PNP-PC and CNPLE inventory depth exceeds thin baseline coverage.
- [ ] Tier-product matrix includes all NP specialty pathway IDs.
