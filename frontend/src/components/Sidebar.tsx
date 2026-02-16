import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/reducers/authReducer";
import type { RootState } from "../store/store";
import { Icons } from "./IconRegistry";

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("refreshToken");
        navigate("/login");
    };

    const navItems = [
        { label: "Home", path: "/", icon: <Icons.Dashboard className="w-5 h-5" /> },
        { label: "Analytics", path: "/dashboard", icon: <Icons.Dashboard className="w-5 h-5" /> },
        { label: "Shipments", path: "/shipments", icon: <Icons.Package className="w-5 h-5" /> },
        { label: "Dispatch", path: "/dispatch", icon: <Icons.Package className="w-5 h-5" /> },
        { label: "Deliveries", path: "/deliveries", icon: <Icons.Truck className="w-5 h-5" /> },
        { label: "Drivers", path: "/drivers", icon: <Icons.Truck className="w-5 h-5" /> },
        { label: "Alerts", path: "/notifications", icon: <Icons.Dashboard className="w-5 h-5" /> },
    ];

    return (
        <aside className="w-72 h-screen flex flex-col bg-white border-r border-slate-100 shadow-sm fixed left-0 top-0 z-20">
            <div className="p-8 pb-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                        <Icons.Package />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-slate-900">
                        WAREFLOW
                    </span>
                </div>
            </div>

            <nav className="flex-1 px-4 flex flex-col gap-1">
                <p className="px-4 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Main Navigation</p>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-200
                            ${isActive
                                ? "bg-primary/5 text-primary shadow-sm shadow-primary/5"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                            }
                        `}
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 mt-auto">
                <div className="premium-card bg-slate-950 p-6 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all duration-500" />
                    <div className="relative z-10">
                        <p className="text-slate-400 text-xs font-bold uppercase mb-1">{user?.role?.replace("_", " ")}</p>
                        <p className="text-white font-bold truncate mb-4">{user?.email}</p>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-bold transition-colors w-full"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
