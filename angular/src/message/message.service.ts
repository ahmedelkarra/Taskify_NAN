import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class MessageService {
    successMessage = new BehaviorSubject<string>("")
    errorMessage = new BehaviorSubject<string>("")
    warningMessage = new BehaviorSubject<string>("")

    handleSuccess(message: string) {
        this.successMessage.next(message)
        setTimeout(() => {
            this.successMessage.next('')
        }, 2000)
    }

    handleError(message: string) {
        this.errorMessage.next(message)
        setTimeout(() => {
            this.errorMessage.next('')
        }, 2000)
    }

    handleWarning(message: string) {
        this.warningMessage.next(message)
        setTimeout(() => {
            this.warningMessage.next('')
        }, 2000)
    }
}