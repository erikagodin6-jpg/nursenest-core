# Inngest Welcome Email Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the existing signup-triggered welcome email Inngest flow so it is fail-open when env is incomplete, uses a typed task-specific event, preserves signup success semantics, and adds narrow tests and docs.

**Architecture:** Keep the existing Inngest footprint but split it into focused units: a lazy server-only client, a typed event helper, a separate function registry, and the conventional `/api/inngest` serve route. Reuse `sendWelcomeEmailIfNeeded()` as the only idempotency owner and keep signup authoritative by making event dispatch best-effort after success is already determined.

**Tech Stack:** Next.js App Router, TypeScript, Inngest, Prisma, node:test with `tsx`, existing server logging helpers

---

## File Structure

**Create**

- `src/lib/server/inngest/events.ts` — typed event contract and send helper for `nn/user.welcome-email.requested`
- `src/lib/server/inngest/functions/index.ts` — registry exporting the initial welcome-email function
- `src/lib/server/inngest/events.test.ts` — event helper tests for disabled/enabled send behavior
- `src/lib/server/inngest/functions/index.test.ts` — function tests for retry-safe behavior and idempotency boundary
- `src/app/api/signup/route.test.ts` — signup contract test proving event send failure does not change `201`
- `docs/inngest-welcome-email.md` — short operational doc for envs, route, event, function, and explicit deferrals

**Modify**

- `src/lib/server/inngest.ts` — replace eager client/function/event wiring with lazy client + env gate helpers
- `src/app/api/inngest/route.ts` — import the lazy client and registry cleanly, no app logic
- `src/app/api/signup/route.ts` — emit the typed welcome-email event with minimal payload after success is determined

**Existing Dependencies To Reuse**

- `src/lib/retention/retention-email.ts` — `sendWelcomeEmailIfNeeded(userId)`
- `src/lib/observability/safe-server-log.ts` — low-noise server logging
- `src/lib/observability/request-correlation.ts` — request correlation ids for optional tracing metadata

## Task 1: Harden The Inngest Client Boundary

**Files:**
- Modify: `src/lib/server/inngest.ts`
- Create: `src/lib/server/inngest/events.ts`
- Test: `src/lib/server/inngest/events.test.ts`

- [ ] **Step 1: Write the failing event-helper tests**

```ts
import assert from "node:assert/strict";
import test from "node:test";

import { sendWelcomeEmailRequested } from "@/lib/server/inngest/events";
import { setInngestForTests, setInngestEnabledForTests } from "@/lib/server/inngest";

test("welcome email event helper no-ops when Inngest is disabled", async () => {
  process.env.NODE_ENV = "test";
  setInngestEnabledForTests(false);
  let sent = 0;
  setInngestForTests({
    async send() {
      sent += 1;
      return { ids: ["evt_test"] };
    },
  });

  await sendWelcomeEmailRequested({
    userId: "user_123",
    email: "nurse@example.com",
    name: "Nurse Nest",
    correlationId: "corr_123",
  });

  assert.equal(sent, 0);
});

test("welcome email event helper sends typed payload when enabled", async () => {
  process.env.NODE_ENV = "test";
  setInngestEnabledForTests(true);
  let payload: unknown = null;
  setInngestForTests({
    async send(input: unknown) {
      payload = input;
      return { ids: ["evt_test"] };
    },
  });

  await sendWelcomeEmailRequested({
    userId: "user_123",
    email: "nurse@example.com",
    name: "Nurse Nest",
    correlationId: "corr_123",
  });

  assert.deepEqual(payload, {
    name: "nn/user.welcome-email.requested",
    data: {
      userId: "user_123",
      email: "nurse@example.com",
      name: "Nurse Nest",
      correlationId: "corr_123",
    },
  });
});
```

- [ ] **Step 2: Run the event-helper tests and verify they fail**

Run:

```bash
node --require ../scripts/stub-server-only.cjs --import tsx --test src/lib/server/inngest/events.test.ts
```

Expected:

```text
FAIL ... Cannot find module '@/lib/server/inngest/events'
```

- [ ] **Step 3: Refactor `src/lib/server/inngest.ts` to expose only the lazy client boundary**

```ts
import "server-only";

import { Inngest, type EventSchemas } from "inngest";

export type WelcomeEmailRequestedEvent = {
  name: "nn/user.welcome-email.requested";
  data: {
    userId: string;
    email: string;
    name?: string;
    correlationId?: string;
  };
};

type NurseNestEvents = WelcomeEmailRequestedEvent;
type InngestLike = Pick<Inngest<EventSchemas.FromRecord<NurseNestEvents>>, "send">;

let inngestSingleton: Inngest<EventSchemas.FromRecord<NurseNestEvents>> | null | undefined;
let inngestEnabledOverride: boolean | undefined;
let inngestTestClient: InngestLike | null | undefined;

function hasInngestEnv(): boolean {
  return Boolean(process.env.INNGEST_EVENT_KEY?.trim() && process.env.INNGEST_SIGNING_KEY?.trim());
}

export function isInngestEnabled(): boolean {
  return inngestEnabledOverride ?? hasInngestEnv();
}

export function getInngest(): Inngest<EventSchemas.FromRecord<NurseNestEvents>> | null {
  if (!isInngestEnabled()) return null;
  if (inngestSingleton === undefined) {
    inngestSingleton = new Inngest<EventSchemas.FromRecord<NurseNestEvents>>({
      id: "nursenest-core",
    });
  }
  return inngestSingleton;
}

export function getInngestSender(): InngestLike | null {
  if (inngestTestClient !== undefined) return inngestTestClient;
  return getInngest();
}

export function setInngestEnabledForTests(enabled: boolean | undefined): void {
  if (process.env.NODE_ENV !== "test") throw new Error("test-only helper");
  inngestEnabledOverride = enabled;
}

export function setInngestForTests(client: InngestLike | null | undefined): void {
  if (process.env.NODE_ENV !== "test") throw new Error("test-only helper");
  inngestTestClient = client;
}
```

- [ ] **Step 4: Add the typed event helper in `src/lib/server/inngest/events.ts`**

```ts
import "server-only";

import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  getInngestSender,
  isInngestEnabled,
  type WelcomeEmailRequestedEvent,
} from "@/lib/server/inngest";

export const INNGEST_EVENT = {
  welcomeEmailRequested: "nn/user.welcome-email.requested",
} as const;

let inngestDisabledLogged = false;

function logInngestDisabledOnce(): void {
  if (inngestDisabledLogged) return;
  inngestDisabledLogged = true;
  safeServerLog("inngest", "event_send_skipped_disabled", {
    eventName: INNGEST_EVENT.welcomeEmailRequested,
  });
}

export async function sendWelcomeEmailRequested(
  data: WelcomeEmailRequestedEvent["data"],
): Promise<void> {
  if (!isInngestEnabled()) {
    logInngestDisabledOnce();
    return;
  }

  const inngest = getInngestSender();
  if (!inngest) {
    logInngestDisabledOnce();
    return;
  }

  await inngest.send({
    name: INNGEST_EVENT.welcomeEmailRequested,
    data,
  });
}
```

- [ ] **Step 5: Run the event-helper tests and verify they pass**

Run:

```bash
node --require ../scripts/stub-server-only.cjs --import tsx --test src/lib/server/inngest/events.test.ts
```

Expected:

```text
# pass 2
# fail 0
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/server/inngest.ts src/lib/server/inngest/events.ts src/lib/server/inngest/events.test.ts
git commit -m "feat: harden inngest welcome email client boundary"
```

## Task 2: Move Function Logic Into A Focused Registry

**Files:**
- Create: `src/lib/server/inngest/functions/index.ts`
- Modify: `src/app/api/inngest/route.ts`
- Test: `src/lib/server/inngest/functions/index.test.ts`

- [ ] **Step 1: Write the failing function tests**

```ts
import assert from "node:assert/strict";
import test from "node:test";

import { __testables } from "@/lib/server/inngest/functions/index";

test("welcome email function calls the existing sender with the event user id", async () => {
  const calls: string[] = [];
  const step = {
    async run(_id: string, fn: () => Promise<void>) {
      return fn();
    },
  };

  await __testables.runWelcomeEmailRequested(
    {
      event: {
        data: {
          userId: "user_123",
          email: "nurse@example.com",
          correlationId: "corr_123",
        },
      },
      step,
      attempt: 0,
    },
    async (userId) => {
      calls.push(userId);
    },
  );

  assert.deepEqual(calls, ["user_123"]);
});

test("welcome email function rethrows transient sender failures for retry", async () => {
  const step = {
    async run(_id: string, fn: () => Promise<void>) {
      return fn();
    },
  };

  await assert.rejects(
    () =>
      __testables.runWelcomeEmailRequested(
        {
          event: {
            data: {
              userId: "user_123",
              email: "nurse@example.com",
            },
          },
          step,
          attempt: 1,
        },
        async () => {
          throw new Error("provider timeout");
        },
      ),
    /provider timeout/,
  );
});
```

- [ ] **Step 2: Run the function tests and verify they fail**

Run:

```bash
node --require ../scripts/stub-server-only.cjs --import tsx --test src/lib/server/inngest/functions/index.test.ts
```

Expected:

```text
FAIL ... Cannot find module '@/lib/server/inngest/functions/index'
```

- [ ] **Step 3: Create the registry and single welcome-email function**

```ts
import "server-only";

import { safeServerLog } from "@/lib/observability/safe-server-log";
import { sendWelcomeEmailIfNeeded } from "@/lib/retention/retention-email";
import { INNGEST_EVENT } from "@/lib/server/inngest/events";
import { getInngest } from "@/lib/server/inngest";

type WelcomeEmailRequestedInput = {
  event: {
    data: {
      userId: string;
      email: string;
      name?: string;
      correlationId?: string;
    };
  };
  step: {
    run: <T>(id: string, fn: () => Promise<T>) => Promise<T>;
  };
  attempt: number;
};

export async function runWelcomeEmailRequested(
  input: WelcomeEmailRequestedInput,
  sendWelcomeEmail: (userId: string) => Promise<void> = sendWelcomeEmailIfNeeded,
): Promise<void> {
  safeServerLog("inngest", "welcome_email_function_start", {
    userIdPrefix: input.event.data.userId.slice(0, 8),
    correlationId: input.event.data.correlationId ?? "",
    attempt: input.attempt,
  });

  try {
    await input.step.run("send-welcome-email", async () => {
      await sendWelcomeEmail(input.event.data.userId);
    });
  } catch (error) {
    safeServerLog("inngest", "welcome_email_function_failed", {
      userIdPrefix: input.event.data.userId.slice(0, 8),
      correlationId: input.event.data.correlationId ?? "",
      attempt: input.attempt,
      message: error instanceof Error ? error.message.slice(0, 200) : "unknown",
    });
    throw error;
  }
}

const inngest = getInngest();

export const inngestFunctions =
  inngest === null
    ? []
    : [
        inngest.createFunction(
          { id: "nn-user-welcome-email", retries: 2 },
          { event: INNGEST_EVENT.welcomeEmailRequested },
          runWelcomeEmailRequested,
        ),
      ];

export const __testables = { runWelcomeEmailRequested };
```

- [ ] **Step 4: Update the serve route to import the registry only**

```ts
import { serve } from "inngest/next";

import { getInngest } from "@/lib/server/inngest";
import { inngestFunctions } from "@/lib/server/inngest/functions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const inngest = getInngest();

export const { GET, POST, PUT } = serve({
  client: inngest!,
  functions: inngestFunctions,
});
```

If `serve()` cannot accept a nullable client, keep the route conventional by returning a client from `getInngest()` whenever the module is loaded in a server environment, but keep the env gating in send helpers. Do not add app logic to this route.

- [ ] **Step 5: Run the function tests and verify they pass**

Run:

```bash
node --require ../scripts/stub-server-only.cjs --import tsx --test src/lib/server/inngest/functions/index.test.ts
```

Expected:

```text
# pass 2
# fail 0
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/server/inngest/functions/index.ts src/lib/server/inngest/functions/index.test.ts src/app/api/inngest/route.ts
git commit -m "feat: isolate inngest welcome email function registry"
```

## Task 3: Preserve Signup Semantics While Emitting The Typed Event

**Files:**
- Modify: `src/app/api/signup/route.ts`
- Create: `src/app/api/signup/route.test.ts`
- Test: `src/app/api/signup/route.test.ts`

- [ ] **Step 1: Write the failing signup contract test**

```ts
import assert from "node:assert/strict";
import test from "node:test";

import { POST } from "@/app/api/signup/route";

test("signup still returns 201 when welcome-email event send fails", async () => {
  const routeModule = await import("@/app/api/signup/route");

  routeModule.__testables.setSendWelcomeEmailRequestedForTests(async () => {
    throw new Error("inngest unavailable");
  });

  routeModule.__testables.setSignupDepsForTests({
    hashPassword: async () => "hashed",
    createUser: async () => ({ id: "user_123" }),
    findUserByEmail: async () => null,
    findUserByUsername: async () => null,
    sendVerificationEmail: async () => undefined,
    captureAnalytics: async () => undefined,
  });

  const request = new Request("http://localhost/api/signup", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: "nurse@example.com",
      password: "VeryStrongPass123!",
      username: "nurse_nest",
      name: "Nurse Nest",
      country: "CA",
      tier: "RN",
    }),
  });

  const response = await POST(request);
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { ok: true, verificationSent: true });
});
```

- [ ] **Step 2: Run the signup contract test and verify it fails**

Run:

```bash
node --require ../scripts/stub-server-only.cjs --import tsx --test src/app/api/signup/route.test.ts
```

Expected:

```text
FAIL ... route module has no __testables hook for sendWelcomeEmailRequested
```

- [ ] **Step 3: Replace the raw trigger with the typed helper and keep it best-effort**

```ts
import { sendWelcomeEmailRequested } from "@/lib/server/inngest/events";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";

// inside the success branch, after `createdId` is known and before returning 201:
const correlationId = correlationIdFromRequest(req) ?? undefined;

createAndSendVerificationEmail(createdId, email.toLowerCase()).catch((e) => {
  safeServerLog("signup", "verification_email_fire_and_forget_error", {
    detail: e instanceof Error ? e.message.slice(0, 200) : "unknown",
  });
});

void sendWelcomeEmailRequested({
  userId: createdId,
  email: email.toLowerCase(),
  name,
  correlationId,
}).catch((e) => {
  safeServerLog("signup", "welcome_email_event_dispatch_failed", {
    userIdPrefix: createdId.slice(0, 8),
    detail: e instanceof Error ? e.message.slice(0, 200) : "unknown",
  });
});

return NextResponse.json({ ok: true, verificationSent: true }, { status: 201 });
```

If the route needs test hooks to isolate the event helper cleanly, add a minimal `__testables` export that overrides only the send helper in tests. Do not refactor the rest of the signup route beyond what is needed for this one contract test.

- [ ] **Step 4: Run the signup contract test and verify it passes**

Run:

```bash
node --require ../scripts/stub-server-only.cjs --import tsx --test src/app/api/signup/route.test.ts
```

Expected:

```text
# pass 1
# fail 0
```

- [ ] **Step 5: Commit**

```bash
git add src/app/api/signup/route.ts src/app/api/signup/route.test.ts
git commit -m "feat: keep signup authoritative while dispatching welcome email event"
```

## Task 4: Document The Slice And Run Focused Verification

**Files:**
- Create: `docs/inngest-welcome-email.md`
- Modify: `src/lib/server/inngest.ts` (only if route wiring needs final clarification)

- [ ] **Step 1: Add the short operational doc**

```md
# Inngest Welcome Email

## Env vars

- `INNGEST_EVENT_KEY`
- `INNGEST_SIGNING_KEY`

## Endpoint

- `/api/inngest`

## Implemented in this pass

- Event: `nn/user.welcome-email.requested`
- Function id: `nn-user-welcome-email`
- Trigger: successful signup only

## Retry and idempotency

- Signup success does not depend on Inngest availability
- Event dispatch is best-effort
- Function retries are safe because `sendWelcomeEmailIfNeeded()` remains the idempotency owner

## Explicit deferrals

- no scheduled jobs
- no password reset migration
- no Stripe follow-up migration
```

- [ ] **Step 2: Run the focused verification suite**

Run:

```bash
node --require ../scripts/stub-server-only.cjs --import tsx --test \
  src/lib/server/inngest/events.test.ts \
  src/lib/server/inngest/functions/index.test.ts \
  src/app/api/signup/route.test.ts
```

Expected:

```text
# pass 5
# fail 0
```

- [ ] **Step 3: Run lints for the touched files**

Run:

```bash
npx eslint \
  src/lib/server/inngest.ts \
  src/lib/server/inngest/events.ts \
  src/lib/server/inngest/functions/index.ts \
  src/app/api/inngest/route.ts \
  src/app/api/signup/route.ts \
  src/lib/server/inngest/events.test.ts \
  src/lib/server/inngest/functions/index.test.ts \
  src/app/api/signup/route.test.ts
```

Expected:

```text
No output
```

- [ ] **Step 4: Commit**

```bash
git add docs/inngest-welcome-email.md
git commit -m "docs: add inngest welcome email slice notes"
```

## Self-Review

### Spec coverage

- Lazy env-gated client: covered in Task 1
- Typed task-specific event and payload: covered in Task 1 and Task 3
- Separate function registry and isolated route wiring: covered in Task 2
- Stable function id and retry-safe step naming: covered in Task 2
- Signup success unchanged on send failure: covered in Task 3
- Docs and explicit deferrals: covered in Task 4

### Placeholder scan

- No `TODO`, `TBD`, or “implement later” placeholders remain.
- Each code-changing step includes concrete code.
- Each verification step includes an exact command and expected outcome.

### Type consistency

- Event name is consistently `nn/user.welcome-email.requested`
- Function id is consistently `nn-user-welcome-email`
- Helper name is consistently `sendWelcomeEmailRequested`
- Idempotency owner remains consistently `sendWelcomeEmailIfNeeded()`
