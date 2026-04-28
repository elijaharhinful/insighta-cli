import Table from "cli-table3";
import chalk from "chalk";

export function renderProfileTable(profiles: any[]) {
  const table = new Table({
    head: [
      chalk.cyan("ID"),
      chalk.cyan("Name"),
      chalk.cyan("Gender"),
      chalk.cyan("Age"),
      chalk.cyan("Country"),
    ],
  });

  profiles.forEach((p) => {
    table.push([
      p.id.split("-")[0] + "...", // truncate ID for display
      p.name,
      `${p.gender} (${Math.round(p.gender_probability * 100)}%)`,
      `${p.age} (${p.age_group})`,
      `${p.country_name} (${Math.round(p.country_probability * 100)}%)`,
    ]);
  });

  console.log(table.toString());
}
