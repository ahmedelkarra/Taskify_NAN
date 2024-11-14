import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { UserInfoService } from "../app/user-info.service";

@Component({
    selector: "app-section",
    templateUrl: "section.component.html",
    standalone: true,
})
export class SectionComponent implements OnInit {
    constructor(private userInfoService: UserInfoService) { }

    @Input() isLoading: boolean = true
    @Output() setIsLoading = new EventEmitter<boolean>()

    elements = [{}, {}, {}, {}, {}, {}]


    ngOnInit(): void {
        this.userInfoService.isLoading.subscribe((value) => {
            this.setIsLoading.emit(this.isLoading = value)
        })
    }
}