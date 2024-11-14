import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TaskInfoService } from "../app/task-info.service";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ITask } from "../interfaces/taskInfo.interface";
import { MessageService } from "../message/message.service";
import { UserInfoService } from "../app/user-info.service";



@Component({
    imports: [ReactiveFormsModule],
    templateUrl: 'task-edit.component.html',
    standalone: true,
})
export class TaskEditComponent implements OnInit {
    constructor(private http: HttpClient, private route: Router, private taskInfoService: TaskInfoService, private param: ActivatedRoute, private message: MessageService, private userInfoService: UserInfoService) { }

    @Input() isUser: boolean = false
    @Output() setIsUser = new EventEmitter<boolean>()

    @Input() isLoading: boolean = true
    @Output() setIsLoading = new EventEmitter<boolean>()

    id: string = ''

    formGroup = new FormGroup({
        title: new FormControl(''),
        description: new FormControl(''),
        priority: new FormControl(''),
        status: new FormControl(''),
        dueDate: new FormControl(''),
        assignedTo: new FormControl(''),
        completionPercentage: new FormControl(0),
    })

    handleSubmit() {
        const formInputs = this.formGroup.value

        if (!formInputs.title) {
            return this.message.handleError("Title is required")
        }

        if (!formInputs.priority) {
            return this.message.handleError("Priority is required")
        }

        if (!formInputs.status) {
            return this.message.handleError("Status is required")
        }

        if (!formInputs.dueDate) {
            return this.message.handleError("Date is required")
        }

        if (!formInputs.completionPercentage) {
            return this.message.handleError("Completed is required")
        }

        if (formInputs.completionPercentage > 100) {
            return this.message.handleError("Please enter value under 100")
        }

        if (!formInputs.description) {
            return this.message.handleError("Description is required")
        }

        const token = localStorage.getItem("token") as string
        this.http.put(`https://taskify-nest.vercel.app/api/task/${this.id}`, this.formGroup.value, { headers: { Authorization: token } })
            .subscribe({
                next: (value) => {
                    const valueMessage = value as { message: string }
                    this.message.handleSuccess(valueMessage.message)
                    setTimeout(() => {
                        this.formGroup.setValue({ assignedTo: "", completionPercentage: 0, description: "", dueDate: "", priority: "", status: "", title: "" })
                        this.taskInfoService.getTaskInfo()
                        this.route.navigate(['/'])
                    }, 2000)
                    console.log(valueMessage.message);
                },
                error: (err) => {
                    this.message.handleError(err?.error?.message)
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

        this.param.params.subscribe((param) => {
            const idParam = param as { id: string }
            this.id = idParam.id
            this.taskInfoService.taskInfo.subscribe({
                next: (value) => {
                    const filterTask = value.find((ele) => ele._id == this.id) as ITask
                    if (!this.isLoading && !filterTask?._id) {
                        this.route.navigate(['/login'])
                    }
                    this.formGroup.setValue({
                        title: filterTask?.title || "",
                        assignedTo: filterTask?.assignedTo || "",
                        completionPercentage: filterTask?.completionPercentage || 0,
                        description: filterTask?.description || "",
                        dueDate: new Date().toLocaleString("en-CA", { year: 'numeric', month: 'numeric', day: "numeric" }),
                        priority: String(filterTask?.priority),
                        status: String(filterTask?.status),
                    })
                }
            })
        })

    }
}