import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5261/api",
});

// Attach token to requests
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;
