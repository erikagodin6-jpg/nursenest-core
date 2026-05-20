# Ecosystem QA audit — master rollup

**Audit period:** YYYY-MM-DD → YYYY-MM-DD  
**Environment:** local | staging | production  
**Owner:**  
**Related:** `docs/governance/ecosystem-qa-master-program.md`

## Executive summary

- **Overall status:** PASS | PASS WITH WARNINGS | FAIL
- **Blocking issues:** (count)
- **Non-blocking warnings:** (count)

## Scope exercised

- [ ] Playwright `test:e2e:ecosystem-audit`
- [ ] `qa:release-gate` (subset/full)
- [ ] Paid subscriber flows (credentials available?)
- [ ] Mobile project
- [ ] Visual QA capture / critical regression

## Failures (blocking)

| ID | Severity | Area | Affected routes | Evidence | Remediation |
|----|----------|------|-----------------|----------|-------------|
| F1 | P0/P1/P2 | | | link / screenshot path | |

## Warnings (non-blocking)

| ID | Severity | Area | Affected routes | Evidence | Remediation |
|----|----------|------|-----------------|----------|-------------|
| W1 | P2/P3 | | | | |

## Screenshots / artifacts

| Artifact | Path |
|----------|------|
| Playwright report | `playwright-report/` or CI artifact |
| Visual QA PNGs | `tests/e2e/visual-qa/…` or archived folder |

## Sign-off

- [ ] Routes validated for RN / PN / NP / Allied / New Grad surfaces touched this cycle  
- [ ] No emergency fallback UI on primary journeys  
- [ ] No raw i18n keys in marketing main content (homepage specs)
