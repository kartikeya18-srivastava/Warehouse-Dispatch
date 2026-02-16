import { useGetDispatchesQuery, useAutoAssignDispatchMutation } from "../../services/dispatchApi";
import Card from "../../components/Card";
import Button from "../../components/Button";

const Icons = {
    Zap: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
    )
};

const DispatchPage = () => {
    const { data: dispatches, isLoading, error } = useGetDispatchesQuery();
    const [autoAssign, { isLoading: isAssigning }] = useAutoAssignDispatchMutation();

    const handleAutoAssign = async () => {
        try {
            await autoAssign().unwrap();
        } catch (err) {
            console.error("Auto-assign failed", err);
        }
    };

    const handleExport = () => {
        window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/dispatch/export`, '_blank');
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Dispatch Manifest</h1>
                    <p className="text-slate-500 font-medium">Monitor active dispatches and driver assignments</p>
                </div>
                <div className="flex gap-4">
                    <Button
                        onClick={handleExport}
                        variant="secondary"
                        className="px-6 py-2 uppercase tracking-widest text-[10px] font-black"
                    >
                        Export Manifest
                    </Button>
                    <Button
                        onClick={handleAutoAssign}
                        isLoading={isAssigning}
                        className="flex items-center gap-2 shadow-xl shadow-primary/20"
                    >
                        <Icons.Zap />
                        Auto-Assign
                    </Button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-bold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                    Failed to load dispatches. {(error as any)?.data?.message || "Please check your connection."}
                </div>
            )}

            <Card className="p-0 overflow-hidden border-none shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipment</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Driver</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dispatch Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                [1, 2, 3].map(i => <tr key={i}><td colSpan={4} className="px-6 py-8 animate-pulse bg-slate-50/50" /></tr>)
                            ) : dispatches?.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No active dispatches</td></tr>
                            ) : (
                                dispatches?.map((d) => (
                                    <tr key={d._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5 text-sm font-bold text-slate-900">{d.shipmentId?.trackingId || 'N/A'}</td>
                                        <td className="px-6 py-5 text-sm font-bold text-slate-600">{d.driverId?.userId?.name || 'Unassigned'}</td>
                                        <td className="px-6 py-5">
                                            <span className="text-[10px] font-black px-2 py-1 bg-primary/5 text-primary rounded-md uppercase tracking-wider">
                                                {d.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-xs font-medium text-slate-400">
                                            {new Date(d.dispatchTime).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default DispatchPage;
