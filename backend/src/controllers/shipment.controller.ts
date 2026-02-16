import { Request, Response } from "express";
import { AppError } from "../utils/appError";
import {
    createShipmentService,
    updateShipmentStatusService,
    getShipmentsService
} from "../services/shipment.service";

export const getShipmentsController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const filter = req.query;
    const shipments = await getShipmentsService(filter);

    res.status(200).json(shipments); // Flattened response for frontend
};

export const createShipmentController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { trackingId, sku, quantity, type, priority, zone, origin, destination, weight, volume } =
        req.body;

    const shipment = await createShipmentService(
        trackingId,
        sku,
        quantity,
        type,
        priority,
        zone,
        origin,
        destination,
        weight,
        volume
    );

    res.status(201).json({
        success: true,
        data: shipment
    });
};

export const updateShipmentStatusController =
    async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params as { id: string };
        const { status } = req.body;

        if (!id) {
            throw new AppError("Shipment ID is required", 400);
        }

        const shipment =
            await updateShipmentStatusService(id, status);

        res.status(200).json({
            success: true,
            data: shipment
        });
    };
