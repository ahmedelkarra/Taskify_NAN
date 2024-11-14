import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { UserInfoService } from "../app/user-info.service";
import { AppComponent } from "../app/app.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { RegisterSkeletonComponent } from "../registerSkeleton/registerSkeleton.component";
import { Router } from "@angular/router";
import { MessageService } from "../message/message.service";



@Component({
    imports: [ReactiveFormsModule, RegisterSkeletonComponent],
    selector: "app-register",
    templateUrl: "register.component.html",
    standalone: true,
})
export class RegisterComponent implements OnInit {
    constructor(private http: HttpClient, private userInfoService: UserInfoService, private route: Router, private message: MessageService) { }

    @Input() isUser: boolean = false
    @Output() setIsUser = new EventEmitter<boolean>()

    @Input() isLoading: boolean = true
    @Output() setIsLoading = new EventEmitter<boolean>()

    @Input() formGroup = new FormGroup({
        email: new FormControl('', { nonNullable: false }),
        first_name: new FormControl('', { nonNullable: false }),
        last_name: new FormControl('', { nonNullable: false }),
        password: new FormControl('', { nonNullable: false }),
        confirm_password: new FormControl('', { nonNullable: false }),
    })

    handleSubmit() {
        const formInputs = this.formGroup.value
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmail = emailRegex.test(formInputs.email as string)

        if (!formInputs.email) {
            return this.message.handleError("Email is required")
        }

        if (!formInputs.first_name) {
            return this.message.handleError("First name is required")
        }

        if (!formInputs.last_name) {
            return this.message.handleError("Last name is required")
        }

        if (!formInputs.password) {
            return this.message.handleError("Password is required")
        }

        if (!formInputs.confirm_password) {
            return this.message.handleError("Confirm password is required")
        }

        if (formInputs.password !== formInputs.confirm_password) {
            return this.message.handleError("Password not match")
        }

        if (!isEmail) {
            return this.message.handleError("Please enter a valid email")
        }

        this.http.post("https://taskify-nest.vercel.app/api/auth/register", this.formGroup.value).subscribe({
            next: (value) => {
                const data = value as { message: string, token: string }
                localStorage.setItem("token", data.token)
                this.message.handleSuccess(data.message)
                setTimeout(() => {
                    this.userInfoService.getInfoData()
                }, 2000)
                console.log(value);
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