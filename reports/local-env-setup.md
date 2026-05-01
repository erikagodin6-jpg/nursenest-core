# Local Env Setup

DigitalOcean app-level environment variables do not automatically appear in an SSH session or a Cursor terminal on the VM. If you need local CLI access to database-backed scripts, load the variables into your shell explicitly.

## Safe local workflow

1. Put the needed local variables in `nursenest-core/.env.local` on the VM.
2. Do not commit that file.
3. Load the file into your current shell:

```bash
source ../scripts/load-local-env.sh
```

4. Check only set/missing status, never values:

```bash
npm run env:check
```

5. Run the DB-backed task after the variables are loaded:

```bash
npm run blog:audit:hidden:db
```

## Notes

- `nursenest-core/.env.local` is ignored by git in this repo.
- `scripts/load-local-env.sh` only reports set/missing status for required variables.
- `scripts/check-required-env.mjs` reports only `set` or `missing` for:
  - `DATABASE_URL`
  - `DIRECT_URL`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`
- Never paste secret values into commits, docs, or terminal screenshots.
