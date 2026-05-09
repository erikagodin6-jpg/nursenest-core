# Post-completion delivery checklist

Use this checklist for **every substantial ship**: learner/marketing **hubs**, coordinated **UI programs**, **multi-route** features, or any change where stakeholders need auditable proof of what landed and how it was verified.

For routine one-file fixes or invisible refactors, most items can be N/A — but default to **full completion** when the work affects multiple routes, visual identity, entitlements, or CI gates.

---

## 1. Executive summary (required)

Deliver a **short executive summary** that answers:

| Question | Notes |
|----------|--------|
| **What shipped?** | Capabilities, surfaces, scope boundaries (what is *not* in this ship). |
| **For whom?** | Learners, staff, admins, marketing visitors — primary audience first. |
| **Why it matters** | One or two sentences: outcome for users or the business. |

Place this at the top of the final report (below) or in the PR description summary block.

---

## 2. Final report — `reports/*-FINAL.md` or equivalent (required)

Create or update a report file matching the program naming convention (e.g. `reports/<program>-FINAL.md`). If the repo uses another canonical path for “ship complete” artifacts, use that path consistently and **link it from the PR**.

The report **must** include:

| Section | Content |
|---------|---------|
| **Branch** | Branch name used for the merge or review. |
| **Commit(s)** | Primary commit SHA(s) or range; note follow-up fix commits if any. |
| **Push / deploy** | Status: pushed to `origin`, merged to `main`, deployed to staging/production — whichever applies; note **pending** explicitly. |
| **Files changed** | High-signal list (paths or areas); optional link to `git diff` / PR files tab. |
| **Routes** | **Exact** URL paths affected (marketing, `/app/*`, admin) — no hand-waving. |
| **Tests** | Commands run (**exact** `npm` / `pnpm` / CI job names) and **exact results** (pass/fail/skip, counts). Paste or link logs if flaky or complex. |
| **Screenshots** | Paths under repo (e.g. `nursenest-core/docs/screenshots/…`) or attached artifact locations; label theme + viewport. |
| **Blockers** | Open issues, known gaps, follow-ups, or environment limits that prevent full sign-off. |

Cross-reference `docs/governance/figma-premium-ui-mandatory-process.md` for visual QA expectations when UI changed.

---

## 3. Figma in scope (conditional)

If Figma was **in scope** for this ship (per `docs/governance/figma-premium-ui-mandatory-process.md`):

1. Copy **`docs/governance/figma-post-completion-summary-template.md`** to a project-specific location **or** fill it in place in the appendices of `reports/*-FINAL.md`.
2. Complete all sections: **file + frames**, **deltas** (Figma vs implementation), **screenshot vs Figma notes**, links to exports if stored outside the repo.

---

## 4. Playwright / CI artifacts (when relevant)

When automated visual or E2E checks apply:

- **Link** the PR **checks** tab, specific workflow run URL, or stored artifact path (e.g. Playwright report zip, screenshot diff outputs).
- Name the **spec files** and **matrices** run (desktop/mobile, themes) so a reviewer can reproduce.
- If CI was skipped or failed for unrelated reasons, state that under **Blockers** with the tracking issue.

Programs that use ecosystem QA should align with `docs/governance/ecosystem-qa-master-program.md` where applicable.

---

## 5. Stakeholder “done” bar

Work is **not** declared **done** to stakeholders until:

- [ ] Executive summary exists and matches what merged.
- [ ] `reports/*-FINAL.md` (or equivalent) is complete for branch, commit, deploy, routes, tests + results, screenshots, blockers.
- [ ] Figma summary filled when Figma was in scope.
- [ ] Playwright/CI evidence linked or explicitly N/A with reason.

**Agent expectation:** See `AGENTS.md` → **Testing And Verification Rules**.

## Related

- `docs/governance/figma-premium-ui-mandatory-process.md`
- `docs/governance/figma-post-completion-summary-template.md`
- `docs/governance/ecosystem-qa-master-program.md`
