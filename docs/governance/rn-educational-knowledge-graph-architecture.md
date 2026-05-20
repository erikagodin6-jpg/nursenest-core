# RN Educational Knowledge Graph — Architecture (Second Pass)

## North star

One governed **RN clinical reasoning graph** connecting lessons, mechanisms, interpretation guides, glossary entities, competencies, and remediation ladders — without SEO link spam or parallel mini-products.

## Layers

| Layer | Source of truth | Consumer surfaces |
| --- | --- | --- |
| Topic clusters | `lesson-topic-cluster-registry.ts` | Lesson hubs, siblings, catalog |
| Link registry | `link-target-registry.ts` + catalog bootstrap | Auto-related, sitemaps |
| RN competency ontology | `educational-graph/rn-competency-ontology.ts` | Topic hubs, remediation, future dashboard |
| Clinical reasoning edges | `ClinicalReasoningRelation` enum | Remediation copy, AI tutor (future) |
| Mechanism explainers | `nursing-mechanism-clusters.ts` | `/nursing-mechanisms`, lesson hubs |
| Interpretation guides | `clinical-interpretation-registry.ts` | `/clinical-interpretation` |
| Glossary | `nursing-glossary-registry.ts` | `/nursing-glossary` |
| Remediation V2 | `educational-graph/remediation-ladder-v2.ts` | Public lesson detail |
| Learner longitudinal | `post-exam-coaching/*`, `longitudinal-memory.ts` | `/app` coaching (CAT/LOFT) |
| Graph governance | `educational-graph/graph-governance.ts` | Resolver caps + audits |

## Remediation ladder V2 (marketing)

Progressive sequence (max 8 steps):

1. Mechanism explainer (when published + topic match)
2. Foundational sibling lessons (catalog-backed)
3. Clinical interpretation guide (when published)
4. Prioritization drill (pathway questions `?topic=`)
5. Flashcards
6. Mixed reassessment (pathway CAT)

App-side post-exam ladder remains in `buildCompetencyGraphSteps` — converge href builders over time.

## Governance rules

- **Lesson auto-related:** `DENSITY_CONFIG.lesson.totalMax = 4` (hard ceiling).
- **Topic hub graph:** max 6 links via `TOPIC_HUB_GRAPH_MAX_LINKS`.
- **Glossary:** min 72-char definitions; duplicate slug/term rejection (`nursing-glossary-governance.ts`).
- **Interpretation:** only `status: "published"` in sitemaps and published lists.
- **Relevance:** `scoreEducationalRelevance` ≥ 6 for strong edges.

## Structured data

- Glossary terms: `DefinedTerm` JSON-LD (`structured-data-educational-entities.ts`).
- Mechanisms / interpretation: `LearningResource` + `MedicalWebPage` at route render (extend per page).

## Future wiring

- Map `LearnerCompetencyTrend.persistentWeak` → `buildTopicHubLearningGraph` ordering.
- AI tutor: traverse ontology + remediation steps as tool plan.
- Semantic search: index competency IDs + reasoning relations alongside lesson slugs.

## Verification

```bash
node nursenest-core/scripts/audit-rn-educational-graph.mjs
node --import tsx --test nursenest-core/src/lib/educational-graph/educational-graph.contract.test.ts
node --import tsx --test nursenest-core/src/lib/linking/seo-graph-hardening.contract.test.ts
```
