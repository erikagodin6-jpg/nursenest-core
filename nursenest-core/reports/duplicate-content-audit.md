# Phase 4 — Duplicate Content Audit
Generated: 2026-05-30

---

## Duplicate Risk Areas

### 1. US vs Canada NCLEX-RN Pages

**Risk Level: MEDIUM**

| Page pair | US | CA | Canonical handling |
|---|---|---|---|
| RN hub | `/us/rn/nclex-rn` | `/canada/rn/nclex-rn` | ✅ Hreflang `en-US` / `en-CA` |
| Lessons hub | `/us/rn/nclex-rn/lessons` | `/canada/rn/nclex-rn/lessons` | ✅ Separate canonical per page |
| Questions hub | `/us/rn/nclex-rn/questions` | `/canada/rn/nclex-rn/questions` | ✅ Same pattern |
| Pricing | `/us/rn/nclex-rn/pricing` | `/canada/rn/nclex-rn/pricing` | ✅ Same pattern |

**Key differentiators that avoid duplication:**
- US hub content uses `US_HOMEPAGE` registry (different headline, CTAs)
- US hub metadata specifies `"NCLEX-RN (United States)"` in title
- Hreflang signals tell Google these are regional variants, not duplicates
- The US `seoTitle` now explicitly says "NCLEX-RN Practice Questions, Lessons & CAT Exam Prep" vs CA's "NCLEX-RN Exam Prep Canada"

**Status: HANDLED** — hreflang + distinct content prevents duplicate penalty.

---

### 2. Locale-Prefixed Pages (`/fr/us/rn/nclex-rn` etc.)

**Risk Level: LOW**

Locale-prefixed variants of US pages are either:
- Redirected to the canonical English URL (for `en-` locales)
- Noindexed with a `preview` or `incomplete` locale tier
- Not generated at all for locales without routing support

**Status: HANDLED** — locale noindex or redirect in place.

---

### 3. Query Parameter Duplicates

**Risk Level: HIGH**

| Parameter | Example | Pages affected |
|---|---|---|
| `?ref=` | `/us/rn/nclex-rn?ref=abc` | Any marketing page with referral links |
| `?pathwayId=` | `/us/rn/nclex-rn?pathwayId=us-rn-nclex-rn` | Pathway hub pages |
| `?checkout=cancelled` | `/pricing?checkout=cancelled` | Pricing page |
| `?friendCode=` | `/signup?friendCode=xyz` | Signup page |

**These are the root cause of the 370 "Duplicate without canonical" GSC entries.**

**Fix:** Strip tracking/state params in canonical generation:
```typescript
// In safeGenerateMetadata or per-page canonical resolution
const CANONICAL_STRIP_PARAMS = ["ref", "friendCode", "checkout", "pathwayId", "campaign"];
const url = new URL(absoluteUrl(pathname));
CANONICAL_STRIP_PARAMS.forEach(p => url.searchParams.delete(p));
const canonical = url.toString();
```

---

### 4. Lesson Pages — US vs CA Same Content

**Risk Level: MEDIUM**

Individual lesson pages (`/us/rn/nclex-rn/lessons/heart-failure`) and (`/canada/rn/nclex-rn/lessons/heart-failure`) share the same content. These are different URLs serving the same lesson body.

**Current handling:** Each has a self-referencing canonical. Google may see these as duplicates.

**Mitigation (already in place):**
- URL path includes country slug (signals regional variant)
- Hreflang pairs US↔CA lesson pages via `topicLongtailHreflang()` in `exam-pathway-hub-alternates.ts`

**Status: PARTIALLY HANDLED** — hreflang is the primary signal. For high-value lesson pages, add a paragraph of US-specific context (e.g., "For US RN candidates, this topic appears frequently in NCLEX-RN clinical judgment questions").

---

### 5. Question Bank vs Individual Practice Pages

**Risk Level: LOW**

`/us/rn/nclex-rn/questions` is the canonical question bank hub. Individual filtered URLs (`/us/rn/nclex-rn/questions?topic=cardiac`) are noindexed (confirmed in code). No duplication risk.

---

### 6. Programmatic SEO Overlap

**Risk Level: LOW**

`/nclex-rn-practice-questions` and `/us/rn/nclex-rn` both target NCLEX-RN. These serve different search intents:
- `/nclex-rn-practice-questions` — informational/comparison landing page
- `/us/rn/nclex-rn` — product hub with full pathway features

**Canonical:** Each has self-referencing canonical. The programmatic page links TO the hub, not the other way, so they form a funnel rather than competing.

---

## Action Items

| Issue | Severity | Fix |
|---|---|---|
| `?ref=` / `?pathwayId=` duplicate URLs | HIGH | Strip params in canonical generation |
| US lesson pages near-duplicate CA lessons | MEDIUM | Add US-specific paragraph to top lesson pages |
| Monitor GSC "Duplicate" count after canonical fix | HIGH | Check weekly in GSC |
