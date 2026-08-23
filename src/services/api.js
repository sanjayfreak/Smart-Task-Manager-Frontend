import axios from "axios";

// Local dev falls back to the Spring Boot app on your machine.
// Production builds pick up VITE_API_URL from .env.production
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080"
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;