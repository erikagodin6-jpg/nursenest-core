#!/usr/bin/env bash

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
ENV_FILE="${REPO_ROOT}/nursenest-core/.env.local"

REQUIRED_VARS=(
  "DATABASE_URL"
  "DIRECT_URL"
  "NEXTAUTH_SECRET"
  "NEXTAUTH_URL"
)

if [[ -f "${ENV_FILE}" ]]; then
  set -a
  # shellcheck disable=SC1090
  . "${ENV_FILE}"
  set +a
  echo "[load-local-env] nursenest-core/.env.local: set"
else
  echo "[load-local-env] nursenest-core/.env.local: missing"
fi

missing_count=0

for var_name in "${REQUIRED_VARS[@]}"; do
  if [[ -n "${!var_name-}" ]]; then
    echo "[load-local-env] ${var_name}: set"
  else
    echo "[load-local-env] ${var_name}: missing"
    missing_count=$((missing_count + 1))
  fi
done

if [[ "${missing_count}" -eq 0 ]]; then
  echo "[load-local-env] summary: all required variables are set"
else
  echo "[load-local-env] summary: ${missing_count} required variable(s) missing"
fi
