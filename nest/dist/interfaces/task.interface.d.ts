import mongoose from "mongoose";
export interface ITask {
    title: string;
    description: string;
    dueDate: Date;
    priority: 'low' | 'medium' | 'high';
    status: 'not started' | 'in progress' | 'completed' | 'delayed';
    completionPercentage: number;
    author_id: mongoose.Schema.Types.ObjectId;
}
