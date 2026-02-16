import { Shipment, IShipment, IShipmentBase } from "../models/shipment.model";
import { Types } from "mongoose";
import { ShipmentStatus } from "../constants/shipmentStatus";
import { ShipmentPriority } from "../constants/priorities";

export const createShipment = async (
    data: Omit<IShipmentBase, "_id" | "createdAt" | "updatedAt">
): Promise<IShipment> => {
    return Shipment.create(data);
};

export const getShipments = async (filter: any = {}): Promise<IShipment[]> => {
    return Shipment.find(filter).sort({
        priority: 1, // Will need to define numeric priority mapping if needed, or just leverage ABC order if EXPRESS < BULK < STANDARD (wait E, B, S... S is last). 
        createdAt: -1
    });
};

export const findShipmentById = async (
    id: string
): Promise<IShipment | null> => {
    return Shipment.findById(id);
};

export const findShipmentByTrackingId = async (
    trackingId: string
): Promise<IShipment | null> => {
    return Shipment.findOne({ trackingId });
};

export const updateShipmentStatus = async (
    id: string,
    status: ShipmentStatus
): Promise<IShipment | null> => {
    return Shipment.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );
};

export const getPendingOutboundShipments = async (): Promise<IShipment[]> => {
    return Shipment.find({
        type: "OUTBOUND",
        status: ShipmentStatus.PACKED
    }).sort({
        priority: 1,
        createdAt: -1
    });
};

export const bulkMarkAsDispatched = async (
    shipmentIds: Types.ObjectId[],
    driverId: Types.ObjectId
): Promise<void> => {
    await Shipment.updateMany(
        { _id: { $in: shipmentIds } },
        {
            status: ShipmentStatus.DISPATCHED,
            assignedDriver: driverId
        }
    );
};
