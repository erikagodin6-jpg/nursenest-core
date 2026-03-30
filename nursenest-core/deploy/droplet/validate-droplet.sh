#!/usr/bin/env bash
#
# Smoke-test public URLs after deploy. Usage:
#   bash validate-droplet.sh https://your.domain
#
set -euo pipefail

BASE="${1:-}"
if [[ -z "${BASE}" ]]; then
  echo "Usage: $0 https://your.domain" >&2
  exit 1
fi

BASE="${BASE%/}"

echo "== GET ${BASE}/healthz"
curl -fsS "${BASE}/healthz" | jq . 2>/dev/null || curl -fsS "${BASE}/healthz"
echo ""

echo "== GET ${BASE}/api/health"
curl -fsS "${BASE}/api/health" | jq . 2>/dev/null || curl -fsS "${BASE}/api/health"
echo ""

echo "== GET ${BASE}/api/health/ready (may be 503 if DB down or not configured)"
code="$(curl -sS -o /tmp/nn-ready.json -w '%{http_code}' "${BASE}/api/health/ready" || true)"
echo "HTTP ${code}"
cat /tmp/nn-ready.json 2>/dev/null | jq . 2>/dev/null || cat /tmp/nn-ready.json 2>/dev/null || true
echo ""

echo "Done."
