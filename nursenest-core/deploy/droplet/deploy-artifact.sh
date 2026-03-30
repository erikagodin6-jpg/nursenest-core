#!/usr/bin/env bash
#
# Deploy NurseNest Core from a pre-built artifact (tarball). Use on low-memory
# Droplets when CI or another build host produced .next (and usually node_modules).
#
# Does not remove the currently running release until the new tree is validated
# and PM2 has been reloaded. Keeps prior release directories for rollback.
#
# Expected tarball layout (paths relative to archive root):
#   shared/              (monorepo shared package; required for tracing/runtime)
#   nursenest-core/      (Next app with .next/, prisma/, package.json, deploy/droplet/, …)
#
# Typical pack on the build host (from monorepo root, after build):
#   cd nursenest-core && npm ci && npm run build:deploy
#   cd .. && tar -czf nursenest-release.tgz shared nursenest-core
#
# Environment:
#   NURSE_NEST_ARTIFACT       (required) path to .tar.gz
#   NURSE_NEST_RELEASE_ROOT   (optional) default: /var/www/nursenest/releases
#   NURSE_NEST_CURRENT_LINK   (optional) default: /var/www/nursenest/current
#   NURSE_NEST_ENV_FILE       (optional) same as deploy-app.sh
#   NURSE_NEST_SKIP_NPM_CI    (optional) set to 1 to skip npm ci when node_modules is shipped
#
set -euo pipefail

ARTIFACT="${NURSE_NEST_ARTIFACT:-}"
if [[ -z "${ARTIFACT}" || ! -f "${ARTIFACT}" ]]; then
  echo "Set NURSE_NEST_ARTIFACT to a readable .tar.gz (see deploy/droplet/README.md)." >&2
  exit 1
fi

RELEASE_ROOT="${NURSE_NEST_RELEASE_ROOT:-/var/www/nursenest/releases}"
CURRENT_LINK="${NURSE_NEST_CURRENT_LINK:-/var/www/nursenest/current}"
SKIP_NPM="${NURSE_NEST_SKIP_NPM_CI:-0}"

mkdir -p "${RELEASE_ROOT}"

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
STAGING="${RELEASE_ROOT}/.staging-${STAMP}"
NEW_RELEASE="${RELEASE_ROOT}/${STAMP}"

cleanup_staging() {
  if [[ -d "${STAGING}" ]]; then
    rm -rf "${STAGING}"
  fi
}
trap cleanup_staging EXIT

mkdir -p "${STAGING}"
echo "Extracting artifact to ${STAGING} ..."
tar -xzf "${ARTIFACT}" -C "${STAGING}"

# Resolve repo root: either STAGING has shared/ + nursenest-core/, or one top-level directory does.
INNER_ROOT=""
if [[ -d "${STAGING}/shared" && -f "${STAGING}/nursenest-core/package.json" ]]; then
  INNER_ROOT="${STAGING}"
else
  shopt -s nullglob
  for d in "${STAGING}"/*; do
    if [[ -d "${d}/shared" && -f "${d}/nursenest-core/package.json" ]]; then
      INNER_ROOT="${d}"
      break
    fi
  done
  shopt -u nullglob
fi

if [[ -z "${INNER_ROOT}" ]]; then
  echo "Artifact must unpack to a tree containing shared/ and nursenest-core/package.json (see docs/droplet-migration-plan.md)." >&2
  exit 1
fi

APP_DIR="${INNER_ROOT}/nursenest-core"
ECOSYSTEM="${APP_DIR}/deploy/droplet/ecosystem.config.cjs"

if [[ ! -f "${APP_DIR}/.next/BUILD_ID" ]]; then
  echo "Missing built app: ${APP_DIR}/.next/BUILD_ID (run build:deploy on the build host)." >&2
  exit 1
fi

if [[ ! -f "${ECOSYSTEM}" ]]; then
  echo "Missing ${ECOSYSTEM}" >&2
  exit 1
fi

PREVIOUS_ACTIVE=""
if [[ -L "${CURRENT_LINK}" || -e "${CURRENT_LINK}" ]]; then
  PREVIOUS_ACTIVE="$(readlink -f "${CURRENT_LINK}" 2>/dev/null || true)"
fi

echo "Promoting staged tree to ${NEW_RELEASE} ..."
trap - EXIT
if [[ "${INNER_ROOT}" == "${STAGING}" ]]; then
  mv "${STAGING}" "${NEW_RELEASE}"
else
  mv "${INNER_ROOT}" "${NEW_RELEASE}"
  rm -rf "${STAGING}"
fi

REPO_ROOT="${NEW_RELEASE}"

APP_DIR="${REPO_ROOT}/nursenest-core"
ECOSYSTEM="${APP_DIR}/deploy/droplet/ecosystem.config.cjs"

ENV_FILE="${NURSE_NEST_ENV_FILE:-${APP_DIR}/.env.production}"
if [[ -f "${ENV_FILE}" ]]; then
  set -a
  # shellcheck disable=SC1090
  . "${ENV_FILE}"
  set +a
  echo "Loaded env from ${ENV_FILE}"
else
  echo "Error: no env file at ${ENV_FILE}. Set NURSE_NEST_ENV_FILE or create .env.production." >&2
  exit 1
fi

export NODE_ENV="${NODE_ENV:-production}"
export TMPDIR="${TMPDIR:-/tmp}"
export PORT="${PORT:-3000}"

cd "${APP_DIR}"

if [[ "${SKIP_NPM}" == "1" ]]; then
  if [[ ! -d node_modules/next ]]; then
    echo "NURSE_NEST_SKIP_NPM_CI=1 but node_modules/next is missing; remove SKIP or ship node_modules in the artifact." >&2
    exit 1
  fi
  echo "Skipping npm ci (NURSE_NEST_SKIP_NPM_CI=1)."
elif [[ -d node_modules/next ]]; then
  echo "Using existing node_modules from artifact (npm ci skipped)."
else
  echo "Running npm ci --omit=dev (artifact had no node_modules; uses more RAM than a fully vendored artifact) ..."
  if [[ -f package-lock.json ]]; then
    npm ci --omit=dev
  else
    npm install --omit=dev
  fi
fi

echo "Prisma generate + migrate deploy ..."
npx prisma generate
npx prisma migrate deploy

echo "Reloading PM2 from ${ECOSYSTEM} ..."
pm2 startOrReload "${ECOSYSTEM}" --update-env

echo "Waiting for app health (127.0.0.1:3000) ..."
ok=0
for i in $(seq 1 30); do
  if curl -fsS "http://127.0.0.1:${PORT}/healthz" >/dev/null 2>&1; then
    ok=1
    break
  fi
  sleep 1
done

if [[ "${ok}" != "1" ]]; then
  echo "Health check failed after PM2 reload." >&2
  if [[ -n "${PREVIOUS_ACTIVE}" && -f "${PREVIOUS_ACTIVE}/nursenest-core/deploy/droplet/ecosystem.config.cjs" ]]; then
    echo "Attempting rollback to previous release: ${PREVIOUS_ACTIVE}" >&2
    # shellcheck disable=SC1090
    [[ -f "${ENV_FILE}" ]] && set -a && . "${ENV_FILE}" && set +a
    pm2 startOrReload "${PREVIOUS_ACTIVE}/nursenest-core/deploy/droplet/ecosystem.config.cjs" --update-env || true
    pm2 save || true
    echo "Rollback attempted. Inspect: pm2 logs nursenest-core --lines 100" >&2
  else
    echo "No previous release recorded at ${CURRENT_LINK}; fix the app and redeploy." >&2
  fi
  exit 1
fi

ln -sfn "${REPO_ROOT}" "${CURRENT_LINK}"
pm2 save

echo "Deploy finished. Active release: ${REPO_ROOT} (symlink: ${CURRENT_LINK})"
echo "Prior release (rollback): ${PREVIOUS_ACTIVE:-none}"
echo "Check: pm2 status && pm2 logs nursenest-core --lines 50"
