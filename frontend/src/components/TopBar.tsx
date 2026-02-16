import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const TopBar = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10">
            <div>
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                    Welcome Back
                </h2>
                <p className="text-lg font-bold text-slate-800">
                    {user?.email?.split('@')[0]}
                </p>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-bold text-slate-600">Active Session</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-bold text-slate-800 leading-none">{user?.email?.split('@')[0]}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight mt-1">
                            {user?.role?.replace('_', ' ')}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black">
                        {user?.email?.[0].toUpperCase()}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
