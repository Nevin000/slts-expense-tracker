import api from "./axios";

const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const getExpenses = async () => {
    const response = await api.get(
        "/expenses",
        getAuthConfig()
    );

    return response.data;
};

export const getExpenseById = async (id) => {
    const response = await api.get(
        `/expenses/${id}`,
        getAuthConfig()
    );

    return response.data;
};

export const createExpense = async (expenseData) => {
    const response = await api.post(
        "/expenses",
        expenseData,
        getAuthConfig()
    );

    return response.data;
};

export const updateExpense = async (id, expenseData) => {
    const response = await api.put(
        `/expenses/${id}`,
        expenseData,
        getAuthConfig()
    );

    return response.data;
};

export const deleteExpense = async (id) => {
    const response = await api.delete(
        `/expenses/${id}`,
        getAuthConfig()
    );

    return response.data;
};