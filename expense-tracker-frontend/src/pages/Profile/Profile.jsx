import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
    updateUserProfile,
    changePassword,
} from "../../api/userApi";

import {
    User,
    Mail,
    MapPin,
    Lock,
    Eye,
    EyeOff,
    Pencil,
    Save,
    X,
    CheckCircle2,
    AlertCircle,
    ShieldCheck,
    LogOut,
    KeyRound,
} from "lucide-react";


const Profile = () => {

    const navigate = useNavigate();


    const {
        user,
        updateUser,
        logout,
    } = useAuth();


    // =========================================================
    // PROFILE STATE
    // =========================================================

    const [isEditing, setIsEditing] = useState(false);

    const [profileData, setProfileData] = useState({
        name: "",
        address: "",
    });


    const [profileLoading, setProfileLoading] =
        useState(false);

    const [profileMessage, setProfileMessage] =
        useState("");

    const [profileError, setProfileError] =
        useState("");


    // =========================================================
    // PASSWORD STATE
    // =========================================================

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });


    const [passwordLoading, setPasswordLoading] =
        useState(false);

    const [passwordMessage, setPasswordMessage] =
        useState("");

    const [passwordError, setPasswordError] =
        useState("");


    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


    // =========================================================
    // LOAD USER DATA
    // =========================================================

    useEffect(() => {

        if (user) {

            setProfileData({
                name: user.name || "",
                address: user.address || "",
            });

        }

    }, [user]);


    // =========================================================
    // PROFILE INPUT
    // =========================================================

    const handleProfileChange = (event) => {

        const {
            name,
            value,
        } = event.target;


        setProfileData((previous) => ({
            ...previous,
            [name]: value,
        }));

    };


    // =========================================================
    // PASSWORD INPUT
    // =========================================================

    const handlePasswordChange = (event) => {

        const {
            name,
            value,
        } = event.target;


        setPasswordData((previous) => ({
            ...previous,
            [name]: value,
        }));

    };


    // =========================================================
    // UPDATE PROFILE
    // =========================================================

    const handleProfileSubmit = async (event) => {

        event.preventDefault();

        setProfileMessage("");
        setProfileError("");
        setProfileLoading(true);


        try {

            const response =
                await updateUserProfile(profileData);


            if (response.success && response.data) {

                updateUser(response.data);


                setProfileMessage(
                    "Profile updated successfully."
                );


                setIsEditing(false);

            } else {

                throw new Error(
                    response.message ||
                    "Failed to update profile"
                );

            }


        } catch (error) {

            console.error(
                "Profile update error:",
                error
            );


            setProfileError(
                error.response?.data?.message ||
                error.message ||
                "Failed to update profile"
            );


        } finally {

            setProfileLoading(false);

        }

    };


    // =========================================================
    // CANCEL EDIT
    // =========================================================

    const handleCancelEdit = () => {

        setProfileData({
            name: user?.name || "",
            address: user?.address || "",
        });


        setProfileMessage("");
        setProfileError("");

        setIsEditing(false);

    };


    // =========================================================
    // CHANGE PASSWORD
    // =========================================================

    const handlePasswordSubmit = async (event) => {

        event.preventDefault();

        setPasswordMessage("");
        setPasswordError("");


        // Password match validation

        if (
            passwordData.newPassword !==
            passwordData.confirmPassword
        ) {

            setPasswordError(
                "New passwords do not match."
            );

            return;
        }


        // Empty validation

        if (
            !passwordData.currentPassword ||
            !passwordData.newPassword
        ) {

            setPasswordError(
                "Please fill in all password fields."
            );

            return;
        }


        setPasswordLoading(true);


        try {

            const response =
                await changePassword({

                    currentPassword:
                    passwordData.currentPassword,

                    newPassword:
                    passwordData.newPassword,

                });


            if (response.success) {

                setPasswordMessage(
                    "Password changed successfully."
                );


                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });

            } else {

                throw new Error(
                    response.message ||
                    "Failed to change password"
                );

            }


        } catch (error) {

            console.error(
                "Change password error:",
                error
            );


            setPasswordError(
                error.response?.data?.message ||
                error.message ||
                "Failed to change password"
            );


        } finally {

            setPasswordLoading(false);

        }

    };


    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        logout();

        navigate(
            "/login",
            {
                replace: true,
            }
        );

    };


    // =========================================================
    // PASSWORD INPUT COMPONENT
    // =========================================================

    const PasswordInput = ({
                               id,
                               name,
                               label,
                               value,
                               show,
                               setShow,
                           }) => {

        return (

            <div>

                <label
                    htmlFor={id}
                    className="
                        mb-2
                        block
                        text-sm
                        font-semibold
                        text-slate-700
                    "
                >
                    {label}
                </label>


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
                        id={id}
                        type={show ? "text" : "password"}
                        name={name}
                        value={value}
                        onChange={handlePasswordChange}
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
                            focus:border-purple-500
                            focus:bg-white
                            focus:ring-4
                            focus:ring-purple-100
                        "
                    />


                    <button
                        type="button"
                        onClick={() => setShow(!show)}
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
                    >

                        {show ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}

                    </button>

                </div>

            </div>

        );

    };


    // =========================================================
    // RETURN
    // =========================================================

    return (

        <div className="space-y-8">


            {/* =================================================
                HEADER
            ================================================= */}

            <div>

                <div className="flex items-center gap-3">

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-gradient-to-br
                            from-blue-500
                            to-purple-600
                            text-white
                            shadow-lg
                            shadow-purple-500/20
                        "
                    >

                        <User size={21} />

                    </div>


                    <div>

                        <h1 className="text-3xl font-bold text-slate-900">
                            Profile
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage your account information and security.
                        </p>

                    </div>

                </div>

            </div>


            {/* =================================================
                PROFILE CARD
            ================================================= */}

            <div
                className="
                    overflow-hidden
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                "
            >


                {/* Profile Header */}

                <div
                    className="
                        bg-gradient-to-r
                        from-blue-600
                        via-indigo-600
                        to-purple-600
                        px-6
                        py-8
                        sm:px-8
                    "
                >

                    <div className="flex items-center gap-5">


                        {/* Avatar */}

                        <div
                            className="
                                flex
                                h-20
                                w-20
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                border-4
                                border-white/20
                                bg-white/20
                                text-2xl
                                font-bold
                                text-white
                                backdrop-blur
                            "
                        >

                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}

                        </div>


                        <div className="min-w-0">

                            <h2 className="truncate text-2xl font-bold text-white">
                                {user?.name || "User"}
                            </h2>


                            <div className="mt-1 flex items-center gap-2 text-sm text-blue-100">

                                <Mail size={15} />

                                <span className="truncate">
                                    {user?.email || "No email available"}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Profile Body */}

                <div className="p-6 sm:p-8">


                    {/* Success */}

                    {profileMessage && (

                        <div
                            className="
                                mb-6
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                border
                                border-emerald-200
                                bg-emerald-50
                                px-4
                                py-3
                                text-sm
                                text-emerald-700
                            "
                        >

                            <CheckCircle2 size={18} />

                            {profileMessage}

                        </div>

                    )}


                    {/* Error */}

                    {profileError && (

                        <div
                            className="
                                mb-6
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                text-sm
                                text-red-700
                            "
                        >

                            <AlertCircle size={18} />

                            {profileError}

                        </div>

                    )}


                    <form
                        onSubmit={handleProfileSubmit}
                        className="space-y-6"
                    >


                        {/* Name */}

                        <div>

                            <label
                                htmlFor="name"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                Full Name
                            </label>


                            <div className="relative">

                                <User
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
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={profileData.name}
                                    onChange={handleProfileChange}
                                    disabled={!isEditing}
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
                                        outline-none
                                        transition
                                        focus:border-purple-500
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-purple-100
                                        disabled:cursor-not-allowed
                                        disabled:text-slate-500
                                    "
                                />

                            </div>

                        </div>


                        {/* Email */}

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
                                    type="email"
                                    value={user?.email || ""}
                                    disabled
                                    className="
                                        w-full
                                        cursor-not-allowed
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-100
                                        py-3.5
                                        pl-11
                                        pr-4
                                        text-sm
                                        text-slate-500
                                    "
                                />

                            </div>


                            <p className="mt-2 text-xs text-slate-400">
                                Email address cannot be changed.
                            </p>

                        </div>


                        {/* Address */}

                        <div>

                            <label
                                htmlFor="address"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                Address
                            </label>


                            <div className="relative">

                                <MapPin
                                    size={18}
                                    className="
                                        pointer-events-none
                                        absolute
                                        left-4
                                        top-5
                                        text-slate-400
                                    "
                                />


                                <textarea
                                    id="address"
                                    name="address"
                                    value={profileData.address}
                                    onChange={handleProfileChange}
                                    disabled={!isEditing}
                                    rows="3"
                                    className="
                                        w-full
                                        resize-none
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        py-3.5
                                        pl-11
                                        pr-4
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-purple-500
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-purple-100
                                        disabled:cursor-not-allowed
                                        disabled:text-slate-500
                                    "
                                />

                            </div>

                        </div>


                        {/* Buttons */}

                        {!isEditing ? (

                            <button
                                type="button"
                                onClick={() => {

                                    setProfileMessage("");
                                    setProfileError("");
                                    setIsEditing(true);

                                }}
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-gradient-to-r
                                    from-blue-600
                                    to-purple-600
                                    px-5
                                    py-3
                                    text-sm
                                    font-bold
                                    text-white
                                    shadow-lg
                                    shadow-purple-500/20
                                    transition
                                    hover:from-blue-700
                                    hover:to-purple-700
                                "
                            >

                                <Pencil size={17} />

                                Edit Profile

                            </button>

                        ) : (

                            <div className="flex flex-wrap gap-3">

                                <button
                                    type="submit"
                                    disabled={profileLoading}
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        bg-gradient-to-r
                                        from-blue-600
                                        to-purple-600
                                        px-5
                                        py-3
                                        text-sm
                                        font-bold
                                        text-white
                                        transition
                                        hover:from-blue-700
                                        hover:to-purple-700
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >

                                    <Save size={17} />

                                    {profileLoading
                                        ? "Saving..."
                                        : "Save Changes"}

                                </button>


                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    disabled={profileLoading}
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        px-5
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                        transition
                                        hover:bg-slate-50
                                        disabled:opacity-60
                                    "
                                >

                                    <X size={17} />

                                    Cancel

                                </button>

                            </div>

                        )}

                    </form>

                </div>

            </div>


            {/* =================================================
                CHANGE PASSWORD
            ================================================= */}

            <div
                className="
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    shadow-sm
                    sm:p-8
                "
            >

                <div className="mb-7 flex items-start gap-4">

                    <div
                        className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-purple-100
                            text-purple-600
                        "
                    >

                        <KeyRound size={22} />

                    </div>


                    <div>

                        <h2 className="text-xl font-bold text-slate-900">
                            Change Password
                        </h2>


                        <p className="mt-1 text-sm text-slate-500">
                            Keep your account secure with a strong password.
                        </p>

                    </div>

                </div>


                {/* Password messages */}

                {passwordMessage && (

                    <div
                        className="
                            mb-6
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            border
                            border-emerald-200
                            bg-emerald-50
                            px-4
                            py-3
                            text-sm
                            text-emerald-700
                        "
                    >

                        <CheckCircle2 size={18} />

                        {passwordMessage}

                    </div>

                )}


                {passwordError && (

                    <div
                        className="
                            mb-6
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-sm
                            text-red-700
                        "
                    >

                        <AlertCircle size={18} />

                        {passwordError}

                    </div>

                )}


                <form
                    onSubmit={handlePasswordSubmit}
                    className="space-y-5"
                >


                    <PasswordInput
                        id="currentPassword"
                        name="currentPassword"
                        label="Current Password"
                        value={passwordData.currentPassword}
                        show={showCurrentPassword}
                        setShow={setShowCurrentPassword}
                    />


                    <PasswordInput
                        id="newPassword"
                        name="newPassword"
                        label="New Password"
                        value={passwordData.newPassword}
                        show={showNewPassword}
                        setShow={setShowNewPassword}
                    />


                    <PasswordInput
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirm New Password"
                        value={passwordData.confirmPassword}
                        show={showConfirmPassword}
                        setShow={setShowConfirmPassword}
                    />


                    <button
                        type="submit"
                        disabled={passwordLoading}
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-gradient-to-r
                            from-blue-600
                            to-purple-600
                            px-5
                            py-3
                            text-sm
                            font-bold
                            text-white
                            shadow-lg
                            shadow-purple-500/20
                            transition
                            hover:from-blue-700
                            hover:to-purple-700
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >

                        <Lock size={17} />

                        {passwordLoading
                            ? "Changing..."
                            : "Change Password"}

                    </button>

                </form>


                <div
                    className="
                        mt-6
                        flex
                        items-center
                        gap-2
                        text-xs
                        text-slate-400
                    "
                >

                    <ShieldCheck
                        size={15}
                        className="text-emerald-500"
                    />

                    Your password is securely protected.

                </div>

            </div>


            {/* =================================================
                ACCOUNT
            ================================================= */}

            <div
                className="
                    rounded-3xl
                    border
                    border-red-100
                    bg-white
                    p-6
                    shadow-sm
                    sm:p-8
                "
            >

                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                    <div className="flex items-start gap-4">

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-red-100
                                text-red-600
                            "
                        >

                            <LogOut size={21} />

                        </div>


                        <div>

                            <h2 className="text-xl font-bold text-slate-900">
                                Account
                            </h2>


                            <p className="mt-1 text-sm text-slate-500">
                                Sign out of your Expense Tracker account.
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={handleLogout}
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-red-600
                            px-5
                            py-3
                            text-sm
                            font-bold
                            text-white
                            transition
                            hover:bg-red-700
                        "
                    >

                        <LogOut size={17} />

                        Logout

                    </button>

                </div>

            </div>

        </div>

    );

};


export default Profile;