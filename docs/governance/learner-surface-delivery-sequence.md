# Learner surface delivery — mandatory five-step sequence

**Binding** for **major learner-facing** work (`/app/*`, marketing study hubs, pathway learner pages) where **visual design, layout, hierarchy, or theme expression** changes materially. This document states **order of operations**, **hard prohibitions**, and an **acceptance checklist**. It does **not** replace the full Figma workflow, token rules, or ecosystem positioning — see references below.

**Authority stack (read in this order for detail):**

| Topic | Document |
|-------|----------|
| When Figma applies, file requirements, implementation rules, Playwright evidence | [`figma-premium-ui-mandatory-process.md`](./figma-premium-ui-mandatory-process.md) |
| Ecosystem convergence, nav/shell, Labs/ECG positioning, Figma summary rule | [`.cursor/rules/ecosystem-platform-guardrails.mdc`](../../.cursor/rules/ecosystem-platform-guardrails.mdc) (§11 Figma) |
| Semantic multi-hue UI, tokens | [`.cursor/rules/semantic-color-guardrails.mdc`](../../.cursor/rules/semantic-color-guardrails.mdc) |
| Learner emotional experience, simplification | [`.cursor/rules/nursenest-production-governance.mdc`](../../.cursor/rules/nursenest-production-governance.mdc) |

**Delta vs Figma mandatory process alone:** That doc mandates Figma-before-implementation and evidence in PRs. **This** doc adds an explicit **mockup review gate** before code, separates **post-build app screenshots** from **Figma exports**, and ends with a **theme parity** pass so Ocean, Blossom, and Midnight stay one structure with token-driven variants only.

---

## Five-step mandatory sequence (do not reorder)

1. **Figma first** — Create or update frames (desktop + mobile; light + dark as applicable) using the premium baseline and shared vocabulary. Follow [`figma-premium-ui-mandatory-process.md`](./figma-premium-ui-mandatory-process.md): audit against sibling hubs, frame variants, freeze an approved direction before implementation.

2. **Screenshot review second (mockup gate)** — Review **Figma exports** and/or high-fidelity mockups **before** implementation starts. Purpose: sign off hierarchy, spacing, states, and cohesion with NurseNest branding. **No implementation** until this gate is satisfied for the scope at hand.

3. **Implementation third** — Build to **approved** mockups using shared primitives, learner shells, and **semantic/theme tokens** only — no parallel layout systems. Match Figma; document intentional deltas in the PR.

4. **Actual app screenshots fourth** — Capture **running product** (not Figma alone): desktop + mobile on affected routes. Use for PR evidence and comparison to approved frames (side-by-side with Figma exports where helpful). Align with Playwright / archive expectations in the Figma mandatory process doc where automated.

5. **Theme parity verification fifth** — Verify **Ocean, Blossom, and Midnight** on the same surfaces: **one Ocean-derived structure** across themes; Blossom and Midnight are **token-only** variants (palette, glow, surface tint, chart expression — not alternate grids or IA). Confirm no theme-specific layout forks unless the product task explicitly requires it.

---

## Prohibitions

- **Do not skip mockups** — No “build first, Figma later” for material learner UI changes.
- **Do not implement generic placeholders** — No grey boxes, lorem-style shells, or stock dashboard patterns that bypass approved NurseNest hierarchy and components.
- **Do not diverge from Ocean structure** — Other themes restyle the same skeleton; they do not introduce a second information architecture or component tree.
- **Do not create disconnected module experiences** — Learner flows stay in the **single** ecosystem (canonical nav, shells, adaptive loops); no isolated mini-app chrome or parallel design languages for the same journeys.

---

## Quality bar (every major learner surface)

Surfaces must feel **premium**, **clinically professional**, and **cohesive** with NurseNest branding; **mobile-polished**; and **verified** under **Ocean, Blossom, and Midnight** per step 5 above.

---

## Acceptance checklist (stakeholders / reviewers)

Use this as a PR or program gate for substantial learner UI work.

- [ ] **Step 1 — Figma:** File link + key frame/node IDs recorded; desktop + mobile (and light/dark where required by the mandatory process doc).
- [ ] **Step 2 — Mockup gate:** Figma exports or equivalent reviewed and **approved** before substantive UI implementation (date/owner in PR or report).
- [ ] **Step 3 — Implementation:** Uses tokens and shared primitives; no ad-hoc card systems; deltas from Figma explained if any.
- [ ] **Step 4 — App screenshots:** Real app captures attached for primary breakpoints/routes changed.
- [ ] **Step 5 — Themes:** Ocean + Blossom + Midnight checked; structure matches Ocean; only token-driven visual differences.
- [ ] **Prohibitions:** Confirm none of the four prohibitions above were violated.
- [ ] **Cross-links:** Post-completion summary or hub final report follows [`figma-post-completion-summary-template.md`](./figma-post-completion-summary-template.md) when the Figma-first program applies.

---

## Related

- [`figma-premium-ui-mandatory-process.md`](./figma-premium-ui-mandatory-process.md) — full Figma checklist, evidence table, Playwright expectations  
- [`ecosystem-guardrails-rollout.md`](./ecosystem-guardrails-rollout.md) — how platform guardrails rolled into agents and docs  
- [`ecosystem-qa-master-program.md`](./ecosystem-qa-master-program.md) — recurring QA matrix when programs require it  
