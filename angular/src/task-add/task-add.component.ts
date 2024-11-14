import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { TaskInfoService } from "../app/task-info.service";
import { MessageService } from "../message/message.service";
import { UserInfoService } from "../app/user-info.service";



@Component({
    imports: [ReactiveFormsModule],
    templateUrl: 'task-add.component.html',
    standalone: true,
})
export class TaskAddComponent implements OnInit {
    constructor(private http: HttpClient, private route: Router, private taskInfoService: TaskInfoService, private message: MessageService, private userInfoService: UserInfoService) { }

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
        this.http.post("https://taskify-nest.vercel.app/api/task", this.formGroup.value, { headers: { Authorization: token } })
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
                    this.message.handleError(err.error.message)
                    console.error(err.error.message);
                }
            })
    }

    ngOnInit(): void {
        this.userInfoService.isLoading.subscribe((value) => {
            if (!value && !this.userInfoService.isUser.value) {
                this.route.navigate(['/'])
            }
        })
    }
}