import { Body, Controller, Delete, Get, Headers, HttpCode, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { IUser } from "src/interfaces/user.interface";
import { IUserInfo } from "src/interfaces/userInfo.interface";
import { IUserUpdate } from "src/interfaces/userUpdate.interface";


@Controller("api/auth")
export class UserController {
    constructor(private userService: UserService) { }

    @Get('me')
    getUser(@Headers("Authorization") token: string): Promise<IUserInfo> {
        return this.userService.getUser(token)
    }

    @Post('login')
    @HttpCode(200)
    login(@Body() userInputs: IUser): Promise<{ message: string, token: string }> {
        return this.userService.login(userInputs)
    }

    @Post('register')
    create(@Body() userInputs: IUser): Promise<{ message: string, token: string }> {
        return this.userService.create(userInputs)
    }

    @Put('me')
    update(@Body() userInputs: IUserUpdate, @Headers("Authorization") token: string): Promise<{ message: string }> {
        return this.userService.update(userInputs, token)
    }

    @Delete('me')
    delete(@Body() userInputs: IUser, @Headers("Authorization") token: string): Promise<{ message: string }> {
        return this.userService.delete(userInputs, token)
    }

}