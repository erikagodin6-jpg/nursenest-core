# Duplicate route systems — NurseNest (audit only)

Overlapping URL patterns, parallel implementations, or naming that split ownership. No runtime changes in this document.

For each issue: route path or pattern, owner systems, active vs legacy, runtime risk, SEO risk, `SAFE_FOR_AI` or `DEV_ONLY`, recommended action.

---

## 1. Dual marketing trees (localized vs default)

| route path / pattern | owner systems | active or legacy | runtime risk | SEO risk | tag | recommended action |
|---------------------|---------------|------------------|--------------|----------|-----|---------------------|
| `/fr`, `/fr/:path*` | `(marketing)/[locale]/` vs nested `(marketing)/(default)/[locale]/` hubs | active by design | Medium — two chrome or i18n codepaths | Medium — mitigated by `X-Robots-Tag` on `/fr` in `next.config.mjs` | SAFE_FOR_AI | Maintain a matrix: which URLs live under which tree. |
| `/tools` vs `/fr/tools` | `(default)/tools` vs `[locale]/tools` | active | Low | Low for fr (noindex) | SAFE_FOR_AI | Watch copy and metadata parity. |

---

## 2. Static segment vs dynamic `[slug]` under locale

| route path / pattern | owner systems | active or legacy | runtime risk | SEO risk | tag | recommended action |
|---------------------|---------------|------------------|--------------|----------|-----|---------------------|
| `/{locale}/rn` | `(default)/[locale]/rn/page.tsx` (redirect to `/{locale}/rn/nclex-rn`) vs `[locale]/[slug]/page.tsx` (programmatic SEO) | active | Low–Medium — Next prefers static `rn` over dynamic `[slug]` for the same path | Medium — programmatic slug `rn` may not render at exact `/fr/rn` | SAFE_FOR_AI | Treat hub shortcut as owner of `/fr/rn`; exclude `rn` from programmatic slugs or document collision rule. |

---

## 3. English vs localized programmatic SEO

| route path / pattern | owner systems | active or legacy | runtime risk | SEO risk | tag | recommended action |
|---------------------|---------------|------------------|--------------|----------|-----|---------------------|
| `/seo/[slug]` vs `/{locale}/{slug}` | `(default)/seo/[slug]` vs `[locale]/[slug]` | active | Low | Medium — avoid duplicate English without canonical | SAFE_FOR_AI | Enforce canonical in metadata helpers. |

---

## 4. Blog namespaces

| route path / pattern | owner systems | active or legacy | runtime risk | SEO risk | tag | recommended action |
|---------------------|---------------|------------------|--------------|----------|-----|---------------------|
| `/blog/rn/*` vs `/nursing/rn/blog/*` | App pages vs `next.config.mjs` redirects | active + compat | None | Low | SAFE_FOR_AI | Keep redirects; update inbound links in content. |
| `/nursing/[careerSlug]/blog/*` vs `/blog/*` | `(default)/nursing/...` vs `blog/...` | active | Low | Medium overlap | SAFE_FOR_AI | Canonical per post type. |

---

## 5. Allied global vs country-prefixed

| route path / pattern | owner systems | active or legacy | runtime risk | SEO risk | tag | recommended action |
|---------------------|---------------|------------------|--------------|----------|-----|---------------------|
| `/allied/allied-health` vs `/us` or `/canada` allied prefixes | marketing pages vs Next redirects | active + compat | None | Low | SAFE_FOR_AI | Sitemaps should list global paths only. |

---

## 6. Learner practice vs exams vs CAT

| route path / pattern | owner systems | active or legacy | runtime risk | SEO risk | tag | recommended action |
|---------------------|---------------|------------------|--------------|----------|-----|---------------------|
| `/app/practice-tests/*`, `/app/exams/*`, `/app/cat/*` | `(learner)` + `/api/practice-tests/*` vs `/api/exams/*` | active | Medium — two API namespaces | Low (app noindex) | SAFE_FOR_AI | Document which API backs which UI. |

---

## 7. ECG and labs (learner vs modules vs admin)

| route path / pattern | owner systems | active or legacy | runtime risk | SEO risk | tag | recommended action |
|---------------------|---------------|------------------|--------------|----------|-----|---------------------|
| `/app/labs/*` | learner | active | Medium | Low | SAFE_FOR_AI | Clarify vs `/modules/lab-values`. |
| `/modules/ecg/*`, `/modules/lab-values/*`, `/modules/ecg-interpretation/*` | `app/modules` + `/api/modules/ecg/*` | active | Medium | Higher public index risk | SAFE_FOR_AI | Single hub canonical; cross-link from learner. |
| `/app/ecg-video-quiz` | learner | active | Low | Low | SAFE_FOR_AI | Avoid duplicate positioning vs modules. |
| `/admin/modules/ecg`, lab-values, med-calculations | admin | active | Low | N/A | DEV_ONLY | Label URLs next to public equivalents. |

---

## 8. Med math

| route path / pattern | owner systems | active or legacy | runtime risk | SEO risk | tag | recommended action |
|---------------------|---------------|------------------|--------------|----------|-----|---------------------|
| `/app/med-calculations/*` vs `/admin/modules/med-calculations` | learner vs admin CMS | active | Low | Learner noindex | SAFE_FOR_AI | Clear content owner vs consumption. |

---

## 9. Admin vs internal

| route path / pattern | owner systems | active or legacy | runtime risk | SEO risk | tag | recommended action |
|---------------------|---------------|------------------|--------------|----------|-----|---------------------|
| `/admin/*` vs `/internal/*` | `(admin)/admin` vs `internal/`; same proxy login gate in `src/proxy.ts` | active | Medium — two trees to harden | Low | DEV_ONLY | Merge under admin or document purpose. |

---

## 10. Proxy contract vs tests

| route path / pattern | owner systems | active or legacy | runtime risk | SEO risk | tag | recommended action |
|---------------------|---------------|------------------|--------------|----------|-----|---------------------|
| Marketing paths not in `proxy.ts` matcher | live proxy vs `middleware.test.ts` expectations | legacy narrative in tests | Low today | None | DEV_ONLY | Update tests to match matcher or drop obsolete assertions. |

---

## Systems summary

| System A | System B | Overlap |
|----------|----------|---------|
| `(marketing)/(default)` | `(marketing)/[locale]` | Parallel localized marketing |
| `(default)/[locale]/…` static hubs | `[locale]/[slug]` programmatic | Segment precedence |
| `/app/*` learner | `/modules/*` | Similar domains, different trees |
| `/api/exams/*` | `/api/practice-tests/*` | Naming overlap |
| `src/proxy.ts` | `src/middleware.test.ts` | Contract drift |
