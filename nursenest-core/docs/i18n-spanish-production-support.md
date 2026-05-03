# Spanish Production Support

Spanish (`es`) is maintained from canonical English (`en`) without changing English or French shards.

## Safety Rules

- Do not rename, remove, or restructure keys.
- Spanish shard keys must match English shard keys exactly.
- Translation scripts may write only `public/i18n/es/*.json`.
- English and French are protected inputs for Spanish work.

## Translation Quality

Use clear neutral Spanish for international nursing learners. Preferred terms:

- Nursing Exam Prep: Preparación para exámenes de enfermería
- Practice Questions: Preguntas de práctica
- Flashcards: Tarjetas de memoria
- New Grad: Recién graduado/a
- Patient Care: Atención al paciente
- Lessons: Lecciones
- Study Plan: Plan de estudio
- Readiness: Preparación
- Clinical Judgment: Juicio clínico

Protected terms such as NurseNest, REx-PN, NCLEX, CPNRE, OSCE, CAT, RN, RPN, PN, NP, NGN, NCSBN, and CASN stay unchanged.

## Fallback Contract

Use Spanish when a Spanish key exists. If Spanish is missing, fallback to English only with a warning. If English is missing, throw because English is the source of truth. Production UI must not render raw missing-key placeholders.

## Validation

Run:

```bash
npm run i18n:audit:es
node --import tsx --test src/lib/i18n/spanish-i18n-readiness.test.ts
```

The Spanish audit writes:

- `reports/spanish-completeness-audit.md`
- `reports/spanish-completeness-audit.json`

The audit fails on missing Spanish keys, extra Spanish keys, and placeholder/missing-key markers. English-identical Spanish values are reported as review fields so human translation work can continue without breaking production key safety.
