# DigitalOcean 403 Resolution Report

Generated: 2026-06-01

## Verdict

**UNRESOLVED / BLOCKED**

DigitalOcean read permissions work, but write operations required for recovery are rejected with HTTP 403. The authenticated DigitalOcean account is reported as `locked`, which explains why App Platform scaling, restart, and deployment mutation calls fail.

## Account / Ownership Evidence

Authenticated account:

| Field | Value |
|---|---|
| User email | `erikagodin6@gmail.com` |
| Team | `My Team` |
| User UUID | `b842d9e1-8375-4841-8384-986de20b2e15` |
| Status | `locked` |
| Email verified | `true` |

Project:

| Field | Value |
|---|---|
| Project ID | `2e82f484-8a4e-4c1d-b3c3-c8d4c8183726` |
| Project name | `first-project` |
| Owner UUID | `3ed0b3d0-d6c2-45d8-a5e6-488fea11ddc5` |
| Owner ID | `35062022` |

App:

| Field | Value |
|---|---|
| App ID | `d6a4b825-4d70-4dd4-8d71-04b354d36f43` |
| App name | `nursenest-core-next` |
| Active deployment | `2a9127f6-689b-441a-8cc1-855fdea70b92` |
| Default ingress | `https://nursenestcore-njhcf.ondigitalocean.app` |

## Permission Matrix

| Operation | Result |
|---|---|
| `doctl account get` | PASS |
| `doctl projects list` | PASS |
| `doctl apps get` | PASS |
| `doctl apps spec get` | PASS |
| `doctl apps list-deployments` | PASS |
| `doctl apps restart` | FAIL: HTTP 403 |
| `doctl apps create-deployment` | FAIL: HTTP 403 |
| `doctl apps update` | FAIL: HTTP 403 |

## Exact Failing Calls

Restart:

```text
POST /v2/apps/d6a4b825-4d70-4dd4-8d71-04b354d36f43/restart
HTTP 403 forbidden
request id: 7b82a0d7-7915-4ee1-bcfd-c496f9d1dd1d
```

Create deployment:

```text
POST /v2/apps/d6a4b825-4d70-4dd4-8d71-04b354d36f43/deployments
HTTP 403 forbidden
request id: 009d5ac0-c2bd-4eb4-8672-ff79de3bf91c
```

Update app spec:

```text
PUT /v2/apps/d6a4b825-4d70-4dd4-8d71-04b354d36f43
HTTP 403 forbidden
```

## Root Cause

The authenticated DigitalOcean account status is `locked`. This is consistent with:

- read calls succeeding
- write calls failing
- restart/deploy/update all returning 403

This is not a local code issue, not a build issue, and not an App Platform spec syntax issue.

## Resolution Required

Before production can be recovered:

1. Unlock the DigitalOcean account/team.
2. Confirm billing/team status allows App Platform mutations.
3. Confirm the active token has write permission for App Platform.
4. Re-run:

```text
doctl apps update ...
doctl apps create-deployment ...
doctl apps restart ...
```

## Success Criteria

This report remains unresolved until:

- `doctl account get` no longer reports `Status: locked`
- `doctl apps update` succeeds
- `doctl apps create-deployment` succeeds
- `doctl apps restart` succeeds

