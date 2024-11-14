import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import { ITask } from "src/interfaces/task.interface";
import { Task } from "src/schemas/task.schema";
export declare class TaskService {
    private taskSchema;
    private jwt;
    constructor(taskSchema: Model<Task>, jwt: JwtService);
    allTask(token: string): Promise<ITask[]>;
    addTask(userInputs: ITask, token: string): Promise<{
        message: string;
    }>;
    updateTask(userInputs: ITask, token: string, id: string): Promise<{
        message: string;
    }>;
    deleteTask(token: string, id: string): Promise<{
        message: string;
    }>;
}
