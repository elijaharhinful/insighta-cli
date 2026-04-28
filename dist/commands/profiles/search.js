"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProfilesCommand = searchProfilesCommand;
const api_1 = require("../../lib/api");
const table_1 = require("../../utils/table");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
async function searchProfilesCommand(query) {
    const spinner = (0, ora_1.default)("Searching profiles...").start();
    try {
        const { data } = await (0, api_1.getClient)().get(`/api/profiles/search?q=${encodeURIComponent(query)}`);
        spinner.stop();
        if (data.data.length === 0) {
            console.log(chalk_1.default.yellow("No profiles found matching your query."));
            return;
        }
        (0, table_1.renderProfileTable)(data.data);
        console.log(chalk_1.default.dim(`\nPage ${data.page} of ${data.total_pages} (Total: ${data.total})`));
    }
    catch (error) {
        spinner.fail("Failed to search profiles");
        console.error(chalk_1.default.red(error.response?.data?.message || error.message));
    }
}
