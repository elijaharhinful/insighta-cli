"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutCommand = logoutCommand;
const api_1 = require("../../lib/api");
const credentials_1 = require("../../lib/credentials");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
async function logoutCommand() {
    const creds = (0, credentials_1.loadCredentials)();
    if (!creds) {
        console.log(chalk_1.default.yellow("You are not currently logged in."));
        return;
    }
    const spinner = (0, ora_1.default)("Logging out...").start();
    try {
        await (0, api_1.getClient)().post("/auth/logout");
        spinner.succeed("Logged out successfully.");
    }
    catch {
        spinner.warn("Could not reach server to invalidate session (token already cleared locally).");
    }
    finally {
        (0, credentials_1.clearCredentials)();
    }
}
