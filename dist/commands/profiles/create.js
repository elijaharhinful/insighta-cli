"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfileCommand = createProfileCommand;
const api_1 = require("../../lib/api");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
async function createProfileCommand(options) {
    if (!options.name) {
        console.log(chalk_1.default.red("Error: --name is required"));
        process.exit(1);
    }
    const spinner = (0, ora_1.default)("Creating profile (this may take a moment to enrich)...").start();
    try {
        const { data } = await (0, api_1.getClient)().post("/api/profiles", {
            name: options.name,
        });
        spinner.succeed("Profile processed");
        if (data.message === "Profile already exists") {
            console.log(chalk_1.default.yellow("\nNote: " + data.message));
        }
        else {
            console.log(chalk_1.default.green("\nSuccessfully created new profile."));
        }
        const p = data.data;
        console.log(`\nName:    ${p.name}`);
        console.log(`Gender:  ${p.gender}`);
        console.log(`Age:     ${p.age}`);
        console.log(`Country: ${p.country_name}`);
        console.log();
    }
    catch (error) {
        spinner.fail("Failed to create profile");
        console.error(chalk_1.default.red(error.response?.data?.message || error.message));
    }
}
