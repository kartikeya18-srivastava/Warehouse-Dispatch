import { useState } from "react";
import { useGetDriversQuery, useUpdateDriverAvailabilityMutation, useUpdateDriverMutation } from "../../services/driverApi";
import type { Driver } from "../../services/driverApi";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";

const ShiftModal = ({ isOpen, onClose, driver }: { isOpen: boolean; onClose: () => void; driver: Driver | null }) => {
    const [updateDriver, { isLoading }] = useUpdateDriverMutation();
    const [formData, setFormData] = useState({
        shiftStart: "",
        shiftEnd: "",
        capacity: 0,
        zone: ""
    });

    useState(() => {
        if (driver) {
            setFormData({
                shiftStart: new Date(driver.shiftStart).toISOString().slice(0, 16),
                shiftEnd: new Date(driver.shiftEnd).toISOString().slice(0, 16),
                capacity: driver.capacity,
                zone: driver.zone
            });
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!driver) return;
        try {
            await updateDriver({
                id: driver._id,
                ...formData
            }).unwrap();
            onClose();
        } catch (err) {
            console.error("Failed to update driver", err);
        }
    };

    if (!isOpen || !driver) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <Card className="w-full max-w-md p-8 glass shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Edit Roster: {driver.userId.name}</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Active Zone"
                        value={formData.zone}
                        onChange={e => setFormData({ ...formData, zone: e.target.value })}
                        required
                    />
                    <Input
                        label="Capacity (kg)"
                        type="number"
                        value={formData.capacity}
                        onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Shift Start"
                            type="datetime-local"
                            value={formData.shiftStart}
                            onChange={e => setFormData({ ...formData, shiftStart: e.target.value })}
                            required
                        />
                        <Input
                            label="Shift End"
                            type="datetime-local"
                            value={formData.shiftEnd}
                            onChange={e => setFormData({ ...formData, shiftEnd: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="button" onClick={onClose} variant="secondary" className="flex-1 py-4 uppercase tracking-widest text-xs">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 py-4 uppercase tracking-widest text-xs shadow-xl shadow-primary/20" isLoading={isLoading}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

const DriversPage = () => {
    const { data: drivers, isLoading, error } = useGetDriversQuery();
    const [updateAvailability] = useUpdateDriverAvailabilityMutation();
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleAvailability = async (id: string, current: boolean) => {
        try {
            await updateAvailability({ id, isAvailable: !current }).unwrap();
        } catch (err) {
            console.error("Failed to update availability", err);
        }
    };

    const handleEdit = (driver: Driver) => {
        setSelectedDriver(driver);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Fleet Management</h1>
                <p className="text-slate-500 font-medium">Manage driver status, capacity, and active zones</p>
            </div>

            {
                error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-bold flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                        Failed to load drivers. {(error as any)?.data?.message || "Please check your connection."}
                    </div>
                )
            }

            <ShiftModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                driver={selectedDriver}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-48 rounded-2xl bg-white shadow-sm animate-pulse" />)
                ) : drivers?.map((driver) => (
                    <Card key={driver._id} className="group relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-2 h-full ${driver.isAvailable ? 'bg-green-500' : 'bg-red-400'}`} />
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-black text-slate-800">{driver.userId?.name || 'Unknown Driver'}</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{driver.zone} Region</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(driver)}
                                    className="p-2 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-primary rounded-lg transition-colors"
                                    title="Edit Roster"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                </button>
                                <button
                                    onClick={() => toggleAvailability(driver._id, driver.isAvailable)}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors ${driver.isAvailable ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'
                                        }`}
                                >
                                    {driver.isAvailable ? 'Available' : 'On Break'}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-black uppercase tracking-tight">
                                    <span className="text-slate-400">Payload Capacity</span>
                                    <span className="text-slate-800">{driver.currentLoad} / {driver.capacity} kg</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-500"
                                        style={{ width: `${(driver.currentLoad / driver.capacity) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span>Shift Ends</span>
                                <span className="text-slate-600">{new Date(driver.shiftEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div >
    );
};

export default DriversPage;
