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
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const task_schema_1 = require("../schemas/task.schema");
let TaskService = class TaskService {
    constructor(taskSchema, jwt) {
        this.taskSchema = taskSchema;
        this.jwt = jwt;
    }
    async allTask(token) {
        if (!token) {
            throw new common_1.UnauthorizedException("Token is missing");
        }
        if (token) {
            try {
                const { _id } = this.jwt.verify(token);
                const taskInfo = await this.taskSchema.find({ author_id: _id });
                if (!taskInfo) {
                    throw new common_1.NotFoundException("You don't have any task to get");
                }
                return taskInfo;
            }
            catch (error) {
                console.log(error);
                if (common_1.NotFoundException) {
                    throw new common_1.NotFoundException(error.message);
                }
                if (jwt_1.JsonWebTokenError) {
                    throw new common_1.UnauthorizedException("Invalid or expired token");
                }
                throw new common_1.BadRequestException(error.message);
            }
        }
    }
    async addTask(userInputs, token) {
        const { title, description, dueDate, priority, status } = userInputs;
        if (!title || !description || !dueDate || !priority || !status) {
            throw new common_1.BadRequestException("Please check your inputs");
        }
        if (!token) {
            throw new common_1.UnauthorizedException("Token is missing");
        }
        if (token) {
            try {
                const { _id } = this.jwt.verify(token);
                await this.taskSchema.create({ ...userInputs, author_id: _id });
                return { message: 'Task has been created' };
            }
            catch (error) {
                if (jwt_1.JsonWebTokenError) {
                    throw new common_1.UnauthorizedException("Invalid or expired token");
                }
                throw new common_1.BadRequestException(error.message);
            }
        }
    }
    async updateTask(userInputs, token, id) {
        const { title, description, dueDate, priority, status } = userInputs;
        if (!title || !description || !dueDate || !priority || !status) {
            throw new common_1.BadRequestException("Please check your inputs");
        }
        if (!token) {
            throw new common_1.UnauthorizedException("Token is missing");
        }
        if (!mongoose_2.default.isValidObjectId(id)) {
            throw new common_1.NotFoundException("Task not found");
        }
        if (token) {
            try {
                const { _id } = this.jwt.verify(token);
                const taskInfo = await this.taskSchema.findOne({ _id: id, author_id: _id });
                if (!taskInfo) {
                    throw new common_1.NotFoundException("Task not found");
                }
                await taskInfo.updateOne({ ...userInputs });
                return { message: 'Task has been updated' };
            }
            catch (error) {
                if (common_1.NotFoundException) {
                    throw new common_1.NotFoundException(error.message);
                }
                if (jwt_1.JsonWebTokenError) {
                    throw new common_1.UnauthorizedException("Invalid or expired token");
                }
                throw new common_1.BadRequestException(error.message);
            }
        }
    }
    async deleteTask(token, id) {
        if (!token) {
            throw new common_1.UnauthorizedException("Token is missing");
        }
        if (!mongoose_2.default.isValidObjectId(id)) {
            throw new common_1.NotFoundException("Task not found");
        }
        if (token) {
            try {
                const { _id } = this.jwt.verify(token);
                const taskInfo = await this.taskSchema.findOne({ _id: id, author_id: _id });
                if (!taskInfo) {
                    throw new common_1.NotFoundException("Task not found");
                }
                await taskInfo.deleteOne();
                return { message: 'Task has been deleted' };
            }
            catch (error) {
                console.log(error);
                if (common_1.NotFoundException) {
                    throw new common_1.NotFoundException(error.message);
                }
                if (jwt_1.JsonWebTokenError) {
                    throw new common_1.UnauthorizedException("Invalid or expired token");
                }
                throw new common_1.BadRequestException(error.message);
            }
        }
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(task_schema_1.Task.name)),
    __metadata("design:paramtypes", [mongoose_2.Model, jwt_1.JwtService])
], TaskService);
//# sourceMappingURL=task.service.js.map