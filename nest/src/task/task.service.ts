import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JsonWebTokenError, JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { ITask } from "src/interfaces/task.interface";
import { Task } from "src/schemas/task.schema";

@Injectable()
export class TaskService {
    constructor(@InjectModel(Task.name) private taskSchema: Model<Task>, private jwt: JwtService) { }

    async allTask(token: string): Promise<ITask[]> {

        if (!token) {
            throw new UnauthorizedException("Token is missing")
        }

        if (token) {
            try {
                const { _id } = this.jwt.verify(token) as { _id: string }
                const taskInfo = await this.taskSchema.find({ author_id: _id })
                if (!taskInfo) {
                    throw new NotFoundException("You don't have any task to get")
                }
                return taskInfo
            } catch (error) {
                console.log(error);

                if (NotFoundException) {
                    throw new NotFoundException(error.message)
                }
                if (JsonWebTokenError) {
                    throw new UnauthorizedException("Invalid or expired token")
                }
                throw new BadRequestException(error.message)
            }
        }
    }

    async addTask(userInputs: ITask, token: string): Promise<{ message: string }> {
        const { title, description, dueDate, priority, status } = userInputs

        if (!title || !description || !dueDate || !priority || !status) {
            throw new BadRequestException("Please check your inputs")
        }

        if (!token) {
            throw new UnauthorizedException("Token is missing")
        }

        if (token) {
            try {
                const { _id } = this.jwt.verify(token) as { _id: string }
                await this.taskSchema.create({ ...userInputs, author_id: _id })
                return { message: 'Task has been created' }
            } catch (error) {
                if (JsonWebTokenError) {
                    throw new UnauthorizedException("Invalid or expired token")
                }
                throw new BadRequestException(error.message)
            }
        }

    }

    async updateTask(userInputs: ITask, token: string, id: string): Promise<{ message: string }> {
        const { title, description, dueDate, priority, status } = userInputs

        if (!title || !description || !dueDate || !priority || !status) {
            throw new BadRequestException("Please check your inputs")
        }

        if (!token) {
            throw new UnauthorizedException("Token is missing")
        }

        if (!mongoose.isValidObjectId(id)) {
            throw new NotFoundException("Task not found")
        }

        if (token) {
            try {
                const { _id } = this.jwt.verify(token) as { _id: string }
                const taskInfo = await this.taskSchema.findOne({ _id: id, author_id: _id })
                if (!taskInfo) {
                    throw new NotFoundException("Task not found")
                }
                await taskInfo.updateOne({ ...userInputs })
                return { message: 'Task has been updated' }
            } catch (error) {
                if (NotFoundException) {
                    throw new NotFoundException(error.message)
                }
                if (JsonWebTokenError) {
                    throw new UnauthorizedException("Invalid or expired token")
                }
                throw new BadRequestException(error.message)
            }
        }
    }

    async deleteTask(token: string, id: string): Promise<{ message: string }> {

        if (!token) {
            throw new UnauthorizedException("Token is missing")
        }

        if (!mongoose.isValidObjectId(id)) {
            throw new NotFoundException("Task not found")
        }

        if (token) {
            try {
                const { _id } = this.jwt.verify(token) as { _id: string }
                const taskInfo = await this.taskSchema.findOne({ _id: id, author_id: _id })
                if (!taskInfo) {
                    throw new NotFoundException("Task not found")
                }
                await taskInfo.deleteOne()
                return { message: 'Task has been deleted' }
            } catch (error) {
                console.log(error);

                if (NotFoundException) {
                    throw new NotFoundException(error.message)
                }
                if (JsonWebTokenError) {
                    throw new UnauthorizedException("Invalid or expired token")
                }
                throw new BadRequestException(error.message)
            }
        }
    }
}