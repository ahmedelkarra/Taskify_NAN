import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ITask } from "../interfaces/taskInfo.interface";
import { HttpClient } from "@angular/common/http";



@Injectable({
    providedIn: 'root'
})
export class TaskInfoService {
    description: any;
    constructor(private http: HttpClient) { }

    taskInfo = new BehaviorSubject<ITask[]>([])

    getTaskInfo() {
        const token = localStorage.getItem("token") as string || ""
        this.http.get("https://taskify-nest.vercel.app/api/task", { headers: { Authorization: token } })
            .subscribe({
                next: (value) => {
                    const taskInfo = value as ITask[]
                    this.taskInfo.next(taskInfo)
                },
                error: (err) => {
                    // console.error(err.message);
                    this.taskInfo.next([])
                }
            })
    }
}