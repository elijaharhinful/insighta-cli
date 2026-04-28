import { getClient } from "../../lib/api";
import { renderProfileTable } from "../../utils/table";
import chalk from "chalk";
import ora from "ora";

export async function searchProfilesCommand(query: string) {
  const spinner = ora("Searching profiles...").start();
  try {
    const { data } = await getClient().get(`/api/profiles/search?q=${encodeURIComponent(query)}`);
    spinner.stop();

    if (data.data.length === 0) {
      console.log(chalk.yellow("No profiles found matching your query."));
      return;
    }

    renderProfileTable(data.data);
    
    console.log(
      chalk.dim(`\nPage ${data.page} of ${data.total_pages} (Total: ${data.total})`)
    );
  } catch (error: any) {
    spinner.fail("Failed to search profiles");
    console.error(chalk.red(error.response?.data?.message || error.message));
  }
}
