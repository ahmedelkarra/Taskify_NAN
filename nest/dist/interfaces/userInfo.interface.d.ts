import mongoose from "mongoose";
export interface IUserInfo {
    _id?: mongoose.Schema.Types.ObjectId;
    first_name: string;
    last_name: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}
