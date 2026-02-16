import { baseApi } from "./baseApi";

export interface Driver {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    zone: string;
    capacity: number;
    currentLoad: number;
    isAvailable: boolean;
    shiftStart: string;
    shiftEnd: string;
}

export const driverApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDrivers: builder.query<Driver[], void>({
            query: () => "/drivers",
            providesTags: ["Driver"]
        }),
        updateDriverAvailability: builder.mutation<Driver, { id: string; isAvailable: boolean }>({
            query: ({ id, isAvailable }) => ({
                url: `/drivers/${id}/availability`,
                method: "PATCH",
                body: { isAvailable }
            }),
            invalidatesTags: ["Driver"]
        }),
        updateDriver: builder.mutation<Driver, { id: string; zone?: string; capacity?: number; shiftStart?: string; shiftEnd?: string }>({
            query: ({ id, ...body }) => ({
                url: `/drivers/${id}`,
                method: "PATCH",
                body
            }),
            invalidatesTags: ["Driver"]
        })
    })
});

export const {
    useGetDriversQuery,
    useUpdateDriverAvailabilityMutation,
    useUpdateDriverMutation
} = driverApi;
