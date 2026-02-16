import {
    getOnTimeDeliveryRate,
    getAverageDispatchTime,
    getTodayShipmentCount,
    getDriverUtilization,
    getDetailedDriverUtilization,
    getRecentActivity,
    getPlatformStats
} from "../repositories/analytics.repository";
import { getCache, setCache } from "../utils/cache";

interface KpiDashboard {
    onTimeRate: number;
    avgDispatchTime: number;
    todayShipments: number;
    driverUtilization: any[];
    recentActivity: any[];
    totalShipments: number;
    dispatchedToday: number;
    deliveredToday: number;
    activeDrivers: number;
}

export const getKpiDashboardService = async (): Promise<KpiDashboard> => {
    const cacheKey = "kpi_dashboard";

    const cached = await getCache<KpiDashboard>(cacheKey);

    if (cached) {
        return cached;
    }

    const [
        onTimeRate,
        avgDispatchTime,
        todayShipments,
        detailedUtilization,
        recentActivity,
        platformStats
    ] = await Promise.all([
        getOnTimeDeliveryRate(),
        getAverageDispatchTime(),
        getTodayShipmentCount(),
        getDetailedDriverUtilization(),
        getRecentActivity(),
        getPlatformStats()
    ]);

    const result: KpiDashboard = {
        onTimeRate,
        avgDispatchTime: Math.round(avgDispatchTime / 60000), // convert ms to mins
        todayShipments,
        driverUtilization: detailedUtilization,
        recentActivity,
        ...platformStats
    };

    await setCache(cacheKey, result, 60);

    return result;
};
