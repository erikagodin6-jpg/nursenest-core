#!/usr/bin/env bash
# Safe local checks: hits public endpoints only (no auth secrets).
set -euo pipefail

BASE="${BASE_URL:-http://127.0.0.1:3000}"

step() {
  echo ""
  echo "== $1 =="
}

step "Health (expect 200)"
curl -sS -o /dev/null -w "HTTP %{http_code}\n" \
  -H "x-nn-correlation-id: verify-health-$$" \
  "$BASE/api/health"

step "Home stats (runWithApiTelemetry → request_end)"
curl -sS -o /dev/null -w "HTTP %{http_code}\n" \
  -H "x-nn-correlation-id: verify-homestats-$$" \
  "$BASE/api/public/home-stats"

step "Checkout unauthenticated (expect 401 + checkout_failed in logs if NN_STRUCTURED_OBSERVABILITY=1)"
curl -sS -o /dev/null -w "HTTP %{http_code}\n" \
  -X POST "$BASE/api/subscriptions/checkout" \
  -H "content-type: application/json" \
  -H "x-nn-correlation-id: verify-checkout-$$" \
  -d '{"tier":"RN","duration":"monthly","acceptPolicies":true,"policyVersion":"test"}'

step "Signup invalid body (expect 4xx + signup_failed in logs)"
curl -sS -o /dev/null -w "HTTP %{http_code}\n" \
  -X POST "$BASE/api/signup" \
  -H "content-type: application/json" \
  -H "x-nn-correlation-id: verify-signup-$$" \
  -d '{}'

echo ""
echo "Done. Grep dev server stderr for correlation ids verify-*-$$ and events: request_end, checkout_failed, signup_failed."
