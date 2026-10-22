import { loadEnvFile } from "node:process";

try {
  loadEnvFile(".env.local");
} catch {
  // Environment variables may be provided by the host instead.
}

const token = process.env.TELEGRAM_BOT_TOKEN;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
const baseUrl = process.env.PUBLIC_APP_URL?.replace(/\/$/, "");

if (!token || !secret || !baseUrl) {
  console.error("Set TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, and PUBLIC_APP_URL first.");
  process.exit(1);
}

if (!baseUrl.startsWith("https://")) {
  console.error("PUBLIC_APP_URL must be a public HTTPS address for Telegram webhooks.");
  process.exit(1);
}

const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    url: `${baseUrl}/api/telegram/webhook`,
    secret_token: secret,
    allowed_updates: ["message", "callback_query"],
  }),
});
const result = await response.json();

if (!response.ok || !result.ok) {
  console.error(result.description ?? "Telegram webhook setup failed.");
  process.exit(1);
}

console.log(`Telegram webhook configured: ${baseUrl}/api/telegram/webhook`);
