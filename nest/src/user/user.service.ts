import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IUser } from "src/interfaces/user.interface";
import { IUserInfo } from "src/interfaces/userInfo.interface";
import { User } from "src/schemas/user.schema";
import * as bcrypt from "bcrypt"
import { IUserUpdate } from "src/interfaces/userUpdate.interface";


@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private user: Model<User>, private jwt: JwtService) { }

    async getUser(token: string): Promise<IUserInfo> {

        if (!token) {
            throw new UnauthorizedException("Token is missing")
        }

        try {
            const { _id } = this.jwt.verify(token) as { _id: string }
            const userInfo = await this.user.findById(_id)
            userInfo.password = undefined
            return userInfo as IUserInfo
        } catch (error) {
            throw new UnauthorizedException("Invalid token or expired")
        }
    }

    async login(userInputs: IUser): Promise<{ message: string, token: string }> {
        const { email, password } = userInputs

        if (!email || !password) {
            throw new BadRequestException("Please check your inputs")
        }


        if (email && password) {
            try {
                const userInfo = await this.user.findOne({ email: email });
                if (userInfo) {
                    const statusPassword = bcrypt.compareSync(password, userInfo.password)
                    if (userInfo && statusPassword) {
                        const token = this.jwt.sign({ _id: userInfo._id })
                        return { message: "Welcome" + ' ' + userInfo.first_name + ' ' + userInfo.last_name, token: token }
                    }
                    throw new NotFoundException("Wrong email or password")
                }
                throw new NotFoundException("Wrong email or password")
            } catch (error) {
                throw new NotFoundException("Wrong email or password")
            }
        }
    }

    async create(userInputs: IUser): Promise<{ message: string, token: string }> {
        const { first_name, last_name, email, password, confirm_password } = userInputs
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isEmail = emailPattern.test(email);

        if (!first_name || !last_name || !email || !password || !confirm_password) {
            throw new BadRequestException("Please check your inputs")
        }

        if (!isEmail) {
            throw new BadRequestException("Please enter a valid email")
        }

        if (password !== confirm_password) {
            throw new BadRequestException("Password not match")
        }

        if (first_name && last_name && email && isEmail && password && password === confirm_password) {
            try {
                const userInfo = await this.user.create(userInputs);
                const token = this.jwt.sign({ _id: userInfo._id })
                return { message: 'User has been created', token: token }
            } catch (error) {
                if (error.message.includes("duplicate") && error.message.includes("email")) {
                    throw new BadRequestException("Email is already used")
                }
                throw new BadRequestException(error.message)
            }
        }
    }

    async update(userInputs: IUserUpdate, token: string): Promise<{ message: string }> {
        const { first_name, last_name, email, password, new_password, confirm_new_password } = userInputs
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isEmail = emailPattern.test(email);

        if (!first_name || !last_name || !email || !password) {
            throw new BadRequestException("Please check your inputs")
        }

        if (!isEmail) {
            throw new BadRequestException("Please enter a valid email")
        }

        if (new_password && new_password !== confirm_new_password) {
            throw new BadRequestException("Password not match")
        }

        if (first_name && last_name && email && isEmail && password) {
            try {
                const { _id } = this.jwt.verify(token) as { _id: string }
                const userInfo = await this.user.findById(_id)
                if (userInfo) {
                    const statusPassword = bcrypt.compareSync(password, userInfo.password)
                    if (statusPassword) {
                        if (!new_password) {
                            await userInfo.updateOne({ ...userInputs, password: userInfo.password })
                        }
                        if (new_password) {
                            const hashPassword = await bcrypt.hash(new_password, 12)
                            await userInfo.updateOne({ ...userInputs, password: hashPassword })
                        }
                        return { message: 'User has been updated' }
                    }
                    throw new NotFoundException("Wrong email or password")
                }
                throw new NotFoundException("Wrong email or password")
            } catch (error) {
                const errorValue = error.message as string
                if (errorValue.includes('jwt must be provided')) {
                    throw new UnauthorizedException("Invalid token")
                }
                throw new NotFoundException("Wrong email or password")
            }
        }
    }

    async delete(userInputs: IUser, token: string): Promise<{ message: string }> {
        const { password } = userInputs

        if (!password) {
            throw new BadRequestException("Please check your inputs")
        }

        if (password) {
            try {
                const { _id } = this.jwt.verify(token) as { _id: string }
                const userInfo = await this.user.findById(_id)
                if (userInfo) {
                    const statusPassword = bcrypt.compareSync(password, userInfo.password)
                    if (statusPassword) {
                        await userInfo.deleteOne()
                        return { message: 'User has been deleted' }
                    }
                    throw new NotFoundException("Wrong email or password")
                }
                throw new NotFoundException("Wrong email or password")
            } catch (error) {
                console.log(error);
                throw new NotFoundException("Wrong email or password")
            }
        }
    }

}