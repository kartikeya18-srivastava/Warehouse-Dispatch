import { baseApi } from "./baseApi";

export interface Notification {
    _id: string;
    userId: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: string;
}

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query<Notification[], void>({
            query: () => "/notifications",
            providesTags: ["Notification"]
        }),
        markNotificationRead: builder.mutation<Notification, string>({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: "PATCH"
            }),
            invalidatesTags: ["Notification"]
        })
    })
});

export const { useGetNotificationsQuery, useMarkNotificationReadMutation } = notificationApi;
