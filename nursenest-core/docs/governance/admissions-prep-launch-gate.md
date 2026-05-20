# Admissions prep launch gate — HESI A2, HESI Exit, ATI TEAS

**Authority:** Product + engineering + clinical/editorial. **No partial public launches.**

Until **every** item in [Written launch gate](#written-launch-gate-all-items-required) is satisfied and signed off, these products **must** remain:

| Control | Requirement |
|--------|-------------|
| Registry | `status: "hidden"` on `us-allied-hesi-a2`, `us-allied-hesi-exit`, `us-allied-ati-teas` |
| Resolution | Internal QA only: `NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS=1` (server). **Unset in production** until launch. |
| SEO | `noindex`, `nofollow`; no intentional sitemap URLs; no regional hreflang for public discovery |
| Navigation | Not linked from main marketing nav or learner shell |
| Commerce | No Stripe products, checkout surfaces, or purchasable entitlements for these tracks |

**Do not** flip `hidden`, remove `noindex`, add sitemap entries, or enable checkout for “partial” readiness.

---

## Written launch gate (all items required)

A **single written launch record** (PR description, Notion page, or `docs/reports/` sign-off) must prove completion of **every** row below. Missing any row = **no public launch**.

### Content & taxonomy

- [ ] Full lesson taxonomy complete (aligned to `admissions-prep-taxonomy.ts` or superseding approved taxonomy).
- [ ] All **core** lessons authored and published per pathway.
- [ ] Flashcards complete per approved deck plan.
- [ ] Practice question pools complete (volume + tagging per pool IDs).
- [ ] Rationales complete for published practice items.

### Product behavior

- [ ] CAT / adaptive eligibility **confirmed** for launch, **or** intentionally excluded with documented UX (no ambiguous “coming soon” in prod surfaces).
- [ ] Report-card logic works end-to-end for these pathways.
- [ ] Study plan logic works end-to-end for these pathways.
- [ ] Premium vs free boundaries finalized and **server-enforced** (no client-only gates).

### Commerce & entitlements

- [ ] Stripe / subscription / entitlement logic finalized and reviewed (no accidental inclusion in unrelated checkout).

### Design

- [ ] Public hub design approved (Figma / governance process).
- [ ] Mobile design approved (themes as required by program).

### SEO & discovery

- [ ] SEO metadata complete and **final** (titles, descriptions — no placeholders).
- [ ] Sitemap inclusion **intentional** and implemented only at launch.
- [ ] `noindex` / `nofollow` removed **only** at launch (same release as public surfaces).

### Quality assurance

- [ ] Playwright **public route** tests passing for launched URLs.
- [ ] Checkout tests passing (no regressions; admissions SKUs behave as specified).
- [ ] Learner dashboard tests passing (pathway tiles, entitlements).
- [ ] Admin preview tests passing where applicable.
- [ ] Content QA complete.
- [ ] Clinical / editorial QA complete.
- [ ] Accessibility pass complete.

### Integrity

- [ ] No RN / NCLEX fallback content on admissions hubs or learner surfaces for these products.
- [ ] No placeholder content.
- [ ] No TODO copy in user-visible strings.
- [ ] No broken links.
- [ ] No unacceptable empty states (loading/error/empty must be designed).

---

## Launch execution order (after sign-off)

1. Remove production reliance on `NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS` for **public** resolution (or restrict flag to non-prod only).
2. Update pathway rows: `status` per registry policy (e.g. `active` / `upcoming`), `acquisitionMode` as approved.
3. Add to `PATHWAY_LAUNCH_APPROVED` and any nav/sitemap allowlists **in the same release**.
4. Update robots/metadata: indexable only when product explicitly allows; hreflang per regional strategy.
5. Run post-deploy verification: sitemap, Playwright matrix, spot-check checkout and learner flows.

---

## References

- `docs/reports/hesi-teas-architecture-readiness.md`
- `src/lib/exam-pathways/exam-pathways-data-segment-f-internal-admissions.ts`
- `src/lib/exam-pathways/admissions-prep-internal-pathways.ts`
- `docs/governance/figma-premium-ui-mandatory-process.md`
