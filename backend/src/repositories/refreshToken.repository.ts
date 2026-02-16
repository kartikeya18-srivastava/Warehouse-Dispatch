import { RefreshToken, IRefreshToken } from "../models/refreshToken.model";
import bcrypt from "bcrypt";

export const saveRefreshToken = async (
    userId: string,
    token: string,
    expiresAt: Date
): Promise<void> => {
    const tokenHash = await bcrypt.hash(token, 10);

    await RefreshToken.create({
        userId,
        tokenHash,
        expiresAt
    });
};

export const findRefreshToken = async (
    userId: string
) => {
    return RefreshToken.findOne({ userId });
};

export const deleteRefreshToken = async (
    userId: string
): Promise<void> => {
    await RefreshToken.deleteOne({ userId });
};
