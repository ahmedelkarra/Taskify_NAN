import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { UserInfoService } from "../app/user-info.service";
import { IUserInfo } from "../interfaces/userInfo.interface";


@Component({
    imports: [RouterLink],
    selector: "app-header",
    templateUrl: "header.component.html",
    standalone: true,
})
export class HeaderComponent implements OnInit {
    constructor(private userInfoService: UserInfoService) { }

    @Input() userInfo: IUserInfo = { _id: "", first_name: '', last_name: '', email: '' }
    @Output() setUserInfo = new EventEmitter<IUserInfo>()

    @Input() isUser: boolean = false
    @Output() setIsUser = new EventEmitter<boolean>()

    @Input() isLoading: boolean = true
    @Output() setIsLoading = new EventEmitter<boolean>()

    @Input() showUp: boolean = false
    @Output() setShowUp = new EventEmitter<boolean>()

    @Input() menuShowUp: boolean = false
    @Output() setMenuShowUp = new EventEmitter<boolean>()

    handleShowUp() {
        this.setMenuShowUp.emit(this.menuShowUp = false)
        this.setShowUp.emit(this.showUp = !this.showUp)
    }

    handleMenuShowUp() {
        this.setShowUp.emit(this.showUp = false)
        this.setMenuShowUp.emit(this.menuShowUp = !this.menuShowUp)
    }

    handleDontShowUp() {
        this.setMenuShowUp.emit(this.menuShowUp = false)
        this.setShowUp.emit(this.showUp = false)
    }

    handleLogout() {
        localStorage.removeItem('token')
        this.setMenuShowUp.emit(this.menuShowUp = false)
        this.setShowUp.emit(this.showUp = false)
        this.userInfoService.getInfoData()
    }

    ngOnInit(): void {
        this.userInfoService.userInfo.subscribe((value) => {
            this.setUserInfo.emit(this.userInfo = value)
        })

        this.userInfoService.isUser.subscribe((value) => {
            this.setIsUser.emit(this.isUser = value)
        })
        this.userInfoService.isLoading.subscribe((value) => {
            this.setIsLoading.emit(this.isLoading = value)
        })
    }
}