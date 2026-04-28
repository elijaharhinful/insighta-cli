import { getClient } from "../../lib/api";
import { renderProfileTable } from "../../utils/table";
import chalk from "chalk";
import ora from "ora";

export async function listProfilesCommand(options: any) {
  const spinner = ora("Fetching profiles...").start();
  try {
    const params = new URLSearchParams();
    if (options.gender) params.append("gender", options.gender);
    if (options.country) params.append("country_id", options.country);
    if (options.ageGroup) params.append("age_group", options.ageGroup);
    if (options.minAge) params.append("min_age", options.minAge);
    if (options.maxAge) params.append("max_age", options.maxAge);
    if (options.sortBy) params.append("sort_by", options.sortBy);
    if (options.order) params.append("order", options.order);
    if (options.page) params.append("page", options.page);
    if (options.limit) params.append("limit", options.limit);

    const { data } = await getClient().get(`/api/profiles?${params.toString()}`);
    spinner.stop();

    if (data.data.length === 0) {
      console.log(chalk.yellow("No profiles found matching the criteria."));
      return;
    }

    renderProfileTable(data.data);
    
    console.log(
      chalk.dim(`\nPage ${data.page} of ${data.total_pages} (Total: ${data.total})`)
    );
  } catch (error: any) {
    spinner.fail("Failed to fetch profiles");
    console.error(chalk.red(error.response?.data?.message || error.message));
  }
}
