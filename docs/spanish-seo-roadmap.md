# Spanish International SEO Roadmap

Date: 2026-05-31

Status: `DRAFT - NOT READY FOR PUBLICATION`

## Current SEO Posture

Spanish remains protected:

- public host: `es.nursenest.ca`,
- internal rendering path: `/es/...`,
- robots policy: `noindex,nofollow`,
- sitemap: valid empty Spanish sitemap while preview,
- hreflang: Spanish excluded until publication readiness.

This should remain unchanged until Spanish content passes all publication gates.

## Primary Search Audiences

| Audience | Search intent |
|---|---|
| US Hispanic RN candidates | NCLEX-RN Spanish, NCLEX in Spanish, NGN explanations |
| PN/LPN candidates | NCLEX-PN Spanish, practical nursing study plans |
| International nurses | NCLEX for foreign nurses, licensure, credentialing, visas |
| Puerto Rico learners | local licensure plus US NCLEX career bridge |
| Latin American nurses | how to work as a nurse in the US, NCLEX preparation |
| NP candidates | FNP, AGPCNP, PMHNP certification preparation |

## Keyword Inventory Seeds

### NCLEX-RN

- NCLEX-RN en espanol
- preguntas NCLEX en espanol
- como aprobar el NCLEX-RN
- preguntas NGN en espanol
- banco de preguntas NCLEX-RN
- examen CAT NCLEX
- tarjetas de estudio NCLEX
- plan de estudio NCLEX
- preguntas SATA NCLEX
- casos clinicos NCLEX

### NCLEX-PN

- NCLEX-PN en espanol
- preguntas NCLEX-PN
- como aprobar el NCLEX-PN
- LPN exam prep en espanol
- practical nursing NCLEX en espanol

### NP

- FNP certification en espanol
- preguntas FNP
- AGPCNP certification
- PMHNP certification
- nurse practitioner exam prep en espanol
- diagnostico diferencial NP
- farmacologia avanzada NP

### International Nurses

- NCLEX para enfermeras internacionales
- trabajar como enfermera en Estados Unidos
- requisitos NCLEX para enfermeras extranjeras
- licencia de enfermeria en Estados Unidos
- enfermeras mexicanas NCLEX
- enfermeras colombianas NCLEX
- enfermeras de Puerto Rico NCLEX

## Future Route Architecture

| Page type | Example public URL |
|---|---|
| Spanish homepage | `https://es.nursenest.ca/` |
| NCLEX-RN hub | `https://es.nursenest.ca/nclex-rn` |
| NCLEX-RN questions | `https://es.nursenest.ca/nclex-rn/preguntas` |
| NCLEX-PN hub | `https://es.nursenest.ca/nclex-pn` |
| FNP hub | `https://es.nursenest.ca/fnp` |
| PMHNP hub | `https://es.nursenest.ca/pmhnp` |
| Blog | `https://es.nursenest.ca/blog/...` |
| International nurses | `https://es.nursenest.ca/enfermeras-internacionales/...` |

Keep exam slugs stable in early architecture. Localized subpaths can be introduced once route governance supports localized aliases safely.

## Metadata Standard

Every Spanish page must include:

- unique Spanish SEO title,
- unique Spanish meta description,
- canonical on `es.nursenest.ca`,
- Spanish Open Graph and Twitter metadata,
- Spanish breadcrumb schema,
- Spanish FAQ schema,
- Article/Course/MedicalWebPage schema where appropriate,
- author/reviewer metadata,
- last updated and clinical review dates,
- related Spanish resources.

## Hreflang Activation Rule

Spanish pages should enter hreflang only when:

- page is indexable,
- English equivalent exists,
- Spanish content is complete and not mixed-language,
- canonical points to `es.nursenest.ca`,
- reciprocal alternates exist,
- clinical/language/SEO reviews are approved.

Future pattern:

```text
en-CA or en-US: https://nursenest.ca/{path}
es: https://es.nursenest.ca/{path-or-localized-slug}
x-default: https://nursenest.ca/{path}
```

## SEO Readiness Gates

| Gate | Threshold |
|---|---:|
| Spanish noindex before launch | 100% |
| Spanish sitemap exclusion before launch | 100% |
| Unique Spanish metadata after launch | 95% |
| Breadcrumb/schema coverage | 95% |
| FAQ coverage for authority pages | 90% |
| Internal linking coverage | 95% |
| Orphan Spanish pages | 0 |
| Country-specific pages with reviewed claims | 95% |

