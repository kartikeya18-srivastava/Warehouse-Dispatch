import { eventBus } from "../utils/eventBus";
import { createNotification } from "../repositories/notification.repository";
import { Types } from "mongoose";
import { Driver } from "../models/driver.model";
import { User } from "../models/user.model";
import { UserRole } from "../constants/roles";

const getDriverUserId = async (driverId: string) => {
    const driver = await Driver.findById(driverId);
    return driver?.userId;
};

const notifyManagers = async (title: string, message: string) => {
    const managers = await User.find({ role: UserRole.WAREHOUSE_MANAGER });
    for (const manager of managers) {
        await createNotification(
            manager._id as Types.ObjectId,
            title,
            message
        );
    }
};

eventBus.on(
    "dispatch_assigned",
    async (data: { driverId: string; shipmentCount: number }) => {
        const userId = await getDriverUserId(data.driverId);
        if (userId) {
            await createNotification(
                userId as Types.ObjectId,
                "New Dispatch Assigned",
                `You have ${data.shipmentCount} new shipments assigned to your route`
            );
        }
    }
);

eventBus.on(
    "delivery_completed",
    async (data: { driverId: string; shipmentId: string }) => {
        const userId = await getDriverUserId(data.driverId);
        if (userId) {
            await createNotification(
                userId as Types.ObjectId,
                "Delivery Completed",
                `Shipment ${data.shipmentId} delivered successfully`
            );
        }
    }
);

eventBus.on(
    "delivery_exception",
    async (data: { driverId: string; shipmentId: string }) => {
        const userId = await getDriverUserId(data.driverId);
        if (userId) {
            await createNotification(
                userId as Types.ObjectId,
                "Delivery Exception",
                `Urgent: Shipment ${data.shipmentId} had an exception`
            );
        }

        // Also notify managers
        await notifyManagers(
            "Urgent: Delivery Exception",
            `Driver reported an issue with shipment ${data.shipmentId}`
        );
    }
);
