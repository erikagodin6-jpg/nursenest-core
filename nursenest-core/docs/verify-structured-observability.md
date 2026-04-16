# Verify structured observability (non-production)

**Prerequisite:** JSON lines only print when structured observability is on (`NN_STRUCTURED_OBSERVABILITY=1` or production defaults in `observability-record.ts`).

## Checklist

1. **Start the app** with explicit structured logging:
   ```bash
   cd nursenest-core && NN_STRUCTURED_OBSERVABILITY=1 pnpm dev
   ```
2. **Pick a stable correlation id** (e.g. `verify-test-001`).
3. **Hit an instrumented API** with the proxy header (middleware sets `x-nn-correlation-id` if absent; manual header proves propagation):
   ```bash
   curl -sS -D - -o /dev/null \
     -H "x-nn-correlation-id: verify-test-001" \
     "http://127.0.0.1:3000/api/health"
   ```
   - Expect stderr JSON lines containing `"scope":"structured"` or `"scope":"api"` depending on path.
4. **Telemetry-wrapped route** (emits `request_end` + `request_failed` on 5xx):
   ```bash
   curl -sS "http://127.0.0.1:3000/api/public/home-stats" \
     -H "x-nn-correlation-id: verify-test-002"
   ```
5. **Checkout correlation** (expect 401 + structured `checkout_failed` when unauthenticated):
   ```bash
   curl -sS -X POST "http://127.0.0.1:3000/api/subscriptions/checkout" \
     -H "content-type: application/json" \
     -H "x-nn-correlation-id: verify-test-003" \
     -d '{"tier":"RN","duration":"monthly","acceptPolicies":true,"policyVersion":"test"}'
   ```
   - Grep server output for `"event":"checkout_failed"` and matching `correlationId`.
6. **Signup structured failure** (safe: invalid body → `signup_failed` without creating a user):
   ```bash
   curl -sS -X POST "http://127.0.0.1:3000/api/signup" \
     -H "content-type: application/json" \
     -H "x-nn-correlation-id: verify-test-004" \
     -d '{}'
   ```
7. **Password reset** (optional; may send mail if configured — skip in shared envs):
   - Use `forgot-password` only on local/dev with mail disabled or expect `password_reset_failed` / `password_reset_requested` in logs per outcome.

## Script

`scripts/verify-structured-observability.sh` runs steps 3–5 and prints the correlation ids to search in logs.

## Correlation propagation

- **Edge `proxy`** (`src/proxy.ts`): ensures `x-nn-correlation-id` on incoming requests; logs `request_start` for `/api/*`.  
- **Route handlers**: `correlationIdFromRequest` reads `x-nn-correlation-id` first, then platform ids (`x-vercel-id`, `x-request-id`, …).  
- **Gaps**: Prisma-layer `db_query_failed` / `db_query_slow` have **no** request context unless Async Local Storage is added later.
