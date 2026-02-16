import { useGetNotificationsQuery, useMarkNotificationReadMutation } from "../../services/notificationApi";
import Card from "../../components/Card";

const NotificationsPage = () => {
    const { data: notifications, isLoading } = useGetNotificationsQuery();
    const [markRead] = useMarkNotificationReadMutation();

    const handleMarkRead = async (id: string) => {
        try {
            await markRead(id).unwrap();
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">System Alerts</h1>
                <p className="text-slate-500 font-medium">Real-time notifications and operational updates</p>
            </div>

            <div className="max-w-4xl space-y-4">
                {isLoading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-20 rounded-2xl bg-white shadow-sm animate-pulse" />)
                ) : notifications?.length === 0 ? (
                    <Card className="p-20 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 00-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        </div>
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">No Active Notifications</h3>
                    </Card>
                ) : (
                    notifications?.map((notif) => (
                        <Card
                            key={notif._id}
                            className={`p-6 flex items-center justify-between transition-all group ${notif.read ? 'opacity-60 grayscale' : 'border-l-4 border-l-primary'}`}
                        >
                            <div className="flex gap-4 items-center">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${notif.read ? 'bg-slate-100 text-slate-400' : 'bg-primary/10 text-primary'}`}>
                                    <span className="text-xs font-black uppercase">{notif.type[0]}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{notif.message}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                        {new Date(notif.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            {!notif.read && (
                                <button
                                    onClick={() => handleMarkRead(notif._id)}
                                    className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                >
                                    Clear
                                </button>
                            )}
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
