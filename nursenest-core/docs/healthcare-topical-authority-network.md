# Healthcare Topical Authority Network

## Purpose

The Healthcare Topical Authority Network turns NurseNest authority content from isolated pages into a connected healthcare knowledge ecosystem. It is designed to build authority at the topic, specialty, profession, and certification levels while preserving NurseNest's premium learning funnel.

## Authority Layers

The network is modeled in `src/lib/authority/healthcare-authority-content-engine.ts`.

- Layer 1: Professions, including Nursing, RPN/LPN, NP, RT, Paramedic, OT, PT, MLT, and PSW.
- Layer 2: Major body systems, including cardiovascular, respiratory, neurology, endocrine, renal, GI, hematology, oncology, mental health, pediatrics, and maternal child.
- Layer 3: Condition pillars, including Heart Failure, COPD, Stroke, Diabetes, Sepsis, AKI, CKD, AFib, Pneumonia, and MI.
- Layer 4: Learning assets, including lessons, flashcards, questions, CAT, NGN, simulations, clinical skills, labs, pharmacology, care plans, concept maps, study plans, and clinical reasoning pathways.

## Knowledge Graph

`buildHealthcareKnowledgeGraph()` creates a stored relationship model from the existing authority registries:

- Authority layers
- Topic clusters
- Published seed pages
- Specialty hubs
- Allied health hubs
- Certification hubs
- Relationship seed data

Example Heart Failure relationships include BNP, Furosemide, Digoxin, Pulmonary Edema, Fluid Overload, Cardiac Output, AFib, Echocardiography, Heart Failure Care Plans, Heart Failure Simulations, and Heart Failure NCLEX Questions.

## Authority Hubs

Specialty hubs:

- Cardiology
- Respiratory
- Critical Care
- Emergency
- Mental Health
- Maternal Child
- Pediatrics
- Community Care

Allied health hubs:

- Respiratory Therapy
- Paramedic
- Occupational Therapy
- Physiotherapy
- Medical Laboratory Technology
- PSW

Certification hubs:

- NCLEX-RN
- REx-PN
- CNPLE
- FNP
- PMHNP
- AGPCNP
- WHNP
- PNP-PC
- Future Allied Certification Hubs

## Scoring And Gaps

`buildAuthorityScoreEngine()` tracks scores across:

- Topics
- Systems
- Professions
- Certifications
- Specialties

`detectAuthorityContentGaps()` reports missing topic pages, missing relationships, weak clusters, weak hubs, weak internal linking, underserved professions, and underserved certifications.

## Canadian Advantage

The network explicitly tracks Canadian opportunity areas competitors often under-serve:

- Canadian Nursing
- Canadian NP
- Canadian RT
- Canadian Paramedic
- Canadian Allied Health

## User Journey Network

`buildAuthorityUserJourneyNetwork()` connects public SEO pages to deeper related resources and protected premium learning experiences. A visitor landing on Heart Failure Nursing Care Plan can discover the Heart Failure pillar, medications, labs, clinical skills, simulations, flashcards, questions, and study plan.

Public content educates. Premium content trains.
