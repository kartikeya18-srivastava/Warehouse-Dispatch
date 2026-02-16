import { useGetKpiDashboardQuery } from "../../services/analyticsApi";
import { Link } from "react-router-dom";
import Card from "../../components/Card";
import { Icons } from "../../components/IconRegistry";

const ModuleLink = ({ to, title, description, icon: Icon, color }: any) => (
    <Link to={to} className="group">
        <Card className="h-full hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
            <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">{description}</p>
            <div className="mt-6 flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Explore Module
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </div>
        </Card>
    </Link>
);

const QuickStat = ({ label, value, icon: Icon, color }: any) => (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 backdrop-blur-xl border border-white shadow-sm">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-white shadow-lg shadow-current/20`}>
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-xl font-black text-slate-900 leading-none">{value}</p>
        </div>
    </div>
);

const HomePage = () => {
    const { data: dashboardData, isLoading } = useGetKpiDashboardQuery();

    const modules = [
        {
            to: "/shipments",
            title: "Shipment Tracking",
            description: "Manage inbound and outbound inventory with real-time status updates and tracking.",
            icon: Icons.Package,
            color: "bg-blue-500 shadow-blue-500/30"
        },
        {
            to: "/dispatch",
            title: "Fleet Dispatch",
            description: "Optimize driver assignments and monitor vehicle routes for maximum efficiency.",
            icon: Icons.Truck,
            color: "bg-indigo-500 shadow-indigo-500/30"
        },
        {
            to: "/deliveries",
            title: "Last-Mile Delivery",
            description: "Track final delivery statuses and collect digital proof of delivery instantly.",
            icon: Icons.Dashboard,
            color: "bg-emerald-500 shadow-emerald-500/30"
        },
        {
            to: "/drivers",
            title: "Driver Network",
            description: "Manage your personnel, track performance, and monitor fleet utilization.",
            icon: Icons.Truck,
            color: "bg-amber-500 shadow-amber-500/30"
        }
    ];

    if (isLoading) {
        return (
            <div className="space-y-12 animate-pulse">
                <div className="h-64 bg-white rounded-3xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-white rounded-2xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-12 md:p-20 text-white group">
                <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/20 via-transparent to-transparent opacity-50" />
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/30 rounded-full blur-[100px] group-hover:bg-primary/40 transition-all duration-700" />

                <div className="relative z-10 max-w-2xl">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                        Logistics Intelligence v2.0
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6">
                        Streamline your <span className="text-primary italic">Operations</span> with Wareflow
                    </h1>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">
                        The ultimate warehouse management system for modern logistics. Track every parcel, optimize every route, and empower every driver from a single unified workspace.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <QuickStat
                            label="Total Orders"
                            value={dashboardData?.totalShipments || 0}
                            icon={Icons.Package}
                            color="bg-primary"
                        />
                        <QuickStat
                            label="Active Drivers"
                            value={dashboardData?.activeDrivers || 0}
                            icon={Icons.Truck}
                            color="bg-indigo-500"
                        />
                        <QuickStat
                            label="Delivered"
                            value={dashboardData?.deliveredToday || 0}
                            icon={Icons.Dashboard}
                            color="bg-emerald-500"
                        />
                    </div>
                </div>
            </div>

            {/* Modules Grid */}
            <section className="space-y-8">
                <div className="flex items-end justify-between px-2">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Operational Hub</h2>
                        <p className="text-slate-500 font-medium">Quick access to core warehouse modules</p>
                    </div>
                    <Link to="/shipments" className="text-[10px] font-black text-primary uppercase tracking-widest hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                        View All Shipments
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {modules.map((module, idx) => (
                        <ModuleLink key={idx} {...module} />
                    ))}
                </div>
            </section>

            {/* Performance Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 overflow-hidden group border-none shadow-2xl shadow-slate-200/50" title="System Performance Overview">
                    <div className="relative mt-8 h-48 bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <Icons.Dashboard className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Analytics visualizer coming soon</span>
                        </div>
                        {/* Abstract background elements */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-5">
                            <svg viewBox="0 0 400 200" className="w-full h-full"><path d="M0 100 Q 100 0 200 100 T 400 100" fill="none" stroke="currentColor" strokeWidth="20" /></svg>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8 mt-10">
                        {dashboardData?.shipmentsByStatus?.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item._id}</p>
                                <p className="text-2xl font-black text-slate-900">{item.count}</p>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full mt-2">
                                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '65%' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="bg-primary shadow-2xl shadow-primary/20 border-none text-white relative overflow-hidden" title="Staff Engagement">
                    <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16 blur-3xl" />
                    <div className="space-y-6 mt-8">
                        {dashboardData?.driverUtilization?.slice(0, 4).map((driver, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight">
                                    <span className="opacity-80">{driver.name}</span>
                                    <span>{driver.utilization}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-white shadow-sm"
                                        style={{ width: `${driver.utilization}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-10 py-4 bg-white text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:shadow-xl hover:shadow-white/10 transition-all">
                        View Fleet Details
                    </button>
                </Card>
            </div>
        </div>
    );
};

export default HomePage;
