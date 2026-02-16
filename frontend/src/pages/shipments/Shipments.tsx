import { useState } from "react";
import { useGetShipmentsQuery, useCreateShipmentMutation } from "../../services/shipmentApi";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";

const Icons = {
    Filter: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
    ),
    Plus: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></svg>
    ),
    Search: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
    )
};

const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
        RECEIVED: "bg-emerald-100 text-emerald-600",
        PACKED: "bg-blue-100 text-blue-600",
        DISPATCHED: "bg-amber-100 text-amber-600",
        IN_TRANSIT: "bg-indigo-100 text-indigo-600",
        DELIVERED: "bg-green-100 text-green-600",
        EXCEPTION: "bg-red-100 text-red-600",
    };

    return (
        <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${colors[status] || "bg-slate-100 text-slate-600"}`}>
            {status}
        </span>
    );
};

const NewShipmentModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [createShipment, { isLoading }] = useCreateShipmentMutation();
    const [isScanning, setIsScanning] = useState(false);
    const [type, setType] = useState<"INBOUND" | "OUTBOUND">("INBOUND");
    const [apiError, setApiError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        trackingId: "",
        sku: "",
        quantity: 1,
        priority: "STANDARD",
        zone: "",
        origin: "WAREHOUSE-MAIN",
        destination: "",
        weight: 1,
        volume: 1
    });

    const handleSimulateScan = () => {
        setIsScanning(true);
        // Simulate a 1.5s scan process
        setTimeout(() => {
            const randomSKU = "SKU-" + Math.floor(1000 + Math.random() * 9000);
            const randomID = "TRK-" + Math.floor(100000 + Math.random() * 900000);
            setFormData(prev => ({ ...prev, sku: randomSKU, trackingId: randomID }));
            setIsScanning(false);
        }, 1500);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError(null);

        // Validation for numbers
        if (isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0) {
            setApiError("Quantity must be a positive number");
            return;
        }
        if (isNaN(Number(formData.weight)) || Number(formData.weight) <= 0) {
            setApiError("Weight must be a positive number");
            return;
        }
        if (isNaN(Number(formData.volume)) || Number(formData.volume) <= 0) {
            setApiError("Volume must be a positive number");
            return;
        }

        try {
            await createShipment({
                ...formData,
                type,
                quantity: Number(formData.quantity),
                weight: Number(formData.weight),
                volume: Number(formData.volume)
            }).unwrap();
            onClose();
        } catch (err: any) {
            console.error("Failed to create shipment:", err);
            setApiError(err?.data?.message || "Failed to create shipment. Please check your permissions and input.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <Card className="w-full max-w-lg p-8 glass shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">New Shipment</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
                    </button>
                </div>

                {apiError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                        {apiError}
                    </div>
                )}

                <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
                    <button
                        type="button"
                        onClick={() => setType("INBOUND")}
                        className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${type === "INBOUND" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        Inbound
                    </button>
                    <button
                        type="button"
                        onClick={() => setType("OUTBOUND")}
                        className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${type === "OUTBOUND" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        Outbound
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <div className="relative group">
                                <Input
                                    label="Tracking ID"
                                    value={formData.trackingId}
                                    onChange={e => setFormData(prev => ({ ...prev, trackingId: e.target.value }))}
                                    placeholder="TRK-XXXXXX"
                                    required
                                />
                                {type === "INBOUND" && (
                                    <button
                                        type="button"
                                        onClick={handleSimulateScan}
                                        className={`absolute right-2 top-8 p-1.5 rounded-lg transition-all ${isScanning ? "bg-primary text-white animate-pulse" : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-primary"}`}
                                        title="Simulate Barcode Scan"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><line x1="8" x2="8" y1="7" y2="17" /><line x1="12" x2="12" y1="7" y2="17" /><line x1="16" x2="16" y1="7" y2="17" /></svg>
                                    </button>
                                )}
                            </div>
                        </div>
                        <Input
                            label="SKU"
                            value={formData.sku}
                            onChange={e => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                            placeholder="SKU-XXXX"
                            required
                        />
                        <Input
                            label="Quantity"
                            type="number"
                            value={formData.quantity}
                            onChange={e => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                            min="1"
                            required
                        />
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-100 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none transition-all"
                            >
                                <option value="STANDARD">Standard</option>
                                <option value="EXPRESS">Express</option>
                                <option value="BULK">Bulk</option>
                            </select>
                        </div>
                        <Input
                            label="Zone"
                            value={formData.zone}
                            onChange={e => setFormData(prev => ({ ...prev, zone: e.target.value }))}
                            placeholder="A1, B2, etc."
                            required
                        />
                        <Input
                            label="Origin"
                            value={formData.origin}
                            onChange={e => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                            required
                        />
                        <Input
                            label="Destination"
                            value={formData.destination}
                            onChange={e => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                            placeholder="City, State"
                            required
                        />
                        <Input
                            label="Weight (kg)"
                            type="number"
                            value={formData.weight}
                            onChange={e => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                            min="0.1"
                            step="0.1"
                            required
                        />
                        <Input
                            label="Volume (m³)"
                            type="number"
                            value={formData.volume}
                            onChange={e => setFormData(prev => ({ ...prev, volume: parseFloat(e.target.value) || 0 }))}
                            min="0.01"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="button" onClick={onClose} variant="secondary" className="flex-1 py-4 uppercase tracking-widest text-xs">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 py-4 uppercase tracking-widest text-xs shadow-xl shadow-primary/20" isLoading={isLoading}>
                            {type === "INBOUND" ? "Receive Shipment" : "Create Order"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

const ShipmentsPage = () => {
    const { data: shipments, isLoading } = useGetShipmentsQuery();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Shipment Management</h1>
                    <p className="text-slate-500 font-medium">Track and organize inbound/outbound shipments</p>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 shadow-xl shadow-primary/20"
                >
                    <Icons.Plus />
                    New Shipment
                </Button>
            </div>

            <NewShipmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Icons.Search />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by Tracking ID, Status, or Zone..."
                        className="w-full pl-12 pr-4 py-3 pb-3.5 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-medium text-slate-700"
                    />
                </div>
                <button className="p-3.5 bg-white border border-slate-100 rounded-xl text-slate-500 hover:text-primary transition-colors">
                    <Icons.Filter />
                </button>
            </div>

            <Card className="p-0 overflow-hidden border-none shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking ID</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                [1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full" /></td>
                                    </tr>
                                ))
                            ) : shipments?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No shipments found</p>
                                    </td>
                                </tr>
                            ) : (
                                shipments?.map((s) => (
                                    <tr key={s._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-bold text-slate-900 font-mono tracking-tight group-hover:text-primary transition-colors">{s.trackingId}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-bold text-slate-600 font-mono">{s.sku}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-black text-slate-900">{s.quantity}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <StatusBadge status={s.status} />
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`text-[10px] font-black ${s.priority === "EXPRESS" ? "text-red-500" :
                                                s.priority === "STANDARD" ? "text-blue-500" : "text-slate-500"
                                                } uppercase tracking-tight`}>
                                                {s.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="text-xs font-black text-slate-400 hover:text-primary uppercase tracking-tighter transition-colors">
                                                Manage Details
                                            </button>
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

export default ShipmentsPage;
