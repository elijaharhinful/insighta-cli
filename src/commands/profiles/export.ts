import { getClient } from "../../lib/api";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";

export async function exportProfilesCommand(options: any) {
  if (options.format !== "csv") {
    console.log(chalk.red("Error: --format csv is required"));
    process.exit(1);
  }

  const spinner = ora("Generating export...").start();
  try {
    const params = new URLSearchParams();
    params.append("format", "csv");
    if (options.gender) params.append("gender", options.gender);
    if (options.country) params.append("country_id", options.country);
    if (options.ageGroup) params.append("age_group", options.ageGroup);

    const { data, headers } = await getClient().get(
      `/api/profiles/export?${params.toString()}`,
    );
    spinner.stop();

    const contentDisposition = headers["content-disposition"];
    let filename = `profiles_export_${Date.now()}.csv`;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match && match[1]) filename = match[1];
    }

    const filepath = path.join(process.cwd(), filename);
    fs.writeFileSync(filepath, data);

    console.log(chalk.green(`Export saved to: ${filepath}`));
  } catch (error: any) {
    spinner.fail("Failed to export profiles");
    console.error(chalk.red(error.response?.data?.message || error.message));
  }
}
