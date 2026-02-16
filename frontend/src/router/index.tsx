import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/auth/Register";
import VerifyEmailPage from "../pages/auth/VerifyEmail";
import DashboardPage from "../pages/dashboard/Dashboard";
import HomePage from "../pages/home/Home";
import ShipmentsPage from "../pages/shipments/Shipments";
import DispatchPage from "../pages/dispatch/Dispatch";
import DriversPage from "../pages/drivers/Drivers";
import DeliveriesPage from "../pages/deliveries/Deliveries";
import NotificationsPage from "../pages/notifications/Notifications";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "../router/ProtectedRoute";

export const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            { path: "/login", element: <LoginPage /> },
            { path: "/register", element: <RegisterPage /> },
            { path: "/verify-email", element: <VerifyEmailPage /> }
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
                index: true,
                element: <HomePage />
            },
            {
                path: "/dashboard",
                element: <DashboardPage />
            },
            {
                path: "/shipments",
                element: <ShipmentsPage />
            },
            {
                path: "/dispatch",
                element: <DispatchPage />
            },
            {
                path: "/drivers",
                element: <DriversPage />
            },
            {
                path: "/deliveries",
                element: <DeliveriesPage />
            },
            {
                path: "/notifications",
                element: <NotificationsPage />
            }
        ]
    }
]);
