import http from "http";
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
} from "../../lib/pkce";
import { saveCredentials } from "../../lib/credentials";
import { BASE_URL } from "../../lib/api";
import axios from "axios";
import chalk from "chalk";
import ora from "ora";

const CALLBACK_PORT = 9876;

export async function loginCommand() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = generateState();

  // Fetch GitHub client_id from backend
  let githubClientId: string;
  let cliRedirectUri: string;
  try {
    const { data } = await axios.get<{
      github_client_id: string;
      cli_redirect_uri: string;
    }>(`${BASE_URL}/auth/config`);
    githubClientId = data.github_client_id;
    cliRedirectUri = data.cli_redirect_uri;
  } catch {
    console.error(chalk.red("Failed to reach Insighta API. Is it running?"));
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

  console.log(chalk.cyan("\n Opening GitHub login in your browser..."));
  console.log(
    chalk.dim(`   If the browser doesn't open, visit:\n   ${authUrl}\n`),
  );

  const { default: open } = await import("open");
  await open(authUrl);

  const spinner = ora("Waiting for GitHub callback...").start();

  return new Promise<void>((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url!, `http://localhost:${CALLBACK_PORT}`);
      
      // Ignore favicon or any other stray requests
      if (url.pathname !== "/callback") {
        res.writeHead(404);
        res.end();
        return;
      }

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
        const { data } = await axios.post<{
          status: string;
          access_token: string;
          refresh_token: string;
          username: string;
          role: string;
        }>(`${BASE_URL}/auth/cli/exchange`, {
          code: receivedCode,
          code_verifier: codeVerifier,
        });

        saveCredentials({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          username: data.username,
          role: data.role,
        });

        spinner.succeed(
          chalk.green(
            `Logged in as ${chalk.bold("@" + data.username)} (${data.role})`,
          ),
        );
        resolve();
      } catch (err: unknown) {
        spinner.fail("Authentication failed.");
        const msg = axios.isAxiosError(err)
          ? JSON.stringify(err.response?.data)
          : String(err);
        console.error(chalk.red(msg));
        reject(err);
      }
    });

    server.listen(CALLBACK_PORT, "localhost");
    server.on("error", (err) => {
      spinner.fail(
        `Failed to start callback server on port ${CALLBACK_PORT}: ${err.message}`,
      );
      reject(err);
    });

    // Timeout after 5 minutes
    setTimeout(
      () => {
        server.close();
        spinner.fail("Login timed out. Please try again.");
        reject(new Error("Login timeout"));
      },
      5 * 60 * 1000,
    );
  });
}
