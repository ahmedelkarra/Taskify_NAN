import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MessageService } from "./message.service";


@Component({
    selector: "app-message",
    standalone: true,
    templateUrl: "message.component.html",
})
export class MessageComponent implements OnInit {
    constructor(private message: MessageService) { }

    @Input() successMessageValue: string = ""
    @Output() setSuccessMessageValue = new EventEmitter<string>()

    @Input() errorMessageValue: string = ""
    @Output() setErrorMessageValue = new EventEmitter<string>()

    @Input() warningMessageValue: string = ""
    @Output() setWarningMessageValue = new EventEmitter<string>()

    
    ngOnInit(): void {
        this.message.successMessage.subscribe({
            next: (value) => {
                this.setSuccessMessageValue.emit(this.successMessageValue = value)
            }
        })

        this.message.errorMessage.subscribe({
            next: (value) => {
                this.setErrorMessageValue.emit(this.errorMessageValue = value)
            }
        })

        this.message.warningMessage.subscribe({
            next: (value) => {
                this.setWarningMessageValue.emit(this.warningMessageValue = value)
            }
        })
    }
}