"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whoamiCommand = whoamiCommand;
const api_1 = require("../../lib/api");
const credentials_1 = require("../../lib/credentials");
const chalk_1 = __importDefault(require("chalk"));
async function whoamiCommand() {
    const creds = (0, credentials_1.loadCredentials)();
    if (!creds) {
        console.log(chalk_1.default.yellow("You are not currently logged in. Run 'insighta login' first."));
        return;
    }
    try {
        const { data } = await (0, api_1.getClient)().get("/auth/me");
        const user = data.data;
        console.log(chalk_1.default.green(`Logged in as: ${chalk_1.default.bold("@" + user.username)}`));
        console.log(`Role: ${chalk_1.default.cyan(user.role)}`);
        console.log(`Email: ${user.email || "N/A"}`);
    }
    catch (error) {
        console.log(chalk_1.default.red("Failed to verify session. Your token might have expired."));
        console.log(chalk_1.default.dim(error.message));
    }
}
