import { z } from "zod";
import { ExceptionType } from "../constants/exceptionType";

export const proofSchema = z.object({
    signatureUrl: z.string().url(),
    photoUrl: z.string().url()
});

export const exceptionSchema = z.object({
    exception: z.nativeEnum(ExceptionType)
});
