import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";


@Component({
    imports: [RouterModule],
    selector: "app-footer",
    standalone: true,
    templateUrl: "footer.component.html",
})
export class FooterComponent {
    date = new Date().getFullYear()
}