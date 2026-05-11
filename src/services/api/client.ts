import axios from "axios";
import { siteConfig } from "@/lib/config/site";

export const apiClient = axios.create({
  baseURL: siteConfig.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
