import { useState } from "react";
import { useGetShipmentsQuery } from "../../services/shipmentApi";
import { useStartDeliveryMutation, useCompleteDeliveryMutation, useReportExceptionMutation } from "../../services/deliveryApi";
import Card from "../../components/Card";
import Button from "../../components/Button";
import PoDComponent from "../../components/PoDComponent";
import { useAppSelector } from "../../store/hooks";

const DeliveriesPage = () => {
    const { user } = useAppSelector((state: any) => state.auth);
    const { data: shipments, isLoading } = useGetShipmentsQuery();
    const [startDelivery, { isLoading: isStarting }] = useStartDeliveryMutation();
    const [completeDelivery] = useCompleteDeliveryMutation();
    const [reportException] = useReportExceptionMutation();

    const [activePoD, setActivePoD] = useState<string | null>(null);

    // Filter for shipments assigned to this driver or in-transit
    // In a real app, we'd have a dedicated query for driver's shipments.
    const myShipments = shipments?.filter(s =>
        (s.status === "DISPATCHED" || s.status === "IN_TRANSIT" || s.status === "DELIVERED")
    );

    const handleStart = async (shipmentId: string) => {
        try {
            await startDelivery({ shipmentId, driverId: user?._id || "" }).unwrap();
        } catch (err) {
            console.error("Start failed", err);
        }
    };

    const handlePoDComplete = async (proof: { signatureUrl: string; photoUrl: string }) => {
        if (!activePoD) return;
        try {
            await completeDelivery({
                shipmentId: activePoD,
                ...proof
            }).unwrap();
            setActivePoD(null);
        } catch (err) {
            console.error("Completion failed", err);
        }
    };

    const handleException = async (shipmentId: string) => {
        const reason = prompt("Enter reason for exception (e.g. DAMAGED, REFUSED):");
        if (reason) {
            try {
                await reportException({ shipmentId, exception: reason.toUpperCase() }).unwrap();
            } catch (err) {
                console.error("Report failed", err);
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">My Deliveries</h1>
                    <p className="text-slate-500 font-medium">Manage your active routes and proof of delivery</p>
                </div>
            </div>

            {activePoD && (
                <PoDComponent
                    onComplete={handlePoDComplete}
                    onCancel={() => setActivePoD(null)}
                />
            )}

            <div className="grid grid-cols-1 gap-6">
                {isLoading ? (
                    [1, 2].map(i => <div key={i} className="h-40 bg-white rounded-2xl animate-pulse shadow-sm" />)
                ) : myShipments?.length === 0 ? (
                    <Card className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                        No shipments assigned at the moment
                    </Card>
                ) : (
                    myShipments?.map((s) => (
                        <Card key={s._id} className="group relative overflow-hidden p-0 border-none shadow-xl">
                            <div className="flex flex-col md:flex-row p-8 gap-8 items-center">
                                <div className="flex-1 flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${s.status === 'DELIVERED' ? 'bg-green-50 text-green-500' : 'bg-primary/5 text-primary'
                                        }`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight">{s.trackingId}</h3>
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${s.status === 'DELIVERED' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {s.status}
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <span>{s.origin}</span>
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                            <span className="text-slate-600">{s.destination}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {s.status === "DISPATCHED" && (
                                        <Button
                                            onClick={() => handleStart(s._id)}
                                            isLoading={isStarting}
                                            className="px-8 py-4 uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
                                        >
                                            Start Trip
                                        </Button>
                                    )}
                                    {s.status === "IN_TRANSIT" && (
                                        <>
                                            <Button
                                                onClick={() => setActivePoD(s._id)}
                                                className="px-8 py-4 uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
                                            >
                                                Finish & Sign
                                            </Button>
                                            <Button
                                                onClick={() => handleException(s._id)}
                                                variant="secondary"
                                                className="px-8 py-4 uppercase tracking-widest text-xs text-red-500 hover:text-red-600"
                                            >
                                                Report Issue
                                            </Button>
                                        </>
                                    )}
                                    {s.status === "DELIVERED" && (
                                        <div className="flex items-center gap-2 text-green-500 text-xs font-black uppercase tracking-widest">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                            Delivered
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="absolute left-0 bottom-0 h-1 bg-primary/10 w-full overflow-hidden">
                                {s.status === 'IN_TRANSIT' && (
                                    <div className="h-full bg-primary animate-progress-indefinite w-1/3" />
                                )}
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default DeliveriesPage;
