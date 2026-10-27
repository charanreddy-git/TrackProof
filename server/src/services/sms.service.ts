import { logger } from "../utils";

const isProduction = process.env.NODE_ENV === "production";

function otpMessage(code: string): string {
  return `Your PinProof verification code is ${code}. It expires in 5 minutes. Never share this code with anyone.`;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required for the configured SMS provider`);
  }
  return value;
}

async function sendWithTwilio(phone: string, code: string): Promise<void> {
  const accountSid = required("TWILIO_ACCOUNT_SID");
  const authToken = required("TWILIO_AUTH_TOKEN");
  const body = new URLSearchParams({
    To: phone,
    Body: otpMessage(code),
  });

  const from = process.env.TWILIO_FROM_NUMBER;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  if (from) {
    body.set("From", from);
  } else if (messagingServiceSid) {
    body.set("MessagingServiceSid", messagingServiceSid);
  } else {
    throw new Error(
      "TWILIO_FROM_NUMBER or TWILIO_MESSAGING_SERVICE_SID is required"
    );
  }

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      signal: AbortSignal.timeout(10000),
    }
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Twilio rejected the SMS (${response.status}): ${detail}`);
  }
}

async function sendWithWebhook(phone: string, code: string): Promise<void> {
  const url = required("SMS_WEBHOOK_URL");
  const token = process.env.SMS_WEBHOOK_TOKEN;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      phone,
      code,
      message: otpMessage(code),
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`SMS webhook rejected the request (${response.status}): ${detail}`);
  }
}

/**
 * Sends the one-time code through the configured provider.
 *
 * Providers:
 * - console (local development only — prints the code to the server log)
 * - twilio (Programmable SMS; requires DLT registration for India)
 * - webhook (POSTs { phone, code, message } to your MSG91/Gupshup/WhatsApp adapter)
 */
export async function sendOtpSms(phone: string, code: string): Promise<void> {
  const provider =
    process.env.SMS_PROVIDER?.toLowerCase() || (isProduction ? "" : "console");

  switch (provider) {
    case "console":
      if (isProduction) {
        throw new Error(
          "SMS_PROVIDER=console is not allowed in production. Configure Twilio or a webhook."
        );
      }
      logger.info(`[DEV OTP] ${phone} -> ${code}`);
      return;
    case "twilio":
      await sendWithTwilio(phone, code);
      return;
    case "webhook":
      await sendWithWebhook(phone, code);
      return;
    default:
      throw new Error(
        "No SMS provider configured. Set SMS_PROVIDER to twilio or webhook in production."
      );
  }
}
