import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ITask } from "../interfaces/taskInfo.interface";
import { TaskInfoService } from "../app/task-info.service";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { MessageService } from "../message/message.service";
import { UserInfoService } from "../app/user-info.service";


@Component({
    imports: [RouterModule],
    templateUrl: 'task-id.component.html',
    standalone: true,
})
export class TaskIdComponent implements OnInit {
    constructor(private http: HttpClient, private route: Router, private taskInfoService: TaskInfoService, private param: ActivatedRoute, private message: MessageService, private userInfoService: UserInfoService) { }

    @Input() taskInfo?: ITask
    @Output() setTaskInfo = new EventEmitter<ITask>()

    @Input() isUser: boolean = false
    @Output() setIsUser = new EventEmitter<boolean>()

    @Input() isLoading: boolean = true
    @Output() setIsLoading = new EventEmitter<boolean>()

    id: string = ''

    handleDelete() {
        const token = localStorage.getItem("token") as string
        this.http.delete(`https://taskify-nest.vercel.app/api/task/${this.id}`, { headers: { Authorization: token } })
            .subscribe({
                next: (value) => {
                    const valueMessage = value as { message: string }
                    this.message.handleSuccess(valueMessage.message)
                    setTimeout(() => {
                        this.taskInfoService.getTaskInfo()
                        this.route.navigate(['/'])
                    }, 2000)
                    console.log(valueMessage.message);
                },
                error: (err) => {
                    this.message.handleError(err.error.message)
                    console.error(err?.error?.message);
                }
            })
    }


    ngOnInit(): void {
        this.userInfoService.isUser.subscribe((value) => {
            this.setIsUser.emit(this.isUser = value)
        })
        this.userInfoService.isLoading.subscribe((value) => {
            this.setIsLoading.emit(this.isLoading = value)
            if (!this.isLoading && !this.isUser) {
                this.route.navigate(['/login'])
            }
        })

        this.param.params.subscribe((value) => {
            const idParam = value as { id: string }
            this.id = idParam.id
            this.taskInfoService.taskInfo.subscribe({
                next: (value) => {
                    const taskFilter = value.find((ele) => ele._id == this.id) as ITask
                    this.setTaskInfo.emit(this.taskInfo = taskFilter)
                }
            })
        })

    }
}