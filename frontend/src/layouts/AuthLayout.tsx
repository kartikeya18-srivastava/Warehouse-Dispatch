import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-mesh p-4 sm:p-8">
            <div className="w-full max-w-xl animate-fade-in">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
