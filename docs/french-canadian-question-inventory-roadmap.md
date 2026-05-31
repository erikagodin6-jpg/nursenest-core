# French Canadian Question Inventory Roadmap

Date: 2026-05-31

Status: `DRAFT - NOT READY FOR PUBLICATION`

## Question Contract

Every French Canadian question must include:

- correct answer,
- detailed rationale,
- distractor rationales,
- hint,
- clinical pearl,
- exam trap,
- memory anchor,
- difficulty rating,
- cognitive level,
- blueprint mapping,
- metadata,
- Canadian scope/regulatory note where relevant.

Questions missing any component remain unpublished.

## REx-PN Question Roadmap

Target: 5,000 questions.

Recommended distribution:

| Type | Target share | Target count |
|---|---:|---:|
| Traditional MCQ | 35% | 1,750 |
| SATA | 15% | 750 |
| Bowtie | 10% | 500 |
| Matrix | 10% | 500 |
| Case studies | 10% | 500 |
| Trend recognition | 5% | 250 |
| Prioritization | 5% | 250 |
| Delegation | 3% | 150 |
| Documentation | 2% | 100 |
| Other clinical judgment formats | 5% | 250 |

Priority first 1,000 items:

1. Practical nursing scope, safety, delegation, and documentation.
2. Adult med-surg deterioration.
3. Pharmacology and high-alert medication safety.
4. Long-term care and older adult sepsis/delirium/falls.
5. Maternal-newborn and pediatrics safety.

## Canadian NCLEX-RN Question Roadmap

Target: 10,000 questions.

Recommended distribution:

| Type | Target share | Target count |
|---|---:|---:|
| Traditional MCQ | 35% | 3,500 |
| SATA | 15% | 1,500 |
| Bowtie | 10% | 1,000 |
| Matrix | 10% | 1,000 |
| Case studies | 10% | 1,000 |
| Trend recognition | 5% | 500 |
| Prioritization | 5% | 500 |
| Delegation | 3% | 300 |
| Documentation | 2% | 200 |
| Other clinical judgment formats | 5% | 500 |

Priority first 2,000 items:

1. NGN clinical judgment and cue recognition.
2. Cardiovascular, respiratory, neurological, endocrine, renal, GI.
3. Pharmacology: insulin, anticoagulants, cardiac meds, antimicrobials, psych meds.
4. Maternal-newborn and pediatrics.
5. Mental health, therapeutic communication, crisis safety.

## CNPLE Question Roadmap

Target: 2,500 questions.

Recommended distribution:

| Type | Target share | Target count |
|---|---:|---:|
| Clinical scenario MCQ | 35% | 875 |
| Differential diagnosis / assessment | 15% | 375 |
| Pharmacotherapeutics | 15% | 375 |
| Lab and diagnostics interpretation | 10% | 250 |
| Case studies / LOFT-style | 10% | 250 |
| Ethics, documentation, professional practice | 5% | 125 |
| Health promotion / chronic disease | 5% | 125 |
| Mental health / addictions | 5% | 125 |

Priority first 500 items:

1. Differential diagnosis and red flags.
2. Prescribing safety and monitoring.
3. Lab interpretation and diagnostic stewardship.
4. Chronic disease management in Canadian primary care.
5. Documentation, consent, and escalation.

## French Rationale Quality Standard

A French Canadian rationale must teach:

- pourquoi la reponse est correcte,
- pourquoi chaque option incorrecte est tentante mais dangereuse/incomplete,
- le raisonnement clinique,
- l'implication pour la securite du patient,
- l'application en stage ou en pratique,
- la strategie d'examen,
- une perle clinique memorable,
- les ressources reliees.

Avoid formulaic language such as:

- "Cette reponse est correcte parce que..."
- "L'option B est incorrecte parce que..."
- "Il faut revoir le contenu..."

Preferred tone:

```text
La donnee qui change la priorite est la deterioration de l'etat respiratoire, pas seulement le diagnostic de MPOC. Chez une personne qui devient agitee avec une saturation qui chute, l'agitation peut etre un signe precoce d'hypoxemie ou d'hypercapnie. La reponse securitaire soutient la respiration, verifie l'equipement d'oxygene et declenche l'escalade au lieu d'attendre la prochaine ronde.
```

## Metadata Requirements

Every item must include:

- `locale: fr-CA`,
- `country: CA`,
- `exam: REx-PN | NCLEX-RN-CA | CNPLE`,
- `profession: RPN | RN | NP`,
- `questionType`,
- `difficulty`,
- `cognitiveLevel`,
- `blueprintDomain`,
- `bodySystem`,
- `clinicalJudgmentPhase`,
- `scopeTag`,
- `regulatoryReviewRequired`,
- `clinicalReviewStatus`,
- `languageReviewStatus`,
- `publicationStatus`,
- `indexable: false` until fully approved.

