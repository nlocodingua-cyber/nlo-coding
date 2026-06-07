/**
 * One-time OAuth2 flow — run this ONCE to get a refresh_token.
 * Usage:
 *   node scripts/get-google-token.mjs
 *   → browser opens → authorize → token printed in terminal
 */

import { createServer } from "http";
import { google } from "googleapis";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { exec } from "child_process";

const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dir, "../.env.local");

const env = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => { const [k, ...v] = l.split("="); return [k.trim(), v.join("=").trim()]; })
);

const CLIENT_ID = env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("❌  Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local first");
  process.exit(1);
}

const REDIRECT = "http://localhost:3333/callback";
const SCOPES = ["https://www.googleapis.com/auth/calendar"];

const oauth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT);
const authUrl = oauth2.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
  prompt: "consent",
  login_hint: "oleksiy.nikolaichuk@gmail.com",
});

// Localhost server to catch the redirect
const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost:3333");
  const code = url.searchParams.get("code");
  if (!code) { res.end("No code"); return; }

  res.end("<h2>✅ Authorized! Check your terminal.</h2><p>You can close this tab.</p>");
  server.close();

  try {
    const { tokens } = await oauth2.getToken(code);
    console.log("\n✅  Refresh token:\n");
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log("\nПасти в .env.local і на Vercel.");
  } catch (err) {
    console.error("❌  Error:", err.message);
  }
});

server.listen(3333, () => {
  console.log("\n🔗  Opening browser...\n");
  exec(`open "${authUrl}"`);
  console.log("Якщо браузер не відкрився — відкрий вручну:\n");
  console.log(authUrl);
});
