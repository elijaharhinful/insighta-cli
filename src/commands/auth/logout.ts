import { getClient } from "../../lib/api";
import { clearCredentials, loadCredentials } from "../../lib/credentials";
import chalk from "chalk";
import ora from "ora";

export async function logoutCommand() {
  const creds = loadCredentials();
  if (!creds) {
    console.log(chalk.yellow("You are not currently logged in."));
    return;
  }

  const spinner = ora("Logging out...").start();
  try {
    await getClient().post("/auth/logout");
    spinner.succeed("Logged out successfully.");
  } catch {
    spinner.warn("Could not reach server to invalidate session (token already cleared locally).");
  } finally {
    clearCredentials();
  }
}
