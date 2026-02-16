import { Request, Response } from "express";
import { generateDispatchManifestCSV } from "../services/export.service";

export const exportDispatchManifestController = async (
    _req: Request,
    res: Response
): Promise<void> => {
    const csv = await generateDispatchManifestCSV();

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=dispatch-manifest.csv"
    );

    res.status(200).send(csv);
};
