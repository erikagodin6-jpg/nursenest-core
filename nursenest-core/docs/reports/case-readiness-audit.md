# Case Readiness Audit

Generated: 2026-06-01T22:36:06.072Z

Scope: RN, PN, RPN, NP. Cases/simulations are the highest-ROI readiness blocker after blueprint tagging.

## Evidence Status

The live database inventory was not audited because the database was unavailable in this environment.

Reason:  Invalid `db.examQuestion.findMany()` invocation in /root/nursenest-core/nursenest-core/scripts/audit-blueprint-coverage-gap-engine.mts:239:21 236 clinicalNursingScenario: { findMany: (args: unknown) => Promise<Array<Record<string, unknown>>> }; 237 }; 238 const [questions, lessons, flashcards, simulations] = await Promise.all([ → 239 db.examQuestion.findMany( Can't reach database server at `nursenestdatabase-do-user-35062022-0.g.db.ondigitalocean.com:25060` Please make sure your database server

Static fallback covers repository-authored RN catalogs, PN CNPLE expansion questions, and CNPLE NP LOFT case steps only.

No new cases were generated or published in this run. The live database was unavailable, and producing 250 clinical cases without source-backed persistence, duplicate checks, and blueprint publication verification would create exactly the low-value/orphan risk this sprint is meant to avoid.

## Case Factory Targets

| Pathway | Current Cases | Target Cases | Deficit | First Domains To Build |
| --- | --- | --- | --- | --- |
| RN | 0 | 100 | 100 | Safety and infection control; Leadership, prioritization, and delegation; Cardiovascular deterioration; Respiratory failure; Maternal-newborn emergency; Pediatrics deterioration; Mental health crisis; Pharmacology/adverse effects; Sepsis and infection; Fluids/electrolytes/renal |
| PN | 0 | 50 | 50 | Coordinated care; Delegation within PN scope; Medication administration safety; Infection control; Cardiovascular/respiratory deterioration; Maternal-newborn basics; Pediatrics basics; Mental health safety |
| RPN | 1 | 50 | 49 | Professional responsibility; Client advocacy; Therapeutic communication; Medication safety; Cardiorespiratory deterioration; Documentation and reporting; Infection prevention; Maternal/pediatric practical-nursing scope |
| NP | 0 | 50 | 50 | Differential diagnosis; Diagnostic interpretation; Prescribing safety; Chronic disease management; Urgent presentations; Preventive care; Pediatrics/women/geriatric variants; Professional practice |


## Required Case Contract

Every case must include: patient history, assessment findings, labs, diagnostics, clinical progression, 6-12 linked questions, rationales, clinical pearls, and blueprint domain metadata. Item mix should include Bowtie, Matrix, Trend, and SATA where clinically appropriate.

## Recommended Build Order

1. RN 100 NGN cases: prioritize safety/infection, delegation, cardiovascular, respiratory, maternal-newborn, pediatrics, mental health, pharmacology, sepsis, renal/electrolytes.
2. RPN 50 cases: prioritize Canadian practical nursing scope, professional responsibility, communication, reporting, medication safety, deterioration recognition.
3. PN 50 cases: prioritize coordinated care, scope-safe delegation, medication administration, infection control, and deterioration recognition.
4. NP 50 advanced cases: prioritize differential diagnosis, diagnostics, prescribing, chronic disease, preventive care, and urgent presentations.

## Publication Gate

A case is not ready unless it is linked to a canonical topic, at least one lesson, remediation tags, blueprint domain, and case-stage rationale set.
