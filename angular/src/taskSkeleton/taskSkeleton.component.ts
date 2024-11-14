import { Component } from "@angular/core";


@Component({
    imports: [],
    selector: "app-taskSkeleton",
    templateUrl: 'taskSkeleton.component.html',
    standalone: true,
})
export class TaskSkeletonComponent {
    
    elements = [{}, {}, {}]
}