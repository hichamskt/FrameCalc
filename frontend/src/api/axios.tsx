import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";
import { useAuth } from "../context/AuthContext";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  withCredentials: true,
});


export const useAxios = (): AxiosInstance => {
  const { accessToken } = useAuth();
 
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      if (accessToken) {
        (config.headers as AxiosHeaders).set("Authorization", `Bearer ${accessToken}`);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return api;
};

export default api;