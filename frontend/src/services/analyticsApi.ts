import { baseApi } from "./baseApi";
import type { KpiDashboard } from "../types";

export const analyticsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getKpiDashboard: builder.query<KpiDashboard, void>({
            query: () => "/analytics/dashboard",
            providesTags: ["Analytics"]
        })
    })
});

export const { useGetKpiDashboardQuery } = analyticsApi;
