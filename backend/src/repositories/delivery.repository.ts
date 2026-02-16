import { Delivery, IDelivery } from "../models/delivery.model";
import { Types } from "mongoose";
import { ShipmentStatus } from "../constants/shipmentStatus";
import { ExceptionType } from "../constants/exceptionType";

export const createDeliveryRecord = async (
    shipmentId: Types.ObjectId,
    driverId: Types.ObjectId
): Promise<IDelivery> => {
    return Delivery.create({
        shipmentId,
        driverId,
        status: ShipmentStatus.IN_TRANSIT
    });
};

export const updateDeliveryStatus = async (
    shipmentId: string,
    status: ShipmentStatus
): Promise<IDelivery | null> => {
    return Delivery.findOneAndUpdate(
        { shipmentId },
        { status },
        { new: true }
    );
};

export const addProofOfDelivery = async (
    shipmentId: string,
    signatureUrl: string,
    photoUrl: string
): Promise<IDelivery | null> => {
    return Delivery.findOneAndUpdate(
        { shipmentId },
        {
            proof: { signatureUrl, photoUrl },
            status: ShipmentStatus.DELIVERED
        },
        { new: true }
    );
};

export const addDeliveryException = async (
    shipmentId: string,
    exception: ExceptionType
): Promise<IDelivery | null> => {
    return Delivery.findOneAndUpdate(
        { shipmentId },
        {
            exception,
            status: ShipmentStatus.RETURNED
        },
        { new: true }
    );
};
