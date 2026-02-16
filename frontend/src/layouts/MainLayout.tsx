import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

const MainLayout = () => {
    return (
        <div className="flex min-h-screen bg-mesh">
            <Sidebar />

            <main className="flex-1 ml-72 flex flex-col min-h-screen">
                <TopBar />

                <div className="p-8 pb-12 flex-1 outline-none">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
