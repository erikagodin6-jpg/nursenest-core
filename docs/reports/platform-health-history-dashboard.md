# Platform Health History Dashboard

**Generated:** 2026-06-01  
**Sprint:** Platform Health History  
**Routes:** `/admin/platform-health/history` · `GET /api/admin/platform-health/history`

---

## What Was Built

Extended the platform-health dashboard from point-in-time snapshot monitoring to multi-window trend monitoring. No new external dependencies added. All historical data is stored in infrastructure that already existed.

---

## Architecture: How History Is Collected

### Collection trigger

Snapshots are recorded **passively** when an admin loads `/admin/platform-health` or calls `GET /api/admin/platform-health`. The recorder is fire-and-forget (`void` call) and never delays the response.

### Two storage tiers

| Tier | Storage | Granularity | Lifetime | Cross-deploy? |
|------|---------|------------|---------|--------------|
| Hot (recent) | In-process ring buffer (`trend-analytics.ts`) | Every page load (unbounded frequency) | Process lifetime only | ❌ Resets on deploy |
| Durable | `FeatureHealthSnapshot` DB table | Max 1 write per feature per 5 minutes | Indefinitely | ✅ Survives deploys |

### Metric IDs recorded

| Metric ID | Value | Storage |
|-----------|-------|---------|
| `infra.db.latency_ms` | DB probe latency in ms | Ring buffer |
| `infra.db.reachable` | 1 = reachable, 0 = failed | Ring buffer |
| `infra.redis.reachable` | 1 = reachable, 0 = not | Ring buffer |
| `infra.redis.misconfigured` | 1 = misconfigured, 0 = ok | Ring buffer |
| `infra.ratelimit.fallback_events` | Running total since process start | Ring buffer |
| `infra.ratelimit.bucket_count` | Current in-process bucket count | Ring buffer |
| `infra.errors.critical_routes` | Critical route error count (last 1h) | Ring buffer |
| `infra.errors.fallback_delivery` | Fallback delivery count (last 1h) | Ring buffer |
| `infra.db.readiness` | DB score + status + p95 latency | DB (5-min rate-limit) |
| `infra.redis.primary` | Redis score + status | DB (5-min rate-limit) |
| `infra.ratelimit.fallback` | Fallback event count + bucket % | DB (5-min rate-limit) |

---

## New Files

| File | Purpose |
|------|---------|
| `src/lib/admin/platform-health-recorder.ts` | Records snapshots to ring buffer + DB on each health check |
| `src/app/api/admin/platform-health/history/route.ts` | JSON API — history data for all five phases |
| `src/app/(admin)/admin/platform-health/history/page.tsx` | Admin dashboard — all five trend phases |

## Modified Files

| File | Change |
|------|--------|
| `src/app/api/admin/platform-health/route.ts` | Wired recorder — fires `recordPlatformHealthSnapshot` on every call |

---

## Phase 1 — Database Trends

**Page section:** "Database Trends"  
**Data:** `FeatureHealthSnapshot` rows with `featureId = "infra.db.readiness"` + ring buffer

Displays:
- Trend direction chip (↑ Improving / → Stable / ↓ Declining) from ring buffer
- 7-day moving average latency
- % change vs baseline
- Unicode sparkline (▁▂▃▄▅▆▇█) from ring buffer latency values
- 7-day sparkline from DB snapshot latencies
- Per-window breakdown (last hour / 24h / 7d):
  - Average latency
  - Uptime %
  - Incident count
  - Slow-probe count (> 2 s)
  - Snapshot count

**Alert coloring:** > 2 s = amber, > 4 s = red on latency rows.

---

## Phase 2 — Redis Trends

**Page section:** "Redis Trends"  
**Data:** `FeatureHealthSnapshot` rows with `featureId = "infra.redis.primary"` + ring buffer

Scoring:
- 100 = reachable (healthy)
- 50 = unavailable / not configured (degraded)
- 0 = unreachable / misconfigured (critical)

Displays:
- Trend direction chip
- Unicode sparkline (reachability 1/0 values from ring buffer)
- Per-window (24h / 7d):
  - Uptime %
  - Reachable / unavailable / outage snapshot counts
  - Total snapshot count

---

## Phase 3 — Rate Limiting Trends

**Page section:** "Rate Limiting Trends"  
**Data:** `FeatureHealthSnapshot` rows with `featureId = "infra.ratelimit.fallback"` + ring buffer

Score field = cumulative fallback event count at snapshot time.  
Error rate field = bucket fill % (bucketCount / 2000 capacity).

Displays:
- Trend direction chip
- Current fallback event count
- Unicode sparkline from ring buffer
- Per-window (24h / 7d):
  - Snapshots where fallback was active (score > 0)
  - Peak fallback event count
  - Peak bucket usage %
  - Total snapshot count

---

## Phase 4 — Error Trends

**Page section:** "Error Trends"  
**Data:** `critical_route_errors` table + `fallback_delivery_events` table (live counts) + ring buffer

Error counts queried live from production tables. Ring buffer tracks the count-per-period as recorded by the health recorder.

Displays:
- Trend direction chip for critical route errors
- Unicode sparkline of error counts from ring buffer
- Table with counts for last-hour / 24h / 7d:
  - Critical route errors (red when > 0)
  - Fallback delivery events (amber when > 10)

---

## Phase 5 — Operational Summary

**Page section:** "Operational Summary" (appears first — most important)  
**Data:** Aggregated from all DB snapshot rows

Two summary cards — Today/24h and Last 7d — each showing:

| Metric | Source | Alert color |
|--------|--------|------------|
| DB uptime % | `uptimePct(rows)` | Amber if < 100% |
| DB incidents | `incidentCount(rows)` | Red if > 0 |
| Redis uptime % | `uptimePct(rows)` | Amber if < 100% |
| RL fallback snapshots | Count where score > 0 | Amber if any |
| Slow DB periods (> 2 s) | Count where p95 > 2000 | Amber if any |
| Redis outages | Count where status = "critical" | Red if any |
| Critical errors | `critical_route_errors` count | Displayed |
| Fallback deliveries | `fallback_delivery_events` count | Displayed |

---

## Answering the Success Criteria

| Question | How answered |
|----------|-------------|
| When did a problem start? | DB snapshot timestamps show exactly when status changed from "healthy" to "degraded"/"critical". Ring buffer shows high-resolution within the current process. |
| How often does it occur? | Incident counts across windows (last hour / 24h / 7d). Uptime % shows recurrence. |
| Is it improving or worsening? | Trend direction chips (↑/→/↓) from `analyzeTrend()` compare current value vs baseline and compute % change. |

---

## Limitations and Expectations

### First load: no history yet

If `/admin/platform-health` has never been loaded (fresh deployment), `FeatureHealthSnapshot` has zero rows. The history page shows a "no historical snapshots yet" notice with instructions. After a few admin page loads, data begins accumulating.

### Ring buffer resets on deploy

The in-process ring buffer (`trend-analytics.ts`) stores up to 500 data points per metric but is cleared on process restart. After a deploy, the ring buffer is empty and trend direction shows "insufficient-data" until re-populated. DB snapshots are unaffected.

### Passive collection only

Snapshots are only recorded when an admin loads the platform-health page. There is no background cron. For continuous history coverage, an admin should load the page periodically, or a future cron job can call the API.

### 5-minute write rate limit

The DB writer skips writes within 5 minutes of the last write per `featureId`. This prevents row explosion if admins reload the page repeatedly. The ring buffer records every load.

---

## Adding to Admin Navigation

Add a "History" link to the platform-health page header and to the admin sidebar:

```tsx
// In /admin/platform-health/page.tsx header:
<a href="/admin/platform-health/history">View trends →</a>

// In admin sidebar nav (alongside /admin/reliability):
{ href: "/admin/platform-health", label: "Platform Health" },
{ href: "/admin/platform-health/history", label: "Health History" },
```
