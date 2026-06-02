# Footer redesign — Figma analysis (read-only)

**Date:** 2026-05-10  
**Scope:** Production marketing/admin footer implemented by `SiteFooter` only. No edits to `src/**` in this task.  
**Truthpack:** `.vibecheck/truthpack/copy.json` not present in this clone; strings below come from `site-footer.tsx`, `email-signup-banner.tsx`, and i18n key catalogs.

---

## Primary implementation

| Path | Role |
|------|------|
| `nursenest-core/src/components/layout/site-footer.tsx` | Main `SiteFooter` — marketing layouts + admin layout |
| `nursenest-core/src/components/marketing/email-signup-banner.tsx` | Email capture block used inside footer |
| `nursenest-core/src/components/i18n/marketing-language-preference.tsx` | Locale / language preference buttons (imported) |
| `nursenest-core/src/app/(marketing)/(default)/layout.tsx` | Passes `<SiteFooter serverHasStaffSession={…} />` via `trailingChrome` |
| `nursenest-core/src/app/(marketing)/[locale]/layout.tsx` | Same |
| `nursenest-core/src/app/(admin)/layout.tsx` | `<SiteFooter />` (no staff prop) |

**Not in scope for parity checklist:** `client/src/components/footer.tsx`, `allied-footer.tsx`, `blog-post-distribution-footer.tsx` — separate surfaces.

---

## Structure (top → bottom)

1. **`<footer>`** — `getNavChromeStyle(theme)` inline styles + `border-t`, vertical rhythm `--nn-rhythm-footer-y`, inset highlight shadow.
2. **Primary panel** — Rounded container (`rounded-2xl`) with border, mixed background, optional **leaf watermark** (`FooterLeafWatermark` / `useThemeLogo("leaf")`) — decorative only, `aria-hidden`.
3. **Five-column grid** (`lg:grid-cols-5`, `md:grid-cols-2`, default single column) — see columns below.
4. **Language block** — Separate bordered card: heading, `MarketingLanguagePreferenceList` (flag + name per locale, disabled/current styling), link to external “all languages” URL.
5. **Email signup** — `<EmailSignupBanner />` (title, subtitle, email field, submit; phase-2 message on submit).
6. **Legal row** — Copyright + `terms` · `privacy` inline links.
7. **Legal disclaimer** — Full-width centered small text (`footer.legalDisclaimer`).

---

## Column A — Brand

- **Logo:** `SiteBrandLogoMark variant="footer" logoVariant="leaf"` — Figma uses placeholder “use production FooterBrand”; do not redraw leaf asset.
- **Wordmark:** Plain text **“NurseNest”** next to logo (not i18n in component).
- **Copy (i18n):**
  - `footer.supportingNursesGlobally` (title case)
  - `footer.brandTagline` (sentence case)
  - `footer.globalPathwaysLine` (sentence case)

---

## Column B — Exam Pathways

**Section title (hardcoded):** “Exam Pathways” (title case via `formatTitleCase`).

| Link | Source |
|------|--------|
| RN | `publicExamPrepHubDestinations(region).rn` |
| PN / RPN / LVN label | `getNursingRoleLabel({ country: region, role: "PN" })` |
| NP | `examHubs.np` |
| Allied Health | `examHubs.allied` |

---

## Column C — Explore

**Section title:** “Explore”.

| Link | Href source |
|------|-------------|
| Pricing | `explore.pricing` |
| For schools / institutions | `/for-institutions` + `footer.forSchools` |
| Lessons | `explore.lessons` |
| Practice Questions | `explore.practiceQuestions` |
| Blog | `/blog` |
| Tools | `explore.tools` |

---

## Column D — Regional hubs

**Section title:** `footer.regionalHubLinks` with **fallback** `"Regional hubs"`.

**Links:** `countryNav.footerFeatured` (`src/lib/marketing/countries/registry.ts`): Canada (REx-PN prep, Canadian NCLEX-RN, Nursing in Canada); US (NCLEX-RN, NCLEX-PN, US exam hub); Philippines (NLE guide, Canada hub, US hub); Middle East (Saudi Prometric, DHA, Middle East exams); China/Japan/Portugal — same featured set as Canada.

---

## Column E — Account (session-dependent)

**Section title:** “Account”.

- **Anonymous:** `nav.logIn`; email support + `SUPPORT_RESPONSE_TIME_COPY`; CTA `PRIMARY_CTA` (“Start studying”) → signup with question-bank callback.
- **Admin:** Admin link (`ADMIN_DASHBOARD_HREF`), Dashboard `/app`, email support.
- **Entitled learner:** Dashboard, Account `/app/account/overview`, email support, CTA `CONTINUE_STUDYING_CTA` (“Continue study”).
- **Signed-in other:** Dashboard, Pricing, email support, CTA “Start studying”.

---

## Language & locale

| Element | Keys / behavior |
|---------|-----------------|
| Block heading | `footer.studyInYourLanguage` |
| Preference UI | `MarketingLanguagePreferenceList` |
| View all | `footer.viewAllLanguages` → `externalMarketingLanguagesHref()` |

**Mobile:** Grid stacks — 1 col default, 2 cols `md`, 5 cols `lg+`. No accordion.

---

## Newsletter (`EmailSignupBanner`)

`footer.emailBannerTitle`, `footer.emailBannerSubtitle`, `home.email.placeholder`, `home.email.button`, `footer.emailBannerPhase2` on submit.

---

## Legal

`brand.nurseNest`, `footer.rights`, `footer.terms`, `footer.privacy`, `footer.legalDisclaimer`.

**Social:** none. **Trust badges:** none (disclaimer text only). **`data-testid`:** none in footer components.

---

## Theming

`getNavChromeStyle(theme)`; tokens `--footer-border`, `--footer-fg`, `--footer-bg`, `--footer-muted`; email banner uses semantic panel tokens.

---

## “Nothing removed” checklist

- [ ] Brand + wordmark + 3 i18n lines + logo placeholder note  
- [ ] Exam Pathways ×4  
- [ ] Explore ×6  
- [ ] Regional hubs ×3 + title key/fallback  
- [ ] Account states (anon / admin / entitled / other)  
- [ ] Language block + view-all external link  
- [ ] Email banner full  
- [ ] Copyright + terms + privacy  
- [ ] Legal disclaimer  
- [ ] Leaf watermark = production asset only  
- [ ] Do not add social  


---

## Appendix — `data-testid`

No `data-testid` attributes on `SiteFooter`, `FLink`, `FooterLeafWatermark`, or `EmailSignupBanner` (repo grep).

---

## Appendix — Regional `footerFeatured` by country

| Country code | Labels (typical) |
|--------------|------------------|
| canada | REx-PN prep; Canadian NCLEX-RN; Nursing in Canada |
| us | NCLEX-RN; NCLEX-PN; US exam hub |
| philippines | NLE guide; Canada hub; US hub |
| middle-east | Saudi Prometric; DHA; Middle East exams |
| china, japan, portugal | Same as Canada (spread config) |

---

## Appendix — Account matrix (preserve in Figma specs)

| State | Links / CTAs |
|-------|----------------|
| Anonymous | Log in; Email support; **Start studying** CTA |
| Admin | Admin; Dashboard; Email support |
| Entitled learner | Dashboard; Account; Email support; **Continue study** CTA |
| Signed-in (not admin, not entitled) | Dashboard; Pricing; Email support; **Start studying** CTA |
