"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASE_URL = void 0;
exports.getClient = getClient;
const axios_1 = __importDefault(require("axios"));
const credentials_1 = require("./credentials");
const BASE_URL = process.env.INSIGHTA_API_URL || "http://localhost:3000";
exports.BASE_URL = BASE_URL;
let _client = null;
function getClient() {
    if (!_client) {
        _client = axios_1.default.create({
            baseURL: BASE_URL,
            headers: { "X-API-Version": "1" },
        });
        // Attach token to every request
        _client.interceptors.request.use((config) => {
            const creds = (0, credentials_1.loadCredentials)();
            if (creds?.access_token) {
                config.headers.Authorization = `Bearer ${creds.access_token}`;
            }
            return config;
        });
        // Auto-refresh on 401
        _client.interceptors.response.use((r) => r, async (error) => {
            if (error.response?.status !== 401)
                throw error;
            const creds = (0, credentials_1.loadCredentials)();
            if (!creds?.refresh_token) {
                (0, credentials_1.clearCredentials)();
                throw new Error("Session expired. Please run: insighta login");
            }
            try {
                const { data } = await axios_1.default.post(`${BASE_URL}/auth/refresh`, {
                    refresh_token: creds.refresh_token,
                });
                (0, credentials_1.saveCredentials)({
                    ...creds,
                    access_token: data.access_token,
                    refresh_token: data.refresh_token,
                });
                // Retry original request with new token
                if (error.config) {
                    error.config.headers.Authorization = `Bearer ${data.access_token}`;
                    return _client.request(error.config);
                }
            }
            catch {
                (0, credentials_1.clearCredentials)();
                throw new Error("Session expired. Please run: insighta login");
            }
            throw error;
        });
    }
    return _client;
}
