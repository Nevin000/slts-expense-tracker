import { useEffect, useState } from "react";

import {
    getDashboardSummary,
    getMonthlySummary,
    getExpenseCategories,
    getRecentTransactions,
    getHighestExpenseCategory,
} from "../../api/dashboardApi";

import {
    Wallet,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    CalendarDays,
    Trophy,
    ShoppingBag,
    Utensils,
    Car,
    Receipt,
    Gamepad2,
    CircleDollarSign,
} from "lucide-react";

const Dashboard = () => {

    // ==========================================
    // Dashboard State
    // ==========================================

    const [summary, setSummary] = useState(null);

    const [monthly, setMonthly] = useState(null);

    const [categories, setCategories] = useState([]);

    const [transactions, setTransactions] = useState([]);

    const [highestCategory, setHighestCategory] = useState(null);


    // ==========================================
    // Selected Month
    // ==========================================

    const today = new Date();

    const currentYear = today.getFullYear();

    const currentMonth = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const [selectedMonth, setSelectedMonth] = useState(
        `${currentYear}-${currentMonth}`
    );


    // ==========================================
    // Loading / Error
    // ==========================================

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==========================================
    // Load Dashboard Data
    // ==========================================

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);

                setError("");

                const [
                    summaryResponse,
                    monthlyResponse,
                    categoryResponse,
                    transactionResponse,
                ] = await Promise.all([

                    getDashboardSummary(),

                    getMonthlySummary(),

                    getExpenseCategories(),

                    getRecentTransactions(),

                ]);


                if (summaryResponse.success) {
                    setSummary(summaryResponse.data);
                }


                if (monthlyResponse.success) {
                    setMonthly(monthlyResponse.data);
                }


                if (categoryResponse.success) {
                    setCategories(
                        categoryResponse.data || []
                    );
                }


                if (transactionResponse.success) {
                    setTransactions(
                        transactionResponse.data || []
                    );
                }

            } catch (err) {

                console.error(
                    "Dashboard loading error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Failed to load dashboard"
                );

            } finally {

                setLoading(false);

            }

        };


        loadDashboard();

    }, []);


    // ==========================================
    // Load Highest Expense Category
    // ==========================================

    useEffect(() => {

        const loadHighestExpenseCategory = async () => {

            try {

                setHighestCategory(null);

                const [
                    year,
                    month,
                ] = selectedMonth.split("-");


                const response =
                    await getHighestExpenseCategory(
                        year,
                        month
                    );


                if (
                    response.success &&
                    response.data
                ) {

                    setHighestCategory(
                        response.data
                    );

                } else {

                    setHighestCategory(null);

                }

            } catch (err) {

                console.error(
                    "Highest expense category loading error:",
                    err
                );

                setHighestCategory(null);

            }

        };


        loadHighestExpenseCategory();

    }, [selectedMonth]);


    // ==========================================
    // Currency Formatter
    // ==========================================

    const formatCurrency = (amount) => {

        return new Intl.NumberFormat(
            "en-LK",
            {
                style: "currency",
                currency: "LKR",
                minimumFractionDigits: 2,
            }
        ).format(amount || 0);

    };


    // ==========================================
    // Date Formatter
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
            }
        );

    };


    // ==========================================
    // Category Icon
    // ==========================================

    const getCategoryIcon = (category) => {

        const value = category?.toUpperCase();

        switch (value) {

            case "FOOD":
                return Utensils;

            case "TRANSPORT":
                return Car;

            case "BILLS":
                return Receipt;

            case "SHOPPING":
                return ShoppingBag;

            case "ENTERTAINMENT":
                return Gamepad2;

            default:
                return CircleDollarSign;

        }

    };


    // ==========================================
    // Loading State
    // ==========================================

    if (loading) {

        return (

            <div className="flex min-h-[500px] items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

                    <p className="text-sm font-medium text-slate-500">
                        Loading your financial dashboard...
                    </p>

                </div>

            </div>

        );

    }


    // ==========================================
    // Error State
    // ==========================================

    if (error) {

        return (

            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <CircleDollarSign size={20} />
                    </div>

                    <div>

                        <p className="font-semibold text-red-700">
                            Unable to load dashboard
                        </p>

                        <p className="mt-1 text-sm text-red-600">
                            {error}
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    return (

        <div className="min-h-full space-y-7 pb-10">


            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <p className="mb-1 text-sm font-medium text-indigo-600">
                        Financial Overview
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Dashboard
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Keep track of your income, expenses and balance.
                    </p>

                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">

                    <CalendarDays
                        size={18}
                        className="text-indigo-600"
                    />

                    <span className="text-sm font-medium text-slate-600">
                        {today.toLocaleDateString(
                            "en-GB",
                            {
                                month: "long",
                                year: "numeric",
                            }
                        )}
                    </span>

                </div>

            </div>


            {/* ==========================================
                SUMMARY CARDS
            ========================================== */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">


                {/* Total Income */}

                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 p-6 text-white shadow-lg shadow-emerald-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl">

                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />

                    <div className="absolute -bottom-10 -right-5 h-28 w-28 rounded-full bg-white/5" />

                    <div className="relative">

                        <div className="mb-6 flex items-center justify-between">

                            <div>

                                <p className="text-sm font-medium text-emerald-50">
                                    Total Income
                                </p>

                                <p className="mt-1 text-xs text-emerald-100">
                                    All time income
                                </p>

                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                                <TrendingUp size={22} />
                            </div>

                        </div>

                        <p className="text-2xl font-bold sm:text-3xl">
                            {formatCurrency(
                                summary?.totalIncome
                            )}
                        </p>

                        <div className="mt-4 flex items-center gap-1 text-xs text-emerald-50">

                            <ArrowUpRight size={15} />

                            <span>
                                Money received
                            </span>

                        </div>

                    </div>

                </div>


                {/* Total Expenses */}

                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 p-6 text-white shadow-lg shadow-rose-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl">

                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />

                    <div className="absolute -bottom-10 -right-5 h-28 w-28 rounded-full bg-white/5" />

                    <div className="relative">

                        <div className="mb-6 flex items-center justify-between">

                            <div>

                                <p className="text-sm font-medium text-rose-50">
                                    Total Expenses
                                </p>

                                <p className="mt-1 text-xs text-rose-100">
                                    All time spending
                                </p>

                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                                <TrendingDown size={22} />
                            </div>

                        </div>

                        <p className="text-2xl font-bold sm:text-3xl">
                            {formatCurrency(
                                summary?.totalExpense
                            )}
                        </p>

                        <div className="mt-4 flex items-center gap-1 text-xs text-rose-50">

                            <ArrowDownRight size={15} />

                            <span>
                                Money spent
                            </span>

                        </div>

                    </div>

                </div>


                {/* Balance */}

                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 p-6 text-white shadow-lg shadow-indigo-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl">

                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />

                    <div className="absolute -bottom-10 -right-5 h-28 w-28 rounded-full bg-white/5" />

                    <div className="relative">

                        <div className="mb-6 flex items-center justify-between">

                            <div>

                                <p className="text-sm font-medium text-indigo-50">
                                    Current Balance
                                </p>

                                <p className="mt-1 text-xs text-indigo-100">
                                    Available balance
                                </p>

                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                                <Wallet size={22} />
                            </div>

                        </div>

                        <p className="text-2xl font-bold sm:text-3xl">
                            {formatCurrency(
                                summary?.balance
                            )}
                        </p>

                        <div className="mt-4 flex items-center gap-1 text-xs text-indigo-50">

                            <Wallet size={14} />

                            <span>
                                Income minus expenses
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==========================================
                MONTHLY OVERVIEW
            ========================================== */}

            <div>

                <div className="mb-4">

                    <h2 className="text-xl font-bold text-slate-900">
                        Monthly Overview
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Your financial activity for this month.
                    </p>

                </div>


                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">


                    {/* Monthly Income */}

                    <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-semibold text-emerald-700">
                                    Monthly Income
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    Income received this month
                                </p>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">

                                <TrendingUp size={22} />

                            </div>

                        </div>

                        <p className="mt-6 text-2xl font-bold text-slate-900">
                            {formatCurrency(
                                monthly?.totalIncome
                            )}
                        </p>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-emerald-100">

                            <div className="h-full w-full rounded-full bg-emerald-500" />

                        </div>

                    </div>


                    {/* Monthly Expenses */}

                    <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 to-white p-6 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-semibold text-rose-700">
                                    Monthly Expenses
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    Expenses recorded this month
                                </p>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600">

                                <TrendingDown size={22} />

                            </div>

                        </div>

                        <p className="mt-6 text-2xl font-bold text-slate-900">
                            {formatCurrency(
                                monthly?.totalExpense
                            )}
                        </p>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-rose-100">

                            <div className="h-full w-full rounded-full bg-rose-500" />

                        </div>

                    </div>

                </div>

            </div>


            {/* ==========================================
                HIGHEST EXPENSE CATEGORY
            ========================================== */}

            <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-[1px] shadow-lg shadow-orange-100">

                <div className="rounded-[15px] bg-white p-6">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        <div className="flex items-start gap-4">

                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">

                                <Trophy size={25} />

                            </div>

                            <div>

                                <h2 className="text-lg font-bold text-slate-900">
                                    Highest Expense Category
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    See where most of your money is going.
                                </p>

                            </div>

                        </div>


                        <div>

                            <label
                                htmlFor="expense-month"
                                className="mb-1.5 block text-xs font-semibold text-slate-500"
                            >
                                Select Month
                            </label>

                            <input
                                id="expense-month"
                                type="month"
                                value={selectedMonth}
                                onChange={(event) =>
                                    setSelectedMonth(
                                        event.target.value
                                    )
                                }
                                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                            />

                        </div>

                    </div>


                    <div className="mt-6 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 p-5">

                        {highestCategory?.category ? (

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                                        Highest Category
                                    </p>

                                    <h3 className="mt-1 text-2xl font-bold text-slate-900">
                                        {highestCategory.category}
                                    </h3>

                                </div>

                                <p className="text-2xl font-bold text-orange-600">
                                    {formatCurrency(
                                        highestCategory.amount
                                    )}
                                </p>

                            </div>

                        ) : (

                            <p className="text-sm text-slate-500">
                                No expenses recorded for the selected month.
                            </p>

                        )}

                    </div>

                </div>

            </div>


            {/* ==========================================
                EXPENSE CATEGORIES
            ========================================== */}

            <div>

                <div className="mb-5">

                    <h2 className="text-xl font-bold text-slate-900">
                        Expenses by Category
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        See where your money is going.
                    </p>

                </div>


                {categories.length === 0 ? (

                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">

                        <CircleDollarSign
                            size={35}
                            className="mx-auto text-slate-300"
                        />

                        <p className="mt-3 text-sm font-medium text-slate-500">
                            No expense data available.
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                        {categories.map((item, index) => {

                            const Icon =
                                getCategoryIcon(
                                    item.category
                                );

                            const styles = [
                                {
                                    card: "from-blue-50 to-white border-blue-100",
                                    icon: "bg-blue-100 text-blue-600",
                                    amount: "text-blue-700",
                                },
                                {
                                    card: "from-emerald-50 to-white border-emerald-100",
                                    icon: "bg-emerald-100 text-emerald-600",
                                    amount: "text-emerald-700",
                                },
                                {
                                    card: "from-orange-50 to-white border-orange-100",
                                    icon: "bg-orange-100 text-orange-600",
                                    amount: "text-orange-700",
                                },
                                {
                                    card: "from-purple-50 to-white border-purple-100",
                                    icon: "bg-purple-100 text-purple-600",
                                    amount: "text-purple-700",
                                },
                                {
                                    card: "from-pink-50 to-white border-pink-100",
                                    icon: "bg-pink-100 text-pink-600",
                                    amount: "text-pink-700",
                                },
                                {
                                    card: "from-cyan-50 to-white border-cyan-100",
                                    icon: "bg-cyan-100 text-cyan-600",
                                    amount: "text-cyan-700",
                                },
                            ];

                            const style =
                                styles[index % styles.length];

                            return (

                                <div
                                    key={item.category}
                                    className={`group rounded-2xl border bg-gradient-to-br p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md ${style.card}`}
                                >

                                    <div className="flex items-center justify-between">

                                        <div
                                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.icon}`}
                                        >
                                            <Icon size={20} />
                                        </div>

                                        <ArrowUpRight
                                            size={18}
                                            className="text-slate-300 transition group-hover:text-slate-500"
                                        />

                                    </div>

                                    <p className="mt-5 text-sm font-semibold text-slate-600">
                                        {item.category}
                                    </p>

                                    <p
                                        className={`mt-1 text-xl font-bold ${style.amount}`}
                                    >
                                        {formatCurrency(
                                            item.amount
                                        )}
                                    </p>

                                </div>

                            );

                        })}

                    </div>

                )}

            </div>


            {/* ==========================================
                RECENT TRANSACTIONS
            ========================================== */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h2 className="text-xl font-bold text-slate-900">
                            Recent Transactions
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Your latest 5 income and expense transactions.
                        </p>

                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                        <Wallet size={19} />

                    </div>

                </div>


                {transactions.length === 0 ? (

                    <div className="p-12 text-center">

                        <CircleDollarSign
                            size={40}
                            className="mx-auto text-slate-300"
                        />

                        <p className="mt-3 text-sm font-medium text-slate-500">
                            No transactions found.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                            <tr className="bg-slate-50/80">

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Type
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Transaction
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Category
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Date
                                </th>

                                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Amount
                                </th>

                            </tr>

                            </thead>


                            <tbody>

                            {transactions
                                .slice(0, 5)
                                .map((transaction) => {

                                    const isIncome =
                                        transaction.type === "INCOME";

                                    return (

                                        <tr
                                            key={`${transaction.type}-${transaction.id}`}
                                            className="border-t border-slate-100 transition hover:bg-slate-50"
                                        >

                                            <td className="px-6 py-4">

                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                                                            isIncome
                                                                ? "bg-emerald-50 text-emerald-700"
                                                                : "bg-rose-50 text-rose-700"
                                                        }`}
                                                    >

                                                        {isIncome ? (
                                                            <ArrowUpRight size={13} />
                                                        ) : (
                                                            <ArrowDownRight size={13} />
                                                        )}

                                                        {transaction.type}

                                                    </span>

                                            </td>


                                            <td className="px-6 py-4">

                                                <p className="text-sm font-semibold text-slate-900">
                                                    {transaction.title}
                                                </p>

                                            </td>


                                            <td className="px-6 py-4">

                                                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                        {transaction.category}
                                                    </span>

                                            </td>


                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {formatDate(
                                                    transaction.date
                                                )}
                                            </td>


                                            <td
                                                className={`px-6 py-4 text-right text-sm font-bold ${
                                                    isIncome
                                                        ? "text-emerald-600"
                                                        : "text-rose-600"
                                                }`}
                                            >

                                                {isIncome
                                                    ? "+"
                                                    : "-"
                                                }

                                                {" "}

                                                {formatCurrency(
                                                    transaction.amount
                                                )}

                                            </td>

                                        </tr>

                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

};

export default Dashboard;