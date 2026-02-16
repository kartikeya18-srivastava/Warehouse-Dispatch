import { z } from "zod";
import { ShipmentType } from "../constants/shipmentType";
import { ShipmentPriority } from "../constants/priorities";
import { ShipmentStatus } from "../constants/shipmentStatus";

export const createShipmentSchema = z.object({
    trackingId: z.string().min(3),
    sku: z.string().min(1),
    quantity: z.number().int().positive(),
    type: z.nativeEnum(ShipmentType),
    priority: z.nativeEnum(ShipmentPriority),
    zone: z.string().min(1),
    origin: z.string().min(1),
    destination: z.string().min(1),
    weight: z.number().positive(),
    volume: z.number().positive()
});

export const updateStatusSchema = z.object({
    status: z.nativeEnum(ShipmentStatus)
});
