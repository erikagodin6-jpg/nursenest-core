# French Canadian SEO Roadmap

Date: 2026-05-31

Status: `DRAFT - NOT READY FOR PUBLICATION`

## SEO Posture

French currently remains protected:

- public host: `fr.nursenest.ca`,
- internal rendering path: `/fr/...`,
- robots policy: `noindex,nofollow`,
- sitemap: valid empty French sitemap while preview,
- hreflang: French excluded until publication readiness.

This posture should remain unchanged until French Canadian content passes the publication gate.

## Primary Search Audiences

| Audience | Search intent |
|---|---|
| French practical nursing students | REx-PN, infirmiere auxiliaire, priorisation, pharmacologie, stages |
| French RN candidates in Canada | NCLEX-RN Canada, questions NGN, plan d'etude, examens pratiques |
| French NP candidates | CNPLE, infirmiere praticienne, raisonnement diagnostic, prescription |
| Francophone career seekers | salaire infirmier, devenir infirmiere, exigences provinciales |
| Francophone clinical learners | calculs de medicaments, laboratoire, ECG, competences cliniques |

## Keyword Inventory Seeds

### REx-PN

- REx-PN en francais
- examen REx-PN Canada
- questions REx-PN en francais
- preparation REx-PN
- plan d'etude REx-PN
- infirmiere auxiliaire autorisee examen
- priorisation REx-PN
- pharmacologie REx-PN
- delegation infirmiere auxiliaire
- patient stable instable REx-PN

### Canadian NCLEX-RN

- NCLEX-RN Canada en francais
- questions NCLEX en francais
- preparation NCLEX infirmiere Canada
- questions NGN en francais
- cas cliniques NCLEX
- plan d'etude NCLEX-RN Canada
- pharmacologie NCLEX en francais
- priorisation infirmiere NCLEX
- delegation NCLEX-RN
- examen NCLEX infirmiere autorisee

### CNPLE

- CNPLE en francais
- preparation CNPLE
- infirmiere praticienne examen Canada
- questions CNPLE
- raisonnement diagnostic infirmiere praticienne
- pharmacotherapie infirmiere praticienne
- interpretation analyses infirmiere praticienne
- prescription infirmiere praticienne Canada

### Career and Regulation

- devenir infirmiere au Quebec
- devenir infirmiere auxiliaire au Canada
- salaire infirmiere Quebec
- salaire infirmiere auxiliaire Quebec
- ordre infirmier Quebec
- inscription infirmiere Nouveau-Brunswick
- permis infirmiere Ontario francais

## Page Architecture

Future French Canadian route set:

| Page type | Example public URL |
|---|---|
| French homepage | `https://fr.nursenest.ca/` |
| REx-PN hub | `https://fr.nursenest.ca/rex-pn` |
| REx-PN questions | `https://fr.nursenest.ca/rex-pn/questions-pratiques` |
| NCLEX-RN Canada hub | `https://fr.nursenest.ca/nclex-rn-canada` |
| CNPLE hub | `https://fr.nursenest.ca/cnple` |
| Blog | `https://fr.nursenest.ca/blog/...` |
| Career guide | `https://fr.nursenest.ca/carrieres/...` |

Localized slugs should be supported later, but early architecture can keep stable exam slugs (`rex-pn`, `nclex-rn-canada`, `cnple`) to avoid fragile route churn.

## Metadata Standard

Every future French page must have:

- unique French Canadian title,
- unique French Canadian description,
- canonical URL on `fr.nursenest.ca`,
- breadcrumb schema in French,
- FAQ schema in French,
- Article/MedicalWebPage/Course schema where appropriate,
- author and reviewer metadata,
- last updated and clinical review dates,
- related content links.

## Hreflang Activation Rule

Do not add French pages to hreflang until:

1. page is indexable,
2. reciprocal English/French equivalent exists,
3. canonical URLs are correct,
4. French page is not mixed-language,
5. clinical/language/SEO review are complete.

Future pattern:

```text
en-CA: https://nursenest.ca/{path}
fr-CA: https://fr.nursenest.ca/{path-or-localized-slug}
x-default: https://nursenest.ca/{path}
```

## Internal Linking Strategy

Every French authority page must link to:

- parent French pathway hub,
- related French lessons,
- related French flashcards,
- related French questions,
- related French simulations or case studies,
- related French blog resources,
- relevant English content only when clearly labelled as English and not used as a substitute for French completion.

## SEO Readiness Gates

| Gate | Required threshold |
|---|---:|
| French canonical coverage | 100% |
| French noindex before launch | 100% |
| French sitemap exclusion before launch | 100% |
| French unique metadata after launch | 95%+ |
| French breadcrumb/schema coverage | 95%+ |
| French FAQ coverage for authority pages | 90%+ |
| French internal link coverage | 95%+ |
| French orphan page count | 0 |

