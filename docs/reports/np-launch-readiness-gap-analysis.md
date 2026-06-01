# NP Launch-Readiness Gap Analysis
**Generated:** 2026-06-01  
**Scope:** All NP and PN pathways with existing launch-readiness generators

---

## Generator Inventory

| Script | Pathway ID | Questions Planned | Status |
|---|---|---|---|
| `generate-fnp-launch-readiness-content.mts` | `us-np-fnp` | 10,375 | ✓ Published |
| `generate-agpcnp-launch-readiness-content.mts` | `us-np-agpcnp` | 5,000 | ✓ Published |
| `generate-whnp-launch-readiness-content.mts` | `us-np-whnp` | 4,000 | ✓ Published |
| `generate-pmhnp-launch-readiness-content.mts` | `us-np-pmhnp` | 4,000 | ✓ Published |
| `generate-pnp-pc-launch-readiness-content.mts` | `us-np-pnp-pc` | 4,000 | ✓ Published |
| `generate-cnple-launch-readiness-content.mts` | `ca-np-cnple` | TBD | ✗ NOT published |
| `generate-nclex-pn-launch-readiness-content.mts` | `us-lpn-nclex-pn` | 10,000 | ✗ NOT published |
| `generate-rex-pn-launch-readiness-content.mts` | `ca-rpn-rex-pn` | 9,184 | ✗ NOT published |
| `generate-fnp-question-flashcard-pipeline.mts` | `us-np-fnp` | 5,000+ | ✗ BLOCKED (no API key) |

---

## Content Counts (Post-Publication)

### NP Pathways

| Pathway | Generator | Questions | Flashcards | Lessons | Practice Exams | Launch Status |
|---|---|---|---|---|---|---|
| `us-np-fnp` | ✓ | 10,375 | 8,300 | 1,643 | 300 | ✓ LAUNCH-READY |
| `us-np-agpcnp` | ✓ | 5,000 | 5,000 | 1,465 | 250 | ✓ LAUNCH-READY |
| `us-np-whnp` | ✓ | 4,000 | 4,000 | 1,422 | 200 | ✓ LAUNCH-READY |
| `us-np-pmhnp` | ✓ | 4,000 | 4,000 | 1,459 | — | ✓ LAUNCH-READY |
| `us-np-pnp-pc` | ✓ | 4,000 | 4,000 | 1,422 | — | ✓ LAUNCH-READY |
| `ca-np-cnple` | ✓ (not run) | **0** | 1,154 | 1,465 | 0 | ✗ BLOCKED |

### PN Pathways

| Pathway | Generator | Questions | Flashcards | Lessons | Launch Status |
|---|---|---|---|---|---|
| `us-lpn-nclex-pn` | ✓ (not run) | 0? | 0? | ? | ✗ NEEDS PUBLICATION |
| `ca-rpn-rex-pn` | ✓ (not run) | 0? | 0? | ? | ✗ NEEDS PUBLICATION |

---

## Launch Blockers

### Blocker 1 — CNPLE: Zero Questions Published

| Attribute | Value |
|---|---|
| Pathway | `ca-np-cnple` |
| Generator | `generate-cnple-launch-readiness-content.mts` |
| Current questions | 0 |
| Current flashcards | 1,154 (already published) |
| Current lessons | 1,465 |
| Action | `npx tsx --tsconfig tsconfig.json scripts/generate-cnple-launch-readiness-content.mts --apply` |

### Blocker 2 — NCLEX-PN Not Published

| Attribute | Value |
|---|---|
| Pathway | `us-lpn-nclex-pn` |
| Generator | `generate-nclex-pn-launch-readiness-content.mts` |
| Planned questions | 10,000 |
| Planned CAT-eligible | 8,000 |
| Source lessons | 109 |
| Action | `npx tsx --tsconfig tsconfig.json scripts/generate-nclex-pn-launch-readiness-content.mts --apply` |

### Blocker 3 — REx-PN Not Published

| Attribute | Value |
|---|---|
| Pathway | `ca-rpn-rex-pn` |
| Generator | `generate-rex-pn-launch-readiness-content.mts` |
| Planned questions | 9,184 |
| Planned CAT-eligible | 7,544 |
| Source lessons | 328 |
| Action | `npx tsx --tsconfig tsconfig.json scripts/generate-rex-pn-launch-readiness-content.mts --apply` |

### Blocker 4 — FNP AI Pipeline Needs OpenAI Key

| Attribute | Value |
|---|---|
| Pathway | `us-np-fnp` |
| Script | `generate-fnp-question-flashcard-pipeline.mts` |
| Status | Fails at `OPENAI_API_KEY_MISSING` |
| Action | Set `OPENAI_API_KEY=sk-...` in `.env.local` and re-run |

---

## Missing Generators

No generator script exists for these NP/NP-adjacent pathways:

| Pathway | Exam | Notes |
|---|---|---|
| `us-np-agpcnp` (AGNP variant) | ANCC-AGPCNP | AGPCNP script covers this |
| Adult NP specialty variants | — | Covered by AGPCNP |

All major NP exam families (FNP, AGPCNP, WHNP, PMHNP, PNP-PC, CNPLE) have dedicated generators. The only gap is that PMHNP and PNP-PC do not yet have practice exam (`Exam` model) creation in their scripts.

---

## Publication Sequence (Recommended)

```bash
# Run preflight first
npx tsx --tsconfig tsconfig.json scripts/db-publication-preflight.mts

# NP gap: CNPLE questions
npx tsx --tsconfig tsconfig.json scripts/generate-cnple-launch-readiness-content.mts --apply

# PN pathways
npx tsx --tsconfig tsconfig.json scripts/generate-nclex-pn-launch-readiness-content.mts --apply
npx tsx --tsconfig tsconfig.json scripts/generate-rex-pn-launch-readiness-content.mts --apply

# FNP AI pipeline (requires OPENAI_API_KEY)
# Set OPENAI_API_KEY in .env.local, then:
npx tsx --tsconfig tsconfig.json scripts/generate-fnp-question-flashcard-pipeline.mts --apply
```
