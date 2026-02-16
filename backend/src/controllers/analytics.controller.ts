import { Request, Response } from "express";
import { getKpiDashboardService } from "../services/analytics.service";

export const getDashboardController =
    async (_req: Request, res: Response): Promise<void> => {
        const data = await getKpiDashboardService();

        res.status(200).json({
            success: true,
            data
        });
    };
