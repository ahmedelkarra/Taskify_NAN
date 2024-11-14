import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import { IUser } from "src/interfaces/user.interface";
import { IUserInfo } from "src/interfaces/userInfo.interface";
import { User } from "src/schemas/user.schema";
import { IUserUpdate } from "src/interfaces/userUpdate.interface";
export declare class UserService {
    private user;
    private jwt;
    constructor(user: Model<User>, jwt: JwtService);
    getUser(token: string): Promise<IUserInfo>;
    login(userInputs: IUser): Promise<{
        message: string;
        token: string;
    }>;
    create(userInputs: IUser): Promise<{
        message: string;
        token: string;
    }>;
    update(userInputs: IUserUpdate, token: string): Promise<{
        message: string;
    }>;
    delete(userInputs: IUser, token: string): Promise<{
        message: string;
    }>;
}
