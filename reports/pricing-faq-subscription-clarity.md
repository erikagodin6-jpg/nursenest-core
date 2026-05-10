# Pricing / FAQ — subscription clarity (premium clinical readiness ecosystem)

**Date:** 2026-05-09  
**Scope:** Marketing pricing page, subscription FAQ, clinical readiness + Core vs Advanced ECG messaging.  
**Constraint:** No overpromising; Advanced ECG & Telemetry Mastery is **not** included in standard RN/PN/NP/Allied plans.

---

## 1. Audited source of truth

| Area | Location |
|------|----------|
| Tier ladder / plan ordering | `nursenest-core/src/lib/entitlements/accessible-tiers.ts` |
| Pathway coverage policy | `nursenest-core/src/lib/exam-pathways/pathway-entitlements-policy.ts` |
| Pricing display catalog (Stripe-aligned labels) | `nursenest-core/src/lib/pricing/display-catalog.ts` |
| ECG module gates (pathway/tier) | `nursenest-core/src/lib/ecg-module/ecg-module-config.ts` |
| Marketing copy (canonical EN overlay) | `tools/i18n/marketing/marketing-en.json` → `npm run i18n:compile` → `nursenest-core/public/i18n/` |
| Truthpack `product.json` | **Not present** in this workspace clone; tier/product alignment used **code + marketing overlay** instead |

### Plan inclusion decisions (high level)

- **RN / NCLEX-RN:** Full pathway suite per catalog + entitlements; Core ECG **where enabled** for supported tiers (see `ecg-module-config`).
- **PN / RPN / REx-Pn:** Pathway-specific surfaces per policy; **server-side ECG access blocked** for some PN pathways — copy uses **"where available / supported pathways"** and does **not** promise universal ECG.
- **NP, Allied, New Grad:** Driven by `display-catalog` + pathway policy; features listed only when entitlements/config support the claim or copy uses qualified language.

### Staff / admin

- Not marketed as a learner subscription tier; admin/staff remains **server-enforced** (DB roles); no change to entitlement APIs in this work.

### Future / separate

- **Advanced ECG & Telemetry Mastery:** Explicitly **coming soon**, **separate future premium product**, **not** in standard subscriptions (FAQ + dedicated block).
- **BLS/ACLS/PALS:** If mentioned, use **planned / emergency-response readiness** language; no official certification affiliation unless legally approved.

---

## 2. Files changed (implementation)

| File | Role |
|------|------|
| `tools/i18n/marketing/marketing-en.json` | Plan bullets, conversion clarity (`notIncluded4`), subscription FAQ `q1–q10`, ecosystem + ECG strings, compare/features grid keys, homepage premium ECG keys (contract alignment) |
| `nursenest-core/src/components/marketing/pricing-page-client.tsx` | Wires ecosystem, ECG clarity, subscription FAQ; i18n for checkout-cancelled notice |
| `nursenest-core/src/components/marketing/pricing-clinical-readiness-ecosystem.tsx` | Clinical readiness ecosystem section |
| `nursenest-core/src/components/marketing/pricing-ecg-clarity-block.tsx` | Core vs Advanced ECG block |
| `nursenest-core/src/components/marketing/pricing-subscription-faq.tsx` | Subscription FAQ accordion |
| `nursenest-core/src/components/marketing/pricing-sections.tsx` | Feature comparison + features grid use i18n keys |
| `nursenest-core/src/lib/marketing/pricing-faq-jsonld.ts` | JSON-LD for subscription FAQ |
| `nursenest-core/src/components/marketing/pricing-conversion-clarity.tsx` | Fourth "not included" slot |
| `scripts/contracts/pricing-conversion-clarity-keys.json` | Contract keys for conversion clarity |
| `nursenest-core/src/lib/marketing/pricing-subscription-clarity.contract.test.ts` | Asserts Advanced ECG never reads as included |
| `nursenest-core/tests/e2e/pricing/pricing-smoke.spec.ts` | Section test IDs + RN tab label |
| `nursenest-core/package.json` (`test:homepage`) | Includes subscription clarity contract test |

---

## 3. Modules: included vs future / separate

**Included (wording uses "where available / supported pathways" where needed):**  
Lessons, practice, flashcards, CAT/readiness where in catalog, progress/report card, adaptive flows, labs/dosage/OSCE/etc. only when copy matches product reality.

**Future / separate (explicit in UI):**  
Advanced ECG full program; any pathway not yet shipped — **coming soon** or omitted.

---

## 4. Advanced ECG disclaimer (required)

> Advanced ECG & Telemetry Mastery is positioned as a **future, separately priced** product. Standard RN/PN/NP/Allied subscriptions **do not** include it. FAQ and the ECG clarity block both enforce this.

---

## 5. BLS/ACLS/PALS legal / copy note

Do not claim official AHA/ECC certification, credentialing, or exam affiliation without legal approval. Prefer **planned emergency-response readiness pathways** language.

---

## 6. Tests run

| Command | Result |
|---------|--------|
| `npm run i18n:compile` (repo root) | Pass |
| `npm run typecheck:critical` (nursenest-core) | Pass (per session) |
| `npm run test:homepage` (nursenest-core) | Pass (includes `pricing-subscription-clarity.contract.test.ts`) |

**Not run in automation (needs dev server):**  
`nursenest-core/tests/e2e/pricing/pricing-smoke.spec.ts` — run with Playwright against a running app.

---

## 7. Screenshots (Phase 8)

**Not captured in this session.** When capturing:

- Pricing desktop / mobile  
- FAQ desktop / mobile  
- Core vs Advanced ECG block  
- Default (Ocean) vs Midnight/dark if theme toggle available  

Store under your team's usual path (e.g. `preview-screenshots/`, `reports/ui-redesign-preview/`).

---

## 8. Remaining product questions

1. **Exact Stripe price ↔ plan mapping** for marketing footnotes — confirm against live Stripe Product/Price metadata when refreshing numbers.  
2. **Per-pathway feature matrix** for marketing one-pager — optional doc if product wants a single table vetted by PM/legal.  
3. **When Advanced ECG launches**, update FAQ + block with SKU/entitlement flag names (no code duplication of Stripe IDs in copy).

---

## 9. Figma note

Layout reused existing marketing primitives and semantic tokens; no separate Figma deliverable was exported into the repo. If design reviews a visual refresh, align components with `nn-marketing-*` patterns and `semantic-status-tokens.css`.
