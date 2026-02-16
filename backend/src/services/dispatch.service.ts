import { Types } from "mongoose";
import { getPendingOutboundShipments } from "../repositories/shipment.repository";
import { getAvailableDriversByZone, updateDriverLoad } from "../repositories/driver.repository";
import { bulkMarkAsDispatched } from "../repositories/shipment.repository";
import { createDispatchRecords, getDispatches } from "../repositories/dispatch.repository";
import { AppError } from "../utils/appError";
import { ShipmentStatus } from "../constants/shipmentStatus";
import { eventBus } from "../utils/eventBus";

export const getDispatchesService = async () => {
    return getDispatches();
};

export const autoAssignDispatchService = async (): Promise<void> => {
    const shipments = await getPendingOutboundShipments();

    if (shipments.length === 0) {
        throw new AppError("No shipments ready for dispatch", 400);
    }

    // Group shipments by zone
    const zoneMap = new Map<string, typeof shipments>();

    for (const shipment of shipments) {
        const zoneShipments = zoneMap.get(shipment.zone) ?? [];
        zoneShipments.push(shipment);
        zoneMap.set(shipment.zone, zoneShipments);
    }

    for (const [zone, zoneShipments] of zoneMap) {
        let remainingShipments = [...zoneShipments];
        const drivers = await getAvailableDriversByZone(zone);

        if (drivers.length === 0) continue;

        for (const driver of drivers) {
            if (remainingShipments.length === 0) break;

            const availableCapacity = driver.capacity - driver.currentLoad;
            if (availableCapacity <= 0) continue;

            const assignedShipments: typeof shipments = [];
            let usedCapacity = 0;

            for (const shipment of remainingShipments) {
                if (usedCapacity + shipment.weight <= availableCapacity) {
                    assignedShipments.push(shipment);
                    usedCapacity += shipment.weight;
                }
            }

            if (assignedShipments.length === 0) continue;

            const assignedIds = assignedShipments.map(s => s._id as Types.ObjectId);

            await bulkMarkAsDispatched(
                assignedIds,
                driver._id as Types.ObjectId
            );

            await createDispatchRecords(
                assignedIds.map((id) => ({
                    shipmentId: id,
                    driverId: driver._id as Types.ObjectId
                }))
            );

            // Update driver's load
            await updateDriverLoad(
                driver._id.toString(),
                driver.currentLoad + usedCapacity
            );

            // Remove assigned shipments from the pool
            remainingShipments = remainingShipments.filter(
                s => !assignedIds.includes(s._id as Types.ObjectId)
            );

            eventBus.emit("dispatch_assigned", {
                driverId: driver._id.toString(),
                shipmentCount: assignedIds.length
            });
        }
    }
};
