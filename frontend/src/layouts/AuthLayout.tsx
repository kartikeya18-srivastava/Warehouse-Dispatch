import { Outlet, Link } from "react-router-dom";
import { Icons } from "../components/Icons";

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-mesh font-sans">
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
                <Link to="/" className="flex items-center gap-3 mb-10 group">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-all duration-500">
                        <Icons.Package className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-2xl font-black text-txt-main tracking-tighter uppercase italic">WAREFLOW</span>
                </Link>

                <div className="w-full max-w-xl animate-fade-in">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
