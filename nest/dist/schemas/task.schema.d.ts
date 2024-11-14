import mongoose from "mongoose";
import { ITask } from "src/interfaces/task.interface";
export declare class Task implements ITask {
    title: string;
    description: string;
    dueDate: Date;
    priority: 'low' | 'medium' | 'high';
    status: 'not started' | 'in progress' | 'completed' | 'delayed';
    completionPercentage: number;
    author_id: mongoose.Schema.Types.ObjectId;
}
export declare const TaskSchema: mongoose.Schema<Task, mongoose.Model<Task, any, any, any, mongoose.Document<unknown, any, Task> & Task & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Task, mongoose.Document<unknown, {}, mongoose.FlatRecord<Task>> & mongoose.FlatRecord<Task> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
