# Allied Health E2E screenshots

PNG artifacts are gitignored. Generate via:

```bash
cd nursenest-core
CI=1 npx playwright test tests/e2e/public/allied-health-hubs.spec.ts --project=chromium --workers=1
```

Outputs include:

- `allied-hub-desktop-ocean.png`, `allied-hub-mobile-ocean.png`, `allied-hub-mobile-midnight.png` (occupation chooser)
- Per profession in `SCREENSHOT_PROFESSION_KEYS`: `allied-{key}-desktop-{ocean|midnight|blossom}.png`, `allied-{key}-mobile-{ocean|midnight}.png`
