"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
const bcrypt = require("bcrypt");
let UserService = class UserService {
    constructor(user, jwt) {
        this.user = user;
        this.jwt = jwt;
    }
    async getUser(token) {
        if (!token) {
            throw new common_1.UnauthorizedException("Token is missing");
        }
        try {
            const { _id } = this.jwt.verify(token);
            const userInfo = await this.user.findById(_id);
            userInfo.password = undefined;
            return userInfo;
        }
        catch (error) {
            throw new common_1.UnauthorizedException("Invalid token or expired");
        }
    }
    async login(userInputs) {
        const { email, password } = userInputs;
        if (!email || !password) {
            throw new common_1.BadRequestException("Please check your inputs");
        }
        if (email && password) {
            try {
                const userInfo = await this.user.findOne({ email: email });
                if (userInfo) {
                    const statusPassword = bcrypt.compareSync(password, userInfo.password);
                    if (userInfo && statusPassword) {
                        const token = this.jwt.sign({ _id: userInfo._id });
                        return { message: "Welcome" + ' ' + userInfo.first_name + ' ' + userInfo.last_name, token: token };
                    }
                    throw new common_1.NotFoundException("Wrong email or password");
                }
                throw new common_1.NotFoundException("Wrong email or password");
            }
            catch (error) {
                throw new common_1.NotFoundException("Wrong email or password");
            }
        }
    }
    async create(userInputs) {
        const { first_name, last_name, email, password, confirm_password } = userInputs;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isEmail = emailPattern.test(email);
        if (!first_name || !last_name || !email || !password || !confirm_password) {
            throw new common_1.BadRequestException("Please check your inputs");
        }
        if (!isEmail) {
            throw new common_1.BadRequestException("Please enter a valid email");
        }
        if (password !== confirm_password) {
            throw new common_1.BadRequestException("Password not match");
        }
        if (first_name && last_name && email && isEmail && password && password === confirm_password) {
            try {
                const userInfo = await this.user.create(userInputs);
                const token = this.jwt.sign({ _id: userInfo._id });
                return { message: 'User has been created', token: token };
            }
            catch (error) {
                if (error.message.includes("duplicate") && error.message.includes("email")) {
                    throw new common_1.BadRequestException("Email is already used");
                }
                throw new common_1.BadRequestException(error.message);
            }
        }
    }
    async update(userInputs, token) {
        const { first_name, last_name, email, password, new_password, confirm_new_password } = userInputs;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isEmail = emailPattern.test(email);
        if (!first_name || !last_name || !email || !password) {
            throw new common_1.BadRequestException("Please check your inputs");
        }
        if (!isEmail) {
            throw new common_1.BadRequestException("Please enter a valid email");
        }
        if (new_password && new_password !== confirm_new_password) {
            throw new common_1.BadRequestException("Password not match");
        }
        if (first_name && last_name && email && isEmail && password) {
            try {
                const { _id } = this.jwt.verify(token);
                const userInfo = await this.user.findById(_id);
                if (userInfo) {
                    const statusPassword = bcrypt.compareSync(password, userInfo.password);
                    if (statusPassword) {
                        if (!new_password) {
                            await userInfo.updateOne({ ...userInputs, password: userInfo.password });
                        }
                        if (new_password) {
                            const hashPassword = await bcrypt.hash(new_password, 12);
                            await userInfo.updateOne({ ...userInputs, password: hashPassword });
                        }
                        return { message: 'User has been updated' };
                    }
                    throw new common_1.NotFoundException("Wrong email or password");
                }
                throw new common_1.NotFoundException("Wrong email or password");
            }
            catch (error) {
                const errorValue = error.message;
                if (errorValue.includes('jwt must be provided')) {
                    throw new common_1.UnauthorizedException("Invalid token");
                }
                throw new common_1.NotFoundException("Wrong email or password");
            }
        }
    }
    async delete(userInputs, token) {
        const { password } = userInputs;
        if (!password) {
            throw new common_1.BadRequestException("Please check your inputs");
        }
        if (password) {
            try {
                const { _id } = this.jwt.verify(token);
                const userInfo = await this.user.findById(_id);
                if (userInfo) {
                    const statusPassword = bcrypt.compareSync(password, userInfo.password);
                    if (statusPassword) {
                        await userInfo.deleteOne();
                        return { message: 'User has been deleted' };
                    }
                    throw new common_1.NotFoundException("Wrong email or password");
                }
                throw new common_1.NotFoundException("Wrong email or password");
            }
            catch (error) {
                console.log(error);
                throw new common_1.NotFoundException("Wrong email or password");
            }
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model, jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map