import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export const attachRequestId = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const requestId = randomUUID();

    res.setHeader("X-Request-Id", requestId);

    next();
};
