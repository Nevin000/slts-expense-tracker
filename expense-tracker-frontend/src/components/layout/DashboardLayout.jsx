import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-slate-100">

            <Sidebar />

            <main className="min-h-screen ml-64">

                <div className="p-8">

                    <Outlet />

                </div>

            </main>

        </div>
    );
};

export default DashboardLayout;