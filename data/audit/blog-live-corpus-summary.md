# Blog live corpus summary

Generated: 2026-04-15T02:12:35.443Z

## Prisma export status
- Database available for export: **no**
- Query failed: **yes**
- Published `BlogPost` rows exported (live visibility): **0**
- `LocalizedBlogArticle` rows exported (live visibility): **0**

## Reconciliation
- Repo inventory slugs overlapping DB `BlogPost` slugs: **0**
- `BlogPost` slugs not present in repo slug inventory (DB-only from export): **0**
- Localized slugs appearing more than once (different region/locale): **0** distinct slugs

## Confirmed live definition
- A slug is **confirmed live** only if it appears in `blog-published-export.json` posts[] or `blog-localized-export.json` articles[] (DB evidence).

## Top 10 rewrite targets (confirmed `BlogPost` live)
- *(No BlogPost rows in export — run export with DATABASE_URL or check query errors.)*

## Safest editing workflow
- Use existing admin/blog studio flows that update `BlogPost` by id; avoid raw production SQL.
- Do not change `slug` without redirects — prefer body/SEO field upgrades.
- Localized variants: edit `LocalizedBlogArticle` linked by `canonicalArticleId`.

## Limitations
- Export is point-in-time; scheduled posts depend on `blogLiveWhere` at export time.
- Repo inventory is heuristic extraction — not identical to sitemap.xml.
- Full-repo TypeScript errors unrelated to these scripts may still exist.
