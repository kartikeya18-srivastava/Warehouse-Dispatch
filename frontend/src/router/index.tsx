import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "../router/ProtectedRoute";

const LandingPage = lazy(() => import("../pages/LandingPage"));
const LoginPage = lazy(() => import("../pages/auth/Login"));
const RegisterPage = lazy(() => import("../pages/auth/Register"));
const VerifyEmailPage = lazy(() => import("../pages/auth/VerifyEmail"));
const DashboardPage = lazy(() => import("../pages/dashboard/Dashboard"));
const HomePage = lazy(() => import("../pages/home/Home"));
const ShipmentsPage = lazy(() => import("../pages/shipments/Shipments"));
const AnalyticsPage = lazy(() => import("../pages/analytics/Analytics"));
const DispatchPage = lazy(() => import("../pages/dispatch/Dispatch"));
const DriversPage = lazy(() => import("../pages/drivers/Drivers"));
const DeliveriesPage = lazy(() => import("../pages/deliveries/Deliveries"));
const NotificationsPage = lazy(() => import("../pages/notifications/Notifications"));

const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading...</p>
        </div>
    </div>
);

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<PageLoader />}>
        {children}
    </Suspense>
);

export const router = createBrowserRouter([
    {
        path: "/",
        element: <SuspenseWrapper><LandingPage /></SuspenseWrapper>
    },
    {
        element: <AuthLayout />,
        children: [
            { path: "/login", element: <SuspenseWrapper><LoginPage /></SuspenseWrapper> },
            { path: "/register", element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper> },
            { path: "/verify-email", element: <SuspenseWrapper><VerifyEmailPage /></SuspenseWrapper> }
        ]
    },
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/dashboard",
                element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper>
            },
            {
                path: "/home",
                element: <SuspenseWrapper><HomePage /></SuspenseWrapper>
            },
            {
                path: "/shipments",
                element: <SuspenseWrapper><ShipmentsPage /></SuspenseWrapper>
            },
            {
                path: "/analytics",
                element: <SuspenseWrapper><AnalyticsPage /></SuspenseWrapper>
            },
            {
                path: "/dispatch",
                element: <SuspenseWrapper><DispatchPage /></SuspenseWrapper>
            },
            {
                path: "/drivers",
                element: <SuspenseWrapper><DriversPage /></SuspenseWrapper>
            },
            {
                path: "/deliveries",
                element: <SuspenseWrapper><DeliveriesPage /></SuspenseWrapper>
            },
            {
                path: "/notifications",
                element: <SuspenseWrapper><NotificationsPage /></SuspenseWrapper>
            }
        ]
    }
]);
