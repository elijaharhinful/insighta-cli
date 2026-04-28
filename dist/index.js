#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const login_1 = require("./commands/auth/login");
const logout_1 = require("./commands/auth/logout");
const whoami_1 = require("./commands/auth/whoami");
const list_1 = require("./commands/profiles/list");
const get_1 = require("./commands/profiles/get");
const search_1 = require("./commands/profiles/search");
const create_1 = require("./commands/profiles/create");
const export_1 = require("./commands/profiles/export");
const program = new commander_1.Command();
program
    .name("insighta")
    .description("CLI for Insighta Labs+ Profile Intelligence System")
    .version("1.0.0");
// Auth Commands
program
    .command("login")
    .description("Login with GitHub (OAuth + PKCE)")
    .action(login_1.loginCommand);
program
    .command("logout")
    .description("Logout and clear local credentials")
    .action(logout_1.logoutCommand);
program
    .command("whoami")
    .description("Check current authenticated user")
    .action(whoami_1.whoamiCommand);
// Profiles Commands
const profiles = program.command("profiles").description("Manage and query profiles");
profiles
    .command("list")
    .description("List profiles with optional filters")
    .option("--gender <gender>", "Filter by gender (male/female)")
    .option("--country <country>", "Filter by country code (e.g., NG)")
    .option("--age-group <group>", "Filter by age group (child/teenager/adult/senior)")
    .option("--min-age <age>", "Minimum age")
    .option("--max-age <age>", "Maximum age")
    .option("--sort-by <field>", "Sort by field (age, created_at, gender_probability)")
    .option("--order <order>", "Sort order (asc/desc)")
    .option("--page <page>", "Page number", "1")
    .option("--limit <limit>", "Items per page", "10")
    .action(list_1.listProfilesCommand);
profiles
    .command("get <id>")
    .description("Get a profile by ID")
    .action(get_1.getProfileCommand);
profiles
    .command("search <query>")
    .description("Search profiles using natural language (e.g. 'young males from nigeria')")
    .action(search_1.searchProfilesCommand);
profiles
    .command("create")
    .description("Create a new profile by name (Admin only)")
    .requiredOption("--name <name>", "Name to enrich and save")
    .action(create_1.createProfileCommand);
profiles
    .command("export")
    .description("Export profiles to CSV")
    .requiredOption("--format <format>", "Export format (must be csv)")
    .option("--gender <gender>", "Filter by gender")
    .option("--country <country>", "Filter by country code")
    .action(export_1.exportProfilesCommand);
program.parse(process.argv);
