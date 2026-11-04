import axios from "axios";
import { getOfflineCacheSessionHeader } from "./offline-cache";

const API_BASE_URL = "http://localhost:3000/";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const cacheablePaths = new Set([
  "/summary",
  "/summary/by-category",
  "/transactions",
  "/categories",
  "/users/me",
]);

api.interceptors.request.use((config) => {
  if (config.method?.toLowerCase() !== "get" || !config.url) {
    return config;
  }

  const requestUrl = new URL(config.url, API_BASE_URL);
  const path = requestUrl.pathname.replace(/\/+$/, "");

  if (cacheablePaths.has(path)) {
    const sessionHeader = getOfflineCacheSessionHeader(API_BASE_URL);

    if (sessionHeader) {
      config.headers.set("X-Offline-Cache-Session", sessionHeader);
    }
  }

  return config;
});
