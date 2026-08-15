import {
    LayoutDashboard,
    ArrowDownCircle,
    ArrowUpCircle,
    User,
    LogOut,
    WalletCards,
    FileText,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Income",
            path: "/income",
            icon: ArrowUpCircle,
        },
        {
            name: "Expenses",
            path: "/expenses",
            icon: ArrowDownCircle,
        },
        {
            name: "Reports",
            path: "/reports",
            icon: FileText,
        },
    ];

    return (
        <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950">

            {/* =========================
                LOGO / BRAND
            ========================== */}
            <div className="flex h-20 shrink-0 items-center border-b border-slate-800 px-5">

                <div className="flex items-center gap-3">

                    {/* Logo Icon */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950 shadow-sm">
                        <WalletCards size={21} strokeWidth={2.2} />
                    </div>

                    {/* Brand */}
                    <div>
                        <h1 className="text-sm font-bold tracking-wide text-white">
                            Expense Tracker
                        </h1>

                        <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                            Personal Finance
                        </p>
                    </div>

                </div>

            </div>


            {/* =========================
                NAVIGATION
            ========================== */}
            <nav className="flex-1 overflow-y-auto px-3 py-6">

                <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Overview
                </p>

                <div className="space-y-1.5">

                    {menuItems.map((item) => {

                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `
                                    group
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    px-3
                                    py-3
                                    text-sm
                                    font-medium
                                    transition-all
                                    duration-200
                                    ${
                                        isActive
                                            ? "bg-white text-slate-950 shadow-sm"
                                            : "text-slate-400 hover:bg-slate-900 hover:text-white"
                                    }
                                    `
                                }
                            >

                                {({ isActive }) => (
                                    <>
                                        <Icon
                                            size={18}
                                            strokeWidth={2}
                                            className={
                                                isActive
                                                    ? "text-slate-900"
                                                    : "text-slate-500 transition-colors group-hover:text-white"
                                            }
                                        />

                                        <span className="flex-1">
                                            {item.name}
                                        </span>

                                        {/* Active indicator */}
                                        {isActive && (
                                            <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />
                                        )}
                                    </>
                                )}

                            </NavLink>
                        );
                    })}

                </div>

            </nav>


            {/* =========================
                BOTTOM ACCOUNT SECTION
            ========================== */}
            <div className="shrink-0 border-t border-slate-800 p-3">

                {/* Profile */}
                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `
                        mb-2
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        transition-all
                        duration-200
                        ${
                            isActive
                                ? "bg-slate-900 text-white"
                                : "text-slate-400 hover:bg-slate-900 hover:text-white"
                        }
                        `
                    }
                >

                    {/* Avatar */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">
                        {user?.name
                            ? user.name.charAt(0).toUpperCase()
                            : "U"}
                    </div>

                    {/* User Information */}
                    <div className="min-w-0 flex-1">

                        <p className="truncate text-xs font-semibold text-white">
                            {user?.name || "My Profile"}
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-slate-500">
                            {user?.email || "Account"}
                        </p>

                    </div>

                </NavLink>


                {/* Logout */}
                <button
                    type="button"
                    onClick={handleLogout}
                    className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        text-sm
                        font-medium
                        text-slate-400
                        transition-all
                        duration-200
                        hover:bg-red-500/10
                        hover:text-red-400
                    "
                >

                    <LogOut size={18} />

                    <span>
                        Logout
                    </span>

                </button>

            </div>

        </aside>
    );
};

export default Sidebar;