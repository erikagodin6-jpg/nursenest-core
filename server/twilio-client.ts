import twilio from "twilio";

/* =========================
   TYPES
========================= */

type TwilioConfig = {
  accountSid: string;
  apiKey: string;
  apiKeySecret: string;
  phoneNumber: string;
};

/* =========================
   CACHE
========================= */

let cachedConfig: TwilioConfig | null = null;

/* =========================
   HELPERS
========================= */

function loadConfig(): TwilioConfig {
  if (cachedConfig) return cachedConfig;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const apiKey = process.env.TWILIO_API_KEY;
  const apiKeySecret = process.env.TWILIO_API_SECRET;
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !apiKey || !apiKeySecret || !phoneNumber) {
    throw new Error(
      "Twilio misconfigured. Required: TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET, TWILIO_PHONE_NUMBER"
    );
  }

  cachedConfig = {
    accountSid,
    apiKey,
    apiKeySecret,
    phoneNumber,
  };

  return cachedConfig;
}

/* =========================
   CLIENT
========================= */

export function getTwilioClient() {
  const { accountSid, apiKey, apiKeySecret } = loadConfig();

  return twilio(apiKey, apiKeySecret, { accountSid });
}

/* =========================
   UTIL
========================= */

export function getTwilioFromPhoneNumber(): string {
  return loadConfig().phoneNumber;
}

/* =========================
   HEALTH CHECK (OPTIONAL)
========================= */

export async function validateTwilioConnection(): Promise<boolean> {
  try {
    const client = getTwilioClient();
    await client.api.accounts(loadConfig().accountSid).fetch();
    return true;
  } catch (err: any) {
    console.error("[Twilio] Connection failed:", err.message);
    return false;
  }
}