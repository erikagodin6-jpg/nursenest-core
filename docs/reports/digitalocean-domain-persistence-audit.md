# DigitalOcean Domain Persistence Audit

Date: 2026-05-12

## Summary

Most likely cause: production DigitalOcean App Platform domain state was being reconciled from repository app specs that did not include a `domains:` block. When an App Platform app is updated from a spec, the spec is the desired state; a repo spec that omits custom domains can overwrite dashboard/UI-attached domain settings during future app-spec updates or large deploy restructuring.

The production repo specs now preserve:

```yaml
domains:
  - domain: nursenest.ca
    type: PRIMARY
  - domain: www.nursenest.ca
    type: ALIAS
```

The domain schema was verified against a read-only live export from DigitalOcean App Platform. The exported spec uses a top-level `domains:` array with `domain` and `type` fields.

## Where Domain Config Is Managed

Primary production spec:

- `.do/app-nursenest-core-next.yaml`

Additional tracked App Platform specs that now carry the same domain block:

- `.do/app.yaml` (legacy deploy config; not the active production spec)
- `nursenest-core/.do/app.yaml`

CI guardrail:

- `scripts/verify-digitalocean-domain-persistence.mjs`
- `.github/workflows/verify-build.yml`
- root `package.json` script: `npm run verify:do-domains`

## Live Spec Evidence

Read-only command run:

```bash
doctl apps spec get d6a4b825-4d70-4dd4-8d71-04b354d36f43 > /tmp/nursenest-live-app-spec.yaml
```

Observed live domain block at audit time:

```yaml
domains:
- domain: www.nursenest.ca
  type: PRIMARY
```

That means the live app currently protects `www.nursenest.ca`, but it does not match the desired canonical production mapping of root `nursenest.ca` as `PRIMARY` and `www.nursenest.ca` as `ALIAS`.

## Can Deploys Overwrite UI-Attached Domains?

Yes, if an App Platform update is driven by a repository spec that omits custom domains. The active spec has `github.deploy_on_push: true`; if that spec or a future `doctl apps update --spec ...` path becomes the source of truth without a domain block, DigitalOcean can reconcile the app back to the spec state and drop dashboard-only domain changes.

This audit found no tracked workflow that runs `doctl apps update` or `doctl apps create`. The repo does, however, contain tracked App Platform specs and deploy-on-push configuration, so the durable fix is to keep the production domains in the specs and fail CI when they disappear.

## Files Inspected

DigitalOcean/App Platform specs:

- `.do/app-nursenest-core-next.yaml`
- `.do/app.yaml`
- `nursenest-core/.do/app.yaml`
- `.worktrees/premium-convergence-baseline/.do/app.yaml`
- `.worktrees/premium-convergence-baseline/.do/app-nursenest-core-next.yaml`
- `.worktrees/rpn-launch-readiness/.do/app.yaml`
- `.worktrees/rpn-launch-readiness/.do/app-nursenest-core-next.yaml`
- `.worktrees/np-100-launch/.do/app.yaml`
- `.worktrees/np-100-launch/.do/app-nursenest-core-next.yaml`

Deploy and CI paths:

- `.github/workflows/build-and-push-ghcr.yml`
- `.github/workflows/i18n-readiness.yml`
- `.github/workflows/internal-links-audit.yml`
- `.github/workflows/marketing-study-production-smoke.yml`
- `.github/workflows/mobile-eas.yml`
- `.github/workflows/nav-i18n-validate.yml`
- `.github/workflows/prisma-migrate.yml`
- `.github/workflows/production-public-health-watch.yml`
- `.github/workflows/production-reliability-check.yml`
- `.github/workflows/repo-hygiene.yml`
- `.github/workflows/scheduled-cron-content-completion-weekly.yml`
- `.github/workflows/scheduled-cron-http-frequent.yml`
- `.github/workflows/scheduled-cron-stripe-daily.yml`
- `.github/workflows/storage-guardrails.yml`
- `.github/workflows/verify-build.yml`
- `.github/workflows/weekly-static-audits.yml`
- `package.json`
- `nursenest-core/package.json`
- `scripts/verify-digitalocean-runtime.mjs`
- `scripts/verify-deploy-image.mjs`
- `README.md`

## Protection Status

- `nursenest.ca`: protected in tracked production App Platform specs and CI guardrail.
- `www.nursenest.ca`: protected in tracked production App Platform specs and CI guardrail.
- Secrets: not printed, removed, rotated, or rewritten.
- Deployment: not run.

## Future Infra Change Procedure

Before any future App Platform spec edit, export the live app spec and compare it to the repo spec:

```bash
doctl apps list --format ID,Spec.Name,DefaultIngress
doctl apps spec get <PRODUCTION_APP_ID> > /tmp/nursenest-live-app-spec.yaml
diff -u /tmp/nursenest-live-app-spec.yaml .do/app-nursenest-core-next.yaml
npm run verify:do-domains
doctl apps spec validate .do/app-nursenest-core-next.yaml
```

Do not run `doctl apps update` until the diff preserves `domains:` and secret entries remain presence-only.
