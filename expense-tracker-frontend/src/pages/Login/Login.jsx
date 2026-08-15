import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
    WalletCards,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    AlertCircle,
    ShieldCheck,
} from "lucide-react";


const Login = () => {

    const navigate = useNavigate();

    const { login } = useAuth();


    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });


    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);


    // =========================================================
    // HANDLE CHANGE
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
    // SUBMIT
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setLoading(true);


        try {

            const response = await login(formData);

            console.log(
                "LOGIN SUCCESS:",
                response
            );


            navigate(
                "/dashboard",
                {
                    replace: true,
                }
            );


        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );


            setError(
                error.response?.data?.message ||
                error.message ||
                "Invalid email or password"
            );


        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">


            {/* =================================================
                BACKGROUND DECORATIONS
            ================================================= */}

            <div className="pointer-events-none absolute inset-0">

                {/* Purple Glow */}

                <div
                    className="
                        absolute
                        -left-32
                        -top-32
                        h-96
                        w-96
                        rounded-full
                        bg-purple-600/30
                        blur-3xl
                    "
                />


                {/* Blue Glow */}

                <div
                    className="
                        absolute
                        -bottom-32
                        -right-32
                        h-96
                        w-96
                        rounded-full
                        bg-blue-600/25
                        blur-3xl
                    "
                />


                {/* Green Glow */}

                <div
                    className="
                        absolute
                        left-1/2
                        top-1/2
                        h-72
                        w-72
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-emerald-500/10
                        blur-3xl
                    "
                />

            </div>


            {/* =================================================
                LOGIN CONTAINER
            ================================================= */}

            <div className="relative z-10 w-full max-w-md">


                {/* =================================================
                    BRAND
                ================================================= */}

                <div className="mb-7 text-center">


                    {/* Logo */}

                    <div
                        className="
                            mx-auto
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-2xl
                            bg-gradient-to-br
                            from-blue-500
                            to-purple-600
                            text-white
                            shadow-lg
                            shadow-purple-500/20
                        "
                    >

                        <WalletCards size={30} />

                    </div>


                    <h1 className="mt-5 text-3xl font-bold tracking-tight text-white">
                        Expense Tracker
                    </h1>


                    <p className="mt-2 text-sm text-slate-400">
                        Manage your money. Build better habits.
                    </p>

                </div>


                {/* =================================================
                    CARD
                ================================================= */}

                <div
                    className="
                        rounded-3xl
                        border
                        border-white/10
                        bg-white
                        p-7
                        shadow-2xl
                        shadow-black/30
                        sm:p-8
                    "
                >


                    {/* Header */}

                    <div className="mb-7">

                        <h2 className="text-2xl font-bold text-slate-950">
                            Welcome back
                        </h2>


                        <p className="mt-1.5 text-sm text-slate-500">
                            Sign in to continue to your dashboard.
                        </p>

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div
                            className="
                                mb-5
                                flex
                                items-start
                                gap-3
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                text-sm
                                text-red-600
                            "
                        >

                            <AlertCircle
                                size={18}
                                className="mt-0.5 shrink-0"
                            />


                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >


                        {/* =================================================
                            EMAIL
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="email"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                Email Address
                            </label>


                            <div className="relative">

                                <Mail
                                    size={18}
                                    className="
                                        pointer-events-none
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-400
                                    "
                                />


                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    required
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        py-3.5
                                        pl-11
                                        pr-4
                                        text-sm
                                        text-slate-900
                                        outline-none
                                        transition
                                        placeholder:text-slate-400
                                        hover:border-slate-300
                                        focus:border-purple-500
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-purple-100
                                    "
                                />

                            </div>

                        </div>


                        {/* =================================================
                            PASSWORD
                        ================================================= */}

                        <div>

                            <div className="mb-2 flex items-center justify-between">

                                <label
                                    htmlFor="password"
                                    className="
                                        block
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    Password
                                </label>

                            </div>


                            <div className="relative">

                                <Lock
                                    size={18}
                                    className="
                                        pointer-events-none
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-400
                                    "
                                />


                                <input
                                    id="password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        py-3.5
                                        pl-11
                                        pr-12
                                        text-sm
                                        text-slate-900
                                        outline-none
                                        transition
                                        placeholder:text-slate-400
                                        hover:border-slate-300
                                        focus:border-purple-500
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-purple-100
                                    "
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (previous) =>
                                                !previous
                                        )
                                    }
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        flex
                                        h-9
                                        w-9
                                        -translate-y-1/2
                                        items-center
                                        justify-center
                                        rounded-lg
                                        text-slate-400
                                        transition
                                        hover:bg-slate-100
                                        hover:text-slate-700
                                    "
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >

                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}

                                </button>

                            </div>

                        </div>


                        {/* =================================================
                            LOGIN BUTTON
                        ================================================= */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                group
                                flex
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-gradient-to-r
                                from-blue-600
                                to-purple-600
                                px-4
                                py-3.5
                                text-sm
                                font-bold
                                text-white
                                shadow-lg
                                shadow-purple-500/20
                                transition
                                hover:from-blue-700
                                hover:to-purple-700
                                hover:shadow-purple-500/30
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            {loading ? (

                                <>
                                    <div
                                        className="
                                            h-5
                                            w-5
                                            animate-spin
                                            rounded-full
                                            border-2
                                            border-white/30
                                            border-t-white
                                        "
                                    />

                                    Signing in...

                                </>

                            ) : (

                                <>

                                    Sign In

                                    <ArrowRight
                                        size={18}
                                        className="
                                            transition-transform
                                            group-hover:translate-x-1
                                        "
                                    />

                                </>

                            )}

                        </button>

                    </form>


                    {/* =================================================
                        SECURITY INFO
                    ================================================= */}

                    <div
                        className="
                            mt-6
                            flex
                            items-center
                            justify-center
                            gap-2
                            text-xs
                            text-slate-400
                        "
                    >

                        <ShieldCheck
                            size={15}
                            className="text-emerald-500"
                        />

                        Your account is securely protected

                    </div>


                    {/* =================================================
                        REGISTER
                    ================================================= */}

                    <div className="mt-6 border-t border-slate-100 pt-6 text-center">

                        <p className="text-sm text-slate-500">

                            Don't have an account?{" "}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/register")
                                }
                                className="
                                    font-bold
                                    text-purple-600
                                    transition
                                    hover:text-purple-700
                                    hover:underline
                                "
                            >
                                Create account
                            </button>

                        </p>

                    </div>

                </div>


                {/* Footer */}

                <p className="mt-6 text-center text-xs text-slate-500">
                    © 2026 Expense Tracker · Personal Finance
                </p>

            </div>

        </div>

    );

};


export default Login;