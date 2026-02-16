import { Shipment } from "../models/shipment.model";
import { Parser } from "json2csv";
import { ShipmentStatus } from "../constants/shipmentStatus";

export const generateDispatchManifestCSV = async (): Promise<string> => {
    const shipments = await Shipment.find({
        status: ShipmentStatus.DISPATCHED
    })
        .populate("assignedDriverId")
        .lean();

    if (shipments.length === 0) {
        return "";
    }

    const formatted = shipments.map((shipment) => ({
        trackingId: shipment.trackingId,
        zone: shipment.zone,
        priority: shipment.priority,
        weight: shipment.weight,
        volume: shipment.volume,
        driverId: shipment.assignedDriverId?._id?.toString() ?? "N/A",
        dispatchDate: shipment.updatedAt
    }));

    const parser = new Parser({
        fields: [
            "trackingId",
            "zone",
            "priority",
            "weight",
            "volume",
            "driverId",
            "dispatchDate"
        ]
    });

    return parser.parse(formatted);
};
