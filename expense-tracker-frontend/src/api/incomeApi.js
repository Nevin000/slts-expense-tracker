import api from "./axios";

const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};


// GET all incomes
export const getIncomes = async () => {
    const response = await api.get(
        "/incomes",
        getAuthConfig()
    );

    return response.data;
};


// GET income by ID
export const getIncomeById = async (id) => {
    const response = await api.get(
        `/incomes/${id}`,
        getAuthConfig()
    );

    return response.data;
};


// CREATE income
export const createIncome = async (incomeData) => {
    const response = await api.post(
        "/incomes",
        incomeData,
        getAuthConfig()
    );

    return response.data;
};


// UPDATE income
export const updateIncome = async (id, incomeData) => {
    const response = await api.put(
        `/incomes/${id}`,
        incomeData,
        getAuthConfig()
    );

    return response.data;
};


// DELETE income
export const deleteIncome = async (id) => {
    const response = await api.delete(
        `/incomes/${id}`,
        getAuthConfig()
    );

    return response.data;
};