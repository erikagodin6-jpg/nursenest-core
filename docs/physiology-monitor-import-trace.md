# Physiology Monitor — Client Import Trace

Investigation date: 2026-05-29  
Entry point: `src/app/(app)/app/(learner)/physiology-monitor/physiology-monitor-client.tsx`

## Root cause (pre-fix)

The build failed with:

```
the chunking context does not support external modules
(request: node:fs)
```

**Offending chain:**

```
physiology-monitor-client.tsx
  → @/lib/physiology-monitor/simulation-conversion-events.ts
    → @/lib/observability/posthog-server.ts
      → posthog-node (npm)
        → node:fs
```

`simulation-conversion-events.ts` mixed client (`trackSimulationEventClient`) and server (`trackSimulationEvent`) in one module. Turbopack bundled the entire module for the client because of the top-level `import { captureServerEvent } from posthog-server`, which pulled `posthog-node` and its Node built-in dependencies into the client graph.

## Direct imports from physiology-monitor-client.tsx

| Import | Module | Client-safe? |
|--------|--------|--------------|
| `trackSimulationEventClient` | `simulation-conversion-events` | **NO (pre-fix)** — fixed via `.client.ts` split |
| `MonitorWorkstation` | `@/components/physiology-monitor/monitor-workstation` | Yes |
| `MonitorSessionReport` | `@/components/physiology-monitor/monitor-session-report` | Yes |
| `MonitorEngine` | `@/lib/physiology-monitor/monitor-engine` | Yes |
| `buildSessionReport` | `@/lib/physiology-monitor/monitor-session-report` | Yes |
| `DETERIORATION_PATTERNS` | `@/lib/physiology-monitor/deterioration-patterns` | Yes |

## Full dependency tree (pre-fix, server leak highlighted)

```
physiology-monitor-client.tsx  ["use client"]
├── react (useState, useRef, useCallback)
├── simulation-conversion-events.ts  ⚠️ SERVER LEAK
│   └── posthog-server.ts
│       ├── posthog-node → node:fs, node:path, node:crypto, …
│       └── posthog-distinct-id.ts
├── monitor-workstation.tsx  ["use client"]
│   ├── patient-monitor-display.tsx
│   │   ├── ecg-live-strip.tsx
│   │   │   └── ecg-waveform-generator.ts
│   │   ├── ecg-bridge.ts
│   │   ├── ventilator-waveform-live.tsx → ventilator-physiology.ts
│   │   └── physiology-state.ts, profession-views.ts, deterioration-patterns.ts
│   ├── trend-panel.tsx → monitor-engine.ts, physiology-state.ts
│   ├── intervention-panel.tsx → intervention-catalog.ts
│   └── monitor-engine.ts
│       ├── physiology-state.ts
│       ├── deterioration-patterns.ts
│       └── intervention-catalog.ts
├── monitor-session-report.tsx  ["use client"]
│   ├── monitor-session-report.ts (data)
│   │   ├── clinical-judgment-engine.ts
│   │   ├── harm-index.ts
│   │   ├── monitor-competency-tracker.ts
│   │   └── adaptive-remediation.ts
│   └── type-only imports (safe)
├── monitor-engine.ts (direct ref for MonitorEngine class)
├── monitor-session-report.ts (buildSessionReport)
└── deterioration-patterns.ts
```

No other branch under this client entry imported `node:fs`, Prisma, or filesystem helpers.

## Server-only modules audited (not reachable after fix)

These exist elsewhere in the physiology-monitor ecosystem but were **not** in the client import graph:

- `simulation-catalog.ts`, `learner-profile.ts`, `institutional-analytics.ts` — used by server pages/dashboards
- Prisma / DB access — only in `page.tsx`, API routes, simulation-center server loader
- Content loaders / markdown / lesson index — not imported by monitor client path

## Fix applied

Split simulation conversion events into explicit boundaries (mirrors `oauth-config-env` / `oauth-config.server`):

| File | Role |
|------|------|
| `simulation-conversion-events.types.ts` | Shared types only |
| `simulation-conversion-events.client.ts` | `trackSimulationEventClient` — fetch to API, no server imports |
| `simulation-conversion-events.server.ts` | `trackSimulationEvent` — PostHog server capture |
| `simulation-conversion-events.ts` | Server re-export barrel (types + server fn) |

**Client import updated:**

```ts
import { trackSimulationEventClient } from "@/lib/physiology-monitor/simulation-conversion-events.client";
```

## Post-fix client-safe chain

```
physiology-monitor-client.tsx
  → simulation-conversion-events.client.ts
    → simulation-conversion-events.types.ts  ✓ (types only)
  → monitor-workstation.tsx → … (pure TS/React simulation libs)
  → monitor-session-report.tsx → scoring engines (pure TS)
  → monitor-engine.ts, monitor-session-report.ts, deterioration-patterns.ts
```

No `node:fs`, `posthog-node`, or `@prisma/client` in the client graph.

## Regression protection

`src/app/(app)/app/(learner)/physiology-monitor/physiology-monitor-client-boundary.test.ts` walks the import graph from the client entry and fails if forbidden server modules appear.

Run:

```bash
cd nursenest-core
node --import tsx --test "src/app/(app)/app/(learner)/physiology-monitor/physiology-monitor-client-boundary.test.ts"
```
