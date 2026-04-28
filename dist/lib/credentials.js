"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveCredentials = saveCredentials;
exports.loadCredentials = loadCredentials;
exports.clearCredentials = clearCredentials;
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const CREDS_DIR = path_1.default.join(os_1.default.homedir(), ".insighta");
const CREDS_FILE = path_1.default.join(CREDS_DIR, "credentials.json");
function saveCredentials(creds) {
    if (!fs_1.default.existsSync(CREDS_DIR))
        fs_1.default.mkdirSync(CREDS_DIR, { recursive: true, mode: 0o700 });
    fs_1.default.writeFileSync(CREDS_FILE, JSON.stringify(creds, null, 2), { mode: 0o600 });
}
function loadCredentials() {
    if (!fs_1.default.existsSync(CREDS_FILE))
        return null;
    try {
        return JSON.parse(fs_1.default.readFileSync(CREDS_FILE, "utf-8"));
    }
    catch {
        return null;
    }
}
function clearCredentials() {
    if (fs_1.default.existsSync(CREDS_FILE))
        fs_1.default.unlinkSync(CREDS_FILE);
}
