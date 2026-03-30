#!/usr/bin/env bash
#
# Read-only checks: Caddy enabled at boot, PM2 process up, PM2 startup hook present.
# Run on the Droplet after bootstrap and after configuring `pm2 startup` + `pm2 save`.
#
# Exit 0 if all checks pass; non-zero if something needs operator attention.
#
set -euo pipefail

fail=0

check() {
  local name="$1"
  shift
  if "$@"; then
    echo "OK  ${name}"
  else
    echo "FAIL ${name}" >&2
    fail=1
  fi
}

echo "== Caddy"
if command -v systemctl >/dev/null 2>&1; then
  check "caddy unit registered" bash -c 'systemctl list-unit-files --type=service 2>/dev/null | grep -q "^caddy\\.service"'
  check "caddy enabled at boot" systemctl is-enabled --quiet caddy
  check "caddy running now" systemctl is-active --quiet caddy
else
  echo "SKIP systemctl not available"
fi

echo "== PM2"
check "pm2 in PATH" command -v pm2
check "pm2 responds" pm2 ping

pm2_systemd=""
if [[ -d /etc/systemd/system ]]; then
  pm2_systemd="$(find /etc/systemd/system -maxdepth 1 -name 'pm2*.service' -print -quit 2>/dev/null || true)"
fi
if [[ -n "${pm2_systemd}" ]]; then
  check "pm2 systemd unit present" test -f "${pm2_systemd}"
  if command -v systemctl >/dev/null 2>&1; then
    unit_name="$(basename "${pm2_systemd}")"
    if systemctl is-enabled --quiet "${unit_name}" 2>/dev/null; then
      echo "OK  pm2 unit enabled at boot (${unit_name})"
    else
      echo "WARN ${unit_name} exists but is not enabled; run: sudo systemctl enable ${unit_name}" >&2
      fail=1
    fi
  fi
else
  echo "WARN No /etc/systemd/system/pm2*.service found. Run: pm2 startup (as root) and pm2 save." >&2
  fail=1
fi

echo "== NurseNest process (optional)"
if pm2 describe nursenest-core >/dev/null 2>&1; then
  if command -v jq >/dev/null 2>&1; then
    check "nursenest-core online" bash -c '[[ "$(pm2 jlist | jq -r ".[] | select(.name==\"nursenest-core\") | .pm2_env.status" | head -1)" == "online" ]]'
  else
    check "nursenest-core online" bash -c 'pm2 describe nursenest-core 2>/dev/null | grep -qi online'
  fi
else
  echo "SKIP nursenest-core not in PM2 yet (deploy first)"
fi

if [[ "${fail}" -ne 0 ]]; then
  echo "" >&2
  echo "Fix persistence: sudo bash -c 'env PATH=\$PATH pm2 startup systemd -u \$(logname 2>/dev/null || echo \$USER) --hp \$HOME' then follow printed instructions, then pm2 save." >&2
  exit 1
fi

echo "All boot persistence checks passed."
