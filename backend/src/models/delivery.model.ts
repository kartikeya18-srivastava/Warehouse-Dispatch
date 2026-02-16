import { Schema, model, Document, Types } from "mongoose";
import { ShipmentStatus } from "../constants/shipmentStatus";
import { ExceptionType } from "../constants/exceptionType";

export interface IProofOfDelivery {
    signatureUrl: string;
    photoUrl: string;
}

export interface IDelivery extends Document {
    shipmentId: Types.ObjectId;
    driverId: Types.ObjectId;
    status: ShipmentStatus;
    proof?: IProofOfDelivery;
    exception?: ExceptionType;
    createdAt: Date;
    updatedAt: Date;
}

const proofSchema = new Schema<IProofOfDelivery>(
    {
        signatureUrl: { type: String },
        photoUrl: { type: String }
    },
    { _id: false }
);

const deliverySchema = new Schema<IDelivery>(
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
        status: {
            type: String,
            enum: Object.values(ShipmentStatus),
            required: true
        },
        proof: proofSchema,
        exception: {
            type: String,
            enum: Object.values(ExceptionType)
        }
    },
    { timestamps: true }
);

deliverySchema.index({ createdAt: -1 });

export const Delivery = model<IDelivery>(
    "Delivery",
    deliverySchema
);
