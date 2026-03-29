# Webhook idempotency

## Callback routes (HTTP)

| Route | Provider | Idempotency |
|-------|----------|-------------|
| `POST /api/stripe/webhook` | Stripe | Yes — `withWebhookIdempotency` + `webhook_events` (when `STRIPE_WEBHOOK_SECRET` is set) |
| `GET /api/meta/callback` | Meta OAuth | **No** — OAuth redirect, not a billing webhook; left unchanged |

Internal modules (e.g. `subscription-sync.ts`) may touch `webhook_events` for repair/backfill; they are not Express webhooks.

## Standard pattern (`server/webhook-idempotency.ts`)

1. **Raw body** — Register the route **before** `express.json()` (see `server/index.ts` for Stripe).
2. **Verify signature** with the provider SDK / HMAC on the raw payload.
3. **Stable `eventId`** — Use the vendor’s unique event id (`evt_*` for Stripe, PayPal WH/event id, etc.).
4. **`withWebhookIdempotency`** — Pass `eventId`, `eventType`, `source` (`"stripe" \| "paypal" \| "other"`), small `payloadSummary`, optional `requestId`, and `handler` that runs side effects.
5. **Handler** — Use DB upserts / unique constraints so a rare double-run would not corrupt data.
6. **Response** — Return `200` quickly for duplicates (Stripe retries); duplicates are logged at **info** (`type: webhook_duplicate`).

### Example (future PayPal)

```ts
// Pseudocode — verify PayPal signature first, then:
const eventId = body.id; // or composed stable id from headers + resource id
const result = await withWebhookIdempotency({
  eventId,
  eventType: body.event_type,
  source: "paypal",
  payloadSummary: { event_type: body.event_type, resource_id: body.resource?.id },
  requestId: req.requestId,
  handler: async () => {
    // apply entitlements, orders, etc.
  },
});
if (result.duplicate) return res.status(200).json({ received: true, duplicate: true });
return res.status(200).json({ received: true });
```

## Intentionally unchanged

- Checkout / portal / PayPal order REST endpoints in `routes.ts` (request/response APIs, not provider push webhooks).
- Meta OAuth callback (not idempotent in the same sense).
