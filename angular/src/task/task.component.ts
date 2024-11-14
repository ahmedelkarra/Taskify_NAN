import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ITask } from "../interfaces/taskInfo.interface";
import { TaskInfoService } from "../app/task-info.service";
import { RouterModule } from "@angular/router";
import { SectionComponent } from "../section/section.component";
import { TaskSkeletonComponent } from "../taskSkeleton/taskSkeleton.component";
import { UserInfoService } from "../app/user-info.service";



@Component({
    imports: [RouterModule, SectionComponent, TaskSkeletonComponent],
    templateUrl: 'task.component.html',
    standalone: true,
})
export class TaskComponent implements OnInit {
    constructor(private task: TaskInfoService, private userInfoService: UserInfoService) { }

    @Input() isUser: boolean = false
    @Output() setIsUser = new EventEmitter<boolean>()

    @Input() isLoading: boolean = true
    @Output() setIsLoading = new EventEmitter<boolean>()

    @Input() taskInfo: ITask[] = []
    @Output() setTaskInfo = new EventEmitter<ITask[]>()

    ngOnInit(): void {
        this.userInfoService.isUser.subscribe((value) => {
            this.setIsUser.emit(this.isUser = value)
        })
        this.userInfoService.isLoading.subscribe((value) => {
            this.setIsLoading.emit(this.isLoading = value)
        })
        this.task.taskInfo.subscribe({
            next: (value) => {
                this.setTaskInfo.emit(this.taskInfo = value)
            }
        })
    }
}