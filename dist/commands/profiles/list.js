"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProfilesCommand = listProfilesCommand;
const api_1 = require("../../lib/api");
const table_1 = require("../../utils/table");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
async function listProfilesCommand(options) {
    const spinner = (0, ora_1.default)("Fetching profiles...").start();
    try {
        const params = new URLSearchParams();
        if (options.gender)
            params.append("gender", options.gender);
        if (options.country)
            params.append("country_id", options.country);
        if (options.ageGroup)
            params.append("age_group", options.ageGroup);
        if (options.minAge)
            params.append("min_age", options.minAge);
        if (options.maxAge)
            params.append("max_age", options.maxAge);
        if (options.sortBy)
            params.append("sort_by", options.sortBy);
        if (options.order)
            params.append("order", options.order);
        if (options.page)
            params.append("page", options.page);
        if (options.limit)
            params.append("limit", options.limit);
        const { data } = await (0, api_1.getClient)().get(`/api/profiles?${params.toString()}`);
        spinner.stop();
        if (data.data.length === 0) {
            console.log(chalk_1.default.yellow("No profiles found matching the criteria."));
            return;
        }
        (0, table_1.renderProfileTable)(data.data);
        console.log(chalk_1.default.dim(`\nPage ${data.page} of ${data.total_pages} (Total: ${data.total})`));
    }
    catch (error) {
        spinner.fail("Failed to fetch profiles");
        console.error(chalk_1.default.red(error.response?.data?.message || error.message));
    }
}
