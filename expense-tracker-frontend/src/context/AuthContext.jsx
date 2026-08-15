import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { loginUser } from "../api/authApi.js";
import { getCurrentUser } from "../api/userApi.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);


    // ==========================================
    // Load current user when token exists
    // ==========================================

    useEffect(() => {

        const loadUser = async () => {

            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {

                const response = await getCurrentUser(token);

                if (response.success && response.data) {
                    setUser(response.data);
                } else {
                    throw new Error("Failed to load user");
                }

            } catch (error) {

                console.error(
                    "Failed to load current user:",
                    error
                );

                localStorage.removeItem("token");
                setToken(null);
                setUser(null);

            } finally {

                setLoading(false);
            }
        };

        loadUser();

    }, [token]);


    // ==========================================
    // Login
    // ==========================================

    const login = async (credentials) => {

        const response = await loginUser(credentials);

        if (response.success && response.data) {

            const receivedToken = response.data.token;

            // Save immediately
            localStorage.setItem(
                "token",
                receivedToken
            );

            setToken(receivedToken);

            // If backend already returns user
            if (response.data.user) {

                setUser(response.data.user);

            } else {

                // Otherwise get user from /users/me
                const profileResponse =
                    await getCurrentUser(receivedToken);

                if (
                    profileResponse.success &&
                    profileResponse.data
                ) {
                    setUser(profileResponse.data);
                }
            }

            return response;
        }

        throw new Error(
            response.message || "Login failed"
        );
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };


    // ==========================================
    // Logout
    // ==========================================

    const logout = () => {

        localStorage.removeItem("token");

        setToken(null);
        setUser(null);
    };


    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                logout,
                updateUser,
                loading,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {

    return useContext(AuthContext);

};