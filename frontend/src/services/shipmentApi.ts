import { baseApi } from "./baseApi";
import type { Shipment } from "../types";

export const shipmentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getShipments: builder.query<Shipment[], void>({
            query: () => "/shipments",
            providesTags: ["Shipment"]
        }),
        getShipmentById: builder.query<Shipment, string>({
            query: (id) => `/shipments/${id}`,
            providesTags: ["Shipment"]
        }),
        createShipment: builder.mutation<Shipment, Partial<Shipment>>({
            query: (body) => ({
                url: "/shipments",
                method: "POST",
                body
            }),
            invalidatesTags: ["Shipment", "Analytics"]
        }),
        updateShipmentStatus: builder.mutation<Shipment, { id: string; status: string }>({
            query: ({ id, status }) => ({
                url: `/shipments/${id}/status`,
                method: "PATCH",
                body: { status }
            }),
            invalidatesTags: ["Shipment", "Analytics"]
        })
    })
});

export const {
    useGetShipmentsQuery,
    useGetShipmentByIdQuery,
    useCreateShipmentMutation,
    useUpdateShipmentStatusMutation
} = shipmentApi;
