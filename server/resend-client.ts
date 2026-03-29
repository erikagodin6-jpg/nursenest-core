import { Resend } from "resend";

type ResendConfig = {
  apiKey: string;
  fromEmail: string;
};

let cachedConfig: ResendConfig | null = null;
let cachedClient: Resend | null = null;

function loadResendConfig(): ResendConfig {
  if (cachedConfig) return cachedConfig;

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey) {
    throw new Error("Resend misconfigured: missing RESEND_API_KEY");
  }

  if (!fromEmail) {
    throw new Error("Resend misconfigured: missing RESEND_FROM_EMAIL");
  }

  cachedConfig = { apiKey, fromEmail };
  return cachedConfig;
}

export function getResendClient(): { client: Resend; fromEmail: string } {
  const { apiKey, fromEmail } = loadResendConfig();

  if (!cachedClient) {
    cachedClient = new Resend(apiKey);
  }

  return {
    client: cachedClient,
    fromEmail,
  };
}

export async function validateResendConnection(): Promise<boolean> {
  try {
    const { client } = getResendClient();

    await client.domains.list();

    return true;
  } catch (err: any) {
    console.error("[Resend] Connection failed:", err.message);
    return false;
  }
}