"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginCommand = loginCommand;
const http_1 = __importDefault(require("http"));
const pkce_1 = require("../../lib/pkce");
const credentials_1 = require("../../lib/credentials");
const api_1 = require("../../lib/api");
const axios_1 = __importDefault(require("axios"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const CALLBACK_PORT = 9876;
async function loginCommand() {
    const codeVerifier = (0, pkce_1.generateCodeVerifier)();
    const codeChallenge = (0, pkce_1.generateCodeChallenge)(codeVerifier);
    const state = (0, pkce_1.generateState)();
    // Fetch GitHub client_id from backend
    let githubClientId;
    let cliRedirectUri;
    try {
        const { data } = await axios_1.default.get(`${api_1.BASE_URL}/auth/config`);
        githubClientId = data.github_client_id;
        cliRedirectUri = data.cli_redirect_uri;
    }
    catch {
        console.error(chalk_1.default.red("Failed to reach Insighta API. Is it running?"));
        process.exit(1);
    }
    const params = new URLSearchParams({
        client_id: githubClientId,
        redirect_uri: cliRedirectUri,
        scope: "read:user user:email",
        state,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
    });
    const authUrl = `https://github.com/login/oauth/authorize?${params}`;
    console.log(chalk_1.default.cyan("\n Opening GitHub login in your browser..."));
    console.log(chalk_1.default.dim(`   If the browser doesn't open, visit:\n   ${authUrl}\n`));
    const { default: open } = await Promise.resolve().then(() => __importStar(require("open")));
    await open(authUrl);
    const spinner = (0, ora_1.default)("Waiting for GitHub callback...").start();
    return new Promise((resolve, reject) => {
        const server = http_1.default.createServer(async (req, res) => {
            const url = new URL(req.url, `http://localhost:${CALLBACK_PORT}`);
            const receivedCode = url.searchParams.get("code");
            const receivedState = url.searchParams.get("state");
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`
        <html><body style="font-family:sans-serif;text-align:center;padding:40px">
          <h2>Logged in to Insighta Labs+</h2>
          <p>You can close this tab and return to the terminal.</p>
        </body></html>
      `);
            server.close();
            if (!receivedCode || receivedState !== state) {
                spinner.fail("OAuth callback state mismatch.");
                reject(new Error("Invalid OAuth state"));
                return;
            }
            try {
                const { data } = await axios_1.default.post(`${api_1.BASE_URL}/auth/cli/exchange`, {
                    code: receivedCode,
                    code_verifier: codeVerifier,
                });
                (0, credentials_1.saveCredentials)({
                    access_token: data.access_token,
                    refresh_token: data.refresh_token,
                    username: data.username,
                    role: data.role,
                });
                spinner.succeed(chalk_1.default.green(`Logged in as ${chalk_1.default.bold("@" + data.username)} (${data.role})`));
                resolve();
            }
            catch (err) {
                spinner.fail("Authentication failed.");
                const msg = axios_1.default.isAxiosError(err)
                    ? JSON.stringify(err.response?.data)
                    : String(err);
                console.error(chalk_1.default.red(msg));
                reject(err);
            }
        });
        server.listen(CALLBACK_PORT, "localhost");
        server.on("error", (err) => {
            spinner.fail(`Failed to start callback server on port ${CALLBACK_PORT}: ${err.message}`);
            reject(err);
        });
        // Timeout after 5 minutes
        setTimeout(() => {
            server.close();
            spinner.fail("Login timed out. Please try again.");
            reject(new Error("Login timeout"));
        }, 5 * 60 * 1000);
    });
}
