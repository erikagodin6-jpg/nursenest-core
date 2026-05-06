# Known issues inventory (template + starter rows)

**How to use this file**

- Treat every row as **hypothesis until verified** in staging or production observability.  
- Update **severity**, **owner**, and **ticket link** as items move through triage.  
- **Blocks revenue** = directly impacts signup, subscription, paywall, or core paid study completion in production.

Severity legend: **S0** incident · **S1** major degraded · **S2** significant bug · **S3** minor / cosmetic · **Tech** technical debt / risk (not yet user-visible)

---

## Inventory table

| ID | Severity | Affected route / system | Expected behavior | Actual behavior (symptom) | Suspected cause | Recommended next step | Blocks revenue? |
|----|----------|-------------------------|---------------------|---------------------------|-----------------|----------------------|-----------------|
| KI-001 | Tech | Large pathway lesson hubs | List pages stay fast as catalog grows | Risk of slow TTFB or timeouts if pagination regresses | Unbounded `findMany` or heavy JSON on list paths | Code review against `rn-lesson-library-safety`; run hub perf checklist | If prod slow: **Yes** |
| KI-002 | S2 | `/app` flashcards / custom session | Counts reflect real bank or clear error | (Historical) UI looked “ready” while bank empty | Flashcard table vs `ExamQuestion` fallback mismatch | Run `npm run audit:core-apis`; verify `GET /api/flashcards/custom-session` integrity fields | Indirect |
| KI-003 | S2 | `/app/practice-tests`, CAT launch | Linear and CAT draw pathway-scoped questions | (Historical) Mismatched pools or empty CAT | Filter divergence between services | Compare `fetchCatPracticePool` vs marketing snapshot; add regression test | **Yes** if CAT dead |
| KI-004 | S1 | Blog / admin generation | Drafts meet quality bar; no placeholder live posts | Thin or duplicate SEO posts | Pipeline / gate tuning | Run `npm run blog:quality:audit` (if present) or `blog:quality:test`; fix gates in small PRs | SEO / trust indirect |
| KI-005 | S2 | Mobile nav / hubs | Labels readable, no overlap | Clipped or wrapped mid-label | CSS / responsive regressions | Visual QA on real devices; match `AGENTS.md` nav rules | If blocks study nav: **Yes** |
| KI-006 | Tech | Prisma / migrations | Schema matches DB | Drift or failed deploy | Missing migrate or wrong `DIRECT_URL` | CI check migrate status; document rollback | **Yes** if deploy broken |
| KI-007 | S3 | i18n / locale routing | Stable locale behavior | Missing keys or wrong locale | Shard compile or loader regression | `i18n:compile` locally; compare `docs/i18n-architecture.md` | Usually no |
| KI-008 | — | *Populate from tracker* | — | — | — | Link Jira/Linear/GitHub issue | — |

---

## Triage backlog (fill on day 1)

| Source | Link / query | Owner | Notes |
|--------|----------------|-------|-------|
| GitHub issues | | | |
| PostHog / errors | | | Favor funnel steps: signup → checkout → first lesson |
| Support / CS | | | Tag “blocks study” vs “content question” |
| `npm run audit:core-apis` | | | Paste last JSON summary into ticket |

---

## Resolved / mitigated (keep brief)

| ID | Resolution | Date |
|----|------------|------|
| *Example* | Empty flashcard hub when exam bank had rows — aligned inventory + diagnostics | *YYYY-MM-DD* |

---

## Business priority order (when everything is “on fire”)

1. **Paywall + subscription + auth**  
2. **RN + RPN lesson completion path**  
3. **CAT / practice session start and resume**  
4. **Flashcards and question bank**  
5. **Marketing homepage + pricing accuracy**  
6. **Blog and SEO** (unless legal/compliance issue elevates)  
7. **Admin convenience**  

Update this section when product leadership changes priority.
