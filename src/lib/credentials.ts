import fs from "fs";
import os from "os";
import path from "path";

export interface Credentials {
  access_token: string;
  refresh_token: string;
  username: string;
  role: string;
}

const CREDS_DIR = path.join(os.homedir(), ".insighta");
const CREDS_FILE = path.join(CREDS_DIR, "credentials.json");

export function saveCredentials(creds: Credentials): void {
  if (!fs.existsSync(CREDS_DIR))
    fs.mkdirSync(CREDS_DIR, { recursive: true, mode: 0o700 });
  fs.writeFileSync(CREDS_FILE, JSON.stringify(creds, null, 2), { mode: 0o600 });
}

export function loadCredentials(): Credentials | null {
  if (!fs.existsSync(CREDS_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(CREDS_FILE, "utf-8")) as Credentials;
  } catch {
    return null;
  }
}

export function clearCredentials(): void {
  if (fs.existsSync(CREDS_FILE)) fs.unlinkSync(CREDS_FILE);
}
