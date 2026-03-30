# Droplet deployment (NurseNest Core)

Read the full guide: **[docs/droplet-migration-plan.md](../../docs/droplet-migration-plan.md)**.

## Quick reference

1. On a fresh Ubuntu Droplet, copy this folder and run:
   ```bash
   sudo bash deploy/droplet/bootstrap-ubuntu.sh
   ```
2. Clone the repository (must include the `shared/` folder and `nursenest-core/` app directory).
3. Copy `env.production.template` to a secure path, fill in secrets, then either:
   - Symlink as `nursenest-core/.env.production`, or
   - Set `NURSE_NEST_ENV_FILE` to that file before `deploy-app.sh`.
4. Edit and install `Caddyfile.example` (replace domain, email).
5. Run:
   ```bash
   export NURSE_NEST_REPO_ROOT=/var/www/nursenest/repo
   bash deploy/droplet/deploy-app.sh
   ```
6. Validate:
   ```bash
   bash deploy/droplet/validate-droplet.sh https://your.domain
   ```

Default app path: `$NURSE_NEST_REPO_ROOT/nursenest-core` (the inner package).
