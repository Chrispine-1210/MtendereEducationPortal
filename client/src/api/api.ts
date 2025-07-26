import axios from "axios";
import { config } from "dotenv";

const api = axios.create ({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    withCredentials: true
});

api.interceptors.request.use(confing => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = 'Bearer ${token}';
    return config;
});

export default api;