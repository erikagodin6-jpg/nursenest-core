# Mobile Polish Priority List

Ordered by **user impact × likelihood** on mobile. All items are **audit outcomes** — implement in polish sprint.

## Tier A — Before marketing spend / high traffic

| Priority | ID refs | Item | Tag | Test |
|----------|---------|------|-----|------|
| A1 | OVF-01, site-header | Marketing primary nav: **44px touch targets** + nowrap row overflow | SAFE_FOR_AI | Playwright tap offsets; visual 390px |
| A2 | LAY-02, exam chrome | **Practice/CAT mobile height parity** with desktop focus column | AI_CAN_PREP_BUT_DEV_REVIEW | Full CAT dry-run on 390px |
| A3 | OVF-03 | Learner bottom nav: **too many pills** when optional surfaces enabled | AI_CAN_PREP_BUT_DEV_REVIEW | Staff QA account with all flags |

## Tier B — Content & trust

| Priority | ID refs | Item | Tag | Test |
|----------|---------|------|-----|------|
| B1 | OVF-04 | Blog / CMS HTML: **media + tables** constrained | AI_CAN_PREP_BUT_DEV_REVIEW | Longest production article |
| B2 | OVF-02 | Popovers/menus vs `overflow-x-clip` sticky chrome | AI_CAN_PREP_BUT_DEV_REVIEW | Open language menu + theme on `/app` |

## Tier C — Secondary surfaces

| Priority | ID refs | Item | Tag | Test |
|----------|---------|------|-----|------|
| C1 | LAY-01 | Marketing motion shell CLS | AI_CAN_PREP_BUT_DEV_REVIEW | Resize devtools 780↔790 |
| C2 | ECG module | ECG pages padding vs learner shell | AI_CAN_PREP_BUT_DEV_REVIEW | `/modules/ecg/basic` iPhone |
| C3 | OVF-06 | Admin analytics tables | DEVELOPER_ONLY | iPad landscape + phone |

## Tier D — Instrumentation

| D1 | — | Add **mobile-only** visual diff CI (optional) | DEVELOPER_ONLY | Percy/Chromatic |
| D2 | — | Bundle analyzer on flashcards hub JSON | DEVELOPER_ONLY | Lighthouse |

---

### Tag legend (execution)

- **SAFE_FOR_AI:** tokenized spacing, `min-h-*`, `min-w-0`, `max-w-full`, small a11y fixes.  
- **AI_CAN_PREP_BUT_DEV_REVIEW:** layout tree changes, nav structure, exam chrome, prose pipeline.  
- **DEVELOPER_ONLY:** perf, traces, admin tables, flaky device quirks.

---

### Out of scope (this audit)

- Visual redesign / new IA  
- New routes  
- Runtime feature flags changes  
