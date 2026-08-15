import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

import Dashboard from "../pages/Dashboard/Dashboard";
import Income from "../pages/Income/Income";
import Expenses from "../pages/Expenses/Expenses";
import Transactions from "../pages/Transactions/Transactions";
import Profile from "../pages/Profile/Profile";
import Reports from "../pages/Reports/Reports.jsx";

import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

const AppRoutes = () => {
    return (
        <Routes>

            {/* ================================
                PUBLIC ROUTES
            ================================= */}

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />


            {/* ================================
                PROTECTED ROUTES
            ================================= */}

            <Route element={<ProtectedRoute />}>

                <Route element={<DashboardLayout />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/income"
                        element={<Income />}
                    />

                    <Route
                        path="/expenses"
                        element={<Expenses />}
                    />

                    <Route
                        path="/reports"
                        element={<Reports />}
                    />

                    <Route
                        path="/profile"
                        element={<Profile />}
                    />


                </Route>

            </Route>


            {/* ================================
                DEFAULT
            ================================= */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />

            <Route
                path="*"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />

        </Routes>
    );
};

export default AppRoutes;