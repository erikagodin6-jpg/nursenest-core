# Origin Scale-Up Report

Generated: 2026-06-01

## Verdict

**BLOCKED**

Production cannot be scaled until the DigitalOcean 403 permission issue is resolved.

## Current Production Shape

| Component | Instance Size | Instance Count | Scaling |
|---|---|---:|---|
| `web` | `basic-s` | 1 | single instance only |

This shape is insufficient for current public route volume and crawl pressure.

## Required Minimum Target

| Component | Instance Size | Instance Count | Scaling |
|---|---|---:|---|
| `web` | `apps-s-1vcpu-2gb` | 2 | fixed two instances |

Expected improvement:

- removes single-instance availability risk
- gives App Platform at least one healthy peer during deploys/restarts
- roughly doubles request handling capacity at the same memory class
- enables meaningful 500/1000 URL crawl validation

## Preferred Launch-Safe Target

| Component | Instance Size | Instance Count | Scaling |
|---|---|---:|---|
| `web` | `apps-s-2vcpu-4gb` | 2 | fixed two instances |

Expected improvement:

- more CPU headroom for Next route rendering
- more memory headroom during concurrent public crawl bursts
- lower risk of event-loop and DB-pool saturation
- better fit for 7,000+ public URLs

## Autoscaling

Autoscaling was not enabled because the minimum fixed scale update could not be applied. After DigitalOcean write access is restored, autoscaling support should be tested against the App Platform spec schema.

Recommended policy if supported:

```text
min_instance_count: 2
max_instance_count: 4
cpu_percent: 60-70
```

## Attempted Change

Prepared target spec:

```text
web.instance_size_slug = apps-s-1vcpu-2gb
web.instance_count = 2
```

Result:

```text
PUT /v2/apps/d6a4b825-4d70-4dd4-8d71-04b354d36f43
HTTP 403 forbidden
```

## Status

No production scale-up was applied.

Capacity validation must not continue until:

- the account is unlocked
- app spec update succeeds
- two web instances are healthy

