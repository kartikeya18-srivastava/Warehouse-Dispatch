import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { logger } from "../utils/logger";

export const errorMiddleware = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (err instanceof AppError) {
        logger.warn({
            message: err.message,
            statusCode: err.statusCode
        });

        res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
        return;
    }

    logger.error({
        message: "Unhandled error",
        error: err
    });

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
};
