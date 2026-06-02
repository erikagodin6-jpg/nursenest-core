import { getStripeSync } from "./stripeClient";

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    WebhookHandlers.assertBufferPayload(payload);

    const stripeSync = await getStripeSync();
    await stripeSync.processWebhook(payload, signature);
  }

  private static assertBufferPayload(payload: unknown): asserts payload is Buffer {
    if (Buffer.isBuffer(payload)) return;

    throw new Error(
      [
        "STRIPE WEBHOOK ERROR: Payload must be a Buffer.",
        `Received type: ${typeof payload}.`,
        "Ensure webhook route is registered BEFORE app.use(express.json()).",
      ].join(" ")
    );
  }
}