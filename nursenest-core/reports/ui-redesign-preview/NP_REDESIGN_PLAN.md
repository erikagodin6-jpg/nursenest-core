# NP (Nurse Practitioner) pathway vertical slice — redesign plan

## Audit summary (routes)

NP marketing surfaces use the shared **`/[locale]/[slug]/[examCode]`** segment (`ExamPathwayOverviewPage`). US NP tracks include `fnp`, `agpcnp`, `pmhnp`, `whnp`, `pnp-pc` (see `exam-product-registry` / `exam-pathways-data-*`). Canada NP uses `cnple` under `/canada/np/cnple`. Shortcut `/[locale]/np` redirects to default NP hub per locale.

**Primary UI shells**

| Surface | Component / entry |
|--------|---------------------|
| NP tier overview hub | `NursingTierHubPage` + `buildNursingTierHubContent` |
| NP lesson hubs | `FnpLessonsHub`, `PathwayLessonsGroupedHub` (`visualTone="np"`), `PathwayTopicClusterGroupedNav` |
| Questions / CAT | `[examCode]/questions`, `/cat` (existing pathway components) |

**Non-goals (hard rules)**  
No leaf logo change; no routing, entitlements, SEO, analytics event names, auth, loaders, or Prisma client changes; no raw i18n keys.

## Design intent

1. **Homepage parity** — reuse `premium-redesign-2026.css` patterns (radial accents, soft grid, inset highlight) scoped to NP.
2. **Graduate-level polish** — NP hero band: brand + multi-hue chart tokens (not flat grey).
3. **Semantic topic colouring** — topic-cluster **editorial groups** map to `semantic-*` / `semantic-chart-*` / panel tokens in CSS (not hex).
4. **Lesson spine alignment** — NP lesson sections already use `lesson-section-theme.ts` roles (diagnostics, pharm, pearls, patient ed); hub browse chips complement that story at cluster level.

## Implementation slices (executed)

1. **NP overview hub** — `data-pathway-track={roleTrack}` on `NursingTierHubPage`; NP-specific hero band rules under `[data-pathway-track="np"]`.
2. **NP lesson hubs** — `PathwayTopicClusterGroupedNav` gains optional `tone="np"`; passed when NP lesson hub tone applies.
3. **Topic cluster groups** — Each group gets `nn-np-topic-group--<groupId>` and shared chip styles `nn-np-topic-chip` with group-local `--nn-np-group-accent`.
4. **Overflow** — Chips use `min-w-0`, `max-width`, `text-balance`, responsive wrapping inside `.nn-np-hub-root`.

## Validation checklist

- `npm run typecheck:critical`
- `npm run test:homepage`
- Playwright `tests/e2e/public/np-qa-regression.spec.ts` (requires **local dev server** on configured `baseURL`)

## Screenshots

Capture desktop + mobile after dev server: `/us/np/fnp`, `/us/np/fnp/lessons`, `/canada/np/cnple` into `preview-screenshots/` and this folder.
