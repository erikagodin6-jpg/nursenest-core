# ISR Conversion Plan - Marketing Routes

**Total Marketing Force-Dynamic Routes:** 40

## 🟢 **BATCH 1: Regional Hub Pages (ISR - 1 hour revalidation)**
Static marketing content, no user data required.

```
src/app/(marketing)/(default)/australia/[topic]/page.tsx
src/app/(marketing)/(default)/canada/np/cnple/page.tsx
src/app/(marketing)/(default)/canada/rn/nclex-rn/page.tsx
src/app/(marketing)/(default)/china/[topic]/page.tsx
src/app/(marketing)/(default)/france/[topic]/page.tsx
src/app/(marketing)/(default)/germany/[topic]/page.tsx
src/app/(marketing)/(default)/hungary/[topic]/page.tsx
src/app/(marketing)/(default)/india/[topic]/page.tsx
src/app/(marketing)/(default)/italy/[topic]/page.tsx
src/app/(marketing)/(default)/japan/[topic]/page.tsx
src/app/(marketing)/(default)/korea/[topic]/page.tsx
src/app/(marketing)/(default)/mexico/[topic]/page.tsx
src/app/(marketing)/(default)/middle-east/[topic]/page.tsx
src/app/(marketing)/(default)/portugal/[topic]/page.tsx
```
**Count:** 14 routes  
**Action:** Replace `force-dynamic` with `revalidate = 3600`

## 🟢 **BATCH 2: Allied Health Routes (ISR - 30 min revalidation)**
Educational lesson content, tolerates stale data.

```
src/app/(marketing)/(default)/allied-health/[slug]/lessons/[lessonSlug]/page.tsx
src/app/(marketing)/(default)/allied-health/[slug]/lessons/page.tsx
src/app/(marketing)/(default)/allied-health/[slug]/page.tsx
src/app/(marketing)/(default)/allied/[career]/lessons/page.tsx
src/app/(marketing)/(default)/allied/[career]/modules/[moduleSlug]/page.tsx
src/app/(marketing)/(default)/allied/[career]/modules/page.tsx
src/app/(marketing)/(default)/allied/[career]/page.tsx
src/app/(marketing)/(default)/allied/allied-health/page.tsx
src/app/(marketing)/(default)/medical-laboratory-technology/specialty-modules/page.tsx
src/app/(marketing)/(default)/respiratory-therapy/ventilator-training/page.tsx
```
**Count:** 10 routes  
**Action:** Replace `force-dynamic` with `revalidate = 1800`

## 🟢 **BATCH 3: Pathway Hub Pages (ISR - 1 hour revalidation)**
Static pathway landing pages.

```
src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx
src/app/(marketing)/(default)/tools/page.tsx
```
**Count:** 2 routes  
**Action:** Replace `force-dynamic` with `revalidate = 3600`

## 🟡 **BATCH 4: Auth Pages (Client Island Conversion)**
Move auth logic to client-side components.

```
src/app/(marketing)/(default)/login/page.tsx
src/app/(marketing)/(default)/signup/page.tsx
src/app/(marketing)/(default)/reset-password/page.tsx
src/app/(marketing)/(default)/verify-email/page.tsx
```
**Count:** 4 routes  
**Action:** Remove `force-dynamic`, use client-side auth components

## 🔴 **BATCH 5: Requires Review (Keep force-dynamic for now)**
These need session data or real-time state.

```
src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/[exam]/page.tsx
src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx
src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/osce/[stationId]/page.tsx
src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/osce/page.tsx
src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/report-card/page.tsx
src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/simulation/page.tsx
src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/study-resources/[bodyKey]/page.tsx
src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/study/[topicSlug]/page.tsx
src/app/(marketing)/(default)/allied/allied-health/cat/page.tsx
src/app/(marketing)/(default)/pre-nursing/practice/[slug]/page.tsx
```
**Count:** 10 routes  
**Action:** DEFER - needs requirement analysis

---

## Execution Plan

### Phase 1: Convert Batch 1 (Regional Hubs) - 14 routes
```bash
node scripts/batch-convert-to-isr.mjs \
  src/app/\(marketing\)/\(default\)/australia/\[topic\]/page.tsx \
  src/app/\(marketing\)/\(default\)/canada/np/cnple/page.tsx \
  src/app/\(marketing\)/\(default\)/canada/rn/nclex-rn/page.tsx \
  src/app/\(marketing\)/\(default\)/china/\[topic\]/page.tsx \
  src/app/\(marketing\)/\(default\)/france/\[topic\]/page.tsx \
  src/app/\(marketing\)/\(default\)/germany/\[topic\]/page.tsx \
  src/app/\(marketing\)/\(default\)/hungary/\[topic\]/page.tsx \
  src/app/\(marketing\)/\(default\)/india/\[topic\]/page.tsx \
  src/app/\(marketing\)/\(default\)/italy/\[topic\]/page.tsx \
  src/app/\(marketing\)/\(default\)/japan/\[topic\]/page.tsx \
  src/app/\(marketing\)/\(default\)/korea/\[topic\]/page.tsx \
  src/app/\(marketing\)/\(default\)/mexico/\[topic\]/page.tsx \
  src/app/\(marketing\)/\(default\)/middle-east/\[topic\]/page.tsx \
  src/app/\(marketing\)/\(default\)/portugal/\[topic\]/page.tsx
```

### Phase 2: Convert Batch 2 (Allied Health) - 10 routes
```bash
node scripts/batch-convert-to-isr.mjs \
  src/app/\(marketing\)/\(default\)/allied-health/\[slug\]/lessons/\[lessonSlug\]/page.tsx \
  src/app/\(marketing\)/\(default\)/allied-health/\[slug\]/lessons/page.tsx \
  src/app/\(marketing\)/\(default\)/allied-health/\[slug\]/page.tsx \
  src/app/\(marketing\)/\(default\)/allied/\[career\]/lessons/page.tsx \
  src/app/\(marketing\)/\(default\)/allied/\[career\]/modules/\[moduleSlug\]/page.tsx \
  src/app/\(marketing\)/\(default\)/allied/\[career\]/modules/page.tsx \
  src/app/\(marketing\)/\(default\)/allied/\[career\]/page.tsx \
  src/app/\(marketing\)/\(default\)/allied/allied-health/page.tsx \
  src/app/\(marketing\)/\(default\)/medical-laboratory-technology/specialty-modules/page.tsx \
  src/app/\(marketing\)/\(default\)/respiratory-therapy/ventilator-training/page.tsx
```

### Phase 3: Convert Batch 3 (Pathway Hubs) - 2 routes
```bash
node scripts/batch-convert-to-isr.mjs \
  src/app/\(marketing\)/\(default\)/\[locale\]/\[slug\]/\[examCode\]/page.tsx \
  src/app/\(marketing\)/\(default\)/tools/page.tsx
```

---

## Expected Impact

### Before
- Force-dynamic count: 400 (65 in marketing)  
- All marketing requests hit origin
- High server compute cost

### After Batch 1-3 (26 conversions)
- Force-dynamic count: ~374 (-26)  
- 26 routes now cached at CDN
- Origin compute reduced by ~40% for these routes

### After Batch 4 (4 conversions)
- Force-dynamic count: ~370 (-30)
- Auth pages become client-only
- Further origin reduction

### Final State
- Force-dynamic count in marketing: ~35 (down from 65)
- 30 routes converted to ISR/client islands
- Remaining 35 are legitimately dynamic (CAT, practice, etc.)

---

## Success Criteria

- [ ] Batch 1 converted (14 routes)
- [ ] Batch 2 converted (10 routes)
- [ ] Batch 3 converted (2 routes)
- [ ] Force-dynamic audit shows reduction
- [ ] No broken routes
- [ ] TTFB improved for converted routes
- [ ] CDN cache hit rate increased

---

## Rollback Plan

If any conversion causes issues:

```bash
# Revert specific file
git checkout HEAD -- src/app/(marketing)/(default)/path/to/page.tsx

# Or revert entire batch
git log --oneline -10
git revert <commit-hash>
```
