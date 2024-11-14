import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { UserInfoService } from "../app/user-info.service";
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ProfileSkeletonComponent } from "../profileSkeleton/profileSkeleton.component";
import { IUserInfo } from "../interfaces/userInfo.interface";
import { MessageService } from "../message/message.service";

interface IUserForm {
    email: AbstractControl<string | null>;
    first_name: AbstractControl<string | null>;
    last_name: AbstractControl<string | null>;
    password: AbstractControl<string | null>;
    new_password: AbstractControl<string | null>;
    confirm_new_password: AbstractControl<string | null>;
}

@Component({
    imports: [ReactiveFormsModule, ProfileSkeletonComponent],
    selector: "app-profile",
    templateUrl: "profile.component.html",
    standalone: true,
})
export class ProfileComponent implements OnInit {
    constructor(private http: HttpClient, private userInfoService: UserInfoService, private route: Router, private message: MessageService) { }

    @Input() isUser: boolean = false
    @Output() setIsUser = new EventEmitter<boolean>()

    @Input() isLoading: boolean = true
    @Output() setIsLoading = new EventEmitter<boolean>()

    formGroup = new FormGroup({
        email: new FormControl<string>('', [Validators.required, Validators.email]),
        first_name: new FormControl<string>('', [Validators.required,]),
        last_name: new FormControl<string>('', [Validators.required,]),
        password: new FormControl<string>('', [Validators.required,]),
        new_password: new FormControl(''),
        confirm_new_password: new FormControl(''),
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

        if (formInputs.new_password && formInputs.new_password !== formInputs.confirm_new_password) {
            return this.message.handleError("Password not match")
        }

        if (!isEmail) {
            return this.message.handleError("Please enter a valid email")
        }

        const token = localStorage.getItem('token') as string
        this.http.put("https://taskify-nest.vercel.app/api/auth/me", this.formGroup.value, { headers: { Authorization: token } }).subscribe({
            next: (value) => {
                const data = value as { message: string }
                this.userInfoService.getInfoData()
                this.message.handleSuccess(data.message)
            },
            error: (err) => {
                this.message.handleError(err?.error?.message)
            },
        })
    }

    ngOnInit(): void {
        this.userInfoService.userInfo.subscribe((value) => {
            this.formGroup.setValue({ email: value.email, first_name: value.first_name, last_name: value.last_name, password: "", new_password: "", confirm_new_password: "" })
        })
        this.userInfoService.isUser.subscribe((value) => {            
            this.setIsUser.emit(this.isUser = value)
        })
        this.userInfoService.isLoading.subscribe((value) => {
            this.setIsLoading.emit(this.isLoading = value)
            if (!this.isUser && !this.isLoading) {
                this.route.navigate(['/'])
            }
        })
    }
}