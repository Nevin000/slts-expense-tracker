import { useEffect, useState } from "react";
import { getExpenses, createExpense, updateExpense, deleteExpense, } from "../../api/expenseApi";
import { Wallet, Plus, Pencil, Trash2, X, Receipt, CalendarDays, Tag, FileText, CircleDollarSign, Utensils, Car, ShoppingBag, Clapperboard, House, MoreHorizontal, AlertCircle, CheckCircle2, } from "lucide-react";
/*
 * Expense date policy:
 * 1. New expenses can be dated from the start of the current month through today.
 * 2. The previous month's final 10 calendar days are also allowed.
 * 3. Future dates are blocked.
 * 4. New records outside those windows are rejected even if selected manually.
 * 5. Existing records can still be edited without being forced into the new date window.
 */
const CATEGORIES = [
    "BILLS",
    "ENTERTAINMENT",
    "FOOD",
    "OTHER",
    "SHOPPING",
    "TRANSPORT",
];
const getLocalDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
const getPreviousMonthLastDay = (date = new Date()) => {
    return new Date(date.getFullYear(), date.getMonth(), 0);
};
const getPreviousMonthFirstDay = (date = new Date()) => {
    return new Date(date.getFullYear(), date.getMonth() - 1, 1);
};
const getPreviousMonthLast10DaysStart = (date = new Date()) => {
    const lastDay = getPreviousMonthLastDay(date);
    return new Date(
        lastDay.getFullYear(),
        lastDay.getMonth(),
        lastDay.getDate() - 9
    );
};
const isAllowedExpenseDate = (dateValue, editingExistingDate = false) => {
    if (!dateValue) {
        return { valid: false, message: "Please select an expense date." };
    }
    const selectedDate = new Date(`${dateValue}T00:00:00`);
    if (Number.isNaN(selectedDate.getTime())) {
        return { valid: false, message: "Please select a valid expense date." };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    const currentMonthStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
    );
    const previousMonthLast10Start = getPreviousMonthLast10DaysStart(today);
    const previousMonthLastDay = getPreviousMonthLastDay(today);
    previousMonthLastDay.setHours(0, 0, 0, 0);
    if (selectedDate > today) {
        return {
            valid: false,
            message: "Future dates are not allowed. You can add expenses only up to today.",
        };
    }
    if (selectedDate >= currentMonthStart && selectedDate <= today) {
        return { valid: true, message: "" };
    }
    if (
        selectedDate >= previousMonthLast10Start &&
        selectedDate <= previousMonthLastDay
    ) {
        return { valid: true, message: "" };
    }
    if (editingExistingDate) {
        return { valid: true, message: "" };
    }
    return {
        valid: false,
        message: `You can add expenses for this month up to today, or only the last 10 days of the previous month (${getLocalDateString(previousMonthLast10Start)} to ${getLocalDateString(previousMonthLastDay)}).`,
    };
};
const getMonthString = (date = new Date()) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
const formatMonth = (month) =>
    new Date(`${month}-01T00:00:00`).toLocaleDateString("en-LK", {
        month: "long",
        year: "numeric",
    });
const getMonthOptions = () => {
    const today = new Date();
    return Array.from({ length: 25 }, (_, index) => {
        const date = new Date(
            today.getFullYear(),
            today.getMonth() + index - 12,
            1
        );
        const value = getMonthString(date);
        return { value, label: formatMonth(value) };
    });
};
const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editingId, setEditingId] = useState(null);
    const currentMonth = getMonthString();
    const monthOptions = getMonthOptions();
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        amount: "",
        transactionDate: getLocalDateString(),
        note: "",
    });
    const todayDate = getLocalDateString();
    const previousMonthLast10Start = getLocalDateString(getPreviousMonthLast10DaysStart());
    const previousMonthLastDay = getLocalDateString(getPreviousMonthLastDay());
    const currentMonthName = new Intl.DateTimeFormat("en-LK", {
        month: "long",
        year: "numeric",
    }).format(new Date());
    // =========================================================
    // LOAD EXPENSES
    // =========================================================
    const loadExpenses = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await getExpenses();
            if (response.success) {
                setExpenses(response.data || []);
            }
        } catch (err) {
            console.error(
                "Failed to load expenses:",
                err
            );
            setError(
                err.response?.data?.message ||
                "Failed to load expenses"
            );
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadExpenses();
    }, []);
    // =========================================================
    // HANDLE FORM CHANGE
    // =========================================================
    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "transactionDate") {
            const validation = isAllowedExpenseDate(
                value,
                Boolean(editingId)
            );
            setError(validation.valid ? "" : validation.message);
            setSuccess("");
        }
        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };
    const handleTodayDate = () => {
        setFormData((previous) => ({
            ...previous,
            transactionDate: todayDate,
        }));
        setError("");
        setSuccess("");
    };
    // =========================================================
    // RESET FORM
    // =========================================================
    const resetForm = () => {
        setFormData({
            title: "",
            category: "",
            amount: "",
            transactionDate: todayDate,
            note: "",
        });
        setEditingId(null);
    };
    // =========================================================
    // SUBMIT
    // =========================================================
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setSaving(true);
        try {
            const dateValidation = isAllowedExpenseDate(
                formData.transactionDate,
                Boolean(editingId)
            );
            if (!dateValidation.valid) {
                setError(dateValidation.message);
                setSaving(false);
                return;
            }
            const requestData = {
                title: formData.title.trim(),
                category: formData.category,
                amount: Number(formData.amount),
                transactionDate: formData.transactionDate,
                note: formData.note.trim() || null,
            };
            if (editingId) {
                await updateExpense(
                    editingId,
                    requestData
                );
                setSuccess(
                    "Expense updated successfully"
                );
            } else {
                await createExpense(
                    requestData
                );
                setSuccess(
                    "Expense added successfully"
                );
            }
            resetForm();
            await loadExpenses();
        } catch (err) {
            console.error(
                "Expense save error:",
                err
            );
            setError(
                err.response?.data?.message ||
                "Failed to save expense"
            );
        } finally {
            setSaving(false);
        }
    };
    // =========================================================
    // EDIT
    // =========================================================
    const handleEdit = (expense) => {
        setEditingId(expense.id);
        setFormData({
            title: expense.title || "",
            category: expense.category || "",
            amount: expense.amount || "",
            transactionDate:
                expense.transactionDate || "",
            note: expense.note || "",
        });
        setSuccess("");
        setError("");
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    // =========================================================
    // DELETE
    // =========================================================
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this expense?"
        );
        if (!confirmed) {
            return;
        }
        try {
            setError("");
            setSuccess("");
            await deleteExpense(id);
            setSuccess(
                "Expense deleted successfully"
            );
            if (editingId === id) {
                resetForm();
            }
            await loadExpenses();
        } catch (err) {
            console.error(
                "Expense delete error:",
                err
            );
            setError(
                err.response?.data?.message ||
                "Failed to delete expense"
            );
        }
    };
    // =========================================================
    // CURRENCY
    // =========================================================
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-LK", {
            style: "currency",
            currency: "LKR",
            minimumFractionDigits: 2,
        }).format(amount || 0);
    };
    // =========================================================
    // TOTAL
    // =========================================================
    const totalExpenses = expenses.reduce(
        (total, expense) =>
            total + Number(expense.amount || 0),
        0
    );
    // =========================================================
    // CATEGORY DISPLAY
    // =========================================================
    const formatCategory = (category) => {
        if (!category) {
            return "-";
        }
        return category
            .toLowerCase()
            .replace("_", " ")
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };
    // =========================================================
    // CATEGORY STYLE
    // =========================================================
    const getCategoryStyle = (category) => {
        switch (category) {
            case "FOOD":
                return {
                    bg: "bg-orange-50",
                    text: "text-orange-600",
                    icon: Utensils,
                };
            case "TRANSPORT":
                return {
                    bg: "bg-blue-50",
                    text: "text-blue-600",
                    icon: Car,
                };
            case "SHOPPING":
                return {
                    bg: "bg-purple-50",
                    text: "text-purple-600",
                    icon: ShoppingBag,
                };
            case "ENTERTAINMENT":
                return {
                    bg: "bg-pink-50",
                    text: "text-pink-600",
                    icon: Clapperboard,
                };
            case "BILLS":
                return {
                    bg: "bg-emerald-50",
                    text: "text-emerald-600",
                    icon: House,
                };
            default:
                return {
                    bg: "bg-slate-100",
                    text: "text-slate-600",
                    icon: MoreHorizontal,
                };
        }
    };
    const monthExpenses = expenses.filter(
        (expense) =>
            expense.transactionDate?.substring(0, 7) === selectedMonth
    );
    const expenseMonthLabel = formatMonth(selectedMonth);
    const monthlyTotalExpenses = monthExpenses.reduce(
        (total, expense) => total + Number(expense.amount || 0),
        0
    );
    const monthlyAverageExpense = monthExpenses.length
        ? monthlyTotalExpenses / monthExpenses.length
        : 0;
    return (
        <div className="w-full space-y-8 pb-10">
            {/* =================================================
                HEADER
            ================================================= */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-sm font-medium text-red-500">
                        Financial Management
                    </p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                        Expenses
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Track and manage your daily spending.
                    </p>
                </div>
                {!editingId && (
                    <button
                        type="button"
                        onClick={() => {
                            document
                                .getElementById("expense-form")
                                ?.scrollIntoView({
                                    behavior: "smooth",
                                });
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                    >
                        <Plus size={18} />
                        Add Expense
                    </button>
                )}
            </div>
            {/* MONTH FILTER */}
            <div className="flex justify-end">
                <div className="relative">
                    <select
                        value={selectedMonth}
                        onChange={(event) => setSelectedMonth(event.target.value)}
                        className="h-10 min-w-[180px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-semibold text-slate-700 shadow-sm outline-none transition hover:border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50"
                    >
                        {monthOptions.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.label}
                            </option>
                        ))}
                    </select>
                    <CalendarDays
                        size={16}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                    />
                </div>
            </div>
            {/* =================================================
                MESSAGES
            ================================================= */}
            {error && (
                <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    <AlertCircle size={18} />
                    <span>
                        {error}
                    </span>
                </div>
            )}
            {success && (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
                    <CheckCircle2 size={18} />
                    <span>
                        {success}
                    </span>
                </div>
            )}
            {/* =================================================
                SUMMARY CARD
            ================================================= */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {/* Total Expenses */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 p-6 text-white shadow-sm">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -bottom-10 right-10 h-28 w-28 rounded-full bg-white/5" />
                    <div className="relative">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-100">
                                    Total Expenses
                                </p>
                                <p className="mt-1 text-xs text-red-100/80">
                                    Selected month spending
                                </p>
                            </div>
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                                <Wallet size={21} />
                            </div>
                        </div>
                        <h2 className="mt-6 text-3xl font-bold">
                            {formatCurrency(monthlyTotalExpenses)}
                        </h2>
                        <div className="mt-4 flex items-center gap-2 text-xs text-red-100">
                            <CircleDollarSign size={15} />
                            <span>
                                Total money spent this month
                            </span>
                        </div>
                    </div>
                </div>
                {/* Number of records */}
                <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600">
                                Expense Records
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                Selected month transactions
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <Receipt size={21} />
                        </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-slate-950">
                        {monthExpenses.length}
                    </h2>
                    <p className="mt-2 text-xs text-slate-500">
                        Expenses in selected month
                    </p>
                </div>
                {/* Average */}
                <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-600">
                                Average Expense
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                Per transaction
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                            <CircleDollarSign size={21} />
                        </div>
                    </div>
                    <h2 className="mt-6 text-2xl font-bold text-slate-950">
                        {formatCurrency(
                            monthlyAverageExpense
                        )}
                    </h2>
                    <p className="mt-2 text-xs text-slate-500">
                        Average for selected month
                    </p>
                </div>
            </div>
            {/* =================================================
                FORM
            ================================================= */}
            <div
                id="expense-form"
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
                {/* Form Header */}
                <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                {editingId ? (
                                    <Pencil size={20} />
                                ) : (
                                    <Plus size={21} />
                                )}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-950">
                                    {editingId
                                        ? "Edit Expense"
                                        : "Add New Expense"}
                                </h2>
                                <p className="mt-0.5 text-sm text-slate-500">
                                    {editingId
                                        ? "Update your expense details."
                                        : "Record a new expense transaction."}
                                </p>
                                <p className="mt-1 text-xs text-slate-400">
                                    New expenses: current month up to today, plus the previous month's last 10 days.
                                </p>
                            </div>
                        </div>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                            >
                                <X size={16} />
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="grid gap-5 p-6 md:grid-cols-2"
                >
                    {/* Title */}
                    <div>
                        <label
                            htmlFor="title"
                            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                        >
                            <Receipt size={15} />
                            Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Lunch"
                            maxLength={150}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
                        />
                    </div>
                    {/* Category */}
                    <div>
                        <label
                            htmlFor="category"
                            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                        >
                            <Tag size={15} />
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
                        >
                            <option value="">
                                Select category
                            </option>
                            {CATEGORIES.map((category) => (
                                <option
                                    key={category}
                                    value={category}
                                >
                                    {formatCategory(category)}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Amount */}
                    <div>
                        <label
                            htmlFor="amount"
                            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                        >
                            <CircleDollarSign size={15} />
                            Amount
                        </label>
                        <input
                            id="amount"
                            name="amount"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="e.g. 1500"
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
                        />
                    </div>
                    {/* Date */}
                    <div>
                        <label
                            htmlFor="transactionDate"
                            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                        >
                            <CalendarDays size={15} />
                            Transaction Date
                        </label>
                        <div className="flex gap-2">
                            <input
                                id="transactionDate"
                                name="transactionDate"
                                type="date"
                                value={formData.transactionDate}
                                onChange={handleChange}
                                max={todayDate}
                                min={previousMonthLast10Start}
                                required
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
                            />
                            <button
                                type="button"
                                onClick={handleTodayDate}
                                className="shrink-0 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                                title="Use today's date"
                            >
                                Today
                            </button>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                            <span className="rounded-full bg-red-50 px-2.5 py-1 font-semibold text-red-600">
                                Suggested: {currentMonthName}
                            </span>
                            <span className="text-slate-500">
                                Today: {todayDate}
                            </span>
                            <span className="text-slate-500">
                                Previous month: last 10 days only ({previousMonthLast10Start} to {previousMonthLastDay})
                            </span>
                        </div>
                    </div>
                    {/* Note */}
                    <div className="md:col-span-2">
                        <label
                            htmlFor="note"
                            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                        >
                            <FileText size={15} />
                            Note
                        </label>
                        <textarea
                            id="note"
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            placeholder="Optional note about this expense..."
                            maxLength={500}
                            rows={3}
                            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
                        />
                    </div>
                    {/* Submit */}
                    <div className="flex gap-3 md:col-span-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-red-600 hover:to-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {editingId ? (
                                <Pencil size={17} />
                            ) : (
                                <Plus size={17} />
                            )}
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Expense"
                                    : "Add Expense"}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
            {/* =================================================
                EXPENSE HISTORY
            ================================================= */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Header */}
                <div className="border-b border-slate-100 px-6 py-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                <Receipt size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-950">
                                    Expense History — {expenseMonthLabel}
                                </h2>
                                <p className="mt-0.5 text-sm text-slate-500">
                                    Expense transactions for the selected month.
                                </p>
                            </div>
                        </div>
                        <div className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
                            {monthExpenses.length} Records
                        </div>
                    </div>
                </div>
                {/* Loading */}
                {loading ? (
                    <div className="flex min-h-48 items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-red-500" />
                            <p className="mt-3 text-sm text-slate-500">
                                Loading expenses...
                            </p>
                        </div>
                    </div>
                ) : monthExpenses.length === 0 ? (
                    /* Empty */
                    <div className="px-6 py-16 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                            <Receipt size={28} />
                        </div>
                        <p className="mt-5 font-semibold text-slate-800">
                            No expense records found
                        </p>
                        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                            Add your first expense using the form above.
                        </p>
                    </div>
                ) : (
                    /* Table */
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px]">
                            <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Expense
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Category
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Amount
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Note
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {monthExpenses.map((expense) => {
                                const categoryStyle =
                                    getCategoryStyle(
                                        expense.category
                                    );
                                const CategoryIcon =
                                    categoryStyle.icon;
                                return (
                                    <tr
                                        key={expense.id}
                                        className="border-b border-slate-100 last:border-0 transition hover:bg-slate-50/70"
                                    >
                                        {/* Expense */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                                                    <Receipt size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        {expense.title}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-slate-400">
                                                        Expense
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Category */}
                                        <td className="px-6 py-4">
                                                <span
                                                    className={`
                                                        inline-flex
                                                        items-center
                                                        gap-2
                                                        rounded-full
                                                        px-3
                                                        py-1.5
                                                        text-xs
                                                        font-semibold
                                                        ${categoryStyle.bg}
                                                        ${categoryStyle.text}
                                                    `}
                                                >
                                                    <CategoryIcon size={13} />
                                                    {formatCategory(
                                                        expense.category
                                                    )}
                                                </span>
                                        </td>
                                        {/* Amount */}
                                        <td className="px-6 py-4">
                                                <span className="font-bold text-red-600">
                                                    -{" "}
                                                    {formatCurrency(
                                                        expense.amount
                                                    )}
                                                </span>
                                        </td>
                                        {/* Date */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <CalendarDays
                                                    size={15}
                                                    className="text-slate-400"
                                                />
                                                {expense.transactionDate}
                                            </div>
                                        </td>
                                        {/* Note */}
                                        <td className="max-w-xs px-6 py-4">
                                                <span className="line-clamp-2 text-sm text-slate-500">
                                                    {expense.note || "-"}
                                                </span>
                                        </td>
                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(
                                                            expense
                                                        )
                                                    }
                                                    title="Edit expense"
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            expense.id
                                                        )
                                                    }
                                                    title="Delete expense"
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
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
export default Expenses;