# International Content Gap Analysis

Date: 2026-05-30

Status: hidden foundation program. Do not publish. Do not add to navigation. Do not add to sitemap.

## Visibility Rules

All future international pathways in this program must remain:

- Admin only
- Draft
- Unpublished
- `noindex,nofollow`
- Hidden from navigation
- Excluded from sitemap
- Excluded from public pathway selectors

Current production Canada/U.S. pathways are not changed by this foundation inventory.

## Pathway Inventory

| Country | Regulator | Exam | Public Path Reservation | Status |
| --- | --- | --- | --- | --- |
| United Kingdom | Nursing and Midwifery Council | NMC CBT / OSCE | `/uk/rn` | Hidden Draft |
| Australia | NMBA / AHPRA | NMBA RN Pathway | `/au/rn` | Hidden Draft |
| New Zealand | Nursing Council of New Zealand | NCNZ Registration | `/nz/rn` | Hidden Draft |
| Ireland | Nursing and Midwifery Board of Ireland | NMBI Registration | `/ie/rn` | Hidden Draft |
| Philippines | Professional Regulation Commission | PNLE | `/ph/rn` | Hidden Draft |
| India | Indian Nursing Council / state nursing councils | State Nursing Council Registration | `/in/rn` | Hidden Draft |
| Saudi Arabia | Saudi Commission for Health Specialties | SCFHS RN Licensure | `/sa/rn` | Hidden Draft |
| UAE | UAE health authorities | UAE Nursing Licensure | `/ae/rn` | Hidden Draft |

## Estimated Content Needs

| Pathway | Lessons Needed | Questions Needed | Flashcards Needed | Simulations Needed | Clinical Skills Needed | ECG Needed | Labs Needed | Pharmacology Needed | Effort |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| UK NMC CBT / OSCE | 120 | 800 | 900 | 30 | 60 | 20 | 25 | 45 | High |
| Australia NMBA / AHPRA | 100 | 650 | 750 | 24 | 50 | 18 | 20 | 38 | High |
| New Zealand NCNZ | 80 | 500 | 600 | 18 | 40 | 15 | 18 | 30 | Medium |
| Ireland NMBI | 80 | 500 | 600 | 18 | 40 | 15 | 18 | 30 | Medium |
| Philippines PNLE | 140 | 1,000 | 1,100 | 24 | 45 | 18 | 22 | 50 | High |
| India State Registration | 120 | 800 | 900 | 20 | 40 | 15 | 20 | 45 | High |
| Saudi SCFHS RN | 100 | 700 | 800 | 22 | 45 | 18 | 20 | 40 | High |
| UAE Nursing Licensure | 90 | 650 | 700 | 20 | 40 | 18 | 20 | 36 | Medium |

## Roadmap

### Wave 1: Regulator Blueprint Research

- Collect official regulator sources.
- Identify exam structure, competencies, domain weights, and eligibility disclaimers.
- Create regulator-reviewed editorial notes.
- Keep all content in draft until reviewed.

### Wave 2: Global Clinical Core Reuse

Reuse clinically universal content where safe:

- Cardiovascular, respiratory, neurological, endocrine, renal, GI, maternity, pediatrics, mental health foundations.
- ECG rhythm recognition basics.
- Lab interpretation fundamentals.
- Medication safety and pharmacology principles.
- Clinical judgment and prioritization.

### Wave 3: Country-Specific Overlays

Create local overlays for:

- Regulator terminology.
- Scope of practice.
- Documentation standards.
- Health system structure.
- Legal/professional responsibilities.
- Exam-specific question style.

### Wave 4: Hidden Admin QA

- Render hidden admin preview hubs.
- Confirm no public route resolves.
- Confirm `noindex,nofollow`.
- Confirm no sitemap or navigation entry.
- Confirm content cannot be launched by learners.

## Global Content Tagging Audit

| Content Type | Global Reuse | Canada Specific | U.S. Specific | Future International |
| --- | --- | --- | --- | --- |
| Heart Failure | Global | Add Canadian system examples only if needed | Add U.S. discharge/insurance examples only if needed | Reuse core; localize terminology |
| Sepsis Recognition | Global | Shared unless local protocols named | Shared unless local protocols named | Reuse core; regulator overlay |
| ECG Rhythm Recognition | Global | Shared | Shared | Reuse core |
| Lab Interpretation | Mostly Global | Country-specific units/reference policies if needed | Country-specific reporting policies if needed | Validate units and critical value workflows |
| Medication Safety | Mostly Global | Canadian scope/policy overlays | U.S. scope/policy overlays | Local prescribing/administration overlays |
| Delegation | Country Specific | Canadian role language | U.S. RN/LPN/UAP language | Must be country-specific |
| Health System Structure | Country Specific | Canadian healthcare system | Medicare/Medicaid/private insurance | NHS, AHPRA/NMBA, NCNZ, NMBI, PRC, SCFHS, UAE authority overlays |
| Exam Strategy | Exam Specific | NCLEX-RN, REx-PN, CNPLE | NCLEX-RN, NCLEX-PN, NP boards | NMC CBT, OSCE, PNLE, SCFHS, local exams |
| Clinical Skills | Mostly Global | Scope/documentation overlays | Scope/documentation overlays | Local scope and workplace expectations |
| Pharmacology | Mostly Global | Drug naming/access overlays | Drug naming/access overlays | Local drug naming and regulatory overlays |

## Publication Gate

No international pathway may move from hidden draft to public until:

1. Regulator sources are documented.
2. Clinical/editorial review is complete.
3. Content gap minimums are met.
4. SEO metadata is reviewed.
5. Legal affiliation disclaimers are present.
6. Sitemap inclusion is intentionally approved.
7. Navigation inclusion is intentionally approved.
8. `PATHWAY_LAUNCH_APPROVED` or equivalent release gate is updated in code review.
