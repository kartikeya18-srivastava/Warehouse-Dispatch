import { Request, Response } from "express";
import { AppError } from "../utils/appError";
import {
    createDriverService,
    updateDriverAvailabilityService,
    updateDriverService,
    getAllDriversService
} from "../services/driver.service";

export const getDriversController = async (
    _req: Request,
    res: Response
): Promise<void> => {
    const drivers = await getAllDriversService();
    res.status(200).json(drivers);
};

export const updateDriverController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id } = req.params;
    const driver = await updateDriverService(id, req.body);

    res.status(200).json({
        success: true,
        data: driver
    });
};

export const createDriverController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { userId, zone, capacity, shiftStart, shiftEnd } =
        req.body;

    const driver = await createDriverService(
        userId,
        zone,
        capacity,
        new Date(shiftStart),
        new Date(shiftEnd)
    );

    res.status(201).json({
        success: true,
        data: driver
    });
};

export const updateAvailabilityController =
    async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { isAvailable } = req.body;

        if (!id) {
            throw new AppError("Driver ID is required", 400);
        }

        const driver =
            await updateDriverAvailabilityService(
                id,
                isAvailable
            );

        res.status(200).json({
            success: true,
            data: driver
        });
    };
