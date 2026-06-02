import paypalSdk from "@paypal/paypal-server-sdk";
const {
  Client,
  Environment,
  LogLevel,
  OAuthAuthorizationController,
  OrdersController,
} = paypalSdk as any;

import { Request, Response } from "express";

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

let ordersController: any = null;
let oAuthAuthorizationController: any = null;

/* -------------------------
   INIT PAYPAL CLIENT
------------------------- */

if (PAYPAL_CLIENT_ID && PAYPAL_CLIENT_SECRET) {
  try {
    const client = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: PAYPAL_CLIENT_ID,
        oAuthClientSecret: PAYPAL_CLIENT_SECRET,
      },
      timeout: 10000, // ✅ prevent hanging requests
      environment:
        process.env.NODE_ENV === "production"
          ? Environment.Production
          : Environment.Sandbox,
      logging: {
        logLevel: LogLevel.Info,
        logRequest: { logBody: false },
        logResponse: { logHeaders: false },
      },
    });

    ordersController = new OrdersController(client);
    oAuthAuthorizationController = new OAuthAuthorizationController(client);

    console.log("[PayPal] Initialized");
  } catch (err) {
    console.error("[PayPal] Init failed:", err);
  }
}

/* -------------------------
   SAFE JSON PARSE
------------------------- */

function safeParse(body: any) {
  try {
    return typeof body === "string" ? JSON.parse(body) : body;
  } catch (err) {
    console.error("[PayPal] JSON parse failed:", err);
    return null;
  }
}

/* -------------------------
   CLIENT TOKEN
------------------------- */

export async function getClientToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET || !oAuthAuthorizationController) {
    throw new Error("PayPal not configured");
  }

  try {
    const auth = Buffer.from(
      `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const { result } = await oAuthAuthorizationController.requestToken(
      { authorization: `Basic ${auth}` },
      { intent: "sdk_init", response_type: "client_token" }
    );

    return result?.accessToken;
  } catch (err) {
    console.error("[PayPal] getClientToken failed:", err);
    throw new Error("Failed to get PayPal client token");
  }
}

/* -------------------------
   CREATE ORDER
------------------------- */

export async function createPaypalOrder(req: Request, res: Response) {
  try {
    if (!ordersController) {
      return res.status(503).json({ error: "PayPal not configured" });
    }

    const { amount, currency, intent } = req.body;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    if (!currency || typeof currency !== "string") {
      return res.status(400).json({ error: "Invalid currency" });
    }

    if (!intent || typeof intent !== "string") {
      return res.status(400).json({ error: "Invalid intent" });
    }

    const collect = {
      body: {
        intent,
        purchaseUnits: [
          {
            amount: {
              currencyCode: currency,
              value: String(amount),
            },
          },
        ],
      },
      prefer: "return=minimal",
    };

    const response = await ordersController.createOrder(collect);

    const json = safeParse(response.body);

    if (!json) {
      return res.status(500).json({ error: "Invalid PayPal response" });
    }

    res.status(response.statusCode || 200).json(json);

  } catch (error) {
    console.error("[PayPal] Create order failed:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
}

/* -------------------------
   CAPTURE ORDER
------------------------- */

export async function capturePaypalOrder(req: Request, res: Response) {
  try {
    if (!ordersController) {
      return res.status(503).json({ error: "PayPal not configured" });
    }

    const { orderID } = req.params;

    if (!orderID) {
      return res.status(400).json({ error: "Missing orderID" });
    }

    const response = await ordersController.captureOrder({
      id: orderID,
      prefer: "return=minimal",
    });

    const json = safeParse(response.body);

    if (!json) {
      return res.status(500).json({ error: "Invalid PayPal response" });
    }

    res.status(response.statusCode || 200).json(json);

  } catch (error) {
    console.error("[PayPal] Capture failed:", error);
    res.status(500).json({ error: "Failed to capture order" });
  }
}

/* -------------------------
   LOAD CLIENT TOKEN
------------------------- */

export async function loadPaypalDefault(_req: Request, res: Response) {
  try {
    const clientToken = await getClientToken();

    if (!clientToken) {
      return res.status(500).json({ error: "Failed to get token" });
    }

    res.json({ clientToken });

  } catch (error) {
    console.error("[PayPal] load default failed:", error);
    res.status(503).json({ error: "PayPal not configured" });
  }
}

/* -------------------------
   CHECK CONFIG
------------------------- */

export function isPaypalConfigured(): boolean {
  return Boolean(PAYPAL_CLIENT_ID && PAYPAL_CLIENT_SECRET);
}