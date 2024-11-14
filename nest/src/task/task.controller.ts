import { Body, Controller, Delete, Get, Headers, Param, Post, Put } from "@nestjs/common";
import { TaskService } from "./task.service";
import { ITask } from "src/interfaces/task.interface";

@Controller('api/task')
export class TaskController {
    constructor(private taskService: TaskService) { }


    @Get()
    async allTask(@Headers("Authorization") token: string): Promise<ITask[]> {
        return this.taskService.allTask(token)
    }

    @Post()
    addTask(@Body() userInputs: ITask, @Headers("Authorization") token: string): Promise<{ message: string }> {
        return this.taskService.addTask(userInputs, token)
    }

    @Put(":id")
    updateTask(@Param() param: { id: string }, @Body() userInputs: ITask, @Headers("Authorization") token: string): Promise<{ message: string }> {
        const { id } = param
        return this.taskService.updateTask(userInputs, token, id)
    }

    @Delete(":id")
    deleteTask(@Param() param: { id: string }, @Headers("Authorization") token: string): Promise<{ message: string }> {
        const { id } = param
        return this.taskService.deleteTask(token, id)
    }
}