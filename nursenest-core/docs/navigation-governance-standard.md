# NurseNest Navigation Governance Standard

**Status:** ENFORCED — CI fails on violation  
**Contract version:** 2.0.0  
**Last updated:** 2026-05-31  
**Owner:** Platform Team

---

## Business Requirement

Learner navigation must be **identical** across every NurseNest feature. A user navigating between Lessons, Flashcards, Clinical Skills, ECG, and Simulations must experience the exact same navigation framework at all times.

Navigation is **platform infrastructure**, not module infrastructure. It is not a design preference. It is not configurable per-module.

---

## The Rule (Non-Negotiable)

Every learner-facing page MUST inherit from the canonical learner shell:

```
src/app/(app)/app/(learner)/layout.tsx
```

This layout renders the global navigation via the homepage header:

```
src/components/layout/site-header-server.tsx
```

**Approved exceptions to global header rendering:** active CAT/practice exam sessions and active flashcard study sessions, managed by `LearnerExamChromeGate` + `learnerShellFlags()`.

No other module, feature, or developer may suppress, replace, fork, or duplicate this navigation system.

---

## Architecture Reference

### How the Learner Shell Works

```
src/app/(app)/layout.tsx           ← Provider layer (AuthSessionProvider, regions)
  └── src/app/(app)/app/layout.tsx ← App-level session wrapper
        └── src/app/(app)/app/(learner)/layout.tsx  ← CANONICAL LEARNER SHELL
              ├── SentryLearnerShell
              ├── LearnerExamChromeGate  ← Only place chrome is suppressed
              │   ├── SiteHeaderServer  ← CANONICAL GLOBAL NAV
              │   └── <main id="nn-learner-main">
              │         └── [route page.tsx content]
              └── LearnerAppFooter
```

### Permitted Sub-Navigation (Inside the Shell)

These patterns add inner chrome WITHOUT replacing the global nav:

| Pattern | Components | Routes |
|---|---|---|
| Account Section Nav | `LearnerAccountNav`, `LearnerAccountShellHeader` | `/app/account/*` |
| Exam Session Chrome | `ExamSessionShell`, `LearnerExamChromeGate` | `/app/practice-tests/[sessionId]`, `/app/exams/*` |
| Workstation Chrome | `LabsWorkstationShell`, `MedCalcWorkstationShell`, etc. | `/app/labs/*`, `/app/med-calculations/*`, `/app/clinical-skills/*` |

These are WITHIN the shell content area. The global nav remains visible and unchanged.

### Chrome Suppression (Exam Focused Mode Only)

For active exam sessions only, the global nav is visually suppressed via:

```typescript
// src/lib/learner/learner-shell-mode.ts
export function learnerShellFlags(pathname): LearnerShellFlags {
  const mode = resolveLearnerShellMode(pathname);
  return {
    suppressFullChrome: mode === "exam-focused",  // ← ONLY allowed for exam sessions
    ...
  };
}
```

The shell still RENDERS — chrome is conditionally HIDDEN. The HTML is present but not shown. This is intentional: the shell remains in the React tree for context providers.

---

## Approved Exceptions (Legacy Module Routes)

The following routes bypass the learner shell. These are legacy decisions that predate the current architecture. Each is tracked for migration.

| Route | Reason | Migration |
|---|---|---|
| `/app/modules/ecg/*` | Legacy ECG workstation chrome | Pending |
| `/app/modules/ecg-advanced/*` | Same | Pending |
| `/app/modules/ecg-interpretation/*` | Same | Pending |
| `/app/modules/hemodynamics/*` | Legacy hemodynamics module | Pending |
| `/app/modules/hemodynamics-advanced/*` | Same | Pending |
| `/app/modules/lab-values/*` | Legacy lab reference module | Pending |
| `/app/modules/labs-advanced/*` | Same | Pending |
| `/app/modules/rt-ventilator/*` | Legacy RT ventilator workstation | Pending |

All exceptions are registered in:
```
src/lib/nav-governance/navigation-contract.ts → APPROVED_MODULE_EXCEPTIONS
```

---

## Developer Rules

### ✅ Correct — Adding a New Feature

New learner features MUST be added under `(app)/app/(learner)/`:

```
src/app/(app)/app/(learner)/my-new-feature/
  ├── page.tsx       ← inherits shell automatically
  └── layout.tsx     ← optional, CSS/metadata only, NEVER custom nav
```

If your feature needs a sidebar or workstation chrome, add it INSIDE the page.tsx or a nested layout — but never replace the global nav.

### ❌ Wrong — Common Violations

**Creating a standalone layout with its own header:**
```tsx
// ❌ VIOLATION: creates custom header outside the shell
export default function MyModuleLayout({ children }) {
  return (
    <div>
      <MyModuleHeader />  {/* ← FORBIDDEN */}
      {children}
    </div>
  );
}
```

**Adding a route under `/app/modules/` without registering an exception:**
```
src/app/(app)/modules/my-new-module/layout.tsx  ← ❌ VIOLATION
```

**Using `PremiumEducationalModuleShell` in a new route:**
```tsx
// ❌ VIOLATION: not registered in APPROVED_MODULE_EXCEPTIONS
<PremiumEducationalModuleShell title="...">
  {children}
</PremiumEducationalModuleShell>
```

### How to Add a New Approved Exception (Process)

If a new module genuinely cannot use the learner shell (rare), the process is:

1. Open a discussion with the Platform Team
2. Document why the learner shell cannot be used
3. Get written approval from Platform Team lead
4. Add entry to `APPROVED_MODULE_EXCEPTIONS` in `navigation-contract.ts` with:
   - `justification`: written reason
   - `migrationStatus`: "pending"
   - `migrationTicket`: tracking ticket URL
5. The contract tests will now pass for that route
6. Plan migration to the learner shell within 2 sprint cycles

---

## Contract Enforcement

### Tests

```bash
# Run from nursenest-core/
node --import tsx --test tests/contracts/learner-shell-navigation.contract.test.ts
```

**What the tests check:**
1. Canonical shell exists at registered path
2. Canonical nav component exists at registered path
3. Shell imports `SiteHeaderServer`
4. Shell does not render legacy learner shell nav components
5. No layout.tsx outside `(learner)/` renders nav without approval
6. Every approved exception still has a layout file on disk (no phantom registrations)
7. Exam focused mode is the only approved full-chrome suppression
8. `learnerShellFlags()` is the single resolver in `learner-shell-mode.ts`
9. No prohibited custom header components in learner routes
10. New routes (simulation-center, physiology-monitor) are under the canonical shell
11. Contract version matches test expectations

### CI Hookup

Add to the CI workflow to block merges:

```yaml
# .github/workflows/contracts.yml
- name: Navigation Contract
  run: |
    cd nursenest-core
    node --import tsx --test tests/contracts/learner-shell-navigation.contract.test.ts
```

Or via `package.json`:

```json
{
  "scripts": {
    "test:nav-contract": "node --import tsx --test tests/contracts/learner-shell-navigation.contract.test.ts"
  }
}
```

### Admin Dashboard

Accessible at `/admin/navigation-compliance` (admin auth required).

Shows:
- Overall compliance rate with meter
- Violation list with file paths and remediation instructions
- Approved exception registry with migration status
- Full route audit table sorted by status (violations first)

---

## Migration Roadmap

The long-term goal is to migrate all `/app/modules/*` routes into the canonical learner shell. Target completion by Q4 2026.

**Migration pattern:**

```
BEFORE (violation):
  src/app/(app)/modules/ecg/layout.tsx
  Uses: PremiumEducationalModuleShell (custom header)

AFTER (compliant):
  src/app/(app)/app/(learner)/ecg/layout.tsx
  Uses: Inherits canonical learner shell, adds EcgWorkstationShell inside
  Note: The workstation chrome goes INSIDE <main>, not around the shell
```

**Steps for each module migration:**
1. Move `src/app/(app)/modules/{module}/` → `src/app/(app)/app/(learner)/{module}/`
2. Remove the `PremiumEducationalModuleShell` wrapper
3. Move workstation chrome into the page component or a nested layout
4. Remove from `APPROVED_MODULE_EXCEPTIONS` in `navigation-contract.ts`
5. Verify contract tests pass
6. Verify admin compliance dashboard shows 100%

---

## Compliance Status (as of 2026-05-30)

| Category | Count | Status |
|---|---|---|
| Compliant routes | ~20 | ✅ Inherits canonical shell |
| Approved exceptions | 8 | ⚠️ Legacy modules, pending migration |
| Violations | 0 | ✅ None known |
| Overall compliance | ~71% | Pending legacy migration to 100% |

**Compliance = (compliant + approved-exceptions) / total**  
Target: 100% compliant routes (zero violations, exceptions explicitly registered).

---

## Contact

Navigation architecture questions: Platform Team  
Contract change requests: Require team discussion and written justification  
Violations: Should be addressed before merge; block CI
