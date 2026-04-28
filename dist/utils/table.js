"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderProfileTable = renderProfileTable;
const cli_table3_1 = __importDefault(require("cli-table3"));
const chalk_1 = __importDefault(require("chalk"));
function renderProfileTable(profiles) {
    const table = new cli_table3_1.default({
        head: [
            chalk_1.default.cyan("ID"),
            chalk_1.default.cyan("Name"),
            chalk_1.default.cyan("Gender"),
            chalk_1.default.cyan("Age"),
            chalk_1.default.cyan("Country"),
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
