import { useAuthStore } from "@/store/AuthStore";
import axios, { AxiosRequestConfig } from "axios";

class ApiClient {
  private axiosInstance = axios.create({
    baseURL: "/api", 
    headers: {
      "Content-Type": "application/json",
    },
  });

  constructor() {
    this.axiosInstance.interceptors.request.use((config) => {
      const token = useAuthStore.getState().getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401) {
          useAuthStore.getState().logout();
          window.location.href = "/auth/Login";
        }
        return Promise.reject(error);
      }
    );
  }

  get(url: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.get(url, config);
  }

  post(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.axiosInstance.post(url, data, config);
  }

  put(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.axiosInstance.put(url, data, config);
  }

  delete(url: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.delete(url, config);
  }
}

export const api = new ApiClient();
