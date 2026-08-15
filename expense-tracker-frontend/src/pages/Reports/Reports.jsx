import { useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    TrendingUp,
    TrendingDown,
    Wallet,
    Receipt,
    ArrowUpCircle,
    ArrowDownCircle,
    FileText,
    AlertCircle,
    RefreshCw,
    Download,
} from "lucide-react";
import { getIncomes } from "../../api/incomeApi";
import { getExpenses } from "../../api/expenseApi";
import jsPDF from "jspdf";
const Reports = () => {
    // =========================================================
    // CURRENT MONTH
    // =========================================================
    const getCurrentMonth = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(
            today.getMonth() + 1
        ).padStart(2, "0");
        return `${year}-${month}`;
    };
    // =========================================================
    // STATE
    // =========================================================
    const [selectedMonth, setSelectedMonth] =
        useState(getCurrentMonth());
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    // =========================================================
    // LOAD DATA
    // =========================================================
    const loadReportData = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");
            const [
                incomeResponse,
                expenseResponse,
            ] = await Promise.all([
                getIncomes(),
                getExpenses(),
            ]);
            if (!incomeResponse.success) {
                throw new Error(
                    incomeResponse.message ||
                    "Failed to load income data"
                );
            }
            if (!expenseResponse.success) {
                throw new Error(
                    expenseResponse.message ||
                    "Failed to load expense data"
                );
            }
            setIncomes(
                incomeResponse.data || []
            );
            setExpenses(
                expenseResponse.data || []
            );
        } catch (err) {
            console.error(
                "Report loading error:",
                err
            );
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load report data"
            );
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadReportData();
    }, []);
    // =========================================================
    // MONTHLY INCOMES
    // =========================================================
    const monthlyIncomes = useMemo(() => {
        return incomes.filter((income) => {
            if (!income.receivedDate) {
                return false;
            }
            return income.receivedDate.startsWith(
                selectedMonth
            );
        });
    }, [
        incomes,
        selectedMonth,
    ]);
    // =========================================================
    // MONTHLY EXPENSES
    // =========================================================
    const monthlyExpenses = useMemo(() => {
        return expenses.filter((expense) => {
            if (!expense.transactionDate) {
                return false;
            }
            return expense.transactionDate.startsWith(
                selectedMonth
            );
        });
    }, [
        expenses,
        selectedMonth,
    ]);
    // =========================================================
    // TOTAL MONTHLY INCOME
    // =========================================================
    const totalMonthlyIncome = useMemo(() => {
        return monthlyIncomes.reduce(
            (total, income) => {
                return (
                    total +
                    Number(income.amount || 0)
                );
            },
            0
        );
    }, [monthlyIncomes]);
    // =========================================================
    // TOTAL MONTHLY EXPENSE
    // =========================================================
    const totalMonthlyExpense = useMemo(() => {
        return monthlyExpenses.reduce(
            (total, expense) => {
                return (
                    total +
                    Number(expense.amount || 0)
                );
            },
            0
        );
    }, [monthlyExpenses]);
    // =========================================================
    // BALANCE
    // =========================================================
    const monthlyBalance =
        totalMonthlyIncome -
        totalMonthlyExpense;
    // =========================================================
    // CURRENCY FORMAT
    // =========================================================
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
    // =========================================================
    // MONTH NAME
    // =========================================================
    const formatMonthName = (monthValue) => {
        if (!monthValue) {
            return "";
        }
        const [
            year,
            month,
        ] = monthValue.split("-");
        const date = new Date(
            Number(year),
            Number(month) - 1,
            1
        );
        return date.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric",
            }
        );
    };
    // =========================================================
    // DATE FORMAT
    // =========================================================
    const formatDate = (dateValue) => {
        if (!dateValue) {
            return "-";
        }
        const date = new Date(
            `${dateValue}T00:00:00`
        );
        return date.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };
    // =========================================================
    // DOWNLOAD PDF
    // =========================================================
    const handleDownloadPdf = () => {
        try {
            setPdfLoading(true);
            setError("");
            setSuccess("");
            const doc = new jsPDF();
            const pageWidth =
                doc.internal.pageSize.getWidth();
            const pageHeight =
                doc.internal.pageSize.getHeight();
            const margin = 18;
            let y = 20;
            // =================================================
            // PDF HEADER
            // =================================================
            doc.setFillColor(
                79,
                70,
                229
            );
            doc.rect(
                0,
                0,
                pageWidth,
                45,
                "F"
            );
            doc.setTextColor(
                255,
                255,
                255
            );
            doc.setFont(
                "helvetica",
                "bold"
            );
            doc.setFontSize(21);
            doc.text(
                "EXPENSE TRACKER",
                margin,
                19
            );
            doc.setFontSize(12);
            doc.setFont(
                "helvetica",
                "normal"
            );
            doc.text(
                "Monthly Financial Report",
                margin,
                29
            );
            doc.setFont(
                "helvetica",
                "bold"
            );
            doc.text(
                formatMonthName(
                    selectedMonth
                ),
                margin,
                38
            );
            // =================================================
            // SUMMARY
            // =================================================
            y = 60;
            doc.setTextColor(
                15,
                23,
                42
            );
            doc.setFont(
                "helvetica",
                "bold"
            );
            doc.setFontSize(15);
            doc.text(
                "Monthly Summary",
                margin,
                y
            );
            y += 10;
            const boxGap = 5;
            const boxWidth =
                (
                    pageWidth -
                    margin * 2 -
                    boxGap * 2
                ) / 3;
            const boxHeight = 30;
            // Income box
            doc.setFillColor(
                236,
                253,
                245
            );
            doc.roundedRect(
                margin,
                y,
                boxWidth,
                boxHeight,
                3,
                3,
                "F"
            );
            doc.setTextColor(
                5,
                150,
                105
            );
            doc.setFontSize(9);
            doc.setFont(
                "helvetica",
                "normal"
            );
            doc.text(
                "TOTAL INCOME",
                margin + 5,
                y + 9
            );
            doc.setFont(
                "helvetica",
                "bold"
            );
            doc.setFontSize(11);
            doc.text(
                formatCurrency(
                    totalMonthlyIncome
                ),
                margin + 5,
                y + 21
            );
            // Expense box
            const expenseBoxX =
                margin +
                boxWidth +
                boxGap;
            doc.setFillColor(
                255,
                241,
                242
            );
            doc.roundedRect(
                expenseBoxX,
                y,
                boxWidth,
                boxHeight,
                3,
                3,
                "F"
            );
            doc.setTextColor(
                225,
                29,
                72
            );
            doc.setFont(
                "helvetica",
                "normal"
            );
            doc.setFontSize(9);
            doc.text(
                "TOTAL EXPENSES",
                expenseBoxX + 5,
                y + 9
            );
            doc.setFont(
                "helvetica",
                "bold"
            );
            doc.setFontSize(11);
            doc.text(
                formatCurrency(
                    totalMonthlyExpense
                ),
                expenseBoxX + 5,
                y + 21
            );
            // Balance box
            const balanceBoxX =
                margin +
                (boxWidth + boxGap) * 2;
            if (monthlyBalance >= 0) {
                doc.setFillColor(
                    239,
                    246,
                    255
                );
            } else {
                doc.setFillColor(
                    255,
                    247,
                    237
                );
            }
            doc.roundedRect(
                balanceBoxX,
                y,
                boxWidth,
                boxHeight,
                3,
                3,
                "F"
            );
            doc.setTextColor(
                monthlyBalance >= 0
                    ? 37
                    : 234,
                monthlyBalance >= 0
                    ? 99
                    : 88,
                monthlyBalance >= 0
                    ? 235
                    : 12
            );
            doc.setFont(
                "helvetica",
                "normal"
            );
            doc.setFontSize(9);
            doc.text(
                "BALANCE",
                balanceBoxX + 5,
                y + 9
            );
            doc.setFont(
                "helvetica",
                "bold"
            );
            doc.setFontSize(11);
            doc.text(
                formatCurrency(
                    monthlyBalance
                ),
                balanceBoxX + 5,
                y + 21
            );
            // =================================================
            // INCOME SECTION
            // =================================================
            y += 48;
            doc.setTextColor(
                5,
                150,
                105
            );
            doc.setFont(
                "helvetica",
                "bold"
            );
            doc.setFontSize(14);
            doc.text(
                "Income Transactions",
                margin,
                y
            );
            y += 8;
            // Income table header
            const tableWidth =
                pageWidth -
                margin * 2;
            doc.setFillColor(
                236,
                253,
                245
            );
            doc.rect(
                margin,
                y,
                tableWidth,
                9,
                "F"
            );
            doc.setTextColor(
                71,
                85,
                105
            );
            doc.setFontSize(8);
            doc.setFont(
                "helvetica",
                "bold"
            );
            doc.text(
                "SOURCE",
                margin + 3,
                y + 6
            );
            doc.text(
                "AMOUNT",
                85,
                y + 6
            );
            doc.text(
                "DATE",
                125,
                y + 6
            );
            doc.text(
                "NOTE",
                160,
                y + 6
            );
            y += 9;
            if (monthlyIncomes.length === 0) {
                doc.setFont(
                    "helvetica",
                    "normal"
                );
                doc.setTextColor(
                    100,
                    116,
                    139
                );
                doc.text(
                    "No income records for this month.",
                    margin + 3,
                    y + 7
                );
                y += 14;
            } else {
                monthlyIncomes.forEach(
                    (income) => {
                        if (
                            y >
                            pageHeight - 30
                        ) {
                            doc.addPage();
                            y = 20;
                        }
                        doc.setTextColor(
                            30,
                            41,
                            59
                        );
                        doc.setFont(
                            "helvetica",
                            "normal"
                        );
                        doc.setFontSize(8);
                        doc.text(
                            String(
                                income.source ||
                                "-"
                            ).substring(
                                0,
                                24
                            ),
                            margin + 3,
                            y + 7
                        );
                        doc.setTextColor(
                            5,
                            150,
                            105
                        );
                        doc.setFont(
                            "helvetica",
                            "bold"
                        );
                        doc.text(
                            formatCurrency(
                                income.amount
                            ),
                            85,
                            y + 7
                        );
                        doc.setTextColor(
                            71,
                            85,
                            105
                        );
                        doc.setFont(
                            "helvetica",
                            "normal"
                        );
                        doc.text(
                            formatDate(
                                income.receivedDate
                            ),
                            125,
                            y + 7
                        );
                        doc.text(
                            String(
                                income.note ||
                                "-"
                            ).substring(
                                0,
                                28
                            ),
                            160,
                            y + 7
                        );
                        y += 11;
                    }
                );
            }
            // =================================================
            // EXPENSE SECTION
            // =================================================
            y += 8;
            if (
                y >
                pageHeight - 70
            ) {
                doc.addPage();
                y = 20;
            }
            doc.setTextColor(
                225,
                29,
                72
            );
            doc.setFont(
                "helvetica",
                "bold"
            );
            doc.setFontSize(14);
            doc.text(
                "Expense Transactions",
                margin,
                y
            );
            y += 8;
            // Expense header
            doc.setFillColor(
                255,
                241,
                242
            );
            doc.rect(
                margin,
                y,
                tableWidth,
                9,
                "F"
            );
            doc.setTextColor(
                71,
                85,
                105
            );
            doc.setFont(
                "helvetica",
                "bold"
            );
            doc.setFontSize(8);
            doc.text(
                "TITLE",
                margin + 3,
                y + 6
            );
            doc.text(
                "CATEGORY",
                72,
                y + 6
            );
            doc.text(
                "AMOUNT",
                115,
                y + 6
            );
            doc.text(
                "DATE",
                155,
                y + 6
            );
            y += 9;
            if (monthlyExpenses.length === 0) {
                doc.setFont(
                    "helvetica",
                    "normal"
                );
                doc.setTextColor(
                    100,
                    116,
                    139
                );
                doc.text(
                    "No expense records for this month.",
                    margin + 3,
                    y + 7
                );
                y += 14;
            } else {
                monthlyExpenses.forEach(
                    (expense) => {
                        if (
                            y >
                            pageHeight - 30
                        ) {
                            doc.addPage();
                            y = 20;
                        }
                        doc.setTextColor(
                            30,
                            41,
                            59
                        );
                        doc.setFont(
                            "helvetica",
                            "normal"
                        );
                        doc.setFontSize(8);
                        doc.text(
                            String(
                                expense.title ||
                                "-"
                            ).substring(
                                0,
                                25
                            ),
                            margin + 3,
                            y + 7
                        );
                        doc.text(
                            String(
                                expense.category ||
                                "-"
                            ),
                            72,
                            y + 7
                        );
                        doc.setTextColor(
                            225,
                            29,
                            72
                        );
                        doc.setFont(
                            "helvetica",
                            "bold"
                        );
                        doc.text(
                            formatCurrency(
                                expense.amount
                            ),
                            115,
                            y + 7
                        );
                        doc.setTextColor(
                            71,
                            85,
                            105
                        );
                        doc.setFont(
                            "helvetica",
                            "normal"
                        );
                        doc.text(
                            formatDate(
                                expense.transactionDate
                            ),
                            155,
                            y + 7
                        );
                        y += 11;
                    }
                );
            }
            // =================================================
            // FINAL BALANCE
            // =================================================
            y += 12;
            if (
                y >
                pageHeight - 45
            ) {
                doc.addPage();
                y = 25;
            }
            doc.setDrawColor(
                203,
                213,
                225
            );
            doc.line(
                margin,
                y,
                pageWidth - margin,
                y
            );
            y += 12;
            doc.setTextColor(
                15,
                23,
                42
            );
            doc.setFont(
                "helvetica",
                "bold"
            );
            doc.setFontSize(13);
            doc.text(
                "FINAL MONTHLY BALANCE",
                margin,
                y
            );
            doc.setTextColor(
                monthlyBalance >= 0
                    ? 5
                    : 225,
                monthlyBalance >= 0
                    ? 150
                    : 29,
                monthlyBalance >= 0
                    ? 105
                    : 72
            );
            doc.setFontSize(16);
            doc.text(
                formatCurrency(
                    monthlyBalance
                ),
                pageWidth - margin,
                y,
                {
                    align: "right",
                }
            );
            // =================================================
            // CALCULATION
            // =================================================
            y += 12;
            doc.setFont(
                "helvetica",
                "normal"
            );
            doc.setFontSize(9);
            doc.setTextColor(
                100,
                116,
                139
            );
            doc.text(
                "Balance = Total Income - Total Expenses",
                margin,
                y
            );
            // =================================================
            // FOOTER
            // =================================================
            const totalPages =
                doc.getNumberOfPages();
            for (
                let page = 1;
                page <= totalPages;
                page++
            ) {
                doc.setPage(page);
                doc.setFont(
                    "helvetica",
                    "normal"
                );
                doc.setFontSize(8);
                doc.setTextColor(
                    148,
                    163,
                    184
                );
                doc.text(
                    "Generated by Expense Tracker",
                    margin,
                    pageHeight - 10
                );
                doc.text(
                    `Page ${page} of ${totalPages}`,
                    pageWidth - margin,
                    pageHeight - 10,
                    {
                        align: "right",
                    }
                );
            }
            // =================================================
            // SAVE
            // =================================================
            const fileName =
                `monthly-report-${selectedMonth}.pdf`;
            doc.save(fileName);
            setSuccess(
                `Monthly report downloaded successfully for ${formatMonthName(selectedMonth)}.`
            );
        } catch (err) {
            console.error(
                "PDF generation error:",
                err
            );
            setError(
                "Failed to generate monthly PDF."
            );
        } finally {
            setPdfLoading(false);
        }
    };
    // =========================================================
    // LOADING
    // =========================================================
    if (loading) {
        return (
            <div
                className="flex min-h-[500px] items-center justify-center"
            >
                <div className="text-center">
                    <div
                        className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"
                    />
                    <p className="mt-4 text-sm text-slate-500">
                        Loading monthly report...
                    </p>
                </div>
            </div>
        );
    }
    // =========================================================
    // UI
    // =========================================================
    return (
        <div className="w-full space-y-8 pb-10">
            {/* =================================================
                HEADER
            ================================================= */}
            <div
                className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
            >
                <div>
                    <p className="text-sm font-semibold text-indigo-600">
                        Financial Reports
                    </p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                        Monthly Report
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        View and download your complete monthly financial report.
                    </p>
                </div>
                {/* MONTH + DOWNLOAD */}
                <div
                    className="flex flex-col gap-3 sm:flex-row"
                >
                    <div className="relative">
                        <CalendarDays
                            size={18}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
                        />
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(event) => {
                                setSelectedMonth(
                                    event.target.value
                                );
                                setSuccess("");
                                setError("");
                            }}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-3 pl-10 text-sm font-semibold text-slate-700 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={
                            handleDownloadPdf
                        }
                        disabled={pdfLoading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {pdfLoading ? (
                            <>
                                <div
                                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                                />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Download size={17} />
                                Download PDF
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={loadReportData}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>
            {/* =================================================
                MESSAGES
            ================================================= */}
            {error && (
                <div
                    className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}
            {success && (
                <div
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
                >
                    {success}
                </div>
            )}
            {/* =================================================
                MONTH
            ================================================= */}
            <div
                className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-purple-50 to-white px-6 py-5"
            >
                <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600"
                >
                    <CalendarDays size={21} />
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                        Report Period
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-950">
                        {formatMonthName(
                            selectedMonth
                        )}
                    </p>
                </div>
            </div>
            {/* =================================================
                SUMMARY
            ================================================= */}
            <div
                className="grid grid-cols-1 gap-5 md:grid-cols-3"
            >
                {/* INCOME */}
                <div
                    className="rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 p-6 text-white shadow-sm"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-emerald-100">
                                Total Income
                            </p>
                            <p className="mt-1 text-xs text-emerald-100/80">
                                {monthlyIncomes.length} transactions
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                            <TrendingUp size={21} />
                        </div>
                    </div>
                    <p className="mt-6 text-3xl font-bold">
                        {formatCurrency(
                            totalMonthlyIncome
                        )}
                    </p>
                </div>
                {/* EXPENSE */}
                <div
                    className="rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 p-6 text-white shadow-sm"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-rose-100">
                                Total Expenses
                            </p>
                            <p className="mt-1 text-xs text-rose-100/80">
                                {monthlyExpenses.length} transactions
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                            <TrendingDown size={21} />
                        </div>
                    </div>
                    <p className="mt-6 text-3xl font-bold">
                        {formatCurrency(
                            totalMonthlyExpense
                        )}
                    </p>
                </div>
                {/* BALANCE */}
                <div
                    className={`rounded-2xl p-6 text-white shadow-sm ${ monthlyBalance >= 0 ? "bg-gradient-to-br from-blue-500 to-indigo-600" : "bg-gradient-to-br from-orange-500 to-red-600" }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/80">
                                Balance
                            </p>
                            <p className="mt-1 text-xs text-white/70">
                                Income - Expenses
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                            <Wallet size={21} />
                        </div>
                    </div>
                    <p className="mt-6 text-3xl font-bold">
                        {formatCurrency(
                            monthlyBalance
                        )}
                    </p>
                </div>
            </div>
            {/* =================================================
                TRANSACTIONS
            ================================================= */}
            <div
                className="grid grid-cols-1 gap-6 xl:grid-cols-2"
            >
                {/* INCOME */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <ArrowUpCircle size={20} />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-950">
                                    Income
                                </h2>
                                <p className="text-xs text-slate-500">
                                    {formatMonthName(
                                        selectedMonth
                                    )}
                                </p>
                            </div>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                            {monthlyIncomes.length}
                        </span>
                    </div>
                    {monthlyIncomes.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <Receipt
                                size={30}
                                className="mx-auto text-slate-300"
                            />
                            <p className="mt-3 text-sm text-slate-500">
                                No income records for this month.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {monthlyIncomes.map(
                                (income) => (
                                    <div
                                        key={
                                            income.id
                                        }
                                        className="flex items-center justify-between gap-4 px-6 py-4"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {
                                                    income.source
                                                }
                                            </p>
                                            <p className="mt-1 text-xs text-slate-400">
                                                {
                                                    formatDate(
                                                        income.receivedDate
                                                    )
                                                }
                                            </p>
                                        </div>
                                        <p className="font-bold text-emerald-600">
                                            +
                                            {" "}
                                            {formatCurrency(
                                                income.amount
                                            )}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
                {/* EXPENSE */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                                <ArrowDownCircle size={20} />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-950">
                                    Expenses
                                </h2>
                                <p className="text-xs text-slate-500">
                                    {formatMonthName(
                                        selectedMonth
                                    )}
                                </p>
                            </div>
                        </div>
                        <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
                            {monthlyExpenses.length}
                        </span>
                    </div>
                    {monthlyExpenses.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <Receipt
                                size={30}
                                className="mx-auto text-slate-300"
                            />
                            <p className="mt-3 text-sm text-slate-500">
                                No expense records for this month.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {monthlyExpenses.map(
                                (expense) => (
                                    <div
                                        key={
                                            expense.id
                                        }
                                        className="flex items-center justify-between gap-4 px-6 py-4"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {
                                                    expense.title
                                                }
                                            </p>
                                            <div className="mt-1 flex gap-2">
                                                <span className="text-xs text-slate-400">
                                                    {
                                                        expense.category
                                                    }
                                                </span>
                                                <span className="text-xs text-slate-300">
                                                    •
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {
                                                        formatDate(
                                                            expense.transactionDate
                                                        )
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        <p className="font-bold text-rose-600">
                                            -
                                            {" "}
                                            {formatCurrency(
                                                expense.amount
                                            )}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
            {/* =================================================
                CALCULATION
            ================================================= */}
            <div
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <FileText size={19} />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-950">
                            Monthly Calculation
                        </h2>
                        <p className="text-xs text-slate-500">
                            Balance calculation for {formatMonthName(selectedMonth)}
                        </p>
                    </div>
                </div>
                <div
                    className="mt-6 grid gap-4 md:grid-cols-3"
                >
                    <div className="rounded-xl bg-emerald-50 p-4">
                        <p className="text-xs font-semibold uppercase text-emerald-600">
                            Income
                        </p>
                        <p className="mt-2 text-xl font-bold text-emerald-700">
                            {formatCurrency(
                                totalMonthlyIncome
                            )}
                        </p>
                    </div>
                    <div className="rounded-xl bg-rose-50 p-4">
                        <p className="text-xs font-semibold uppercase text-rose-600">
                            Expenses
                        </p>
                        <p className="mt-2 text-xl font-bold text-rose-700">
                            {formatCurrency(
                                totalMonthlyExpense
                            )}
                        </p>
                    </div>
                    <div
                        className={`rounded-xl p-4 ${ monthlyBalance >= 0 ? "bg-blue-50" : "bg-orange-50" }`}
                    >
                        <p
                            className={`text-xs font-semibold uppercase ${ monthlyBalance >= 0 ? "text-blue-600" : "text-orange-600" }`}
                        >
                            Balance
                        </p>
                        <p
                            className={`mt-2 text-xl font-bold ${ monthlyBalance >= 0 ? "text-blue-700" : "text-orange-700" }`}
                        >
                            {formatCurrency(
                                monthlyBalance
                            )}
                        </p>
                    </div>
                </div>
                <div className="mt-5 rounded-xl bg-slate-50 px-5 py-4">
                    <p className="text-center text-sm text-slate-500">
                        <span className="font-semibold text-slate-700">
                            Balance
                        </span>
                        {" = "}
                        <span className="font-semibold text-emerald-600">
                            {formatCurrency(
                                totalMonthlyIncome
                            )}
                        </span>
                        {" - "}
                        <span className="font-semibold text-rose-600">
                            {formatCurrency(
                                totalMonthlyExpense
                            )}
                        </span>
                        {" = "}
                        <span
                            className={`font-bold ${ monthlyBalance >= 0 ? "text-blue-600" : "text-orange-600" }`}
                        >
                            {formatCurrency(
                                monthlyBalance
                            )}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default Reports;