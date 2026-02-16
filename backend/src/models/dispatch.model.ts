import { Schema, model, Document, Types } from "mongoose";
import { ShipmentStatus } from "../constants/shipmentStatus";

export interface IDispatch extends Document {
    shipmentId: Types.ObjectId;
    driverId: Types.ObjectId;
    dispatchTime: Date;
    status: ShipmentStatus;
    createdAt: Date;
    updatedAt: Date;
}

const dispatchSchema = new Schema<IDispatch>(
    {
        shipmentId: {
            type: Schema.Types.ObjectId,
            ref: "Shipment",
            required: true,
            index: true
        },
        driverId: {
            type: Schema.Types.ObjectId,
            ref: "Driver",
            required: true,
            index: true
        },
        dispatchTime: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: Object.values(ShipmentStatus),
            required: true
        }
    },
    { timestamps: true }
);

dispatchSchema.index({ status: 1 });
dispatchSchema.index({ shipmentId: 1, status: 1 });
dispatchSchema.index({ dispatchTime: -1 });


export const Dispatch = model<IDispatch>(
    "Dispatch",
    dispatchSchema
);
