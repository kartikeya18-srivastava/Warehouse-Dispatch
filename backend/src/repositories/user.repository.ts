import { User, IUser, IUserBase } from "../models/user.model";

export const createUser = async (
    data: Omit<IUserBase, "createdAt">
): Promise<IUser> => {
    return User.create(data);
};

export const findUserByEmail = async (
    email: string
): Promise<IUser | null> => {
    return User.findOne({ email });
};

export const findUserById = async (
    id: string
): Promise<IUser | null> => {
    return User.findById(id);
};

export const updateUserVerification = async (
    token: string,
    isVerified: boolean
): Promise<IUser | null> => {
    return User.findOneAndUpdate(
        { verificationToken: token },
        { isVerified, verificationToken: undefined },
        { new: true }
    );
};
