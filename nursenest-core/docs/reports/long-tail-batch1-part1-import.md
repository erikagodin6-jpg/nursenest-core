# Long-tail batch 1 (part 1) — static hybrid import

## Files changed

- `src/content/blog-static-longtail/hyperkalemia-ecg-changes-nursing-students.md` (new)
- `src/content/blog-static-longtail/hypokalemia-pathophysiology-nursing-priorities.md` (new)
- `src/lib/blog/hybrid-blog-static-longtail.contract.test.ts` (unique-slug contract: assert batch1 slugs present)

## Posts

| Title | Slug |
| --- | --- |
| Hyperkalemia ECG Changes Explained for Nursing Students: Symptoms, Treatment, and NCLEX Tips | `hyperkalemia-ecg-changes-nursing-students` |
| Hypokalemia Explained for Nursing Students: Causes, Symptoms, ECG Changes, and Nursing Care | `hypokalemia-pathophysiology-nursing-priorities` |

## Validation / CI commands (cwd: `nursenest-core/`)

| Step | Result | Exit |
| --- | --- | --- |
| `npm run diagnose:blog-slug-collisions -- --write-report` | OK — 0 live DB ∩ supplement slug collisions; report `docs/reports/blog-slug-collision-diagnostic.txt` | 0 |
| `npm run validate:blog-static-longtail` | OK — 12 long-tail file(s) at final validation (folder grows with other batches) | 0 |
| `npm run typecheck:critical` | OK | 0 |
| `npm run test:blog-recovery` | OK (62 tests) | 0 |
| `npm run test:homepage` | OK (78 pass, 1 skip) | 0 |

## Publish semantics (hybrid)

- **DB (CMS)**: Primary source for published posts; on slug collision, **DB wins** and the supplement row is excluded from merge.
- **Static long-tail** (`src/content/blog-static-longtail/*.md`): Treated as published supplement when the file passes `validate:blog-static-longtail` and is deployed with the app. There is **no `draft` field** in the loader/frontmatter contract — content is effectively **live when present and valid** (same pattern as existing POC files).
- **Public URLs** (production): `https://www.nursenest.ca/blog/hyperkalemia-ecg-changes-nursing-students` and `https://www.nursenest.ca/blog/hypokalemia-pathophysiology-nursing-priorities` (and `/blog/<slug>` for the three existing long-tail posts).

## Admin preview

- Static long-tail is **not** a Prisma `BlogPost` row; there is **no CMS “preview”** for these files. Preview by running the Next app locally and opening `/blog/<slug>`.

## Source note

- Full vendor-provided HTML/markdown bodies were **not attached** in the task message; articles were authored in-repo to match the specified titles, slugs, categories, tag lists, required sections (Key Takeaways, internal links, premium CTA, FAQ-style blocks, APA-7 references), and validator rules. Replace body or frontmatter if you have canonical copy to paste.

## Truthpack

- `.vibecheck/truthpack/` was not present in this workspace clone (no `product.json` / `ui-pages.json` read).

## Workspace note

Other untracked `*.md` files may appear under `blog-static-longtail/` from parallel work; this import only adds the two electrolyte posts above. Review `git status` before committing.
