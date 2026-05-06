# First week plan — suggested cadence

Audience: new developer (including external). Adjust dates with your manager; this is a **default template**, not a commitment of deliverables.

**Principles:** small PRs, prove with tests, protect surfaces in `reports/do-not-break-surfaces.md`.

---

## Day 1 — Audit and setup

**Morning**

- Read `reports/developer-onboarding.md`, `reports/phase-one-scope.md`, `reports/do-not-break-surfaces.md`.  
- Clone repo; `npm ci` in `nursenest-core/`; run `npm run env:check` (names only).  
- Obtain **read** access: GitHub, staging DB (if any), PostHog read-only.

**Afternoon**

- Run **`npm run typecheck`** (or confirm CI artifact).  
- Run **`npm run audit:core-apis`** against staging DB and paste summary to internal channel (redact hostnames).  
- Update **`reports/known-issues-inventory.md`** with 3–5 real items from issue tracker or error spikes (replace placeholders).

**Exit criteria:** Local dev runs; you can explain RN vs RPN pathways at a high level; onboarding docs read.

---

## Day 2 — Build, deploy, and environment stabilization

**Morning**

- Walk through **Dockerfile** + `npm run build` path on a **clean** checkout (or CI job log).  
- Document any machine-specific blockers in `reports/known-issues-inventory.md` (build section).

**Afternoon**

- Pair with lead on **DigitalOcean** (or host) screen share: env var **names**, health checks, deploy hooks.  
- Run **`npm run verify:dist`** / **`verify:standalone-artifact`** if touching build scripts later in the week.  
- Optional: run **`npm run verify:sitemap`** and **`npm run test:homepage`** on staging URL if available.

**Exit criteria:** You can describe the deploy path from merge → running container; you know where secrets live (vault, not git).

---

## Day 3 — RN / RPN critical learner flows

**Morning**

- Manual smoke: **signup or test account** → **subscription / paywall** edge (staging) → **RN lesson hub** → **one lesson detail** → exit.  
- Repeat for **RPN** pathway if staging data supports it.

**Afternoon**

- Run targeted automated tests: e.g. **`npm run test:pathway-lessons`** (long) or a **subset** agreed with lead.  
- Run **`npm run audit:paywall-security`**.  
- File or update tickets for any **S1+** issue found.

**Exit criteria:** Written notes (or tickets) for gaps; no silent “looks fine” without checking network tab for 4xx on APIs.

---

## Day 4 — Mobile and hub performance

**Morning**

- **Mobile pass** on iOS Safari + Android Chrome (or BrowserStack if licensed): nav, lesson hub, practice hub, flashcards hub.  
- Cross-check **semantic colors** and overflow against `.cursor/rules/semantic-color-guardrails.mdc`.

**Afternoon**

- Profile **one slow hub** (RN lessons): Network + server timing; confirm pagination params and payload size.  
- If safe, add **one** perf-oriented improvement behind review—or document findings for P1.

**Exit criteria:** Short written summary with screenshots; no regressions on homepage/pricing (spot check).

---

## Day 5 — Bug fixes, tests, deployment review

**Morning**

- Pick **one** P1/P2 from `known-issues-inventory.md` aligned with phase one scope; branch + fix.  
- Add or extend **tests** (unit preferred; E2E if necessary and stable).

**Afternoon**

- Open PR with **rollback plan**; self-review against `do-not-break-surfaces.md`.  
- Participate in **deploy review** (diff summary, migrations none unless pre-approved).  
- Handoff note: what shipped, what’s next, what’s blocked.

**Exit criteria:** At least one merged or review-ready PR **or** a clear “blocked on X” with owner.

---

## Ongoing (week 2+)

- Keep **`known-issues-inventory.md`** current weekly.  
- Re-run **`audit:core-apis`** after content or entitlement changes.  
- Before any production deploy: **sitemap** spot check + **one** learner golden path.  

---

## Questions?

Escalate to the **engineering lead** when scope, access, or incident severity is unclear—**do not guess** on paywall or production data.
