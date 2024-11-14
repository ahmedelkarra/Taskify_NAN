import { UserService } from "./user.service";
import { IUser } from "src/interfaces/user.interface";
import { IUserInfo } from "src/interfaces/userInfo.interface";
import { IUserUpdate } from "src/interfaces/userUpdate.interface";
export declare class UserController {
    private userService;
    constructor(userService: UserService);
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
