"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportProfilesCommand = exportProfilesCommand;
const api_1 = require("../../lib/api");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
async function exportProfilesCommand(options) {
    if (options.format !== "csv") {
        console.log(chalk_1.default.red("Error: --format csv is required"));
        process.exit(1);
    }
    const spinner = (0, ora_1.default)("Generating export...").start();
    try {
        const params = new URLSearchParams();
        params.append("format", "csv");
        if (options.gender)
            params.append("gender", options.gender);
        if (options.country)
            params.append("country_id", options.country);
        if (options.ageGroup)
            params.append("age_group", options.ageGroup);
        const { data, headers } = await (0, api_1.getClient)().get(`/api/profiles/export?${params.toString()}`);
        spinner.stop();
        const contentDisposition = headers["content-disposition"];
        let filename = `profiles_export_${Date.now()}.csv`;
        if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+)"/);
            if (match && match[1])
                filename = match[1];
        }
        const filepath = path_1.default.join(process.cwd(), filename);
        fs_1.default.writeFileSync(filepath, data);
        console.log(chalk_1.default.green(`Export saved to: ${filepath}`));
    }
    catch (error) {
        spinner.fail("Failed to export profiles");
        console.error(chalk_1.default.red(error.response?.data?.message || error.message));
    }
}
