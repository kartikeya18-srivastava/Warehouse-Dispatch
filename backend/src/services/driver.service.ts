import { Types } from "mongoose";
import {
    createDriver,
    findDriverByUserId,
    updateDriverAvailability,
    updateDriverLoad,
    updateDriver
} from "../repositories/driver.repository";
import { AppError } from "../utils/appError";
import { Driver } from "../models/driver.model";

export const createDriverService = async (
    userId: string,
    zone: string,
    capacity: number,
    shiftStart: Date,
    shiftEnd: Date
) => {
    const existing = await findDriverByUserId(userId);

    if (existing) {
        throw new AppError("Driver already exists", 400);
    }

    if (shiftStart >= shiftEnd) {
        throw new AppError("Invalid shift timing", 400);
    }

    return createDriver({
        userId: new Types.ObjectId(userId),
        zone,
        capacity,
        currentLoad: 0,
        isAvailable: true,
        shiftStart,
        shiftEnd
    } as any);
};

export const updateDriverAvailabilityService = async (
    id: string,
    isAvailable: boolean
) => {
    const driver = await updateDriverAvailability(
        id,
        isAvailable
    );

    if (!driver) {
        throw new AppError("Driver not found", 404);
    }

    return driver;
};

export const assignLoadToDriverService = async (
    id: string,
    additionalLoad: number
) => {
    const driver = await updateDriverLoad(
        id,
        additionalLoad
    );

    if (!driver) {
        throw new AppError("Driver not found", 404);
    }

    if (driver.currentLoad > driver.capacity) {
        throw new AppError(
            "Driver capacity exceeded",
            400
        );
    }

    return driver;
};

export const updateDriverService = async (
    id: string,
    updates: Partial<{
        zone: string;
        capacity: number;
        shiftStart: Date;
        shiftEnd: Date;
    }>
) => {
    const driver = await updateDriver(id, updates as any);

    if (!driver) {
        throw new AppError("Driver not found", 404);
    }

    return driver;
};

export const getAllDriversService = async () => {
    return Driver.find().populate("userId");
};
