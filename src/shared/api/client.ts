import axios, { AxiosInstance } from "axios";

// Base URL from Postman collection
const BASE_URL = "http://localhost:6996";

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth headers if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here
    if (error.response?.status === 404) {
      console.error("API endpoint not found");
    } else if (error.response?.status >= 500) {
      console.error("Server error");
    }
    return Promise.reject(error);
  }
);
