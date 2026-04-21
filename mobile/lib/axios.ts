import axios from "axios";
import { useAuth } from "@clerk/expo";
import { useCallback } from "react";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://whisper-app-lhf2v.sevalla.app/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  console.log("🚀 API URL:", `${config.baseURL}${config.url}`);
  return config;
});

export const useApi = () => {
  const { getToken } = useAuth();

  const apiWithAuth = useCallback(
    async <T,>(config: Parameters<typeof api.request>[0]) => {
      const token = await getToken();

      return api.request<T>({
        ...config,
        headers: {
          ...config.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    },
    [getToken]
  );

  return { api, apiWithAuth };
};