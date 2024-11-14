import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { ITask } from "src/interfaces/task.interface";


@Schema({ timestamps: true })
export class Task implements ITask {
    @Prop({ required: true, type: String })
    title: string;

    @Prop({ required: true, type: String })
    description: string;

    @Prop({ required: true, type: Date })
    dueDate: Date;

    @Prop({ required: true, type: String })
    priority: 'low' | 'medium' | 'high';

    @Prop({ required: true, type: String })
    status: 'not started' | 'in progress' | 'completed' | 'delayed';

    @Prop({ type: Number, default: 0 })
    completionPercentage: number;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
    author_id: mongoose.Schema.Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task)