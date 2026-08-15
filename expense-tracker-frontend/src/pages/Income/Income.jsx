import { useEffect, useState } from "react";
import {
    getIncomes,
    createIncome,
    updateIncome,
    deleteIncome,
} from "../../api/incomeApi";
import {
    Wallet,
    Plus,
    Pencil,
    Trash2,
    X,
    Receipt,
    CalendarDays,
    FileText,
    CircleDollarSign,
    BriefcaseBusiness,
    Banknote,
    Gift,
    MoreHorizontal,
    AlertCircle,
    CheckCircle2,
    TrendingUp,
} from "lucide-react";
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
        const date = new Date(today.getFullYear(), today.getMonth() + index - 12, 1);
        return { value: getMonthString(date), label: formatMonth(getMonthString(date)) };
    });
};
const getLocalDateString = (date = new Date()) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};
const getPreviousMonthLastDay = (date = new Date()) =>
    new Date(date.getFullYear(), date.getMonth(), 0);
const getPreviousMonthLast10DaysStart = (date = new Date()) => {
    const lastDay = getPreviousMonthLastDay(date);
    return new Date(lastDay.getFullYear(), lastDay.getMonth(), lastDay.getDate() - 9);
};
const isAllowedIncomeDate = (dateValue, editingExistingDate = false) => {
    if (!dateValue) return { valid: false, message: "Please select an income date." };
    const selected = new Date(`${dateValue}T00:00:00`);
    if (Number.isNaN(selected.getTime())) return { valid: false, message: "Please select a valid income date." };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const previousStart = getPreviousMonthLast10DaysStart(today);
    const previousEnd = getPreviousMonthLastDay(today);
    previousEnd.setHours(0, 0, 0, 0);
    if (selected > today)
        return { valid: false, message: "Future dates are not allowed. You can add income only up to today." };
    if ((selected >= currentMonthStart && selected <= today) ||
        (selected >= previousStart && selected <= previousEnd) ||
        editingExistingDate)
        return { valid: true, message: "" };
    return {
        valid: false,
        message: `You can add income for this month up to today, or only the last 10 days of the previous month (${getLocalDateString(previousStart)} to ${getLocalDateString(previousEnd)}).`
    };
};
const Income = () => {
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editingId, setEditingId] = useState(null);
    const currentMonth = getMonthString();
    const todayDate = getLocalDateString();
    const previousMonthLast10Start = getLocalDateString(getPreviousMonthLast10DaysStart());
    const monthOptions = getMonthOptions();
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [formData, setFormData] = useState({
        source: "",
        amount: "",
        receivedDate: todayDate,
        note: "",
    });
    // =========================================================
    // LOAD INCOMES
    // =========================================================
    const loadIncomes = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await getIncomes();
            if (response.success) {
                setIncomes(response.data || []);
            }
        } catch (err) {
            console.error(
                "Failed to load incomes:",
                err
            );
            setError(
                err.response?.data?.message ||
                "Failed to load incomes"
            );
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadIncomes();
    }, []);
    // =========================================================
    // HANDLE FORM CHANGE
    // =========================================================
    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;
        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };
    // =========================================================
    // RESET FORM
    // =========================================================
    const resetForm = () => {
        setFormData({
            source: "",
            amount: "",
            receivedDate: todayDate,
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
        const dateValidation = isAllowedIncomeDate(
            formData.receivedDate,
            Boolean(editingId)
        );
        if (!dateValidation.valid) {
            setError(dateValidation.message);
            setSaving(false);
            return;
        }
        try {
            const requestData = {
                source: formData.source.trim(),
                amount: Number(formData.amount),
                receivedDate: formData.receivedDate,
                note: formData.note.trim() || null,
            };
            if (editingId) {
                await updateIncome(
                    editingId,
                    requestData
                );
                setSuccess(
                    "Income updated successfully"
                );
            } else {
                await createIncome(
                    requestData
                );
                setSuccess(
                    "Income added successfully"
                );
            }
            resetForm();
            await loadIncomes();
        } catch (err) {
            console.error(
                "Income save error:",
                err
            );
            setError(
                err.response?.data?.message ||
                "Failed to save income"
            );
        } finally {
            setSaving(false);
        }
    };
    // =========================================================
    // EDIT
    // =========================================================
    const handleEdit = (income) => {
        setEditingId(income.id);
        setFormData({
            source: income.source || "",
            amount: income.amount || "",
            receivedDate: income.receivedDate || "",
            note: income.note || "",
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
            "Are you sure you want to delete this income?"
        );
        if (!confirmed) {
            return;
        }
        try {
            setError("");
            setSuccess("");
            await deleteIncome(id);
            setSuccess(
                "Income deleted successfully"
            );
            if (editingId === id) {
                resetForm();
            }
            await loadIncomes();
        } catch (err) {
            console.error(
                "Income delete error:",
                err
            );
            setError(
                err.response?.data?.message ||
                "Failed to delete income"
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
    const monthIncomes = incomes.filter(
        (income) =>
            income.receivedDate?.substring(0, 7) === selectedMonth
    );
    const totalIncome = monthIncomes.reduce(
        (total, income) => total + Number(income.amount || 0),
        0
    );
    // =========================================================
    // AVERAGE
    // =========================================================
    const averageIncome = monthIncomes.length ? totalIncome / monthIncomes.length : 0;
    // =========================================================
    // SOURCE ICON
    // =========================================================
    const getSourceIcon = (source) => {
        const value = source?.toLowerCase() || "";
        if (
            value.includes("salary") ||
            value.includes("job") ||
            value.includes("work")
        ) {
            return BriefcaseBusiness;
        }
        if (
            value.includes("bank") ||
            value.includes("interest")
        ) {
            return Banknote;
        }
        if (
            value.includes("gift") ||
            value.includes("bonus")
        ) {
            return Gift;
        }
        return MoreHorizontal;
    };
    // =========================================================
    // SOURCE STYLE
    // =========================================================
    const getSourceStyle = (source) => {
        const value = source?.toLowerCase() || "";
        if (
            value.includes("salary") ||
            value.includes("job") ||
            value.includes("work")
        ) {
            return {
                bg: "bg-emerald-50",
                text: "text-emerald-600",
            };
        }
        if (
            value.includes("bank") ||
            value.includes("interest")
        ) {
            return {
                bg: "bg-blue-50",
                text: "text-blue-600",
            };
        }
        if (
            value.includes("gift") ||
            value.includes("bonus")
        ) {
            return {
                bg: "bg-purple-50",
                text: "text-purple-600",
            };
        }
        return {
            bg: "bg-green-50",
            text: "text-green-600",
        };
    };
    return (
        <div className="w-full space-y-8 pb-10">
            {/* =================================================
                HEADER
            ================================================= */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-sm font-medium text-emerald-500">
                        Financial Management
                    </p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                        Income
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Track and manage your earnings and income.
                    </p>
                </div>
            </div>
            {/* MONTH FILTER */}
            <div className="flex justify-end">
                <div className="relative">
                    <select
                        value={selectedMonth}
                        onChange={(event) => {
                            const month = event.target.value;
                            setSelectedMonth(month);
                        }}
                        className="h-10 min-w-[180px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-semibold text-slate-700 shadow-sm outline-none transition hover:border-emerald-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                    >
                        {monthOptions.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.label}
                            </option>
                        ))}
                    </select>
                    <CalendarDays
                        size={16}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600"
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
                SUMMARY CARDS
            ================================================= */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {/* Total Income */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 p-6 text-white shadow-sm">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -bottom-10 right-10 h-28 w-28 rounded-full bg-white/5" />
                    <div className="relative">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-emerald-100">
                                    Total Income
                                </p>
                                <p className="mt-1 text-xs text-emerald-100/80">
                                    Income for selected month
                                </p>
                            </div>
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                                <TrendingUp size={21} />
                            </div>
                        </div>
                        <h2 className="mt-6 text-3xl font-bold">
                            {formatCurrency(totalIncome)}
                        </h2>
                        <div className="mt-4 flex items-center gap-2 text-xs text-emerald-100">
                            <CircleDollarSign size={15} />
                            <span>
                                Total money received
                            </span>
                        </div>
                    </div>
                </div>
                {/* Income Records */}
                <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600">
                                Income Records
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
                        {monthIncomes.length}
                    </h2>
                    <p className="mt-2 text-xs text-slate-500">
                        Income transactions for selected month
                    </p>
                </div>
                {/* Average Income */}
                <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-600">
                                Average Income
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
                            averageIncome
                        )}
                    </h2>
                    <p className="mt-2 text-xs text-slate-500">
                        Average amount received
                    </p>
                </div>
            </div>
            {/* =================================================
                FORM
            ================================================= */}
            <div
                id="income-form"
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
                {/* Form Header */}
                <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50/60 to-white px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                {editingId ? (
                                    <Pencil size={20} />
                                ) : (
                                    <Plus size={21} />
                                )}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-950">
                                    {editingId
                                        ? "Edit Income"
                                        : "Add New Income"}
                                </h2>
                                <p className="mt-0.5 text-sm text-slate-500">
                                    {editingId
                                        ? "Update your income details."
                                        : "Record a new income transaction."}
                                </p>
                            </div>
                        </div>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-lg
                                    border
                                    border-slate-200
                                    px-3
                                    py-2
                                    text-sm
                                    font-medium
                                    text-slate-600
                                    transition
                                    hover:bg-slate-50
                                "
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
                    {/* Source */}
                    <div>
                        <label
                            htmlFor="source"
                            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                        >
                            <Wallet size={15} />
                            Income Source
                        </label>
                        <input
                            id="source"
                            name="source"
                            type="text"
                            value={formData.source}
                            onChange={handleChange}
                            placeholder="e.g. Salary"
                            maxLength={150}
                            required
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                px-4
                                py-3
                                text-sm
                                text-slate-900
                                outline-none
                                transition
                                placeholder:text-slate-400
                                focus:border-emerald-400
                                focus:bg-white
                                focus:ring-4
                                focus:ring-emerald-50
                            "
                        />
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
                            placeholder="e.g. 150000"
                            required
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                px-4
                                py-3
                                text-sm
                                text-slate-900
                                outline-none
                                transition
                                placeholder:text-slate-400
                                focus:border-emerald-400
                                focus:bg-white
                                focus:ring-4
                                focus:ring-emerald-50
                            "
                        />
                    </div>
                    {/* Date */}
                    <div>
                        <label
                            htmlFor="receivedDate"
                            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                        >
                            <CalendarDays size={15} />
                            Received Date
                        </label>
                        <input
                            id="receivedDate"
                            name="receivedDate"
                            type="date"
                            value={formData.receivedDate}
                            onChange={handleChange}
                            max={todayDate}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setFormData((previous) => ({
                                    ...previous,
                                    receivedDate: todayDate,
                                }));
                                setError("");
                                setSuccess("");
                            }}
                            className={`mt-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                                formData.receivedDate === todayDate
                                    ? "bg-emerald-600 text-white"
                                    : "border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            }`}
                        >
                            Today
                        </button>
                        <p className="mt-2 text-xs text-slate-400">
                            Future dates are blocked. Today is highlighted when selected.
                        </p>
                    </div>
                    {/* Note */}
                    <div>
                        <label
                            htmlFor="note"
                            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                        >
                            <FileText size={15} />
                            Note
                        </label>
                        <input
                            id="note"
                            name="note"
                            type="text"
                            value={formData.note}
                            onChange={handleChange}
                            placeholder="Optional note"
                            maxLength={500}
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                px-4
                                py-3
                                text-sm
                                text-slate-900
                                outline-none
                                transition
                                placeholder:text-slate-400
                                focus:border-emerald-400
                                focus:bg-white
                                focus:ring-4
                                focus:ring-emerald-50
                            "
                        />
                    </div>
                    {/* Submit */}
                    <div className="flex gap-3 md:col-span-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-gradient-to-r
                                from-emerald-500
                                to-green-600
                                px-6
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:from-emerald-600
                                hover:to-green-700
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >
                            {editingId ? (
                                <Pencil size={17} />
                            ) : (
                                <Plus size={17} />
                            )}
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Income"
                                    : "Add Income"}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="
                                    rounded-xl
                                    border
                                    border-slate-200
                                    px-6
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-slate-600
                                    transition
                                    hover:bg-slate-50
                                "
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
            {/* =================================================
                INCOME HISTORY
            ================================================= */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Header */}
                <div className="border-b border-slate-100 px-6 py-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-950">
                                    Income History — {formatMonth(selectedMonth)}
                                </h2>
                                <p className="mt-0.5 text-sm text-slate-500">
                                    Income transactions for the selected month.
                                </p>
                            </div>
                        </div>
                        <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                            {monthIncomes.length} Records
                        </div>
                    </div>
                </div>
                {/* Loading */}
                {loading ? (
                    <div className="flex min-h-48 items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
                            <p className="mt-3 text-sm text-slate-500">
                                Loading incomes...
                            </p>
                        </div>
                    </div>
                ) : monthIncomes.length === 0 ? (
                    /* Empty */
                    <div className="px-6 py-16 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                            <TrendingUp size={28} />
                        </div>
                        <p className="mt-5 font-semibold text-slate-800">
                            No income records found
                        </p>
                        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                            Add your first income using the form above.
                        </p>
                    </div>
                ) : (
                    /* Table */
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Income Source
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
                            {monthIncomes.map((income) => {
                                const sourceStyle =
                                    getSourceStyle(
                                        income.source
                                    );
                                const SourceIcon =
                                    getSourceIcon(
                                        income.source
                                    );
                                return (
                                    <tr
                                        key={income.id}
                                        className="
                                                border-b
                                                border-slate-100
                                                last:border-0
                                                transition
                                                hover:bg-slate-50/70
                                            "
                                    >
                                        {/* Source */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`
                                                            flex
                                                            h-10
                                                            w-10
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-xl
                                                            ${sourceStyle.bg}
                                                            ${sourceStyle.text}
                                                        `}
                                                >
                                                    <SourceIcon size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        {income.source}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-slate-400">
                                                        Income
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Amount */}
                                        <td className="px-6 py-4">
                                                <span className="font-bold text-emerald-600">
                                                    +{" "}
                                                    {formatCurrency(
                                                        income.amount
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
                                                {income.receivedDate}
                                            </div>
                                        </td>
                                        {/* Note */}
                                        <td className="max-w-xs px-6 py-4">
                                                <span className="line-clamp-2 text-sm text-slate-500">
                                                    {income.note || "-"}
                                                </span>
                                        </td>
                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(
                                                            income
                                                        )
                                                    }
                                                    title="Edit income"
                                                    className="
                                                            inline-flex
                                                            h-9
                                                            w-9
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            bg-blue-50
                                                            text-blue-600
                                                            transition
                                                            hover:bg-blue-100
                                                        "
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            income.id
                                                        )
                                                    }
                                                    title="Delete income"
                                                    className="
                                                            inline-flex
                                                            h-9
                                                            w-9
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            bg-red-50
                                                            text-red-600
                                                            transition
                                                            hover:bg-red-100
                                                        "
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
export default Income;