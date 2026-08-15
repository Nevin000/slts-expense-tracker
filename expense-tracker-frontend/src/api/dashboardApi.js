import api from "./axios";


// ==========================================
// Dashboard Summary
// ==========================================

export const getDashboardSummary = async () => {
    const response = await api.get("/dashboard/summary");

    return response.data;
};


// ==========================================
// Monthly Summary
// ==========================================

export const getMonthlySummary = async () => {
    const response = await api.get("/dashboard/monthly");

    return response.data;
};


// ==========================================
// Expense Categories
// ==========================================

export const getExpenseCategories = async () => {
    const response = await api.get("/dashboard/categories");

    return response.data;
};


// ==========================================
// Recent Transactions
// ==========================================

export const getRecentTransactions = async () => {
    const response = await api.get(
        "/dashboard/recent-transactions"
    );

    return response.data;
};


// ==========================================
// Highest Expense Category
// ==========================================

export const getHighestExpenseCategory = async (
    year,
    month
) => {

    const response = await api.get(
        `/dashboard/highest-expense-category?year=${year}&month=${month}`
    );

    return response.data;
};