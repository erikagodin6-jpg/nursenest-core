# Physiology Monitor Client Import Trace

Investigation date: 2026-05-30  
Entry point: `src/app/(app)/app/(learner)/physiology-monitor/physiology-monitor-client.tsx`

## Root Cause

The failing build error was:

```text
the chunking context does not support external modules
(request: node:fs)
```

The server-only module reached the client bundle through the simulation analytics helper.

```text
physiology-monitor-client.tsx
  -> @/lib/physiology-monitor/simulation-conversion-events.ts
    -> @/lib/observability/posthog-server.ts
      -> posthog-node
        -> node:fs
```

`simulation-conversion-events.ts` mixed a client helper (`trackSimulationEventClient`) and a server helper (`trackSimulationEvent`) in the same module. Because the module imported `@/lib/observability/posthog-server` at top level, importing the client helper also made Turbopack analyze the server PostHog path. `posthog-node` depends on Node built-ins, including `node:fs`, which cannot be bundled into the browser chunk.

## Direct Client Imports

Current direct imports from `physiology-monitor-client.tsx`:

| Import | Module | Boundary |
| --- | --- | --- |
| `trackSimulationEventClient` | `@/lib/physiology-monitor/simulation-conversion-events.client` | Client-safe fetch wrapper |
| `MonitorWorkstation` | `@/components/physiology-monitor/monitor-workstation` | Client UI |
| `MonitorSessionReport` | `@/components/physiology-monitor/monitor-session-report` | Client UI |
| `MonitorEngine` | `@/lib/physiology-monitor/monitor-engine` | Pure TypeScript runtime |
| `buildSessionReport` | `@/lib/physiology-monitor/monitor-session-report` | Pure TypeScript report builder |
| `DETERIORATION_PATTERNS` | `@/lib/physiology-monitor/deterioration-patterns` | Static data |

## Pre-Fix Dependency Tree

```text
physiology-monitor-client.tsx  ["use client"]
├─ react
├─ simulation-conversion-events.ts  [server leak]
│  └─ posthog-server.ts
│     ├─ posthog-node
│     │  └─ node:fs
│     └─ posthog-distinct-id.ts
├─ monitor-workstation.tsx  ["use client"]
│  ├─ patient-monitor-display.tsx
│  │  ├─ ecg-live-strip.tsx
│  │  ├─ ecg-bridge.ts
│  │  ├─ ventilator-waveform-live.tsx
│  │  └─ physiology-state.ts / profession-views.ts / deterioration-patterns.ts
│  ├─ trend-panel.tsx
│  ├─ intervention-panel.tsx
│  └─ monitor-engine.ts
├─ monitor-session-report.tsx  ["use client"]
│  └─ monitor-session-report.ts
│     ├─ clinical-judgment-engine.ts
│     ├─ harm-index.ts
│     ├─ monitor-competency-tracker.ts
│     └─ adaptive-remediation.ts
├─ monitor-engine.ts
├─ monitor-session-report.ts
└─ deterioration-patterns.ts
```

No other local branch from this client entry was found importing `node:fs`, `fs/promises`, Prisma, database clients, markdown loaders, or filesystem helpers.

## Boundary Fix

The mixed analytics module was split into explicit client/server files:

| File | Purpose |
| --- | --- |
| `src/lib/physiology-monitor/simulation-conversion-events.types.ts` | Shared serializable event types |
| `src/lib/physiology-monitor/simulation-conversion-events.client.ts` | Client fetch wrapper only |
| `src/lib/physiology-monitor/simulation-conversion-events.server.ts` | Server PostHog capture only |
| `src/lib/physiology-monitor/simulation-conversion-events.ts` | Server-facing re-export barrel |

The client entry now imports:

```ts
import { trackSimulationEventClient } from "@/lib/physiology-monitor/simulation-conversion-events.client";
```

API routes and server components import:

```ts
import { trackSimulationEvent } from "@/lib/physiology-monitor/simulation-conversion-events.server";
```

## Post-Fix Client Graph

```text
physiology-monitor-client.tsx
├─ simulation-conversion-events.client.ts
│  └─ simulation-conversion-events.types.ts
├─ monitor-workstation.tsx
├─ monitor-session-report.tsx
├─ monitor-engine.ts
├─ monitor-session-report.ts
└─ deterioration-patterns.ts
```

Forbidden modules are not reachable from the client graph:

- `node:fs`
- `fs`
- `fs/promises`
- `posthog-node`
- `@/lib/observability/posthog-server`
- `@prisma/client`
- database utilities

## Regression Protection

Contract test:

```text
src/app/(app)/app/(learner)/physiology-monitor/physiology-monitor-client-boundary.test.ts
```

It walks the local import graph from `physiology-monitor-client.tsx` and fails if a forbidden server-only dependency becomes reachable.

Run:

```bash
node --import tsx --test "src/app/(app)/app/(learner)/physiology-monitor/physiology-monitor-client-boundary.test.ts"
```

