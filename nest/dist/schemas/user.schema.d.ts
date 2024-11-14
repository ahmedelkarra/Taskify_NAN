import mongoose, { Document } from "mongoose";
import { IUser } from "src/interfaces/user.interface";
export declare class User extends Document implements IUser {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}
export declare const UserSchema: mongoose.Schema<User, mongoose.Model<User, any, any, any, mongoose.Document<unknown, any, User> & User & Required<{
    _id: unknown;
}> & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, User, mongoose.Document<unknown, {}, mongoose.FlatRecord<User>> & mongoose.FlatRecord<User> & Required<{
    _id: unknown;
}> & {
    __v?: number;
}>;
