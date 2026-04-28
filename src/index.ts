import { Command } from "commander";
import { loginCommand } from "./commands/auth/login";
import { logoutCommand } from "./commands/auth/logout";
import { whoamiCommand } from "./commands/auth/whoami";
import { listProfilesCommand } from "./commands/profiles/list";
import { getProfileCommand } from "./commands/profiles/get";
import { searchProfilesCommand } from "./commands/profiles/search";
import { createProfileCommand } from "./commands/profiles/create";
import { exportProfilesCommand } from "./commands/profiles/export";

const program = new Command();

program
  .name("insighta")
  .description("CLI for Insighta Labs+ Profile Intelligence System")
  .version("1.0.0");

// Auth Commands
program
  .command("login")
  .description("Login with GitHub (OAuth + PKCE)")
  .action(loginCommand);

program
  .command("logout")
  .description("Logout and clear local credentials")
  .action(logoutCommand);

program
  .command("whoami")
  .description("Check current authenticated user")
  .action(whoamiCommand);

// Profiles Commands
const profiles = program
  .command("profiles")
  .description("Manage and query profiles");

profiles
  .command("list")
  .description("List profiles with optional filters")
  .option("--gender <gender>", "Filter by gender (male/female)")
  .option("--country <country>", "Filter by country code (e.g., NG)")
  .option(
    "--age-group <group>",
    "Filter by age group (child/teenager/adult/senior)",
  )
  .option("--min-age <age>", "Minimum age")
  .option("--max-age <age>", "Maximum age")
  .option(
    "--sort-by <field>",
    "Sort by field (age, created_at, gender_probability)",
  )
  .option("--order <order>", "Sort order (asc/desc)")
  .option("--page <page>", "Page number", "1")
  .option("--limit <limit>", "Items per page", "10")
  .action(listProfilesCommand);

profiles
  .command("get <id>")
  .description("Get a profile by ID")
  .action(getProfileCommand);

profiles
  .command("search <query>")
  .description(
    "Search profiles using natural language (e.g. 'young males from nigeria')",
  )
  .action(searchProfilesCommand);

profiles
  .command("create")
  .description("Create a new profile by name (Admin only)")
  .requiredOption("--name <name>", "Name to enrich and save")
  .action(createProfileCommand);

profiles
  .command("export")
  .description("Export profiles to CSV")
  .requiredOption("--format <format>", "Export format (must be csv)")
  .option("--gender <gender>", "Filter by gender")
  .option("--country <country>", "Filter by country code")
  .action(exportProfilesCommand);

program.parse(process.argv);
