import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:18080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// ================================
// REQUEST INTERCEPTOR
// ================================
api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


// ================================
// RESPONSE INTERCEPTOR
// ================================
api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {

        if (error.response?.status === 401) {

            // Remove invalid/expired token
            localStorage.removeItem("token");

            // Redirect user to login
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);


export default api;