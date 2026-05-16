# ECG Production Release Checklist

This checklist blocks ECG publication until the module is clinically credible, visually polished, secure, and monetization-ready.

## Release Status

**Current default status:** not publishable until all required gates below pass.

Do not set Core ECG or Advanced ECG to published unless every Required item is complete.

---

## 1. Clinical Accuracy Gate — Required

### Adult ECG
- [ ] Sinus rhythms clinically reviewed
- [ ] Atrial rhythms clinically reviewed
- [ ] Junctional rhythms clinically reviewed
- [ ] Ventricular rhythms clinically reviewed
- [ ] AV blocks clinically reviewed
- [ ] Bundle branch blocks clinically reviewed
- [ ] STEMI / ischemia localization clinically reviewed
- [ ] Electrolyte and toxicology ECG patterns clinically reviewed
- [ ] Pacemaker and device interpretation clinically reviewed

### Pediatric ECG
- [ ] Pediatric normal variants reviewed separately from adult normals
- [ ] Pediatric rate/interval assumptions reviewed
- [ ] Pediatric SVT reviewed
- [ ] Pediatric WPW/accessory pathway content reviewed
- [ ] Pediatric myocarditis/deterioration content reviewed
- [ ] Pediatric congenital rhythm content reviewed
- [ ] PALS/ACLS scoring separation verified

### Neonatal ECG
- [ ] Neonatal normal variants reviewed separately from pediatric/adult normals
- [ ] Transitional circulation framing reviewed
- [ ] Neonatal SVT reviewed
- [ ] Congenital AV block reviewed
- [ ] Congenital lesion telemetry reviewed
- [ ] NICU-specific content reviewed for scope and terminology

**Required evidence:** clinical reviewer name/role/date or an internal clinical-review record in the relevant ECG content metadata.

---

## 2. Production Readiness Gate — Required

Run:

```bash
node scripts/verify-ecg-production-readiness.mjs
```

Must pass with:
- zero secret leaks
- zero raw env/config leaks
- zero placeholder markers
- zero unfinished AI-copy markers
- adult/pediatric/neonatal separation evidence present
- basic/advanced ECG separation evidence present
- clinical-review metadata present where required

---

## 3. Publish Env Gate — Required

Run:

```bash
node scripts/check-ecg-publish-env.mjs
```

Required envs:
- `ENABLE_ECG_MODULE=true`
- `NEXT_PUBLIC_ENABLE_ECG_MODULE=true`
- `STRIPE_PRICE_ADVANCED_ECG=price_...`

Recommended envs:
- `ENABLE_ADVANCED_ECG_MODULE=true`
- `STRIPE_WEBHOOK_SECRET` configured

The script must not print raw secret/env values.

---

## 4. Entitlement and Paywall Gate — Required

### Core ECG
- [ ] Included for RN tier where intended
- [ ] Included for NP tier where intended
- [ ] Included for New Grad where intended, if configured
- [ ] RPN/PN access follows current product policy
- [ ] Locked states are clear and not broken

### Advanced ECG
- [ ] Requires Advanced ECG entitlement
- [ ] Upgrade CTA appears for ineligible learners
- [ ] Existing entitled users can access content
- [ ] Stripe Checkout uses `STRIPE_PRICE_ADVANCED_ECG`
- [ ] Webhook grants entitlement after purchase
- [ ] Billing summary reflects Advanced ECG access

---

## 5. Basic vs Advanced Separation Gate — Required

Core Basic ECG must remain foundational and included in nursing tiers.

Basic ECG includes:
- ECG paper/grid
- rate calculation
- regularity
- P wave basics
- PR interval basics
- QRS basics
- QT basics
- common rhythms
- beginner interpretation workflow

Advanced ECG remains premium and separate.

Advanced ECG includes:
- advanced telemetry
- ischemia/STEMI localization
- pacemakers/devices
- electrolyte/toxicology ECGs
- electrophysiology concepts
- pediatric specialty ECG
- neonatal specialty ECG
- simulation/capstone workflows

---

## 6. Anti-AI / Human Quality Gate — Required

Pages must not feel generated or unfinished.

Check for:
- [ ] no repetitive robotic lesson structure
- [ ] no shallow definition-only content
- [ ] no duplicated paragraphs
- [ ] no filler copy
- [ ] no placeholder text
- [ ] no generic “AI generated” cadence
- [ ] no overuse of identical bullets across lessons
- [ ] explanations include bedside context and rationale
- [ ] rationales explain why alternatives are wrong

---

## 7. Visual QA Gate — Required

ECG academy must follow NurseNest premium aesthetics.

Required:
- [ ] Ocean theme support
- [ ] Blossom theme support
- [ ] Midnight theme support
- [ ] semantic tokens used, not hardcoded one-off colors
- [ ] white/light elevated surfaces added for contrast
- [ ] telemetry panels are selective, not overwhelming
- [ ] no flat dashboard look
- [ ] mobile layouts readable
- [ ] rhythm strips scale safely
- [ ] keyboard/focus states usable
- [ ] WCAG-safe contrast

Design direction:
- premium clinical education workstation
- clean white interpretation panels
- dark telemetry strips only where useful
- not cyberpunk
- not generic SaaS cards

---

## 8. Simulation QA Gate — Required for Advanced ECG

Required simulation validation:
- [ ] unstable VT progression works
- [ ] torsades progression works
- [ ] STEMI progression works
- [ ] pacemaker malfunction cases work
- [ ] electrolyte progression cases work
- [ ] pediatric deterioration case works
- [ ] neonatal instability case works
- [ ] pass/fail states are clear
- [ ] escalation prompts are clinically appropriate
- [ ] no dead-end simulation states

---

## 9. Worksheet / Activity Gate — Required

Required activity/resource coverage:
- [ ] interval measurement activities
- [ ] guided strip interpretation
- [ ] rhythm differential activities
- [ ] STEMI localization activities
- [ ] pacing troubleshooting activities
- [ ] pediatric ECG practice activity
- [ ] neonatal ECG practice activity
- [ ] downloadable/printable worksheets render correctly

---

## 10. Marketing / SEO Gate — Required

Required marketing surfaces:
- [ ] Basic ECG included-value messaging
- [ ] Advanced ECG premium messaging
- [ ] clear curriculum map
- [ ] FAQ covers Canadian/US units and pediatric/neonatal separation
- [ ] breadcrumbs render correctly
- [ ] structured data does not expose internal IDs/secrets
- [ ] advanced page shows Basic ECG as included/foundational without making Advanced feel redundant
- [ ] sitemap includes public ECG pages only when intended

---

## 11. Final Publish Sequence

Only after all gates pass:

1. Run readiness gate.
2. Run env gate.
3. Confirm clinical-review evidence.
4. Confirm Stripe price/env exists.
5. Confirm entitlement grant path.
6. Run ECG visual QA.
7. Run ECG simulation QA.
8. Publish Core ECG.
9. Publish Advanced ECG.
10. Verify live routes as guest, free user, nursing subscriber, and Advanced ECG buyer.

---

## Hard Stop Conditions

Do not publish if any of these are true:

- raw env/secret/key appears in page source, logs, or UI
- any clinical-review requirement is missing
- any pediatric/neonatal content is mixed into adult competency scoring
- Basic ECG and Advanced ECG are not clearly separated
- simulation has broken/dead-end states
- Advanced ECG checkout cannot grant entitlement
- mobile telemetry strips are unreadable
- pages still contain placeholder or AI-looking filler copy
