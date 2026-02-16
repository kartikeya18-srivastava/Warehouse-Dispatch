import { z } from "zod";
import { UserRole } from "../constants/roles";

export const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.nativeEnum(UserRole),
    zone: z.string().min(1)
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});
