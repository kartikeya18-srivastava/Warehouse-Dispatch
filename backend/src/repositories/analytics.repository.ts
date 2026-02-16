import { Shipment } from "../models/shipment.model";
import { Dispatch } from "../models/dispatch.model";
import { Driver } from "../models/driver.model";
import { ShipmentStatus } from "../constants/shipmentStatus";

export const getOnTimeDeliveryRate = async (): Promise<number> => {
    const totalDelivered = await Shipment.countDocuments({
        status: ShipmentStatus.DELIVERED
    });

    const totalExceptions = await Shipment.countDocuments({
        status: ShipmentStatus.RETURNED
    });

    if (totalDelivered + totalExceptions === 0) return 100;

    return (totalDelivered / (totalDelivered + totalExceptions)) * 100;
};

export const getAverageDispatchTime = async (): Promise<number> => {
    const result = await Dispatch.aggregate([
        {
            $lookup: {
                from: "shipments",
                localField: "shipmentId",
                foreignField: "_id",
                as: "shipment"
            }
        },
        { $unwind: "$shipment" },
        {
            $project: {
                timeDiff: {
                    $subtract: [
                        "$dispatchTime",
                        "$shipment.createdAt"
                    ]
                }
            }
        },
        {
            $group: {
                _id: null,
                avgTime: { $avg: "$timeDiff" }
            }
        }
    ]);

    if (result.length === 0) return 0;

    return result[0].avgTime;
};

export const getTodayShipmentCount = async (): Promise<number> => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    return Shipment.countDocuments({
        createdAt: { $gte: start }
    });
};

export const getDriverUtilization = async (): Promise<number> => {
    const drivers = await Driver.aggregate([
        {
            $group: {
                _id: null,
                totalCapacity: { $sum: "$capacity" },
                totalLoad: { $sum: "$currentLoad" }
            }
        }
    ]);

    if (drivers.length === 0) return 0;

    const { totalCapacity, totalLoad } = drivers[0];

    if (totalCapacity === 0) return 0;

    return (totalLoad / totalCapacity) * 100;
};

export const getDetailedDriverUtilization = async () => {
    const drivers = await Driver.find({ isAvailable: true }).populate("userId", "name");
    return drivers.map(d => ({
        name: (d.userId as any)?.name || "Unknown",
        utilization: Math.round((d.currentLoad / d.capacity) * 100) || 0
    }));
};

export const getRecentActivity = async () => {
    const recentShipments = await Shipment.find().sort({ createdAt: -1 }).limit(5);
    return recentShipments.map(s => ({
        type: "SHIPMENT",
        description: `Shipment ${s.trackingId} created`,
        time: s.createdAt.toLocaleTimeString(),
        status: s.status
    }));
};

export const getPlatformStats = async () => {
    const totalShipments = await Shipment.countDocuments();
    const dispatchedToday = await Shipment.countDocuments({
        status: ShipmentStatus.DISPATCHED,
        updatedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    const deliveredToday = await Shipment.countDocuments({
        status: ShipmentStatus.DELIVERED,
        updatedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    const activeDrivers = await Driver.countDocuments({ isAvailable: true });

    return { totalShipments, dispatchedToday, deliveredToday, activeDrivers };
};
