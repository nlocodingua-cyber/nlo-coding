/**
 * One-time OAuth2 flow — run this ONCE to get a refresh_token.
 * Then paste the token into .env.local → GOOGLE_REFRESH_TOKEN
 *
 * Usage:
 *   1. Fill GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local
 *   2. node scripts/get-google-token.mjs
 *   3. Open the printed URL, authorize with oleksiy.nikolaichuk@gmail.com
 *   4. Paste the code from the redirect URL into the terminal
 *   5. Copy the printed refresh_token to .env.local
 *
 * Required Google Cloud setup:
 *   - Create project at console.cloud.google.com
 *   - Enable Google Calendar API
 *   - Create OAuth2 credentials (type: Desktop app)
 *   - Add oleksiy.nikolaichuk@gmail.com as test user (if app is in testing mode)
 */

import { createInterface } from "readline";
import { google } from "googleapis";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dir, "../.env.local");

// Parse .env.local
const env = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const [k, ...v] = l.split("=");
      return [k.trim(), v.join("=").trim()];
    })
);

const CLIENT_ID = env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("❌  Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local first");
  process.exit(1);
}

const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];
const REDIRECT = "urn:ietf:wg:oauth:2.0:oob";

const oauth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT);
const authUrl = oauth2.generateAuthUrl({ access_type: "offline", scope: SCOPES, prompt: "consent" });

console.log("\n🔗  Open this URL in your browser:\n");
console.log(authUrl);
console.log();

const rl = createInterface({ input: process.stdin, output: process.stdout });
rl.question("📋  Paste the authorization code here: ", async (code) => {
  rl.close();
  try {
    const { tokens } = await oauth2.getToken(code.trim());
    console.log("\n✅  Success!\n");
    console.log("Add to .env.local:\n");
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log();
  } catch (err) {
    console.error("❌  Error:", err.message);
  }
});
