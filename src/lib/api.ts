import axios, { AxiosInstance, AxiosError } from "axios";
import {
  loadCredentials,
  saveCredentials,
  clearCredentials,
} from "./credentials";

const BASE_URL = process.env.INSIGHTA_API_URL || "http://localhost:3000";

let _client: AxiosInstance | null = null;

export function getClient(): AxiosInstance {
  if (!_client) {
    _client = axios.create({
      baseURL: BASE_URL,
      headers: { "X-API-Version": "1" },
    });

    // Attach token to every request
    _client.interceptors.request.use((config) => {
      const creds = loadCredentials();
      if (creds?.access_token) {
        config.headers.Authorization = `Bearer ${creds.access_token}`;
      }
      return config;
    });

    // Auto-refresh on 401
    _client.interceptors.response.use(
      (r) => r,
      async (error: AxiosError) => {
        if (error.response?.status !== 401) throw error;

        const creds = loadCredentials();
        if (!creds?.refresh_token) {
          clearCredentials();
          throw new Error("Session expired. Please run: insighta login");
        }

        try {
          const { data } = await axios.post<{
            access_token: string;
            refresh_token: string;
          }>(`${BASE_URL}/auth/refresh`, {
            refresh_token: creds.refresh_token,
          });

          saveCredentials({
            ...creds,
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          });

          // Retry original request with new token
          if (error.config) {
            error.config.headers.Authorization = `Bearer ${data.access_token}`;
            return _client!.request(error.config);
          }
        } catch {
          clearCredentials();
          throw new Error("Session expired. Please run: insighta login");
        }

        throw error;
      },
    );
  }
  return _client;
}

export { BASE_URL };
