import { Module } from "@nestjs/common";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Task, TaskSchema } from "src/schemas/task.schema";

@Module({
    imports: [MongooseModule.forFeature([{ schema: TaskSchema, name: Task.name }])],
    controllers: [TaskController],
    providers: [TaskService],
    exports: [],
})
export class TaskModule { }