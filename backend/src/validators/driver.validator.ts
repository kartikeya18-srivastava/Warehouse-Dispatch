import { z } from "zod";

export const createDriverSchema = z.object({
    userId: z.string().min(1),
    zone: z.string().min(1),
    capacity: z.number().positive(),
    shiftStart: z.string(),
    shiftEnd: z.string()
});

export const updateAvailabilitySchema = z.object({
    isAvailable: z.boolean()
});
