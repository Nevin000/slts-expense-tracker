import api from "./axios";

export const getCurrentUser = async (token) => {
    const response = await api.get("/users/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const updateUserProfile = async (profileData) => {
    const response = await api.put("/users/me", profileData);

    return response.data;
};

export const changePassword = async (passwordData) => {
    const response = await api.put(
        "/users/change-password",
        passwordData
    );

    return response.data;
};