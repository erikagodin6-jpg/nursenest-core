import "server-only";

import { Inngest } from "inngest";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { sendWelcomeEmailIfNeeded } from "@/lib/retention/retention-email";

export const INNGEST_EVENT = {
  welcomeEmailRequested: "app/user.welcome-email.requested",
} as const;

export const inngest = new Inngest({
  id: "nursenest-core",
});

const sendWelcomeEmailFunction = inngest.createFunction(
  {
    id: "send-welcome-email",
    retries: 2,
    triggers: [{ event: INNGEST_EVENT.welcomeEmailRequested }],
  },
  async ({ event, step }) => {
    await step.run("send-welcome-email-if-needed", async () => {
      await sendWelcomeEmailIfNeeded(event.data.userId);
    });
  },
);

export const inngestFunctions = [sendWelcomeEmailFunction];

export async function triggerWelcomeEmailRequested(userId: string): Promise<void> {
  try {
    await inngest.send({
      name: INNGEST_EVENT.welcomeEmailRequested,
      data: { userId },
    });
  } catch (error) {
    safeServerLog("inngest", "event_send_failed", {
      eventName: INNGEST_EVENT.welcomeEmailRequested,
      userIdPrefix: userId.slice(0, 8),
      message: error instanceof Error ? error.message.slice(0, 200) : String(error).slice(0, 200),
    });
  }
}
