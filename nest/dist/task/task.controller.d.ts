import { TaskService } from "./task.service";
import { ITask } from "src/interfaces/task.interface";
export declare class TaskController {
    private taskService;
    constructor(taskService: TaskService);
    allTask(token: string): Promise<ITask[]>;
    addTask(userInputs: ITask, token: string): Promise<{
        message: string;
    }>;
    updateTask(param: {
        id: string;
    }, userInputs: ITask, token: string): Promise<{
        message: string;
    }>;
    deleteTask(param: {
        id: string;
    }, token: string): Promise<{
        message: string;
    }>;
}
