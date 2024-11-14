import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { UserInfoService } from "../app/user-info.service";
import { LoginSkeletonComponent } from "../loginSkeleton/loginSkeleton.component";
import { Router } from "@angular/router";
import { MessageService } from "../message/message.service";



@Component({
    imports: [ReactiveFormsModule, LoginSkeletonComponent],
    selector: "app-login",
    standalone: true,
    templateUrl: "login.component.html",
})
export class LoginComponent implements OnInit {
    constructor(private http: HttpClient, private userInfoService: UserInfoService, private route: Router, private message: MessageService) { }

    @Input() isUser: boolean = false
    @Output() setIsUser = new EventEmitter<boolean>()

    @Input() isLoading: boolean = true
    @Output() setIsLoading = new EventEmitter<boolean>()


    @Input() formGroup = new FormGroup({
        email: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [Validators.required]),
    })

    handleSubmit() {
        const formInputs = this.formGroup.value
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmail = emailRegex.test(formInputs.email as string)

        if (!formInputs.email || !formInputs.password) {
            return this.message.handleError("Email is required")
        }

        if (!formInputs.password) {
            return this.message.handleError("Password is required")
        }

        if (!isEmail) {
            return this.message.handleError("Please enter a valid email")
        }

        this.http.post("https://taskify-nest.vercel.app/api/auth/login", this.formGroup.value).subscribe({
            next: (value) => {
                const data = value as { message: string, token: string }
                localStorage.setItem("token", data.token)
                this.message.handleSuccess(data.message)
                setTimeout(() => {
                    this.userInfoService.getInfoData()
                }, 2000)
            },
            error: (err) => {
                this.message.handleError(err?.error?.message)
                console.error(err?.error?.message);
            },
        })

    }

    ngOnInit(): void {
        this.userInfoService.isUser.subscribe((value) => {
            this.setIsUser.emit(this.isUser = value)
            if (this.isUser) {
                this.route.navigate(['/'])
            }
        })
        this.userInfoService.isLoading.subscribe((value) => {
            this.setIsLoading.emit(this.isLoading = value)
        })
    }

}