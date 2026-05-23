# Rendering Policy

To keep build traversal predictable we separate the App Router into explicit route groups with clear rendering guarantees.

| Route group | URL scope examples | Rendering policy | Notes |
|-------------|--------------------|------------------|-------|
| `(marketing)` | `/`, `/blog/*`, `/canada/*` | Static/ISR allowed (default). Individual routes opt in to runtime only when required (e.g. locale detection). | SEO-focused surfaces stay static while avoiding runtime-only dependencies. |
| `(app)` | `/app/*`, `/modules/*` | `force-dynamic` | Subscriber/runtime experiences. Session + theme providers live here so marketing builds avoid auth lookups. |
| `(admin)` | `/admin/*` | `force-dynamic` | Staff tooling remains runtime only to ensure fresh RBAC checks. |
| `(runtime)` | `/internal/*`, `/healthz`, `/readyz`, `/_nn_bootstrap_ready_check__` | `force-dynamic` | Operational/diagnostic routes kept out of marketing traversal. |

## Key changes

- Marketing root layout is static: it no longer loads auth or runtime providers. Only marketing scripts/styles remain.
- `(app)` layout now owns the auth + theme providers, fetching a session at runtime and wrapping subscriber routes. Marketing and static exports no longer pay this cost.
- Runtime-only utilities (`internal`, `healthz`, etc.) moved under `(runtime)` to keep them out of static traversal graphs.
- Module routes moved under `(app)/modules`, ensuring all learner runtime surfaces share the same dynamic policy.

This structure keeps authenticated/runtime code paths out of the marketing build, making the traversal graph smaller and deterministic while preserving existing URLs and behaviours.
