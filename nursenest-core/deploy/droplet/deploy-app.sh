#!/usr/bin/env bash
#
# Deploy NurseNest Core on a Droplet: install deps, migrate, build, PM2 reload.
# Run from any cwd. Requires repo layout:
#   $NURSE_NEST_REPO_ROOT/nursenest-core   (this Next.js app)
#
set -euo pipefail

REPO_ROOT="${NURSE_NEST_REPO_ROOT:-}"
if [[ -z "${REPO_ROOT}" ]]; then
  echo "Set NURSE_NEST_REPO_ROOT to the git clone root (directory that contains nursenest-core/)." >&2
  exit 1
fi

APP_DIR="${NURSE_NEST_REPO_ROOT}/nursenest-core"
if [[ ! -f "${APP_DIR}/package.json" ]]; then
  echo "Expected app at ${APP_DIR} (package.json missing)." >&2
  exit 1
fi

ENV_FILE="${NURSE_NEST_ENV_FILE:-${APP_DIR}/.env.production}"
if [[ -f "${ENV_FILE}" ]]; then
  set -a
  # shellcheck disable=SC1090
  . "${ENV_FILE}"
  set +a
  echo "Loaded env from ${ENV_FILE} (use KEY=value lines compatible with POSIX shell; quote values with special chars)."
else
  echo "Warning: no env file at ${ENV_FILE} — set NURSE_NEST_ENV_FILE or create .env.production" >&2
fi

export NODE_ENV="${NODE_ENV:-production}"
export TMPDIR="${TMPDIR:-/tmp}"
export PORT="${PORT:-3000}"
# Next.js build can OOM on 1–2 GB Droplets without a higher heap ceiling.
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=4096}"

cd "${APP_DIR}"

if [[ -f package-lock.json ]]; then
  npm ci
else
  npm install
fi

npx prisma generate
npx prisma migrate deploy

npm run build:deploy

ECOSYSTEM="${APP_DIR}/deploy/droplet/ecosystem.config.cjs"
if [[ ! -f "${ECOSYSTEM}" ]]; then
  echo "Missing ${ECOSYSTEM}" >&2
  exit 1
fi

# PM2: pass through env from current shell (already sourced from .env.production)
pm2 startOrReload "${ECOSYSTEM}" --update-env
pm2 save

echo "Deploy finished. Check: pm2 status && pm2 logs nursenest-core --lines 50"
