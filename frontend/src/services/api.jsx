import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5261/api", // Replace with your backend URL
});

// Add a request interceptor to include the token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
