import {
    createDeliveryRecord,
    updateDeliveryStatus,
    addProofOfDelivery,
    addDeliveryException
} from "../repositories/delivery.repository";
import { updateShipmentStatus as updateShipmentRepoStatus } from "../repositories/shipment.repository";
import { AppError } from "../utils/appError";
import { ShipmentStatus } from "../constants/shipmentStatus";
import { ExceptionType } from "../constants/exceptionType";
import { Types } from "mongoose";
import { eventBus } from "../utils/eventBus";

export const startDeliveryService = async (
    shipmentId: string,
    driverId: string
) => {
    // First, create the delivery record
    const delivery = await createDeliveryRecord(
        new Types.ObjectId(shipmentId),
        new Types.ObjectId(driverId)
    );

    // Then, move shipment to IN_TRANSIT
    await updateShipmentRepoStatus(shipmentId, ShipmentStatus.IN_TRANSIT);

    return delivery;
};

export const markInTransitService = async (
    shipmentId: string
) => {
    const delivery = await updateDeliveryStatus(
        shipmentId,
        ShipmentStatus.IN_TRANSIT
    );

    if (!delivery) {
        throw new AppError("Delivery not found", 404);
    }

    return delivery;
};

export const completeDeliveryService = async (
    shipmentId: string,
    signatureUrl: string,
    photoUrl: string
) => {
    const delivery = await addProofOfDelivery(
        shipmentId,
        signatureUrl,
        photoUrl
    );

    if (!delivery) {
        throw new AppError("Delivery not found", 404);
    }

    await updateShipmentRepoStatus(shipmentId, ShipmentStatus.DELIVERED);

    eventBus.emit("delivery_completed", {
        driverId: delivery.driverId.toString(),
        shipmentId
    });

    return delivery;
};

export const reportExceptionService = async (
    shipmentId: string,
    exception: ExceptionType
) => {
    const delivery = await addDeliveryException(
        shipmentId,
        exception
    );

    if (!delivery) {
        throw new AppError("Delivery not found", 404);
    }

    await updateShipmentRepoStatus(shipmentId, ShipmentStatus.RETURNED);

    eventBus.emit("delivery_exception", {
        driverId: delivery.driverId.toString(),
        shipmentId
    });

    return delivery;
};
