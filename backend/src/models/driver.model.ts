import { Schema, model, Document, Types } from "mongoose";

export interface IDriver extends Document {
    userId: Types.ObjectId;
    zone: string;
    capacity: number;
    currentLoad: number;
    isAvailable: boolean;
    shiftStart: Date;
    shiftEnd: Date;
    createdAt: Date;
    updatedAt: Date;
}

const driverSchema = new Schema<IDriver>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true
        },
        zone: {
            type: String,
            required: true,
            index: true
        },
        capacity: {
            type: Number,
            required: true
        },
        currentLoad: {
            type: Number,
            default: 0
        },
        isAvailable: {
            type: Boolean,
            default: true,
            index: true
        },
        shiftStart: {
            type: Date,
            required: true
        },
        shiftEnd: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
);

driverSchema.index({ zone: 1, isAvailable: 1 });

export const Driver = model<IDriver>("Driver", driverSchema);
