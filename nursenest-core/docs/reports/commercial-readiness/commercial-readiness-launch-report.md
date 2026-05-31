# Commercial Readiness and Launch Gate Report

Generated: 2026-05-31T21:42:07.142Z

The live database inventory was not audited because the database was unavailable in this environment.

Reason:  Invalid `db.examQuestion.findMany()` invocation in /root/nursenest-core/nursenest-core/scripts/audit-blueprint-coverage-gap-engine.mts:239:21 236 clinicalNursingScenario: { findMany: (args: unknown) => Promise<Array<Record<string, unknown>>> }; 237 }; 238 const [questions, lessons, flashcards, simulations] = await Promise.all([ → 239 db.examQuestion.findMany( Can't reach database server at `HOST:5432` Please make sure your database server is running at `HOST:5432`.

Static fallback covers repository-authored RN catalogs, PN CNPLE expansion questions, and CNPLE NP LOFT case steps only.

## Launch Readiness Dashboard

| Pathway | Status | Overall | Content | Quality | Adaptive | SEO | Commercial | Reliability | Conversion |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NCLEX-RN | Not Ready | 0% | 1.3% | 0% | 100% | 100% | 65% | 99.9% | 70% |
| NCLEX-PN | Not Ready | 0% | 0% | 0% | 0% | 100% | 65% | 99.9% | 70% |
| REx-PN | Not Ready | 0% | 11.3% | 0% | 100% | 100% | 65% | 99.9% | 70% |
| CNPLE | Not Ready | 0% | 11% | 0% | 100% | 100% | 65% | 99.9% | 70% |
| FNP | Not Ready | 0% | 0% | 0% | 0% | 100% | 65% | 99.9% | 70% |
| NMC CBT | Not Ready | 0% | 0% | 0% | 0% | 70% | 0% | 72.7% | 0% |
| Australia RN | Not Ready | 0% | 0% | 0% | 0% | 70% | 0% | 72.7% | 0% |
| New Zealand RN | Not Ready | 0% | 0% | 0% | 0% | 0% | 0% | 0% | 0% |
| Future pathways | Not Ready | 0% | 0% | 0% | 0% | 0% | 0% | 0% | 0% |

## Revenue Readiness Dashboard

| Pathway | Revenue Opportunity | Recommended Action |
| --- | --- | --- |
| NCLEX-RN | very_high | Close content, quality, and adaptive-learning gaps before commercial launch work. |
| NCLEX-PN | high | Close content, quality, and adaptive-learning gaps before commercial launch work. |
| REx-PN | high | Close content, quality, and adaptive-learning gaps before commercial launch work. |
| CNPLE | medium | Close content, quality, and adaptive-learning gaps before commercial launch work. |
| FNP | very_high | Close content, quality, and adaptive-learning gaps before commercial launch work. |
| NMC CBT | high | Close content, quality, and adaptive-learning gaps before commercial launch work. |
| Australia RN | high | Close content, quality, and adaptive-learning gaps before commercial launch work. |
| New Zealand RN | medium | Close content, quality, and adaptive-learning gaps before commercial launch work. |
| Future pathways | deferred | Close content, quality, and adaptive-learning gaps before commercial launch work. |

## Conversion Readiness Dashboard

| Pathway | Conversion Readiness | Status |
| --- | --- | --- |
| NCLEX-RN | 70% | Development |
| NCLEX-PN | 70% | Development |
| REx-PN | 70% | Development |
| CNPLE | 70% | Development |
| FNP | 70% | Development |
| NMC CBT | 0% | Not Ready |
| Australia RN | 0% | Not Ready |
| New Zealand RN | 0% | Not Ready |
| Future pathways | 0% | Not Ready |

## Reliability Dashboard

| Pathway | Reliability | Status | Blockers |
| --- | --- | --- | --- |
| NCLEX-RN | 99.9% | Launch Candidate |  |
| NCLEX-PN | 99.9% | Launch Candidate |  |
| REx-PN | 99.9% | Launch Candidate |  |
| CNPLE | 99.9% | Launch Candidate |  |
| FNP | 99.9% | Launch Candidate |  |
| NMC CBT | 72.7% | Development | Reliability gate 72.7% is below 99.9%.; Pathway registered & hub visible: Pathway is hidden or not registered for public hubs; Deep link / soft-404 audit (manual): Hidden or info-only pathways need route audit before launch |
| Australia RN | 72.7% | Development | Reliability gate 72.7% is below 99.9%.; Pathway registered & hub visible: Pathway is hidden or not registered for public hubs; Deep link / soft-404 audit (manual): Hidden or info-only pathways need route audit before launch |
| New Zealand RN | 0% | Not Ready | Reliability gate 0% is below 99.9%.; No pathway registry entry exists for deterministic reliability checks. |
| Future pathways | 0% | Not Ready | Reliability gate 0% is below 99.9%.; No pathway registry entry exists for deterministic reliability checks. |

## Recommended Launch Order

| Order | Pathway | Status | Overall | Revenue Opportunity | Next Action |
| --- | --- | --- | --- | --- | --- |
| 1 | NCLEX-RN | Not Ready | 0% | very_high | Close content, quality, and adaptive-learning gaps before commercial launch work. |
| 2 | NCLEX-PN | Not Ready | 0% | high | Close content, quality, and adaptive-learning gaps before commercial launch work. |
| 3 | REx-PN | Not Ready | 0% | high | Close content, quality, and adaptive-learning gaps before commercial launch work. |
| 4 | CNPLE | Not Ready | 0% | medium | Close content, quality, and adaptive-learning gaps before commercial launch work. |
| 5 | FNP | Not Ready | 0% | very_high | Close content, quality, and adaptive-learning gaps before commercial launch work. |
| 6 | NMC CBT | Not Ready | 0% | high | Close content, quality, and adaptive-learning gaps before commercial launch work. |
| 7 | Australia RN | Not Ready | 0% | high | Close content, quality, and adaptive-learning gaps before commercial launch work. |
| 8 | New Zealand RN | Not Ready | 0% | medium | Close content, quality, and adaptive-learning gaps before commercial launch work. |
| 9 | Future pathways | Not Ready | 0% | deferred | Close content, quality, and adaptive-learning gaps before commercial launch work. |

## Remaining Work Report

### NCLEX-RN

- Content gate 1.3% is below 95%.
- Quality gate 0% is below 95%.
- Monetization gate 65% is below 100%.
- Conversion gate 70% is not established and tested.

Next action: Close content, quality, and adaptive-learning gaps before commercial launch work.

### NCLEX-PN

- Content gate 0% is below 95%.
- Quality gate 0% is below 95%.
- Adaptive learning gate 0% is below 95%.
- Monetization gate 65% is below 100%.
- Conversion gate 70% is not established and tested.

Next action: Close content, quality, and adaptive-learning gaps before commercial launch work.

### REx-PN

- Content gate 11.3% is below 95%.
- Quality gate 0% is below 95%.
- Monetization gate 65% is below 100%.
- Conversion gate 70% is not established and tested.

Next action: Close content, quality, and adaptive-learning gaps before commercial launch work.

### CNPLE

- Content gate 11% is below 95%.
- Quality gate 0% is below 95%.
- Monetization gate 65% is below 100%.
- Conversion gate 70% is not established and tested.

Next action: Close content, quality, and adaptive-learning gaps before commercial launch work.

### FNP

- Content gate 0% is below 95%.
- Quality gate 0% is below 95%.
- Adaptive learning gate 0% is below 95%.
- Monetization gate 65% is below 100%.
- Conversion gate 70% is not established and tested.

Next action: Close content, quality, and adaptive-learning gaps before commercial launch work.

### NMC CBT

- Content gate 0% is below 95%.
- Quality gate 0% is below 95%.
- Adaptive learning gate 0% is below 95%.
- SEO gate 70% is below 95%.
- Monetization gate 0% is below 100%.
- Reliability gate 72.7% is below 99.9%.
- Conversion gate 0% is not established and tested.
- Pathway registered & hub visible: Pathway is hidden or not registered for public hubs
- Listed for public marketing pathways: Not included in public pathway list
- Deep link / soft-404 audit (manual): Hidden or info-only pathways need route audit before launch

Next action: Close content, quality, and adaptive-learning gaps before commercial launch work.

### Australia RN

- Content gate 0% is below 95%.
- Quality gate 0% is below 95%.
- Adaptive learning gate 0% is below 95%.
- SEO gate 70% is below 95%.
- Monetization gate 0% is below 100%.
- Reliability gate 72.7% is below 99.9%.
- Conversion gate 0% is not established and tested.
- Pathway registered & hub visible: Pathway is hidden or not registered for public hubs
- Listed for public marketing pathways: Not included in public pathway list
- Deep link / soft-404 audit (manual): Hidden or info-only pathways need route audit before launch

Next action: Close content, quality, and adaptive-learning gaps before commercial launch work.

### New Zealand RN

- Content gate 0% is below 95%.
- Quality gate 0% is below 95%.
- Adaptive learning gate 0% is below 95%.
- SEO gate 0% is below 95%.
- Monetization gate 0% is below 100%.
- Reliability gate 0% is below 99.9%.
- Conversion gate 0% is not established and tested.
- No pathway registry entry exists for deterministic reliability checks.

Next action: Close content, quality, and adaptive-learning gaps before commercial launch work.

### Future pathways

- Content gate 0% is below 95%.
- Quality gate 0% is below 95%.
- Adaptive learning gate 0% is below 95%.
- SEO gate 0% is below 95%.
- Monetization gate 0% is below 100%.
- Reliability gate 0% is below 99.9%.
- Conversion gate 0% is not established and tested.
- No pathway registry entry exists for deterministic reliability checks.

Next action: Close content, quality, and adaptive-learning gaps before commercial launch work.

## Governance Rule

No pathway is launch-ready because content exists. A pathway only becomes a Launch Candidate when content, quality, adaptive learning, SEO, monetization, reliability, and conversion gates all meet the launch thresholds.
