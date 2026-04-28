"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileCommand = getProfileCommand;
const api_1 = require("../../lib/api");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
async function getProfileCommand(id) {
    const spinner = (0, ora_1.default)("Fetching profile...").start();
    try {
        const { data } = await (0, api_1.getClient)().get(`/api/profiles/${id}`);
        spinner.stop();
        const p = data.data;
        console.log(chalk_1.default.green(`\nProfile: ${chalk_1.default.bold(p.name)}`));
        console.log(chalk_1.default.dim("----------------------------------------"));
        console.log(`ID:        ${p.id}`);
        console.log(`Gender:    ${p.gender} (${Math.round(p.gender_probability * 100)}% sure)`);
        console.log(`Age:       ${p.age} [${p.age_group}]`);
        console.log(`Country:   ${p.country_name} (${p.country_id}) - ${Math.round(p.country_probability * 100)}% sure`);
        console.log(`Created:   ${new Date(p.created_at).toLocaleString()}`);
        console.log();
    }
    catch (error) {
        spinner.fail("Failed to fetch profile");
        console.error(chalk_1.default.red(error.response?.data?.message || error.message));
    }
}
