import { getClient } from "../../lib/api";
import chalk from "chalk";
import ora from "ora";

export async function getProfileCommand(id: string) {
  const spinner = ora("Fetching profile...").start();
  try {
    const { data } = await getClient().get(`/api/profiles/${id}`);
    spinner.stop();

    const p = data.data;
    console.log(chalk.green(`\nProfile: ${chalk.bold(p.name)}`));
    console.log(chalk.dim("----------------------------------------"));
    console.log(`ID:        ${p.id}`);
    console.log(`Gender:    ${p.gender} (${Math.round(p.gender_probability * 100)}% sure)`);
    console.log(`Age:       ${p.age} [${p.age_group}]`);
    console.log(`Country:   ${p.country_name} (${p.country_id}) - ${Math.round(p.country_probability * 100)}% sure`);
    console.log(`Created:   ${new Date(p.created_at).toLocaleString()}`);
    console.log();
  } catch (error: any) {
    spinner.fail("Failed to fetch profile");
    console.error(chalk.red(error.response?.data?.message || error.message));
  }
}
