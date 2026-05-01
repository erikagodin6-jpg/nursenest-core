# Blog generation → publish pipeline (canonical)

## Source of truth

- **Future Cursor-generated blogs may be written as draft files** (JSON, markdown with frontmatter, HTML, or batch manifests). Those files are **not** live and are **not** read by learners, SEO, or the admin UI.
- **The only live publish step** is materializing content into the **`BlogPost` Prisma model** via the canonical script below.
- **Admin editor, public `/blog` pages, scoped nursing/allied blog hubs, and sitemap** must continue to read **`BlogPost`** only (existing queries and routes). Do not wire public routes to generator artifacts.

## Canonical script

| Script | Purpose |
|--------|---------|
| `nursenest-core/scripts/blog/publish-generated-blog-post.mts` | Validate, normalize, optional DB write, optional canonical publish |

Library helpers live in `nursenest-core/src/lib/blog/generated-blog-post-publish.ts`. Canonical publish transitions use `publishBlogPostCanonical` from `publish-blog-post-canonical.ts`.

## Flags (defaults are safe)

| Flag | Behavior |
|------|----------|
| *(default)* / `--dry-run` | Validate and print JSON results; **no database writes** |
| `--apply` | Create or update `BlogPost` as **draft / review** (`NEEDS_REVIEW`, `NEEDS_SEO_REVIEW`) unless publishing |
| `--publish` | Only valid with `--apply`. After validation, sets row **live** via canonical publish (`postStatus` / `workflowStatus` / `publishAt`) |
| `--input=<path>` | JSON file, markdown/HTML with `---` frontmatter, directory of those files, or manifest-style JSON (`posts: []`) |
| `--slug=<slug>` | Select one row from a multi-post JSON file **or** provide slug with CLI body mode |
| `--title=` / `--excerpt=` / `--body-file=` | CLI-only mode when no `--input` (all required together with `--slug`) |
| `--source=cursor\|batch\|manual\|legacy` | Provenance segment in `legacySource` |
| `--update-existing` | Allow updating an existing row by slug |
| `--allow-published-update` | Required **with** `--update-existing` to touch rows that are already **live** |
| `--limit=N` | Cap rows processed (directories and multi-object JSON) |

**Never auto-publish:** there is no path that sets `PUBLISHED` without **`--apply --publish`**.

## Commands (from `nursenest-core/`)

Use npm wrappers:

```bash
cd nursenest-core
npm run blog:publish-generated:dry-run -- --input=./path/to/post.json --source=cursor
npm run blog:publish-generated -- --apply --input=./path/to/post.json --source=cursor
```

Or `npx tsx` directly:

### Dry-run one file

```bash
cd nursenest-core
npx tsx scripts/blog/publish-generated-blog-post.mts --dry-run --input=./drafts/my-post.json --source=cursor
```

### Import one file as draft (review)

```bash
cd nursenest-core
npx tsx scripts/blog/publish-generated-blog-post.mts --apply --input=./drafts/my-post.json --source=cursor
```

### Publish one reviewed post (explicit)

```bash
cd nursenest-core
npx tsx scripts/blog/publish-generated-blog-post.mts --apply --publish --input=./drafts/my-post.json --source=manual
```

### Bulk dry-run a folder

```bash
cd nursenest-core
npx tsx scripts/blog/publish-generated-blog-post.mts --dry-run --input=./drafts/batch-folder --source=batch --limit=50
```

### Bulk import as drafts

```bash
cd nursenest-core
npx tsx scripts/blog/publish-generated-blog-post.mts --apply --input=./drafts/batch-folder --source=batch --limit=50
```

### Pick one slug from a multi-post JSON manifest

```bash
cd nursenest-core
npx tsx scripts/blog/publish-generated-blog-post.mts --dry-run --input=./manifest.json --slug=my-unique-slug --source=batch
```

### CLI-only row (no `--input`)

```bash
cd nursenest-core
npx tsx scripts/blog/publish-generated-blog-post.mts --dry-run \
  --slug=my-slug \
  --title="My title" \
  --excerpt="Long enough excerpt for validation rules." \
  --body-file=./body.html \
  --source=cursor
```

**`DATABASE_URL`** is required for `--apply` (and therefore for `--publish`).

## Validation gates (summary)

- Required: `title`, `slug`, `excerpt` (minimum length), `body`
- Body word count ≥ **`BLOG_ARTICLE_MIN_WORDS`** (see `blog-word-count.ts`)
- SEO: `seoTitle` / `seoDescription` generated from title/excerpt when omitted
- Duplicate slug: **skip** unless `--update-existing`
- Published rows: no overwrite unless **`--update-existing --allow-published-update`**
- Taxonomy: blog corpus classification must pass shared taxonomy validation

## Provenance

Imported rows set **`legacySource`** (or preserve existing non-empty value) to a compact string including **`cursor-generated`**, `--source`, absolute input path, and `generatedAt` ISO timestamp.

## After write

When `--apply` runs, the script re-reads the row, checks visibility vs intent (`blogPostIsLive`), records the expected public path (`/blog/<slug>` or scoped hub path when `careerSlug` is set), and checks sitemap-style eligibility for published posts.

## npm scripts

| Script | Command |
|--------|---------|
| `blog:publish-generated` | `npx tsx scripts/blog/publish-generated-blog-post.mts` |
| `blog:publish-generated:dry-run` | Same with `--dry-run` |

Tests: `npm run test:blog-recovery` includes `generated-blog-post-publish.test.ts`.
