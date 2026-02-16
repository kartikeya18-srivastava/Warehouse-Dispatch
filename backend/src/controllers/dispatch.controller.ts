import { Request, Response } from "express";
import { autoAssignDispatchService, getDispatchesService } from "../services/dispatch.service";
import { exportToCsv } from "../utils/export.util";

export const getDispatchesController = async (
    _req: Request,
    res: Response
): Promise<void> => {
    const dispatches = await getDispatchesService();
    res.status(200).json(dispatches);
};

export const exportManifestController = async (
    _req: Request,
    res: Response
): Promise<void> => {
    const dispatches = await getDispatchesService();

    const exportData = dispatches.map((d: any) => ({
        TrackingId: d.shipmentId?.trackingId,
        SKU: d.shipmentId?.sku,
        Quantity: d.shipmentId?.quantity,
        Zone: d.shipmentId?.zone,
        Origin: d.shipmentId?.origin,
        Destination: d.shipmentId?.destination,
        Driver: (d.driverId as any)?.userId?.name || "Unassigned",
        DispatchTime: d.dispatchTime?.toISOString()
    }));

    exportToCsv(res, `manifest-${new Date().toISOString().split('T')[0]}.csv`, exportData);
};

export const autoAssignDispatchController =
    async (_req: Request, res: Response): Promise<void> => {
        await autoAssignDispatchService();

        res.status(200).json({
            success: true,
            message: "Dispatch assignment completed"
        });
    };
