# Inngest Welcome Email First Slice

## Summary

This spec formalizes the existing signup-triggered welcome email flow as the first production Inngest slice in `nursenest-core`.

The goal is to standardize the current background workflow without changing signup success semantics, auth behavior, or billing behavior. Signup remains authoritative and synchronous. The welcome email remains a best-effort asynchronous side effect with retry-tolerant handling.

This pass is intentionally narrow:

- reuse the existing Inngest footprint
- keep the current welcome-email sender
- make the event contract explicit
- make env gating fail-open
- improve logging and test coverage
- explicitly skip scheduled jobs

## Goals

- Formalize the existing welcome-email Inngest flow into clear, isolated server-only modules.
- Keep the signup route's `201` success behavior unchanged even when Inngest or email delivery fails.
- Use a task-specific event and a stable function id.
- Reuse the existing `sendWelcomeEmailIfNeeded()` guard as the idempotency owner.
- Make the flow easy to observe and safe to retry.
- Keep the initial slice small enough to verify end-to-end in production.

## Non-goals

- No scheduled or cron-backed Inngest jobs.
- No password-reset migration.
- No Stripe or billing follow-up migration.
- No admin/background automation migration.
- No broad event taxonomy or event-platform abstraction.
- No second email system, dedupe store, or coordination layer.
- No UI changes.

## Existing Starting Point

The repo already contains a minimal Inngest setup:

- `src/lib/server/inngest.ts`
- `src/app/api/inngest/route.ts`
- signup-triggered welcome-email event dispatch from `src/app/api/signup/route.ts`

The repo also already contains the current welcome email sender:

- `src/lib/retention/retention-email.ts`
- `sendWelcomeEmailIfNeeded(userId: string)`

That sender already provides the retry/idempotency boundary for the welcome email via the existing email notification log guard. This spec keeps that boundary intact.

## Architecture

The architecture for this first slice stays narrow and additive:

- `src/lib/server/inngest.ts`
  - server-only
  - exports `isInngestEnabled(): boolean`
  - exports a lazily created client via `getInngest()`
  - does not initialize the client at import time
- `src/lib/server/inngest/events.ts`
  - thin typed send helpers
  - no raw event name duplication across routes
  - short-circuits safely when Inngest is disabled
- `src/lib/server/inngest/functions/index.ts`
  - exports the initial function registry
  - keeps function definitions separate from client construction
- `src/app/api/inngest/route.ts`
  - App Router serve endpoint only
  - imports the client and registry
  - contains no app-specific business logic

## Event Contract

The first event is task-specific:

- `nn/user.welcome-email.requested`

This is intentionally narrower than a generic signup lifecycle event. It describes the exact async task being requested and avoids prematurely creating a canonical domain event that other consumers may depend on.

### Payload

The payload stays minimal and explicit:

- `userId`
- `email`
- `name?`
- `correlationId?`

`correlationId` is optional tracing metadata for logs and observability only. It must never be required for function correctness.

Payload contents should remain limited to what the current welcome-email flow actually needs. If the existing sender still requires a DB lookup, the implementation may omit fields that are unnecessary for correctness. No extra sensitive or user-private fields should be added.

## Trigger Boundary

The event is emitted only after successful user persistence and only after the signup handler has determined a success response.

The signup API response remains authoritative. Event dispatch is best-effort from the user's perspective and must never change the route's `201` outcome.

If event dispatch fails:

- the signup route still returns success
- the failure is logged server-side
- no user-visible error state is introduced for this side effect

The trigger point remains exactly one place in this pass:

- the successful signup flow in `src/app/api/signup/route.ts`

## Function Definition

The first Inngest function should use a stable id:

- `nn-user-welcome-email`

The function remains intentionally simple:

- trigger on `nn/user.welcome-email.requested`
- run a single named step such as `send-welcome-email`
- call the existing welcome-email sender path rather than introducing a new one
- allow transient failures to throw so Inngest retries them
- keep logs light and focused on start/failure context

No additional DB coordination, dedupe table, or claim/release mechanism should be introduced in this pass.

## Idempotency And Retry Model

Retry and duplicate delivery are expected in the event system. This slice must tolerate that safely.

Idempotency for this slice is enforced by the existing welcome-email send guard, not by the event transport layer.

Concretely:

- duplicate event delivery must not break behavior
- retries must never affect signup success semantics
- `sendWelcomeEmailIfNeeded()` remains the only idempotency owner
- no second dedupe system is added

This means the function may be retried, but repeated processing should remain bounded by the existing welcome-email guard and notification log behavior.

## Env Gating And Failure Behavior

Inngest integration must fail open when env is incomplete.

### Required runtime env

- `INNGEST_EVENT_KEY`
- `INNGEST_SIGNING_KEY`

The client module should expose `isInngestEnabled(): boolean` and lazily construct the client only when actually needed.

If Inngest env is incomplete:

- imports must not crash the app
- send helpers must short-circuit safely
- the disabled state should be logged lightly
- signup success must remain unchanged

If the email provider is unavailable or the email sender throws:

- the function may fail
- the failure should be observable through logs and Inngest retries
- the signup API response must remain unaffected

## Observability

Logging should be lightweight and production-safe.

### Event send path

- log send failures
- optionally log disabled/no-op state once or at low noise level
- do not emit noisy success-path logs for every signup request

### Function execution path

- log function start with bounded identifiers such as `userId` prefix and optional `correlationId`
- log failure details including message and attempt count where available
- do not create verbose logs for every successful retry or step completion

Observability metadata is for traceability only and must not become part of business correctness.

## Tests

Tests should remain tight and focused.

### Event helper tests

- disabled path: helper returns without throw and does not send
- enabled path: helper sends the correct event name and payload shape

### Signup trigger test

- simulated Inngest send failure still returns the existing signup success response

### Function tests

- repeated invocation remains safe because `sendWelcomeEmailIfNeeded()` is the idempotency owner
- transient downstream failure throws so Inngest can retry

These tests should avoid broad integration complexity and should reuse existing repo testing patterns.

## Documentation

Add short docs covering:

- required env vars
- local/dev flow for the Inngest serve route
- deployed endpoint path: `/api/inngest`
- the single event implemented
- the single function implemented
- retry/idempotency expectations
- explicit deferrals in this pass
- how the integration safely no-ops when env is incomplete

## Explicit Deferrals

The following are intentionally deferred:

- scheduled Inngest jobs
- password reset email offload
- Stripe webhook or billing follow-up offload
- admin-critical background jobs
- canonical domain lifecycle events such as a generalized signup-completed event

These may be added later once the first slice is proven in production and the team chooses the next low-risk async workflow deliberately.

## Success Criteria

This slice is successful when:

- signup still returns the same success response as today
- welcome-email background dispatch is typed and isolated
- missing Inngest env does not break the app
- retries are safe because the existing sender guard remains authoritative
- the serve route is conventional and isolated
- docs and tests make the slice easy to understand and verify

## Implementation Notes

- Keep module boundaries small and explicit.
- Prefer additive changes to existing files over broad refactors.
- Reuse the current Inngest route and current welcome-email sender.
- Do not introduce broader event abstractions or a generalized job framework in this pass.
- Do not commit this spec automatically; follow normal repo commit workflow only when explicitly requested.
