import { getClient } from "../../lib/api";
import chalk from "chalk";
import ora from "ora";

export async function createProfileCommand(options: any) {
  if (!options.name) {
    console.log(chalk.red("Error: --name is required"));
    process.exit(1);
  }

  const spinner = ora(
    "Creating profile (this may take a moment to enrich)...",
  ).start();
  try {
    const { data } = await getClient().post("/api/profiles", {
      name: options.name,
    });
    spinner.succeed("Profile processed");

    if (data.message === "Profile already exists") {
      console.log(chalk.yellow("\nNote: " + data.message));
    } else {
      console.log(chalk.green("\nSuccessfully created new profile."));
    }

    const p = data.data;
    console.log(`\nName:    ${p.name}`);
    console.log(`Gender:  ${p.gender}`);
    console.log(`Age:     ${p.age}`);
    console.log(`Country: ${p.country_name}`);
    console.log();
  } catch (error: any) {
    spinner.fail("Failed to create profile");
    console.error(chalk.red(error.response?.data?.message || error.message));
  }
}
