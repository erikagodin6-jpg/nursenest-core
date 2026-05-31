# Global Content Reuse Map

Date: 2026-05-31

Status: internal reuse plan. Reuse candidates must remain hidden unless already part of an approved live pathway.

## Reusable Topic Signal Counts

| Topic Signal | Files With Matches | Reuse Classification |
| --- | ---: | --- |
| Heart Failure / CHF | 984 | Global Core |
| COPD | 1,176 | Global Core |
| Shock | 1,151 | Global Core |
| Sepsis | 4,414 | Global Core |
| ABG / Arterial Blood Gas | 626 | Global Core |
| ECG / Telemetry | 3,011 | Global Core |
| Pharmacology / Medication Safety | 2,850 | Global Core + Country Supplements |
| Lab Interpretation / Labs | 2,638 | Global Core + Country Supplements |
| Clinical Skills / Assessment | 4,409 | Global Core + Country Supplements |

## Reuse Classes

| Class | Description | Examples | Markets |
| --- | --- | --- | --- |
| Global Core | Clinical science and bedside reasoning that transfers with minimal changes. | Heart Failure, COPD, Shock, Sepsis, ABGs, ECG, Lab Interpretation, Clinical Assessment | Canada, U.S., UK, Australia, New Zealand, Ireland |
| Country Supplement | Local practice, regulator, scope, terminology, documentation, or health system layer. | NHS, Duty of Candour, NMBA standards, Te Tiriti, Medicare/Medicaid | Country-specific |
| Exam Supplement | Blueprint, item style, scoring domain, and exam strategy layer. | NCLEX NGN, REx-PN, NMC CBT, NMBA/IQNM, NCNZ | Exam-specific |
| Future | Assets useful later but requiring review or localization. | International SEO longtail, translated overlays, migration-market blogs | Future markets |

## Topic Mapping

| Topic | Global | Canada | U.S. | UK | Australia | New Zealand | Future |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Heart Failure | Core lesson, flashcards, questions, simulation | Discharge/community context | Medicare/discharge planning | NHS escalation language | Rural access overlay | Community care overlay | Translate/localize |
| COPD | Core respiratory content | Home/community oxygen context | NCLEX respiratory priority | NEWS2/escalation overlay | Rural respiratory care | Community care overlay | Translate/localize |
| Sepsis | Core deterioration simulation | Canadian escalation language | NCLEX NGN cases | NEWS2 and SBAR overlay | Remote escalation overlay | Deterioration/cultural safety overlay | Translate/localize |
| Shock | Core pathophysiology and prioritization | REx-PN scope adjustment | NCLEX priority/delegation | NMC safe practice overlay | NMBA professional practice | NCNZ competency overlay | Translate/localize |
| ABGs | Core interpretation | Shared | Shared | Shared plus critical reporting | Shared plus reporting | Shared plus reporting | Translate/localize |
| ECG | Core rhythm reasoning | Shared | Shared | Scope/escalation overlay | Scope/escalation overlay | Scope/escalation overlay | Translate/localize |
| Pharmacology | Mechanisms and safety | Canadian med terminology | U.S. drug names/HIPAA context | UK medicines governance | Australia medication regulations | NZ med administration standards | Translate/localize |
| Lab Interpretation | Core clinical analysis | Canadian critical value workflows | U.S. workflows | UK reporting workflows | Australia workflows | NZ workflows | Translate/localize |
| Clinical Skills | Universal technique and safety | Scope/role overlay | Scope/role overlay | OSCE-style communication | NMBA standards overlay | Cultural safety overlay | Translate/localize |

## Architecture Recommendation

Use `Global Core + Country Supplement + Exam Supplement`.

Example:

`Heart Failure Global Core` -> `UK NHS Escalation Supplement` -> `NMC CBT Question Set`

This avoids maintaining five copies of the same lesson while preserving country and exam accuracy.

