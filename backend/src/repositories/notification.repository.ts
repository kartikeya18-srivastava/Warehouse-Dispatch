import { Notification, INotification } from "../models/notification.model";
import { Types } from "mongoose";

export const createNotification = async (
    userId: Types.ObjectId,
    title: string,
    message: string
): Promise<INotification> => {
    return Notification.create({
        userId,
        title,
        message
    });
};

export const getUserNotifications = async (
    userId: string
): Promise<INotification[]> => {
    return Notification.find({ userId }).sort({
        createdAt: -1
    });
};

export const markNotificationRead = async (
    id: string
): Promise<INotification | null> => {
    return Notification.findByIdAndUpdate(
        id,
        { isRead: true },
        { new: true }
    );
};
