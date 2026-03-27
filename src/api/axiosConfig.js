import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:4000/api",
});

// Request interceptor to attach JWT token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor for global error handling
API.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        // Unauthorized - clear session
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // We can't easily redirect to login here without being in a component, 
        // but the AuthContext will see token is null and trigger re-render
    }
    if (!error.response || error.response.status >= 500) {
        alert("Server error: The backend might be offline or experiencing issues.");
    }
    return Promise.reject(error);
});

export default API;
