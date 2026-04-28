import { getClient } from "../../lib/api";
import { loadCredentials } from "../../lib/credentials";
import chalk from "chalk";

export async function whoamiCommand() {
  const creds = loadCredentials();
  if (!creds) {
    console.log(chalk.yellow("You are not currently logged in. Run 'insighta login' first."));
    return;
  }

  try {
    const { data } = await getClient().get("/auth/me");
    const user = data.data;
    console.log(chalk.green(`Logged in as: ${chalk.bold("@" + user.username)}`));
    console.log(`Role: ${chalk.cyan(user.role)}`);
    console.log(`Email: ${user.email || "N/A"}`);
  } catch (error: any) {
    console.log(chalk.red("Failed to verify session. Your token might have expired."));
    console.log(chalk.dim(error.message));
  }
}
